import { useQuery } from "react-query"
import { request } from "../../tools/axiosUtils"

const getDebitCardsRequest = ({ queryKey }) => {
    let body: any = {}
    if (queryKey[1] !== null) body.userName = queryKey[1]
    if (queryKey[2] !== null) body.number = queryKey[2]
    if (queryKey[3] !== null) body.currency = queryKey[3]
    if (queryKey[4] !== null) body.holderName = queryKey[4]
    if (queryKey[5] !== null) body.initTimestamp = queryKey[5]
    if (queryKey[6] !== null) body.finalTimestamp = queryKey[6]
    if (queryKey[7] !== null) body.debitCardStatus = queryKey[7]
    if (queryKey[8] !== null) body.type = queryKey[8]
    return request({ url: `/debitCard/list`, method: 'post', data: body })
}

export const getDebitCards = (
    userName: string | null,
    number: string | null,
    currency: string | null,
    holderName: string | null,
    initTimestamp: string | null,
    finalTimestamp: string | null,
    status: string | null,
    type: string | null
) => {
    
    return useQuery(
        ['debitCards', userName, number, currency, holderName, initTimestamp, finalTimestamp, status, type],
        getDebitCardsRequest,
        {
            enabled: userName !== null,
            initialData: [],
            select: (data) => data?.data !== undefined ? data.data : data,
            onSuccess: (data) => {
                //console.log('debitCards', JSON.stringify(data.length, null, 4));
            },
            cacheTime: 30000
        }
    )
}
