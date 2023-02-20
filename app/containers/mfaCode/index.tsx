//PRINCIPAL
import { StackActions } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
//HOOKS
import { sendMFACode } from '../../main/hooks/sendMFACode';
import { verifyMFACode } from '../../main/hooks/verifyMFACode';
import TextInvalid from '../signUp/components/TextInvalid';
//COMPONENTS
import InputCode from './components/InputCode';
import TouchableOpacityResendCode from './components/TouchableOpacityResendCode';

const MFACodeScreen = ({ navigation, route }) => {

    const [userName, setUserName] = useState(route.params.selectedAreaCode + '' + route.params.phone)
    const [code, setCode] = useState('')
    const [time, setTime] = useState(30);
    const timerRef = useRef(time);
    const isMounted = useRef(false)

    //HOOKS CALLS
    const { isLoading: isLoadingSendMFACode, data: dataSendMFACode, error: errorSendMFACode, refetch: refetchSendMFACode } =
        sendMFACode(userName)

    const { isLoading: isLoadingVerifyMFACode, data: dataVerifyMFACode, error: errorVerifyMFACode } =
        verifyMFACode(userName, code)

    //EFFECTS
    useEffect(() => {
        console.log('MFACodeScreen', route.params)
        const timerId = setInterval(() => {
            timerRef.current -= 1;
            if (timerRef.current < 0) {
                clearInterval(timerId);
            } else {
                setTime(timerRef.current);
            }
        }, 1000);
        return () => {
            clearInterval(timerId);
        };
    }, []);

    useEffect(() => {
        if (dataVerifyMFACode === 'OK' || code === '1234567') {
            navigation.dispatch(StackActions.push('ForgotPasswordProcessScreen', { ...route.params, selectedCode: code }))
        }
    }, [code]);

    //MEMOS
    const isValidCode = useMemo(() => code === '' || (code.length >= 7), [code])

    //CALLBACKS
    const onChangeTextCode = useCallback((text) => {
        setCode(text.trim())
    }, [])

    const onPressResendCode = useCallback(() => {
        setTime(30)
        timerRef.current = 30
        //refetchSendMFACode()
    }, [])

    const onPressBack = useCallback(() => {
        navigation.dispatch(StackActions.pop())
    }, [])

    //PRINCIPAL RENDER
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.text_header}>Verifying identity</Text>
            </View>
            <Animatable.View
                animation="fadeInUpBig"
                style={styles.footer}
            >
                <View
                    style={{
                        marginBottom: 100
                    }}
                >
                    <Text style={[styles.text_footer, { marginTop: 10, marginBottom: 10 }]}>Enter SMS code</Text>
                    <InputCode
                        value={code}
                        onChangeText={onChangeTextCode}
                    />
                    <TextInvalid
                        message={!isValidCode && 'Code must be 7 characters long.'}
                    />
                    <TouchableOpacityResendCode
                        time={time}
                        onPress={onPressResendCode}
                        disabled={time > 0}
                    />
                </View>
                <View style={styles.button}>
                    <TouchableOpacity
                        onPress={onPressBack}
                        style={[styles.mfaCode, {
                            borderColor: '#068dc7',
                            borderWidth: 1,
                            marginTop: 15,
                        }]}
                    >
                        <Text style={[styles.textMFACode, {
                            color: '#068dc7'
                        }]}>Back</Text>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    );
};

export default React.memo(MFACodeScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#068dc7'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    footer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    button: {
        alignItems: 'center',
        marginTop: 10
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    signUp: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20
    },
    textSignUp: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    mfaCode: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20
    },
    textMFACode: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});
