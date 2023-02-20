//PRINCIPAL
import React from "react";
import { View, ScrollView, RefreshControl, Platform, StatusBar, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';


const mapStateToProps = (state) => {
  return {
    openChatModalState: state.openChatModalState,
  };
};

const ConnectedComponent = ({
  openChatModalState,
}) => {
  return (
    <>
      {!openChatModalState &&
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: 0,
            top: 300,
            height: 100,
            backgroundColor: '#009387',
            borderBottomRightRadius: 10,
            borderTopRightRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 5
          }}
          onPress={() => {

          }}
        >
          <IconMaterialCommunity
            name={'message-text-outline'}
            color={'white'}
            size={20}
          />
        </TouchableOpacity>
      }
    </>
  )
};

export default connect(mapStateToProps)(ConnectedComponent);