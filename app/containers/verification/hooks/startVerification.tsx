import { useMutation, useQueryClient } from "react-query"
import { request } from "../../../tools/axiosUtils"

type StartVerificationRequest_Props = {
  userName: string
  info: string
  fieldNames: string[]
  userVerificationType: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
}

const startVerificationRequest = ({
  userName,
  info,
  fieldNames,
  userVerificationType
}: StartVerificationRequest_Props) => {
  const body = {
    userName: userName,
    info: info,
    fieldNames: fieldNames,
    userVerificationType: userVerificationType
  };
  return request({ url: `/user/startVerification`, method: 'post', data: body })
}

export const startVerification = () => {
  const queryClient = useQueryClient()
  return useMutation(
    startVerificationRequest,
    {
      onSettled: () => {
        queryClient.invalidateQueries('config')
        queryClient.invalidateQueries('verifications')
      },
      onSuccess: (data) => {
        console.log('data', data?.data)
      }
    }
  )
}
