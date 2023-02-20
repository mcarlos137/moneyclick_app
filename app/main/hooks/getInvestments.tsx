import { useQuery } from "react-query"
import { request } from "../../tools/axiosUtils"

const getInvestmentRequest = ({ queryKey }) => {
  return request({ url: `/model/list/${queryKey[1]}/false`, method: 'get' })
}

export const getInvestments = (userName: string | null) => {
  return useQuery(
    ['investments', userName],
    getInvestmentRequest,
    {
      enabled: userName !== null,
      initialData: [],
      select: (data) => data?.data?.result?.models !== undefined ? data.data.result.models : data,
      onSuccess: (data) => {
        //console.log('data>>>>>>>>>>>dasdasdasd', JSON.stringify(data, null, 4));
      }
    }
  )
}