//PRINCIPAL
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Dimensions, View, Text, Alert } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import QRCode from 'react-native-qrcode-svg';
import { compose } from 'redux'
//STORES
import { store as balanceStore } from '../../main/stores/balance'
//FUNCTIONS
import {
  shareSVG,
} from '../../main/functions'
//HOC
import { withColors, withConfig } from '../../main/hoc';
//COMPONENTS
import Body from '../../main/components/Body';
import Body_Pickers from './components/Body_Pickers'
import Body_Buttons from './components/Body_Buttons'
import Body_Input from '../../main/components/Body_Input'

const CryptoReceiveScreen = ({ navigation, route, colors, config }) => {

  //INITIAL STATES
  const [currency, setCurrency] = useState<any>({})
  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState(0.00)
  const [description, setDescription] = useState('')
  const [currencyProtocol, setCurrencyProtocol] = useState('')
  const [svg, setSvg] = useState(null)

  //EFFECTS
  useEffect(() => {
    console.log('CryptoReceiveScreen', route.params)
    let cryptoReceiveAddress;
    if (route?.params?.selectedCurrency?.isCrypto) {
      cryptoReceiveAddress = config
      switch (route.params.selectedCurrency.value) {
        case 'BTC':
        case 'BCH':
          cryptoReceiveAddress = config.currentBitcoinAddress
          break;
        case 'ETH':
          cryptoReceiveAddress = config.currentEthereumAddress
          break;
        case 'DOGE':
          cryptoReceiveAddress = config.currentDogecoinAddress
          break;
        case 'USDT':
          cryptoReceiveAddress = config.currentEthereumAddress
          setCurrencyProtocol('ERC20')
          break;
        case 'LTC':
          cryptoReceiveAddress = config.currentLitecoinAddress
        case 'DASH':
          cryptoReceiveAddress = config.currentDashAddress
        case 'XRP':
          cryptoReceiveAddress = config.currentRippleAddress
      }
      setCurrency(route.params.selectedCurrency)
    } else {
      cryptoReceiveAddress = config.currentBitcoinAddress;
      setCurrency(balanceStore.getState().detailedBalances.find(currency => currency.value === 'BTC'))
    }
    console.log('cryptoReceiveAddress', cryptoReceiveAddress)
    setAddress(cryptoReceiveAddress)
  }, [])

  useEffect(() => {
    let address
    switch (currency.value) {
      case 'BTC':
      case 'BCH':
        address = config.currentBitcoinAddress
        break;
      case 'ETH':
        address = config.currentEthereumAddress
        break;
      case 'USDT':
        setCurrencyProtocol(currency.protocols[0])
        if (currency.protocols[0] === 'ERC20') {
          address = config.currentEthereumAddress
        } else if (currency.protocols[0] === 'TRC20') {
          address = config.currentTronAddress
        }
        break;
      case 'DOGE':
        address = config.currentDogecoinAddress
        break;
      case 'LTC':
        address = config.currentLitecoinAddress
        break;
      case 'DASH':
        address = config.currentDashAddress
        break;
      case 'XRP':
        address = config.currentRippleAddress
        break;
    }
    setAddress(address)
  }, [currency])

  //MEMOS
  const qr = useMemo(() => {
    let qr = '';
    if (currency?.value === 'USDT') {
      return address;
    }
    let qrType = currency?.value === 'BTC' ? 'bitcoin:' : 'ethereum:';
    qr = qrType + address + '?amount=';
    if (amount !== 0.0) {
      qr = qr + Number(amount).toFixed(8);
    }
    if (description !== '') {
      qr = qr + '&message=' + description;
    }
    return qr;
  }, [currency, address, amount, description])

  //CALLBACKS

  const onValueChangeCurrency = useCallback((item) => {
    setCurrency(item)
  }, [])

  const onValueChangeProtocol = useCallback((item) => {
    setCurrencyProtocol(item)
    let address;
    if (currency?.value === 'USDT') {
      if (item === 'ERC20') {
        address = config.currentEthereumAddress
      } else if (item === 'TRC20') {
        address = config.currentTronAddress
      }
    }
    setAddress(address)
  }, [currency])

  const onPressCopy = useCallback(() => {
    Clipboard.setString(address)
  }, [address])

  const onPressShare = useCallback(() => {
    shareSVG(svg)
  }, [svg])

  const onChangeTextAmount = useCallback((maskedText, rawText) => {
    setAmount(rawText)
  }, [])

  const onChangeTextDescription = useCallback(text => {
    setDescription(text)
  }, [])

  //PRINCIPAL RENDER
  return (
    <>
      <Body>
        <>
          <Body_Pickers
            selectedCurrency={currency}
            currencies={balanceStore.getState().detailedBalances.filter(currency => currency.isCrypto)}
            currencyProtocol={currencyProtocol}
            onValueChangeCurrency={onValueChangeCurrency}
            onValueChangeProtocol={onValueChangeProtocol}
          />
          <View
            style={{
              borderBottomColor: 'silver',
              paddingTop: 10,
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            {address !== '' &&
              <View
                style={{
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                }}>
                <QRCode
                  value={qr}
                  color={colors.icon}
                  backgroundColor={colors.primaryBackground}
                  size={Dimensions.get("window").width - 160}
                  getRef={(c) => {
                    setSvg(c)
                  }}
                  quietZone={10}
                  logoMargin={10}
                  logoBackgroundColor='white'
                />
                <Text style={{ fontSize: Dimensions.get("window").width * 0.028 }}>
                  {address}
                </Text>
              </View>}
          </View>
          {currency?.value !== 'USDT'
            ?
            <>
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
            </>
            :
            null
          }
          <Body_Buttons
            onPressCopy={onPressCopy}
            onPressShare={onPressShare}
          />
        </>
      </Body>
    </>
  );
};

export default React.memo(compose(withColors, withConfig)(CryptoReceiveScreen));

