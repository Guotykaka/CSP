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
        <el-dialog title="修改" :visible.sync="dialogEditVisible" width=40% :before-close="handleCloseEidt">
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
                  <el-checkbox label="1" @change="colType1()">运营端</el-checkbox>
                  <el-checkbox label="0" @change="colType2()">医生端</el-checkbox>
                  <el-checkbox label="2" @change="colType3()">企业端</el-checkbox>
                </el-checkbox-group>
              </template>
            </el-form-item>
            <el-form-item label="功能权限:" :label-width="formLabelWidth" v-model="sysRoleMenuListVOList">
              <el-col :span="8">
                <el-tree v-show="flag1" :data="allmenuLista" :default-expanded-keys='sysRoleMenuListVOList.menuIdList' show-checkbox node-key="menuId" v-bind:check-strictly="true" :default-checked-keys="sysRoleMenuListVOList.menuIdList" ref="tree1"  @check="handleCheck" :props="defaultProps">
                </el-tree>
                 <!-- v-bind:check-strictly="true" -->
              </el-col>
              <el-col :span="8">
                <el-tree v-show="flag2" :data="allmenuListb" :default-expanded-keys='sysRoleMenuListVOList.menuIdList' show-checkbox node-key="menuId" v-bind:check-strictly="true" :default-checked-keys="sysRoleMenuListVOList.menuIdList" ref="tree2"  @check="handleCheck" :props="defaultProps">
                </el-tree>
              </el-col>
              <el-col :span="5">
                <div v-show="flag3">企业端</div>
              </el-col>
            </el-form-item>
          </el-form>
          <div class="btn-row">
            <el-button size="small" type="primary" @click="_doHandleEdit()">确定</el-button>
            <el-button size="small" type="primary" @click="_doCancel()">取消</el-button>
          </div>
        </el-dialog>
        <!-- 新增 -->
        <el-dialog title="新增" :visible.sync="dialogAddVisible" width=40% :before-close="handleCloseAdd">
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
                <el-checkbox-group v-model="sysRoleMenuListVOList.category">
                  <el-checkbox label= "1" @change="colType1()">运营端</el-checkbox>
                  <el-checkbox label= "0" @change="colType2()">医生端</el-checkbox>
                  <el-checkbox label= "2" @change="colType3()">企业端</el-checkbox>
                </el-checkbox-group>
              </template>
            </el-form-item>
            <el-form-item label="功能权限:" :label-width="formLabelWidth">
              <el-col :span="8">
                <el-tree v-show="flag1" :data="allmenuLista"  show-checkbox node-key="menuId" v-bind:check-strictly="true"  ref="treenew1" highlight-current @check="handleCheck" :props="defaultProps">
                </el-tree>
              </el-col>
              <el-col :span="8">
                <el-tree v-show="flag2" :data="allmenuListb"  show-checkbox node-key="menuId" v-bind:check-strictly="true"  ref="treenew2" highlight-current @check="handleCheck" :props="defaultProps">
                </el-tree>
              </el-col>
              <el-col :span="5">
                <div v-show="flag3">企业端</div>
              </el-col>
            </el-form-item>
          </el-form>

          <div class="btn-row">
            <el-button size="small" type="primary" @click="_doAdd()">确定</el-button>
            <el-button size="small" type="primary" @click="_doAddCancel()">取消</el-button>
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
              <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10,20]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length"> -->
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchParams.currentPage" :page-sizes="[10,20]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
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
  ERR_OK,
  getListWithNoParam,
  PostUpdateRole,
  PostDeleteRole,
  PostSaveRole,
  getListRole,
  getRoleInfo,
  getDictListByType,
  getSysMenuByCategory
} from '@/api/api.js'
import headerTop from '@/components/headTop.vue'
export default {
  components: {
    headerTop
  },
  data() {
    return {
      title: '提示', //this.$alert的标题
      menuList: [], //对应模块菜单
      allmenuList: [], //医生端所有菜单
      allmenuLista: [],
      allmenuListB: [], //运营端所有菜单
      allmenuListb: [], //运营端所有菜单
      flag1: true,
      flag2: true,
      flag3: true,
      totalCount: 0,
      searchParams: {
        currentPage: 1,
        pageSize: 10,
        roleName: ''
      },
      tree: {
        children: 'children',
        label: 'label'
      },
      defaultProps: {
        children: 'list',
        label: 'name'
        // isLeaf: false
      },
      dateNw: Date.parse(new Date()),
      params: { timespan: this.dateNw },
      sysRoleMenuListVOList: { category: 0, menuIdList: [1, 147, 36] }, //详情中的树状列表
      formInline: { valueSS: '' },
      currentPage: 1, //分页初始页码
      pagesize: 10, //分页初始显示条数
      tableData: [], //列表数据
      editTable: {}, //修改单个数据
      editTableRoot: {},
      addTable: {
        //新增单个数据
        deptId: 0,
        deptIdList: [0],
        deptName: '',
        menuTypeListDTO: [
          {
            menuIdList: [],
            roleType: 1,
            timespan: '1'
          },
          {
            menuIdList: [],
            roleType: 0,
            timespan: '1'
          }
        ],
        remark: '',
        roleCode: '',
        roleId: 0,
        roleName: '',
        timespan: '1'
      }, //新增单个数据
      dialogCheckVisible: false, //查看
      dialogEditVisible: false, //修改
      dialogAddVisible: false, //新增
      inde: null, //index flag
      formLabelWidth: '120px'
    }
  },
  methods: {
    handleCheck(val) {
      // console.log(val.list)
      // console.log(this.sysRoleMenuListVOList.menuIdList)
      // console.log(JSON.stringify(this.allmenuListb))
      // console.log(JSON.stringify(this.allmenuList))
      console.log(this.sysRoleMenuListVOList.menuIdList)
    },
    //获取字典数据
    getdictionaryData() {
      let typeParams = {
        type: 'MENU_TYPE'
      }
      let params = {
        category: '1'
      }
      //获取所有菜单
      getSysMenuByCategory(params).then(res => {
        if (res.code === ERR_OK) {
          this.allmenuList = res.data
        } else {
          this.$alert(res.msg, '提示', {
            confirmButtonText: '确定'
          })
        }
      })
      let params2 = {
        category: '0'
      }
      //获取所有菜单
      getSysMenuByCategory(params2).then(res => {
        if (res.code === ERR_OK) {
          this.allmenuListB = res.data
        } else {
          this.$alert(res.msg, '提示', {
            confirmButtonText: '确定'
          })
        }
      })
    },
    checkchange() {
      let menuIdList1 = this.$refs.treenew1.getCheckedKeys()
      let menuIdList2 = this.$refs.treenew2.getCheckedKeys()
      menuIdList1 = menuIdList1.concat(menuIdList2)
      console.log(menuIdList1)
    },
    doSearch() {
      this.searchParams.currentPage = 1
      this.getRoleList()
    },
    handleSizeChange: function(size) {
      this.searchParams.pageSize = size
      this.getRoleList()
    },
    handleCurrentChange: function(currentPage) {
      this.searchParams.currentPage = currentPage
      this.getRoleList()
    },
    colType1() {
      var myVar = '1'
      var array = this.sysRoleMenuListVOList.category
      var flag = false
      for (var i = 0; i < array.length; i++) {
        if (myVar == array[i]) {
          flag = true
        } else {
          flag = false
        }
      }
      this.flag1 = flag
      console.log(this.sysRoleMenuListVOList.category)
    },
    colType2() {
      var myVar = '0'
      var array = this.sysRoleMenuListVOList.category
      var flag = false
      for (var i = 0; i < array.length; i++) {
        if (myVar == array[i]) {
          flag = true
        } else {
          flag = false
        }
      }
      this.flag2 = flag
      console.log(this.sysRoleMenuListVOList.category)
    },
    colType3() {
      var myVar = '2'
      var array = this.sysRoleMenuListVOList.category
      var flag = false
      for (var i = 0; i < array.length; i++) {
        if (myVar == array[i]) {
          flag = true
        } else {
          flag = false
        }
      }
      this.flag3 = flag
      console.log(this.sysRoleMenuListVOList.category)
    },
    // 新增
    handleAdd() {
      // this.sysRoleMenuListVOList = {"category":0,"menuIdList":[105,107,116,56,123,131,57,58]},
      this.chenge()
      this.dialogAddVisible = true
    },
    // 确定新增
    _doAdd() {
      let menuIdList1 = this.$refs.treenew1.getCheckedKeys()
      let menuIdList2 = this.$refs.treenew2.getCheckedKeys()
      let date = Date.parse(new Date())
      let params = {
        deptId: this.addTable.deptId,
        deptIdList: this.addTable.deptIdList,
        deptName: this.addTable.deptName,
        menuTypeListDTO: [
          {
            menuIdList: menuIdList1,
            roleType: 1,
            timespan: date
          },
        ],
        remark: this.addTable.remark,
        roleCode: this.addTable.roleCode,
        roleName: this.addTable.roleName
      }
      let params2 = {
        deptId: this.addTable.deptId,
        deptIdList: this.addTable.deptIdList,
        deptName: this.addTable.deptName,
        menuTypeListDTO: [
          {
            menuIdList: menuIdList2,
            roleType: 0,
            timespan: date
          }
        ],
        remark: this.addTable.remark,
        roleCode: this.addTable.roleCode,
        roleName: this.addTable.roleName
      }
      let params3 = {
        deptId: this.addTable.deptId,
        deptIdList: this.addTable.deptIdList,
        deptName: this.addTable.deptName,
        menuTypeListDTO: [
          {
            menuIdList: menuIdList1,
            roleType: 1,
            timespan: date
          },
          {
            menuIdList: menuIdList2,
            roleType: 0,
            timespan: date
          }
        ],
        remark: this.addTable.remark,
        roleCode: this.addTable.roleCode,
        roleName: this.addTable.roleName
      }
      let ss = {}
      if(menuIdList1.length !== 0&&menuIdList2.length ==0 ){
        console.log(JSON.stringify(params),"1")
         ss= params
      }if(menuIdList1.length == 0&&menuIdList2.length !==0 ){
        console.log(JSON.stringify(params2),"2")
        ss= params2
      }if(menuIdList1.length !== 0&&menuIdList2.length !==0 ){
        console.log(JSON.stringify(params3),"3")
        ss= params3
      }
      console.log(JSON.stringify(ss))
      PostSaveRole(ss).then(response => {
        if (response.code == 1) {
          this.$alert(response.msg, this.title)
          this.getRoleList()
        } else {
          this.$alert(response.msg, this.title)
          console.log(JSON.stringify(params))
        }
      })
      this.handleCloseAdd()
    },
    //取消新增
    _doAddCancel() {
      this.handleCloseAdd()
      this.$message({
        type: 'warning',
        message: '取消新增'
      })
    },
    handleCloseAdd() {
      //:before-close
      console.log('beforclose')
      this.addTable = {
        //重置新增数据为空
        deptId: 0,
        deptIdList: [0],
        deptName: '',
        menuTypeListDTO: [
          {
            menuIdList: [0],
            roleType: 1,
            timespan: '1'
          },
          {
            menuIdList: [0],
            roleType: 0,
            timespan: '1'
          }
        ],
        remark: '',
        roleCode: '',
        roleId: 0,
        roleName: '',
        timespan: '1'
      }
      this.dialogAddVisible = false
    },
    chenge() {
      //checkbox绑定
      this.sysRoleMenuListVOList.category = String(
        this.sysRoleMenuListVOList.category
      )
      let arr = []
      this.sysRoleMenuListVOList.category.split(',').forEach(function(item) {
        arr.push(item)
      })
      this.sysRoleMenuListVOList.category = arr
      var myVar0 = '1'
      var myVar1 = '0'
      var myVar2 = '2'
      //数组
      var array = this.sysRoleMenuListVOList.category
      var flag1 = false
      var flag2 = false
      var flag3 = false
      for (var i = 0; i < array.length; i++) {
        if (myVar0 == array[i]) {
          flag1 = true
          break
        }
      }
      for (var i = 0; i < array.length; i++) {
        if (myVar1 == array[i]) {
          flag2 = true
          break
        }
      }
      for (var i = 0; i < array.length; i++) {
        if (myVar2 == array[i]) {
          flag3 = true
          break
        }
      }
      this.flag1 = flag1
      this.flag2 = flag2
      this.flag3 = flag3
    },
    // 修改
    handleEdit(index, row) {
      let params = {
        id: row.roleId
      }
      getRoleInfo(params).then(response => {
        if (response.code == 1) {
          console.log(response, 'this.response')
          this.editTable = response.data.sysRoleEntity
          if(response.data.sysRoleMenuListVOList.length == 1){
            this.sysRoleMenuListVOList = response.data.sysRoleMenuListVOList[0]
          }if(response.data.sysRoleMenuListVOList.length == 2){
            this.sysRoleMenuListVOList.menuIdList = response.data.sysRoleMenuListVOList[0].menuIdList.concat(response.data.sysRoleMenuListVOList[1].menuIdList)
            this.sysRoleMenuListVOList.category = ["1","0"]
            console.log(response.data.sysRoleMenuListVOList[0].menuIdList)
          }
          
          
          this.chenge()
          // console.log(response.data)
          this.dialogEditVisible = true
        } else {
          this.$alert('无法修改', this.title)
        }
      })
      this.inde = index + (this.currentPage - 1) * this.pagesize //计算分页后列表下标
      this.editTableRoot = JSON.parse(JSON.stringify(row)) //深拷贝出原始数据
      // console.log(this.sysRoleMenuListVOList.category)
      // this.editTable = row //复制单列数据
    },
    //确定修改
    _doHandleEdit() {
      let menuIdList1 = this.$refs.tree1.getCheckedKeys()
      let menuIdList2 = this.$refs.tree2.getCheckedKeys()
      let date = Date.parse(new Date())
      
      let params = {
        deptId: this.editTable.deptId,
        deptIdList: this.editTable.deptIdList,
        deptName: this.editTable.deptName,
        menuTypeListDTO: [
          {
            menuIdList: menuIdList1,
            roleType: 1,
            timespan: date
          },
        ],
        remark: this.editTable.remark,
        roleCode: this.editTable.roleCode,
        roleId: this.editTable.roleId,
        roleName: this.editTable.roleName
      }
      let params2 = {
        deptId: this.editTable.deptId,
        deptIdList: this.editTable.deptIdList,
        deptName: this.editTable.deptName,
        menuTypeListDTO: [
          {
            menuIdList: menuIdList2,
            // menuIdList: [0, 105, 107, 116, 56, 123, 131],
            roleType: 0,
            timespan: date
          }
        ],
        remark: this.editTable.remark,
        roleCode: this.editTable.roleCode,
        roleId: this.editTable.roleId,
        roleName: this.editTable.roleName
      }
      let params3 = {
        deptId: this.editTable.deptId,
        deptIdList: this.editTable.deptIdList,
        deptName: this.editTable.deptName,
        menuTypeListDTO: [
          {
            menuIdList: menuIdList1,
            roleType: 1,
            timespan: date
          },
          {
            menuIdList: menuIdList2,
            roleType: 0,
            timespan: date
          }
        ],
        remark: this.editTable.remark,
        roleCode: this.editTable.roleCode,
        roleId: this.editTable.roleId,
        roleName: this.editTable.roleName
      }
      let ss = {}
      if(menuIdList1.length !== 0&&menuIdList2.length ==0 ){
        console.log(JSON.stringify(params),"1")
         ss= params
      }if(menuIdList1.length == 0&&menuIdList2.length !==0 ){
        console.log(JSON.stringify(params2),"2")
        ss= params2
      }if(menuIdList1.length !== 0&&menuIdList2.length !==0 ){
        console.log(JSON.stringify(params3),"3")
        ss= params3
      }
      // console.log(JSON.stringify(ss),"ss")
      console.log(JSON.stringify(menuIdList2),"menuIdList2")
      PostUpdateRole(ss).then(response => {
        if (response.code == 1) {
          this.$alert(response.msg,this.title)
          this.getRoleList()
        } else {
          this.$alert(response.msg,this.title)
        }
      })
      this.handleCloseEidt()
    },
    //取消修改
    _doCancel() {
      this.tableData.splice(this.inde, 1, this.editTableRoot) //删除修改的数据并替换为原始数据
      this.handleCloseEidt()
      this.$message({
        type: 'warning',
        message: '取消修改'
      })
    },
    handleCloseEidt() {
      //编辑弹窗重置数据
      // this.sysRoleMenuListVOList.menuIdList = []
      // this.sysRoleMenuListVOList.category = []
      // this.getRoleList()
      console.log('beforclose')
      this.dialogEditVisible = false
    },
    // 删除提示
    deleteMessage(index, row) {
      this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          let date = Date.parse(new Date())
          let params = {
            ids: [row.roleId],
            timespan: date
          }
          PostDeleteRole(params).then(response => {
            this.$alert(response.msg, this.title)
            this.getRoleList()
          })
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
      let params = {
        currentPage: this.searchParams.currentPage,
        pageSize: this.searchParams.pageSize,
        roleName: this.searchParams.roleName,
      }
      getListRole(params).then(response => {
        this.tableData = []
        this.tableData = response.data.list
        this.totalCount = response.data.totalCount
      })
    }
  },
  activated: function() {
    this.getdictionaryData()
    this.getRoleList()
  },
  watch: {
    getData(val) {
      let arr = []
      val.forEach((value, index) => {
        if (value.parentId === -1) {
          arr.push(value)
        }
      })
      this.allmenuLista = arr
      console.log(this.allmenuLista, 'this.allmenuLista')
    },
    getData2(val) {
      let arr = []
      val.forEach((value, index) => {
        if (value.parentId === -1) {
          arr.push(value)
        }
      })
      this.allmenuListb = arr
      console.log(this.allmenuListb, 'this.allmenuListb')
    }
  },
  computed: {
    getData() {
      let that = this
      this.allmenuList.forEach((val, index) => {
        val.list = []
        that.allmenuList.forEach((v, i) => {
          if (v.parentId === val.menuId) {
            val.list.push(v)
          }
        })
      })
      return this.allmenuList
    },
    getData2() {
      let that = this
      this.allmenuListB.forEach((val, index) => {
        val.list = []
        that.allmenuListB.forEach((v, i) => {
          if (v.parentId === val.menuId) {
            val.list.push(v)
          }
        })
      })
      return this.allmenuListB
    }
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
.m_l_15 {
  margin-left: 15px;
}
.btn-row {
  text-align: center;
  padding-top: 20px;
}
.el-header,
.el-main,
.el-footer {
  padding: 0;
}
</style>
