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
              :data="formatDataa"
              highlight-current-row
              :default-sort="{prop: 'orderNum'}"
              @current-change="handleCurrentChange"
              style="width: 100%">
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-table
                    ref="singleTable"
                    :data="props.row.list"
                    highlight-current-row
                    :default-sort="{prop: 'orderNum'}"
                    @current-change="handleCurrentChange"
                    style="width: 100%">
                    <el-table-column type="expand">
                      <template slot-scope="props">
                        <el-table
                          ref="singleTable"
                          :data="props.row.list"
                          highlight-current-row
                          :default-sort="{prop: 'orderNum'}"
                          @current-change="handleCurrentChange"
                          style="width: 100%">
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
        menuList: [],//所有菜单
        formatDataa: []
      }
    },
    created() {
      this.getMenuList();
    },
    activated() {

      console.log(this.formatData)
    },
    methods: {
      //选中一行
      handleCurrentChange(val) {
        this.currentRow = val;
      },
      getMenuList() {
        let params = {};
        getMenuList(params).then((res) => {
          if (res.code === ERR_OK) {
            this.menuList = res.data;

          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        })
      },
      add() {

      },
      update() {

      },
      del() {

      }
    },
    watch: {
      formatData(val) {
        let arr = [];
        val.forEach((value, index) => {
          if (value.parentId === 0) {
            arr.push(value)
          }
        })
        console.log(arr)
        this.formatDataa = arr
      }
    },
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
        })
        return this.menuList
      }
    },
  }
</script>
<style lang="less" scoped>
  .menu {
    .table-style {
      margin-top: 20px;
    }
  }
</style>
