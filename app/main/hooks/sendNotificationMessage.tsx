import { useMutation } from "react-query"
import { request } from "../../tools/axiosUtils"

type SendNotificationMessageRequest_Props = {
  userNames: string[]
  title: string
  content: string
  data?: any
  sound?: string
}

const sendNotificationMessageRequest = ({
  userNames,
  title,
  content,
  data,
  sound
}: SendNotificationMessageRequest_Props) => {
  let body: any = {
    userNames: userNames,
    kaikai: true
  }
  if (title !== null) body.title = title
  if (content !== null) body.content = content
  if (data !== null) body.data = data
  if (sound !== null) body.sound = sound

  return request({ url: `/notification/sendMessage`, method: 'post', data: body })
}

export const sendNotificationMessage = () => {
  return useMutation(sendNotificationMessageRequest)
}
