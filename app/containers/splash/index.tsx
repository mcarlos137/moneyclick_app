//PRINCIPAL
import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
//STORES
import { store as authStore, persistor as authPersistor } from "../../main/stores/auth";
//COMPONENTS
import Body from "./components/Body";

const SplashScreen = ({ navigation }) => {

  //PRINCIPAL RENDER
  return (
    <Provider store={authStore}>
      <PersistGate persistor={authPersistor}>
        <Body
          navigation={navigation}
        />
      </PersistGate>
    </Provider>
  );
};

export default React.memo(SplashScreen);
