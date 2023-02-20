import { useQuery } from "react-query"
import { request } from "../../tools/axiosUtils"

const getShortsCommentsRequest = ({ queryKey }) => {
    return request({ url: `/shorts/getComments/${queryKey[1]}`, method: 'get' })
}

export const getShortsComments = (
    id: string,
) => {
    return useQuery(
        ['shortsComments', id],
        getShortsCommentsRequest,
        {
            enabled: true,
            initialData: [],
            select: (data) => data?.data !== undefined ? data.data : data,
            onSuccess: (data) => {
                console.log('shortsComments', JSON.stringify(data, null, 4));
            },
        }
    )
}
