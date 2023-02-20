//PRINCIPAL
import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator,
    Text
} from 'react-native';
import * as Keychain from 'react-native-keychain';
//HOOKS
import { signInProcess } from '../../main/hooks/signInProcess';

const SignInProcessScreen = ({ navigation, route }) => {

    //INITIAL STATES
    const [areaCode, setAreaCode] = useState(route.params.selectedAreaCode)
    const [phone, setPhone] = useState(route.params.selectedPhone)
    const [password, setPassword] = useState(route.params.selectedPassword)
    const [code, setCode] = useState(route.params.selectedCode)
    const [processLabel, setProcessLabel] = useState('Sign In')
    const [error, setError] = useState(false)
    const isMounted = useRef(false)

    //HOOKS CALLS
    const { isLoading: isLoadingSignInProcess, run: runSignInProcess, isSuccess: isSuccessSignInProcess } =
        signInProcess(
            areaCode,
            phone,
            password,
            navigation
        )

    //EFFECTS
    useEffect(() => {
        console.log('SignInProcessScreen', route.params)
        let time = 0
        const interval = setInterval(() => {
            if (time === 1) {
                runSignInProcess()
            }
            time++
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    //EFFECTS
    useEffect(() => {
        if (isSuccessSignInProcess) {
            setTimeout(() => {
                Keychain.setGenericPassword(areaCode + '' + phone, password).then(result => {
                    console.log('setGenericPassword', result)
                });
            }, 500)
        }
    }, [isSuccessSignInProcess])

    //PRINCIPAL RENDER
    return (
        <View style={styles.container}>
            <Text style={{ color: 'white', marginBottom: 10, fontSize: 22, fontWeight: 'bold' }} >{processLabel}</Text>
            <ActivityIndicator
                size="large"
                animating={true}
                color="white"
            />
        </View>
    );
};

export default React.memo(SignInProcessScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#068dc7',
        alignItems: 'center',
        justifyContent: 'center'
    },
});
