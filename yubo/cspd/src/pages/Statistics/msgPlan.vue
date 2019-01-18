<template>
  <div id="msg-plan">
    <el-main v-loading.fullscreen.lock="loading"
             element-loading-text="拼命加载中"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.8)">
      <!-- 列表 -->
      <template>
        <el-table :data="PlanBoardData" border style="width: 100%" id="app">
          <el-table-column show-overflow-tooltip align="center" type="index" label="编号" width="50"></el-table-column>
          <!-- <el-table-column show-overflow-tooltip align="center" prop="planId" label="计划ID"></el-table-column> -->
          <el-table-column show-overflow-tooltip align="center" prop="planName" label="计划名称"></el-table-column>
          <el-table-column show-overflow-tooltip align="center" prop="executeTime" label="执行时间"></el-table-column>
          <el-table-column show-overflow-tooltip align="center" prop="totalSendAmount"
                           label="该计划预计总计发送短信的数量"></el-table-column>
          <el-table-column show-overflow-tooltip align="center" prop="todayWaitSendAmount"
                           label="今日待发送数量"></el-table-column>
          <el-table-column show-overflow-tooltip align="center" prop="todaySendedAmount"
                           label="今日已发送数量"></el-table-column>
          <el-table-column show-overflow-tooltip align="center" prop="totalFeedbackAmount"
                           label="响应人数"></el-table-column>
          <el-table-column align="center" label="操作" width="220" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleDetail(scope.$index, scope.row)"
              >查看明细
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-main>
    <div class="self-page-container" v-if="PlanBoardData.length>0">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchParams.currentPage"
        :page-sizes="[10, 20]"
        :page-size="searchParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </div>
    <el-dialog id="dataDialog" title="任务明细" :visible.sync="dialogVisible" :before-close="handleClose" center fullscreen>
      <template>
        <el-table :data="PlanDetailData" border style="width: 100%" id="Data_Board_scroller">
          <el-table-column show-overflow-tooltip align="center" prop="userName" label="用户名"></el-table-column>
          <!-- <el-table-column show-overflow-tooltip align="center" prop="sex" label="性别">
            <template slot-scope="scope">
              <el-tag type="info" v-if="scope.row.sex===1">男</el-tag>
              <el-tag type="danger" v-else>女</el-tag>
            </template>
          </el-table-column> -->
          <el-table-column show-overflow-tooltip align="center" prop="birthday" label="生日">
            <template slot-scope="scope">
              <p>{{ scope.row.birthday.slice(0,4) }}年{{ scope.row.birthday.slice(4,6) }}月{{
                scope.row.birthday.slice(6,8) }}日</p>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" prop="groupNames" label="所属分组"></el-table-column>
          <el-table-column show-overflow-tooltip align="center" prop="phone" label="手机号"></el-table-column>
          <el-table-column show-overflow-tooltip align="center" prop="companyName" label="单位"></el-table-column>
        </el-table>
      </template>
      <div class="self-page-container" v-if="totalCount2">
        <el-pagination
          background
          @size-change="handleSizeChangePlanDetail"
          @current-change="handleCurrentChangePlanDetail"
          :current-page="PlanDetail.currentPage" :page-sizes="[15, 30]"
          :page-size="PlanDetail.pagesize" layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount2">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {ERR_OK, getShowReportData, getShowAbnormal, getShowPlanBoard, getShowPlanDetail} from '@/api/api';
  import {getStore, EncodeDoctorId} from "@/config/mUtils.js";

  export default {
    name: "msgPlan",
    data() {
      return {
        dialogVisible: false,
        loading: false,
        userInfo: {},
        totalCount:1,
        PlanBoardData: [],
        PlanDetailData:[],
        searchParams: {
          currentPage: 1,
          institutionCode: '',
          pageSize: 10,
        },
        PlanDetail: {
          currentPage: 1,
          pageSize: 15,
          planId: ''
        },
        totalCount2: 1
      }
    },
    activated() {
      this.userInfo = JSON.parse(getStore('userMesage'));
      this.getShowPlanBoardFUC();
    },
    methods: {
      handleSizeChange (size) {
        this.searchParams.pageSize = size;
        this.getShowPlanBoardFUC();
      },
      handleCurrentChange (currentPage) {
        this.searchParams.currentPage = currentPage;
        this.getShowPlanBoardFUC();
      },
      handleCurrentChangePlanDetail (currentPage) {
        this.PlanDetail.currentPage = currentPage;
        this.DetailCurrentPage();
      },
      handleSizeChangePlanDetail (size) {
        this.PlanDetail.pageSize = size;
        this.DetailCurrentPage();
      },
      /*计划看板*/
      getShowPlanBoardFUC() {
        let params = {
          currentPage: this.searchParams.currentPage,
          // institutionCode: 'bjbr001',
          institutionCode: this.userInfo.institutionCode,
          pageSize: this.searchParams.pageSize,
        };
        getShowPlanBoard(params).then(res => {
          if (res.code === ERR_OK) {
            this.PlanBoardData = [];
            this.PlanBoardData = res.data.list;
            this.totalCount = res.data.totalCount;
          } else {
            this.$message({
              type:'warning',
              message: res.msg,
              duration:3000,
              customClass:'err-tips',
            });
          }
        }).catch(err => {
          this.$message.error('数据错误!');
        });
      },
      /*计划看板-查看明细*/
      handleDetail(index, row) {
        this.PlanDetail.planId = row.planId;
        this.loading = true;
        let params = {
          currentPage: this.PlanDetail.currentPage,
          pageSize: this.PlanDetail.pageSize,
          id: row.planId,
        };

        getShowPlanDetail(params).then(res => {
          if (res.code === ERR_OK) {
            setTimeout(() => {
              this.loading = false;
            }, 2000);
            this.PlanDetailData = [];
            this.PlanDetailData = res.data.list;
            this.totalCount2 = res.data.totalCount;
            this.dialogVisible = true;
          } else {
            this.$message({
              type:'warning',
              message: res.msg,
              duration:3000,
              customClass:'err-tips',
            });
            this.loading = false;
          }
        }).catch(err => {
          this.$message.error('数据错误!');
          this.loading = false;
        });
      },
      DetailCurrentPage(){//分页查看明细
        this.loading = true;
        let params={
          currentPage: this.PlanDetail.currentPage,
          pageSize: this.PlanDetail.pageSize,
          id:this.PlanDetail.planId,
        };

        getShowPlanDetail(params).then(res => {
          if(res.code===ERR_OK){
            this.PlanDetailData = [];
            this.PlanDetailData=res.data.list;
            this.PlanDetail.totalCount = res.data.totalCount;
            this.loading = false;
          }else{
            this.$message({
              type:'warning',
              message: res.msg,
              duration:3000,
              customClass:'err-tips',
            });
            this.loading = false;
          }
        }).catch(err => {
          this.$message.error('数据错误!');
          this.loading = false;
        });
      },
      handleClose(){
        this.dialogVisible=false;
        this.loading= false;
        this.PlanDetail={
          currentPage:1,
          pageSize: 10,
          planId:'',
          totalCount:1
        };
      },
    }
  }
</script>

<style scoped lang="less">
  .time {
    font-size: 13px;
    color: #999;
  }
  .time_right {
    font-size: 13px;
    color: #999;
    padding: 0;
    float: right;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
  .self-page-container{text-align: center;padding: 15px;}
</style>
<style  lang="less">
  @media screen and (max-width: 1100px) {
    #dataDialog{
      .el-dialog{
        width: 100% !important;
      }
    }
  }
  @media screen and (min-width: 1100px) {
    #dataDialog{
      .el-dialog{
        width: 1100px !important;
      }
    }
  }
  #Data_Board_scroller{
    /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
    ::-webkit-scrollbar {
      width: 10px !important;
      height: 10px !important;
    }

    /*定义滚动条轨道 内阴影+圆角*/
    ::-webkit-scrollbar-track {
      background: #f6f6f6 !important;
      border-radius: 2px !important;
    }

    /*定义滑块 内阴影+圆角*/
    ::-webkit-scrollbar-thumb {
      background: #aaa !important;
      border-radius: 2px !important;
    }

  }
</style>
