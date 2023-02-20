import { useMutation } from "react-query"
import { request } from "../../tools/axiosUtils"

type ModifyUserInfoRequest_Props = {
  userName: string
  fieldName: string
  fieldValue: string | null
  fieldValueArray: any[] | null
  type: string
}

const modifyUserInfoRequest = ({
  userName,
  fieldName,
  fieldValue,
  fieldValueArray,
  type
}: ModifyUserInfoRequest_Props) => {
  let body: any = {
    userName: userName,
    fieldName: fieldName,
  };
  if (fieldValue !== null) {
    body.fieldValue = fieldValue
  }
  if (fieldValueArray !== null) {
    body.fieldValueArray = fieldValueArray
  }
  if (type !== null) {
    body.type = type
  }
  return request({ url: `/user/modifyInfo`, method: 'put', data: body })
}

export const modifyUserInfo = () => {
  return useMutation(
    modifyUserInfoRequest,
    {
      onSuccess: (data) => {
        console.log('data', data?.data)
      }
    }
  )
}
