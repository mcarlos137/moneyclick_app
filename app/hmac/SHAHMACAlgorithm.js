import { Buffer } from 'buffer';
import { Platform } from 'react-native';
import { sha256 } from 'js-sha256';

export default class SHAHMACAlgorithm {
  constructor(shaSize) {
    shaSize = parseInt(shaSize);
    try {
      if (
        shaSize !== 1 &&
        shaSize !== 256 &&
        shaSize !== 384 &&
        shaSize !== 512
      )
        throw new Error(
          'Size ' +
            shaSize +
            ' not supported (only 1, 256, 384 and 512 are supported)'
        );
    } catch (err) {
      //console.log(err);
    }
    this.algorithm = 'SHA' + shaSize;
  }

  encryptMessage(secretKey, message) {
    let signatureHex = '';
    try {
      if (Platform.OS === 'android') {
        let mes = new Buffer(message);
        let key = new Buffer(secretKey, 'base64');
        var hash = sha256.hmac.update(key, mes).arrayBuffer();
        signatureHex = btoa(
          new Uint8Array(hash).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        );
      } else {
        let mes = new Buffer(message);
        let key = new Buffer(secretKey, 'base64');
        var hash = sha256.hmac.update(key, mes).arrayBuffer();
        signatureHex = btoa(
          new Uint8Array(hash).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        );
      }
      return signatureHex;
    } catch (error) {
      console.log(error);
    }
  }
}
