<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">

      <el-card class="box-card">
        <el-form :inline="true" :model="searchParams" class="demo-form-inline">
          <el-form-item label="标题">
            <el-input placeholder="公告标题" v-model="searchParams.noticeTitleQuery"></el-input>
          </el-form-item>

          <el-form-item label="类型">
            <el-select v-model="searchParams.selectedNoticeTypeQuery" clearable placeholder="公告类型">
              <el-option v-for="item in noticeTypes" :key="item.id" :label="item.dictName"
                         :value="item.code"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="doSearch">搜索</el-button>
          </el-form-item>
        </el-form>

        <!--tab-->
        <el-tabs>
          <el-tab-pane label="系统公告" name="0"></el-tab-pane>
        </el-tabs>

        <!--table 表单开始-->
        <el-table
          :data="msgLists"
          border
          style="width: 100%">
          <el-table-column show-overflow-tooltip prop="" label="序号" width="60" type="index"></el-table-column>
          <el-table-column show-overflow-tooltip prop="noticeTitle" label="标题"></el-table-column>
          <el-table-column show-overflow-tooltip prop="dictName" label="类型"></el-table-column>
          <el-table-column show-overflow-tooltip prop="lastUpdateTime" label="发布时间"></el-table-column>

          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="_checkDetail(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--table 表单结束-->

        <div class="self-page-container">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="searchParams.currentPage" :page-sizes="[10,20]"
                         :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper"
                         :total="totalCount">
          </el-pagination>
        </div>


      </el-card>

      <!--公告详情的dialog-->
      <el-dialog title="详情" :visible.sync="isShowDialog">
        <p class="info-title">{{detailInfo.noticeTitle}}</p>
        <p class="info-content">{{detailInfo.noticeContent}}</p>
        <div class="btn-row" style="text-align:center">
          <el-button size="small" type="primary" @click="closeDialog">关闭</el-button>
        </div>
      </el-dialog>
    </div>
  </div>

</template>


<script>

  import headerTop from '@/components/headTop.vue';
  import {getDictionaryByKey, getNoticeList, ERR_OK} from "@/api/api.js";


  export default {
    data() {
      return {
        detailInfo: {
          noticeTitle: "",//标题
          noticeContent: ""//内容
        },

        noticeTypes: [],
        isShowDialog: false,
        totalCount: 0,
        searchParams: {
          noticeTitleQuery: "",//标题
          selectedNoticeTypeQuery: "",//类型
          currentPage: 1,
          pageSize: 10
        },
        msgLists: []
      }
    },

    components: {
      headerTop,
    },
    methods: {


      doSearch() {
        this.searchParams.currentPage = 1;
        this.getNoticeListFn();
      },


      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this.getNoticeListFn()
      },

      handleCurrentChange(val) {
        this.searchParams.currentPage = val;
        this.getNoticeListFn()
      },


      //查看详情
      _checkDetail(item) {
        this.detailInfo.noticeTitle = item.noticeTitle;
        this.detailInfo.noticeContent = item.noticeContent;
        this.isShowDialog = true;
      },


      //关闭dialog
      closeDialog() {
        this.isShowDialog = false;
      },

      //获取公告类型
      getNoticeType() {
        var params = {
          code: "",
          dictType: "",
          parentId: "8ab2b2f562dc97230162dc9723560000"
        };
        getDictionaryByKey(params).then(res => {
          if (res.code === ERR_OK) {
            this.noticeTypes = res.data
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试');
        })
      },


      //获取公告列表
      getNoticeListFn() {
        let params = {
          currentPage: this.searchParams.currentPage,
          pageSize: this.searchParams.pageSize,
          selectedNoticeTypeQuery: this.searchParams.selectedNoticeTypeQuery,
          noticeTitleQuery: this.searchParams.noticeTitleQuery,
          noticeStatus: 2,
          noticeOs: "ROLE_TYPE_OPERATING"
        };
        getNoticeList(params).then(res => {
          if (res.code === ERR_OK) {
            this.msgLists = res.data.list;

            this.totalCount = res.data.totalCount;
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试');
        })
      }


    },


    activated() {


      this.getNoticeType();

      this.getNoticeListFn()

    }


  }
</script>
<style lang="less" scoped>

  .info-title {
    text-align: center;
    line-height: 24px;
    font-size: 18px;
    color: #303133;
    font-weight: normal;
    margin-bottom: 15px
  }

  .info-content {
    color: #606266;
    font-size: 14px;
    line-height: 22px;
    margin-bottom: 20px
  }

</style>
