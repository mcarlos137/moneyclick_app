//PRINCIPAL
import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Dimensions,
    Image,
    StyleSheet,
    Pressable,
    Alert,
    Animated
} from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import storage from '@react-native-firebase/storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from "react-redux";
import Moment from 'moment';
//import Firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackActions } from '@react-navigation/native';
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image';
import { Avatar } from '@rneui/themed';
//import { SliderSound } from './SliderSound';
import { compose } from 'redux';
//STORES
import { store as chatStore } from '../../../main/stores/chat';
import { store as mediaStore, persistor as mediaPersistor } from '../../../main/stores/media';
//HOC
import { withColors, withHmacInterceptor, withNavigation, withRoute, withUserName } from '../../../main/hoc';
//TOOLS
import httpRequest from '../../../tools/httpRequest';
//COMPONENTS
import Body_ImageVideo from '../../../main/components/Body_ImageVideo';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(
    TouchableOpacity
);

const mapStateToProps = state => {
    return {
        data: state.data,
        replyId: state.replyId
    };
};

const ConnectedComponent = ({
    data,
    replyId,
    navigation,
    route,
    colors,
    userName,
    hmacInterceptor
}) => {

    //INITIAL STATES
    const [selectedMessages, setSelectedMessages] = useState<string[]>([])
    const headerRightMarginRight = useRef(new Animated.Value(15)).current;

    //EFFECTS
    useEffect(() => {
        console.log('ChatRoomScreen', route.params)
        if (selectedMessages.length > 0) {
            Animated.timing(headerRightMarginRight, {
                toValue: 25,
                duration: 300,
                useNativeDriver: false,
            }).start()
        } else {
            Animated.timing(headerRightMarginRight, {
                toValue: 15,
                duration: 300,
                useNativeDriver: false,
            }).start()
        }
        navigation.setOptions({
            headerLeft: () => (
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            navigation.dispatch(StackActions.pop())
                        }}
                    >
                        <Ionicons
                            name={'ios-chevron-back-outline'}
                            color={'white'}
                            size={35}
                        />
                    </TouchableOpacity>
                    {selectedMessages.length === 0 ?
                        <>
                            <Avatar
                                size={35}
                                rounded
                                source={{
                                    uri: 'https://service8081.moneyclick.com/attachment/getUserFile/' + route.params.selectedChatRoom.chatRoom,
                                    method: 'GET',
                                    headers: hmacInterceptor?.process(
                                        httpRequest.create(
                                            'https://service8081.moneyclick.com',
                                            '/attachment/getUserFile/' + route.params.selectedChatRoom.chatRoom,
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
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    marginLeft: 5
                                }}
                            >
                                {route.params.selectedChatRoom.fullName}
                            </Text>
                        </> :
                        <Text
                            style={{
                                fontSize: 20,
                                color: 'white',
                                marginRight: 15,
                                fontWeight: 'bold'
                            }}
                        >
                            {selectedMessages.length}
                        </Text>
                    }
                </View>
            ),
            headerRight: () => (
                <View
                    style={{
                        flexDirection: "row",
                        marginRight: 10,
                        alignItems: 'center'
                    }}
                >
                    {selectedMessages.length === 1 &&
                        <AnimatedTouchableOpacity
                            onPress={() => {
                                chatStore.dispatch({ type: 'SET_REPLY_ID', payload: selectedMessages[0] })
                            }}
                            style={{
                                marginRight: headerRightMarginRight
                            }}
                        >
                            <MaterialCommunityIcons
                                name={'reply'}
                                color={'white'}
                                size={26}
                            />
                        </AnimatedTouchableOpacity>
                    }
                    {selectedMessages.length > 0 &&
                        <AnimatedTouchableOpacity
                            onPress={() => {
                                Alert.alert(
                                    'Delete chat messages',
                                    'Are you sure to delete selected chat messages?',
                                    [
                                        { text: "Cancel", style: 'cancel', onPress: () => { } },
                                        {
                                            text: 'Delete',
                                            style: 'destructive',
                                            // If the user confirmed, then we dispatch the action we blocked earlier
                                            // This will continue the action that had triggered the removal of the screen
                                            onPress: () => {
                                                chatStore.dispatch(
                                                    {
                                                        type: 'DELETE_CHATROOM_MESSAGES',
                                                        payload: {
                                                            chatRoom: route.params.selectedChatRoom.chatRoom,
                                                            timestamps: selectedMessages
                                                        }
                                                    })
                                                setSelectedMessages([])
                                            },
                                        },
                                    ]
                                );
                            }}
                            style={{
                                marginRight: headerRightMarginRight
                            }}
                        >
                            <Ionicons
                                name="ios-trash"
                                size={26}
                                color={'white'}
                            />
                        </AnimatedTouchableOpacity>
                    }
                    <AnimatedTouchableOpacity
                        onPress={() => {
                            const selectedCameraStreamParams = {
                                audioStatus: "on",
                                videoStatus: "on",
                                showCounter: false,
                                callId: null,
                            }
                            navigation.dispatch(StackActions.push('CameraStreamScreen', { ...route.params, selectedCameraStreamParams: selectedCameraStreamParams, replaceTarget: 'ChatRoomScreen' }))
                        }}
                        style={{
                            marginRight: headerRightMarginRight
                        }}
                    >
                        <Ionicons
                            name="ios-videocam"
                            size={26}
                            color={'white'}
                        />
                    </AnimatedTouchableOpacity>
                    <AnimatedTouchableOpacity
                        onPress={() => {
                            const selectedCameraStreamParams = {
                                audioStatus: "on",
                                videoStatus: "off",
                                showCounter: false,
                                callId: null,
                            }
                            navigation.dispatch(StackActions.push('CameraStreamScreen', { ...route.params, selectedCameraStreamParams: selectedCameraStreamParams, replaceTarget: 'ChatRoomScreen' }))
                        }}
                        style={{
                            marginRight: headerRightMarginRight
                        }}
                    >
                        <Ionicons
                            name="ios-call"
                            size={26}
                            color={'white'}
                        />
                    </AnimatedTouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            if (chatStore.getState().openModal === 'options') {
                                chatStore.dispatch({
                                    type: 'SET_OPEN_MODAL',
                                    payload: '',
                                });
                            } else {
                                chatStore.dispatch({
                                    type: 'SET_OPEN_MODAL',
                                    payload: 'options',
                                });
                            }
                        }}
                    >
                        <Ionicons
                            name="ios-ellipsis-vertical"
                            size={26}
                            color={'white'}
                        />
                    </TouchableOpacity>
                </View >
            ),
            title: ''
        })
    }, [selectedMessages])

    useEffect(() =>
        navigation.addListener('beforeRemove', (e) => {
            if (selectedMessages.length === 0) {
                return;
            }
            e.preventDefault();
            setSelectedMessages([])
        }),
        [navigation, selectedMessages]
    );

    useEffect(() => {
        setSelectedMessages([])
    }, [replyId])

    //MEMOS
    const dataChatRoom = useMemo(() => {
        return data?.find(chatRoom => chatRoom.chatRoom === route?.params?.selectedChatRoom?.chatRoom)?.messages
    }, [data])

    //COMPONENTS
    const renderItem = (item) => (
        <View
            key={item.item.index}
            style={{
                flexDirection: item.item.senderUserName === userName ? 'row-reverse' : 'row',
                padding: 3
            }}
        >
            <Pressable
                onLongPress={() => {
                    if (selectedMessages.includes(item.item.timestamp)) {
                        setSelectedMessages(mtd => mtd.filter(it => it !== item.item.timestamp))
                    } else {
                        setSelectedMessages([...selectedMessages, item.item.timestamp])
                    }
                }}
                style={{
                    flexDirection: 'column'
                }}
            >
                <View
                    style={
                        item.item.senderUserName === userName ?
                            [{ backgroundColor: colors.secundaryBackground, padding: 5, borderRadius: 5, marginRight: 10, borderWidth: 2, borderColor: colors.secundaryBackground }, selectedMessages.includes(item.item.timestamp) && { borderColor: '#009387' }]
                            :
                            [{ backgroundColor: colors.primaryBackground, padding: 5, borderRadius: 5, marginLeft: 10, borderWidth: 2, borderColor: colors.primaryBackground }, selectedMessages.includes(item.item.timestamp) && { borderColor: '#009387' }]
                    }
                >
                    {item?.item?.mediaAsset !== undefined &&
                        <Provider store={mediaStore} >
                            <PersistGate loading={null} persistor={mediaPersistor}>
                                {item.item.senderUserName === userName ?
                                    <Body_ImageVideo
                                        source={'internal'}
                                        uri={item?.item?.mediaAsset?.uri}
                                        width={item?.item?.mediaAsset.type.includes('image') ? 180 : 250}
                                        aspectRatioType={'square'}
                                        fileName={route.params.selectedChatRoom.chatRoom + '_' + item.item.timestamp}
                                        inType={item?.item?.mediaAsset.type.includes('image') ? 'image' : 'video'}
                                        outType={item?.item?.mediaAsset.type.includes('image') ? 'image' : 'video'}
                                        videoProps={item?.item?.mediaAsset.type.includes('image') ? undefined : {
                                            paused: true,
                                            controls: true
                                        }}
                                        firebaseUploadRef={'/chat/' + route.params.selectedChatRoom.chatRoom + '/assets/' + item.item.timestamp}
                                    />
                                    :
                                    <Body_ImageVideo
                                        source={'firebase'}
                                        uri={'/chat/' + userName + '/assets/' + '11.png'}
                                        width={item?.item?.mediaAsset.type.includes('image') ? 180 : 250}
                                        aspectRatioType={'square'}
                                        fileName={route.params.selectedChatRoom.chatRoom + '_' + item.item.timestamp}
                                        inType={item?.item?.mediaAsset.type.includes('image') ? 'image' : 'video'}
                                        outType={item?.item?.mediaAsset.type.includes('image') ? 'image' : 'video'}
                                        videoProps={item?.item?.mediaAsset.type.includes('image') ? undefined : {
                                            paused: true,
                                            controls: true
                                        }}
                                    />
                                }

                            </PersistGate>
                        </Provider>
                    }
                    {item.item.text.trim() !== '' &&
                        <Text
                            style={[styles.txtMessage, { color: colors.text }]}
                        >
                            {item.item.text.trim()}
                        </Text>}
                    <View style={styles.viewDateAndStatusMessage}>
                        <Text
                            style={[styles.txtDateOwn, { color: colors.text }]}
                        >
                            {Moment(new Date(item.item.timestamp)).format(
                                'MMM. DD YYYY hh:mm a'
                            )}
                        </Text>
                        {item.item.senderUserName === userName && (item.item.sended || item.item.delivered)
                            ?
                            <>
                                <MaterialCommunityIcons
                                    name={'check'}
                                    color={item.item.readed ? '#1f65ff' : 'silver'}
                                    size={16}
                                />
                                {item.item.delivered &&
                                    <MaterialCommunityIcons
                                        style={{
                                            marginLeft: -9
                                        }}
                                        name={'check'}
                                        color={item.item.readed ? '#1f65ff' : 'silver'}
                                        size={16}
                                    />}
                            </>
                            :
                            item.item.senderUserName === userName &&
                            <MaterialCommunityIcons
                                name={'clock-time-three-outline'}
                                color={'silver'}
                                size={16}
                            />}
                    </View>
                </View>
            </Pressable>
        </View>
    )

    //PRINCIPAL RENDER
    return (
        <>
            <FlatList
                style={{
                    backgroundColor: colors.background,
                    flex: 3
                }}
                data={dataChatRoom}
                renderItem={renderItem}
                keyExtractor={item => String(item.timestamp)}
                removeClippedSubviews={true}
                maxToRenderPerBatch={20}
                windowSize={21}
                initialNumToRender={50}
                inverted={true}
            />
        </>
    )
};

export default React.memo(compose(withNavigation, withRoute, withColors, withUserName, withHmacInterceptor, connect(mapStateToProps))(ConnectedComponent));

const styles = StyleSheet.create({
    cardOwn: {
        borderRadius: 5,
        minHeight: 40,
        flexDirection: 'column-reverse',
        backgroundColor: '#009387',
        marginRight: 20,
        padding: 5
    },
    cardThird: {
        borderRadius: 5,
        minHeight: 40,
        backgroundColor: '#e0e1f0',
        flexDirection: 'column',
        marginLeft: 20,
    },
    viewDateAndStatusMessage: {
        paddingTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    txtDateOwn: {
        fontSize: 9,
        textAlign: 'right',
        marginRight: 5,
    },
    txtDateThirds: {
        paddingTop: 5,
        fontSize: 9,
        textAlign: 'right'
    },
    image: {
        width: 250,
        height: 190
    },
    imageReply: {
        width: 50,
        height: 40
    },
    video: {
        height: 200,
        width: 250
    },
    videoReply: {
        height: 50,
        width: 60
    },
    txtMessage: {
        marginRight: 10,
        fontSize: 16,
        textAlign: 'justify',
        maxWidth: Dimensions.get('window').width * 0.7,
    }
});
