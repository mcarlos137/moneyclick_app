//PRINCIPAL
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import { compose } from 'redux';
import { StackActions } from '@react-navigation/native';
//HOOKS
import { getCharges } from '../../main/hooks/getCharges';
import { addSubstractDebitCardBalance } from './hooks/addSubstractDebitCardBalance';
//COMPONENTS
import Body from '../../main/components/Body'
import Header from '../../main/components/Header'
import Body_Picker from '../../main/components/Body_Picker'
import Body_Input from '../../main/components/Body_Input'
import Body_TextRight from '../../main/components/Body_TextRight'
import Body_Button from '../../main/components/Body_Button'
import Modal_Transaction from '../../main/components/Modal_Transaction'
//HOC
import { withColors, withDetailedBalances, withUserName } from '../../main/hoc';
//FUNCTIONS
import { validateConfirmationModalTransaction } from '../../main/functions';

const DebitCardsAddSubstractBalanceScreen = ({ navigation, route, colors, userName, detailedBalances }) => {

  //INITIAL STATES
  const [currency, setCurrency] = useState<any>(detailedBalances.find(cur => cur.value === route.params.selectedDebitCard.currency))
  const [amount, setAmount] = useState(0)
  const [operationType, setOperationType] = useState('ADD')
  const [isVisibleModalTransaction, setIsVisibleModalTransaction] = useState(false)

  //HOOKS CALLS
  const { data: dataCharges, error: errorCharges, isLoading: isLoadingCharges } =
    getCharges(
      currency?.value,
      null,
      amount > 0 ? amount : currency?.availableBalance,
      null,
      currency?.availableBalance,
      'DEBIT_CARD_ADD_BALANCE',
      null
    )

  const { mutate: mutateAddSubstractDebitCardBalance, isSuccess: isSuccessAddSubstractDebitCardBalance, isError: isErrorAddSubstractDebitCardBalance } =
    addSubstractDebitCardBalance()

  //EFFECTS
  useEffect(() => {
    console.log('DebitCardsAddSubstractBalanceScreen', route.params)
    //route.params.selectedDebitCard.id
    //route.params.selectedDebitCard.type
    //route.params.selectedDebitCard.currency
    //'DEBIT_CARD_ADD_BALANCE' CHARGE
  }, []);

  //MEMOS
  const maxAmount = useMemo(() =>
    dataCharges?.COMMISSION?.maxOperationAmount !== undefined ? dataCharges.COMMISSION.maxOperationAmount : currency.availableBalance
    , [dataCharges, currency])

  const modalData = useMemo(() => {
    let data: any = [];
    data.push(
      {
        title: 'Amount to ' + operationType + ':',
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
          value: dataCharges?.COMMISSION?.amount,
          valuePreffix: '',
          valueSuffix: currency.value,
          valueDecimals: currency.decimals
        }
      );
      data.push(
        {
          title: 'Amount to ' + operationType + ':',
          type: 'NUMERIC',
          value: (amount - dataCharges?.COMMISSION?.amount),
          valuePreffix: '',
          valueSuffix: currency.value,
          valueDecimals: currency.decimals
        }
      );
    }
    if (route.params.selectedDebitCard.type !== 'MONEYCLICK') {
      data.push(
        {
          title: 'Attention:',
          type: 'TEXT',
          value: 'Your new balance will be available in next 2 hours.',
        }
      );
    }
    return data;
  }, [currency, amount, operationType, dataCharges])

  //CALLBACKS
  const onValueChangeOperationType = useCallback((item) => {
    setOperationType(item)
  }, [])

  const onChangeTextAmount = useCallback((maskedText, rawText) => {
    if (Number(maxAmount) > Number(rawText)) {
      setAmount(Number(rawText))
    } else {
      setAmount(Number(maxAmount))
    }
  }, [maxAmount])

  const renderTextMax = useCallback((value) => (
    <Text style={{
      fontSize: 12,
      fontWeight: 'bold',
      marginTop: 5,
      color: colors.text
    }}>
      {`You can ${operationType.toLowerCase()} up to ` + currency.symbol + ' ' + value}
    </Text>
  ), [currency, operationType])

  const onPressAddSubsctract = useCallback(() => {
    setIsVisibleModalTransaction(validateConfirmationModalTransaction(
      [
        { name: 'AMOUNT', value: amount, type: 'NUMERIC' },
      ]
    ))
  }, [amount])

  const onPressCancel = useCallback(() => {
    setIsVisibleModalTransaction(false)
  }, [])

  const onPressClose = useCallback(() => {
    setIsVisibleModalTransaction(false)
    navigation.dispatch(StackActions.popToTop())
  }, [])

  const process = () => {
    mutateAddSubstractDebitCardBalance({
      userName: userName,
      amount: amount,
      operationType: operationType,
      id: route.params.selectedDebitCard.id
    })
  }

  //PRINCIPAL RENDER
  return (
    <>
      <Header
        currency={currency}
        targetImg={'DEBIT_CARD'}
        maxAmount={maxAmount}
        amount={amount}
      />
      <Body>
        <>
          <Body_Picker
            selectedValue={operationType}
            values={['ADD', 'SUBSTRACT']}
            onValueChange={onValueChangeOperationType}
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
            placeholder={'Amount'}
            type={'money'}
          />
          <Body_TextRight
            value={maxAmount}
            decimalScale={currency.decimals}
            renderText={renderTextMax}
          />
          <Body_Button
            onPress={onPressAddSubsctract}
            label={operationType.toUpperCase()}
          />
        </>
      </Body>
      <Modal_Transaction
        data={modalData}
        isVisible={isVisibleModalTransaction}
        label={'DEBIT CARD ADD/SUBSTRACT BALANCE'}
        process={process}
        isSuccess={isSuccessAddSubstractDebitCardBalance}
        isError={isErrorAddSubstractDebitCardBalance}
        onPressCancel={onPressCancel}
        onPressClose={onPressClose}
        allowSecongAuthStrategy={true}
      />
    </>
  );
};

export default React.memo(compose(withColors, withUserName, withDetailedBalances)(DebitCardsAddSubstractBalanceScreen));
