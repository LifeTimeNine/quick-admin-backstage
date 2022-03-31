<template>
  <data-list
    ref="data-list"
    :node="$nodes.systemUser.recycleList"
  >
    <template #search="{ options }">
      <el-form-item>
        <el-input v-model="options.username" placeholder="用户名" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="options.name" placeholder="姓名" />
      </el-form-item>
    </template>
    <template #list-column>
      <el-table-column label="ID" prop="id" sortable min-width="65" />
      <el-table-column label="头像" width="70">
        <template #default="{ row }">
          <el-avatar shape="square" :src="row.avatar" fit="fill" />
        </template>
      </el-table-column>
      <el-table-column label="用户名" prop="username" />
      <el-table-column label="姓名" prop="name" />
      <el-table-column label="角色">
        <template #default="{row}">
          <el-tag v-for="(item, index) in row.roles" :key="index" type="info">{{ item.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="create_time" min-width="155" />
      <el-table-column label="最后登录时间" prop="last_login_time" min-width="155" />
      <el-table-column label="最后登录IP" prop="last_login_ip" min-width="140" />
      <el-table-column label="操作" width="210">
        <template #default="{ row }">
          <el-popconfirm title="确定要恢复这条数据吗？" @confirm="$action($nodes.systemUser.restore, { id: row.id }, refreshList)">>
            <template #reference>
              <el-link v-auth="$nodes.systemUser.restore" type="success">恢复</el-link>
            </template>
          </el-popconfirm>
          <el-popconfirm title="确定要永久删除这条数据吗？" @confirm="$action($nodes.systemUser.delete, { id: row.id }, refreshList)">>
            <template #reference>
              <el-link v-auth="$nodes.systemUser.del" type="danger">永久删除</el-link>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </template>
  </data-list>
</template>

<script>
export default {
  name: 'RecycleSystemUser',
  methods: {
    refreshList() {
      this.$refs['data-list'].refresh()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
