<template>
  <div>
    <el-button v-auth="$nodes.systemMenu.add" type="primary" style="float: right; margin-bottom: 10px;" @click="add">新增</el-button>
    <el-table :data="list" border stripe row-key="id"  :loading="tableLoading" @row-dblclick="dbClick">
      <el-table-column label="ID" prop="id" />
      <el-table-column label="排序权重" width="100">
        <template #default="{row}">
          <el-input v-model="row.sort" type="number" placeholder="0" min="0" max="100000000" :disabled="!auth($nodes.systemMenu.setSort)" @blur="sortChange(row)" />
        </template>
      </el-table-column>
      <el-table-column label="图标" width="50">
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
          <el-link v-auth="$nodes.systemMenu.edit" type="primary" @click="edit(row)">编辑</el-link>
          <el-link
            v-if="row.status === 1"
            v-auth="$nodes.systemMenu.modifyStatus"
            type="warning"
            @click="$action([$nodes.systemMenu.modifyStatus, { id: row.id, enable: 0 }, getList])"
          >禁用</el-link>
          <el-link
            v-else
            v-auth="$nodes.systemMenu.modifyStatus"
            type="success"
            @click="$action([$nodes.systemMenu.modifyStatus, { id: row.id, enable: 1 }, getList])"
          >启用</el-link>
          <el-popconfirm title="确定要删除这条数据吗？" @confirm="$action([$nodes.systemMenu.softDelete, { id: row.id }, getList])">
            <template #reference>
              <el-link v-auth="$nodes.systemMenu.softDelete" type="danger">删除</el-link>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <form-dialog ref="form-dialog" :rules="editFormRules" @on-save="onSave">
      <template #default="{ row }">
        <el-form-item label="父级菜单" prop="pid">
          <el-cascader
            v-model="editItemPids"
            :options="selectList"
            :props="{ expandTrigger: 'hover', checkStrictly: true, label: 'title', value: 'id' }"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="row.icon">
            <template #prepend>
              <svg-icon :icon-class="row.icon || ''" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="名称" prop="title">
          <el-input v-model="row.title" />
        </el-form-item>
        <el-form-item label="页面地址" prop="url">
          <el-input v-model="row.url" />
        </el-form-item>
        <el-form-item label="页面参数" prop="params">
          <el-input v-model="row.params" />
        </el-form-item>
        <el-form-item label="权限节点" prop="node">
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
          { required: true, message: '请选择父级菜单', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value === this.getFormDialog().row.id) {
                callback(new Error('不能选择当前菜单'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        title: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        url: [{ required: true, message: '请输入页面地址', trigger: 'blur' }]
      },
      userMenuNodes: []
    }
  },
  created() {
    this.getList()
  },
  computed: {
    getFormDialog() {
      return this.$refs['form-dialog']
    }
  },
  methods: {
    auth,
    getList() {
      this.tableLoading = true
      this.$get(this.$nodes.systemMenu.list).then(({list}) => {
        this.list = list
        this.selectList = [{ id: 0, title: '顶级菜单' }].concat(this.list)
      }).finally(() => {
        this.tableLoading = false
      })
    },
    add() {
      this.getMenuNodes()
      this.editItemPids = [0]
      this.getFormDialog.open({}, '新增')
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
      this.$post(this.$nodes.systemMenu.setSort, { id: row.id, sort: row.sort }).then(() => {
        this.$message.success('排序权重设置成功')
      }).finally(() => {
        this.getList()
        loading.close()
      })
    },
    onSave(row, shutDown) {
      const node = row.id ? this.$nodes.systemMenu.edit : this.$nodes.systemMenu.add
      const loading = this.$loading()
      this.$post(node, row).then(() => {
        this.$message.success('保存成功')
        this.getList()
        shutDown()
      }).finally(() => {
        loading.close()
      })
    },
    getPids(id, defaultPids = [0]) {
      const func = function(id, menus, pids = []) {
        for (var item of menus) {
          if (item.id === id) return pids
          if (item.children && item.children.length > 0) {
            var res = func(id, item.children, pids.concat([item.id]))
            if (res !== false) return res
          }
        }
        return false
      }
      var res = func(id, this.list)
      if (res === false || res.length === 0) res = defaultPids
      return res
    },
    getMenuNodes() {
      if (this.userMenuNodes.length === 0) {
        this.$get(this.$nodes.systemMenu.getUserMenuNodes).then(({ list }) => {
          this.userMenuNodes = list
        })
      }
    },
    dbClick(row) {
      this.getMenuNodes()
      this.editItemPids = this.getPids(row.id, [])
      this.editItemPids.push(row.id)
      this.getFormDialog.open({}, '新增')
    },
    nodeSearch(queryStr, callback) {
      var searchList = queryStr ? this.userMenuNodes.filter(item => item.node.indexOf(queryStr) === 0) : this.userMenuNodes
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
</style>
