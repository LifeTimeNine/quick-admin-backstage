<template>
  <div>
    <!--
      node 获取数据的节点
      hide-search 是否隐藏搜索框 （默认 false）
      hide-pagination 是否隐藏分页选择器 （默认 false）
      extend-query 扩展查询参数
      extend-query-refresh 扩展参数刷新时是否自动刷新列表 （默认true）
     -->
    <data-list
      ref="data-list"
      :node="$nodes.systemActionLog.list"
      :hide-search="false"
      :hide-pagination="false"
      :extend-query="{ id }"
      :extend-query-refresh="true"
    >
      <!--
        搜索框查询参数插槽，使用form-item组件
        !!! 参数可直接使用 options.xxx
       -->
      <template #search="{ options }">
        <el-form-item>
          <el-input v-model="options.node" placeholder="节点" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="options.username" placeholder="用户名" />
        </el-form-item>
      </template>
      <!--
        数据列表列配置插槽
        !!! 列使用 el-table-column 组件配置
       -->
      <template #list-column>
        <el-table-column label="ID" prop="id" min-width="35" />
        <el-table-column label="操作人">
          <template #default="{ row }">
            <span>{{ row.systemUser.username }}</span>
          </template>
        </el-table-column>
        <el-table-column label="权限节点" prop="node" />
        <el-table-column label="操作名称" prop="node_title" />
        <el-table-column label="请求时间" prop="request_time" width="135" />
        <el-table-column label="请求地址" prop="request_ip" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" @click="detail(row)">详情</el-button>
          </template>
        </el-table-column>
      </template>
    </data-list>
    <el-button type="primary" @click="refresh">刷新</el-button>
    <el-button type="primary" @click="getList">获取列表数据</el-button>
  </div>
</template>

<script>

export default {
  name: 'DemoDataList',
  data() {
    return {
      id: null
    }
  },
  methods: {
    refresh() {
      this.$refs['data-list'].refresh()
    },
    getList() {
      console.log(this.$refs['data-list'].getList())
    },
    detail(row) {
      console.log(row)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
