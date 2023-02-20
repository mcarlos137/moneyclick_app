import { useQuery } from "react-query"
import { request } from "../../tools/axiosUtils"

const verifyMFACodeRequest = ({ queryKey }) => {
    let body: any = {
        userName: queryKey[1],
        code: queryKey[2],
    }
    return request({ url: `/mfa/verifyCode`, method: 'post', data: body })
}

export const verifyMFACode = (userName: string, code: string) => {
    return useQuery(
        ['verifyMFACode', userName, code],
        verifyMFACodeRequest,
        {
            enabled: userName !== '' && code.length === 7,
            select: (data) => data?.data,
            onSuccess: (data) => {
                console.log('verifyMFACode', JSON.stringify(data, null, 4));
            },
            //keepPreviousData: true
        }
    )
}
