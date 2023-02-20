import React, { Fragment, createRef } from 'react';
import {
  Dimensions,
  FlatList,
  RefreshControl,
  View,
  Text,
  Button,
  TouchableOpacity,
  Image
} from 'react-native'
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from "react-redux";
//STORES
import { indexStore } from '../store'
import { changeBuyBalanceOperationStatusStore } from '../../fiatBankDeposits/store';
import { navigateStore } from '../../../main/store'
//ACTIONS
import { changeBuyBalanceOperationStatusAction } from '../../fiatBankDeposits/actions';

//FUNCTIONS
import { getRequire, handleChooseDocument } from '../../../main/functions';
//CONSTANTS
import { NAVIGATE, SET_FIAT_BANK_DEPOSIT_PAY_FILE_ASSET } from '../../../constants/action-types'
import currenciesParams from '../../../constants/currenciesParams';
//COMPONENTS
import View_Payment from '../../fiatBankDepositsDetails/components/View_Payment'
import ActionSheetDocument from '../../../main/components/ActionSheetDocument'

const mapStateToProps = state => {
  return {
    selectedFiatBankDepositState: state.selectedFiatBankDepositState,
    actionSheetDocumentRefState: state.actionSheetDocumentRefState,
    fileAssetState: state.fileAssetState
  };
};

const ConnectedComponent = ({ selectedFiatBankDepositState, actionSheetDocumentRefState, fileAssetState }) => (
  <View
    style={{
      width: Dimensions.get('window').width * 0.95,
      alignSelf: 'center',
      marginTop: 10,
      marginBottom: 20,
      flex: 1
    }}
  >
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
    <View_Payment selectedPayment={selectedFiatBankDepositState.dollarBTCPayment} />
    
    {JSON.stringify(fileAssetState) !== JSON.stringify({}) &&
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
            uri: fileAssetState.uri,
          }}
        />
        <TouchableOpacity
          onPress={() => {
            indexStore.dispatch({ type: SET_FIAT_BANK_DEPOSIT_PAY_FILE_ASSET, payload: {} })
          }}
          style={{
            marginLeft: 30
          }}
        >
          <IconMaterialCommunity
            name={'delete'}
            color={navigateStore.getState().selectedColorState}
            size={30}
          />
        </TouchableOpacity>
      </View>}
      
    <TouchableOpacity
      style={{
        backgroundColor: navigateStore.getState().selectedColorState,
        marginTop: 10
      }}
      onPress={() => {
        if (JSON.stringify(fileAssetState) === JSON.stringify({})) {
          actionSheetDocumentRefState.current?.setModalVisible(true);
        } else {
          //SEND IMAGE TO CHAT
          changeBuyBalanceOperationStatusStore.dispatch(
            changeBuyBalanceOperationStatusAction(
              selectedFiatBankDepositState.id,
              'PAY_VERIFICATION',
              null
            )
          )
        }
      }}
    >
      <Text
        style={{
          alignSelf: 'center',
          color: 'white',
          padding: 10
        }}
      >
        {JSON.stringify(fileAssetState) === JSON.stringify({}) ? 'UPLOAD PAYMENT FILE' : 'SEND'}
      </Text>
    </TouchableOpacity>
    <ActionSheetDocument
      actionSheetDocumentRef={actionSheetDocumentRefState}
      operation={'FIAT_BANK_DEPOSIT_PAY'}
      cameraType={'CAMERA_PHOTO'}
      libraryType={'LIBRARY_PHOTO'}
      color={navigateStore.getState().selectedColorState}
    />
  </View>
)

export default connect(mapStateToProps)(ConnectedComponent)