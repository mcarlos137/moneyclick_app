import HMACInterceptor from '../hmac/HMACInterceptor';

const headersHMAC = {

  getInterceptor() {
    try {
      return new HMACInterceptor(
        'Admin',
        'f0d16792-cdc9-4585-a5fd-bae3d898d8c5',
        'eox4TsBBPhpi737yMxpdBbr3sgg/DEC4m47VXO0B8qJLsbdMsmN47j/ZF/EFpyUKtAhm0OWXMGaAjRaho7/93Q==',
        'SHA256',
        null
      );;
    } catch (error) {
      // console.log(error);
    }
  },
  /*getInterceptor(userName, secretKey, deviceId) {
    try {
      const interceptor = new HMACInterceptor(
        'Admin',
        'f0d16792-cdc9-4585-a5fd-bae3d898d8c5',
        'eox4TsBBPhpi737yMxpdBbr3sgg/DEC4m47VXO0B8qJLsbdMsmN47j/ZF/EFpyUKtAhm0OWXMGaAjRaho7/93Q==',
        'SHA256',
        null
      );
      interceptor.setRealAndAccess(userName, secretKey, deviceId);
      return interceptor;
    } catch (error) {
      // console.log(error);
    }
  },*/
  getRealm() {
    return interceptor.getRealm();
  },
  getAccessKey() {
    return interceptor.getAccessKey();
  },
  getSecretKey() {
    return interceptor.getSecretKey();
  },
  getDeviceId() {
    return interceptor.getDeviceId();
  },
};

export default headersHMAC;
