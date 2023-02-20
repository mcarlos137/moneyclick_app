import React from "react";
import {
    Text,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

const Component = ({ message }) => (
    <Animatable.View animation="fadeInLeft" duration={500}  >
        <Text style={{
            color: '#FF0000',
            fontSize: 14,
        }}>
            {message}
        </Text>
    </Animatable.View>
);

export default React.memo(Component);
