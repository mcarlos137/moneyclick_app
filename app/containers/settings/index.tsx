//PRINCIPAL
import React, { useEffect } from 'react';
import { View, } from 'react-native';
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
//STORES
import {
  store as settingsStore,
  persistor as settingsPersistor,
} from '../../main/stores/settings'
//COMPONENTS
import Body from './components/Body'

const SettingsScreen = ({ navigation, route }) => {

  //EFFECTS
  useEffect(() => {
    console.log('SettingsScreen', route.params)
  }, []);

  //PRINCIPAL RENDER
  return (
    <View style={{
      flex: 1
    }}>
      <Provider store={settingsStore} >
        <PersistGate loading={null} persistor={settingsPersistor}>
          <Body />
        </PersistGate>
      </Provider>
    </View >
  );
};

export default React.memo(SettingsScreen);
