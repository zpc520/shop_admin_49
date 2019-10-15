<template>
  <div class="users">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">用户管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template v-slot:default='obj'>
        <el-switch v-model="obj.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <el-button plain size="small" type="primary" icon="el-icon-edit"></el-button>
        <el-button plain size="small" type="danger" icon="el-icon-delete"></el-button>
        <el-button plain size="small" type="success" icon="el-icon-check">分配角色</el-button>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 4,
      tableData: []
    }
  },
  methods: {
    getUserList () {
      axios
        .get('http://localhost:8888/api/private/v1/users', {
          params: {
            query: this.query,
            pagenum: this.pagenum,
            pagesize: this.pagesize
          },
          headers: {
            Authorization: localStorage.getItem('token')
          }
        })
        .then(res => {
          const { meta, data } = res.data
          if (meta.status === 200) {
            this.tableData = data.users
          } else {
            this.$message.error(meta.msg)
          }
        })
    }
  },
  created () {
    this.getUserList()
  }
}
</script>

<style>
</style>
