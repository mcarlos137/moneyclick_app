//PRINCIPAL
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Text
} from 'react-native';
import { compose } from 'redux'
import { StackActions } from '@react-navigation/native';
//FUNCTIONS
import { validateConfirmationModalTransaction } from '../../main/functions';
//COMPONENTS
import Header from '../../main/components/Header'
import Body from '../../main/components/Body'
import Modal_Transaction from '../../main/components/Modal_Transaction';
import Body_Button from '../../main/components/Body_Button'
import Body_Picker from '../../main/components/Body_Picker'
import Body_Input from '../../main/components/Body_Input'
import Body_TextRight from '../../main/components/Body_TextRight'
//HOOKS
import { getCryptoPrice } from '../../main/hooks/getCryptoPrice';
import { getCharges } from '../../main/hooks/getCharges';
import { cryptoSell } from './hooks/cryptoSell';
//HOC
import { withColors, withDetailedBalances, withUserName } from '../../main/hoc';

const CryptoSellScreen = ({ navigation, route, colors, userName, detailedBalances }) => {

    //INITIAL STATES
    const [baseCurrencyAmount, setBaseCurrencyAmount] = useState(0.00)
    const [targetCurrencyAmount, setTargetCurrencyAmount] = useState(0.00)
    const [baseCurrency, setBaseCurrency] = useState( route.params.selectedCurrency !== undefined ? detailedBalances.find(currency => currency.value === route.params.selectedCurrency.value) : detailedBalances.find(currency => currency.isCrypto))
    const [targetCurrency, setTargetCurrency] = useState(detailedBalances.find(currency => !currency.isCrypto))
    const [isVisibleModalTransaction, setIsVisibleModalTransaction] = useState(false)

    //HOOKS CALLS
    const { data: dataCryptoPrice, refetch: refetchCryptoPrice } =
        getCryptoPrice(
            baseCurrency.value,
            targetCurrency.value
        )

    const { data: dataCharges, isError, error, isFetching } =
        getCharges(
            targetCurrency?.value,
            null,
            targetCurrencyAmount > 0 ? targetCurrencyAmount : targetCurrency?.availableBalance,
            null,
            targetCurrency?.availableBalance,
            'MC_SELL_CRYPTO',
            null
        )

    const { mutate: mutateCryptoSell, isSuccess: isSuccessCryptoSell, isError: isErrorCryptoSell } =
        cryptoSell()

    console.log('sell', dataCryptoPrice?.bid)

    //EFFECTS
    useEffect(() => {
        console.log('CryptoSellScreen', route.params)
    }, []);

    useEffect(() => {
        setBaseCurrencyAmount(0.00)
        setTargetCurrencyAmount(0.00)
    }, [baseCurrency, targetCurrency]);

    //MEMOS
    const maxAmount = useMemo(() => baseCurrency.availableBalance, [baseCurrency])

    const modalData = useMemo(() => {
        let data: any[] = [];
        data.push(
            {
                title: 'Amount to Sell:',
                type: 'NUMERIC',
                value: baseCurrencyAmount,
                valuePreffix: '',
                valueSuffix: baseCurrency.value,
                valueDecimals: baseCurrency.decimals
            }
        );
        data.push(
            {
                title: 'Price:',
                type: 'NUMERIC',
                value: dataCryptoPrice.bid,
                valuePreffix: '1 ' + baseCurrency.value + ' =',
                valueSuffix: targetCurrency?.value,
                valueDecimals: targetCurrency?.decimals
            }
        );
        data.push(
            {
                title: 'Amount to Receive:',
                type: 'NUMERIC',
                value: targetCurrencyAmount,
                valuePreffix: '',
                valueSuffix: targetCurrency?.value,
                valueDecimals: targetCurrency?.decimals
            }
        );
        if (dataCharges?.COMMISSION?.amount !== undefined && dataCharges?.COMMISSION?.amount !== 0) {
            data.push(
                {
                    title: 'Commission:',
                    type: 'NUMERIC',
                    value: dataCharges?.COMMISSION.amount,
                    valuePreffix: '',
                    valueSuffix: targetCurrency?.value,
                    valueDecimals: targetCurrency?.decimals
                }
            );
            data.push(
                {
                    title: 'Final Amount to Receive:',
                    type: 'NUMERIC',
                    value: (targetCurrencyAmount - dataCharges?.COMMISSION.amount),
                    valuePreffix: '',
                    valueSuffix: targetCurrency?.value,
                    valueDecimals: targetCurrency?.decimals
                }
            );
        }
        return data;
    }, [baseCurrency, targetCurrency, targetCurrencyAmount, dataCryptoPrice, dataCharges])

    //CALLBACKS
    const onValueChangeBaseCurrency = useCallback((item, itemIndex) => {
        setBaseCurrency(item)
    }, [])

    const onValueChangeTargetCurrency = useCallback((item, itemIndex) => {
        setTargetCurrency(item)
    }, [])

    const onChangeTextBaseCurrencyAmount = useCallback((maskedText, rawText) => {
        if (Number(maxAmount) > Number(rawText)) {
            setBaseCurrencyAmount(Number(rawText))
            setTargetCurrencyAmount(Number(rawText * dataCryptoPrice?.bid))
        } else {
            setBaseCurrencyAmount(Number(maxAmount))
            setTargetCurrencyAmount(Number(maxAmount * dataCryptoPrice?.bid))
        }
    }, [maxAmount, dataCryptoPrice])

    const onChangeTextTargetCurrencyAmount = useCallback((maskedText, rawText) => {
        if (Number(maxAmount) > Number(rawText / dataCryptoPrice.bid)) {
            setTargetCurrencyAmount(Number(rawText))
            setBaseCurrencyAmount(Number(rawText / dataCryptoPrice.bid))
        } else {
            setTargetCurrencyAmount(Number(maxAmount * dataCryptoPrice.bid))
            setBaseCurrencyAmount(Number(maxAmount))
        }
    }, [maxAmount, dataCryptoPrice])

    const renderTextPrice = useCallback((value) => (
        <Text style={{
            fontSize: 12,
            fontWeight: 'bold',
            marginTop: 5,
            color: colors.text
        }}>
            {baseCurrency === null ? '' : '1 ' +
                baseCurrency?.value +
                ' = ' +
                value +
                ' ' +
                targetCurrency?.value}
        </Text>
    ), [baseCurrency, targetCurrency])

    const renderTextMax = useCallback((value) => (
        <Text style={{
            fontSize: 12,
            fontWeight: 'bold',
            marginTop: 5,
            color: colors.text
        }}>
            {value !== '0.00' ? 'You can sell up to ' + baseCurrency.symbol + ' ' + value : 'You have to buy or receive first'}
        </Text>
    ), [baseCurrency])

    const onPressSell = useCallback(() => {
        setIsVisibleModalTransaction(validateConfirmationModalTransaction(
            [
                { name: 'AMOUNT', value: baseCurrencyAmount, type: 'NUMERIC' },
            ]
        ))
    }, [baseCurrencyAmount])

    const process = () => {
        mutateCryptoSell({
            userName: userName,
            cryptoCurrency: baseCurrency.value,
            fiatCurrency: targetCurrency?.value,
            cryptoAmount: baseCurrencyAmount,
            fiatAmount: targetCurrencyAmount
        })
    }

    const onPressClose = useCallback(() => {
        setIsVisibleModalTransaction(false)
        navigation.dispatch(StackActions.popToTop())
    }, [])

    const onPressCancel = useCallback(() => setIsVisibleModalTransaction(false), [])

    //PRINCIPAL RENDER
    return (
        <>
            <Header
                currency={baseCurrency}
                targetImg={targetCurrency?.img}
                maxAmount={maxAmount}
                amount={baseCurrencyAmount}
            />
            <Body>
                <>
                    <Body_Picker
                        selectedValue={detailedBalances.find(currency => currency.value === baseCurrency.value)}
                        values={detailedBalances.filter(currency => currency.isCrypto)}
                        onValueChange={onValueChangeBaseCurrency}
                        labelField={'text'}
                    />
                    <Body_Picker
                        selectedValue={detailedBalances.find(currency => currency.value === targetCurrency.value)}
                        values={detailedBalances.filter(currency => !currency.isCrypto)}
                        onValueChange={onValueChangeTargetCurrency}
                        marginTop={10}
                        labelField={'text'}
                    />
                    <Body_Input
                        value={baseCurrencyAmount}
                        onChangeText={onChangeTextBaseCurrencyAmount}
                        options={{
                            precision: baseCurrency.decimals,
                            separator: '.',
                            delimiter: ',',
                            unit: baseCurrency.symbol + ' ',
                            prefixUnit: baseCurrency.symbol + ' ',
                        }}
                        placeholder={'Base amount'}
                        type={'money'}
                    />
                    <Body_Input
                        value={targetCurrencyAmount}
                        onChangeText={onChangeTextTargetCurrencyAmount}
                        options={{
                            precision: targetCurrency === null ? 8 : targetCurrency.decimals,
                            separator: '.',
                            delimiter: ',',
                            unit: targetCurrency?.symbol + ' ',
                            prefixUnit: targetCurrency?.symbol + ' ',
                        }}
                        placeholder={'Target amount'}
                        type={'money'}
                    />
                    <Body_TextRight
                        value={dataCryptoPrice?.bid}
                        decimalScale={dataCryptoPrice === undefined ? 0 : dataCryptoPrice?.bid >= 1000000
                            ? 0
                            : dataCryptoPrice?.bid >= 1
                                ? 2
                                : 8}
                        renderText={renderTextPrice}
                    />
                    <Body_TextRight
                        value={baseCurrency.availableBalance}
                        decimalScale={baseCurrency.decimals}
                        renderText={renderTextMax}
                    />
                    <Body_Button
                        onPress={onPressSell}
                        label={'SELL'}
                    />
                </>
            </Body>
            <Modal_Transaction
                data={modalData}
                isVisible={isVisibleModalTransaction}
                label={'CRYPTO SELL'}
                process={process}
                isSuccess={isSuccessCryptoSell}
                isError={isErrorCryptoSell}
                onPressClose={onPressClose}
                onPressCancel={onPressCancel}
                allowSecongAuthStrategy={false}
            />
        </>
    );
};

export default React.memo(compose(withColors, withUserName, withDetailedBalances)(CryptoSellScreen));
