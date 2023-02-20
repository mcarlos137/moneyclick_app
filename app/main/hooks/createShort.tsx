import { useId } from "react"
import { useMutation, useQueryClient } from "react-query"
import { request } from "../../tools/axiosUtils"

type CreateShortRequest_Props = {
  userName: string
  name: string
  title: string
  description: string
  videoAsset: any
  publishTimestamp: string | null
  assetId: string
}

const createShortRequest = ({
  userName,
  name,
  title,
  description,
  videoAsset,
  publishTimestamp,
  assetId
}: CreateShortRequest_Props) => {
  const formData = new FormData();
  formData.append('userName', userName);
  formData.append('name', name);
  formData.append('title', title);
  formData.append('description', description);
  if(publishTimestamp !== null) formData.append('publishTimestamp', publishTimestamp)
  if (videoAsset !== null) {
    formData.append(
      'video',
      {
        uri: videoAsset.uri,
        name: videoAsset.fileName,
        type: videoAsset.type,
      },
      videoAsset.fileName
    );
    formData.append('videoFileName', videoAsset.fileName);
    formData.append('assetId', assetId);
  }
  console.log('formData ' + JSON.stringify(formData));
  return request({ url: `/shortsCreate`, method: 'post', data: formData, form: true })
}

export const createShort = () => {
  const queryClient = useQueryClient()
  return useMutation(
    createShortRequest,
    {
      onError: (_error: any, _shorts: any, context: any) => {
        queryClient.setQueryData('shorts', context.previousShorts)
      },
      onSettled: () => {
        queryClient.invalidateQueries('shorts')
      },
      onSuccess(data, variables, context) {
        //console.log('data', JSON.stringify(data, null, 4));
      },
    })
}
