import api from './api'

export const submitKYC = async (data: {
  dateOfBirth: string
  address: string
  idType: string
  idNumber: string
}) => {
  const res = await api.post('/kyc/submit', data)
  return res.data
}

export const getKYCStatus = async () => {
  const res = await api.get('/kyc/status')
  return res.data.kyc
}

export const verifyKYC = async () => {
  const res = await api.post('/kyc/verify')
  return res.data
}
