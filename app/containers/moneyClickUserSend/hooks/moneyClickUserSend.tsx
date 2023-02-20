import { useMutation } from "react-query"
import { request } from "../../../tools/axiosUtils"

type MoneyClickUserSendRequest_Props = {
    baseUserName: string
    targetUserName: string
    currency: string
    amount: number
    isInternational: boolean
    baseName: string
    targetName: string
    description: string
    clientId: string | null
    receiveAuthorizationId: string | null
}

const moneyClickUserSendRequest = ({
    baseUserName,
    targetUserName,
    currency,
    amount,
    isInternational,
    baseName,
    targetName,
    description,
    clientId,
    receiveAuthorizationId
}: MoneyClickUserSendRequest_Props) => {
    let body: any = {
        baseUserName: baseUserName,
        targetUserName: targetUserName,
        currency: currency,
        amount: amount,
        international: isInternational
    }
    if (baseName !== '') body.baseName = baseName
    if (targetName !== '') body.targetName = targetName
    if (description !== '') body.description = description
    if (clientId !== null) body.clientId = clientId
    if (receiveAuthorizationId !== null) body.receiveAuthorizationId = receiveAuthorizationId
    return request({ url: `/mcUser/send`, method: 'post', data: body })
}

export const moneyClickUserSend = () => {
    return useMutation(moneyClickUserSendRequest)
}
