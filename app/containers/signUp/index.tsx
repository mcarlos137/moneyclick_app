//PRINCIPAL
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { CheckBox } from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';
import { StackActions } from '@react-navigation/native';
//HOOKS
import { checkAvailableNickName } from './hooks/checkAvailableNickName';
import { checkUserNameCoreExist } from './hooks/checkUserNameCoreExist';
import { checkUserNameBushidoExist } from './hooks/checkUserNameBushidoExist';
import { sendMFACode } from '../../main/hooks/sendMFACode';
//COMPONENTS
import InputNickName from './components/InputNickName';
import InputPhone from '../signIn/components/InputPhone';
import InputPassword from '../signIn/components/InputPassword';
import InputPasswordConfirmation from './components/InputPasswordConfirmation';
import TextInvalid from './components/TextInvalid';

const SignUpScreen = ({ navigation, route }) => {

    const [nickName, setNickName] = useState('')
    const [areaCode, setAreaCode] = useState('58')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [secureTextEntry, setSecureTextEntry] = useState(true)
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [secureTextEntryConfirmation, setSecureTextEntryConfirmation] = useState(true)
    const [openModal, setOpenModal] = useState(false)
    const [termsAndConditionsAccepted, setTermsAndConditionsAccepted] = useState(false)
    const [code, setCode] = useState('')
    const isMounted = useRef(false)

    //HOOKS CALLS
    const { isLoading: isLoadingAvailableNickName, data: dataAvailableNickName, error: errorAvailableNickName } =
        checkAvailableNickName(nickName)

    const { isLoading: isLoadingUserNameCoreExist, data: dataUserNameCoreExist, error: errorUserNameCoreExist } =
        checkUserNameCoreExist(areaCode, phone)

    const { isLoading: isLoadingUserNameBushidoExist, data: dataUserNameBushidoExist, error: errorUserNameBushidoExist } =
        checkUserNameBushidoExist(areaCode, phone)

    //EFFECTS
    useEffect(() => {
        console.log('SignUpScreen', route.params)
    }, []);

    //MEMOS
    const isValidNickName = useMemo(() => nickName === '' || nickName.length >= 4, [nickName])

    const isValidPhone = useMemo(() => phone === '' || (phone.length >= 9 && !Number.isNaN(Number(phone))), [phone])

    const isValidPassword = useMemo(() => password === '' || password.length >= 8, [password])

    const isValidPasswordConfirmation = useMemo(() => passwordConfirmation === '' || password === passwordConfirmation, [password, passwordConfirmation])

    const isValidUserName = useMemo(() => (dataUserNameCoreExist || dataUserNameBushidoExist) ? false : true, [dataUserNameCoreExist, dataUserNameBushidoExist])

    const userName = useMemo(() => areaCode + '' + phone, [areaCode, phone])

    //CALLBACKS
    const onChangeTextNickName = useCallback((text) => {
        setNickName(text.trim())
    }, [])

    const onChangeTextPhone = useCallback((text) => {
        setPhone(text.trim())
    }, [])

    const onPressAreaCode = useCallback(() => {
        setOpenModal(true)
    }, [])

    const onChangeTextPassword = useCallback((text) => {
        setPassword(text.trim())
    }, [])

    const onPressSecureTextEntryPassword = useCallback(() => {
        setSecureTextEntry(secureTextEntry => !secureTextEntry)
    }, [])

    const onChangeTextPasswordConfirmation = useCallback((text) => {
        setPasswordConfirmation(text.trim())
    }, [password])

    const onPressSecureTextEntryPasswordConfirmation = useCallback(() => {
        setSecureTextEntryConfirmation(secureTextEntry => !secureTextEntry)
    }, [])

    const onPressTermsAndConditionsAccepted = useCallback(() => {
        setTermsAndConditionsAccepted(terms => !terms)
    }, [])

    const onPressSignUp = useCallback(() => {
        if (!termsAndConditionsAccepted) {
            Alert.alert('Sign Up Error', 'You must read and accept terms and conditions.', [
                { text: 'Ok' }
            ]);
            return;
        }
        navigation.dispatch(StackActions.push('MFACodeScreen', { ...route.params, selectedAreaCode: areaCode, selectedPhone: phone, selectedPassword: password }))
    }, [areaCode, phone, password, termsAndConditionsAccepted])

    const onPressBack = useCallback(() => {
        navigation.dispatch(StackActions.pop())
    }, [])

    //PRINCIPAL RENDER
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.text_header}>Register Now!</Text>
            </View>
            <Animatable.View
                animation="fadeInUpBig"
                style={styles.footer}
            >
                <InputNickName
                    value={nickName}
                    onChangeText={onChangeTextNickName}
                />
                <TextInvalid
                    message={!isValidNickName ?
                        'Nickname must be at least 4 characters long' :
                        !dataAvailableNickName && 'Nickname is not available'}
                />
                <InputPhone
                    areaCode={areaCode}
                    phone={phone}
                    isValid={areaCode !== '' && isValidPhone && phone !== ''}
                    onChangeText={onChangeTextPhone}
                    onPress={onPressAreaCode}
                />
                <TextInvalid
                    message={
                        phone !== '' && areaCode === '' ?
                            'Press (+) to select phone area code.' :
                            !isValidPhone ?
                                'Phone must have only numbers and be at least 9 characters long.' :
                                !isValidUserName && 'Phone is already registered. Go to forgot password and recover access to you account.'
                    }
                />
                <InputPassword
                    secureTextEntry={secureTextEntry}
                    password={password}
                    onPress={onPressSecureTextEntryPassword}
                    onChangeText={onChangeTextPassword}
                />
                <TextInvalid
                    message={!isValidPassword && 'Password must be at least 8 characters long.'}
                />
                <InputPasswordConfirmation
                    passwordConfirmation={passwordConfirmation}
                    secureTextEntryConfirmation={secureTextEntryConfirmation}
                    onChangeText={onChangeTextPasswordConfirmation}
                    onPress={onPressSecureTextEntryPasswordConfirmation}
                />
                <TextInvalid
                    message={!isValidPasswordConfirmation && 'Confirmation must equals to password'}
                />
                <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                    <CheckBox
                        onPress={onPressTermsAndConditionsAccepted}
                        checked={termsAndConditionsAccepted}
                    //color='black'
                    />
                    <TouchableOpacity
                        onPress={() => setOpenModal(true)}
                    >
                        <Text style={[{ fontWeight: 'bold' }]}>{" "}Accept{" "}Terms{" "}and{" "}Privacy policy</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.button}>
                    <TouchableOpacity
                        style={styles.signUp}
                        onPress={onPressSignUp}
                    /*disabled={
                        !isValidNickName || nickName === '' ||
                        !isValidPhone || areaCode === '' || phone === '' ||
                        !isValidPassword || password === '' ||
                        !isValidPasswordConfirmation || passwordConfirmation === '' ||
                        !isValidNickName ||
                        !isValidUserName
                    }*/
                    >
                        <LinearGradient
                            colors={['#065890', '#013558']}
                            style={styles.signUp}
                        >
                            <Text style={[styles.textSignUp, {
                                color: '#fff'
                            }]}>Sign Up</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onPressBack}
                        style={[styles.signUp, {
                            borderColor: '#068dc7',
                            borderWidth: 1,
                            marginTop: 15,
                        }]}
                    >
                        <Text style={[styles.textSignUp, {
                            color: '#068dc7'
                        }]}>Back</Text>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    );
};

export default React.memo(SignUpScreen);

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
    }
});
