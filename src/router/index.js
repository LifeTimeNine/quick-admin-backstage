import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
