import React from "react";
import {
    View,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const Component = ({
    secureTextEntry,
    password,
    onPress,
    onChangeText
}) => (
    <View style={styles.action}>
        <Feather
            style={{
                padding: 15
            }}
            name="lock"
            //color={colors.text}
            size={25}
        />
        <TextInput
            placeholder="Your Password"
            placeholderTextColor="#666666"
            secureTextEntry={secureTextEntry ? true : false}
            style={{
                flex: 1,
                color: 'grey',
                fontSize: 16
            }}
            autoCapitalize="none"
            value={password}
            onChangeText={onChangeText}
        />
        <TouchableOpacity
            onPress={onPress}
        >
            {secureTextEntry ?
                <Feather
                    style={{
                        padding: 15
                    }}
                    name="eye-off"
                    color="grey"
                    size={20}
                />
                :
                <Feather
                    style={{
                        padding: 15
                    }}
                    name="eye"
                    color="grey"
                    size={20}
                />
            }
        </TouchableOpacity>
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

