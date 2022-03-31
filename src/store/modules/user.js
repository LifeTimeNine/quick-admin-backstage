import { getMenu, logout, pwdLogin, userInfo } from '@/apis/modules/systemUser'
import { getToken, removeToken, setToken } from '@/utils/token'

const defaultState = () => {
  return {
    token: getToken(),
    menus: [],
    nodes: [],
    menuPaths: [],
    userInfo: {}
  }
}

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, defaultState())
  },
  SET_TOKEN: (state, token) => {
    setToken(token)
    state.token = token
  },
  REMOVE_TOKEN: (state) => {
    removeToken()
    state.token = null
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus
  },
  SET_NODES: (state, nodes) => {
    state.nodes = nodes
  },
  SET_MENU_PATHS: (state, menuPaths) => {
    state.menuPaths = menuPaths
  }
}

const actions = {
  setToken({ commit }, token) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', token)
      resolve()
    })
  },
  removeToken({ commit }) {
    return new Promise((resolve) => {
      commit('REMOVE_TOKEN', null)
      resolve()
    })
  },
  login({ commit }, data) {
    return new Promise((resolve, reject) => {
      pwdLogin(data).then((data) => {
        commit('SET_TOKEN', data.map.access_token)
        resolve(data)
      }).catch(e => {
        reject(e)
      })
    })
  },
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        removeToken()
        commit('RESET_STATE')
        resolve()
      }).catch(e => {
        reject(e)
      })
    })
  },
  getUserInfo({ commit }) {
    return new Promise((resolve, reject) => {
      userInfo().then((data) => {
        const map = data.map
        commit('SET_USER_INFO', {
          username: map.username,
          avatar: map.avatar,
          name: map.name,
          mobile: map.mobile,
          email: map.email
        })
        resolve(data)
      }).catch(e => {
        reject(e)
      })
    })
  },
  getMenu({ commit }) {
    return new Promise((resolve, reject) => {
      getMenu().then(data => {
        const { menus, nodes } = data.map
        commit('SET_MENUS', menus)
        commit('SET_NODES', nodes)
        const getMenuPaths = (menus) => {
          var whitePaths = []
          menus.forEach(item => {
            if (item.url === '#' && item.children.length > 0) {
              whitePaths = whitePaths.concat(getMenuPaths(item.children))
            } else {
              whitePaths.push(item.url)
            }
          })
          return whitePaths
        }
        commit('SET_MENU_PATHS', getMenuPaths(menus))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state: defaultState(),
  mutations,
  actions
}
