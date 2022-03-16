import { CaretBottom } from "@element-plus/icons-vue/dist/index"

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

export default {
  install: Vue => {
    Vue.component(CaretBottom.name, CaretBottom)
  }
}