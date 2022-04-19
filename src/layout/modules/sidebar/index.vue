<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
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
            <svg-icon icon-class="dashboard" />
            <span>{{ $t('menu.dashboard') }}</span>
          </el-menu-item>
        </app-link>
        <sidebar-item v-for="(menu, index) in menus" :key="index + ''" :item="menu" :index="index + ''" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import AppLink from './AppLink'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  name: 'SideBar',
  components: { SidebarItem, Logo, AppLink },
  computed: {
    ...mapGetters([
      'sidebar',
      'menus',
      'menuActive'
    ]),
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    menuSelect(e) {
      this.$store.commit('app/MENU_ACTIVE', e)
    }
  }
}
</script>
