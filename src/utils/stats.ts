import api from './api'

export const getDashboardStats = async () => {
  const res = await api.get('/stats')
  return res.data.stats
}
