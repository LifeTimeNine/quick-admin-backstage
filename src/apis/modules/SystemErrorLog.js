import { get, post } from '@/utils/request'

export const nodes = {
  list: 'systemerrorlog/list',
  resolve: 'systemerrorlog/resolve'
}

export const list = query => get(nodes.list, query)
export const resolve = data => post(nodes.resolve, data)
