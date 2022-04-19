import Storage from '@/utils/storage'
import { createI18n } from 'vue-i18n'

const language = {
  zh: 'zh-CN',
  en: 'en-US'
}

export const langs = require.context('./packages', false, /\.js$/).keys().map(item => {
  const regRes = item.match(/\/(.*)(?=\.js)/)
  if (regRes) return regRes[1]
})

const packages = {}

langs.forEach(item => {
  packages[item] = require(`./packages/${item}`).default
})

const I18n = createI18n({
  fallbackLocale: 'zh',
  globalInjection: true,
  legacy: false,
  locale: Storage.get('system_language') || 'zh',
  messages: packages
})

export const Lang = I18n.global

export function getLanguage() {
  return language[Lang.locale.value] || 'zh-CN'
}

export default I18n
