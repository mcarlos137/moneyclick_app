//PRINCIPAL
import { Picker } from '@react-native-picker/picker';
import { StackActions } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, ImageBackground } from 'react-native';
import {
    Dimensions,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { compose } from 'redux';
//CONSTANTS
import { months } from '../../constants/time';
//HOC
import { withColors, withConfig, withHmacInterceptor, withUserName } from '../../main/hoc';
//HOOKS
import { getVerificationFields } from './hooks/getVerificationFields';
import { getVerificationMessages } from './hooks/getVerificationMessages';
import { getVerifications } from './hooks/getVerifications';
import { startVerification } from './hooks/startVerification';
import { addUserInfo } from '../../main/hooks/addUserInfo';
import { addUserAttachment } from '../../main/hooks/addUserAttachment';
//COMPONENTS
import Body from '../../main/components/Body'
import Body_Button from '../../main/components/Body_Button'
import ActionSheetDocument from '../../main/components/ActionSheetDocument';
//FUNCTIONS
import { handleChooseDocument } from '../../main/functions';
//TOOLS
import httpRequest from '../../tools/httpRequest';

const VerificationScreen = ({ navigation, route, colors, userName, config, hmacInterceptor }) => {

    const [verificationTypeStatus, setVerificationTypeStatus] = useState('')
    const [data, setData] = useState<any>()
    const [uploadFieldName, setUploadFieldName] = useState('')
    const [openDatePicker, setOpenDatePicker] = useState(false)
    const [allFieldNamesAdded, setAllFieldNamesAdded] = useState(false)
    const fieldsToAdd = useRef<string[]>([])
    const actionSheetDocumentRef = useRef<any>()

    //HOOKS CALLS
    const { isLoading: isLoadingVerificationMessages, data: dataVerificationMessages, error: errorVerificationMessages } =
        getVerificationMessages(route.params.selectedVerificationType)

    const { isLoading: isLoadingVerificationFields, data: dataVerificationFields, error: errorVerificationFields } =
        getVerificationFields(route.params.selectedVerificationType)

    const { isLoading: isLoadingVerifications, data: dataVerifications, error: errorVerifications, refetch: refetchVerifications } =
        getVerifications(userName, null)

    const { mutate: mutateAddUserInfo, isLoading: isLoadingAddUserInfo, isSuccess: isSuccessAddUserInfo, data: dataAddUserInfo } =
        addUserInfo()

    const { mutate: mutateAddUserAttachment, isLoading: isLoadingAddUserAttachment, isSuccess: isSuccessAddUserAttachment, data: dataAddUserAttachment } =
        addUserAttachment()

    const { mutate: mutateStartVerification, isLoading: isLoadingStartVerification, isSuccess: isSuccessStartVerification } =
        startVerification()

    //EFFECTS
    useEffect(() => {
        console.log('VerificationScreen', route.params)
    }, []);

    useEffect(() => {
        if (config?.verifications[route.params.selectedVerificationType]?.status !== undefined) {
            setVerificationTypeStatus(config.verifications[route.params.selectedVerificationType].status)
        }
        if (config?.verifications[route.params.selectedVerificationType] === undefined) {
            setVerificationTypeStatus('NEW')
        }
    }, [config])

    useEffect(() => {
        console.log('dataVerifications', dataVerifications)
        if (verificationTypeStatus !== 'PROCESSING') {
            return
        }
        const interval = setInterval(() => {
            refetchVerifications()
        }, 5000)
        return () => {
            clearInterval(interval)
        }
    }, [verificationTypeStatus, dataVerifications])

    useEffect(() => {
        if (verificationTypeStatus !== 'OK') {
            return
        }
        navigation.dispatch(StackActions.replace(route.params.replaceTarget, { ...route.params }))
    }, [verificationTypeStatus])

    useEffect(() => {
        if(dataVerifications[route.params.selectedVerificationType] !== undefined){
            setVerificationTypeStatus(dataVerifications[route.params.selectedVerificationType])
        }
    }, [dataVerifications])

    useEffect(() => {
        const initialData: any = {}
        dataVerificationFields.map((value) => {
            let val: any = ''
            let editable = true
            if (value.type === 'upload_file') {
                val = {}
            }
            if (config.others[value.name] !== undefined) {
                if (value.type === 'upload_file') {
                    val = { fileName: config.others[value.name] }
                } else {
                    val = config.others[value.name]
                }
                editable = false
            }
            if (config[value.name] !== undefined) {
                if (value.type === 'upload_file') {
                    val = { fileName: config[value.name] }
                } else {
                    val = config[value.name]
                }
                editable = false
            }
            if (val === '' && value.type === 'picker') {
                val = value.values.EN[0]
            }
            initialData[value.name] = { value: val, editable: editable }
        });
        setData(initialData)
    }, [dataVerificationFields])

    useEffect(() => {
        //console.log('data', data)
    }, [data])

    useEffect(() => {
        console.log('isSuccessAddUserInfo', isSuccessAddUserInfo)
        if (isSuccessAddUserInfo) {
            process()
        }
    }, [isSuccessAddUserInfo])

    useEffect(() => {
        console.log('isSuccessAddUserAttachment', isSuccessAddUserAttachment)
        if (isSuccessAddUserAttachment) {
            process()
        }
    }, [isSuccessAddUserAttachment])

    //MEMOS
    const fieldNames = useMemo(() => {
        const finalFieldNames: string[] = []
        dataVerificationFields.map(value => {
            finalFieldNames.push(value.name)
        })
        return finalFieldNames
    }, [dataVerificationFields])

    //CALLBACKS
    const onPressCamera = useCallback(() => {
        actionSheetDocumentRef.current?.setModalVisible(false);
        navigation.dispatch(StackActions.push('CameraBridgeScreen', { ...route.params }))
    }, [actionSheetDocumentRef])

    const onPressLibrary = useCallback(() => {
        handleChooseDocument(
            'LIBRARY_PHOTO',
            {
                maxWidth: 300,
                maxHeight: 550,
                quality: 1,
            },
            (asset) => {
                actionSheetDocumentRef.current?.setModalVisible(false);
                const newdata = { ...data }
                newdata[uploadFieldName] = { value: asset, editable: true }
                console.log('newdata', newdata)
                setData(newdata)
            }
        )
    }, [uploadFieldName, data])

    const onPressSend = useCallback(() => {
        if (fieldNames.length === 0) {
            return
        }
        for (const index in fieldNames) {
            if (data[fieldNames[index]] === undefined || data[fieldNames[index]].value === '' || JSON.stringify(data[fieldNames[index]].value) === JSON.stringify({})) {
                Alert.alert(
                    "Operation Error",
                    "Yo need to enter a valid " +
                    fieldNames[index] +
                    " to complete operation.",
                    [{ text: "Ok" }]
                );
                return
            }
        }
        fieldsToAdd.current = [...dataVerificationFields.filter(item => data[item.name].editable)]
        console.log('fieldsToAdd.current', fieldsToAdd.current)
        process()
    }, [fieldNames, data, dataVerificationFields])

    const process = () => {
        if (fieldsToAdd.current.length === 0) {
            mutateStartVerification({
                userName: userName,
                info: route.params.selectedVerificationType === 'E' ? 'USER VERIFICATION FOR BANK TRANSFERS' : 'USER VERIFICATION FOR BANK DEPOSITS',
                fieldNames: fieldNames,
                userVerificationType: route.params.selectedVerificationType
            })
        } else {
            const field: any = fieldsToAdd.current.pop()
            if (field !== undefined) {
                if (field.type === 'upload_file') {
                    mutateAddUserAttachment({
                        userName: userName,
                        fieldName: field.name,
                        attachment: data[field.name].value
                    })
                } else {
                    mutateAddUserInfo({
                        userName: userName,
                        fieldName: field.name,
                        fieldValue: data[field.name].value
                    })
                }
            }
        }
    }

    //PRINCIPAL RENDER
    return (
        <Body>
            <View
                style={{
                    width: '100%',
                    height: '100%',
                    paddingBottom: 40
                }}
            >
                <>
                    <Text
                        style={{
                            textAlign: 'justify',
                            fontWeight: 'bold',
                            color: colors.text,
                            fontSize: 18,
                        }}
                    >
                        {verificationTypeStatus === 'NEW' || verificationTypeStatus === 'DELETED'
                            ? 'Verify your account'
                            : verificationTypeStatus === 'PROCESSING'
                                ? 'Verification IN PROCESS'
                                : verificationTypeStatus === 'FAIL'
                                    ? 'Verification FAILED' : null}
                    </Text>
                    <Text
                        style={{
                            marginTop: 5,
                            fontSize: 14,
                            color: colors.text,
                            textAlign: 'justify'
                        }}
                    >
                        {dataVerificationMessages[verificationTypeStatus] !== undefined ? dataVerificationMessages[verificationTypeStatus].EN : ''}
                        {/*typeStatusState === 'NEW' || typeStatusState === 'DELETED'
                    ? 'Enter the information below to verify your identity. The data must correspond to the beneficiary and the attached documents must clearly show the basic data, otherwise the operation will be canceled. To solve any doubt or concern, contact us through the Customer Service section.'
                    : typeStatusState === 'PROCESSING'
                        ? 'You will receive a response for your verification within next 24 hours. Business operators can contact you for any situation or decline your request according to law issues.'
                        : typeStatusState === 'FAIL'
                            ? 'For more information contact your business operator over chat or by any of our contact phones.'
                            : null*/}
                    </Text>
                    {(verificationTypeStatus === 'FAIL' || verificationTypeStatus === 'PROCESSING') &&
                        <Body_Button
                            onPress={() => {
                                // CHANGE CHAT ROOM
                                //navigateStore.dispatch({ type: NAVIGATE, payload: { target: 'ChatRoomScreen', redirectToTarget: 'VerificationScreen', selectedChatRoom: getAdminChatRoom(item.item.id), selectedPhone: {} } });
                            }}
                            label={'CHAT'}
                        />
                    }
                    {verificationTypeStatus === 'FAIL' &&
                        <Body_Button
                            onPress={() => {
                                navigation.dispatch(StackActions.push('CustomerSupportScreen', { ...route.params }))
                            }}
                            label={'ADDITIONAL CONTACT INFO'}
                        />
                    }
                </>
                <View
                    style={{
                        flex: 1,
                    }}
                >
                    {(verificationTypeStatus === 'NEW' || verificationTypeStatus === 'DELETED') &&
                        <ScrollView
                            persistentScrollbar={true}
                            style={{
                                marginTop: 10,
                            }}
                        >
                            {dataVerificationFields.length > 0 &&
                                dataVerificationFields.map((field) => {
                                    return (
                                        <View
                                            style={{
                                                width: Dimensions.get('window').width * 0.9,
                                                alignSelf: 'center'
                                            }}
                                            key={field.name}
                                        >
                                            {field.type === 'text_input' && data[field.name] !== undefined
                                                ?
                                                <>
                                                    <TextInput
                                                        placeholder={field.EN}
                                                        value={data[field.name].value}
                                                        onChangeText={(text) => {
                                                            const newdata = { ...data }
                                                            newdata[field.name] = { value: text, editable: true }
                                                            setData(newdata)
                                                        }}
                                                        placeholderTextColor={colors.placeholderText}
                                                        editable={data[field.name] !== undefined || data[field.name].value !== '' ? data[field.name].editable : true}
                                                        style={{
                                                            fontSize: 14,
                                                            color: colors.text,
                                                            backgroundColor: colors.primaryBackground,
                                                            marginTop: 10,
                                                            padding: 10,
                                                            borderRadius: 10
                                                        }}
                                                    />
                                                </>
                                                :
                                                null
                                            }
                                            {field.type === 'picker' && data[field.name] !== undefined &&
                                                <Picker
                                                    style={{
                                                        backgroundColor: colors.primaryBackground,
                                                        borderRadius: 10,
                                                        marginTop: 10
                                                    }}
                                                    itemStyle={{
                                                        height: 100,
                                                        fontSize: 14,
                                                    }}
                                                    enabled={true}
                                                    mode='dropdown'
                                                    dropdownIconColor={colors.icon}
                                                    selectedValue={data[field.name].value}
                                                    onValueChange={
                                                        (item) => {
                                                            const newdata = { ...data }
                                                            newdata[field.name] = { value: item, editable: true }
                                                            setData(newdata)
                                                        }
                                                    }
                                                >
                                                    {field.values.EN.map((item, key) => {
                                                        return (
                                                            <Picker.Item
                                                                key={key}
                                                                color={colors.text}
                                                                label={item}
                                                                value={item}
                                                                style={{
                                                                    color: colors.text,
                                                                    backgroundColor: colors.primaryBackground,
                                                                }}
                                                            />
                                                        );
                                                    })
                                                    }
                                                </Picker>
                                            }
                                            {field.type === 'date_picker' && data[field.name] !== undefined &&
                                                <>
                                                    <TouchableOpacity
                                                        style={{
                                                            marginTop: 20,
                                                            borderColor: 'silver',
                                                            borderWidth: 2,
                                                            backgroundColor: 'white',
                                                        }}
                                                        disabled={data[field.name] !== undefined && !data[field.name].editable}
                                                        onPress={() => {
                                                            setOpenDatePicker(true)
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                alignSelf: 'center',
                                                                color: colors.text,
                                                                padding: 10,
                                                            }}
                                                        >
                                                            {data[field.name].value !== '' ? ('' + months[new Date(data[field.name].value).getMonth()] + ' ' + new Date(data[field.name].value).getDate() + ', ' + new Date(data[field.name].value).getFullYear().toString()) : field.EN}
                                                        </Text>
                                                    </TouchableOpacity>
                                                    <DatePicker
                                                        modal
                                                        open={openDatePicker}
                                                        maximumDate={new Date()}
                                                        date={data[field.name]?.value !== '' ? new Date(data[field.name].value) : new Date()}
                                                        //minimumDate={new Date()}
                                                        is24hourSource="locale"
                                                        mode='date'
                                                        onConfirm={(date) => {
                                                            setOpenDatePicker(false)
                                                            const newdata = { ...data }
                                                            newdata[field.name] = { value: date.toISOString(), editable: true }
                                                            setData(newdata)
                                                        }}
                                                        onCancel={() => {
                                                            setOpenDatePicker(false)
                                                        }}
                                                    />
                                                </>}
                                        </View>
                                    );
                                })}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignContent: 'center',
                                    flexWrap: 'wrap'
                                }}
                            >
                                {dataVerificationFields.map((field) => {
                                    if (field.type === 'upload_file' && data[field.name] !== undefined) {
                                        return (
                                            <View
                                                key={field.name}
                                                style={{
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    alignContent: 'center',
                                                    marginTop: 20,
                                                }}
                                            >
                                                {JSON.stringify(data[field.name].value) === JSON.stringify({})
                                                    ?
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setUploadFieldName(field.name)
                                                            actionSheetDocumentRef.current.setModalVisible(true);
                                                        }}
                                                        style={{
                                                            alignSelf: 'center',
                                                        }}
                                                    >
                                                        <MaterialCommunityIcons
                                                            name={field.name === 'fileSelfie' ? 'account-box' : field.name === 'fileIdentity' ? 'card-account-details-outline' : field.name === 'fileBank' ? 'bank' : field.name === 'fileAddress' ? 'home-map-marker' : 'file-download-outline'}
                                                            color={colors.icon}
                                                            size={120}
                                                        />
                                                    </TouchableOpacity>
                                                    :
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setUploadFieldName(field.name)
                                                            actionSheetDocumentRef.current.setModalVisible(true);
                                                        }}
                                                        disabled={data[field.name] !== undefined && !data[field.name].editable}
                                                    >
                                                        <ImageBackground
                                                            source={data[field.name].value.uri === undefined
                                                                ?
                                                                {
                                                                    uri: 'https://service8081.moneyclick.com/attachment/getUserFile/' + userName + '/' + data[field.name].value.fileName,
                                                                    method: 'GET',
                                                                    headers: hmacInterceptor.process(
                                                                        httpRequest.create(
                                                                            'https://service8081.moneyclick.com',
                                                                            '/attachment/getUserFile/' + userName + '/' + data[field.name].value.fileName,
                                                                            'GET',
                                                                            null,
                                                                            false
                                                                        )).headers,
                                                                } : { uri: data[field.name].value.uri }}
                                                            resizeMode='cover'
                                                            resizeMethod='scale'
                                                            style={{
                                                                height: 120,
                                                            }}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign: 'center',
                                                                    color: 'red',
                                                                    fontSize: 11
                                                                }}
                                                            >
                                                                {data[field.name].value.uri !== undefined ? 'Press to change' : ''}
                                                            </Text>
                                                        </ImageBackground>
                                                    </TouchableOpacity>
                                                }
                                                <Text
                                                    style={{
                                                        width: 160,
                                                        height: 40,
                                                        fontSize: 15,
                                                        color: 'white',
                                                        textAlign: 'center',
                                                        textAlignVertical: 'center',
                                                    }}
                                                >
                                                    {field.EN}
                                                </Text>
                                            </View>
                                        )
                                    }
                                })
                                }
                            </View>
                        </ScrollView>
                    }
                </View>
                <>
                    {verificationTypeStatus === 'NEW' &&
                        <Body_Button
                            onPress={onPressSend}
                            label={'SEND'}
                            isLoading={isLoadingAddUserAttachment || isLoadingAddUserInfo || isLoadingStartVerification}
                        />
                    }
                </>
                <ActionSheetDocument
                    reference={actionSheetDocumentRef}
                    onPressCamera={onPressCamera}
                    onPressLibrary={onPressLibrary}
                />
            </View>
        </Body>
    );
};

export default React.memo(compose(withColors, withUserName, withConfig, withHmacInterceptor)(VerificationScreen));
