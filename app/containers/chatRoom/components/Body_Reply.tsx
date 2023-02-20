import React, { useEffect, useState, useRef } from 'react';
import {
  ImageBackground,
  StyleSheet,
  ToastAndroid,
  Dimensions,
  View,
  TouchableOpacity,
  Text,
  Image
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
//import PhotoEditor from '@baronha/react-native-photo-editor';
import Video from 'react-native-video';
import { compose } from 'redux';
//import ImageViewer from 'react-native-image-zoom-viewer';
import { connect } from "react-redux";
//STORES
import { store as chatStore } from '../../../main/stores/chat';
//HOC
import { withColors } from '../../../main/hoc';
import FastImage from 'react-native-fast-image';

const mapStateToProps = state => {
  return {
    replyId: state.replyId,
  };
};

const ConnectedComponent = ({
  replyId,
  colors
}) => {

  return (
    <View
      style={{
        alignItems: 'center',
      }}
    >
      {replyId !== null &&
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            backgroundColor: colors.primaryBackground,
            width: Dimensions.get('window').width,
            padding: 5,
          }}
        >
          {/*mediaAsset.type.includes('image') &&
            <FastImage
              source={{
                uri: mediaAsset.uri,
              }}
              style={{
                height: 200 * mediaAsset.height / mediaAsset.width,
                width: 200,
              }}
            />
            */}
          {/*mediaAsset.type.includes('video') &&
            <Video
              source={{
                uri: mediaAsset.uri,
              }}
              paused={true}
              controls={true}
              resizeMode='cover'
              repeat={true}
              onError={(error) => {
                //console.log('>>>>>>>>>>>>> ' + JSON.stringify(error))
              }}
              style={{
                height: 250 * mediaAsset.height / mediaAsset.width,
                width: 250,
              }}
            />
            */}
          <View
            style={{
              marginLeft: 15
            }}
          >
            {/*mediaAsset.type.includes('image') &&
              <TouchableOpacity
                onPress={() => {
                  PhotoEditor.open({
                    path: mediaAsset.uri,
                    stickers: [
                      "https://cdn-icons-png.flaticon.com/512/5272/5272912.png",
                      "https://cdn-icons-png.flaticon.com/512/5272/5272913.png",
                      "https://cdn-icons-png.flaticon.com/512/5272/5272916.png",
                      "https://cdn-icons-png.flaticon.com/512/5272/5272918.png",
                      "https://cdn-icons-png.flaticon.com/512/5272/5272920.png",
                      "https://cdn-icons-png.flaticon.com/512/5272/5272923.png",
                      "https://cdn-icons-png.flaticon.com/512/5272/5272925.png",
                      "https://cdn-icons-png.flaticon.com/512/5272/5272926.png",
                      "https://cdn-icons-png.flaticon.com/512/5272/5272929.png",
                      "https://cdn-icons-png.flaticon.com/512/5272/5272931.png",
                      "https://cdn-icons-png.flaticon.com/512/5272/5272932.png",
                      "https://cdn-icons-png.flaticon.com/512/5272/5272934.png",
                      "https://cdn-icons-png.flaticon.com/512/5272/5272936.png",
                      "https://cdn-icons-png.flaticon.com/512/5272/5272939.png",
                      "https://cdn-icons-png.flaticon.com/512/5272/5272940.png",
                      "https://cdn-icons-png.flaticon.com/512/5272/5272942.png",
                      "https://cdn-icons-png.flaticon.com/512/5272/5272944.png",
                      "https://cdn-icons-png.flaticon.com/512/5272/5272948.png",
                      "https://cdn-icons-png.flaticon.com/512/5272/5272950.png"
                    ],
                  }).then(result => {
                    chatStore.dispatch({ type: 'UPDATE_MEDIA_ASSET_URI', payload: result })
                  });
                }}
                style={{
                  marginBottom: 10
                }}
              >
                <MaterialIcons
                  name={'edit'}
                  color={colors.icon}
                  size={26}
                />
              </TouchableOpacity>*/}
            <TouchableOpacity
              onPress={() => {
                chatStore.dispatch({ type: 'SET_REPLY_ID', payload: null })
              }}

            >
              <MaterialCommunityIcons
                name={'delete'}
                color={colors.icon}
                size={26}
              />
            </TouchableOpacity>
          </View>
        </View>}
    </View>
  )
};

export default React.memo(compose(withColors, connect(mapStateToProps))(ConnectedComponent));

