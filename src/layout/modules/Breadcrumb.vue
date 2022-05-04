<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="item in levelList" :key="item">
        <span class="no-redirect">{{ $t(`menu.${item}`) }}</span>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'BreadCrumb',
  data() {
    return {
      levelList: null
    }
  },
  computed: {
    ...mapGetters([
      'menuActive',
      'menus'
    ])
  },
  watch: {
    $route() {
      this.levelList = this.getBreadcrumb(this.menus)
    }
  },
  created() {
    if (this.$route.path !== '/dashboard') {
      this.$store.commit('app/MENU_ACTIVE', this.getMenuIndex(this.$route.path, this.menus))
    }
    this.levelList = this.getBreadcrumb(this.menus)
  },
  methods: {
    getBreadcrumb(menus, levelList = []) {
      for (const menu of menus) {
        if (menu.url === '#' && menu.children.length > 0) {
          const res = this.getBreadcrumb(menu.children)
          if (res.length > 0) {
            res.unshift(menu.title)
            return res
          }
        } else {
          if (menu.id === parseInt(this.menuActive)) {
            levelList.unshift(menu.title)
            return levelList
          }
        }
      }
      return []
    },
    getMenuIndex(path, menus) {
      for (const menu of menus) {
        if (menu.url === '#' && menu.children.length > 0) {
          const res = this.getMenuIndex(path, menu.children)
          if (res !== null) return res
        } else {
          if (menu.url === path) {
            return menu.id + ''
          }
        }
      }
      return null
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
