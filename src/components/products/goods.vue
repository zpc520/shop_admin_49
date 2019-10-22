<template>
  <div class="goods">
    <!-- 添加商品按钮 -->
    <el-button @click="goGoodsAdd" class="addProductBtn" type="success" plain>添加商品</el-button>
    <!-- 搜索框 -->
    <br>
      <el-input  placeholder="请输入内容" v-model="Pnp" class="input-with-select">
      <el-button slot="append" @click="serach" icon="el-icon-search"></el-button>
      </el-input>
    <!-- 表格模块 -->
    <el-table :data='productList'>
      <el-table-column type="index" :index="indexMethod"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column label="创建时间">
        <template v-slot:default='{row}'>
          {{row.add_time | time}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot:default='{row}'>
          <el-button type="primary" icon="el-icon-edit" plain size="small"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="small"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页功能 -->
     <el-pagination
      class="mypagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  created () {
    this.getProductList()
  },
  data () {
    return {
      Pnp: '',
      pagenum: 1,
      pagesize: 5,
      total: 0,
      productList: []
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getProductList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getProductList()
    },
    indexMethod (index) {
      return index + 1 + this.pagesize * (this.pagenum - 1)
    },
    async getProductList () {
      const { meta, data } = await this.$axios.get('goods', {
        params: {
          Pnp: this.Pnp,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (meta.status === 200) {
        this.total = data.total
        this.productList = data.goods
      } else {
        this.$message.error(meta.msg)
      }
    },
    goGoodsAdd () {
      this.$router.push('/goods-add')
    },
    async serach () {
      const { meta } = await this.$axios.get('goods', {
        params: {
          Pnp: this.Pnp,
          pagenum: 1,
          pagesize: this.pagesize
        }
      })
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.pagenum = 1
        this.getProductList()
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang='scss'>
.goods{
  .addProductBtn{
    margin-bottom: 10px;
  }
  .mypagination{
    margin-top: 10px;
  }
  .input-with-select{
    width: 300px;
    margin-right: 20px;
    margin-bottom: 10px
  }
}
</style>
