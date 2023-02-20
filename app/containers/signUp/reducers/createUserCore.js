import {
    CREATE_USER_CORE
} from "../../../constants/action-types";

const initialState = {
    createUserCoreState: '',
    createUserCoreStatusState: '',
};

function rootReducer(state = initialState, action) {
    if (action.type === CREATE_USER_CORE) {
        return Object.assign({}, state, {
            token1: state.createUserCoreState = action.payload,
            token2: state.createUserCoreStatusState = '200'
        });
    }
    if (action.type === 'CREATE_USER_CORE_STATUS') {
        return Object.assign({}, state, {
            error: state.createUserCoreStatusState = action.payload
        });
    }
    return state;
}

export default rootReducer;