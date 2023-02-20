import { useQuery } from "react-query"
import { request } from "../../../tools/axiosUtils"

const getFinancialTypesRequest = ({ queryKey }) => {
    return request({ url: `/otcNew/getFinancialTypes/${queryKey[1]}`, method: 'get' })
}

export const getFinancialTypes = (currency: string | null) => {
    return useQuery(
        ['financialTypes', currency],
        getFinancialTypesRequest,
        {
            enabled: false,
            select: (data) => data?.data?.filter(financialType => financialType.active && financialType.fiatBankTransfer),
            onSuccess: (data) => {
                //console.log('financialTypes', JSON.stringify(data, null, 4));
            },
            cacheTime: 0
            //keepPreviousData: false,
            
        }
    )
}