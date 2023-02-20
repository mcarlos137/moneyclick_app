import { useMutation, useQueryClient } from "react-query"
import { request } from "../../tools/axiosUtils"

type CloseOrderRequest_Props = {
  userName: string
  pair: string
  id: string
  operationType: 'ASK' | 'BID'
}

const closeOrderRequest = ({
  userName,
  pair,
  id,
  operationType
}: CloseOrderRequest_Props) => {
  const body: any = {
    userName: userName,
    pair: pair,
    id: id,
    type: operationType,
    excludeMessage: true,
  }
  return request({ url: `/moneyMarket/closeOffer`, method: 'put', data: body })
}

export const closeOrder = () => {
  const queryClient = useQueryClient()
  return useMutation(
    closeOrderRequest,
    {
      onError: (_error: any, _orders: any, context: any) => {
        queryClient.setQueryData('orders', context.previousOrders)
      },
      onSettled: () => {
        queryClient.invalidateQueries('orders')
      },
      onSuccess: (data) => {
        console.log('closeOrder', data?.data)
      }
    }
  )
}
