import { useMutation, useQueryClient } from "react-query"
import { request } from "../../../tools/axiosUtils"

type CreateDepositRequest_Props = {
  userName: string
  currency: string
  amount: number
  dollarBTCPayment: any
  clientPayment: any | null
  message: string
  description: string
}

const createDepositRequest = ({
  userName,
  currency,
  amount,
  dollarBTCPayment,
  clientPayment,
  message,
  description
}: CreateDepositRequest_Props) => {
  let body: any = {
    userName: userName,
    currency: currency,
    amount: amount,
    dollarBTCPayment: dollarBTCPayment
  }
  if (clientPayment !== null) body.clientPayment = clientPayment
  if (message !== '') body.message = message
  if (description !== '') body.description = description
  return request({ url: `/buyBalance/createOperation`, method: 'post', data: body })
}

export const createDeposit = () => {
  const queryClient = useQueryClient()
  return useMutation(
    createDepositRequest,
    {
      onError: (_error: any, _deposits: any, context: any) => {
        queryClient.setQueryData('deposits', context.previousDeposits)
      },
      onSettled: () => {
        queryClient.invalidateQueries('deposits')
      },
      onSuccess: (data) => {
        //console.log('data', data?.data)
      }
    }
  )
}
