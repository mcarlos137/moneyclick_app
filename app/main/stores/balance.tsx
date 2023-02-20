import { persistStore } from 'redux-persist';
import { configureStore } from '@reduxjs/toolkit'
import balanceReducer from '../reducers/balance'
import thunk from 'redux-thunk';

export const store = configureStore({
  reducer: balanceReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
