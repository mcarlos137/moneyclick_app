import React from 'react';
import {
  TouchableOpacity,
  Dimensions,
  Text,
  View,
} from 'react-native';
import { NumericFormat } from 'react-number-format';
import { Avatar } from '@rneui/themed';
//FUNTIONS
import { getRequire, formatValue } from '../../../main/functions'
//HOC
import { withColors } from '../../../main/hoc';

const Component = ({ item, onPress, colors }) => {

  //PRINCIPAL RENDER
  return (
    <View
      style={{
        padding: 20,
        borderRadius: 20,
        width: Dimensions.get('window').width * 0.9,
        marginTop: 10,
        backgroundColor: colors.primaryBackground,
      }}
    >
      <TouchableOpacity
        onPress={onPress}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}>
          {item.img !== null &&
            item.img !== undefined && (
              <Avatar
                size='medium'
                rounded
                source={getRequire(item.img)}
              />
            )}
          <View
            style={{
              marginLeft: 20
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center'
              }}>
              <Text
                style={{
                  color: colors.text,
                  fontWeight: "bold",
                  fontSize: Dimensions.get('window').width * 0.045,
                  marginRight: 10
                }}
              >
                {item.text}
              </Text>
              <Text
                style={{
                  color: colors.text,
                  fontSize: Dimensions.get('window').width * 0.035,
                }}
              >
                {item.value}
              </Text>
            </View>
            <NumericFormat
              value={item.availableBalance}
              displayType={'text'}
              thousandSeparator={true}
              decimalScale={item.decimals}
              renderText={(value) => (
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 23,
                    marginTop: 5,
                  }}
                >
                  {value}
                </Text>
              )}
            />
            {item.value === 'BTC' &&
              item.deferredBalance !== undefined &&
              item.deferredBalance !== 0 && (
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 5,
                  }}>
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: Dimensions.get('window').width * 0.03,
                    }}
                  >
                    {'Deferred' + ' '}
                  </Text>
                  <NumericFormat
                    value={item.deferredBalance}
                    displayType={'text'}
                    thousandSeparator={true}
                    decimalScale={item.decimals}
                    renderText={(value) => (
                      <Text
                        style={{
                          color: colors.text,
                          fontSize: Dimensions.get('window').width * 0.03,
                          fontWeight: 'bold',
                        }}
                      >
                        {value}
                      </Text>
                    )}
                  />
                </View>
              )}
            {item.value !== 'USD' && (
              <View style={{
                flexDirection: 'row',
                marginTop: 5,
              }}>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: Dimensions.get('window').width * 0.03,
                  }}
                >
                  {'Estimated Amount in $ : '}
                </Text>
                <NumericFormat
                  value={formatValue(item.usdEstimatedBalance)}
                  displayType={'text'}
                  thousandSeparator={true}
                  decimalScale={2}
                  renderText={(value) => (
                    <Text
                      style={{
                        color: colors.text,
                        fontSize: Dimensions.get('window').width * 0.03,
                        fontWeight: 'bold',
                      }}
                    >
                      {'$ ' + value}
                    </Text>
                  )}
                />
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
};

export default React.memo(withColors(Component));
