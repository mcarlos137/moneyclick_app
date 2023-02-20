import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { compose } from 'redux';
import { StackActions } from '@react-navigation/native';
//HOC
import { withColors, withNavigation, withRoute } from '../hoc';

type Button_Options_Props = {
  options?: any[]
  navigation: any
  route: any
  colors: any
}

type Button_Option_Props = {
  iconName?: string
  text?: string
  height?: number
  onPress: any
  isSelected: boolean
}

const Component = ({ options, navigation, route, colors }: Button_Options_Props) => {

  //COMPONENTS
  const Option = ({ iconName, text, height = 40, onPress, isSelected }: Button_Option_Props) => (
    <TouchableOpacity
      style={{
        height: height,
        backgroundColor: isSelected ? 'gray' : colors.background,
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
        borderWidth: 1,
        borderColor: isSelected ? 'gray' : colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        marginBottom: 5
      }}
      onPress={onPress}
    >
      {iconName !== undefined &&
        <MaterialCommunityIcons
          name={iconName}
          color={isSelected ? 'white' : colors.icon}
          size={20}
        />}
      {text !== undefined &&
        <Text
          style={{
            color: isSelected ? 'white' : colors.text,
            fontSize: 12
          }}
        >
          {text}
        </Text>}
    </TouchableOpacity>
  )

  //PRINCIPAL RENDER
  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        bottom: 50,
      }}
    >
      {options?.map((option, id) => <Option key={id} iconName={option.iconName} text={option.text} height={option.height} onPress={option.onPress} isSelected={option.isSelected} />)}
      <TouchableOpacity
        style={{
          height: 100,
          width: 32,
          backgroundColor: '#009387',
          borderBottomRightRadius: 10,
          borderTopRightRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 5,
          marginTop: 5
        }}
        onPress={() => {
          navigation.dispatch(StackActions.push('ChatScreen', { ...route.params }))
        }}
      >
        <MaterialCommunityIcons
          name={'message-text-outline'}
          color={'white'}
          size={20}
        />
      </TouchableOpacity>
    </View>
  )
};

export default React.memo(compose(withNavigation, withRoute, withColors)(Component));
