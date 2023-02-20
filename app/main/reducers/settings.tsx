const initialState = {
    theme: 'light-content', //'dark-content'
    country: 'United States',
    language: 'EN - English',
    kaikaiWebConnected: false,
};

const reducer = (state = initialState, action) => {
    if (action.type === 'SET_LANGUAGE') {
        return Object.assign({}, state, {
            token: state.language = action.payload,
        });
    }
    if (action.type === 'SET_COUNTRY') {
        return Object.assign({}, state, {
            token: state.country = action.payload,
        });
    }
    if (action.type === 'SET_THEME') {
        return Object.assign({}, state, {
            token: state.theme = action.payload,
        });
    }
    if (action.type === 'SET_KAIKAI_WEB_CONNECTED') {
        return Object.assign({}, state, {
            token: state.kaikaiWebConnected = action.payload,
        });
    }
    return state;
}

export default reducer;