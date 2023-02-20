import React, { ReactNode, Fragment } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { compose } from 'redux';
//FUNCTIONS
import { getRequire } from '../functions';
//HOC
import { withColors } from '../hoc';

const lineNext = "silver";
const lineDone = "#004FC0";

type MemoizedSteps_Props = {
    children: ReactNode[]
    activeStep: number
    totalSteps: number
    colors: any
}

const Steps = ({
    children,
    activeStep,
    totalSteps,
    colors
}: MemoizedSteps_Props) => {

    const mainColor = colors.getRandomMain()

    return (
        <>
            <View
                style={[
                    styles.navigator,
                    { backgroundColor: colors.background }
                ]}>
                {[...Array(totalSteps - 1)].map((e, i) => {
                    return (
                        <Fragment key={i}>
                            <Image
                                source={i + 1 < activeStep ? getRequire('STEP_DONE') : i + 1 == activeStep ? getRequire('STEP_CURRENT') : getRequire('STEP_NEXT')}
                                style={[styles.stepIcon, { backgroundColor: colors.primaryBackground }]}
                                resizeMode="contain"
                            />
                            <View style={[styles.lineSteps, { backgroundColor: (i + 1 <= activeStep - 1 ? lineDone : lineNext) }]} />
                        </Fragment>
                    )
                })}
                <Image
                    style={[styles.stepIcon, { backgroundColor: colors.primaryBackground }]}
                    resizeMode="contain"
                    source={activeStep == totalSteps ? getRequire('STEP_CURRENT') : activeStep > totalSteps ? getRequire('STEP_DONE') : getRequire('STEP_NEXT')}
                />
            </View>
            {children[activeStep - 1]}
        </>
    );
};

export const MemoizedSteps = React.memo(compose(withColors)(Steps));

type MemoizedStep_Props = {
    children: ReactNode
    leftButtonLabel?: string
    onPressLeftButton?: (event: GestureResponderEvent) => void
    rightButtonLabel: string
    onPressRightButton: (event: GestureResponderEvent) => void,
    colors: any
}

const Step = ({
    children,
    leftButtonLabel,
    onPressLeftButton,
    rightButtonLabel,
    onPressRightButton,
    colors
}: MemoizedStep_Props) => {

    const mainColor = colors.getRandomMain()

    return (
        <>
            {children}
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20
                }}
            >
                {leftButtonLabel &&
                    <TouchableOpacity
                        onPress={onPressLeftButton}
                        style={{
                            alignSelf: 'center',
                            padding: 5,
                            marginRight: 5,
                            borderWidth: 1,
                            borderRadius: 5,
                            borderColor: mainColor
                        }}
                    >
                        <Text style={{ color: mainColor, fontWeight: 'bold' }} >{leftButtonLabel}</Text>
                    </TouchableOpacity>
                }
                {rightButtonLabel &&
                    <TouchableOpacity
                        onPress={onPressRightButton}
                        style={{
                            backgroundColor: mainColor,
                            borderColor: mainColor,
                            borderWidth: 1,
                            alignSelf: 'center',
                            padding: 5,
                            borderRadius: 5,
                        }}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>{rightButtonLabel}</Text>
                    </TouchableOpacity>
                }
            </View>
        </>
    )
}

export const MemoizedStep = React.memo(compose(withColors)(Step));

const styles = StyleSheet.create({
    navigator: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        paddingBottom: 15,
        paddingHorizontal: 40,
        marginBottom: 10
    },
    lineSteps: {
        flexGrow: 1,
        height: 1,
    },
    stepIcon: {
        width: 40,
        height: 40,
        borderRadius: 20
    }
});