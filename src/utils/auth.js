import store from '@/store/index'

const auth = node => {
  const nodes = store.getters.nodes
  return !!~nodes.indexOf(node)
}

export default auth
