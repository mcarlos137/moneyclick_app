//PRINCIPAL
import React, { createRef, useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import {
  mediaDevices,
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
  RTCView
} from 'react-native-webrtc';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Firestore from '@react-native-firebase/firestore';
import { StackActions } from '@react-navigation/native';
//import Sound from 'react-native-sound';

const CameraStreamScreen = ({ navigation, route }) => {

  //var ding

  //CONSTANTS
  const servers1 = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };

  const servers2 = {
    iceServers: [{
      urls: "stun:openrelay.metered.ca:80",
    },
    {
      urls: "turn:openrelay.metered.ca:80",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
    {
      urls: "turn:openrelay.metered.ca:443",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
    ]
  }

  //INITIAL STATES
  const [audioStatus, setAudioStatus] = useState(route.params.selectedCameraStreamParams.audioStatus)
  const [videoStatus, setVideoStatus] = useState(route.params.selectedCameraStreamParams.videoStatus)
  const [localMediaStream, setLocalMediaStream] = useState<any>(null)
  const [remoteMediaStream, setRemoteMediaStream] = useState<any>(null)
  const peerConnection = useRef<any>(new RTCPeerConnection(servers1));
  const [callId, setCallId] = useState<any>(route.params.selectedCameraStreamParams.callId)
  const [type, setType] = useState(callId === null ? 'OUTGOING' : 'INCOMING')
  const [activeCall, setActiveCall] = useState(false)
  const [runningSeconds, setRunningSeconds] = useState(0)

  //EFFECTS
  useEffect(() => {
    console.log('CameraStreamScreen', route.params)
    /**
     * 
     * selectedCameraStreamParams
                                showCounter: false,
     * 
     */
    const timeoutStartStream = setTimeout(() => {
      startStream(audioStatus === 'on', videoStatus === 'on')
    }, 100)
    let timeoutMakeCall
    if (callId === null) {
      timeoutMakeCall = setTimeout(() => {
        /*Sound.setCategory('Playback');
        var ding = new Sound('phoneringing.mp3', Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            console.log('failed to load the sound', error);
            return;
          }
          ding.setNumberOfLoops(10);
          ding.setVolume(1);
          ding.play(success => {
            if (!success) {
              console.log('playback failed due to audio decoding errors');
            }
          });
        })*/
        //indexStore.dispatch({ type: SET_CAMERA_STREAM_DING, payload: ding })
        makeCall(route.params.selectedChatRoom.chatRoom)
      }, 2000)
    }
    let timeoutJoinCall
    if (callId !== null) {
      timeoutJoinCall = setTimeout(() => {
        console.log('joinCall ' + callId)
        joinCall(callId)
      }, 2000)
    }
    return () => {
      clearTimeout(timeoutStartStream)
      clearTimeout(timeoutMakeCall)
      clearTimeout(timeoutJoinCall)
    }
  }, []);

  //FUNCTIONS
  const startStream = async (audio, video) => {
    let mediaConstraints = {
      audio: audio,
      video: {
        frameRate: 30,
        facingMode: 'user'
      }
    };
    let lms;
    /*try {
      const mediaStream = await mediaDevices.getUserMedia(mediaConstraints);
      if (!video) {
        let videoTrack = await mediaStream.getVideoTracks()[0];
        videoTrack.enabled = false;
      };

      lms = mediaStream;
    } catch (err) {
      // Handle Error
    };*/
    // Add our stream to the peer connection.
    lms.getTracks().forEach(track => peerConnection.current.addTrack(track, lms))
    setLocalMediaStream(lms)
    peerConnection.current.onaddstream = event => {
      setRemoteMediaStream(event.stream)
      setActiveCall(true)
    };
    //InCallManager.start({ media: 'audio' });
  };

  const stopStream = async () => {
    console.log('>>>>>>>>>>>>>>>>>stopStream ' + callId)
    Firestore().collection('channels').doc(callId).delete();
    peerConnection.current.close()
    peerConnection.current = null
    localMediaStream.getTracks().forEach(track => track.stop());
    setLocalMediaStream(null)
    setCallId(null)
    setRemoteMediaStream(null)
    //InCallManager.stop();
  }

  const makeCall = async (targetUserName) => {
    const channelDoc = Firestore().collection('channels').doc();
    const offerCandidates = channelDoc.collection('offerCandidates');
    const answerCandidates = channelDoc.collection('answerCandidates');
    setCallId(channelDoc.id)
    peerConnection.current.onicecandidate = async event => {
      if (event.candidate) {
        await offerCandidates.add(event.candidate.toJSON());
      }
    };
    const offerDescription = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offerDescription);
    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };
    await channelDoc.set({ offer: offer });
    // Listen for remote answer
    channelDoc.onSnapshot(snapshot => {
      const data = snapshot.data();
      if (data === undefined) {
        setActiveCall(false)
        return
      }
      if (!peerConnection.current.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        peerConnection.current.setRemoteDescription(answerDescription);
      }
    });
    // When answered, add candidate to peer connection
    answerCandidates.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const data = change.doc.data();
          peerConnection.current.addIceCandidate(new RTCIceCandidate(data));
          /*indexStore.getState().dingState.stop(() => {
              indexStore.getState().dingState.play();
          });
          indexStore.getState().dingState.release();*/
        }
      });
    });
    //Send callId to third
    /*notificationSendMessageStore.dispatch(
      notificationSendMessageAction(
        [targetUserName],
        'Incoming Call',
        targetUserName + ' is calling you!',
        { callType: 'VIDEO', callId: indexStore.getState().callIdState, callName: targetUserName },
        'phoneringing.mp3'
      )
    )*/
  }

  const joinCall = async (channelId) => {
    const channelDoc = Firestore().collection('channels').doc(channelId);
    channelDoc.onSnapshot(snapshot => {
      const data = snapshot.data();
      if (data === undefined) {
        setActiveCall(false)
      }
    });
    const offerCandidates = channelDoc.collection('offerCandidates');
    const answerCandidates = channelDoc.collection('answerCandidates');
    peerConnection.current.onicecandidate = async event => {
      if (event.candidate) {
        await answerCandidates.add(event.candidate.toJSON());
      }
    };
    const channelDocument = await channelDoc.get();
    const channelData = channelDocument.data();
    if (channelData === undefined) {
      navigation.dispatch(StackActions.pop())
      return
    }
    const offerDescription = channelData.offer;
    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(offerDescription),
    );
    const answerDescription = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answerDescription);
    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };
    await channelDoc.update({ answer: answer });
    offerCandidates.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const data = change.doc.data();
          peerConnection.current.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  };

  //PRINCIPAL RENDER
  return (
    <SafeAreaView
      style={{
        backgroundColor: 'black',
        flex: 1
      }}
    >
      {/**
       * <LeftComponent
                runningSeconds={runningSecondsState}
                activeCall={activeCallState}
            />
       */}
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          left: Dimensions.get('window').width / 2 - 40,
          zIndex: 15,
          elevation: (Platform.OS === 'android') ? 50 : 0
        }}
      >
        {(type === 'OUTGOING' || type === 'INCOMING') &&
          <View>
            <TouchableOpacity
              onPress={() => {
                navigation.dispatch(StackActions.pop())
                stopStream()
                //navigateStore.dispatch({ type: NAVIGATE, payload: { target: moneyCallStore.getState().selectedMoneyCallState.senderUserName === authPersistedStore.getState().userNameState && runningSecondsState > 0 ? 'MoneyCallRatingScreen' : 'goBack__1' } });
              }}
              style={{
                width: 80,
                backgroundColor: activeCall ? 'red' : 'blue',
                padding: 20,
                borderRadius: 40,
              }}
            >
              <MaterialCommunityIcons
                name={activeCall ? 'phone' : 'close'}
                color={'white'}
                size={40}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                localMediaStream.getTracks().forEach((t) => {
                  if (t.kind === 'audio') t.enabled = !audioStatus;
                });
                setAudioStatus(value => !value)
              }}
              style={{
                width: 80,
                padding: 20,
                borderRadius: 40,
                marginTop: 5
              }}
            >
              <MaterialCommunityIcons
                name={audioStatus ? 'microphone' : 'microphone-off'}
                color={'white'}
                size={40}
              />
            </TouchableOpacity>
          </View>}
      </View>
      {videoStatus === 'on' && remoteMediaStream !== null &&
        <>
          {/*<RTCView
          streamURL={remoteMediaStream.toURL()}
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
        />*/}
        </>
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
        {videoStatus === 'on' && localMediaStream !== null &&
          <>
            {/*<RTCView
            streamURL={localMediaStream.toURL()}
            objectFit={'cover'}
            zOrder={1}
            style={{ width: '100%', flex: 1 }}
      />*/}
          </>
        }
      </View>
    </SafeAreaView>
  );
};

export default React.memo(CameraStreamScreen);
