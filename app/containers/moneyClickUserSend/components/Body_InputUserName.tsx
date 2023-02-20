import React from 'react';
import {
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { compose } from 'redux'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { withColors } from '../../../main/hoc';

const Component = ({
    areaCode,
    phone,
    onChangeTextAreaCode,
    onChangeTextPhone,
    onPressQRCode,
    onPressContacts,
    colors
}) => {

    //PRINCIPAL RENDER
    return (
        <View style={{ flexDirection: 'row', marginTop: 10, alignContent: 'center', justifyContent: 'center' }}>
            <TextInput
                value={areaCode}
                maxLength={5}
                onChangeText={onChangeTextAreaCode}
                placeholderTextColor={"silver"}
                style={{
                    flex: 2,
                    fontSize: 14,
                    color: colors.text,
                    backgroundColor: colors.primaryBackground,
                    paddingLeft: 15,
                    paddingRight: 15,
                    paddingBottom: 5,
                    paddingTop: 5,
                    borderRadius: 10
                }}
            />
            <TextInput
                placeholder={'Phone'}
                value={phone}
                maxLength={60}
                onChangeText={onChangeTextPhone}
                placeholderTextColor={"silver"}
                style={{
                    flex: 5,
                    fontSize: 14,
                    color: colors.text,
                    backgroundColor: colors.primaryBackground,
                    paddingLeft: 15,
                    paddingRight: 15,
                    paddingBottom: 5,
                    paddingTop: 5,
                    marginLeft: 5,
                    borderRadius: 10
                }}
            />
            <TouchableOpacity
                style={{ paddingLeft: 15, paddingTop: 5, flex: 1.5 }}
                onPress={onPressQRCode}
            >
                <MaterialCommunityIcons
                    name="qrcode"
                    color={colors.icon}
                    size={30}
                />
            </TouchableOpacity>
            <TouchableOpacity
                style={{ paddingLeft: 15, paddingTop: 5, flex: 1.5 }}
                onPress={onPressContacts}
            >
                <MaterialCommunityIcons
                    name="account-search"
                    color={colors.icon}
                    size={30}
                />
            </TouchableOpacity>
        </View>
    )
};

export default React.memo(withColors(Component));