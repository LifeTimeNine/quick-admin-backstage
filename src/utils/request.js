import axios from "axios";
import { ElMessage } from 'element-plus' 
import { appName } from '@/setting'
import { removeTokenData } from "./token";
import router from "@/router";
import store from "@/store";

const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API + '/' + appName + '/',
  timeout: 5000
})

// 参数异常
const param_error = 10001
// 操作失败
// const action_error = 10002
// 数据不存在
// const data_not_exist = 10003
// Token 异常
const token_error = 10101
// Token 过期
const token_expire = 10102
// token 刷新失败
// const token_refresh_fail = 10103
// token 失效
const token_failure = 10104
// 用户被禁用
// const user_disable = 10201
// 用户被登录
const user_login = 10202
// 权限不足
const permission_denied = 10203

request.interceptors.request.use(
  config => {
    config.headers['Access-token'] = store.getters.accessToken
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code != 0) {
      if ([param_error, permission_denied].indexOf(res.code) !== -1) {
        ElMessage.warning(res.message)
      } else if ([token_error, token_expire, token_failure, user_login].indexOf(res.code) !== -1) {
        ElMessage.error({
          message: res.message,
          onClose() {
            removeTokenData()
            router.replace({ name: 'Login' })
            window.location.reload()
          }
        })
      } else {
        ElMessage.error(res.message)
      }
      return Promise.reject()
    } else {
      return res.data
    }
  },
  error => {
    return Promise.reject(error)
  }
)

export function $get(url, config = {}) {
  return request.get(url, config)
}

export function $post(url, data = {}, config = {}) {
  return request.post(url, data, config)
}

export default {
  $get,
  $post
}
