<template>
  <div>
    <el-button type="primary" size="default" @click="open">打开</el-button>
    <!--
      属性
      width 对话框宽度
      label-width: 表单label宽度
      label-position  表单label位置
      size 表单组件尺寸
      rules 表单验证规则

      方法
      open(row, title) 打开对话框，row：表单数据 title:对话框标题

      事件
      on-save(row, shutDown) 保存事件 row：表单数据 shutDown：关闭对话框的方法
     -->
    <form-dialog
      ref="form-dialog"
      width="30%"
      label-width="auto"
      label-position="right"
      size="default"
      :rules="rules"
      @on-save="onSave"
    >
      <template #default="{ row }">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="row.name" />
        </el-form-item>
      </template>
    </form-dialog>
  </div>
</template>

<script>
export default {
  name: 'DemoFormDialog',
  data() {
    return {
      rules: { name: [{ required: true, message: '请输入姓名', trigger: 'blur' }] }
    }
  },
  methods: {
    open() {
      this.$refs['form-dialog'].open({})
    },
    onSave(row, shutDown) {
      if (row.name === '123') {
        shutDown()
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
