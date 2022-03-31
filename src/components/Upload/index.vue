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
      <el-button v-if="type === 'button'" :size="buttonSize" :disabled="disabled">
        <svg-icon v-if="status === 1" :icon-class="btnIcon" />
        <svg-icon v-else-if="status === 6" :icon-class="btnIcon" style="color: #67C23A" />
        <svg-icon v-else-if="status === 7" :icon-class="btnIcon" style="color: #F56C6C" />
        <svg-icon v-else :icon-class="btnIcon" />
        <span v-if="status === 1 || status === 6 || status === 7" style="margin-left: 2px">{{ action }}</span>
        <span v-else style="margin-left: 2px">{{ action }}：{{ progress }}%</span>
      </el-button>
      <el-image v-if="type === 'image'" :src="modelValue" fit="fill" :lazy="true" :style="{ width: imageWidth, height: imageHeight }" :class="{ 'hide-border': status !== 1 }">
        <template #error>
          <svg-icon v-show="status === 1" icon-class="plus" />
        </template>
      </el-image>
      <el-progress v-if="type === 'image' && ![1, 5, 6].includes(status)" type="circle" :percentage="progress">
        <template #default>
          <div>{{ action }}</div>
          <div>{{ progress }}%</div>
        </template>
      </el-progress>
    </slot>
  </el-upload>
</template>

<script>
import Upload from '@/utils/upload'
import { percentage } from '@/utils'
export default {
  name: 'Upload',
  props: {
    modelValue: String,
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
    },
    type: {
      type: String,
      default: 'button',
      validator(value) {
        return ['button', 'image'].includes(value)
      }
    },
    imageHeight: {
      type: String,
      default: '120px'
    },
    imageWidth: {
      type: String,
      default: '120px'
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'on-status', 'on-progress', 'on-success', 'on-fail'],
  data() {
    return {
      list: [],
      progress: 0,
      action: '选择文件',
      status: 1,
      btnIcon: 'upload',
      disabled: false
    }
  },
  watch: {
    status: function(value) {
      this.$emit('on-status', value)
      switch (value) {
        case 1:
          this.btnIcon = 'upload'
          this.disabled = false
          this.action = '选择文件'
          break
        case 2:
        case 3:
          this.btnIcon = 'loading'
          this.disabled = true
          this.action = 'MD5'
          break
        case 4:
        case 5:
          this.btnIcon = 'loading'
          this.disabled = true
          this.action = '上传'
          break
        case 6:
          this.btnIcon = 'check'
          this.action = '重新选择'
          this.disabled = false
          break
        case 7:
          this.btnIcon = 'warning'
          this.action = '重新选择'
          this.disabled = false
          break
      }
    }
  },
  methods: {
    fileChange({ raw }) {
      this.status = 1
      this.$emit('on-status', 1)
      const upload = new Upload()
      upload.onMd5Before(() => {
        this.progress = 0
        this.status = 2
      }).onMd5Progress((loaded, total) => {
        this.progress = percentage(loaded, total, false)
        this.$emit('on-progress', 1, this.progress)
      }).onMd5After(() => {
        this.progress = 100
        this.status = 3
      }).onBefore(() => {
        this.progress = 0
        this.status = 4
      }).onProgress((loaded, total) => {
        this.progress = percentage(loaded, total, false)
        this.$emit('on-progress', 2, this.progress)
      }).onAfter(() => {
        this.progress = 100
        this.status = 5
      })
      const saveFunc = this.part ? upload.partSave : upload.save
      saveFunc(raw).then(url => {
        this.status = 6
        this.$emit('update:modelValue', url)
        this.$emit('on-success', url)
      }).catch(() => {
        this.status = 7
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

<style lang="scss">
  .el-image {
    border: 1px dashed #d9d9d9;
    &.hide-border {
      border-width: 0;
    }
    &:hover {
      border-color: var(--el-color-primary);;
    }
    .svg-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .el-progress {
    position: absolute;
  }
</style>
