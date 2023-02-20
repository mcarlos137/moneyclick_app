import { useMutation } from "react-query"
import { request } from "../../../tools/axiosUtils"

type CryptoSendRequest_Props = {
    userName: string
    currency: string
    amount: number
    targetAddress: string
    paymentType: string | null
    additionalInfo: string | null
}

const cryptoSendRequest = ({
    userName,
    currency,
    amount,
    targetAddress,
    paymentType,
    additionalInfo
}: CryptoSendRequest_Props) => {
    let body: any = {
        userName: userName,
        balanceOperationType: 'SEND',
        amounts: {},
        targetAddress: targetAddress,
    }
    body.amounts[currency] = amount
    if (paymentType !== null) body.paymentType = paymentType
    if (additionalInfo !== null) body.additionalInfo = additionalInfo
    console.log('body', body)
    return request({ url: `/mcUserNew/balanceOperation`, method: 'post', data: body })
}

export const cryptoSend = () => {
    return useMutation(cryptoSendRequest)
}
