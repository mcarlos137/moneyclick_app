import React from 'react';
import {
    TouchableOpacity,
    Text
} from 'react-native';
//HOC
import { withColors } from '../../../main/hoc';

const Component = ({
    onPressCopy,
    onPressShare,
    colors
}) => {

    //PRINCIPAL RENDER
    return (
        <>
            <TouchableOpacity
                style={{
                    backgroundColor: colors.getRandomMain(),
                    marginTop: 20,
                    borderRadius: 10
                }}
                onPress={onPressCopy}
            >
                <Text
                    style={{
                        alignSelf: 'center',
                        color: 'white',
                        padding: 10
                    }}
                >
                    COPY
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    backgroundColor: colors.getRandomMain(),
                    marginTop: 10,
                    borderRadius: 10
                }}
                onPress={onPressShare}
            >
                <Text
                    style={{
                        alignSelf: 'center',
                        color: 'white',
                        padding: 10
                    }}
                >
                    SHARE
                </Text>
            </TouchableOpacity>
        </>
    )
};

export default React.memo(withColors(Component));