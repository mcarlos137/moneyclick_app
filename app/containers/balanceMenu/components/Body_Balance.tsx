import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import { Avatar } from '@rneui/themed';
import { compose } from 'redux';
import { NumericFormat } from 'react-number-format';
//FUNTIONS
import { getRequire } from '../../../main/functions'
//HOC
import { withColors } from '../../../main/hoc';


const Component = ({
  currency,
  colors
}) => {

  //PRINCIPAL RENDER
  return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20
    }}>
      <View style={{
        flexDirection: 'row',
      }} >
        <Avatar
          size='medium'
          rounded
          source={getRequire(currency.img)}
        />
        <Text
          style={{
            fontSize: 25,
            color: colors.text,
            marginLeft: 10,
            paddingTop: 5
          }}>
          {currency.text}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 10
        }}>
        <Text
          style={{
            fontSize: 25,
            fontWeight: 'bold',
            color: colors.text,
            marginRight: 10
          }}>
          {currency.symbol}
        </Text>
        <NumericFormat
          value={currency.availableBalance}
          displayType={'text'}
          thousandSeparator={true}
          decimalScale={currency.decimals}
          renderText={(value) => (
            <Text
              style={{
                color: colors.text,
                fontWeight: 'bold',
                fontSize: 25
              }}
            >
              {value}
            </Text>
          )}
        />
      </View>
    </View>
  )
};

export default React.memo(compose(withColors)(Component));