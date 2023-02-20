import { useId } from "react"
import { useMutation, useQueryClient } from "react-query"
import { request } from "../../tools/axiosUtils"

type AddUserAttachmentRequest_Props = {
  userName: string
  fieldName: string
  attachment: any
  type?: string
}

const addUserAttachmentRequest = ({
  userName,
  fieldName,
  attachment,
  type
}: AddUserAttachmentRequest_Props) => {
  const formData = new FormData();
  formData.append('userName', userName);
  formData.append('fieldName', fieldName);
  if (type !== undefined) {
    formData.append('type', type);
  }
  if (attachment !== null) {
    formData.append(
      'attachment',
      {
        uri: attachment.uri,
        name: attachment.fileName,
        type: attachment.type,
      },
      attachment.fileName
    );
    formData.append('fileName', attachment.fileName);
  }
  console.log('formData ' + JSON.stringify(formData));
  return request({ url: `/userAddAttachment`, method: 'post', data: formData, form: true })
}

export const addUserAttachment = () => {
  const queryClient = useQueryClient()
  return useMutation(
    addUserAttachmentRequest,
    {
      onError: (_error: any, _shorts: any, context: any) => {
        queryClient.setQueryData('configGallery', context.previousConfigGallery)
      },
      onSettled: () => {
        queryClient.invalidateQueries('configGallery')
      },
      onSuccess(data, variables, context) {
        //console.log('data', JSON.stringify(data, null, 4));
      },
    })
}
