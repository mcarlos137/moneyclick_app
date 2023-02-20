import React from 'react';
import {
    Dimensions,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Platform,
} from 'react-native';

const Component = ({ children }) => (
    <KeyboardAvoidingView
        behavior={"position"}
        style={{
            width: Dimensions.get('window').width * 0.9,
            alignSelf: 'center',
            marginTop: 10,
            flex: 1
        }}
        enabled={true}
        keyboardVerticalOffset={Platform.OS === "ios" ? -130 : -200}
    >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {children}
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
);

export default React.memo(Component);