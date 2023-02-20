import { useMutation } from "react-query"
import { request } from "../../tools/axiosUtils"

type AddUserFirebaseTokenRequest_Props = {
  userName: string
  token: string
}

const addUserFirebaseTokenRequest = ({
  userName,
  token,
}: AddUserFirebaseTokenRequest_Props) => {
  let body = {
    userName: userName,
    token: token,
  }
  console.log('body', body);
  return request({ url: `/notification/addTokenToUser`, method: 'post', data: body })
}

export const addUserFirebaseToken = () => {
  return useMutation(
    addUserFirebaseTokenRequest,
    {
      onSuccess(data, variables, context) {
        console.log('addUserFirebaseToken', JSON.stringify(data, null, 4));
      },
    })
}
