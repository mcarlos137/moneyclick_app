import { useQuery } from "react-query"
import { request } from "../../../tools/axiosUtils"

const getDollarBTCPaymentsRequest = ({ queryKey }) => {
  return request({ url: `/buyBalance/getDollarBTCPayments/${queryKey[1]}/${queryKey[2]}`, method: 'get' })
}

export const getDollarBTCPayments = (userName: string, currency: string) => {
  return useQuery(
    ['dollarBTCPayments', userName, currency],
    getDollarBTCPaymentsRequest,
    {
      enabled: true,
      select: (data) => decorateGetDollarBTCPaymentsResponse(data?.data),
      onSuccess: (data) => {
        //console.log('decorateGetDollarBTCPaymentsResponse', JSON.stringify(data, null, 4));
      },
      //staleTime: 30000,
    }
  )
}

const decorateGetDollarBTCPaymentsResponse = (data) => {
  const decoratedPayments: any = []
  let frontId = 1
  data.map((payment) => {
    if (!payment.active || !payment.acceptIn || payment.buyBalance === undefined || payment.buyBalance.length === 0 || payment.bank === undefined || payment.types === undefined) {
      return
    }
    payment.buyBalance.map((item) => {
      let type = payment.types.find((it) => {
        if (it.name === item.type) {
          return it
        }
      })
      if (type === undefined) {
        return
      }
      var decoratedPayment: any = { key: payment.id + '__' + type, id: payment.id, frontId: frontId }
      let text = payment.bank === item.type ? payment.bank : payment.bank + ' - ' + item.type
      decoratedPayment.text = text
      decoratedPayment.type = item.type
      decoratedPayment.minPerOperationAmount = item.minPerOperationAmount
      decoratedPayment.maxPerOperationAmount = item.maxPerOperationAmount
      decoratedPayment.payWindow = type.payWindow
      decoratedPayment.joinMyPayments = type.joinMyPayments
      decoratedPayment.joinFieldValue = type.joinFieldValue
      var messages: any = []
      Object.keys(type.messages).forEach((key) => {
        if (!key.includes('MC_BUY_BALANCE')) {
          return
        }
        messages.push({ key: key, value: type.messages[key] })
      })
      decoratedPayment.messages = messages
      decoratedPayment.details = {}
      Object.keys(payment).forEach((key) => {
        if (key !== 'active' &&
          key !== 'acceptIn' &&
          key !== 'acceptOut' &&
          key !== 'joinField' &&
          key !== 'asociatedEmails' &&
          key !== 'restrictedDeposits' &&
          key !== 'types' &&
          key !== 'sendToPayments' &&
          key !== 'id' &&
          key !== 'buyBalance') {
          decoratedPayment.details[key] = payment[key]
        }
      });
      decoratedPayments.push(decoratedPayment)
      frontId++
    });
  })
  return decoratedPayments
};
