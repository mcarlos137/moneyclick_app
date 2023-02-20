import React from 'react';
import { Text, TouchableOpacity, Dimensions, View } from 'react-native';
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import { NumericFormat } from 'react-number-format';
//FUNCTIONS
import { decorateTimestamp, getIconName } from '../../../main/functions';
import { withColors } from '../../../main/hoc';

const Component = ({ selectedItem, onPress, colors }) => {

    //PRINCIPAL RENDER
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                width: Dimensions.get('window').width * 0.95,
                padding: 10,
                borderBottomColor: colors.border,
                borderBottomWidth: 1,
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'flex-start',
                }}
            >
                {getIconName(selectedItem.parts[0].balanceOperationType) === 'exchange' ?
                    <IconFontAwesome
                        name={'exchange'}
                        color={colors.icon}
                        size={35}
                    />
                    :
                    <IconMaterialCommunity
                        name={getIconName(selectedItem.parts[0].balanceOperationType)}
                        color={colors.icon}
                        size={35}
                        style={{ marginRight: 7 }}
                    />}
                <View>
                    <Text
                        style={{
                            color: colors.text,
                            fontWeight: "bold",
                            fontSize: Dimensions.get('window').width * 0.06
                        }}
                    >
                        {selectedItem.parts.length === 2
                            ? ' ' + selectedItem.parts[0].currency + ' -> ' + selectedItem.parts[1].currency
                            : ' ' + selectedItem.parts[0].currency
                        }
                    </Text>
                    <Text
                        style={[{
                            fontSize: 10,
                            color: colors.text,
                            paddingLeft: 7,
                        }]}
                    >
                        {decorateTimestamp(selectedItem.parts[0].timestamp)}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        alignContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'flex-end',
                        flex: 1,
                        paddingRight: 4,
                        paddingBottom: 6
                    }}>
                    <NumericFormat
                        value={
                            selectedItem.parts[selectedItem.parts.length === 2 ? 1 : 0].amount
                        }
                        displayType={'text'}
                        thousandSeparator={true}
                        decimalScale={
                            selectedItem.parts[selectedItem.parts.length === 2 ? 1 : 0].currency === 'BTC' ||
                                selectedItem.parts[selectedItem.parts.length === 2 ? 1 : 0].currency === 'ETH'
                                ? 8 : 2
                        }
                        renderText={(value) => (
                            <Text
                                style={[
                                    {
                                        color: selectedItem.parts[selectedItem.parts.length === 2 ? 1 : 0].operationType === 'ADD' ? '#4c9917' : 'red',
                                        fontWeight: 'bold'
                                    },
                                    { fontSize: Dimensions.get('window').width * 0.06 },
                                ]}
                            >
                                {value}
                            </Text>
                        )}
                    />
                </View>
                {selectedItem.parts[0].balanceOperationStatus === 'PROCESSING' &&
                    <View
                        style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                            marginLeft: 5,
                            marginTop: 4,
                        }}
                    >
                        <IconFontAwesome
                            name="clock-o"
                            color={'#055986'}
                            size={22}
                        />
                    </View>}
                {selectedItem.parts[0].balanceOperationStatus === 'OK' &&
                    <View
                        style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                            marginLeft: 5,
                            marginTop: 4,
                        }}
                    >
                        <IconFontAwesome
                            name="check-circle"
                            color={'#4c9917'}
                            size={22}
                        />
                    </View>}
                {selectedItem.parts[0].balanceOperationStatus === 'FAIL' &&
                    <View
                        style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                            marginLeft: 5,
                            marginTop: 4,
                        }}
                    >
                        <IconFontAwesome
                            name="times-circle"
                            color={'red'}
                            size={22}
                        />
                    </View>}
            </View>
        </TouchableOpacity >
    )
};

export default React.memo(withColors(Component));