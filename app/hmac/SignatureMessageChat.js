import RNSimpleCrypto from 'react-native-simple-crypto';
import { KEY_GEN_SIGNATURE } from '@env';
import { Crypt, RSA } from 'hybrid-crypto-js';
import base64 from 'react-native-base64';
class KeysPairs {
  constructor(privatekey, publicKey) {
    this.privateKey = privatekey;
    this.publicKey = publicKey;
  }
  signTextMessage(message, privatekey) {
    var crypt = new Crypt({ md: 'sha256' });
    var signature = crypt.signature(privatekey, message);
    return signature.signature;
  }
  async verifySignMessage(message, publicKey) {
    let signature = message.split('__')[0];
    let messageResult = message.split('__')[1];
    try {
      if (
        await RNSimpleCrypto.RSA.verify(
          signature,
          messageResult,
          publicKey,
          'SHA256'
        )
      ) {
        return messageResult;
      } else {
        return false;
        // The signature does not match.
      }
    } catch (error) {
      console.log(error);
    }
  }
  encrypTextMessage(message, publickey, signature) {
    var crypt = new Crypt({ md: 'sha256' });
    var encrypted = crypt.encrypt(publickey, message, signature);
    return JSON.stringify(encrypted);
  }
  encrypBase64Message(message, username) {
    let messageToBase64 = username + '__' + KEY_GEN_SIGNATURE + '__' + message;
    return base64.encode(messageToBase64);
  }
  decryptBase64Message(ecryptedMessage) {
    let result = base64.decode(ecryptedMessage);
    return result.split('__')[2];
  }

  decrypTextMessage(encodedMessage, privatekey, publicKeySender) {
    var crypt = new Crypt({ md: 'sha256' });
    let parseResult = JSON.parse(encodedMessage);

    var decrypted = crypt.decrypt(privatekey, parseResult);

    var verified = crypt.verify(
      publicKeySender,
      decrypted.signature,
      decrypted.message
    );

    return decrypted.message;
  }
  async generateKeysPair() {
    var rsa = new RSA({
      keySize: 1024,
    });
    let keyPair = await rsa.generateKeyPairAsync();
    var publicKey = keyPair.publicKey;
    var privateKey = keyPair.privateKey;
    //console.log(keyPair);
    // let endPrivate = keys.private.split('-----')[2];
    // let endPublic = keys.public.split('-----')[2];
    this.privateKey = privateKey;
    this.publicKey = publicKey;
  }
}
export default KeysPairs;
