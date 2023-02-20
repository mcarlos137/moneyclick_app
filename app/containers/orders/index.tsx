//PRINCIPAL
import { Tab, TabView } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, RefreshControl, ScrollView, Text, TouchableOpacity, View, } from 'react-native';
import { compose } from 'redux';
import moment from 'moment';
//HOOKS
import { getOrders } from '../../main/hooks/getOrders'
import { closeOrder } from '../../main/hooks/closeOrder'
//COMPONENTS
import ViewInstructions from '../../main/components/ViewInstructions';
import ViewEmptyList from '../../main/components/ViewEmptyList';
//HOC
import { withColors, withUserName } from '../../main/hoc';
import { StackActions } from '@react-navigation/native';

const OrderScreen = ({ navigation, route, colors, userName }) => {

  //CONSTANTS
  const INSTRUCTIONS = [
    { text: 'Orders are created from pair charts in the Financial section.', iconName: '' },
    { text: 'The graphs represent the market activity at the moment.', iconName: '' },
    { text: 'Select the pair and press the link to go to the Order Book.', iconName: '' },
    { text: 'Once you are in the order book you can see the sections for buying the green background and selling the red background.', iconName: '' },
    { text: 'Select the operation you wish to carry out and choose whether you accept the market price for the amount or you want to propose your own price.', iconName: '' },
    { text: 'The orders created at the market price are executed automatically and those at the price set by the user are presented for other users to take and will depend on the consent of the counterparty.', iconName: '' },
    { text: 'After setting the price and quantity, you must indicate the time that the order will be active. After that time has elapsed, the order will be closed automatically.', iconName: '' },
    { text: 'The user must take into account that he needs to have an available balance to generate the order.', iconName: '' },
    { text: 'For advanced trading users there is the option to add the order to a specific subscription. Once that order is added to a subscription, all subscribed users will be informed of the generated pair, price and trade type.', iconName: '' },
  ]

  //INITIAL STATES
  const [selectedTab, setSelectedTab] = useState(0)

  //HOOK CALLS
  const { isLoading: isLoadingOrdersCurrent, data: dataOrdersCurrent, error: errorOrdersCurrent, isFetched: isFetchedOrdersCurrent, isFetching: isFetchingOrdersCurrent } =
    getOrders(userName, null, null, null, false)

  const { isLoading: isLoadingOrdersOld, data: dataOrdersOld, error: errorOrdersOld, isFetched: isFetchedOrdersOld, isFetching: isFetchingOrdersOld } =
    getOrders(userName, null, null, null, true)

  const { mutate: mutateCloseOrder } =
    closeOrder()

  //EFFECTS
  useEffect(() => {
    console.log('OrderScreen', route.params)
    setSelectedTab(0)
  }, []);

  //FUNCTIONS
  const getAmountSuffix = (pair, operationType) => {
    if (pair.startsWith('BTC')) {
      if (operationType === 'ASK') {
        return 'BTC'
      } else {
        return pair.replace('BTC', '')
      }
    }
    if (pair.startsWith('ETH')) {
      if (operationType === 'ASK') {
        return 'ETH'
      } else {
        return pair.replace('ETH', '')
      }
    }
    if (pair.startsWith('USDT')) {
      if (operationType === 'ASK') {
        return 'USDT'
      } else {
        return pair.replace('USDT', '')
      }
    }
    return ''
  }

  const getPriceSuffix = (pair) => {
    if (pair.startsWith('BTC')) {
      return pair.replace('BTC', '') + '/' + 'BTC'
    }
    if (pair.startsWith('ETH')) {
      return pair.replace('ETH', '') + '/' + 'ETH'
    }
    if (pair.startsWith('USDT')) {
      return pair.replace('USDT', '') + '/' + 'USDT'
    }
    return ''
  }

  const getTimeLeft = (timestamp, time, timeUnit) => {
    const timeLeftInMinutes = Math.trunc(new Date(timestamp).getTime() / (1000 * 60)) + (24 * 60) - Math.trunc((new Date().getTime()) / (1000 * 60))
    if (timeLeftInMinutes >= 60) {
      return Math.trunc(timeLeftInMinutes / 60) + ' hours'
    }
    return timeLeftInMinutes + ' minutes'
  }

  //COMPONENTS
  const renderItem = (item, index, cancelAllowed) => {
    return (
      <View
        key={index}
        style={{
          padding: 10,
          borderRadius: 10,
          marginTop: 10,
          backgroundColor: index % 2 === 0 ? colors.primaryBackground : colors.secundaryBackground,
          borderColor: item.operationType === 'ASK' ? 'green' : 'red',
          borderWidth: 2
        }}
      >
        <View
          style={{
            flexDirection: 'row',
          }}
        >
          <View
            style={{
              flex: 0.75
            }}
          >
            {renderField('Operation:', item.operationType)}
            {renderField('Payment:', item.paymentType !== undefined ? item.paymentType : 'N/A')}
            {renderField('Side:', item.postUserName === userName ? 'POSTER' : 'TAKER')}
            {renderField('Initial Amount:', item.operationType === 'ASK' && (item.pair.includes('BTC') || item.pair.includes('ETH')) ? Number(item.amount).toFixed(8) + ' ' + getAmountSuffix(item.pair, item.operationType) : Number(item.amount).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' ' + getAmountSuffix(item.pair, item.operationType))}
            {renderField('Current Price:', Number(item.price).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' ' + getPriceSuffix(item.pair))}
            {item.priceMargin !== undefined && renderField('Price Margin:', item.priceMargin.toFixed(2) + ' %')}
            {renderField('Dynamic Price:', item.priceMargin !== undefined ? 'Yes' : 'No')}
            {!item.closed && renderField('Time Left:', getTimeLeft(item.timestamp, item.time, item.timeUnit))}
          </View>
          <View
            style={{
              flex: 0.25
            }}
          >
            <TouchableOpacity
              style={{
                padding: 10,
                backgroundColor: colors.getRandomMain(),
                borderRadius: 10,
                marginBottom: 5,
                alignItems: 'center'
              }}
              onPress={() => {
                navigation.dispatch(StackActions.push('OrdersDetailsScreen', { ...route.params }))
              }}
            >
              <Text
                style={{
                  color: 'white',
                  fontSize: 10,
                  fontWeight: 'bold'
                }}
              >
                DETAILS
              </Text>
            </TouchableOpacity>
            {cancelAllowed &&
              <TouchableOpacity
                style={{
                  padding: 10,
                  backgroundColor: colors.getRandomMain(),
                  borderRadius: 10,
                  alignItems: 'center'
                }}
                onPress={() => {
                  Alert.alert(
                    'Close order',
                    'Are you sure to close selected order?',
                    [
                      { text: "No", style: 'cancel', onPress: () => { } },
                      {
                        text: 'Yes',
                        style: 'destructive',
                        onPress: () => {
                          mutateCloseOrder({
                            userName: userName,
                            id: item.id,
                            pair: item.pair,
                            operationType: item.operationType
                          })
                        },
                      },
                    ]
                  );
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontSize: 11,
                    fontWeight: 'bold'
                  }}
                >
                  CLOSE
                </Text>
              </TouchableOpacity>
            }
          </View>
        </View>
        <View
          style={{
            alignItems: 'flex-end',
            marginTop: 10
          }}
        >
          <Text
            style={{
              marginRight: 3,
              fontWeight: 'bold',
              fontSize: 11,
              color: colors.text
            }}
          >
            {moment(new Date(item.timestamp)).format(
              'DD/MM hh:mm a'
            )}
          </Text>
        </View>
      </View>
    )
  }

  const renderField = (title, value) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginTop: 3
        }}
      >
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 12,
            flex: 0.4,
            color: colors.text
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontSize: 12,
            flex: 0.6,
            color: value === 'ASK' ? 'green' : value === 'BID' ? 'red' : colors.text
          }}
        >
          {value}
        </Text>
      </View>
    )
  }

  //PRINCiPAL RENDER
  return (
    <View style={{
      width: Dimensions.get('window').width * 0.95,
      alignSelf: 'center',
      height: '100%'
    }}>
      <Tab
        value={selectedTab}
        onChange={(index) => {
          setSelectedTab(index)
        }}
        indicatorStyle={{
          backgroundColor: colors.getRandomMain(),
          height: 5,
        }}
      >
        <Tab.Item
          title={'CURRENT'}
          titleStyle={{
            fontSize: 12,
            color: colors.text,
            fontWeight: selectedTab === 0 ? "bold" : "normal",
          }}
          buttonStyle={{
            backgroundColor: colors.background,
            borderColor: colors.getRandomMain(),
          }}
        />
        <Tab.Item
          title={'OLD'}
          titleStyle={{
            fontSize: 12,
            color: colors.text,
            fontWeight: selectedTab === 1 ? "bold" : "normal",
          }}
          buttonStyle={{
            backgroundColor: colors.background,
            borderColor: colors.getRandomMain(),
          }}
        />
      </Tab>
      <TabView
        value={selectedTab}
        onChange={index => setSelectedTab(index)}
        animationType="spring"
      >
        <TabView.Item style={{ width: Dimensions.get('window').width * 0.95, paddingLeft: 10, paddingRight: 10 }}>
          {isFetchedOrdersCurrent && dataOrdersCurrent.length === 0 ?
            <ViewInstructions
              instructions={INSTRUCTIONS}
              type={'STEPS'}
              width={Dimensions.get('window').width * 0.95}
              marginTop={10}
            />
            :
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={isFetchingOrdersCurrent || isLoadingOrdersCurrent}
                />
              }
              style={{
                marginBottom: 10,
              }}
            >
              {dataOrdersCurrent.map((item, index) => renderItem(item, index, true))}
            </ScrollView>
          }
        </TabView.Item>
        <TabView.Item style={{ width: Dimensions.get('window').width * 0.95, paddingLeft: 10, paddingRight: 10 }}>
          {isFetchedOrdersOld && dataOrdersOld.length === 0 ?
            <ViewEmptyList
              iconName='list-circle-outline'
              iconFamily='ION'
              message={'There is no old orders'}
              top={30}
              position={'relative'}
              color='gray'
            />
            :
            <ScrollView
              style={{
                marginBottom: 10
              }}
              refreshControl={
                <RefreshControl
                  refreshing={isFetchingOrdersOld || isLoadingOrdersOld}
                />
              }
            >
              {dataOrdersOld.map((item, index) => renderItem(item, index, false))}
            </ScrollView>
          }
        </TabView.Item>
      </TabView>
    </View >
  );
};

export default React.memo(compose(withColors, withUserName)(OrderScreen));
