//PRINCIPAL
import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { StackActions } from '@react-navigation/native';
import Firestore from '@react-native-firebase/firestore';
import { Avatar, Badge } from '@rneui/themed';
import { connect } from "react-redux";
import { compose } from "redux";
import Moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
//STORES
import { store as chatStore } from '../../../main/stores/chat';
//TOOLS
import httpRequest from '../../../tools/httpRequest';
//HOC
import { withColors, withHmacInterceptor, withNavigation, withRoute, withUserName } from '../../../main/hoc';

const mapStateToProps = state => {
    return {
        data: state.data,
    };
};

const ConnectedComponent = ({
    data,
    navigation,
    route,
    colors,
    userName,
    hmacInterceptor
}) => {

    //INITIAL STATES
    const [chatRoomsToDelete, setChatRoomsToDelete] = useState<string[]>([])

    //EFFECTS
    useEffect(() =>
        navigation.addListener('beforeRemove', (e) => {
            if (chatRoomsToDelete.length === 0) {
                return;
            }
            e.preventDefault();
            setChatRoomsToDelete([])
        }),
        [navigation, chatRoomsToDelete]
    );

    useEffect(() => {
        Firestore()
            .collection('chats')
            .doc(userName)
            .collection('new')
            .doc('0').set({})
        const unsubscribe = Firestore()
            .collection('chats')
            .doc(userName)
            .collection('new')
            .onSnapshot(
                (querySnapshot) => {
                    querySnapshot.forEach(documentSnapshot => {
                        if (String(documentSnapshot.id) === '0') {
                            return
                        }
                        console.log('new message: ', documentSnapshot.id, documentSnapshot.data());
                        let itemData = { ...documentSnapshot.data() }
                        /*if (!(navigateStore.getState().currentScreenState === 'ChatScreen' ||
                            navigateStore.getState().currentScreenState === 'ChatRoomScreen')) {
                            Toast.show({
                                type: ALERT_TYPE.SUCCESS,
                                title: itemData.senderUserName,
                                textBody: itemData.message,
                                onPress: () => {
                                    Toast.hide()
                                    navigateStore.dispatch({
                                        type: NAVIGATE,
                                        payload: {
                                            target: 'ChatRoomScreen',
                                            selectedChatRoom: getChatRoom(itemData.senderUserName),
                                            selectedPhone: {}
                                        }
                                    })
                                }
                            })
                        }
                        let otherPublicKey = null
                        if (itemData.publicKey !== undefined) {
                            otherPublicKey = itemData.publicKey
                        }
                        delete itemData.publicKey
                        
                        
                        if (otherPublicKey !== null) {
                            data.otherPublicKey = otherPublicKey
                        }
                        chatPersistedStore.dispatch({
                            type: ADD_CHAT_DATA_NEW,
                            payload: data
                        })*/
                        const chatRoom = userName !== itemData.receiverUserName ? itemData.receiverUserName : itemData.senderUserName
                        const data = {
                            chatRoom: chatRoom,
                            fullName: '',
                            //publicKey: chatPersistedStore.getState().selectedChatRoomState.publicKey,
                            message: {
                                timestamp: itemData.timestamp,
                                senderUserName: itemData.senderUserName,
                                receiverUserName: itemData.receiverUserName,
                                text: itemData.text,
                                sended: true,
                                readed: false,
                                delivered: false,
                            },
                        }
                        chatStore.dispatch({ type: 'ADD_DATA', payload: data })
                        Firestore()
                            .collection('chats')
                            .doc(userName)
                            .collection('old')
                            .doc(documentSnapshot.id).set(itemData)
                        Firestore()
                            .collection('chats')
                            .doc(chatRoom)
                            .collection('delivered')
                            .doc(documentSnapshot.id).set({ id: documentSnapshot.id, receiverUserName: itemData.receiverUserName })
                        Firestore()
                            .collection('chats')
                            .doc(userName)
                            .collection('new')
                            .doc(documentSnapshot.id).delete()
                    });
                },
                (error) => {
                    console.error(error);
                }
            );
        return () => {
            unsubscribe;
        }
    }, [])

    useEffect(() => {
        Firestore()
            .collection('chats')
            .doc(userName)
            .collection('delivered')
            .doc('0').set({})
        const unsubscribe = Firestore()
            .collection('chats')
            .doc(userName)
            .collection('delivered')
            .onSnapshot(
                (querySnapshot) => {
                    querySnapshot.forEach(documentSnapshot => {
                        if (String(documentSnapshot.id) === '0') {
                            return
                        }
                        console.log('new message: ', documentSnapshot.id, documentSnapshot.data());
                        chatStore.dispatch(
                            {
                                type: 'CHANGE_MESSAGE_STATUS',
                                payload: {
                                    chatRoom: documentSnapshot.data().receiverUserName,
                                    timestamp: documentSnapshot.data().timestamp,
                                    status: 'delivered'
                                }
                            })
                        Firestore()
                            .collection('chats')
                            .doc(userName)
                            .collection('delivered')
                            .doc(documentSnapshot.id).delete()
                    });
                },
                (error) => {
                    console.error(error);
                }
            );
        return () => {
            unsubscribe;
        }
    }, [])

    useEffect(() => {
        Firestore()
            .collection('chats')
            .doc(userName)
            .collection('readed')
            .doc('0').set({})
        const unsubscribe = Firestore()
            .collection('chats')
            .doc(userName)
            .collection('readed')
            .onSnapshot(
                (querySnapshot) => {
                    querySnapshot.forEach(documentSnapshot => {
                        if (String(documentSnapshot.id) === '0') {
                            return
                        }
                        console.log('new message: ', documentSnapshot.id, documentSnapshot.data());
                        chatStore.dispatch(
                            {
                                type: 'CHANGE_MESSAGE_STATUS',
                                payload: {
                                    chatRoom: documentSnapshot.data().receiverUserName,
                                    timestamp: documentSnapshot.data().timestamp,
                                    status: 'readed'
                                }
                            })
                        Firestore()
                            .collection('chats')
                            .doc(userName)
                            .collection('readed')
                            .doc(documentSnapshot.id).delete()
                    });
                },
                (error) => {
                    console.error(error);
                }
            );
        return () => {
            unsubscribe;
        }
    }, [])

    //COMPONENTS
    const renderItem = (item) => (
        <>
            {item.item.messages.length > 0 &&
                <TouchableOpacity
                    onPress={() => {
                        const selectedChatRoom = {
                            chatRoom: item.item.chatRoom,
                            fullName: item.item.fullName
                        }
                        /*if (item.item.publicKey !== undefined) {
                            selectedChatRoom.publicKey = item.item.publicKey
                        }
                        if (item.item.privateKey !== undefined) {
                            selectedChatRoom.privateKey = item.item.privateKey
                        }
                        if (item.item.otherPublicKey !== undefined) {
                            selectedChatRoom.otherPublicKey = item.item.otherPublicKey
                        }*/
                        navigation.dispatch(StackActions.push('ChatRoomScreen', { ...route.params, selectedChatRoom: selectedChatRoom }))
                    }}
                    onLongPress={() => {
                        if (chatRoomsToDelete.includes(item.item.chatRoom)) {
                            setChatRoomsToDelete(ctd => ctd.filter(it => it !== item.item.chatRoom))
                        } else {
                            setChatRoomsToDelete([...chatRoomsToDelete, item.item.chatRoom])
                        }
                    }}
                    style={[{
                        marginLeft: 10,
                        marginTop: 10,
                        marginRight: 10,
                        borderRadius: 10,
                        padding: 10,
                        backgroundColor: colors.primaryBackground,
                        flexDirection: 'row',
                    }, chatRoomsToDelete.includes(item.item.chatRoom) && { borderColor: 'red', borderWidth: 2 }]}
                >
                    <Avatar
                        rounded
                        size={50}
                        source={{
                            uri: 'https://service8081.moneyclick.com/attachment/getUserFile/' + item.item.chatRoom.split('__')[0],
                            method: 'GET',
                            headers: hmacInterceptor?.process(
                                httpRequest.create(
                                    'https://service8081.moneyclick.com',
                                    '/attachment/getUserFile/' + item.item.chatRoom.split('__')[0],
                                    'GET',
                                    null,
                                    false
                                )).headers,
                        }}
                        overlayContainerStyle={{
                            backgroundColor: 'white',
                        }}
                    />
                    <View
                        style={{
                            flex: 4.5,
                            marginLeft: 15,
                            flexDirection: 'column'
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row'
                            }}
                        >
                            <Text
                                style={{
                                    flex: 1,
                                    color: colors.text,
                                    fontWeight: 'bold',
                                    fontSize: 16
                                }}
                            >
                                {item.item.fullName}
                            </Text>
                            <Text
                                style={{
                                    color: colors.text,
                                    fontWeight: 'bold',
                                    fontSize: 11,
                                    alignSelf: 'center',
                                }}
                            >
                                {Moment(new Date(item.item.messages[0].timestamp)).format(
                                    'hh:mm a'
                                )}
                            </Text>
                        </View>
                        <Text
                            style={{
                                color: colors.text,
                                fontSize: 14,
                            }}
                        >
                            {
                                item.item.messages[0].text.length > 38 ?
                                    item.item.messages[0].text.trim().slice(0, 35) + '...' :
                                    item.item.messages[0].text.trim()
                            }
                        </Text>
                    </View>
                    {item.item.messages.filter(message => !message?.readed && message.senderUserName !== userName).length > 0 && <View style={{ alignSelf: 'center', padding: 5 }}><Badge value={item.item.messages.filter(message => !message?.readed && message.senderUserName !== userName).length} status="primary" /></View>}
                </TouchableOpacity>}
        </>
    )

    const keyExtractor = (item) => (
        String(item.chatRoom)
    )

    const getItemLayout = (data, index) => ({
        length: data.length,
        offset: data.length * index,
        index,
    })

    //PRINCIPAL RENDER
    return (
        <View style={{ flex: 1, }}>
            <FlatList
                data={data}
                renderItem={(item) => renderItem(item)}
                keyExtractor={keyExtractor}
                removeClippedSubviews={true}
                maxToRenderPerBatch={20}
                windowSize={21}
                initialNumToRender={20}
                //getItemLayout={getItemLayout}
                updateCellsBatchingPeriod={50}
            />
            <View
                style={{
                    position: 'absolute',
                    right: 30,
                    bottom: 60,
                }}
            >
                {chatRoomsToDelete.length > 0 ?
                    <TouchableOpacity
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
                                            chatStore.dispatch({ type: 'DELETE_CHATROOMS', payload: chatRoomsToDelete })
                                            setChatRoomsToDelete([])
                                        },
                                    },
                                ]
                            );
                        }}
                        style={{
                            height: 60,
                            width: 60,
                            borderRadius: 30,
                            backgroundColor: 'red',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <MaterialCommunityIcons
                            name='delete'
                            color={'white'}
                            size={40}
                        />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                        onPress={() => {
                            navigation.dispatch(StackActions.push('ContactsScreen', { ...route.params, replaceTarget: 'ChatRoomScreen' }))
                        }}
                        style={{
                            height: 60,
                            width: 60,
                            borderRadius: 30,
                            backgroundColor: '#009387',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <MaterialCommunityIcons
                            name="message-text-outline"
                            color={'white'}
                            size={40}
                        />
                    </TouchableOpacity>}
            </View>
        </View>
    )
};

export default React.memo(compose(withNavigation, withRoute, withColors, withUserName, withHmacInterceptor, connect(mapStateToProps))(ConnectedComponent));
