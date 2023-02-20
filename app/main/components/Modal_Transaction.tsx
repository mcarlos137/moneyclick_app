//PRINCIPAL
import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Animated,
  ActivityIndicator,
  TextInput
} from "react-native";
import Modal from 'react-native-modal';
import * as Animatable from "react-native-animatable";
import { NumericFormat } from "react-number-format";
import FastImage from "react-native-fast-image";
import { compose } from "redux";
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input'
import * as Keychain from 'react-native-keychain';
import { Picker } from "@react-native-picker/picker";
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'
//FUNCTIONS
import {
  getFieldName,
} from "../functions";
//HOC
import { withColors, withConfig, withUserName } from "../hoc";
//HOOKS
import { sendNotificationMessage } from "../hooks/sendNotificationMessage";

type Modal_Transaction_Request = {
  data: any[]
  isVisible: true
  label: string
  infoMessages?: any[]
  process: any
  isSuccess: boolean
  isError: boolean
  onPressCancel: any
  onPressClose: any
  allowSecongAuthStrategy: boolean
  colors: any
  userName: string
  config: any
}

const Component = ({
  data,
  isVisible,
  label,
  infoMessages,
  process,
  isSuccess,
  isError,
  onPressCancel,
  onPressClose,
  allowSecongAuthStrategy,
  colors,
  userName,
  config
}: Modal_Transaction_Request) => {

  //INITIAL STATES
  const [isAccepted, setIsAccepted] = useState(false)
  const [password, setPassword] = useState('')
  const [pinCode, setPinCode] = useState('')
  const [selectedFirstAuthStrategy, setSelectedFirstAuthStrategy] = useState('Password')
  const [firstAuthStrategies, setFirstAuthStrategies] = useState<string[]>(
    [
      'Password',
      //'Pin Code'
    ]
  )
  const [firstAuthStrategyValue, setFirstAuthStrategyValue] = useState('')
  const [secureTextEntry, setSecureTextEntry] = useState(true)
  const [isFirstAuthStrategyApproved, setIsFirstAuthStrategyApproved] = useState(false)
  const [secondAuthStrategyValue, setSecondAuthStrategyValue] = useState('')
  const [isSecondAuthStrategyApproved, setIsSecondAuthStrategyApproved] = useState(false)
  const [countDown, setCountDown] = useState(30)
  const [isCountDownRunning, setIsCountDownRunning] = useState(false)
  const [sendCount, setSendCount] = useState(0)
  const [mfaCodes, setMFACodes] = useState<string[]>([])
  const translationView = useRef(new Animated.Value(0)).current;

  const rnBiometrics = new ReactNativeBiometrics()

  //HOOKS CALLS
  const { mutate: mutateSendNotificationMessage, isSuccess: isSuccessSendNotificationMessage } =
    sendNotificationMessage()

  //EFFECTS
  useEffect(() => {
    rnBiometrics.isSensorAvailable().then(result => {
      if (result?.available) {
        if (result.biometryType === BiometryTypes.TouchID) {
          setFirstAuthStrategies([...firstAuthStrategies, 'Finger Print'])
        }
        if (result.biometryType === BiometryTypes.FaceID) {
          setFirstAuthStrategies([...firstAuthStrategies, 'Face Recognition'])
        }
        //ANDROID evaluate later
        if (result.biometryType === BiometryTypes.Biometrics) {
          setFirstAuthStrategies([...firstAuthStrategies, 'Biometrics'])
        }
      }
      console.log('result', result)
    })
    Keychain.getGenericPassword().then(result => {
      if (result) {
        console.log('getGenericPassword', result)
        setPassword(result.password)
      }
    })
  }, [])

  useEffect(() => {
    if (isAccepted) {
      Animated.timing(translationView, {
        toValue: -Dimensions.get('window').width,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translationView, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [isAccepted])

  useEffect(() => {
    setIsFirstAuthStrategyApproved(false)
    setFirstAuthStrategyValue('')
    setSecondAuthStrategyValue('')
    if (selectedFirstAuthStrategy === 'Finger Print' || selectedFirstAuthStrategy === 'Face Recognition') {
      rnBiometrics.simplePrompt({ promptMessage: 'Confirm fingerprint' })
        .then((resultObject) => {
          const { success } = resultObject
          if (success) {
            setTimeout(() => {
              setIsFirstAuthStrategyApproved(true)
            }, 1000)
          } else {
            console.log('user cancelled biometric prompt')
          }
        })
        .catch(() => {
          console.log('biometrics failed')
        })
    }
    /*if (selectedFirstAuthStrategy === 'Finger Print' || selectedFirstAuthStrategy === 'Face Recognition') {
      setTimeout(() => {
        setIsFirstAuthStrategyApproved(true)
      }, 2000)
    }*/
  }, [selectedFirstAuthStrategy])

  useEffect(() => {
    if (firstAuthStrategyValue === '') {
      return
    }
    if (selectedFirstAuthStrategy === 'Password') {
      if (firstAuthStrategyValue === password) {
        setIsFirstAuthStrategyApproved(true)
      } else {
        setIsFirstAuthStrategyApproved(false)
      }
    }
    if (selectedFirstAuthStrategy === 'Pin Code') {
      if (firstAuthStrategyValue === '1234') {
        setIsFirstAuthStrategyApproved(true)
      } else {
        setIsFirstAuthStrategyApproved(false)
      }
    }
  }, [firstAuthStrategyValue, password])

  useEffect(() => {
    if (!allowSecongAuthStrategy) {
      setIsSecondAuthStrategyApproved(true)
      return
    }
    if (isFirstAuthStrategyApproved) {
      startCountDown()
    }
  }, [isFirstAuthStrategyApproved])

  useEffect(() => {
    setIsSecondAuthStrategyApproved(false)
    if (secondAuthStrategyValue.length < 7) {
      return
    }
    if (mfaCodes.includes(secondAuthStrategyValue)) {
      setIsSecondAuthStrategyApproved(true)
    }
  }, [secondAuthStrategyValue])

  useEffect(() => {
    if (isSecondAuthStrategyApproved) {
      setTimeout(() => {
        process()
      }, 1000)
    }
  }, [isSecondAuthStrategyApproved])

  const startCountDown = () => {
    if (isCountDownRunning) {
      return
    }
    setIsCountDownRunning(true)
    let count = 30
    const interval = setInterval(() => {
      setCountDown(value => value - 1)
      count--
      console.log('count1', count)
      if (count === 0) {
        setCountDown(30)
        setIsCountDownRunning(false)
        clearInterval(interval)
      }
    }, 1000)
    setTimeout(() => {
      setSendCount(value => value + 1)
    }, 2000)
  }

  return (
    <Modal
      isVisible={isVisible}
      style={{ margin: 0, justifyContent: 'flex-end' }}
      backdropColor={colors.backdrop}
      backdropOpacity={0}
      animationIn='slideInUp'
      animationOut='slideOutDown'
      animationInTiming={500}
      animationOutTiming={500}
      backdropTransitionInTiming={500}
      backdropTransitionOutTiming={500}
    >
      <Animated.View
        style={{
          flexDirection: 'row',
          height: Dimensions.get('window').height,
          transform: [
            { translateX: translationView },
          ],
        }}
      >
        <View
          style={{
            width: Dimensions.get('window').width
          }}
        >
          <ScrollView
            style={{
              marginBottom: 10,
            }}
            persistentScrollbar={true}
          >
            <View
              style={{
                backgroundColor: colors.getRandomMain(),
                width: Dimensions.get("window").width,
                height: 80,
                paddingBottom: 20,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 20,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {""}
              </Text>
            </View>
            <View
              style={{
                width: Dimensions.get("window").width,
                backgroundColor: colors.background,
                height: 800
              }}
            >
              <View
                style={{
                  margin: 10,
                  padding: 10,
                  backgroundColor: colors.primaryBackground,
                  borderRadius: 10
                }}
              >
                {data.map((item, key) => {
                  return (
                    <Fragment key={key}>
                      {item.title !== "" && (
                        <Text
                          style={{
                            color: colors.text,
                            fontWeight: "bold",
                            paddingLeft: 10,
                            paddingTop: 10,
                          }}
                        >
                          {item.title}
                        </Text>
                      )}
                      {item.type === "TEXT" && (
                        <Text
                          style={{
                            color: colors.text,
                            paddingLeft: 15,
                          }}
                        >
                          {item.value}
                        </Text>
                      )}
                      {item.type === "NUMERIC" && (
                        <NumericFormat
                          value={item.value}
                          displayType={"text"}
                          thousandSeparator={true}
                          decimalScale={item.valueDecimals}
                          renderText={(value) => (
                            <Text
                              style={{
                                color: colors.text,
                                paddingLeft: 10,
                              }}
                            >
                              {item.valuePreffix + " " + value + " " + item.valueSuffix}
                            </Text>
                          )}
                        />
                      )}
                      {item.type === "JSON" && (
                        <>
                          {Object.keys(item.value)
                            .filter(
                              (key) =>
                                key !== "id" &&
                                key !== "type" &&
                                key !== "currency" &&
                                key !== "automaticCharge" &&
                                key !== "verified" &&
                                key !== "mcVerified" &&
                                key !== "own"
                            )
                            .map((key, i) => (
                              <Text
                                style={{
                                  color: colors.text,
                                  fontSize: 12,
                                  alignSelf: "flex-start",
                                  paddingLeft: 12,
                                }}
                                key={i}
                              >
                                {getFieldName(key)}: {item.value[key]}
                              </Text>
                            ))}
                        </>
                      )}
                      {item.type === "ASSET" && (
                        <FastImage
                          style={{
                            //flex: 1,
                            padding: 10,
                            marginLeft: 15,
                            marginTop: 5,
                            width: 100,
                            height: 100,
                          }}
                          source={item.value}
                        />
                      )}
                    </Fragment>
                  );
                })}
                <View style={{ height: 10 }} />
              </View>
              {infoMessages?.map((i, k) =>
                <Text
                  key={k}
                  style={{
                    color: i.color,
                    marginBottom: 10,
                    marginLeft: 15,
                    marginRight: 15,
                  }}
                >
                  {i.text}
                </Text>
              )}
              <View
                style={{
                  paddingLeft: 15,
                  paddingRight: 15,
                  paddingTop: infoMessages === undefined ? 20 : 10,
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.getRandomMain(),
                    padding: 10,
                    borderRadius: 10
                  }}
                  onPress={() => {
                    setIsAccepted(true)
                  }}
                >
                  <Text
                    style={{
                      alignSelf: "center",
                      color: "white",
                    }}
                  >
                    ACCEPT
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    padding: 10,
                    backgroundColor: 'transparent',
                    borderColor: colors.border,
                    borderWidth: 1,
                    marginTop: 10,
                    borderRadius: 10
                  }}
                  onPress={onPressCancel}
                >
                  <Text
                    style={{
                      alignSelf: "center",
                      color: colors.text,
                    }}
                  >
                    CANCEL
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
        <View
          style={{
            backgroundColor: colors.secundaryBackground,
            width: Dimensions.get('window').width,
            alignItems: 'center'
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setIsAccepted(false)
            }}
            style={{
              position: 'absolute',
              top: 100,
              right: 50
            }}
          >
            <FontAwesomeIcons
              name="close"
              color={colors.icon}
              size={26}
            />
          </TouchableOpacity>
          <Text
            style={{
              color: colors.text,
              marginTop: 100,
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          >
            {'User Authorization'}
          </Text>
          <View
            style={{
              marginTop: 20
            }}
          >
            <Picker
              style={{
                backgroundColor: colors.primaryBackground,
                borderRadius: 10,
              }}
              itemStyle={{
                height: 100,
                width: Dimensions.get('window').width * 0.85,
                fontSize: 14,
              }}

              enabled={!isFirstAuthStrategyApproved}
              mode='dropdown'
              dropdownIconColor={colors.icon}
              selectedValue={selectedFirstAuthStrategy}
              onValueChange={item => {
                setSelectedFirstAuthStrategy(item)
              }}
            >
              {!isFirstAuthStrategyApproved ?
                firstAuthStrategies.map((item, key) => {
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
                }) :
                <Picker.Item
                  color={colors.text}
                  label={selectedFirstAuthStrategy}
                  value={selectedFirstAuthStrategy}
                  style={{
                    color: colors.text,
                    backgroundColor: colors.primaryBackground,
                  }}
                />
              }
            </Picker>
            {selectedFirstAuthStrategy === 'Password' &&
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: Dimensions.get('window').width * 0.85,
                  marginTop: 20,
                }}
              >
                <TextInput
                  placeholder={'Enter your password'}
                  placeholderTextColor="#666666"
                  secureTextEntry={secureTextEntry}
                  style={{
                    height: 50,
                    flex: 1,
                    backgroundColor: colors.primaryBackground,
                    color: colors.text,
                    paddingLeft: 10,
                    paddingRight: 10,
                    borderRadius: 10,
                    fontSize: 16
                  }}
                  autoCapitalize="none"
                  value={firstAuthStrategyValue}
                  onChangeText={text => {
                    setFirstAuthStrategyValue(text)
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    setSecureTextEntry(value => !value)
                  }}
                >
                  {isFirstAuthStrategyApproved &&
                    <MaterialCommunityIcons
                      style={{
                        padding: 10
                      }}
                      name={'check'}
                      color={'green'}
                      size={26}
                    />
                  }
                  {secureTextEntry && !isFirstAuthStrategyApproved &&
                    <Feather
                      style={{
                        padding: 10
                      }}
                      name="eye-off"
                      color={colors.icon}
                      size={26}
                    />
                  }
                  {!secureTextEntry && !isFirstAuthStrategyApproved &&
                    <Feather
                      style={{
                        padding: 10
                      }}
                      name="eye"
                      color={colors.icon}
                      size={26}
                    />
                  }
                </TouchableOpacity>
              </View>
            }
            {selectedFirstAuthStrategy === 'Pin Code' &&
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: Dimensions.get('window').width * 0.85,
                  marginTop: 20,
                }}
              >
                <SmoothPinCodeInput
                  password mask="﹡"
                  cellStyle={{
                    borderWidth: 2,
                    borderColor: isFirstAuthStrategyApproved ? 'green' : 'silver'
                  }}
                  cellSize={50}
                  codeLength={4}
                  value={firstAuthStrategyValue}
                  onTextChange={text => {
                    setFirstAuthStrategyValue(text)
                  }}
                />
              </View>
            }
            {(selectedFirstAuthStrategy === 'Finger Print' || selectedFirstAuthStrategy === 'Face Recognition') && isFirstAuthStrategyApproved &&
              <Animatable.View
                animation="bounceIn"
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: Dimensions.get('window').width * 0.5,
                  alignSelf: 'center',
                  marginTop: 20,
                }}
              >
                <MaterialCommunityIcons
                  name={selectedFirstAuthStrategy === 'Finger Print' ? 'fingerprint' : 'face-recognition'}
                  color={'green'}
                  size={140}
                />
              </Animatable.View>
            }
            {allowSecongAuthStrategy && isFirstAuthStrategyApproved &&
              <View
                style={{
                  width: Dimensions.get('window').width * 0.85,
                  marginTop: 30,
                }}
              >
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 18,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginBottom: 10
                  }}
                >
                  {'2FA Verification'}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <TextInput
                    placeholder={''}
                    placeholderTextColor="#666666"
                    maxLength={7}
                    style={{
                      height: 50,
                      backgroundColor: colors.primaryBackground,
                      flex: 1,
                      color: colors.text,
                      paddingLeft: 10,
                      paddingRight: 10,
                      borderRadius: 10,
                      fontSize: 16,
                      marginRight: 10
                    }}
                    autoCapitalize="none"
                    value={secondAuthStrategyValue}
                    onChangeText={text => {
                      setSecondAuthStrategyValue(text)
                    }}
                  />
                  {isSecondAuthStrategyApproved &&
                    <MaterialCommunityIcons
                      style={{
                        padding: 10
                      }}
                      name={'check'}
                      color={'green'}
                      size={26}
                    />
                  }
                  {countDown > 0 && isCountDownRunning && !isSecondAuthStrategyApproved &&
                    <View
                      style={{
                        width: 36
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: colors.text,
                        }}
                      >
                        {countDown}
                      </Text>
                    </View>
                  }
                </View>
                {!isCountDownRunning && sendCount > 0 && sendCount <= 2 && !isSecondAuthStrategyApproved &&
                  <TouchableOpacity
                    style={{
                      marginTop: 5
                    }}
                    onPress={() => {
                      const mfaCode = String((Math.random() * (9999999 - 1000000 + 1) + 1000000).toFixed(0))
                      console.log('mfaCode', mfaCode)
                      setMFACodes([...mfaCodes, mfaCode])
                      mutateSendNotificationMessage({
                        userNames: [userName],
                        title: 'MFA Code',
                        content: mfaCode
                      })
                      startCountDown()
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: colors.text,
                        textDecorationLine: 'underline'
                      }}
                    >
                      {'resend'}
                    </Text>
                  </TouchableOpacity>
                }
                {!isCountDownRunning && sendCount > 2 && !isSecondAuthStrategyApproved &&
                  <View
                    style={{
                      marginTop: 5
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        marginBottom: 5
                      }}
                      onPress={() => {
                        startCountDown()
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: colors.text,
                          textDecorationLine: 'underline'
                        }}
                      >
                        {'resend by SMS'}
                      </Text>
                    </TouchableOpacity>
                    {config?.email !== undefined &&
                      <TouchableOpacity
                        onPress={() => {
                          startCountDown()
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            color: colors.text,
                            textDecorationLine: 'underline'
                          }}
                        >
                          {'resend by email'}
                        </Text>
                      </TouchableOpacity>
                    }
                  </View>
                }
              </View>
            }
          </View>
          {isSecondAuthStrategyApproved &&
            <>
              {!isSuccess && !isError &&
                <View
                  style={{
                    backgroundColor: colors.getRandomMain(),
                    marginTop: 30,
                    borderRadius: 10,
                    width: Dimensions.get('window').width * 0.85,
                    flexDirection: 'row',
                    justifyContent: 'center'
                  }}
                >
                  <Text
                    style={{
                      alignSelf: 'center',
                      color: 'white',
                      padding: 10,
                      fontSize: 16,
                      marginRight: 10
                    }}
                  >
                    {label}
                  </Text>
                  <ActivityIndicator
                    size="small"
                    animating={true}
                    color="white"
                  />
                </View>
              }
              {((!isSuccess && isError) || isSuccess) &&
                <>
                  <Text
                    style={{
                      alignSelf: 'center',
                      color: isError ? 'red' : 'green',
                      marginTop: 30,
                      fontSize: isError ? 12 : 14
                    }}
                  >
                    {isError ? 'There is some problem with the service. Please use business chats to report your problem.' : 'Process Succeeded'}
                  </Text>
                  <TouchableOpacity
                    style={{
                      padding: 10,
                      backgroundColor: 'transparent',
                      width: Dimensions.get('window').width * 0.85,
                      borderColor: colors.border,
                      borderWidth: 1,
                      marginTop: 10,
                      borderRadius: 10
                    }}
                    onPress={onPressClose}
                  >
                    <Text
                      style={{
                        alignSelf: "center",
                        color: colors.text,
                      }}
                    >
                      CLOSE
                    </Text>
                  </TouchableOpacity>
                </>
              }
            </>
          }
        </View>
      </Animated.View>
    </Modal>
  )
};

export default React.memo(compose(withColors, withUserName, withConfig)(Component));
