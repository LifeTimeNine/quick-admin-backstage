import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { whitePaths, commonPaths } from './setting'

function isWhitePath(path) {
  return whitePaths.indexOf(path) !== -1
}

function isCommonPath(path) {
  return commonPaths.indexOf(path) !== -1
}

NProgress.configure({ showSpinner: false })

router.beforeEach(async(to, from, next) => {
  // NProgress.start()
})

router.afterEach(() => {
  // NProgress.done()
})


