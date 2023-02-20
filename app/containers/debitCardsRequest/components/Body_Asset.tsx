import React from "react"
import { Image, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
//HOC
import { withColors } from "../../../main/hoc";

const Component = ({ asset, setAsset, actionSheetDocumentRef, colors }) => {
    return (
        <>
            {JSON.stringify(asset) === JSON.stringify({}) ?
                <TouchableOpacity
                    style={{
                        backgroundColor: colors.getRandomMain(),
                        marginTop: 10,
                        borderRadius: 10
                    }}
                    onPress={() => {
                        if (JSON.stringify(asset) === JSON.stringify({})) {
                            actionSheetDocumentRef.current?.setModalVisible(true);
                        } else {
                            /*changeBuyBalanceOperationStatusStore.dispatch(
                                changeBuyBalanceOperationStatusAction(
                                    selectedFiatBankDepositState.id,
                                    'PAY_VERIFICATION',
                                    null
                                )
                            )*/
                        }
                    }}
                >
                    <Text
                        style={{
                            alignSelf: 'center',
                            color: 'white',
                            padding: 10
                        }}
                    >
                        {'UPLOAD PHOTO FILE'}
                    </Text>
                </TouchableOpacity> :
                <View
                    style={{
                        marginTop: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderColor: colors.getRandomMain(),
                        borderWidth: 2,
                        padding: 10,
                        borderRadius: 5
                    }}
                >
                    <Image
                        style={{
                            width: 100,
                            height: 100,
                        }}
                        source={{
                            uri: asset?.uri,
                        }}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            setAsset({})
                        }}
                        style={{
                            marginLeft: 30
                        }}
                    >
                        <MaterialCommunityIcons
                            name={'delete'}
                            color={colors.icon}
                            size={30}
                        />
                    </TouchableOpacity>
                </View>}
        </>
    )
}

export default React.memo(withColors(Component))