import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Modal from 'react-native-modal';
import { connect } from "react-redux";
//STORES
import {
  indexPersistedStore
} from '../store';
//ACTIONS
import {
  OPEN_MODAL,
} from '../../../constants/action-types';

const mapStateToProps = state => {
  return {
    openModalState: state.openModalState,
  };
};

const ConnectedComponent = ({
  openModalState,
}) => (
  <Modal
    transparent={true}
    isVisible={openModalState}
    style={{
      margin: 0,
    }}
    backdropColor={'#fff'}
    backdropOpacity={0}
    animationIn='slideInRight'
    animationOut='slideOutRight'
    animationInTiming={500}
    animationOutTiming={500}
    backdropTransitionInTiming={500}
    backdropTransitionOutTiming={500}
  >
    <TouchableOpacity
      onPress={() => {
        indexPersistedStore.dispatch(
          { type: OPEN_MODAL, payload: false }
        )
      }}
    >
      <View
        style={{
          height: '100%',
          width: '100%',
          alignItems: 'flex-end',
          paddingLeft: 5,
        }}
      >
        <TouchableWithoutFeedback>
          <View
            style={{
              width: 200,
              alignItems: 'flex-start',
              backgroundColor: '#6696ff',
              paddingLeft: 5,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                console.log('NEW GROUP')
              }}
            >
              <Text
                style={{
                  color: '#000',
                  fontSize: 15,
                  paddingLeft: 15,
                  paddingTop: 15,
                  textAlign: 'center',
                }}
              >
                {'New group'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                console.log('NEW DIFFUSION')
              }}
            >
              <Text
                style={{
                  color: '#000',
                  fontSize: 15,
                  paddingLeft: 15,
                  paddingTop: 15,
                  paddingBottom: 15,
                  textAlign: 'center',
                }}
              >
                {'New diffusion'}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableOpacity>
  </Modal>
);

const Component = connect(mapStateToProps)(ConnectedComponent);

export default Component;
