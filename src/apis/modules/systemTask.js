import { get, post } from '@/utils/request'

export const nodes = {
  status: 'systemtask/status',
  list: 'systemtask/list',
  add: 'systemtask/add',
  edit: 'systemtask/edit',
  modifyStatus: 'systemtask/modifyStatus',
  del: 'systemtask/delete',
  logList: 'systemtask/logList',
  exec: 'systemtask/exec'
}

export const status = () => get(nodes.status)
export const list = query => get(nodes.list, query)
export const add = data => post(nodes.add, data)
export const edit = data => post(nodes.edit, data)
export const modifyStatus = data => post(nodes.modifyStatus, data)
export const del = data => post(nodes.del, data)
export const logList = query => get(nodes.logList, query)
export const exec = data => post(nodes.exec, data)
