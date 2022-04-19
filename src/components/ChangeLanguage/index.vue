<template>
  <div class="change-language">
    <el-dropdown trigger="click" @command="onLangChange">
      <slot />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="item in langs" :key="item" :command="item">{{ $t('lang', '', { locale: item }) }}</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: 'ChangeLanguage'
}
</script>

<script setup>
import { langs } from '@/lang'
import { getCurrentInstance } from 'vue-demi'
import Storage from '@/utils/storage'

const { proxy } = getCurrentInstance()

function onLangChange(command) {
  proxy.$root.$i18n.locale = command
  Storage.set('system_language', command)
}
</script>

<style lang="scss" scoped>
.change-language {
  display: inline-block;
}
</style>
