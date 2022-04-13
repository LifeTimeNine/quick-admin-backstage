import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout'
import demo from './modules/demo'
import recycle from './modules/recycle'
import system from './modules/system'

const routes = [
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login')
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard')
      }
    ]
  },
  demo,
  recycle,
  system,
  {
    path: '/*',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
