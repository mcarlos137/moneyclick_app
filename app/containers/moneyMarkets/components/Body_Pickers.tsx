//PRINCIPAL
import React from 'react';
import {
    Picker,
} from '@react-native-picker/picker'
//HOC
import { withColors } from '../../../main/hoc';
import { View } from 'react-native';

const Component = ({
    selectedCryptoCurrency,
    cryptoCurrencies,
    onValueChangeCryptoCurrency,
    selectedFiatCurrency,
    fiatCurrencies,
    onValueChangeFiatCurrency,
    selectedOperationType,
    operationTypes,
    onValueChangeOperationType,
    colors
}) => {

    //PRINCIPAL RENDER
    return (
        <View
            style={{
                flexDirection: 'row'
            }}
        >
            <Picker
                style={{
                    backgroundColor: colors.primaryBackground,
                    borderRadius: 10,
                    flex: 0.3,
                    marginRight: 5
                }}
                itemStyle={{
                    height: 100,
                    fontSize: 14,
                }}
                enabled={true}
                mode='dropdown'
                dropdownIconColor={colors.icon}
                selectedValue={selectedCryptoCurrency}
                onValueChange={onValueChangeCryptoCurrency}
            >
                {cryptoCurrencies.map((item, key) => {
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
                })}
            </Picker>
            <Picker
                style={{
                    backgroundColor: colors.primaryBackground,
                    borderRadius: 10,
                    flex: 0.3,
                    marginRight: 5
                }}
                itemStyle={{
                    height: 100,
                    fontSize: 14,
                }}
                enabled={true}
                mode='dropdown'
                dropdownIconColor={colors.icon}
                selectedValue={selectedFiatCurrency}
                onValueChange={onValueChangeFiatCurrency}
            >
                {fiatCurrencies.map((item, key) => {
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
                })}
            </Picker>
            <Picker
                style={{
                    backgroundColor: colors.primaryBackground,
                    borderRadius: 10,
                    flex: 0.3
                }}
                itemStyle={{
                    height: 100,
                    fontSize: 14,
                }}
                enabled={true}
                mode='dropdown'
                dropdownIconColor={colors.icon}
                selectedValue={selectedOperationType}
                onValueChange={onValueChangeOperationType}
            >
                {operationTypes.map((item, key) => {
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
                })}
            </Picker>
        </View>
    )
};

export default React.memo(withColors(Component));