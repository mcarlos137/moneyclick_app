import { useQuery } from "react-query"
import { request } from "../../tools/axiosUtils"

const addShortCommentRequest = ({ queryKey }) => {
  let body: any = {
    id: queryKey[1],
    userName: queryKey[2],
    name: queryKey[3],
    comment: queryKey[4],
    privateComment: queryKey[5]
  }
  if (queryKey[6] !== null) body.replyId = queryKey[6]
  return request({ url: `/shorts/addComment`, method: 'post', data: body })
}

export const addShortComment = (
  id: string,
  userName: string,
  name: string,
  comment: string,
  privateComment: boolean,
  replyId: string | null,
) => {
  return useQuery(
    ['addShortComment', id, userName, name, comment, privateComment, replyId],
    addShortCommentRequest,
    {
      enabled: false,
      select: (data) => data.data,
      onSuccess: (data) => {
        console.log('data', data)
      }
    }
  )
}
