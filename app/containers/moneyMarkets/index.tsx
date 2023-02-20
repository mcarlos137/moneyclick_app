//PRINCIPAL
import React from 'react';
import { Provider } from 'react-redux';
//STORES
import { store as optionsStore } from '../../main/stores/options';
//COMPONENTS
import BodyStack from '../../main/components/BodyStack'
import Button_Options from './components/Button_Options'
import Body from './components/Body';

const SubsScreen = ({ navigation, route }) => {

  return (
    <BodyStack name={'MoneyMarkets'} navigation={navigation} route={route}>
      <Provider store={optionsStore} >
        <Body />
        <Button_Options />
      </Provider>
    </BodyStack>
  );
};

export default React.memo(SubsScreen);
