import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { compose } from "redux";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CheckBox } from '@rneui/themed';
import { StackActions } from "@react-navigation/native";
//HOOKS
import { getCharges } from "../../main/hooks/getCharges";
import { getCryptoPrice } from "../../main/hooks/getCryptoPrice";
import { postOrder } from "../../main/hooks/postOrder";
//COMPONENTS
import Header from '../../main/components/Header'
import Body from "../../main/components/Body";
import Body_Picker from "../../main/components/Body_Picker";
import Body_Input from "../../main/components/Body_Input";
import Body_Button from "../../main/components/Body_Button";
import Modal_Transaction from "../../main/components/Modal_Transaction";
import Body_TextRight from "../../main/components/Body_TextRight";
//HOC
import { withColors, withConfig, withDetailedBalances, withUserName } from "../../main/hoc";
//CONSTANTS
import paymentTypes from '../../constants/paymentTypes'
import minAmounts from "../../constants/minAmounts";
import Body_Payment from "../../main/components/Body_Payment";

const OrdersPostScreen = ({ navigation, route, colors, userName, detailedBalances, config }) => {

    //INITIAL STATES
    const [fiatCurrency, setFiatCurrency] = useState<any>(route.params.selectedOrder !== undefined ? detailedBalances.find(currency => currency.value === route.params.selectedOrder.fiatCurrencyValue) : detailedBalances.find(currency => !currency.isCrypto))
    const [cryptoCurrency, setCryptoCurrency] = useState<any>(route.params.selectedOrder !== undefined ? detailedBalances.find(currency => currency.value === route.params.selectedOrder.cryptoCurrencyValue) : detailedBalances.find(currency => currency.isCrypto))
    const [amount, setAmount] = useState(0.00)
    const [priceMargin, setPriceMargin] = useState(0)
    const [isPriceDynamic, setIsPriceDynamic] = useState(false)
    const [operationType, setOperationType] = useState<'ASK' | 'BID'>('ASK')
    const [paymentType, setPaymentType] = useState(paymentTypes[fiatCurrency.value][0])
    const [conditions, setConditions] = useState('')
    const [isVisibleModalTransaction, setIsVisibleModalTransaction] = useState(false)
    const isMounted = useRef(false)

    //HOOKS CALLS
    const { data: dataCryptoPrice, refetch: refetchCryptoPrice } =
        getCryptoPrice(
            cryptoCurrency.value,
            fiatCurrency.value,
        )

    const { data: dataCharges, error: errorCharges, isLoading: isLoadingCharges } =
        getCharges(
            fiatCurrency?.value,
            null,
            amount > 0 ? amount : operationType === 'ASK' ? cryptoCurrency.availableBalance : fiatCurrency.availableBalance,
            null,
            operationType === 'ASK' ? cryptoCurrency.availableBalance : fiatCurrency.availableBalance,
            'MC_POST_MESSAGE_OFFER',
            null
        )

    const { mutate: mutatePostOrder, isSuccess: isSuccessPostOrder, isError: isErrorPostOrder } =
        postOrder()

    //EFFECTS
    useEffect(() => {
        console.log('OrdersPostScreen', route.params)
    }, [])

    useEffect(() => {
        if (!isMounted.current) {
            return
        }
        setPriceMargin(0)
        setAmount(0)
        setPaymentType(paymentTypes[fiatCurrency.value][0])
        delete route.params.selectedPayment
    }, [operationType, fiatCurrency, cryptoCurrency])

    useEffect(() => {
        operationType === 'ASK' ?
            detailedBalances.find(currency => currency.value === fiatCurrency.value)
            :
            detailedBalances.find(currency => currency.value === cryptoCurrency.value)
        isMounted.current = true
    }, [operationType])

    //MEMOS
    const maxAmount = useMemo(() =>
        operationType === 'BID' ? (dataCharges?.COMMISSION?.maxOperationAmount !== undefined ? dataCharges.COMMISSION.maxOperationAmount : fiatCurrency.availableBalance) : cryptoCurrency.availableBalance
        , [dataCharges, fiatCurrency, operationType])


    const userPrice = useMemo(() => {
        return operationType === 'ASK' ? Number(dataCryptoPrice.ask + (dataCryptoPrice.ask * priceMargin / 100)) : Number(dataCryptoPrice.bid - (dataCryptoPrice.bid * priceMargin / 100))
    }, [operationType, dataCryptoPrice, priceMargin])

    const infoMessages = useMemo(() => {
        const messages = [
            { color: 'green', text: 'Your order will be available for the next 24 hours. After that you have to post a new one.' }
        ]
        if (isPriceDynamic) {
            messages.push(
                { color: 'red', text: 'Your price will change dynamically around ref. price taking marging %' }
            )
        } else {
            messages.push(
                { color: 'blue', text: 'Your price is fixed. It will not change at ref. prices changes.' }
            )
        }
        if (operationType === 'ASK') {
            messages.push(
                { color: colors.text, text: 'Your crypto amount will be escrowed while order is active. If you close the order or the order is cancel by system, the remaining crypto amount will be returned to your balance.' }
            )
        }
        return messages
    }, [isPriceDynamic, operationType])

    const modalData = useMemo(() => {
        let data: any = [];
        data.push(
            {
                title: 'Operation Type:',
                type: 'TEXT',
                value: operationType,
            }
        );
        data.push(
            {
                title: 'Your Price:',
                type: 'NUMERIC',
                value: userPrice,
                valuePreffix: '',
                valueSuffix: fiatCurrency.value + ' / ' + cryptoCurrency.value,
                valueDecimals: fiatCurrency.decimals
            }
        );
        data.push(
            {
                title: 'Price Margin:',
                type: 'NUMERIC',
                value: priceMargin,
                valuePreffix: '',
                valueSuffix: ' % ',
                valueDecimals: 2
            }
        );
        data.push(
            {
                title: 'Amount:',
                type: 'NUMERIC',
                value: amount,
                valuePreffix: '',
                valueSuffix: operationType === 'ASK' ? cryptoCurrency.value : fiatCurrency.value,
                valueDecimals: operationType === 'ASK' ? cryptoCurrency.decimals : fiatCurrency.decimals
            }
        );
        if (route.params.selectedPayment !== undefined && operationType === 'ASK') {
            data.push(
                {
                    title: 'Recipient Payment:',
                    type: 'JSON',
                    value: route.params.selectedPayment,
                }
            );
        }
        if (operationType === 'BID') {
            data.push(
                {
                    title: 'Payment Type:',
                    type: 'TEXT',
                    value: paymentType,
                }
            );
        }
        if (dataCharges?.COMMISSION?.amount !== undefined && dataCharges?.COMMISSION?.amount !== 0) {
            data.push(
                {
                    title: 'Commission:',
                    type: 'NUMERIC',
                    value: dataCharges?.COMMISSION.amount,
                    valuePreffix: '',
                    valueSuffix: fiatCurrency.value,
                    valueDecimals: fiatCurrency.decimals
                }
            );
        }
        if (conditions !== '') {
            data.push(
                {
                    title: 'Conditions:',
                    type: 'TEXT',
                    value: conditions,
                }
            );
        }
        return data;
    }, [operationType, dataCharges, conditions, userPrice, fiatCurrency, cryptoCurrency, priceMargin, amount, paymentType])

    //CALLBACKS
    const renderTextMinAmount = useCallback((value) => (
        <Text style={{
            fontSize: 12,
            fontWeight: 'bold',
            marginTop: 5,
            color: colors.text
        }}>
            {'Min. amount for clients orders '} {value +
                ' ' +
                fiatCurrency?.value}
        </Text>
    ), [fiatCurrency])


    const onChangeTextAmount = useCallback((maskedText, rawText) => {
        if (Number(maxAmount) < Number(rawText) && operationType === 'ASK') {
            setAmount(Number(maxAmount))
        } else {
            setAmount(Number(rawText))
        }
    }, [maxAmount, operationType])

    const onPressPostOrder = useCallback(() => {
        if (amount === 0) {
            Alert.alert(
                "Operation Error",
                "Yo need to enter a valid " +
                'AMOUNT' +
                " to complete operation.",
                [{ text: "Ok" }]
            );
            return
        }
        if (operationType === 'BID' && amount < minAmounts[fiatCurrency.value]) {
            Alert.alert(
                "Operation Error",
                "AMOUNT must be bigger or equal than " +
                minAmounts[fiatCurrency.value] + ' ' + fiatCurrency.value +
                " to complete operation.",
                [{ text: "Ok" }]
            );
            return
        }
        if (operationType === 'ASK' && (amount * userPrice) < minAmounts[fiatCurrency.value]) {
            Alert.alert(
                "Operation Error",
                "AMOUNT must be bigger or equal than " +
                Number(minAmounts[fiatCurrency.value] / userPrice).toFixed(cryptoCurrency.decimals) + ' ' +
                cryptoCurrency.value +
                ' (' + minAmounts[fiatCurrency.value] + ' ' + fiatCurrency.value + ')' +
                " to complete operation.",
                [{ text: "Ok" }]
            );
            return
        }
        if (operationType === 'ASK' && route.params.selectedPayment === undefined) {
            Alert.alert(
                "Operation Error",
                "Yo need to enter a valid " +
                'PAYMENT' +
                " to complete operation.",
                [{ text: "Ok" }]
            );
            return
        }
        setIsVisibleModalTransaction(true)
    }, [amount, operationType, fiatCurrency, userPrice])

    const process = () => {
        mutatePostOrder({
            userName: userName,
            nickName: config.nickName,
            pair: cryptoCurrency.value + '' + fiatCurrency.value,
            amount: amount,
            price: userPrice,
            operationType: operationType,
            time: 1,
            timeUnit: 'DAYS',
            paymentType: paymentType,
            conditions: conditions,
            priceMargin: isPriceDynamic ? priceMargin : undefined,
            noEscrow: operationType === 'BID',
            source: 'P2P',
            payment: route.params.selectedPayment
        })
    }

    const onPressCancel = useCallback(() => {
        setIsVisibleModalTransaction(false)
    }, [])

    const onPressClose = useCallback(() => {
        setIsVisibleModalTransaction(false)
        navigation.dispatch(StackActions.pop())
    }, [])


    //PRINCIPAL RENDER
    return (
        <View style={{
            flex: 1
        }}>
            <Header
                currency={operationType === 'BID' ? fiatCurrency : cryptoCurrency}
                targetImg={operationType === 'BID' ? cryptoCurrency.img : fiatCurrency.img}
                maxAmount={maxAmount}
                amount={amount}
                showBalance={operationType === 'ASK'}
            />
            <Body>
                <ScrollView
                    style={{
                        marginBottom: 20
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row'
                        }}
                    >
                        <Body_Picker
                            selectedValue={
                                operationType === 'BID' ?
                                    detailedBalances.find(currency => currency.value === fiatCurrency.value)
                                    :
                                    detailedBalances.find(currency => currency.value === cryptoCurrency.value)
                            }
                            values={detailedBalances.filter(currency => (currency.isCrypto && operationType === 'ASK' || !currency.isCrypto && operationType === 'BID'))}
                            onValueChange={(value) => {
                                operationType === 'BID' ?
                                    setFiatCurrency(value)
                                    :
                                    setCryptoCurrency(value)
                            }}
                            marginRight={5}
                            flex={0.35}
                            labelField={'text'}
                        />
                        <Body_Picker
                            selectedValue={
                                operationType === 'ASK' ?
                                    detailedBalances.find(currency => currency.value === fiatCurrency.value)
                                    :
                                    detailedBalances.find(currency => currency.value === cryptoCurrency.value)
                            }
                            values={detailedBalances.filter(currency => (!currency.isCrypto && operationType === 'ASK' || currency.isCrypto && operationType === 'BID'))}
                            onValueChange={(value) => {
                                operationType === 'ASK' ?
                                    setFiatCurrency(value)
                                    :
                                    setCryptoCurrency(value)
                            }}
                            flex={0.35}
                            marginRight={5}
                            labelField={'text'}
                        />
                        <Body_Picker
                            selectedValue={operationType}
                            values={['ASK', 'BID']}
                            onValueChange={(value) => { setOperationType(value) }}
                            flex={0.3}
                        />
                    </View>
                    {operationType === 'BID' &&
                        <Body_Picker
                            selectedValue={paymentType}
                            values={paymentTypes[fiatCurrency.value]}
                            onValueChange={(value) => { setPaymentType(value) }}
                            marginTop={10}
                            flex={1}
                        />
                    }
                    {operationType === 'ASK' &&
                        <>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.dispatch(StackActions.push('FiatBankPaymentsScreen', { ...route.params, selectedCurrency: fiatCurrency, selectedOrder: { fiatCurrencyValue: fiatCurrency.value, cryptoCurrencyValue: cryptoCurrency.value }, replaceTarget: 'OrdersPostScreen' }))
                                }}
                                style={{
                                    marginTop: 10,
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
                    <View
                        style={{
                            marginTop: 10,
                            flexDirection: 'row',
                            backgroundColor: colors.secundaryBackground,
                            padding: 10,
                            borderRadius: 5
                        }}
                    >
                        <Text
                            style={{
                                flex: 0.25,
                                fontWeight: 'bold',
                                color: colors.text
                            }}
                        >
                            {'Ref. Price:'}
                        </Text>
                        <View
                            style={{
                                flex: 0.45,
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}
                        >
                            <Text
                                style={{
                                    color: colors.text
                                }}
                            >
                                {operationType === 'ASK' ? Number(dataCryptoPrice.ask).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : Number(dataCryptoPrice.bid).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 10,
                                    marginLeft: 3,
                                    color: colors.text
                                }}
                            >
                                {fiatCurrency.value}/{cryptoCurrency.value}
                            </Text>
                        </View>

                    </View>
                    <View
                        style={{
                            marginTop: 10,
                            flexDirection: 'row',
                            backgroundColor: colors.primaryBackground,
                            padding: 10,
                            borderRadius: 5,
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Text
                            style={{
                                flex: 0.25,
                                fontWeight: 'bold',
                                color: colors.text
                            }}
                        >
                            {'Margin %:'}
                        </Text>
                        <Text
                            style={{
                                flex: 0.45,
                                color: colors.text
                            }}
                        >
                            {Number(priceMargin).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                flex: 0.3,
                                justifyContent: 'center',
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    setPriceMargin(value => value - 0.1)
                                }}
                                style={{
                                    marginRight: 5
                                }}
                            >
                                <MaterialCommunityIcons
                                    name="chevron-down-circle"
                                    color={colors.icon}
                                    size={26}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setPriceMargin(value => value + 0.1)
                                }}
                            >
                                <MaterialCommunityIcons
                                    name="chevron-up-circle"
                                    color={colors.icon}
                                    size={26}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View
                        style={{
                            marginTop: 10,
                            flexDirection: 'row',
                            backgroundColor: colors.secundaryBackground,
                            padding: 10,
                            borderRadius: 5,
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                flex: 0.25,
                                fontWeight: 'bold',
                                color: colors.text
                            }}
                        >
                            {'Your Price:'}
                        </Text>
                        <View
                            style={{
                                flex: 0.45,
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}
                        >
                            <Text
                                style={{
                                    color: colors.text
                                }}
                            >
                                {userPrice.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 10,
                                    marginLeft: 3,
                                    color: colors.text
                                }}
                            >
                                {fiatCurrency.value}/{cryptoCurrency.value}
                            </Text>
                        </View>
                        <View
                            style={{
                                flex: 0.3,
                                justifyContent: 'center',
                            }}
                        >
                            <CheckBox
                                onPress={() => { setIsPriceDynamic(value => !value) }}
                                checked={isPriceDynamic}
                                containerStyle={{
                                    backgroundColor: colors.secundaryBackground,
                                }}
                                textStyle={{
                                    fontSize: 11,
                                    marginLeft: -2,
                                    color: colors.text
                                }}
                                title='dynamic'
                            />
                        </View>
                    </View>
                    {isPriceDynamic ?
                        <Text
                            style={{
                                color: 'red',
                                marginTop: 5
                            }}
                        >
                            {'Your price will change dynamically around ref. price taking marging %'}
                        </Text>
                        :
                        <Text
                            style={{
                                color: 'blue',
                                marginTop: 5
                            }}
                        >
                            {'Your price is fixed. It will not change at ref. prices changes.'}
                        </Text>
                    }
                    <Body_TextRight
                        value={minAmounts[fiatCurrency.value]}
                        decimalScale={fiatCurrency.decimals}
                        renderText={renderTextMinAmount}
                    />
                    <View
                        style={{
                            flexDirection: 'row'
                        }}
                    >
                        <Body_Input
                            value={amount}
                            type={'money'}
                            placeholder={'Amount'}
                            options={{
                                precision: operationType === 'ASK' ? cryptoCurrency.decimals : fiatCurrency.decimals,
                                separator: '.',
                                delimiter: ',',
                                unit: operationType === 'ASK' ? cryptoCurrency.symbol + ' ' : fiatCurrency.symbol + ' ',
                                prefixUnit: operationType === 'ASK' ? cryptoCurrency.symbol + ' ' : fiatCurrency.symbol + ' ',
                            }}
                            onChangeText={onChangeTextAmount}
                        />
                    </View>
                    <Body_Input
                        value={conditions}
                        type={'text'}
                        placeholder={'Conditions'}
                        numberOfLines={3}
                        onChangeText={(text) => setConditions(text)}
                    />
                    <Body_Button
                        onPress={onPressPostOrder}
                        label={'POST ORDER'}
                    />
                </ScrollView>
            </Body>
            <Modal_Transaction
                data={modalData}
                isVisible={isVisibleModalTransaction}
                label={'POST ORDER'}
                infoMessages={infoMessages}
                process={process}
                isSuccess={isSuccessPostOrder}
                isError={isErrorPostOrder}
                onPressClose={onPressClose}
                onPressCancel={onPressCancel}
                allowSecongAuthStrategy={false}
            />
        </View >
    )

}

export default React.memo(compose(withColors, withUserName, withDetailedBalances, withConfig)(OrdersPostScreen))