<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container menu" v-cloak>
      <el-row>
        <el-button type="primary" @click="add">新增</el-button>
        <el-button type="primary" @click="update">修改</el-button>
        <el-button type="danger" @click="del">删除</el-button>
      </el-row>
      <div class="table-style">
        <el-tabs type="border-card">
          <el-tab-pane label="运营端">
            <el-table
              ref="singleTable"
              :data="menuList"
              highlight-current-row
              :default-sort = "{prop: 'orderNum'}"
              @current-change="handleCurrentChange"
              style="width: 100%">
              <el-table-column type="expand">
                <template slot-scope="props">
                  <!--<el-table-->
                    <!--ref="singleTable"-->
                    <!--:data="menuList"-->
                    <!--:show-header="false"-->
                    <!--highlight-current-row-->
                    <!--:default-sort = "{prop: 'orderNum'}"-->
                    <!--@current-change="handleCurrentChange"-->
                    <!--style="width: 100%">-->
                    <!--<el-table-column type="expand">-->
                      <!--<template slot-scope="props">-->
                        <!--ggggg-->
                      <!--</template>-->
                    <!--</el-table-column>-->

                    <!--<el-table-column-->
                      <!--property="menuId"-->
                      <!--label="ID"-->
                      <!--width="120">-->
                    <!--</el-table-column>-->

                    <!--<el-table-column-->
                      <!--property="name"-->
                      <!--label="菜单名称"-->
                      <!--width="120">-->
                    <!--</el-table-column>-->

                    <!--<el-table-column-->
                      <!--property="parentName"-->
                      <!--label="上级菜单"-->
                      <!--width="120">-->
                    <!--</el-table-column>-->

                    <!--<el-table-column-->
                      <!--property="icon"-->
                      <!--label="图标">-->
                    <!--</el-table-column>-->

                    <!--<el-table-column-->
                      <!--property="type"-->
                      <!--label="类型">-->
                      <!--<template slot-scope="scope">-->
                        <!--<el-tag v-if="scope.row.type===0">目录</el-tag>-->
                        <!--<el-tag v-if="scope.row.type===1" type="success">菜单</el-tag>-->
                        <!--<el-tag v-if="scope.row.type===2" type="warning">按钮</el-tag>-->
                      <!--</template>-->
                    <!--</el-table-column>-->

                    <!--<el-table-column-->
                      <!--property="orderNum"-->
                      <!--label="排序">-->
                    <!--</el-table-column>-->
                    <!--<el-table-column-->
                      <!--property="url"-->
                      <!--label="菜单URL">-->
                    <!--</el-table-column>-->

                    <!--<el-table-column-->
                      <!--property="perms"-->
                      <!--label="授权标识">-->
                    <!--</el-table-column>-->
                  <!--</el-table>-->
<!--                  <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item label="商品名称">
                      <span>{{ props.row.name }}</span>
                    </el-form-item>
                    <el-form-item label="所属店铺">
                      <span>{{ props.row.shop }}</span>
                    </el-form-item>
                    <el-form-item label="商品 ID">
                      <span>{{ props.row.id }}</span>
                    </el-form-item>
                    <el-form-item label="店铺 ID">
                      <span>{{ props.row.shopId }}</span>
                    </el-form-item>
                    <el-form-item label="商品分类">
                      <span>{{ props.row.category }}</span>
                    </el-form-item>
                    <el-form-item label="店铺地址">
                      <span>{{ props.row.address }}</span>
                    </el-form-item>
                    <el-form-item label="商品描述">
                      <span>{{ props.row.desc }}</span>
                    </el-form-item>
                  </el-form>-->
                </template>
              </el-table-column>

              <el-table-column
                type="index"
                width="50">
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
                label="图标">
                <template slot-scope="scope">
                  <i :class="scope.row.icon"></i>
                </template>
              </el-table-column>

              <el-table-column
                property="type"
                label="类型">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.type===0">目录</el-tag>
                  <el-tag v-if="scope.row.type===1" type="success">菜单</el-tag>
                  <el-tag v-if="scope.row.type===2" type="warning">按钮</el-tag>
                </template>
              </el-table-column>

              <el-table-column
                property="orderNum"
                label="排序">
              </el-table-column>
              <el-table-column
                property="url"
                label="菜单URL">
              </el-table-column>

              <el-table-column
                property="perms"
                label="授权标识">
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="医生端">
          </el-tab-pane>
          <el-tab-pane label="企业端">
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
  import headerTop from '@/components/headTop.vue';
  import {
    ERR_OK,
    getMenuList
  } from '@/api/api';
  import {getStore} from "@/config/mUtils.js"

  export default {
    name: 'menuList',
    components: {
      headerTop
    },
    data() {
      return {
        currentRow: null,
        menuList:[],//所有菜单
      }
    },
    created(){
      this.getMenuList();
    },
    methods: {
      //选中一行
      handleCurrentChange(val) {
        this.currentRow = val;
      },
      getMenuList(){
        let params ={};
        getMenuList(params).then((res)=>{
          if(res.code===ERR_OK){
            this.menuList = res.data;
          }else{
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        })
      },
      add(){

      },
      update(){

      },
      del(){

      }
    },
  }
</script>
<style lang="less" scoped>
.menu{
  .table-style{
    margin-top:20px;
  }
}
</style>
