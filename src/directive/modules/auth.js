import auth from '@/utils/auth'

export default {
  mounted(el, binding) {
    const { value } = binding
    if (!auth(value) && el.parentNode) {
      el.parentNode.removeChild(el)
    }
  }
}
