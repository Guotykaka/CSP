<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <el-header height="30">
        <el-form :model="searchParams" class="demo-form-inline">
        <el-form-item label="角色名称：">
          <el-col :span="6">
          <el-input v-model="searchParams.roleName" placeholder="" @keyup.enter.native="doSearch()" clearable></el-input>
          </el-col>
          <el-button type="primary" @click="doSearch()" class="m_l_15">查询</el-button>
          <el-button type="primary" @click="handleAdd()">新增</el-button>
        </el-form-item>
      </el-form>
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
              <template :model="sysRoleMenuListVOList">
                <!-- <el-checkbox-group v-model="sysRoleMenuListVOList.roleType"> -->
                <el-checkbox-group v-model="sysRoleMenuListVOList.category">
                  <el-checkbox label= "0"  @change="colType1()">运营端</el-checkbox>
                  <el-checkbox label= "1"  @change="colType2()">医生端</el-checkbox>
                  <el-checkbox label= "2"  @change="colType3()">企业端</el-checkbox>
                </el-checkbox-group>
              </template>
            </el-form-item>
            <el-form-item label="功能权限:" :label-width="formLabelWidth"  v-model="sysRoleMenuListVOList">
              <el-col :span="5">
              <el-tree
                v-show="flag1"
                :data="data2"
                show-checkbox
                default-expand-all
                :default-checked-keys="sysRoleMenuListVOList.menuIdList"
                node-key="id"
                ref="tree"
                highlight-current
                :props="tree">
              </el-tree>
              </el-col>
              <el-col :span="5">
               <el-tree
                v-show="flag2"
                :data="data3"
                show-checkbox
                default-expand-all
                node-key="id"
                ref="tree"
                highlight-current
                :props="tree">
              </el-tree>
              </el-col>
              <el-col :span="5">
                <div v-show="flag3">企业端</div>
              </el-col>
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
              <template :model="sysRoleMenuListVOList">
                <!-- <el-checkbox-group v-model="sysRoleMenuListVOList.roleType"> -->
                <el-checkbox-group v-model="sysRoleMenuListVOList.category">
                  <el-checkbox label= "0"  @change="colType1()">运营端</el-checkbox>
                  <el-checkbox label= "1"  @change="colType2()">医生端</el-checkbox>
                  <el-checkbox label= "2"  @change="colType3()">企业端</el-checkbox>
                </el-checkbox-group>
              </template>
            </el-form-item>
            <el-form-item label="功能权限:" :label-width="formLabelWidth">
              <el-col :span="5">
              <el-tree
                v-model="sysRoleMenuListVOList.menuIdList"
                @check="checkchange()"
                v-show="flag1"
                :data="data2"
                show-checkbox
                :default-checked-keys="sysRoleMenuListVOList.menuIdList"
                node-key="id"
                ref="tree"
                highlight-current
                :props="tree">
              </el-tree>
              </el-col>
              <el-col :span="5">
               <el-tree
                v-show="flag2"
                :data="data3"
                show-checkbox
                node-key="id"
                ref="tree"
                highlight-current
                :props="tree">
              </el-tree>
              </el-col>
              <el-col :span="5">
                <div v-show="flag3">企业端</div>
              </el-col>
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
import { getListWithNoParam,PostUpdateRole,PostDeleteRole,PostSaveRole,getListRole,getRoleInfo } from '@/api/api.js'
import headerTop from '@/components/headTop.vue'
export default {
  components: {
    headerTop
  },
  data() {
    return {
      flag1:true,
      flag2:true,
      flag3:true,
      tree:{
          children: 'children',
          label: 'label'
        },
      data2: [{
          id: 1,
          label: '系统管理',
          children: [{
              id: 105,
              label: '角色管理'
            }, {
              id: 107,
              label: '用户管理'
            }, {
              id: 116,
              label: '菜单管理'
            }]
        }, {
          id: 2,
          label: ' 机构业务',
          children: [{
            id: 56,
            label: '机构列表'
          },]
        }, {
          id: 123,
          label: '商品管理',
          children: [{
            id: 131,
            label: '服务管理'
          }]
        }],
      data3: [{
          id: 4,
          label: '医生管理',
          children: [{
              id: 9,
              label: '医生列表'
            }, {
              id: 10,
              label: '认证列表'
            }, ]
        }, {
          id: 5,
          label: ' 订单管理',
          children: [{
              id: 110,
              label: '订单列表'
            }, {
              id: 111,
              label: '退款管理'
            },]
        }, {
          id: 6,
          label: '财务管理',
          children: [{
            id: 27,
            label: '提现列表'
          }]
        }],
      searchParams: { roleName: '', },
      dateNw: Date.parse(new Date()),
      params: { timespan : this.dateNw, },
      sysRoleMenuListVOList : {"category":0,"menuIdList":[116]},//详情中的树状列表
      formInline: { valueSS: '' },
      currentPage: 1, //分页初始页码
      pagesize: 30, //分页初始显示条数
      tableData: [], //列表数据
      editTable: {}, //修改单个数据
      editTableRoot: {},
      addTable: {
        //新增单个数据
        // roleId: 1,
        "deptId": 0,
        "deptIdList": [
          0
        ],
        "deptName": "string",
        "menuTypeListDTO": [
          {
            "menuIdList": [
              0
            ],
            "roleType": 0,
            "timespan": "1"
          }
        ],
        "remark": "string",
        "roleCode": "string",
        "roleId": 0,
        "roleName": "string",
        "timespan": "1"
      }, //新增单个数据
      dialogCheckVisible: false, //查看
      dialogEditVisible: false, //修改
      dialogAddVisible: false, //新增
      inde: null, //index flag
      formLabelWidth: '120px'
    }
  },
  methods: {
    checkchange(){
    console.log(this.sysRoleMenuListVOList.menuIdList)
    },
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
    colType1() {
         var myVar = '0';
         var array = this.sysRoleMenuListVOList.category
         var flag = false;
         for (var i = 0; i < array.length; i++)
        {
             if(myVar==array[i])
           {
                 flag = true;
             }else{
                 flag = false;
             }
        }
        this.flag1 =flag
        console.log(this.sysRoleMenuListVOList.category)
    },
    colType2() {
         var myVar = '1';
         var array = this.sysRoleMenuListVOList.category
         var flag = false;
         for (var i = 0; i < array.length; i++)
        {
             if(myVar==array[i])
           {
                 flag = true;
             }else{
                 flag = false;
             }
        }
        this.flag2 =flag
        console.log(this.sysRoleMenuListVOList.category)
    },
    colType3() {
         var myVar = '2';
         var array = this.sysRoleMenuListVOList.category
         var flag = false;
         for (var i = 0; i < array.length; i++)
        {
             if(myVar==array[i])
           {
                 flag = true;
             }else{
                 flag = false;
             }
        }
        this.flag3 =flag
        console.log(this.sysRoleMenuListVOList.category)
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
      // this.sysRoleMenuListVOList = {"category":0,"menuIdList":[105,107,116,56,123,131,57,58]},
      this.chenge()
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
    chenge(){//checkbox绑定
        this.sysRoleMenuListVOList.category = String(this.sysRoleMenuListVOList.category)
        let arr = [];
        this.sysRoleMenuListVOList.category.split(",").forEach(function (item) {   
                arr.push(item);    
            })
        this.sysRoleMenuListVOList.category = arr
        console.log(this.sysRoleMenuListVOList.category)
      var myVar0 = '0';
        var myVar1 = '1';
        var myVar2 = '2';
         //数组
         var array = this.sysRoleMenuListVOList.category
         var flag1 = false;
         var flag2 = false;
         var flag3 = false;
         for (var i = 0; i < array.length; i++)
        {
             if(myVar0==array[i])
           {
                 flag1 = true;
                 break;
             }
        }
        for (var i = 0; i < array.length; i++)
        {
             if(myVar1==array[i])
           {
                 flag2 = true;
                 break;
             }
        }
        for (var i = 0; i < array.length; i++)
        {
             if(myVar2==array[i])
           {
                 flag3 = true;
                 break;
             }
        }
        this.flag1 =flag1
        this.flag2 =flag2
        this.flag3 =flag3
    },
    // 修改
    handleEdit(index, row) {
      let params = {
        id: row.roleId,
      }
      getRoleInfo(params).then(response => {
        
        
        if (response.code == 1) {
        this.editTable = response.data.sysRoleEntity
        console.log(JSON.stringify(response.data))
        this.sysRoleMenuListVOList = response.data.sysRoleMenuListVOList[0]
        this.chenge()
        this.dialogEditVisible = true
        } else {
          this.$alert("无法修改")
        }
      })
      this.inde = index + (this.currentPage - 1) * this.pagesize //计算分页后列表下标
      this.editTableRoot = JSON.parse(JSON.stringify(row)) //深拷贝出原始数据
      // this.editTable = row //复制单列数据
        
    },
    //确定修改
    _doHandleEdit() {
      console.log(this.sysRoleMenuListVOList)
      console.log(this.sysRoleMenuListVOList.category,"this.sysRoleMenuListVOList.category")
        // let date = Date.parse( new Date())
        // let params = {
        //       "deptId": this.editTable.deptId,
        //       "deptIdList": [
        //         0
        //       ],
        //       "deptName": "string",
        //       "menuTypeListDTO": [
        //         {
        //           "menuIdList": [
        //             0
        //           ],
        //           "roleType": this.editTable.roleType,
        //           "timespan": date
        //         }
        //       ],
        //       "remark": this.editTable.remark,
        //       "roleCode": this.editTable.roleCode,
        //       "roleId": this.editTable.roleId,
        //       "roleName": this.editTable.roleName,
        //   }
        // PostUpdateRole(params).then(response => {
        //       this.$message({
        //             type: 'success',
        //             message: '修改成功!'
        //           })
        //           }).catch(err => {
        //             this.$message({
        //                   type: 'error',
        //                   message: err
        //                 })
        //           })
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
.m_l_15{
  margin-left: 15px;
}
</style>
