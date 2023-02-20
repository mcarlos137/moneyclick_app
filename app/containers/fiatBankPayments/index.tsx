//PRINCIPAL
import React, { useEffect, useState, Fragment, useRef, useCallback } from 'react';
import { Dimensions, RefreshControl, ScrollView, Text, View, TouchableOpacity, Animated, Alert } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { compose } from 'redux'
//HOOKS
import { getPayments } from '../../main/hooks/getPayments';
import { getFinancialTypes } from '../fiatBankTransfers/hooks/getFinancialTypes';
import { addPayment } from '../../main/hooks/addPayment';
import { removePayment } from '../../main/hooks/removePayment';
//HOC
import { withColors, withConfig, withUserName } from '../../main/hoc';
//COMPONENTS
import Body_Payment from '../../main/components/Body_Payment'
import Body_Picker from '../../main/components/Body_Picker';
import Body_Button from '../../main/components/Body_Button';
import Body_InputsNewPayment from './components/Body_InputsNewPayment';

const FiatBankPaymentsScreen = ({ navigation, route, colors, userName, config }) => {

  //INITIAL STATES
  const [activeSections, setActiveSections] = useState([0, 1])
  const [addNew, setAddNew] = useState(false)
  const [newPayment, setNewPayment] = useState({})
  const [financialType, setFinancialType] = useState<any>(null)
  const [allowedOwnership, setAllowedOwnership] = useState('own')
  const translation = useRef(new Animated.Value(0)).current;

  //HOOKS CALLS
  const { isLoading: isLoadingPayments, data: dataPayments, error: errorPayments } =
    getPayments(userName, route?.params?.selectedCurrency?.value)

  const { isLoading: isLoadingFinancialTypes, data: dataFinancialTypes, error: errorFinancialTypes, refetch: refetchFinancialTypes } =
    getFinancialTypes(route?.params?.selectedCurrency?.value)

  const { mutate: mutateAddPayment, data: dataAddPayment, isLoading: isLoadingAddPayment } =
    addPayment()

  const { mutate: mutateRemovePayment, data: dataRemovePayment, isLoading: isLoadingRemovePayment } =
    removePayment()

  //EFFECTS
  useEffect(() => {
    console.log('FiatBankPaymentsScreen', route.params)
    refetchFinancialTypes()
  }, []);

  useEffect(() => {
    if (addNew) {
      Animated.timing(translation, {
        toValue: -Dimensions.get('window').width,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [addNew])

  useEffect(() => {
    if (dataFinancialTypes?.length > 0) {
      setFinancialType(dataFinancialTypes[0])
    }
  }, [dataFinancialTypes])

  useEffect(() => {
    const newPayment = {}
    financialType?.fields?.map((value, key) => {
      if (value.values !== undefined) {
        newPayment[value.name] = value.values[0]
      }
    })
    if (allowedOwnership === 'own') {
      newPayment['accountHolderName'] = config.firstName + ' ' + config.lastName
      newPayment['own'] = true
    }
    setNewPayment(newPayment)
  }, [financialType, allowedOwnership])

  useEffect(() => {
    console.log('dataAddPayment', dataAddPayment)
    if (dataAddPayment?.data !== undefined) {
      if (dataAddPayment.data.length === 32) {
        setAddNew(false)
        setNewPayment({})
      }
    }
  }, [dataAddPayment])

  //CALLBACKS
  const onValueChangeFinancialType = useCallback((item) => setFinancialType(item), [])

  const onValueChangeAllowedOwnership = useCallback((item) => setAllowedOwnership(item), [])

  const addToNewPayment = useCallback(({ key, value }) => {
    setNewPayment({
      ...newPayment,
      [key]: value
    })
  }, [newPayment])

  const onPressAdd = () => {
    const notFoundObligatoryItem = financialType?.fields?.find(item => item.obligatory && newPayment[item.name] === undefined)
    console.log('newPayment', newPayment)
    if (notFoundObligatoryItem !== undefined) {
      Alert.alert(
        "Operation Error",
        "Yo need to enter a valid " + notFoundObligatoryItem.name +
        " to complete operation.",
        [{ text: "Ok" }]
      );
      return
    }
    mutateAddPayment({
      userName: userName,
      currency: route.params.selectedCurrency.value,
      payment: newPayment
    })

  }
  //COMPONENTS
  const renderHeader = (title, expanded) => (
    <View
      style={{
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center'
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          padding: 15,
          justifyContent: 'space-between',
          alignItems: 'center',
          flex: 1,
          borderRadius: 10,
          marginRight: 10,
          backgroundColor: colors.primaryBackground
        }}
      >
        <Text
          style={{
            color: colors.text,
            fontWeight: 'bold'
          }}
        >
          {title}
        </Text>
        {
          expanded ? (
            <MaterialCommunityIcons
              name="chevron-up"
              color={colors.icon}
              size={18}
            />
          ) : (
            <MaterialCommunityIcons
              name="chevron-down"
              color={colors.icon}
              size={18}
            />
          )
        }
      </View >
      <TouchableOpacity
        onPress={() => {
          setAddNew(true)
        }}
      >
        <Ionicons
          name={'ios-add'}
          size={26}
          color={colors.icon}
        />
      </TouchableOpacity>
    </View>
  )

  const renderContent = (section) => {
    return (
      <ScrollView>
        {section.data.map((item, index) => {
          return (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <View
                style={{
                  flex: 1
                }}
              >
                <Body_Payment
                  item={item}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    'Remove payment',
                    'Are you sure to remove selected payment?',
                    [
                      { text: "No", style: 'cancel', onPress: () => { } },
                      {
                        text: 'Yes',
                        style: 'destructive',
                        onPress: () => {
                          mutateRemovePayment({
                            userName: userName,
                            currency: item.currency,
                            id: item.id,
                          })
                        },
                      },
                    ]
                  );
                }}
              >
                <MaterialCommunityIcons
                  name={'delete'}
                  color={colors.icon}
                  size={26}
                />
              </TouchableOpacity>
            </View>
          )
        })}
      </ScrollView>
    )
  }

  return (
    <Animated.View
      style={{
        flexDirection: 'row',
        height: Dimensions.get('window').height,
        transform: [
          { translateX: translation },
        ],
      }}
    >
      <View
        style={{
          width: Dimensions.get('window').width,
        }}
      >
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => {

              }}
              tintColor={colors.getRandomMain()}
              colors={[colors.getRandomMain()]}
            />
          }
          style={{
            marginTop: 20,
            width: Dimensions.get('window').width * 0.9,
            alignSelf: 'center',
          }}>
          <Accordion
            sections={dataPayments}
            activeSections={activeSections}
            underlayColor={'transparent'}
            renderHeader={(section, i, isActive, sections) => (renderHeader(section.title, isActive))}
            renderContent={renderContent}
            onChange={(activeSects) => {
              setActiveSections(activeSects)
            }}
          />
        </ScrollView>
      </View>
      <View
        style={{
          width: Dimensions.get('window').width,
          alignItems: 'center',
        }}
      >
        <ScrollView
          style={{
            marginTop: 10
          }}
        >
          {dataFinancialTypes?.length > 0 &&
            <View
              style={{ width: Dimensions.get('window').width * 0.9 }}
            >
              {/* SHOW PICKERS */}
              <Body_Picker
                selectedValue={financialType !== null ? dataFinancialTypes.find(finType => finType.name === financialType.name) : dataFinancialTypes[0]}
                values={dataFinancialTypes}
                onValueChange={onValueChangeFinancialType}
                labelField={'name'}
              />
              {financialType !== null &&
                <Body_Picker
                  selectedValue={allowedOwnership}
                  values={financialType?.allowedOwnerships}
                  onValueChange={onValueChangeAllowedOwnership}
                  marginTop={10}
                />
              }
              {/* SHOW INPUTS */}
              {financialType?.fields?.length > 0 &&
                <Body_InputsNewPayment
                  financialType={financialType}
                  allowedOwnership={allowedOwnership}
                  payment={newPayment}
                  firstName={config.firstName}
                  lastName={config.lastName}
                  addToPayment={addToNewPayment}
                />
              }
              <Body_Button
                onPress={onPressAdd}
                label={'ADD'}
                isLoading={isLoadingAddPayment}
              />
            </View>
          }
        </ScrollView>
      </View>
    </Animated.View>
  );
};

export default React.memo(compose(withColors, withUserName, withConfig)(FiatBankPaymentsScreen));

