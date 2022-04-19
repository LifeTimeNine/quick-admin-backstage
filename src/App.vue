<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script>
import { zhCn, en } from 'element-plus/lib/locale/index'
export default {
  name: 'App',
  data() {
    return {
      locale: zhCn
    }
  },
  watch: {
    '$i18n.locale': {
      immediate: true,
      handler: function(value) {
        switch (value) {
          case 'zh':
            this.locale = zhCn
            break
          case 'en':
            this.locale = en
            break
          default:
        }
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
