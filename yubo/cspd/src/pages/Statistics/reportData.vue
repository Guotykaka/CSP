<template>
  <div id="report-data">
    <el-table :data="reportData" border style="width: 100%" id="app">
      <el-table-column show-overflow-tooltip align="center" prop="time" label="时间"></el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="passCheckReportAmount"
                       label="过总检报告数"></el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="abnormalReportAmount"
                       label="有异常报告数 "></el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="smsSendAmount" label="已发送短信数 "></el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="readReportAmount"
                       label="已在线查阅报告数"></el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="passCheckReportAmountInMonth"
                       label="当月累计过总检报告数"></el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="readReportAmountInMonth"
                       label="当月累计获取报告数"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {ERR_OK, getShowReportData, getShowAbnormal, getShowPlanBoard, getShowPlanDetail} from '@/api/api';
  import {getStore, EncodeDoctorId} from "@/config/mUtils.js";

  export default {
    name: "reportData",
    data() {
      return {
        reportData: [],
        searchParams: {
          currentPage: 1,
          institutionCode: '',
          pageSize: 10,
        },
        userInfo: {},
        totalCount: 1,
      }
    },
    created() {
      this.userInfo = JSON.parse(getStore('userMesage'));
      this.getShowReportDataFUC()
    },
    methods: {
      getShowReportDataFUC() {
        let params = {
          currentPage: this.searchParams.currentPage,
          // institutionCode: 'bjbr001',
          institutionCode: this.userInfo.institutionCode,
          pageSize: this.searchParams.pageSize,
        };
        getShowReportData(params)
          .then(res => {
            if (res.code === ERR_OK) {
              this.reportData = [];
              this.reportData = res.data;
              this.totalCount = res.data.totalCount;
            } else {
              this.$message({
                type:'warning',
                message: res.msg,
                duration:3000,
                customClass:'err-tips',
              });
            }
          })
          .catch(err => {
            this.$message.error('数据错误!');
          });
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

  .self-page-container {
    text-align: center;
    padding: 15px;
  }
</style>
<style lang="less">
  @media screen and (max-width: 1100px) {
    #dataDialog {
      .el-dialog {
        width: 100% !important;
      }
    }
  }

  @media screen and (min-width: 1100px) {
    #dataDialog {
      .el-dialog {
        width: 1100px !important;
      }
    }
  }

  #Data_Board_scroller {
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
