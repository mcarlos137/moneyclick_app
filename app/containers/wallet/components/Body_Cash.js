import React from 'react';
import {
  View,
  Text
} from 'react-native'
import { connect } from "react-redux";
//COMPONENTS
import Body_Card_Item from './Body_Card_Item';

const decorateData = (moneyCallData) => {
  return {
    type: 'CASH',
    name: 'Cash Localtions',
    data: {
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      markers: [
        { latlng: { latitude: 30.78825, longitude: -100.4324 }, title: 'Store 1 title', description: 'Store 1 description' }
      ]
    }, 
    img: 'CASH',
    icon: 'cash-multiple',
    dataShow: 'MAP',
    noDataText: 'Offer / Request Cash',
    target: 'CashScreen'
  }
}

const mapStateToProps = state => {
  return {
    cashDataState: state.cashDataState,
    isLoadingState: state.isLoadingState
  };
};

const ConnectedComponent = ({ cashDataState, isLoadingState }) => (
  <Body_Card_Item item={decorateData(cashDataState)} isLoading={isLoadingState} />
);

export default connect(mapStateToProps)(ConnectedComponent)