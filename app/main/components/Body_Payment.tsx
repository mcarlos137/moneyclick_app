import React from 'react';
import { compose } from 'redux';
import { Text, TouchableOpacity, View } from 'react-native';
import { CommonActions } from '@react-navigation/native';
//HOC
import { withColors, withNavigation } from '../hoc';
//FUNCTIONS
import { getFieldName } from '../functions';

type Body_Payment_Props = {
    navigation: any
    item: any
    marginTop?: number
    marginBottom?: number
    colors: any
}

const Component = ({
    navigation,
    item,
    marginTop = 0,
    marginBottom = 5,
    colors
}: Body_Payment_Props) => {

    //PRINCIPAL RENDER
    return (
        <View
            style={{
                backgroundColor: colors.secundaryBackground,
                borderRadius: 10,
                padding: 10,
                marginLeft: 10,
                marginRight: 10,
                marginTop: marginTop,
                marginBottom: marginBottom,
            }}>
            <TouchableOpacity
                onPress={() => {
                    navigation.dispatch((state) => {
                        let params = { ...state.routes[state.routes.length - 1].params, selectedPayment: item }
                        const target = params.replaceTarget
                        delete params.replaceTarget
                        const routes = [...state.routes.slice(0, state.routes.length - 2), { name: target, params: params }];
                        return CommonActions.reset({
                            ...state,
                            routes,
                            index: routes.length - 1,
                        });
                    });
                }}
            >
                <View
                    style={{
                        flexDirection: 'column'
                    }}>
                    {delete item.messages}
                    {/*delete item.type*/}
                    {/*delete item.id*/}
                    {/*delete item.currency*/}
                    {/*delete item.automaticCharge*/}
                    {/*delete item.verified*/}
                    {/*delete item.mcVerified*/}
                    {Object.keys(item).filter(key =>
                        key !== 'id' &&
                        key !== 'type' &&
                        key !== 'currency' &&
                        key !== 'automaticCharge' &&
                        key !== 'verified' &&
                        key !== 'mcVerified' &&
                        key !== 'own'
                    ).map((key, i) => (
                        <View
                            key={i}
                            style={{
                                flexDirection: 'row',
                                marginBottom: 3
                            }}
                        >
                            <Text
                                style={{
                                    color: colors.text,
                                    fontWeight: 'bold',
                                    fontSize: 12,
                                    alignSelf: "flex-start",
                                }}
                            >
                                {getFieldName(key)}:
                            </Text>
                            <Text
                                style={{
                                    color: colors.text,
                                    fontSize: 12,
                                    alignSelf: "flex-start",
                                    marginLeft: 3
                                }}
                            >
                                {item[key]}
                            </Text>
                        </View>
                    ))}
                </View>
            </TouchableOpacity>
        </View>
    )
};

export default React.memo(compose(withNavigation, withColors)(Component));