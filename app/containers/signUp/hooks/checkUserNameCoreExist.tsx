import { useQuery } from "react-query"
import { request } from "../../../tools/axiosUtils"

const checkUserNameCoreExistRequest = ({ queryKey }) => {
  const userName = queryKey[1] + queryKey[2]
  console.log('userName', userName)
  return request({ url: `/mcUser/exist/${userName}`, method: 'get' })
}

export const checkUserNameCoreExist = (areaCode: string, phone: string) => {
  return useQuery(
    ['userNameCoreExist', areaCode, phone],
    checkUserNameCoreExistRequest,
    {
      initialData: false,
      enabled: areaCode !== '' && phone.length >= 9,
      select: (data) => data?.data !== undefined ? data.data : false,
      onSuccess: (data) => {
        //console.log('checkUserNameExist', JSON.stringify(data, null, 4));
      }
    }
  )
}
