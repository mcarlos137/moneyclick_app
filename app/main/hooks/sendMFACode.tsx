import { useQuery } from "react-query"
import { request } from "../../tools/axiosUtils"

const sendMFACodeRequest = ({ queryKey }) => {
    let body: any = {
      userName: queryKey[1],
      language: 'EN',
      sendSms: true
    }
    return request({ url: `/mfa/sendCode`, method: 'post', data: body })
}

export const sendMFACode = (userName: string) => {
    return useQuery(
        ['sendMFACode', userName],
        sendMFACodeRequest,
        {
            enabled: userName !== ''
            //keepPreviousData: true
        }
    )
}
