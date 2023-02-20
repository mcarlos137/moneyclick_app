import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { Avatar } from '@rneui/themed';
import { NumericFormat } from 'react-number-format';
import { compose } from 'redux';
//FUNCTIONS
import { formatValue, getRequire } from '../../../main/functions';
//HOC
import { withColors } from '../../../main/hoc';

const Component = ({ data, colors }) => {

  //INITIAL FUNCTIONS
  const imgs: string[] = []
  let usdEstimatedBalance = 0
  data?.detailedBalances.map((value, key) => {
    imgs.push(value.img)
    if (value?.usdEstimatedBalance) {
      usdEstimatedBalance = usdEstimatedBalance + value.usdEstimatedBalance
    }
  })

  //PRINCIPAL RENDER
  return (
    <>
      <View
        style={{
          marginTop: 20,
          marginBottom: 20,
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {imgs.map((value, key) => {
          return (
            <Avatar
              key={key}
              size="medium"
              rounded
              source={getRequire(value)}
              overlayContainerStyle={{
                backgroundColor: "white",
              }}
            />
          );
        })}
      </View>
      <View style={{ flexDirection: "row" }}>
        <Text
          style={{
            color: colors.text,
            fontSize: Dimensions.get("window").width * 0.03,
          }}
        >
          {"Estimated Balance in USD ($) : "}
        </Text>
        <NumericFormat
          value={formatValue(usdEstimatedBalance)}
          displayType={'text'}
          thousandSeparator={true}
          decimalScale={2}
          renderText={(value) => (
            <Text
              style={{
                color: colors.text,
                fontSize: Dimensions.get("window").width * 0.03,
                fontWeight: "bold",
              }}
            >
              {"$ " + value}
            </Text>
          )}
        />
      </View>
    </>
  )
};

export default React.memo(compose(withColors)(Component))