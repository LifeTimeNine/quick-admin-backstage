<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎你: {{ userInfo.name }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DashBoard',
  computed: {
    ...mapGetters(['userInfo'])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
