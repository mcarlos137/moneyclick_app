//PRINCIPAL
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, FlatList, Text, ScrollView, Dimensions } from 'react-native';
import { NumericFormat } from 'react-number-format';
import { TextInputMask } from 'react-native-masked-text';
import { compose } from 'redux'
//FUNCTIONS
import {
  getPairComponents
} from '../../main/functions'
//CONSTANTS
import { currencies as currenciesParams } from '../../constants/currenciesParams';
//WEBSOCKETS
import {
  wsArray,
  close,
  start
} from '../../main/websockets/getOrdersBook'
//COMPONENTS
import Body_ListOrders from './components/Body_ListOrders'
import Body_Picker from './components/Body_Picker'
//HOC
import { withColors, withDetailedBalances } from '../../main/hoc';

const OrdersBookScreen = ({ navigation, route, colors, detailedBalances }) => {

  //INITIAL STATE
  const [pair, setPair] = useState(route?.params?.selectedPair !== undefined ? route.params.selectedPair : 'USDVES')
  const [currency, setCurrency] = useState(detailedBalances.find(currency => currency.value === getPairComponents(pair)[1]))
  const [data, setData] = useState<any>({})
  const [operationType, setOperationType] = useState('BUY')
  const [priceType, setPriceType] = useState('MARKET_PRICE')
  const [price, setPrice] = useState(0)

  //EFFECTS
  useEffect(() => {
    console.log('OrdersBookScreen', route.params)
    start(pair, ['ASK', 'BID'], addData)
    return () => {
      close(wsArray)
    }
  }, [])

  useEffect(() => {
    setPrice(priceType === 'MARKET_PRICE'
      ? operationType === 'BUY'
        ? data.ASK === undefined || data.ASK.length === 0 ? 0 : data.ASK[0].price
        : data.BID === undefined || data.BID.length === 0 ? 0 : data.BID[0].price
      : 0)
  }, [priceType, operationType, data])

  useEffect(() => {
    close(wsArray)
    start(pair, ['ASK', 'BID'], addData)
  }, [pair])

  //MEMOS
  const maxAmount = useMemo(() => {
    let cur = detailedBalances.find((cur) => cur.value === getPairComponents(pair)[operationType === 'BUY' ? 1 : 0]);
    return cur.availableBalance
  }, [pair])

  //CALLBACKS
  const onValueChangePair = useCallback(value => {
    setPair(value)
  }, [])

  const onValueChangeOperationType = useCallback(value => {
    setOperationType(value)
  }, [])

  const onValueChangePriceType = useCallback(value => {
    setPriceType(value)
  }, [])

  const onChangeTextPrice = useCallback((maskedText, rawText) => {
    setPrice(Number(rawText))
  }, [])

  const addData = useCallback(data => {
    let newData = {};
    let started = false;
    Object.entries(data).forEach(([key, value]) => {
      started = buildChartData(started, newData, value)
    })
    setData((previousData) => ({ ...previousData, ...newData }))
  }, [])

  const buildChartData = useCallback((started, chartData, value) => {
    if (chartData[value.type] === undefined || !started) {
      chartData[value.type] = [];
      chartData[value.type].push(
        {
          index: 0,
          count: 1,
          amount: Number(value.amount).toFixed(getAmountDecimals(value.pair)),
          total: Number(value.amount).toFixed(getAmountDecimals(value.pair)),
          price: Number(value.price).toFixed(getPriceDecimals(value.pair)),
          parts: [{ id: value.id, amount: Number(value.amount).toFixed(getAmountDecimals(value.pair)) }]
        }
      )
    } else {
      let lastValue = chartData[value.type][chartData[value.type].length - 1];
      if (Number(lastValue.price).toFixed(getPriceDecimals(value.pair)) === Number(value.price).toFixed(getPriceDecimals(value.pair))) {
        lastValue.count = Number(lastValue.count) + 1;
        lastValue.amount = Number(lastValue.amount) + Number(value.amount);
        lastValue.amount = Number(lastValue.amount).toFixed(getAmountDecimals(value.pair))
        lastValue.total = Number(lastValue.total) + Number(value.amount);
        lastValue.total = Number(lastValue.total).toFixed(getAmountDecimals(value.pair))
        lastValue.parts.push({ id: value.id, amount: Number(value.amount).toFixed(getAmountDecimals(value.pair)) })
      } else {
        let index = Number(lastValue.index) + 1;
        let count = 1;
        let amount = Number(value.amount).toFixed(getAmountDecimals(value.pair));
        let total = Number(Number(lastValue.total) + Number(value.amount)).toFixed(getAmountDecimals(value.pair))
        let price = Number(value.price).toFixed(getPriceDecimals(value.pair));
        let parts = [{ id: value.id, amount: Number(value.amount).toFixed(getAmountDecimals(value.pair)) }];
        chartData[value.type].push(
          { index: index, count: count, amount: amount, total: total, price: price, parts: parts }
        )
      }
    }
    return true;
  }, [])

  //FUNCTIONS
  function getPriceDecimals(pair) {
    return 2;
  }

  function getAmountDecimals(pair) {
    if (pair.includes('BTC')) {
      return 8;
    }
    return 2;
  }

  //PRINCIPAL RENDER
  return (
    <View style={{
      flex: 1
    }}>
      <Body_ListOrders pair={pair} data={data.BID} backgroundColor={'#71BD6A'} />
      <Body_ListOrders pair={pair} data={data.ASK} backgroundColor={'#D14B5A'} />
      <ScrollView
        style={{ marginTop: 10 }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <Body_Picker
            selectedValue={pair}
            values={[{ label: 'USDVES', value: 'USDVES' }, { label: 'EURUSD', value: 'EURUSD' }, { label: 'USDMXN', value: 'USDMXN' }, { label: 'USDCOP', value: 'USDCOP' }, { label: 'USDARS', value: 'USDARS' }]}
            onValueChange={onValueChangePair}
          />
          <Body_Picker
            selectedValue={operationType}
            values={[{ label: 'Buy', value: 'BUY' }, { label: 'Sell', value: 'SELL' }]}
            onValueChange={onValueChangeOperationType}
          />
          <Body_Picker
            selectedValue={priceType}
            values={[{ label: 'Market Price', value: 'MARKET_PRICE' }, { label: 'User Price', value: 'USER_PRICE' }]}
            onValueChange={onValueChangePriceType}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 10
          }}
        >
          <TextInputMask
            editable={priceType === 'USER_PRICE'}
            includeRawValueInChangeText={true}
            onChangeText={onChangeTextPrice}
            options={{
              precision: 2,
              separator: '.',
              delimiter: ',',
              unit: currenciesParams[getPairComponents(pair)[1]].symbol + '/' + currenciesParams[getPairComponents(pair)[0]].symbol + ' ',
              //prefixUnit: currenciesParams[getPairComponents(pair)[1]].symbol + '/' + currenciesParams[getPairComponents(pair)[0]].symbol + '',
            }}
            value={String(price)}
            type={'money'}
            placeholder={'Price'}
            placeholderTextColor={colors.placeholderText}
            style={{
              fontSize: 14,
              color: colors.text,
              backgroundColor: colors.primaryBackground,
              width: Dimensions.get('window').width * 0.46,
              padding: 10,
              borderRadius: 10
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default React.memo(compose(withColors, withDetailedBalances)(OrdersBookScreen));
