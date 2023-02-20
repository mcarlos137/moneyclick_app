import {
  GET_MONEY_CALL_OVERVIEW_ID,
  GET_MONEY_CALL_OVERVIEW_DATA,
  PAY_MONEY_CALL,
} from "../../../constants/action-types";

export function overviewIdAction(userName) {
  let url = 'https://service8081.moneyclick.com';
  let path = '/moneyCall/overviewId/' + userName;
  let method = 'GET';
  return function (dispatch) {
    return fetch(url + path,
      {
        method: method,
      }
    )
      .then(handleErrors)
      .then(response =>
        response.text())
      .then(text => {
        console.log(GET_MONEY_CALL_OVERVIEW_ID + ' ' + 'OK')
        dispatch({ type: GET_MONEY_CALL_OVERVIEW_ID, payload: text });
      })
      .catch(error => {
        console.log('GET_MONEY_CALL_OVERVIEW_ID_STATUS' + ' ' + error)
        dispatch({ type: 'GET_MONEY_CALL_OVERVIEW_ID_STATUS', payload: error.message });
      });
  };
}

export function overviewDataAction(userName) {
  let url = 'https://service8081.moneyclick.com';
  let path = '/moneyCall/overviewData/' + userName;
  let method = 'GET';
  return function (dispatch) {
    return fetch(url + path,
      {
        method: method,
      }
    )
      .then(handleErrors)
      .then(response =>
        response.json())
      .then(json => {
        console.log(GET_MONEY_CALL_OVERVIEW_DATA + ' ' + 'OK')
        dispatch({ type: GET_MONEY_CALL_OVERVIEW_DATA, payload: json });
      })
      .catch(error => {
        console.log('GET_MONEY_CALL_OVERVIEW_DATA_STATUS' + ' ' + error)
        dispatch({ type: 'GET_MONEY_CALL_OVERVIEW_DATA_STATUS', payload: error.message });
      });
  };
}

export function payAction(id, time, stars, comment) {
  let url = 'https://service8081.moneyclick.com';
  let path = '/moneyCall/pay';
  let method = 'POST';
  let body = {
    id: id,
    time: time
  }
  if (stars !== undefined && stars !== null) {
    body.stars = stars
  }
  if (comment !== undefined && comment !== null) {
    body.comment = comment
  }
  return function (dispatch) {
    return fetch(url + path,
      {
        method: method,
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(body)
      }
    )
      .then(handleErrors)
      .then(response =>
        response.text())
      .then(text => {
        console.log(PAY_MONEY_CALL + ' ' + 'OK')
        dispatch({ type: PAY_MONEY_CALL, payload: text });
      })
      .catch(error => {
        console.log('PAY_MONEY_CALL_STATUS' + ' ' + error)
        dispatch({ type: 'PAY_MONEY_CALL_STATUS', payload: error.message });
      });
  };
}

function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.status);
  }
  return response;
}