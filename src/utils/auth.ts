import api from './api'

export const register = async (data: {
  name: string
  email: string
  password: string
  role: string
}) => {
  const res = await api.post('/auth/register', data)
  localStorage.setItem('token', res.data.accessToken)
  localStorage.setItem('refreshToken', res.data.refreshToken)
  localStorage.setItem('user', JSON.stringify(res.data.user))
  return res.data
}

export const login = async (data: {
  email: string
  password: string
}) => {
  const res = await api.post('/auth/login', data)
  localStorage.setItem('token', res.data.accessToken)
  localStorage.setItem('refreshToken', res.data.refreshToken)
  localStorage.setItem('user', JSON.stringify(res.data.user))
  return res.data
}

export const logout = async () => {
  const refreshToken = localStorage.getItem('refreshToken')
  try {
    await api.post('/auth/logout', { refreshToken })
  } catch {}
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  window.location.href = '/login'
}

export const getUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export const isLoggedIn = () => {
  return !!localStorage.getItem('token')
}
