import axios from "axios";
import { appName } from '@/setting'

const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API + '/' + appName + '/',
  timeout: 5000
})

request.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  response => {
    const res = response.data
    
    return res
  },
  error => {
    return Promise.reject(error)
  }
)

export default {
  $get(url, config = {}) {
    return request.get(url, config)
  },
  $post(url, data = {}, config = {}) {
    return request.post(url, data, config);
  }
}