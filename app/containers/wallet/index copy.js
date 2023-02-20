//PRINCIPAL
import React from "react";
import { View } from "react-native";
import { Provider } from "react-redux";
//STORES
import { indexStore } from "./store";
import {
  indexStore as debitCardStore,
  listStore as debitCardListStore
} from "../debitCard/store";
import { getModelsUserStore } from "../investment/store";
import {
  listStore as giftCardListStore
} from "../giftCard/store";
import {
  authPersistedStore,
  navigateStore,
} from "../../main/store";
//ACTIONS
import { listAction as debitCardListAction } from "../debitCard/actions";
import { getModelListAction } from "../investment/actions";
import { listAction as giftCardListAction } from "../giftCard/actions";
//FUNCTIONS
import { getUserBalance } from "../../main/functions";
//SUBSCRIPTIONS
import {
  subscribeGetChargesStore,
} from "../../main/subscriptions";
import { subscribeListStore as subscribeDebitCardListStore } from "../debitCard/actions/subscriptions";
import { subscribeGetModelsUserStore } from "../investment/actions/subcriptions";
import { subscribeListStore as subscribeGiftCardListStore } from '../giftCard/actions/subscriptions'
//COMPONENTS
import Body from "./components/Body";
import Button_Options from "./components/Button_Options";
import ActionSheetContentOptions from "../../main/components/ActionSheetContentOptions";

const WalletContainer = ({ navigation, route }) => {

  var unsubscribeGetChargesStore;
  var unsubscribeDebitCardListStore;
  var unsubscribeGetModelsUserStore;
  var unsubscribeGiftCardListStore

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("FOCUS ON WALLET");
      //START SUBSCRIPTIONS
      unsubscribeGetChargesStore = subscribeGetChargesStore();
      unsubscribeDebitCardListStore = subscribeDebitCardListStore();
      unsubscribeGetModelsUserStore = subscribeGetModelsUserStore();
      unsubscribeGiftCardListStore = subscribeGiftCardListStore()
      //FOCUS ACTIONS
      navigation.setOptions({
        headerStyle: { backgroundColor: navigateStore.getState().selectedColorState },
      })
      let userName = authPersistedStore.getState().userNameState;
      getUserBalance(false)
      getModelsUserStore.dispatch(getModelListAction(userName));
      debitCardListStore.dispatch(
        debitCardListAction(
          userName,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        )
      );
      giftCardListStore.dispatch(
        giftCardListAction(
          userName
        )
      )
    });
    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      console.log("OUT OF WALLET");
      unsubscribeAll();
    });
    return unsubscribe;
  }, [navigation]);

  const unsubscribeAll = () => {
    unsubscribeGetChargesStore();
    unsubscribeDebitCardListStore();
    unsubscribeGetModelsUserStore();
    unsubscribeGiftCardListStore()
  };

  return (
    <View
      style={{
        flex: 1
      }}
    >
      <Provider store={indexStore}>
        <Body />
      </Provider>
      <Button_Options />
      <ActionSheetContentOptions />
    </View>
  );
};

export default WalletContainer;
