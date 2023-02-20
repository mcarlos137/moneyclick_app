import React, { useEffect } from "react";
import { compose } from "redux";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
//STORES
import { store as chatStore, persistor as chatPersistor } from '../../main/stores/chat'
//HOC
import { withColors, withHmacInterceptor } from "../../main/hoc";
//COMPONENTS
import Body from './components/Body'
import Body_Input from './components/Body_Input'
import Body_Media from './components/Body_Media'
import Body_Reply from './components/Body_Reply'
import Body_Audio from './components/Body_Audio'
import Modal_Dots from './components/Modal_Dots'

const ChatRoomScreen = ({ navigation, route }) => {

    return (
        <Provider store={chatStore} >
            <PersistGate loading={null} persistor={chatPersistor}>
                <Body />
                <Body_Media />
                <Body_Reply />
                <Body_Audio />
                <Body_Input />
                <Modal_Dots />
            </PersistGate>
        </Provider>
    )

}

export default React.memo(compose(withColors, withHmacInterceptor)(ChatRoomScreen))