<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
        :default-active="menuActive"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
        @select="menuSelect"
      >
        <app-link to="/dashboard">
          <el-menu-item index="-1">
            <menu-item icon="dashboard" title="仪表盘" />
          </el-menu-item>
        </app-link>
      </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import AppLink from './AppLink.vue'
import MenuItem from './MenuItem.vue'
import variables from '@/styles/variables.scss'

export default {
  name: 'SideBar',
  components: { AppLink, MenuItem },
  computed: {
    ...mapGetters([
      'sidebarOpened',
      'menus',
      'menuActive'
    ]),
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebarOpened
    }
  },
  methods: {
    menuSelect(e) {
      this.$store.dispatch('app/menuActive', e)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
