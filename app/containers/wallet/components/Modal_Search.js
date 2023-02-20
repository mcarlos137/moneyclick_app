import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import { connect } from "react-redux";
import { useTheme } from 'react-native-paper';
//STORES
import {
  navigateStore,
  visibleStore,
  authPersistedStore
} from '../../../main/store';
//ACTIONS
import {
  NAVIGATE,
  OPEN_SEARCH_MODAL,
  VISIBLE
} from '../../../constants/action-types';
import { indexStore } from '../store';

const mapStateToProps = state => {
  return {
    openSearchModalState: state.openSearchModalState
  };
};

const ConnectedComponent = ({ openSearchModalState }) => {
  const { colors } = useTheme();
  return (
    <Modal
      transparent={true}
      isVisible={openSearchModalState}
      style={{ margin: 0, alignItems: 'center', justifyContent: 'flex-end' }}
      backdropColor={colors.backdrop}
      backdropOpacity={0.7}
      animationIn='slideInRight'
      animationOut='slideOutLeft'
      animationInTiming={500}
      animationOutTiming={500}
      backdropTransitionInTiming={500}
      backdropTransitionOutTiming={500}
    >
      <View
        style={{
          height: Dimensions.get('window').height * 0.9,
          width: Dimensions.get('window').width,
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          backgroundColor: colors.primaryBackground,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            indexStore.dispatch({ type: OPEN_SEARCH_MODAL, payload: false })
          }}
          style={{
            alignSelf: 'flex-end',
            marginRight: 10
          }}
        >
          <IconMaterialCommunity
            name="close"
            color={colors.icon}
            size={25}
          />
        </TouchableOpacity>
        <View
          style={{
            margin: 10,
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontWeight: 'bold',
            }}
          >
            Digital Business
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
          >
            <TouchableOpacity
              style={{
                padding: 5,
                marginTop: 10,
                borderColor: navigateStore.getState().selectedColorState,
                borderWidth: 2,
                borderRadius: 5,
                marginLeft: 10,
                flexDirection: 'row',
                alignItems: 'center'
              }}
              onPress={() => {
                navigateStore.dispatch({ type: NAVIGATE, payload: { target: 'FiatBankTransfersScreen' } })
                indexStore.dispatch({ type: OPEN_SEARCH_MODAL, payload: false })
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  marginRight: 5
                }}
              >
                How to earn money
              </Text>
              <IconMaterialCommunity
                name="crosshairs-question"
                color={navigateStore.getState().selectedColorState}
                size={25}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: 5,
                marginTop: 10,
                borderColor: navigateStore.getState().selectedColorState,
                borderWidth: 2,
                borderRadius: 5,
                marginLeft: 10,
                flexDirection: 'row',
                alignItems: 'center'
              }}
              onPress={() => {
                navigateStore.dispatch({ type: NAVIGATE, payload: { target: 'DigitalBusinessScreen' } })
                indexStore.dispatch({ type: OPEN_SEARCH_MODAL, payload: false })
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  marginRight: 5
                }}
              >
                My balance
              </Text>
              <IconMaterialCommunity
                name="cash-multiple"
                color={navigateStore.getState().selectedColorState}
                size={25}
              />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              color: colors.text,
              fontWeight: 'bold',
              marginTop: 20
            }}
          >
            Banks
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
          >
            <TouchableOpacity
              style={{
                padding: 5,
                marginTop: 10,
                borderColor: navigateStore.getState().selectedColorState,
                borderWidth: 2,
                borderRadius: 5,
                marginLeft: 10,
                flexDirection: 'row',
                alignItems: 'center'
              }}
              onPress={() => {
                navigateStore.dispatch({ type: NAVIGATE, payload: { target: 'FiatBankTransfersScreen' } })
                indexStore.dispatch({ type: OPEN_SEARCH_MODAL, payload: false })
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  marginRight: 5
                }}
              >
                Transfer
              </Text>
              <IconMaterialCommunity
                name="bank-transfer-in"
                color={navigateStore.getState().selectedColorState}
                size={25}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: 5,
                marginTop: 10,
                borderColor: navigateStore.getState().selectedColorState,
                borderWidth: 2,
                borderRadius: 5,
                marginLeft: 10,
                flexDirection: 'row',
                alignItems: 'center'
              }}
              onPress={() => {
                navigateStore.dispatch({ type: NAVIGATE, payload: { target: 'FiatBankDepositsScreen' } })
                indexStore.dispatch({ type: OPEN_SEARCH_MODAL, payload: false })
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  marginRight: 5
                }}
              >
                Deposit
              </Text>
              <IconMaterialCommunity
                name="bank-transfer-out"
                color={navigateStore.getState().selectedColorState}
                size={25}
              />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              color: colors.text,
              fontWeight: 'bold',
              marginTop: 20
            }}
          >
            Internal users
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
          >
            <TouchableOpacity
              style={{
                padding: 5,
                marginTop: 10,
                borderColor: navigateStore.getState().selectedColorState,
                borderWidth: 2,
                borderRadius: 5,
                marginLeft: 10,
                flexDirection: 'row',
                alignItems: 'center'
              }}
              onPress={() => {
                navigateStore.dispatch({ type: NAVIGATE, payload: { target: 'MoneyClickUserSendScreen' } })
                indexStore.dispatch({ type: OPEN_SEARCH_MODAL, payload: false })
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  marginRight: 5
                }}
              >
                Send
              </Text>
              <IconMaterialCommunity
                name="account-arrow-left"
                color={navigateStore.getState().selectedColorState}
                size={25}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: 5,
                marginTop: 10,
                borderColor: navigateStore.getState().selectedColorState,
                borderWidth: 2,
                borderRadius: 5,
                marginLeft: 10,
                flexDirection: 'row',
                alignItems: 'center'
              }}
              onPress={() => {
                navigateStore.dispatch({ type: NAVIGATE, payload: { target: 'MoneyClickUserReceiveScreen' } })
                indexStore.dispatch({ type: OPEN_SEARCH_MODAL, payload: false })
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  marginRight: 5
                }}
              >
                Receive
              </Text>
              <IconMaterialCommunity
                name="account-arrow-right"
                color={navigateStore.getState().selectedColorState}
                size={25}
              />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              color: colors.text,
              fontWeight: 'bold',
              marginTop: 20
            }}
          >
            Crypto
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
          >
            <TouchableOpacity
              style={{
                padding: 5,
                marginTop: 10,
                borderColor: navigateStore.getState().selectedColorState,
                borderWidth: 2,
                borderRadius: 5,
                marginLeft: 10,
                flexDirection: 'row',
                alignItems: 'center'
              }}
              onPress={() => {
                navigateStore.dispatch({ type: NAVIGATE, payload: { target: 'CryptoReceiveScreen' } })
                indexStore.dispatch({ type: OPEN_SEARCH_MODAL, payload: false })
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  marginRight: 5
                }}
              >
                Deposit
              </Text>
              <IconMaterialCommunity
                name="qrcode"
                color={navigateStore.getState().selectedColorState}
                size={25}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: 5,
                marginTop: 10,
                borderColor: navigateStore.getState().selectedColorState,
                borderWidth: 2,
                borderRadius: 5,
                marginLeft: 10,
                flexDirection: 'row',
                alignItems: 'center'
              }}
              onPress={() => {
                navigateStore.dispatch({ type: NAVIGATE, payload: { target: 'CryptoSellScreen' } })
                indexStore.dispatch({ type: OPEN_SEARCH_MODAL, payload: false })
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  marginRight: 5
                }}
              >
                Sell
              </Text>
              <IconMaterialCommunity
                name="cart-arrow-up"
                color={navigateStore.getState().selectedColorState}
                size={25}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: 5,
                marginTop: 10,
                borderColor: navigateStore.getState().selectedColorState,
                borderWidth: 2,
                borderRadius: 5,
                marginLeft: 10,
                flexDirection: 'row',
                alignItems: 'center'
              }}
              onPress={() => {
                navigateStore.dispatch({ type: NAVIGATE, payload: { target: 'CryptoBuyScreen' } })
                indexStore.dispatch({ type: OPEN_SEARCH_MODAL, payload: false })
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  marginRight: 5
                }}
              >
                Buy
              </Text>
              <IconMaterialCommunity
                name="cart-arrow-down"
                color={navigateStore.getState().selectedColorState}
                size={25}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: 5,
                marginTop: 10,
                borderColor: navigateStore.getState().selectedColorState,
                borderWidth: 2,
                borderRadius: 5,
                marginLeft: 10,
                flexDirection: 'row',
                alignItems: 'center'
              }}
              onPress={() => {
                navigateStore.dispatch({ type: NAVIGATE, payload: { target: 'CryptoSendScreen' } })
                indexStore.dispatch({ type: OPEN_SEARCH_MODAL, payload: false })
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  marginRight: 5
                }}
              >
                Send
              </Text>
              <IconMaterialCommunity
                name="send"
                color={navigateStore.getState().selectedColorState}
                size={25}
              />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              color: colors.text,
              fontWeight: 'bold',
              marginTop: 20
            }}
          >
            Debit cards
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
          >
            <TouchableOpacity
              style={{
                padding: 5,
                marginTop: 10,
                borderColor: navigateStore.getState().selectedColorState,
                borderWidth: 2,
                borderRadius: 5,
                marginLeft: 10,
                flexDirection: 'row',
                alignItems: 'center'
              }}
              onPress={() => {
                navigateStore.dispatch({ type: NAVIGATE, payload: { target: 'DebitCardScreen' } })
                indexStore.dispatch({ type: OPEN_SEARCH_MODAL, payload: false })
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  marginRight: 5
                }}
              >
                My list
              </Text>
              <IconMaterialCommunity
                name="credit-card-multiple"
                color={navigateStore.getState().selectedColorState}
                size={25}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: 5,
                marginTop: 10,
                borderColor: navigateStore.getState().selectedColorState,
                borderWidth: 2,
                borderRadius: 5,
                marginLeft: 10,
                flexDirection: 'row',
                alignItems: 'center'
              }}
              onPress={() => {
                navigateStore.dispatch({ type: NAVIGATE, payload: { target: 'DebitCardRequestScreen' } })
                indexStore.dispatch({ type: OPEN_SEARCH_MODAL, payload: false })
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  marginRight: 5
                }}
              >
                Request
              </Text>
              <IconMaterialCommunity
                name="credit-card-plus"
                color={navigateStore.getState().selectedColorState}
                size={25}
              />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              color: colors.text,
              fontWeight: 'bold',
              marginTop: 20
            }}
          >
            Gift cards
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
          >
            <TouchableOpacity
              style={{
                padding: 5,
                marginTop: 10,
                borderColor: navigateStore.getState().selectedColorState,
                borderWidth: 2,
                borderRadius: 5,
                marginLeft: 10,
                flexDirection: 'row',
                alignItems: 'center'
              }}
              onPress={() => {
                navigateStore.dispatch({ type: NAVIGATE, payload: { target: 'GiftCardBuyScreen' } })
                indexStore.dispatch({ type: OPEN_SEARCH_MODAL, payload: false })
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  marginRight: 5
                }}
              >
                Buy
              </Text>
              <IconMaterialCommunity
                name="gift"
                color={navigateStore.getState().selectedColorState}
                size={25}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: 5,
                marginTop: 10,
                borderColor: navigateStore.getState().selectedColorState,
                borderWidth: 2,
                borderRadius: 5,
                marginLeft: 10,
                flexDirection: 'row',
                alignItems: 'center'
              }}
              onPress={() => {
                navigateStore.dispatch({ type: NAVIGATE, payload: { target: 'GiftCardRedeemScreen' } })
                indexStore.dispatch({ type: OPEN_SEARCH_MODAL, payload: false })
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  marginRight: 5
                }}
              >
                Redeem
              </Text>
              <IconMaterialCommunity
                name="gift-open"
                color={navigateStore.getState().selectedColorState}
                size={25}
              />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              color: colors.text,
              fontWeight: 'bold',
              marginTop: 20
            }}
          >
            Others
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
          >
            <TouchableOpacity
              style={{
                padding: 5,
                marginTop: 10,
                borderColor: navigateStore.getState().selectedColorState,
                borderWidth: 2,
                borderRadius: 5,
                marginLeft: 10,
                flexDirection: 'row',
                alignItems: 'center'
              }}
              onPress={() => {
                navigateStore.dispatch({ type: NAVIGATE, payload: { target: 'FastChangeScreen' } })
                indexStore.dispatch({ type: OPEN_SEARCH_MODAL, payload: false })
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  marginRight: 5
                }}
              >
                Fast change
              </Text>
              <IconFontAwesome
                name="exchange"
                color={navigateStore.getState().selectedColorState}
                size={25}
              />
            </TouchableOpacity>
            {/*<TouchableOpacity
              style={{
                padding: 5,
                marginTop: 10,
                borderColor: navigateStore.getState().selectedColorState,
                borderWidth: 2,
                borderRadius: 5,
                marginLeft: 10,
                flexDirection: 'row',
                alignItems: 'center'
              }}
              onPress={() => {
                navigateStore.dispatch({ type: NAVIGATE, payload: { target: 'CashScreen' } })
                indexStore.dispatch({ type: OPEN_SEARCH_MODAL, payload: false })
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  marginRight: 5
                }}
              >
                Cash places
              </Text>
              <IconMaterialCommunity
                name="map-marker"
                color={navigateStore.getState().selectedColorState}
                size={25}
              />
              </TouchableOpacity>*/}
            <TouchableOpacity
              style={{
                padding: 5,
                marginTop: 10,
                borderColor: navigateStore.getState().selectedColorState,
                borderWidth: 2,
                borderRadius: 5,
                marginLeft: 10,
                flexDirection: 'row',
                alignItems: 'center'
              }}
              onPress={() => {
                navigateStore.dispatch({ type: NAVIGATE, payload: { target: 'InvestmentScreen' } })
                indexStore.dispatch({ type: OPEN_SEARCH_MODAL, payload: false })
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  marginRight: 5
                }}
              >
                Investments
              </Text>
              <IconMaterialCommunity
                name="hand-coin"
                color={navigateStore.getState().selectedColorState}
                size={25}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
};

const Component = connect(mapStateToProps)(ConnectedComponent);

export default Component;
