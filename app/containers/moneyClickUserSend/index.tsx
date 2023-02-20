//PRINCIPAL
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    View,
    Text
} from 'react-native';
import { StackActions } from '@react-navigation/native';
import { compose } from 'redux'
//HOOKS
import { getCharges } from '../../main/hooks/getCharges';
//COMPONENTS
import Header from '../../main/components/Header'
import Body from '../../main/components/Body'
import Body_Picker from '../../main/components/Body_Picker'
import Body_InputUserName from './components/Body_InputUserName'
import Body_Input from '../../main/components/Body_Input'
import Body_TextRight from '../../main/components/Body_TextRight'
import Body_Button from '../../main/components/Body_Button'
import Modal_Transaction from '../../main/components/Modal_Transaction'
import { validateConfirmationModalTransaction } from '../../main/functions';
import { moneyClickUserSend } from './hooks/moneyClickUserSend';
//HOC
import { withColors, withDetailedBalances, withUserName, withAuth } from '../../main/hoc';

const MoneyClickUserSendScreen = ({ navigation, route, colors, userName, auth, detailedBalances }) => {

    //INITIAL STATES
    const [currency, setCurrency] = useState(route.params.selectedCurrency)
    const [amount, setAmount] = useState(0)
    const [areaCode, setAreaCode] = useState('1')
    const [phone, setPhone] = useState('')
    const [receiverName, setReceiverName] = useState('')
    const [description, setDescription] = useState('')
    const [isVisibleModalTransaction, setIsVisibleModalTransaction] = useState(false)

    //HOOKS CALLS
    const { isLoading: isLoadingCharges, data: dataCharges, error: errorCharges } =
        getCharges(
            currency,
            null,
            amount > 0 ? amount : currency?.availableBalance,
            null,
            currency.availableBalance,
            'MC_SEND_SMS_INTERNATIONAL',
            null
        )

    const { mutate: mutateMoneyClickUserSend, isSuccess: isSuccessMoneyClickUserSend, isError: isErrorMoneyClickUserSend } =
        moneyClickUserSend()

    //EFFECTS
    useEffect(() => {
        console.log('MoneyClickUserSendScreen', route.params)
        if (route?.params?.selectedPhone !== undefined) {
            setAreaCode(route.params.selectedPhone.areaCode)
            setPhone(route.params.selectedPhone.phone)
            setReceiverName(route.params.selectedPhone.fullName)
        } else {
            setAreaCode(auth.areaCode)
        }
    }, [])

    useEffect(() => {
        setAmount(0)
    }, [currency])

    //MEMOS
    const maxAmount = useMemo(() =>
        dataCharges?.COMMISSION?.maxOperationAmount !== undefined ? dataCharges.COMMISSION.maxOperationAmount : currency.availableBalance
        , [dataCharges, currency]
    )

    const modalData = useMemo(() => {
        let data: any[] = [];
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
                title: 'Recipient user:',
                type: 'TEXT',
                value: '+' + areaCode + ' ' + phone + ' - ' + receiverName
            }
        );
        if (dataCharges?.COMMISSION?.amount !== undefined && dataCharges?.COMMISSION?.amount !== 0 && areaCode !== auth.areaCode) {
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
    }, [currency, amount, areaCode, phone, receiverName, description, dataCharges])

    //CALLBACKS
    const onValueChangeCurrency = useCallback((item) => {
        setCurrency(item)
    }, [])

    const onChangeTextAreaCode = useCallback(text => {
        setAreaCode(text)
    }, [])

    const onChangeTextPhone = useCallback(text => {
        setPhone(text)
    }, [])

    const onPressQRCode = useCallback(() => {
        navigation.dispatch(StackActions.push('CameraBridgeScreen', { ...route.params }))
    }, [])

    const onPressContacts = useCallback(() => {
        navigation.dispatch(StackActions.replace('ContactsScreen', { ...route.params, replaceTarget: 'MoneyClickUserSendScreen' }))
    }, [])

    const onChangeTextReceiverName = useCallback(text => {
        setReceiverName(text)
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

    const renderTextMax = useCallback((value, message) => (
        <Text style={{
            fontSize: 12,
            fontWeight: 'bold',
            marginTop: 5,
            color: colors.text
        }}>
            {value !== '0.00' ? message + ' - ' + currency.symbol + ' ' + value : 'You have to buy/sell or receive first'}
        </Text>
    ), [currency])

    const onPressSend = useCallback(() => {
        setIsVisibleModalTransaction(validateConfirmationModalTransaction(
            [
                { name: 'AREA CODE', value: areaCode, type: 'TEXT' },
                { name: 'PHONE', value: phone, type: 'TEXT' },
                { name: 'AMOUNT', value: amount, type: 'NUMERIC' },
            ],
        ))
    }, [areaCode, phone, amount])

    const process = () => {
        mutateMoneyClickUserSend({
            baseUserName: userName,
            targetUserName: areaCode + '' + phone,
            currency: currency.value,
            amount: amount,
            isInternational: auth.areaCode !== areaCode,
            baseName: 'baseName',
            targetName: receiverName,
            description: description,
            clientId: null,
            receiveAuthorizationId: null
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
                currency={currency}
                amount={amount}
                maxAmount={maxAmount}
                targetImg={(areaCode !== '' && phone !== '') ? (areaCode + '' + phone) : 'MONEYCLICK_USER_SEND'}
            />
            <Body>
                <>
                    <Body_Picker
                        selectedValue={detailedBalances.find(cur => cur.value === currency.value)}
                        values={detailedBalances.filter(cur => !cur.isCrypto)}
                        onValueChange={onValueChangeCurrency}
                        labelField={'text'}
                    />
                    <Body_InputUserName
                        areaCode={areaCode}
                        phone={phone}
                        onChangeTextAreaCode={onChangeTextAreaCode}
                        onChangeTextPhone={onChangeTextPhone}
                        onPressQRCode={onPressQRCode}
                        onPressContacts={onPressContacts}
                    />
                    <Body_Input
                        value={receiverName}
                        type={'text'}
                        placeholder={'Receiver name'}
                        onChangeText={onChangeTextReceiverName}
                    />
                    <Body_Input
                        value={amount}
                        onChangeText={onChangeTextAmount}
                        options={{
                            precision: currency.decimals,
                            separator: '.',
                            delimiter: ',',
                            unit: currency.symbol + ' ',
                            prefixUnit: currency.symbol + ' ',
                        }}
                        placeholder={'Base amount'}
                        type={'money'}
                    />
                    <Body_Input
                        value={description}
                        type={'text'}
                        placeholder={'Description'}
                        onChangeText={onChangeTextDescription}
                    />
                    <View
                        style={{
                            alignItems: 'flex-end',
                        }}>
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
                        renderText={text => renderTextMax(text, 'National sends')}
                    />
                    <Body_TextRight
                        value={maxAmount}
                        decimalScale={currency.decimals}
                        renderText={text => renderTextMax(text, 'International sends')}
                    />
                    <Body_Button
                        onPress={onPressSend}
                        label={'SEND'}
                    />
                </>
            </Body>
            <Modal_Transaction
                data={modalData}
                isVisible={isVisibleModalTransaction}
                label={'MONEYCLICK USER SEND'}
                process={process}
                isSuccess={isSuccessMoneyClickUserSend}
                isError={isErrorMoneyClickUserSend}
                onPressClose={onPressClose}
                onPressCancel={onPressCancel}
                allowSecongAuthStrategy={false}
            />
        </View >
    );
};

export default React.memo(compose(withColors, withUserName, withAuth, withDetailedBalances)(MoneyClickUserSendScreen));

