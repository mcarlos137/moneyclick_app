import React from 'react';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from 'react-query';
//COMPONENTS
import App_Theme from './App_Theme'
//STORES
import {
  store as settingsStore,
  persistor as settingsPersistor
} from './app/main/stores/settings';

const queryClient = new QueryClient()

const App: () => ReactNode = () => {

  return (
    <Provider store={settingsStore} >
      <PersistGate loading={null} persistor={settingsPersistor}>
        <QueryClientProvider client={queryClient}>
          <App_Theme />
        </QueryClientProvider>
        {/*<Provider store={actionSheetIncomingCallStore} >
          <ActionSheetIncomingCall />
        </Provider>*/}
      </PersistGate>
    </Provider>
  );
};

export default App;
