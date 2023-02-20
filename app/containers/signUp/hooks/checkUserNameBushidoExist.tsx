import { useQuery } from "react-query"
import { request, requestBushido } from "../../../tools/axiosUtils"

const checkUserNameBushidoExistRequest = ({ queryKey }) => {
  return requestBushido({ url: `/user/find/userByPhone/${queryKey[2]}/${queryKey[1]}`, method: 'get' })
}

export const checkUserNameBushidoExist = (areaCode: string, phone: string) => {
  return useQuery(
    ['userNameBushidoExist', areaCode, phone],
    checkUserNameBushidoExistRequest,
    {
      initialData: false,
      enabled: areaCode !== '' && phone.length >= 9,
      select: (data) => data?.data?.payload !== undefined && data?.data?.payload !== null ? true : false,
      onSuccess: (data) => {
        //console.log('checkUserNameBushidoExist', JSON.stringify(data, null, 4));
      }
    }
  )
}
