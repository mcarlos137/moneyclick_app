import React from "react";
import { createStackNavigator } from '@react-navigation/stack';

const OptionsStack = createStackNavigator();

const OptionsStackScreen = ({ navigation }) => (
    <OptionsStack.Navigator
        screenOptions={{
            headerStyle: {
                backgroundColor: '#009387',
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
            headerTitleStyle: {
                fontWeight: 'bold'
            }
        }}>
    </OptionsStack.Navigator>
);

export default React.memo(OptionsStackScreen)
