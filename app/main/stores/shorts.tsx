import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer } from 'redux-persist';
import { configureStore } from '@reduxjs/toolkit'
import shortsReducer from '../reducers/shorts'
import thunk from 'redux-thunk';

const persistConfig = {
  key: 'shorts',
  storage: AsyncStorage,
  whitelist: [
    'data',
    'unprocessedData'
  ],
};

const persistedReducer = persistReducer(persistConfig, shortsReducer)

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
