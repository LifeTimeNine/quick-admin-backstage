<template>
  <div>
    <data-list ref="data-list" :node="$nodes.systemErrorLog.list">
      <template #search="{ options }">
        <el-form-item>
          <el-input v-model="options.hash" placeholder="哈希值" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="options.path_info" placeholder="地址" />
        </el-form-item>
      </template>
      <template #list-column>
        <el-table-column label="ID" prop="id" min-width="65" sortable />
        <el-table-column label="哈希值" prop="hash" />
        <el-table-column label="应用" prop="app_name" width="70" />
        <el-table-column label="地址" prop="path_info" />
        <el-table-column label="异常消息" prop="error_message" min-width="90" />
        <el-table-column label="首次发生时间" prop="happen_time" min-width="160" sortable />
        <el-table-column label="最后发生时间" prop="last_happen_time" min-width="160" sortable />
        <el-table-column label="发生次数" prop="happen_num" min-width="90" />
        <el-table-column label="处理人">
          <template #default="{ row }">
            <span>{{ row.resolveUser ? row.resolveUser.username : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="处理时间" prop="resolve_time" min-width="160" />
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
        <el-col :span="6">应用名称</el-col>
        <el-col :span="18">{{ detail.app_name }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">请求地址</el-col>
        <el-col :span="18">{{ detail.path_info }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">请求地址</el-col>
        <el-col :span="18">{{ detail.access_ip }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">请求参数</el-col>
        <el-col :span="18">{{ detail.request_param }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">异常消息</el-col>
        <el-col :span="18">{{ detail.error_message }} <el-button type="text" size="small" @click="copyTrace">复制追踪数据</el-button></el-col>
      </el-row>
      <el-row>
        <el-col :span="6">异常码</el-col>
        <el-col :span="18">{{ detail.error_code }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">异常文件</el-col>
        <el-col :span="18">{{ detail.error_file }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">异常行数</el-col>
        <el-col :span="18">{{ detail.error_line }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">首次发生时间</el-col>
        <el-col :span="18">{{ detail.happen_time }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">最后发生时间</el-col>
        <el-col :span="18">{{ detail.last_happen_time }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">发生次数</el-col>
        <el-col :span="18">{{ detail.happen_num }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">处理人</el-col>
        <el-col :span="18">{{ detail.resolveUser ? detail.resolveUser.username : '' }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">处理时间</el-col>
        <el-col :span="18">{{ detail.resolve_time }}</el-col>
      </el-row>
      <template #footer>
        <el-button v-if="detail.status == 1" v-auth="$nodes.systemErrorLog.resolve" type="primary" @click="$action([$nodes.systemErrorLog.resolve, { id: detail.id }, resolveSuccess])">处理</el-button>
        <el-button @click="detailOpened = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SystemErrorLog',
  data() {
    return {
      detail: {},
      detailOpened: false
    }
  },
  methods: {
    refreshList() {
      this.$refs['data-list'].refresh()
    },
    showDetail(row) {
      this.detail = row
      this.detailOpened = true
    },
    resolveSuccess() {
      this.detail.status = 2
      this.refreshList()
    },
    copyTrace() {
      this.$copyText(this.detail.error_trace).then(() => {
        this.$message.success('复制成功')
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
