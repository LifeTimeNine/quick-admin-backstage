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
      disabled  是否禁用上传
      limit  允许上传文件的最大数量
      on-status 状态改变事件 (status, index) 1-未开始 2-开始计算MD5 3-MD5计算完成 4-开始上传 5-正在合并 6-上传成功 7-上传失败 index:列表索引
      on-progress 上传进度事件 (progress, index) progress：进度百分比 index:列表索引
      on-success  上传成功事件 (url, index, file) url:图片地址 file:File对象 index:列表索引
      on-faill  上传失败事件 (index, e) e:Error对象 index:列表索引
     -->
    <upload
      ref="upload"
      v-model="url"
      :part="false"
      type="button"
      :multiple="true"
      :limit="3"
      :image-width="80"
      :image-height="80"
      @on-status="onStatus"
      @on-progress="onProgress"
      @on-success="onSuccess"
      @on-fail="onFail"
    />
  </div>
</template>

<script>
export default {
  name: 'DemoUpload',
  data() {
    return {
      url: []
    }
  },
  mounted() {
    setTimeout(() => {
      this.url = ['http://dev.quick-admin.com/storage/b5/cfc1209181f9bac0f80b4e9de8160f.gif', 'http://dev.quick-admin.com/storage/4b/3cc2c5bd9ce418482907be38443e74.jpg']
    }, 1000)
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
