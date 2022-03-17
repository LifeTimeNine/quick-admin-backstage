import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import store from './store'
import router from './router'
import components from './components'
import request from './utils/request'
import icons from './icons'
import nodes from './nodes'

import '@/styles/index.scss'
import './permission'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(components)
app.use(ElementPlus)
app.use(icons)

// 全局请求方法
Object.keys(request).forEach(key => {
  app.config.globalProperties[key] = request[key]
});

// 全局节点
app.config.globalProperties.$nodes = nodes

app.mount('#app')
