//PRINCIPAL
import { StackActions } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { compose } from 'redux'
import {
    FlatList,
    RefreshControl,
    View,
} from 'react-native';
import { getDetailedBalances } from '../../main/functions';
//HOOKS
import { getBalance } from '../wallet/hooks/getBalance';
//HOC
import { withColors, withUserName } from '../../main/hoc';
//COMPONENTS
import Body_Currency from './components/Body_Currency'
//import List from './components/List';

const BalanceDetailsScreen = ({ navigation, route, colors, userName }) => {

    //INITIAL STATES
    const [updateBalance, setUpdateBalance] = useState(true)
    const [balanceType, setBalanceType] = useState('')

    //HOOKS CALLS
    const [balance, currencies, currenciesOrder] = getBalance(userName, updateBalance)

    const detailedBalancesByType = useMemo(() =>
        balance?.data &&
        currencies?.data &&
        currenciesOrder?.data &&
        getDetailedBalances(balance.data, currencies.data, currenciesOrder.data, route?.params?.balanceType),
        [balance.data, currencies.data, currenciesOrder.data])

    //EFFECTS
    useEffect(() => {
        console.log('BalanceDetailsScreen', route?.params)
    }, []);

    //PRINCIPAL RENDER
    return (
        <View style={{
            flex: 1
        }} >
            <FlatList
                data={detailedBalancesByType.detailedBalances}
                renderItem={(item) => <Body_Currency item={item.item} onPress={() => { navigation.dispatch(StackActions.push('BalanceMenuScreen', { ...route.params, selectedCurrency: item.item })); }} />}
                keyExtractor={item => String(item.value)}
                removeClippedSubviews={true}
                maxToRenderPerBatch={13}
                windowSize={13}
                initialNumToRender={8}
                //getItemLayout={getItemLayout}
                style={{
                    marginBottom: 20,
                    alignSelf: 'center',
                    paddingLeft: 10,
                    paddingRight: 10
                }}
                updateCellsBatchingPeriod={100}
                refreshControl={
                    <RefreshControl
                        refreshing={balance.isLoading || currencies.isLoading || currenciesOrder.isLoading}
                        onRefresh={() => {
                            balance.refetch()
                        }}
                        tintColor={colors.getRandomMain()}
                        colors={[colors.getRandomMain()]}
                    />
                }
            />
        </View>
    );
}

export default React.memo(compose(withColors, withUserName)(BalanceDetailsScreen));


