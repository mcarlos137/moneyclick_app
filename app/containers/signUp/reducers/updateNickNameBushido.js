import {
    UPDATE_NICKNAME_BUSHIDO
} from "../../../constants/action-types";

const initialState = {
    updateNickNameBushidoState: '',
    updateNickNameBushidoStatusState: '',
};

function rootReducer(state = initialState, action) {
    if (action.type === UPDATE_NICKNAME_BUSHIDO) {
        return Object.assign({}, state, {
            token1: state.updateNickNameBushidoState = action.payload,
            token2: state.updateNickNameBushidoStatusState = '200'
        });
    }
    if (action.type === 'UPDATE_NICKNAME_BUSHIDO_STATUS') {
        return Object.assign({}, state, {
            error: state.updateNickNameBushidoStatusState = action.payload
        });
    }
    return state;
}

export default rootReducer;