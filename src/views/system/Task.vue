<template>
  <div>
    <el-card :body-style="{padding: '0 20px'}">
      <p>
        <span>{{ $t('service_status') }}:</span>
        <el-tag v-if="serverIsRunning" type="success">{{ $t('running') }}</el-tag>
        <el-tag v-else type="warning">{{ $t('stop') }}</el-tag>
        <span style="margin-left:10em">{{ $t('start_command') }}: </span>
        <el-link type="info" @click="copyCommand">{{ serverCommand }}</el-link>
      </p>
    </el-card>
    <data-list ref="data-list" :node="$nodes.systemTask.list">
      <template #search="{ options }">
        <el-form-item>
          <el-input v-model="options.title" :placeholder="$t('designation')" />
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
        <el-button v-auth="$nodes.systemTask.add" type="primary" @click="onAdd">{{ $t('add') }}</el-button>
      </template>
      <template #list-column>
        <el-table-column label="ID" prop="id" width="65" sortable="custom" />
        <el-table-column :label="$t('task_name')" prop="title" />
        <el-table-column :label="$t('task_info')" min-width="180">
          <template #default="{ row }">
            <div>{{ $t('command_info') }}: <span>{{ row.command }}</span></div>
            <div>{{ $t('params_info') }}: <span>{{ row.params ? row.params : '' }}</span></div>
            <div>{{ $t('execute_type') }}: <span>{{ row.type == 2 ? $t('manual_execute') : row.crontab }}</span></div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('execute_info')" min-width="215">
          <template #default="{ row }">
            <div>{{ $t('cumulative_execute_number') }}: <span>{{ row.exec_num }}</span></div>
            <div>{{ $t('last_execute_time') }}: <span>{{ row.last_exec_time }}</span></div>
            <div>{{ $t('last_execute_result') }}: <el-tag v-if="row.last_exec_result" :type="row.last_exec_result == 1 ? 'success' : 'danger'">{{ row.last_exec_result == 1 ? $t('success') : $t('fail') }}</el-tag></div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('current_status')">
          <template #default="{ row }">
            <el-tag :type="row.exec_status == 1 ? 'info' : 'success'" effect="dark">{{ row.exec_status == 1 ? $t('waiting') : $t('running') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('create_time')" prop="create_time" width="160" />
        <el-table-column :label="$t('action')" width="180">
          <template #default="{ row }">
            <el-link v-if="row.status == 1 && serverIsRunning" v-auth="$nodes.systemTask.exec" @click="$action($nodes.systemTask.exec, { id: row.id })">{{ $t('execute') }}</el-link>
            <el-link v-auth="$nodes.systemTask.logList" type="info" @click="onLog(row)">{{ $t('log') }}</el-link>
            <el-link v-auth="$nodes.systemTask.edit" type="primary" @click="onEdit(row)">{{ $t('edit') }}</el-link>
            <el-link v-if="row.status === 1" v-auth="$nodes.systemTask.modifyStatus" type="warning" @click="$action($nodes.systemTask.modifyStatus, { id: row.id, enable: 0 }, refreshList)">{{ $t('disable') }}</el-link>
            <el-link v-else v-auth="$nodes.systemTask.modifyStatus" type="success" @click="$action($nodes.systemTask.modifyStatus, { id: row.id, enable: 1 }, refreshList)">{{ $t('enable') }}</el-link>
            <el-popconfirm :title="$t('delete_confirm')" class="delete-btn" @confirm="$action($nodes.systemTask.del, { id: row.id })">
              <template #reference>
                <el-link v-auth="$nodes.systemTask.del" type="danger">{{ $t('delete') }}</el-link>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </template>
    </data-list>
    <form-dialog ref="form" :rules="formRules" @on-save="onSave">
      <template #default="{ row }">
        <el-form-item :label="$t('task_name')" prop="title">
          <el-input v-model="row.title" />
        </el-form-item>
        <el-form-item :label="$t('task_command')" prop="command">
          <el-input v-model="row.command" />
        </el-form-item>
        <el-form-item :label="$t('command_params')" prop="params">
          <el-input v-model="row.params" />
        </el-form-item>
        <el-form-item :label="$t('task_type')" prop="type">
          <el-radio-group v-model="row.type">
            <el-radio-button :label="1">{{ $t('timing_execute') }}</el-radio-button>
            <el-radio-button :label="2">{{ $t('manual_execute') }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="row.type === 1" :label="$t('timing_params')" prop="crontab">
          <el-input v-model="row.crontab" />
        </el-form-item>
      </template>
    </form-dialog>
    <el-dialog
      v-model="execLogOpened"
      :title="$t('execute_log')"
      width="60%"
      :destroy-on-close="true"
    >
      <data-list :node="$nodes.systemTask.logList" :extend-query="{ stid: execLogId }" :hide-search="true">
        <template #list-column>
          <el-table-column label="ID" prop="id" />
          <el-table-column :label="$t('process_id')" prop="pid" />
          <el-table-column :label="$t('running_time')">
            <template #default="{ row }">
              {{ row.run_time }} S
            </template>
          </el-table-column>
          <el-table-column :label="$t('execute_result')">
            <template #default="{ row }">
              <el-tag v-if="row.result == 2" type="danger" size="small" effect="dark">{{ $t('fail') }}</el-tag>
              <el-tag v-else-if="row.result == 1" type="success" size="small" effect="dark">{{ $t('success') }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('action')">
            <template #default="{ row }">
              <el-link type="primary" @click="onOutput(row)">{{ $t('output_content') }}</el-link>
            </template>
          </el-table-column>
        </template>
      </data-list>
      <template #footer>
        <el-button @click="execLogOpened = false">{{ $t('close') }}</el-button>
      </template>
    </el-dialog>
    <el-dialog
      v-model="outputOpened"
      :title="$t('output_content')"
      width="50%"
      custom-class="task-log-dialog"
    >
      <el-scrollbar class="task-log-output">
        <div v-html="getOutput" />
      </el-scrollbar>
      <template #footer>
        <el-button @click="outputOpened = false">{{ $t('close') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { add, edit, status } from '@/apis/modules/systemTask'
export default {
  name: 'SystemTask',
  data() {
    const validCrontab = (rule, value, callback) => {
      if (this.getForm.row.type === 1 && !value) {
        callback(new Error(this.$t('validate.required', { name: this.$t('timing_params') })))
      } else {
        callback()
      }
    }
    return {
      serverIsRunning: false,
      serverCommand: '',
      interVal: null,
      formRules: {
        title: [{ required: true, message: () => this.$t('validate.required', { name: this.$t('task_name') }), trigger: 'blur' }],
        command: [{ required: true, message: () => this.$t('validate.required', { name: this.$t('task_command') }), trigger: 'blur' }],
        type: [{ required: true, message: () => this.$t('validate.select', { name: this.$t('task_type') }), trigger: 'blur' }],
        crontab: [{
          validator: validCrontab,
          trigger: 'blur'
        }]
      },
      execLogOpened: false,
      execLogId: null,
      outputOpened: false,
      output: null
    }
  },
  computed: {
    getForm() {
      return this.$refs['form']
    },
    getOutput() {
      return this.output.replace(/(\r\n|\r|\n)/g, '<br/>')
    }
  },
  created() {
    this.getStatus()
    this.interVal = setInterval(() => {
      this.getStatus()
    }, 10000)
  },
  unmounted() {
    clearInterval(this.interVal)
  },
  methods: {
    refreshList() {
      return this.$refs['data-list'].refresh()
    },
    getStatus() {
      status().then(({ map }) => {
        const { running, command } = map
        this.serverIsRunning = running
        this.serverCommand = command
      })
    },
    copyCommand() {
      this.$copyText(this.serverCommand).then(() => {
        this.$message.success(this.$t('copy_success'))
      })
    },
    onLog(row) {
      this.execLogId = row.id
      this.execLogOpened = true
    },
    onAdd() {
      this.getForm.open({ type: 1 })
    },
    onEdit(row) {
      this.getForm.open({
        id: row.id,
        title: row.title,
        command: row.command,
        params: row.params,
        type: row.type,
        crontab: row.crontab
      })
    },
    onSave(row, shutDown) {
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
    onOutput(row) {
      this.output = row.output
      this.outputOpened = true
    }
  }
}
</script>

<style lang="scss" scoped>
.el-card {
  margin-bottom: 10px;
  span {
    margin-right: .6em;
  }
}
</style>

<style lang="scss">
.task-log-dialog {
  .el-dialog__body {
    background-color: #303133;
    .task-log-output {
      height: 220px;
      .el-scrollbar__wrap {
        overflow-x: hidden;
        .el-scrollbar__view {
          color: #C0C4CC;
          font-size: 12px;
          line-height: 1.4em;
        }
      }
    }
  }
}
</style>
