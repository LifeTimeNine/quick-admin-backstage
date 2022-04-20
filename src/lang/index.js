import Storage from '@/utils/storage'
import { createI18n } from 'vue-i18n'

const Language = {
  zh: {
    request: 'zh-CN',
    element_plus: 'zhCn',
    tinymce: 'zh_CN'
  },
  en: {
    request: 'en-US',
    element_plus: 'en',
    tinymce: 'en_US'
  }
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
  return Language[Lang.locale.value] || Language.zh
}

export default I18n
