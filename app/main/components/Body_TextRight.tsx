import React from 'react';
import {
    View,
} from 'react-native';
import { NumericFormat } from 'react-number-format';

const Component = ({
    value,
    decimalScale,
    renderText,
}) => (
    <View
        style={{
            alignSelf: 'flex-end',
        }}
    >
        <NumericFormat
            value={value}
            displayType={'text'}
            thousandSeparator={true}
            decimalScale={decimalScale}
            renderText={renderText}
        />
    </View>
);

export default React.memo(Component);