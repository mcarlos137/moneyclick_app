//PRINCIPAL
import React, { useEffect } from 'react';
import { Dimensions, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { StackActions } from '@react-navigation/native';
import { compose } from 'redux'
//COMPONENTS
import View_Payment from './components/View_Payment'
//FUNCTIONS
import { decorateTimestamp } from '../../main/functions';
import { withColors } from '../../main/hoc';

const FiatBankDepositsDetailsScreen = ({ navigation, route, colors }) => {

  //EFFECTS
  useEffect(() => {
    console.log('FiatBankDepositsDetailsScreen', route.params)
  }, []);

  //PRINCIPAL RENDER
  return (
    <>
      <View
        style={{
          alignSelf: 'center',
          width: Dimensions.get('window').width * 0.9,
          marginTop: 20
        }}>
        <View
          style={{
            flexDirection: 'row',
          }}
        >
          <Text
            style={{
              flex: 0.4,
              fontWeight: 'bold',
              color: colors.text
            }}
          >
            Date:
          </Text>
          <Text
            style={{
              flex: 0.6,
              color: colors.text
            }}
          >
            {decorateTimestamp(route.params.selectedFiatBankDeposit.timestamp)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 5
          }}
        >
          <Text
            style={{
              flex: 0.4,
              fontWeight: 'bold',
              color: colors.text
            }}
          >
            Id:
          </Text>
          <Text
            style={{
              flex: 0.6,
              color: colors.text
            }}
          >
            {route.params.selectedFiatBankDeposit.id.slice(route.params.selectedFiatBankDeposit.id.length - 5, route.params.selectedFiatBankDeposit.id.length - 1)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 5
          }}
        >
          <Text
            style={{
              flex: 0.4,
              fontWeight: 'bold',
              color: colors.text
            }}
          >
            Currency:
          </Text>
          <Text
            style={{
              flex: 0.6,
              color: colors.text
            }}
          >
            {route.params.selectedFiatBankDeposit.currency}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 5
          }}
        >
          <Text
            style={{
              flex: 0.4,
              fontWeight: 'bold',
              color: colors.text
            }}
          >
            Amount:
          </Text>
          <Text
            style={{
              flex: 0.6,
              color: colors.text
            }}
          >
            {route.params.selectedFiatBankDeposit.amount}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 5
          }}
        >
          <Text
            style={{
              flex: 0.4,
              fontWeight: 'bold',
              color: colors.text
            }}
          >
            Operation status:
          </Text>
          <Text
            style={{
              flex: 0.6,
              color: colors.text
            }}
          >
            {route.params.selectedFiatBankDeposit.otcOperationStatus}
          </Text>
        </View>
        {route.params.selectedFiatBankDeposit.minutesLeft &&
          <View
            style={{
              flexDirection: 'row',
              marginTop: 5
            }}
          >
            <Text
              style={{
                flex: 0.4,
                fontWeight: 'bold',
                color: colors.text
              }}
            >
              Time left to pay:
            </Text>
            <Text
              style={{
                flex: 0.6,
                color: colors.text
              }}
            >
              {route.params.selectedFiatBankDeposit.minutesLeft} minutes
            </Text>
          </View>}
        {route.params.selectedFiatBankDeposit.charges !== undefined && route.params.selectedFiatBankDeposit.charges.COMMISSION !== undefined &&
          <View
            style={{
              flexDirection: 'row',
              marginTop: 5
            }}
          >
            <Text
              style={{
                flex: 0.4,
                fontWeight: 'bold',
                color: colors.text
              }}
            >
              Commission:
            </Text>
            <Text
              style={{
                flex: 0.6,
                color: colors.text
              }}
            >
              {route.params.selectedFiatBankDeposit.charges.COMMISSION.amount} {route.params.selectedFiatBankDeposit.charges.COMMISSION.currency}
            </Text>
          </View>}
        {route.params.selectedFiatBankDeposit.otcOperationStatus === 'WAITING_FOR_PAYMENT' &&
          <TouchableOpacity
            style={{
              backgroundColor: colors.getRandomMain(),
              marginTop: 20,
              width: Dimensions.get('window').width * 0.9,
              alignSelf: 'center',
              borderRadius: 10
            }}
            onPress={() => {
              navigation.dispatch(StackActions.push('FiatBankDepositsPayScreen', { ...route.params }))
            }}
          >
            <Text
              style={{
                alignSelf: 'center',
                color: 'white',
                padding: 10
              }}
            >
              PAY
            </Text>
          </TouchableOpacity>}
        {route.params.selectedFiatBankDeposit.otcOperationStatus === 'CANCELED' || route.params.selectedFiatBankDeposit.otcOperationStatus === 'SUCCESS' &&
          <TouchableOpacity
            style={{
              backgroundColor: colors.getRandomMain(),
              marginTop: 20,
              width: Dimensions.get('window').width * 0.9,
              alignSelf: 'center',
              borderRadius: 10
            }}
            onPress={() => {

            }}
          >
            <Text
              style={{
                alignSelf: 'center',
                color: 'white',
                padding: 10
              }}
            >
              CLAIM
            </Text>
          </TouchableOpacity>}
      </View >
      <ScrollView>
        <Text
          style={{
            fontWeight: 'bold',
            width: Dimensions.get('window').width * 0.9,
            color: colors.text,
            alignSelf: 'center',
            marginTop: 20
          }}
        >
          Deposit exact amount to:
        </Text>
        <View_Payment selectedPayment={route.params.selectedFiatBankDeposit.dollarBTCPayment} />
        {route.params.selectedFiatBankDeposit.clientPayment !== undefined && JSON.stringify(route.params.selectedFiatBankDeposit.clientPayment) !== JSON.stringify({}) &&
          <>
            <Text
              style={{
                fontWeight: 'bold',
                color: colors.text,
                width: Dimensions.get('window').width * 0.9,
                alignSelf: 'center',
                marginTop: 20
              }}
            >
              Deposit only accepted from you account:
            </Text>
            <View_Payment selectedPayment={route.params.selectedFiatBankDeposit.clientPayment} />
          </>}
        <View
          style={{
            height: 20
          }}
        />
      </ScrollView>
    </>
  );
};

export default React.memo(compose(withColors)(FiatBankDepositsDetailsScreen));

