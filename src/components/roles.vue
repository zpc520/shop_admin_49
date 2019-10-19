<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-button class="myAddBtn" @click="showAddRoles" plain type="success">添加角色</el-button>
    <!-- 角色表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="expand">
        <template v-slot:default="{row}">
          <el-row class="l1" v-for="l1 in row.children" :key="l1.id">
            <el-col :span="4">
              <el-tag @close="delRoles(row,l1.id)" closable>{{l1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="l2 in l1.children" :key="l2.id">
                <el-col :span="6">
                  <el-tag
                    @close="delRoles(row,l2.id)"
                    closable
                    class="l2"
                    type="success"
                  >{{l2.authName}}</el-tag>
                </el-col>
                <el-col :span="18">
                  <el-tag
                    class="l3"
                    closable
                    @close="delRoles(row,l3.id)"
                    v-for="l3 in l2.children"
                    :key="l3.id"
                    type="warning"
                  >{{l3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="描述"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{row}">
          <el-button @click="showEditDia(row)" size="small" type="primary" plain icon="el-icon-edit"></el-button>
          <el-button size="small" type="danger" plain icon="el-icon-delete"></el-button>
          <el-button size="small" type="success" plain icon="el-icon-check">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加模态框 -->
    <el-dialog @close='closeDia' title="添加角色" :visible.sync="dialogVisible" width="40%">
      <el-form ref="form" :model="form" label-width="80px" :rules="rules" status-icon>
        <el-form-item label="角色名称" prop="roleName">
          <el-input placeholder="请输入角色名称" v-model="form.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input placeholder="请输入角色描述" v-model="form.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑模态框 -->
    <el-dialog @close='closeEdit' title="添加角色" :visible.sync="eidtVisible" width="40%">
      <el-form ref="editform" :model="editform" label-width="80px" :rules="rules" status-icon>
        <el-form-item label="角色名称" prop="roleName">
          <el-input placeholder="请输入角色名称" v-model="editform.roleName">{{this.editform.username}}</el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input placeholder="请输入角色描述" v-model="editform.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="eidtVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: ['blur', 'change'] }
        ],
        roleDesc: [
          { required: true, message: '角色描述不能为空', trigger: ['blur', 'change'] }
        ]
      },
      tableData: [],
      dialogVisible: false,
      eidtVisible: false,
      form: {
        roleName: '',
        roleDesc: ''
      },
      editform: {
        roleName: '',
        roleDesc: ''
      }
    }
  },
  methods: {
    async getUserList () {
      const { meta, data } = await this.$axios.get('roles')
      if (meta.status === 200) {
        this.tableData = data
      } else {
        console.log(meta.msg)
      }
    },
    async delRoles (row, rolesId) {
      const { meta, data } = await this.$axios.delete(
        `roles/${row.id}/rights/${rolesId}`
      )
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        row.children = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    showAddRoles () {
      this.dialogVisible = true
    },
    showEditDia (row) {
      this.eidtVisible = true
      this.editform.roleName = row.roleName
      this.editform.roleDesc = row.roleDesc
      this.editform.id = row.id
    },
    async addRoles () {
      const { meta } = await this.$axios.post('roles', this.form)
      if (meta.status === 201) {
        this.dialogVisible = false
        this.$message.success(meta.msg)
        this.$refs.form.resetFields()
        this.getUserList()
      } else {
        this.$message.error(meta.msg)
      }
    },
    editRoles () {

    },
    closeDia () {
      this.$refs.form.resetFields()
    },
    closeEdit () {
      this.$refs.editform.resetFields()
    }
  },
  created () {
    this.getUserList()
  }
}
</script>

<style lang='scss'>
.roles {
  .myAddBtn {
    margin-bottom: 10px;
  }
  .l1 {
    border-bottom: 1px dotted #ccc;
    margin-bottom: 5px;
    margin-top: 5px;
  }
  .l2 {
    margin-right: 5px;
    margin-bottom: 5px;
  }
  .l3 {
    margin-right: 5px;
    margin-bottom: 5px;
  }
  .el-form {
    margin: 0 auto;
    padding: 0;
    width: 94%;
  }
}
</style>
