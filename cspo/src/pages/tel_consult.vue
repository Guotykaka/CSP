<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <el-header height="30">
        <el-row style="margin-top: 20px;">
          <el-col :span="24" :offset="0">
            <el-form :inline="true" :model="formInline" class="" style="height:30px;">
              <el-form-item>
                <el-input size="small" placeholder="用户名"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button size="small" icon="el-icon-search">查询</el-button>
              </el-form-item>
              <el-form-item>
                <el-button size="small" type="primary" icon="el-icon-plus" @click="dialogAddVisible = true">新增</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>

      </el-header>
      <el-main>
        <!-- 查看 -->
        <el-dialog title="查看" :visible.sync="dialogTableVisible" width=40%>
          <el-form :model="form">
            <el-form-item label="用户名:" :label-width="formLabelWidth">
              <el-col :span="10">
                <el-input v-model="form.name" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="邮箱:" :label-width="formLabelWidth">
              <el-col :span="10">
                <el-input v-model="form.name" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="手机号:" :label-width="formLabelWidth">
              <el-col :span="10">
                <el-input v-model="form.name" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="所属部门:" :label-width="formLabelWidth">
              <el-col :span="10">
                <el-input v-model="form.name" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="角色:" :label-width="formLabelWidth">
              <template>
                <el-checkbox-group v-model="checkList">
                  <el-checkbox label="医生角色"></el-checkbox>
                  <el-checkbox label="运营人员"></el-checkbox>
                  <el-checkbox label="健管师"></el-checkbox>
                  <el-checkbox label="医生主任" disabled></el-checkbox>
                  <br>

                  <el-checkbox label="产品" disabled></el-checkbox>
                  <el-checkbox label="邵勇-角色"></el-checkbox>
                  <el-checkbox label="sai医生角色"></el-checkbox>
                  <el-checkbox label="媒体号"></el-checkbox>
                  <br>
                  <el-checkbox label="内容编辑"></el-checkbox>
                  <el-checkbox label="市场部"></el-checkbox>
                </el-checkbox-group>
              </template>
            </el-form-item>
            <el-form-item label="状态:" :label-width="formLabelWidth">
              <template>
                <el-radio v-model="radio" label="1">禁用</el-radio>
                <el-radio v-model="radio" label="2">正常</el-radio>
              </template>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogTableVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogTableVisible = false">确 定</el-button>
          </div>
        </el-dialog>

        <!-- 修改 -->
        <el-dialog title="修改" :visible.sync="dialogFormVisible" width=40%>
          <el-form :model="form">
            <el-form-item label="用户名:" :label-width="formLabelWidth">
              <el-col :span="10">
                <el-input v-model="form.name" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="邮箱:" :label-width="formLabelWidth">
              <el-col :span="10">
                <el-input v-model="form.name" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="手机号:" :label-width="formLabelWidth">
              <el-col :span="10">
                <el-input v-model="form.name" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="所属部门:" :label-width="formLabelWidth">
              <el-col :span="10">
                <el-input v-model="form.name" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="角色:" :label-width="formLabelWidth">
              <template>
                <el-checkbox-group v-model="checkList">
                  <el-checkbox label="医生角色"></el-checkbox>
                  <el-checkbox label="运营人员"></el-checkbox>
                  <el-checkbox label="健管师"></el-checkbox>
                  <el-checkbox label="医生主任" disabled></el-checkbox>
                  <br>

                  <el-checkbox label="产品" disabled></el-checkbox>
                  <el-checkbox label="邵勇-角色"></el-checkbox>
                  <el-checkbox label="sai医生角色"></el-checkbox>
                  <el-checkbox label="媒体号"></el-checkbox>
                  <br>
                  <el-checkbox label="内容编辑"></el-checkbox>
                  <el-checkbox label="市场部"></el-checkbox>
                </el-checkbox-group>
              </template>
            </el-form-item>
            <el-form-item label="状态:" :label-width="formLabelWidth">
              <template>
                <el-radio v-model="radio" label="1">禁用</el-radio>
                <el-radio v-model="radio" label="2">正常</el-radio>
              </template>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 新增 -->
        <el-dialog title="新增" :visible.sync="dialogAddVisible" width=40%>
          <el-form :model="form">
            <el-form-item label="用户名:" :label-width="formLabelWidth">
              <el-col :span="10">
                <el-input v-model="form.name" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="邮箱:" :label-width="formLabelWidth">
              <el-col :span="10">
                <el-input v-model="form.name" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="手机号:" :label-width="formLabelWidth">
              <el-col :span="10">
                <el-input v-model="form.name" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="所属部门:" :label-width="formLabelWidth">
              <el-col :span="10">
                <el-input v-model="form.name" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="角色:" :label-width="formLabelWidth">
              <template>
                <el-checkbox-group v-model="checkList">
                  <el-checkbox label="医生角色"></el-checkbox>
                  <el-checkbox label="运营人员"></el-checkbox>
                  <el-checkbox label="健管师"></el-checkbox>
                  <el-checkbox label="医生主任" disabled></el-checkbox>
                  <br>

                  <el-checkbox label="产品" disabled></el-checkbox>
                  <el-checkbox label="邵勇-角色"></el-checkbox>
                  <el-checkbox label="sai医生角色"></el-checkbox>
                  <el-checkbox label="媒体号"></el-checkbox>
                  <br>
                  <el-checkbox label="内容编辑"></el-checkbox>
                  <el-checkbox label="市场部"></el-checkbox>
                </el-checkbox-group>
              </template>
            </el-form-item>
            <el-form-item label="状态:" :label-width="formLabelWidth">
              <template>
                <el-radio v-model="radio" label="1">禁用</el-radio>
                <el-radio v-model="radio" label="2">正常</el-radio>
              </template>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogAddVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogAddVisible = false">确 定</el-button>
          </div>
        </el-dialog>
        <template>
          <el-table :data="tableData" border style="width: 100%" id="app">
            <el-table-column align="center" prop="Id" label="Id" width="50"></el-table-column>
            <el-table-column align="center" prop="name" label="用户名" width="100"></el-table-column>
            <el-table-column align="center" prop="address" label="所属部门"></el-table-column>
            <el-table-column align="center" prop="mail" label="邮箱"></el-table-column>
            <el-table-column align="center" prop="phone" label="手机号"></el-table-column>
            <el-table-column align="center" prop="state" label="状态">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium" type="success">{{ scope.row.state }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="creatTime" label="创建时间"></el-table-column>
            <el-table-column align="center" label="操作" width="350">
              <template slot-scope="scope">
                <el-button size="mini" type="info" @click="dialogFormVisible = true">查看</el-button>
                <el-button size="mini" type="primary" @click="dialogTableVisible = true">修改</el-button>
                <el-button size="mini" type="danger" @click="deleteMessage()">删除</el-button>
                <el-button plain size="mini" type="warning" @click="deleteMessage()">重置密码</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-main>
      <el-footer height="30px">
        <el-row style="margin-top: 20%;">
          <el-col :span="24" :offset="6">
            <template>
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400">
              </el-pagination>
            </template>
          </el-col>
        </el-row>
      </el-footer>
    </div>
  </div>

</template>


<script>
import headerTop from '@/components/headTop.vue'
export default {
  components: {
    headerTop
  },
  data() {
    return {
      radio: '1',
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4,
      dialogFormVisible: false,
      dialogTableVisible: false,
      dialogAddVisible: false,
      checkList: ['选中且禁用', '复选框 A'],
      tableData: [
        {
          Id: 1,
          creatTime: '2016-05-02',
          name: 'admin',
          address: '好卓公司',
          phone: '13764009077',
          state: '正常',
          mail: '2508938@qq.com'
        },
        {
          Id: 2,
          creatTime: '2016-05-04',
          name: 'test',
          address: '技术部',
          phone: '13764009077',
          state: '正常',
          mail: '2508938@qq.com'
        },
        {
          Id: 3,
          creatTime: '2016-05-01',
          name: 'test2',
          address: '运营部',
          phone: '13764009077',
          state: '正常',
          mail: '2508938@qq.com'
        },
        {
          Id: 4,
          creatTime: '2016-05-03',
          name: 'doctor',
          address: '健管部',
          phone: '13764009077',
          state: '正常',
          mail: '2508938@qq.com'
        }
      ],

      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    deleteMessage() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'warning ',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style scoped>
</style>
