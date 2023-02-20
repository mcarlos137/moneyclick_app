import { useQuery } from "react-query"
import { request } from "../../tools/axiosUtils"

const getConfigGalleryRequest = ({ queryKey }) => {
    return request({ url: `/user/getConfig/${queryKey[1]}/${queryKey[2]}/OK`, method: 'get' })
}

export const getConfigGallery = (userName: string, type: string) => {
    console.log('type', type)
    return useQuery(
        ['configGallery', userName, type],
        getConfigGalleryRequest,
        {
            enabled: true,
            initialData: [],
            select: (data) => data?.data?.result !== undefined ? getGetConfigGalleryData(data.data.result) : data,
            onSuccess: (data) => {
                //console.log('decorateGetConfigGalleryResponse', JSON.stringify(data, null, 4));
            },
            staleTime: 0,
            cacheTime: 0
        }
    )
}

type GetConfingGallery_Data = {
    id: string
    timestamp: string
    name: string
    type: string
}
 

const getGetConfigGalleryData = (data) => {
    let decorateResponse: GetConfingGallery_Data[] = []
    Object.keys(data).forEach((key) => {
        let timestamp = key.split('T')[0] + 'T' + key.split('T')[1].split("--").join(".").split("-").join(":")
        let fileName = data[key]
        let fileType = 'image'
        if (!data[key].includes('jpeg') && !data[key].includes('jpg') && !data[key].includes('png')) {
            fileType = 'video'
        }
        decorateResponse.push({ id: timestamp, timestamp: timestamp, name: fileName, type: fileType })
    });
    decorateResponse = decorateResponse.sort((a, b) => {
        if (b.timestamp < a.timestamp) return -1;
        if (b.timestamp > a.timestamp) return 1;
        return 0;
    });
    return decorateResponse
};

