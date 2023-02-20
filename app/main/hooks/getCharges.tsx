import { useQuery } from "react-query"
import { request } from "../../tools/axiosUtils"

const getChargesRequest = ({queryKey}) => {
    let body = {
        currency: queryKey[1],
        targetCurrency: queryKey[2],
        amount: queryKey[3],
        btcPrice: queryKey[4],
        balance: queryKey[5],
        operationType: queryKey[6],
        paymentType: queryKey[7],
    }
    return request({ url: `/otc/getChargesNew`, method: 'post', data: body })
}

export const getCharges = (
    baseCurrency: string,
    targetCurrency: string | null,
    amount: number,
    btcPrice: number | null,
    balance: number,
    operationType: string,
    paymentType: string | null
) => {
    return useQuery(
        ['charges', baseCurrency, targetCurrency, amount, btcPrice, balance, operationType, paymentType],
        getChargesRequest,
        {
            enabled: true,
            select: (data) => data.data
            //keepPreviousData: true
        }
    )
}
