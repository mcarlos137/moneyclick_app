import React from "react";
import {
    Text,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

const Component = ({ invalidPassword }) => (
    <Animatable.View animation="fadeInLeft" duration={500} style={{height: 30, justifyContent: 'center'}} >
        {invalidPassword &&
            <Text style={{
                color: '#FF0000',
                fontSize: 14,
            }}>
                Password must be 8 characters long.
            </Text>}
    </Animatable.View>
);

export default React.memo(Component);
