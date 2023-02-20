import { StackActions } from "@react-navigation/native"
import React, { useEffect, useState } from "react"
import { Dimensions, FlatList, processColor, Text, TouchableOpacity, View } from "react-native"
import { compose } from "redux"
//COMPONENTS
import Body_Chart from './Body_Chart'
//HOC
import { withColors, withNavigation, withRoute } from "../../../main/hoc"

const Component = ({ navigation, route, colors }) => {

    //VARIABLES
    const wsArray: any[] = [];

    //INITIAL STATES
    const [initiated, setInitiated] = useState(false)
    const [pairs, setPairs] = useState<string[]>([])
    const [selectedTab, setSelectedTab] = useState(0)
    const [previousDataChart, setPreviousDataChart] = useState({})
    const [finalDataChart, setFinalDataChart] = useState({})

    //EFFECTS
    useEffect(() => {
        console.log('MoneyMarketScreen', route.params)
        if (initiated) return
        setInitiated(true)
        //const pairs = ['BTCVES', 'USDVES', 'BTCARS', 'BTCCOP', 'EURUSD', 'USDMXN', 'USDCOP', 'USDARS']
        const pairs = ['USDVES', 'EURUSD', 'USDMXN', 'USDCOP', 'USDARS']
        setPairs(pairs)
        let timeDelay = 0
        Object.entries(pairs).forEach(([key, value]) => {
            setTimeout(() => {
                let ws: any = new WebSocket('wss://websocket.moneyclick.com/moneyMarket')
                ws.onopen = (e) => {
                    console.log('Open!')
                    ws.send(JSON.stringify({
                        method: 'getCandles',
                        params: {
                            pair: value,
                            period: '4H',
                        }
                    }))
                }
                ws.onmessage = ({ data }) => {
                    let dataParsed = JSON.parse(data)
                    let pair = dataParsed.params.pair;
                    let candles = dataParsed.params.data;
                    let finalData = {};
                    finalData[pair] = [];
                    Object.entries(candles).forEach(([key, value]) => {
                        //console.log('addValue ' + JSON.stringify(value))
                        finalData[pair].unshift(value);
                    })
                    setPreviousDataChart(finalData)
                }
                ws.onerror = (e) => {
                    console.log('error ' + JSON.stringify(e))
                }
                ws.onclose = (e) => {
                    console.log('close')
                }
                wsArray.push(ws)
            }, timeDelay)
            timeDelay = timeDelay + 3000
        })
    }, [])

    useEffect(() => {
        let dataChart = JSON.parse(JSON.stringify(finalDataChart));
        Object.entries(previousDataChart).forEach(([key, value]: [string, any]) => {
            if (dataChart[key] === undefined) {
                dataChart[key] = {
                    dataSets: [{
                        values: [],
                        label: 'Prices',
                        config: {
                            highlightColor: processColor('darkgray'),
                            shadowColor: processColor('black'),
                            shadowWidth: 1,
                            shadowColorSameAsCandle: true,
                            increasingColor: processColor('#71BD6A'),
                            increasingPaintStyle: 'FILL',
                            decreasingColor: processColor('#D14B5A'),
                            valueTextColor: processColor('black'),
                        },
                        xAxis: {},
                        yAxis: {}
                    }]
                }
            }
            Object.entries(value).forEach(([k, v]: [string, any]) => {
                if (dataChart[key].dataSets[0].values.length > 0) {
                    if (dataChart[key].dataSets[0].values[dataChart[key].dataSets[0].values.length - 1].time === v.time) {
                        dataChart[key].dataSets[0].values.pop()
                    }
                }
                v.shadowH = Math.round(v.shadowH * 1e2) / 1e2
                v.shadowL = Math.round(v.shadowL * 1e2) / 1e2
                v.open = Math.round(v.open * 1e2) / 1e2
                v.close = Math.round(v.close * 1e2) / 1e2
                dataChart[key].dataSets[0].values.push(v)
            })
        })
        setFinalDataChart(dataChart)
    }, [previousDataChart])

    //COMPONENTS
    const renderItem = (item) => (
        <View
            key={item.index}
            style={{
                padding: 5,
            }}
        >
            <Text
                style={{
                    color: colors.text,
                    fontWeight: 'bold',
                    fontSize: 20,
                }}
            >
                {item.item}
            </Text>
            <Body_Chart data={finalDataChart[item.item]} />
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end'
                }}
            >
                <TouchableOpacity
                    style={{
                        borderRadius: 5,
                        padding: 5,
                        borderWidth: 1,
                        borderColor: colors.border,
                        alignSelf: 'center',
                    }}
                    onPress={() => {
                        navigation.dispatch(StackActions.push('OrdersBookScreen', { ...route.params, redirectToTarget: 'MoneyMarketScreen', selectedPair: item.item }))
                    }}
                >
                    <Text
                        style={{
                            color: colors.text,
                            fontWeight: 'bold',
                            fontSize: 12,
                        }}
                    >
                        Go to Order Book
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )

    return (
        <View
            style={{
                width: Dimensions.get('window').width,
                alignItems: 'center'
            }}
        >
            <FlatList
                data={pairs}
                renderItem={renderItem}
                keyExtractor={item => String(item)}
                removeClippedSubviews={true}
                maxToRenderPerBatch={20}
                windowSize={50}
                initialNumToRender={20}
                //getItemLayout={getItemLayout}
                updateCellsBatchingPeriod={50}
            />
        </View>
    )
}

export default React.memo(compose(withNavigation, withRoute, withColors)(Component))