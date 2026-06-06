import api from './api'
import type { PaymentFormData } from '../types'

export const createTransaction = async (data: PaymentFormData) => {
  const res = await api.post('/transactions', data)
  return res.data
}

export const getTransactions = async () => {
  const res = await api.get('/transactions')
  return res.data.transactions
}
