//PRINCIPAL
import React, { useEffect } from 'react';
import {
  View,
  FlatList,
  RefreshControl
} from 'react-native';
import { compose } from 'redux'
import { StackActions } from '@react-navigation/native';
//HOC
import { withColors, withUserName } from '../../main/hoc';
//COMPONENTS
import Body_BalanceMovement from './components/Body_BalanceMovement';
import { getBalanceMovements } from './hooks/getBalanceMovements';

const BalanceMovementsScreen = ({ navigation, route, colors, userName }) => {

  //HOOKS CALLS
  const { isLoading, data, error, refetch, isFetching } = getBalanceMovements(userName)

  //EFFECTS
  useEffect(() => {
    console.log('BalanceMovementsScreen', route.params)
  }, []);

  //PRINCIPAL RENDER
  return (
    <View style={{
      flex: 1,
    }} >
      <FlatList
        data={data}
        style={{ marginLeft: 10, marginRight: 10 }}
        renderItem={item => <Body_BalanceMovement selectedItem={item.item} onPress={() => { navigation.dispatch(StackActions.push('BalanceMovementDetailsScreen', { ...route.params, selectedBalanceMovement: item.item.parts })) }} />}
        keyExtractor={item => String(item.id)}
        windowSize={50}
        initialNumToRender={50}
        removeClippedSubviews={true}
        refreshControl={
          <RefreshControl
            refreshing={isLoading || isFetching}
            onRefresh={() => {
              refetch()
            }}
            tintColor={colors.getRandomMain()}
            colors={[colors.getRandomMain()]}
          />
        }
        maxToRenderPerBatch={80}
        updateCellsBatchingPeriod={80}
      //getItemLayout={getItemLayout}
      />
    </View>
  );
}

export default React.memo(compose(withColors, withUserName)(BalanceMovementsScreen));
