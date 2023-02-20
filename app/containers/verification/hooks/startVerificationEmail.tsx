import { useMutation, useQueryClient } from "react-query"
import { request } from "../../../tools/axiosUtils"

type StartVerificationEmailRequest_Props = {
  userName: string
  info: string
}

const startVerificationEmailRequest = ({
  userName,
  info,
}: StartVerificationEmailRequest_Props) => {
  const body = {
    userName: userName,
    info: info,
  };
  return request({ url: `/user/startVerificationEmail`, method: 'post', data: body })
}

export const startVerificationEmail = () => {
  const queryClient = useQueryClient()
  return useMutation(
    startVerificationEmailRequest,
    {
      onSettled: () => {
        queryClient.invalidateQueries('verifications')
      },
      onSuccess: (data) => {
        console.log('data', data?.data)
      }
    }
  )
}
