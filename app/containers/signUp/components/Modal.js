//PRINCIPAL
import React from 'react';
import {
    Text,
    View,
    Dimensions,
    Button,
} from 'react-native';
import Modal from 'react-native-modal';
import {
    connect
} from "react-redux";
//STORES
import {
    indexStore,
} from '../store';
//ACTIONS
import {
    OPEN_MODAL,
    SET_ACCEPT_TERMS_AND_CONDITIONS
} from "../../../constants/action-types";

const mapStateToProps = state => {
    return {
        openModalState: state.openModalState,
        termsAndConditionsAcceptedState: state.termsAndConditionsAcceptedState
    };
};

const ConnectedComponent = ({ openModalState, termsAndConditionsAcceptedState }) => (
    <Modal
        transparent={false}
        isVisible={openModalState}
        style={{
            margin: 0,
        }}
        backdropColor={'#fff'}
        backdropOpacity={0}
        animationIn='slideInRight'
        animationOut='slideOutRight'
        animationInTiming={500}
        animationOutTiming={500}
        backdropTransitionInTiming={500}
        backdropTransitionOutTiming={500}
    >
    </Modal>
);

const Component = connect(mapStateToProps)(ConnectedComponent);

export default Component;
