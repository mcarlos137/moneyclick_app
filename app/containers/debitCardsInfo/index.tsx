//PRINCIPAL
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
//FUNCTIONS
import { decorateTimestamp, getExpirationDate } from '../../main/functions';
//HOC
import { withColors } from '../../main/hoc';

const DebitCardsInfoScreen = ({ navigation, route, colors }) => {

  //EFFECTS
  useEffect(() => {
    console.log('DebitCardsInfoScreen', route.params)
  }, []);

  return (
    <View
      style={{
        marginTop: 40,
        alignItems: 'center',
        backgroundColor: colors.primaryBackground,
        padding: 40,
        borderRadius: 10,
        alignSelf: 'center'
      }}>
      <Text
        style={{
          color: colors.text,
          fontSize: 20
        }}>
        This debit card is
      </Text>
      <Text
        style={{
          color: colors.text,
          fontWeight: 'bold',
          fontSize: 20,
          marginBottom: 60
        }}>
        {route.params.selectedDebitCard.debitCardStatus}
      </Text>
      {route.params.selectedDebitCard.balance !== undefined && route.params.selectedDebitCard.balance.length > 0 &&
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Text
            style={{
              color: colors.text,
              fontWeight: 'bold',
              fontSize: 18,
              marginRight: 10
            }}>
            Balance:
          </Text>
          {route.params.selectedDebitCard.balance.map((item, index) => {
            return (
              <Text
                key={index}
                style={{
                  color: colors.text,
                  fontSize: 18
                }}>
                {item.amount} {item.currency}
              </Text>
            )
          })}
        </View>
      }
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
          Issue Date:
        </Text>
        <Text
          style={{
            color: colors.text,
          }}>
          {decorateTimestamp(route.params.selectedDebitCard.timestamp)}
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
          Valid thru:
        </Text>
        <Text
          style={{
            color: colors.text,
          }}>
          {getExpirationDate(route.params.selectedDebitCard.timestamp)}
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
          Number:
        </Text>
        <Text
          style={{
            color: colors.text,
          }}>
          {route.params.selectedDebitCard.number}
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
          Currency:
        </Text>
        <Text
          style={{
            color: colors.text,
          }}>
          {route.params.selectedDebitCard.currency}
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
          Holder name:
        </Text>
        <Text
          style={{
            color: colors.text,
          }}>
          {route.params.selectedDebitCard.holderName}
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
          Phone number:
        </Text>
        <Text
          style={{
            color: colors.text,
          }}>
          {route.params.selectedDebitCard.phoneNumber}
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
          Email:
        </Text>
        <Text
          style={{
            color: colors.text,
          }}>
          {route.params.selectedDebitCard.email}
        </Text>
      </View>
    </View >
  );
};

export default React.memo(withColors(DebitCardsInfoScreen));
