//PRINCIPAL
import React, { useCallback, useEffect, useState } from 'react';
import { StackActions } from '@react-navigation/native';
import {
    Dimensions,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
    ActivityIndicator
} from 'react-native';
import { compose } from 'redux'
import { Avatar } from '@rneui/themed';
import DatePicker from 'react-native-date-picker'
import { TextInputMask } from 'react-native-masked-text';
import { NumericFormat } from 'react-number-format';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
//HOOKS
import { createMoneyCall } from './hooks/createMoneyCall'
//TOOLS
import httpRequest from '../../tools/httpRequest';
import { withColors, withConfig, withHmacInterceptor, withUserName } from '../../main/hoc';
//COMPONENTS

const MoneyCallsCreateScreen = ({ navigation, route, colors, userName, config, hmacInterceptor }) => {

    //INITIAL STATES
    const [otherUserName, setOtherUserName] = useState(
        route?.params?.selectedMoneyCallOverviewUser !== undefined ? route.params.selectedMoneyCallOverviewUser.userName :
            route?.params?.selectedPhone !== undefined ? (route.params.selectedPhone.areaCode + route.params.selectedPhone.phone) :
                '584245105809'
    )
    const [otherName, setOtherName] = useState(
        route?.params?.selectedMoneyCallOverviewUser !== undefined ? route.params.selectedMoneyCallOverviewUser.name :
            route?.params?.selectedPhone !== undefined ? route.params.selectedPhone.name :
                'Nancy Briceño'
    )
    const [payer, setPayer] = useState('you')
    const [type, setType] = useState('video')
    const [scheduledTimestamp, setScheduledTimestamp] = useState<string | null>(null)
    const [rate, setRate] = useState(route?.params?.selectedMoneyCallOverviewUser !== undefined ? route.params.selectedMoneyCallOverviewUser.basicRate : 0)
    const [estimatedTime, setEstimatedTime] = useState(0)
    const [message, setMessage] = useState('')
    const [openDateModal, setOpenDateModal] = useState(false)
    const [overviewUser, setOverviewUser] = useState(route?.params?.selectedMoneyCallOverviewUser !== undefined ? true : false)

    //HOOKS CALLS
    const { mutate: mutateCreateMoneyCall, isSuccess: isSuccessCreateMoneyCall, isLoading: isLoadingCreateMoneyCall } = createMoneyCall()

    //EFFECTS
    useEffect(() => {
        console.log('MoneyCallsCreateScreen', route.params)
    }, []);

    useEffect(() => {
        if (isSuccessCreateMoneyCall) {
            navigation.dispatch(StackActions.pop())
        }
    }, [isSuccessCreateMoneyCall]);

    //CALLBACKS
    const onPressTarget = useCallback(() => {
        //navigateStore.dispatch({ type: NAVIGATE, payload: { target: 'ContactsScreen', redirectToTarget: 'MoneyCallCreateScreen' } });
    }, [])

    const onValueChangePayer = useCallback(() => {
        setPayer(previousPayer => previousPayer === 'receiver' ? 'you' : 'receiver')
    }, [])

    const onValueChangeType = useCallback(() => {
        setType(previousType => previousType === 'video' ? 'audio' : 'video')
    }, [])

    const onValueChangeWhen = useCallback((value) => {
        setScheduledTimestamp(value ? '' : null)
        if (value) setOpenDateModal(true)
    }, [])

    const onConfirmScheduledTimestamp = useCallback((date) => {
        setOpenDateModal(false)
        setScheduledTimestamp(date.toISOString())
    }, [])

    const onCancelScheduledTimestamp = useCallback(() => {
        setOpenDateModal(false)
    }, [])

    const onChangeTextRate = useCallback((maskedText, rawText) => {
        setRate(Number(rawText))
    }, [])

    const onChangeTextEstimatedTime = useCallback((maskedText, rawText) => {
        setEstimatedTime(Number(rawText))
    }, [])

    const onChangeTextMessage = useCallback((text) => {
        setMessage(text)
    }, [])

    const onPressCreate = useCallback(() => {
        console.log('CREATE')
        if (otherUserName === '') {
            Alert.alert('Attention', 'You must enter a valid user to connect with.', [
                { text: 'Ok' }
            ]);
            return
        }
        if (Number(rate) === 0) {
            Alert.alert('Attention', 'You must enter a rate bigger than zero.', [
                { text: 'Ok' }
            ]);
            return
        }
        if (Number(estimatedTime) === 0) {
            Alert.alert('Attention', 'You must enter a estimated time bigger than zero.', [
                { text: 'Ok' }
            ]);
            return
        }
        const createUserName = userName
        const currency = 'USD'
        let senderUserName
        let receiverUserName
        let senderName
        let receiverName
        if (payer === 'you') {
            senderUserName = userName
            receiverUserName = otherUserName
            senderName = senderUserName
            receiverName = receiverUserName
            if (config.nickName !== undefined) {
                senderName = config.nickName
            }
            if (config.firstName !== undefined &&
                config.lastName !== undefined) {
                senderName = config.firstName + ' ' + config.lastName
            }
            receiverName = otherName
        } else {
            senderUserName = otherUserName
            receiverUserName = userName
            senderName = senderUserName
            receiverName = receiverUserName
            if (config.nickName !== undefined) {
                receiverName = config.nickName
            }
            if (config.firstName !== undefined &&
                config.lastName !== undefined) {
                receiverName = config.firstName + ' ' + config.lastName
            }
            senderName = otherName
        }
        mutateCreateMoneyCall({
            createUserName: createUserName,
            senderUserName: senderUserName,
            receiverUserName: receiverUserName,
            type: type,
            currency: currency,
            rate: rate,
            senderName: senderName,
            receiverName: receiverName,
            scheduledTimestamp: scheduledTimestamp,
            estimatedTime: estimatedTime,
            message: message
        })
    }, [otherUserName, otherName, payer, type, scheduledTimestamp, rate, estimatedTime, message])

    //PRINCIPAL RENDER
    return (
        <View style={{
            flex: 1
        }}>
            <ScrollView
                style={{
                    width: Dimensions.get('window').width * 0.9,
                    alignSelf: 'center',
                    marginTop: 10
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        alignContent: 'center'
                    }}
                >
                    <Text
                        style={{
                            flex: 0.2,
                            color: colors.text,
                            fontWeight: 'bold',
                        }}
                    >
                        Target:
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            flex: 0.8,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        {overviewUser ?
                            <>
                                <Avatar
                                    size={40}
                                    rounded
                                    source={{
                                        uri: 'https://service8081.moneyclick.com/attachment/getUserFile/' + otherUserName,
                                        method: 'GET',
                                        headers: hmacInterceptor?.process(
                                            httpRequest.create(
                                                'https://service8081.moneyclick.com',
                                                '/attachment/getUserFile/' + otherUserName,
                                                'GET',
                                                null,
                                                false
                                            )).headers,
                                    }}
                                    overlayContainerStyle={{
                                        backgroundColor: 'white',
                                    }}
                                />
                                <Text
                                    style={{
                                        marginLeft: 7,
                                        color: colors.text,
                                    }}
                                >
                                    {otherName}
                                </Text>
                            </> :
                            <>
                                <TouchableOpacity
                                    style={{ marginRight: 10 }}
                                    onPress={onPressTarget}
                                >
                                    <MaterialCommunityIcons
                                        name="account-search"
                                        color={colors.icon}
                                        size={30}
                                    />
                                </TouchableOpacity>
                                <Text
                                    style={{
                                        color: colors.text,
                                    }}
                                >
                                    {otherUserName} - {otherName}
                                </Text>
                            </>}
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 20
                    }}
                >
                    <Text
                        style={{
                            flex: 0.2,
                            color: colors.text,
                            fontWeight: 'bold',
                        }}
                    >
                        Who pay?
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            flex: 0.8,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Text
                            style={{
                                marginRight: 10,
                                color: payer === 'you' ? '#81b0ff' : colors.text,
                                fontWeight: payer === 'you' ? 'bold' : 'normal'
                            }}
                        >
                            You Pay
                        </Text>
                        <Switch
                            trackColor={{ false: "#767577", true: "#767577" }}
                            thumbColor={payer !== 'you' ? "#f4f3f4" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={onValueChangePayer}
                            value={payer !== 'you'}
                            disabled={overviewUser}
                        />
                        <Text
                            style={{
                                marginLeft: 10,
                                color: payer === 'receiver' ? '#81b0ff' : colors.text,
                                fontWeight: payer === 'receiver' ? 'bold' : 'normal'
                            }}
                        >
                            Receiver Pay
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 20,
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            flex: 0.2,
                            color: colors.text,
                            fontWeight: 'bold',
                        }}
                    >
                        Type:
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            flex: 0.8,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Text
                            style={{
                                marginRight: 10,
                                color: type === 'video' ? '#81b0ff' : colors.text,
                                fontWeight: type === 'video' ? 'bold' : 'normal'
                            }}
                        >
                            Video and audio
                        </Text>
                        <Switch
                            trackColor={{ false: "#767577", true: "#767577" }}
                            thumbColor={type !== 'video' ? "#f4f3f4" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={onValueChangeType}
                            value={type !== 'video'}
                        />
                        <Text
                            style={{
                                marginLeft: 10,
                                color: type === 'audio' ? '#81b0ff' : colors.text,
                                fontWeight: type === 'audio' ? 'bold' : 'normal'
                            }}
                        >
                            Only audio
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 20,
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            flex: 0.2,
                            color: colors.text,
                            fontWeight: 'bold',
                        }}
                    >
                        When?
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            flex: 0.8,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Text
                            style={{
                                marginRight: 10,
                                color: scheduledTimestamp === null ? '#81b0ff' : colors.text,
                                fontWeight: scheduledTimestamp === null ? 'bold' : 'normal'
                            }}
                        >
                            Now
                        </Text>
                        <Switch
                            trackColor={{ false: "#767577", true: "#767577" }}
                            thumbColor={scheduledTimestamp !== null ? "#f4f3f4" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={onValueChangeWhen}
                            value={scheduledTimestamp !== null}
                        />
                        <Text
                            style={{
                                marginLeft: 10,
                                color: scheduledTimestamp !== null ? '#81b0ff' : colors.text,
                                fontWeight: scheduledTimestamp !== null ? 'bold' : 'normal'
                            }}
                        >
                            Schedule {scheduledTimestamp !== null ? scheduledTimestamp : ''}
                        </Text>
                        <DatePicker
                            modal
                            open={openDateModal}
                            date={new Date()}
                            minimumDate={new Date()}
                            is24hourSource="locale"
                            onConfirm={onConfirmScheduledTimestamp}
                            onCancel={onCancelScheduledTimestamp}
                        />
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 20,
                        alignItems: 'center',
                    }}
                >
                    <View
                        style={{
                            flex: 0.5,
                            marginRight: 5
                        }}
                    >
                        <TextInputMask
                            includeRawValueInChangeText={true}
                            onChangeText={onChangeTextRate}
                            options={{
                                precision: 2,
                                separator: '.',
                                delimiter: ',',
                                unit: ' ',
                                //prefixUnit: 'USD' + ' ',
                                suffixUnit: ' ' + 'USD/min'
                            }}
                            value={rate}
                            type={'money'}
                            placeholder={'Price'}
                            placeholderTextColor={colors.placeholderText}
                            style={{
                                fontSize: 14,
                                color: colors.text,
                                backgroundColor: colors.primaryBackground,
                                padding: 10,
                                borderRadius: 10,
                            }}
                        />
                        <Text
                            style={{
                                fontSize: 10,
                                alignSelf: 'center',
                                marginTop: 2,
                                color: colors.text
                            }}
                        >
                            Estimated rate
                        </Text>
                    </View>
                    <View
                        style={{
                            flex: 0.5,
                        }}
                    >
                        <TextInputMask
                            includeRawValueInChangeText={true}
                            onChangeText={onChangeTextEstimatedTime}
                            options={{
                                precision: 0,
                                separator: ' ',
                                delimiter: ',',
                                unit: ' ',
                                suffixUnit: ' min'
                            }}
                            value={String(estimatedTime)}
                            type={'money'}
                            style={{
                                flex: 0.5,
                                fontSize: 14,
                                color: colors.text,
                                backgroundColor: colors.primaryBackground,
                                padding: 10,
                                borderRadius: 10,
                            }}
                        />
                        <Text
                            style={{
                                fontSize: 10,
                                alignSelf: 'center',
                                marginTop: 2,
                                color: colors.text
                            }}
                        >
                            Time
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderColor: 'grey',
                        borderWidth: 1,
                        padding: 10,
                        borderRadius: 10
                    }}
                >
                    <Text
                        style={{
                            fontWeight: 'bold',
                            color: colors.text,
                            marginRight: 5
                        }}
                    >
                        Estimated {payer === 'you' ? 'Spends' : 'Earnings'}:
                    </Text>
                    <NumericFormat
                        value={rate * estimatedTime}
                        displayType={'text'}
                        thousandSeparator={true}
                        decimalScale={2}
                        renderText={(value) => (
                            <Text
                                style={{
                                    color: colors.text,
                                    fontWeight: 'bold',
                                }}>
                                {value + ' USD'}
                            </Text>
                        )}
                    />
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 20,
                        alignItems: 'center',
                    }}
                >
                    <TextInput
                        style={{
                            flex: 1,
                            fontSize: 14,
                            color: colors.text,
                            backgroundColor: colors.primaryBackground,
                            padding: 10,
                            borderRadius: 10,
                            height: 60
                        }}
                        multiline={true}
                        maxLength={120}
                        placeholder={'Message'}
                        placeholderTextColor={colors.placeholderText}
                        onChangeText={onChangeTextMessage}
                        value={message}
                    //keyboardType="text"
                    />
                </View>
                <TouchableOpacity
                    style={{
                        alignItems: "center",
                        backgroundColor: colors.getRandomMain(),
                        padding: 10,
                        marginTop: 20,
                        borderRadius: 10,
                        justifyContent: 'center',
                        flexDirection: 'row'
                    }}
                    onPress={onPressCreate}
                    disabled={isLoadingCreateMoneyCall}
                >
                    <Text
                        style={{
                            color: 'white'
                        }}
                    >
                        CREATE
                    </Text>
                    {isLoadingCreateMoneyCall && <ActivityIndicator size="small" color={'white'} style={{ marginLeft: 10}} />}
                </TouchableOpacity>
            </ScrollView>
        </View >
    );
}

export default React.memo(compose(withColors, withUserName, withConfig, withHmacInterceptor)(MoneyCallsCreateScreen));

