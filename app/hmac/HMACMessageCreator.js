import HMACAuthorizationHeader from './HMACAuthorizationHeader';
import { sha256 } from 'js-sha256';
import { Buffer } from 'buffer';

const ENCODING_UTF_8 = 'UTF-8';
const PARAMETER_HOST = 'Host';
const PARAMETER_X_SERVER_AUTHORIZATION_HMAC_SHA256 = 'X-Server-Authorization-HMAC-SHA256';

export default class HMACMessageCreator {
  static PARAMETER_AUTHORIZATION = 'Authorization';
  static PARAMETER_X_AUTHORIZATION_TIMESTAMP = 'X-Authorization-Timestamp';
  static PARAMETER_X_AUTHORIZATION_CONTENT_SHA256 = 'X-Authorization-Content-SHA256';
  static PARAMETER_CONTENT_LENGTH = 'Content-Length';
  static PARAMETER_CONTENT_TYPE = 'Content-Type';
  static PARAMETER_HOST = 'Host';

  constructor() { }

  createSignableRequestMessage1(request, authHeader) {
    let httpVerb = request.method.toUpperCase();
    let host = request.url.split('//')[1];
    let path = request.path;
    let queryParameters = request.params;
    if (queryParameters === undefined) {
      queryParameters = '';
    }
    //if (httpVerb === 'POST')
    //request.headers.post['Content-Type'] = 'application/json; charset=UTF-8';

    //if authHeader is not set, try setting it from request
    if (authHeader === undefined) {
      let authorization = request.headers.common[HMACMessageCreator.PARAMETER_AUTHORIZATION];
      authHeader = HMACAuthorizationHeader.getAuthorizationHeaderObject(
        authorization
      );
      if (authHeader === undefined) {
        let message =
          'Error: Invalid authHeader; one or more required attributes are not set.';

        throw new Error(message);
      }
    }
    let authorizationCustomHeaderParameterMap = this.getCustomHeaderMap(
      authHeader,
      request
    );
    let xAuthorizationTimestamp = request.headers[HMACMessageCreator.PARAMETER_X_AUTHORIZATION_TIMESTAMP];
    let contentLengthHeader = request.headers[HMACMessageCreator.PARAMETER_CONTENT_LENGTH];
    let contentLength = 0;
    if (contentLengthHeader !== undefined) {
      contentLength = parseInt(contentLengthHeader);
    }
    //optional content type
    let contentTypeHeader = httpVerb === 'POST'
        ? request.headers[HMACMessageCreator.PARAMETER_CONTENT_TYPE]
        : request.headers[HMACMessageCreator.PARAMETER_CONTENT_TYPE];
    let contentType = '';
    if (contentTypeHeader !== undefined) {
      contentType = contentTypeHeader;
    }
    //optional authorization content sha256
    let xAuthorizationContentSha256Header = request.headers[HMACMessageCreator.PARAMETER_X_AUTHORIZATION_CONTENT_SHA256];
    let xAuthorizationContentSha256 = '';
    if (xAuthorizationContentSha256Header !== undefined) {
      xAuthorizationContentSha256 = xAuthorizationContentSha256Header;
    }
    //optional request body
    let requestBody = request.data;
    return this.createSignableRequestMessage(
      httpVerb,
      host,
      path,
      queryParameters,
      authHeader,
      authorizationCustomHeaderParameterMap,
      xAuthorizationTimestamp,
      contentLength,
      contentType,
      xAuthorizationContentSha256,
      requestBody
    );
  }

  getCustomHeaderMap(authHeader, request) {
    let theMap = new Map();
    let customHeaders = authHeader.headers;
    if (customHeaders !== undefined && customHeaders.length > 0) {
      customHeaders.forEach((headerName) => {
        let headerValue = request.headers[headerName];
        if (headerValue === undefined) {
          let message =
            'Error: Custom header "' +
            headerName +
            '" cannot be found in the HTTP request.';
          throw new Error(message);
        }
        theMap.set(headerName.toLowerCase(), headerValue);
      });
    }
    return theMap;
  }

  createSignableRequestMessage(
    httpVerb,
    host,
    path,
    queryParameters,
    authHeader,
    authorizationCustomHeaderParameterMap,
    xAuthorizationTimestamp,
    contentLength,
    contentType,
    xAuthorizationContentSha256,
    requestBody
  ) {
    let result = [];
    //adding request URI information
    result.push(httpVerb);
    result.push('\n');
    result.push(host);
    result.push('\n');
    result.push(path);
    result.push('\n');
    result.push(queryParameters);
    result.push('\n');

    //adding Authorization header parameters
    result.push('id=');
    result.push(this.escapeProper(authHeader.id));
    result.push('&nonce=');
    result.push(this.escapeProper(authHeader.nonce));
    result.push('&realm=');
    result.push(this.escapeProper(authHeader.realm));
    result.push('&version=');
    result.push(this.escapeProper(authHeader.version));
    result.push('\n');

    //adding Authorization custom header parameters
    if (authorizationCustomHeaderParameterMap.length > 0) {
      let sortedCustomKeyList = authorizationCustomHeaderParameterMap
        .keys()
        .sort();
      sortedCustomKeyList.forEach((headerKey) => {
        result.push(headerKey.toLowerCase());
        result.push(':');
        result.push(authorizationCustomHeaderParameterMap.get(headerKey));
        result.push('\n');
      });
    }

    //adding X-Authorization-Timestamp
    result.push(xAuthorizationTimestamp);

    //adding more if needed
    if (
      this.isPassingRequestBody(
        contentLength,
        xAuthorizationContentSha256,
        requestBody
      )
    ) {
      if (this.isValidRequestBody(xAuthorizationContentSha256, requestBody)) {
        result.push('\n');
        result.push(contentType.toLowerCase());
        result.push('\n');
        result.push(xAuthorizationContentSha256);
      } else {
        let message =
          'Error: Request body does not have the same hash as X-Authorization-Content-Sha256 header.';
        throw new Error(message);
      }
    } else {
      let message = 'Error: Falling pasing request body';
    }
    return result.join('');
  }

  escapeProper(theString) {
    let x = encodeURI(theString).replace('+', '%20');
    return x;
  }

  isValidRequestBody(xAuthorizationContentSha256, requestBody) {
    if (
      xAuthorizationContentSha256 === undefined ||
      xAuthorizationContentSha256.length <= 0 ||
      requestBody === undefined
    ) {
      return false;
    }
    //calculate and check body hash
    let bytes = new Buffer(requestBody, 'utf8');
    let bodyHash = this.getBase64Sha256String(bytes); //v2 specification requires base64 encoded SHA-256
    return true;
    return bodyHash === xAuthorizationContentSha256;
  }

  isPassingRequestBody(
    contentLength,
    xAuthorizationContentSha256,
    requestBody
  ) {
    return !(
      contentLength <= 0 ||
      xAuthorizationContentSha256 === undefined ||
      xAuthorizationContentSha256.length <= 0 ||
      requestBody === undefined
    );
  }

  getBase64Sha256String(inputStream) {
    let inputStreamBytes = this.convertInputStreamIntoByteArrayOutputStream(
      inputStream
    ); //convert to byte array
    let hmac = sha256(inputStreamBytes);
    let result = btoa(
      new Uint8Array(hmac).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );
    return result;
  }

  convertInputStreamIntoByteArrayOutputStream(inputStream) {
    return inputStream;
  }
}
