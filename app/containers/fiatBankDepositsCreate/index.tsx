//PRINCIPAL
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Text, View, ScrollView, Dimensions } from 'react-native';
import { compose } from 'redux'
import { StackActions } from '@react-navigation/native';
//HOOKS
import { getDollarBTCPayments } from './hooks/getDollarBTCPayments';
import { getCharges } from '../../main/hooks/getCharges';
import { createDeposit } from './hooks/createDeposit';
//FUNCTIONS
import { validateConfirmationModalTransaction } from '../../main/functions';
//COMPONENTS
import Body from '../../main/components/Body'
import Body_Picker from '../../main/components/Body_Picker'
import Body_Input from '../../main/components/Body_Input'
import Body_Button from '../../main/components/Body_Button'
import Modal_Transaction from '../../main/components/Modal_Transaction'
//HOC
import { withColors, withDetailedBalances, withUserName } from '../../main/hoc';

const FiatBankDepositsCreateScreen = ({ navigation, route, colors, userName, detailedBalances }) => {

  //INITIAL STATES
  const [currency, setCurrency] = useState(route?.params?.selectedCurrency !== undefined ? route.params.selectedCurrency : detailedBalances.find(currency => !currency.isCrypto))
  const [amount, setAmount] = useState(0)
  const [payment, setPayment] = useState<any>(null)
  const [isVisibleModalTransaction, setIsVisibleModalTransaction] = useState(false)

  //HOOKS CALLS
  const { isLoading: isLoadingDollarBTCPayments, data: dataDollarBTCPayments, error: errorDollarBTCPayments, refetch: refetchDollarBTCPayments } =
    getDollarBTCPayments(
      userName,
      currency.value
    )

  const { data: dataCharges, error: errorCharges, isLoading: isLoadingCharges } =
    getCharges(
      currency?.value,
      null,
      amount > 0 ? amount : currency?.availableBalance,
      null,
      currency?.availableBalance,
      'MC_BUY_BALANCE',
      null
    )

  const { mutate: mutateCreateDeposit, isSuccess: isSuccessCreateDeposit, isError: isErrorCreateDeposit } =
    createDeposit()

  //EFFECTS
  useEffect(() => {
    console.log('FiatBankDepositsCreateScreen', route.params)
  }, []);

  useEffect(() => {
    if (dataDollarBTCPayments !== undefined) {
      setPayment(dataDollarBTCPayments[0])
    }
  }, [dataDollarBTCPayments])

  useEffect(() => {
    if (payment?.minPerOperationAmount !== undefined) {
      setAmount(payment.minPerOperationAmount)
    }
  }, [payment])

  //MEMOS
  const modalData = useMemo(() => {
    let data: any[] = [];
    if (payment?.details?.bank !== undefined) {
      data.push(
        {
          title: 'Bank:',
          type: 'TEXT',
          value: payment.details.bank,
        }
      );
    }
    data.push(
      {
        title: 'Amount to Deposit:',
        type: 'NUMERIC',
        value: amount,
        valuePreffix: '',
        valueSuffix: currency.value,
        valueDecimals: currency.decimals
      }
    );
    if (dataCharges?.COMMISSION?.amount !== undefined && dataCharges?.COMMISSION?.amount !== 0) {
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
      data.push(
        {
          title: 'Final Amount to Receive:',
          type: 'NUMERIC',
          value: (amount - dataCharges?.COMMISSION.amount),
          valuePreffix: '',
          valueSuffix: currency.value,
          valueDecimals: currency.decimals
        }
      );
    }
    return data;
  }, [currency, payment, amount, dataCharges])

  //CALLBACKS
  const onValueChangeCurrency = useCallback(value => {
    setCurrency(value)
  }, [])

  const onValueChangeDollarBTCPayment = useCallback(value => {
    setPayment(value)
  }, [])

  const onValueChangeAmount = useCallback((maskedText, rawText) => {
    let offLimits = false
    if (Number(payment?.minPerOperationAmount) > Number(rawText)) {
      setAmount(Number(payment.minPerOperationAmount))
      offLimits = true
    }
    if (Number(payment?.maxPerOperationAmount) < Number(rawText)) {
      setAmount(Number(payment.maxPerOperationAmount))
      offLimits = true
    }
    if (!offLimits) {
      setAmount(Number(rawText))
    }
  }, [payment])

  const onPressSendRequest = useCallback(() => {
    setIsVisibleModalTransaction(validateConfirmationModalTransaction(
      [
        { name: 'AMOUNT', value: amount, type: 'NUMERIC' },
      ]
    ))
  }, [amount])

  const process = () => {
    mutateCreateDeposit({
      userName: userName,
      currency: currency.value,
      amount: amount,
      dollarBTCPayment: payment,
      clientPayment: null,
      description: '',
      message: ''
    })
  }

  const onPressClose = useCallback(() => {
    setIsVisibleModalTransaction(false)
    navigation.dispatch(StackActions.pop())
  }, [])

  const onPressCancel = useCallback(() => setIsVisibleModalTransaction(false), [])

  //PRINCIPAL RENDER
  return (
    <>
      <Body>
        <>
          <Body_Picker
            selectedValue={detailedBalances.find(cur => cur.value === currency.value)}
            values={detailedBalances.filter(cur => !cur.isCrypto)}
            onValueChange={onValueChangeCurrency}
            labelField={'text'}
          />
          {!dataDollarBTCPayments ? null : dataDollarBTCPayments?.length > 0
            ?
            <>
              <Body_Picker
                selectedValue={dataDollarBTCPayments?.find(pay => pay?.frontId === payment?.frontId)}
                values={dataDollarBTCPayments}
                onValueChange={onValueChangeDollarBTCPayment}
                marginTop={10}
                labelField={'text'}
              />
              {payment?.messages !== undefined &&
                <ScrollView
                  style={{
                    maxHeight: Dimensions.get('window').height * 0.6,
                    marginTop: 10
                  }}
                >
                  {payment?.messages.map((item, index) => {
                    if (!item.key.includes('MC_BUY_BALANCE__ALERT') || item.key.includes('__EN')) {
                      return
                    }
                    return (
                      <View
                        key={index}
                        style={{
                          marginBottom: 5,
                          padding: 10,
                          borderRadius: 10,
                          borderColor: item.key.split('__')[1].split('_')[1].toLowerCase(),
                          borderWidth: 2,
                          backgroundColor: item.key.split('__')[1].split('_')[1].toLowerCase() === 'red' ? '#FEC4C3' : item.key.split('__')[1].split('_')[1].toLowerCase() === 'blue' ? '#C3E1FE' : '#D6FEC3',
                        }}
                      >
                        <Text
                          style={{
                            color: item.key.split('__')[1].split('_')[1].toLowerCase()
                          }}
                        >
                          {item.value}
                        </Text>
                      </View>
                    )
                  })}
                </ScrollView>}
              <View
                style={{
                  marginTop: 20,
                  width: Dimensions.get('window').width * 0.9,
                  alignSelf: 'center'
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      flex: 0.3,
                      color: colors.text,
                      fontWeight: 'bold'
                    }}
                  >
                    Limits:
                  </Text>
                  <Text
                    style={{
                      flex: 0.7,
                      color: colors.text,
                    }}
                  >
                    {payment?.minPerOperationAmount} - {payment?.maxPerOperationAmount}
                  </Text>
                </View>
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
                  onChangeText={onValueChangeAmount}
                />
                <Body_Button
                  label={'SEND REQUEST'}
                  onPress={onPressSendRequest}
                />
              </View>
            </>
            :
            <Text
              style={{
                color: 'red',
                alignSelf: 'center',
                marginTop: 10
              }}
            >
              {'There is no options available for this currency'}
            </Text>
          }
        </>
      </Body>
      <Modal_Transaction
        data={modalData}
        isVisible={isVisibleModalTransaction}
        label={'CREATE BANK DEPOSIT'}
        process={process}
        isSuccess={isSuccessCreateDeposit}
        isError={isErrorCreateDeposit}
        onPressClose={onPressClose}
        onPressCancel={onPressCancel}
        allowSecongAuthStrategy={false}
      />
    </>
  );
};

export default React.memo(compose(withColors, withUserName, withDetailedBalances)(FiatBankDepositsCreateScreen));

