<template>
  <div class="login">
    <el-form ref="form" :model="form" label-width="80px" :rules="rules" status-icon>
      <img class="avatar" src="../assets/avatar.jpg" alt />
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="mybtn" type="primary" @click="login">登录</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          // required 非空校验
          // message 提示消息
          // trigger 触发条件
          // min 和 max 长度校验
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 12, message: '用户名长度必须在3-12位', trigger: ['change', 'blur'] }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 3, max: 12, message: '密码长度必须在3-12位', trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  methods: {
    reset () {
      this.$refs.form.resetFields()
    },
    login () {
      this.$refs.form.validate(isValid => {
        if (!isValid) return
        axios({
          method: 'post',
          url: 'http://localhost:8888/api/private/v1/login',
          data: this.form
        }).then(res => {
          const { meta, data } = res.data
          console.log(res)
          localStorage.setItem('token', data.token)
          const token = localStorage.getItem('token')
          console.log(token)
          if (meta.status === 200) {
            this.$message({
              message: meta.msg,
              type: 'success',
              duration: 1000
            })
            this.$router.push('/index')
          } else {
            this.$message({
              message: meta.msg,
              type: 'error',
              duration: 1000
            })
          }
        })
      })
    }
  }
}
</script>

<style lang='scss'>
.login {
  background-color: #2d434c;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.el-form {
  width: 400px;
  padding: 20px;
  padding-top: 75px;
  background-color: #fff;
  border-radius: 20px;
  margin: 0 auto;
  margin-top: 160px;
  position: relative;
  .mybtn {
    margin-right: 90px;
  }
  .avatar {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: -75px;
    border: 5px solid #fff;
    border-radius: 50%;
  }
}
</style>
