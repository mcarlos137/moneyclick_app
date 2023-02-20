import { useMutation, useQueryClient } from "react-query"
import { request } from "../../../tools/axiosUtils"

type RequestDebitCardRequest_Props = {
  userName: string
  currency: string
  holderName: string
  phoneNumber: string
  model: string
  email: string
  photo: any
}

const requestDebitCardRequest = ({
  userName,
  currency,
  holderName,
  phoneNumber,
  model,
  email,
  photo,
}: RequestDebitCardRequest_Props) => {

  const formData = new FormData();  
  formData.append('userName', userName);
  formData.append('currency', currency);
  formData.append('holderName', holderName);
  formData.append('phoneNumber', phoneNumber);
  formData.append('model', model);
  if (email !== null) {
    formData.append('email', email);
  }
  if (photo !== null) {
    formData.append(
      'photo',
      {
        uri: photo.uri,
        name: photo.fileName + 'Photo.jpeg',
        type: photo.type,
      },
      photo.fileName
    );
    formData.append('photoFileName', photo.fileName);
  }
  console.log('formData ' + JSON.stringify(formData));
  return request({ url: `/shortsCreate`, method: 'post', data: formData, form: true })
}

export const requestDebitCard = () => {
  const queryClient = useQueryClient()
  return useMutation(
    requestDebitCardRequest,
    {
      onError: (_error: any, _debitCards: any, context: any) => {
        queryClient.setQueryData('debitCards', context.previousDebitCards)
      },
      onSettled: () => {
        queryClient.invalidateQueries('debitCards')
      }
    })
}
