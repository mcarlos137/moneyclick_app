import axios from "axios";
//STORES
import { store as requestHeadersStore } from "../main/stores/requestHeaders";
//TOOLS
import httpRequest from "./httpRequest";

const client = axios.create({ baseURL: 'https://service8081.moneyclick.com' })
const clientBushido = axios.create({ baseURL: 'https://service8080.moneyclick.com/bushido-wallet-service-1.0.3/api/v2' })

export const request = ({ ...options }) => {
    let hmacInterceptor = requestHeadersStore.getState().hmacInterceptor
    let req = hmacInterceptor.process(httpRequest.create('https://service8081.moneyclick.com', options.url, options.method.toUpperCase(), options.data, options.form !== undefined ? options.form : false));
    const onSuccess = (response) => response
    const onError = (error) => {
        return error
    }
    return client({ ...options, headers: req.headers }).then(onSuccess).catch(onError)
}

export const requestBushido = ({ ...options }) => {
    const onSuccess = (response) => response
    const onError = (error) => {
        return error
    }
    return clientBushido(options).then(onSuccess).catch(onError)
}