<template>
  <data-list
    ref="data-list"
    :node="$nodes.systemUser.recycleList"
  >
    <template #search="{ options }">
      <el-form-item>
        <el-input v-model="options.username" :placeholder="$t('username')" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="options.name" :placeholder="$t('name')" />
      </el-form-item>
    </template>
    <template #list-column>
      <el-table-column label="ID" prop="id" sortable="custom" min-width="65" />
      <el-table-column :label="$t('avatar')" width="70">
        <template #default="{ row }">
          <el-avatar shape="square" :src="row.avatar" fit="fill" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('username')" prop="username" />
      <el-table-column :label="$t('name')" prop="name" />
      <el-table-column :label="$t('role')">
        <template #default="{row}">
          <el-tag v-for="(item, index) in row.roles" :key="index" type="info">{{ item.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('create_time')" prop="create_time" min-width="155" />
      <el-table-column :label="$t('last_login_time')" prop="last_login_time" min-width="155" />
      <el-table-column :label="$t('last_login_ip')" prop="last_login_ip" min-width="140" />
      <el-table-column :label="$t('action')" width="220">
        <template #default="{ row }">
          <el-popconfirm :title="$t('restore_confirm')" @confirm="$action($nodes.systemUser.restore, { id: row.id }, refreshList)">>
            <template #reference>
              <el-link v-auth="$nodes.systemUser.restore" type="success">{{ $t('restore') }}</el-link>
            </template>
          </el-popconfirm>
          <el-popconfirm :title="$t('permanent_delete_confirm')" @confirm="$action($nodes.systemUser.del, { id: row.id }, refreshList)">>
            <template #reference>
              <el-link v-auth="$nodes.systemUser.del" type="danger">{{ $t('permanent_delete') }}</el-link>
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
