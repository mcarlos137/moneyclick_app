import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, View, Image, Text, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { compose } from 'redux'
import { CommonActions, StackActions } from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
import Ionicons from 'react-native-vector-icons/Ionicons';
//STORES
import { store as authStore } from '../../app/main/stores/auth';
//COMPONENTS
import UserDataScreen from '../../app/containers/userData';
//HOC
import { withColors } from '../../app/main/hoc';

const UserDataStack = createStackNavigator();

const UserDataStackScreen = ({ navigation, route, colors }) => {

  return (
    <UserDataStack.Navigator screenOptions={{
      headerTransparent: true,
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontWeight: 'bold'
      }
    }}>
      <UserDataStack.Screen name="UserDataScreen" component={UserDataScreen} options={{
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
                navigation.dispatch(StackActions.push('SettingsScreen', { ...route.params }))
              }}
            >
              <MaterialCommunityIcons
                name="account-settings"
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
                //userDataStore.dispatch({ type: OPEN_SEARCH_MODAL, payload: true })
              }}
            >
              <MaterialCommunityIcons
                name="cloud-search"
                size={26}
                color={colors.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10
              }}
              onPress={() => {
                Alert.alert('Log out', 'are you sure to log out?', [
                  {
                    text: 'Ok', onPress: () => {
                      console.log("log out")
                      authStore.dispatch(
                        {
                          type: 'SET_PARAMS',
                          payload:
                          {
                            userName: '',
                            secretKey: '',
                            time: null,
                            config: {},
                            frequentUsers: []
                          }
                        })
                      setTimeout(() => {
                        Keychain.resetGenericPassword().then(result => {
                          console.log('resetGenericPassword', result)
                        });
                      }, 500)
                      /*navigation.dispatch((state) => {
                        const routes = [{ name: 'SplashScreen' }];
                        return CommonActions.reset({
                          ...state,
                          routes,
                          index: routes.length - 1,
                        });
                      });*/
                      navigation.dispatch(
                        CommonActions.reset({
                          index: 0,
                          routes: [{ name: 'SignInScreen' }]
                        })
                      )
                    }
                  },
                  { text: 'Cancel' }
                ]);
              }}
            >
              <Ionicons
                name="log-out-outline"
                size={26}
                color={colors.icon}
              />
            </TouchableOpacity>
          </View>
        ),
      }} />
    </UserDataStack.Navigator>
  )
};

export default React.memo(compose(withColors)(UserDataStackScreen))
