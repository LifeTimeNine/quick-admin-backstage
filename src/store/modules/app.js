// 应用相关

import nodes from "@/nodes"
import { $get } from "@/utils/request"
import Storage from "@/utils/storage"

const defaultState = () => {
  return {
    sidebarOpened: Storage.get('sidebarOpened'),
    menuActive: '-1',
    config: {
      system_name: 'QuickAdmin'
    }
  }
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebarOpened = !state.sidebarOpened
    Storage.set('sidebarOpened', state.sidebarOpened)
  },
  MENU_ACTIVE: (state, active) => {
    state.menuActive = active
  },
  CONFIG: (state, config) => {
    state.config = config
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  menuActive({ commit }, active) {
    commit('MENU_ACTIVE', active)
  },
  config({ commit }) {
    return new Promise((resolve, reject) => {
      $get(nodes.systemConfig.basic).then(data => {
        commit('CONFIG', data.map)
        resolve(data.map)
      }).catch(e => {
        reject(e)
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