<template>
  <div id="app">
    {{ html }}
  </div>
</template>

<script>

export default {
  name: 'app',
  data() {
    return {
      html: ''
    }
  },
  created() {
    this.$get('systemconfig/basic').then(response => {
      console.log(response)
    })
  }
}
</script>

<style>

</style>
