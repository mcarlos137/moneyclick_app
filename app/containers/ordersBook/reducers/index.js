import {
  SET_ORDER_BOOK_PAIR,
  SET_ORDER_BOOK_DATA,
  ADD_ORDER_BOOK_DATA,
  CLEAR_ORDER_BOOK_DATA,
  SET_ORDER_BOOK_OPERATION_TYPE,
  SET_ORDER_BOOK_PRICE_TYPE,
  SET_ORDER_BOOK_PRICE,
  SET_ORDER_BOOK_ASSET_AMOUNT,
  SET_ORDER_BOOK_BASE_AMOUNT,
  SET_ORDER_BOOK_MAX_AMOUNT,
  SET_ORDER_BOOK_COMMISSION,
  SET_ORDER_BOOK_TIME_PERIOD,
  SET_ORDER_BOOK_TIME_PERIOD_UNIT,
  SET_ORDER_BOOK_SUBSCRIPTION,
  OPEN_MODAL,
  SET_CONFIRMATION_MODAL_MESSAGE
} from "../../../constants/action-types";

const initialState = {
  pairState: '',
  dataChartState: {},
  operationTypeState: 'BUY',
  priceTypeState: 'MARKET_PRICE',
  priceState: '0.00',
  assetAmountState: '0.00',
  baseAmountState: '0.00',
  maxAmountState: 0,
  commissionState: {},
  timePeriodState: 1,
  timePeriodUnitState: 'hours',
  openModalState: false,
  confirmationModalMessageState: '',
  subscriptionState: {}
};

function rootReducer(state = initialState, action) {
  if (action.type === SET_ORDER_BOOK_SUBSCRIPTION) {
    return Object.assign({}, state, {
      token: state.subscriptionState = action.payload,
    });
  }
  if (action.type === SET_CONFIRMATION_MODAL_MESSAGE) {
    return Object.assign({}, state, {
      token: state.confirmationModalMessageState = action.payload,
    });
  }
  if (action.type === OPEN_MODAL) {
    return Object.assign({}, state, {
      token: state.openModalState = action.payload,
    });
  }
  if (action.type === SET_ORDER_BOOK_TIME_PERIOD_UNIT) {
    return Object.assign({}, state, {
      token: state.timePeriodUnitState = action.payload,
    });
  }
  if (action.type === SET_ORDER_BOOK_TIME_PERIOD) {
    return Object.assign({}, state, {
      token: state.timePeriodState = action.payload,
    });
  }
  if (action.type === SET_ORDER_BOOK_COMMISSION) {
    return Object.assign({}, state, {
      token: state.commissionState = action.payload,
    });
  }
  if (action.type === SET_ORDER_BOOK_MAX_AMOUNT) {
    return Object.assign({}, state, {
      token: state.maxAmountState = action.payload,
    });
  }
  if (action.type === SET_ORDER_BOOK_BASE_AMOUNT) {
    let maxBaseAmount = state.maxAmountState
    if (state.operationTypeState === 'SELL') {
      maxBaseAmount = maxBaseAmount * state.priceState
    }
    if (action.payload <= maxBaseAmount) {
      return Object.assign({}, state, {
        token1: state.baseAmountState = action.payload,
        token2: state.assetAmountState = (state.priceState === 0 ? 0 : action.payload / state.priceState),
      });
    }
  }
  if (action.type === SET_ORDER_BOOK_ASSET_AMOUNT) {
    let maxAsssetAmount = state.maxAmountState
    if (state.operationTypeState === 'SELL') {
      maxAsssetAmount = maxAsssetAmount / state.priceState
    }
    if (action.payload <= maxAsssetAmount) {
      return Object.assign({}, state, {
        token1: state.assetAmountState = action.payload,
        token2: state.baseAmountState = action.payload * state.priceState,
      });
    }
  }
  if (action.type === SET_ORDER_BOOK_PRICE) {
    return Object.assign({}, state, {
      token1: state.priceState = action.payload,
      token2: state.baseAmountState = action.payload * state.assetAmountState,
    });
  }
  if (action.type === SET_ORDER_BOOK_PRICE_TYPE) {
    return Object.assign({}, state, {
      token: state.priceTypeState = action.payload,
    });
  }
  if (action.type === SET_ORDER_BOOK_OPERATION_TYPE) {
    return Object.assign({}, state, {
      token: state.operationTypeState = action.payload,
    });
  }
  if (action.type === CLEAR_ORDER_BOOK_DATA) {
    return Object.assign({}, state, {
      token: state.dataChartState = {},
    });
  }
  if (action.type === ADD_ORDER_BOOK_DATA) {
    let dataChart = JSON.parse(JSON.stringify(state.dataChartState));
    let started = false;
    Object.entries(action.payload).forEach(([key, value]) => {
      started = setChartData(started, dataChart, value)
    })
    let price = null;
    if (state.priceTypeState === 'MARKET_PRICE' && state.operationTypeState === 'BUY' && dataChart.ASK !== undefined && dataChart.ASK.length > 0) {
      price = dataChart.ASK[0].price;
    } else if (state.priceTypeState === 'MARKET_PRICE' && state.operationTypeState === 'SELL' && dataChart.BID !== undefined && dataChart.BID.length > 0) {
      price = dataChart.BID[0].price;
    }
    if (price === null) {
      return Object.assign({}, state, {
        token1: state.dataChartState = dataChart,
      });
    }
    return Object.assign({}, state, {
      token1: state.dataChartState = dataChart,
      token2: state.priceState = price,
    });
  }
  if (action.type === SET_ORDER_BOOK_DATA) {
    return Object.assign({}, state, {
      token: state.dataState = action.payload,
    });
  }
  if (action.type === SET_ORDER_BOOK_PAIR) {
    return Object.assign({}, state, {
      token: state.pairState = action.payload,
    });
  }
  return state;
}

function setChartData(started, chartData, value) {
  if (chartData[value.type] === undefined || !started) {
    chartData[value.type] = [];
    chartData[value.type].push(
      {
        index: 0,
        count: 1,
        amount: Number(value.amount).toFixed(getAmountDecimals(value.pair)),
        total: Number(value.amount).toFixed(getAmountDecimals(value.pair)),
        price: Number(value.price).toFixed(getPriceDecimals(value.pair)),
        parts: [{ id: value.id, amount: Number(value.amount).toFixed(getAmountDecimals(value.pair)) }]
      }
    )
  } else {
    let lastValue = chartData[value.type][chartData[value.type].length - 1];
    if (Number(lastValue.price).toFixed(getPriceDecimals(value.pair)) === Number(value.price).toFixed(getPriceDecimals(value.pair))) {
      lastValue.count = Number(lastValue.count) + 1;
      lastValue.amount = Number(lastValue.amount) + Number(value.amount);
      lastValue.amount = Number(lastValue.amount).toFixed(getAmountDecimals(value.pair))
      lastValue.total = Number(lastValue.total) + Number(value.amount);
      lastValue.total = Number(lastValue.total).toFixed(getAmountDecimals(value.pair))
      lastValue.parts.push({ id: value.id, amount: Number(value.amount).toFixed(getAmountDecimals(value.pair)) })
    } else {
      let index = Number(lastValue.index) + 1;
      let count = 1;
      let amount = Number(value.amount).toFixed(getAmountDecimals(value.pair));
      let total = Number(lastValue.total) + Number(value.amount);
      total = Number(total).toFixed(getAmountDecimals(value.pair))
      let price = Number(value.price).toFixed(getPriceDecimals(value.pair));
      let parts = [{ id: value.id, amount: Number(value.amount).toFixed(getAmountDecimals(value.pair)) }];
      chartData[value.type].push(
        { index: index, count: count, amount: amount, total: total, price: price, parts: parts }
      )
    }
  }
  return true;
}

function getPriceDecimals(pair) {
  return 2;
}

function getAmountDecimals(pair) {
  if (pair.includes('BTC')) {
    return 8;
  }
  return 2;
}

export default rootReducer;