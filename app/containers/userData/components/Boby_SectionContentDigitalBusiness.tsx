import React, { Fragment } from "react";
import { Text, View, TouchableOpacity, processColor } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { compose } from 'redux';
import { BarChart } from "react-native-charts-wrapper";
//HOC
import { withColors } from "../../../main/hoc";
//COMPONENTS
import ViewEmptyList from '../../../main/components/ViewEmptyList'

const Component = ({ data, colors }) => (
    <>
        {JSON.stringify(data) === JSON.stringify({}) ?
            <ViewEmptyList
                iconName='bar-chart'
                iconFamily='ION'
                message={'There is no available data'}
                top={10}
                position={'relative'}
                color='gray'
            /> :
            <View
                style={{
                    backgroundColor: colors.primaryBackground,
                    padding: 10,
                    borderRadius: 10,
                    height: 220,
                    justifyContent: 'center'
                }}
            >
                <BarChart
                    style={{
                        height: 200,
                        marginTop: 10,
                    }}
                    data={data.data}
                    xAxis={{
                        valueFormatter: data.xAxis,
                        granularityEnabled: true,
                        granularity: 1,
                        textColor: processColor(colors.text),
                    }}
                    animation={{ durationX: 4000 }}
                    legend={{
                        enabled: true,
                        textColor: processColor(colors.text),
                        textSize: 12,
                        form: "CIRCLE",
                        formSize: 6,
                        xEntrySpace: 10,
                        yEntrySpace: 3,
                        formToTextSpace: 5,
                        wordWrapEnabled: true,
                        maxSizePercent: 0.5,
                    }}
                    chartDescription={{ text: "" }}
                    gridBackgroundColor={processColor(colors.text)}
                    chartBackgroundColor={processColor(colors.primaryBackground)}
                    visibleRange={{ x: { min: 1, max: 9 } }}
                    drawBarShadow={false}
                    drawValueAboveBar={true}
                    drawHighlightArrow={true}
                    yAxis={{
                        left: {
                            textColor: processColor(colors.text)
                        },
                        right: {
                            textColor: processColor(colors.text)
                        }
                    }}
                    //onSelect={this.handleSelect.bind(this)}
                    //highlights={this.state.highlights}
                    onChange={(event) => console.log(event.nativeEvent)}
                />
            </View>}
    </>
)

export default React.memo(compose(withColors)(Component))
