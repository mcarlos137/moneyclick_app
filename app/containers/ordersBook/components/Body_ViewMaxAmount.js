import React from 'react';
import {
    Text,
    View,
} from 'react-native';
import NumberFormat from 'react-number-format';

const Component = ({
    symbol,
    decimals,
    maxAmount,
    message
}) => (
    <View
        style={{
            borderBottomColor: 'transparent',
        }}
    >
        <View style={[{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignContent: 'flex-end',
            alignItems: 'flex-end',
        },]}>
            <Text style={{
                fontSize: 14,
                color: 'black',
                fontWeight: 'bold',
            }}>
                {message}
            </Text>
            <NumberFormat
                value={maxAmount}
                displayType={'text'}
                thousandSeparator={true}
                decimalScale={decimals}
                renderText={(value) => (
                    <Text style={{
                        fontSize: 14,
                        color: 'black',
                        fontWeight: 'bold',
                    }}>
                        {' ' + symbol + ' ' + value}
                    </Text>
                )}
            />
        </View>
    </View>
);

export default Component;
