const initialState = {
  selectedMoneyMarketsOption: 'EXCHANGE',
};

function rootReducer(state = initialState, action) {
  if (action.type === 'SET_SELECTED_MONEY_MARKET_OPTIONS') {
    return Object.assign({}, state, {
      token: state.selectedMoneyMarketsOption = action.payload
    });
  }
  return state;
}

export default rootReducer;