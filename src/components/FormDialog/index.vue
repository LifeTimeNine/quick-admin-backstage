<template>
  <el-dialog
    v-model="opened"
    :title="title"
    :width="width"
    :close-on-click-modal="false"
    @close="closed"
  >
    <el-form ref="form" :model="row" :rules="rules" :label-width="labelWidth" :label-position="labelPosition" :size="size">
      <slot :row="row" />
    </el-form>
    <template #footer>
      <el-button :size="size" @click="opened = false">{{ $t(cancelBtnText) }}</el-button>
      <el-button type="primary" :size="size" @click="saveClick">{{ $t(saveBtnText) }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'FormDialog',
  props: {
    width: {
      type: String,
      default: '30%'
    },
    labelWidth: {
      type: String,
      default: 'auto'
    },
    labelPosition: {
      type: String,
      default: 'right'
    },
    size: {
      type: String,
      default: 'default'
    },
    rules: {
      type: Object,
      default() {
        return {}
      }
    },
    saveBtnText: {
      type: String,
      default: 'save'
    },
    cancelBtnText: {
      type: String,
      default: 'cancel'
    }
  },
  emits: {
    'on-save': null
  },
  data() {
    return {
      opened: false,
      title: '',
      row: {}
    }
  },
  methods: {
    open(row = {}, title = null) {
      this.row = Object.assign({}, row)
      this.title = title || (row.id ? this.$t('edit') : this.$t('add'))
      this.opened = true
    },
    getForm() {
      return this.$refs['form']
    },
    saveClick() {
      this.getForm().validate(valid => {
        if (!valid) return false
        this.$emit('on-save', this.row, () => {
          this.opened = false
        })
      })
    },
    closed() {
      this.getForm().clearValidate()
    }
  }
}
</script>
