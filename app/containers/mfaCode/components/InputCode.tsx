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
            name="phone"
            size={20}
        />
        <TextInput
            placeholder="SMS Code"
            placeholderTextColor="#666666"
            style={[styles.textInput, {}]}
            autoCapitalize="none"
            value={value}
            onChangeText={onChangeText}
        />
    </View>
);

export default React.memo(Component);

const styles = StyleSheet.create({
    action: {
        flexDirection: 'row',
        marginTop: 10,
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

