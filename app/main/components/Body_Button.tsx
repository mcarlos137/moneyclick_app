import React from 'react';
import {
    TouchableOpacity,
    Text,
    ActivityIndicator
} from 'react-native';
import { compose } from 'redux';
//HOC
import { withColors } from '../hoc';

type Body_Button_Request = {
    onPress: any
    label: string
    isLoading?: boolean
    colors: any
}

const Component = ({
    onPress,
    label,
    isLoading,
    colors,
}: Body_Button_Request) => {

    //PRINCIPAL RENDER
    return (
        <TouchableOpacity
            style={{
                backgroundColor: colors.getRandomMain(),
                marginTop: 20,
                borderRadius: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: "center",
            }}
            onPress={onPress}
        >
            <Text
                style={{
                    alignSelf: 'center',
                    color: 'white',
                    padding: 10
                }}
            >
                {label}
            </Text>
            {isLoading && <ActivityIndicator size="small" color={'white'} style={{ marginLeft: 10 }} />}
        </TouchableOpacity>
    )
};

export default React.memo(compose(withColors)(Component));