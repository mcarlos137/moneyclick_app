import React, { useState } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { compose } from 'redux';
//COMPONENTS
import WalletStackScreen from './components/WalletStackScreen';
import MoneyMarketsStackScreen from './components/MoneyMarketsStackScreen';
import OptionsStackScreen from './components/OptionsStackScreen';
import MoneyCallsStackScreen from './components/MoneyCallsStackScreen';
import UserDataStackScreen from './components/UserDataStackScreen';
//STORES
import { store as actionSheetOptionsStore } from '../app/main/stores/actionSheetOptions';
//HOC
import { withColors } from '../app/main/hoc';

const tabBackgroundColors = {
  MoneyCalls: '#d02860',
  MoneyMarkets: '#1f65ff',
  Wallet: '#694fad',
  UserData: '#f5551b',
}

const MainTabScreen = ({ navigation, route, colors }) => {

  const [selectedTab, setSelectedTab] = useState('Wallet')
  const Tab = createMaterialBottomTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName={selectedTab}
      activeColor={colors.icon}
      barStyle={{
        backgroundColor: tabBackgroundColors[selectedTab]
      }}
      shifting={true}
    >
      <Tab.Screen name="Wallet" component={WalletStackScreen}
        listeners={{
          tabPress: (e) => {
            setSelectedTab('Wallet')
          }
        }}
        options={{
          tabBarLabel: 'Wallet',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen name="MoneyMarkets" component={MoneyMarketsStackScreen}
        listeners={{
          tabPress: (e) => {
            setSelectedTab('MoneyMarkets')
          }
        }}
        options={{
          tabBarLabel: 'Markets',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chart-waterfall" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen name="Options" component={OptionsStackScreen}
        listeners={{
          tabPress: (e) => {
            e.preventDefault()
            switch (selectedTab) {
              case 'Wallet':
                actionSheetOptionsStore.getState().ref1.current?.setModalVisible(true)
                break
              case 'MoneyMarkets':
                actionSheetOptionsStore.getState().ref2.current?.setModalVisible(true)
                break
              case 'MoneyCalls':
                actionSheetOptionsStore.getState().ref3.current?.setModalVisible(true)
                break
              case 'UserData':
                actionSheetOptionsStore.getState().ref4.current?.setModalVisible(true)
                break
            }

          }
        }}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="dots-vertical" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen name="MoneyCalls" component={MoneyCallsStackScreen}
        listeners={{
          tabPress: (e) => {
            setSelectedTab('MoneyCalls')
          }
        }}
        options={{
          tabBarLabel: 'Money Calls',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cellphone" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen name="UserData" component={UserDataStackScreen}
        listeners={{
          tabPress: (e) => {
            setSelectedTab('UserData')
          }
        }}
        options={{
          tabBarLabel: 'User Info',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-circle" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default compose(withColors)(MainTabScreen);
