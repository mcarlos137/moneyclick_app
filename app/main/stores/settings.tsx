import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer } from 'redux-persist';
import { configureStore } from '@reduxjs/toolkit'
import settingsReducer from '../reducers/settings'
import thunk from 'redux-thunk';

const persistConfig = {
    key: 'settings',
    storage: AsyncStorage,
    whitelist: [
        'theme',
        'country',
        'language',
        'kaikaiWebConnected',
    ]
};

const persistedReducer = persistReducer(persistConfig, settingsReducer)

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
