import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, View, Image, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { compose } from 'redux'
import { StackActions } from '@react-navigation/native';
//COMPONENTS
import WalletScreen from '../../app/containers/wallet';
//HOC
import { withColors } from '../../app/main/hoc';

const WalletStack = createStackNavigator();

const WalletStackScreen = ({ navigation, route, colors }) => {

    return (
        <WalletStack.Navigator screenOptions={{
            headerTransparent: true,
            headerTitleAlign: 'center',
            headerTitleStyle: {
                fontWeight: 'bold',
            }
        }}>
            <WalletStack.Screen name="WalletScreen" component={WalletScreen} options={{
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
                        {/*<TouchableOpacity
                            style={{
                                width: 32,
                                height: 32,
                                backgroundColor: colors.secundaryBackground,
                                borderRadius: 16,
                                marginRight: 5,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onPress={() => {
                                navigation.dispatch(StackActions.push('MoneyMarketScreen', { ...route.params }))
                            }}
                        >
                            <MaterialCommunityIcons
                                name="chart-waterfall"
                                size={22}
                                color={colors.icon}
                            />
                        </TouchableOpacity>*/}
                        {/*<TouchableOpacity
                            style={{
                                width: 32,
                                height: 32,
                                backgroundColor: colors.secundaryBackground,
                                borderRadius: 16,
                                marginRight: 5,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onPress={() => {
                                //walletStore.dispatch({ type: OPEN_SEARCH_MODAL, payload: true })
                            }}
                        >
                            <Text
                                style={{
                                    color: colors.text,
                                    fontWeight: 'bold',
                                    fontSize: 12
                                }}
                            >
                                P2P
                            </Text>
                            </TouchableOpacity>*/}
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
                                navigation.dispatch(StackActions.push('BalanceMovementsScreen', { ...route.params }))
                            }}
                        >
                            <MaterialCommunityIcons
                                name="file-document"
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
                                        height: 16,
                                        width: 16,
                                        borderRadius: 8,
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
                    </View>
                )
            }} />
        </WalletStack.Navigator>
    )
};

export default React.memo(compose(withColors)(WalletStackScreen))