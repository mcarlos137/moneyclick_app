import { useMutation, useQueryClient } from "react-query"
import { request } from "../../tools/axiosUtils"

type PostOrderRequest_Props = {
  userName: string
  nickName: string
  pair: string
  amount: number
  price: number
  operationType: 'ASK' | 'BID'
  time: number
  timeUnit: 'HOURS' | 'MINUTES' | 'DAYS'
  priceMargin?: number
  paymentType?: string
  conditions?: string
  noEscrow?: boolean
  source: string
  payment: any
  subscriptionId?: string
}

const postOrderRequest = ({
  userName,
  nickName,
  pair,
  amount,
  price,
  operationType,
  time,
  timeUnit,
  priceMargin,
  paymentType,
  conditions,
  noEscrow = false,
  source,
  payment,
  subscriptionId
}: PostOrderRequest_Props) => {
  let body: any = {
    userName: userName,
    nickName: nickName,
    pair: pair,
    amount: amount,
    price: price,
    type: operationType,
    time: time,
    timeUnit: timeUnit,
    excludeMessage: true,
    source: source
  }
  if (priceMargin !== undefined) body.priceMargin = priceMargin
  if (paymentType !== undefined) body.paymentType = paymentType
  if (conditions !== undefined && conditions !== '') body.conditions = conditions
  if (noEscrow !== undefined) body.noEscrow = noEscrow
  if (payment !== undefined) body.payment = payment
  if (subscriptionId !== undefined) body.subscriptionId = subscriptionId
  console.log('body', body)
  return request({ url: `/moneyMarket/postOffer`, method: 'post', data: body })
}

export const postOrder = () => {
  const queryClient = useQueryClient()
  return useMutation(
    postOrderRequest,
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
