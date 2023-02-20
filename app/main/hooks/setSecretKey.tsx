import { useQuery } from "react-query"
import { request } from "../../tools/axiosUtils"

const setSecretKeyRequest = ({ queryKey }) => {
  let body = {
    userName: queryKey[1],
    secretKey: queryKey[2],
    deviceId: queryKey[3],
  }
  return request({ url: `/hmac/setSecretKey`, method: 'post', data: body })
}

export const setSecretKey = (userName: string | null, secretKey: string | null, deviceId: any) => {
  return useQuery(
    ['secretKey', userName, secretKey, deviceId],
    setSecretKeyRequest,
    {
      enabled: userName !== null && secretKey !== null
    }
  )
}
