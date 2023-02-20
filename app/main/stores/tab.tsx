import { persistStore } from 'redux-persist';
import { configureStore } from '@reduxjs/toolkit'
import tabReducer from '../reducers/tab'
import thunk from 'redux-thunk';

export const store = configureStore({
  reducer: tabReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
