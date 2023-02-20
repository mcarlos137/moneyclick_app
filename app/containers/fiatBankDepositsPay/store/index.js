import { createStore, applyMiddleware, compose } from "redux";
import indexReducer from "../reducers";
import { noAction } from "../middleware";
import thunk from "redux-thunk";

const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const indexStore = createStore(
  indexReducer,
  storeEnhancers(applyMiddleware(noAction, thunk))
);
