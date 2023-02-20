import React, { useEffect, useRef } from "react"
import { CommonActions } from "@react-navigation/native"
import messaging from '@react-native-firebase/messaging';
//STORES
import { store as authStore } from "../stores/auth"
//HOOKS
import { getConfig } from "./getConfig"
import { setSecretKey } from "./setSecretKey"
import { signIn } from "./signIn"
import { addUserFirebaseToken } from "./addUserFirebaseToken";

const Hook = (areaCode: string, phone: string, password: string, navigation: any) => {

    //INITIAL STATES
    const isMounted = useRef(false)

    //HOOKS CALLS
    const { isLoading: isLoadingSignIn, data: dataSignIn, error: errorSignIn, refetch: refetchSignIn, isSuccess: isSuccessSignIn } =
        signIn(
            areaCode,
            phone,
            password,
            '4454e4d08748617h'
        )

    const { isLoading: isLoadingSetSecretKey, data: dataSetSecretKey, error: errorSetSecretKey, isSuccess: isSuccessSetSecretKey } =
        setSecretKey(
            dataSignIn?.base?.userName || null,
            dataSignIn?.base?.secretKey || null,
            '4454e4d08748617h'
        )
    const { isLoading: isLoadingGetConfig, data: dataGetConfig, error: errorGetConfig, isSuccess: isSuccessGetConfig } =
        getConfig(
            dataSignIn?.base?.userName || null,
        )

    const { mutate: mutateAddUserFirebaseToken } =
        addUserFirebaseToken()

    //EFFECTS
    useEffect(() => {
        if (isMounted.current) {
            if (dataGetConfig !== undefined) {
                authStore.dispatch(
                    {
                        type: 'SET_PARAMS',
                        payload:
                        {
                            areaCode: areaCode,
                            phone: phone,
                            userName: dataSignIn?.base?.userName,
                            secretKey: dataSignIn?.base?.secretKey,
                            time: new Date().getTime(),
                            //config: { ...dataGetConfig },
                            frequentUsers: dataSignIn?.other.frequentUsers
                        }
                    })
                try {
                    messaging().requestPermission();
                    messaging().getToken().then((token) => {
                        console.log('>>>>>>>>>>>>>>>>token', token)
                        /*mutateAddUserFirebaseToken({
                            userName: areaCode + '' + phone,
                            token: token
                        })*/
                    })
                } catch (error) {
                    alert('permission rejected');
                }
                navigation.dispatch((state) => {
                    const routes = [{ name: 'MainTabScreen' }];
                    return CommonActions.reset({
                        ...state,
                        routes,
                        index: routes.length - 1,
                    });
                });
            }
        } else {
            isMounted.current = true
        }
    }, [dataGetConfig]);

    return {
        run: refetchSignIn,
        isLoading: isLoadingSignIn || isLoadingSetSecretKey || isLoadingGetConfig,
        error: errorSignIn !== null ? errorSignIn : errorSetSecretKey !== null ? errorSetSecretKey : errorGetConfig,
        isSuccess: isSuccessSignIn && isSuccessSetSecretKey && isSuccessGetConfig
    }

}
export const signInProcess = Hook;
