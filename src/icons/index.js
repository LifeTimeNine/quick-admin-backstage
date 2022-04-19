import * as ElIcons from '@element-plus/icons-vue/dist/index'

const req = require.context('./svg', false, /\.svg$/)

// 导出 SVG 图表列表
export const svgIcons = req.keys().map(item => {
  const regRes = item.match(/\w+(?=\.svg)/)
  if (regRes) return regRes[0]
})
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

// 导出 Element-Icon 的图标名称
export const elIcons = Object.keys(ElIcons).map(item => {
  return item.toLocaleLowerCase()
})

export default {
  install: Vue => {
    Object.keys(ElIcons).forEach(key => {
      // 重命名,防止和已有组件冲突
      Vue.component(`ElIcon${ElIcons[key].name}`, ElIcons[key])
    })
  }
}
