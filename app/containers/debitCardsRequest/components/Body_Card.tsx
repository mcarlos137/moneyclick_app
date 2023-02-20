import React from "react"
import {
    Image,
    Text,
    View
} from 'react-native'
//FUNCTIONS
import { getRequire } from "../../../main/functions"
//HOC
import { withColors } from "../../../main/hoc"

const Component = ({ photoAsset, holderName, model, colors }) => {
    return (
        <View
            style={{
                marginTop: 10,
                alignSelf: 'center',
                backgroundColor: colors.primaryBackground,
                padding: 10,
                borderRadius: 10,
                width: 200
            }}
        >
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                }}
            >
                <View
                    style={{
                        flex: 1,
                        alignSelf: 'center',
                        alignItems: 'flex-end',
                    }}
                >
                    <Image
                        style={{
                            width: 40,
                            height: 40,
                        }}
                        source={{
                            uri: photoAsset?.uri,
                        }}
                    />
                </View>
            </View>
            <View
                style={{
                    flex: 1,
                    alignSelf: 'center',
                    justifyContent: 'center'
                }}
            >
                <Text
                    style={{
                        color: colors.text,
                    }}
                >
                    XXXX  XXXX  XXXX  XXXX
                </Text>
            </View>
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row'
                }}
            >
                <View
                    style={{
                        flexDirection: 'column',
                        flex: 1
                    }}
                >
                    <Text
                        style={{
                            color: colors.text,
                            fontSize: 9
                        }}
                    >
                        {'valid thru '}
                    </Text>
                    <Text
                        style={{
                            color: colors.text,
                        }}
                    >
                        {'02/26'}
                    </Text>
                    <Text
                        style={{
                            color: colors.text,
                            fontSize: 9
                        }}
                    >
                        {holderName}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: 'column',
                        flex: 1,
                        alignSelf: 'center',
                        alignItems: 'flex-end',
                    }}
                >
                    <Image
                        style={{
                            width: 30,
                            height: 30,
                        }}
                        source={model.includes('MONEYCLICK') ? getRequire('MONEYCLICK_1') : model.includes('VISA') ? getRequire('VISA') : model.includes('MASTER') ? getRequire('MASTER') : null}
                    />
                </View>
            </View>
        </View>
    )
}

export default React.memo(withColors(Component))