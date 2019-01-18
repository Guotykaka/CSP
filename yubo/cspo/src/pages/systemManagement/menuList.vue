<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container menu" v-cloak>
      <div class="pagebox" v-if="show">
        <el-row>
          <el-button type="primary" @click="add">新增一级菜单</el-button>
        </el-row>
        <div class="table-style">
          <el-tabs type="border-card" @tab-click="handleClick" v-model="activeName">

            <el-tab-pane name="second" label="运营端">
              <el-table
                ref="singleTable"
                :data="menuData"
                header-align="left"
                highlight-current-row
                :default-sort="{prop: 'orderNum'}"
                @current-change="handleCurrentChange"
                style="width: 100%">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <dict-model :dataList="props.row.childMenus||[]"
                                @addNextEvl="addNextEvl"
                                @handleClickTable="handleClickTable"
                                @del="del"></dict-model>
                  </template>
                </el-table-column>

                <el-table-column
                  :show-overflow-tooltip="true"
                  align="right"
                  label=""
                  width="100">
                </el-table-column>

                <el-table-column
                  property="menuName"
                  label="菜单名称"
                  width="120">
                </el-table-column>

                <el-table-column
                  property="icon"
                  width="120"
                  label="图标">
                  <template slot-scope="scope">
                    <i :class="scope.row.icon"></i>
                  </template>
                </el-table-column>


                <el-table-column
                  property="orderNum"
                  width="120"
                  label="排序">
                </el-table-column>
                <el-table-column
                  property="url"
                  width="200"
                  label="菜单URL">
                </el-table-column>

                <el-table-column
                  align="center"
                  label="操作"
                  width="300">
                  <template slot-scope="scope">
                    <el-button @click="addNextEvl(scope.row)" type="success" size="mini">添加下一级</el-button>
                    <el-button @click="handleClickTable(scope.row)" type="primary" size="mini">修改</el-button>
                    <el-button @click="del(scope.row)" type="danger" size="mini">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane name="first" label="医生端">
              <el-table
                ref="singleTable"
                :data="menuData"
                header-align="left"
                highlight-current-row
                :default-sort="{prop: 'orderNum'}"
                @current-change="handleCurrentChange"
                style="width: 100%">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <dict-model :dataList="props.row.childMenus||[]"
                                @addNextEvl="addNextEvl"
                                @handleClickTable="handleClickTable"
                                @del="del"></dict-model>
                  </template>
                </el-table-column>

                <el-table-column
                  :show-overflow-tooltip="true"
                  align="right"
                  label=""
                  width="100">
                </el-table-column>

                <el-table-column
                  property="menuName"
                  label="菜单名称"
                  width="120">
                </el-table-column>

                <el-table-column
                  property="parentName"
                  label="上级菜单"
                  width="120">
                </el-table-column>

                <el-table-column
                  property="icon"
                  width="120"
                  label="图标">
                  <template slot-scope="scope">
                    <i :class="scope.row.icon"></i>
                  </template>
                </el-table-column>

                <el-table-column
                  property="orderNum"
                  width="120"
                  label="排序">
                </el-table-column>
                <el-table-column
                  property="url"
                  width="200"
                  label="菜单URL">
                </el-table-column>

                <!--<el-table-column
                  property="perms"
                  label="授权标识">
                </el-table-column>-->
                <el-table-column
                  align="center"
                  label="操作"
                  width="300">
                  <template slot-scope="scope">
                    <el-button @click="addNextEvl(scope.row)" type="success" size="mini">添加下一级</el-button>
                    <el-button @click="handleClickTable(scope.row)" type="primary" size="mini">修改</el-button>
                    <el-button @click="del(scope.row)" type="danger" size="mini">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <div class="addTable" v-else>
        <el-card class="box-card" :body-style="cardStyle">
          <div slot="header" class="clearfix">
            <span>{{titleName}}</span>
          </div>
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="菜单类别">
              <el-select v-if="titleName==='新增'" v-model="form.category">
                <!--<el-option :label="item.value" :value="item.code" v-for="item in categoryList" :key="item.id"></el-option>-->
                <el-option label="运营端" :value="1"></el-option>
                <el-option label="医生端" :value="0"></el-option>
              </el-select>
              <el-select v-else disabled v-model="form.category">
                <!--<el-option :label="item.value" :value="item.code" v-for="item in categoryList" :key="item.id"></el-option>-->
                <el-option label="运营端" :value="1"></el-option>
                <el-option label="医生端" :value="0"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="菜单名称">
              <el-input v-model.trim="form.menuName"></el-input>
            </el-form-item>


            <el-form-item label="菜单URL" v-if="titleName==='添加下一级'||'修改'">
              <el-input v-model.trim="form.url"></el-input>
            </el-form-item>

            <el-form-item label="排序号">
              <el-input v-model.trim="form.orderNum"></el-input>
            </el-form-item>

            <el-form-item label="图标">
              <el-input v-model="form.icon"></el-input>
              <span style="color:#F56C6C">获取图标：http://fontawesome.io/icons/</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">确定</el-button>
              <el-button @click="delSubmit">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-dialog title="选择菜单" :visible.sync="dialogFormVisible" custom-class="setDialog">
          <el-tree
            :data="allmenuLista"
            show-checkbox
            node-key="menuId"
            ref="tree"
            highlight-current
            :check-strictly="true"
            @check="handleCheck"
            :props="defaultProps">
          </el-tree>
          <div class="buttons">
            <el-button type="primary" @click="sureSelect">确定</el-button>
            <el-button type="info" @click="resetChecked">取消</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
  import headerTop from '@/components/headTop.vue';
  import DictModel from './components/menuModel';
  import {
    ERR_OK,
    Menudelete,
    getMenuListAjAX,//获取所有菜单列表
    getMenuListByCategory,//获取所有菜单列表(医生或运营)
    getSysMenuByCategory,
    getDictListByType,
    Menusave,
    MenuUpdate,
  } from '@/api/api';
  import {getStore,IsAlert} from "@/config/mUtils.js"

  export default {
    name: 'menuList',
    components: {
      headerTop,
      DictModel
    },
    data() {
      return {
        currentRow: null,
        menuList: [],//对应模块菜单
        allmenuList:[],//所有菜单
        allmenuLista:[],
        formatDataa: [],
        show: true,
        activeName: 'second',
        menuParams: {
          category: 1
        },//菜单参数
        form: {
          menuName: '',//菜单名称
          icon: '',//菜单图标
          orderNum: null,//排序
          parentId: '0',//上级菜单id
          parentName: '',//上级菜单名称
          url: '',//菜单地址
          category:1,
          menuId:''
        },
        cardStyle: {
          width: '80%',
          margin: '0 auto'
        },
        categoryList:[],//菜单类别
        titleName:'',//新增&修改
        count: 1,
        dialogTableVisible: false,
        dialogFormVisible: false,
        defaultProps: {
          children: 'list',
          label: 'name',
          isLeaf: false
        },
        leafOnly: true,
        menuData:[],
      }
    }
    ,
    created() {
      this.getMenuList();
    },
    methods: {
      //tab标签切换
      handleClick(tab, event) {
        if (tab.name === 'second') {
          this.menuParams.category  = 1;//运营
          this.form.category=1;
          this.getMenuList()
        } else if (tab.name === 'first') {
          this.menuParams.category = 0;//医生
          this.form.category=0;
          this.getMenuList()
        }
      },
      //初始fome值
      formInit(){
        let categoryType;
        if (this.activeName === 'second') {
          categoryType=1;
        } else if (this.activeName === 'first') {
          categoryType=0;
        }
        this.form = {
          menuName: '',//菜单名称
          icon: '',//菜单图标
          orderNum: null,//排序
          parentId: '0',//上级菜单id
          parentName: '',//上级菜单名称
          url: '',//菜单地址
          category: categoryType,
          menuId: ''
        }
      },
      //选中一行修改
      handleClickTable(row) {
        this.titleName = '修改'
        this.show = false;
        this.form = {
          menuName: row.menuName,//菜单名称
          icon:  row.icon,//菜单图标
          orderNum:  row.orderNum,//排序
          parentId:  row.parentId,//上级菜单id
          parentName:  row.parentName,//上级菜单名称
          perms:  row.perms,//授权码
          type:  row.type,
          url:  row.url,//菜单地址
          category: row.category,
          menuId:row.menuId
        };
      },
      //选中一行删除
      del(row) {
        let that=this,
          params ={
            "id": row.menuId
          };
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center:true
        }).then(() => {
          Menudelete(params).then((res) => {
            if (res.code === ERR_OK) {
              IsAlert(res.msg,'成功','success');
              that.getMenuList();
            } else {
              IsAlert(res.msg,'错误','error');
            }
          }).catch(()=>{
            this.$message.error('网络错误!请稍后重试');
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
        //
      },
      handleCurrentChange(val) {
        this.currentRow = val;
      },
      /*获取相应菜单*/
      getMenuList() {
        let params = this.menuParams;
        getMenuListByCategory(params).then((res) => {
          if (res.code === ERR_OK) {
            // this.menuList = res.data;
            this.menuData = res.data;
          } else {
            IsAlert(res.msg,'错误','error');
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试');
        })
      },

      add() {
        this.titleName = '新增'
        this.show = false;
      },
      /*添加下一级菜单*/
      addNextEvl(value) {
        this.titleName = '添加下一级';
        this.form.parentName = value.menuName;
        this.form.parentId = value.menuId;
        this.show = false;
      },
      //保存
      onSubmit() {
        if (this.activeName === 'second') {
          this.menuParams.category  = 1;//运营
          this.form.category=1;
        } else if (this.activeName === 'first') {
          this.menuParams.category = 0;//医生
          this.form.category=0;
        }
        let that = this;
        if(this.form.menuName===''){
          IsAlert('菜单名称不能为空','提示','warning');
          return;
        }
          Menusave(that.form).then((res)=>{
            if(res.code===ERR_OK){
              IsAlert(res.msg,'成功','success');
              that.show=true;
              that.getMenuList();
              that.formInit();
            }else{
              IsAlert(res.msg,'错误','error');
            }
          }).catch(()=>{
            this.$message.error('网络错误!请稍后重试');
          })
      },
      //取消创建
      delSubmit(){
        this.show=true;
        this.formInit();
      },
      //tree
      //展示树结构
      showTree() {
        this.dialogFormVisible = !this.dialogFormVisible
      },
      //确定选择
      sureSelect(){
        this.showTree()
      },
      handleCheck(val){
        this.form.parentName = val.name;
        this.form.parentId = val.menuId;
        this.$refs.tree.setCheckedNodes([]);
        this.$refs.tree.setCheckedKeys([val.menuId]);
      },
      resetChecked() {
        this.$refs.tree.setCheckedKeys([]);
        this.showTree()
        this.form.parentId = '0'
        this.form.parentName = ''
      }
    }
    ,

  }
</script>
<style lang="less">
  .el-table__expanded-cell {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    padding-right: 0 !important;
  }
  .setDialog{
    position:relative;
    display:block;
    overflow: auto;
    height:700px;
    .el-dialog__body{
      padding-bottom: 100px;
      .buttons{
        position:fixed;
        bottom:120px;
        left:0;
        right:0;
        text-align: center;
      }
    }
  }
</style>
<style lang="less" scoped>
  .menu {
    .table-style {
      margin-top: 20px;
    }
    .box-card {
      width: 700px;
      margin-top: 20px;
    }

  }
  .table-style /deep/ .el-table__expanded-cell[class*=cell] {
    padding-left: 20px;
  }

  .table-style /deep/ .el-table td {
    padding: 6px 0;
  }
</style>
