import React, { useState, useRef, useEffect } from 'react'
import { Platform, Image, ActivityIndicator } from 'react-native'
import FastImage from 'react-native-fast-image';
import RNFetchBlob from 'rn-fetch-blob';
import { createThumbnail } from 'react-native-create-thumbnail';
import { compose } from 'redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import Video from 'react-native-video';
import storage from '@react-native-firebase/storage';
import * as Progress from 'react-native-progress';
//STORES
import { store as mediaStore } from '../stores/media';
//HOC
import { withColors } from '../hoc';

type Body_ImageVideo_Props = {
    assets: any[]
    source?: 'moneyclick' | 'firebase' | 'internal'
    uri?: string
    headers?: any
    width: number
    aspectRatioType: 'original' | 'square'
    videoProps?: any
    fileName: string
    inType: 'image' | 'video'
    outType: 'image' | 'video'
    firebaseUploadRef?: string
    colors: any
}

const mapStateToProps = state => {
    return {
        assets: state.assets,
    };
};

const ConnectedComponent = ({
    assets,
    source,
    uri,
    headers,
    width,
    aspectRatioType,
    videoProps,
    fileName,
    inType,
    outType,
    firebaseUploadRef,
    colors
}: Body_ImageVideo_Props) => {

    //INITIAL STATES
    const [scaledHeight, setScaledHeight] = useState(0)
    const progressPieRef = useRef<any>()
    const [showProgressBar, setShowProgressBar] = useState(false)
    const [firebaseUri, setFirebaseUri] = useState<null | string>(null)

    //EFFECTS
    useEffect(() => {
        if (source === 'firebase') {
            storage().ref(uri).getDownloadURL().then(response => {
                setFirebaseUri(response)
            })
        }
    }, [])

    useEffect(() => {
        if (assets[fileName] === undefined && source === 'moneyclick' && uri !== undefined) {
            RNFetchBlob.config({
                fileCache: true,
                appendExt: inType === 'video' ? 'mp4' : 'jpeg',
            })
                .fetch(
                    'GET',
                    uri,
                    headers)
                .then(data => {
                    if (inType === 'video') {
                        const videoAsset = { uri: (Platform.OS === 'android') ? 'file://' + data.data : data.data }
                        mediaStore.dispatch({ type: 'SET_ASSET', payload: { id: fileName, videoAsset: videoAsset } })
                        createThumbnail({
                            url: videoAsset.uri,
                            timeStamp: 2000,
                        })
                            .then(data => {
                                const uri = (Platform.OS === 'android') ? 'file://' + data.path : data.path
                                Image.getSize(uri, (width, height) => {
                                    mediaStore.dispatch({ type: 'SET_ASSET', payload: { id: fileName, imageAsset: { uri: uri, width: width, height: height } } })
                                });
                            })
                            .catch(err => {
                                console.log('>>>>>>>>>>err2' + JSON.stringify(err))
                            });
                    }
                    if (inType === 'image') {
                        const uri = (Platform.OS === 'android') ? 'file://' + data.data : data.data
                        Image.getSize(uri, (width, height) => {
                            mediaStore.dispatch({ type: 'SET_ASSET', payload: { id: fileName, imageAsset: { uri: uri, width: width, height: height } } })
                        });
                    }
                })
                .catch(err => {
                    console.log('>>>>>>>>>>err1 ' + JSON.stringify(err))
                });
        }
    }, [assets[fileName]])

    useEffect(() => {
        if (assets[fileName] === undefined && source === 'internal' && uri !== undefined) {
            if (inType === 'video') {
                const videoAsset = { uri: uri }
                mediaStore.dispatch({ type: 'SET_ASSET', payload: { id: fileName, videoAsset: videoAsset } })
                createThumbnail({
                    url: videoAsset.uri,
                    timeStamp: 2000,
                })
                    .then(data => {
                        const uri = (Platform.OS === 'android') ? 'file://' + data.path : data.path
                        Image.getSize(uri, (width, height) => {
                            mediaStore.dispatch({ type: 'SET_ASSET', payload: { id: fileName, imageAsset: { uri: uri, width: width, height: height } } })
                        });
                    })
                    .catch(err => {
                        console.log('>>>>>>>>>>err2' + JSON.stringify(err))
                    });
            }
            if (inType === 'image') {
                Image.getSize(uri, (width, height) => {
                    mediaStore.dispatch({ type: 'SET_ASSET', payload: { id: fileName, imageAsset: { uri: uri, width: width, height: height } } })
                });
            }
        }
    }, [assets[fileName]])

    useEffect(() => {
        if (assets[fileName] === undefined && source === 'firebase' && firebaseUri !== null) {
            RNFetchBlob.config({
                fileCache: true,
                appendExt: inType === 'video' ? 'mp4' : 'jpeg',
            })
                .fetch(
                    'GET',
                    firebaseUri)
                .then(data => {
                    if (inType === 'video') {
                        const videoAsset = { uri: (Platform.OS === 'android') ? 'file://' + data.data : data.data }
                        mediaStore.dispatch({ type: 'SET_ASSET', payload: { id: fileName, videoAsset: videoAsset } })
                        createThumbnail({
                            url: videoAsset.uri,
                            timeStamp: 2000,
                        })
                            .then(data => {
                                const uri = (Platform.OS === 'android') ? 'file://' + data.path : data.path
                                Image.getSize(uri, (width, height) => {
                                    mediaStore.dispatch({ type: 'SET_ASSET', payload: { id: fileName, imageAsset: { uri: uri, width: width, height: height } } })
                                });
                            })
                            .catch(err => {
                                console.log('>>>>>>>>>>err2' + JSON.stringify(err))
                            });
                    }
                    if (inType === 'image') {
                        const uri = (Platform.OS === 'android') ? 'file://' + data.data : data.data
                        Image.getSize(uri, (width, height) => {
                            mediaStore.dispatch({ type: 'SET_ASSET', payload: { id: fileName, imageAsset: { uri: uri, width: width, height: height } } })
                        });
                    }
                })
                .catch(err => {
                    console.log('>>>>>>>>>>err1 ' + JSON.stringify(err))
                });
        }
    }, [firebaseUri, assets[fileName]])

    useEffect(() => {
        if (source === 'internal' && inType === 'image' && assets[fileName]?.imageAsset !== undefined && firebaseUploadRef !== undefined && !assets[fileName]?.imageAsset?.uploaded) {
            setShowProgressBar(true)
            const task = storage()
                .ref(firebaseUploadRef)
                .putFile(inType === 'image' ? assets[fileName].imageAsset.uri : assets[fileName].videoAsset.uri)
            task.on('state_changed', taskSnapshot => {
                progressPieRef.current.progress = Number(taskSnapshot.bytesTransferred) / Number(taskSnapshot.totalBytes)
                console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
            });
            task.then((response) => {
                mediaStore.dispatch({ type: 'SET_ASSET', payload: { id: fileName, imageAsset: inType === 'image' ? { ...assets[fileName]?.imageAsset, uploaded: true } : { ...assets[fileName]?.videoAsset, uploaded: true } } })
                setTimeout(() => {
                    setShowProgressBar(false)
                }, 1000)
            });
        }
    }, [assets[fileName], progressPieRef.current])

    //PRINCIPAL RENDER
    if (outType === 'image' && assets[fileName]?.imageAsset !== undefined) {
        return (
            <FastImage
                style={{
                    width: width,
                    height: aspectRatioType === 'square' ? width : (assets[fileName]?.imageAsset?.height / assets[fileName]?.imageAsset?.width * width),
                    margin: 5,
                    borderRadius: 16,
                    borderWidth: 0.75,
                    borderColor: 'white',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                source={{ uri: assets[fileName]?.imageAsset?.uri }}
            >
                {inType === 'video' &&
                    <Ionicons
                        name={'ios-play-circle-outline'}
                        color={'white'}
                        size={35}
                    />
                }
                {showProgressBar &&
                    <Progress.Bar ref={progressPieRef} progress={progressPieRef?.current?.progress === undefined ? 0 : progressPieRef?.current.progress} width={70} height={12} color={colors.getRandomMain()} />
                }
            </FastImage>
        )
    }
    if (outType === 'video' && assets[fileName]?.videoAsset !== undefined) {
        return (
            <Video
                source={{
                    uri: assets[fileName]?.videoAsset?.uri,
                }}
                paused={videoProps.paused}
                controls={videoProps.controls}
                resizeMode='cover'
                onLoad={response => {
                    const { width: originalWidth, height: originalHeight } = response.naturalSize;
                    setScaledHeight(originalHeight * (width / originalWidth))
                }}
                onError={(error) => {
                    //console.log('>>>>>>>>>>>>> ' + JSON.stringify(error))
                }}
                style={{
                    height: aspectRatioType === 'square' ? width : scaledHeight,
                    width: width,
                    alignSelf: 'center',

                    //marginBottom: 5,
                }}
            >
                {showProgressBar &&
                    <Progress.Bar ref={progressPieRef} progress={progressPieRef?.current?.progress === undefined ? 0 : progressPieRef?.current.progress} width={70} height={12} color={colors.getRandomMain()} />
                }
            </Video>
        )
    }
    return null

}

export default React.memo(compose(withColors, connect(mapStateToProps))(ConnectedComponent))