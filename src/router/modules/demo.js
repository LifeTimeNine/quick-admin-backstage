export default {
  path: '/demo',
  component: () => import('@/layout'),
  children: [
    {
      path: 'tinymce',
      name: 'DomeTinymce',
      component: () => import('@/views/demo/Tinymce')
    }
  ]
}