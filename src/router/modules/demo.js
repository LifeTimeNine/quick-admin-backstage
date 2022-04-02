export default {
  path: '/demo',
  component: () => import('@/layout'),
  children: [
    {
      path: 'tinymce',
      name: 'DomeTinymce',
      component: () => import('@/views/demo/Tinymce')
    },
    {
      path: 'datalist',
      name: 'DataList',
      component: () => import('@/views/demo/DataList')
    },
    {
      path: 'formDialog',
      name: 'FormDialog',
      component: () => import('@/views/demo/FormDialog')
    },
    {
      path: 'upload',
      name: 'Upload',
      component: () => import('@/views/demo/Upload')
    },
    {
      path: 'xlsx',
      name: 'XlsxDemo',
      component: () => import('@/views/demo/Xlsx')
    }
  ]
}
