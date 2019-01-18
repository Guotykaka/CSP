<template>
  <div class="page-wrapper">
    <header-top></header-top>

    <div class="page-container">
      <el-header height="30">
        <el-form :model="searchParams" class="demo-form-inline">
          <el-form-item label="角色名称：">
            <el-col :span="6">
              <el-input v-model="searchParams.roleName" placeholder="" @keyup.enter.native="doSearch()"
                        clearable></el-input>
            </el-col>
            <el-button type="primary" @click="doSearch()" class="m_l_15">查询</el-button>
            <el-button type="primary" @click="handleAdd()">新增</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <!-- 修改 -->
        <div v-if="dialogEditVisible">
          <el-dialog title="修改" :visible.sync="dialogEditVisible" width=800px :before-close="handleCloseEidt">
            <el-form :model="editTable">
              <el-form-item label="角色名称:" :label-width="formLabelWidth">
                <el-col :span="16">
                  <el-input v-model="editTable.roleName" auto-complete="off" el></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="角色描述:" :label-width="formLabelWidth">
                <el-col :span="16">
                  <el-input v-model="editTable.remark" auto-complete="off" el></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="功能权限:" :label-width="formLabelWidth" v-model="sysRoleMenuListVOList">
                <el-col :span="8">
                  <h4 v-show="flag1" class="m_l_60">运营端</h4>
                  <el-tree v-show="flag1"
                           :data="operateMenu"
                           default-expand-all
                           show-checkbox
                           node-key="menuId"
                           v-bind:check-strictly="true"
                           :indent="5"
                           :check-on-click-node='true'
                           :expand-on-click-node='false'
                           :default-checked-keys="sysRoleMenuListVOList.menuIdList"
                           ref="tree1" :props="defaultProps">
                  </el-tree>
                </el-col>
                <el-col :span="8">
                  <h4 v-show="flag2" class="m_l_60">医生端</h4>
                  <el-tree v-show="flag2"
                           :data="doctorMenu"
                           show-checkbox
                           node-key="menuId"
                           :default-checked-keys="sysRoleMenuListVOList.menuIdList"
                           ref="tree2" :props="defaultProps"
                           default-expand-all
                           :indent="5"
                           :check-on-click-node='true'
                           :expand-on-click-node='false'
                           v-bind:check-strictly="true">
                  </el-tree>
                </el-col>
              </el-form-item>
            </el-form>
            <div class="btn-row">
              <el-button size="small" type="primary" @click="_doHandleEdit()">确定</el-button>
              <el-button size="small" type="primary" @click="_doCancel()">取消</el-button>
            </div>
          </el-dialog>
        </div>
        <!-- 新增 -->
        <div v-if="dialogAddVisible">
          <el-dialog title="新增" :visible.sync="dialogAddVisible" width=800px :before-close="handleCloseAdd">
            <el-form :model="addTable" :rules="rulesNew" ref="formNew">
              <el-form-item label="角色名称:" :label-width="formLabelWidth" prop="roleName">
                <el-col :span="16">
                  <el-input v-model="addTable.roleName" auto-complete="off" el></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="角色描述:" :label-width="formLabelWidth" prop="remark">
                <el-col :span="16">
                  <el-input v-model="addTable.remark" auto-complete="off" el></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="功能权限:" :label-width="formLabelWidth">
                <el-col :span="8">
                  <h4 v-show="flag1" class="m_l_60">运营端</h4>
                  <el-tree v-show="flag1" :data="operateMenu"
                           show-checkbox
                           node-key="menuId"
                           ref="treenew1"
                           :props="defaultProps"
                           :auto-expand-parent="false"
                           :indent="5"
                           :check-on-click-node='true'
                           :expand-on-click-node='false'
                           v-bind:check-strictly="true">
                  </el-tree>
                </el-col>
                <el-col :span="8">
                  <h4 v-show="flag2" class="m_l_60">医生端</h4>
                  <el-tree v-show="flag2"
                           :data="doctorMenu"
                           show-checkbox
                           node-key="menuId"
                           ref="treenew2"
                           :props="defaultProps"
                           :auto-expand-parent="false"
                           :indent="5"
                           :check-on-click-node='true'
                           :expand-on-click-node='false'
                           v-bind:check-strictly="true">
                  </el-tree>
                </el-col>
                <!--<el-col :span="5">
                  <div v-show="flag3">企业端</div>
                </el-col>-->
              </el-form-item>
            </el-form>

            <div class="btn-row">
              <el-button size="small" type="primary" @click="submitForm('formNew')">确定</el-button>
              <el-button size="small" type="primary" @click="_doAddCancel()">取消</el-button>
            </div>
          </el-dialog>
        </div>
        <!-- 列表 -->
        <template>
          <el-table :data="tableData" border style="width: 100%" id="app">
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
      <div class="self-page-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="searchParams.currentPage" :page-sizes="[10,20]" :page-size="searchParams.pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
    </div>
  </div>

</template>


<script>
  import {
    ERR_OK,
    getListRole,//获取列表
    getRoleInfo,//角色详情信息
    PostSaveRole,//新增角色
    PostUpdateRole,//修改角色
    PostDeleteRole,//删除角色
    getMenuListByCategory//选择菜单
  } from '@/api/api.js'
  import {IsAlert} from '@/config/mUtils.js'
  import headerTop from '@/components/headTop.vue'

  export default {
    components: {
      headerTop
    },
    data() {
      return {
        doctorMenu: [],//医生菜单
        operateMenu: [],//运营端菜单
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
          children: 'childMenus',
          label: 'menuName'
          // isLeaf: false
        },
        dateNw: Date.parse(new Date()),
        params: {timespan: this.dateNw},
        sysRoleMenuListVOList: {category: ["1", "0"], menuIdList: [1, 147, 36]}, //详情中的树状列表
        formInline: {valueSS: ''},
        currentPage: 1, //分页初始页码
        pagesize: 10, //分页初始显示条数
        tableData: [], //列表数据
        editTable: {}, //修改单个数据
        editTableRoot: {},
        addTable: {
          //新增单个数据
          roleId: '',
          mrMenuEntities: [],
          remark: '',
          roleName: ''
        }, //新增单个数据
        dialogCheckVisible: false, //查看
        dialogEditVisible: false, //修改
        dialogAddVisible: false, //新增
        inde: null, //index flag
        formLabelWidth: '120px',
        rulesNew: {
          roleName: [
            {required: true, message: '请填写角色名称！', trigger: 'blur'}
          ],
          roleCode: [
            {required: true, message: '请填写角色代码！', trigger: 'blur'}
          ],
          remark: [
            {required: true, message: '请填写角色描述！', trigger: 'blur'}
          ],
        },
      }
    },
    methods: {
      submitForm(formName) {
        //新增模块表单验证
        this.$refs[formName].validate(valid => {
          if (valid) {
            this._doAdd();
          } else {
            return false;
          }
          ;
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      handleCheck(val) {

      },
      //获取医生端或运营端菜单
      getdictionaryData() {
        /*医生*/
        let params = {
          category: 0
        };
        getMenuListByCategory(params)
          .then(res => {
            if (res.code === ERR_OK) {
              this.doctorMenu = res.data;
            } else {
              IsAlert(res.msg, '错误', 'error');
            }
          })
          .catch(() => {
            this.$message.error('网络错误!请稍后重试');
          });
        /*运营*/
        let params2 = {
          category: 1
        };
        getMenuListByCategory(params2)
          .then(res => {
            if (res.code === ERR_OK) {
              this.operateMenu = res.data;
            } else {
              IsAlert(res.msg, '错误', 'error');
            }
          })
          .catch(() => {
            this.$message.error('网络错误!请稍后重试');
          })
      },
      /*查询*/
      doSearch() {
        this.searchParams.currentPage = 1;
        this.getRoleList()
      },
      /*根据页面条数查询*/
      handleSizeChange(size) {
        this.searchParams.pageSize = size;
        this.getRoleList()
      },
      /*根据页码查询列表*/
      handleCurrentChange: function (currentPage) {
        this.searchParams.currentPage = currentPage;
        this.getRoleList()
      },
      // 新增
      handleAdd() {
        // this.sysRoleMenuListVOList = {"category":0,"menuIdList":[105,107,116,56,123,131,57,58]},
        this.chenge();
        this.dialogAddVisible = true
      },
      // 确定新增
      _doAdd() {
        let menuIdList1 = this.$refs.treenew1.getCheckedNodes();
        let menuIdList2 = this.$refs.treenew2.getCheckedNodes();
        this.addTable.mrMenuEntities = menuIdList1.concat(menuIdList2);
        if(this.addTable.mrMenuEntities.length<1){
          IsAlert('请选择菜单目录', '提示', 'warning');
          return;
        }
        let params = {
          roleId: this.addTable.roleId,
          mrMenuEntities: this.addTable.mrMenuEntities,
          remark: this.addTable.remark,
          roleName: this.addTable.roleName
        };

        PostSaveRole(params).then(response => {
          if (response.code === ERR_OK) {
            IsAlert(response.msg, '成功', 'success');
            this.getRoleList();
            this.handleCloseAdd();
          } else {
            IsAlert(response.msg, '错误', 'error');
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试');
        });
        /*this.handleCloseAdd()*/
      },
      //取消新增
      _doAddCancel() {
        this.handleCloseAdd();
        this.$message({
          type: 'warning',
          message: '取消新增'
        })
      },
      handleCloseAdd() {
        //:before-close
        this.resetForm('formNew');
        //重置新增数据为空
        this.addTable = {
          roleId: '',
          mrMenuEntities: [],
          remark: '',
          roleName: ''
        };
        this.dialogAddVisible = false
      },
      chenge() {
        //checkbox绑定
        this.sysRoleMenuListVOList.category = String(
          this.sysRoleMenuListVOList.category
        );
        let arr = [];
        this.sysRoleMenuListVOList.category.split(',').forEach(function (item) {
          arr.push(item)
        });
        this.sysRoleMenuListVOList.category = arr;
        var myVar0 = '1';
        var myVar1 = '0';
        var myVar2 = '2';
        //数组
        var array = this.sysRoleMenuListVOList.category;
        var flag1 = false;
        var flag2 = false;
        var flag3 = false;
        for (var i = 0; i < array.length; i++) {
          if (myVar0 == array[i]) {
            flag1 = true;
            break
          }
        }
        for (var i = 0; i < array.length; i++) {
          if (myVar1 == array[i]) {
            flag2 = true;
            break
          }
        }
        for (var i = 0; i < array.length; i++) {
          if (myVar2 == array[i]) {
            flag3 = true;
            break
          }
        }
        this.flag1 = flag1;
        this.flag2 = flag2;
        this.flag3 = flag3
      },
      // 修改
      handleEdit(index, row) {
        let params = {
          id: row.roleId
        };
        this.dialogEditVisible=true;
        getRoleInfo(params).then((res) => {
          if (res.code === ERR_OK) {
            this.editTable = res.data;
            this.$refs.tree1.setCheckedKeys(res.data.mrMenuEntities);
            this.$refs.tree2.setCheckedKeys(res.data.mrMenuEntities);
          } else {
            IsAlert(response.msg, '错误', 'error');
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        })
      },
      //确定修改
      _doHandleEdit() {
        let menuIdList1 = this.$refs.tree1.getCheckedNodes();
        let menuIdList2 = this.$refs.tree2.getCheckedNodes();
        this.editTable.mrMenuEntities = menuIdList1.concat(menuIdList2);
        if(this.editTable.mrMenuEntities.length<1){
          IsAlert('请选择菜单目录', '提示', 'warning');
          return;
        }
        let params = {
          roleId: this.editTable.roleId,
          mrMenuEntities: this.editTable.mrMenuEntities,
          remark: this.editTable.remark,
          roleName: this.editTable.roleName
        };
        PostUpdateRole(params).then((res) => {
          if (res.code === ERR_OK) {
            IsAlert(res.msg, '成功', 'success');
            this.handleCloseEidt();
            this.getRoleList();
          } else {
            IsAlert(res.msg, '错误', 'error');
          }
        })
      },
      //取消修改
      _doCancel() {
        this.handleCloseEidt()
        this.$message({
          type: 'warning',
          message: '取消修改'
        })
      },
      /*关闭编辑弹窗*/
      handleCloseEidt() {
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
            let params = {
              id: row.roleId,
              status: 2
            };
            PostDeleteRole(params)
              .then(response => {
              IsAlert(response.msg, '成功', 'success');
              this.getRoleList()
            })
              .catch(() => {
                this.$message.error('网络错误!请稍后重试');
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
        };
        getListRole(params).then(response => {
          this.tableData = [];
          this.tableData = response.data.list;
          this.totalCount = response.data.totalCount
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试');
        })
      }
    },
    activated () {
      this.getdictionaryData()
      this.getRoleList()
    },
    /*watch: {
      getData(val) {
        let arr = []
        val.forEach((value, index) => {
          if (value.parentId === -1) {
            arr.push(value)
          }
        })
        this.allmenuLista = arr
      },
      getData2(val) {
        let arr = []
        val.forEach((value, index) => {
          if (value.parentId === -1) {
            arr.push(value)
          }
        })
        this.allmenuListb = arr
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
    }*/
  }
</script>

<style lang="less" scoped>
  .m_l_60 {
    margin-left: 60px;
  }

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
