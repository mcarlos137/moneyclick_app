import { useQuery } from "react-query"
import { requestBushido } from "../../../tools/axiosUtils"

const checkAvailableNickNameRequest = ({ queryKey }) => {
  return requestBushido({ url: `/user/check/nickname/${queryKey[1]}`, method: 'get' })
}

export const checkAvailableNickName = (nickName: string) => {
  return useQuery(
    ['availableNickName', nickName],
    checkAvailableNickNameRequest,
    {
      initialData: true,
      enabled: nickName?.trim().length >= 4,
      select: (data) => data?.data?.payload !== undefined && data?.data?.payload !== null ? data.data.payload : data,
      onSuccess: (data) => {
        //console.log('checkAvailableNickName', JSON.stringify(data, null, 4));
      }
    }
  )
}
