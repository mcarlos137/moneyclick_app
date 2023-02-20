//PRINCIPAL
import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator,
    Text
} from 'react-native';
//HOOKS
import { signInProcess } from '../../main/hooks/signInProcess';

const SignUpProcessScreen = ({ navigation, route }) => {

    //INITIAL STATES
    const [areaCode, setAreaCode] = useState(route.params.selectedAreaCode)
    const [phone, setPhone] = useState(route.params.selectedPhone)
    const [password, setPassword] = useState(route.params.selectedPassword)
    const [code, setCode] = useState(route.params.selectedCode)
    const [processLabel, setProcessLabel] = useState('Registering Data')
    const [error, setError] = useState(false)
    const isMounted = useRef(false)

    //HOOKS CALLS
   //const { isLoading: isLoadingUpdatePassword, data: dataUpdatePassword, error: errorUpdatePassword, refetch: refetchUpdatePassword } =
        //updatePassword(areaCode + '' + phone, password, code)

    const { isLoading: isLoadingSignInProcess, run: runSignInProcess } =
        signInProcess(
            areaCode,
            phone,
            password,
            navigation
        )

    //EFFECTS
    useEffect(() => {
        console.log('SignUpProcessScreen', route.params)
        let time = 0
        const interval = setInterval(() => {
            if (time === 0) {
                //refetchUpdatePassword()
            }
            if (time === 2) {
                setProcessLabel('Sign In')
            }
            if (time === 3) {
                runSignInProcess()
            }
            time++
        }, 1000)
        return () => clearInterval(interval)
    }, [])

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

export default React.memo(SignUpProcessScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#068dc7',
        alignItems: 'center',
        justifyContent: 'center'
    },
});
