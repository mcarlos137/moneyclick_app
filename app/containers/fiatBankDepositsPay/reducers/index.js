import React, { createRef } from 'react';
import {
  SET_FIAT_BANK_DEPOSIT_PAY_FILE_ASSET,
  SET_SELECTED_FIAT_BANK_DEPOSIT_PAY_DEPOSIT
} from "../../../constants/action-types";

const initialState = {
  fileAssetState: {},
  actionSheetDocumentRefState: createRef(),
  selectedFiatBankDepositState: {}
};

function rootReducer(state = initialState, action) {
  if (action.type === SET_SELECTED_FIAT_BANK_DEPOSIT_PAY_DEPOSIT) {
    return Object.assign({}, state, {      
      token1: state.selectedFiatBankDepositState = action.payload,
    });
  }
  if (action.type === SET_FIAT_BANK_DEPOSIT_PAY_FILE_ASSET) {
    return Object.assign({}, state, {
      token: state.fileAssetState = action.payload,
    });
  }
  return state;
}

export default rootReducer;