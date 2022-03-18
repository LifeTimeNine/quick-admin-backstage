<template>
  <div>
      <el-form :model="queryOptions" ref="form" :inline="true">
        <slot name="search" :options="queryOptions" />
        <el-form-item>
          <el-button type="primary" @click="refresh" title="搜索">搜索</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="actions">
        <slot name="actions" />
      </div>
      <el-table
        v-loading="tableLoading"
        :data="list"
        border
        stripe
        @sort-change="sortChange"
      >
        <template #default>
          <slot name="list-column" />
        </template>
      </el-table>
      <el-pagination
        v-if="!hidePagination"
        v-model:current-page="queryOptions.page"
        v-model:page-size="queryOptions.limit"
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
  limit: 10,
  order_rule: ''
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
    pageSizeChange() {
      this.refresh()
    },
    pageChange() {
      this.refresh()
    },
    getList() {
      return this.list
    },
    sortChange({ prop, order }) {
      if (prop) {
        this.queryOptions.order_rule = `${prop}.${order === 'ascending' ? 'asc' : 'desc'}`
      } else {
        this.queryOptions.order = null
      }
      this.refresh()
    }
  }
}
</script>

<style lang="scss" scoped>
.actions :deep(){
  text-align: right;
  &>* {
    margin-bottom: 10px;
  }
}

.el-table :deep() {
  margin-bottom: 10px;
  .el-table__row {
    .cell {
      &>.el-link:nth-child(n+2) {
        margin-left: 1em;
      }
    }
  }
}
</style>