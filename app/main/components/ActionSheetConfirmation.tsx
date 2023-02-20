//PRINCIPAL
import React, { ReactNode } from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    GestureResponderEvent
} from 'react-native';
import ActionSheet from "react-native-actions-sheet";
import { compose } from 'redux';
//HOC
import { withColors } from '../hoc';

type ActionSheetConfirmation_Props = {
    reference: any
    height: number
    confirmationMessage: string
    onPress: (event: GestureResponderEvent) => void
    additionalInput?: ReactNode
    colors: any
}

const Component = ({
    reference,
    height,
    confirmationMessage,
    onPress,
    additionalInput,
    colors
}: ActionSheetConfirmation_Props) => {

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
                    height: height,
                    marginTop: 15,
                    alignItems: 'center',
                    alignContent: 'center'
                }}
            >
                <Text
                    style={{
                        color: colors.text
                    }}
                >
                    {confirmationMessage}
                </Text>
                {additionalInput}
                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 10,
                    }}
                >
                    <TouchableOpacity
                        onPress={onPress}
                        style={{
                            padding: 10,
                            borderRadius: 10,
                            backgroundColor: colors.getRandomMain(),
                        }}
                    >
                        <Text
                            style={{
                                color: 'white'
                            }}
                        >
                            OK
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            reference.current?.setModalVisible(false);
                        }}
                        style={{
                            padding: 10,
                            backgroundColor: 'transparent',
                            marginLeft: 5,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: colors.border,
                        }}
                    >
                        <Text
                            style={{
                                color: colors.text,
                            }}
                        >
                            CLOSE
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ActionSheet>
    )
};

export default React.memo(compose(withColors)(Component));
