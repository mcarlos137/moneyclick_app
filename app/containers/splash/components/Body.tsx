import React from 'react';
import { Dimensions, View } from 'react-native';
import { connect } from "react-redux";
import * as Animatable from "react-native-animatable";
import { CommonActions } from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
//STORES
import { store as authStore } from '../../../main/stores/auth';

const mapStateToProps = state => {
  return {
    userName: state.userName,
    time: state.time,
  };
};

const ConnectedComponent = ({
  userName,
  time,
  navigation
}) => {
  console.log('>>>>>>>>>>>>>>> ', userName)
  let redirectToDrawer = false
  if (userName !== '') {
    if (time + 3 * 24 * 60 * 60 * 1000 > new Date().getTime()) { //remove false
      redirectToDrawer = true
    } else {
      authStore.dispatch({
        type: 'SET_PARAMS',
        payload: { userName: "", secretKey: "", time: null, config: {}, frequentUsers: [] },
      });
      setTimeout(() => {
        Keychain.resetGenericPassword().then(result => {
          console.log('resetGenericPassword', result)
        });
      }, 500)
    }
  }
  /*Sound.setCategory('Playback');
  var ding = new Sound('kaikaivoice.m4a', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }
    ding.setNumberOfLoops(0);
    ding.setVolume(1);
    ding.play(success => {
      if (!success) {
        console.log('playback failed due to audio decoding errors');
      }
    });
  })
  ding.stop()
  ding.release()*/
  /*getPersistedData("keyPairs").then((value) => {
    if (value === null) {
      storePersistedData("keyPairs", []);
    }
  });*/
  setTimeout(() => {
    if (redirectToDrawer) {
      console.log('>>>>>>>>HOME')
      /*headersStore.dispatch(
        {
          type: SET_HMAC_INTERCEPTOR,
          payload: { userName: authPersistedStore.getState().userNameState, secretKey: authPersistedStore.getState().secretKeyState, deviceId: '4454e4d08748617h' }
        }
      );
      if (firestoreStore.getState().unsubscribeFirestoreNewCollectionState === null) {
        firestoreStore.getState().unsubscribeFirestoreNewCollectionState = subscribeFirestoreNewCollection()
      }
      if (firestoreStore.getState().unsubscribeFirestoreDeliveredCollectionState === null) {
        firestoreStore.getState().unsubscribeFirestoreDeliveredCollectionState = subscribeFirestoreDeliveredCollection()
      }
      if (firestoreStore.getState().unsubscribeFirestoreReadedCollectionState === null) {
        firestoreStore.getState().unsubscribeFirestoreReadedCollectionState = subscribeFirestoreReadedCollection()
      }
      */
      navigation.dispatch((state) => {
        const routes = [{ name: 'MainTabScreen' }];
        return CommonActions.reset({
          ...state,
          routes,
          index: routes.length - 1,
        });
      });
    } else {
      console.log('>>>>>>>>INFO')
      navigation.navigate('MainInfoScreen');
      /*navigateStore.dispatch({
        type: NAVIGATE,
        payload: { target: "MainInfoScreen" },
      });*/
    }
  }, 4000)
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#068dc7',
      }}>
      <View
        style={{
          flex: 2,
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Animatable.Image
          animation="bounceIn"
          //duraton="3500"
          source={require("../../../../assets/logo_mc_2.png")}
          style={{
            width: Dimensions.get("screen").height * 0.3,
            height: Dimensions.get("screen").height * 0.3,
          }}
          resizeMode="stretch"
        />
      </View>
    </View>
  )
};

const Component = connect(mapStateToProps)(ConnectedComponent);

export default React.memo(Component);