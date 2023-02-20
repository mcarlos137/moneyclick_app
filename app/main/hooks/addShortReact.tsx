import { useQuery } from "react-query"
import { request } from "../../tools/axiosUtils"

const addShortReactRequest = ({ queryKey }) => {
  let body: any = {
    id: queryKey[1],
    userName: queryKey[2],
    name: queryKey[3],
    reaction: queryKey[4],
  }
  return request({ url: `/shorts/react`, method: 'put', data: body })
}

export const addShortReact = (
  id: string,
  userName: string,
  name: string,
  reaction: string,
) => {
  return useQuery(
    ['addShortReact', id, userName, name, reaction],
    addShortReactRequest,
    {
      enabled: false,
      select: (data) => data.data,
      onSuccess: (data) => {
        console.log('data', data)
      }
    }
  )
}
