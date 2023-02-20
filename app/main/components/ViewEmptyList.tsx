//PRINCIPAL
import React from 'react';
import {
    Text,
    View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const getIconName = (operation) => {
    switch (operation) {
        case 'SHORTS_COMMENTS':
            return ['comment-alert', 'MATERIAL_COMMUNITY']
        case 'AWARD':
            return ['trophy', 'ION']
        case 'SUBSCRIPTION_EVENT':
            return ['alert-circle', 'MATERIAL_COMMUNITY']
        case 'ORDER_OLD':
            return ['alert-circle', 'MATERIAL_COMMUNITY']
        case 'USER_DATA_GALLERY':
            return ['folder-multiple-outline', 'MATERIAL_COMMUNITY']
        case 'USER_DATA_BROADCASTING':
        case 'USER_DATA_OTHERS_BROADCASTING':
        case 'SOCIAL_BROADCASTING':
            return ['broadcast', 'MATERIAL_COMMUNITY']
        case 'SOCIAL_LIVE_STREAMING':
            return ['broadcast', 'MATERIAL_COMMUNITY']
        case 'SOCIAL_PREMIUM':
            return ['broadcast', 'MATERIAL_COMMUNITY']
        case 'USER_DATA_LIVE_STREAMING':
        case 'USER_DATA_OTHERS_LIVE_STREAMING':
            return ['megaphone', 'ION']
        case 'USER_DATA_DIGITAL_BUSINESS':
            return ['bar-chart', 'ION']
        case 'BROADCASTING_EPISODE_TRAILER':
            return ['animation-play', 'MATERIAL_COMMUNITY']
    }
}

type ViewEmptyList_Props = {
    iconName: string
    iconFamily: string
    message: string
    top: number
    position: 'absolute' | 'relative'
    color: string
}

const Component = ({
    iconName,
    iconFamily,
    message,
    top,
    position,
    color
}: ViewEmptyList_Props) => {

    //PRINCIPAL RENDER
    return (
        <View
            style={{
                alignSelf: 'center',
                position: position,
                top: top
            }}
        >
            {iconFamily === 'MATERIAL_COMMUNITY' &&
                <MaterialCommunityIcons
                    name={iconName}
                    color={color}
                    size={80}
                    style={{
                        alignSelf: 'center',
                        marginBottom: 10,
                    }}
                />
            }
            {iconFamily === 'ION' &&
                <Ionicons
                    name={iconName}
                    color={color}
                    size={80}
                    style={{
                        alignSelf: 'center',
                        marginBottom: 10,
                    }}
                />
            }
            {iconFamily === 'MATERIAL' &&
                <MaterialIcons
                    name={iconName}
                    color={color}
                    size={80}
                    style={{
                        alignSelf: 'center',
                        marginBottom: 10,
                    }}
                />
            }
            <Text
                style={{
                    color: color,
                    fontSize: 16,
                    textAlign: 'center'
                }}
            >
                {message}
            </Text>
        </View>
    )
};

export default React.memo(Component);