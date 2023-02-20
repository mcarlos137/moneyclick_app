//PRINCIPAL
import React from 'react';
import {
    View,
    SafeAreaView,
    Dimensions,
    Text,
    TouchableOpacity,
} from 'react-native';
import { connect } from "react-redux";
import { RTCView } from 'react-native-webrtc';
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import TimerMixin from 'react-timer-mixin';
//STORES
import {
    indexStore
} from '../store'
import {
    indexStore as moneyCallStore
} from '../../moneyCall/store'
import {
    navigateStore,
    authPersistedStore
} from '../../../main/store'
//ACTIONS
import {
    NAVIGATE,
    ADD_CAMERA_STREAM_RUNNING_SECONDS,
    SET_CAMERA_STREAM_AUDIO_STATUS,
} from '../../../constants/action-types'

function getTime(runningSeconds, activeCall) {
    TimerMixin.setTimeout(() => {
        if (activeCall) {
            if (indexStore.getState().runningClockState) {
                indexStore.dispatch(
                    { type: ADD_CAMERA_STREAM_RUNNING_SECONDS }
                )
            }
        }
    }, 1000)
    var date = new Date(0);
    date.setSeconds(runningSeconds); // specify value for SECONDS here
    var timeString = date.toISOString().substr(11, 8);
    return timeString
}

const LeftComponent = ({ runningSeconds, activeCall }) => {
    return (
        <View
            style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: 200,
                width: 140,
                alignContent: 'center',
                justifyContent: 'center',
                zIndex: 15,
                elevation: (Platform.OS === 'android') ? 50 : 0
            }}
        >
            {moneyCallStore.getState().selectedMoneyCallState.rate !== undefined &&
                <>
                    <Text
                        style={{
                            textAlign: 'center',
                            color: moneyCallStore.getState().selectedMoneyCallState.senderUserName === authPersistedStore.getState().userNameState ? 'red' : 'green',
                            marginBottom: 7,
                        }}
                    >
                        {moneyCallStore.getState().selectedMoneyCallState.rate.toFixed(2)} $/min
                    </Text>
                    <Text
                        style={{
                            textAlign: 'center',
                            color: moneyCallStore.getState().selectedMoneyCallState.senderUserName === authPersistedStore.getState().userNameState ? 'red' : 'green',
                            marginBottom: 7,
                        }}
                    >
                        {getTime(runningSeconds, activeCall)}
                    </Text>
                    <Text
                        style={{
                            textAlign: 'center',
                            color: moneyCallStore.getState().selectedMoneyCallState.senderUserName === authPersistedStore.getState().userNameState ? 'red' : 'green',
                        }}
                    >
                        $ {(runningSeconds * moneyCallStore.getState().selectedMoneyCallState.rate / 60).toFixed(3)}
                    </Text>
                </>
            }
        </View>
    )
}

const mapStateToProps = state => {
    return {
        localMediaState: state.localMediaState,
        remoteMediaState: state.remoteMediaState,
        audioStatusState: state.audioStatusState,
        videoStatusState: state.videoStatusState,
        runningSecondsState: state.runningSecondsState,
        typeState: state.typeState,
        activeCallState: state.activeCallState,
        localStreamState: state.localStreamState
    };
};

const ConnectedComponent = ({
    localMediaState,
    remoteMediaState,
    audioStatusState,
    videoStatusState,
    runningSecondsState,
    typeState,
    activeCallState,
    localStreamState
}) => (
    <SafeAreaView
        style={{
            backgroundColor: 'black'
        }}
    >
        <View
            style={{
                flex: 1,
                width: Dimensions.get('window').width
            }}
        >
            <LeftComponent
                runningSeconds={runningSecondsState}
                activeCall={activeCallState}
            />
            <View
                style={{
                    position: 'absolute',
                    bottom: 20,
                    left: Dimensions.get('window').width / 2 - 40,
                    zIndex: 15,
                    elevation: (Platform.OS === 'android') ? 50 : 0
                }}
            >
                {(typeState === 'OUTGOING' || typeState === 'INCOMING') &&
                    <View>
                        <TouchableOpacity
                            onPress={() => {
                                navigateStore.dispatch({ type: NAVIGATE, payload: { target: moneyCallStore.getState().selectedMoneyCallState.senderUserName === authPersistedStore.getState().userNameState && runningSecondsState > 0 ? 'MoneyCallRatingScreen' : 'goBack__1' } });
                            }}
                            style={{
                                width: 80,
                                backgroundColor: activeCallState ? 'red' : 'blue',
                                padding: 20,
                                borderRadius: 40,
                            }}
                        >
                            <IconMaterialCommunity
                                name={activeCallState ? 'phone' : 'close'}
                                color={'white'}
                                size={40}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                localStreamState.getTracks().forEach((t) => {
                                    if (t.kind === 'audio') t.enabled = !audioStatusState;
                                });
                                indexStore.dispatch({ type: SET_CAMERA_STREAM_AUDIO_STATUS, payload: !audioStatusState })
                            }}
                            style={{
                                width: 80,
                                padding: 20,
                                borderRadius: 40,
                                marginTop: 5
                            }}
                        >
                            <IconMaterialCommunity
                                name={audioStatusState ? 'microphone' : 'microphone-off'}
                                color={'white'}
                                size={40}
                            />
                        </TouchableOpacity>
                    </View>}
            </View>
            {videoStatusState === 'on' && remoteMediaState !== null &&
                <RTCView
                    streamURL={remoteMediaState.toURL()}
                    //objectFit={'contain'}
                    objectFit={'cover'}
                    zOrder={0}
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        top: 0,
                        left: 0
                    }}
                />
            }
            <View
                style={{
                    zIndex: 15,
                    elevation: (Platform.OS === 'android') ? 50 : 0,
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 140,
                    height: 200,
                }}
            >
                {videoStatusState === 'on' && localMediaState !== null &&
                    <RTCView
                        streamURL={localMediaState.toURL()}
                        objectFit={'cover'}
                        zOrder={1}
                        style={{ width: '100%', flex: 1 }}
                    />
                }
            </View>
        </View>
    </SafeAreaView>
);

const Component = connect(mapStateToProps)(ConnectedComponent);

export default Component;
