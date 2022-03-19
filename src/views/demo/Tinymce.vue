<template>
  <div>
    <!--
      参数
      v-model   内容
      height    编辑器高度
      width     编辑器宽度
     -->
    <tinymce v-model="content" height="300px" />
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
export default {
  name: 'DemoTinymce',
  components: { Tinymce },
  data() {
    return {
      content: '123123'
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
