const initialState: any = {
    data: [],
    unprocessedData: []
};

function reducer(state = initialState, action) {
    if (action.type === 'SET_DATA') {
        return Object.assign({}, state, {
            token: state.data = action.payload,
        });
    }
    if (action.type === 'PUSH_DATA') {
        const data = [...state.data]
        data.push(action.payload)
        return Object.assign({}, state, {
            token: state.data = data,
        });
    }
    if (action.type === 'SET_UMPROCESSED_DATA') {
        return Object.assign({}, state, {
            token: state.unprocessedData = action.payload,
        });
    }
    if (action.type === 'SHIFT_UNPROCESSED_DATA') {
        const unprocessedData = state.unprocessedData.slice(action.payload);
        return Object.assign({}, state, {
            token: state.unprocessedData = unprocessedData,
        });
    }
    return state;
}

export default reducer;