//PRINCIPAL
import React from 'react';
import {
    Text,
    View,
    FlatList,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    LogBox,
    Icon,
    Button,
    Dimensions,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Platform,
} from 'react-native';
import {
    Picker,
} from '@react-native-picker/picker'
import { connect } from "react-redux";
import NumberFormat from 'react-number-format';
import { TextInputMask } from 'react-native-masked-text';
import { useTheme } from 'react-native-paper';
//CONSTANTS
import currenciesParams from '../../../constants/currenciesParams'
//STORES
import {
    navigateStore
} from '../../../main/store'
import {
    indexStore
} from '../store'
import {
    indexStore as subscriptionStore
} from '../../subscription/store'
//ACTIONS
import {
    NAVIGATE,
    SET_ORDER_BOOK_BASE_AMOUNT,
    SET_ORDER_BOOK_ASSET_AMOUNT,
    SET_ORDER_BOOK_PRICE,
    SET_ORDER_BOOK_TIME_PERIOD,
    SET_ORDER_BOOK_TIME_PERIOD_UNIT,
    SET_ORDER_BOOK_SUBSCRIPTION,
} from '../../../constants/action-types';
//FUNCTIONS
import {
    getPairComponents,
    openConfirmationModal
} from '../../../main/functions'
//COMPONENTS
import Body_PickerOperationType from './Body_PickerOperationType'
import Body_PickerPriceType from './Body_PickerPriceType'
import Body_PickerPair from './Body_PickerPair'
import ViewMaxAmount from '../../../main/components/ViewMaxAmount'

const getSubscriptionPickerItems = (data) => {
    if (data[0].name !== '') {
        data.unshift({ name: '', id: null })
    }
    return data
}

const keyExtractor = (item) => (
    String(item.index)
)

const renderItem = (item, pair) => (
    <View
        key={item.index}
        style={{
            flexDirection: 'row',
        }}
    >
        <NumberFormat
            value={item.item.count}
            displayType={'text'}
            thousandSeparator={true}
            decimalScale={0}
            renderText={(value) => (
                <Text
                    style={{
                        flex: 0.6,
                        fontSize: 12,
                        textAlign: 'center'
                    }}
                >
                    {value}
                </Text>
            )}
        />
        <NumberFormat
            value={item.item.amount}
            displayType={'text'}
            thousandSeparator={true}
            decimalScale={pair.includes('BTC') ? 8 : 2}
            renderText={(value) => (
                <Text
                    style={{
                        flex: 1.2,
                        fontSize: 12,
                        textAlign: 'center'
                    }}
                >
                    {value}
                </Text>
            )}
        />
        <NumberFormat
            value={item.item.total}
            displayType={'text'}
            thousandSeparator={true}
            decimalScale={pair.includes('BTC') ? 8 : 2}
            renderText={(value) => (
                <Text
                    style={{
                        flex: 1.2,
                        fontSize: 12,
                        textAlign: 'center'
                    }}
                >
                    {value}
                </Text>
            )}
        />
        <NumberFormat
            value={item.item.price}
            displayType={'text'}
            thousandSeparator={true}
            decimalScale={2}
            renderText={(value) => (
                <Text
                    style={{
                        flex: 1.8,
                        fontSize: 12,
                        textAlign: 'center'
                    }}
                >
                    {value}
                </Text>
            )}
        />
    </View>
)

const getItemLayout = (data, index) => ({
    length: data.length,
    offset: data.length * index,
    index,
})

const mapStateToProps = state => {
    return {
        pairState: state.pairState,
        dataChartState: state.dataChartState,
        operationTypeState: state.operationTypeState,
        priceTypeState: state.priceTypeState,
        priceState: state.priceState,
        assetAmountState: state.assetAmountState,
        baseAmountState: state.baseAmountState,
        maxAmountState: state.maxAmountState,
        timePeriodState: state.timePeriodState,
        timePeriodUnitState: state.timePeriodUnitState,
        subscriptionState: state.subscriptionState,
    };
};

const ConnectedComponent = ({
    pairState,
    dataChartState,
    operationTypeState,
    priceTypeState,
    priceState,
    assetAmountState,
    baseAmountState,
    maxAmountState,
    timePeriodState,
    timePeriodUnitState,
    subscriptionState,
}) => {
    const { colors } = useTheme();
    return (
        <KeyboardAvoidingView
            behavior={"position"}
            style={{
                width: Dimensions.get('window').width * 0.95,
                alignSelf: 'center',
                flex: 1
            }}
            enabled={true}
            keyboardVerticalOffset={Platform.OS === "ios" ? (priceTypeState === 'MARKET_PRICE' ? -20 : 40) : (priceTypeState === 'MARKET_PRICE' ? -10 : 0)}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <>
                    <ScrollView>
                        <View
                            style={{
                                marginTop: 10,
                                flexDirection: 'column',
                            }}
                        >
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                marginTop: 10
                            }}
                        >
                            <TextInputMask
                                editable={priceTypeState === 'USER_PRICE'}
                                includeRawValueInChangeText={true}
                                onChangeText={(maskedText, rawText) => {
                                    indexStore.dispatch(
                                        { type: SET_ORDER_BOOK_PRICE, payload: rawText }
                                    )
                                }}
                                options={{
                                    precision: 2,
                                    separator: '.',
                                    delimiter: ',',
                                    unit: currenciesParams[getPairComponents(pairState)[1]].symbol + '/' + currenciesParams[getPairComponents(pairState)[0]].symbol + ' ',
                                    prefixUnit: currenciesParams[getPairComponents(pairState)[1]].symbol + '/' + currenciesParams[getPairComponents(pairState)[0]].symbol + '',
                                }}
                                value={priceState}
                                type={'money'}
                                placeholder={'Price'}
                                placeholderTextColor={colors.placeholderText}
                                style={{
                                    fontSize: 14,
                                    color: colors.text,
                                    backgroundColor: colors.primaryBackground,
                                    width: Dimensions.get('window').width * 0.46,
                                    padding: 10,
                                    borderRadius: 10
                                }}
                            />
                            <View
                                style={{
                                    width: Dimensions.get('window').width * 0.03,
                                }} />
                            <View
                                style={{
                                    width: Dimensions.get('window').width * 0.46,
                                    flexDirection: 'row',
                                }}>
                                {priceTypeState === 'USER_PRICE' &&
                                    <>
                                        <TextInputMask
                                            includeRawValueInChangeText={true}
                                            onChangeText={(maskedText, rawText) => {
                                                indexStore.dispatch(
                                                    { type: SET_ORDER_BOOK_TIME_PERIOD, payload: rawText }
                                                )
                                            }}
                                            options={{
                                                precision: 0,
                                                separator: ' ',
                                                delimiter: ',',
                                            }}
                                            value={timePeriodState}
                                            type={'only-numbers'}
                                            placeholder={'Time period'}
                                            placeholderTextColor={colors.placeholderText}
                                            maxLength={2}
                                            style={{
                                                width: Dimensions.get('window').width * 0.10,
                                                fontSize: 14,
                                                color: colors.text,
                                                backgroundColor: colors.primaryBackground,
                                                padding: 10,
                                                borderRadius: 10
                                            }}
                                        />
                                        <View
                                            style={{
                                                width: Dimensions.get('window').width * 0.03,
                                            }} />
                                        <Picker
                                            style={{
                                                backgroundColor: colors.primaryBackground,
                                                borderRadius: 10,
                                                width: Dimensions.get('window').width * 0.33,
                                            }}
                                            itemStyle={{
                                                height: 100,
                                                fontSize: 14,
                                            }}
                                            enabled={true}
                                            mode='dropdown'
                                            dropdownIconColor={colors.icon}
                                            selectedValue={timePeriodUnitState}
                                            onValueChange={
                                                (item) => {
                                                    indexStore.dispatch(
                                                        { type: SET_ORDER_BOOK_TIME_PERIOD_UNIT, payload: item }
                                                    )
                                                }
                                            }
                                        >
                                            {['minutes', 'hours', 'days'].map((item, key) => {
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
                                    </>}
                            </View>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                marginTop: 10
                            }}
                        >
                            <TextInputMask
                                includeRawValueInChangeText={true}
                                onChangeText={(maskedText, rawText) => {
                                    indexStore.dispatch(
                                        { type: SET_ORDER_BOOK_ASSET_AMOUNT, payload: rawText }
                                    )
                                }}
                                options={{
                                    precision: pairState.includes('BTC') ? 8 : 2,
                                    separator: '.',
                                    delimiter: ',',
                                    unit: currenciesParams[getPairComponents(pairState)[0]].symbol + ' ',
                                    prefixUnit: currenciesParams[getPairComponents(pairState)[0]].symbol + '',
                                }}
                                value={assetAmountState}
                                type={'money'}
                                placeholder={'Amount'}
                                placeholderTextColor={colors.placeholderText}
                                style={{
                                    width: Dimensions.get('window').width * 0.46,
                                    fontSize: 14,
                                    color: colors.text,
                                    backgroundColor: colors.primaryBackground,
                                    padding: 10,
                                    borderRadius: 10
                                }}
                            />
                            <View
                                style={{
                                    width: Dimensions.get('window').width * 0.03,
                                }} />
                            <TextInputMask
                                includeRawValueInChangeText={true}
                                onChangeText={(maskedText, rawText) => {
                                    indexStore.dispatch(
                                        { type: SET_ORDER_BOOK_BASE_AMOUNT, payload: rawText }
                                    )
                                }}
                                options={{
                                    precision: 2,
                                    separator: '.',
                                    delimiter: ',',
                                    unit: currenciesParams[getPairComponents(pairState)[1]].symbol + ' ',
                                    prefixUnit: currenciesParams[getPairComponents(pairState)[1]].symbol + '',
                                }}
                                value={baseAmountState}
                                type={'money'}
                                placeholder={'Amount'}
                                placeholderTextColor={'silver'}
                                style={{
                                    width: Dimensions.get('window').width * 0.46,
                                    fontSize: 14,
                                    color: colors.text,
                                    backgroundColor: colors.primaryBackground,
                                    padding: 10,
                                    borderRadius: 10
                                }}
                            />
                        </View>
                        {operationTypeState === 'BUY'
                            ?
                            <ViewMaxAmount
                                symbol={currenciesParams[getPairComponents(pairState)[1]].symbol}
                                decimals={2}
                                maxAmount={maxAmountState}
                                message={'Available balance:'}
                            />
                            :
                            <ViewMaxAmount
                                symbol={currenciesParams[getPairComponents(pairState)[0]].symbol}
                                decimals={pairState.includes('BTC') ? 8 : 2}
                                maxAmount={maxAmountState}
                                message={'Available balance:'}
                            />
                        }
                        <TouchableOpacity
                            style={{
                                backgroundColor: navigateStore.getState().selectedColorState,
                                marginTop: 20,
                                borderRadius: 10
                            }}
                            onPress={() => {
                                openConfirmationModal(
                                    'ORDER_BOOK',
                                    [
                                        { name: 'AMOUNT', value: baseAmountState, type: 'NUMERIC' },
                                        { name: 'PRICE', value: priceState, type: 'NUMERIC' },
                                    ],
                                    {
                                        currency: currenciesParams[getPairComponents(pairState)[1]].symbol,
                                        amount: baseAmountState,
                                        chargeType: 'MC_TAKE_MESSAGE_OFFER',
                                    }
                                );
                            }}
                        >
                            <Text
                                style={{
                                    alignSelf: 'center',
                                    color: 'white',
                                    padding: 10
                                }}
                            >
                                {operationTypeState}
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
};

const Component = connect(mapStateToProps)(ConnectedComponent);

export default Component;