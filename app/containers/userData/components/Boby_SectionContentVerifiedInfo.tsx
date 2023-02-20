import React, { Fragment } from "react";
import { Text, View, TouchableOpacity, processColor, Dimensions, TextInput, Switch, Alert } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { compose } from 'redux';
import { StackActions } from "@react-navigation/native";
import FastImage from "react-native-fast-image";
//HOC
import { withColors, withConfig, withHmacInterceptor, withNavigation, withRoute, withUserName } from "../../../main/hoc";
//TOOLS
import httpRequest from "../../../tools/httpRequest";

const Component = ({
    data,
    isEditing,
    navigation,
    route,
    colors,
    userName,
    hmacInterceptor,
    config
}) => {

    //COMPONENTS
    const renderItem = (key, item) => {
        return (
            <Fragment
                key={key}
            >
                {config?.others[item]?.endsWith('jpeg') || config?.others[item]?.endsWith('jpg') ?
                    <View
                        style={{
                            flexDirection: 'row',
                            alignSelf: 'center',
                            padding: 5,
                            alignItems: 'center'
                        }}
                    >
                        <Text
                            key={key}
                            style={{
                                textAlign: 'center',
                                color: colors.text,
                                //color: item.value.status === 'OK' ? 'green' : item.value.status === 'PROCESSING' ? 'orange' : item.value.status === 'FAIL' ? 'red' : 'grey',
                                padding: 5,
                            }}
                        >
                            {item + ': '}
                        </Text>
                        <FastImage
                            style={{
                                padding: 10,
                                width: 50,
                                height: 50
                            }}
                            source={{
                                uri: 'https://service8081.moneyclick.com/attachment/getUserFile/' + userName + '/' + config?.others[item],
                                //cache: FastImage.cacheControl.cacheOnly,
                                //method: 'GET',
                                headers: hmacInterceptor?.process(
                                    httpRequest.create(
                                        'https://service8081.moneyclick.com',
                                        '/attachment/getUserFile/' + userName + '/' + config?.others[item],
                                        'GET',
                                        null,
                                        false
                                    )).headers,
                            }}
                        />
                    </View>
                    :
                    <Text
                        key={key}
                        style={{
                            alignSelf: 'center',
                            textAlign: 'center',
                            color: colors.text,
                            //color: item.value.status === 'OK' ? 'green' : item.value.status === 'PROCESSING' ? 'orange' : item.value.status === 'FAIL' ? 'red' : 'grey',
                            padding: 5,
                        }}
                    >
                        {item + ': '} {config[item] !== undefined ? config[item] : config?.others[item] !== undefined ? config.others[item] : ''}
                    </Text>}
            </Fragment>
        )
    }

    //PRINCIPAL RENDER
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
                        {item.value !== undefined &&
                            <TouchableOpacity
                                style={{
                                    margin: 5,
                                    borderRadius: 10,
                                    flexDirection: 'row',
                                    backgroundColor: colors.primaryBackground
                                }}
                                disabled={item.value.status === 'OK'}
                                onPress={() => {
                                    navigation.dispatch(StackActions.push('VerificationScreen', { ...route.params, selectedVerificationType: item.name }))
                                }}
                            >
                                {item.value.status === 'OK' ?
                                    <View
                                        style={{
                                            flex: 0.9,
                                            alignSelf: 'center'
                                        }}
                                    >
                                        {config?.verifications[item.name]?.fieldNames.map((it, k) => renderItem(k, it))}
                                    </View> :
                                    <Text
                                        style={{
                                            alignSelf: 'center',
                                            textAlign: 'center',
                                            color: colors.text,
                                            //color: item.value.status === 'OK' ? 'green' : item.value.status === 'PROCESSING' ? 'orange' : item.value.status === 'FAIL' ? 'red' : 'grey',
                                            padding: 10,
                                            flex: 0.9
                                        }}
                                    >
                                        {item.text}
                                    </Text>
                                }
                                <MaterialIcons
                                    name={item.value.status === 'OK' ? 'check' : item.value.status === 'PROCESSING' ? 'cached' : item.value.status === 'FAIL' ? 'close' : 'add'}
                                    color={item.value.status === 'OK' ? 'green' : item.value.status === 'PROCESSING' ? 'orange' : item.value.status === 'FAIL' ? 'red' : 'grey'}
                                    size={25}
                                    style={{
                                        padding: 10,
                                        flex: 0.1
                                    }}
                                />
                            </TouchableOpacity>}
                    </Fragment>
                )
            })}
        </View>
    )
};

export default React.memo(compose(withNavigation, withRoute, withColors, withUserName, withHmacInterceptor, withConfig)(Component));
