<template>
  <div class="data-board">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="异常项看板" name="first">
        <el-row>
          <el-col :span="8" v-for="(item, index) in AbnormalData" :key="index" :offset="2">
            <el-card :body-style="{ padding: '0px' }" style="margin-bottom:14px;">
              <div style="padding: 14px;">
                <span>{{item.labelName}}</span>
                <div class="bottom clearfix">
                  <time class="time">昨日新增{{item.addTodayAmount}}人</time>
                  <time class="time_right">累计{{item.totalAmount}}人</time>
                  <!-- <el-button type="text" class="button">累计{{item.totalAmount}}人</el-button> -->
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane  label="计划看板" name="second">
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
              <el-table-column show-overflow-tooltip align="center" prop="totalSendAmount" label="该计划预计总计发送短信的数量"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="todayWaitSendAmount" label="今日待发送数量"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="todaySendedAmount" label="今日已发送数量"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="totalFeedbackAmount" label="响应人数"></el-table-column>
              <el-table-column align="center" label="操作" width="220" fixed="right">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" @click="handleDetail(scope.$index, scope.row)"
                >查看明细</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-main>
      </el-tab-pane>
      <el-tab-pane label="报告数据看板" name="third">
        <el-main>
          <!-- 列表 -->
          <template>
            <el-table :data="reportData" border style="width: 100%" id="app">
              <el-table-column show-overflow-tooltip align="center" prop="time" label="时间"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="passCheckReportAmount" label="过总检报告数"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="abnormalReportAmount" label="有异常报告数 "></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="smsSendAmount" label="已发送短信数 "></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="readReportAmount" label="已在线查阅报告数"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="passCheckReportAmountInMonth" label="当月累计过总检报告数"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="readReportAmountInMonth" label="当月累计获取报告数"></el-table-column>
            </el-table>
          </template>
        </el-main>
      </el-tab-pane>
    </el-tabs>
    <div class="self-page-container" v-show="tabIndex!=='third'">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="searchParams.currentPage" :page-sizes="[10, 20]"
                         :page-size="searchParams.pagesize" layout="total, sizes, prev, pager, next, jumper"
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
                  <p>{{ scope.row.birthday.slice(0,4) }}年{{ scope.row.birthday.slice(4,6) }}月{{ scope.row.birthday.slice(6,8) }}日</p>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="groupNames" label="所属分组"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="phone" label="手机号"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="companyName" label="单位"></el-table-column>
              </el-table-column>
            </el-table>
        </template>
        <div class="self-page-container">
          <el-pagination background @size-change="handleSizeChangePlanDetail" @current-change="handleCurrentChangePlanDetail"
                         :current-page="PlanDetail.currentPage" :page-sizes="[15, 30]"
                         :page-size="PlanDetail.pagesize" layout="total, sizes, prev, pager, next, jumper"
                         :total="PlanDetail.totalCount">
          </el-pagination>
    </div>
    </el-dialog>
  </div>
</template>

<script>
import {ERR_OK,getShowReportData,getShowAbnormal,getShowPlanBoard,getShowPlanDetail} from '@/api/api';
import {getStore,EncodeDoctorId} from "@/config/mUtils.js";
  export default {
    name: "dataBoard",
    data() {
      return {
        tabIndex:'first',
        activeName: 'first',
        dialogVisible: false,
        loading:false,
        userInfo:{},
        totalCount:1,
        AbnormalData:{},
        PlanBoardData:[],
        PlanDetailData:[],
        reportData:[],
        PlanDetail:{
          currentPage:1,
          pageSize: 15,
          planId:'',
          totalCount:1
        },
        searchParams:{
          currentPage: 1,
          institutionCode: '',
          pageSize: 10,
        }
      }
    },
    methods:{
      handleSizeChange: function (size) {
        this.searchParams.pageSize = size;
        this.getList();
      },
      handleSizeChangePlanDetail: function (size) {
        this.PlanDetail.pageSize = size;
        this.DetailCurrentPage();
      },
      handleCurrentChange: function (currentPage) {
        this.searchParams.currentPage = currentPage;
        this.getList();
      },
      handleCurrentChangePlanDetail: function (currentPage) {
        this.PlanDetail.currentPage = currentPage;
        this.DetailCurrentPage();
      },
      getList(){
        if (this.activeName==="first") {
          this.getShowAbnormalFUC();
        } else if (this.activeName==="second"){
          this.getShowPlanBoardFUC();
        } else if (this.activeName==="third"){
          this.getShowReportDataFUC();
        }
      },
      //数据报告看板
      getShowReportDataFUC(){
        let params={
          currentPage: this.searchParams.currentPage,
          // institutionCode: 'bjbr001',
          institutionCode: this.userInfo.institutionCode,
          pageSize: this.searchParams.pageSize,
        };
        getShowReportData(params).then(res => {
          if(res.code===ERR_OK){
            this.reportData = [];
            this.reportData=res.data;
            this.totalCount = res.data.totalCount;
          }else{
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        }).catch(err => {
          this.$message.error('数据错误!');
        });
      },
      getShowAbnormalFUC(){//异常项看板
        let params={
          currentPage: this.searchParams.currentPage,
          // institutionCode: 'bjbr001',
          institutionCode: this.userInfo.institutionCode,
          pageSize: this.searchParams.pageSize,
        };
        getShowAbnormal(params).then(res => {
          if(res.code===ERR_OK){
            this.AbnormalData=res.data.list;
            this.totalCount = res.data.totalCount;
          }else{
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        }).catch(err => {
          this.$message.error('数据错误!');
        });
      },
      getShowPlanBoardFUC(){//计划看板
        let params={
          currentPage: this.searchParams.currentPage,
          // institutionCode: 'bjbr001',
          institutionCode: this.userInfo.institutionCode,
          pageSize: this.searchParams.pageSize,
        };
        getShowPlanBoard(params).then(res => {
          if(res.code===ERR_OK){
            this.PlanBoardData = [];
            this.PlanBoardData=res.data.list;
            this.totalCount = res.data.totalCount;
          }else{
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        }).catch(err => {
          this.$message.error('数据错误!');
        });
      },
      handleDetail(index, row){//计划看板-查看明细
        this.PlanDetail.planId = row.planId;
        this.loading = true;
        let params={
          currentPage: this.PlanDetail.currentPage,
          pageSize: this.PlanDetail.pageSize,
          id:row.planId,
        };

        getShowPlanDetail(params).then(res => {
          if(res.code===ERR_OK){
              setTimeout(() => {
                this.loading = false;
              }, 2000);
              this.PlanDetailData = [];
              this.PlanDetailData=res.data.list;
              this.PlanDetail.totalCount = res.data.totalCount;
              this.loading = false;
              this.dialogVisible=true;
            }else{
              this.$alert(res.msg, '提示', {
                confirmButtonText: '确定',
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
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
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
      handleClick(tab, event) {
        this.tabIndex = tab.name;
        this.searchParams={
          currentPage: 1,
          institutionCode: '',
          pageSize: 10,
        };
        this.getList();
      }
    },
    activated(){
      this.userInfo = JSON.parse(getStore('userMesage'));
      this.getList();
    },
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

