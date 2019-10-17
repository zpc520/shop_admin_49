<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        用户管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        用户列表
      </el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
     <el-input placeholder="请输入搜索关键字" v-model="query" class="input-with-select">
      <el-button @click="serach" slot="append" icon="el-icon-search"></el-button>
    </el-input>
      <el-button plain type='success'>添加用户</el-button>
    <!-- 表格区域 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template v-slot:default='obj'>
        <el-switch v-model="obj.row.mg_state" @change='changeState(obj.row)' active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot:default='obj'>
        <el-button plain size="small" type="primary" icon="el-icon-edit"></el-button>
        <el-button @click='delUser(obj.row)' plain size="small" type="danger" icon="el-icon-delete"></el-button>
        <el-button plain size="small" type="success" icon="el-icon-check">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页功能 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      :current-page='pagenum'
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total='total'>
    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 2,
      tableData: [],
      total: 0
    }
  },
  methods: {
    async getUserList () {
      const { meta, data } = await this.$axios
        .get('users', {
          params: {
            query: this.query,
            pagenum: this.pagenum,
            pagesize: this.pagesize
          },
          headers: {
            // Authorization: localStorage.getItem('token')
          }
        })
      if (meta.status === 200) {
        this.tableData = data.users
        this.total = data.total
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getUserList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getUserList()
    },
    serach () {
      this.pagenum = 1
      this.getUserList()
    },
    async delUser (row) {
      try {
        await this.$confirm('亲，您确定要删除该用户吗？', '温馨提示', {
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`users/${row.id}`)
        if (meta.status === 200) {
          if (this.tableData.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          this.getUserList()
          this.$message.success(meta.msg)
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async changeState (row) {
      try {
        const { meta } = await this.$axios.put(`users/${row.id}/state/${row.mg_state}`)
        if (meta.status === 200) {
          this.$message.success('设置成功')
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    }

  },
  created () {
    this.getUserList()
  }
}
</script>

<style lang='scss'>
.users{
  .el-breadcrumb{
    height: 40px;
    line-height: 40px;
    margin: 10px;
    border-bottom: 1px solid #ccc;
  }
  .input-with-select{
    width: 300px;
    margin-right: 20px;
    margin-bottom: 10px;
  }
  .el-pagination{
    margin-top: 10px;
  }
}
</style>
