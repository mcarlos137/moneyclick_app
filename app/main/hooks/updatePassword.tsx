import { Alert } from 'react-native'
import { useQuery } from "react-query"
import { request, requestBushido } from "../../tools/axiosUtils"
import security from "../../tools/security";

const updatePasswordRequest = ({ queryKey }) => {
  var pass = security.encode(queryKey[2] + '__' + queryKey[1] + '__' + queryKey[3]);
  var hash = security.randomBytes(50);
  var endPass = security.encode(pass + security.bytesToBase64(hash));
  let body = {
    username: queryKey[1],
    passwordEncode: endPass,
  };
  return requestBushido({ url: `/user/security/update/passwordMoneyClickUpdate`, method: 'post', data: body })
}

export const updatePassword = (userName: string, password: string, code: string) => {
  return useQuery(
    ['updatePassword', userName, password, code],
    updatePasswordRequest,
    {
      enabled: false,
      select: (data) => data.data.payload,
      onSuccess: (data) => {
        console.log('data', data)
      }
    }
  )
}
