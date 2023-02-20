//PRINCIPAL
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import InputPassword from '../signIn/components/InputPassword';
import LinearGradient from 'react-native-linear-gradient';
import { StackActions } from '@react-navigation/native';
//HOOKS
import { checkUserNameBushidoExist } from '../signUp/hooks/checkUserNameBushidoExist';
import { checkUserNameCoreExist } from '../signUp/hooks/checkUserNameCoreExist';
//COMPONENTS
import InputPhone from '../signIn/components/InputPhone';
import InputPasswordConfirmation from '../signUp/components/InputPasswordConfirmation';
import TextInvalid from '../signUp/components/TextInvalid';

const ForgotPasswordScreen = ({ navigation, route }) => {

    //INIT STATES
    const [areaCode, setAreaCode] = useState('58')
    const [phone, setPhone] = useState('')
    const [imageTextInputChange, setImageTextInputChange] = useState(false)
    const [password, setPassword] = useState('')
    const [secureTextEntry, setSecureTextEntry] = useState(true)
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [secureTextEntryConfirmation, setSecureTextEntryConfirmation] = useState(true)
    const [openModal, setOpenModal] = useState(false)

    //HOOKS CALLS
    const { isLoading: isLoadingUserNameCoreExist, data: dataUserNameCoreExist, error: errorUserNameCoreExist } =
        checkUserNameCoreExist(areaCode, phone)

    const { isLoading: isLoadingUserNameBushidoExist, data: dataUserNameBushidoExist, error: errorUserNameBushidoExist } =
        checkUserNameBushidoExist(areaCode, phone)

    //EFFECTS
    useEffect(() => {
        console.log('ForgotPasswordScreen', route.params)
    }, []);

    //MEMOS
    const isValidPhone = useMemo(() => phone === '' || (phone.length >= 9 && !Number.isNaN(Number(phone))), [phone])

    const isValidPassword = useMemo(() => password === '' || password.length >= 8, [password])

    const isValidPasswordConfirmation = useMemo(() => passwordConfirmation === '' || password === passwordConfirmation, [password, passwordConfirmation])

    const isValidUserName = useMemo(() => (dataUserNameCoreExist && dataUserNameBushidoExist) ? true : false, [dataUserNameCoreExist, dataUserNameBushidoExist])

    //CALLBACKS
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

    const onPressRecover = useCallback(() => {
        navigation.dispatch(StackActions.push('MFACodeScreen', { ...route.params, selectedAreaCode: areaCode, selectedPhone: phone, selectedPassword: password }))
    }, [areaCode, phone, password])

    const onPressBack = useCallback(() => {
        navigation.dispatch(StackActions.pop())
    }, [])

    //PRINCIPAL RENDER
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.text_header}>Recover Password</Text>
            </View>
            <Animatable.View
                animation="fadeInUpBig"
                style={styles.footer}
            >
                <InputPhone
                    areaCode={areaCode}
                    phone={phone}
                    isValid={areaCode !== '' && isValidPhone && phone !== '' && dataUserNameBushidoExist && dataUserNameCoreExist}
                    onChangeText={onChangeTextPhone}
                    onPress={onPressAreaCode}
                />
                <TextInvalid
                    message={
                        phone !== '' && areaCode === '' ?
                            'Press (+) to select phone area code.' :
                            !isValidPhone ?
                                'Phone must have only numbers and be at least 9 characters long.' :
                                areaCode !== '' && phone !== '' && !isValidUserName && 'Phone is not registered. Please verify your input.'
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
                <View style={styles.button}>
                    <TouchableOpacity
                        style={styles.forgotPassword}
                        onPress={onPressRecover}
                        disabled={
                            !isValidPhone || areaCode === '' || phone === '' ||
                            !isValidPassword || password === '' ||
                            !isValidPasswordConfirmation || passwordConfirmation === '' ||
                            !isValidUserName
                        }
                    >
                        <LinearGradient
                            colors={['#065890', '#013558']}
                            style={styles.forgotPassword}
                        >
                            <Text style={[styles.textForgotPassword, {
                                color: '#fff'
                            }]}>Recover</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onPressBack}
                        style={[styles.forgotPassword, {
                            borderColor: '#068dc7',
                            borderWidth: 1,
                            marginTop: 15,
                        }]}
                    >
                        <Text style={[styles.textForgotPassword, {
                            color: '#068dc7'
                        }]}>Back</Text>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    );
};

export default React.memo(ForgotPasswordScreen);

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
    forgotPassword: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20
    },
    textForgotPassword: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});
