import { get, post } from '@/utils/request'

export const nodes = {
  pwdLogin: 'systemuser/pwdLogin',
  logout: 'systemuser/logout',
  userInfo: 'systemuser/userInfo',
  getMenu: 'systemuser/getMenu',
  editUserInfo: 'systemuser/editUserInfo',
  modifyPwd: 'systemuser/modifyPwd',
  refresh: 'systemuser/refresh',
  list: 'systemuser/list',
  recycleList: 'systemuser/recycleList',
  add: 'systemuser/add',
  edit: 'systemuser/edit',
  modifyStatus: 'systemuser/modifyStatus',
  softDelete: 'systemuser/softDelete',
  restore: 'systemuser/restore',
  del: 'systemuser/delete',
  resetPwd: 'systemuser/resetPwd'
}

export const pwdLogin = data => post(nodes.pwdLogin, data)
export const logout = () => get(nodes.logout)
export const userInfo = () => get(nodes.userInfo)
export const getMenu = () => get(nodes.getMenu)
export const editUserInfo = data => post(nodes.editUserInfo, data)
export const modifyPwd = data => post(nodes.modifyPwd, data)
export const refresh = () => get(nodes.refresh)
export const list = query => get(nodes.list, query)
export const recycleList = query => get(nodes.recycleList, query)
export const add = data => post(nodes.add, data)
export const edit = data => post(nodes.edit, data)
export const modifyStatus = data => post(nodes.modifyStatus, data)
export const softDelete = data => post(nodes.softDelete, data)
export const restore = data => post(nodes.restore, data)
export const del = data => post(nodes.del, data)
export const resetPwd = data => post(nodes.resetPwd, data)
