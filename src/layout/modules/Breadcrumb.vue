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
import { whitePaths } from '@/settings'

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
      this.getBreadcrumb()
    }
  },
  created() {
    if (this.$route.path !== '/dashboard') {
      this.$store.commit('app/MENU_ACTIVE', this.getMenuIndex(this.$route.path, this.menus))
    }
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      const isWhitePath = whitePaths.indexOf(this.$route.path) !== -1
      if (isWhitePath) return
      if (this.menuActive === '-1') {
        this.levelList = ['dashboard']
      } else {
        this.levelList = []
        if (this.menuActive === '') return
        let tmpMenus = this.menus
        const indexList = this.menuActive.split('-')
        while (indexList.length > 0) {
          const index = indexList.shift()
          this.levelList.push(tmpMenus[index].title)
          tmpMenus = tmpMenus[index].children
        }
      }
    },
    getMenuIndex(path, menus, indexs = []) {
      const length = menus.length
      for (let i = 0; i < length; ++i) {
        if (menus[i].url === '#' && menus[i].children.length > 0) {
          const res = this.getMenuIndex(path, menus[i].children, indexs.concat([i]))
          if (res !== '') {
            return res
          }
        } else {
          if (menus[i].url === path) {
            return indexs.concat([i]).join('-')
          }
        }
      }
      return ''
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
