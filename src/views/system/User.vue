<template>
  <div>
    <data-list
      ref="data-list"
      :node="$nodes.systemUser.list"
    >
      <template #search="{ options }">
        <el-form-item>
          <el-input v-model="options.username" placeholder="用户名" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="options.name" placeholder="姓名" />
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
        <el-button v-auth="$nodes.systemUser.add" type="primary" @click="add">新增</el-button>
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
            <el-popconfirm title="确定要重置此用户的密码吗？" @confirm="$action([$nodes.systemUser.resetPwd, { id: row.id }])">
              <template #reference>
                <el-link v-auth="$nodes.systemUser.resetPwd">重置密码</el-link>
              </template>
            </el-popconfirm>
            <el-link v-auth="$nodes.systemUser.edit" type="primary" @click="onEdit(row)">编辑</el-link>
            <el-link
              v-if="row.status === 1"
              v-auth="$nodes.systemUser.modifyStatus"
              type="warning"
              @click="$action([$nodes.systemUser.modifyStatus, { id: row.id, enable: 0 }, refreshList])"
            >禁用</el-link>
            <el-link
              v-else
              v-auth="$nodes.systemUser.modifyStatus"
              type="success"
              @click="$action([$nodes.systemUser.modifyStatus, { id: row.id, enable: 1 }, refreshList])"
            >启用</el-link>
            <el-popconfirm title="确定要删除这条数据吗？" @confirm="$action([$nodes.systemUser.softDelete, { id: row.id }, refreshList])">>
              <template #reference >
                <el-link v-auth="$nodes.systemUser.softDelete" type="danger">删除</el-link>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </template>
    </data-list>
    <form-dialog ref="form-dialog" :rules="formRules" @on-save="onSave">
      <template #default="{ row }">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="row.username" :disabled="!!row.id" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="row.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="row.desc" placeholder="请输入用户描述" />
        </el-form-item>
        <el-form-item label="角色" prop="rids">
          <el-select v-model="row.rids" placeholder="请选择角色" clearable filterable multiple style="width:100%">
            <el-option
              v-for="item in userRoles"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </template>
    </form-dialog>
  </div>
</template>

<script>
export default {
  name: 'SystemUser',
  data() {
    return {
      userRoles: [],
      formRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        rids: [{
          validator: (rule, value, callback) => {
            if (value.length === 0) {
              callback(new Error('请选择角色'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }]
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
    getRoles() {
      if (this.userRoles.length === 0) {
        this.$get(this.$nodes.systemRole.getUserRole).then(({ list }) => {
          this.userRoles = list
        })
      }
    },
    add() {
      this.getRoles()
      this.formDialog.open()
    },
    onEdit(row) {
      this.getRoles()
      this.formDialog.open({
        id: row.id,
        username: row.username,
        name: row.name,
        desc: row.name,
        rids: row.roles.map(item => item.id)
      })
    },
    onSave(row, shutDown) {
      const loading = this.$loading()
      const node = row.id ? this.$nodes.systemUser.edit : this.$nodes.systemUser.add
      this.$post(node, row).then(() => {
        this.$message.success('操作成功')
        shutDown()
        this.refreshList()
      }).finally(() => {
        loading.close()
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
