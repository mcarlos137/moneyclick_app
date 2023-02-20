import { useQuery } from "react-query"
import { request } from "../../tools/axiosUtils"

const getFinancialOverviewRequest = ({ queryKey }) => {
    return request({ url: `/digitalBusiness/getFinancialOverview/${queryKey[1]}`, method: 'get' })
}

export const getFinancialOverview = (userName: string) => {
    return useQuery(
        ['financialOverview', userName],
        getFinancialOverviewRequest,
        {
            enabled: true,
            initialData: [],
            select: (data) => data?.data !== undefined ? data?.data : data,
            onSuccess: (data) => {
                //console.log('getFinancialOverviewData', JSON.stringify(data, null, 4));
            },
            //staleTime: 30000
        }
    )
}
