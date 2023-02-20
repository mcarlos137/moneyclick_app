import { useQuery } from "react-query"
import { request } from "../../tools/axiosUtils"

const addShortViewRequest = ({ queryKey }) => {
  let body: any = {
    id: queryKey[1],
    userName: queryKey[2],
    name: queryKey[3],
  }
  return request({ url: `/shorts/view`, method: 'put', data: body })
}

export const addShortView = (
  id: string,
  userName: string,
  name: string,
) => {
  return useQuery(
    ['addShortView', id, userName, name],
    addShortViewRequest,
    {
      enabled: false,
      select: (data) => data.data,
      onSuccess: (data) => {
        console.log('data', data)
      }
    }
  )
}
