<template>
  <div class="page-wrapper" id="scroller">
    <header-top></header-top>
    <div class="page-container">
      <div class="search_params">
        <el-form :inline="true" size="small" class="demo-form-inline">
          <el-form-item>
            <el-button type="primary" @click="BatchUpdatePC">{{inputName}}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="content_main">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="APP批量推荐" name="first">
            <span slot="label"><i class="el-icon-mobile-phone"></i>APP批量推荐</span>
          </el-tab-pane>
          <el-tab-pane label="WEB批量推荐" name="second">
            <span slot="label"><i class="el-icon-edit-outline"></i>WEB批量推荐</span>
          </el-tab-pane>
          <el-tab-pane label="优惠券批量推荐" name="third">
            <span slot="label"><i class="el-icon-tickets"></i>优惠券批量推荐</span>
          </el-tab-pane>
        </el-tabs>
        <el-table
          :data="tableData"
          border
          ref="tableAPP"
          style="width: 100%"
          @selection-change="SelectionChange"
        >
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column show-overflow-tooltip fixed type="index" width="80px" align="center"
                           label="序号"></el-table-column>
          <el-table-column show-overflow-tooltip align="center" prop="categoryName" label="类目名称"></el-table-column>
          <el-table-column show-overflow-tooltip align="center" label="类别">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium" type="danger">二级类目</el-tag>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-style">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="searchParams.currentPage"
            :page-sizes="[10,20, 40, 60, 80]"
            :page-size="searchParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import headerTop from '@/components/headTop.vue';
  import {IsAlert} from "@/config/mUtils.js";
  import {
    ERR_OK,
    GetAllProductCategeryList,
    GetProductCategerySelect,
    PostDeletePC,
    PostAddOrUpdatePC,
    PostBatchUpdatePC
  } from '@/api/api.js';

  export default {
    name: "BatchRecommend",
    components: {
      headerTop
    },
    data() {
      return {
        inputName: 'APP批量推荐',
        activeName: 'first',
        tableData: [],
        multipleSelection: [],//勾选列表
        searchParams: {
          categoryLevel: 2,
          currentPage: 1,
          pageSize: 10,
          productRecommendType: 1
        },
        totalCount: null
      }
    },
    methods: {
      BatchUpdatePC() {//批量推荐
        let params = {};
        if (this.activeName === 'first') {
          params = {
            categoryIds : this.multipleSelection,
            productRecommendType: this.searchParams.productRecommendType,
          };
        } else if (this.activeName === 'second') {
          params = {
            categoryIds : this.multipleSelection,
            productRecommendType:this.searchParams.productRecommendType ,
          };
        } else if (this.activeName === 'third') {
          params = {
            categoryIds : this.multipleSelection,
            productRecommendType:this.searchParams.productRecommendType ,
          };
        }
        PostBatchUpdatePC(params).then((res) => {
          if (res.code === ERR_OK) {
            this.$notify({
              type: 'success',
              title: '批量推荐成功！',
              duration: 3000,
            });
            this.getList();
          } else {
            IsAlert(res.msg, '错误', 'error');
            this.getList();
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试');
          this.getList();
        })
      },
      SelectionChange(val) {//勾选事件,给批量推荐事件添加参数id
        this.multipleSelection = [];
        val.forEach(row => {
          this.multipleSelection.push(row.id);
        });
      },
      getList() {/*获取类目列表*/
        let params = {
          categoryLevel: this.searchParams.categoryLevel,
          currentPage: this.searchParams.currentPage,
          pageSize: this.searchParams.pageSize,
          productRecommendType: this.searchParams.productRecommendType
        };
        GetAllProductCategeryList(params).then((res) => {
          if (res.code === ERR_OK) {
            this.tableData = res.data.list;
            this.totalCount = res.data.totalCount;
            this.$nextTick(function () {//每次更新了数据，触发这个函数，即可渲染默认选中。
              this.checked();
            });
          } else {
            IsAlert(`接口错误，code:${res.code}，msg:${res.msg}`, '错误', 'error');
            this.$nextTick(function () {//每次更新了数据，触发这个函数，即可渲染默认选中。
              this.checked();
            });
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        })
      },
      handleClick() {/*tab标签切换*/
        if (this.activeName === 'first') {
          this.inputName = 'APP批量推荐';
          this.searchParams.productRecommendType = 1;
          this.getList();
        } else if (this.activeName === 'second') {
          this.inputName = 'WEB批量推荐';
          this.searchParams.productRecommendType = 2;
          this.getList();
        }
        else if (this.activeName === 'third') {
          this.inputName = '优惠券批量推荐';
          this.searchParams.productRecommendType = 3;
          this.getList();
        }
      },
      //渲染默认选中
      checked() {
        if (this.activeName === 'first') {
          this.tableData.forEach(row => {
            if (row.recommendId) {
              this.$refs.tableAPP.toggleRowSelection(row, true);
            }
          });
        } else if (this.activeName === 'second') {
          this.tableData.forEach(row => {
            if (row.recommendId) {
              this.$refs.tableAPP.toggleRowSelection(row, true);
            }
          });
        } else if (this.activeName === 'third') {
          this.tableData.forEach(row => {
            if (row.recommendId) {
              this.$refs.tableAPP.toggleRowSelection(row, true);
            }
          });
        }
      },
      /*根据每页条数查询*/
      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this.getList();
      },
      /*根据当前页查询*/
      handleCurrentChange(val) {
        this.searchParams.currentPage = val;
        this.getList();
      }
    },
    activated() {
      this.getList();
    },
  }
</script>

<style lang="less">
  #PCkeywordHeight {
    min-height: 40px !important;
    line-height: 2 !important;
  }

  #PCkeywordHeight2 {
    min-height: 40px !important;
    line-height: 2 !important;
  }
</style>
<style scoped lang="less">
  #scroller {
    ::-webkit-scrollbar {
      width: 5px !important;
      height: 10px !important;
    }
    ::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      background-color: #F5F5F5;
    }
    ::-webkit-scrollbar-thumb {
      background: #aaa !important;
      border-radius: 2px !important;
    }

  }

  .btn-row {
    text-align: center;
    padding-top: 20px;
  }

  .TagOrg {
    width: 100%;
    height: 100%;
  }

  .content_main {
    .page_sel {
      margin-top: 20px;
      text-align: center;
    }
  }

  .page-style {
    margin-top: 20px;
    text-align: center;
  }
</style>
