<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @click="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <change-language v-if="isMultiLang">
        <svg-icon icon-class="language" class="language" />
      </change-language>

      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <el-avatar size="large" shape="square" :src="userInfo.avatar" fit="fill">{{ userInfo.username }}</el-avatar>
          <svg-icon icon-class="caret-bottom" class="svg-icon" />
        </div>
        <template #dropdown>
          <el-dropdown-menu class="user-dropdown">
            <el-dropdown-item @click="onRefresh">{{ $t('refresh_info') }}</el-dropdown-item>
            <el-dropdown-item divided @click="openEditUserInfo">{{ $t('personal_data') }}</el-dropdown-item>
            <el-dropdown-item @click="openModifyPwdForm">{{ $t('modify_pwd') }}</el-dropdown-item>
            <el-dropdown-item divided @click="logout">{{ $t('logout') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <form-dialog ref="info" @on-save="saveUserInfo">
      <template #default="{ row }">
        <el-form-item :label="$t('avatar')" prop="avatar">
          <upload v-model="row.avatar" accept="image/*" type="image" :image-width="80" :image-height="80" style="margin-left: 10px" />
        </el-form-item>
        <el-form-item :label="$t('username')" prop="username">
          <el-input v-model="row.username" disabled />
        </el-form-item>
        <el-form-item :label="$t('name')" prop="name">
          <el-input v-model="row.name" disabled />
        </el-form-item>
        <el-form-item :label="$t('mobile')" prop="mobile">
          <el-input v-model="row.mobile" />
        </el-form-item>
        <el-form-item :label="$t('email')" prop="email">
          <el-input v-model="row.email" />
        </el-form-item>
      </template>
    </form-dialog>

    <form-dialog ref="pwd" @on-save="savePwd">
      <template #default="{ row }">
        <el-form-item :label="$t('old_pwd')">
          <el-input v-model="row.old_password" type="password" />
        </el-form-item>
        <el-form-item :label="$t('new_pwd')">
          <el-input v-model="row.new_password" type="password" />
        </el-form-item>
        <el-form-item :label="$t('confirm_pwd')">
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
import { editUserInfo, modifyPwd, refresh } from '@/apis/modules/systemUser'
import ChangeLanguage from '@/components/ChangeLanguage'
import { multiLang } from '@/settings'

export default {
  name: 'NavBar',
  components: {
    Breadcrumb,
    Hamburger,
    ChangeLanguage
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'userInfo'
    ]),
    isMultiLang() {
      return multiLang
    }
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
      }, this.$t('edit_personal_data'))
    },
    saveUserInfo(row, shutDown) {
      const loading = this.$loading()
      editUserInfo(row).then(() => {
        this.$message.success(this.$t('save_success'))
        window.location.reload()
        shutDown()
      }).finally(() => {
        loading.close()
      })
    },
    openModifyPwdForm() {
      this.getPwd().open({}, this.$t('modify_pwd'))
    },
    savePwd(row, shutDown) {
      const loading = this.$loading()
      modifyPwd({
        old_password: SparkMD5.hash(row.old_password),
        new_password: SparkMD5.hash(row.new_password),
        confirm_password: SparkMD5.hash(row.confirm_password)
      }).then(() => {
        this.$message.success(this.$t('pwd_modify_success'))
        shutDown()
      }).finally(() => {
        loading.close()
      })
    },
    onRefresh() {
      refresh().then(async() => {
        await this.$store.dispatch('user/getUserInfo')
        await this.$store.dispatch('user/getMenu')
        this.$message.success(this.$t('refresh_success'))
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
    .language {
      line-height: 50px;
      color: var(--el-text-color-regular);
      font-size: 24px;
      margin-right: 1em;
      cursor: pointer;
      &:hover {
        opacity: 0.85;
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
