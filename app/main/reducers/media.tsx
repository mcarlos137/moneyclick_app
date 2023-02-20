const initialState = {
    assets: {},
};

const reducer = (state = initialState, action) => {
    if (action.type === 'SET_ASSET') {
        const assets = { ...state.assets }
        if (assets[action.payload.id] === undefined) {
            assets[action.payload.id] = {}
        }
        let update = false
        if (action.payload.imageAsset !== undefined) {
            if (assets[action.payload.id].imageAsset === undefined || assets[action.payload.id].imageAsset !== action.payload.imageAsset) {
                assets[action.payload.id] = { ...assets[action.payload.id], imageAsset: action.payload.imageAsset }
                update = true
            }
        }
        if (action.payload.videoAsset !== undefined) {
            if (assets[action.payload.id].videoAsset === undefined || assets[action.payload.id].videoAsset !== action.payload.videoAsset) {
                assets[action.payload.id] = { ...assets[action.payload.id], videoAsset: action.payload.videoAsset }
                update = true
            }
        }
        if (update) {
            return Object.assign({}, state, {
                token1: state.assets = assets,
            });
        }
    }
    return state;
}

export default reducer;