import React from 'react';
import {
    View,
    Dimensions,
    Text,
    TouchableOpacity,
    Platform,
    Linking
} from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const Component = ({ navigation }) => {

    //PRINCIPAL RENDER
    return (
        <View
            style={{
                position: 'absolute',
                bottom: 60,
                zIndex: 15,
                elevation: (Platform.OS === 'android') ? 50 : 0,
                flexDirection: 'row',
                width: Dimensions.get('window').width,
                justifyContent: 'center'
            }}
        >
            <TouchableOpacity
                onPress={async () => {
                    await Linking.openURL('http://kaikai.social');
                }}
                style={{
                    backgroundColor: 'white',
                    width: 150,
                    height: 40,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 50,
                    flexDirection: "row",
                    borderColor: '#068dc7',
                    borderWidth: 1,
                }}
            >
                <Text
                    style={{
                        color: '#068dc7',
                        fontWeight: "bold",
                    }}>
                    Lear more...
                </Text>
                <MaterialIcons name="navigate-next" color='#068dc7' size={20} />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('SignInScreen');
                    /*navigateStore.dispatch({
                        type: NAVIGATE,
                        payload: { target: "SignInScreen" },
                    });*/
                }}
                style={{
                    marginLeft: 10
                }}
            >
                <LinearGradient
                    colors={['#065890', '#013558']}
                    style={{
                        width: 150,
                        height: 40,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 50,
                        flexDirection: "row",
                    }}
                >
                    <Text
                        style={{
                            color: "white",
                            fontWeight: "bold",
                        }}>
                        Get Started
                    </Text>
                    <MaterialIcons name="navigate-next" color="#fff" size={20} />
                </LinearGradient>
            </TouchableOpacity>
        </View>
    )
};

export default React.memo(Component);
