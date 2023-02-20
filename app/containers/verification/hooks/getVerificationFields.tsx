import { useQuery } from "react-query"
import { request } from "../../../tools/axiosUtils"

const getVerificationFieldsRequest = ({ queryKey }) => {
    return request({ url: `/user/getUserVerificationFieldsNew/${queryKey[1]}`, method: 'get' })
}

export const getVerificationFields = (type: string) => {
    return useQuery(
        ['verificationFields', type],
        getVerificationFieldsRequest,
        {
            enabled: true,
            initialData: [],
            select: (data) => data?.data !== undefined ? getVerificationFieldsData(data.data) : data,
            onSuccess: (data) => {
                //console.log('verificationFields', JSON.stringify(data, null, 4));
            },
        }
    )
}

const getVerificationFieldsData = (data) => {
    const newData: any[] = []
    Object.entries(data).forEach(([key, value]: [string, any]) => {
        value.name = key;
        newData.push({ ...value, name: key });
    });
    return newData
}