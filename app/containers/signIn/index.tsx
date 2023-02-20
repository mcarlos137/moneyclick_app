//PRINCIPAL
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Platform,
    StyleSheet,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import DeviceInfo from 'react-native-device-info';
import { StackActions } from '@react-navigation/native';
//FUNCTIONS
//import { checkPermissions, getPhoneFromDevice } from '../../main/functions';
//COMPONENTS
import InputPhone from './components/InputPhone';
import TextInvalidPhone from './components/TextInvalidPhone';
import InputPassword from './components/InputPassword';
import TextInvalidPassword from './components/TextInvalidPassword';
import TouchableOpacityLogin from './components/TouchableOpacityLogin';
import Modal from './components/Modal'


//TYPES AND INTERFACES
type Device = {
    id: string,
    name: string,
    model: string,
    so: string
}

const SignInScreen = ({ navigation, route }) => {

    //INITIAL STATES
    //const [areaCode, setAreaCode] = useState('')
    //const [areaCode, setAreaCode] = useState('1')
    const [areaCode, setAreaCode] = useState('58')
    //const [phone, setPhone] = useState('')
    //const [phone, setPhone] = useState('2019896074')
    const [phone, setPhone] = useState('4245522788')
    //const [password, setPassword] = useState('')
    //const [password, setPassword] = useState('rt137780')
    const [password, setPassword] = useState('12345670')
    const [secureTextEntry, setSecureTextEntry] = useState(true)
    const [invalidPhone, setInvalidPhone] = useState(false)
    const [invalidPassword, setInvalidPassword] = useState(false)
    const [device, setDevice] = useState<Device | unknown>({})
    const [openModal, setOpenModal] = useState(false)
    const isMounted = useRef(false)

    //MEMOS
    const isValidPhone = useMemo(() => phone === '' || (phone.length >= 9 && !Number.isNaN(Number(phone))), [phone])

    //CALLBACKS
    const onPressSecureTextEntry = useCallback(() => {
        setSecureTextEntry(secureTextEntry => !secureTextEntry)
    }, [])

    const onChangeTextPhone = useCallback((value) => {
        if (!Number(value) && value !== '') {
            return;
        }
        setPhone(value)
    }, [])

    const onPressSelectionAreaCode = useCallback((item) => {
        setAreaCode(item.value)
        setOpenModal(false)
    }, [])

    const onChangeTextPassword = useCallback((value) => {
        setPassword(value)
        if (value.trim().length >= 8) {
            setInvalidPassword(false)
        } else {
            setInvalidPassword(true)
        }
    }, [])

    const onPressLogin = useCallback(() => {
        let deviceId = '4454e4d08748617h';
        /*let deviceId = Platform.OS !== 'android'
            ? DeviceInfo.getDeviceId()
            : DeviceInfo.getUniqueId(),*/
        const device: Device = {
            id: deviceId,
            name: DeviceInfo.getVersion(),
            model: DeviceInfo.getModel(),
            so: DeviceInfo.getSystemName() + ' ' + DeviceInfo.getSystemVersion()
        }
        setDevice(device)
        navigation.dispatch(StackActions.push('SignInProcessScreen', { ...route.params, selectedAreaCode: areaCode, selectedPhone: phone, selectedPassword: password }))
    }, [])

    const onPressCloseModal = () => {
        setOpenModal(false)
    }

    const onPressAreaCode = useCallback(() => {
        setOpenModal(true)
    }, [])

    const onPressForgotPassword = useCallback(() => {
        navigation.navigate('ForgotPasswordScreen');
    }, [])

    const onPressSignUp = useCallback(() => {
        navigation.navigate('SignUpScreen');
    }, [])

    //PRINCIPAL RENDER
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.text_header}>Welcome!</Text>
            </View>
            <Modal
                openModal={openModal}
                onPressClose={onPressCloseModal}
                onPressSelection={onPressSelectionAreaCode}
            />
            <Animatable.View
                animation="fadeInUpBig"
                style={[styles.footer, {
                    backgroundColor: 'white'
                }]}
            >
                <InputPhone
                    areaCode={areaCode}
                    phone={phone}
                    isValid={areaCode !== '' && isValidPhone && phone !== ''}
                    onChangeText={onChangeTextPhone}
                    onPress={onPressAreaCode}
                />
                <TextInvalidPhone invalidPhone={invalidPhone} />
                <InputPassword
                    secureTextEntry={secureTextEntry}
                    password={password}
                    onPress={onPressSecureTextEntry}
                    onChangeText={onChangeTextPassword}
                />
                <TextInvalidPassword invalidPassword={invalidPassword} />
                <TouchableOpacity
                    onPress={onPressForgotPassword}
                >
                    <Text style={{ color: '#068dc7', marginTop: 15 }}>Forgot password?</Text>
                </TouchableOpacity>
                <View style={styles.button}>
                    <TouchableOpacityLogin
                        onPress={onPressLogin}
                    />
                    <TouchableOpacity
                        onPress={onPressSignUp}
                        style={[styles.signIn, {
                            borderColor: '#068dc7',
                            borderWidth: 1,
                            marginTop: 15
                        }]}
                    >
                        <Text style={[styles.textSign, {
                            color: '#068dc7'
                        }]}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    );
};

export default React.memo(SignInScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#068dc7'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingTop: 120
    },
    footer: {
        //flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30,
        paddingLeft: 10
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 10
    },
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

