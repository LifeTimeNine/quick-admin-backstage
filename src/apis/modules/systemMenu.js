import { get, post } from '@/utils/request'

export const nodes = {
  list: 'systemmenu/list',
  recycleList: 'systemmenu/recycleList',
  add: 'systemmenu/add',
  edit: 'systemmenu/edit',
  modifyStatus: 'systemmenu/modifyStatus',
  softDelete: 'systemmenu/softDelete',
  restore: 'systemmenu/restore',
  del: 'systemmenu/delete',
  setSort: 'systemmenu/setSort',
  getUserMenuNodes: 'systemmenu/getUserMenuNodes'
}

export const list = query => get(nodes.list, query)
export const recycleList = query => get(nodes.recycleList, query)
export const add = data => post(nodes.add, data)
export const edit = data => post(nodes.edit, data)
export const modifyStatus = data => post(nodes.modifyStatus, data)
export const softDelete = data => post(nodes.softDelete, data)
export const restore = data => post(nodes.restore, data)
export const del = data => post(nodes.del, data)
export const setSort = data => post(nodes.setSort, data)
export const getUserMenuNodes = () => get(nodes.getUserMenuNodes)
