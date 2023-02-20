import {
    ADD_USER_INFO
} from "../../../constants/action-types";

const initialState = {
    addUserInfoState: '',
    addUserInfoStatusState: '',
};

function rootReducer(state = initialState, action) {
    if (action.type === ADD_USER_INFO) {
        return Object.assign({}, state, {
            token1: state.addUserInfoState = action.payload,
            token2: state.addUserInfoStatusState = '200'
        });
    }
    if (action.type === 'ADD_USER_INFO_STATUS') {
        return Object.assign({}, state, {
            error: state.addUserInfoStatusState = action.payload
        });
    }
    return state;
}

export default rootReducer;