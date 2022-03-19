<template>
  <div>
    <el-card :body-style="{padding: '0 20px'}">
      <p>
        <span>服务状态:</span>
        <el-tag v-if="serverIsRunning" type="success">已启动</el-tag>
        <el-tag v-else type="warning">未启动</el-tag>
        <span style="margin-left:10em">启动指令: </span>
        <el-link type="info" @click="copyCommand">{{ serverCommand }}</el-link>
      </p>
    </el-card>
    <data-list ref="data-list" :node="$nodes.systemTask.list">
      <template #search="{ options }">
        <el-form-item>
          <el-input v-model="options.title" placeholder="名称" />
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
        <el-button v-auth="$nodes.systemTask.add" type="primary" @click="onAdd">新增</el-button>
      </template>
      <template #list-column>
        <el-table-column label="ID" prop="id" width="65" sortable />
        <el-table-column label="任务名称" prop="title" />
        <el-table-column label="指令信息" min-width="180">
          <template #default="{ row }">
            <div>指令信息: <span>{{ row.command }}</span></div>
            <div>参数信息: <span>{{ row.params ? row.params : '无' }}</span></div>
            <div>执行方式: <span>{{ row.type == 2 ? '手动执行' : row.crontab }}</span></div>
          </template>
        </el-table-column>
        <el-table-column label="执行信息" min-width="215">
          <template #default="{ row }">
            <div>累计执行次数: <span>{{ row.exec_num }}</span></div>
            <div>最后执行时间: <span>{{ row.last_exec_time }}</span></div>
            <div>最后执行结果: <el-tag v-if="row.last_exec_result" :type="row.last_exec_result == 1 ? 'success' : 'danger'">{{ row.last_exec_result == 1 ? '成功' : '失败' }}</el-tag></div>
          </template>
        </el-table-column>
        <el-table-column label="当前状态">
          <template #default="{ row }">
            <el-tag :type="row.exec_status == 1 ? 'info' : 'success'" effect="dark">{{ row.exec_status == 1 ? '等待中' : '执行中' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="create_time" width="140" />
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-link v-if="row.status == 1 && serverIsRunning" v-auth="$nodes.systemTask.exec" @click="$action([$nodes.systemTask.exec, {id: row.id}])">执行</el-link>
            <el-link v-auth="$nodes.systemTask.logList" type="info" @click="onLog(row)">日志</el-link>
            <el-link v-auth="$nodes.systemTask.edit" type="primary" @click="onEdit(row)">编辑</el-link>
            <el-link v-if="row.status === 1" v-auth="$nodes.systemTask.modifyStatus" @click="$action([$nodes.systemTask.modifyStatus, {id: row.id, enable: 0}, refreshList])" type="warning">禁用</el-link>
            <el-link v-else v-auth="$nodes.systemTask.modifyStatus" @click="$action([$nodes.systemTask.modifyStatus, {id: row.id, enable: 1}, refreshList])" type="success">启用</el-link>
            <el-popconfirm title="确定要删除这条数据吗？" class="delete-btn" @confirm="$action([$nodes.systemTask.del, { id: row.id }])">
              <template #reference>
                <el-link v-auth="$nodes.systemTask.del" type="danger">删除</el-link>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </template>
    </data-list>
    <form-dialog ref="form" :rules="formRules" @on-save="onSave">
      <template #default="{ row }">
        <el-form-item label="任务名称" prop="title">
          <el-input v-model="row.title" />
        </el-form-item>
        <el-form-item label="任务指令" prop="command">
          <el-input v-model="row.command" />
        </el-form-item>
        <el-form-item label="指令参数" prop="params">
          <el-input v-model="row.params" />
        </el-form-item>
        <el-form-item label="任务类型" prop="type">
          <el-radio-group v-model="row.type">
            <el-radio-button :label="1">定时执行</el-radio-button>
            <el-radio-button :label="2">手动执行</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="row.type === 1" label="定时参数" prop="crontab">
          <el-input v-model="row.crontab" />
        </el-form-item>
      </template>
    </form-dialog>
    <el-dialog
      title="执行日志"
      v-model="execLogOpened"
      width="60%"
      :destroy-on-close="true"
    >
    <data-list :node="$nodes.systemTask.logList" :extend-query="{ stid: execLogId }" :hide-search="true">
      <template #list-column>
        <el-table-column label="ID" prop="id" />
        <el-table-column label="进程ID" prop="pid" />
        <el-table-column label="运行时长">
          <template #default="{ row }">
            {{ row.run_time }} S
          </template>
        </el-table-column>
        <el-table-column label="执行结果">
          <template #default="{ row }">
            <el-tag v-if="row.result == 2" type="danger" size="small" effect="dark">失败</el-tag>
            <el-tag v-else-if="row.result == 1" type="success" size="small" effect="dark">成功</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="onOutput(row)">输出内容</el-button>
          </template>
        </el-table-column>
      </template>
    </data-list>
      <template #footer>
        <el-button @click="execLogOpened = false">关闭</el-button>
      </template>
    </el-dialog>
    <el-dialog
      title="输出"
      v-model="outputOpened"
      width="50%"
      custom-class="task-log-dialog"
    >
      <el-scrollbar class="task-log-output">
        <div v-html="getOutput" />
      </el-scrollbar>
      <template #footer>
        <el-button @click="outputOpened = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SystemTask',
  data() {
    var validCrontab = (rule, value, callback) => {
      if (this.getForm.row.type === 1 && !value) {
        callback(new Error('请输入定时参数'))
      } else {
        callback()
      }
    }
    return {
      serverIsRunning: false,
      serverCommand: '',
      interVal: null,
      formRules: {
        title: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
        command: [{ required: true, message: '请输入任务指令', trigger: 'blur' }],
        type: [{ required: true, message: '请选择任务类型', trigger: 'blur' }],
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
  created() {
    this.getStatus()
    this.interVal = setInterval(() => {
      this.getStatus()
    }, 10000)
  },
  unmounted() {
    clearInterval(this.interVal)
  },
  computed: {
    getForm() {
      return this.$refs['form']
    },
    getOutput() {
      return this.output.replace(/(\r\n|\r|\n)/g, '<br/>')
    }
  },
  methods: {
    refreshList() {
      return this.$refs['data-list'].refresh()
    },
    getStatus() {
      this.$get(this.$nodes.systemTask.status).then(({ map }) => {
        const { running, command } = map
        this.serverIsRunning = running
        this.serverCommand = command
      })
    },
    copyCommand() {
      this.$copyText(this.serverCommand).then(() => {
        this.$message.success('复制成功')
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
        title: row.id,
        command: row.command,
        params: row.params,
        type: row.type,
        crontab: row.crontab
      })
    },
    onSave(row, shutDown) {
      const loading = this.$loading()
      const node = row.id ? this.$nodes.systemTask.edit : this.$nodes.systemTask.add
      this.$post(node, row).then(() => {
        this.$message.success('保存成功')
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
