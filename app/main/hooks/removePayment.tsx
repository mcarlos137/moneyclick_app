import { useMutation, useQueryClient } from "react-query"
import { request } from "../../tools/axiosUtils"

type RemovePaymentRequest_Props = {
  userName: string
  currency: string
  id: string
}

const removePaymentRequest = ({
  userName,
  currency,
  id,
}: RemovePaymentRequest_Props) => {
  return request({ url: `/otc/removePayment/${userName}/${currency}/${id}`, method: 'get' })
}

export const removePayment = () => {
  const queryClient = useQueryClient()
  return useMutation(
    removePaymentRequest,
    {
      onError: (_error: any, _payments: any, context: any) => {
        queryClient.setQueryData('payments', context.previousPayments)
      },
      onSettled: () => {
        queryClient.invalidateQueries('payments')
      },
      onSuccess: (data) => {
        console.log('removePayment', data?.data)
      }
    }
  )
}
