//PRINCIPAL
import React from 'react';
import {
    processColor,
    Dimensions
} from 'react-native';
import Moment from 'moment';
import { CandleStickChart } from 'react-native-charts-wrapper';
import { compose } from 'redux';
//HOC
import { withColors } from '../../../main/hoc';


const Component = ({
    data,
    colors,
}) => {

    //CONSTANTS
    const MARKER = {
        enabled: true,
        markerColor: processColor('#2c3e50'),
        textColor: processColor('white'),
    }

    const Y_AXIS = {
        $set: {
            left: {
                valueFormatter: '$ #',
                limitLines: [{
                    limit: 112.4,
                    lineColor: processColor('red'),
                    lineDashPhase: 2,
                    lineDashLengths: [10, 20]
                }, {
                    limit: 89.47,
                    lineColor: processColor('red'),
                    lineDashPhase: 2,
                    lineDashLengths: [10, 20]
                }]
            },
            right: {
                enabled: false
            },
        }
    }

    const zoomXValue = {
        $set: 99999
    }

    //var zoomXValue = 0

    //PRINCIPAL RENDER
    return (
        <CandleStickChart
            style={{
                width: Dimensions.get('window').width * 0.88,
                height: 150,
            }}
            data={data}
            marker={MARKER}
            chartDescription={{ text: 'CandleStick' }}
            legend={{
                textColor: processColor(colors.text),
                enabled: true,
                textSize: 14,
                form: 'CIRCLE',
                wordWrapEnabled: true
            }}
            gridBackgroundColor={processColor(colors.text)}
            chartBackgroundColor={processColor(colors.background)}
            xAxis={{
                //enabled: true,
                valueFormatter: data !== undefined ? data.dataSets[0].values.map(item => Moment(item.time).format('HH:mm')) : '',
                textSize: 9,
                textColor: processColor(colors.text),
                drawLabels: true,
                drawAxisLine: false,
                drawGridLines: true,
                centerAxisLabels: true,
                position: 'TOP',
                yOffset: 5,
                avoidFirstLastClipping: true,
                labelRotationAngle: 0,
                granularity: 1,
                granularityEnabled: true,
            }}
            //yAxis={Y_AXIS}
            yAxis={{
                left: {
                    textColor: processColor(colors.text)
                },
                right: {
                    textColor: processColor(colors.text)
                }
            }}
            maxVisibleValueCount={16}
            autoScaleMinMaxEnabled={true}
            zoom={{ scaleX: 5, scaleY: 1, xValue: data !== undefined ? data.dataSets[0].values.length : 300, yValue: 1 }}
        //zoom={{ scaleX: 15.41, scaleY: 1, xValue: 40, yValue: 916, axisDependency: 'LEFT' }}
        //onSelect={this.handleSelect.bind(this)}
        //ref="chart"
        //onChange={(event) => console.log(event.nativeEvent)}
        />
    )
};

export default React.memo(compose(withColors)(Component));