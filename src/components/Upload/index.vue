<template>
  <div>
    <el-upload
      v-if="type === 'button'"
      action=""
      :auto-upload="false"
      :show-file-list="false"
      :on-change="fileChange"
      :disabled="disabled"
      :accept="accept"
    >
      <el-button type="primary">{{ $t('select_file') }}</el-button>
    </el-upload>
    <ul v-if="type === 'button'" class="button-list" :class="{multiple: multiple}">
      <li v-for="(item, index) in list" v-show="!item.delete" :key="index" :class="{ 'show-progress': ![1, 6, 7].includes(item.status) }">
        <svg-icon
          :icon-class="getButtonListIcon(index)"
          :class="{ 'success-icon': item.status === 6, 'warning-icon': item.status === 7, 'loading-icon': ![1, 6, 7].includes(item.status) }"
        />
        <span>{{ item.name }}</span>
        <svg-icon v-if="multiple && [6, 7].includes(item.status)" icon-class="close" class="close" @click="onRemove(index)" />
        <el-progress v-if="![6, 7].includes(item.status)" type="line" :percentage="getProgress(index)" :stroke-width="3" :show-text="false" />
      </li>
    </ul>
    <div v-else-if="type === 'image'" class="image-list">
      <div v-for="(item, index) in list" v-show="!item.delete" :key="index" class="image-list-item" :style="{ width: `${imageWidth}px`, height: `${imageHeight}px` }">
        <el-progress v-if="item.status !== 6" type="circle" :percentage="getProgress(index)" :status="getProgressStatus(index)" :width="progressWidth" />
        <el-image v-if="item.status === 6" :src="item.url" fit="fill" :lazy="true" :style="{ width: `${imageWidth}px`, height: `${imageHeight}px` }" />
        <div class="image-list-item-actions">
          <svg-icon icon-class="view" @click="onImagePreview(item.url)" />
          <svg-icon icon-class="delete" @click="onRemove(index)" />
        </div>
      </div>
      <el-upload
        v-if="showAdd"
        action=""
        :auto-upload="false"
        :show-file-list="false"
        :on-change="fileChange"
        :disabled="disabled"
        :accept="accept"
        class="image-list-item"
      >
        <div class="image-placeholder" :style="{ width: `${imageWidth}px`, height: `${imageHeight}px` }">
          <svg-icon icon-class="plus" />
        </div>
      </el-upload>
      <el-image-viewer v-if="imagePreviewOpened" :initial-index="imagePreviewIndex" :url-list="usableList" @close="imagePreviewClose" />
    </div>
  </div>
</template>

<script>
import Upload from '@/utils/upload'
import { percentage } from '@/utils'
export default {
  name: 'Upload',
  props: {
    modelValue: {
      type: [String, Array],
      required: true
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
    },
    type: {
      type: String,
      default: 'button',
      validator(value) {
        return ['button', 'image'].includes(value)
      }
    },
    imageHeight: {
      type: Number,
      default: 120
    },
    imageWidth: {
      type: Number,
      default: 120
    },
    multiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 0
    }
  },
  emits: ['update:modelValue', 'on-progress', 'on-success', 'on-fail'],
  watch: {
    modelValue: {
      immediate: true,
      handler(value) {
        this.list = []
        if (this.multiple) {
          for (const item of value) {
            this.list.push({
              url: item,
              name: item,
              status: 6,
              progress: 0,
              delete: false
            })
          }
        } else {
          if (!value) return
          this.list.push({
            url: value,
            name: value,
            status: 6,
            progress: 0,
            delete: false
          })
        }
      }
    }
  },
  data() {
    return {
      list: [],
      imagePreviewOpened: false,
      imagePreviewIndex: null
    }
  },
  computed: {
    showAdd() {
      const num = this.list.filter(item => !item.delete).length
      return (!this.multiple && num === 0) ||
        (this.multiple && this.limit === 0) ||
        (this.multiple && num < this.limit)
    },
    progressWidth() {
      return this.imageHeight > this.imageWidth ? this.imageWidth : this.imageHeight
    },
    imagePreview() {
      return this.$refs['image-preview']
    },
    usableList() {
      return this.list.filter(item => !item.delete && item.status === 6).map(item => item.url)
    }
  },
  methods: {
    isDisabled(index) {
      if (!this.list[index]) return false
      return ![1, 6, 7].includes(this.list[index].status)
    },
    getButtonListIcon(index) {
      switch (this.list[index].status) {
        case 1:
          return 'document'
        case 2:
        case 3:
        case 4:
        case 5:
          return 'loading'
        case 6:
          return 'success-filled'
        case 7:
          return 'warning'
      }
    },
    getProgress(index) {
      if ([2, 3].includes(this.list[index].status)) {
        return Math.round(this.list[index].progress / 2 * 100) / 100
      } else if ([4, 5].includes(this.list[index].status)) {
        return Math.round(this.list[index].progress / 2 * 100) / 100 + 50
      } else if (this.list[index].status === 7) {
        return 100
      } else {
        return 0
      }
    },
    getProgressStatus(index) {
      if (this.list[index].status === 6) {
        return 'success'
      } else if (this.list[index].status === 7) {
        return 'warning'
      } else {
        return ''
      }
    },
    onImagePreview(url) {
      this.imagePreviewIndex = this.modelValue.indexOf(url)
      this.imagePreviewOpened = true
    },
    onRemove(index) {
      this.list[index].delete = true
      this.updateModelValue()
    },
    updateModelValue() {
      let modelValue
      if (this.multiple) {
        modelValue = this.usableList
      } else {
        modelValue = this.list[0].url ?? ''
      }
      this.$emit('update:modelValue', modelValue)
    },
    fileChange({ raw }) {
      const index = this.list.length
      this.list.push({
        url: '',
        name: raw.name,
        status: 1,
        progress: 0,
        delete: false
      })
      const upload = new Upload()
      upload.onMd5Before(() => {
        this.list[index].progress = 0
        this.list[index].status = 2
      }).onMd5Progress((loaded, total) => {
        this.list[index].progress = percentage(loaded, total, false)
        this.$emit('on-progress', this.getProgress(index), index)
      }).onMd5After(() => {
        this.list[index].progress = 100
        this.list[index].status = 3
      }).onBefore(() => {
        this.list[index].progress = 0
        this.list[index].status = 4
      }).onProgress((loaded, total) => {
        this.list[index].progress = percentage(loaded, total, false)
        this.$emit('on-progress', this.getProgress(index), index)
      }).onAfter(() => {
        this.list[index].progress = 100
        this.list[index].status = 5
      })
      const saveFunc = this.part ? upload.partSave : upload.save
      saveFunc(raw).then(url => {
        this.list[index].status = 6
        this.list[index].url = url
        this.updateModelValue()
        this.$emit('on-success', url, raw, index)
      }).catch(e => {
        this.list[index].status = 7
        this.$emit('on-fail', e, index)
      })
    },
    imagePreviewClose() {
      this.imagePreviewOpened = false
    }
  }
}
</script>

<style lang="scss" scoped>
.success-icon {
  color: var(--el-color-success);
}
.warning-icon {
  color: var(--el-color-warning);
}
.loading-icon {
  animation: loading-rotate 2s linear infinite;
}
.button-list {
  list-style: none;
  padding: 0;
  margin: 10px 0 0;
  li {
    font-size: 14px;
    color: var(--el-text-color-regular);
    margin-bottom: 5px;
    border-radius: var(--el-border-radius-base);
    transition: all .5s cubic-bezier(.55,0,.1,1);
    line-height: 1.8em;
    position: relative;
    span {
      margin-left: .4em;
    }
    .el-progress {
      width: 100%;
      position: absolute;
      bottom: 0;
    }
  }
  &.multiple li {
    cursor: pointer;
    .close {
      float: right;
      margin-right: .6em;
      display: none;
      &:hover {
        color: var(--el-color-danger);;
      }
    }
    &:hover {
      background-color: var(--el-fill-color-light);
      span {
        color: var(--el-color-primary);
      }
      .close {
        display: inline-block;
      }
    }
  }
}
.image-list {
  display: flex;
  &-item {
    margin: 0 5px 5px 0;
    position: relative;
    .image-placeholder {
      box-sizing: border-box;
      position: relative;
      border: 1px dashed var(--el-color-info);
      border-radius: var(--el-border-radius-base);
      &:hover {
        border-color: var(--el-color-primary);
        color: var(--el-color-primary);
      }
      .svg-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .el-image {
      border-radius: var(--el-border-radius-base);
      overflow: hidden;
    }
    &-actions {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: var(--el-color-info-dark-2);
      transition: opacity var(--el-transition-duration);
      border-radius: var(--el-border-radius-base);
      display: flex;
      justify-content: space-around;
      align-items: center;
      & .svg-icon {
        cursor: pointer;
        &:hover {
          opacity: .6;
        }
      }
    }
    &:hover &-actions {
      opacity: .6;
    }
    &:hover {
      .el-progress {
        opacity: .5;
      }
    }
    .el-progress {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
