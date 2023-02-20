//PRINCIPAL
import React, { useEffect, useCallback, useState, createRef, useMemo } from 'react';
import { Dimensions, ScrollView } from 'react-native';
import { compose } from 'redux'
import { StackActions } from '@react-navigation/native';
//FUNCTIONS
import { handleChooseDocument, validateConfirmationModalTransaction } from '../../main/functions';
//COMPONENTS
import Body from '../../main/components/Body'
import Body_Picker from '../../main/components/Body_Picker'
import Body_Input from '../../main/components/Body_Input'
import Body_Button from '../../main/components/Body_Button'
import Body_Card from './components/Body_Card'
import Body_Asset from './components/Body_Asset'
import Modal_Transaction from '../../main/components/Modal_Transaction'
import ActionSheetDocument from '../../main/components/ActionSheetDocument';
//HOC
import { withColors, withDetailedBalances, withUserName } from '../../main/hoc';
//HOOKS
import { requestDebitCard } from './hooks/requestDebitCard';

const DebitCardsRequestScreen = ({ navigation, route, colors, userName, detailedBalances }) => {

    //INITIAL STATES
    const [currency, setCurrency] = useState(detailedBalances.find(cur => cur.value === 'USD'))
    const [holderName, setHolderName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('')
    const [model, setModel] = useState('MONEYCLICK - 1')
    const [photoAsset, setPhotoAsset] = useState<any>({})
    const [isVisibleModalTransaction, setIsVisibleModalTransaction] = useState(false)
    const [actionSheetDocumentRef, setActionSheetDocumentRef] = useState<any>(createRef())

    //HOOKS CALLS
    const { mutate: mutateRequestDebitCard, isSuccess: isSuccessRequestDebitCard, isError: isErrorRequestDebitCard } =
        requestDebitCard()

    //EFFECTS
    useEffect(() => {
        console.log('DebitCardsRequestScreen', route.params)
    }, []);

    //MEMOS
    const modalData = useMemo(() => {
        let data: any = [];
        data.push(
            {
                title: 'Currency:',
                type: 'TEXT',
                value: currency.value,
            }
        );
        data.push(
            {
                title: 'Holder name:',
                type: 'TEXT',
                value: holderName,
            }
        );
        data.push(
            {
                title: 'Phone number:',
                type: 'TEXT',
                value: phoneNumber,
            }
        );
        data.push(
            {
                title: 'Email:',
                type: 'TEXT',
                value: email,
            }
        );
        data.push(
            {
                title: 'Model:',
                type: 'TEXT',
                value: model,
            }
        );
        return data;
    }, [currency, holderName, phoneNumber, email, model])


    //CALLBACKS
    const onValueChangeCurrency = useCallback((item, itemIndex) => {
        setCurrency(item)
    }, [])

    const onChangeTextHolderName = useCallback(text => {
        setHolderName(text)
    }, [])

    const onChangeTextPhoneNumber = useCallback(text => {
        setPhoneNumber(text)
    }, [])

    const onChangeTextEmail = useCallback(text => {
        setEmail(text.toLowerCase())
    }, [])

    const onValueChangeModel = useCallback((item, itemIndex) => {
        setModel(item)
    }, [])

    const onPressSendRequest = useCallback(() => {
        setIsVisibleModalTransaction(validateConfirmationModalTransaction(
            [
                { name: 'HOLDER_NAME', value: holderName, type: 'TEXT' },
                { name: 'PHONE_NUMBER', value: phoneNumber, type: 'TEXT' },
                { name: 'EMAIL', value: email, type: 'TEXT' },
            ]
        ))
    }, [holderName, phoneNumber, email])


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
                setPhotoAsset(asset)
            }
        )
    }, [])

    const process = () => {
        mutateRequestDebitCard({
            userName: userName,
            currency: currency.value,
            holderName: holderName,
            phoneNumber: phoneNumber,
            email: email,
            model: model,
            photo: photoAsset
        })
    }

    const onPressClose = useCallback(() => {
        setIsVisibleModalTransaction(false)
        navigation.dispatch(StackActions.popToTop())
    }, [])

    const onPressCancel = useCallback(() => setIsVisibleModalTransaction(false), [])

    //PRINCIPAL RENDER
    return (
        <>
            <Body>
                <>
                    <ScrollView
                        style={{
                            width: Dimensions.get('window').width * 0.9,
                            alignSelf: 'center',
                        }}
                    >
                        <Body_Picker
                            selectedValue={detailedBalances.find(cur => cur.value === currency.value)}
                            values={detailedBalances.filter(cur => !cur.isCrypto)}
                            onValueChange={onValueChangeCurrency}
                            marginTop={10}
                            labelField={'text'}
                        />
                        <Body_Input
                            value={holderName}
                            type={'text'}
                            placeholder={'Holder Name'}
                            onChangeText={onChangeTextHolderName}
                        />
                        <Body_Input
                            value={phoneNumber}
                            type={'text'}
                            placeholder={'Phone Number +1 XXX XXX XXXX'}
                            onChangeText={onChangeTextPhoneNumber}
                        />
                        <Body_Input
                            value={email}
                            type={'text'}
                            placeholder={'Email'}
                            onChangeText={onChangeTextEmail}
                        />
                        <Body_Asset
                            asset={photoAsset}
                            setAsset={setPhotoAsset}
                            actionSheetDocumentRef={actionSheetDocumentRef}
                        />
                        <Body_Picker
                            selectedValue={model}
                            values={['MONEYCLICK - 1', 'MONEYCLICK - 2', 'MONEYCLICK - 3', 'VISA', 'MASTER CARD']}
                            onValueChange={onValueChangeModel}
                            marginTop={10}
                        />
                        <Body_Card
                            photoAsset={photoAsset}
                            holderName={holderName}
                            model={model}
                        />
                        <Body_Button
                            onPress={onPressSendRequest}
                            label={'SEND REQUEST'}
                        />
                    </ScrollView>
                    <ActionSheetDocument
                        reference={actionSheetDocumentRef}
                        onPressCamera={onPressCamera}
                        onPressLibrary={onPressLibrary}
                    />
                </>
            </Body>
            <Modal_Transaction
                data={modalData}
                isVisible={isVisibleModalTransaction}
                label={'DEBIT CARD REQUEST'}
                process={process}
                isSuccess={isSuccessRequestDebitCard}
                isError={isErrorRequestDebitCard}
                onPressClose={onPressClose}
                onPressCancel={onPressCancel}
                allowSecongAuthStrategy={false}
            />
        </>
    );
};

export default React.memo(compose(withColors, withUserName, withDetailedBalances)(DebitCardsRequestScreen));
