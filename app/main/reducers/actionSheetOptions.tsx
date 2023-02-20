import { createRef } from 'react';

const initialState = {
    ref1: createRef<any>(),
    ref2: createRef<any>(),
    ref3: createRef<any>(),
    ref4: createRef<any>(),
};

function rootReducer(state = initialState, action) {
    return state;
}

export default rootReducer;