<template>
  <data-list ref="data-list" :node="$nodes.systemRole.recycleList">
    <template #search="{ options }">
      <el-form-item>
        <el-input v-model="options.name" :placeholder="$t('designation')" />
      </el-form-item>
    </template>
    <template #list-column>
      <el-table-column label="ID" prop="id" sortable="custom" min-width="60" />
      <el-table-column :label="$t('designation')" prop="name" />
      <el-table-column :label="$t('description')" prop="desc" />
      <el-table-column :label="$t('create_time')" prop="create_time" width="160" />
      <el-table-column :label="$t('action')" width="220">
        <template #default="{ row }">
          <el-popconfirm :title="$t('restore_confirm')" @confirm="$action($nodes.systemRole.restore, { id: row.id }, refreshList)">
            <template #reference>
              <el-link v-auth="$nodes.systemRole.restore" type="success">{{ $t('restore') }}</el-link>
            </template>
          </el-popconfirm>
          <el-popconfirm :title="$t('permanent_delete_confirm')" @confirm="$action($nodes.systemRole.del, { id: row.id }, refreshList)">
            <template #reference>
              <el-link v-auth="$nodes.systemRole.del" type="danger">{{ $t('permanent_delete') }}</el-link>
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
