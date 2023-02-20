import React, { Fragment } from "react";
import { Text, View, TouchableOpacity, processColor, Dimensions, TextInput, Switch, Alert } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { compose } from 'redux';
import { TextInputMask } from "react-native-masked-text";
import {
    Picker,
} from '@react-native-picker/picker'
//HOC
import { withColors } from "../../../main/hoc";

const Component = ({
    data,
    isEditing,
    colors
}) => {

    return (
        <View
            style={{
                alignItems: 'center'
            }}
        >
            {data.map((item, key) => {
                return (
                    <Fragment
                        key={key}
                    >
                        {(item.canEdit || (!item.canEdit && item.value !== '')) &&
                            <View
                                style={{
                                    flexDirection: 'row',
                                    width: Dimensions.get('window').width * 0.9,
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                    padding: 5,
                                    marginBottom: 10,
                                    backgroundColor: key % 2 === 1 ? colors.secundaryBackground : colors.primaryBackground,
                                }}
                            >
                                <View
                                    style={{
                                        flex: 0.3,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontWeight: 'bold',
                                            color: colors.text
                                        }}>
                                        {item.text + ':'}
                                    </Text>
                                </View>
                                {(item.type === 'TEXT' || item.type === 'TEXT_LINK') && isEditing &&
                                    <TextInput
                                        style={{
                                            flex: item.info === undefined ? 0.7 : 0.62,
                                        }}
                                        //placeholder={item.value !== '' ? item.value : item.name}
                                        onChangeText={(text) => {
                                            /*userDataStore.dispatch(
                                                {
                                                    type: UPDATE_FORM,
                                                    payload:
                                                    {
                                                        name: item.name,
                                                        value: text
                                                    }
                                                }
                                            )*/
                                        }}
                                        placeholderTextColor={colors.placeholderText}
                                        value={item.value}
                                        editable={isEditing}
                                    />}
                                {item.type === 'TEXT_LINK' && !isEditing && item.value !== '' &&
                                    <View
                                        style={{
                                            flex: item.info === undefined ? 0.7 : 0.62,
                                            alignItems: 'center'
                                        }}
                                    >
                                        <TouchableOpacity
                                            style={{
                                                borderColor: 'green',
                                                borderWidth: 1,
                                                padding: 5,
                                                borderRadius: 5,
                                            }}
                                            onPress={() => {
                                                var preffix = 'https://'
                                                switch (item.name) {
                                                    case 'instagram':
                                                        preffix = 'https://www.instagram.com/'
                                                        break
                                                    case 'twitter':
                                                        preffix = 'https://www.twitter.com/'
                                                        break
                                                    case 'facebook':
                                                        preffix = 'https://www.facebook.com/'
                                                        break
                                                    case 'youtube':
                                                        preffix = 'https://www.youtube.com/c/'
                                                        break
                                                    case 'tiktok':
                                                        preffix = 'https://www.tiktok.com/@'
                                                        break
                                                    /*case 'snapchat':
                                                        preffix = 'https://www.facebook.com/'
                                                        break*/
                                                    case 'onlyFans':
                                                        preffix = 'https://onlyfans.com/'
                                                        break
                                                }
                                                console.log(JSON.stringify(preffix + item.value))
                                                //Linking.openURL(preffix + item.value).catch(err => console.error("Couldn't load page", err));
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: 'green',
                                                }}
                                            >
                                                {item.value}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>}
                                {item.type === 'TEXT' && !isEditing &&
                                    <View
                                        style={{
                                            flex: item.info === undefined ? 0.7 : 0.62,
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: colors.text
                                            }}
                                        >
                                            {item.value}
                                        </Text>
                                    </View>}
                                {item.type === 'MULTIPLE_TEXT' &&
                                    <View
                                        style={{
                                            flex: item.info === undefined ? 0.7 : 0.62,
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            flexWrap: 'wrap',
                                            height: 50,
                                            alignContent: 'center'
                                        }}
                                    >
                                        <Picker
                                            style={{
                                                backgroundColor: '#f9f9f9',
                                                color: 'black',
                                                width: 50
                                            }}
                                            itemStyle={{
                                                height: 100,
                                                fontSize: 14,
                                            }}
                                            enabled={isEditing}
                                            mode='dropdown'
                                            dropdownIconColor={colors.icon}
                                            //selectedValue={''}
                                            onValueChange={
                                                (item) => {
                                                    /*userDataStore.dispatch(
                                                        {
                                                            type: UPDATE_FORM,
                                                            payload:
                                                            {
                                                                name: item.name,
                                                                value: value,
                                                                type: 'ARRAY'
                                                            }
                                                        }
                                                    )*/
                                                }
                                            }
                                        >
                                            {getPossibleValues(item.possibleValues, item.value).map((item, key) => {
                                                return (
                                                    <Picker.Item
                                                        key={key}
                                                        color={colors.text}
                                                        label={item}
                                                        value={item}
                                                        style={{
                                                            color: colors.text,
                                                            backgroundColor: colors.primaryBackground,
                                                        }}
                                                    />
                                                );
                                            })
                                            }
                                        </Picker>
                                        {item.value.map((it, id) => {
                                            return (
                                                <View
                                                    key={id}
                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            marginLeft: 10,
                                                            marginRight: 2
                                                        }}
                                                    >
                                                        {it}
                                                    </Text>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            console.log('delete ' + id)
                                                            /*userDataStore.dispatch(
                                                                {
                                                                    type: UPDATE_FORM,
                                                                    payload:
                                                                    {
                                                                        name: item.name,
                                                                        type: 'MAP',
                                                                        added: true
                                                                    }
                                                                }
                                                            )*/
                                                        }}
                                                    >
                                                        <MaterialCommunityIcons
                                                            name="minus"
                                                            color={colors.getRandomMain()}
                                                            size={16}
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        })}
                                    </View>}
                                {item.type === 'BOOLEAN' &&
                                    <View
                                        style={{
                                            flex: item.info === undefined ? 0.7 : 0.62,
                                            alignItems: 'flex-start'
                                        }}
                                    >
                                        <Switch
                                            trackColor={{ false: 'red', true: 'green' }}
                                            thumbColor={!item.value ? "#f4f3f4" : "#f4f3f4"}
                                            ios_backgroundColor="#3e3e3e"
                                            onValueChange={(value) => {
                                                /*userDataStore.dispatch(
                                                    {
                                                        type: UPDATE_FORM,
                                                        payload:
                                                        {
                                                            name: item.name,
                                                            value: value
                                                        }
                                                    }
                                                )*/
                                            }}
                                            value={item.value}
                                            disabled={!isEditing}
                                        />
                                    </View>}
                                {item.type === 'NUMBER' && isEditing &&
                                    <TextInputMask
                                        includeRawValueInChangeText={true}
                                        onChangeText={(maskedText, rawText) => {
                                            /*userDataStore.dispatch(
                                                {
                                                    type: UPDATE_FORM,
                                                    payload:
                                                    {
                                                        name: item.name,
                                                        value: rawText
                                                    }
                                                }
                                            )*/
                                        }}
                                        options={{
                                            precision: item.decimals,
                                            separator: '.',
                                            delimiter: ',',
                                            unit: ' ',
                                            //prefixUnit: 'USD' + ' ',
                                            suffixUnit: ' ' + item.suffix
                                        }}
                                        editable={isEditing}
                                        value={item.value}
                                        type={'money'}
                                        style={{
                                            flex: item.info === undefined ? 0.7 : 0.62,
                                            borderBottomColor: 'silver',
                                            borderBottomWidth: 1,
                                        }}
                                    //placeholder={'Amount'}
                                    //placeholderTextColor={colors.placeholderText}
                                    />}
                                {item.type === 'NUMBER' && !isEditing &&
                                    <View
                                        style={{
                                            flex: item.info === undefined ? 0.7 : 0.62,
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: colors.text
                                            }}
                                        >
                                            {Number(item.value).toFixed(item.decimals)} {item.suffix}
                                        </Text>
                                    </View>}
                                {item.info !== undefined &&
                                    <View
                                        style={{
                                            flex: 0.08,
                                            alignItems: 'center'
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                Alert.alert('This info will be shared with other users', item.info, [
                                                    { text: "Ok" },
                                                ]);
                                            }}
                                        >
                                            <MaterialCommunityIcons
                                                name="information-outline"
                                                color={colors.getRandomMain()}
                                                size={25}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                }
                            </View>}
                    </Fragment >
                )
            })}
        </View>
    )
};

export default React.memo(compose(withColors)(Component));

const getPossibleValues = (possibleValues, values) => {
    let newPossibleValues: string[] = []
    possibleValues.map((item, index) => {
        if (!values.includes(item)) {
            newPossibleValues.push(item)
        }
    })
    if (newPossibleValues.length > 0) {
        newPossibleValues.unshift('Select value')
    }
    return newPossibleValues
}
