import { persistStore } from 'redux-persist';
import { configureStore } from '@reduxjs/toolkit'
import actionSheetOptionsReducer from '../reducers/actionSheetOptions'
import thunk from 'redux-thunk';

export const store = configureStore({
  reducer: actionSheetOptionsReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch