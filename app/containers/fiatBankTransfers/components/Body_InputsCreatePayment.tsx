import React from 'react';
import {
    View,
    TextInput,
    Text
} from 'react-native';
import {
    Picker,
} from '@react-native-picker/picker'
//HOC
import { withColors } from '../../../main/hoc';

const Component: any = ({
    financialType,
    allowedOwnership,
    payment,
    firstName,
    lastName,
    addToPayment,
    colors
}) => {
    return (
        <View
            style={{
                marginTop: 10
            }}
        >
            {financialType?.fields?.map((value, key) => {
                if (!value.required) {
                    return;
                }
                if (value.values !== undefined) {
                    return (
                        <Picker
                            key={key}
                            style={{
                                backgroundColor: colors.primaryBackground,
                                borderRadius: 10,
                                marginBottom: 5
                            }}
                            itemStyle={{
                                height: 100,
                                fontSize: 14,
                            }}
                            enabled={true}
                            mode='dropdown'
                            dropdownIconColor={colors.icon}
                            selectedValue={payment[value.name]}
                            onValueChange={(item) => addToPayment({ key: value.name, value: item })}
                        >
                            {value.values.map((item, key) => {
                                return (
                                    <Picker.Item
                                        key={key}
                                        color={colors.text}
                                        label={item}
                                        value={item}
                                        style={{
                                            color: colors.text,
                                            backgroundColor: colors.primaryBackground
                                        }}
                                    />
                                );
                            })
                            }
                        </Picker>
                    );
                } else {
                    return (
                        <View
                            key={key}
                        >
                            {value.name === 'accountHolderName' && allowedOwnership === 'own' ?
                                <View
                                    style={{
                                        backgroundColor: colors.primaryBackground,
                                        padding: 10,
                                        borderRadius: 10,
                                        marginBottom: 5
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            color: colors.text,
                                        }}
                                    >
                                        {payment[value.name]}
                                    </Text>
                                </View>
                                :
                                <TextInput
                                    style={{
                                        fontSize: 14,
                                        color: colors.text,
                                        backgroundColor: colors.primaryBackground,
                                        padding: 10,
                                        borderRadius: 10,
                                        marginBottom: 5
                                    }}
                                    placeholder={value.name}
                                    onChangeText={text => addToPayment({ key: value.name, value: text })}
                                    value={payment[value.name]}
                                    placeholderTextColor={colors.placeholderText}
                                    editable={true}
                                />
                            }
                        </View>
                    );
                }
            })}
            {/*this.props.typePaymentMethod === 'THIRDS' && (
            <View
                key={'email'}
                disabled={this.props.defaultEmail === true}
                style={{ borderBottomColor: constants.PRIMARY_COLOR }}
            >
                <TextInput
                    editable={this.props.defaultEmail === false}
                    autoCompleteType='email'
                    keyboardType='email-address'
                    textContentType='emailAddress'
                    autoCapitalize='none'
                    value={this.props.emailReceiver}
                    style={
                        this.props.defaultEmail === true
                            ? { color: constants.COLOR_GRAY }
                            : {}
                    }
                    placeholder={strings('common.dynamicForm.labels.emailReceiver')}
                    onChangeText={(text) =>
                        this.onChangueValue('emailReceiver', text)
                    }
                    placeholderTextColor={colors.placeholderText}
                />
            </View>
                )*/}
            {/*this.props.errorEmail && (
            <Text style={appStyle.textStyle}>{this.props.message}</Text>
        )*/}
        </View>
    )
};

export default React.memo(withColors(Component));
