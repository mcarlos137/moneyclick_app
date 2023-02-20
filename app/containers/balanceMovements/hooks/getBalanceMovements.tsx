import { useQuery } from "react-query"
import { request } from "../../../tools/axiosUtils"

const getBalanceMovementsRequest = ({ queryKey }) => {
    var finalDate = new Date();
    var timeback = 1000 * 60 * 60 * 24 * 30 * 3; //3 month in the past
    var initDate = new Date(finalDate.getTime() - timeback);
    var timeadd = 1000 * 60 * 60 * 48; // 2 days in the future
    finalDate = new Date(finalDate.getTime() + timeadd);
    return request({ url: `/mcUser/getBalanceMovements/${queryKey[1]}/${initDate.toISOString()}/${finalDate.toISOString()}`, method: 'get' })
}

export const getBalanceMovements = (userName) => {
    return useQuery(
        ['balanceMovements', userName],
        getBalanceMovementsRequest,
        {
            enabled: userName !== null,
            select: (data) => decorateGetBalanceMovementsResponse(data?.data),
            onSuccess: (data) => {
                //console.log('decorateGetBalanceMovementsResponse', JSON.stringify(data, null, 4));
            },
            staleTime: 30000
        }
    )
}

const decorateGetBalanceMovementsResponse = (response) => {
    let times: number[] = [];
    let operationIdsTimes: any = {};
    times.forEach((value) => { });
    let decoratedResponse: any = {};
    Object.entries(response).forEach(([key, value]: [string, any]) => {
        let timestamp = timestampParser(value.timestamp);
        let time = new Date(timestamp).getTime();
        //console.log('timestamp ' + timestamp, time)
        let operationId = null;
        if (value.operationId !== undefined) {
            operationId = value.operationId;
            let operationIdRegistered = false;
            if (operationId !== null) {
                if (operationIdsTimes[operationId] !== undefined) {
                    operationIdRegistered = true;
                }
                if (!operationIdRegistered) {
                    operationIdsTimes[operationId] = time;
                    decoratedResponse[time] = [value];
                } else {
                    decoratedResponse[operationIdsTimes[operationId]].push(value);
                }
            }
        } else {
            let timeRegistered: number | null = null;
            times.forEach((value) => {
                if (value + 600 > time && value - 600 < time) {
                    timeRegistered = value;
                    return true;
                }
            });
            if (timeRegistered !== null) {
                if (decoratedResponse[timeRegistered] !== undefined) {
                    decoratedResponse[timeRegistered].push(value);
                } else {
                    console.log("------------------ERROR: " + timeRegistered);
                    console.log("balanceOperationType: " + value.balanceOperationType);
                }
            } else {
                decoratedResponse[time] = [value];
            }
            times.push(time);
        }
        let amount = null;
        let initialAmount = null;
        let chargesAmount: number | null = null;
        let currency = null;
        if (value.addedAmount !== undefined) {
            value["operationType"] = "ADD";
            amount = value.addedAmount.amount;
            initialAmount = value.addedAmount.initialAmount;
            chargesAmount =
                value.addedAmount.initialAmount - value.addedAmount.amount;
            currency = value.addedAmount.currency;
        } else if (value.substractedAmount !== undefined) {
            value["operationType"] = "SUBSTRACT";
            amount = value.substractedAmount.amount;
            initialAmount = value.substractedAmount.initialAmount;
            chargesAmount =
                value.substractedAmount.amount - value.substractedAmount.initialAmount;
            currency = value.substractedAmount.currency;
        }
        if (
            amount !== null &&
            initialAmount !== null &&
            chargesAmount !== null &&
            currency !== null
        ) {
            value["amount"] = amount;
            value["initialAmount"] = initialAmount;
            value["chargesAmount"] = chargesAmount;
            value["currency"] = currency;
            delete value["addedAmount"];
            delete value["substractedAmount"]
            delete value["chargesFilePaths"];
        }
    });
    let finalDecoratedResponse: any[] = [];
    Object.keys(decoratedResponse).forEach((key) => {
        let transaction = {};
        transaction["id"] = key;
        transaction["parts"] = decoratedResponse[key];
        finalDecoratedResponse.push(transaction);
    });
    finalDecoratedResponse = finalDecoratedResponse.sort((a, b) => {
        return b.id - a.id;
    });
    return finalDecoratedResponse;
};

function timestampParser(unparsedTimestamp) {
    let timestamp1 = unparsedTimestamp.split("T")[0];
    let timestamp2 = unparsedTimestamp.split("T")[1];
    let timestamp21 = timestamp2.split("--")[0];
    let timestamp22 = timestamp2.split("--")[1];
    while (timestamp21.includes("-")) {
        timestamp21 = timestamp21.replace("-", ":");
    }
    return timestamp1 + "T" + timestamp21 + "." + timestamp22;
}
