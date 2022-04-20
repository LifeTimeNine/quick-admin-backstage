<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script>
import * as Langauge from 'element-plus/lib/locale/index'
import { getLanguage } from './lang'
export default {
  name: 'App',
  data() {
    return {
      locale: Langauge.zhCn
    }
  },
  watch: {
    '$i18n.locale': {
      immediate: true,
      handler: function(value) {
        this.locale = Langauge[getLanguage().element_plus]
      }
    }
  },
  created() {
    this.$store.dispatch('settings/serverGet').then(() => {
      document.title = this.$store.getters.settings.system_name
    })
  }
}
</script>

<style>

</style>
