<template>
  <div class="page-wrapper" id="scroller">
    <header-top></header-top>
    <div class="page-container">
      <div class="search_params">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="标签名称">
            <el-input v-model="searchParams.tagName" placeholder="请输入标签名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="是否关注">
            <el-select v-model="searchParams.whetherFollow" clearable placeholder="请选择">
                  <el-option label="是" :value="2"></el-option>
                  <el-option label="否" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否严重">
            <el-select v-model="searchParams.whetherSerious" clearable placeholder="请选择">
                  <el-option label="是" :value="2"></el-option>
                  <el-option label="否" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="doSearch">搜索</el-button>
            <el-button type="success" @click="BatchUpdatePC" plain>勾选</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="content_main">
        <el-table :data="tableData" border style="width: 100%" @row-click='clickRow'>
          <el-table-column show-overflow-tooltip fixed type="index" width="80px" align="center" label="序号"></el-table-column>
          <el-table-column show-overflow-tooltip align="center" prop="whetherFollow" label="是否关注" width="100">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.whetherFollow" :true-label='2' :false-label='1' :checked="scope.row.whetherFollow ===2">
              </el-checkbox>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" prop="whetherSerious" label="是否严重" width="100">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.whetherSerious" :true-label='2' :false-label='1' :checked="scope.row.whetherSerious ===2">
              </el-checkbox>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" prop="tagName" label="标签名称"></el-table-column>
          <el-table-column show-overflow-tooltip align="center" prop="keyword" label="关键字 "></el-table-column>
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
    GetAllTagsList,
    GetProductCategerySelect,
    PostDeletePC,
    PostAddOrUpdatePC,
    PostBatchBindTags
  } from '@/api/api.js';

  export default {
    name: "BatchRecommend",
    components: {
      headerTop
    },
    data() {
      return {
        tableData: [],
        multipleSelection: [],//勾选列表
        searchParams: {
          currentPage: 1,
          pageSize: 10,
          tagName: "",
          whetherFollow: null,
          whetherSerious: null
        },
        totalCount: null
      }
    },
    methods: {
      doSearch() {//搜索
          this.searchParams.currentPage = 1;
          this.getList();
      },
      clickRow(row){//单击行
            row.whetherFollow = (row.whetherFollow === 2) ? 1 : 2;
            row.whetherSerious = (row.whetherSerious === 2) ? 1 : 2;
      },
      BatchUpdatePC() {//批量推荐
        this.tableData.forEach(row => {
          row.whetherFollow = (row.whetherFollow === 2) ? 2 : 1;
          row.whetherSerious = (row.whetherSerious === 2) ? 2 : 1;
        });
        let params =  {
            tagAppendinfoDTOS: this.tableData,
          };
        PostBatchBindTags(params).then((res) => {
          if (res.code === ERR_OK) {
            this.$notify({
              type: 'success',
              title: '勾选成功！',
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
      getList() {/*获取类目列表*/
        let params = {
          currentPage: this.searchParams.currentPage,
          pageSize: this.searchParams.pageSize,
          tagName: this.searchParams.tagName,
          whetherFollow: this.searchParams.whetherFollow,
          whetherSerious: this.searchParams.whetherSerious
        };
        GetAllTagsList(params).then((res) => {
          if (res.code === ERR_OK) {
            this.tableData = res.data.list;
            this.totalCount = res.data.totalCount;
          } else {
            IsAlert(`接口错误，code:${res.code}，msg:${res.msg}`, '错误', 'error');
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        })
      },
      handleClick() {/*tab标签切换*/
          this.searchParams.currentPage = 1;
          this.getList();
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
