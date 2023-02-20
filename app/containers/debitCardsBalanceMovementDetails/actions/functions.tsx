

export function getBalanceOperationTypeName(balanceOperationType) {
    switch (balanceOperationType) {
        case 'SEND_OUT':
            return 'EXTERNAL SEND';
        case 'SEND_IN':
            return 'INTERNAL SEND';
        case 'SEND_TO_PAYMENT':
            return 'TRANSFER TO BANK';
        case 'MC_SEND_SMS_NATIONAL':
            return 'SEND TO MONEYCLICK USER NATIONAL';;
        case 'MC_SEND_SMS_INTERNATIONAL':
            return 'SEND TO MONEYCLICK USER INTERNATIONAL';
        case 'GIFT_CARD_ACTIVATION':
            return 'GIFT CARD ACTIVATION';
        case 'DEBIT':
            return 'DEBIT';
        case 'RECEIVE_OUT':
            return 'EXTERNAL RECEPTION';
        case 'RECEIVE_IN':
            return 'INTERNAL RECEPTION';
        case 'MC_BUY_BALANCE':
            return 'BANK DEPOSIT';
        case 'GIFT_CARD_REDEEM_BR':
            return 'REDEEM BITCOINRECHARGE GIFT CARD';
        case 'GIFT_CARD_REDEEM':
            return 'REDEEM GIFT CARD';
        case 'CREDIT':
            return 'CREDIT';
        case 'MC_FAST_CHANGE':
            return 'FAST CHANGE';
        case 'MC_BUY_BITCOINS':
            return 'BUY BITCOINS';
        case 'MC_BUY_CRYPTO':
            return 'BUY CRYPTO';
        case 'MC_SELL_BITCOINS':
            return 'SELL BITCOINS';
        case 'MC_SELL_CRYPTO':
            return 'SELL CRYPTO';
        case 'MC_MESSAGE_OFFER_CHANGE':
            return 'MONEYMARKET CHANGE';
    }
}

export function getBalanceOperationStatusName(params) {
    if (params.length === 2) {
        if (params[0].balanceOperationStatus === 'PROCESSING') {
            return 'PROCESSING';
        }
        if (params[1].balanceOperationStatus === 'PROCESSING') {
            return 'PROCESSING';
        }
        if (params[0].balanceOperationStatus === 'FAIL') {
            return 'FAILED';
        }
        if (params[1].balanceOperationStatus === 'FAIL') {
            return 'FAILED';
        }
        return 'OK';
    } else if (params.length === 1) {
        if (params[0].balanceOperationStatus === 'FAIL') {
            return 'FAILED';
        }
        return params[0].balanceOperationStatus;
    }
}

export function getOperationId(balanceMovementDetails) {
    let operationId = '';
    if (balanceMovementDetails[0].operationId !== undefined) {
        operationId = balanceMovementDetails[0].operationId;
        if (operationId.length > 7) {
            operationId = operationId.substr(operationId.length - 7);
        }
    }
    return operationId;
}

export function getDescription(balanceMovementDetails) {
    let description = '';
    if (balanceMovementDetails[0].additionalInfo !== undefined && balanceMovementDetails[0].additionalInfo.includes('DESCRIPTION')) {
        description = balanceMovementDetails[0].additionalInfo.split(' DESCRIPTION ')[1];
    }
    if (balanceMovementDetails[0].additionalInfo !== undefined && balanceMovementDetails[0].additionalInfo.includes('TARGET ADDRESS')) {
        description = balanceMovementDetails[0].additionalInfo.split('TARGET ADDRESS')[0];
    }
    return description;
}

export function getReceiverUserName(balanceMovementDetails) {
    let receiverUserName = '';
    if (balanceMovementDetails[0].receiverUserName !== undefined) {
        receiverUserName = balanceMovementDetails[0].receiverUserName;
    }
    if (balanceMovementDetails[0].additionalInfo !== undefined && balanceMovementDetails[0].additionalInfo.includes('SEND TO')) {
        receiverUserName = balanceMovementDetails[0].additionalInfo.split(' - ')[0].substr(balanceMovementDetails[0].additionalInfo.split(' - ')[0].indexOf('SEND TO ') + 8);
    }
    return receiverUserName;
}

export function getTargetAddress(balanceMovementDetails) {
    let targetAddress = '';
    if (balanceMovementDetails[0].targetAddress !== undefined) {
        targetAddress = balanceMovementDetails[0].targetAddress;
    }
    return targetAddress;
}

export function getCharges(balanceMovementDetails) {
    let charges: any = {};
    if (balanceMovementDetails.length === 2) {
        charges['amount'] = balanceMovementDetails[0].chargesAmount;
        charges['currency'] = balanceMovementDetails[0].currency;
        if (charges.amount === 0) {
            charges['amount'] = balanceMovementDetails[1].chargesAmount;
            charges['currency'] = balanceMovementDetails[1].currency;
        }
    } else {
        charges['amount'] = balanceMovementDetails[0].chargesAmount;
        charges['currency'] = balanceMovementDetails[0].currency;
    }
    return charges;
}