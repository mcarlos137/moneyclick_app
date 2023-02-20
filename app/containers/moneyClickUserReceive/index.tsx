//PRINCIPAL
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { compose } from 'redux'
//FUNCTIONS
import { shareSVG } from '../../main/functions';
//COMPONENTS
import Body from '../../main/components/Body';
import Body_Picker from '../../main/components/Body_Picker';
import Body_Input from '../../main/components/Body_Input';
import Body_Button from '../../main/components/Body_Button';
//HOC
import { withAuth, withColors, withConfig, withDetailedBalances, withUserName } from '../../main/hoc';

const MoneyClickUserReceiveScreen = ({ navigation, route, colors, userName, config, auth, detailedBalances }) => {

  //VARIABLES
  var svg = null

  //INITIAL STATES
  const [currency, setCurrency] = useState(route.params.selectedCurrency)
  const [amount, setAmount] = useState(0)
  const [description, setDescription] = useState('')

  //EFFECTS
  useEffect(() => {
    console.log('MoneyClickUserReceiveScreen', route.params)
  }, []);

  //MEMOS
  const qr = useMemo(() => {
    let qr: any = {};
    qr.userName = userName;
    qr.nickName = config.nickName
    qr.phone = auth.phone
    if (config.firstName !== undefined) {
      qr.firstName = config.firstName;
    }
    if (config.lastName !== undefined) {
      qr.lastName = config.lastName;
    }
    qr.currency = currency.value;
    qr.amount = amount;
    if (description !== '') {
      qr.description = description;
    }
    return JSON.stringify(qr);
  }, [currency, amount, description])

  //CALLBACKS
  const onPressShareSVG = useCallback(() => {
    shareSVG(svg)
  }, [svg])

  const onChangeTextCurrency = useCallback(item => {
    setCurrency(item)
  }, [])

  const onChangeTextAmount = useCallback((maskedText, rawText) => {
    setAmount(Number(rawText))
  }, [])

  const onChangeTextDescription = useCallback(text => {
    setDescription(text)
  }, [])

  //PRINCIPAL RENDER
  return (
    <View style={{
      flex: 1
    }}>
      <Body>
        <>
          <Body_Picker
            selectedValue={detailedBalances.find(cur => cur.value === currency.value)}
            values={detailedBalances.filter(cur => !cur.isCrypto)}
            onValueChange={onChangeTextCurrency}
            labelField={'text'}
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
            <QRCode
              value={qr}
              color={colors.icon}
              backgroundColor={colors.primaryBackground}
              size={Dimensions.get("window").width - 160}
              getRef={(c) => {
                svg = c
              }}
              quietZone={10}
              logoMargin={10}
              logoBackgroundColor='white'
            />
          </View>
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
          <Body_Input
            value={description}
            onChangeText={onChangeTextDescription}
            placeholder={'Description'}
            type={'text'}
          />
          <Body_Button
            label={'SHARE'}
            onPress={onPressShareSVG}
          />
        </>
      </Body>
    </View>
  );
};

export default React.memo(compose(withColors, withUserName, withConfig, withAuth, withDetailedBalances)(MoneyClickUserReceiveScreen));
