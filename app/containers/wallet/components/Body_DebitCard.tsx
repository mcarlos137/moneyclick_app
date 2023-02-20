import React, { Fragment } from 'react';
import { Text, View } from 'react-native';
import { compose } from "redux";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
//FUNCTIONS
import { getDebitCardExpirationDate, parseDebitCardNumber } from '../../../main/functions';
//HOC
import { withColors } from '../../../main/hoc';

const Component = ({ data, icon, noDataText, colors }) => {

  //PRINCIPAL RENDER
  return (
    <View
      style={{
        flexDirection: "row",
      }}
    >
      <View
        style={{
          marginRight: 20,
          justifyContent: 'center'
        }}
      >
        <MaterialCommunityIcons
          name={icon}
          color={colors.icon}
          size={60}
        />
      </View>
      {data.length > 0 ? (
        <View style={{ justifyContent: 'center'}}>
          {data.map((value, key) => {
            return (
              <Fragment key={key}>
                <Text
                  key={key}
                  style={{
                    fontSize: 11,
                    alignSelf: "flex-end",
                    marginRight: 20,
                    color: colors.text
                  }}
                >
                  {value.number !== undefined
                    ? parseDebitCardNumber(value.number)
                    : "XXXX XXXX XXXX XXXX"}{" "}
                  {getDebitCardExpirationDate(value.timestamp)}
                </Text>
                {data.length > 3 && (
                  <Text
                    style={{
                      fontSize: 11,
                      alignSelf: "flex-end",
                      marginRight: 20,
                      color: colors.text
                    }}
                  >
                    {data.length - 3}
                    {" more..."}
                  </Text>
                )}
              </Fragment>
            );
          })}
        </View>
      ) : (
        <View
          style={{
            alignSelf: "center",
          }}
        >
          <Text
            style={{
              alignSelf: "center",
              color: "blue",
            }}
          >
            No data
          </Text>
          <Text
            style={{
              alignSelf: "center",
              color: "blue",
              fontWeight: "bold",
              textAlign: 'center',
              maxWidth: 200
            }}
          >
            {noDataText}
          </Text>
        </View>
      )}
    </View>
  )
};

export default React.memo(compose(withColors)(Component))