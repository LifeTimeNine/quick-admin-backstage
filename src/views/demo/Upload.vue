<template>
  <div>
    <!--
      上传文件组件
      v-model 绑定url值
      part    是否是切片上传
      accept  接受上传的文件类型
      type    展示类型 button-按钮，image-图片
      image-width   图片宽
      image-height  图片高
      multiple  是否支持多选文件
      on-status 状态改变事件 (status) 1-未开始 2-开始计算MD5 3-MD5计算完成 4-开始上传 5-正在合并 6-上传成功 7-上传失败
      on-progress 上传进度事件 (type, progress) type:类型 1-MD5计算进度 2-上传进度；progress：进度百分比
      on-success  上传成功事件 (success)
      on-faill  上传失败事件
     -->
    <upload
      ref="upload"
      v-model="url"
      :part="true"
      type="image"
      :multiple="true"
      @on-status="onStatus"
      @on-progress="onProgress"
      @on-success="onSuccess"
      @on-fail="onFail"
    />
    <el-button size="default" @click="clear">清除</el-button>
  </div>
</template>

<script>
export default {
  name: 'DemoUpload',
  data() {
    return {
      url: ''
    }
  },
  methods: {
    onStatus(status) {
      console.log('status=>', status)
    },
    onProgress(type, progress) {
      console.log('progress', type, progress)
    },
    onSuccess(url) {
      console.log('success', url)
    },
    onFail() {
      console.log('fail')
    },
    clear() {
      this.$refs['upload'].clear()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
