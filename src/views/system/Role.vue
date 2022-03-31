<template>
  <div>
    <data-list ref="data-list" :node="$nodes.systemRole.list">
      <template #search="{ options }">
        <el-form-item>
          <el-input v-model="options.name" placeholder="名称" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="options.status" placeholder="状态">
            <el-option label="全部" value="" />
            <el-option label="正常" value="1" />
            <el-option label="禁用" value="2" />
          </el-select>
        </el-form-item>
      </template>
      <template #actions>
        <el-button v-auth="$nodes.systemRole.add" type="primary" @click="onAdd">新增</el-button>
      </template>
      <template #list-column>
        <el-table-column label="ID" prop="id" sortable min-width="60" />
        <el-table-column label="名称" prop="name" />
        <el-table-column label="描述" prop="desc" />
        <el-table-column label="创建时间" prop="create_time" width="160" />
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-link v-auth="$nodes.systemRole.modifyRoleNodes" @click="onSetNodes(row)">授权</el-link>
            <el-link v-auth="$nodes.systemRole.edit" type="primary" @click="onEdit(row)">编辑</el-link>
            <el-link
              v-if="row.status === 1"
              v-auth="$nodes.systemRole.modifyStatus"
              type="warning"
              @click="$action($nodes.systemRole.modifyStatus, { id: row.id, enable: 0 }, refreshList)"
            >禁用</el-link>
            <el-link
              v-else
              v-auth="$nodes.systemRole.modifyStatus"
              type="success"
              @click="$action($nodes.systemRole.modifyStatus, { id: row.id, enable: 1 }, refreshList)"
            >启用</el-link>
            <el-popconfirm title="确定要删除这条数据吗？" @confirm="$action($nodes.systemRole.softDelete, { id: row.id }, refreshList)">
              <template #reference>
                <el-link v-auth="$nodes.systemRole.softDelete" type="danger">删除</el-link>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </template>
    </data-list>
    <form-dialog
      ref="form-dialog"
      :rules="formRules"
      @on-save="formOnSave"
    >
      <template #default="{ row }">
        <el-form-item label="名称" prop="name">
          <el-input v-model="row.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="row.desc" placeholder="请输入用户描述" />
        </el-form-item>
      </template>
    </form-dialog>
    <el-dialog
      v-model="setNodesFormOpened"
      title="授权"
      width="40%"
    >
      <el-tree
        ref="nodeTree"
        :data="userNodeTree"
        :props="nodeTreeProps"
        :show-checkbox="true"
        :highlight-current="true"
        :expand-on-click-node="false"
        :check-on-click-node="true"
        node-key="node"
        accordion
      />
      <template #footer>
        <el-button @click="setNodesFormOpened = false">取消</el-button>
        <el-button type="primary" @click="saveNodes">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { add, edit, getRoleNodes, getUserNodeTree, modifyRoleNodes } from '@/apis/modules/systemRole'
export default {
  name: 'SystemRole',
  data() {
    return {
      formRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      setNodesFormOpened: false,
      setNodesId: null,
      userNodeTree: [],
      nodeTreeProps: {
        label: 'title',
        children: 'actions'
      }
    }
  },
  computed: {
    formDialog() {
      return this.$refs['form-dialog']
    }
  },
  methods: {
    refreshList() {
      this.$refs['data-list'].refresh()
    },
    onAdd() {
      this.formDialog.open()
    },
    onEdit(row) {
      this.formDialog.open({
        id: row.id,
        name: row.name,
        desc: row.desc
      })
    },
    formOnSave(row, shutDown) {
      const loading = this.$loading()
      const func = row.id ? edit : add
      func(row).then(() => {
        this.$message.success('保存成功')
        this.refreshList()
        shutDown()
      }).finally(() => {
        loading.close()
      })
    },
    onSetNodes(row) {
      if (this.userNodeTree.length === 0) {
        getUserNodeTree().then(({ list }) => {
          this.userNodeTree = list
        })
      }
      getRoleNodes({ srid: row.id }).then(({ list }) => {
        this.$refs['nodeTree'].setCheckedKeys(list, true)
        this.setNodesId = row.id
      })
      this.setNodesFormOpened = true
    },
    saveNodes() {
      const loading = this.$loading()
      modifyRoleNodes({
        srid: this.setNodesId,
        nodes: this.$refs['nodeTree'].getCheckedNodes(true).map(item => item.node)
      }).then(() => {
        this.$message.success('保存成功')
        this.setNodesFormOpened = false
      }).finally(() => {
        loading.close()
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
