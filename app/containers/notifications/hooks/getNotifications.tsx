import { useQuery } from "react-query"
import { request } from "../../../tools/axiosUtils"

const getNotificationsRequest = ({ queryKey }) => {
    return request({ url: `/notification/getMessages//${queryKey[1]}`, method: 'get' })
}

export const getNotifications = (userName: string | null) => {
    return useQuery(
        ['notifications', userName],
        getNotificationsRequest,
        {
            enabled: userName !== null,
            select: (data) => data?.data,
            onSuccess: (data) => {
                //console.log('notifications', JSON.stringify(data, null, 4));
            },
            staleTime: 30000,
            cacheTime: 30000
        }
    )
}