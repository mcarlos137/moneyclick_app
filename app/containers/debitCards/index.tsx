//PRINCIPAL
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { compose } from 'redux'
//HOC
import { withColors, withUserName } from '../../main/hoc';
//COMPONENTS
import BodyList from '../../main/components/BodyList';
//HOOKS
import { getDebitCards } from '../../main/hooks/getDebitCards';
//FUNCTIONS
import { getDebitCardExpirationDate, getRequire, parseDebitCardNumber } from '../../main/functions';
import { StackActions } from '@react-navigation/native';

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

const DebitCardsScreen = ({ navigation, route, colors, userName }) => {

    //HOOKS CALLS
    const { isLoading: isLoadingDebitCards, data: dataDebitCards, error: errorDebitCards, isFetching: isFetchingDebitCards, refetch: refetchDebitCards } =
        getDebitCards(
            userName,
            null,
            null,
            null,
            null,
            null,
            null,
            null
        )

    //EFFECTS
    useEffect(() => {
        console.log('DebitCardsScreen', route.params)
    }, []);

    //COMPONENTS
    const renderItem = (item) => {
        return (
            <View
                key={item.index}
                style={{
                    flexDirection: item.index % 2 === 1 ? 'row-reverse' : 'row',
                    marginTop: 10,
                }}
            >
                <View
                    style={{
                        alignSelf: 'center',
                        padding: 10,
                        borderRadius: 10,
                        width: Dimensions.get('window').width * 0.75,
                        minHeight: 200,
                        backgroundColor: colors.secundaryBackground
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                alignSelf: 'center',
                                alignItems: 'flex-end',
                            }}
                        >
                            <Image
                                style={{
                                    width: 40,
                                    height: 40,
                                }}
                            //source={{
                            //uri: fileAssetState.uri,
                            //}}
                            />
                        </View>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            alignSelf: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Text
                            style={{
                                color: colors.text,
                                fontSize: 18,
                            }}
                        >
                            {item.item.number !== undefined ? parseDebitCardNumber(item.item.number) : 'XXXX XXXX XXXX XXXX'}
                        </Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'column',
                                flex: 1
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 10,
                                    color: colors.text
                                }}
                            >
                                {'valid thru '}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: colors.text
                                }}
                            >
                                {getDebitCardExpirationDate(item.item.timestamp)}
                            </Text>
                            <Text
                                style={{
                                    color: colors.text
                                }}
                            >
                                {item.item.holderName}
                            </Text>

                        </View>
                        <View
                            style={{
                                flexDirection: 'column',
                                flex: 1,
                                alignItems: 'flex-end'
                            }}
                        >
                            <Image
                                style={{
                                    width: 50,
                                    height: 50,
                                }}
                                source={item.item.type === 'MONEYCLICK' ? getRequire('MONEYCLICK_1') : item.item.type === 'VISA' ? getRequire('VISA') : item.item.type === 'MASTER' ? getRequire('MASTER') : null}
                            />
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: 'column',
                        maxWidth: Dimensions.get('window').width * 0.15,
                        marginRight: item.index % 2 === 1 ? 10 : 0,
                        marginLeft: item.index % 2 === 1 ? 0 : 10,
                        justifyContent: 'center',
                        backgroundColor: colors.primaryBackground,
                        borderRadius: 10,
                        minHeight: 200,
                        padding: 5
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            navigation.dispatch(StackActions.push('DebitCardsInfoScreen', {...route.params, selectedDebitCard: item.item}))
                        }}
                        style={{
                            marginBottom: 8
                        }}
                    >
                        <MaterialCommunityIcons
                            name={'information'}
                            color={colors.icon}
                            size={30}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            marginBottom: 8
                        }}
                        onPress={() => {
                            navigation.dispatch(StackActions.push('DebitCardsAddSubstractBalanceScreen', {...route.params, selectedDebitCard: item.item}))
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 25,
                                color: colors.text,
                                fontWeight: 'bold'
                            }}
                        >
                            +-
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.dispatch(StackActions.push('DebitCardsNewPinScreen', {...route.params, selectedDebitCard: item.item}))
                        }}
                        style={{
                            marginBottom: 8
                        }}
                    >
                        <MaterialCommunityIcons
                            name={'dialpad'}
                            color={colors.icon}
                            size={30}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.dispatch(StackActions.push('DebitCardsBalanceMovementsScreen', {...route.params, selectedDebitCard: item.item}))
                        }}
                    >
                        <Ionicons
                            name="ios-document-text-sharp"
                            color={colors.icon}
                            size={30}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <>
            <BodyList
                data={dataDebitCards}
                keyExtractor={item => String(item.id)}
                renderItem={renderItem}
                refreshing={isLoadingDebitCards || isFetchingDebitCards}
                onRefresh={() => {
                    refetchDebitCards()
                }}
                instructions={INSTRUCTIONS}
            />
        </>
    );
}

export default React.memo(compose(withColors, withUserName)(DebitCardsScreen));
