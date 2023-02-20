import { useMutation, useQuery } from "react-query"
import { request } from "../../../tools/axiosUtils"

type FastChangeRequest_Props = {
    userName: string
    baseCurrency: string
    targetCurrency: string
    amount: number
    factor: number
    description: string
}

const fastChangeRequest = ({
    userName,
    baseCurrency,
    targetCurrency,
    amount,
    factor,
    description
}: FastChangeRequest_Props) => {
    let body: any = {
        userName: userName,
        baseCurrency: baseCurrency,
        targetCurrency: targetCurrency,
        amount: amount,
        factor: factor,
    }
    if (description !== '') body.description = description
    console.log('body', body)
    return request({ url: `/mcUser/fastChange`, method: 'post', data: body })
}

export const fastChange = () => {
    return useMutation(fastChangeRequest)
}
