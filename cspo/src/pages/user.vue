<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <el-header height="30">

        <el-row :gutter="20" class="m_b_15">
          <el-col :span="6" class="minwidth">
            <el-input v-model="searchParams.username" placeholder="用户名" @keyup.enter.native="doSearche()"></el-input>
          </el-col>
          <!-- <el-col :span="6" class="minwidth">
          <el-checkbox-group v-model="searchParams.username">
                  <el-checkbox v-for="item in roleList" :label="item.roleName">{{item.roleId}}</el-checkbox>
                </el-checkbox-group>
        </el-col> -->
          <!-- <el-col :span="6" class="minwidth">
          <el-checkbox-group  :value="mpb.roleId" v-for="mpb in roleList" :key="mpb.roleId" v-model="searchParams.username" class="checkgroup" >
            <el-checkbox :label="mpb.roleName" @change="checkinlist"></el-checkbox>
          </el-checkbox-group>
        </el-col> -->

          <el-col :span="6" class="minwidth">
            <el-button type="primary" @click="doSearche()">查询</el-button>
            <el-button type="primary" @click="handleAdd()">新增</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <!-- 修改 -->
        <el-dialog title="修改" :visible.sync="dialogEditVisible" width=40%>
          <el-form :model="editTable">
            <el-form-item class="is-required" label="用户名:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="editTable.username" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item class="is-required" label="密码:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="editTable.password" auto-complete="off" placeholder="密码" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item class="is-required" label="邮箱:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="editTable.email" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item class="is-required" label="手机号:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="editTable.mobile" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item class="is-required" label="所属部门:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="editTable.deptName" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="角色:" :label-width="formLabelWidth">
              <template>
                <el-col :span="16">
                  <el-checkbox-group v-model="editTable.roleIdList" :change="chanbox()">
                    <el-checkbox v-for="(item,index) in roleList" :label="item.roleId" :key="index">{{item.roleName}}</el-checkbox>
                  </el-checkbox-group>
                </el-col>
              </template>
            </el-form-item>
            <el-form-item label="状态:" :label-width="formLabelWidth">
              <template slot-scope="scope">
                <el-radio v-model="editTable.status" label=0>禁用</el-radio>
                <el-radio v-model="editTable.status" label=1>正常</el-radio>
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
                <el-radio v-model="selectTable.status" label="0" onclick="return false">禁用</el-radio>
                <el-radio v-model="selectTable.status" label="1" onclick="return false">正常</el-radio>
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
            <el-form-item class="is-required" label="用户名:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="addTable.username" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item class="is-required" label="密码:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="addTable.password" auto-complete="off" placeholder="密码" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item class="is-required" label="邮箱:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="addTable.email" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="手机号:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="addTable.mobile" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="所属部门:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="addTable.deptName" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="角色:" :label-width="formLabelWidth">
              <template>
                <el-col :span="16">
                  <el-checkbox-group v-model="addTable.checkList" :change="chanbox()">
                    <el-checkbox v-for="(item,index) in roleList" :label="item.roleId" :key="index">{{item.roleName}}</el-checkbox>
                  </el-checkbox-group>
                </el-col>
              </template>
            </el-form-item>
            <el-form-item label="状态:" :label-width="formLabelWidth">
              <template slot-scope="scope">
                <el-radio v-model="addTable.userType" label=0>禁用</el-radio>
                <el-radio v-model="addTable.userType" label=1>正常</el-radio>
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
            <el-table-column show-overflow-tooltip align="center" prop="userId" type="index" label="Id" min-width="25%"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="username" label="用户名" min-width="50%"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="deptName" label="所属部门"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="email" label="邮箱"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="mobile" label="手机号"></el-table-column>
            <el-table-column align="center" label="状态">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium" type="success" v-if="scope.row.userType === 1">正常</el-tag>
                  <el-tag size="medium" type="danger" v-if="scope.row.userType === 0">禁用</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="createTime" label="创建时间"></el-table-column>
            <el-table-column align="center" label="操作" width="312">
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
          <el-col :span="24" :offset="8">
            <template>
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[3, 5, 10,30]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
              </el-pagination>
            </template>
          </el-col>
        </el-row>
      </el-footer>
    </div>
  </div>

</template>


<script>
import {
  getUserList,
  getListWithNoParam,
  postUserUpdate,
  postUserSave,
  postUserDelete,
  postDoctorResetPassword
} from '@/api/api.js'
import headerTop from '@/components/headTop.vue'
export default {
  components: {
    headerTop
  },
  data() {
    return {
      searchParams: { username: '', },
      totalCount:0,
      currentPage: 1, //分页初始页码
      pagesize: 30, //分页初始显示条数
      tableData: [], //列表数据
      roleList: [], //角色数据
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
        userType: 0
      }, //新增单个数据
      dialogCheckVisible: false, //查看
      dialogEditVisible: false, //修改
      dialogAddVisible: false, //新增
      inde: null, //index flag
      formLabelWidth: '120px'
    }
  },
  methods: {
    doSearche() {
      let date = Date.parse(new Date())
      let params = {
        currentPage: 1,
        pageSize: 10,
        userType: '',
        username: this.searchParams.username,
        timespan: date
      }
      getUserList(params).then(response => {
        this.tableData = []
        this.tableData = response.data.list
      })
    },
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
      let params = {
        email: this.addTable.email,
        mobile: this.addTable.mobile,
        password: this.addTable.password,
        roleIdList: this.addTable.checkList,
        status: this.addTable.status,
        userId: this.addTable.userId,
        userType: this.addTable.userType,
        username: this.addTable.username
      }
      postUserSave(params).then(response => {
        this.$alert(response.msg)
        if (response.msg == '操作成功') {
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
            userType: 0
          }
        }
      })
      this.tableData.push(this.addTable)

      this.dialogAddVisible = false
    },
    //取消新增
    _doAddCancel() {
      this.addTable = {
        //重置新增数据为空
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
      this.$message({
        type: 'warning',
        message: '取消新增'
      })
    },
    // 查看
    handleCheck(index, row) {
      this.selectTable = row
      this.dialogCheckVisible = true
    },
    //获取角色复选框
    getRoleList() {
      let date = Date.parse(new Date())
      let params = {
        timespan: date
      }
      getListWithNoParam(params).then(response => {
        this.roleList = []
        this.roleList = response.data
      })
    },
    chanbox() {
      console.log(this.editTable.roleIdList)
    },
    // 修改
    handleEdit(index, row) {
      this.getRoleList()
      this.inde = index + (this.currentPage - 1) * this.pagesize //计算分页后列表下标
      row.status = String(row.status)
      console.log(row.roleIdList, '1')
      row.roleIdList = [row.roleIdList]
      this.editTableRoot = JSON.parse(JSON.stringify(row)) //深拷贝出原始数据
      this.editTable = row //复制单列数据
      this.dialogEditVisible = true
      console.log(this.editTable.roleIdList, '2')
      // console.log(typeof(this.editTable.roleIdList))
    },
    //确定修改
    _doHandleEdit() {
      let params = {
        deptId: this.editTable.deptId,
        deptName: this.editTable.deptName,
        email: this.editTable.email,
        mobile: this.editTable.mobile,
        password: this.editTable.password,
        roleIdList: this.editTable.roleIdList,
        status: this.editTable.status,
        userId: this.editTable.userId,
        userType: this.editTable.userType,
        username: this.editTable.username,
        salt: this.editTable.salt
      }
      postUserUpdate(params).then(response => {
        this.$alert(response.msg)
      })
      this.dialogEditVisible = false
      // this.getUser()
      console.log(this.editTable.deptName)
    },
    //取消修改
    _doCancel() {
      this.tableData.splice(this.inde, 1, this.editTableRoot) //删除修改的数据并替换为原始数据
      this.dialogEditVisible = false
      this.$alert('取消修改')
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
          let date = Date.parse(new Date())
          let params = {
            ids: [row.userId],
            timespan: date
          }
          postUserDelete(params).then(response => {
            this.$alert(response.msg)
          })
          this.tableData.splice(
            index + (this.currentPage - 1) * this.pagesize,
            1
          ) //删除
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
          let date = Date.parse(new Date())
          let params = {
            id: row.userId,
            timespan: date
          }
          postDoctorResetPassword(params).then(response => {
            this.$alert(response.msg)
            if (response.msg == '操作成功') {
              this.tableData[
                index + (this.currentPage - 1) * this.pagesize
              ].password = null //给密码赋值为空
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'warning ',
            message: '已取消重置密码'
          })
        })
    },
    //获取用户列表
    getUser() {
      let date = Date.parse(new Date())
      let params = {
        currentPage: 1,
        pageSize: 1000,
        userType: '',
        username: '',
        timespan: date
      }
      getUserList(params).then(response => {
        this.tableData = []
        this.tableData = response.data.list
        this.totalCount = response.data.totalCount
      })
    }
  },
  created: function() {
    this.getUser()
  }
}
</script>

<style lang="less" scoped>
.minwidth {
  min-width: 200px;
}
.el-checkbox {
  margin-left: 20px;
}
</style>
