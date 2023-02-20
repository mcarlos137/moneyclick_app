import { useMutation } from "react-query"
import { request } from "../../tools/axiosUtils"

type AddUserInfoRequest_Props = {
  userName: string
  fieldName: string
  fieldValue?: string | null
  fieldValueArray?: any[] | null
  type?: string
}

const addUserInfoRequest = ({
  userName,
  fieldName,
  fieldValue,
  fieldValueArray,
  type
}: AddUserInfoRequest_Props) => {
  let body: any = {
    userName: userName,
    fieldName: fieldName,
  };
  if (fieldValue !== undefined) {
    body.fieldValue = fieldValue
  }
  if (fieldValueArray !== undefined) {
    body.fieldValueArray = fieldValueArray
  }
  if (type !== undefined) {
    body.type = type
  }
  return request({ url: `/user/addInfo`, method: 'post', data: body })
}

export const addUserInfo = () => {
  return useMutation(
    addUserInfoRequest,
    {
      onSuccess: (data) => {
        //console.log('data', data?.data)
      }
    }
  )
}
