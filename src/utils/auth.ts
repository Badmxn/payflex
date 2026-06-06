import api from './api'

export const register = async (data: {
  name: string
  email: string
  password: string
  role: string
}) => {
  const res = await api.post('/auth/register', data)
  localStorage.setItem('token', res.data.token)
  localStorage.setItem('user', JSON.stringify(res.data.user))
  return res.data
}

export const login = async (data: {
  email: string
  password: string
}) => {
  const res = await api.post('/auth/login', data)
  localStorage.setItem('token', res.data.token)
  localStorage.setItem('user', JSON.stringify(res.data.user))
  return res.data
}

export const logout = () => {
  localStorage.removeItem('token')
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
