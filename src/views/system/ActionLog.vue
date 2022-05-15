<template>
  <div>
    <data-list ref="data-list" :node="$nodes.systemActionLog.list">
      <template #search="{ options }">
        <el-form-item>
          <el-input v-model="options.node" :placeholder="$t('permissions_node')" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="options.username" :placeholder="$t('username')" />
        </el-form-item>
      </template>
      <template #list-column>
        <el-table-column label="ID" prop="id" sortable="custom" min-width="60" />
        <el-table-column :label="$t('action_user')">
          <template #default="{ row }">
            <span>{{ row.systemUser.username }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('permissions_node')" prop="node" />
        <el-table-column :label="$t('action_name')" prop="node_title" />
        <el-table-column :label="$t('action_time')" prop="request_time" width="160" />
        <el-table-column :label="$t('from_ip')" prop="request_ip" />
        <el-table-column :label="$t('action')">
          <template #default="{ row }">
            <el-link type="primary" @click="showDetail(row)">{{ $t('detail') }}</el-link>
          </template>
        </el-table-column>
      </template>
    </data-list>
    <el-dialog
      v-model="detailOpened"
      :title="$t('detail')"
      width="40%"
    >
      <el-row>
        <el-col :span="6">{{ $t('permissions_node') }}</el-col>
        <el-col :span="18">{{ detail.node }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">{{ $t('action_name') }}</el-col>
        <el-col :span="18">{{ detail.node_title }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">{{ $t('action_user') }}</el-col>
        <el-col :span="18">{{ detail.systemUser ? detail.systemUser.username : '' }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">{{ $t('action_time') }}</el-col>
        <el-col :span="18">{{ detail.request_time }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">{{ $t('from_ip') }}</el-col>
        <el-col :span="18">{{ detail.request_ip }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">{{ $t('request_data') }}</el-col>
        <el-col :span="18">{{ detail.request_param }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">{{ $t('response_code') }}</el-col>
        <el-col :span="18">{{ detail.response_code }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">{{ $t('response_data') }}</el-col>
        <el-col :span="18">{{ detail.response_content }}</el-col>
      </el-row>
      <template #footer>
        <el-button @click="detailOpened = false">{{ $t('close') }}</el-button>
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
