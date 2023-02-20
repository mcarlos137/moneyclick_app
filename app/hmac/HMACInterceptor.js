import HMACAlgorithmFactory from './HMACAlgorithmFactory';
import HMACAuthorizationHeader from './HMACAuthorizationHeader';
import uuid from 'react-native-uuid';
import HMACMessageCreator from './HMACMessageCreator';
import { Buffer } from 'buffer';
import { sha256 } from 'js-sha256';
const VERSION = '2.0';

export default class HMACInterceptor {

  constructor(realm, accessKey, secretKey, algorithmName, deviceId) {
    this.realm = realm;
    this.accessKey = accessKey;
    this.secretKey = secretKey;
    let algorithmFactory = new HMACAlgorithmFactory();
    this.algorithm = algorithmFactory.createAlgorithm(algorithmName);
    this.customHeaders = [];
    this.deviceId = deviceId;
  }
  setRealAndAccess(realm, secretKey, deviceId) {
    let realmdata = String(realm);
    if (realmdata.includes('@')) {
      realmdata = realmdata.replace('@', '____');
    }
    this.realm = realmdata;
    this.secretKey = secretKey;
    this.deviceId = deviceId;
  }
  getRealm() {
    return this.realm;
  }
  getAccessKey() {
    return this.accessKey;
  }
  getSecretKey() {
    return this.secretKey;
  }
  getDeviceId() {
    return this.deviceId;
  }
  createHMACAuthorizationHeader() {
    let result = new HMACAuthorizationHeader(
      this.realm,
      this.accessKey,
      uuid.v4(),
      VERSION,
      this.customHeaders,
      /*signature*/ null,
      this.deviceId
    );
    if (result.isAuthorizationHeaderValid()) {
      return result;
    } else {
      return null;
    }
  }

  process(request) {
    let authHeader = this.createHMACAuthorizationHeader();
    if (authHeader === undefined) {
      let message =
        'Error: Invalid authHeader; one or more required attributes are not set.';
      throw new Error(message);
    }
    //add X-Authorization-Timestamp if not set
    let xAuthorizationTimestampHeaderHeader = request.headers[HMACMessageCreator.PARAMETER_X_AUTHORIZATION_TIMESTAMP];
    if (xAuthorizationTimestampHeaderHeader === undefined) {
      let unixTime = this.getCurrentUnixTime();
      request.headers[HMACMessageCreator.PARAMETER_X_AUTHORIZATION_TIMESTAMP] = unixTime.toString();
    }
    //check content length
    let contentLengthHeader =
      request.headers[HMACMessageCreator.PARAMETER_CONTENT_LENGTH];
    let contentLength = 0;
    if (contentLengthHeader !== undefined) {
      contentLength = parseInt(contentLengthHeader);
    }
    if (contentLength > 0) {
      request.headers[
        HMACMessageCreator.PARAMETER_CONTENT_LENGTH
      ] = contentLength;
      let xAuthorizationContentSha256Header =
        request.headers[HMACMessageCreator.PARAMETER_X_AUTHORIZATION_CONTENT_SHA256];
      if (xAuthorizationContentSha256Header === undefined) {
        try {
          let bytes = new Buffer(request.data, 'utf8');
          let bodyHash = this.getBase64Sha256String(bytes);
          request.headers[HMACMessageCreator.PARAMETER_X_AUTHORIZATION_CONTENT_SHA256] = bodyHash;
        } catch (error) {
          // console.log(error);
        }
      }
    }
    //create signature
    let messageCreator = new HMACMessageCreator();
    let signableRequestMessage = messageCreator.createSignableRequestMessage1(
      request,
      authHeader
    );
    let signedRequestMessage = '';
    try {
      signedRequestMessage = this.algorithm.encryptMessage(
        this.secretKey,
        signableRequestMessage
      );
    } catch (e) {
      let message = 'Fail to sign request message';
      // console.log(message, e);
      throw new Error(message, e);
    }
    authHeader.signature = signedRequestMessage;
    //add Authorization with encrypted signature
    request.headers[
      HMACMessageCreator.PARAMETER_AUTHORIZATION
    ] = authHeader.toString();
    return request;
    //request.headers[HMACMessageCreator.PARAMETER_HOST] = request.baseURL;
  }

  getBase64Sha256String(inputStream) {
    try {
      let hmac = sha256.arrayBuffer(inputStream);
      let result = btoa(
        new Uint8Array(hmac).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );
      return result;
    } catch (error) {
      // console.log(error);
    }
  }
  getCurrentUnixTime() {
    return parseInt(new Date().getTime() / 1000);
  }
}
