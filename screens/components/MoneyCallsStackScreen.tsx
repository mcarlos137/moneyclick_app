import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, View, Image, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { compose } from 'redux'
import { StackActions } from "@react-navigation/native";
//COMPONENTS
import MoneyCallsScreen from '../../app/containers/moneyCalls';
//HOC
import { withColors } from '../../app/main/hoc';

const Stack = createStackNavigator();

const StackScreen = ({ navigation, route, colors }) => {

  return (
    <Stack.Navigator screenOptions={{
      headerTransparent: true,
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontWeight: 'bold'
      }
    }}>
      <Stack.Screen name="MoneyCallsScreen" component={MoneyCallsScreen} options={{
        title: '',
        headerLeft: () => (
          <View
            style={{
              flexDirection: 'row',
              marginLeft: 15,
              justifyContent: 'center',
              paddingLeft: 10,
              paddingRight: 10,
            }}
          >
            <Image
              style={{
                width: 90,
                height: 40,
              }}
              source={require("../../assets/logo_mc_3.png")}
            />
          </View>
        ),
        headerRight: () => (
          <View
            style={{
              flexDirection: 'row',
              marginRight: 10,
              height: 40,
              alignItems: 'flex-end'
            }}
          >
            <TouchableOpacity
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                marginRight: 10,
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onPress={() => {
                navigation.dispatch(StackActions.push('MoneyCallsCreateScreen', { ...route.params }))
              }}
            >
              <MaterialCommunityIcons
                name={'card-plus'}
                size={26}
                color={colors.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: 32,
                height: 32,
                //backgroundColor: colors.secundaryBackground,
                borderRadius: 16,
                marginRight: 10,
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onPress={() => {
                navigation.dispatch(StackActions.push('NotificationsScreen', { ...route.params }))
              }}
            >
              <MaterialCommunityIcons
                name="bell"
                size={26}
                color={colors.icon}
              />
              {true &&
                <View
                  style={{
                    position: 'absolute',
                    backgroundColor: 'red',
                    top: 0,
                    left: 0,
                    height: 14,
                    width: 14,
                    borderRadius: 7,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 9,
                      fontWeight: 'bold'
                    }}
                  >
                    4
                  </Text>
                </View>}
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                marginRight: 10,
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onPress={() => {
                //socialStore.dispatch({ type: OPEN_SEARCH_MODAL, payload: true })
              }}
            >
              <MaterialCommunityIcons
                name="cloud-search"
                size={26}
                color={colors.icon}
              />
            </TouchableOpacity>
          </View>
        ),
      }} />
    </Stack.Navigator>
  )
};

export default React.memo(compose(withColors)(StackScreen))