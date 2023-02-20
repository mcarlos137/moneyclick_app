import { useMutation, useQueryClient } from "react-query"
import { request } from "../../tools/axiosUtils"

type TakeOrderRequest_Props = {
  userName: string
  nickName: string
  pair: string
  amount: number
  price: number
  operationType: string
  id: string
  payment: any
}

const takeOrderRequest = ({
  userName,
  nickName,
  pair,
  amount,
  price,
  operationType,
  id,
  payment,
}: TakeOrderRequest_Props) => {
  let body: any = {
    userName: userName,
    nickName: nickName,
    pair: pair,
    amount: amount,
    price: price,
    type: operationType,
    id: id,
  }
  if (payment !== undefined) body.payment = payment
  console.log('body', body)
  return request({ url: `/moneyMarket/takeOffer`, method: 'post', data: body })
}

export const takeOrder = () => {
  const queryClient = useQueryClient()
  return useMutation(
    takeOrderRequest,
    {
      onError: (_error: any, _shorts: any, context: any) => {
        queryClient.setQueryData('orders', context.previousOrders)
      },
      onSettled: () => {
        queryClient.invalidateQueries('orders')
      },
      onSuccess(data, variables, context) {
        console.log('data>>>>>>>>>>', JSON.stringify(data?.data, null, 4));
      },
    })
}
