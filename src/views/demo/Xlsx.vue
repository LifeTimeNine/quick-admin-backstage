<template>
  <div>
    <el-upload
      action=""
      :auto-upload="false"
      :on-change="fileChange"
    >
      <el-button type="primary">select file</el-button>
    </el-upload>
    <el-button type="primary" @click="onClick">点击</el-button>
  </div>
</template>

<script>
import { readFile, WorkBook, WorkSheet, writeFile } from '@/utils/xlsx'
export default {
  name: 'XlsxDemo',
  methods: {
    fileChange({ raw }) {
      readFile(raw).then(data => {
        console.log(data[0].getData())
      })
    },
    onClick() {
      const sheet = new WorkSheet('测试')
      sheet.setData([
        [1, 2, 3],
        [4, 5, 6]
      ])
      const book = new WorkBook()
      book.appendSheet(sheet)
      writeFile(book, 'test.xlsx')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
