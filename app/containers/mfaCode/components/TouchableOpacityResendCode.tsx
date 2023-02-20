import React from 'react';
import {
    Text,
    TouchableOpacity,
} from 'react-native';

const Component = ({ time, onPress, disabled }) => (
    <TouchableOpacity
        style={{
            flexDirection: 'row'
        }}
        onPress={onPress}
        disabled={disabled}
    >
        <Text style={{ color: '#068dc7', marginTop: 15, fontWeight: disabled ? 'normal' : 'bold' }}>Resend Code</Text>
        {time > 0 && <Text style={{ color: '#068dc7', marginTop: 15, marginLeft: 5 }}>{time}</Text>}
    </TouchableOpacity>
);

export default React.memo(Component);
