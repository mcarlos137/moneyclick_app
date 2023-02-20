import { useQuery } from "react-query"
import { request } from "../../../tools/axiosUtils"

const takeOfferRequest = ({ queryKey }) => {
  let body: any = {
    userName: queryKey[1],
    nickName: queryKey[2],
    pair: queryKey[3],
    amount: queryKey[4],
    price: queryKey[5],
    type: queryKey[6],
    id: queryKey[7],
    excludeMessage: true,
  }
  return request({ url: `/moneyMarket/takeOffer`, method: 'post', data: body })
}

export const takeOffer = (
  userName: string,
  nickName: string,
  pair: string,
  amount: number,
  price: number,
  type: string,
  id: string,
) => {
  return useQuery(
    ['takeOffer', userName, nickName, pair, amount, price, type, id],
    takeOfferRequest,
    {
      enabled: false,
      select: (data) => data?.data,
      onSuccess: (data) => {
        console.log('data', JSON.stringify(data, null, 4));
      }
      //keepPreviousData: true
    }
  )
}

/***
 * 
 * 
 * export function takeMoneyMarketOfferAction(userName, nickName, pair, amount, price, type, id) {
  let url = 'https://service8081.moneyclick.com';
  let path = '/moneyMarket/takeOffer';
  let method = 'POST';
  let body = {
    userName: userName,
    nickName: nickName,
    pair: pair,
    amount: amount,
    price: price,
    type: type,
    id: id,
    excludeMessage: true,
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
        console.log(TAKE_MONEY_MARKET_OFFER + ' ' + 'OK')
        dispatch({ type: TAKE_MONEY_MARKET_OFFER, payload: text });
      })
      .catch(error => {
        console.log('TAKE_MONEY_MARKET_OFFER_STATUS' + ' ' + error)
        dispatch({ type: 'TAKE_MONEY_MARKET_OFFER_STATUS', payload: error.message });
      });
  };
}
 * 
 * 
 * 
 */