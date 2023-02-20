//PRINCIPAL
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Text, TouchableOpacity, View, Alert, Dimensions, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CheckBox } from '@rneui/themed';
import { NumericFormat } from 'react-number-format';
import { StackActions } from '@react-navigation/native';
import { compose } from 'redux'
//HOOKS
import { getFinancialTypes } from './hooks/getFinancialTypes';
import { getPayments } from '../../main/hooks/getPayments';
import { getCharges } from '../../main/hooks/getCharges';
import { addPayment } from '../../main/hooks/addPayment';
import { sendToPayment } from './hooks/sendToPayment';
//FUNCTIONS
import { validateConfirmationModalTransaction } from '../../main/functions';
//COMPONENTS
import Header from '../../main/components/Header'
import Body from '../../main/components/Body';
import Body_Picker from '../../main/components/Body_Picker';
import Body_Input from '../../main/components/Body_Input';
import Body_TextRight from '../../main/components/Body_TextRight';
import { MemoizedStep, MemoizedSteps } from '../../main/components/Steps';
import Modal_Transaction from '../../main/components/Modal_Transaction';
import Body_InputsCreatePayment from './components/Body_InputsCreatePayment'
import ViewInstructions from '../../main/components/ViewInstructions';
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
  const [activeStep, setActiveStep] = useState(1)
  const [description, setDescription] = useState('')
  const [isVisibleModalTransaction, setIsVisibleModalTransaction] = useState(false)
  const [createPayment, setCreatePayment] = useState(false)
  const [financialType, setFinancialType] = useState<any>(null)
  const [allowedOwnership, setAllowedOwnership] = useState('own')
  const [addPaymentAsFrequent, setAddPaymentAsFrequent] = useState(true)
  const [paymentType, setPaymentType] = useState<any>(null)
  const [minOperationAmount, setMinOperationAmount] = useState(0)
  const [maxOperationAmount, setMaxOperationAmount] = useState(0)
  const [isFinalRequest, setIsFinalRequest] = useState(false)
  const [paymentNotAvailable, setPaymentNotAvailable] = useState(false)
  const isMounted = useRef(false)

  //HOOKS CALLS
  const { isLoading: isLoadingFinancialTypes, data: dataFinancialTypes, error: errorFinancialTypes, refetch: refetchFinancialTypes } =
    getFinancialTypes(currency?.value)

  const { isLoading: isLoadingPayments, data: dataPayments, error: errorPayments } =
    getPayments(userName, currency?.value)

  const { mutate: mutateAddPayment } =
    addPayment()

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
      setActiveStep(3)
      mutateSendToPayment({
        userName: userName,
        currency: route.params.selectedCurrency.value,
        amount: 1,
        payment: route.params.selectedPayment,
        description: '',
        paymentType: null
      })
    }
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      setAmount(0)
      setPayment({})
      setCreatePayment(false)
      setFinancialType(null)
      setAllowedOwnership('own')
      setDescription('')
    }
  }, [currency]);

  useEffect(() => {
    if (isMounted.current) {
      switch (activeStep) {
        case 1:
          if (Number(maxAmount) === 0) {
            Alert.alert('Attention', 'Selected currency does not have available balance.', [
              { text: 'Ok' }
            ]);
            return;
          }
          /*
          getFastChangeFactorStore.dispatch(
            getFastChangeFactorAction(
              indexStore.getState().selectedBaseCurrencyState.value,
              'USD'
            ));
            */
          break
        case 2:
          break
      }
    }
  }, [activeStep]);

  useEffect(() => {
    if (isMounted.current) {
      if (createPayment) {
        refetchFinancialTypes()
      }
    }
  }, [createPayment])

  useEffect(() => {
    if (isMounted.current) {
      if (dataFinancialTypes?.length > 0) {
        setFinancialType(dataFinancialTypes[0])
      }
    }
  }, [dataFinancialTypes])

  useEffect(() => {
    if (isMounted.current) {
      const newPayment = {}
      financialType?.fields?.map((value, key) => {
        if (value.values !== undefined) {
          newPayment[value.name] = value.values[0]
        }
      })
      if (allowedOwnership === 'own') {
        newPayment['accountHolderName'] = config.firstName + ' ' + config.lastName
      }
      setPayment(newPayment)
    } else {
      isMounted.current = true
    }
  }, [financialType, allowedOwnership])

  useEffect(() => {
    console.log('>>>>>>>>>', dataSendToPayment)
    if (paymentType === null && dataSendToPayment?.data !== undefined && dataSendToPayment.data.split('____').length === 2) {
      setPaymentType(dataSendToPayment.data.split('____')[0])
      setMinOperationAmount(dataSendToPayment.data.split('____')[1].split('__')[0])
      setMaxOperationAmount(dataSendToPayment.data.split('____')[1].split('__')[1])
    } else {
      setPaymentNotAvailable(true)
    }
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
          title: 'Recipient bank account:',
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

  const onValueChangeFinancialType = useCallback((item) => setFinancialType(item), [])

  const onValueChangeAllowedOwnership = useCallback((item) => setAllowedOwnership(item), [])

  const onPressAddPaymentAsFrequent = useCallback(() => setAddPaymentAsFrequent(value => !value), [])

  const addToPayment = useCallback(({ key, value }) => {
    setPayment({
      ...payment,
      [key]: value
    })
  }, [payment])

  const onPressPrevious = useCallback(() => setActiveStep(step => step - 1), [])

  const onPressNextCurrency = useCallback(() => setActiveStep(step => step + 1), [])

  const onPressNextBankAccount = useCallback(() => {
    const partialPayment: any = { ...payment }
    delete partialPayment.accountHolderName
    if (JSON.stringify(partialPayment) === JSON.stringify({})) {
      Alert.alert('Attention', 'You must select or create a payment method to continue.', [
        { text: 'Ok' }
      ]);
      return;
    }
    let passFieldValidation = true
    if (financialType?.fields !== undefined) {
      for (const field of financialType?.fields) {
        if (field?.obligatory && payment[field.name] === undefined) {
          passFieldValidation = false
          break
        }
      }
    }
    if (!passFieldValidation) {
      Alert.alert('Attention', 'You must fill all fields to continue.', [
        { text: 'Ok' }
      ]);
      return
    }
    mutateSendToPayment({
      userName: userName,
      currency: currency.value,
      amount: 1,
      payment: payment,
      description: '',
      paymentType: null
    })
    setActiveStep(step => step + 1)
  }, [payment, financialType, currency, amount, payment, description])

  const process = () => {
    console.log('paymentType', paymentType)
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

  const buttonTextStyle = {
    color: '#393939'
  };

  return (
    <>
      <Header
        currency={currency}
        targetImg={'FIAT_BANK_TRANSFER'}
        amount={amount}
        maxAmount={maxAmount}
      />
      <Body>
        <MemoizedSteps
          activeStep={activeStep}
          totalSteps={3}
        >
          <MemoizedStep
            rightButtonLabel={'NEXT'}
            onPressRightButton={onPressNextCurrency}
          >
            <Body_Picker
              selectedValue={detailedBalances.find(cur => cur.value === currency.value)}
              values={detailedBalances.filter(cur => !cur.isCrypto)}
              onValueChange={onValueChangeCurrency}
              labelField={'text'}
            />
            <ViewInstructions
              instructions={INSTRUCTIONS}
              type={'STEPS'}
              width={'100%'}
              marginTop={20}
            />
          </MemoizedStep>
          <MemoizedStep
            leftButtonLabel={'PREVIOUS'}
            onPressLeftButton={onPressPrevious}
            rightButtonLabel={'NEXT'}
            onPressRightButton={onPressNextBankAccount}
          >
            <View style={{ alignItems: 'center', maxHeight: 500 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 13,
                    color: colors.text,
                    marginRight: 20
                  }}
                >
                  {'Add a new one or choose from directory'}
                </Text>
                {!createPayment && <TouchableOpacity
                  style={{
                    marginRight: 10
                  }}
                  onPress={() => {
                    setCreatePayment(true)
                  }}
                >
                  <MaterialCommunityIcons
                    name="plus"
                    color={colors.icon}
                    size={30}
                  />
                </TouchableOpacity>}
                {dataPayments?.length !== undefined && dataPayments.length > 0
                  ?
                  <TouchableOpacity
                    onPress={() => {
                      navigation.dispatch(StackActions.push('FiatBankPaymentsScreen', { ...route.params, selectedCurrency: currency }))
                    }}
                  >
                    <MaterialCommunityIcons
                      name="notebook"
                      color={colors.icon}
                      size={30}
                    />
                  </TouchableOpacity>
                  :
                  null
                }
              </View>
              {createPayment &&
                <ScrollView
                  style={{
                    marginTop: 10
                  }}
                >
                  {dataFinancialTypes?.length > 0 &&
                    <View
                      style={{ width: Dimensions.get('window').width * 0.9 }}
                    >
                      {/* SHOW PICKERS */}
                      <Body_Picker
                        selectedValue={financialType !== null ? dataFinancialTypes.find(finType => finType.name === financialType.name) : dataFinancialTypes[0]}
                        values={dataFinancialTypes}
                        onValueChange={onValueChangeFinancialType}
                        labelField={'name'}
                      />
                      {financialType !== null &&
                        <Body_Picker
                          selectedValue={allowedOwnership}
                          values={financialType?.allowedOwnerships}
                          onValueChange={onValueChangeAllowedOwnership}
                          marginTop={10}
                        />
                      }

                      {/* SHOW INPUTS */}
                      {financialType?.fields?.length > 0 &&
                        <Body_InputsCreatePayment
                          financialType={financialType}
                          allowedOwnership={allowedOwnership}
                          payment={payment}
                          firstName={config.firstName}
                          lastName={config.lastName}
                          addToPayment={addToPayment}
                        />
                      }
                      <CheckBox
                        onPress={onPressAddPaymentAsFrequent}
                        style={{
                          marginTop: 5,
                        }}
                        containerStyle={{
                          backgroundColor: colors.secundaryBackground,
                          borderRadius: 10,
                        }}
                        textStyle={{
                          color: colors.text,
                          fontWeight: 'normal'
                        }}
                        title='Add payment as frequent'
                        checked={addPaymentAsFrequent}
                        checkedColor={colors.icon}
                        uncheckedColor={colors.icon}
                      />
                    </View>
                  }
                </ScrollView>}
            </View>
          </MemoizedStep>
          <MemoizedStep
            leftButtonLabel={'PREVIOUS'}
            onPressLeftButton={onPressPrevious}
            rightButtonLabel={'TRANSFER'}
            onPressRightButton={onPressTransfer}
          >
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
          </MemoizedStep>
        </MemoizedSteps>
      </Body>
      <Modal_Transaction
        data={modalData}
        isVisible={isVisibleModalTransaction}
        label={'BANK TRANSFER'}
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

