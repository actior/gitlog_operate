import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { useAuthStore } from '../stores/auth'

function getCookie(name: string): string {
  const escaped = name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : ''
}

const instance = axios.create({
  baseURL: '/api', // 根据需要调整
  timeout: 10000,
  withCredentials: true,
  xsrfCookieName: 'csrf_token',
  xsrfHeaderName: 'X-CSRF-Token',
})

instance.interceptors.request.use(
  (config) => {
    const auth = useAuthStore()
    if (auth.token && config.headers) {
      config.headers.Authorization = `Bearer ${auth.token}`
    }

    // 对修改类请求附带 CSRF token（后端通常通过 cookie 下发）
    const method = (config.method || 'get').toLowerCase()
    if (['post', 'put', 'patch', 'delete'].includes(method) && config.headers) {
      const csrfToken = getCookie('csrf_token')
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  (error) => {
    // 401 可按需清理状态并跳转登录
    return Promise.reject(error)
  },
)

export function get<T = any>(url: string, config?: AxiosRequestConfig) {
  return instance.get<T, T>(url, config)
}

export function post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
  return instance.post<T, T>(url, data, config)
}

export default instance

