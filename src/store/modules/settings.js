import { basic } from '@/apis/modules/systemConfig'
import defaultSettings from '@/settings'

const { system_name, fixedHeader, sidebarLogo } = defaultSettings

const state = {
  system_name,
  fixedHeader,
  sidebarLogo
}

const mutations = {
  SET_SETTING: (state, { key, value }) => {
    state[key] = value
  },
  MERGE_SETTING: (state, data) => {
    Object.assign(state, data)
  }
}

const actions = {
  setSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
  mergeSetting({ commit }, data) {
    commit('MERGE_SETTING', data)
  },
  serverGet({ commit }) {
    return new Promise((resolve, reject) => {
      basic().then(({ map }) => {
        commit('MERGE_SETTING', map)
        resolve({ map })
      }).catch(e => {
        reject(e)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

