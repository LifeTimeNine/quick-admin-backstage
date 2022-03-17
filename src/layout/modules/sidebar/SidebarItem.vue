<template>
  <div>
    <template v-if="item.children.length == 0">
      <app-link :to="item.params ? (item.url + '?' + item.params) : item.url">
        <el-menu-item :index="index" :class="{'submenu-title-noDropdown':!isNest}">
          <svg-icon :icon-class="item.icon"/>
          <span v-if="item.title">{{item.title}}</span>
        </el-menu-item>
      </app-link>
    </template>

    <el-sub-menu v-else ref="subMenu" :index="index" popper-append-to-body>
      <template #title>
        <svg-icon :icon-class="item.icon"/>
        <span v-if="item.title">{{item.title}}</span>
      </template>
      <sidebar-item
        v-for="(child, childIndex) in item.children"
        :key="child.url"
        :is-nest="true"
        :item="child"
        :index="index + '-' + childIndex"
        class="nest-menu"
      />
    </el-sub-menu>
  </div>
</template>

<script>
import AppLink from './AppLink'

export default {
  name: 'SidebarItem',
  components: { AppLink },
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    index: {
      type: String,
      default: ''
    }
  }
}
</script>
