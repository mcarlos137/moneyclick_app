//PRINCIPAL
import {
    Alert,
} from 'react-native';
//STORES
import {
    listStore,
    indexStore,
    overviewIdStore,
    overviewDataStore,
    payStore,
    createStore,
    changeStatusStore
} from '../store';
import {
    indexStore as moneyCallRatingStore
} from '../../moneyCallRating/store'
import {
    indexStore as cameraStreamStore
} from '../../cameraStream/store'
import {
    moneyCallPersistedStore as socialMoneyCallPersistedStore
} from '../../social/store'
import {
    authPersistedStore,
    navigateStore
} from '../../../main/store'
import {
    sendMessageStore as notificationSendMessageStore
} from '../../notifications/store'
//ACTIONS
import {
    CHANGE_MONEY_CALL_DATA,
    GET_MONEY_CALL_OVERVIEW_DATA,
    GET_MONEY_CALL_OVERVIEW_ID,
    NAVIGATE,
    PAY_MONEY_CALL,
    SET_SOCIAL_MONEY_CALL_DATA_ID,
    UPDATE_SOCIAL_MONEY_CALL_DATA
} from '../../../constants/action-types';
import {
    overviewDataAction,
} from '../actions';

//FUNCTIONS
import { checkResponseErrors } from '../../../main/functions';

export function subscribeOverviewIdStore() {
    const unsubscribe = overviewIdStore.subscribe(() => {
        if (checkResponseErrors(overviewIdStore.getState().overviewIdStatusState, GET_MONEY_CALL_OVERVIEW_ID)) return
        console.log('RECEIVING OVERVIEW ID MONEY CALL');
        if (
            socialMoneyCallPersistedStore.getState().moneyCallDataIdState !== overviewIdStore.getState().overviewIdState ||
            socialMoneyCallPersistedStore.getState().moneyCallDataState.length === 0
        ) {
            socialMoneyCallPersistedStore.dispatch({ type: SET_SOCIAL_MONEY_CALL_DATA_ID, payload: overviewIdStore.getState().overviewIdState })
            overviewDataStore.dispatch(overviewDataAction(authPersistedStore.getState().userNameState))
        }
    })
    return unsubscribe;
}

export function subscribeOverviewDataStore() {
    const unsubscribe = overviewDataStore.subscribe(() => {
        if (checkResponseErrors(overviewDataStore.getState().overviewDataStatusState, GET_MONEY_CALL_OVERVIEW_DATA)) return
        console.log('RECEIVING OVERVIEW DATA MONEY CALL');
        var overviewData = [{ name: 'RECOMMENDED FOR ME', data: [] }, { name: 'MOST POPULAR', data: [] }]
        overviewDataStore.getState().overviewDataState.map((item, index) => {
            item.tags.map((it, ind) => {
                var overviewDataItem = overviewData.find((i) => {
                    if (i.name === it) {
                        return i
                    }
                })
                if (overviewDataItem !== undefined) {
                    overviewDataItem.data.push(item)
                } else {
                    overviewData.push({ name: it, data: [item] })
                }
            })
        })
        overviewData.map((item, index) => {
            item.data.map(value => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value)
        })
        socialMoneyCallPersistedStore.dispatch({ type: UPDATE_SOCIAL_MONEY_CALL_DATA, payload: overviewData })
    })
    return unsubscribe;
}

export function subscribePayStore(target) {
    const unsubscribe = payStore.subscribe(() => {
        if (checkResponseErrors(payStore.getState().payStatusState, PAY_MONEY_CALL)) return
        console.log('RECEIVING PAY MONEY CALL');
        indexStore.dispatch(
            {
                type: CHANGE_MONEY_CALL_DATA,
                payload: {
                    id: indexStore.getState().selectedMoneyCallState.id,
                    status: 'PAYED',
                    stars: moneyCallRatingStore.getState().starsState,
                    comment: moneyCallRatingStore.getState().commentState,
                    time: cameraStreamStore.getState().runningSecondsState
                }
            })
        navigateStore.dispatch({ type: NAVIGATE, payload: { target: target } })
    })
    return unsubscribe;
}
