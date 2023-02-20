import { useQuery } from "react-query"
import { request } from "../../../tools/axiosUtils"

const getDebitCardBalanceMovementsRequest = ({ queryKey }) => {
  var url = "/debitCard/getBalanceMovements?id=" + queryKey[1]
  if (queryKey[2] !== null) {
    url = url + '&initTimestamp=' + queryKey[2]
  }
  if (queryKey[3] !== null) {
    url = url + '&endTimestamp=' + queryKey[3]
  }
  return request({ url: url, method: 'get' })
}

export const getDebitCardBalanceMovements = (id, initTimestamp, finalTimestamp) => {
  return useQuery(
    ['debitCardBalanceMovements', id, initTimestamp, finalTimestamp],
    getDebitCardBalanceMovementsRequest,
    {
      enabled: true,
      initialData: [],
      select: (data) => data?.data !== undefined ? getDebitCardBalanceMovementsData(data?.data) : data,
      onSuccess: (data) => {
        //console.log('debitCardBalanceMovements>>>>>>>>>>', JSON.stringify(data, null, 4));
      },
    }
  )
}

const getDebitCardBalanceMovementsData = (data) => {
  let times: number[] = [];
  let operationIdsTimes = {};
  let partialData: any = {};
  Object.entries(data).forEach(([key, value]: [string, any]) => {
    let newValue: any = {}
    let timestamp = timestampParser(value.timestamp);
    newValue.timestamp = timestamp;
    newValue.balanceOperationType = value.balanceOperationType
    newValue.balanceOperationStatus = value.balanceOperationStatus
    let amount = null;
    let initialAmount = null;
    let chargesAmount: number | null = null;
    let currency = null;
    if (value.addedAmount !== undefined) {
      newValue.operationType = 'ADD';
      amount = value.addedAmount.amount;
      initialAmount = value.addedAmount.initialAmount;
      chargesAmount = value.addedAmount.initialAmount - value.addedAmount.amount;
      currency = value.addedAmount.currency;
    } else if (value.substractedAmount !== undefined) {
      newValue.operationType = 'SUBSTRACT';
      amount = value.substractedAmount.amount;
      initialAmount = value.substractedAmount.initialAmount;
      chargesAmount = value.substractedAmount.amount - value.substractedAmount.initialAmount;
      currency = value.substractedAmount.currency;
    }
    if (amount === null || initialAmount === null || chargesAmount === null || currency === null) {
      return;
    }
    newValue.amount = amount;
    newValue.initialAmount = initialAmount;
    newValue.chargesAmount = chargesAmount;
    newValue.currency = currency;
    let time = new Date(timestamp).getTime();
    let operationId: string | null = null;
    if (value.operationId !== undefined) {
      operationId = value.operationId;
      let operationIdRegistered = false;
      if (operationId !== null) {
        if (operationIdsTimes[operationId] !== undefined) {
          operationIdRegistered = true;
        }
        if (!operationIdRegistered) {
          operationIdsTimes[operationId] = time;
          partialData[time] = [newValue];
        } else {
          partialData[operationIdsTimes[operationId]].push(newValue);
        }
      }
    } else {
      let timeRegistered: number | null = null;
      times.forEach((value) => {
        if ((value + 600) > time && (value - 600) < time) {
          timeRegistered = value;
          return true;
        }
      })
      if (timeRegistered !== null) {
        if (partialData[timeRegistered] !== undefined) {
          partialData[timeRegistered].push(newValue);
        } else {
          console.log('------------------ERROR: ' + timeRegistered);
        }
      } else {
        partialData[time] = [newValue];
      }
      times.push(time);
    }
  });
  let finalData: any[] = [];
  Object.keys(partialData).forEach((key) => {
    let transaction: any = {};
    transaction.id = key;
    transaction.parts = partialData[key];
    finalData.push(transaction);
  });
  finalData = finalData.sort((a, b) => {
    return b.id - a.id;
  });
  return finalData;
};

function timestampParser(unparsedTimestamp) {
  let timestamp1 = unparsedTimestamp.split("T")[0];
  let timestamp2 = unparsedTimestamp.split("T")[1]
  let timestamp21 = timestamp2.split("--")[0]
  let timestamp22 = timestamp2.split("--")[1]
  while (timestamp21.includes('-')) {
    timestamp21 = timestamp21.replace('-', ':');
  }
  return timestamp1 + 'T' + timestamp21 + '.' + timestamp22;
}