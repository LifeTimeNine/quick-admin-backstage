<template>
  <div :class="{fullscreen:fullscreen}" class="tinymce-container" :style="{width:containerWidth}">
    <textarea :id="tinymceId" class="tinymce-textarea" />
  </div>
</template>

<script>
/**
 * docs:
 * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
 */
import plugins from './plugins'
import toolbar from './toolbar'
import load from './dynamicLoadScript'
import Upload from '@/utils/upload'

// why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
const tinymceCDN = 'https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js'

export default {
  name: 'Tinymce',
  props: {
    id: {
      type: String,
      default: function() {
        return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    modelValue: {
      type: String,
      required: true
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    menubar: {
      type: String,
      default: 'file edit insert view format table'
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360
    },
    width: {
      type: [Number, String],
      required: false,
      default: 'auto'
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false
    }
  },
  computed: {
    containerWidth() {
      const width = this.width
      if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
        return `${width}px`
      }
      return width
    }
  },
  watch: {
    modelValue(val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() =>
          window.tinymce.get(this.tinymceId).setContent(val || ''))
      }
    },
    '$i18n.locale': function(value) {
      if (this.hasInit) this.destroyTinymce()
      this.initTinymce()
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    if (window.tinymce) {
      this.initTinymce()
    }
  },
  deactivated() {
    this.destroyTinymce()
  },
  unmounted() {
    this.destroyTinymce()
  },
  methods: {
    getLanguage() {
      switch (this.$i18n.locale) {
        case 'zh':
          return 'zh_CN'
        case 'en':
          return 'en_US'
        default:
          return 'zh_CN'
      }
    },
    init() {
      // dynamic load tinymce from cdn
      load(tinymceCDN, (err) => {
        if (err) {
          this.$message.error(err.message)
          return
        }
        this.initTinymce()
      })
    },
    initTinymce() {
      const _this = this
      window.tinymce.init({
        language: _this.getLanguage(),
        selector: `#${this.tinymceId}`,
        height: this.height,
        body_class: 'panel-body ',
        object_resizing: false,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.menubar,
        plugins: plugins,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
        default_link_target: '_blank',
        link_title: false,
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp need Nonbreaking Space Plugin
        file_picker_types: 'media,image',
        file_picker_callback: (callback, value, meta) => {
          const input = document.createElement('input')
          input.setAttribute('type', 'file')
          if (meta.filetype === 'image') {
            input.setAttribute('accept', 'image/*')
          } else if (meta.filetype === 'media') {
            input.setAttribute('accept', 'video/*')
          }
          input.onchange = function() {
            if (this.files.length > 0) {
              const file = this.files[0]
              const loading = _this.$loading({
                target: '.mce-reset',
                lock: true,
                text: _this.$t('upload.md5_begin'),
                // spinner: 'loading',
                background: 'rgba(0, 0, 0, 0.7)'
              })
              const upload = new Upload()
              upload.onMd5Progress((loaded, total) => {
                loading.setText(`MD5: ${Math.round(loaded / total * 10000) / 100}%`)
              }).onMd5After(() => {
                loading.setText(_this.$t('upload.md5_complete'))
              }).onBefore(() => {
                loading.setText(_this.$t('upload.upload_begin'))
              }).onProgress((loaded, total) => {
                loading.setText(`${_this.$t('upload.text')}: ${Math.round(loaded / total * 10000) / 100}%`)
              }).onAfter(() => {
                loading.setText(_this.$t('upload.merge'))
              })
              let func
              if (meta.filetype === 'image') {
                func = upload.save
              } else {
                func = upload.partSave
              }
              func(file).then(url => {
                loading.setText(_this.$t('upload.upload_complete'))
                callback(url, { title: file.name })
              }).catch(() => {
                loading.setText(_this.$t('upload.md5_fail'))
                _this.$message.error(_this.$t('upload.md5_fail'))
              }).finally(() => {
                loading.close()
              })
            }
          }
          input.click()
        },
        init_instance_callback: editor => {
          if (_this.modelValue) {
            editor.setContent(_this.modelValue)
          }
          _this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true
            this.$emit('update:modelValue', editor.getContent())
          })
        },
        setup(editor) {
          editor.on('FullscreenStateChanged', (e) => {
            _this.fullscreen = e.state
          })
        }
      })
    },
    destroyTinymce() {
      const tinymce = window.tinymce.get(this.tinymceId)
      if (this.fullscreen) {
        tinymce.execCommand('mceFullScreen')
      }

      if (tinymce) {
        tinymce.destroy()
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent()
    }
  }
}
</script>

<style lang="scss" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}

.tinymce-container {
  :deep {
    .mce-fullscreen {
      z-index: 10000;
    }
  }
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
</style>
