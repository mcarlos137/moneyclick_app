//PRINCIPAL
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Text,
    View,
} from 'react-native';
import { compose } from 'redux'
/*import {
    getChargesStore,
} from '../../main/store'*/
//FUNCTIONS
import { getDecimals, validateConfirmationModalTransaction } from '../../main/functions';
//COMPONENTS
import Header from '../../main/components/Header';
import Body from '../../main/components/Body';
import Body_Picker from '../../main/components/Body_Picker'
import Body_Input from '../../main/components/Body_Input'
import Body_TextRight from '../../main/components/Body_TextRight';
import Body_Button from '../../main/components/Body_Button';
import Modal_Transaction from '../../main/components/Modal_Transaction';
//HOOKS
import { getFastChangeFactor } from './hooks/getFastChangeFactor';
import { getCharges } from '../../main/hooks/getCharges';
import { fastChange } from './hooks/fastChange';
//HOC
import { withColors, withDetailedBalances, withUserName } from '../../main/hoc';
import { StackActions } from '@react-navigation/native';

const FastChangeScreen = ({ navigation, route, colors, userName, detailedBalances }) => {

    //INITIAL STATES
    const [baseCurrency, setBaseCurrency] = useState(route.params.selectedCurrency !== undefined ? detailedBalances.find(currency => currency.value === route.params.selectedCurrency.value) : detailedBalances.find(currency => !currency.isCrypto))
    const [targetCurrency, setTargetCurrency] = useState(detailedBalances.find(currency => (currency.isCrypto && route.params.balanceType === 'CRYPTO' || !currency.isCrypto && route.params.balanceType === 'FIAT') && currency.value !== baseCurrency.value))
    const [baseCurrencyAmount, setBaseCurrencyAmount] = useState(0)
    const [targetCurrencyAmount, setTargetCurrencyAmount] = useState(0)
    const [isVisibleModalTransaction, setIsVisibleModalTransaction] = useState(false)

    //HOOKS CALLS
    const { isLoading: isLoadingFastChangeFactor, data: dataFastChangeFactor, error: errorFastChangeFactor } =
        getFastChangeFactor(baseCurrency.value, targetCurrency.value)

    const { data: dataCharges, error: errorCharges, isLoading: isLoadingCharges } =
        getCharges(
            baseCurrency?.value,
            null,
            baseCurrencyAmount > 0 ? baseCurrencyAmount : baseCurrency?.availableBalance,
            null,
            baseCurrency?.availableBalance,
            'MC_FAST_CHANGE',
            null
        )

    const { mutate: mutateFastChange, isSuccess: isSuccessFastChange, isError: isErrorFastChange } =
        fastChange()

    //EFFECTS
    useEffect(() => {
        console.log('FastChangeScreen', route.params);
    }, []);

    useEffect(() => {
        setBaseCurrencyAmount(0)
        setTargetCurrencyAmount(0)
    }, [baseCurrency, targetCurrency]);

    //MEMOS
    const maxAmount = useMemo(() =>
        dataCharges?.COMMISSION?.maxOperationAmount !== undefined ? dataCharges.COMMISSION.maxOperationAmount : baseCurrency.availableBalance,
        [dataCharges, baseCurrency])

    const modalData = useMemo(() => {
        let data: any[] = [];
        data.push(
            {
                title: 'Amount to Receive:',
                type: 'NUMERIC',
                value: targetCurrencyAmount,
                valuePreffix: '',
                valueSuffix: targetCurrency.value,
                valueDecimals: targetCurrency.decimals
            }
        );
        data.push(
            {
                title: 'Change Factor:',
                type: 'NUMERIC',
                value: dataFastChangeFactor?.factor,
                valuePreffix: '1 ' + baseCurrency.value + ' =',
                valueSuffix: targetCurrency.value,
                valueDecimals: getDecimals(dataFastChangeFactor?.factor)
            }
        );
        data.push(
            {
                title: '',
                type: 'NUMERIC',
                value: (1 / dataFastChangeFactor?.factor),
                valuePreffix: '1 ' + targetCurrency.value + ' =',
                valueSuffix: baseCurrency.value,
                valueDecimals: getDecimals((1 / dataFastChangeFactor?.factor))
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
                    value: dataCharges?.COMMISSION.amount,
                    valuePreffix: '',
                    valueSuffix: baseCurrency.value,
                    valueDecimals: baseCurrency.decimals
                }
            );
            data.push(
                {
                    title: 'Final Amount to Pay:',
                    type: 'NUMERIC',
                    value: (baseCurrencyAmount + dataCharges?.COMMISSION.amount),
                    valuePreffix: '',
                    valueSuffix: baseCurrency.value,
                    valueDecimals: baseCurrency.decimals
                }
            );
        }
        return data;
    }, [baseCurrency, targetCurrency, baseCurrencyAmount, targetCurrencyAmount, dataFastChangeFactor, dataCharges])

    //CALLBACK
    const onValueChangeBaseCurrency = useCallback((item) => {
        setBaseCurrency(item)
        setTargetCurrency(detailedBalances.find(currency => (currency.isCrypto && route.params.balanceType === 'CRYPTO' || !currency.isCrypto && route.params.balanceType === 'FIAT') && currency.value !== item.value))
    }, [detailedBalances])

    const onValueChangeTargetCurrency = useCallback((item) => {
        setTargetCurrency(item)
    }, [])

    const onChangeTextBaseCurrencyAmount = useCallback((maskedText, rawText) => {
        if (Number(maxAmount) > Number(rawText)) {
            setBaseCurrencyAmount(Number(rawText))
            setTargetCurrencyAmount(Number(rawText * dataFastChangeFactor?.factor))
        } else {
            setBaseCurrencyAmount(Number(maxAmount))
            setTargetCurrencyAmount(Number(maxAmount * dataFastChangeFactor?.factor))
        }
    }, [maxAmount, dataFastChangeFactor])

    const onChangeTextTargetCurrencyAmount = useCallback((maskedText, rawText) => {
        if (Number(maxAmount) > Number(rawText / dataFastChangeFactor?.factor)) {
            setTargetCurrencyAmount(Number(rawText))
            setBaseCurrencyAmount(Number(rawText / dataFastChangeFactor?.factor))
        } else {
            setTargetCurrencyAmount(Number(maxAmount * dataFastChangeFactor?.factor))
            setBaseCurrencyAmount(Number(maxAmount))
        }
    }, [maxAmount, dataFastChangeFactor])

    const renderTextMax = useCallback((value) => {
        return (
            <Text style={{
                fontSize: 12,
                fontWeight: 'bold',
                marginTop: 5,
                color: colors.text
            }}>
                {value !== '0.00' ? 'You can change up to ' + baseCurrency.symbol + ' ' + value : 'You have to buy/sell or receive first'}
            </Text>
        )
    }, [baseCurrency])

    const onPressChange = useCallback(() => {
        setIsVisibleModalTransaction(validateConfirmationModalTransaction(
            [
                { name: 'AMOUNT', value: baseCurrencyAmount, type: 'NUMERIC' },
            ]
        ))
    }, [baseCurrencyAmount])

    const renderTextPrice = useCallback((value) => (
        <Text
            style={{
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

    const process = () => {
        mutateFastChange({
            userName: userName,
            baseCurrency: baseCurrency.value,
            targetCurrency: targetCurrency.value,
            amount: baseCurrencyAmount,
            factor: dataFastChangeFactor?.factor,
            description: ''
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
                currency={baseCurrency}
                targetImg={targetCurrency?.img}
                maxAmount={maxAmount}
                amount={baseCurrencyAmount}
            />
            <Body>
                <>
                    <Body_Picker
                        selectedValue={detailedBalances.find(currency => currency.value === baseCurrency.value)}
                        values={detailedBalances.filter(currency => (currency.isCrypto && route.params.balanceType === 'CRYPTO' || !currency.isCrypto && route.params.balanceType === 'FIAT'))}
                        onValueChange={onValueChangeBaseCurrency}
                        labelField={'text'}
                    />
                    <Body_Picker
                        selectedValue={detailedBalances.find(currency => currency.value === targetCurrency.value)}
                        values={detailedBalances.filter(currency => (currency.isCrypto && route.params.balanceType === 'CRYPTO' || !currency.isCrypto && route.params.balanceType === 'FIAT') && currency.value !== baseCurrency.value)}
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
                        value={dataFastChangeFactor?.factor}
                        decimalScale={dataFastChangeFactor === undefined ? 0 : dataFastChangeFactor?.factor >= 1000000
                            ? 0
                            : dataFastChangeFactor?.factor >= 1
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
                        onPress={onPressChange}
                        label={'CHANGE'}
                    />
                </>
            </Body>
            <Modal_Transaction
                data={modalData}
                isVisible={isVisibleModalTransaction}
                label={'FAST CHANGE'}
                process={process}
                isSuccess={isSuccessFastChange}
                isError={isErrorFastChange}
                onPressClose={onPressClose}
                onPressCancel={onPressCancel}
                allowSecongAuthStrategy={false}
            />
        </View >
    );
};

export default React.memo(compose(withColors, withUserName, withDetailedBalances)(FastChangeScreen));

