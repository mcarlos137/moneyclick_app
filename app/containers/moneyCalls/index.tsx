import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Dimensions,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { compose } from 'redux'
import { Rating } from "react-native-rating-element";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import { StackActions } from '@react-navigation/native';
//HOOKS
import { getMoneyCalls } from '../../main/hooks/getMoneyCalls';
import { changeStatusMoneyCall } from '../../main/hooks/changeStatusMoneyCall';
//FUNCTIONS
import { decorateTimestamp } from '../../main/functions';
//TOOLS
import httpRequest from '../../tools/httpRequest';
//COMPONENTS
import BodyList from '../../main/components/BodyList';
import ActionSheetConfirmation from '../../main/components/ActionSheetConfirmation';
import Body_Input from '../../main/components/Body_Input';
import BodyStack from '../../main/components/BodyStack';
//HOC
import { withColors, withHmacInterceptor, withUserName } from '../../main/hoc';

const INSTRUCTIONS = [
    { text: 'Paid Calls innovate the way of communicating between users.', iconName: '' },
    { text: 'You can create audio/video paid calls (“+” button above) and set the rate you want the counterparty to pay or accept calls from other users paid by you or by the other user.', iconName: '' },
    { text: 'Invite your contacts or you can request paid calls to the most popular users of the network.', iconName: '' },
    { text: 'Become one of the most popular on the web and expand your digital business.', iconName: '' },
]

const MoneyCallsScreen = ({ navigation, route, colors, userName, hmacInterceptor }) => {

    //INITIAL STATES
    const actionSheetConfirmationAcceptRef = useRef<any>()
    const actionSheetConfirmationCancelRef = useRef<any>()
    const [id, setId] = useState('')
    const [acceptMessage, setAcceptMessage] = useState('')
    const [cancelMessage, setCancelMessage] = useState('')

    //HOOKS CALLS
    const {
        isLoading: isLoadingMoneyCallsReceived,
        data: dataMoneyCallsReceived,
        error: errorMoneyCallsReceived,
        isRefetching: isRefetchingMoneyCallsReceived,
        refetch: refetchMoneyCallsReceived,
    } =
        getMoneyCalls(
            [userName],
            null,
            null
        )

    const {
        isLoading: isLoadingMoneyCallsSended,
        data: dataMoneyCallsSended,
        error: errorMoneyCallsSended,
        isRefetching: isRefetchingMoneyCallsSended,
        refetch: refetchMoneyCallsSended,
    } =
        getMoneyCalls(
            null,
            [userName],
            null
        )

    const { mutate: mutateChangeStatusMoneyCall } = changeStatusMoneyCall()

    //EFFECTS
    useEffect(() => {
        console.log('MoneyCallsScreen', route.params)
    }, []);

    //MEMOS
    const dataMoneyCalls = useMemo(() =>
        [...dataMoneyCallsReceived, ...dataMoneyCallsSended]
            .sort((a, b) => {
                if (a.createTimestamp > b.createTimestamp) {
                    return -1;
                }
                if (a.createTimestamp < b.createTimestamp) {
                    return 1;
                }
                return 0
            }),
        [dataMoneyCallsReceived, dataMoneyCallsSended])

    //CALLBACKS
    const onPressMoneyCallAccept = useCallback(() => {
        mutateChangeStatusMoneyCall({
            id: id,
            userName: userName,
            status: 'ACCEPTED',
            message: acceptMessage
        })
        actionSheetConfirmationAcceptRef.current?.setModalVisible(false)
    }, [id, acceptMessage])

    const onPressMoneyCallCancel = useCallback(() => {
        mutateChangeStatusMoneyCall({
            id: id,
            userName: userName,
            status: 'CANCELED',
            message: cancelMessage
        })
        actionSheetConfirmationCancelRef.current?.setModalVisible(false)
    }, [id, cancelMessage])

    const onChangeTextAcceptMessage = useCallback(text => {
        setAcceptMessage(text)
    }, [])

    const onChangeTextCancelMessage = useCallback(text => {
        setCancelMessage(text)
    }, [])

    //FUNCTIONS
    const getSelectedMoneyCallMessages = (item) => {
        let selectedMoneyCallMessages: any[] = []
        if (item.createMessage !== undefined && item.createMessage !== null) {
            selectedMoneyCallMessages.push(['CREATE', item.createTimestamp, item.createMessage, item.createUserName, item.createUserName === item.senderUserName ? item.senderName : item.receiverName])
        }
        if (item.acceptTimestamp !== undefined && item.acceptMessage !== null) {
            selectedMoneyCallMessages.push(['ACCEPT', item.acceptTimestamp, item.acceptMessage, item.acceptUserName, item.acceptUserName === item.senderUserName ? item.senderName : item.receiverName])
        }
        if (item.cancelTimestamp !== undefined && item.cancelMessage !== null) {
            selectedMoneyCallMessages.push(['CANCEL', item.cancelTimestamp, item.cancelMessage, item.cancelUserName, item.cancelUserName === item.senderUserName ? item.senderName : item.receiverName])
        }
        if (item.rating !== undefined) {
            selectedMoneyCallMessages.push(['PAY', item.rating])
        }
        return selectedMoneyCallMessages
    }

    //COMPONENTS
    const renderItem = (item) => {
        return (
            <View
                key={item.index}
                style={{
                    flexDirection: item.item.senderUserName === userName ? 'row-reverse' : 'row',
                    marginBottom: 10,
                }}
            >
                <View
                    style={{
                        alignSelf: 'center',
                        backgroundColor: colors.primaryBackground,
                        padding: 10,
                        borderRadius: 10,
                        width: Dimensions.get('window').width * 0.95,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <MaterialCommunityIcons
                            style={{
                                flex: 0.12
                            }}
                            name={item.item.type === 'audio' ? 'phone-outgoing' : 'camera-front-variant'}
                            color={item.item.senderUserName === userName ? 'red' : 'green'}
                            size={30}
                        />
                        <View
                            style={{
                                flex: 0.38
                            }}
                        >
                            <Text
                                style={{
                                    color: colors.text,
                                }}
                            >
                                {item.item.senderUserName === userName ? item.item.receiverName : item.item.senderName}
                            </Text>
                            <Text
                                style={{
                                    color: colors.text,
                                    marginTop: 5
                                }}
                            >
                                {item.item.rate} USD/min
                            </Text>
                            {item.item.estimatedTime !== undefined &&
                                <Text
                                    style={{
                                        color: colors.text,
                                        marginTop: 5,
                                        fontSize: 11,
                                    }}
                                >
                                    {item.item.estimatedTime} minutes
                                </Text>}
                            {item.item.scheduledTimestamp !== undefined &&
                                <Text
                                    style={{
                                        color: colors.text,
                                        fontSize: 11,
                                        marginTop: 5,
                                    }}
                                >
                                    {decorateTimestamp(item.item.scheduledTimestamp)}
                                </Text>}
                            <Status
                                item={item.item}
                            />
                            <View
                                style={{
                                    width: 100,
                                    marginTop: 5,
                                    flexDirection: 'row',
                                    alignContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                {item?.item?.rating?.stars !== undefined &&
                                    <View
                                        style={{
                                            marginRight: 10
                                        }}
                                    >
                                        <Rating
                                            rated={item?.item?.rating?.stars}
                                            totalCount={5}
                                            ratingColor="#F1C40F"
                                            ratingBackgroundColor="#d4d4d4"
                                            size={15}
                                            readonly // by default is false
                                            icon="ios-star"
                                            direction="row" // anyOf["row" (default), "row-reverse", "column", "column-reverse"]
                                        />
                                    </View>
                                }
                                {getSelectedMoneyCallMessages(item.item).length > 0 &&
                                    <TouchableOpacity
                                        onPress={() => {
                                            navigation.dispatch(StackActions.push('MoneyCallsMessagesScreen', { ...route.params, selectedMoneyCallMessages: getSelectedMoneyCallMessages(item.item) }))
                                        }}
                                    >
                                        <MaterialCommunityIcons
                                            name={'comment-account'}
                                            color={colors.getRandomMain()}
                                            size={30}
                                        />
                                    </TouchableOpacity>
                                }
                            </View>
                        </View>
                        <View
                            style={{
                                flex: 0.5,
                                alignItems: 'center',
                            }}
                        >
                            <FastImage
                                style={{
                                    flex: 1,
                                    padding: 10,
                                    width: '100%',
                                    height: '100%'
                                }}
                                source={{
                                    uri: 'https://service8081.moneyclick.com/attachment/getUserFile/' + (item.item.senderUserName === userName ? item.item.receiverUserName : item.item.senderUserName),
                                    //cache: FastImage.cacheControl.cacheOnly,
                                    //method: 'GET',
                                    headers: hmacInterceptor?.process(
                                        httpRequest.create(
                                            'https://service8081.moneyclick.com',
                                            '/attachment/getUserFile/' + (item.item.senderUserName === userName ? item.item.receiverUserName : item.item.senderUserName),
                                            'GET',
                                            null,
                                            false
                                        )).headers,
                                }}
                            />
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    const Status = ({ item }) => {
        return (
            <View
                style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: 10
                }}
            >
                {item.status === 'CREATED' &&
                    <>
                        <Text
                            style={{
                                color: colors.text,
                                marginRight: 7,
                                fontWeight: 'bold'
                            }}
                        >
                            {userName === item.createUserName ? 'Pending for receiver to accept' : 'Requested by other user'}
                        </Text>
                        <TouchableOpacity
                            style={{
                                backgroundColor: colors.getRandomMain(),
                                padding: 5,
                                borderRadius: 5
                            }}
                            onPress={() => {
                                setId(item.id)
                                if (userName === item.createUserName) {
                                    setCancelMessage('')
                                    actionSheetConfirmationCancelRef.current?.setModalVisible(true);
                                } else {
                                    setAcceptMessage('')
                                    actionSheetConfirmationAcceptRef.current?.setModalVisible(true);
                                }
                            }}
                        >
                            <Text
                                style={{
                                    color: 'white',
                                    fontSize: 11,
                                }}
                            >
                                {userName === item.createUserName ? 'CANCEL' : 'ACCEPT'}
                            </Text>
                        </TouchableOpacity>
                        {userName !== item.createUserName &&
                            <TouchableOpacity
                                style={{
                                    backgroundColor: colors.getRandomMain(),
                                    padding: 5,
                                    marginLeft: 5,
                                    borderRadius: 5
                                }}
                                onPress={() => {
                                    setId(item.id)
                                    setCancelMessage('')
                                    actionSheetConfirmationCancelRef.current?.setModalVisible(true);
                                }}
                            >
                                <Text
                                    style={{
                                        color: 'white',
                                        fontSize: 11,
                                    }}
                                >
                                    {'CANCEL'}
                                </Text>
                            </TouchableOpacity>
                        }
                    </>}
                {item.status === 'ACCEPTED' &&
                    <>
                        <Text
                            style={{
                                color: colors.text,
                                marginRight: 7,
                                fontWeight: 'bold'
                            }}
                        >
                            {'Accepted by both'}
                        </Text>
                        <TouchableOpacity
                            style={{
                                backgroundColor: colors.getRandomMain(),
                                padding: 5,
                                borderRadius: 5
                            }}
                            onPress={() => {
                                setId(item.id)
                                /*
                                navigateStore.dispatch({
                                    type: NAVIGATE,
                                    payload: {
                                        target: 'CameraStreamScreen',
                                        selectedCameraStreamParams: {
                                            audioStatus: 'on',
                                            videoStatus: moneyCall.type === 'video' ? 'on' : 'off',
                                            callId: null,
                                            targetUserName: moneyCall.senderUserName !== authPersistedStore.getState().userNameState ? moneyCall.senderUserName : moneyCall.receiverUserName,
                                            targetName: moneyCall.senderUserName !== authPersistedStore.getState().userNameState ? moneyCall.senderName : moneyCall.receiverName
                                        }
                                    }
                                })*/
                            }}
                        >
                            <Text
                                style={{
                                    color: 'white',
                                    fontSize: 11,
                                }}
                            >
                                {'CALL'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                backgroundColor: colors.getRandomMain(),
                                padding: 5,
                                marginLeft: 5,
                                borderRadius: 5
                            }}
                            onPress={() => {
                                setId(item.id)
                                setCancelMessage('')
                                actionSheetConfirmationCancelRef.current?.setModalVisible(true);
                            }}
                        >
                            <Text
                                style={{
                                    color: 'white',
                                    fontSize: 11,
                                }}
                            >
                                {'CANCEL'}
                            </Text>
                        </TouchableOpacity>
                    </>}
                {item.status === 'CANCELED' &&
                    <>
                        <Text
                            style={{
                                color: colors.text,
                                fontWeight: 'bold'
                            }}
                        >
                            {'Canceled by you'}
                        </Text>
                    </>}
                {item.status === 'REJECTED' &&
                    <>
                        <Text
                            style={{
                                color: colors.text,
                                fontWeight: 'bold'
                            }}
                        >
                            {'Rejected by receiver'}
                        </Text>
                    </>}
                {item.status === 'TIMEOUT' &&
                    <>
                        <Text
                            style={{
                                color: colors.text,
                                fontWeight: 'bold'
                            }}
                        >
                            {'Timeout'}
                        </Text>
                    </>}
                {item.status === 'PAYED' &&
                    <>
                        <Text
                            style={{
                                color: colors.text,
                                fontWeight: 'bold'
                            }}
                        >
                            {'Finished and Paid'}
                        </Text>
                    </>}
            </View>
        )
    }

    //PRINCIPAL RENDER
    return (
        <BodyStack name={'MoneyCalls'} navigation={navigation} route={route}>
            <BodyList
                data={dataMoneyCalls}
                keyExtractor={item => String(item.id)}
                renderItem={renderItem}
                refreshing={isLoadingMoneyCallsReceived || isRefetchingMoneyCallsReceived || isLoadingMoneyCallsSended || isRefetchingMoneyCallsSended}
                onRefresh={() => {
                    refetchMoneyCallsReceived()
                    refetchMoneyCallsSended()
                }}
                instructions={INSTRUCTIONS}
            />
            <ActionSheetConfirmation
                reference={actionSheetConfirmationAcceptRef}
                height={150}
                confirmationMessage={'Do you want to ACCEPT this Money Call?'}
                onPress={onPressMoneyCallAccept}
                additionalInput={
                    <Body_Input
                        value={acceptMessage}
                        type={'text'}
                        placeholder={'Message'}
                        onChangeText={onChangeTextAcceptMessage}
                    />
                }
            />
            <ActionSheetConfirmation
                reference={actionSheetConfirmationCancelRef}
                height={150}
                confirmationMessage={'Do you want to CANCEL this Money Call?'}
                onPress={onPressMoneyCallCancel}
                additionalInput={
                    <Body_Input
                        value={cancelMessage}
                        type={'text'}
                        placeholder={'Cancel reason'}
                        onChangeText={onChangeTextCancelMessage}
                    />
                }
            />
        </BodyStack>
    );
}

export default React.memo(compose(withColors, withUserName, withHmacInterceptor)(MoneyCallsScreen));

