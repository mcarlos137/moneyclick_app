import { useQuery } from "react-query"
import { request } from "../../../tools/axiosUtils"

const getChargesRequest = ({ }) => {
    return request({ url: `/otc/getChargesNew`, method: 'get' })
}

export const getCharges = () => {
    return useQuery(
        ['charges'],
        getChargesRequest,
        {
            enabled: true,
            initialData: [],
            select: (data) => data?.data !== undefined ? getChargesData(data?.data) : data,
            onSuccess: (data) => {
                //console.log('data', JSON.stringify(data, null, 4));
            }
        }
    )
}

const getChargesData = (data) => {
    const charges: any = {};
    charges.currencies = [];
    Object.entries(data).forEach(([key, value]: [string, any]) => {
        charges[key] = [];
        charges.currencies?.push(key);
        Object.entries(value).forEach(([ke, val]: [string, any]) => {
            if (ke.split('__').length === 2) {
                if (ke.split('__')[1] !== 'COMMISSION') {
                    return;
                }
                Object.entries(val).forEach(([k, v]) => {
                    let charge: any = getCharge(ke.split('__')[0], k, v, key);
                    if (ke.split('__')[0] === 'MC_BUY_BALANCE' || ke.split('__')[0] === 'SEND_TO_PAYMENT') {
                        charge.operationName = charge.operationName + ' BANK';
                    }
                    if (charge !== null) {
                        charges[key].push(charge);
                    }
                })
            }
            if (ke.split('__').length === 3) {
                if (ke.split('__')[1] === 'CREDIT_CARD' || ke.split('__')[1] === 'ACH_EXPRESS' || ke.split('__')[1] === 'ACH_THIRD_ACCOUNT_EXPRESS') {
                    return;
                }
                Object.entries(val).forEach(([k, v]) => {
                    let charge: any = getCharge(ke.split('__')[0], k, v, key);
                    let paymentType = ke.split('__')[1]
                    if (paymentType === 'GENERIC_THIRD_ACCOUNT' || paymentType === 'ACH_THIRD_ACCOUNT') {
                        paymentType = 'BANK - third account'
                    }
                    charge.operationName = charge.operationName + ' ' + paymentType;
                    if (charge !== null) {
                        charges[key].push(charge);
                    }
                })
            }
        })
    })
    return charges
}

export function getCharge(operation, target, value, currency) {
    let operationName = '';
    switch (operation) {
        case 'MC_FAST_CHANGE':
            operationName = 'Fast Change';
            break;
        case 'MC_SEND_SMS_INTERNATIONAL':
            operationName = 'International MoneyClick Send';
            break;
        case 'MC_SEND_SMS_NATIONAL':
            operationName = 'National MoneyClick Send';
            break;
        case 'SEND_TO_PAYMENT':
            operationName = 'Transfer to';
            break;
        case 'MC_BUY_CRYPTO':
            operationName = 'Buy Crypto';
            break;
        case 'MC_SELL_CRYPTO':
            operationName = 'Sell Crypto';
            break;
        case 'MC_BUY_BALANCE':
            operationName = 'Deposit from';
            break;
        case 'MC_TAKE_MESSAGE_OFFER':
            operationName = 'Take MoneyMarket Offer';
            break;
        case 'GIFT_CARD_REDEEM_BR':
            operationName = 'Gift Card BitcoinRecharge Redeem';
            break;
        case 'GIFT_CARD_REDEEM':
            operationName = 'Gift Card Redeem';
            break;
        case 'SEND_IN':
            operationName = 'Sending to MoneyClick Wallets';
            break;
        case 'SEND_OUT':
            operationName = 'Sending to External Wallets';
            break;
    }
    if (operationName !== '') {
        let amount = (target === 'DEFAULT' ? '' : target) + ' ' + value.amount + '' + (value.type === 'PERCENT' ? '%' : '') + (value.currency !== currency ? ' ' + value.currency : '');
        return { operationName: operationName, amount: amount };
    }
    return null;
}
