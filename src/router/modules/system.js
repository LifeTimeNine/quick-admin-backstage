import LayOut from '@/layout'

export default {
  path: 'system',
  component: LayOut,
  children: [
    {
      path: 'user',
      name: 'SystemUser',
      component: () => import('@/views/system/User')
    }
  ]
}