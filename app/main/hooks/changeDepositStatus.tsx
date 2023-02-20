import { useMutation, useQuery, useQueryClient } from "react-query"
import { request } from "../../tools/axiosUtils"

type ChangeDepositStatusRequest = {
  id: string
  otcOperationStatus: string
  canceledReason: string | null
}

const changeDepositStatusRequest = ({
  id,
  otcOperationStatus,
  canceledReason,
}: ChangeDepositStatusRequest) => {
  let body: any = {
    id: id,
    otcOperationStatus: otcOperationStatus,
    userChange: true,
  }
  if (canceledReason !== '') body.canceledReason = canceledReason
  console.log('body', body)
  return request({ url: `/buyBalance/changeOperationStatus`, method: 'post', data: body })
}

export const changeDepositStatus = () => {
  const queryClient = useQueryClient()
  return useMutation(
    changeDepositStatusRequest,
    {
      onError: (_error: any, _shorts: any, context: any) => {
        queryClient.setQueryData('deposits', context.previousDeposits)
      },
      onSettled: () => {
        queryClient.invalidateQueries('deposits')
      },
      onSuccess(data, variables, context) {
        console.log('data', JSON.stringify(data, null, 4));
      },
    })
}
