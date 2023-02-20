import { useQueries } from "react-query"
import { request } from "../../../tools/axiosUtils"

const getBalanceRequest = ({ queryKey }) => {
    return request({ url: `/mcUser/getNewBalance/${queryKey[1]}`, method: 'get' })
}

const getCurrenciesRequest = ({ }) => {
    return request({ url: `/otc/getCurrenciesWithCrypto`, method: 'get' })
}

const getCurrenciesOrderRequest = ({ queryKey }) => {
    return request({ url: `/otc/getCurrenciesOrder/${queryKey[1]}`, method: 'get' })
}

export type BalanceAPI = {
    [key: string]: any
}

export const getBalance = (userName: string | null, update: boolean) => {
    return useQueries([
        {
            queryKey: ['balance', userName],
            queryFn: getBalanceRequest,
            enabled: userName !== null && update,
            select: (data: BalanceAPI) => data.data,
            staleTime: 30000
        },
        {
            queryKey: ['currencies'],
            queryFn: getCurrenciesRequest,
            enabled: update,
            select: (data: any) => data.data,
            staleTime: 30000000
        },
        {
            queryKey: ['currenciesOrder'],
            queryFn: getCurrenciesOrderRequest,
            enabled: update,
            select: (data: any) => data.data,
            staleTime: 30000000
        },
    ])


}