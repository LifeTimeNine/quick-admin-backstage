<template>
  <div>
    <data-list
      ref="data-list"
      :node="$nodes.systemUser.list"
    >
      <template #search="{ options }">
        <el-form-item>
          <el-input v-model="options.username" :placeholder="$t('username')" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="options.name" :placeholder="$t('name')" />
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
        <el-button v-auth="$nodes.systemUser.add" type="primary" @click="onAdd">{{ $t('add') }}</el-button>
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
        <el-table-column :label="$t('action')" width="300">
          <template #default="{ row }">
            <el-popconfirm :title="$t('reset_pwd_confirm')" @confirm="$action($nodes.systemUser.resetPwd, { id: row.id })">
              <template #reference>
                <el-link v-auth="$nodes.systemUser.resetPwd">{{ $t('reset_pwd') }}</el-link>
              </template>
            </el-popconfirm>
            <el-link v-auth="$nodes.systemUser.edit" type="primary" @click="onEdit(row)">{{ $t('edit') }}</el-link>
            <el-link
              v-if="row.status === 1"
              v-auth="$nodes.systemUser.modifyStatus"
              type="warning"
              @click="$action($nodes.systemUser.modifyStatus, { id: row.id, enable: 0 }, refreshList)"
            >{{ $t('disable') }}</el-link>
            <el-link
              v-else
              v-auth="$nodes.systemUser.modifyStatus"
              type="success"
              @click="$action($nodes.systemUser.modifyStatus, { id: row.id, enable: 1 }, refreshList)"
            >{{ $t('enable') }}</el-link>
            <el-popconfirm :title="$t('delete_confirm')" @confirm="$action($nodes.systemUser.softDelete, { id: row.id }, refreshList)">>
              <template #reference>
                <el-link v-auth="$nodes.systemUser.softDelete" type="danger">{{ $t('delete') }}</el-link>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </template>
    </data-list>
    <form-dialog ref="form-dialog" :rules="formRules" @on-save="onSave">
      <template #default="{ row }">
        <el-form-item :label="$t('username')" prop="username">
          <el-input v-model="row.username" :disabled="!!row.id" />
        </el-form-item>
        <el-form-item :label="$t('name')" prop="name">
          <el-input v-model="row.name" />
        </el-form-item>
        <el-form-item :label="$t('description')" prop="desc">
          <el-input v-model="row.desc" />
        </el-form-item>
        <el-form-item :label="$t('role')" prop="rids">
          <el-select v-model="row.rids" clearable filterable multiple style="width:100%">
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
import { getUserRole } from '@/apis/modules/systemRole'
import { add, edit } from '@/apis/modules/systemUser'
export default {
  name: 'SystemUser',
  data() {
    return {
      userRoles: [],
      formRules: {
        username: [{ required: true, message: this.$t('validate.required', { name: this.$t('username') }), trigger: 'blur' }],
        name: [{ required: true, message: this.$t('validate.required', { name: this.$t('name') }), trigger: 'blur' }],
        rids: [{
          validator: (rule, value, callback) => {
            if (value.length === 0) {
              callback(new Error(this.$t('validate.select', { name: this.$t('role') })))
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
        getUserRole().then(({ list }) => {
          this.userRoles = list
        })
      }
    },
    onAdd() {
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
      const func = row.id ? edit : add
      func(row).then(() => {
        this.$message.success(this.$t('action_success'))
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
