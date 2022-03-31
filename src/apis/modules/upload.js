import { post } from '@/utils/request'

export const nodes = {
  info: 'upload/info',
  partInfo: 'upload/partInfo',
  partOptions: 'upload/partOptions',
  partComplete: 'upload/partComplete'
}

export const info = data => post(nodes.info, data)
export const partInfo = data => post(nodes.partInfo, data)
export const partOptions = data => post(nodes.partOptions, data)
export const partComplete = data => post(nodes.partComplete, data)
