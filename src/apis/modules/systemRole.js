import { get, post } from '@/utils/request'

export const nodes = {
  getUserRole: 'systemrole/getUserRole',
  getUserNodeTree: 'systemrole/getUserNodeTree',
  list: 'systemrole/list',
  recycleList: 'systemrole/recycleList',
  add: 'systemrole/add',
  edit: 'systemrole/edit',
  modifyStatus: 'systemrole/modifyStatus',
  softDelete: 'systemrole/softDelete',
  restore: 'systemrole/restore',
  del: 'systemrole/delete',
  getRoleNodes: 'systemrole/getRoleNodes',
  modifyRoleNodes: 'systemrole/modifyRoleNodes'
}

export const getUserRole = () => get(nodes.getUserRole)
export const getUserNodeTree = () => get(nodes.getUserNodeTree)
export const list = query => get(nodes.list, query)
export const recycleList = query => get(nodes.recycleList, query)
export const add = data => post(nodes.add, data)
export const edit = data => post(nodes.edit, data)
export const modifyStatus = data => post(nodes.modifyStatus, data)
export const softDelete = data => post(nodes.softDelete, data)
export const restore = data => post(nodes.restore, data)
export const del = data => post(nodes.del, data)
export const getRoleNodes = query => get(nodes.getRoleNodes, query)
export const modifyRoleNodes = data => post(nodes.modifyRoleNodes, data)
