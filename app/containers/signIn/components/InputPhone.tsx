//PRINCIPAL
import React from "react";
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Text,
    Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';

const Component = ({
    areaCode,
    phone,
    isValid,
    onChangeText,
    onPress
}) => (
    <View style={styles.action}>
        <IconFontAwesome
            style={{
                padding: 15,
                flex: 0.5
            }}
            name="phone"
            size={25}
        />
        <TouchableOpacity
            onPress={onPress}
            style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)', // 40% opaque
                borderColor: 'rgba(255, 255, 255, 0.2)',
                flex: 1,
                alignSelf: 'center',
                alignItems: 'center',
            }}
        >
            <Text
                style={{
                    color: 'grey',
                    fontSize: 16
                }}>
                {'+' + areaCode}
            </Text>
        </TouchableOpacity>
        <TextInput
            placeholder="Your Phone"
            placeholderTextColor="#666666"
            keyboardType={'numeric'}
            style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)', // 40% opaque
                flex: 4,
                textAlign: 'center',
                color: 'grey',
                fontSize: 16
            }}
            value={phone}
            autoCapitalize="none"
            onChangeText={onChangeText}
        //onEndEditing={(e) => handleValidPhone(e.nativeEvent.text)}
        />
        {isValid &&
            <Animatable.View
                animation="bounceIn"
            >
                <Feather
                    style={{
                        padding: 15
                    }}
                    name="check-circle"
                    color="green"
                    size={20}
                />
            </Animatable.View>}
    </View>
);

export default React.memo(Component);

const styles = StyleSheet.create({
    action: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
    },
    textInput: {
        flex: 1,
        //height: 50,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: 'grey',
    },
});
