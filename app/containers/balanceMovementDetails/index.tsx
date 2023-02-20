import React from 'react';
import { View, Text } from 'react-native';
import { NumericFormat } from 'react-number-format';
import { compose } from 'redux'
//FUNCTIONS
import {
  getBalanceOperationTypeName,
  getBalanceOperationStatusName,
  getOperationId,
  getDescription,
  getReceiverUserName,
  getTargetAddress,
  getCharges
} from './functions';
import { decorateTimestamp } from '../../main/functions';
//HOC
import { withColors } from '../../main/hoc';

const BalanceMovementDetailsScreen = ({ navigation, route, colors }) => {

  //PRINCIPAL RENDER
  return (
    <View
      style={{
        marginTop: 40,
        alignItems: 'center',
        backgroundColor: colors.primaryBackground,
        alignSelf: 'center',
        padding: 10,
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
          fontWeight: 'bold',
          color: colors.text,
          fontSize: 20
        }}>
        {getBalanceOperationStatusName(route.params.selectedBalanceMovement)}
      </Text>
      <View
        style={{
          marginTop: 60,
          flexDirection: 'row',
        }}>
        <Text
          style={{
            color: colors.text,
            fontSize: 16,
            fontWeight: 'bold',
            marginRight: 10
          }}>
          Date:
        </Text>
        <Text
          style={{
            color: colors.text,
            fontSize: 16,
          }}>
          {decorateTimestamp(route.params.selectedBalanceMovement[0].timestamp)}
        </Text>
      </View>
      <View
        style={{
          marginTop: 10,
          flexDirection: 'row',
          alignItems: 'center'
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 16,
            color: colors.text,
            marginRight: 10
          }}>
          Operation type:
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: colors.text,
          }}>
          {getBalanceOperationTypeName(route.params.selectedBalanceMovement[0].balanceOperationType)}
        </Text>
      </View>
      {route.params.selectedBalanceMovement.length === 2
        ?
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              color: colors.text,
              fontSize: 16,
              marginRight: 10
            }}>
            Amount:
          </Text>
          <NumericFormat
            value={route.params.selectedBalanceMovement[0].initialAmount}
            displayType={'text'}
            thousandSeparator={true}
            decimalScale={
              route.params.selectedBalanceMovement[0].currency === 'BTC' ||
                route.params.selectedBalanceMovement[0].currency === 'ETH'
                ? 8
                : 2
            }
            renderText={(value) => (
              <Text
                style={{
                  fontSize: 16,
                  color: route.params.selectedBalanceMovement[0].operationType === 'ADD' ? 'green' : 'red'
                }} >
                {value + ' ' + route.params.selectedBalanceMovement[0].currency + ''}
              </Text>
            )}
          />
          <Text
            style={{
              color: colors.text,
              fontSize: 16,
              marginLeft: 5,
              marginRight: 5
            }}
          >
            {' -> '}
          </Text>
          <NumericFormat
            value={route.params.selectedBalanceMovement[1].initialAmount}
            displayType={'text'}
            thousandSeparator={true}
            decimalScale={
              route.params.selectedBalanceMovement[1].currency === 'BTC' ||
                route.params.selectedBalanceMovement[1].currency === 'ETH'
                ? 8
                : 2
            }
            renderText={(value) => (
              <Text
                style={{
                  fontSize: 16,
                  color: route.params.selectedBalanceMovement[1].operationType === 'ADD' ? 'green' : 'red'
                }} >
                {value + ' ' + route.params.selectedBalanceMovement[1].currency + ''}
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
              fontWeight: 'bold',
              fontSize: 16,
              color: colors.text,
              marginRight: 10
            }}>
            Amount:
          </Text>
          <NumericFormat
            value={route.params.selectedBalanceMovement[0].initialAmount}
            displayType={'text'}
            thousandSeparator={true}
            decimalScale={
              route.params.selectedBalanceMovement[0].currency === 'BTC' ||
                route.params.selectedBalanceMovement[0].currency === 'ETH'
                ? 8
                : 2
            }
            renderText={(value) => (
              <Text
                style={{
                  fontSize: 16,
                  color: route.params.selectedBalanceMovement[0].operationType === 'ADD' ? 'green' : 'red'
                }} >
                {value + ' ' + route.params.selectedBalanceMovement[0].currency + ''}
              </Text>
            )}
          />
        </View>}
      {getCharges(route.params.selectedBalanceMovement).amount !== 0 &&
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row'
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: colors.text,
              marginRight: 10
            }}>
            Commission:
          </Text>
          <NumericFormat
            value={getCharges(route.params.selectedBalanceMovement).amount}
            displayType={'text'}
            thousandSeparator={true}
            decimalScale={
              getCharges(route.params.selectedBalanceMovement).currency === 'BTC' ||
                getCharges(route.params.selectedBalanceMovement).currency === 'ETH'
                ? 8
                : 2
            }
            renderText={(value) => (
              <Text
                style={{
                  fontSize: 16,
                  color: 'red'
                }} >
                {value + ' ' + getCharges(route.params.selectedBalanceMovement).currency}
              </Text>
            )}
          />
        </View>}
      {getOperationId(route.params.selectedBalanceMovement) !== '' &&
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row'
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: colors.text,
              marginRight: 10
            }}>
            Operation ID:
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: colors.text,
            }}
          >
            {getOperationId(route.params.selectedBalanceMovement)}
          </Text>
        </View>}
      {getReceiverUserName(route.params.selectedBalanceMovement) !== '' &&
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'center'
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: colors.text,
              marginRight: 10
            }}>
            Receiver User:
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: colors.text,
            }}
          >
            {getReceiverUserName(route.params.selectedBalanceMovement)}
          </Text>
        </View>}
      {getTargetAddress(route.params.selectedBalanceMovement) !== '' &&
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'center'
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: colors.text,
              marginRight: 10
            }}>
            Target Address:
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: colors.text,
            }}
          >
            {getTargetAddress(route.params.selectedBalanceMovement)}
          </Text>
        </View>}
      {getDescription(route.params.selectedBalanceMovement) !== '' &&
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'center'
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: colors.text,
              marginRight: 10
            }}>
            Description:
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: colors.text,
            }}
          >
            {getDescription(route.params.selectedBalanceMovement)}
          </Text>
        </View>}
    </View >
  );
};

export default React.memo(compose(withColors)(BalanceMovementDetailsScreen));

