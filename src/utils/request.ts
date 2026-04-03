import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { useAuthStore } from '../stores/auth'

const instance = axios.create({
  baseURL: '/api', // 根据需要调整
  timeout: 10000,
})

instance.interceptors.request.use(
  (config) => {
    const auth = useAuthStore()
    if (auth.token && config.headers) {
      config.headers.Authorization = `Bearer ${auth.token}`
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
    // 这里可以根据后端约定处理 401 等
    return Promise.reject(error)
  },
)

export function get<T = any>(url: string, config?: AxiosRequestConfig) {
  return instance.get<T>(url, config)
}

export function post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
  return instance.post<T>(url, data, config)
}

export default instance

