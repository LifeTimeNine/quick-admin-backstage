<template>
  <data-list ref="data-list" :node="$nodes.systemRole.recycleList">
      <template #search="{ options }">
        <el-form-item>
          <el-input v-model="options.name" placeholder="名称" />
        </el-form-item>
      </template>
      <template #list-column>
        <el-table-column label="ID" prop="id" sortable min-width="60" />
        <el-table-column label="名称" prop="name" />
        <el-table-column label="描述" prop="desc" />
        <el-table-column label="创建时间" prop="create_time" width="160" />
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-popconfirm title="确定要恢复这条数据吗？" @confirm="$action([$nodes.systemRole.restore, { id: row.id }, refreshList])">
              <template #reference>
                <el-link v-auth="$nodes.systemRole.restore"  type="success">恢复</el-link>
              </template>
            </el-popconfirm>
            <el-popconfirm title="确定要永久删除这条数据吗？" @confirm="$action([$nodes.systemRole.del, { id: row.id }, refreshList])">
              <template #reference>
                <el-link v-auth="$nodes.systemRole.del"  type="danger">永久删除</el-link>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </template>
    </data-list>
</template>

<script>
export default {
  name: 'RecycleSystemRole',
  methods: {
    refreshList() {
      this.$refs['data-list'].refresh()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
