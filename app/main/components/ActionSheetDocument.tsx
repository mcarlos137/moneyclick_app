//PRINCIPAL
import React from 'react';
import {
    TouchableOpacity,
    View,
} from 'react-native';
import ActionSheet from "react-native-actions-sheet";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
//HOC
import { withColors } from '../hoc';

const Component = ({
    reference,
    onPressCamera,
    onPressLibrary,
    colors
}) => {

    //PRINCIPAL RENDER
    return (
        <ActionSheet
            ref={reference}
            containerStyle={{
                backgroundColor: colors.primaryBackground
            }}
        >
            <View
                style={{
                    alignSelf: 'center',
                    flexDirection: 'row',
                }}
            >
                <TouchableOpacity
                    onPress={onPressCamera}
                    style={{
                        width: 100,
                        padding: 20,
                        borderRadius: 40,
                    }}

                >
                    <MaterialCommunityIcons
                        name={'camera'}
                        color={colors.getRandomMain()}
                        size={50}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={onPressLibrary}
                    style={{
                        width: 100,
                        padding: 20,
                        borderRadius: 40,
                    }}
                >
                    <MaterialCommunityIcons
                        name={'folder'}
                        color={colors.getRandomMain()}
                        size={50}
                    />
                </TouchableOpacity>
            </View>
        </ActionSheet>
    )
};

export default React.memo(withColors(Component));
