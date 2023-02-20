import { useQuery } from "react-query"
import { request } from "../../../tools/axiosUtils"

const getVerificationsRequest = ({ queryKey }) => {
    let url = '/user/getVerifications?userName=' + queryKey[1]
    if (queryKey[2] !== null) {
        url = url + '&userVerificationStatus=' + queryKey[2]
    }
    return request({ url: url, method: 'get' })
}

export const getVerifications = (userName: string, status: string | null) => {
    return useQuery(
        ['verifications', userName, status],
        getVerificationsRequest,
        {
            enabled: true,
            initialData: [],
            select: (data) => data?.data !== undefined ? data.data : data,
            onSuccess: (data) => {
                //console.log('verifications', JSON.stringify(data, null, 4));
            },
        }
    )
}
