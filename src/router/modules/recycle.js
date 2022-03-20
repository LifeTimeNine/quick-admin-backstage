export default {
  path: '/recycle',
  component: () => import('@/layout'),
  children: [
    {
      path: 'systemUser',
      name: 'RecycleSystemUser',
      component: () => import('@/views/recycle/system/User')
    },
    {
      path: 'systemMenu',
      name: 'RecycleSystemMenu',
      component: () => import('@/views/recycle/system/Menu')
    },
    {
      path: 'systemRole',
      name: 'RecycleSystemRole',
      component: () => import('@/views/recycle/system/Role')
    }
  ]
}