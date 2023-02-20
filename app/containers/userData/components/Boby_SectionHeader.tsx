import React, { Fragment } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { compose } from 'redux';
//HOC
import { withColors } from "../../../main/hoc";

const Component = ({ title, isEditing, type, canEdit, buttons, colors }) => (
    <View
        style={{
            flexDirection: 'row',
            marginTop: 10
        }}
        onLayout={(e) => {
            if (type === 'digitalBusiness') {
                //indexStore.dispatch({ type: SET_USER_DATA_SCROLL_VIEW_Y_POSITIONS, payload: { key: 'digitalBusiness', value: e.nativeEvent.layout.y } })
                console.log('>>>>>>>>>>>>>>>>>>>>>>digitalBusiness y:', e.nativeEvent.layout.y);
            }
            if (type === 'verifiedInfo') {
                //indexStore.dispatch({ type: SET_USER_DATA_SCROLL_VIEW_Y_POSITIONS, payload: { key: 'verifiedInfo', value: e.nativeEvent.layout.y } })
                console.log('>>>>>>>>>>>>>>>>>>>>>>verifiedInfo y:', e.nativeEvent.layout.y);
            }
            if (type === 'subscriptionsAndCalls') {
                //indexStore.dispatch({ type: SET_USER_DATA_SCROLL_VIEW_Y_POSITIONS, payload: { key: 'subscriptionsAndCalls', value: e.nativeEvent.layout.y } })
                console.log('>>>>>>>>>>>>>>>>>>>>>>subscriptionsAndCalls y:', e.nativeEvent.layout.y);
            }
            if (type === 'shorts') {
                //indexStore.dispatch({ type: SET_USER_DATA_SCROLL_VIEW_Y_POSITIONS, payload: { key: 'shorts', value: e.nativeEvent.layout.y } })
                console.log('>>>>>>>>>>>>>>>>>>>>>>shorts y:', e.nativeEvent.layout.y);
            }
            if (type === 'broadcastings') {
                //indexStore.dispatch({ type: SET_USER_DATA_SCROLL_VIEW_Y_POSITIONS, payload: { key: 'broadcastings', value: e.nativeEvent.layout.y } })
                console.log('>>>>>>>>>>>>>>>>>>>>>>broadcastings y:', e.nativeEvent.layout.y);
            }
            if (type === 'liveStreamings') {
                //indexStore.dispatch({ type: SET_USER_DATA_SCROLL_VIEW_Y_POSITIONS, payload: { key: 'liveStreamings', value: e.nativeEvent.layout.y } })
                console.log('>>>>>>>>>>>>>>>>>>>>>>liveStreamings y:', e.nativeEvent.layout.y);
            }
        }}
    >
        <View
            style={{
                flexDirection: 'row',
                padding: 10,
                alignItems: 'center',
                flex: 1
            }}
        >
            <Text
                style={{
                    color: colors.text,
                    fontWeight: 'bold',
                    fontSize: 18
                }}
            >
                {title}
            </Text>

            {buttons !== undefined &&
                <View
                    style={{
                        flexDirection: 'row',
                        position: 'absolute',
                        right: 10
                    }}
                >
                    {buttons.map((item, index) => {
                        return (
                            <Fragment
                                key={index}
                            >
                                <TouchableOpacity
                                    style={{
                                        borderColor: colors.getRandomMain(),
                                        borderWidth: 1,
                                        padding: 5,
                                        borderRadius: 5,
                                        marginLeft: 5,
                                        justifyContent: 'flex-end'
                                    }}
                                    onPress={item.onPress}
                                >
                                    <Text
                                        style={{
                                            color: colors.getRandomMain(),
                                            fontWeight: 'normal',
                                            fontSize: 11
                                        }}
                                    >
                                        {item.title}
                                    </Text>
                                </TouchableOpacity>
                            </Fragment>
                        )
                    })}
                </View>}
        </View>
        {!isEditing && canEdit &&
            <TouchableOpacity
                onPress={() => {
                    //indexStore.dispatch({ type: IS_EDITING, payload: true })
                }}
                style={{
                    alignSelf: 'center',
                    padding: 5
                }}
            >
                <MaterialIcons
                    name={'edit'}
                    color={colors.icon}
                    size={25}
                />
            </TouchableOpacity>}
        {isEditing && canEdit &&
            <TouchableOpacity
                onPress={() => {
                    //updateProcessStore.dispatch({ type: SET_USER_DATA_UPDATE_PROCESS, payload: type })
                }}
                style={{
                    alignSelf: 'center',
                    padding: 5
                }}
            >
                <MaterialIcons
                    name={'check'}
                    color={colors.icon}
                    size={25}
                />
            </TouchableOpacity>}
    </View>
)

export default React.memo(compose(withColors)(Component))
