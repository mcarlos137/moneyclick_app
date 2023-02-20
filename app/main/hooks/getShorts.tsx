import { useQuery } from "react-query"
import { request } from "../../tools/axiosUtils"

const getShortsRequest = ({ queryKey }) => {
    let body: any = {}
    if (queryKey[1] !== null) body.userNames = queryKey[1]
    if (queryKey[2] !== null) body.titles = queryKey[2]
    if (queryKey[3] !== null) body.tags = queryKey[3]
    if (queryKey[4] !== null) body.statuses = queryKey[4]
    return request({ url: `/shorts/list`, method: 'post', data: body })
}

export const getShorts = (
    userNames: string[] | null,
    titles: string[] | null,
    tags: string[] | null,
    statuses: string[] | null
) => {
    return useQuery(
        ['shorts', userNames, titles, tags, statuses],
        getShortsRequest,
        {
            enabled: true,
            initialData: [],
            select: (data) => data?.data !== undefined ? data.data : data,
            onSuccess: (data) => {
                //console.log('shorts', JSON.stringify(data, null, 4));
            },
        }
    )
}
