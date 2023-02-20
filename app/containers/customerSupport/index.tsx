import React from 'react';
import { View, Text, StyleSheet, Linking, Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { compose } from 'redux'
//HOC
import { withColors } from '../../main/hoc';

const CustomerSupportScreen = ({ navigation, route, colors }) => {
  
  return (
    <View style={{
      width: Dimensions.get('window').width * 0.9,
      alignSelf: 'center',
      marginTop: 10
    }}>
      <View
        style={{
          backgroundColor: colors.primaryBackground,
          padding: 10,
          borderRadius: 10,
          marginTop: 10
        }}
      >
        <Text
          style={{
            fontSize: 20,
            paddingBottom: 10,
            color: colors.text,
            fontWeight: 'bold'
          }}>
          {'Business Issues'}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignContent: 'flex-start',
            paddingTop: 4,
          }}>
          <MaterialCommunityIcons
            name={'email-outline'}
            color={colors.icon}
            size={30}
            style={{
              flex: 0.15,
              textAlign: 'center',
              paddingBottom: 4
            }}
          />
          <Text
            onPress={() =>
              Linking.openURL("mailto:customer_service@moneyclick.com")
            }
            style={{
              flex: 0.85,
              paddingTop: 4,
              color: colors.text
            }}>{'customer_service@moneyclick.com'}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignContent: 'flex-start',
            alignItems: 'center',
            paddingTop: 7,
          }}>
          <MaterialCommunityIcons
            name={'whatsapp'}
            color={colors.icon}
            size={30}
            style={{
              flex: 0.15,
              textAlign: 'center',
              paddingBottom: 4
            }}
          />
          <Text
            style={{
              flex: 0.35,
              fontWeight: 'bold',
              color: colors.text
            }}>
            {'English'}
          </Text>
          <View
            style={{
              flex: 0.5,
              alignItems: 'center',
              flexDirection: 'column'
            }}>
            <Text
              onPress={() =>
                Linking.openURL(
                  "whatsapp://send?text=Hello&phone=+15512214091"
                )
              }
              style={{
                color: colors.text
              }}>
              {'+1 (551) 221-4091'}
            </Text>
            <Text
              style={{
                color: colors.text
              }}>
              {'9:00 a.m. - 5:00 p.m. ET'}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignContent: 'flex-start',
            alignItems: 'center',
            paddingTop: 7,
          }}>
          <MaterialCommunityIcons
            name={'whatsapp'}
            color={colors.icon}
            size={30}
            style={{
              flex: 0.15,
              textAlign: 'center',
              paddingBottom: 4
            }}
          />
          <Text
            style={{
              flex: 0.35,
              fontWeight: 'bold',
              color: colors.text
            }}>
            {'Spanish'}
          </Text>
          <View
            style={{
              flex: 0.5,
              alignItems: 'center',
              flexDirection: 'column'
            }}>
            <Text
              onPress={() =>
                Linking.openURL(
                  "whatsapp://send?text=Hello&phone=+15189132770"
                )
              }
              style={{
                color: colors.text
              }}>
              {'+1 (518) 913-2770'}
            </Text>
            <Text
              style={{
                color: colors.text
              }}>
              {'9:00 a.m. - 5:00 p.m. ET'}
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontSize: 20,
            paddingTop: 20,
            paddingBottom: 10,
            color: colors.text,
            fontWeight: 'bold'
          }}>
          {'Technical Issues'}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignContent: 'flex-start',
            alignItems: 'center',
            paddingTop: 7,
          }}>
          <MaterialCommunityIcons
            name={'whatsapp'}
            color={colors.icon}
            size={30}
            style={{
              flex: 0.15,
              textAlign: 'center',
              paddingBottom: 4
            }}
          />
          <Text
            style={{
              flex: 0.35,
              fontWeight: 'bold',
              color: colors.text,
            }}>
            {'English-Spanish'}
          </Text>
          <View
            style={{
              flex: 0.5,
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text
              onPress={() =>
                Linking.openURL(
                  "whatsapp://send?text=Hello&phone=+19199755089"
                )
              }
              style={{
                color: colors.text
              }}>
              {'+1 (919) 975-5089'}
            </Text>
            <Text
              style={{
                color: colors.text
              }}>
              {'9:00 a.m. - 5:00 p.m. ET'}
            </Text>
          </View>
        </View>
        <Text
          style={{
            paddingTop: 20,
            paddingBottom: 10,
            fontSize: 20,
            color: colors.text,
            fontWeight: 'bold'
          }}>
          {'Main Office'}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignContent: 'flex-start',
            paddingTop: 7,
          }}>
          <MaterialCommunityIcons
            name={'whatsapp'}
            color={colors.icon}
            size={30}
            style={{
              flex: 0.15,
              textAlign: 'center',
              paddingBottom: 4
            }}
          />
          <Text
            onPress={() =>
              Linking.openURL(
                "whatsapp://send?text=Hello&phone=+14702379398"
              )
            }
            style={{
              paddingTop: 5,
              flex: 0.85,
              color: colors.text
            }}>
            {'+1 (470) 237-9398'}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignContent: 'flex-start',
            paddingTop: 4,
          }}>
          <MaterialCommunityIcons
            name={'map-marker'}
            color={colors.icon}
            size={30}
            style={{
              flex: 0.15,
              textAlign: 'center',
              paddingBottom: 4
            }}
          />
          <Text
            onPress={() =>
              Linking.openURL(
                "https://www.google.com/maps/place/Monterey+Pkwy,+Sandy+Springs,+GA/@33.9620533,-84.3774119,17z/data=!3m1!4b1!4m5!3m4!1s0x88f50c6961ee5c89:0x80519d3f48b56275!8m2!3d33.9620533!4d-84.3752232"
              )
            }
            style={{
              flex: 0.85,
              color: colors.text
            }}>
            {'2003 Monterey Parkway Sandy Springs, GA ZIP 30350'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default React.memo(compose(withColors)(CustomerSupportScreen));

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    height: 600
  },
});
