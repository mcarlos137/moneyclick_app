import { Alert } from 'react-native'
import { useQuery } from "react-query"
import { request, requestBushido } from "../../tools/axiosUtils"
import security from "../../tools/security";

const signInRequest = ({ queryKey }) => {
  var password = security.encode(security.encode(queryKey[3]) + security.bytesToBase64(security.randomBytes(50)));
  var pin = security.encode(security.encode('2018') + security.bytesToBase64(security.randomBytes(50)));
  var device = security.encode(security.encode(queryKey[4]) + security.bytesToBase64(security.randomBytes(50)));
  let body = {
    countryCode: queryKey[1],
    phone: queryKey[2],
    credentials: [password, pin, device],
  }
  return requestBushido({ url: `/user/auth/moneyclick`, method: 'post', data: body })
}

export const signIn = (areaCode: string, phone: string, password: string, deviceId: any) => {
  return useQuery(
    ['signIn', areaCode, phone, password, deviceId],
    signInRequest,
    {
      enabled: false,
      select: (data) => decorateSignInResponse(data.data),
      onSuccess: onSuccessSignIn
    }
  )
}

const onSuccessSignIn = (data) => {
  if (data.errors !== null) {
    switch (data.errors[0].code) {
      case 9:
        return Alert.alert('Sign In Error', 'Wrong credentials.', [
          { text: 'Ok' }
        ]);
      case 32:
        return Alert.alert('Sign In Error', 'User is not registered.', [
          { text: 'Ok' }
        ]);
      case 53:
        /*addNewDeviceStore.dispatch(addNewDeviceAction(
          signInResponse.base.userName,
          indexStore.getState().passwordState,
          indexStore.getState().deviceState.id,
          indexStore.getState().deviceState.name,
          indexStore.getState().deviceState.model,
          indexStore.getState().deviceState.so,
          false,
          null
        ));*/
        return Alert.alert('Sign In Error', 'Device is not active for this user. Go to http://moneyclick.com in you computer and activate device in section profile -> account -> devices', [
          { text: 'Ok' }
        ]);
      case 56:
        return Alert.alert('Sign In Error', 'Device is not active for this user. Go to http://moneyclick.com in you computer and activate device in section profile -> account -> devices', [
          { text: 'Ok' }
        ]);
      case 57:
      case 58:
        /*addNewDeviceStore.dispatch(addNewDeviceAction(
          signInResponse.base.userName,
          indexStore.getState().passwordState,
          indexStore.getState().deviceState.id,
          indexStore.getState().deviceState.name,
          indexStore.getState().deviceState.model,
          indexStore.getState().deviceState.so,
          true,
          'FULL'
        ));*/
        return Alert.alert('Sign In Error', 'Device is not active for this user. Go to http://moneyclick.com in you computer and activate device in section profile -> account -> devices', [
          { text: 'Ok' }
        ]);
      case 71:
        return Alert.alert('Sign In Error', 'Previous session active.', [
          { text: 'Ok' }
        ]);
      default:
    }
  }
  if (!data.base.verifiedDevice) {
    return Alert.alert('Sign In Error', 'Device is not verified.', [
      { text: 'Ok' }
    ]);
  }
  if (data.base.userName === null || data.base.secretKey === null) {
    return Alert.alert('Sign In Error', 'There is a problem. Contact software administrator.', [
      { text: 'Ok' }
    ]);
  }
}

type BushidoUser = {
  username: string
  tokenAPP: string
  nickName: string
  phoneVerified: boolean
  email: string
  firstName: string
  lastName: string
  userfrequents: BushidoUserFrequent[]
}

type BushidoUserFrequent = {
  codCountry: string
  nameUserFrequent: string
  phone: string
  username: string
}

type BushidoError = {
  code: number
}

type SignInData = {
  user: BushidoUser
  token: string
  levelAccess: string
  retailId: string
  errors: BushidoError[]
}

const decorateSignInResponse = (data: SignInData) => {
  //base data
  let userName: string | null = null;
  let email: string | null = null;
  let nickName: string | null = null;
  let firstName: string | null = null;
  let lastName: string | null = null;
  let secretKey: string | null = null;
  let verifiedDevice = false;
  //other data
  let firebaseAppToken: string | null = null;
  let accessLevel = 'FULL';
  let asociatedRetail: string | null = null;
  let frequentUsers: string | null = null;
  //errors
  let errors: BushidoError[] | null = null;
  if (
    data.token !== null &&
    data.token !== '' &&
    data.token !== undefined
  ) {
    //If null is because an error
    secretKey = data.token;
    if (secretKey !== null) {
      while (secretKey?.includes('-')) {
        secretKey = secretKey.replace('-', '');
      }
    }
  }
  if (
    data.errors !== null &&
    data.errors !== undefined
  ) {
    errors = data.errors;
  }
  if (
    data.levelAccess !== null &&
    data.levelAccess !== '' &&
    data.levelAccess !== undefined
  ) {
    //Device is not configured
    accessLevel = data.levelAccess;
  }
  if (
    data.retailId !== null &&
    data.retailId !== 'null' &&
    data.retailId !== '' &&
    data.retailId !== undefined
  ) {
    //Has retail asociated
    asociatedRetail = data.retailId;
  }
  if (
    data.user !== null &&
    data.user !== undefined
  ) {
    if (
      data.user.username !== null &&
      data.user.username !== '' &&
      data.user.username !== undefined
    ) {
      userName = data.user.username;
    }
    if (
      data.user.nickName !== null &&
      data.user.nickName !== '' &&
      data.user.nickName !== undefined
    ) {
      nickName = data.user.nickName;
    }
    if (
      data.user.tokenAPP !== undefined &&
      data.user.tokenAPP !== null &&
      data.user.tokenAPP !== ''
    ) {
      firebaseAppToken = data.user.tokenAPP;
    }
    if (
      data.user.phoneVerified !== undefined &&
      data.user.phoneVerified !== null
    ) {
      verifiedDevice = data.user.phoneVerified;
    }
    if (
      data.user.email !== undefined &&
      data.user.email !== null &&
      data.user.email !== ''
    ) {
      email = data.user.email;
    }
    if (
      data.user.firstName !== undefined &&
      data.user.firstName !== null &&
      data.user.firstName !== ''
    ) {
      firstName = data.user.firstName;
    }
    if (
      data.user.lastName !== undefined &&
      data.user.lastName !== null &&
      data.user.lastName !== ''
    ) {
      lastName = data.user.lastName;
    }
    if (
      data.user.userfrequents !== undefined &&
      data.user.userfrequents !== null
    ) {
      frequentUsers = JSON.parse(JSON.stringify(data.user.userfrequents))
    }
  }
  return {
    base: {
      userName: userName,
      nickName: nickName,
      email: email,
      firstName: firstName, lastName: lastName,
      secretKey: secretKey,
      verifiedDevice: verifiedDevice
    },
    other: {
      firebaseAppToken: firebaseAppToken,
      accessLevel: accessLevel,
      asociatedRetail: asociatedRetail,
      frequentUsers: frequentUsers
    },
    errors: errors
  }
};
