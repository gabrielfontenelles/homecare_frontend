import axios from "axios"
import { getCookie, setCookie, deleteCookie } from "cookies-next"


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081",
  headers: {
    "Content-Type": "application/json",
  },
})

console.log('API Base URL:', api.defaults.baseURL)


api.interceptors.request.use(
  (config) => {
    if (
      config.url?.includes("/auth/login") ||
      config.url?.includes("/auth/register")
    ) {
      const originalData = config.data

      if (originalData) {
        const transformedData: any = {
          ...originalData,  
        }

        if (originalData.password) {
          transformedData.senha = originalData.password
          delete transformedData.password
        }
        if (originalData.name) {
          transformedData.nome = originalData.name
          delete transformedData.name
        }
        if (originalData.email) {
          transformedData.email = originalData.email
        }

        console.log('Transformando dados de autenticação:', { originalData, transformedData })
        config.data = transformedData
      }
    }

    
    const token = getCookie("auth-token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
       
        const refreshToken = getCookie("refresh-token")
        if (refreshToken) {
          const response = await axios.post(`${api.defaults.baseURL}/auth/refresh-token`, {
            refreshToken,
          })

          const { token, refreshToken: newRefreshToken } = response.data

        
          setCookie("auth-token", token, { maxAge: 60 * 60 * 24 }) // 1 dia
          setCookie("refresh-token", newRefreshToken, { maxAge: 60 * 60 * 24 * 7 }) // 7 dias

          
          api.defaults.headers.common.Authorization = `Bearer ${token}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        
        deleteCookie("auth-token")
        deleteCookie("refresh-token")
        window.location.href = "/login?session=expired"
      }
    }

    return Promise.reject(error)
  },
)

export default api