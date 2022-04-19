<template>
  <div>
    <el-button v-auth="$nodes.systemMenu.add" type="primary" style="float: right; margin-bottom: 10px;" @click="add">{{ $t('add') }}</el-button>
    <el-table :data="list" border stripe row-key="id" :loading="tableLoading" @row-dblclick="dbClick">
      <el-table-column label="ID" prop="id" />
      <el-table-column :label="$t('sort_weight')" min-width="125">
        <template #default="{row}">
          <el-input v-model="row.sort" type="number" placeholder="0" min="0" max="100000000" :disabled="!auth($nodes.systemMenu.setSort)" @blur="sortChange(row)" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('icon')" width="60">
        <template #default="{row}">
          <svg-icon :icon-class="row.icon" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('designation')" prop="title" />
      <el-table-column :label="$t('page_path')" prop="url" />
      <el-table-column :label="$t('permissions_node')" prop="node" />
      <el-table-column :label="$t('create_time')" prop="create_time" width="160" />
      <el-table-column :label="$t('action')" width="180">
        <template #default="{row}">
          <el-link v-auth="$nodes.systemMenu.edit" type="primary" @click="edit(row)">{{ $t('edit') }}</el-link>
          <el-link
            v-if="row.status === 1"
            v-auth="$nodes.systemMenu.modifyStatus"
            type="warning"
            @click="$action($nodes.systemMenu.modifyStatus, { id: row.id, enable: 0 }, getList)"
          >{{ $t('disable') }}</el-link>
          <el-link
            v-else
            v-auth="$nodes.systemMenu.modifyStatus"
            type="success"
            @click="$action($nodes.systemMenu.modifyStatus, { id: row.id, enable: 1 }, getList)"
          >{{ $t('enable') }}</el-link>
          <el-popconfirm :title="$t('delete_confirm')" @confirm="$action($nodes.systemMenu.softDelete, { id: row.id }, getList)">
            <template #reference>
              <el-link v-auth="$nodes.systemMenu.softDelete" type="danger">{{ $t('delete') }}</el-link>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <form-dialog ref="form-dialog" :rules="editFormRules" @on-save="onSave">
      <template #default="{ row }">
        <el-form-item :label="$t('parent_menu')" prop="pid">
          <el-cascader
            v-model="editItemPids"
            :options="selectList"
            :props="{ expandTrigger: 'hover', checkStrictly: true, label: 'title', value: 'id' }"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item :label="$t('icon')" prop="icon">
          <el-input v-model="row.icon">
            <template #prepend>
              <svg-icon :icon-class="row.icon || ''" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('designation')" prop="title">
          <el-input v-model="row.title" />
        </el-form-item>
        <el-form-item :label="$t('page_path')" prop="url">
          <el-input v-model="row.url" />
        </el-form-item>
        <el-form-item :label="$t('page_param')" prop="params">
          <el-input v-model="row.params" />
        </el-form-item>
        <el-form-item :label="$t('permissions_node')" prop="node">
          <el-autocomplete v-model="row.node" value-key="node" :fetch-suggestions="nodeSearch" style="width: 100%">
            <template #default="{ item }">
              <p>{{ item.node }}</p>
              <p>{{ item.title }}</p>
            </template>
          </el-autocomplete>
        </el-form-item>
      </template>
    </form-dialog>
  </div>
</template>

<script>
import auth from '@/utils/auth'
import { add, edit, getUserMenuNodes, list, setSort } from '@/apis/modules/systemMenu'
export default {
  name: 'SystemMenu',
  data() {
    return {
      tableLoading: false,
      list: [],
      selectList: [],
      editItemPids: [],
      editFormRules: {
        pid: [
          { required: true, message: this.$t('validate.select', { name: this.$t('parent_menu') }), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value === this.getFormDialog.row.id) {
                callback(new Error(this.$t('not_select_current_menu')))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        title: [{ required: true, message: this.$t('validate.required', { name: this.$t('designation') }), trigger: 'blur' }],
        url: [{ required: true, message: this.$t('validate.required', { name: this.$t('page_path') }), trigger: 'blur' }]
      },
      userMenuNodes: []
    }
  },
  computed: {
    getFormDialog() {
      return this.$refs['form-dialog']
    }
  },
  watch: {
    editItemPids: {
      deep: true,
      handler: function(val) {
        this.getFormDialog.row.pid = val[val.length - 1]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    auth,
    getList() {
      this.tableLoading = true
      list().then(({ list }) => {
        this.list = list
        this.selectList = [{ id: 0, title: this.$t('top_menu') }].concat(this.list)
      }).finally(() => {
        this.tableLoading = false
      })
    },
    add() {
      this.getMenuNodes()
      this.editItemPids = [0]
      this.getFormDialog.open({}, this.$t('add'))
    },
    edit(row) {
      this.getMenuNodes()
      this.editItemPids = this.getPids(row.id)
      this.getFormDialog.open({
        id: row.id,
        pid: row.pid,
        icon: row.icon,
        title: row.title,
        url: row.url,
        params: row.params,
        node: row.node
      })
    },
    sortChange(row) {
      const loading = this.$loading()
      setSort({ id: row.id, sort: row.sort }).then(() => {
        this.$message.success(this.$t('set_sort_weight_success'))
      }).finally(() => {
        this.getList()
        loading.close()
      })
    },
    onSave(row, shutDown) {
      const func = row.id ? edit : add
      const loading = this.$loading()
      func(row).then(() => {
        this.$message.success(this.$t('save_success'))
        this.getList()
        shutDown()
      }).finally(() => {
        loading.close()
      })
    },
    getPids(id, defaultPids = [0]) {
      const func = function(id, menus, pids = []) {
        for (const item of menus) {
          if (item.id === id) return pids
          if (item.children && item.children.length > 0) {
            const res = func(id, item.children, pids.concat([item.id]))
            if (res !== false) return res
          }
        }
        return false
      }
      let res = func(id, this.list)
      if (res === false || res.length === 0) res = defaultPids
      return res
    },
    getMenuNodes() {
      if (this.userMenuNodes.length === 0) {
        getUserMenuNodes().then(({ list }) => {
          this.userMenuNodes = list
        })
      }
    },
    dbClick(row) {
      this.getMenuNodes()
      this.editItemPids = this.getPids(row.id, [])
      this.editItemPids.push(row.id)
      this.getFormDialog.open({})
    },
    nodeSearch(queryStr, callback) {
      const searchList = queryStr ? this.userMenuNodes.filter(item => item.node.indexOf(queryStr) === 0) : this.userMenuNodes
      callback(searchList)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table {
  .cell {
    & > .el-link:nth-child(n+2) {
      margin-left: 1em;
    }
  }
}
.el-autocomplete-suggestion li {
  &>p {
    line-height: 1.4em;
    margin: 0;
    &:nth-child(2) {
      font-size: 0.8em;
      color: #909399;
      margin-bottom: 0.8em;
    }
  }
}
</style>
