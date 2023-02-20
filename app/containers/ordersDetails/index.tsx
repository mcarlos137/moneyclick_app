import React, { useEffect } from "react";
import { View } from "react-native";
import { compose } from "redux";
//HOC
import { withColors } from "../../main/hoc";

const OrdersDetailsScreen = ({navigation, route, colors}) => {

    //EFFECTS
    useEffect(() => {
        console.log('OrdersDetailsScreen',route.params)
    }, [])

    return (
        <View>

        </View>
    )

}

export default React.memo(compose(withColors)(OrdersDetailsScreen))