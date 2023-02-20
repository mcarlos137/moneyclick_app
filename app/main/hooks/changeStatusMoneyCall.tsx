import { useMutation, useQueryClient } from "react-query"
import { request } from "../../tools/axiosUtils"

const changeStatusMoneyCallRequest = ({
  id,
  userName,
  status,
  message
}) => {
  let body: any = {
    id: id,
    status: status,
    userName: userName,
  }
  if (message !== '') body.message = message
  console.log('body', body)
  return request({ url: `/moneyCall/changeStatus`, method: 'post', data: body })
}

export const changeStatusMoneyCall = () => {
  const queryClient = useQueryClient()
  return useMutation(
    changeStatusMoneyCallRequest,
    {
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