import React from 'react';
import {
    View,
    Dimensions,
    Platform,
} from 'react-native';

//FUNCTIONS
const getDots = (scrollViewContentOffsetX) => {
    const dots: any = []
    let i = 0
    while (i < 4) {
        const spottedDot = scrollViewContentOffsetX === Dimensions.get('window').width * i
        dots.push({
            id: i,
            backgroundColor: spottedDot ? 'gray' : 'silver',
            width: spottedDot ? 16 : 10,
            height: spottedDot ? 16 : 10,
            borderRadius: spottedDot ? 8 : 5,
            marginLeft: i === 0 ? 0 : 10
        })
        i++
    }
    return dots
}

const Component = ({
    scrollViewContentOffsetX
}) => {

    //PRINCIPAL RENDER
    return (
        <View
            style={{
                position: 'absolute',
                bottom: 0,
                zIndex: 15,
                elevation: (Platform.OS === 'android') ? 50 : 0,
                width: Dimensions.get('window').width,
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#068dc7',
                height: 50
            }}
        >
            {getDots(scrollViewContentOffsetX).map(dot => {
                return (
                    <View
                        key={dot.id}
                        style={{
                            backgroundColor: dot.backgroundColor,
                            width: dot.width,
                            height: dot.height,
                            borderRadius: dot.borderRadius,
                            marginLeft: dot.marginLeft
                        }}
                    />
                )
            })}
        </View>
    )
};

export default React.memo(Component);
