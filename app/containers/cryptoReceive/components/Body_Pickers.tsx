//PRINCIPAL
import React from 'react';
import {
    Picker,
} from '@react-native-picker/picker'
//HOC
import { withColors } from '../../../main/hoc';

const Component = ({
    selectedCurrency,
    currencies,
    currencyProtocol,
    onValueChangeCurrency,
    onValueChangeProtocol,
    colors
}) => {

    //PRINCIPAL RENDER
    return (
        <>
            <Picker
                style={{
                    backgroundColor: colors.primaryBackground,
                    borderRadius: 10,
                }}
                itemStyle={{
                    height: 100,
                    fontSize: 14,
                }}
                enabled={true}
                mode='dropdown'
                dropdownIconColor={colors.icon}
                selectedValue={currencies.find(currency => currency.value === selectedCurrency?.value)}
                onValueChange={onValueChangeCurrency}
            >
                {currencies.map((item, key) => {
                    return (
                        <Picker.Item
                            key={key}
                            color={colors.text}
                            label={item.text}
                            value={item}
                            style={{
                                color: colors.text,
                                backgroundColor: colors.primaryBackground,
                            }}
                        />
                    );
                })}
            </Picker>
            {selectedCurrency.protocols !== undefined &&
                <Picker
                    style={{
                        backgroundColor: colors.primaryBackground,
                        borderRadius: 10,
                        marginTop: 10,
                    }}
                    itemStyle={{
                        height: 100,
                        fontSize: 14,
                    }}
                    enabled={true}
                    mode='dropdown'
                    dropdownIconColor={colors.icon}
                    selectedValue={currencyProtocol}
                    onValueChange={onValueChangeProtocol}
                >
                    {selectedCurrency.protocols.map((item, key) => {
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
                </Picker>}
        </>
    )
};

export default React.memo(withColors(Component));