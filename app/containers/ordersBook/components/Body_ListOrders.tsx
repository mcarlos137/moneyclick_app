//PRINCIPAL
import React from 'react';
import {
    Text,
    View,
    FlatList,
} from 'react-native';
import { NumericFormat } from 'react-number-format';
//FUNCTIONS
import {
    getPairComponents,
} from '../../../main/functions'

const Component = ({
    pair,
    data,
    backgroundColor,
}) => {

    //COMPONENTS
    const renderItem = (item, pair) => (
        <View
            key={item.index}
            style={{
                flexDirection: 'row',
            }}
        >
            <NumericFormat
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
            <NumericFormat
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
            <NumericFormat
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
            <NumericFormat
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

    //PRINCIPAL RENDER
    return (
        <FlatList
            style={{
                backgroundColor: backgroundColor,
                marginTop: 10,
                borderRadius: 10,
                height: 150
            }}
            data={data}
            renderItem={(item) => renderItem(item, pair)}
            keyExtractor={(item) => String(item.index)}
            removeClippedSubviews={true}
            maxToRenderPerBatch={20}
            windowSize={50}
            initialNumToRender={20}
            //getItemLayout={getItemLayout}
            updateCellsBatchingPeriod={50}
            ListHeaderComponent={
                <View
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    <Text
                        style={{
                            flex: 0.6,
                            fontWeight: 'bold',
                            fontSize: 12,
                            textAlign: 'center'
                        }}
                    >
                        Count
                    </Text>
                    <Text
                        style={{
                            flex: 1.2,
                            fontWeight: 'bold',
                            fontSize: 12,
                            textAlign: 'center'
                        }}
                    >
                        Amount {getPairComponents(pair)[0]}
                    </Text>
                    <Text
                        style={{
                            flex: 1.2,
                            fontWeight: 'bold',
                            fontSize: 12,
                            textAlign: 'center'
                        }}
                    >
                        TOTAL {getPairComponents(pair)[0]}
                    </Text>
                    <Text
                        style={{
                            flex: 1.8,
                            fontWeight: 'bold',
                            fontSize: 12,
                            textAlign: 'center'
                        }}
                    >
                        Price {getPairComponents(pair)[1]}
                    </Text>
                </View>
            }
        />
    )
};

export default React.memo(Component);