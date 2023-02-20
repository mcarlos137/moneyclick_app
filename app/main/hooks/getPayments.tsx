import { useQuery } from "react-query"
import { request } from "../../tools/axiosUtils"

const getPaymentsRequest = ({ queryKey }) => {
    return request({ url: `/otc/getPayments/${queryKey[1]}/${queryKey[2]}`, method: 'get' })
}

export const getPayments = (userName: string | null, currency: string | null) => {
    return useQuery(
        ['payments', userName, currency],
        getPaymentsRequest,
        {
            enabled: userName !== null && currency !== null,
            initialData: [],
            select: (data) => data?.data !== undefined ? decorateGetPaymentsResponse(data?.data) : data,
            onSuccess: (data) => {
                //console.log('payments', JSON.stringify(data, null, 4));
            },
        }
    )
}

const decorateGetPaymentsResponse = (data) => {
    const finalData: any[] = []
    const dataOwn = data.filter((payment) => {
        return payment.mcVerified === true || payment.verified === true || payment.own;
    });
    const dataThirds = data.filter((payment) => {
        return !(payment.mcVerified === true || payment.verified === true || payment.own);
    });
    finalData.push({ title: 'Own', data: dataOwn });
    finalData.push({ title: 'Thirds', data: dataThirds });
    return finalData
};

