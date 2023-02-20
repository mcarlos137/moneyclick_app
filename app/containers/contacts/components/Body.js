//PRINCIPAL
import React from 'react';
import {
    TextInput,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    Dimensions
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useTheme } from 'react-native-paper';
import { connect } from "react-redux";
//STORES
import {
    indexPersistedStore, indexStore
} from '../store'
import { navigateStore } from '../../../main/store';
//ACTIONS
import {
    NAVIGATE,
    SHOW_CONTACTS_FREQUENTS,
    SET_CONTACTS_TEXT_FILTER,
} from '../../../constants/action-types'

const renderItem3 = ({ item }) => (
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
                            navigateStore.dispatch(
                                {
                                    type: NAVIGATE, payload: {
                                        target: 'redirect__1',
                                        selectedPhone: {
                                            areaCode: j.split('__')[0],
                                            phone: j.split('__')[1],
                                            name: item.name
                                        },
                                        selectedChatRoom: {}
                                    }
                                }
                            )
                            indexPersistedStore.dispatch({ type: SET_CONTACTS_TEXT_FILTER, payload: '' })
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

const getItemLayout = (data, index) => ({
    length: 1000,
    offset: 1000 * index,
    index,
})

const filterFunction = (text) => {
    indexPersistedStore.dispatch({ type: SET_CONTACTS_TEXT_FILTER, payload: text })
}

const mapStateToProps = state => {
    return {
        phoneDataState: state.phoneDataState,
        frequentsDataState: state.frequentsDataState,
        showFrequentsState: state.showFrequentsState,
        isLoadingState: state.isLoadingState,
        textFilterState: state.textFilterState,
        numShowDataState: state.numShowDataState,
    };
};

const ConnectedComponent = ({
    phoneDataState,
    frequentsDataState,
    showFrequentsState,
    isLoadingState,
    textFilterState,
    numShowDataState,
}) => {
    const { colors } = useTheme();
    return (
        <>
            <View
                style={{
                    width: Dimensions.get('window').width * 0.9,
                    flexDirection: 'row',
                    paddingTop: 10,
                    alignSelf: 'center'
                }}>
                <View
                    regular
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
                        onChangeText={(text) => filterFunction(text)}
                        /*onFocus={() => {
                            this.setState({
                                paddingDinamic: 30,
                            });
                        }}
                        onBlur={() => {
                            this.setState({
                                paddingDinamic: 15,
                            });
                        }}*/
                        value={textFilterState}
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
                        borderColor: !showFrequentsState ? colors.border : indexStore.getState().selectedColorState,
                        backgroundColor: !showFrequentsState ? 'transparent' : indexStore.getState().selectedColorState,
                        justifyContent: 'center'
                    }}
                    onPress={() => {
                        indexPersistedStore.dispatch({ type: SET_CONTACTS_TEXT_FILTER, payload: '' })
                        indexPersistedStore.dispatch(
                            { type: SHOW_CONTACTS_FREQUENTS, payload: !showFrequentsState }
                        )
                    }}>
                    <Text
                        style={{
                            color: !showFrequentsState ? colors.text : 'white',
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
                {!isLoadingState && showFrequentsState && frequentsDataState.length > 0 &&
                    <FlatList
                        keyExtractor={item => item.name + item.phones.toString()}
                        key={item => item.name + item.phones.toString()}
                        data={frequentsDataState}
                        //renderItem={(item) => renderItem(item, showFrequentsState, textFilterState)}
                        renderItem={renderItem3}
                        //getItemLayout={getItemLayout}
                        initialNumToRender={frequentsDataState.length}
                    /*maxToRenderPerBatch={40}
                    windowSize={40}*/
                    />}
                {!isLoadingState && !showFrequentsState && phoneDataState.length > 0 &&
                    <FlatList
                        keyExtractor={item => item.name + item.phones.toString()}
                        key={item => item.name + item.phones.toString()}
                        data={textFilterState === '' ? phoneDataState : phoneDataState.filter(message => message.name.toUpperCase().includes(textFilterState.toUpperCase()))}
                        //renderItem={(item) => renderItem(item, showFrequentsState, textFilterState)}
                        renderItem={renderItem3}
                        removeClippedSubviews={true}
                        windowSize={100}
                        maxToRenderPerBatch={50}
                        //updatecellsbatchingperiod={2500}
                        initialNumToRender={100}
                        extraData={textFilterState}
                    /*getItemLayout={(data, index) => ({
                    length: phoneDataState.length + 15,
                    offset: (phoneDataState.length + 15 )* index,
                    index,
                    })}*/
                    />
                }
            </View>
        </ >
    )
};

const Component = connect(mapStateToProps)(ConnectedComponent);

export default Component;