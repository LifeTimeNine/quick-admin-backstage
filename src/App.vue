<template>
  <router-view />
</template>

<script>
export default {
  name: 'App',
  created() {
    this.$store.dispatch('settings/serverGet').then(() => {
      document.title = this.$store.getters.settings.system_name
    })
  }
}
</script>

<style>

</style>
