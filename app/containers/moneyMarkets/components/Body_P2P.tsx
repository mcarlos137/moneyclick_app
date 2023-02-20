import React, { useCallback, useEffect, useState } from "react"
import { ActivityIndicator, Dimensions, FlatList, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { compose } from "redux"
import { StackActions } from "@react-navigation/native"
//WEBSOCKETS
import {
    wsArray,
    close,
    start,
} from '../../../main/websockets/getOrdersBook'
//HOC
import { withColors, withDetailedBalances, withNavigation, withRoute } from "../../../main/hoc"
//CONSTANTS
import paymentTypes from '../../../constants/paymentTypes'
import minAmounts from "../../../constants/minAmounts"
//COMPONENTS
import ViewEmptyList from "../../../main/components/ViewEmptyList"
import Body_Picker from "../../../main/components/Body_Picker"

const Component = ({ navigation, route, colors, detailedBalances }) => {

    //INITIAL STATES
    const [fiatCurrency, setFiatCurrency] = useState<any>(detailedBalances.find(currency => !currency.isCrypto))
    const [cryptoCurrency, setCryptoCurrency] = useState<any>(detailedBalances.find(currency => currency.isCrypto))
    const [paymentType, setPaymentType] = useState(paymentTypes[fiatCurrency.value][0])
    const [operationType, setOperationType] = useState('BUY')
    const [data, setData] = useState<any[]>([])
    const [noData, setNoData] = useState(false)

    //EFFECTS
    useEffect(() => {
        //const pairs = ['BTCVES', 'BTCARS', 'BTCCOP']
        start(cryptoCurrency + '' + fiatCurrency, ['ASK'], addData)
        return () => {
            close(wsArray)
        }
    }, [])

    useEffect(() => {
        setPaymentType(paymentTypes[fiatCurrency.value][0])
        close(wsArray)
        setData([])
        setNoData(false)
        start(cryptoCurrency.value + '' + fiatCurrency.value, operationType === 'BUY' ? ['ASK'] : ['BID'], addData)
    }, [cryptoCurrency, fiatCurrency, operationType])

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (data.length === 0 || data?.filter(item => item.paymentType === paymentType).length === 0) {
                setNoData(true)
                clearTimeout(timeout)
            }
        }, 5000)
        return () => clearTimeout(timeout)
    }, [data, paymentType])

    //CALLBACKS
    const addData = useCallback(data => {
        let newData: any[] = [];
        data.map(item => {
            const newItem: any = { id: item.timestamp, price: Number(item.price).toFixed(2), userName: item.postUserName, nickName: item.postNickName, paymentType: item.paymentType !== undefined ? item.paymentType : getPaymentType(fiatCurrency.value), minAmount: Number(minAmounts[fiatCurrency.value]).toFixed(2), maxAmount: operationType === 'BUY' ? Number(item.price * item.amount).toFixed(2) : Number(item.amount).toFixed(2), conditions: item.conditions }
            newData.push(newItem)
        })
        setData(newData)
    }, [fiatCurrency, operationType])

    //FUNCTIONS
    const getPaymentType = (fiatCurrency) => {
        if (paymentTypes[fiatCurrency] !== undefined) {
            return paymentTypes[fiatCurrency][Math.floor(Math.random() * paymentTypes[fiatCurrency].length)]
        }
        return 'N/A'
    }

    //COMPONENTS
    const renderItem = (item) => {
        return (
            <View
                key={item.index}
                style={{
                    flexDirection: 'row',
                    marginBottom: 10,
                    height: 50,
                    alignItems: 'center',
                    padding: 5,
                    borderRadius: 5,
                    backgroundColor: item.index % 2 === 0 ? colors.primaryBackground : colors.secundaryBackground
                }}
            >
                <Text
                    style={{
                        flex: 0.3,
                        color: colors.text,
                        fontSize: 10
                    }}
                >

                    {item.item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
                <Text
                    style={{
                        flex: 0.35,
                        color: colors.text,
                        fontSize: 10
                    }}
                >
                    {item.item.nickName}
                </Text>
                <View
                    style={{
                        flex: 0.35,
                        alignItems: 'center'
                    }}
                >
                    <Text
                        style={{
                            color: colors.text,
                            fontSize: 10,
                            marginBottom: 5
                        }}
                    >
                        {item.item.paymentType}
                    </Text>
                    <Text
                        style={{
                            color: colors.text,
                            fontSize: 10
                        }}
                    >
                        {item.item.minAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} - {item.item.maxAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        navigation.dispatch(StackActions.push('OrdersTakeScreen', { ...route.params, selectedOrder: { ...item.item, operationType: operationType, fiatCurrencyValue: fiatCurrency.value, cryptoCurrencyValue: cryptoCurrency.value } }))
                    }}
                    style={{
                        backgroundColor: operationType === 'BUY' ? 'green' : 'red',
                        marginLeft: 5,
                        borderRadius: 5,
                        padding: 7
                    }}
                >
                    <Text
                        style={{
                            color: 'white'
                        }}
                    >
                        {operationType}
                    </Text>
                </TouchableOpacity>
            </View>)
    }

    return (
        <View
            style={{
                width: Dimensions.get('window').width,
                alignItems: 'center'
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    width: Dimensions.get('window').width * 0.95
                }}
            >
                <Body_Picker
                    selectedValue={
                        operationType === 'BUY' ?
                            detailedBalances.find(currency => currency.value === fiatCurrency.value)
                            :
                            detailedBalances.find(currency => currency.value === cryptoCurrency.value)
                    }
                    values={detailedBalances.filter(currency => (currency.isCrypto && operationType === 'SELL' || !currency.isCrypto && operationType === 'BUY'))}
                    onValueChange={(value) => {
                        operationType === 'BUY' ?
                            setFiatCurrency(value)
                            :
                            setCryptoCurrency(value)
                    }}
                    marginRight={5}
                    flex={1}
                    labelField={'text'}
                />
                <Body_Picker
                    selectedValue={
                        operationType === 'SELL' ?
                            detailedBalances.find(currency => currency.value === fiatCurrency.value)
                            :
                            detailedBalances.find(currency => currency.value === cryptoCurrency.value)
                    }
                    values={detailedBalances.filter(currency => (!currency.isCrypto && operationType === 'SELL' || currency.isCrypto && operationType === 'BUY'))}
                    onValueChange={(value) => {
                        operationType === 'SELL' ?
                            setFiatCurrency(value)
                            :
                            setCryptoCurrency(value)
                    }}
                    flex={1}
                    labelField={'text'}
                />
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    width: Dimensions.get('window').width * 0.95,
                    marginTop: 5
                }}
            >
                <Body_Picker
                    selectedValue={paymentType}
                    values={paymentTypes[fiatCurrency.value]}
                    onValueChange={(value) => { setPaymentType(value) }}
                    marginRight={5}
                    flex={1}
                />
                <Body_Picker
                    selectedValue={operationType}
                    values={['BUY', 'SELL']}
                    onValueChange={(value) => { setOperationType(value) }}
                    flex={0.4}
                />
            </View>
            {/*<Body_Pickers
                selectedCryptoCurrency={cryptoCurrency}
                cryptoCurrencies={['BTC', 'USDT', 'ETH']}
                onValueChangeCryptoCurrency={(value) => setCryptoCurrency(value)}
                selectedFiatCurrency={fiatCurrency}
                fiatCurrencies={['VES', 'COP', 'USD', 'ARS']}
                onValueChangeFiatCurrency={(value) => setFiatCurrency(value)}
                selectedOperationType={operationType}
                operationTypes={['BUY', 'SELL']}
                onValueChangeOperationType={(value) => setOperationType(value)}
        />*/}
            {(data.length === 0 || data?.filter(item => item.paymentType === paymentType).length === 0) && !noData &&
                <ActivityIndicator
                    size="large"
                    animating={true}
                    color={colors.getRandomMain()}
                    style={{
                        marginTop: 10
                    }}
                />
            }
            {noData && (data.length === 0 || data?.filter(item => item.paymentType === paymentType).length === 0) &&
                <ViewEmptyList
                    iconName='list-circle-outline'
                    iconFamily='ION'
                    message={'There is no available orders'}
                    top={30}
                    position={'relative'}
                    color='gray'
                />
            }
            <FlatList
                data={data?.filter(item => item.paymentType === paymentType)}
                renderItem={renderItem}
                keyExtractor={item => String(item.id)}
                style={{
                    marginTop: 10,
                    width: '90%',
                }}
            />
        </View>
    )
}

export default React.memo(compose(withNavigation, withRoute, withColors, withDetailedBalances)(Component))