//PRINCIPAL
import React, { ComponentClass, useEffect, useState } from 'react';
import {
    Dimensions,
    RefreshControl,
    ScrollView,
    View,
    Text
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion'
import { compose } from 'redux'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
//CONSTANTS
import { currencies as currenciesParams } from '../../constants/currenciesParams';
//HOC
import { withColors } from '../../main/hoc';
//HOOKS
import { getCharges } from './hooks/getCharges';

type ChargesScreen_Props = {
    navigation: any
    route: any
    colors: any
}

const ChargesScreen = ({ navigation, route, colors }) => {

    //INITIAL STATES
    const [activeSections, setActiveSections] = useState([0])

    //HOOKS CALLS
    const { isLoading, data, error, isFetching, refetch } = getCharges()

    //EFFECTS
    useEffect(() => {
        console.log('ChargesScreen', route.params)
    }, []);

    //COMPONENTS
    const renderHeader = (title, expanded) => (
        <View
            style={{
                flexDirection: 'row',
                padding: 15,
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
                borderRadius: 10,
                backgroundColor: colors.primaryBackground
            }}
        >
            <Text
                style={{
                    color: colors.text,
                    fontWeight: 'bold'
                }}
            >
                {title}
            </Text>
            {
                expanded ? (
                    <MaterialCommunityIcons
                        name="chevron-up"
                        color={colors.icon}
                        size={18}
                    />
                ) : (
                    <MaterialCommunityIcons
                        name="chevron-down"
                        color={colors.icon}
                        size={18}
                    />
                )
            }
        </View >
    )

    const renderContent = (data) => (
        <View
            style={{
                marginBottom: 10,
                marginTop: 1
            }}
        >
            {data.map((item, key) => {
                return (
                    <View
                        key={key}
                        style={{ flexDirection: 'row', marginBottom: 5 }}
                    >
                        <View style={{ flex: 0.8 }}>
                            <Text style={{ paddingLeft: 10, color: colors.text }}>{item.operationName}</Text>
                        </View>
                        <View style={{ flex: 0.2 }}>
                            <Text style={{ color: colors.text }}>{item.amount}</Text>
                        </View>
                    </View>
                );
            })}
        </View>
    )

    //PRINCIPAL RENDER
    return (
        <View style={{
            flex: 1
        }}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading || isFetching}
                        onRefresh={() => {
                            refetch()
                        }}
                        tintColor={colors.getRandomMain()}
                        colors={[colors.getRandomMain()]}
                    />
                }
                style={{
                    marginTop: 20,
                    width: Dimensions.get('window').width * 0.9,
                    alignSelf: 'center',
                }}>
                <Accordion
                    sections={data?.currencies || []}
                    activeSections={activeSections}
                    underlayColor={'transparent'}
                    renderHeader={(section, i, isActive, sections) => (renderHeader(currenciesParams[section].text, isActive))}
                    renderContent={(section) => (renderContent(data !== undefined && data[section]))}
                    onChange={(activeSections) => {
                        setActiveSections(activeSections)
                    }}
                />
            </ScrollView>
        </View >
    );
};

export default React.memo(compose(withColors)(ChargesScreen));

