import { useMutation, useQueryClient } from "react-query"
import { request } from "../../tools/axiosUtils"

type AddPaymentRequest_Props = {
  userName: string
  currency: string
  payment: any
}

const addPaymentRequest = ({
  userName,
  currency,
  payment
}: AddPaymentRequest_Props) => {
  let body = {
    userName: userName,
    currency: currency,
    payment: payment,
  }
  return request({ url: `/otc/addPayment`, method: 'post', data: body })
}

export const addPayment = () => {
  const queryClient = useQueryClient()
  return useMutation(
    addPaymentRequest,
    {
      onError: (_error: any, _payments: any, context: any) => {
        queryClient.setQueryData('payments', context.previousPayments)
      },
      onSettled: () => {
        queryClient.invalidateQueries('payments')
      },
      onSuccess: (data) => {
        console.log('data', data?.data)
      }
    }
  )
}
