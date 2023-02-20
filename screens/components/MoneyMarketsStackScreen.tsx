import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { compose } from 'redux'
import { StackActions } from "@react-navigation/native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
//STORES
import { store as optionsStore } from "../../app/main/stores/options";
//COMPONENTS
import MoneyMarketsScreen from '../../app/containers/moneyMarkets';
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
      <Stack.Screen name="MoneyMarketsScreen" component={MoneyMarketsScreen} options={{
        title: '',
        headerLeft: () => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 15,
              justifyContent: 'center',
              paddingLeft: 10,
              paddingRight: 10
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
                if (optionsStore.getState().selectedMoneyMarketsOption === 'EXCHANGE') {
                  navigation.dispatch(StackActions.push('OrdersBookScreen', { ...route.params }))
                } else {
                  navigation.dispatch(StackActions.push('OrdersPostScreen', { ...route.params }))
                }
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
                borderRadius: 16,
                marginRight: 10,
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onPress={() => {
                navigation.dispatch(StackActions.push('OrdersScreen', { ...route.params }))
              }}
            >
              <MaterialCommunityIcons
                name="format-list-bulleted"
                size={26}
                color={colors.icon}
              />
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
                    top: 0,
                    left: 0,
                    height: 14,
                    width: 14,
                    borderRadius: 7,
                    backgroundColor: 'red',
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