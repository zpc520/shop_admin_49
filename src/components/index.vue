<template>
  <el-container class="index">
    <!-- 头部区域 -->
    <el-header>
      <div class="logo">
        <img src="../assets/logo.png" alt />
      </div>
      <div class="title">
        <h1>电商后台管理系统</h1>
      </div>
      <div class="logout">
        欢迎光临~
        <a @click="logout" href="javascript:;">退出</a>
      </div>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 侧导航栏 -->
      <el-aside width="200px">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
        >
            <!-- 用户管理 -->
          <el-submenu index="1">
            <template v-slot:title>
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>

              <el-menu-item index="1-1">
                <i class="el-icon-menu"></i>用户列表
              </el-menu-item>

          </el-submenu>
            <!-- 权限管理 -->
          <el-submenu index="2">
            <template v-slot:title>
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>

              <el-menu-item index="2-1">
                <i class="el-icon-menu"></i>角色列表
              </el-menu-item>

              <el-menu-item index="2-2">
                <i class="el-icon-menu"></i>权限列表
              </el-menu-item>

          </el-submenu>
        </el-menu>

      </el-aside>
      <!-- main区域 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    logout () {
      this.$confirm('亲，您确定要退出系统吗', '温馨提示', {
        type: 'warning'
      })
        .then(() => {
          this.$message.success('恭喜您退出成功')
          // 清除本地保存的token退出登录
          localStorage.removeItem('token')
          // 跳转页面
          this.$router.push('/login')
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang='scss'>
.index {
  height: 100%;
  .el-header {
    background-color: #d8d8d8;
    display: flex;
    .logo {
      width: 180px;
      img {
        height: 40px;
        margin: 10px;
      }
    }
    .title {
      flex: 1;
      text-align: center;
      line-height: 60px;
      h1 {
        color: #545c64;
      }
    }
    .logout {
      width: 180px;
      line-height: 60px;
      text-align: right;
      font-weight: 700;
      a {
        color: orange;
      }
    }
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-main {
    background-color: #ecf0f1;
  }
}
</style>
