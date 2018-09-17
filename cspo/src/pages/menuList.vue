<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container menu" v-cloak>
      <div class="pagebox" v-if="show">
        <el-row>
          <el-button type="primary" @click="add">新增</el-button>
        </el-row>
        <div class="table-style">
          <el-tabs type="border-card" @tab-click="handleClick" v-model="activeName">
            <el-tab-pane name="zero" label="运营端">
              <menu-list-son :dataList="formatDataa"></menu-list-son>



<!--              <el-table
                ref="singleTable"
                :data="formatDataa"
                header-align="left"
                highlight-current-row
                :default-sort="{prop: 'orderNum'}"
                @current-change="handleCurrentChange"
                style="width: 100%">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-table
                      ref="singleTable"
                      :show-header="false"
                      :data="props.row.list"
                      highlight-current-row
                      :default-sort="{prop: 'orderNum'}"
                      @current-change="handleCurrentChange"
                      style="width: 100%">

                      <el-table-column
                        property="menuId"
                        label="ID"
                        width="120">
                      </el-table-column>

                      <el-table-column
                        property="name"
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
                        property="type"
                        width="120"
                        label="类型">
                        <template slot-scope="scope">
                          <el-tag v-if="scope.row.type===0">目录</el-tag>
                          <el-tag v-if="scope.row.type===1" type="success">菜单</el-tag>
                          <el-tag v-if="scope.row.type===2" type="warning">按钮</el-tag>
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
                        property="perms"
                        label="授权标识">
                      </el-table-column>

                      <el-table-column
                        fixed="right"
                        label="操作"
                        width="200">
                        <template slot-scope="scope">
                          <el-button @click="handleClickTable(scope.row)" type="primary" size="mini">修改</el-button>
                          <el-button @click="del(scope.row)" type="danger" size="mini">删除</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </el-table-column>

                <el-table-column
                  property="menuId"
                  label="ID"
                  width="120">
                </el-table-column>

                <el-table-column
                  property="name"
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
                  property="type"
                  width="120"
                  label="类型">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.type===0">目录</el-tag>
                    <el-tag v-if="scope.row.type===1" type="success">菜单</el-tag>
                    <el-tag v-if="scope.row.type===2" type="warning">按钮</el-tag>
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
                  property="perms"
                  label="授权标识">
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作"
                  width="200">
                  <template slot-scope="scope">
                    <el-button @click="handleClickTable(scope.row)" type="primary" size="mini">修改</el-button>
                    <el-button @click="del(scope.row)" type="danger" size="mini">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>-->
            </el-tab-pane>
            <el-tab-pane name="first" label="医生端">
              <el-table
                ref="singleTable"
                :data="formatDataa"
                header-align="left"
                highlight-current-row
                :default-sort="{prop: 'orderNum'}"
                @current-change="handleCurrentChange"
                style="width: 100%">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-table
                      ref="singleTable"
                      :show-header="false"
                      :data="props.row.list"
                      highlight-current-row
                      :default-sort="{prop: 'orderNum'}"
                      @current-change="handleCurrentChange"
                      style="width: 100%">

                      <el-table-column
                        property="menuId"
                        label="ID"
                        width="120">
                      </el-table-column>

                      <el-table-column
                        property="name"
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
                        property="type"
                        width="120"
                        label="类型">
                        <template slot-scope="scope">
                          <el-tag v-if="scope.row.type===0">目录</el-tag>
                          <el-tag v-if="scope.row.type===1" type="success">菜单</el-tag>
                          <el-tag v-if="scope.row.type===2" type="warning">按钮</el-tag>
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
                        property="perms"
                        label="授权标识">
                      </el-table-column>

                      <el-table-column
                        fixed="right"
                        label="操作"
                        width="200">
                        <template slot-scope="scope">
                          <el-button @click="handleClickTable(scope.row)" type="primary" size="mini">修改</el-button>
                          <el-button @click="del(scope.row)" type="danger" size="mini">删除</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </el-table-column>

                <el-table-column
                  property="menuId"
                  label="ID"
                  width="120">
                </el-table-column>

                <el-table-column
                  property="name"
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
                  property="type"
                  width="120"
                  label="类型">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.type===0">目录</el-tag>
                    <el-tag v-if="scope.row.type===1" type="success">菜单</el-tag>
                    <el-tag v-if="scope.row.type===2" type="warning">按钮</el-tag>
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
                  property="perms"
                  label="授权标识">
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作"
                  width="200">
                  <template slot-scope="scope">
                    <el-button @click="handleClickTable(scope.row)" type="primary" size="mini">修改</el-button>
                    <el-button @click="del(scope.row)" type="danger" size="mini">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane name="second" label="企业端">
              <el-table
                ref="singleTable"
                :data="formatDataa"
                header-align="left"
                highlight-current-row
                :default-sort="{prop: 'orderNum'}"
                @current-change="handleCurrentChange"
                style="width: 100%">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-table
                      ref="singleTable"
                      :show-header="false"
                      :data="props.row.list"
                      highlight-current-row
                      :default-sort="{prop: 'orderNum'}"
                      @current-change="handleCurrentChange"
                      style="width: 100%">

                      <el-table-column
                        property="menuId"
                        label="ID"
                        width="120">
                      </el-table-column>

                      <el-table-column
                        property="name"
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
                        property="type"
                        width="120"
                        label="类型">
                        <template slot-scope="scope">
                          <el-tag v-if="scope.row.type===0">目录</el-tag>
                          <el-tag v-if="scope.row.type===1" type="success">菜单</el-tag>
                          <el-tag v-if="scope.row.type===2" type="warning">按钮</el-tag>
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
                        property="perms"
                        label="授权标识">
                      </el-table-column>

                      <el-table-column
                        fixed="right"
                        label="操作"
                        width="200">
                        <template slot-scope="scope">
                          <el-button @click="handleClickTable(scope.row)" type="primary" size="mini">修改</el-button>
                          <el-button @click="del(scope.row)" type="danger" size="mini">删除</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </el-table-column>

                <el-table-column
                  property="menuId"
                  label="ID"
                  width="120">
                </el-table-column>

                <el-table-column
                  property="name"
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
                  property="type"
                  width="120"
                  label="类型">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.type===0">目录</el-tag>
                    <el-tag v-if="scope.row.type===1" type="success">菜单</el-tag>
                    <el-tag v-if="scope.row.type===2" type="warning">按钮</el-tag>
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
                  property="perms"
                  label="授权标识">
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作"
                  width="200">
                  <template slot-scope="scope">
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
              <el-select v-model="form.category">
                <el-option :label="item.value" :value="item.code" v-for="item in categoryList" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="类型">
              <el-radio-group v-model="form.type">
                <el-radio :label="0">目录</el-radio>
                <el-radio :label="1">菜单</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="菜单名称">
              <el-input v-model="form.name"></el-input>
            </el-form-item>

            <el-form-item label="上级菜单">
              <el-input v-model="form.parentName" @focus="showTree"></el-input>
            </el-form-item>

            <el-form-item label="菜单URL">
              <el-input v-model="form.url"></el-input>
            </el-form-item>

            <el-form-item label="授权标识">
              <el-input v-model="form.perms"></el-input>
            </el-form-item>

            <el-form-item label="排序号">
              <el-input v-model="form.orderNum"></el-input>
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
  import MenuListSon from '@/pages/menuListSon';
  import {
    ERR_OK,
    getMenuListByCategory,
    getMenuList,
    getSysMenuByCategory,
    getDictListByType,
    Menusave,
    MenuUpdate,
    Menudelete
  } from '@/api/api';
  import {getStore} from "@/config/mUtils.js"

  export default {
    name: 'menuList',
    components: {
      headerTop,
      MenuListSon
    },
    data() {
      return {
        childrenConfig: {
          children: 'list',
          label: 'menuId'
        },
        currentRow: null,
        menuList: [],//对应模块菜单
        allmenuList: [],//所有菜单
        allmenuLista: [],
        formatDataa: [],
        show: true,
        activeName: 'zero',
        menuParams: {
          id: '1'
        },//菜单参数
        form: {
          name: '',//菜单名称
          icon: '',//菜单图标
          orederNum: null,//排序
          parentId: '',//上级菜单id
          parentName: '',//上级菜单名称
          perms: '',//授权码
          type: 1,
          url: '',//菜单地址
          category: '1'
        },
        cardStyle: {
          width: '80%',
          margin: '0 auto'
        },
        categoryList: [],//菜单类别
        titleName: '',//新增&修改
        count: 1,
        dialogTableVisible: false,
        dialogFormVisible: false,
        defaultProps: {
          children: 'list',
          label: 'name',
          isLeaf: false
        },
        leafOnly: true
      };
    }
    ,
    created() {
      this.getMenuList();
    },
    methods: {
      //tab标签切换
      handleClick(tab, event) {
        if (tab.name === 'zero') {
          this.menuParams.id = '1'//运营
          this.getMenuList()
        } else if (tab.name === 'first') {
          this.menuParams.id = '0'//医生
          this.getMenuList()
        } else if (tab.name === 'second') {
          this.menuParams.id = '2'//企业
          this.getMenuList()
        }
      },
      //初始fome值
      formInit() {
        this.form = {
          name: '',//菜单名称
          icon: '',//菜单图标
          orederNum: null,//排序
          parentId: '',//上级菜单id
          parentName: '',//上级菜单名称
          perms: '',//授权码
          type: 1,
          url: '',//菜单地址
          category: '1'
        }
      },
      //选中一行修改
      handleClickTable(row) {
        this.titleName = '修改'
        this.show = false;
        this.form = {
          name: row.name,//菜单名称
          icon: row.icon,//菜单图标
          orederNum: row.orederNum,//排序
          parentId: row.parentId,//上级菜单id
          parentName: row.parentName,//上级菜单名称
          perms: row.perms,//授权码
          type: row.type,
          url: row.url,//菜单地址
          category: row.category.toString(),
          menuId: row.menuId
        };
        this.getdictionaryData();
      },
      //选中一行删除
      del(row) {
        console.log(row);
        let that = this,
          params = {
            "id": row.menuId
          }
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Menudelete(params).then((res) => {
            if (res.code === ERR_OK) {
              this.$alert(res.msg, '提示', {
                confirmButtonText: '确定',
              })
              that.getMenuList();
            } else {
              this.$alert(res.msg, '提示', {
                confirmButtonText: '确定',
              })
            }
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
      getMenuList() {
        let params = this.menuParams;
        getMenuListByCategory(params).then((res) => {
          if (res.code === ERR_OK) {
            this.menuList = res.data;
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        })
      },
      //获取字典数据
      getdictionaryData() {
        let typeParams = {
          type: 'MENU_TYPE'
        };
        //获取菜单类别
        getDictListByType(typeParams).then((res) => {
          if (res.code === ERR_OK) {
            this.categoryList = res.data;
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        })
        let params = {
          category: this.form.category
        };
        //获取所有菜单
        getSysMenuByCategory(params).then((res) => {
          if (res.code === ERR_OK) {
            this.allmenuList = res.data;
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        })
      },
      add() {
        this.titleName = '新增'
        this.show = false;
        this.getdictionaryData()
      },
      //保存
      onSubmit() {
        let that = this;
        if (this.form.name === '') {
          this.$alert('菜单名称不能为空')
          return;
        } else if (this.form.parentName === '') {
          this.$alert('请选择上级菜单名称');
          return;
        } else if (this.form.url === '') {
          this.$alert('请输入菜单URL');
          return;
        }
        if (this.titleName === '新增') {
          Menusave(that.form).then((res) => {
            if (res.code === ERR_OK) {
              that.$alert(res.msg);
              that.show = true;
              that.getMenuList();
              that.formInit();
            } else {
              that.$alert(res.msg)
            }
          })
        } else if (this.titleName === '修改') {
          MenuUpdate(that.form).then((res) => {
            if (res.code === ERR_OK) {
              that.$alert(res.msg);
              that.show = true;
              that.getMenuList();
              that.formInit();
            } else {
              that.$alert(res.msg)
            }
          })
        }
      },
      //取消创建
      delSubmit() {
        this.show = true;
        this.formInit();
      },
      //tree
      //展示树结构
      showTree() {
        this.dialogFormVisible = !this.dialogFormVisible
      },
      //确定选择
      sureSelect() {
        this.showTree()
      },
      handleCheck(val) {
        this.form.parentName = val.name;
        this.form.parentId = val.menuId;
        this.$refs.tree.setCheckedNodes([]);
        this.$refs.tree.setCheckedKeys([val.menuId]);
      },
      resetChecked() {
        this.$refs.tree.setCheckedKeys([]);
        this.showTree()
        this.form.parentId = ''
        this.form.parentName = ''
      }
    }
    ,
    watch: {
      formatData(val) {
        let arr = [];
        val.forEach((value, index) => {
          if (value.parentId === 0) {
            arr.push(value)
          }
        })
        this.formatDataa = arr
      },
      getData(val) {
        let arr = [];
        val.forEach((value, index) => {
          if (value.parentId === -1) {
            arr.push(value)
          }
        })
        this.allmenuLista = arr
      }
    }
    ,
    computed: {
      formatData() {
        let that = this;
        this.menuList.forEach((val, index) => {
          val.list = []
          that.menuList.forEach((v, i) => {
            if (v.parentId === val.menuId) {
              val.list.push(v)
            }
          });
        });
        return this.menuList
      },
      getData() {
        let that = this;
        this.allmenuList.forEach((val, index) => {
          val.list = []
          that.allmenuList.forEach((v, i) => {
            if (v.parentId === val.menuId) {
              val.list.push(v)
            }
          });
        });
        return this.allmenuList
      }
    }
  }
</script>
<style lang="less">
  .el-table__expanded-cell {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    padding-right: 0 !important;
  }

  .setDialog {
    position: relative;
    display: block;
    overflow: auto;
    height: 700px;
    .el-dialog__body {
      padding-bottom: 100px;
      .buttons {
        position: fixed;
        bottom: 120px;
        left: 0;
        right: 0;
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
  .custom-tree-node{
    width:100%;
    height:60px;
    border:1px solid #ccc;
    .tree-ul{
      width:100%;
      display: flex;
      justify-content: space-between;
      li{
        float:left;
        padding:10px;
      }
    }
  }

</style>
