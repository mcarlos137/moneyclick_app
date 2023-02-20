//PRINCIPAL
import React from 'react';
import { connect } from "react-redux";
//CONSTANTS
import currenciesParams from '../../../constants/currenciesParams'
//FUNCTIONS
import {
    getPairComponents
} from '../../../main/functions'
//COMPONENTS
import Modal from '../../../main/components/Modal'
import { navigateStore } from '../../../main/store';

const getModalData = (
    pairState,
    assetAmountState,
    baseAmountState,
    priceState,
    priceTypeState,
    operationTypeState,
    commissionState,
    timePeriodState,
    timePeriodUnitState,
) => {
    let data = [];
    data.push(
        {
            title: 'Operation Type:',
            type: 'TEXT',
            value: operationTypeState,
        }
    );
    data.push(
        {
            title: 'Price Type:',
            type: 'TEXT',
            value: priceTypeState
        }
    );
    data.push(
        {
            title: 'Amount to Pay:',
            type: 'NUMERIC',
            value: operationTypeState === 'BUY' ? baseAmountState : assetAmountState,
            valuePreffix: '',
            valueSuffix: currenciesParams[getPairComponents(pairState)[operationTypeState === 'BUY' ? 1 : 0]].symbol,
            valueDecimals: operationTypeState === 'BUY' ? (2) : (pairState.includes('BTC') ? 8 : 2)
        }
    );
    data.push(
        {
            title: 'Price:',
            type: 'NUMERIC',
            value: priceState,
            valuePreffix: '1 ' + currenciesParams[getPairComponents(pairState)[0]].symbol + ' =',
            valueSuffix: currenciesParams[getPairComponents(pairState)[1]].symbol,
            valueDecimals: 2
        }
    );
    data.push(
        {
            title: 'Amount to Receive:',
            type: 'NUMERIC',
            value: operationTypeState === 'BUY' ? assetAmountState : baseAmountState,
            valuePreffix: '',
            valueSuffix: currenciesParams[getPairComponents(pairState)[operationTypeState === 'BUY' ? 0 : 1]].symbol,
            valueDecimals: operationTypeState === 'BUY' ? (pairState.includes('BTC') || pairState.includes('ETH') ? 8 : 2) : 2
        }
    );
    if (commissionState.amount !== undefined && commissionState.amount !== 0 && priceTypeState === 'MARKET_PRICE') {
        data.push(
            {
                title: 'Commission:',
                type: 'NUMERIC',
                value: commissionState.amount,
                valuePreffix: '',
                valueSuffix: currenciesParams[getPairComponents(pairState)[operationTypeState === 'BUY' ? 1 : 0]].symbol,
                valueDecimals: 2
            }
        );
        data.push(
            {
                title: operationTypeState === 'BUY' ? 'Final Amount to Pay:' : 'Final Amount to Receive:',
                type: 'NUMERIC',
                value: operationTypeState === 'BUY' ? (baseAmountState + commissionState.amount) : (baseAmountState - commissionState.amount),
                valuePreffix: '',
                valueSuffix: currenciesParams[getPairComponents(pairState)[1]].symbol,
                valueDecimals: 2,
            }
        );
    }
    if (priceTypeState === 'USER_PRICE') {
        data.push(
            {
                title: 'Your operation will be in order book for about:',
                type: 'TEXT',
                value: timePeriodState + ' ' + timePeriodUnitState
            }
        );
    }
    return data;
}

const mapStateToProps = state => {
    return {
        pairState: state.pairState,
        assetAmountState: state.assetAmountState,
        baseAmountState: state.baseAmountState,
        priceState: state.priceState,
        priceTypeState: state.priceTypeState,
        operationTypeState: state.operationTypeState,
        commissionState: state.commissionState,
        timePeriodState: state.timePeriodState,
        timePeriodUnitState: state.timePeriodUnitState,
        confirmationModalMessageState: state.confirmationModalMessageState,
        openModalState: state.openModalState,
    };
};

const ConnectedComponent = ({
    pairState,
    assetAmountState,
    baseAmountState,
    priceState,
    priceTypeState,
    operationTypeState,
    commissionState,
    timePeriodState,
    timePeriodUnitState,
    confirmationModalMessageState,
    openModalState,
}) => (
    <Modal
        data={getModalData(
            pairState,
            assetAmountState,
            baseAmountState,
            priceState,
            priceTypeState,
            operationTypeState,
            commissionState,
            timePeriodState,
            timePeriodUnitState,
        )}
        visible={openModalState}
        confirmationModalMessage={confirmationModalMessageState}
        color={navigateStore.getState().selectedColorState}
        operation={'MONEYMARKET_ORDER_BOOK'}
    />
);

const Component = connect(mapStateToProps)(ConnectedComponent);

export default Component;
