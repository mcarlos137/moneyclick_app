import React, { useEffect, useRef } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { Animated, Dimensions, View } from "react-native";
//COMPONENTS
import Body_Exchange from "./Body_Exchange";
import Body_P2P from "./Body_P2P";

const mapStateToProps = state => {
    return {
        selectedMoneyMarketsOption: state.selectedMoneyMarketsOption,
    };
};


const ConnectedComponent = ({
    selectedMoneyMarketsOption
}) => {

    //INITIAL STATES
    const translationView = useRef(new Animated.Value(0)).current;

    //EFFECTS
    useEffect(() => {
        if (selectedMoneyMarketsOption === 'P2P') {
            Animated.timing(translationView, {
                toValue: -Dimensions.get('window').width,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }
        if (selectedMoneyMarketsOption === 'EXCHANGE') {
            Animated.timing(translationView, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start();

        }
    }, [selectedMoneyMarketsOption])

    return (
        <Animated.View
            style={{
                flexDirection: 'row',
                flex: 1,
                transform: [
                    { translateX: translationView },
                ],
            }}
        >
            <Body_Exchange />
            <Body_P2P />
        </Animated.View>
    )
}

export default React.memo(compose(connect(mapStateToProps))(ConnectedComponent))