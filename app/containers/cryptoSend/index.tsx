//PRINCIPAL
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    View,
    Text
} from 'react-native';
import { compose } from 'redux'
import { StackActions } from '@react-navigation/native';
//STORES
import { store as balanceStore } from '../../main/stores/balance';
//FUNCTIONS
import {
    getCryptoPaymentType,
    validateConfirmationModalTransaction,
} from '../../main/functions'
//HOOKS
import { getCharges } from '../../main/hooks/getCharges';
import { cryptoSend } from './hooks/cryptoSend';
//COMPONENTS
import Body from '../../main/components/Body';
import Body_Picker from '../../main/components/Body_Picker'
import Body_Input from '../../main/components/Body_Input'
import Body_TextRight from '../../main/components/Body_TextRight'
import Body_Button from '../../main/components/Body_Button'
import Header from '../../main/components/Header'
import Modal_Transaction from '../../main/components/Modal_Transaction'
//HOC
import { withColors, withUserName } from '../../main/hoc';

const CryptoSendScreen = ({ navigation, route, colors, userName }) => {

    //INITIAL STATES
    const [amount, setAmount] = useState(0.00)
    const [currency, setCurrency] = useState(balanceStore.getState().detailedBalances.find(cur => cur.isCrypto))
    const [address, setAddress] = useState('')
    const [description, setDescription] = useState('')
    const [operationType, setOperationType] = useState('')
    const [currencyProtocol, setCurrencyProtocol] = useState('')
    const [isVisibleModalTransaction, setIsVisibleModalTransaction] = useState(false)

    //HOOKS CALLS
    const { data: dataCharges, isLoading: isLoadingCharges, error: errorCharges } =
        getCharges(
            currency?.value,
            null,
            currency?.availableBalance,
            null,
            currency?.availableBalance,
            'SEND_OUT',
            currencyProtocol !== '' ? getCryptoPaymentType(currencyProtocol) : null
        )

    const { mutate: mutateCryptoSend, isSuccess: isSuccessCryptoSend, isError: isErrorCryptoSend } =
        cryptoSend()

    //EFFECTS
    console.log('CryptoSendScreen', route.params)
    useEffect(() => {
        if (route?.params?.selectedCurrency?.isCrypto) {
            setCurrency(route.params.selectedCurrency)
        }
        if (route?.params?.selectedCurrency?.protocols) {
            setCurrencyProtocol(route.params.selectedCurrency.protocols[0])
        }
    }, [])

    useEffect(() => {
        setAmount(0)
    }, [currency])

    //MEMOS
    const maxAmount = useMemo(() =>
        dataCharges?.COMMISSION?.maxOperationAmount !== undefined ? dataCharges.COMMISSION.maxOperationAmount : currency.availableBalance,
        [dataCharges, currency])

    const modalData = useMemo(() => {
        let data: any = [];
        data.push(
            {
                title: 'Amount to Send:',
                type: 'NUMERIC',
                value: amount,
                valuePreffix: '',
                valueSuffix: currency.value,
                valueDecimals: currency.decimals
            }
        );
        data.push(
            {
                title: 'Recipient address:',
                type: 'TEXT',
                value: address,
            }
        );
        if (dataCharges?.COMMISSION.amount !== undefined && dataCharges?.COMMISSION.amount !== 0 && operationType === 'SEND_OUT') {
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
        }
        if (description !== '') {
            data.push(
                {
                    title: 'Description:',
                    type: 'TEXT',
                    value: description
                }
            );
        }
        return data;
    }, [currency, amount, operationType, dataCharges, description, address])

    //CALLBACKS
    const onValueChangeCurrency = useCallback((item) => {
        setCurrency(item)
    }, [])

    const onChangeTextAddress = useCallback((text) => {
        setAddress(text)
    }, [])

    const onChangeTextAmount = useCallback((maskedText, rawText) => {
        if (Number(maxAmount) > Number(rawText)) {
            setAmount(Number(rawText))
        } else {
            setAmount(Number(maxAmount))
        }
    }, [maxAmount])

    const onChangeTextDescription = useCallback(text => {
        setDescription(text)
    }, [])

    const onPressSend = useCallback(() => {
        var network = 'BITCOIN'
        if (currency.value === 'ETH') {
            network = 'ETHEREUM'
        }
        if (currency.value === 'USDT' && currencyProtocol === 'ERC20') {
            network = 'ETHEREUM'
        }
        if (currency.value === 'USDT' && currencyProtocol === 'TRC20') {
            network = 'TRON'
        }
        if (currency.value === 'BCH') {
            network = 'BITCOIN'
        }
        if (currency.value === 'DOGE') {
            network = 'DOGECOIN'
        }
        if (currency.value === 'LTC') {
            network = 'LITECOIN'
        }
        if (currency.value === 'DASH') {
            network = 'DASH'
        }
        if (currency.value === 'XRP') {
            network = 'XRP'
        }
        setIsVisibleModalTransaction(validateConfirmationModalTransaction(
            [
                { name: network + ' ADDRESS', value: address, type: network + '_ADDRESS' },
                { name: 'AMOUNT', value: amount, type: 'NUMERIC' },
            ]
        ))
    }, [currency, currencyProtocol, address, amount])

    const renderTextMaxInternal = useCallback((value) => (
        <Text style={{
            fontSize: 12,
            fontWeight: 'bold',
            marginTop: 5,
            color: colors.text
        }}>
            {value !== '0.00' ? 'Inside MoneyClick  ' + currency.symbol + ' ' + value : 'You have to buy or receive first'}
        </Text>
    ), [currency])

    const renderTextMaxExternal = useCallback((value) => (
        <>
            {value !== '0.00' &&
                <Text style={{
                    fontSize: 12,
                    fontWeight: 'bold',
                    marginTop: 5,
                    color: colors.text
                }}>
                    {'Outside MoneyClick  ' + currency.symbol + ' ' + value}
                </Text>
            }
        </>
    ), [currency])

    const process = () => {
        mutateCryptoSend({
            userName: userName,
            currency: currency.value,
            amount: amount,
            targetAddress: address,
            additionalInfo: description,
            paymentType: currencyProtocol !== '' ? getCryptoPaymentType(currencyProtocol) : null
        })
    }

    const onPressClose = useCallback(() => {
        setIsVisibleModalTransaction(false)
        navigation.dispatch(StackActions.popToTop())
    }, [])

    const onPressCancel = useCallback(() => setIsVisibleModalTransaction(false), [])

    return (
        <View style={{
            flex: 1
        }}>
            <Header
                currency={currency}
                targetImg={'CRYPTO_SEND'}
                maxAmount={maxAmount}
                amount={amount}
            />
            <Body>
                <>
                    <Body_Picker
                        selectedValue={balanceStore.getState().detailedBalances.find(cur => cur.value === currency.value)}
                        values={balanceStore.getState().detailedBalances.filter(cur => cur.isCrypto)}
                        onValueChange={onValueChangeCurrency}
                        labelField={'text'}
                    />
                    <Body_Input
                        value={address}
                        onChangeText={onChangeTextAddress}
                        placeholder={'Receiver address'}
                        type={'text'}
                    />
                    <Body_Input
                        value={amount}
                        type={'money'}
                        placeholder={'Amount'}
                        options={{
                            precision: currency?.decimals | 2,
                            separator: '.',
                            delimiter: ',',
                            unit: currency?.symbol + ' ',
                            prefixUnit: currency?.symbol + ' ',
                        }}
                        onChangeText={onChangeTextAmount}
                    />
                    <Body_Input
                        value={description}
                        type={'text'}
                        placeholder={'Description'}
                        onChangeText={onChangeTextDescription}
                    />
                    <View
                        style={{
                            marginTop: 10,
                            alignSelf: 'flex-end',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 12,
                                color: colors.text,
                                fontWeight: 'bold',
                            }}>
                            {'You can send up to:'}
                        </Text>
                    </View>
                    <Body_TextRight
                        value={currency.availableBalance}
                        decimalScale={currency.decimals}
                        renderText={renderTextMaxInternal}
                    />
                    <Body_TextRight
                        value={maxAmount}
                        decimalScale={currency.decimals}
                        renderText={renderTextMaxExternal}
                    />
                    <Body_Button
                        label={'SEND'}
                        onPress={onPressSend}
                    />
                </>
            </Body>
            <Modal_Transaction
                data={modalData}
                isVisible={isVisibleModalTransaction}
                label={'CRYPTO SEND'}
                process={process}
                isSuccess={isSuccessCryptoSend}
                isError={isErrorCryptoSend}
                onPressClose={onPressClose}
                onPressCancel={onPressCancel}
                allowSecongAuthStrategy={true}
            />
        </View >
    );
};

export default React.memo(compose(withColors, withUserName)(CryptoSendScreen));

