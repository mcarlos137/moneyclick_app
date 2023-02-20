//PRINCIPAL
import React, { useEffect } from 'react';
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
//STORES
import { store as chatStore, persistor as chatPersistor } from '../../main/stores/chat'
//COMPONENTS
import Body from './components/Body'

const ChatScreen = ({ navigation, route }) => {

  //EFFECTS
  useEffect(() => {
    console.log('ChatScreen', route.params)
  }, []);

  //PRINCIPAL RENDER
  return (
    <>
      <Provider store={chatStore} >
        <PersistGate loading={null} persistor={chatPersistor}>
          <Body />
        </PersistGate>
      </Provider>
    </>
  );
};

export default React.memo(ChatScreen);
