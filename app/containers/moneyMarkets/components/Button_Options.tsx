import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
//STORES
import { store as optionsStore } from "../../../main/stores/options"; 
//COMPONENTS
import Button_Options from "../../../main/components/Button_Options";


const mapStateToProps = state => {
    return {
        selectedMoneyMarketsOption: state.selectedMoneyMarketsOption,
    };
};

const ConnectedComponent = ({
    selectedMoneyMarketsOption,
}) => {
    return (
        <Button_Options
            options={[
                {
                    iconName: 'chart-waterfall',
                    onPress: () => {
                        optionsStore.dispatch({ type: 'SET_SELECTED_MONEY_MARKET_OPTIONS', payload: 'EXCHANGE' })
                    },
                    height: 60,
                    isSelected: selectedMoneyMarketsOption === 'EXCHANGE'
                },
                {
                    text: 'P2P',
                    height: 60,
                    onPress: () => {
                        optionsStore.dispatch({ type: 'SET_SELECTED_MONEY_MARKET_OPTIONS', payload: 'P2P' })
                    },
                    isSelected: selectedMoneyMarketsOption === 'P2P'
                },
            ]}
        />
    )
}

export default React.memo(compose(connect(mapStateToProps))(ConnectedComponent))