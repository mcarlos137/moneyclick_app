//TOOLS
import headersHMAC from '../../tools/headersHMAC';

const initialState = {
  hmacInterceptor: headersHMAC.getInterceptor(),
  getConfigHeaders: {},
};

function rootReducer(state = initialState, action) {
  if (action.type === 'SET_HMAC_INTERCEPTOR') {
    return Object.assign({}, state, {
      //token: state.hmacInterceptor = headersHMAC.getInterceptor(action.payload.userName, action.payload.secretKey, action.payload.deviceId)
    });
  }
  return state;
}

export default rootReducer;