import React, { useEffect, useRef, useState } from 'react';
import { Pressable, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Text } from 'react-native';
import { Animated, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
//HOC
import { withColors } from '../../../main/hoc';
//STORES
import { store as chatStore } from '../../../main/stores/chat';

const mapStateToProps = state => {
    return {
        openModal: state.openModal,
    };
};

const ConnectedComponent = ({ openModal, colors }) => {

    const translation = useRef(new Animated.Value(Dimensions.get('window').width)).current;

    if (openModal) {
        Animated.timing(translation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }
    if (!openModal) {
        Animated.timing(translation, {
            toValue: Dimensions.get('window').width,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }

    return (
        <Animated.View
            style={{
                position: 'absolute',
                top: 0,
                width: Dimensions.get('window').width,
                transform: [
                    { translateX: translation },
                ],
            }}
        >
            <Pressable
                onPress={() => {
                    chatStore.dispatch({ type: 'SET_OPEN_MODAL', payload: '' })
                }}
            >
                <View
                    style={{
                        height: 600,
                        width: Dimensions.get('window').width,
                        alignItems: 'flex-end',
                    }}
                >
                    <TouchableWithoutFeedback>
                        <View
                            style={{
                                width: 150,
                                alignItems: 'flex-start',
                                backgroundColor: colors.getRandomMain(),
                                paddingLeft: 5,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    console.log('SEE CONTACTS')
                                }}
                            >
                                <Text
                                    style={{
                                        color: 'white',
                                        fontSize: 12,
                                        paddingLeft: 10,
                                        paddingTop: 10,
                                        textAlign: 'center',
                                    }}
                                >
                                    {'See contact'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    console.log('FILES, LINKS AND DOCS')
                                }}
                            >
                                <Text
                                    style={{
                                        color: 'white',
                                        fontSize: 12,
                                        paddingLeft: 10,
                                        paddingTop: 10,
                                        textAlign: 'center',
                                    }}
                                >
                                    {'Files, links and docs'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    console.log('FIND')
                                }}
                            >
                                <Text
                                    style={{
                                        color: 'white',
                                        fontSize: 12,
                                        paddingLeft: 10,
                                        paddingTop: 10,
                                        textAlign: 'center',
                                    }}
                                >
                                    {'Find'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    console.log('SILENCE NOTIFICATIONS')
                                }}
                            >
                                <Text
                                    style={{
                                        color: 'white',
                                        fontSize: 12,
                                        paddingLeft: 10,
                                        paddingTop: 10,
                                        textAlign: 'center',
                                    }}
                                >
                                    {'Silence notifications'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    console.log('SCREEN BACKGROUND')
                                }}
                            >
                                <Text
                                    style={{
                                        color: 'white',
                                        fontSize: 12,
                                        paddingLeft: 10,
                                        paddingTop: 10,
                                        paddingBottom: 10,
                                        textAlign: 'center',
                                    }}
                                >
                                    {'Screen background'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </Pressable>
        </Animated.View>
    );
}

export default React.memo(compose(withColors, connect(mapStateToProps))(ConnectedComponent))