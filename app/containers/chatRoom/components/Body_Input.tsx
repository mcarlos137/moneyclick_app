//PRINCIPAL
import React, { createRef, RefObject, useCallback, useEffect, useState } from 'react';
import {
    View,
    TouchableOpacity,
    Keyboard,
    TextInput,
    StyleSheet,
    Text,
    Platform,
    Alert,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Dimensions,
    NativeModules
} from 'react-native';
import { compose } from 'redux';
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'
import { connect } from 'react-redux';
//import AudioRecorderPlayer from 'react-native-audio-recorder-player';
//STORES
import { store as chatStore } from '../../../main/stores/chat';
//HOC
import { withColors, withNavigation, withRoute, withUserName } from '../../../main/hoc';
//FUNCTIONS
import { checkPermissions, handleChooseDocument } from '../../../main/functions';

const mapStateToProps = state => {
    return {
        mediaAsset: state.mediaAsset,
    };
};

const ConnectedComponent = ({
    mediaAsset,
    navigation,
    route,
    colors,
    userName
}) => {

    //INITIAL STATES
    const [text, setText] = useState('')
    const [addEmoji, setAddEmoji] = useState(false)
    const [inputRef, setInputRef] = useState<RefObject<any>>(createRef())
    const [audioRecord, setAudioRecord] = useState({})

    //AUDIO RECORDER
    /*const audioRecorderPlayer = new AudioRecorderPlayer();
    const dirs = RNFetchBlob.fs.dirs;
    const path = (time) => Platform.select({
        ios: time + '_sound.m4a',
        android: `${dirs.CacheDir}/` + time + '_sound.mp3',
    });*/

    //FUNCTIONS
    const onStartRecord = async () => {
        /*const result = await audioRecorderPlayer.startRecorder(path(new Date().toISOString()));
        audioRecorderPlayer.addRecordBackListener((e) => {
            setAudioRecord({
                recordSecs: e.currentPosition,
                recordTime: audioRecorderPlayer.mmssss(
                    Math.floor(e.currentPosition),
                ),
            });
            return;
        });
        chatStore.dispatch({ type: 'SET_AUDIO_ASSET', payload: { uri: result } })
        console.log('onStartRecord', { uri: result });*/
    };

    const onStopRecord = async () => {
        /*const result = await audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();
        setAudioRecord({
            recordSecs: 0,
        });
        console.log('onStopRecord', result);*/
    };

    //CALLBACKS
    const onPressSend = useCallback(async () => {
        const timestamp = new Date().toISOString()
        const data = {
            chatRoom: route.params.selectedChatRoom.chatRoom,
            fullName: route.params.selectedChatRoom.fullName,
            //publicKey: chatPersistedStore.getState().selectedChatRoomState.publicKey,
            message: {
                timestamp: timestamp,
                senderUserName: userName,
                receiverUserName: route.params.selectedChatRoom.chatRoom,
                text: text,
                sended: false,
                readed: false,
                delivered: false,
            },
        }
        if (mediaAsset !== null) {
            data.message['mediaAsset'] = mediaAsset
            /*storage()
                .ref('/chat/' + route.params.selectedChatRoom.chatRoom + '/assets/' + timestamp)
                .putFile(mediaAsset.uri)
                .then(response => console.log('response', response))*/
        }
        chatStore.dispatch({ type: 'ADD_DATA', payload: data })
        setText('')
        setAddEmoji(false)
        chatStore.dispatch({ type: 'SET_MEDIA_ASSET', payload: null })
        chatStore.dispatch({ type: 'SET_REPLY_ID', payload: null })
        const chatsReceiverDoc = Firestore().collection('chats').doc(route.params.selectedChatRoom.chatRoom)
        chatsReceiverDoc.get().then(async (doc) => {
            let chatsReceiver = {
                lastTime: timestamp,
            }
            if (doc.data() === undefined) {
                await chatsReceiverDoc.set(chatsReceiver)
            } else {
                await chatsReceiverDoc.update(chatsReceiver)
            }
        })
        const newMessage = {
            senderUserName: userName,
            receiverUserName: route.params.selectedChatRoom.chatRoom,
            message: text,
            timestamp: timestamp,
            //delivered: String(false),
            //readed: String(false)
        }
        if (mediaAsset !== null) {
            newMessage['mediaAsset'] = { type: mediaAsset.type }
        }
        await chatsReceiverDoc
            .collection('new')
            .doc(timestamp)
            .set(newMessage)
            .then(result => {
                chatStore.dispatch(
                    {
                        type: 'CHANGE_MESSAGE_STATUS',
                        payload: {
                            chatRoom: route.params.selectedChatRoom.chatRoom,
                            timestamp: timestamp,
                            status: 'sended'
                        }
                    })
            })

    }, [text, mediaAsset])

    const onPressPaperClip = useCallback(() => {
        handleChooseDocument(
            'LIBRARY_PHOTO_VIDEO',
            {
                maxWidth: 300,
                maxHeight: 550,
                quality: 1,
                mediaType: "mixed",
                videoQuality: "low",
                durationLimit: 60
            },
            (asset) => {
                chatStore.dispatch({ type: 'SET_MEDIA_ASSET', payload: asset })
            }
        )
    }, [])

    const onPressCamera = useCallback(() => {
        //navigation.dispatch(StackActions.push('CameraBridgeScreen', { ...route.params }))
        //cameraStore.dispatch({ type: SET_CAMERA_SOURCE, payload: 'ChatRoomScreen' });
        //navigateStore.dispatch({ type: NAVIGATE, payload: { target: 'CameraScreen', redirectToTarget: 'ChatRoomScreen' } });
    }, [])

    //PRINCIPAL RENDER
    return (
        <>
            <KeyboardAvoidingView
                behavior={"padding"}
                style={{
                    paddingTop: 10,
                    paddingLeft: Dimensions.get('window').width * 0.01,
                    paddingRight: Dimensions.get('window').width * 0.01,
                    width: Dimensions.get('window').width,
                    alignSelf: 'center',
                    flex: 0.12,
                    backgroundColor: colors.background
                }}
                enabled={true}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : -180}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <>
                        <View
                            style={{
                                flexDirection: 'row',
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    backgroundColor: colors.primaryBackground,
                                    borderRadius: 40,
                                    alignItems: 'center',
                                    flex: 0.9
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        setAddEmoji(val => !val)
                                        if (addEmoji) {
                                            Keyboard.dismiss();
                                        } else {
                                            inputRef.current.focus();
                                        }
                                    }}
                                >
                                    <MaterialCommunityIcons
                                        name={addEmoji ? 'keyboard' : 'emoticon-happy-outline'}
                                        color={colors.icon}
                                        size={30}
                                    />
                                </TouchableOpacity>
                                <TextInput
                                    style={{
                                        fontSize: 16,
                                        paddingLeft: 7,
                                        paddingTop: 7,
                                        paddingBottom: 7,
                                        color: colors.text,
                                        flex: 1
                                    }}
                                    ref={inputRef}
                                    value={text}
                                    placeholder={'Write a message'}
                                    placeholderTextColor={colors.placeholderText}
                                    onChangeText={text => {
                                        setText(text)
                                    }}
                                    onFocus={() => {
                                        console.log("onFocus");
                                        setAddEmoji(false)
                                    }}
                                //multiline={true}
                                />
                                {mediaAsset === null && (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={onPressPaperClip}
                                            style={{
                                                paddingRight: 10,
                                            }}
                                        >
                                            <MaterialCommunityIcons
                                                name={'paperclip'}
                                                color={colors.icon}
                                                size={26}
                                            />
                                        </TouchableOpacity>
                                        {text === '' &&
                                            <TouchableOpacity
                                                onPress={onPressCamera}
                                                style={{
                                                    paddingRight: 10,
                                                }}
                                            >
                                                <MaterialCommunityIcons
                                                    name={'camera'}
                                                    color={colors.icon}
                                                    size={26}
                                                />
                                            </TouchableOpacity>}
                                    </View>)}
                            </View>
                            <View
                                style={{
                                    flex: 0.1,
                                    justifyContent: 'center'
                                }}
                            >
                                {text === '' && mediaAsset === null
                                    ?
                                    <TouchableOpacity
                                        onPress={() => {
                                            checkPermissions('RECORD_AUDIO');
                                        }}
                                        onLongPress={async () => {
                                            let result = await checkPermissions('RECORD_AUDIO');
                                            if (result) {
                                                onStartRecord()
                                            } else {
                                                console.log('Not permission : RECORD_AUDIO');
                                            }
                                        }}
                                        onPressOut={() => {
                                            onStopRecord()
                                        }}
                                        style={{
                                            backgroundColor: '#009387',
                                            padding: 4,
                                            borderRadius: 21,
                                            marginRight: 2,
                                            alignSelf: 'center'
                                        }}
                                    >
                                        <MaterialIcons
                                            name={'keyboard-voice'}
                                            color={'white'}
                                            size={26}
                                        />
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        onPress={onPressSend}
                                        style={{
                                            backgroundColor: '#009387',
                                            padding: 4,
                                            borderRadius: 26,
                                            marginRight: 2,
                                            alignSelf: 'center'
                                        }}
                                    >
                                        <MaterialIcons
                                            name={'send'}
                                            color={'white'}
                                            size={26}
                                        />
                                    </TouchableOpacity>
                                }
                            </View>
                        </View>
                    </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            {addEmoji &&
                <EmojiSelector
                    category={Categories.symbols}
                    theme={colors.primaryBackground}
                    onEmojiSelected={emoji => {
                        setText(text => text + ' ' + emoji)
                    }}
                />}
        </>
    )
};

export default React.memo(compose(withNavigation, withRoute, withColors, withUserName, connect(mapStateToProps))(ConnectedComponent));
