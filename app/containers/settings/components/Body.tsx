import React, { useCallback } from 'react';
import {
    View,
    Dimensions,
    Text,
    Switch,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import {
    Picker,
} from '@react-native-picker/picker'
import { compose } from 'redux'
import { connect } from "react-redux";
//STORES
import { store as settingsStore } from '../../../main/stores/settings';
//HOC
import { withColors } from '../../../main/hoc';

const mapStateToProps = state => {
    return {
        theme: state.theme,
        language: state.language,
        country: state.country,
        kaikaiWebConnected: state.kaikaiWebConnected,
    };
};

const ConnectedComponent = ({
    theme,
    language,
    country,
    kaikaiWebConnected,
    colors
}) => {

    //CALLBACKS
    const onValueChangeTheme = useCallback((item) => {
        settingsStore.dispatch({ type: 'SET_THEME', payload: item });
    }, [])

    const onValueChangeLanguage = useCallback((item) => {
        settingsStore.dispatch({ type: 'SET_LANGUAGE', payload: item });
    }, [])

    const onValueChangeCountry = useCallback((item) => {
        settingsStore.dispatch({ type: 'SET_COUNTRY', payload: item });
    }, [])

    const onValueChangeKaiKaiWebConnected = useCallback((value) => {
        if (value) {
            /*navigateStore.dispatch({
                type: NAVIGATE,
                payload: { target: "QRCodeScannerScreen", selectedOperation: 'SETTINGS__KAIKAI_WEB' },
              });*/
        } else {
            settingsStore.dispatch({ type: 'SET_KAIKAI_WEB_CONNECTED', payload: value })
        }
    }, [])

    return (
        <ScrollView
            style={{
                width: Dimensions.get('window').width * 0.95,
                alignSelf: 'center',
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10
                }}
            >
                <Text
                    style={{
                        flex: 0.25,
                        color: colors.text
                    }}
                >
                    appearance
                </Text>
                <Picker
                    style={{
                        backgroundColor: colors.primaryBackground,
                        borderRadius: 10,
                        flex: 0.75,
                    }}
                    itemStyle={{
                        height: 100,
                        fontSize: 14,
                    }}
                    enabled={true}
                    mode='dropdown'
                    dropdownIconColor={colors.icon}
                    selectedValue={theme}
                    onValueChange={onValueChangeTheme}
                //themeVariant={'dark'}
                >
                    {['light-content', 'dark-content'].map((item, key) => {
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
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10
                }}
            >
                <Text
                    style={{
                        flex: 0.25,
                        color: colors.text
                    }}
                >
                    language
                </Text>
                <Picker
                    style={{
                        backgroundColor: colors.primaryBackground,
                        borderRadius: 10,
                        flex: 0.75
                    }}
                    itemStyle={{
                        height: 100,
                        fontSize: 14,
                    }}
                    dropdownIconColor={colors.icon}
                    enabled={true}
                    mode='dropdown'
                    selectedValue={language}
                    onValueChange={onValueChangeLanguage}
                >
                    {['EN - English', 'ES - Español'].map((item, key) => {
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
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10
                }}
            >
                <Text
                    style={{
                        flex: 0.25,
                        color: colors.text
                    }}
                >
                    location
                </Text>
                <Picker
                    style={{
                        backgroundColor: colors.primaryBackground,
                        borderRadius: 10,
                        flex: 0.75
                    }}
                    itemStyle={{
                        height: 100,
                        fontSize: 14,
                    }}
                    enabled={true}
                    mode='dropdown'
                    dropdownIconColor={colors.icon}
                    selectedValue={country}
                    onValueChange={onValueChangeCountry}
                >
                    {['United States', 'Colombia', 'Argentina', 'Mexico'].map((item, key) => {
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
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10
                }}
            >
                <Text
                    style={{
                        flex: 0.25,
                        color: colors.text
                    }}
                >
                    kaikai web
                </Text>
                <View
                    style={{
                        flex: 0.50,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row'
                    }}
                >
                    <Switch
                        trackColor={{ false: "red", true: "green" }}
                        thumbColor={"#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={onValueChangeKaiKaiWebConnected}
                        value={kaikaiWebConnected}
                        disabled={false}
                        style={{
                            marginLeft: 2,
                            marginRight: 2
                        }}
                    />
                    <Text
                        style={{
                            marginLeft: 3,
                            color: colors.text
                        }}
                    >
                        {kaikaiWebConnected ? 'connected' : 'disconnected'}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => {

                    }}
                    style={{
                        flex: 0.25,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Text
                        style={{
                            flex: 0.25,
                            color: 'blue',
                            textDecorationLine: 'underline'
                        }}
                    >
                        show log
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
};


const Component = compose(withColors, connect(mapStateToProps))(ConnectedComponent)

export default React.memo(Component);