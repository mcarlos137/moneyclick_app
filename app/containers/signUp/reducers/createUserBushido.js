import {
    CREATE_USER_BUSHIDO
} from "../../../constants/action-types";

const initialState = {
    createUserBushidoState: '',
    createUserBushidoStatusState: '',
};

function rootReducer(state = initialState, action) {
    if (action.type === CREATE_USER_BUSHIDO) {
        return Object.assign({}, state, {
            token1: state.createUserBushidoState = action.payload,
            token2: state.createUserBushidoStatusState = '200'
        });
    }
    if (action.type === 'CREATE_USER_BUSHIDO_STATUS') {
        return Object.assign({}, state, {
            error: state.createUserBushidoStatusState = action.payload
        });
    }
    return state;
}

export default rootReducer;