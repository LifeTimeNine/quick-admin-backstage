
export default {
  path: '/system',
  component: () => import('@/layout'),
  children: [
    {
      path: 'user',
      name: 'SystemUser',
      component: () => import('@/views/system/User')
    },
    {
      path: 'menu',
      name: 'SystemMenu',
      component: () => import('@/views/system/Menu')
    },
    {
      path: 'role',
      name: 'SystemRole',
      component: () => import('@/views/system/Role')
    },
    {
      path: 'actionlog',
      name: 'SystemActionLog',
      component: () => import('@/views/system/ActionLog')
    },
    {
      path: 'errorlog',
      name: 'SystemErrorLog',
      component: () => import('@/views/system/ErrorLog')
    },
    {
      path: 'config',
      name: 'SystemConfig',
      component: () => import('@/views/system/Config')
    },
    {
      path: 'task',
      name: 'SystemTask',
      component: () => import('@/views/system/Task')
    }
  ]
}