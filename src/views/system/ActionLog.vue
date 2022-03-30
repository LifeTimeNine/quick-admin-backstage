<template>
  <div>
    <data-list ref="data-list" :node="$nodes.systemActionLog.list">
      <template #search="{ options }">
        <el-form-item>
          <el-input v-model="options.node" placeholder="节点" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="options.username" placeholder="用户名" />
        </el-form-item>
      </template>
      <template #list-column>
        <el-table-column label="ID" prop="id" sortable min-width="60" />
        <el-table-column label="操作人">
          <template #default="{ row }">
            <span>{{ row.systemUser.username }}</span>
          </template>
        </el-table-column>
        <el-table-column label="权限节点" prop="node" />
        <el-table-column label="操作名称" prop="node_title" />
        <el-table-column label="请求时间" prop="request_time" width="160" />
        <el-table-column label="请求地址" prop="request_ip" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-link type="primary" @click="showDetail(row)">详情</el-link>
          </template>
        </el-table-column>
      </template>
    </data-list>
    <el-dialog
      v-model="detailOpened"
      title="详情"
      width="40%"
    >
      <el-row>
        <el-col :span="6">权限节点</el-col>
        <el-col :span="18">{{ detail.node }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">操作名称</el-col>
        <el-col :span="18">{{ detail.node_title }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">操作人</el-col>
        <el-col :span="18">{{ detail.systemUser ? detail.systemUser.username : '' }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">请求时间</el-col>
        <el-col :span="18">{{ detail.request_time }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">请求地址</el-col>
        <el-col :span="18">{{ detail.request_ip }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">请求数据</el-col>
        <el-col :span="18">{{ detail.request_param }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">响应状态码</el-col>
        <el-col :span="18">{{ detail.response_code }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">响应数据</el-col>
        <el-col :span="18">{{ detail.response_content }}</el-col>
      </el-row>
      <template #footer>
        <el-button @click="detailOpened = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SystemActionLog',
  data() {
    return {
      detail: {},
      detailOpened: false
    }
  },
  methods: {
    showDetail(row) {
      this.detail = row
      this.detailOpened = true
    }
  }
}
</script>

<style lang="scss" scoped>
.el-row {
  .el-col {
    line-height: 1.6em;
    &:nth-child(2) {
      color: #909399;
    }
  }
}
</style>
