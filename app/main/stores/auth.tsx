import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer } from 'redux-persist';
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../reducers/auth'
import thunk from 'redux-thunk';

const persistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: [
    'userName',
    'secretKey',
    'time',
    'config',
    'frequentUsers'
  ],
};

const persistedReducer = persistReducer(persistConfig, authReducer)

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
