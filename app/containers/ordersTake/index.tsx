import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { compose } from "redux";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackActions } from "@react-navigation/native";
//HOC
import { withColors, withDetailedBalances, withUserName } from "../../main/hoc";
//COMPONENTS
import Header from '../../main/components/Header'
import Body from '../../main/components/Body'
import Body_Input from '../../main/components/Body_Input'
import Body_TextRight from '../../main/components/Body_TextRight'
import Body_Payment from '../../main/components/Body_Payment'
import Body_Button from "../../main/components/Body_Button";
import Modal_Transaction from "../../main/components/Modal_Transaction";
//HOOKS
import { getCharges } from "../../main/hooks/getCharges";

const OrdersTakeScreen = ({ navigation, route, colors, userName, detailedBalances }) => {

    //INITIAL STATES
    const [fiatCurrency, setFiatCurrency] = useState(detailedBalances.find(currency => currency.value === route.params.selectedOrder.fiatCurrencyValue))
    const [cryptoCurrency, setCryptoCurrency] = useState(detailedBalances.find(currency => currency.value === route.params.selectedOrder.cryptoCurrencyValue))
    const [fiatCurrencyAmount, setFiatCurrencyAmount] = useState(route.params.selectedOrder.fiatCurrencyAmount !== undefined ? Number(route.params.selectedOrder.fiatCurrencyAmount) : 0)
    const [cryptoCurrencyAmount, setCryptoCurrencyAmount] = useState(route.params.selectedOrder.cryptoCurrencyAmount !== undefined ? Number(route.params.selectedOrder.cryptoCurrencyAmount) : 0)
    const [isVisibleModalTransaction, setIsVisibleModalTransaction] = useState(false)

    //HOOKS CALLS
    const { data: dataCharges, error: errorCharges, isLoading: isLoadingCharges } =
        getCharges(
            fiatCurrency?.value,
            null,
            fiatCurrencyAmount > 0 ? fiatCurrencyAmount : fiatCurrency?.availableBalance,
            null,
            fiatCurrency?.availableBalance,
            'MC_TAKE_MESSAGE_OFFER',
            null
        )

    //EFFECTS
    useEffect(() => {
        console.log('OrdersTakeScreen', route.params)
    }, [])

    //MEMOS
    const maxAmount = useMemo(() => {
        return cryptoCurrency.availableBalance
    }, [cryptoCurrency])

    const infoMessages = useMemo(() => {
        const messages: any[] = []
        if (route.params.selectedOrder.operationType === 'BUY') {
            messages.push(
                { color: 'green', text: 'You have 45 minutes to make the payment to the account that you will see in orders section at pay button.' }
            )
            messages.push(
                { color: 'blue', text: 'The other user has 30 minutes to release your crypto after you pay.' }
            )
        }
        if (route.params.selectedOrder.operationType === 'SELL') {
            messages.push(
                { color: 'green', text: 'The other user has 45 minutes to make the payment to the account that you gave to the operation.' }
            )
            messages.push(
                { color: 'blue', text: 'you have 30 minutes to release crypto after receive payment.' }
            )
        }
        return messages
    }, [])

    const modalData = useMemo(() => {
        let data: any = [];
        data.push(
            {
                title: 'Operation Type:',
                type: 'TEXT',
                value: route.params.selectedOrder.operationType,
            }
        );
        data.push(
            {
                title: 'Amount to Take:',
                type: 'NUMERIC',
                value: fiatCurrencyAmount,
                valuePreffix: '',
                valueSuffix: fiatCurrency.value,
                valueDecimals: fiatCurrency.decimals
            }
        );
        data.push(
            {
                title: 'Price:',
                type: 'NUMERIC',
                value: route.params.selectedOrder.price,
                valuePreffix: '',
                valueSuffix: fiatCurrency.value + '/' + cryptoCurrency.value,
                valueDecimals: fiatCurrency.decimals
            }
        );
        if (route.params.selectedPayment !== undefined) {
            data.push(
                {
                    title: 'Recipient Payment:',
                    type: 'JSON',
                    value: route.params.selectedPayment,
                }
            );
        }
        /*if (dataCharges?.COMMISSION.amount !== undefined && dataCharges?.COMMISSION.amount !== 0 && operationType === 'SEND_OUT') {
            data.push(
                {
                    title: 'Commission:',
                    type: 'NUMERIC',
                    value: dataCharges?.COMMISSION.amount,
                    valuePreffix: '',
                    valueSuffix: currency.value,
                    valueDecimals: currency.decimals
                }
            );
        }*/
        return data;
    }, [fiatCurrencyAmount, fiatCurrency, cryptoCurrency])

    //CALLBACKS
    const onChangeTextFiatCurrencyAmount = useCallback((maskedText, rawText) => {
        if ((Number(maxAmount) < Number(rawText / route.params.selectedOrder.price)) && route.params.selectedOrder.operationType === 'SELL') {
            setCryptoCurrencyAmount(Number(maxAmount))
            setFiatCurrencyAmount(Number(maxAmount * route.params.selectedOrder.price))
        } else {
            setCryptoCurrencyAmount(Number(rawText / route.params.selectedOrder.price))
            setFiatCurrencyAmount(Number(rawText))
        }
    }, [maxAmount])

    const onChangeTextCryptoCurrencyAmount = useCallback((maskedText, rawText) => {
        if ((Number(maxAmount) < Number(rawText)) && route.params.selectedOrder.operationType === 'SELL') {
            setCryptoCurrencyAmount(Number(maxAmount))
            setFiatCurrencyAmount(Number(maxAmount * route.params.selectedOrder.price))
        } else {
            setCryptoCurrencyAmount(Number(rawText))
            setFiatCurrencyAmount(Number(rawText * route.params.selectedOrder.price))
        }
    }, [maxAmount])

    const renderTextPrice = useCallback((value) => (
        <Text
            style={{
                fontSize: 12,
                fontWeight: 'bold',
                marginTop: 5,
                color: colors.text
            }}>
            {'1 ' +
                cryptoCurrency.value +
                ' = ' +
                value +
                ' ' +
                fiatCurrency.value}
        </Text>
    ), [cryptoCurrency, fiatCurrency])

    const onPressTakeOrder = useCallback(() => {
        if (fiatCurrencyAmount < Number(route.params.selectedOrder.minAmount) ||
            fiatCurrencyAmount > Number(route.params.selectedOrder.maxAmount)) {
            Alert.alert(
                "Operation Error",
                "You need to enter an " + 'AMOUNT' +
                " between min and max to complete operation.",
                [{ text: "Ok" }]
            );
            return
        }
        if (route.params.selectedOrder.operationType === 'SELL' && route?.params?.selectedPayment === undefined) {
            Alert.alert(
                "Operation Error",
                "You need to select " + 'PAYMENT' +
                " to complete operation.",
                [{ text: "Ok" }]
            );
            return
        }
        setIsVisibleModalTransaction(true)
    }, [fiatCurrencyAmount])

    const onPressCancel = useCallback(() => {
        setIsVisibleModalTransaction(false)
    }, [])

    const onPressClose = useCallback(() => {
        setIsVisibleModalTransaction(false)
        navigation.dispatch(StackActions.popToTop())
    }, [])

    const process = () => {
        /*mutateCryptoSend({
            userName: userName,
            currency: currency.value,
            amount: amount,
            targetAddress: address,
            additionalInfo: description,
            paymentType: currencyProtocol !== '' ? getCryptoPaymentType(currencyProtocol) : null
        })*/
    }

    //PRINCIPAL RENDER
    return (
        <>
            <Header
                currency={cryptoCurrency}
                targetImg={fiatCurrency.img}
                maxAmount={maxAmount}
                amount={cryptoCurrencyAmount}
                invertImages={route.params.selectedOrder.operationType === 'BUY'}
                showBalance={route.params.selectedOrder.operationType === 'SELL'}
            />
            <Body>
                <>
                    <View
                        style={{
                            marginTop: 10,
                            borderRadius: 10,
                            borderColor: colors.border,
                            borderWidth: 1,
                            padding: 10
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    color: route.params.selectedOrder.operationType === 'BUY' ? 'green' : 'red'
                                }}
                            >
                                {route.params.selectedOrder.operationType}
                            </Text>
                            <Text
                                style={{
                                    color: colors.text,
                                }}
                            >
                                {route.params.selectedOrder.paymentType}
                            </Text>
                            <Text
                                style={{
                                    color: colors.text,
                                }}
                            >
                                {Number(route.params.selectedOrder.minAmount).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} - {Number(route.params.selectedOrder.maxAmount).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {fiatCurrency.value}
                            </Text>
                        </View>
                        {route.params.selectedOrder.conditions !== undefined &&
                            <View
                                style={{
                                    marginTop: 10,
                                    borderRadius: 10,
                                    backgroundColor: colors.primaryBackground,
                                    padding: 10
                                }}
                            >
                                <Text
                                    style={{
                                        color: colors.text,
                                    }}
                                >
                                    {route.params.selectedOrder.conditions}
                                </Text>
                            </View>
                        }
                    </View>
                    <View
                        style={{
                            marginTop: 10
                        }}
                    >
                        <Body_Input
                            value={fiatCurrencyAmount}
                            onChangeText={onChangeTextFiatCurrencyAmount}
                            options={{
                                precision: fiatCurrency.decimals,
                                separator: '.',
                                delimiter: ',',
                                unit: fiatCurrency.symbol + ' ',
                                prefixUnit: fiatCurrency.symbol + ' ',
                            }}
                            placeholder={'Amount'}
                            type={'money'}
                        />
                        <Body_Input
                            value={cryptoCurrencyAmount}
                            onChangeText={onChangeTextCryptoCurrencyAmount}
                            options={{
                                precision: cryptoCurrency.decimals,
                                separator: '.',
                                delimiter: ',',
                                unit: cryptoCurrency.symbol + ' ',
                                prefixUnit: cryptoCurrency.symbol + ' ',
                            }}
                            placeholder={'Amount'}
                            type={'money'}
                        />
                        <Body_TextRight
                            value={route.params.selectedOrder.price}
                            decimalScale={2}
                            renderText={renderTextPrice}
                        />
                    </View>
                    {route.params.selectedOrder.operationType === 'SELL' &&
                        <>
                            <TouchableOpacity
                                onPress={() => {
                                    const selectedOrder = { ...route.params.selectedOrder, fiatCurrencyAmount: fiatCurrencyAmount, cryptoCurrencyAmount: cryptoCurrencyAmount }
                                    navigation.dispatch(StackActions.push('FiatBankPaymentsScreen', { ...route.params, selectedCurrency: fiatCurrency, selectedOrder: selectedOrder, replaceTarget: 'OrdersTakeScreen' }))
                                }}
                                style={{
                                    marginTop: 20,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: colors.getRandomMain(),
                                    padding: 10,
                                    borderRadius: 10
                                }}
                            >
                                <Text
                                    style={{
                                        color: 'white',
                                        fontSize: 16,
                                        marginRight: 10
                                    }}
                                >
                                    {'Select Payment'}
                                </Text>
                                <MaterialCommunityIcons
                                    name="notebook"
                                    color={'white'}
                                    size={16}
                                />
                            </TouchableOpacity>
                            {route.params.selectedPayment !== undefined &&
                                <Body_Payment
                                    item={route.params.selectedPayment}
                                    marginTop={10}
                                />
                            }
                        </>
                    }
                    <Body_Button
                        onPress={onPressTakeOrder}
                        label={'TAKE ORDER'}
                    />
                </>
            </Body>
            <Modal_Transaction
                data={modalData}
                isVisible={isVisibleModalTransaction}
                label={'TAKE ORDER'}
                infoMessages={infoMessages}
                process={process}
                //isSuccess={isSuccessTakeOrder}
                //isError={isErrorTakeOrder}
                isSuccess={true}
                isError={false}
                onPressCancel={onPressCancel}
                onPressClose={onPressClose}
                allowSecongAuthStrategy={false}
            />
        </>
    )

}

export default React.memo(compose(withColors, withUserName, withDetailedBalances)(OrdersTakeScreen))