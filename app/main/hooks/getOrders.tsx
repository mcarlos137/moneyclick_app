import { useQuery } from "react-query"
import { request } from "../../tools/axiosUtils"

const getOrdersRequest = ({ queryKey }) => {
    let body: any = {
        userName: queryKey[1]
    }
    if (queryKey[2] !== null) body.pair = queryKey[2]
    if (queryKey[3] !== null) body.id = queryKey[3]
    if (queryKey[4] !== null) body.type = queryKey[4]
    if (queryKey[5] !== null) body.old = queryKey[5]
    console.log('body', body)
    return request({ url: `/moneyMarket/getOffers`, method: 'post', data: body })
}

export const getOrders = (
    userName: string,
    pair: string | null,
    id: string | null,
    operationType: 'ASK' | 'BID' | null,
    old: boolean | null,
) => {

    return useQuery(
        ['orders', userName, pair, id, operationType, old],
        getOrdersRequest,
        {
            enabled: true,
            initialData: [],
            select: (data) => data?.data !== undefined ? getOrdersData(data.data) : data,
            onSuccess: (data) => {
                console.log('orders', JSON.stringify(data, null, 4));
            },
            cacheTime: 30000
        }
    )
}

const getOrdersData = (data) => {
    const newData: any[] = []
    data.ASK !== undefined && data?.ASK.map(item => {
        newData.push({ ...item, operationType: 'ASK' })
    })
    data.BID !== undefined && data?.BID.map(item => {
        newData.push({ ...item, operationType: 'BID' })
    })
    console.log('newData', newData)
    return newData.sort((a, b) => {
        if (b.timestamp < a.timestamp) return -1;
        if (b.timestamp > a.timestamp) return 1;
        return 0;
    })
}
