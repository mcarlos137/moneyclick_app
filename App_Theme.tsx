//PRINCIPAL
import React from 'react';
import { StatusBar } from 'react-native';
import {
    NavigationContainer,
    DefaultTheme as NavigationDefaultTheme,
    DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import {
    Provider as PaperProvider,
    MD3LightTheme as PaperLightTheme,
    MD3DarkTheme as PaperDarkTheme,
} from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux'
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
//SCREENS
import RootStackScreen from './screens/RootStackScreen';

const mapState = (state: any) => ({
    theme: state.theme,
})

const mapDispatch = {
    setTheme: ({ value }) => ({ type: 'SET_THEME', payload: value }),
}

type PropsFromRedux = ConnectedProps<typeof connector>

export interface ThemeProps extends PropsFromRedux {

}

const MainColors = {
    getRandomMain: () => {
        const mainColors = ['#d02860', '#1f65ff', '#694fad', '#f5551b', '#009387']
        return mainColors[Math.floor(Math.random() * mainColors.length)]
    }
}

const Component = (props: ThemeProps) => {
    const CustomLightTheme = {
        ...NavigationDefaultTheme,
        ...PaperLightTheme,
        colors: {
            ...NavigationDefaultTheme.colors,
            ...PaperLightTheme.colors,
            ...MainColors,
            text: 'black',
            icon: '#333333',
            iconDisabled: '#666666',
            primaryBackground: '#eeeeee',
            secundaryBackground: '#dddddd',
            border: 'black',
            placeholderText: 'silver',
            chart1: '#FFD08C',
            chart2: '#C0B7F7',
            chart3: '#8CEAFF',
            chart4: '#FF8C9D',
            chart5: '#F28CFF',
            chart6: '#FA9189',
            backdrop: 'rgba(255, 255, 255, 0.5)',
            //background: '#ffffff',
            //text: '#333333'
        }
    }

    const CustomDarkTheme = {
        ...NavigationDarkTheme,
        ...PaperDarkTheme,
        colors: {
            ...NavigationDarkTheme.colors,
            ...PaperDarkTheme.colors,
            ...MainColors,
            text: 'white',
            icon: '#eeeeee',
            iconDisabled: '#111111',
            primaryBackground: '#202020',
            secundaryBackground: '#363439',
            border: 'white',
            placeholderText: 'silver',
            chart1: '#FFD119',
            chart2: '#3716F2',
            chart3: '#05CFFC',
            chart4: '#469903',
            chart5: '#DE05FA',
            chart6: '#FA1B0A',
            backdrop: 'rgba(0, 0, 0, 0.5)',
            //background: '#333333',
            //text: '#ffffff'
        }
    }

    return (
        <PaperProvider theme={props.theme === 'dark-content' ? CustomDarkTheme : CustomLightTheme}>
            <NavigationContainer theme={props.theme === 'dark-content' ? CustomDarkTheme : CustomLightTheme}>
                <StatusBar backgroundColor={'transparent'} translucent={true} barStyle={props.theme === 'dark-content' ? 'light-content' : 'dark-content'} animated={true} networkActivityIndicatorVisible={true} />
                <AlertNotificationRoot theme={props.theme === 'dark-content' ? 'dark' : 'light'} >
                    <RootStackScreen />
                </AlertNotificationRoot>
            </NavigationContainer>
        </PaperProvider>
    )
}

const connector = connect(mapState, mapDispatch)

export default connector(Component)
