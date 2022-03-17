<template>
  <div>
    <div class="header" :class="{ 'hide-search': hideSearch }">
      <div v-if="!hideSearch" class="search">
        <slot name="search" :options="queryOptions" />
        <el-button type="primary" size="small" @click="refresh">搜索</el-button>
        <el-button size="small" @click="resetQuery">重置</el-button>
      </div>
      <div class="actions">
        <slot name="actions" />
      </div>
    </div>
    <el-table v-loading="tableLoading" :data="list" border stripe size="small">
      <template #default>
        <slot name="list-column" />
      </template>
    </el-table>
    <el-pagination
      v-if="!hidePagination"
      small
      :current-page="queryOptions.page"
      :page-size="queryOptions.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background
      :pager-count="7"
      @size-change="pageSizeChange"
      @current-change="pageChange"
      @prev-click="pageChange"
      @next-click="pageChange"
    />
  </div>
</template>

<script>
const defaultQueryOptions = {
  page: 1,
  limit: 10
}
export default {
  name: 'DataList',
  props: {
    hideSearch: {
      type: Boolean,
      default: false
    },
    hidePagination: {
      type: Boolean,
      default: false
    },
    node: {
      type: String,
      required: true
    },
    extendQuery: {
      type: Object,
      default() {
        return {}
      }
    },
    extendQueryRefresh: {
      deep: true,
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      tableLoading: false,
      queryOptions: Object.assign({}, defaultQueryOptions),
      list: [],
      total: 0
    }
  },
  watch: {
    extendQuery() {
      if (this.extendQueryRefresh) {
        this.refresh()
      }
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    refresh() {
      this.$nextTick(() => {
        this.tableLoading = true
        this.$get(this.node, Object.assign({}, this.extendQuery, this.queryOptions)).then(({ items, limit, page, total }) => {
          this.list = items
          this.total = total
          this.queryOptions.limit = limit
          this.queryOptions.page = page
        }).finally(() => {
          this.tableLoading = false
        })
      })
    },
    resetQuery() {
      this.queryOptions = Object.assign({}, defaultQueryOptions)
      this.refresh()
    },
    pageSizeChange(size) {
      this.queryOptions.limit = size
      this.refresh()
    },
    pageChange(page) {
      this.queryOptions.page = page
      this.refresh()
    },
    getList() {
      return this.list
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  &.hide-search {
    border: 0;
    padding: 0;
  }
  padding: 5px;
  border: 1px solid #DCDFE6;
  margin-bottom: 10px;
  position: relative;
  .search {
    display: inline-block;
    .el-input,
    .el-select,
    .el-date-picker {
      width: 150px;
      margin-right: 10px;
    }
  }
  .actions {
    float: right;
    margin-bottom: 10px;
  }
}

.el-table {
  margin-bottom: 10px;
}
</style>
