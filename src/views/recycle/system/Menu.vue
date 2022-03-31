<template>
  <data-list ref="data-list" :node="$nodes.systemMenu.recycleList" :hide-search="true">
    <template #list-column>
      <el-table-column label="ID" prop="id" />
      <el-table-column label="排序权重" prop="sort" width="100" />
      <el-table-column label="图标" width="60">
        <template #default="{row}">
          <svg-icon :icon-class="row.icon" />
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="title" />
      <el-table-column label="页面路径" prop="url" />
      <el-table-column label="权限节点" prop="node" />
      <el-table-column label="创建时间" prop="create_time" width="160" />
      <el-table-column label="操作" width="140">
        <template #default="{row}">
          <el-popconfirm title="确定要恢复这条数据吗？" @confirm="$action($nodes.systemMenu.restore, { id: row.id }, refreshList)">
            <template #reference>
              <el-link v-auth="$nodes.systemMenu.restore" type="success">恢复</el-link>
            </template>
          </el-popconfirm>
          <el-popconfirm title="确定要永久删除这条数据吗？" @confirm="$action($nodes.systemMenu.del, { id: row.id }, refreshList)">
            <template #reference>
              <el-link v-auth="$nodes.systemMenu.del" type="danger">永久删除</el-link>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </template>
  </data-list>
</template>

<script>
export default {
  name: 'RecycleSystemMenu',
  methods: {
    refreshList() {
      this.$refs['data-list'].refresh()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
