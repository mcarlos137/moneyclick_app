//PRINCIPAL
import React from 'react';
import {
    Text,
    Image,
    View,
    Dimensions,
    Platform,
} from 'react-native';
import { Avatar } from '@rneui/themed';
import { NumericFormat } from 'react-number-format';
import { compose } from 'redux';
//FUNCTIONS
import { getRequire } from '../functions'
//HOC
import { withColors } from '../hoc';

type Headers_Props = {
    currency: string
    targetImg: string
    maxAmount: number
    amount: number
    invertImages?: boolean
    showBalance?: boolean
    colors: any
}

const Component = ({ 
    currency, 
    targetImg, 
    maxAmount = 0.00, 
    amount = 0.00, 
    invertImages, 
    showBalance = true,
    colors 
}, Headers_Props) => {

    //PRINCIPAL RENDER
    return (
        <View style={{
            height: 100,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            alignContent: "center",
            backgroundColor: colors.getRandomMain(),
            width: Dimensions.get('window').width,
            zIndex: 15,
            elevation: (Platform.OS === 'android') ? 50 : 0
        }}>
            <View
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                    alignContent: "center",
                    flexDirection: 'row'
                }}
            >
                <Avatar
                    size={35}
                    rounded
                    source={invertImages ? getRequire(targetImg) : getRequire(currency?.img)}
                />
                <Image
                    source={require('../../../assets/icon_arrow.png')}
                    style={{ width: 30, height: 18, marginLeft: 15, marginRight: 15 }}
                />
                <Avatar
                    size={35}
                    rounded
                    source={invertImages ? getRequire(currency?.img) : getRequire(targetImg)}
                />
            </View>
            {(maxAmount !== undefined && amount !== undefined) && showBalance &&
                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                    <Text
                        style={{
                            color: 'white',
                            fontWeight: "bold",
                            fontSize: 21,
                        }}
                    >
                        {currency?.symbol}
                    </Text>
                    <NumericFormat
                        value={(maxAmount - amount) > 0 ? (maxAmount - amount) : 0}
                        displayType={'text'}
                        thousandSeparator={true}
                        decimalScale={(currency?.value === 'BTC' || currency?.value === 'ETH') ? 8 : 2}
                        renderText={(value) => (
                            <Text
                                style={{
                                    color: 'white',
                                    fontSize: 21,
                                    marginLeft: 5,
                                }}
                            >
                                {value}
                            </Text>
                        )}
                    />
                </View>}
        </View>
    )
};

export default React.memo(compose(withColors)(Component));