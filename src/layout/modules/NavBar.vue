<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <el-avatar size="large" shape="square" :src="userInfo.avatar" fit="fill">{{ userInfo.username }}</el-avatar>
          <svg-icon icon-class="caret-bottom" class="svg-icon" />
        </div>
        <template #dropdown >
          <el-dropdown-menu class="user-dropdown">
            <el-dropdown-item @click="onRefresh">刷新信息</el-dropdown-item>
            <el-dropdown-item divided @click="openEditUserInfo">个人资料</el-dropdown-item>
            <el-dropdown-item @click="openModifyPwdForm">修改密码</el-dropdown-item>
            <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <form-dialog ref="info" @on-save="saveUserInfo">
      <template #default="{ row }">
        <el-form-item label="头像" prop="avatar">
          <el-avatar :size="60" shape="square" :src="row.avatar" fit="fill" />
          <upload v-model="row.avatar" accept="image/*" style="margin-left: 10px" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="row.username" disabled />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="row.name" disabled />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="row.mobile" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="row.email" />
        </el-form-item>
      </template>
    </form-dialog>

    <form-dialog ref="pwd" @on-save="savePwd">
      <template #default="{ row }">
        <el-form-item label="原密码">
          <el-input v-model="row.old_password" type="password" />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="row.new_password" type="password" />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="row.confirm_password" type="password" />
        </el-form-item>
      </template>
    </form-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from './Breadcrumb'
import Hamburger from './Hamburger'
import SparkMD5 from 'spark-md5'

export default {
  name: 'navBar',
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'userInfo'
    ])
  },
  methods: {
    getInfo() {
      return this.$refs['info']
    },
    getPwd() {
      return this.$refs['pwd']
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    openEditUserInfo() {
      this.userInfoForm = Object.assign({}, this.userInfo)
      this.editUserInfoOpened = true
      this.getInfo().open({
        avatar: this.userInfo.avatar,
        username: this.userInfo.username,
        name: this.userInfo.name,
        mobile: this.userInfo.mobile,
        email: this.userInfo.email
      }, '编辑用户信息')
    },
    saveUserInfo(row, shutDown) {
      const loading = this.$loading()
      this.$post(this.$nodes.systemUser.editUserInfo ,row).then(() => {
        this.$message.success('保存成功')
      }).finally(() => {
        loading.close()
        shutDown()
        window.location.reload()
      })
    },
    openModifyPwdForm() {
      this.getPwd().open({}, '修改密码')
    },
    savePwd(row, shutDown) {
      const loading = this.$loading()
      this.$post(this.$nodes.systemUser.modifyPwd, {
        old_password: SparkMD5.hash(row.old_password),
        new_password: SparkMD5.hash(row.new_password),
        confirm_password: SparkMD5.hash(row.confirm_password)
      }).then(() => {
        this.$message.success('密码已修改，下次登录请使用新密码')
        shutDown()
      }).finally(() => {
        loading.close()
      })
    },
    onRefresh() {
      this.$get(this.$nodes.systemUser.refresh).then(async() => {
        await this.$store.dispatch('user/getUserInfo')
        await this.$store.dispatch('user/getMenu')
        this.$message.success('刷新成功')
      })
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
      margin-right: 5px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: inline-flex;
        align-items: flex-end;

        .el-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
        }

        .svg-icon {
          cursor: pointer;
          font-size: 14px;
        }
      }
    }
  }
}
.upload-progress {
  display: flex;
  align-items: center;
  justify-content: space-between;
  span {
    color: #909399;
    font-size: 12px;
  }
  .el-progress {
    width: 60%;
  }
}
</style>
