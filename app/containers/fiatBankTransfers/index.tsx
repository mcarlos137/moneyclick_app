//PRINCIPAL
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackActions } from '@react-navigation/native';
import { compose } from 'redux'
//HOOKS
import { getCharges } from '../../main/hooks/getCharges';
import { sendToPayment } from './hooks/sendToPayment';
//FUNCTIONS
import { validateConfirmationModalTransaction } from '../../main/functions';
//COMPONENTS
import Header from '../../main/components/Header'
import Body from '../../main/components/Body';
import Body_Picker from '../../main/components/Body_Picker';
import Body_Input from '../../main/components/Body_Input';
import Body_TextRight from '../../main/components/Body_TextRight';
import Modal_Transaction from '../../main/components/Modal_Transaction';
import Body_Payment from '../../main/components/Body_Payment';
import Body_Button from '../../main/components/Body_Button';
//HOC
import { withColors, withConfig, withDetailedBalances, withUserName } from '../../main/hoc';

//CONSTANTS
const INSTRUCTIONS = [
  { text: 'Select FIAT currency.', iconName: '' },
  { text: 'Add an existing payment or create a new one for this operation.', iconName: '' },
  { text: 'Add an amount and description.', iconName: '' },
  { text: 'Agree to operation conditions and send it.', iconName: '' },
]

const FiatBankTransfersScreen = ({ navigation, route, colors, userName, config, detailedBalances }) => {

  //INITIAL STATES
  const [currency, setCurrency] = useState(route?.params?.selectedCurrency !== undefined ? route.params.selectedCurrency : detailedBalances.find(cur => !cur.isCrypto))
  const [amount, setAmount] = useState(0)
  const [payment, setPayment] = useState({})
  const [description, setDescription] = useState('')
  const [isVisibleModalTransaction, setIsVisibleModalTransaction] = useState(false)
  const [paymentType, setPaymentType] = useState<any>(null)
  const [minOperationAmount, setMinOperationAmount] = useState(0)
  const [maxOperationAmount, setMaxOperationAmount] = useState(0)
  const [isFinalRequest, setIsFinalRequest] = useState(false)
  const [paymentNotAvailable, setPaymentNotAvailable] = useState(false)
  const isMounted = useRef(false)

  //HOOKS CALLS
  const { mutate: mutateSendToPayment, isSuccess: isSuccessSendToPayment, isError: isErrorSendToPayment, data: dataSendToPayment } =
    sendToPayment()

  const { data: dataCharges, error: errorCharges, isLoading: isLoadingCharges } =
    getCharges(
      currency?.value,
      null,
      amount > 0 ? amount : currency?.availableBalance,
      null,
      currency?.availableBalance,
      'SEND_TO_PAYMENT',
      null
    )

  //EFFECTS
  useEffect(() => {
    console.log('FiatBankTransfersScreen', route.params);
    if (route?.params?.selectedPayment !== undefined) {
      setPayment(route.params.selectedPayment)
      setCurrency(route.params.selectedCurrency)
      mutateSendToPayment({
        userName: userName,
        currency: currency.value,
        amount: 1,
        payment: route.params.selectedPayment,
        description: '',
        paymentType: null
      })
    }
  }, []);

  useEffect(() => {
    if(!isMounted.current) {
      return
    }
    setAmount(0)
    setDescription('')
    setPayment({})
    setMinOperationAmount(0)
    setMaxOperationAmount(0)
    setPaymentNotAvailable(false)
  }, [currency]);

  useEffect(() => {
    if (paymentType === null && dataSendToPayment?.data !== undefined) {
      if (dataSendToPayment.data.split('____').length === 2) {
        setPaymentType(dataSendToPayment.data.split('____')[0])
        setMinOperationAmount(dataSendToPayment.data.split('____')[1].split('__')[0])
        setMaxOperationAmount(dataSendToPayment.data.split('____')[1].split('__')[1])
      } else {
        setPaymentNotAvailable(true)
      }
    }
    isMounted.current = true
  }, [dataSendToPayment])

  //MEMOS
  const maxAmount = useMemo(() =>
    dataCharges?.COMMISSION?.maxOperationAmount !== undefined ? dataCharges.COMMISSION.maxOperationAmount : currency.availableBalance
    , [dataCharges, currency])

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
    if (JSON.stringify(payment) !== JSON.stringify({})) {
      data.push(
        {
          title: 'Recipient Payment:',
          type: 'JSON',
          value: payment,
        }
      );
    }
    if (dataCharges?.COMMISSION?.amount !== undefined && dataCharges?.COMMISSION?.amount !== 0) {
      data.push(
        {
          title: 'Commission:',
          type: 'NUMERIC',
          value: dataCharges?.COMMISSION?.amount,
          valuePreffix: '',
          valueSuffix: currency.value,
          valueDecimals: currency.decimals
        }
      );
      data.push(
        {
          title: 'Final amount to send:',
          type: 'NUMERIC',
          value: amount - dataCharges?.COMMISSION?.amount,
          valuePreffix: '',
          valueSuffix: currency.value,
          valueDecimals: currency.decimals
        }
      );
    }
    if (description !== null && description !== '') {
      data.push(
        {
          title: 'Description:',
          type: 'TEXT',
          value: description
        }
      );
    }
    return data;
  }, [currency, amount, payment, dataCharges, description])

  const mainColor = useMemo(() => colors.getRandomMain(), [])

  //CALLBACKS
  const onValueChangeCurrency = useCallback(value => {
    setCurrency(value)
  }, [])

  const onValueChangeAmount = useCallback((maskedText, rawText) => {
    let newAmount = Number(rawText)
    if (newAmount > Number(maxAmount)) {
      newAmount = Number(maxAmount)
    }
    setAmount(newAmount)
  }, [maxAmount])

  const renderTextMin = useCallback((value) => (
    <Text style={{
      fontSize: 12,
      fontWeight: 'bold',
      marginTop: 5,
      color: colors.text
    }}>
      {value !== '0.00' ? 'Minimum to transfer  ' + currency.symbol + ' ' + value : 'You have to buy/sell or receive first'}
    </Text>
  ), [currency])

  const renderTextMax = useCallback((value) => (
    <Text style={{
      fontSize: 12,
      fontWeight: 'bold',
      marginTop: 5,
      color: colors.text
    }}>
      {value !== '0.00' ? 'Maximum to transfer  ' + currency.symbol + ' ' + value : 'You have to buy/sell or receive first'}
    </Text>
  ), [currency])

  const onChangeTextDescription = useCallback(text => {
    setDescription(text)
  }, [])

  const onPressTransfer = useCallback(() => {
    if (amount < minOperationAmount || amount > maxOperationAmount) {
      Alert.alert(
        "Operation Error",
        "You need to enter an " + 'AMOUNT' +
        " between min and max to complete operation.",
        [{ text: "Ok" }]
      );
      return
    }
    setIsVisibleModalTransaction(validateConfirmationModalTransaction(
      [
        { name: 'AMOUNT', value: amount, type: 'NUMERIC' },
        { name: 'PAYMENT', value: payment, type: 'JSON' },
      ]
    ))
  }, [amount, payment])

  const process = () => {
    setIsFinalRequest(true)
    mutateSendToPayment({
      userName: userName,
      currency: currency.value,
      amount: amount,
      payment: payment,
      description: description,
      paymentType: paymentType
    })
  }

  const onPressClose = useCallback(() => {
    setIsVisibleModalTransaction(false)
    navigation.dispatch(StackActions.pop())
  }, [])

  const onPressCancel = useCallback(() => setIsVisibleModalTransaction(false), [])

  return (
    <>
      <Header
        currency={currency}
        targetImg={'FIAT_BANK_TRANSFER'}
        amount={amount}
        maxAmount={maxAmount}
      />
      <Body>
        <>
          <Body_Picker
            selectedValue={detailedBalances.find(cur => cur.value === currency.value)}
            values={detailedBalances.filter(cur => !cur.isCrypto)}
            onValueChange={onValueChangeCurrency}
            labelField={'text'}
          />
          <TouchableOpacity
            onPress={() => {
              navigation.dispatch(StackActions.push('FiatBankPaymentsScreen', { ...route.params, selectedCurrency: currency, replaceTarget: 'FiatBankTransfersScreen' }))
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
          {(JSON.stringify(payment) !== JSON.stringify({})) &&
            <Body_Payment
              item={payment}
              marginTop={10}
            />
          }
          {JSON.stringify(payment) !== JSON.stringify({}) && (minOperationAmount === 0 || maxOperationAmount === 0) && !paymentNotAvailable &&
            <ActivityIndicator
              size="large"
              animating={true}
              color={colors.getRandomMain()}
              style={{
                marginTop: 10
              }}
            />
          }
          {paymentNotAvailable &&
            <Text
              style={{
                color: 'red'
              }}
            >
              {'There is no operation available for selected payment. Try to change payment or currency'}
            </Text>
          }
          {minOperationAmount !== 0 && maxOperationAmount !== 0 && !paymentNotAvailable &&
            <>
              <Body_Input
                value={amount}
                type={'money'}
                placeholder={'Amount'}
                options={{
                  precision: currency?.decimals,
                  separator: '.',
                  delimiter: ',',
                  unit: currency?.symbol + ' ',
                  prefixUnit: currency?.symbol + ' ',
                }}
                onChangeText={onValueChangeAmount}
              />
              <Body_TextRight
                value={minOperationAmount}
                decimalScale={currency.decimals}
                renderText={renderTextMin}
              />
              <Body_TextRight
                value={maxOperationAmount}
                decimalScale={currency.decimals}
                renderText={renderTextMax}
              />
              <Body_Input
                value={description}
                onChangeText={onChangeTextDescription}
                placeholder={'Description'}
                type={'text'}
              />
              <Body_Button
                onPress={onPressTransfer}
                label={'TRANSFER'}
              />
            </>
          }
        </>
      </Body>
      <Modal_Transaction
        data={modalData}
        isVisible={isVisibleModalTransaction}
        label={'TRANSFER'}
        process={process}
        isSuccess={isSuccessSendToPayment && isFinalRequest}
        isError={isErrorSendToPayment}
        onPressClose={onPressClose}
        onPressCancel={onPressCancel}
        allowSecongAuthStrategy={true}
      />
    </>
  );

};

export default React.memo(compose(withColors, withUserName, withConfig, withDetailedBalances)(FiatBankTransfersScreen));

