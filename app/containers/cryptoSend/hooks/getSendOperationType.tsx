import { useQuery } from "react-query"
import { request } from "../../../tools/axiosUtils"

const fetchSendOperationType = ({ queryKey }) => {
    return request({ url: `/user/getSendOpetarionType/${queryKey[1]}`, method: 'get' })
}

export const getSendOperationType = (address: string) => {
    return useQuery(
        ['getSendOperationType', address],
        fetchSendOperationType,
        {
            enabled: true
            //keepPreviousData: true
        }
    )
}

/**
 * 
 * export function getSendOperationTypeAction(address) {
  let url = 'https://service8081.moneyclick.com';
  let path = '/user/getSendOpetarionType/' + address;
  let method = 'GET';
  //let hmacInterceptor = headersStore.getState().hmacInterceptorState
  //let request = hmacInterceptor.process(httpRequest.create(url, path, method, null, false));
  return function (dispatch) {
    return fetch(url + path,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then(handleErrors)
      .then(response =>
        response.text())
      .then(text => {
        text = text.replace(/^["'](.+(?=["']$))["']$/, '$1');
        console.log(GET_SEND_OPERATION_TYPE + ' ' + 'OK')
        dispatch({ type: GET_SEND_OPERATION_TYPE, payload: text });
      })
      .catch(error => {
        console.log('GET_SEND_OPERATION_TYPE_STATUS' + ' ' + error)
        dispatch({ type: 'GET_SEND_OPERATION_TYPE_STATUS', payload: error.message });
      });
  };
}
 * 
 */