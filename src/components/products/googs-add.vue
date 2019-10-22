<template>
  <div class="goods-add">
    <!-- 进度条 -->
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>
    <!-- tab栏切换 -->
    <el-tabs tab-position="left" v-model="activeTab" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="0">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name" placeholder="请输入商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price" placeholder="请输入商品价格"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight" placeholder="请输入商品重量"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number" placeholder="请输入商品数量"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <!-- 三级级联 -->
            <el-cascader :props="props" v-model="form.goods_cat" :options="options"></el-cascader>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="next">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="1">
        <el-upload
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture-card"
          name="file"
          :headers="headers"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
        <el-button type="primary" @click="next">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="2">
        <quill-editor v-model="form.goods_introduce">
        </quill-editor>

        <el-button type="primary" @click="addAll">添加</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: false,
      dialogImageUrl: '',
      active: 0,
      options: [],
      activeTab: '0',
      headers: {
        Authorization: localStorage.getItem('token')
      },
      form: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: '',
        pics: [],
        goods_introduce: ''
      },
      props: {
        children: 'children',
        value: 'cat_id',
        label: 'cat_name'
      }
    }
  },
  async created () {
    this.getProductList()
  },
  methods: {
    async getProductList () {
      const { meta, data } = await this.$axios.get(`categories?type=3`)
      if (meta.status === 200) {
        this.options = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleClick (tab, event) {
      this.active = +tab.index
    },
    next () {
      this.active++
      this.activeTab = this.active + ''
    },
    handleSuccess (response, file, fileList) {
      if (response.meta.status === 200) {
        this.form.pics.push({ 'pic': response.data.tmp_path })
      } else {
        this.$message.error(response.meta.msg)
      }
    },
    handleRemove (file, fileList) {
      const path = file.response.data.tmp_path
      this.form.pics = this.form.pics.filter(item => {
        return item.pic !== path
      })
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    async addAll () {
      this.active++
      if (this.form.goods_name.trim() === '') {
        this.$message.error('请输入商品名称')
        return
      }
      const { meta } = await this.$axios.post('goods', {
        ...this.form,
        goods_cat: this.form.goods_cat.join(',')
      })
      if (meta.status === 201) {
        this.$message.success(meta.msg)
        this.$router.push('/goods')
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang='scss'>
.goods-add{
  .quill-editor{
    background-color: #fff;
    .ql-editor{
      min-height:300px;
    }
  }
}
</style>
