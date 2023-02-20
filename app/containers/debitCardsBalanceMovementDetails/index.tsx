import React from 'react';
import { View, Text } from 'react-native';
import { NumericFormat } from 'react-number-format';
//FUNCTIONS
import { decorateTimestamp } from '../../main/functions'
//HOC
import { withColors } from '../../main/hoc';
import { getBalanceOperationStatusName, getBalanceOperationTypeName, getCharges, getDescription, getOperationId, getReceiverUserName, getTargetAddress } from './actions/functions';

const DebitCardsBalanceMovementDetailsScreen = ({ navigation, route, colors }) => {

  return (
    <View
      style={{
        marginTop: 40,
        alignItems: 'center',
        backgroundColor: colors.primaryBackground,
        alignSelf: 'center',
        padding: 40,
        borderRadius: 10
      }}>
      <Text
        style={{
          color: colors.text,
          fontSize: 20
        }}>
        This operation is found
      </Text>
      <Text
        style={{
          color: colors.text,
          fontWeight: 'bold',
          fontSize: 20
        }}>
        {getBalanceOperationStatusName(route.params.selectedDebitCardBalanceMovement)}
      </Text>
      <View
        style={{
          marginTop: 60,
          flexDirection: 'row',
        }}>
        <Text
          style={{
            color: colors.text,
            fontWeight: 'bold'
          }}>
          Date:
        </Text>
        <Text
          style={{
            color: colors.text,
          }}>
          {decorateTimestamp(route.params.selectedDebitCardBalanceMovement[0].timestamp)}
        </Text>
      </View>
      <View
        style={{
          marginTop: 10,
          flexDirection: 'row',
        }}>
        <Text
          style={{
            color: colors.text,
            fontWeight: 'bold',
            marginRight: 10
          }}>
          Operation type:
        </Text>
        <Text
          style={{
            color: colors.text,
          }}>
          {getBalanceOperationTypeName(route.params.selectedDebitCardBalanceMovement[0].balanceOperationType)}
        </Text>
      </View>
      {route.params.selectedDebitCardBalanceMovement.length === 2
        ?
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
          }}>
          <Text
            style={{
              color: colors.text,
              fontWeight: 'bold',
              marginRight: 10
            }}>
            Amount:
          </Text>
          <NumericFormat
            value={route.params.selectedDebitCardBalanceMovement[0].initialAmount}
            displayType={'text'}
            thousandSeparator={true}
            decimalScale={
              route.params.selectedDebitCardBalanceMovement[0].currency === 'BTC' ||
                route.params.selectedDebitCardBalanceMovement[0].currency === 'ETH'
                ? 8
                : 2
            }
            renderText={(value) => (
              <Text
                style={{
                  color: route.params.selectedDebitCardBalanceMovement[0].operationType === 'ADD' ? 'green' : 'red'
                }} >
                {value + ' ' + route.params.selectedDebitCardBalanceMovement[0].currency + ''}
              </Text>
            )}
          />
          <Text
            style={{
              color: colors.text,
            }}
          >
            {' -> '}
          </Text>
          <NumericFormat
            value={route.params.selectedDebitCardBalanceMovement[1].initialAmount}
            displayType={'text'}
            thousandSeparator={true}
            decimalScale={
              route.params.selectedDebitCardBalanceMovement[1].currency === 'BTC' ||
                route.params.selectedDebitCardBalanceMovement[1].currency === 'ETH'
                ? 8
                : 2
            }
            renderText={(value) => (
              <Text
                style={{
                  color: route.params.selectedDebitCardBalanceMovement[1].operationType === 'ADD' ? 'green' : 'red'
                }} >
                {value + ' ' + route.params.selectedDebitCardBalanceMovement[1].currency + ''}
              </Text>
            )}
          />
        </View>
        :
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
          }}>
          <Text
            style={{
              color: colors.text,
              fontWeight: 'bold',
              marginRight: 10
            }}>
            Amount:
          </Text>
          <NumericFormat
            value={route.params.selectedDebitCardBalanceMovement[0].initialAmount}
            displayType={'text'}
            thousandSeparator={true}
            decimalScale={
              route.params.selectedDebitCardBalanceMovement[0].currency === 'BTC' ||
                route.params.selectedDebitCardBalanceMovement[0].currency === 'ETH'
                ? 8
                : 2
            }
            renderText={(value) => (
              <Text
                style={{
                  color: route.params.selectedDebitCardBalanceMovement[0].operationType === 'ADD' ? 'green' : 'red'
                }} >
                {value + ' ' + route.params.selectedDebitCardBalanceMovement[0].currency + ''}
              </Text>
            )}
          />
        </View>}
      {getCharges(route.params.selectedDebitCardBalanceMovement).amount !== 0 &&
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row'
          }}>
          <Text
            style={{
              color: colors.text,
              fontWeight: 'bold',
              marginRight: 10
            }}>
            Commission:
          </Text>
          <NumericFormat
            value={getCharges(route.params.selectedDebitCardBalanceMovement).amount}
            displayType={'text'}
            thousandSeparator={true}
            decimalScale={
              getCharges(route.params.selectedDebitCardBalanceMovement).currency === 'BTC' ||
                getCharges(route.params.selectedDebitCardBalanceMovement).currency === 'ETH'
                ? 8
                : 2
            }
            renderText={(value) => (
              <Text
                style={{
                  color: 'red'
                }} >
                {value + ' ' + getCharges(route.params.selectedDebitCardBalanceMovement).currency}
              </Text>
            )}
          />
        </View>}
      {getOperationId(route.params.selectedDebitCardBalanceMovement) !== '' &&
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row'
          }}>
          <Text
            style={{
              color: colors.text,
              fontWeight: 'bold',
              marginRight: 10
            }}>
            Operation ID:
          </Text>
          <Text
            style={{
              color: colors.text,
            }}
          >
            {getOperationId(route.params.selectedDebitCardBalanceMovement)}
          </Text>
        </View>}
      {getReceiverUserName(route.params.selectedDebitCardBalanceMovement) !== '' &&
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row'
          }}>
          <Text
            style={{
              color: colors.text,
              fontWeight: 'bold',
              marginRight: 10
            }}>
            Receiver User:
          </Text>
          <Text
            style={{
              color: colors.text,
            }}
          >
            {getReceiverUserName(route.params.selectedDebitCardBalanceMovement)}
          </Text>
        </View>}
      {getTargetAddress(route.params.selectedDebitCardBalanceMovement) !== '' &&
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row'
          }}>
          <Text
            style={{
              color: colors.text,
              fontWeight: 'bold',
              marginRight: 10
            }}>
            Target Address:
          </Text>
          <Text
            style={{
              color: colors.text,
            }}
          >
            {getTargetAddress(route.params.selectedDebitCardBalanceMovement)}
          </Text>
        </View>}
      {getDescription(route.params.selectedDebitCardBalanceMovement) !== '' &&
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row'
          }}>
          <Text
            style={{
              color: colors.text,
              fontWeight: 'bold',
              marginRight: 10
            }}>
            Description:
          </Text>
          <Text
            style={{
              color: colors.text,
            }}
          >
            {getDescription(route.params.selectedDebitCardBalanceMovement)}
          </Text>
        </View>}
    </View >
  );
};

export default React.memo(withColors(DebitCardsBalanceMovementDetailsScreen));
