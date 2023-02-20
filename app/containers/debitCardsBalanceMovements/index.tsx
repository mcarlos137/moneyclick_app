//PRINCIPAL
import React, { useEffect } from 'react';
import { Dimensions, Text, TouchableOpacity, View, } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { NumericFormat } from 'react-number-format';
import { StackActions } from '@react-navigation/native';
//HOOKS
import { getDebitCardBalanceMovements } from './hooks/getDebitCardBalanceMovements';
//COMPONENTS
import BodyList from '../../main/components/BodyList';
//FUNCTIONS
import { decorateTimestamp, getIconName } from '../../main/functions';
//HOC
import { withColors } from '../../main/hoc';

const DebitCardsBalanceMovementsScreen = ({ navigation, route, colors }) => {

  //HOOKS CALLS
  const { isLoading: isLoadingDebitCardBalanceMovements, data: dataDebitCardBalanceMovements, error: errorDebitCardBalanceMovements, isFetching: isFetchingDebitCardBalanceMovements } =
    getDebitCardBalanceMovements(route.params.selectedDebitCard.id, null, null)

  //EFFECTS
  useEffect(() => {
    console.log('DebitCardsBalanceMovementsScreen', route.params)
  }, []);

  //COMPONENTS
  const renderItem = (item) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.dispatch(StackActions.push('DebitCardsBalanceMovementDetailsScreen', { ...route.params, selectedDebitCardBalanceMovement: item.item.parts }))
        }}
      >
        <View
          style={{
            borderBottomColor: colors.getRandomMain(),
            borderBottomWidth: 1,
            paddingBottom: 12,
            paddingTop: 10,
            width: Dimensions.get('window').width * 0.95,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              paddingTop: 5
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignContent: 'center',
                alignItems: 'center',
                alignSelf: 'flex-start',
                flex: 1,
              }}
            >
              <View
                style={{
                  marginRight: 7
                }}
              >
                <MaterialCommunityIcons
                  name={getIconName(item.item.parts[0].balanceOperationType)}
                  color={colors.icon}
                  size={35}
                />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width * 0.06,
                    color: colors.text,
                    fontWeight: "bold",
                  }}
                >
                  {item.item.parts.length === 2
                    ? ' ' + item.item.parts[0].currency + ' -> ' + item.item.parts[1].currency
                    : ' ' + item.item.parts[0].currency
                  }
                </Text>
                <Text
                  style={[{
                    fontSize: 10,
                    color: colors.text,
                    paddingLeft: 7,
                  }]}
                >
                  {decorateTimestamp(item.item.parts[0].timestamp)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'flex-end',
                  flex: 1,
                  paddingRight: 4,
                  paddingBottom: 6
                }}>
                <NumericFormat
                  value={item.item.parts[item.item.parts.length === 2 ? 1 : 0].amount}
                  displayType={'text'}
                  thousandSeparator={true}
                  decimalScale={
                    item.item.parts[item.item.parts.length === 2 ? 1 : 0].currency === 'BTC' ||
                      item.item.parts[item.item.parts.length === 2 ? 1 : 0].currency === 'ETH'
                      ? 8 : 2
                  }
                  renderText={(value) => (
                    <Text
                      style={{
                        color: item.item.parts[item.item.parts.length === 2 ? 1 : 0].operationType === 'ADD' ? 'green' : 'red',
                        fontWeight: 'bold',
                        fontSize: Dimensions.get('window').width * 0.06
                      }}
                    >
                      {value}
                    </Text>
                  )}
                />
              </View>
              {item.item.parts[0].balanceOperationStatus === 'PROCESSING' &&
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    marginLeft: 5,
                    marginTop: 4,
                  }}
                >
                  <FontAwesome
                    name="clock-o"
                    color={'#055986'}
                    size={22}
                  />
                </View>}
              {item.item.parts[0].balanceOperationStatus === 'OK' &&
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    marginLeft: 5,
                    marginTop: 4,
                  }}
                >
                  <FontAwesome
                    name="check-circle"
                    color={'green'}
                    size={22}
                  />
                </View>}
              {item.item.parts[0].balanceOperationStatus === 'FAIL' &&
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    marginLeft: 5,
                    marginTop: 4,
                  }}
                >
                  <FontAwesome
                    name="times-circle"
                    color={'red'}
                    size={22}
                  />
                </View>}
            </View>
          </View>
        </View>
      </TouchableOpacity >
    )
  }

  //PRINCIPAL RENDER
  return (
    <>
      <BodyList
        data={dataDebitCardBalanceMovements}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        refreshing={isLoadingDebitCardBalanceMovements || isFetchingDebitCardBalanceMovements}
        onRefresh={() => {
          //refetchDebitCards()
        }}
        instructions={[]}
      />
    </>
  );
};

export default React.memo(withColors(DebitCardsBalanceMovementsScreen));
