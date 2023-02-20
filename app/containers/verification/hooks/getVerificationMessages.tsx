import { useQuery } from "react-query"
import { request } from "../../../tools/axiosUtils"

const getVerificationMessagesRequest = ({ queryKey }) => {
    return request({ url: `/user/getUserVerificationMessages/${queryKey[1]}`, method: 'get' })
}

export const getVerificationMessages = (type: string) => {
    return useQuery(
        ['verificationMessages', type],
        getVerificationMessagesRequest,
        {
            enabled: true,
            initialData: [],
            select: (data) => data?.data !== undefined ? data.data : data,
            onSuccess: (data) => {
                //console.log('verificationMessages', JSON.stringify(data, null, 4));
            },
        }
    )
}
