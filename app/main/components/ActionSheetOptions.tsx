//PRINCIPAL
import React from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    Dimensions
} from 'react-native';
import { StackActions } from '@react-navigation/native';
import ActionSheet from "react-native-actions-sheet";
import { compose } from 'redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
//HOC
import { withColors, withNavigation, withRoute, withUserName } from '../hoc';

const Component = ({ customRef, navigation, route, colors, userName }) => {

    //INITIAL CONSTANTS
    const OPTIONS = [
        {
            icon: 'Text__C__24__SELECTED_COLOR',
            title: 'Crypto',
            buttons: [
                {
                    icon: 'Text__RECEIVE__12__SELECTED_COLOR',
                    onPress: () => {
                        navigation.dispatch(StackActions.push('CryptoReceiveScreen', { ...route.params }))
                        customRef.current?.setModalVisible(false)
                    }
                },
                {
                    icon: 'Text__SEND__12__SELECTED_COLOR',
                    onPress: () => {
                        navigation.dispatch(StackActions.push('CryptoSendScreen', { ...route.params }))
                        customRef.current?.setModalVisible(false);
                    }
                },
                {
                    icon: 'Text__SELL__12__SELECTED_COLOR',
                    onPress: () => {
                        navigation.dispatch(StackActions.push('CryptoSellScreen', { ...route.params }))
                        customRef.current?.setModalVisible(false);
                    }
                },
                {
                    icon: 'Text__BUY__12__SELECTED_COLOR',
                    onPress: () => {
                        navigation.dispatch(StackActions.push('CryptoBuyScreen', { ...route.params }))
                        customRef.current?.setModalVisible(false);
                    }
                }
            ]
        },
        {
            icon: 'Text__M__24__SELECTED_COLOR',
            title: 'Money Calls',
            buttons: [
                {
                    icon: 'Text__CREATE__14__SELECTED_COLOR',
                    onPress: () => {
                        navigation.dispatch(StackActions.push('MoneyCallsCreateScreen', { ...route.params }))
                        customRef.current?.setModalVisible(false)
                    }
                },
                {
                    icon: 'Text__BLOCKED_USERS__14__SELECTED_COLOR',
                    onPress: () => {
                        //navigation.dispatch(StackActions.push('ShortsCreateScreen', { ...route.params }))
                        customRef.current?.setModalVisible(false)
                    }
                }
            ]
        },
        {
            icon: 'Text__P__24__SELECTED_COLOR',
            title: 'P2P Orders',
            buttons: [
                {
                    icon: 'Text__POST__12__SELECTED_COLOR',
                    onPress: () => {
                        navigation.dispatch(StackActions.push('OrdersPostScreen', { ...route.params }))
                        customRef.current?.setModalVisible(false)
                    }
                },
                {
                    icon: 'Text__LIST__12__SELECTED_COLOR',
                    onPress: () => {
                        navigation.dispatch(StackActions.push('OrdersScreen', { ...route.params }))
                        customRef.current?.setModalVisible(false)
                    }
                },
                {
                    icon: 'Text__BUY__12__SELECTED_COLOR',
                    onPress: () => {
                        //navigation.dispatch(StackActions.push('ShortsCreateScreen', { ...route.params }))
                        customRef.current?.setModalVisible(false)
                    }
                },
                {
                    icon: 'Text__SELL__12__SELECTED_COLOR',
                    onPress: () => {
                        //navigation.dispatch(StackActions.push('ShortsScreen', { ...route.params }))
                        customRef.current?.setModalVisible(false);
                    }
                }
            ]
        },
        {
            icon: 'Text__E__24__SELECTED_COLOR',
            title: 'Exchange Orders',
            buttons: [
                {
                    icon: 'Text__LIST__14__SELECTED_COLOR',
                    onPress: () => {
                        //navigation.dispatch(StackActions.push('ShortsCreateScreen', { ...route.params }))
                        customRef.current?.setModalVisible(false)
                    }
                },
                {
                    icon: 'Text__BOOK__14__SELECTED_COLOR',
                    onPress: () => {
                        navigation.dispatch(StackActions.push('OrdersBookScreen', { ...route.params }))
                        customRef.current?.setModalVisible(false)
                    }
                }
            ]
        },
        {
            icon: 'Text__D__24__SELECTED_COLOR',
            title: 'Debit Cards',
            buttons: [
                {
                    icon: 'Text__REQUEST__14__SELECTED_COLOR',
                    onPress: () => {
                        navigation.dispatch(StackActions.push('DebitCardsRequestScreen', { ...route.params }))
                        customRef.current?.setModalVisible(false)
                    }
                },
                {
                    icon: 'Text__LIST__14__SELECTED_COLOR',
                    onPress: () => {
                        navigation.dispatch(StackActions.push('DebitCardsScreen', { ...route.params }))
                        customRef.current?.setModalVisible(false);
                    }
                }
            ]
        },
        {
            icon: 'Text__F__24__SELECTED_COLOR',
            title: 'Fiat',
            buttons: [
                {
                    icon: 'Text__FAST_CHANGE__12__SELECTED_COLOR',
                    onPress: () => {
                        navigation.dispatch(StackActions.push('FastChangeScreen', { ...route.params, balanceType: 'FIAT' }))
                        customRef.current?.setModalVisible(false)
                    }
                },
                {
                    icon: 'Text__TRANSFER__12__SELECTED_COLOR',
                    onPress: () => {
                        navigation.dispatch(StackActions.push('FiatBankTransfersScreen', { ...route.params }))
                        customRef.current?.setModalVisible(false)
                    }
                },
                {
                    icon: 'Text__DEPOSIT__12__SELECTED_COLOR',
                    onPress: () => {
                        navigation.dispatch(StackActions.push('FiatBankDepositsScreen', { ...route.params }))
                        customRef.current?.setModalVisible(false)
                    }
                }
            ]
        }
    ]
    /*const OPTIONS = [
        {
            icon: 'MaterialCommunityIcons__play-box-multiple__20__SELECTED_COLOR',
            title: 'Shorts',
            buttons: [
                {
                    type: 'ADD', icon: 'Ionicons__ios-add-circle__30__THEME_COLOR',
                    onPress: () => {
                        navigation.dispatch(StackActions.push('ShortsCreateScreen', { ...route.params }))
                        customRef.current?.setModalVisible(false)
                    }
                },
                {
                    type: 'LIST', icon: 'Ionicons__ios-list-sharp__30__THEME_COLOR',
                    onPress: () => {
                        navigation.dispatch(StackActions.push('ShortsScreen', { ...route.params }))
                        customRef.current?.setModalVisible(false);
                    }
                }
            ]
        },
        {
            icon: 'MaterialCommunityIcons__medal__20__SELECTED_COLOR',
            title: 'Premium Content',
            buttons: [
                {
                    type: 'ADD', icon: 'Ionicons__ios-add-circle__30__THEME_COLOR',
                    onPress: () => {
                        navigation.dispatch(StackActions.push('UserDataGalleryScreen', { ...route.params, selectedUserName: userName, selectedGalleryType: 'premiumGallery__ADD' }))
                        customRef.current?.setModalVisible(false);
                    }
                },
                {
                    type: 'LIST', icon: 'Ionicons__ios-list-sharp__30__THEME_COLOR',
                    onPress: () => {
                        navigation.dispatch(StackActions.push('UserDataGalleryScreen', { ...route.params, selectedUserName: userName, selectedGalleryType: 'premiumGallery' }))
                        customRef.current?.setModalVisible(false);
                    }
                }
            ]
        },
        {
            icon: 'Ionicons__ios-radio__20__SELECTED_COLOR',
            title: 'Live Streaming',
            buttons: [
                {
                    type: 'ADD', icon: 'Ionicons__ios-add-circle__30__THEME_COLOR',
                    onPress: () => {
                        navigation.dispatch(StackActions.push('LiveStreamingCreateScreen', { ...route.params }))
                        customRef.current?.setModalVisible(false);
                    }
                },
                {
                    type: 'LIST', icon: 'Ionicons__ios-list-sharp__30__THEME_COLOR',
                    onPress: () => {
                        navigation.dispatch(StackActions.push('LiveStreamingScreen', { ...route.params }))
                        customRef.current?.setModalVisible(false);
                    }
                }
            ]
        },
        {
            icon: 'MaterialCommunityIcons__cellphone__20__SELECTED_COLOR',
            title: 'Paid Calls',
            buttons: [
                {
                    type: 'ADD', icon: 'Ionicons__ios-add-circle__30__THEME_COLOR',
                    onPress: () => {
                        navigation.dispatch(StackActions.push('MoneyCallsCreateScreen', { ...route.params }))
                        customRef.current?.setModalVisible(false);
                    }
                },
                {
                    type: 'LIST', icon: 'Ionicons__ios-list-sharp__30__THEME_COLOR',
                    onPress: () => {
                        navigation.dispatch(StackActions.push('MoneyCallsScreen', { ...route.params }))
                        customRef.current?.setModalVisible(false);
                    }
                }
            ]
        },
        {
            icon: 'MaterialCommunityIcons__podcast__20__SELECTED_COLOR',
            title: 'Podcasts/TV shows',
            buttons: [
                {
                    type: 'LIST', icon: 'Ionicons__ios-list-sharp__30__THEME_COLOR',
                    onPress: () => {
                        navigation.dispatch(StackActions.push('BroadcastingScreen', { ...route.params }))
                        customRef.current?.setModalVisible(false);
                    }
                }
            ]
        }
    ]*/

    //COMPONENTS
    const getIcon = (icon) => {
        if (icon === 'N/A') {
            return <></>
        }
        switch (icon.split('__')[0]) {
            case 'MaterialCommunityIcons':
                return (
                    <MaterialCommunityIcons
                        name={icon.split('__')[1]}
                        color={icon.split('__')[3] === 'SELECTED_COLOR' ? colors.getRandomMain() : colors.icon}
                        size={Number(icon.split('__')[2])}
                    />
                )
            case 'Ionicons':
                return (
                    <Ionicons
                        name={icon.split('__')[1]}
                        color={icon.split('__')[3] === 'SELECTED_COLOR' ? colors.getRandomMain() : colors.icon}
                        size={Number(icon.split('__')[2])}
                    />
                )
            case 'Text':
                return (
                    <Text
                        style={{
                            color: icon.split('__')[3] === 'SELECTED_COLOR' ? colors.getRandomMain() : colors.icon,
                            fontSize: Number(icon.split('__')[2]),
                            fontWeight: 'bold',
                            //textDecorationLine: 'underline'
                        }}
                    >
                        {icon.split('__')[1].replace('_', ' ')}
                    </Text>
                )
        }

    }

    //PRINCIPAL RENDER
    return (
        <ActionSheet
            ref={customRef}
            containerStyle={{
                backgroundColor: colors.primaryBackground,

                width: Dimensions.get('window').width
            }}
            onClose={() => {
                //console.log('>>>>>>>>>>>>>>>>close')
            }}
        >
            <View
                style={{
                    height: 320,
                    padding: 20,
                }}
            >
                {OPTIONS.map((item, index) => {
                    return (
                        <View
                            key={index}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 10
                            }}
                        >
                            <View
                                style={{
                                    height: 40,
                                    width: 40,
                                    borderRadius: 20,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: colors.secundaryBackground
                                }}
                            >
                                {getIcon(item.icon)}
                            </View>
                            <Text
                                style={{
                                    color: colors.text,
                                    fontWeight: 'bold',
                                    marginLeft: 7,
                                    fontSize: 16
                                }}
                            >
                                {item.title}
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    position: 'absolute',
                                    right: 0
                                }}
                            >
                                {item?.buttons?.map((it, ind) => {
                                    return (
                                        <TouchableOpacity
                                            key={ind}
                                            onPress={it.onPress}
                                            style={{
                                                marginLeft: 15,
                                            }}
                                        >
                                            {getIcon(it.icon)}
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        </View>
                    )
                })}
            </View>
        </ActionSheet>
    )
};

export default React.memo(compose(withNavigation, withRoute, withColors, withUserName)(Component));
