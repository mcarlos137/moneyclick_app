//PRINCIPAL
import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { StackActions, useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";

import SplashScreen from "../app/containers/splash";
import MainInfoScreen from "../app/containers/mainInfo";

import SignInScreen from "../app/containers/signIn";
import SignUpScreen from "../app/containers/signUp";
import MFACodeScreen from "../app/containers/mfaCode";
import ForgotPasswordScreen from "../app/containers/forgotPassword";
import ForgotPasswordProcessScreen from "../app/containers/forgotPasswordProcess";
import SignUpProcessScreen from "../app/containers/signUpProcess";
import SignInProcessScreen from "../app/containers/signInProcess";

import FAQsScreen from "../app/containers/faqs";
import CustomerSupportScreen from "../app/containers/customerSupport";
import ChargesScreen from "../app/containers/charges";

import SettingsScreen from "../app/containers/settings";

import NotificationsScreen from "../app/containers/notifications";

import BalanceDetailsScreen from "../app/containers/balanceDetails";
import BalanceMenuScreen from "../app/containers/balanceMenu";
import BalanceMovementsScreen from "../app/containers/balanceMovements";
import BalanceMovementDetailsScreen from "../app/containers/balanceMovementDetails";

import MoneyCallsCreateScreen from "../app/containers/moneyCallsCreate";

import CryptoBuyScreen from "../app/containers/cryptoBuy";
import CryptoReceiveScreen from "../app/containers/cryptoReceive";
import CryptoSellScreen from "../app/containers/cryptoSell";
import CryptoSendScreen from "../app/containers/cryptoSend";

import FiatBankDepositsScreen from "../app/containers/fiatBankDeposits";
import FiatBankDepositsCreateScreen from "../app/containers/fiatBankDepositsCreate";
import FiatBankDepositsDetailsScreen from "../app/containers/fiatBankDepositsDetails";
import FiatBankDepositsPayScreen from "../app/containers/fiatBankDepositsPay";
import FiatBankTransfersScreen from "../app/containers/fiatBankTransfers";
import FiatBankPaymentsScreen from "../app/containers/fiatBankPayments";

import FastChangeScreen from "../app/containers/fastChange";

import MoneyClickUserReceiveScreen from "../app/containers/moneyClickUserReceive";
import MoneyClickUserSendScreen from "../app/containers/moneyClickUserSend";

import OrdersBookScreen from "../app/containers/ordersBook";
import OrdersScreen from "../app/containers/orders";
import OrdersPostScreen from "../app/containers/ordersPost";
import OrdersTakeScreen from "../app/containers/ordersTake";
import OrdersDetailsScreen from "../app/containers/ordersDetails";

import ContactsScreen from "../app/containers/contacts";

import ChatScreen from "../app/containers/chat";
import ChatRoomScreen from "../app/containers/chatRoom";

import DebitCardsScreen from "../app/containers/debitCards";
import DebitCardsRequestScreen from "../app/containers/debitCardsRequest";
import DebitCardsInfoScreen from "../app/containers/debitCardsInfo";
import DebitCardsBalanceMovementsScreen from "../app/containers/debitCardsBalanceMovements";
import DebitCardsBalanceMovementDetailsScreen from "../app/containers/debitCardsBalanceMovementDetails";
import DebitCardsAddSubstractBalanceScreen from "../app/containers/debitCardsAddSubstractBalance";

import CameraStreamScreen from "../app/containers/cameraStream";


/*

import MoneyMarketScreen from "../app/containers/moneyMarket";


import GiftCardRedeemScreen from "../app/containers/giftCardRedeem";

import CameraBridgeScreen from "../app/containers/cameraBridge";
import CameraScreen from "../app/containers/camera";
import PermissionsScreen from "../app/containers/permissions";


import ShortsScreen from "../app/containers/shorts";
import ShortsCreateScreen from "../app/containers/shortsCreate";
import ShortsVideoScreen from "../app/containers/shortsVideo";

import MoneyCallsScreen from "../app/containers/moneyCalls";
import MoneyCallsMessagesScreen from "../app/containers/moneyCallsMessages";

import UserDataGalleryScreen from "../app/containers/userDataGallery";

import VerificationScreen from "../app/containers/verification";

import DigitalBusinessScreen from "../app/containers/digitalBusiness"
import DigitalBusinessDetailsScreen from "../app/containers/digitalBusinessDetails"


*/

import MainTabScreen from "./MainTabScreen";

import { useTheme } from "react-native-paper";

const RootStack = createStackNavigator();

const RootStackScreen = ({ }) => {
  const { colors } = useTheme<any>()
  const navigation = useNavigation()
  return (
    <RootStack.Navigator
      screenListeners={{
        state: (e) => {
          //navigateStore.getState().currentScreenState = e.data.state.routes[e.data.state.routes.length - 1].name
        },
      }}
    >
      <RootStack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="MainInfoScreen"
        component={MainInfoScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="SignInScreen"
        component={SignInScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="SignUpScreen"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="MFACodeScreen"
        component={MFACodeScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="ForgotPasswordProcessScreen"
        component={ForgotPasswordProcessScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="SignUpProcessScreen"
        component={SignUpProcessScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="SignInProcessScreen"
        component={SignInProcessScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="MainTabScreen"
        component={MainTabScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={getOptions({ title: "Settings", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="ChargesScreen"
        component={ChargesScreen}
        options={getOptions({ title: "Rates", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="CustomerSupportScreen"
        component={CustomerSupportScreen}
        options={getOptions({ title: "Customer Support", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="FAQsScreen"
        component={FAQsScreen}
        options={getOptions({ title: "FAQs", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
        options={getOptions({ title: "Inbox", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="BalanceDetailsScreen"
        component={BalanceDetailsScreen}
        options={getOptions({ title: "Balance Details", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="BalanceMenuScreen"
        component={BalanceMenuScreen}
        options={getOptions({ title: "Operations", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="BalanceMovementsScreen"
        component={BalanceMovementsScreen}
        options={getOptions({ title: "Balance Movements", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="BalanceMovementDetailsScreen"
        component={BalanceMovementDetailsScreen}
        options={getOptions({ title: "Transaction Details", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="MoneyCallsCreateScreen"
        component={MoneyCallsCreateScreen}
        options={getOptions({ title: "Call Schedule", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="CryptoBuyScreen"
        component={CryptoBuyScreen}
        options={getOptions({ title: "Buy Crypto", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="CryptoReceiveScreen"
        component={CryptoReceiveScreen}
        options={getOptions({ title: "Receive Crypto", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="CryptoSellScreen"
        component={CryptoSellScreen}
        options={getOptions({ title: "Sell Crypto", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="CryptoSendScreen"
        component={CryptoSendScreen}
        options={getOptions({ title: "Send Crypto", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="FiatBankDepositsScreen"
        component={FiatBankDepositsScreen}
        options={
          getOptions(
            {
              title: "Bank Deposits",
              backgroundColor: colors.getRandomMain(),
              headerRight:
                <HeaderRight
                  navigation={navigation}
                  buttons={[
                    {
                      target: 'FiatBankDepositsCreateScreen',
                      marginRight: 0,
                      iconName: 'ios-add'
                    }
                  ]}
                />
            })}
      />
      <RootStack.Screen
        name="FiatBankDepositsCreateScreen"
        component={FiatBankDepositsCreateScreen}
        options={getOptions({ title: "Bank Deposits Create", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="FiatBankDepositsDetailsScreen"
        component={FiatBankDepositsDetailsScreen}
        options={getOptions({ title: "Bank Deposit Details", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="FiatBankDepositsPayScreen"
        component={FiatBankDepositsPayScreen}
        options={getOptions({ title: "Bank Deposit Pay", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="FiatBankTransfersScreen"
        component={FiatBankTransfersScreen}
        options={getOptions({ title: "Bank Transfer", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="FiatBankPaymentsScreen"
        component={FiatBankPaymentsScreen}
        options={getOptions({ title: "Bank Payments", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="FastChangeScreen"
        component={FastChangeScreen}
        options={getOptions({ title: "Fast Change", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="MoneyClickUserReceiveScreen"
        component={MoneyClickUserReceiveScreen}
        options={getOptions({ title: "MoneyClick User Receive", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="MoneyClickUserSendScreen"
        component={MoneyClickUserSendScreen}
        options={getOptions({ title: "MoneyClick User Send", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="OrdersBookScreen"
        component={OrdersBookScreen}
        options={getOptions({ title: "Orders Book", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="ContactsScreen"
        component={ContactsScreen}
        options={getOptions({ title: "Select Contact", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={getOptions({ title: "Chat", backgroundColor: '#009387', headerRight: <HeaderRightChat /> })}
      />
      <RootStack.Screen
        name="ChatRoomScreen"
        component={ChatRoomScreen}
        options={getOptions({ title: "ChatRoom", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="DebitCardsScreen"
        component={DebitCardsScreen}
        options={
          getOptions(
            {
              title: "Request Debit Card",
              backgroundColor: colors.getRandomMain(),
              headerRight:
                <HeaderRight
                  navigation={navigation}
                  buttons={[
                    {
                      target: 'DebitCardsRequestScreen',
                      marginRight: 0,
                      iconName: 'ios-add'
                    }
                  ]}
                />
            })}
      />
      <RootStack.Screen
        name="DebitCardsRequestScreen"
        component={DebitCardsRequestScreen}
        options={getOptions({ title: "Debit Card Request", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="DebitCardsInfoScreen"
        component={DebitCardsInfoScreen}
        options={getOptions({ title: "Debit Card Info", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="DebitCardsBalanceMovementsScreen"
        component={DebitCardsBalanceMovementsScreen}
        options={getOptions({ title: "Debit Card Balance Movements", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="DebitCardsBalanceMovementDetailsScreen"
        component={DebitCardsBalanceMovementDetailsScreen}
        options={getOptions({ title: "Debit Card Balance Movements Details", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="DebitCardsAddSubstractBalanceScreen"
        component={DebitCardsAddSubstractBalanceScreen}
        options={getOptions({ title: "Debit Card Add - Subsctract Balance", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="OrdersScreen"
        component={OrdersScreen}
        options={
          getOptions(
            {
              title: "Orders",
              backgroundColor: colors.getRandomMain(),
              headerRight:
                <HeaderRight
                  navigation={navigation}
                  buttons={[
                    {
                      target: 'OrdersPostScreen',
                      marginRight: 0,
                      iconName: 'ios-add'
                    }
                  ]}
                />
            })}
      />
      <RootStack.Screen
        name="OrdersPostScreen"
        component={OrdersPostScreen}
        options={getOptions({ title: "Orders Create", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="CameraStreamScreen"
        component={CameraStreamScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="OrdersTakeScreen"
        component={OrdersTakeScreen}
        options={getOptions({ title: "Orders Take", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="OrdersDetailsScreen"
        component={OrdersDetailsScreen}
        options={getOptions({ title: "Order Details", backgroundColor: colors.getRandomMain() })}
      />
      {/*      
      <RootStack.Screen
        name="GiftCardRedeemScreen"
        component={GiftCardRedeemScreen}
        options={getOptions({ title: "Gift Card Redeem", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="CameraBridgeScreen"
        component={CameraBridgeScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="CameraScreen"
        component={CameraScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="PermissionsScreen"
        component={PermissionsScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="ShortsScreen"
        component={ShortsScreen}
        options={
          getOptions(
            {
              title: "Create short",
              backgroundColor: colors.getRandomMain(),
              headerRight:
                <HeaderRight
                  navigation={navigation}
                  buttons={[
                    {
                      target: 'ShortsCreateScreen',
                      marginRight: 0,
                      iconName: 'ios-add'
                    }
                  ]}
                />
            })}
      />
      <RootStack.Screen
        name="ShortsCreateScreen"
        component={ShortsCreateScreen}
        options={getOptions({ title: "Shorts Create", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="ShortsVideoScreen"
        component={ShortsVideoScreen}
        options={getOptions({ title: "Shorts Video", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="MoneyCallsScreen"
        component={MoneyCallsScreen}
        options={
          getOptions(
            {
              title: "Blocked Users",
              backgroundColor: colors.getRandomMain(),
              headerRight:
                <HeaderRight
                  navigation={navigation}
                  buttons={[
                    {
                      target: 'MoneyCallsBlockedUsersScreen',
                      marginRight: 15,
                      iconName: 'ios-eye-off'
                    },
                    {
                      target: 'MoneyCallsCreateScreen',
                      marginRight: 0,
                      iconName: 'ios-add'
                    }
                  ]}
                />
            })}
      />
      <RootStack.Screen
        name="MoneyCallsMessagesScreen"
        component={MoneyCallsMessagesScreen}
        options={getOptions({ title: "Paid Calls Messages", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="UserDataGalleryScreen"
        component={UserDataGalleryScreen}
        options={getOptions({ title: "Gallery", backgroundColor: colors.getRandomMain(), headerRight: <></> })}
      />
      <RootStack.Screen
        name="DigitalBusinessScreen"
        component={DigitalBusinessScreen}
        options={getOptions({ title: "Digital Business", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="DigitalBusinessDetailsScreen"
        component={DigitalBusinessDetailsScreen}
        options={getOptions({ title: "Digital Business Details", backgroundColor: colors.getRandomMain() })}
      />
      <RootStack.Screen
        name="VerificationScreen"
        component={VerificationScreen}
        options={getOptions({ title: "Verification", backgroundColor: colors.getRandomMain() })}
      />
      */}
    </RootStack.Navigator>
  )
};

export default RootStackScreen;

const getOptions = ({ title, backgroundColor, headerRight = <></>, headerTitleAlign = 'center' }) => {
  return {
    title: title,
    //headerTransparent: true,
    headerStyle: { backgroundColor: backgroundColor },
    headerTitleStyle: { color: "white" },
    headerTintColor: "white",
    headerTitleAlign: headerTitleAlign,
    headerBackTitle: 'Back',
    headerRight: () => headerRight,
    cardStyleInterpolator: ({ current, layouts }) => {
      return {
        cardStyle: {
          transform: [
            {
              translateX: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [layouts.screen.width, 0],
              }),
            },
          ],
        },
      };
    },
  };
};

const HeaderRight = ({ navigation, buttons }) => {
  const route = useRoute()
  return (
    <View
      style={{
        flexDirection: "row",
        marginRight: 10
      }}
    >
      {buttons.map((item, index) => {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => {
              navigation.dispatch(StackActions.push(item.target, { ...route.params }))
            }}
            style={{
              marginRight: item.marginRight
            }}
          >
            <Ionicons
              name={item.iconName}
              size={26}
              color={'white'}
            />
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const HeaderRightChat = ({ }) => {
  const route = useRoute()
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
        justifyContent: 'center'
      }}
    >
      <Image
        style={{
          width: 100,
          height: 30,
        }}
        source={require("../assets/logo5.png")}
      />
    </View>
  )
}
