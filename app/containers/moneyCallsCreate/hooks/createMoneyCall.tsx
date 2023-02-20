import { useId } from "react"
import { useMutation, useQueryClient } from "react-query"
import { request } from "../../../tools/axiosUtils"

const createMoneyCallRequest = ({
  createUserName,
  senderUserName,
  receiverUserName,
  type,
  currency,
  rate,
  senderName,
  receiverName,
  scheduledTimestamp,
  estimatedTime,
  message
}) => {
  let body: any = {
    createUserName: createUserName,
    senderUserName: senderUserName,
    receiverUserName: receiverUserName,
    type: type,
    currency: currency,
    rate: rate
  }
  if (senderName !== null) body.senderName = senderName
  if (receiverName !== null) body.receiverName = receiverName
  if (scheduledTimestamp !== null) body.scheduledTimestamp = scheduledTimestamp
  if (estimatedTime !== null) body.estimatedTime = estimatedTime
  if (message !== '') body.createMessage = message
  console.log('body', body)
  return request({ url: `/moneyCall/create`, method: 'post', data: body })
}

export const createMoneyCall = () => {
  const queryClient = useQueryClient()
  return useMutation(
    createMoneyCallRequest,
    {
      /*onMutate: async (newMoneyCall) => {
        await queryClient.cancelQueries('moneyCalls')
        const previousShorts = queryClient.getQueryData('moneyCalls')
        queryClient.setQueriesData('moneyCalls', (oldQueryData: any) => {
          return {
            ...oldQueryData,
            data: [
              ...oldQueryData.data,
              { id: useId(), createTimestamp: new Date().toISOString(), status: 'NOT_SYNC', ...newMoneyCall }
            ]
          }
        })
        return {
          previousShorts
        }
      },*/
      onError: (_error: any, _moneyCalls: any, context: any) => {
        queryClient.setQueryData('moneyCalls', context.previousMoneyCalls)
      },
      onSettled: () => {
        queryClient.invalidateQueries('moneyCalls')
      },
      onSuccess: (data) => {
        console.log('data', data?.data)
      }
    })
}