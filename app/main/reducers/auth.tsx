const initialState : any = {
    userName: '',
    secretKey: '',
    time: 0,
    config: {},
    frequentUsers: [],
    isDarkTheme: true,
};

function reducer(state = initialState, action) {
    if (action.type === 'SET_TIME') {
        return Object.assign({}, state, {
            token: state.time = action.payload,
        });
    }
    if (action.type === 'SET_PARAMS') {
        return Object.assign({}, state, {
            token1: state.userName = action.payload.userName,
            token2: state.secretKey = action.payload.secretKey,
            token3: state.time = action.payload.time,
            token4: state.config = action.payload.config,
            token5: state.frequentUsers = action.payload.frequentUsers
        });
    }
    return state;
}

export default reducer;