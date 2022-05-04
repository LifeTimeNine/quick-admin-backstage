<template>
  <div>
    <template v-if="item.children.length == 0">
      <app-link :to="item.params ? (item.url + '?' + item.params) : item.url">
        <el-menu-item :index="item.id + ''" :class="{'submenu-title-noDropdown':!isNest}">
          <svg-icon :icon-class="item.icon || ''" />
          <span v-if="item.title">{{ $t(`menu.${item.title}`, item.title) }}</span>
        </el-menu-item>
      </app-link>
    </template>

    <el-sub-menu v-else ref="subMenu" :index="item.id + ''" popper-append-to-body>
      <template #title>
        <svg-icon :icon-class="item.icon || ''" />
        <span v-if="item.title">{{ $t(`menu.${item.title}`, item.title) }}</span>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.id"
        :is-nest="true"
        :item="child"
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
    }
  }
}
</script>
