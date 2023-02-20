
//ACTIONS
import {
  SET_CAMERA_STREAM_PEER_CONNECTION,
  SET_CAMERA_STREAM_LOCAL_MEDIA,
  SET_CAMERA_STREAM_REMOTE_MEDIA,
  SET_CAMERA_STREAM_LOCAL_STREAM,
  SET_CAMERA_STREAM_CALL_ID,
  SET_CAMERA_STREAM_AUDIO_STATUS,
  SET_CAMERA_STREAM_VIDEO_STATUS,
  ADD_CAMERA_STREAM_RUNNING_SECONDS,
  RESET_CAMERA_STREAM_RUNNING_SECONDS,
  SET_CAMERA_STREAM_RUNNING_CLOCK,
  SET_CAMERA_STREAM_DING,
  SET_CAMERA_STREAM_TYPE,
  SET_CAMERA_STREAM_ACTIVE_CALL
} from "../../../constants/action-types";

const initialState = {
  localMediaState: null,
  remoteMediaState: null,
  peerConnectionState: null,
  localStreamState: null,
  typeState: 'OUTGOING', //INCOMING & OUTGOING
  dingState: null,
  callIdState: null,
  audioStatusState: 'on',
  videoStatusState: 'on',
  runningSecondsState: 0,
  runningClockState: false,
  activeCallState: false
};

function rootReducer(state = initialState, action) {
  if (action.type === SET_CAMERA_STREAM_ACTIVE_CALL) {
    return Object.assign({}, state, {
      token: state.activeCallState = action.payload,
    });
  }
  if (action.type === SET_CAMERA_STREAM_PEER_CONNECTION) {
    return Object.assign({}, state, {
      token: state.peerConnectionState = action.payload,
    });
  }
  if (action.type === SET_CAMERA_STREAM_LOCAL_MEDIA) {
    return Object.assign({}, state, {
      token: state.localMediaState = action.payload,
    });
  }
  if (action.type === SET_CAMERA_STREAM_REMOTE_MEDIA) {
    return Object.assign({}, state, {
      token: state.remoteMediaState = action.payload,
    });
  }
  if (action.type === SET_CAMERA_STREAM_LOCAL_STREAM) {
    return Object.assign({}, state, {
      token: state.localStreamState = action.payload,
    });
  }

  if (action.type === SET_CAMERA_STREAM_DING) {
    return Object.assign({}, state, {
      token: state.dingState = action.payload,
    });
  }
  if (action.type === SET_CAMERA_STREAM_TYPE) {
    return Object.assign({}, state, {
      token: state.typeState = action.payload,
    });
  }
  if (action.type === SET_CAMERA_STREAM_CALL_ID) {
    return Object.assign({}, state, {
      token: state.callIdState = action.payload,
    });
  }
  if (action.type === SET_CAMERA_STREAM_RUNNING_CLOCK) {
    return Object.assign({}, state, {
      token: state.runningClockState = action.payload,
    });
  }
  if (action.type === RESET_CAMERA_STREAM_RUNNING_SECONDS) {
    return Object.assign({}, state, {
      token: state.runningSecondsState = 0,
    });
  }
  if (action.type === ADD_CAMERA_STREAM_RUNNING_SECONDS) {
    return Object.assign({}, state, {
      token: state.runningSecondsState = state.runningSecondsState + 1,
    });
  }
  if (action.type === SET_CAMERA_STREAM_VIDEO_STATUS) {
    return Object.assign({}, state, {
      token: state.videoStatusState = action.payload,
    });
  }
  if (action.type === SET_CAMERA_STREAM_AUDIO_STATUS) {
    return Object.assign({}, state, {
      token: state.audioStatusState = action.payload,
    });
  }
  return state;
}

export default rootReducer;