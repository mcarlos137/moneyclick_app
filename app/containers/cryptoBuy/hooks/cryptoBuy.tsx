import { useMutation } from "react-query"
import { request } from "../../../tools/axiosUtils"

type CryptoBuyRequest_Props = {
    userName: string
    cryptoCurrency: string
    fiatCurrency: string
    cryptoAmount: number
    fiatAmount: number
}

const cryptoBuyRequest = ({
    userName,
    cryptoCurrency,
    fiatCurrency,
    cryptoAmount,
    fiatAmount
}: CryptoBuyRequest_Props) => {
    let body = {
        userName: userName,
        cryptoCurrency: cryptoCurrency,
        fiatCurrency: fiatCurrency,
        cryptoAmount: cryptoAmount,
        fiatAmount: fiatAmount,
    }
    console.log('body', body)
    return request({ url: `/mcUser/buyCrypto`, method: 'put', data: body })
}

export const cryptoBuy = () => {
    return useMutation(cryptoBuyRequest)
}
