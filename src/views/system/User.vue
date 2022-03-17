<template>
  <div>
    <data-list
      ref="data-list"
      :node="$nodes.systemUser.list"
    >
      <template #search="{ options }">
        <el-input v-model="options.username" placeholder="用户名" />
        <el-input v-model="options.name" placeholder="姓名" />
        <el-select v-model="options.status" placeholder="状态">
          <el-option label="全部" value="" />
          <el-option label="正常" value="1" />
          <el-option label="禁用" value="2" />
        </el-select>
      </template>
      <template #actions>
        <el-button v-auth="$nodes.systemUser.add" type="primary" @click="add">新增</el-button>
      </template>
      <template #list-column>
        <el-table-column label="ID" prop="id" min-width="35" />
        <el-table-column label="头像" width="60">
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
        <el-table-column label="创建时间" prop="create_time" min-width="140" />
        <el-table-column label="最后登录时间" prop="last_login_time" min-width="140" />
        <el-table-column label="最后登录IP" prop="last_login_ip" min-width="120" />
        <el-table-column label="操作" width="300">
          <template #default="{ row }">
            <el-popconfirm v-auth="$nodes.systemUser.resetPwd" title="确定要重置此用户的密码吗？" class="reset-pwd-btn">
              <template #reference>
                <el-button>重置密码</el-button>
              </template>
            </el-popconfirm>
            <el-button v-auth="$nodes.systemUser.edit" type="primary">编辑</el-button>
            <el-button v-if="row.status === 1" v-auth="$nodes.systemUser.modifyStatus" type="warning">禁用</el-button>
            <el-button v-else v-auth="$nodes.systemUser.modifyStatus" type="success">启用</el-button>
            <el-popconfirm v-auth="$nodes.systemUser.softDelete" title="确定要删除这条数据吗？" class="delete-btn">
              <template #reference >
                <el-button type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </template>
    </data-list>
  </div>
</template>

<script>
export default {
  name: 'SystemUser',
  methods: {
    add() {}
  }
}
</script>

<style lang="scss" scoped>

</style>
