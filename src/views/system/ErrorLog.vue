<template>
  <div>
    <data-list ref="data-list" :node="$nodes.systemErrorLog.list">
      <template #search="{ options }">
        <el-form-item>
          <el-input v-model="options.hash" :placeholder="$t('hash_value')" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="options.path_info" :placeholder="$t('request_address')" />
        </el-form-item>
      </template>
      <template #list-column>
        <el-table-column label="ID" prop="id" min-width="65" sortable="custom" />
        <el-table-column :label="$t('hash_value')" prop="hash" />
        <el-table-column :label="$t('app_name')" prop="app_name" width="70" />
        <el-table-column :label="$t('request_address')" prop="path_info" min-width="140" />
        <el-table-column :label="$t('error_message')" prop="error_message" min-width="110" />
        <el-table-column :label="$t('first_happen_time')" prop="happen_time" min-width="160" sortable="custom" />
        <el-table-column :label="$t('last_happen_time')" prop="last_happen_time" min-width="160" sortable="custom" />
        <el-table-column :label="$t('happen_number')" prop="happen_num" min-width="90" />
        <el-table-column :label="$t('resolve_user')">
          <template #default="{ row }">
            <span>{{ row.resolveUser ? row.resolveUser.username : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('resolve_time')" prop="resolve_time" min-width="160" />
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
        <el-col :span="6">{{ $t('app_name') }}</el-col>
        <el-col :span="18">{{ detail.app_name }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">{{ $t('request_address') }}</el-col>
        <el-col :span="18">{{ detail.path_info }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">{{ $t('from_ip') }}</el-col>
        <el-col :span="18">{{ detail.access_ip }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">{{ $t('request_data') }}</el-col>
        <el-col :span="18">{{ detail.request_param }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">{{ $t('error_message') }}</el-col>
        <el-col :span="18">{{ detail.error_message }} <el-button type="text" size="small" @click="copyTrace">{{ $t('copy_trace_data') }}</el-button></el-col>
      </el-row>
      <el-row>
        <el-col :span="6">{{ $t('error_code') }}</el-col>
        <el-col :span="18">{{ detail.error_code }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">{{ $t('error_file') }}</el-col>
        <el-col :span="18">{{ detail.error_file }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">{{ $t('error_line') }}</el-col>
        <el-col :span="18">{{ detail.error_line }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">{{ $t('first_happen_time') }}</el-col>
        <el-col :span="18">{{ detail.happen_time }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">{{ $t('last_happen_time') }}</el-col>
        <el-col :span="18">{{ detail.last_happen_time }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">{{ $t('happen_number') }}</el-col>
        <el-col :span="18">{{ detail.happen_num }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">{{ $t('resolve_user') }}</el-col>
        <el-col :span="18">{{ detail.resolveUser ? detail.resolveUser.username : '' }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">{{ $t('resolve_time') }}</el-col>
        <el-col :span="18">{{ detail.resolve_time }}</el-col>
      </el-row>
      <template #footer>
        <el-button v-if="detail.status == 1" v-auth="$nodes.systemErrorLog.resolve" type="primary" @click="$action($nodes.systemErrorLog.resolve, { id: detail.id }, resolveSuccess)">{{ $t('resolve') }}</el-button>
        <el-button @click="detailOpened = false">{{ $t('close') }}</el-button>
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
        this.$message.success(this.$t('copy_success'))
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
