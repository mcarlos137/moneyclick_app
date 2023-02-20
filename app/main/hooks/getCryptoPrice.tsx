import { useQuery } from "react-query"
import { request } from "../../tools/axiosUtils"

const getCryptoPriceRequest = ({queryKey}) => {
    return request({ url: `/mcUser/getCryptoPrice/${queryKey[1]}/${queryKey[2]}`, method: 'get' })
}

export const getCryptoPrice = (cryptoCurrency: string, fiatCurrency: string) => {
    return useQuery(
        ['cryptoPrice', cryptoCurrency, fiatCurrency],
        getCryptoPriceRequest,
        {
            enabled: true,
            initialData: [],
            select: (data) => data?.data !== undefined ? data.data : data,
            onSuccess: (data) => {
                //console.log('cryptoPrice', JSON.stringify(data.length, null, 4));
            },
            //keepPreviousData: true
        }
    )
}