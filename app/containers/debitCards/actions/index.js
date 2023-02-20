import {
  GET_DEBIT_CARD_CONFIG,
  ADD_SUBSTRACT_DEBIT_CARD_BALANCE,
  CHANGE_DEBIT_CARD_STATUS,
  MAKE_DEBIT_CARD_PAYMENT,
} from "../../../constants/action-types";
import { headersStore } from "../../../main/store";
import httpRequest from "../../../tools/httpRequest";

export function getConfigAction(id) {
  return function (dispatch) {
    return fetch(
      "https://service8081.moneyclick.com/debitCard/getConfig/" + id,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        dispatch({ type: GET_DEBIT_CARD_CONFIG, payload: json });
      })
      .catch((error) => {
        console.log("GET_DEBIT_CARD_CONFIG_STATUS" + " " + error);
        dispatch({
          type: "GET_DEBIT_CARD_CONFIG_STATUS",
          payload: error.message,
        });
      });
  };
}

export function changeStatusAction(userName, id, status) {
  let url = 'https://service8081.moneyclick.com';
  let path = '/debitCard/changeStatus';
  let method = 'POST';
  let body = {
    userName: userName,
    id: id,
    debitCardStatus: status,
  }
  let hmacInterceptor = headersStore.getState().hmacInterceptorState
  let request = hmacInterceptor.process(httpRequest.create(url, path, method, body, false));
  return function (dispatch) {
    return fetch(url + path,
      {
        method: method,
        headers: request.headers,
        body: JSON.stringify(body)
      }
    )
      .then(handleErrors)
      .then(response =>
        response.text())
      .then(text => {
        console.log(CHANGE_DEBIT_CARD_STATUS + ' ' + 'OK')
        dispatch({ type: CHANGE_DEBIT_CARD_STATUS, payload: text });
      })
      .catch(error => {
        console.log('CHANGE_DEBIT_CARD_STATUS_STATUS' + ' ' + error)
        dispatch({ type: 'CHANGE_DEBIT_CARD_STATUS_STATUS', payload: error.message });
      });
  };
}

export function makePaymentAction(userName, id, targetUserName, amount, pinCode) {
  let url = 'https://service8081.moneyclick.com';
  let path = '/debitCard/makePayment';
  let method = 'POST';
  let body = {
    userName: userName,
    id: id,
    targetUserName: targetUserName,
    amount: amount,
    pinCode: pinCode,
  }
  let hmacInterceptor = headersStore.getState().hmacInterceptorState
  let request = hmacInterceptor.process(httpRequest.create(url, path, method, body, false));
  return function (dispatch) {
    return fetch(url + path,
      {
        method: method,
        headers: request.headers,
        body: JSON.stringify(body)
      }
    )
      .then(handleErrors)
      .then(response =>
        response.text())
      .then(text => {
        console.log(MAKE_DEBIT_CARD_PAYMENT + ' ' + 'OK')
        dispatch({ type: MAKE_DEBIT_CARD_PAYMENT, payload: text });
      })
      .catch(error => {
        console.log('MAKE_DEBIT_CARD_PAYMENT_STATUS' + ' ' + error)
        dispatch({ type: 'MAKE_DEBIT_CARD_PAYMENT_STATUS', payload: error.message });
      });
  };
}

function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.status);
  }
  return response;
}
