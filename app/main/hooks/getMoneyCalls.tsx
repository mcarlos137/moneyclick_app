import { useQuery } from "react-query"
import { request } from "../../tools/axiosUtils"

const getMoneyCallsRequest = ({ queryKey }) => {
    let body: any = {}
    if (queryKey[1] !== null) body.receiverUserNames = queryKey[1]
    if (queryKey[2] !== null) body.senderUserNames = queryKey[2]
    if (queryKey[3] !== null) body.currencies = queryKey[3]
    return request({ url: `/moneyCall/list`, method: 'post', data: body })
}

export const getMoneyCalls = (
    receiverUserNames: string[] | null,
    senderUserNames: string[] | null,
    currencies: string[] | null
) => {
    return useQuery(
        ['moneyCalls', receiverUserNames, senderUserNames, currencies],
        getMoneyCallsRequest,
        {
            enabled: true,
            initialData: [],
            select: (data) => data?.data !== undefined ? data.data : data,
            onSuccess: (data) => {
                //console.log('moneyCalls', JSON.stringify(data.length, null, 4));
            },
            cacheTime: 30000
        }
    )
}
