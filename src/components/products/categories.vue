<template>
  <div class="categories">
    <!-- 添加分类按钮 -->
    <el-button @click="showAddCate" type="success" plain class="addBtn">添加分类</el-button>
    <!-- 分类表格 -->
    <el-table
      row-key="cat_id"
      v-loading="loading"
      element-loading-text="拼命加载中"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column prop="cat_name" label="分类名称"></el-table-column>

      <el-table-column label="是否有效">
        <template v-slot:default="{row}">{{row.cat_deleted? '否' :'是'}}</template>
      </el-table-column>
      <el-table-column prop="cat_level" label="层级"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{row}">
          <el-button type="primary" icon="el-icon-edit" plain size="small"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="small"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页功能 -->
    <el-pagination
      class="mypagination"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加分类模态框 -->
    <el-dialog title="添加分类" :visible.sync="dialogVisible" width="40%">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input placeholder="请输入分类名称" v-model="form.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <el-cascader :props='props' v-model="form.cat_pid"  :options="options"></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created () {
    this.getCateList()
  },
  data () {
    return {
      rules: {
        cat_name: [
          {
            required: true,
            message: '分类名称不能为空',
            trigger: ['blur', 'change']
          }
        ]
      },
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      options: [],
      tableData: [],
      pagenum: 1,
      pagesize: 5,
      total: 0,
      dialogVisible: false,
      loading: true,
      form: {
        cat_pid: [],
        cat_name: '',
        cat_level: ''
      }
    }
  },
  methods: {
    async getCateList () {
      const res = await this.$axios.get('categories', {
        params: {
          type: '3',
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (res) {
        this.loading = false
      }
      if (res.meta.status === 200) {
        this.tableData = res.data.result
        this.total = res.data.total
      } else {
        this.$message.error(res.meta.msg)
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getCateList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getCateList()
    },
    async showAddCate () {
      this.dialogVisible = true
      const { meta, data } = await this.$axios.get('categories?type=2')
      if (meta.status === 200) {
        this.options = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    async addCate () {
      try {
        await this.$refs.form.validate()
        const { meta } = await this.$axios.post('categories', {
          cat_name: this.form.cat_name,
          cat_pid: this.form.cat_pid[this.form.cat_pid.length - 1] || 0,
          cat_level: this.form.cat_pid.length
        })
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.dialogVisible = false
          this.getCateList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang='scss'>
.categories {
  .addBtn {
    margin-bottom: 10px;
  }
  .mypagination {
    margin-top: 10px;
  }
  .el-form {
    margin: 0 auto;
    padding: 0;
    width: 94%;
  }
}
</style>
