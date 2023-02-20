//PRINCIPAL
import React from "react";
import {
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


const Component = ({ onPress }) => (
    <TouchableOpacity
        style={styles.signIn}
        onPress={onPress}
    >
        <LinearGradient
            colors={['#065890', '#013558']}
            style={styles.signIn}
        >
            <Text style={[styles.textSign, {
                color: '#fff'
            }]}>Sign In</Text>
        </LinearGradient>
    </TouchableOpacity>
);

export default React.memo(Component);

const styles = StyleSheet.create({
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});

