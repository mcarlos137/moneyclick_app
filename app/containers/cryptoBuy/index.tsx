//PRINCIPAL
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Text,
} from 'react-native';
import { compose } from 'redux'
import { StackActions } from '@react-navigation/native';
//FUNCTIONS
import {
    validateConfirmationModalTransaction
} from '../../main/functions'
//COMPONENTS
import Body from '../../main/components/Body';
import Body_Picker from '../../main/components/Body_Picker'
import Body_Input from '../../main/components/Body_Input'
import Body_TextRight from '../../main/components/Body_TextRight'
import Body_Button from '../../main/components/Body_Button'
import Modal_Transaction from '../../main/components/Modal_Transaction'
import Header from '../../main/components/Header'
//HOOKS
import { getCryptoPrice } from '../../main/hooks/getCryptoPrice';
import { getCharges } from '../../main/hooks/getCharges';
import { cryptoBuy } from './hooks/cryptoBuy';
//HOC
import { withColors, withDetailedBalances, withUserName } from '../../main/hoc';

const CryptoBuyScreen = ({ navigation, route, colors, userName, detailedBalances }) => {

    //INITIAL STATES
    const [baseCurrencyAmount, setBaseCurrencyAmount] = useState(0.00)
    const [targetCurrencyAmount, setTargetCurrencyAmount] = useState(0.00)
    const [baseCurrency, setBaseCurrency] = useState<any>(detailedBalances.find(currency => !currency.isCrypto))
    const [targetCurrency, setTargetCurrency] = useState<any>(detailedBalances.find(currency => currency.isCrypto))
    const [isVisibleModalTransaction, setIsVisibleModalTransaction] = useState(false)

    //HOOKS CALLS
    const { data: dataCryptoPrice, refetch: refetchCryptoPrice } =
        getCryptoPrice(
            targetCurrency?.value,
            baseCurrency.value,
        )

    const { data: dataCharges, error: errorCharges, isLoading: isLoadingCharges } =
        getCharges(
            baseCurrency?.value,
            null,
            baseCurrencyAmount > 0 ? baseCurrencyAmount : baseCurrency?.availableBalance,
            null,
            baseCurrency?.availableBalance,
            'MC_BUY_CRYPTO',
            null
        )

    const { mutate: mutateCryptoBuy, isSuccess: isSuccessCryptoBuy, isError: isErrorCryptoBuy } =
        cryptoBuy()

    console.log('buy', dataCryptoPrice?.ask)

    //EFFECTS
    useEffect(() => {
        console.log('CryptoBuyScreen', route.params)
        if (route?.params?.selectedCurrency?.isCrypto) {
            setTargetCurrency(route.params.selectedCurrency)
        }
    }, [])

    useEffect(() => {
        setBaseCurrencyAmount(0.00)
        setTargetCurrencyAmount(0.00)
    }, [baseCurrency, targetCurrency])

    //MEMOS
    const maxAmount = useMemo(() =>
        dataCharges?.COMMISSION?.maxOperationAmount !== undefined ? dataCharges.COMMISSION.maxOperationAmount : baseCurrency.availableBalance
        , [dataCharges, baseCurrency])

    const modalData = useMemo(() => {
        let data: any = [];
        data.push(
            {
                title: 'Amount to Buy:',
                type: 'NUMERIC',
                value: targetCurrencyAmount,
                valuePreffix: '',
                valueSuffix: targetCurrency?.value,
                valueDecimals: targetCurrency?.decimals
            }
        );
        data.push(
            {
                title: 'Price:',
                type: 'NUMERIC',
                value: dataCryptoPrice?.ask,
                valuePreffix: '1 ' + baseCurrency?.value + ' =',
                valueSuffix: targetCurrency?.value,
                valueDecimals: targetCurrency?.decimals
            }
        );
        data.push(
            {
                title: 'Amount to Pay:',
                type: 'NUMERIC',
                value: baseCurrencyAmount,
                valuePreffix: '',
                valueSuffix: baseCurrency.value,
                valueDecimals: baseCurrency.decimals
            }
        );
        if (dataCharges?.COMMISSION?.amount !== undefined && dataCharges?.COMMISSION?.amount !== 0) {
            data.push(
                {
                    title: 'Commission:',
                    type: 'NUMERIC',
                    value: dataCharges?.COMMISSION?.amount,
                    valuePreffix: '',
                    valueSuffix: baseCurrency.value,
                    valueDecimals: baseCurrency.decimals
                }
            );
            data.push(
                {
                    title: 'Final Amount to Receive:',
                    type: 'NUMERIC',
                    value: (baseCurrencyAmount - dataCharges?.COMMISSION?.amount) * dataCryptoPrice?.ask,
                    valuePreffix: '',
                    valueSuffix: targetCurrency?.value,
                    valueDecimals: targetCurrency?.decimals
                }
            );
        }
        return data;
    }, [baseCurrency, targetCurrency, baseCurrencyAmount, targetCurrencyAmount, dataCryptoPrice, dataCharges])

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
            setTargetCurrencyAmount(Number(rawText * dataCryptoPrice?.ask))
        } else {
            setBaseCurrencyAmount(Number(maxAmount))
            setTargetCurrencyAmount(Number(maxAmount * dataCryptoPrice?.ask))
        }
    }, [maxAmount, dataCryptoPrice])

    const onChangeTextTargetCurrencyAmount = useCallback((maskedText, rawText) => {
        if (Number(maxAmount) > Number(rawText / dataCryptoPrice?.ask)) {
            setTargetCurrencyAmount(Number(rawText))
            setBaseCurrencyAmount(Number(rawText / dataCryptoPrice?.ask))
        } else {
            setTargetCurrencyAmount(Number(maxAmount * dataCryptoPrice?.ask))
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
            {baseCurrency === null ? '' : value +
                ' ' +
                baseCurrency?.value +
                ' = ' +
                '1' +
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
            {'You can buy up to ' + baseCurrency.symbol + ' ' + value}
        </Text>
    ), [baseCurrency])

    const onPressBuy = useCallback(() => {
        setIsVisibleModalTransaction(validateConfirmationModalTransaction(
            [
                { name: 'AMOUNT', value: baseCurrencyAmount, type: 'NUMERIC' },
            ]
        ))
    }, [baseCurrencyAmount])

    const onPressCancel = useCallback(() => {
        setIsVisibleModalTransaction(false)
    }, [])

    const onPressClose = useCallback(() => {
        setIsVisibleModalTransaction(false)
        navigation.dispatch(StackActions.popToTop())
    }, [])

    const process = () => {
        mutateCryptoBuy({
            userName: userName,
            cryptoCurrency: targetCurrency?.value,
            fiatCurrency: baseCurrency.value,
            cryptoAmount: targetCurrencyAmount,
            fiatAmount: baseCurrencyAmount
        })
    }

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
                        values={detailedBalances.filter(currency => !currency.isCrypto)}
                        onValueChange={onValueChangeBaseCurrency}
                        labelField={'text'}
                    />
                    <Body_Picker
                        selectedValue={detailedBalances.find(currency => currency.value === targetCurrency.value)}
                        values={detailedBalances.filter(currency => currency.isCrypto)}
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
                        value={dataCryptoPrice?.ask}
                        decimalScale={dataCryptoPrice === undefined ? 0 : dataCryptoPrice?.ask >= 1000000
                            ? 0
                            : dataCryptoPrice?.ask >= 1
                                ? 2
                                : 8}
                        renderText={renderTextPrice}
                    />
                    <Body_TextRight
                        value={maxAmount}
                        decimalScale={baseCurrency.decimals}
                        renderText={renderTextMax}
                    />
                    <Body_Button
                        onPress={onPressBuy}
                        label={'BUY'}
                    />
                </>
            </Body>
            <Modal_Transaction
                data={modalData}
                isVisible={isVisibleModalTransaction}
                label={'CRYPTO BUY'}
                process={process}
                isSuccess={isSuccessCryptoBuy}
                isError={isErrorCryptoBuy}
                onPressCancel={onPressCancel}
                onPressClose={onPressClose}
                allowSecongAuthStrategy={false}
            />
        </>
    );
};

export default React.memo(compose(withColors, withUserName, withDetailedBalances)(CryptoBuyScreen));
