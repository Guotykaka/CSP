<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <el-header height="30">
        
      <el-row :gutter="20" class="m_b_15">
        <el-col :span="6">
          <el-input v-model="formInline.valueSS" placeholder="用户名"></el-input>
        </el-col>
       
        <el-col :span="6">
          <el-button type="primary">查询</el-button>
          <el-button type="primary" @click="handleAdd()">新增</el-button>
        </el-col>
      </el-row>
      </el-header>
      <el-main>
        <!-- 修改 -->
        <el-dialog title="修改" :visible.sync="dialogEditVisible" width=40%>
          <el-form :model="editTable">
            <el-form-item label="用户名:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-badge is-dot class="dot">
                  <el-input v-model="editTable.username" auto-complete="off" el></el-input>
                </el-badge>
              </el-col>
            </el-form-item>
            <el-form-item label="密码:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-badge is-dot class="dot">
                  <el-input v-model="editTable.password" auto-complete="off" placeholder="密码" el></el-input>
                </el-badge>
              </el-col>
            </el-form-item>
            <el-form-item label="邮箱:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-badge is-dot class="dot">
                  <el-input v-model="editTable.email" auto-complete="off" el></el-input>
                </el-badge>
              </el-col>
            </el-form-item>
            <el-form-item label="手机号:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-badge is-dot class="dot">
                  <el-input v-model="editTable.mobile" auto-complete="off" el></el-input>
                </el-badge>
              </el-col>
            </el-form-item>
            <el-form-item label="所属部门:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-badge is-dot class="dot">
                  <el-input v-model="editTable.deptName" auto-complete="off" el></el-input>
                </el-badge>
              </el-col>
            </el-form-item>
            <el-form-item label="角色:" :label-width="formLabelWidth">
              <template>
                <el-checkbox-group v-model="editTable.checkList">
                  <el-checkbox label="医生角色"></el-checkbox>
                  <el-checkbox label="运营人员"></el-checkbox>
                  <el-checkbox label="健管师"></el-checkbox>
                  <el-checkbox label="医生主任"></el-checkbox>
                  <br>

                  <el-checkbox label="产品"></el-checkbox>
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
              <template slot-scope="scope">
                <el-radio v-model="editTable.userType" label="0">禁用</el-radio>
                <el-radio v-model="editTable.userType" label="1">正常</el-radio>
              </template>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="_doCancel()">取 消</el-button>
            <el-button type="primary" @click="_doHandleEdit()">确 定</el-button>
          </div>
        </el-dialog>

        <!-- 查看 -->
        <el-dialog title="查看" :visible.sync="dialogCheckVisible" width=40%>
          <el-form :model="selectTable">
            <el-form-item label="用户名:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="selectTable.username" auto-complete="off" el readonly></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="邮箱:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="selectTable.email" auto-complete="off" el readonly></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="手机号:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="selectTable.mobile" auto-complete="off" el readonly></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="所属部门:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="selectTable.deptName" auto-complete="off" el readonly></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="角色:" :label-width="formLabelWidth">
              <template>
                <el-checkbox-group v-model="selectTable.checkList">
                  <el-checkbox label="医生角色" onclick="return false"></el-checkbox>
                  <el-checkbox label="运营人员" onclick="return false"></el-checkbox>
                  <el-checkbox label="健管师" onclick="return false"></el-checkbox>
                  <el-checkbox label="医生主任" onclick="return false"></el-checkbox>
                  <br>

                  <el-checkbox label="产品" onclick="return false"></el-checkbox>
                  <el-checkbox label="邵勇-角色" onclick="return false"></el-checkbox>
                  <el-checkbox label="sai医生角色" onclick="return false"></el-checkbox>
                  <el-checkbox label="媒体号" onclick="return false"></el-checkbox>
                  <br>
                  <el-checkbox label="内容编辑" onclick="return false"></el-checkbox>
                  <el-checkbox label="市场部" onclick="return false"></el-checkbox>
                </el-checkbox-group>
              </template>
            </el-form-item>
            <el-form-item label="状态:" :label-width="formLabelWidth">
              <template slot-scope="scope">
                <el-radio v-model="selectTable.userType" label="0" onclick="return false">禁用</el-radio>
                <el-radio v-model="selectTable.userType" label="1" onclick="return false">正常</el-radio>
              </template>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogCheckVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogCheckVisible = false">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 新增 -->
        <el-dialog title="新增" :visible.sync="dialogAddVisible" width=40%>
          <el-form :model="addTable">
            <el-form-item label="用户名:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-badge is-dot class="dot">
                  <el-input v-model="addTable.username" auto-complete="off" el></el-input>
                </el-badge>
              </el-col>
            </el-form-item>
            <el-form-item label="密码:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-badge is-dot class="dot">
                  <el-input v-model="addTable.password" auto-complete="off" placeholder="密码" el></el-input>
                </el-badge>
              </el-col>
            </el-form-item>
            <el-form-item label="邮箱:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-badge is-dot class="dot">
                  <el-input v-model="addTable.email" auto-complete="off" el></el-input>
                </el-badge>
              </el-col>
            </el-form-item>
            <el-form-item label="手机号:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-badge is-dot class="dot">
                  <el-input v-model="addTable.mobile" auto-complete="off" el></el-input>
                </el-badge>
              </el-col>
            </el-form-item>
            <el-form-item label="所属部门:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-badge is-dot class="dot">
                  <el-input v-model="addTable.deptName" auto-complete="off" el></el-input>
                </el-badge>
              </el-col>
            </el-form-item>
            <el-form-item label="角色:" :label-width="formLabelWidth">
              <template>
                <el-checkbox-group v-model="addTable.checkList">
                  <el-checkbox label="医生角色"></el-checkbox>
                  <el-checkbox label="运营人员"></el-checkbox>
                  <el-checkbox label="健管师"></el-checkbox>
                  <el-checkbox label="医生主任"></el-checkbox>
                  <br>

                  <el-checkbox label="产品"></el-checkbox>
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
              <template slot-scope="scope">
                <el-radio v-model="addTable.userType" label="0">禁用</el-radio>
                <el-radio v-model="addTable.userType" label="1">正常</el-radio>
              </template>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="_doAddCancel()">取 消</el-button>
            <el-button type="primary" @click="_doAdd()">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 列表 -->
        <template>
          <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" border style="width: 100%" id="app">
            <el-table-column align="center" prop="userId" type="index" label="Id" width="50"></el-table-column>
            <el-table-column align="center" prop="username" label="用户名" width="150"></el-table-column>
            <el-table-column align="center" prop="deptName" label="所属部门"></el-table-column>
            <el-table-column align="center" prop="email" label="邮箱"></el-table-column>
            <el-table-column align="center" prop="mobile" label="手机号"></el-table-column>
            <el-table-column align="center" label="状态">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium" type="success" v-if="scope.row.userType === '1'">正常</el-tag>
                  <el-tag size="medium" type="danger" v-if="scope.row.userType === '0'">禁用</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
            <el-table-column align="center" label="操作" width="350">
              <template slot-scope="scope">
                <el-button size="mini" type="info" @click="handleCheck(scope.$index, scope.row)">查看</el-button>
                <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                <el-button size="mini" type="danger" @click="deleteMessage(scope.$index, scope.row)">删除</el-button>
                <el-button plain size="mini" type="warning" @click="deleteCode(scope.$index, scope.row)">重置密码</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-main>
      <el-footer height="30px">
        <el-row style="margin-top: 2%;">
          <el-col :span="24" :offset="6">
            <template>
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[3, 5, 10]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
              </el-pagination>
            </template>
          </el-col>
        </el-row>
      </el-footer>
    </div>
  </div>

</template>


<script>
import { getUserlistData } from '@/api/getData.js'
import headerTop from '@/components/headTop.vue'
export default {
  components: {
    headerTop
  },
  data() {
    return {
      formInline:{valueSS:''},
      currentPage: 1, //分页初始页码
      pagesize: 5, //分页初始显示条数
      tableData: [], //列表数据
      selectTable: {}, //查看单个数据
      editTable: {}, //修改单个数据
      editTableRoot: {},
      addTable: {
        //新增单个数据
        userId: null,
        username: '',
        password: '',
        salt: '',
        email: '',
        mobile: '',
        status: 1,
        checkList: [],
        createTime: '2016-11-11 11:11:11',
        deptId: 1,
        deptName: '',
        userType: ''
      }, //新增单个数据
      dialogCheckVisible: false, //查看
      dialogEditVisible: false, //修改
      dialogAddVisible: false, //新增
      inde: null, //index flag
      formLabelWidth: '120px'
    }
  },
  methods: {
    handleSizeChange: function(size) {
      this.pagesize = size
      console.log(`每页 ${size} 条`)
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage
      console.log(`当前页: ${currentPage}`)
    },

    // 新增
    handleAdd() {
      this.dialogAddVisible = true
    },
    // 确定新增
    _doAdd() {
      this.tableData.push(this.addTable)
      this.addTable = {
        userId: null,
        username: '',
        password: '',
        salt: '',
        email: '',
        mobile: '',
        status: 1,
        checkList: [],
        createTime: '2016-11-11 11:11:11',
        deptId: 1,
        deptName: '',
        userType: ''
      }
      this.dialogAddVisible = false
      // console.log(this.addTable.username)
      // console.log(this.index)
    },
    //取消新增
    _doAddCancel() {
      this.addTable = {//重置新增数据为空
        userId: null,
        username: '',
        password: '',
        salt: '',
        email: '',
        mobile: '',
        status: 1,
        checkList: [],
        createTime: '2016-11-11 11:11:11',
        deptId: 1,
        deptName: '',
        userType: ''
      }
      this.dialogAddVisible = false
    },
    // 查看
    handleCheck(index, row) {
      this.selectTable = row
      this.dialogCheckVisible = true
    },
    // 修改
    handleEdit(index, row) {
      this.inde = index+(this.currentPage-1)*this.pagesize//计算分页后列表下标
      this.editTableRoot = JSON.parse(JSON.stringify(row))//深拷贝出原始数据
      this.editTable = row//复制单列数据
      this.dialogEditVisible = true
    },
    //确定修改
    _doHandleEdit() {
      this.dialogEditVisible = false
    },
    //取消修改
    _doCancel() {
      this.tableData.splice(this.inde, 1, this.editTableRoot)//删除修改的数据并替换为原始数据
      this.dialogEditVisible = false
    },
    // 删除提示
    deleteMessage(index, row) {
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
          });
          this.tableData.splice(index+(this.currentPage-1)*this.pagesize, 1) //删除
        })
        .catch(() => {
          this.$message({
            type: 'warning ',
            message: '已取消删除'
          })
        })
    },
    // 重置密码提示
    deleteCode(index, row) {
      this.$confirm('此操作将重置密码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '重置密码成功!'
          })
          // console.log(this.tableData[index].username)
          this.tableData[index+(this.currentPage-1)*this.pagesize].password = null //给密码赋值为空
        })
        .catch(() => {
          this.$message({
            type: 'warning ',
            message: '已取消重置密码'
          })
        })
    },
    //获取用户列表
    getUserList() {
      this.$http.post('http://localhost:8080/api/userList').then(response => {
        this.tableData = []
        // this.tableData = this.tableData.concat(response.data.data)
        response.data.data.forEach(item => {
          const tableData = {}
          tableData.username = item.username
          tableData.email = item.email
          tableData.deptName = item.deptName
          tableData.deptId = item.deptId
          tableData.mobile = item.mobile
          tableData.userId = item.userId
          tableData.status = item.status
          tableData.roleIdList = item.roleIdList
          tableData.createTime = item.createTime
          tableData.userType = item.userType
          tableData.checkList = item.checkList
          tableData.password = item.password
          this.tableData.push(tableData)
        })
      })
    }
  },
  created: function() {
    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
.dot {
  width: 100%;
}
</style>
