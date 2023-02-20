//PRINCIPAL
import React, { createRef, useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Text,
  Button,
  View
} from 'react-native';
import { compose } from 'redux'
import { Avatar } from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StackActions } from '@react-navigation/native';
import { NumericFormat } from 'react-number-format';
//CONSTANTS
import { currencies as currenciesParams } from '../../constants/currenciesParams';
//HOOKS
import { getDeposits } from './hooks/getDeposits';
import { changeDepositStatus } from '../../main/hooks/changeDepositStatus';
//FUNCTIONS
import { decorateTimestamp, getRequire } from '../../main/functions';
//COMPONENTS
import ActionSheetConfirmation from '../../main/components/ActionSheetConfirmation'
import Body_Input from '../../main/components/Body_Input'
//HOC
import { withColors, withUserName } from '../../main/hoc';

const FiatBankDepositsScreen = ({ navigation, route, colors, userName }) => {

  //INITIAL STATES
  const [actionSheetConfirmationCancelRef, setActionSheetConfirmationCancelRef] = useState<any>(createRef())
  const [selectedDeposit, setSelectedDeposit] = useState<any>(null)
  const [cancelReason, setCancelReason] = useState<any>('')

  //HOOKS CALLS
  const { isLoading: isLoadingDeposits, data: dataDeposits, error: errorDeposits, isFetching: isFetchingDeposits, refetch: refetchDeposits } =
    getDeposits(
      userName,
      null,
      null,
      null,
      null,
      null
    )

  const { mutate: mutateChangeDepositStatusCanceled, isLoading: isLoadingChangeDepositStatusCanceled } =
    changeDepositStatus()

  //EFFECTS
  useEffect(() => {
    console.log('FiatBankDepositsScreen', route.params)
  }, []);

  //COMPONENTS
  const renderItem = (item, actionSheetConfirmationCancelRef) => (
    <View
      key={item.index}
      style={{
        padding: 10,
        marginBottom: 10,
        backgroundColor: colors.primaryBackground,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          flex: 0.2,
          alignItems: 'center',
          marginRight: 10
        }}
      >
        <Avatar
          size={'medium'}
          rounded
          source={getRequire(currenciesParams[item.item.currency].img)}
        />
      </View>
      <View
        style={{
          flex: 0.8,
        }}
      >
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
        >
          <Text
            style={{
              marginRight: 5,
              fontSize: 11,
              color: colors.text
            }}
          >
            {decorateTimestamp(item.item.timestamp)}
          </Text>
          <NumericFormat
            value={item.item.amount}
            displayType={'text'}
            thousandSeparator={true}
            decimalScale={2}
            renderText={(value) => (
              <Text
                style={{
                  color: colors.text,
                  marginLeft: 10,
                  fontWeight: 'bold',
                }}
              >
                {value} {item.item.currency}
              </Text>
            )}
          />
        </View>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 5
          }}
        >
          <Text
            style={{
              marginRight: 5,
              color: colors.text
            }}
          >
            {item.item.otcOperationStatus}
          </Text>
          {item.item.otcOperationStatus === 'WAITING_FOR_PAYMENT' &&
            <>
              <TouchableOpacity
                onPress={() => {
                  navigation.dispatch(StackActions.push('FiatBankDepositsPayScreen', { ...route.params, selectedFiatBankDeposit: item.item }))
                }}
                style={{
                  backgroundColor: colors.getRandomMain(),
                  alignItems: 'center',
                  borderRadius: 5,
                  padding: 5,
                  marginRight: 5
                }}
              >
                <Text
                  style={{
                    color: 'white'
                  }}
                >
                  PAY
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSelectedDeposit(item.item)
                  actionSheetConfirmationCancelRef.current?.setModalVisible(true);
                }}
                style={{
                  backgroundColor: colors.getRandomMain(),
                  alignItems: 'center',
                  borderRadius: 5,
                  padding: 5,
                }}
              >
                <Text
                  style={{
                    color: 'white'
                  }}
                >
                  CANCEL
                </Text>
              </TouchableOpacity>
            </>}
        </View>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 5
          }}
        >
          <TouchableOpacity
            onPress={() => {
              //item.item.clientPayment = { bank: 'PROVINCIAL', accountType: 'Ahorro', accountNumber: '2342342342342423', accountHolderName: 'Carlos Daniel Molina', accountHolderId: '15230775' }
              navigation.dispatch(StackActions.push('FiatBankDepositsDetailsScreen', { ...route.params, selectedFiatBankDeposit: item.item }))
            }}
            style={{
              padding: 5,
              borderWidth: 1,
              borderRadius: 5,
              borderColor: colors.border,
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontWeight: 'bold',
              }}
            >
              see details
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              //navigation.dispatch(StackActions.push('ChatRoomScreen', { ...route.params, selectedChatRoom: getAdminChatRoom(item.item.id), selectedPhone: {} }))
            }}
            style={{
              marginLeft: 7,
              alignItems: 'center',
              padding: 10,
            }}
          >
            <Ionicons
              name="ios-people"
              color={colors.icon}
              size={25}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  //PRINCIPAL RENDER
  return (
    <View
      style={{
        flex: 1,
        width: Dimensions.get('window').width * 0.95,
        alignSelf: 'center',
        marginTop: 10,
        backgroundColor: colors.background
      }}
    >
      <FlatList
        data={dataDeposits}
        renderItem={(item) => (renderItem(item, actionSheetConfirmationCancelRef))}
        keyExtractor={item => String(item.timestamp)}
        removeClippedSubviews={true}
        maxToRenderPerBatch={13}
        windowSize={13}
        initialNumToRender={8}
        //getItemLayout={getItemLayout}
        style={{

        }}
        updateCellsBatchingPeriod={100}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingDeposits || isFetchingDeposits}
            onRefresh={() => {
              refetchDeposits()
            }}
            tintColor={colors.getRandomMain()}
            colors={[colors.getRandomMain()]}
          />
        }
      />
      <ActionSheetConfirmation
        reference={actionSheetConfirmationCancelRef}
        height={130}
        confirmationMessage={'Do you want to CANCEL this Deposit?'}
        additionalInput={
          <Body_Input
            value={cancelReason}
            type={'text'}
            placeholder={'Cancel reason'}
            onChangeText={text => setCancelReason(text)}
          />
        }
        onPress={() => {
          mutateChangeDepositStatusCanceled({
            id: selectedDeposit?.id,
            otcOperationStatus: 'CANCELED',
            canceledReason: cancelReason
          })
          actionSheetConfirmationCancelRef.current?.setModalVisible(false)
        }}
      />
    </View>
  );
};

export default React.memo(compose(withColors, withUserName)(FiatBankDepositsScreen));

