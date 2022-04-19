<template>
  <data-list ref="data-list" :node="$nodes.systemMenu.recycleList" :hide-search="true">
    <template #list-column>
      <el-table-column label="ID" prop="id" />
      <el-table-column :label="$t('sort_weight')" prop="sort" min-width="125" />
      <el-table-column :label="$t('icon')" width="60">
        <template #default="{row}">
          <svg-icon :icon-class="row.icon" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('designation')" prop="title" />
      <el-table-column :label="$t('page_path')" prop="url" />
      <el-table-column :label="$t('permissions_node')" prop="node" />
      <el-table-column :label="$t('create_time')" prop="create_time" width="160" />
      <el-table-column :label="$t('action')" min-width="220">
        <template #default="{row}">
          <el-popconfirm :title="$t('restore_confirm')" @confirm="$action($nodes.systemMenu.restore, { id: row.id }, refreshList)">
            <template #reference>
              <el-link v-auth="$nodes.systemMenu.restore" type="success">{{ $t('restore') }}</el-link>
            </template>
          </el-popconfirm>
          <el-popconfirm :title="$t('permanent_delete_confirm')" @confirm="$action($nodes.systemMenu.del, { id: row.id }, refreshList)">
            <template #reference>
              <el-link v-auth="$nodes.systemMenu.del" type="danger">{{ $t('permanent_delete') }}</el-link>
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
