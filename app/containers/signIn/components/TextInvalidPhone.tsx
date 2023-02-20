import React from "react";
import {
    Text,
} from 'react-native';
import * as Animatable from 'react-native-animatable';


const Component = ({ invalidPhone }) => (
    <Animatable.View animation="fadeInLeft" duration={500} style={{height: 30, justifyContent: 'center'}}>
        {invalidPhone &&
            <Text style={{
                color: '#FF0000',
                fontSize: 14,
            }}>
                Phone must be at least 9 characters long.
            </Text>}
    </Animatable.View>
);

export default React.memo(Component);
