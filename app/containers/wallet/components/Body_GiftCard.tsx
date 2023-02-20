//PRINCIPAL
import React from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { compose } from 'redux';
import { Avatar } from '@rneui/themed';
//FUNCTIONS
import { getRequire } from '../../../main/functions'
//HOC
import { withColors } from '../../../main/hoc'

const Component = ({ colors, data }) => {

    //CONSTANTS
    const giftCardMenu = {
        buy: {
            title: 'Buy',
            options: [
                'VISA',
                'BITCOINRECHARGE',
                'MONEYCLICK_1',
                'DISNEYPLUS',
                'NETFLIX',
                'HBOMAX',
                'GOOGLE',
                'APPLE',
                'AMAZON'
            ]
        },
        redeem: {
            title: 'Redeem',
            options: [
                'BITCOINRECHARGE',
                'MONEYCLICK_1'
            ]
        }
    }
    
    //PRINCIPAL RENDER
    return (
        <View
            style={{
                alignSelf: 'center',
                marginTop: 10,
                padding: 20,
                borderRadius: 20,
                width: Dimensions.get('window').width * 0.9,
                alignItems: 'center',
                backgroundColor: colors.primaryBackground
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 15
                }}
            >
                <Text
                    style={{
                        fontSize: 14,
                        color: colors.text,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        flex: 0.2
                    }}>
                    {giftCardMenu.buy.title}
                </Text>
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        shadowColor: "grey",
                        shadowOffset: { width: 1, height: 3 },
                        shadowOpacity: 0.8,
                        shadowRadius: 2,
                        flex: 0.8
                    }}>
                    {giftCardMenu.buy.options.map((item, key) => {
                        return (
                            <TouchableOpacity
                                key={key}
                                onPress={() => {
                                    //navigateStore.dispatch({ type: NAVIGATE, payload: { target: 'GiftCardBuyScreen', selectedGiftCardType: item } })
                                }}
                            >
                                <Avatar
                                    size={50}
                                    rounded
                                    source={getRequire(item)}
                                    overlayContainerStyle={{
                                        backgroundColor: 'white',
                                    }}
                                />
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 10
                }}
            >
                <Text
                    style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: colors.text,
                        flex: 0.2
                    }}>
                    {giftCardMenu.redeem.title}
                </Text>
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        shadowColor: "grey",
                        shadowOffset: { width: 1, height: 3 },
                        shadowOpacity: 0.8,
                        shadowRadius: 2,
                        flex: 0.8
                    }}>
                    {giftCardMenu.redeem.options.map((item, key) => {
                        return (
                            <TouchableOpacity
                                key={key}
                                onPress={() => {
                                    //navigateStore.dispatch({ type: NAVIGATE, payload: { target: 'GiftCardRedeemScreen', selectedGiftCardType: item } })
                                }}
                            >
                                <Avatar
                                    size={50}
                                    rounded
                                    source={getRequire(item)}
                                    overlayContainerStyle={{
                                        backgroundColor: 'white',
                                    }}
                                />
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </View>
            {data.length > 0 &&
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 15
                    }}>
                    <TouchableOpacity
                        style={{
                        }}
                        onPress={() => {
                            //navigateStore.dispatch({ type: NAVIGATE, payload: { target: 'GiftCardScreen' } })
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: 'bold',
                                textAlign: 'center',
                                color: colors.text,
                                textDecorationLine: 'underline'
                            }}>
                            My Gift Cards
                        </Text>
                    </TouchableOpacity>
                </View>}
        </View>
    )
};

export default React.memo(compose(withColors)(Component));