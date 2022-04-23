import { createApp } from 'vue'
import ElementPlus, { ElLoading, ElMessage } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import VueClipboard from 'vue-clipboard2'
import 'element-plus/dist/index.css'

import App from './App.vue'
import store from './store'
import router from './router'
import components from './components'
import { get, post } from './utils/request'
import icons from './icons'
import nodes from './apis/nodes'
import directive from './directive'
import lang from './lang'

import '@/styles/index.scss'
import './permission'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(components)
app.use(ElementPlus, {
  locale: zhCn
})
app.use(VueClipboard)
app.use(icons)
app.use(lang)
app.use(directive)

// 全局请求方法
app.config.globalProperties.$get = get
app.config.globalProperties.$post = post

// 全局节点
app.config.globalProperties.$nodes = nodes
// 全局快捷操作
app.config.globalProperties.$action = (node, data = {}, callback = null) => {
  if (!node) return
  const loading = ElLoading.service()
  post(node, data).then(() => {
    ElMessage.success(app.config.globalProperties.$t('action_success'))
    if (typeof callback === 'function') callback()
  }).finally(() => {
    loading.close()
  })
}

app.mount('#app')
