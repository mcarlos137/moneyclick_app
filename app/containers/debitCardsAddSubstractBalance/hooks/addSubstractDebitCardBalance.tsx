import { useMutation } from "react-query"
import { request } from "../../../tools/axiosUtils"

type AddSubstractDebitCardBalanceRequest_Props = {
    userName: string
    id: string
    amount: number
    operationType: string
}

const addSubstractDebitCardBalanceRequest = ({
    userName,
    id,
    amount,
    operationType,
}: AddSubstractDebitCardBalanceRequest_Props) => {
    let body = {
        userName: userName,
        id: id,
        amount: amount,
        operation: operationType,
    }
    console.log('body', body)
    return request({ url: `/debitCard/addSubstractBalance`, method: 'put', data: body })
}

export const addSubstractDebitCardBalance = () => {
    return useMutation(addSubstractDebitCardBalanceRequest)
}