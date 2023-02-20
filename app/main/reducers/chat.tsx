const initialState: any = {
    data: [
        {
            chatRoom: '12019896074',
            fullName: 'Ricardo Torres',
            messages: [
                {
                    senderUserName: '584245522788',
                    receiverUserName: '12019896074',
                    text: 'Hola',
                    sended: true,
                    delivered: true,
                    readed: true,
                    timestamp: '2023-01-28T02:23:00.000Z',
                },
                {
                    senderUserName: '584245522788',
                    receiverUserName: '12019896074',
                    text: 'Contesta',
                    sended: true,
                    delivered: true,
                    readed: true,
                    timestamp: '2023-01-28T02:24:00.000Z'
                },
                {
                    senderUserName: '584245522788',
                    receiverUserName: '12019896074',
                    text: 'Por favor',
                    sended: true,
                    delivered: true,
                    readed: true,
                    timestamp: '2023-01-28T02:25:00.000Z' 
                },
                {
                    senderUserName: '12019896074',
                    receiverUserName: '584245522788',
                    text: 'Listo',
                    sended: true,
                    delivered: true,
                    readed: true,
                    timestamp: '2023-01-28T02:26:00.000Z',
                    mediaAsset: {
                        type: 'image/png'
                    }
                },
                {
                    senderUserName: '12019896074',
                    receiverUserName: '584245522788',
                    text: 'que pasa?',
                    sended: true,
                    delivered: true,
                    readed: false,
                    timestamp: '2023-01-28T02:27:00.000Z'
                },
                {
                    senderUserName: '12019896074',
                    receiverUserName: '584245522788',
                    text: 'todo bien?',
                    sended: true,
                    delivered: true,
                    readed: false,
                    timestamp: '2023-01-28T02:28:00.000Z'
                }
            ]
        },
    ],
    openModal: '',
    mediaAsset: null,
    replyId: null,
    audioAsset: null
};

function reducer(state = initialState, action) {
    if (action.type === 'ADD_DATA') {
        const data = [...state.data]
        const selectedChatRoom = data.find(item => item.chatRoom === action.payload.chatRoom)
        if (!selectedChatRoom) {
            const newChatRoom = {
                chatRoom: action.payload.chatRoom,
                fullName: action.payload.fullName,
                messages: [action.payload.message]
            }
            data.push(newChatRoom);
        } else {
            selectedChatRoom.messages.unshift(action.payload.message)
        }
        return Object.assign({}, state, {
            token: state.data = data,
        });
    }
    if (action.type === 'CHANGE_MESSAGE_STATUS') {
        const data = [...state.data]
        data.find(item => item.chatRoom === action.payload.chatRoom)
            .messages.find(message => message.timestamp === action.payload.timestamp)[action.payload.status] = true
        return Object.assign({}, state, {
            token: state.data = data,
        });
    }
    if (action.type === 'DELETE_CHATROOMS') {
        const data = [...state.data]
        return Object.assign({}, state, {
            token: state.data = data.filter(item => !action.payload.includes(item.chatRoom)),
        });
    }
    if (action.type === 'DELETE_CHATROOM_MESSAGES') {
        const data = [...state.data]
        const newMessages = data.find(item => item.chatRoom === action.payload.chatRoom).messages.filter(item => !action.payload.timestamps.includes(item.timestamp))
        data.find(item => item.chatRoom === action.payload.chatRoom).messages = [...newMessages]
        return Object.assign({}, state, {
            token: state.data = data,
        });
    }
    if (action.type === 'SET_OPEN_MODAL') {
        return Object.assign({}, state, {
            token: state.openModal = action.payload,
        });
    }
    if (action.type === 'SET_MEDIA_ASSET') {
        return Object.assign({}, state, {
            token: state.mediaAsset = action.payload,
        });
    }
    if (action.type === 'UPDATE_MEDIA_ASSET_URI') {
        return Object.assign({}, state, {
            token: state.mediaAsset = { ...state.mediaAsset, uri: action.payload, edited: true },
        });
    }
    if (action.type === 'SET_REPLY_ID') {
        return Object.assign({}, state, {
            token: state.replyId = action.payload,
        });
    }
    if (action.type === 'SET_AUDIO_ASSET') {
        return Object.assign({}, state, {
            token: state.audioAsset = action.payload,
        });
    }
    return state;
}

export default reducer;
