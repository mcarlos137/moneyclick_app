import { useMutation } from "react-query"
import { request } from "../../../tools/axiosUtils"

type CryptoSellRequest_Props = {
  userName: string
  cryptoCurrency: string
  fiatCurrency: string
  cryptoAmount: number
  fiatAmount: number
}

const cryptoSellRequest = ({
  userName,
  cryptoCurrency,
  fiatCurrency,
  cryptoAmount,
  fiatAmount
}: CryptoSellRequest_Props) => {
  let body = {
    userName: userName,
    cryptoCurrency: cryptoCurrency,
    fiatCurrency: fiatCurrency,
    cryptoAmount: cryptoAmount,
    fiatAmount: fiatAmount,
  }
  return request({ url: `/mcUser/sellCrypto`, method: 'put', data: body })
}

export const cryptoSell = () => {
  return useMutation(cryptoSellRequest)
}
