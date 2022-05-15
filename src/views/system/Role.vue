<template>
  <div>
    <data-list ref="data-list" :node="$nodes.systemRole.list">
      <template #search="{ options }">
        <el-form-item>
          <el-input v-model="options.name" :placeholder="$t('designation')" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="options.status" :placeholder="$t('status')">
            <el-option :label="$t('all')" value="" />
            <el-option :label="$t('enable')" value="1" />
            <el-option :label="$t('disable')" value="2" />
          </el-select>
        </el-form-item>
      </template>
      <template #actions>
        <el-button v-auth="$nodes.systemRole.add" type="primary" @click="onAdd">{{ $t('add') }}</el-button>
      </template>
      <template #list-column>
        <el-table-column label="ID" prop="id" sortable="custom" min-width="60" />
        <el-table-column :label="$t('designation')" prop="name" />
        <el-table-column :label="$t('description')" prop="desc" />
        <el-table-column :label="$t('create_time')" prop="create_time" width="160" />
        <el-table-column :label="$t('action')" width="280">
          <template #default="{ row }">
            <el-link v-auth="$nodes.systemRole.modifyRoleNodes" @click="onSetNodes(row)">{{ $t('authorization') }}</el-link>
            <el-link v-auth="$nodes.systemRole.edit" type="primary" @click="onEdit(row)">{{ $t('edit') }}</el-link>
            <el-link
              v-if="row.status === 1"
              v-auth="$nodes.systemRole.modifyStatus"
              type="warning"
              @click="$action($nodes.systemRole.modifyStatus, { id: row.id, enable: 0 }, refreshList)"
            >{{ $t('disable') }}</el-link>
            <el-link
              v-else
              v-auth="$nodes.systemRole.modifyStatus"
              type="success"
              @click="$action($nodes.systemRole.modifyStatus, { id: row.id, enable: 1 }, refreshList)"
            >{{ $t('enable') }}</el-link>
            <el-popconfirm :title="$t('delete_confirm')" @confirm="$action($nodes.systemRole.softDelete, { id: row.id }, refreshList)">
              <template #reference>
                <el-link v-auth="$nodes.systemRole.softDelete" type="danger">{{ $t('delete') }}</el-link>
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
        <el-form-item :label="$t('designation')" prop="name">
          <el-input v-model="row.name" />
        </el-form-item>
        <el-form-item :label="$t('description')" prop="desc">
          <el-input v-model="row.desc" />
        </el-form-item>
      </template>
    </form-dialog>
    <el-dialog
      v-model="setNodesFormOpened"
      :title="$t('authorization')"
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
        <el-button @click="setNodesFormOpened = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="saveNodes">{{ $t('save') }}</el-button>
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
        name: [{ required: true, message: this.$t('validate.required', { name: this.$t('designation') }), trigger: 'blur' }]
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
        this.$message.success(this.$t('save_success'))
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
        this.$message.success(this.$t('save_success'))
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
