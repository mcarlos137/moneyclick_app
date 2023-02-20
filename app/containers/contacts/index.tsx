//PRINCIPAL
import { StackActions } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { compose } from 'redux'
//HOC
import { withColors } from '../../main/hoc';
//HOOKS
import { getContacts } from '../../main/hooks/getContacts';
//COMPONENTS

const ContactsScreen = ({ navigation, route, colors }) => {

  const [data, setData] = useState([])
  const [showFrequents, setShowFrequents] = useState(false)
  const [textFilter, setTextFilter] = useState('')

  //HOOKS CALLS
  const { frequents, phone } = getContacts()

  //console.log('frequents', frequents)
  //console.log('phone', phone)

  useEffect(() => {
    console.log('ContactsScreen', route.params)
    /* if (navigation.getState().routes[navigation.getState().routes.length - 2].name === 'ChatScreen') {
        selectedColor = '#009387'
      }*/

  }, []);

  //COMPONENTS
  const renderItem = ({ item }) => (
    <View
      style={{
        flexDirection: 'row',
        paddingTop: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'grey'
      }}>
      <Text
        style={{
          fontWeight: 'bold',
          color: 'grey',
          fontSize: 14,
          flex: 1,
        }}
      >
        {item.name}
      </Text>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'flex-end',
        }}
      >
        {item.phones.map((j, l) => {
          return (
            <TouchableOpacity
              key={l}
              onPress={() => {
                if (route?.params?.replaceTarget === 'MoneyClickUserSendScreen') {
                  const selectedPhone = {
                    areaCode: j.split('__')[0],
                    phone: j.split('__')[1],
                    fullName: item.name
                  }
                  let newParams = { ...route.params, selectedPhone: selectedPhone }
                  delete newParams.selectedChatRoom
                  delete newParams.replaceTarget
                  navigation.dispatch(StackActions.replace('MoneyClickUserSendScreen', newParams))
                }
                if (route?.params?.replaceTarget === 'ChatRoomScreen') {
                  const selectedChatRoom = {
                    chatRoom: j.split('__')[0] + j.split('__')[1],
                    fullName: item.name
                  }
                  let newParams = { ...route.params, selectedChatRoom: selectedChatRoom }
                  delete newParams.selectedPhone
                  delete newParams.replaceTarget
                  navigation.dispatch(StackActions.replace('ChatRoomScreen', newParams))
                }
              }}
            >
              <Text
                style={{
                  fontWeight: 'bold',
                  color: 'grey',
                  fontSize: 14,
                }}
              >
                {j.split('__')[0]} {j.split('__')[1]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );


  return (
    <View style={{
      flex: 1
    }}>
      <View
        style={{
          width: Dimensions.get('window').width * 0.9,
          flexDirection: 'row',
          paddingTop: 10,
          alignSelf: 'center'
        }}>
        <View
          style={{
            flex: 1,
            borderColor: colors.border,
            borderWidth: 1,
            padding: 10,
            borderRadius: 10,
            marginRight: 5,
          }}
        >
          <TextInput
            placeholder={'Search'}
            //onChangeText={(text) => filterFunction(text)}
            onChangeText={(text) => { }}
            value={textFilter}
            style={{
              color: colors.text,
              fontSize: 14
            }}
            placeholderTextColor={colors.placeholderText}
          />
        </View>
        <TouchableOpacity
          style={{
            borderRadius: 10,
            padding: 5,
            borderWidth: 1,
            borderColor: !showFrequents ? colors.border : colors.getRandomMain(),
            backgroundColor: !showFrequents ? 'transparent' : colors.getRandomMain(),
            justifyContent: 'center'
          }}
          onPress={() => {
            setShowFrequents(freq => !freq)
            /*indexPersistedStore.dispatch({ type: SET_CONTACTS_TEXT_FILTER, payload: '' })
            */
          }}>
          <Text
            style={{
              color: !showFrequents ? colors.text : 'white',
            }}
          >
            Frequents
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          alignSelf: 'center',
          width: Dimensions.get('window').width * 0.9,
        }}>
        {frequents?.length > 0 && showFrequents &&
          <FlatList
            keyExtractor={item => item.name + item.phones.toString()}
            //key={item => item.name + item.phones.toString()}
            data={frequents}
            renderItem={renderItem}
            initialNumToRender={20}
          />}
        {phone?.length > 0 &&
          <FlatList
            keyExtractor={item => item.name + item.phones.toString()}
            //key={item => item.name + item.phones.toString()}
            data={phone}
            renderItem={renderItem}
            removeClippedSubviews={true}
            windowSize={100}
            maxToRenderPerBatch={50}
            initialNumToRender={100}
          />}
      </View>
    </View>
  );
};

export default React.memo(compose(withColors)(ContactsScreen));
