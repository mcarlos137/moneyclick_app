import { Alert, Platform } from "react-native";
import Share from "react-native-share";
import { request, PERMISSIONS, check, RESULTS } from "react-native-permissions";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import storage from '@react-native-firebase/storage';
//CONSTANTS
import { Currency, currencies as currenciesParams } from "../constants/currenciesParams";
import { months } from "../constants/time";
//STORES
import { store as requestHeadersStore } from "./stores/requestHeaders"; 
//HOOKS
import { BalanceAPI } from "../containers/wallet/hooks/getBalance";
//TOOLS
import httpRequest from "../tools/httpRequest";

export function getRequire(assetName) {
  switch (assetName) {
    case "venezuela":
      return require("../../assets/venezuela.png");
    case "usa":
      return require("../../assets/usa.png");
    case "btc":
      return require("../../assets/btc.png");
    case "europa":
      return require("../../assets/europa.png");
    case "argentina":
      return require("../../assets/argentina.png");
    case "chile":
      return require("../../assets/chile.png");
    case "mexico":
      return require("../../assets/mexico.png");
    case "panama":
      return require("../../assets/panama.png");
    case "colombia":
      return require("../../assets/colombia.png");
    case "peru":
      return require("../../assets/peru.png");
    case "switzerland":
      return require("../../assets/switzerland.png");
    case "dominicana":
      return require("../../assets/dominicana.png");
    case "tether":
      return require("../../assets/tether.png");
    case "eth":
      return require("../../assets/eth.png");
    case "btc_cash":
      return require("../../assets/btc_cash.png");
    case "doge":
      return require("../../assets/doge.png");
    case "ltc":
      return require("../../assets/ltc.png");
    case "dash":
      return require("../../assets/dash.png");
    case "xrp":
      return require("../../assets/xrp.png");
    case "kkt":
      return require("../../assets/kkt.png");
    case "CHAT_ROOM_NAVIGATOR":
    case "MONEYCLICK_USER_SEND":
      return require("../../assets/img_user_default.png");
    case "GIFT_CARD_BUY":
      return require("../../assets/img_giftcard.png");
    case "FIAT_BANK_TRANSFER":
      return require("../../assets/img_bank.png");
    case "CRYPTO_SEND":
      return require("../../assets/img_blockchain.png");
    case "DEBIT_CARD":
      return require("../../assets/img_debitcard.png");
    case "BITCOINRECHARGE":
      return require("../../assets/logo_bitcoinrecharge.png");
    case "MONEYCLICK":
      return require("../../assets/logo_mc_2.png");
    case "MONEYCLICK_1":
      return require("../../assets/logo_mc_1.png");
    case "VISA":
      return require("../../assets/logo_visa.png");
    case "MASTER":
      return require("../../assets/logo_master.png");
    case "AMAZON":
      return require("../../assets/logo_amazon.png");
    case "NETFLIX":
      return require("../../assets/logo_netflix.png");
    case "DISNEYPLUS":
      return require("../../assets/logo_disneyplus.png");
    case "GOOGLE":
      return require("../../assets/logo_google.png");
    case "APPLE":
      return require("../../assets/logo_apple.png");
    case "HBOMAX":
      return require("../../assets/logo_hbomax.png");
    case "CREDIT_CARD":
      return require("../../assets/credit_card.png");
    case "MONEY_CALL":
      return require("../../assets/money_call.png");
    case "MY_DIGITAL_BUSINESS":
      return require("../../assets/digital_business.png");
    case "SUBSCRIPTION":
      return require("../../assets/subscription.png");
    case "INVESTMENT":
      return require("../../assets/investment.png");
    case "CASH":
      return require("../../assets/cash.png");
    case "DONATE":
      return require("../../assets/cash.png");
    case "defensive":
      return require("../../assets/planDefensiveIcon.png");
    case "moderate":
      return require("../../assets/planModerateIcon.png");
    case "intense":
      return require("../../assets/planIntenseIcon.png");
    case "aggressive":
      return require("../../assets/planAggressiveIcon.png");
    case "benito":
      return require("../../assets/benito.jpg");
    case "rosalia":
      return require("../../assets/rosalia.jpg");
    case "ariana":
      return require("../../assets/ariana.jpg");
    case "ozuna":
      return require("../../assets/ozuna.jpg");
    case "camilo":
      return require("../../assets/camilo.jpg");
    case "live_streaming_1":
      return require("../../assets/live_streaming_1.png");
    case "live_streaming_2":
      return require("../../assets/live_streaming_2.png");
    case "live_streaming_3":
      return require("../../assets/live_streaming_3.jpg");
    case "money_call_1":
      return require("../../assets/money_call_1.jpg");
    case "money_call_2":
      return require("../../assets/money_call_2.png");
    case "fan_content_1":
      return require("../../assets/fan_content_1.jpeg");
    case "fan_content_2":
      return require("../../assets/fan_content_2.jpeg");
    case "fan_content_3":
      return require("../../assets/fan_content_3.jpg");
    case "wallet_1":
      return require("../../assets/wallet_1.png");
    case "wallet_2":
      return require("../../assets/wallet_2.jpg");
    case "wallet_3":
      return require("../../assets/wallet_3.png");
    case "wallet_4":
      return require("../../assets/wallet_4.png");
    case "wallet_5":
      return require("../../assets/wallet_5.jpeg");
    case "wallet_6":
      return require("../../assets/wallet_6.jpg");
    case "podcast_1":
      return require("../../assets/podcast_1.jpg");
    case "podcast_2":
      return require("../../assets/podcast_2.jpg");
    case "exchange":
      return require("../../assets/exchange.jpg");
    case "p2p":
      return require("../../assets/p2p.jpg");
    case "STEP_CURRENT":
      return require("../../assets/stepCurrent.png");
    case "STEP_NEXT":
      return require("../../assets/stepNext.png");
    case "STEP_DONE":
      return require("../../assets/stepDone.png");
    default:
    return {
      uri:
        "https://service8081.moneyclick.com/attachment/getUserFile/" + assetName,
      method: "GET",
      headers: requestHeadersStore.getState().hmacInterceptor?.process(
        httpRequest.create(
          "https://service8081.moneyclick.com",
          "/attachment/getUserFile/" + assetName,
          "GET",
          null,
          false
        )
      ).headers,
    };
  }
}

export function formatValue(value) {
  let valueString = value.toString();
  if (valueString.includes('e')) {
    valueString = Number(valueString).toFixed(2);
  }
  return valueString;
}

export interface CurrencyBalance extends Currency {
  availableBalance?: number
  usdEstimatedBalance?: number
  deferredBalance?: number
  btcBuyPrice?: number
  btcSellPrice?: number
  btcBuyMinAmount?: number
  btcBuyMaxAmount?: number
  btcSellMinAmount?: number
  btcSellMaxAmount?: number
}

export const getDetailedBalances = (balance: BalanceAPI, currencies: any, currenciesOrder: string[], type: string) => {
  const detailedBalances: CurrencyBalance[] = [];
  let currenciesFiltered = currencies.filter((currency) => {
    return currency.active && (type === 'ALL' || type === 'FIAT' && !currenciesParams[currency.shortName].isCrypto || type === 'CRYPTO' && currenciesParams[currency.shortName].isCrypto);
  });
  let usdEstimatedBalance = 0;
  let btcEstimatedBalance = 0;
  Object.entries(balance).forEach(([key, value]) => {
    if (key !== "usdEstimatedBalance" && key !== "btcEstimatedBalance") {
      let findCurrency = currenciesFiltered.find((currency) => {
        return currency.shortName === key;
      });
      let currency: CurrencyBalance = {
        key: key.toLowerCase(),
        value: key,
        flag: key.toLowerCase(),
        text: "",
        img: "splash_mc",
        alias: key,
        isCrypto: false,
        symbol: " ",
        priority: 99,
        decimals: 2,
        isActive: true
      };
      if (findCurrency !== undefined) {
        currency = { ...currenciesParams[key] };
        let indexPosition = currenciesOrder.indexOf(key);
        //if (indexPosition !== -1) {
        //currency.priority = indexPosition + 1;
        //}
        currency.availableBalance =
          Number(value.availableBalance) > 0.000001
            ? value.availableBalance
            : Number(value.availableBalance).toFixed(12);
        currency.usdEstimatedBalance = value.usdEstimatedBalance;
        currency.deferredBalance =
          value.deferredBalance !== undefined
            ? Number(value.deferredBalance) > 0.000001
              ? value.deferredBalance
              : Number(value.deferredBalance).toFixed(12)
            : 0;
        currency.btcBuyPrice =
          value.btcBuyPrice !== null ? value.btcBuyPrice : 0;
        currency.btcSellPrice =
          value.btcSellPrice !== null ? value.btcSellPrice : 0;
        if (value.btcBuyPrice !== null && value.btcSellPrice !== null) {
          currency.btcBuyMinAmount = value.btcBuyMinAmount;
          currency.btcBuyMaxAmount = value.btcBuyMaxAmount;
          currency.btcSellMinAmount = value.btcSellMinAmount;
          currency.btcSellMaxAmount = value.btcSellMaxAmount;
        }
        /*if (currency.value === "USD") {
          investmentStore.dispatch({
            type: "SET_AVAILABLE_BALANCE",
            payload: currency.availableBalance,
          });
          investmentStore.dispatch({
            type: "SET_BTC_PRICE",
            payload: currency.btcSellPrice,
          });
        }*/
        detailedBalances.push(currency);
        /*this.setState(
                      {
                          balanceBTC: currency,
                      },
                      () => currenciesAux.push(this.state.balanceBTC)
                  );*/
      }
    } else {
      if (key === "usdEstimatedBalance") {
        usdEstimatedBalance = value;
      }
      if (key === "btcEstimatedBalance") {
        btcEstimatedBalance = value;
      }
    }
    detailedBalances.sort((a, b) => {
      return a.priority - b.priority;
    });
  });
  if (type === 'CRYPTO') {
    let dogeCoin: CurrencyBalance = currenciesParams.DOGE;
    dogeCoin.availableBalance = 0;
    dogeCoin.usdEstimatedBalance = 0;
    dogeCoin.deferredBalance = 0;
    dogeCoin.btcBuyPrice = 100;
    dogeCoin.btcSellPrice = 95;
    dogeCoin.btcBuyMinAmount = 50;
    dogeCoin.btcBuyMaxAmount = 1000;
    dogeCoin.btcSellMinAmount = 20;
    dogeCoin.btcSellMaxAmount = 2000;
    detailedBalances.push(dogeCoin);
    let bitcoinCash: CurrencyBalance = currenciesParams.BCH;
    bitcoinCash.availableBalance = 0;
    bitcoinCash.usdEstimatedBalance = 0;
    bitcoinCash.deferredBalance = 0;
    bitcoinCash.btcBuyPrice = 100;
    bitcoinCash.btcSellPrice = 95;
    bitcoinCash.btcBuyMinAmount = 50;
    bitcoinCash.btcBuyMaxAmount = 1000;
    bitcoinCash.btcSellMinAmount = 20;
    bitcoinCash.btcSellMaxAmount = 2000;
    detailedBalances.push(bitcoinCash);
    let liteCoin: CurrencyBalance = currenciesParams.LTC;
    liteCoin.availableBalance = 0;
    liteCoin.usdEstimatedBalance = 0;
    liteCoin.deferredBalance = 0;
    liteCoin.btcBuyPrice = 100;
    liteCoin.btcSellPrice = 95;
    liteCoin.btcBuyMinAmount = 50;
    liteCoin.btcBuyMaxAmount = 1000;
    liteCoin.btcSellMinAmount = 20;
    liteCoin.btcSellMaxAmount = 2000;
    detailedBalances.push(liteCoin);
    let dash: CurrencyBalance = currenciesParams.DASH;
    dash.availableBalance = 0;
    dash.usdEstimatedBalance = 0;
    dash.deferredBalance = 0;
    dash.btcBuyPrice = 100;
    dash.btcSellPrice = 95;
    dash.btcBuyMinAmount = 50;
    dash.btcBuyMaxAmount = 1000;
    dash.btcSellMinAmount = 20;
    dash.btcSellMaxAmount = 2000;
    detailedBalances.push(dash);
    let xrp: CurrencyBalance = currenciesParams.XRP;
    xrp.availableBalance = 0;
    xrp.usdEstimatedBalance = 0;
    xrp.deferredBalance = 0;
    xrp.btcBuyPrice = 100;
    xrp.btcSellPrice = 95;
    xrp.btcBuyMinAmount = 50;
    xrp.btcBuyMaxAmount = 1000;
    xrp.btcSellMinAmount = 20;
    xrp.btcSellMaxAmount = 2000;
    detailedBalances.push(xrp);
  }
  /*processedBalanceStore.dispatch({
    type: PROCESSED_BALANCE,
    payload: {
      usdEstimatedBalance: usdEstimatedBalance,
      btcEstimatedBalance: btcEstimatedBalance,
      currenciesAux: decoratedBalance,
    },
  });*/
  return {
    usdEstimatedBalance: usdEstimatedBalance,
    btcEstimatedBalance: btcEstimatedBalance,
    detailedBalances: detailedBalances
  }
}

export function parseDebitCardNumber(id) {
  return (
    id.substring(0, 4) +
    " " +
    id.substring(4, 8) +
    " " +
    id.substring(8, 12) +
    " " +
    id.substring(12, 16)
  );
}

export function getDebitCardExpirationDate(timestamp) {
  let date = new Date(Date.parse(timestamp));
  date.setFullYear(date.getFullYear() + 3);
  let month = (date.getMonth() + 1).toString();
  if (Number(month) < 10) {
    month = "0" + month;
  }
  let year = date.getFullYear().toString().substring(2);
  return month + "/" + year;
}

export function getFieldName(key) {
  switch (key) {
    case "bank":
      return "Bank";
    case "accountNumber":
      return "Account Number";
    case "accountHolderName":
      return "Holder Name";
    case "accountAddress":
      return "Address";
    case "emailReceiver":
      return "Email";
    case "bankRoutingNumber":
      return "Routing Number";
    case "accountZip":
      return "ZIP";
    case "bankSwiftCode":
      return "SWIFT";
    case "zelle":
      return "ZELLE";
    case "accountWireNumber":
      return "Wire Number";
    case "accountWireRoutingNumber":
      return "Wire Routing Number";
  }
  return key;
}

export function validateConfirmationModalTransaction(validations: any[]) {
  let validationError = false;
  Object.entries(validations).every(function (element, index) {
    switch (element[1].type) {
      case "TEXT":
        if (element[1].value === "") {
          Alert.alert(
            "Operation Error",
            "Yo need to enter a valid " +
            element[1].name +
            " to complete operation.",
            [{ text: "Ok" }]
          );
          validationError = true;
          return false;
        }
        break;
      case "NUMERIC":
        if (Number(element[1].value) === 0) {
          Alert.alert(
            "Operation Error",
            "Yo need to enter a valid " +
            element[1].name +
            " to complete operation.",
            [{ text: "Ok" }]
          );
          validationError = true;
          return false;
        }
        break;
      case "EMAIL":
      case "BITCOIN_ADDRESS":
      case "ETHEREUM_ADDRESS":
      case "TRON_ADDRESS":
      case "DOGECOIN_ADDRESS":
      case "LITECOIN_ADDRESS":
      case "DASH_ADDRESS":
      case "XRP_ADDRESS":
        var validRegex =
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (element[1].type === "BITCOIN_ADDRESS") {
          validRegex = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/;
        }
        if (element[1].type === "ETHEREUM_ADDRESS") {
          validRegex = /^0x[a-fA-F0-9]{40}$/;
        }
        if (element[1].type === "TRON_ADDRESS") {
          validRegex = /^T/;
        }
        if (element[1].type === "DOGECOIN_ADDRESS") {
          validRegex = /^D/;
        }
        if (element[1].type === "LITECOIN_ADDRESS") {
          validRegex = /^L/;
        }
        if (element[1].type === "DASH_ADDRESS") {
          validRegex = /^X/;
        }
        if (element[1].type === "XRP_ADDRESS") {
          validRegex = /^r/;
        }
        if (element[1].value === "" || !element[1].value.match(validRegex)) {
          Alert.alert(
            "Operation Error",
            "Yo need to enter a valid " +
            element[1].name +
            " to complete operation.",
            [{ text: "Ok" }]
          );
          validationError = true;
          return false;
        }
        break;
      case "JSON":
        if (element[1].value === null || JSON.stringify(element[1].value) === JSON.stringify({})) {
          Alert.alert(
            "Operation Error",
            "Yo need to enter a valid " +
            element[1].name +
            " to complete operation.",
            [{ text: "Ok" }]
          );
          validationError = true;
          return false;
        }
        break;
    }
    return true;
  });
  if (validationError) {
    return false;
  }
  return true;
}

export function getPairComponents(pair) {
  let pairComponents = ["BTC", "USD"];
  let pairAssets = ["BTC", "USD", "USDT", "EUR", "ETH"];
  Object.entries(pairAssets).every(function (element, index) {
    if (pair.startsWith(element[1])) {
      pairComponents = [element[1], pair.replace(element[1], "")];
      return false;
    } else {
      return true;
    }
  });
  return pairComponents;
}

export const decorateTimestamp = (timestamp, type?) => {
  timestamp = timestamp.split('T')[0] + 'T' + timestamp.split('T')[1].replace('--', '.').replaceAll('-', ':')
  let date = new Date(timestamp)
  let AMPM = 'AM'
  let hours = String(date.getHours())
  if (Number(hours) > 12) {
    hours = String((Number(hours) - 12))
    AMPM = 'PM'
  }
  let minutes = String(date.getMinutes())
  if (Number(minutes) < 10) {
    minutes = '0' + minutes
  }
  if (type === 'DAY') {
    return months[date.getMonth()] + ' ' + date.getDate()
  }
  if (type === 'HOUR') {
    hours = String(date.getHours())
    if (Number(hours) < 10) {
      hours = 0 + '' + hours
    }
    return hours + ':' + minutes
  }
  return months[date.getMonth()] + ' ' + date.getDate() + ' ' + hours + ':' + minutes + ' ' + AMPM
}

export function shareSVG(svg) {
  svg.toDataURL((urld) => {
    const options = {
      title: "Share",
      type: "image/jpg",
      url: `data:image/png;base64,${urld}`,
    };
    Share.open(options)
      .then((response) => {
        console.log({ response });
      })
      .catch((error) => {
        console.log({ error });
      });
  });
}

export const getCryptoPaymentType = (currencyProtocol: string) => {
  if (currencyProtocol === "") {
    return null;
  }
  switch (currencyProtocol) {
    case "ERC20":
      return "ETHEREUM";
    case "TRC20":
      return "TRON";
  }
  return null
};

export function getDecimals(amount) {
  if (amount >= 1000000) {
    return 0;
  }
  if (amount >= 0.01) {
    return 2;
  }
  if (amount >= 0.00000001) {
    return 8;
  }
  if (amount >= 0.000000000001) {
    return 12;
  }
}

export const getPermission: any = (permissionName, platformOS) => {
  switch (permissionName) {
    case "LIBRARY_PHOTO":
    case "LIBRARY_PHOTO_VIDEO":
    case "LIBRARY_VIDEO":
      if (platformOS === "android") {
        return PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
      } else {
        return PERMISSIONS.IOS.PHOTO_LIBRARY;
      }
    case "CAMERA":
    case "CAMERA_PHOTO":
    case "CAMERA_VIDEO":
      if (platformOS === "android") {
        return PERMISSIONS.ANDROID.CAMERA;
      } else {
        return PERMISSIONS.IOS.CAMERA;
      }
    case "READ_CONTACTS":
      if (platformOS === "android") {
        return PERMISSIONS.ANDROID.READ_CONTACTS;
      } else {
        return PERMISSIONS.IOS.CONTACTS;
      }
    case "READ_PHONE_STATE":
      if (platformOS === "android") {
        return PERMISSIONS.ANDROID.READ_PHONE_STATE;
      } else {
        return null;
      }
    case "WRITE_EXTERNAL_STORAGE":
      if (platformOS === "android") {
        return PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
      } else {
        return null;
      }
    case "RECORD_AUDIO":
      if (platformOS === "android") {
        return PERMISSIONS.ANDROID.RECORD_AUDIO;
      } else {
        return PERMISSIONS.IOS.MICROPHONE;
      }
  }
}

export async function checkPermissions(permissionName) {
  if (Platform.OS === "android") {
    try {
      switch (await check(getPermission(permissionName, Platform.OS))) {
        case RESULTS.UNAVAILABLE:
          alert("NOT AVAILABLE IN THIS DEVICE");
          return false;
        case RESULTS.DENIED:
          try {
            return (
              (await request(getPermission(permissionName, Platform.OS))) ===
              RESULTS.GRANTED
            );
          } catch (error) {
            alert(error);
            return false;
          }
        case RESULTS.GRANTED:
          return true;
        case RESULTS.BLOCKED:
          alert("BLOCKED BY USER");
          return false;
        default:
          try {
            return (
              (await request(getPermission(permissionName, Platform.OS))) ===
              RESULTS.GRANTED
            );
          } catch (error) {
            alert(error);
            return false;
          }
      }
    } catch (er) {
      alert(er.toString());
      return false;
    }
  } else {
    try {
      return (
        (await request(getPermission(permissionName, Platform.OS))) ===
        RESULTS.GRANTED
      );
    } catch (error) {
      return false;
    }
  }
}


export function openQRScan(action) {
  checkPermissions("CAMERA")
    .then(result => {
      if (result) {
        action()
      } else {
        Alert.alert("Permissions Error", "Error trying to get CAMERA permission.", [
          { text: "Ok" },
        ]);
      }
    })
    .catch(error => {
      Alert.alert("Permissions Error", "Error trying to get CAMERA permission.", [
        { text: "Ok" },
      ]);
    })
}

export const formatPhoneContacts = (areaCode, phone) => {
  let formatPhone = "";
  let phoneToString = String(phone);
  phoneToString = phoneToString.replace("(", "");
  phoneToString = phoneToString.replace(")", "");
  try {
    if (phoneToString.includes("+") && phoneToString.includes(" ")) {
      areaCode = phoneToString.split(" ")[0].replace(/[^a-zA-Z 0-9.]+/g, "");
      formatPhone = phoneToString.replace("+" + areaCode, "");
      if (formatPhone.startsWith("0")) {
        formatPhone = formatPhone.slice(1, formatPhone.length);
      }
      formatPhone = formatPhone
        .toLowerCase()
        .replace(/[\*\^\'\!]/g, "")
        .replace(/[^a-zA-Z 0-9.]+/g, "")
        .split(" ")
        .join("");
    } else if (phoneToString.startsWith("0")) {
      formatPhone = phoneToString.slice(1, phoneToString.length);
      formatPhone = formatPhone
        .toLowerCase()
        .replace(/[\*\^\'\!]/g, "")
        .replace(/[^a-zA-Z 0-9.]+/g, "")
        .split(" ")
        .join("");
    } else if (phoneToString.includes("-")) {
      formatPhone = phone;
      formatPhone = formatPhone
        .toLowerCase()
        .replace(/[\*\^\'\!]/g, "")
        .replace(/[^a-zA-Z 0-9.]+/g, "")
        .split(" ")
        .join("");
    } else if (phoneToString.includes("+") && !phoneToString.includes(" ")) {
      if (phoneToString.length === 13) {
        formatPhone = phoneToString.slice(3, phoneToString.length);
        areaCode = phoneToString.slice(0, 3);
      } else if (phoneToString.length === 12) {
        formatPhone = phoneToString.slice(2, phoneToString.length);
        areaCode = phoneToString.slice(0, 2);
        areaCode = areaCode.replace(/[^a-zA-Z 0-9.]+/g, "");
      } else if (phoneToString.length === 14) {
        formatPhone = phoneToString.slice(4, phoneToString.length);
        areaCode = phoneToString.slice(0, 4).replace(/[^a-zA-Z 0-9.]+/g, "");
      } else if (phoneToString.length === 15) {
        formatPhone = phoneToString.slice(5, phoneToString.length);
        areaCode = phoneToString.slice(0, 5).replace(/[^a-zA-Z 0-9.]+/g, "");
      }
      formatPhone = formatPhone
        .toLowerCase()
        .replace(/[\*\^\'\!]/g, "")
        .replace(/[^a-zA-Z 0-9.]+/g, "")
        .split(" ")
        .join("");
      areaCode = areaCode.replace(/[^a-zA-Z 0-9.]+/g, "");
    } else if (
      !phoneToString.includes("+") &&
      !phoneToString.includes(" ") &&
      !phoneToString.startsWith("0")
    ) {
      formatPhone = phoneToString
        .toLowerCase()
        .replace(/[\*\^\'\!]/g, "")
        .replace(/[^a-zA-Z 0-9.]+/g, "")
        .split(" ")
        .join("");
      //formatPhone = formatPhone.replace(/[^a-zA-Z 0-9.]+/g, '');
    }
    if (areaCode === "1") {
      /*let provisionalCode = formatPhone.slice(0, 3);
            let provisionalTotalCode = '1 ' + formatPhone.slice(0, 3);
            let findCountry = prefits.country.find((element) => {
                return element.value === provisionalTotalCode;
            });
            if (findCountry !== undefined) {
                formatPhone = formatPhone.replace(provisionalCode, '');
                areaCode = provisionalTotalCode;
            }*/
    }
    return areaCode + "__" + formatPhone;
  } catch (error) {
    return areaCode + "__" + formatPhone;
  }
}

export const handleChooseDocument = async (permmission, options, onSuccessChoose) => {
  checkPermissions(permmission)
    .then(response => {
      console.log('response', response)
      if (response) {
        switch (permmission) {
          case "LIBRARY_PHOTO":
          case "LIBRARY_VIDEO":
          case "LIBRARY_PHOTO_VIDEO":
            launchImageLibrary(options, (response) => {
              if (
                response !== undefined &&
                response.assets !== undefined &&
                response.assets.length > 0
              ) {
                onSuccessChoose(response.assets[0])
              }
            });
            break;
        }
      } else {
        Alert.alert(
          "Permissions Error",
          "Error trying to get PHOTO LIBRARY permission.",
          [{ text: "Ok" }]
        );
        return;
      }
    }).catch(error => {
      Alert.alert("File Error", "File can not be processed.", [{ text: "Ok" }]);
      return;
    })
}

export function getExpirationDate(timestamp) {
  let date = new Date(Date.parse(timestamp));
  date.setFullYear(date.getFullYear() + 3);
  let month = (date.getMonth() + 1).toString();
  if (Number(month) < 10) {
    month = "0" + month;
  }
  let year = date.getFullYear().toString().substring(2);
  return month + "/" + year;
}

export const getIconName: any = (balanceOperationType) => {
  switch (balanceOperationType) {
    case 'SEND_OUT':
    case 'SEND_IN':
    case 'SEND_TO_PAYMENT':
    case 'MC_SEND_SMS_NATIONAL':
    case 'MC_SEND_SMS_INTERNATIONAL':
    case 'GIFT_CARD_ACTIVATION':
    case 'SUBSCRIPTION_JOIN':
    case 'DEBIT':
      return 'bank-transfer-out'
    case 'RECEIVE_OUT':
    case 'RECEIVE_IN':
    case 'MC_BUY_BALANCE':
    case 'GIFT_CARD_REDEEM_BR':
    case 'GIFT_CARD_REDEEM':
    case 'CREDIT':
      return 'bank-transfer-in'
    case 'MC_FAST_CHANGE':
    case 'MC_MESSAGE_OFFER_CHANGE':
    case 'MC_BUY_BITCOINS':
    case 'MC_BUY_CRYPTO':
    case 'MC_SELL_BITCOINS':
    case 'MC_SELL_CRYPTO':
      return 'exchange'
  }
}

export const uploadImageFirebaseStorage = async (image, setUploading, setTransferred, setImage) => {
  const { uri } = image;
  const filename = uri.substring(uri.lastIndexOf('/') + 1);
  const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
  setUploading(true);
  setTransferred(0);
  const task = storage()
    .ref(filename)
    .putFile(uploadUri);
  // set progress state
  task.on('state_changed', snapshot => {
    setTransferred(
      Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
    );
  });
  try {
    await task;
  } catch (e) {
    console.error(e);
  }
  setUploading(false);
  Alert.alert(
    'Photo uploaded!',
    'Your photo has been uploaded to Firebase Cloud Storage!'
  );
  setImage(null);
};