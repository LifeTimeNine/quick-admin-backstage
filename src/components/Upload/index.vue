<template>
  <el-upload
    ref="el-upload"
    action=""
    :auto-upload="false"
    :show-file-list="false"
    :on-change="fileChange"
    :disabled="disabled"
    :accept="accept"
  >
    <slot :url="modelValue">
      <el-button :size="buttonSize" :disabled="disabled">
        <svg-icon v-if="status === 1" :icon-class="icon" />
        <svg-icon v-else-if="status === 5" :icon-class="icon" style="color: #67C23A" />
        <svg-icon v-else-if="status === 6" :icon-class="icon" style="color: #F56C6C" />
        <svg-icon v-else :icon-class="icon" />
        <span style="margin-left: 2px">{{ btn_txt }}</span>
      </el-button>
    </slot>
  </el-upload>
</template>

<script>
import Upload from '@/utils/upload'
export default {
  name: 'Upload',
  props: {
    modelValue: {
      type: String,
    },
    part: {
      type: Boolean,
      default: false
    },
    buttonSize: {
      type: String,
      default: 'default'
    },
    accept: {
      type: String,
      default: '*'
    }
  },
  emits: ['update:modelValue','on-status','on-progress','on-success','on-fail'],
  data() {
    return {
      btn_txt: '选择文件',
      status: 1,
      icon: 'upload',
      disabled: false
    }
  },
  watch: {
    status: function(value) {
      this.$emit('on-status', value)
      if (value === 1) {
        this.icon = ''
        this.disabled = false
      } else if (value === 5) {
        this.icon = 'check'
        this.disabled = false
      } else if (value === 6) {
        this.icon = 'close'
        this.disabled = false
      } else {
        this.icon = 'loading'
        this.disabled = true
      }
    }
  },
  methods: {
    fileChange({ raw }) {
      this.status = 1
      this.$emit('on-status', 1)
      const upload = new Upload()
      upload.onMd5Before(() => {
        this.btn_txt = `MD5: 0%`
        this.status = 2
      }).onMd5Progress((loaded, total) => {
        const progress = Math.round(loaded / total * 10000) / 100
        this.btn_txt = `MD5: ${progress}%`
        this.$emit('on-progress', 1, progress)
      }).onMd5After(() => {
      }).onBefore(() => {
        this.btn_txt = `上传: 0%`
        this.status = 3
      }).onProgress((loaded, total) => {
        const progress = Math.round(loaded / total * 10000) / 100
        this.btn_txt = `上传: ${progress}%`
        this.$emit('on-progress', 2, progress)
      }).onAfter(() => {
        this.btn_txt = '合并中'
        this.status = 4
      })
      const saveFunc = this.part ? upload.partSave : upload.save
      saveFunc(raw).then(url => {
        this.btn_txt = '重新选择'
        this.status = 5
        this.$emit('update:modelValue', url)
        this.$emit('on-success', url)
      }).catch(() => {
        this.btn_txt = '重新选择'
        this.status = 6
        this.$emit('on-fail')
      })
    },
    clear() {
      this.$refs['el-upload'].clearFiles()
      this.status = 1
      this.icon = 'el-icon-upload'
      this.$emit('update:modelValue', '')
    }
  }
}
</script>
