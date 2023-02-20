import { useMutation } from "react-query"
import { request } from "../../../tools/axiosUtils"

type SendToPaymentRequest_Props = {
  userName: string
  currency: string
  amount: number
  payment: any
  description: string,
  paymentType: string | null,
}

const sendToPaymentRequest = ({
  userName,
  currency,
  amount,
  payment,
  paymentType,
  description
}: SendToPaymentRequest_Props) => {
  let body: any = {
    userName: userName,
    currency: currency,
    amount: amount,
    payment: payment
  };
  if (paymentType !== null) body.paymentType = paymentType
  if (description !== '') body.description = description
  console.log('body', body)
  return request({ url: `/mcUser/sendToPaymentNew`, method: 'post', data: body })
}

export const sendToPayment = () => {
  return useMutation(sendToPaymentRequest)
}
