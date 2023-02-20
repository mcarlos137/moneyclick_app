import { useQuery } from "react-query"
import { request } from "../../../tools/axiosUtils"

const getDepositsRequest = ({ queryKey }) => {
  var finalDate = new Date();
  var timeback = 1000 * 60 * 60 * 24 * 30 * 3; //3 month in the past
  var initDate = new Date(finalDate.getTime() - timeback);
  var timeadd = 1000 * 60 * 60 * 48; // 2 days in the future
  finalDate = new Date(finalDate.getTime() + timeadd);
  let body: any = {
    userName: queryKey[1],
  }
  if (queryKey[2] !== null) body.currency = queryKey[2]
  if (queryKey[3] !== null) body.otcOperationType = queryKey[3]
  if (queryKey[4] !== null) body.otcOperationStatus = queryKey[4]
  if (queryKey[5] !== null) body.initTimestamp = initDate.toISOString()
  if (queryKey[6] !== null) body.finalTimestamp = queryKey[6]
  return request({ url: `/otc/getOperations`, method: 'post', data: body })
}

export const getDeposits = (
  userName: string,
  currency: string | null,
  otcOperationType: string | null,
  otcOperationStatus: string | null,
  initTimestamp: string | null,
  finalTimestamp: string | null
) => {
  return useQuery(
    ['deposits', userName, currency, otcOperationType, otcOperationStatus, initTimestamp, finalTimestamp],
    getDepositsRequest,
    {
      enabled: userName !== null,
      select: (data) => data?.data?.sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }),
      onSuccess: (data) => {
        //console.log('data', JSON.stringify(data, null, 4));
      }
      //keepPreviousData: true
    }
  )
}
