import { get, post } from '@/utils/request'

export const nodes = {
  basic: 'systemconfig/basic',
  list: 'systemconfig/list',
  add: 'systemconfig/add',
  edit: 'systemconfig/edit',
  del: 'systemconfig/delete'
}

export const basic = () => get(nodes.basic)
export const list = query => get(nodes.list, query)
export const add = data => post(nodes.add, data)
export const edit = data => post(nodes.edit, data)
export const del = data => post(nodes.del, data)
