import axios from 'axios'

const baseURL = import.meta.env.VITE_BACKEND_BASE_URL

const publicClient = axios.create({
  baseURL,
  paramsSerializer: {
    serialize: params => {
      const searchParams = new URLSearchParams()
      Object.keys(params).forEach(key => {
        searchParams.append(key, params[key])
      })
      return searchParams.toString()
    }
  }
})

publicClient.interceptors.request.use(async (config) => {
  return {
    ...config,
    headers: {
      'Content-Type': 'application/json'
    }
  }
})

publicClient.interceptors.response.use(async (response) => {
  if (response?.data) return response.data
  return response
}, (error) => {
  const message = error?.response?.data?.message
  if (message) throw message || 'Something went wrong. Please try again.'
  throw error
})

export default publicClient