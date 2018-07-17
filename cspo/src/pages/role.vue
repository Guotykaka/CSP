<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <el-header height="30">

        <el-row :gutter="20" class="m_b_15">
          <el-col :span="6" class="minwidth">
            <el-input v-model="searchParams.roleName" placeholder="用户名" @keyup.enter.native="doSearche()"></el-input>
          </el-col>

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
            <el-form-item label="角色名称:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="editTable.roleName" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="角色代码:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="editTable.roleCode" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="角色描述:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="editTable.remark" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="角色类别:" :label-width="formLabelWidth">
              <template>
                <el-checkbox-group v-model="editTable.roleType">
                  <el-checkbox label="运营端"  @change="colType()"></el-checkbox>
                  <el-checkbox label="医生端"  @change="colType()"></el-checkbox>
                  <el-checkbox label="企业端"  @change="colType()"></el-checkbox>
                </el-checkbox-group>
              </template>
            </el-form-item>
            <el-form-item label="功能权限:" :label-width="formLabelWidth">
              <el-row :gutter="20">
                <template v-if="editTable.roleType === '1'||editTable.roleType === '1,2'||editTable.roleType === '1,3'||editTable.roleType === '1,2,3'">
                  <el-col :span="5">
                    <el-select v-model="editTable.purview" clearable placeholder="请选择1">
                      <el-option label="产品推广" value="1"></el-option>
                      <el-option label="版本升级" value="2"></el-option>
                    </el-select>
                  </el-col>
                </template>
                <template v-if="editTable.roleType === '2'||editTable.roleType === '1,2'||editTable.roleType === '2,3'||editTable.roleType === '1,2,3'">
                  <el-col :span="5">
                    <el-select v-model="editTable.purview" clearable placeholder="请选择2">
                      <el-option label="产品推广" value="1"></el-option>
                      <el-option label="版本升级" value="2"></el-option>
                    </el-select>
                  </el-col>
                </template>
                <template v-if="editTable.roleType === '3'||editTable.roleType === '1,3'||editTable.roleType === '2,3'||editTable.roleType === '1,2,3'">
                  <el-col :span="5">
                    <el-select v-model="editTable.purview" clearable placeholder="请选择3">
                      <el-option label="产品推广" value="1"></el-option>
                      <el-option label="版本升级" value="2"></el-option>
                    </el-select>
                  </el-col>
                </template>
              </el-row>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="_doCancel()">取 消</el-button>
            <el-button type="primary" @click="_doHandleEdit()">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 新增 -->
        <el-dialog title="新增" :visible.sync="dialogAddVisible" width=40%>
          <el-form :model="addTable">
            <el-form-item label="角色名称:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="addTable.roleName" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="角色代码:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="addTable.roleCode" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="角色描述:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="addTable.remark" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="角色类别:" :label-width="formLabelWidth">
              <template>
                <el-checkbox-group v-model="addTable.roleType">
                  <el-checkbox label="运营端" value = '0' @change="colType()"></el-checkbox>
                  <el-checkbox label="医生端" key = 0 @change="colType()"></el-checkbox>
                  <el-checkbox label="企业端" key = 0 @change="colType()"></el-checkbox>
                </el-checkbox-group>
              </template>
            </el-form-item>
            <el-form-item label="功能权限:" :label-width="formLabelWidth">
              <el-row :gutter="20">
                <template v-if="addTable.roleType === '1'||addTable.roleType === '1,2'||addTable.roleType === '1,3'||addTable.roleType === '1,2,3'">
                  <el-col :span="5">
                    <el-select v-model="addTable.purview" clearable placeholder="请选择1">
                      <el-option label="产品推广" value="1"></el-option>
                      <el-option label="版本升级" value="2"></el-option>
                    </el-select>
                  </el-col>
                </template>
                <template v-if="addTable.roleType === '2'||addTable.roleType === '1,2'||addTable.roleType === '2,3'||addTable.roleType === '1,2,3'">
                  <el-col :span="5">
                    <el-select v-model="addTable.purview" clearable placeholder="请选择2">
                      <el-option label="产品推广" value="1"></el-option>
                      <el-option label="版本升级" value="2"></el-option>
                    </el-select>
                  </el-col>
                </template>
                <template v-if="addTable.roleType === '3'||addTable.roleType === '1,3'||addTable.roleType === '2,3'||addTable.roleType === '1,2,3'">
                  <el-col :span="5">
                    <el-select v-model="addTable.purview" clearable placeholder="请选择3">
                      <el-option label="产品推广" value="1"></el-option>
                      <el-option label="版本升级" value="2"></el-option>
                    </el-select>
                  </el-col>
                </template>
              </el-row>
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
            <el-table-column show-overflow-tooltip align="center" prop="roleId" label="角色Id"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="roleName" label="角色名称"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="remark" label="角色描述"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="createTime" label="创建时间"></el-table-column>
            <el-table-column align="center" label="操作" min-width="152">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                <el-button size="mini" type="danger" @click="deleteMessage(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-main>
      <el-footer height="30px">
        <el-row style="margin-top: 2%;">
          <el-col :span="24" :offset="8">
            <template>
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[3, 5, 10,30]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
              </el-pagination>
            </template>
          </el-col>
        </el-row>
      </el-footer>
    </div>
  </div>

</template>


<script>
import { getListWithNoParam,PostUpdateRole,PostDeleteRole,PostSaveRole,getListRole } from '@/api/api.js'
import headerTop from '@/components/headTop.vue'
export default {
  components: {
    headerTop
  },
  data() {
    return {
      searchParams: { roleName: '', },
      dateNw: Date.parse(new Date()),
      params: { timespan : this.dateNw, },
      formInline: { valueSS: '' },
      currentPage: 1, //分页初始页码
      pagesize: 30, //分页初始显示条数
      tableData: [], //列表数据
      editTable: {}, //修改单个数据
      editTableRoot: {},
      addTable: {
        //新增单个数据
        // roleId: 1,
        roleCode: '',
        roleName: '',
        remark: '',
        deptId: null,
        deptName: null,
        menuIdList: null,
        deptIdList: null,
        createTime: '2018-07-02 16:58:57',
        roleType: '1',
        roleTypelist: ['医生端']
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
        pageSize: 1000,
        roleName: this.searchParams.roleName,
        timespan: date
      }
      getListRole(params).then(response => {
        this.tableData = []
        this.tableData = response.data.list
      })
    },
    colType() {
      console.log(JSON.stringify(this.editTable.roleType))
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
     
        let date = Date.parse( new Date())
        let params = {
              "deptId": this.addTable.deptId,
              "deptIdList": [
                0
              ],
              "deptName": "string",
              "menuTypeListDTO": [
                {
                  "menuIdList": [
                    0
                  ],
                  "roleType": this.addTable.roleType,
                  "timespan": date
                }
              ],
              "remark": this.addTable.remark,
              "roleCode": this.addTable.roleCode,
              // "roleId": this.addTable.roleId,
              "roleName": this.addTable.roleName,
              
          }
        PostSaveRole(params).then(response => {
                  this.$alert(response.msg)
                  this.getRoleList()
                  }).catch(err => {
                    this.$alert(err)
                  })
        this.tableData.push(this.addTable)
        this.addTable = {
        // roleId: 1,
        roleCode: '',
        roleName: '',
        remark: '',
        deptId: null,
        deptName: null,
        menuIdList: null,
        deptIdList: null,
        createTime: '2018-07-02 16:58:57',
        roleType: '1',
        roleTypelist: ['医生端']
      }
      this.dialogAddVisible = false
      
    },
    //取消新增
    _doAddCancel() {
      this.addTable = {
        //重置新增数据为空
        roleId: 1,
        roleCode: '',
        roleName: '',
        remark: '',
        deptId: null,
        deptName: null,
        menuIdList: null,
        deptIdList: null,
        createTime: '2018-07-02 16:58:57',
        roleType: '1',
        roleTypelist: ['医生端']
      }
      this.dialogAddVisible = false
      this.$message({
        type: 'warning',
        message: '取消新增'
      })
    },
    // 修改
    handleEdit(index, row) {
      this.inde = index + (this.currentPage - 1) * this.pagesize //计算分页后列表下标
      this.editTableRoot = JSON.parse(JSON.stringify(row)) //深拷贝出原始数据
      this.editTable = row //复制单列数据
      this.dialogEditVisible = true
      // console.log(this.editTable)
      // console.log(this.editTable.roleType)
      // console.log(typeof(this.editTable.roleType))
      // this.editTable.roleType = this.editTable.roleType.split(',')
      // console.log(this.editTable.roleType)
      // console.log(typeof(this.editTable.roleType))
    },
    //确定修改
    _doHandleEdit() {
      // console.log(JSON.stringify(this.editTable))
        let date = Date.parse( new Date())
        let params = {
              "deptId": this.editTable.deptId,
              "deptIdList": [
                0
              ],
              "deptName": "string",
              "menuTypeListDTO": [
                {
                  "menuIdList": [
                    0
                  ],
                  "roleType": this.editTable.roleType,
                  "timespan": date
                }
              ],
              "remark": this.editTable.remark,
              "roleCode": this.editTable.roleCode,
              "roleId": this.editTable.roleId,
              "roleName": this.editTable.roleName,
          }
        PostUpdateRole(params).then(response => {
              this.$message({
                    type: 'success',
                    message: '修改成功!'
                  })
                  }).catch(err => {
                    this.$message({
                          type: 'error',
                          message: err
                        })
                  })
        this.dialogEditVisible = false
      
    },
    //取消修改
    _doCancel() {
      this.tableData.splice(this.inde, 1, this.editTableRoot) //删除修改的数据并替换为原始数据
      this.dialogEditVisible = false
      this.$message({
        type: 'warning',
        message: '取消修改'
      })
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
        let date = Date.parse( new Date())
        let params = {
              "ids": [row.roleId],
              "timespan": date
          }
        PostDeleteRole(params).then(response => {
              this.$alert(response.msg)
                  }).catch(err => {
                   this.$alert(err)
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
    //获取用户列表
    getRoleList() {
      let date = Date.parse( new Date())
      let params = {
            timespan : date
        }
      getListWithNoParam(params).then(response => {
        this.tableData = []
        this.tableData = response.data
      })
    }
  },
  created: function() {
    
    this.getRoleList()
  }
}
</script>

<style lang="less" scoped>
.dot {
  width: 100%;
}
.el-select {
  width: 100%;
}
.minwidth {
  min-width: 200px;
}
</style>
