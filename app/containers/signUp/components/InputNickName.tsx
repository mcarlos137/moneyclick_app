import React from "react";
import {
    View,
    TextInput,
    StyleSheet,
    Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const Component = ({ value, onChangeText }) => (
    <View style={styles.action}>
        <Feather
            style={{
                padding: 15
            }}
            name="user"
            size={25}
        />
        <TextInput
            value={value}
            placeholder="Nickname"
            placeholderTextColor="#666666"
            style={{
                flex: 1,
                color: 'grey',
                fontSize: 16
            }}
            autoCapitalize="none"
            onChangeText={onChangeText}
        />
    </View>
);

export default React.memo(Component);

const styles = StyleSheet.create({
    action: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
});

