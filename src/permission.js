import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { whitePaths, commonPaths } from './settings'
import store from './store'
import { removeTokenData } from './utils/token'
import { ElMessage } from 'element-plus'

function isWhitePath(path) {
  return whitePaths.indexOf(path) !== -1
}

function authPaths(path) {
  if (commonPaths.indexOf(path) !== -1) return true
  if (store.getters.userInfo.indexOf(path) !== -1) return true
  return false
}

NProgress.configure({ showSpinner: false })

router.beforeEach(async(to, from, next) => {
  NProgress.start()

  const accessToken = store.getters.accessToken
  if (accessToken) {
    if (to.path === '/login') {
      next('/')
      NProgress.done()
    } else {
      const username = store.getters.userInfo.username
      if (!username) {
        try {
          await store.dispatch('user/getUserInfo')
          await store.dispatch('user/getMenu')
        } catch (error) {
          removeTokenData()
          ElMessage.error({
            message: error || 'Error',
            onClose() {
              next(`/login?redirect=${to.path}`)
              window.location.reload()
              return
            }
          })
        }
      }
      if (authPaths(to.path)) {
        next()
      } else {
        next('/404')
      }
    }
  } else {
    if (isWhitePath(to.path)) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})


