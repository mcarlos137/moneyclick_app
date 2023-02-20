//PRINCIPAL
import React, { createRef, useCallback, useEffect, useState } from 'react';
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { compose } from 'redux';
import { StackActions } from '@react-navigation/native';
//COMPONENTS
import Body from '../../main/components/Body'
import Body_Button from '../../main/components/Body_Button'
import ActionSheetDocument from '../../main/components/ActionSheetDocument'
import View_Payment from '../fiatBankDepositsDetails/components/View_Payment';
//HOC
import { withColors } from '../../main/hoc';
//FUNCTIONS
import { handleChooseDocument } from '../../main/functions';
//HOOKS
import { changeDepositStatus } from '../../main/hooks/changeDepositStatus'

const FiatBankDepositsPayScreen = ({ navigation, route, colors }) => {

  //INITIAL STATES
  const [asset, setAsset] = useState<any>({})
  const [actionSheetDocumentRef, setActionSheetDocumentRef] = useState<any>(createRef())

  //HOOKS CALLS
  const { mutate: mutateChangeDepositStatus, isLoading: isLoadingChangeDepositStatus } =
    changeDepositStatus()

  //EFFECTS
  useEffect(() => {
    console.log('FiatBankDepositsPayScreen', route.params)
  }, []);

  //CALLBACKS
  const onPressCamera = useCallback(() => {
    actionSheetDocumentRef.current?.setModalVisible(false);
    navigation.dispatch(StackActions.push('CameraBridgeScreen', { ...route.params }))
  }, [actionSheetDocumentRef])

  const onPressLibrary = useCallback(() => {
    handleChooseDocument(
      'LIBRARY_PHOTO',
      {
        maxWidth: 300,
        maxHeight: 550,
        quality: 1,
      },
      (asset) => {
        setAsset(asset)
        actionSheetDocumentRef.current?.setModalVisible(false);
      }
    )
  }, [])

  return (
    <Body>
      <>
        <Text
          style={{
            fontWeight: 'bold',
            width: Dimensions.get('window').width * 0.9,
            alignSelf: 'center',
            marginTop: 20
          }}
        >
          Deposit exact amount to:
        </Text>
        <View_Payment selectedPayment={route.params.selectedFiatBankDeposit.dollarBTCPayment} />
        {JSON.stringify(asset) !== JSON.stringify({}) &&
          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Image
              style={{
                width: 100,
                height: 100,
              }}
              source={{
                uri: asset.uri,
              }}
            />
            <TouchableOpacity
              onPress={() => {
                setAsset({})
              }}
              style={{
                marginLeft: 30
              }}
            >
              <MaterialCommunityIcons
                name={'delete'}
                color={colors.icon}
                size={30}
              />
            </TouchableOpacity>
          </View>}
        <Body_Button
          onPress={() => {
            if (JSON.stringify(asset) === JSON.stringify({})) {
              actionSheetDocumentRef.current?.setModalVisible(true);
            } else {
              //SEND IMAGE TO CHAT
              mutateChangeDepositStatus({
                id: route.params.selectedFiatBankDeposit.id,
                otcOperationStatus: 'PAY_VERIFICATION',
                canceledReason: ''
              })
            }
          }}
          label={JSON.stringify(asset) === JSON.stringify({}) ? 'UPLOAD PAYMENT FILE' : 'SEND'}
        />
        <ActionSheetDocument
          reference={actionSheetDocumentRef}
          onPressCamera={onPressCamera}
          onPressLibrary={onPressLibrary}
        />
      </>
    </Body>
  );
};

export default React.memo(compose(withColors)(FiatBankDepositsPayScreen));
