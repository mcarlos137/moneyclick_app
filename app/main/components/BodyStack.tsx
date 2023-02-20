import React from 'react';
import {
    View,
    SafeAreaView,
    Platform
} from 'react-native';
import { compose } from 'redux'
//HOC
import { withColors } from '../hoc';
//STORES
import { store as actionSheetOptionsStore } from '../stores/actionSheetOptions';
//COMPONENTS
import ActionSheetOptions from './ActionSheetOptions'

const Component = ({ name, children, navigation, route, colors }) => {

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: name === 'Social' ? 'black' : colors.background,
                paddingTop: Platform.OS === 'android' ? 60 : 0
            }}
        >
            <SafeAreaView style={{ marginBottom: 50 }} />
            {children}
            {name === 'Wallet' && <ActionSheetOptions customRef={actionSheetOptionsStore.getState().ref1} />}
            {name === 'MoneyMarkets' && <ActionSheetOptions customRef={actionSheetOptionsStore.getState().ref2} />}
            {name === 'MoneyCalls' && <ActionSheetOptions customRef={actionSheetOptionsStore.getState().ref3} />}
            {name === 'UserData' && <ActionSheetOptions customRef={actionSheetOptionsStore.getState().ref4} />}
        </View>
    )
};

export default React.memo(compose(withColors)(Component));