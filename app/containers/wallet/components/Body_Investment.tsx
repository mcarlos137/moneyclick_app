import React from 'react';
import { Dimensions, processColor, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BarChart } from "react-native-charts-wrapper";
import Moment from "moment";
import { compose } from 'redux';
import { withColors } from '../../../main/hoc';

const Component = ({ data, icon, noDataText, colors }) => {

  let partialData = {}

  data?.map(model => {
    Object.entries(model.additionalMovements).forEach(([key, values]: [string, any]) => {
      const date = Moment(new Date(key)).format("MM/YY")
      if (partialData[date] === undefined) {
        partialData[date] = 0
      }
      for (let value of values) {
        if (value.currency === 'USD') {
          partialData[date] = partialData[date] + Number(value.amount)
        }
      }
    })
  })
  const chartValues: any[] = []
  const chartXAxis: string[] = []
  Object.entries(partialData).forEach(([key, value]) => {
    chartXAxis.push(key)
    chartValues.push(value)
  })
  const chartData = {
    data: {
      dataSets: [
        {
          values: chartValues,
          label: "Returns USD ($)",
          config: {
            color: processColor("teal"),
            barShadowColor: processColor("lightgrey"),
            highlightAlpha: 90,
            highlightColor: processColor("red"),
            valueTextColor: processColor(colors.text),
          },
        },
      ],
      config: {
        barWidth: 0.3,
        valueTextSize: 9,
      },
    },
    xAxis: chartXAxis,
  }
  return (
    <View
      style={{
        flexDirection: "row",
      }}
    >
      <View
        style={{
          justifyContent: 'center'
        }}
      >
        <MaterialCommunityIcons
          name={icon}
          color={colors.icon}
          size={60}
        />
      </View>
      {data.length > 0 ? (
        <View>
          <View
            style={{
              width: Dimensions.get("window").width * 0.65,
            }}
          >
            <BarChart
              style={{
                height: 130,
              }}
              data={chartData.data}
              xAxis={{
                valueFormatter: chartData.xAxis,
                granularityEnabled: true,
                granularity: 1,
                textSize: 4,
                textColor: processColor(colors.text),
              }}
              yAxis={{
                left: {
                  textColor: processColor(colors.text),
                  textSize: 6,
                },
                right: {
                  textColor: processColor(colors.text),
                  textSize: 6,
                }
              }}
              animation={{ durationX: 4000 }}
              legend={{
                enabled: true,
                textSize: 9,
                textColor: processColor(colors.text),
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
              onChange={(event) => console.log(event.nativeEvent)}
            />
          </View>
        </View>
      ) : (
        <View
          style={{
            alignSelf: "center",
          }}
        >
          <Text
            style={{
              alignSelf: "center",
              color: "blue",
            }}
          >
            No data
          </Text>
          <Text
            style={{
              alignSelf: "center",
              color: "blue",
              fontWeight: "bold",
              textAlign: 'center',
              maxWidth: 200
            }}
          >
            {noDataText}
          </Text>
        </View>
      )}
    </View>
  )
};

export default React.memo(compose(withColors)(Component))