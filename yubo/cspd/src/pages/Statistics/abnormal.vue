<template>
  <div id="abnormal">
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
    <div class="self-page-container" v-if="AbnormalData.length>0">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchParams.currentPage"
        :page-sizes="[10, 20,50,100]"
        :page-size="searchParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {ERR_OK,getShowReportData,getShowAbnormal,getShowPlanBoard,getShowPlanDetail} from '@/api/api';
  import {getStore,EncodeDoctorId} from "@/config/mUtils.js";
  export default {
    name: "abnormal",
    data() {
      return {
        userInfo:{},
        totalCount:1,
        AbnormalData:{},
        searchParams:{
          currentPage: 1,
          institutionCode: '',
          pageSize: 10,
        }
      }
    },
    activated(){
      this.userInfo = JSON.parse(getStore('userMesage'));
      this.getShowAbnormalFUC();
    },
    methods:{
      handleSizeChange: function (size) {
        this.searchParams.pageSize = size;
        this.getShowAbnormalFUC();
      },
      handleCurrentChange: function (currentPage) {
        this.searchParams.currentPage = currentPage;
        this.getShowAbnormalFUC();
      },
      /*异常项看板*/
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
