const initialState: any = {
    usdEstimatedBalance: 0, 
    btcEstimatedBalance: 0,
    detailedBalances: []
};

function rootReducer(state = initialState, action) {
    if (action.type === 'SET_VALUES') {
        return Object.assign({}, state, {
            token1: state.usdEstimatedBalance = action.payload.usdEstimatedBalance,
            token2: state.btcEstimatedBalance = action.payload.btcEstimatedBalance,
            token3: state.detailedBalances = action.payload.detailedBalances,
        });
    }
    return state;
}

export default rootReducer;
