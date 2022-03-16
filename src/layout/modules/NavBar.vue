<template>
  <div class="navbar">
    <hamburger :is-active="sidebarOpened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <el-avatar size="large" shape="square" :src="userInfo.avatar" fit="fill">头像</el-avatar>
          <el-icon><caret-bottom /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu  class="user-dropdown">
          <el-dropdown-item>刷新信息</el-dropdown-item>
          <el-dropdown-item divided>个人资料</el-dropdown-item>
          <el-dropdown-item>修改密码</el-dropdown-item>
          <el-dropdown-item divided>退出登录</el-dropdown-item>
        </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import Hamburger from './Hamburger'
import Breadcrumb from './Breadcrumb'
import { mapGetters } from 'vuex'

export default {
  name: 'NavBar',
  components: {
    Hamburger,
    Breadcrumb
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'sidebarOpened'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 6px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: inline-flex;
        align-items: flex-end;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon{
          cursor: pointer;
          font-size: 14px;
          margin-left: 4px;
        }
        .el-avatar--large {
          cursor: pointer;
          --el-avatar-size: 40px;
        }
      }
    }
  }
}
</style>
