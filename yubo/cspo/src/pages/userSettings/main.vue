<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">

      <el-card class="box-card">
        <strong class="blue-text" style="float: left">系统公告</strong>
        <el-button style="float: right; padding: 3px 0" type="text" @click="toAnnouncement">更多</el-button>
        <div class="marquee-box">
          <marquee direction="left" behavior="scroll" scrollamount="3" scrolldelay="0" loop="-1" width="100%" height="24" hspace="10" vspace="10">
            {{announceText}}
          </marquee>
        </div>
      </el-card>

      <el-card class="box-card">
        <strong class="blue-text">欢迎使用云健康管理平台！让我们一起来构建掌上体检健康云平台，加油!</strong>
      </el-card>


      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <strong class="blue-text" style="display: block;margin-bottom: 10px">认证</strong>
          <p class="card-addtion">
            <span class="secondary-color">截止{{currentTime}}</span>
            <strong class="main-color"> {{applyNum}} 人</strong>
            <el-button style="float: right; padding: 3px 0" type="text" @click="toIdentification">更多</el-button>
          </p>
        </div>
        <!--table 表单开始-->
        <el-table
          :data="doctorList"
          border
          style="width: 100%">
          <el-table-column align="center" show-overflow-tooltip prop="userName" label="医生姓名"></el-table-column>
          <el-table-column align="center" show-overflow-tooltip prop="institutionName" label="机构名称"></el-table-column>
          <el-table-column align="center" show-overflow-tooltip prop="authenticationTime" label="申请时间"></el-table-column>
          <el-table-column align="center" label="状态" min-width="100">
            <template slot-scope="scope">
              <el-tag type="info" v-if="scope.row.authenticationStatus===1">待认证</el-tag>
              <el-tag type="success" v-if="scope.row.authenticationStatus===2">已认证</el-tag>
              <el-tag type="warning" v-if="scope.row.authenticationStatus===3">已取消</el-tag>
              <el-tag type="danger" v-if="scope.row.authenticationStatus===4">已拒绝</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <!--table 表单结束-->
      </el-card>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <strong class="blue-text" style="display: block;margin-bottom: 10px">交易</strong>
          <p class="card-addtion">
            <span class="secondary-color">截止{{currentTime}}</span>
            <strong class="main-color">当月订单总数：{{allOrderCount}}单 </strong>
            <strong class="main-color">退款单总数：{{refundOrderCount}}单 </strong>
            <el-button style="float: right; padding: 3px 0" type="text" @click="toRefuseList">更多</el-button>
          </p>
        </div>
        <!--table 表单开始-->
        <el-table
          :data="tradeOrderList"
          border
          style="width: 100%">
          <el-table-column align="center" show-overflow-tooltip prop="refundCode" label="退款订单编号"></el-table-column>
          <!--<el-table-column show-overflow-tooltip prop="doctorName" label="服务医生"></el-table-column>-->
          <!--<el-table-column show-overflow-tooltip prop="institutionName" label="医疗机构"></el-table-column>-->
          <!--<el-table-column show-overflow-tooltip prop="goodsName" label="服务项目"></el-table-column>-->
          <el-table-column align="center" show-overflow-tooltip prop="createTime" label="退款时间"></el-table-column>
          <el-table-column align="center" label="状态" min-width="100">
            <template slot-scope="scope">
              <el-tag type="warning" v-if="scope.row.refundStatus===0">待处理</el-tag>
              <el-tag type="success" v-if="scope.row.refundStatus===1">退款中</el-tag>
              <el-tag type="success" v-if="scope.row.refundStatus===2">退款成功</el-tag>
              <el-tag type="danger" v-if="scope.row.refundStatus===3">退款失败</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <!--table 表单结束-->
      </el-card>
    </div>
  </div>
</template>
<script>
import headerTop from '@/components/headTop.vue';
import { mapGetters } from "vuex";
import {getIntervalNotice,getNewApplyList,getAuthenticationSum,getNewestRefuseList,getOrderRefuseNumber, ERR_OK,getIndexTradeData} from "@/api/api"

export default {
  data() {
    return {
      currentTime:"",
      applyNum:0,
      announceText:"公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容",
      doctorList:[],
      allOrderCount:0,//总订单数
      refundOrderCount:0,//退款数
      tradeOrderList:[]
  }
  },

  components:{
    headerTop,
  },

  computed:{
    ...mapGetters(['getInstitutionArr'])
  },

  methods:{
    //补零方法
    zeroize:function (str) {
      var str = str.toString();
      if(str.length === 1){
        str="0"+str;
      }
      return str;
    },

    //到公告列表
    toAnnouncement(){
      this.$router.push("announcement");
    },

    //到认证列表
    toIdentification(){
      this.$router.push("indentList");
    },
    //到退款订单
    toRefuseList(){
      this.$router.push("refundsList");
    },
    // 请求公告列表
    getNoticeContent(){
      let params = {};
      getIntervalNotice(params).then(res => {
        if(res.code===ERR_OK){
          this.announceText=res.data.noticeContent;
        }else{
          this.$alert(res.msg, '提示', {
            confirmButtonText: '确定',
          })
        }
      }).catch(()=>{

      })
    },
    //获取最新医生认证
    getNewApplyListFn(){
      let params = {
        authenticationStatus: 1,
        currentPage: 1,
        pageSize:10
      };
      getNewApplyList(params).then(res => {
        if(res.code===ERR_OK){
          this.doctorList=res.data.list;
        }else{
          this.$alert(res.msg, '提示', {
            confirmButtonText: '确定',
          })
        }
      }).catch(()=>{

      })
    },
    //获取总的认证人数
    getAuthenticationSumFn(){
      let myDate=new Date(),fullYear=this.zeroize(myDate.getFullYear()),fullMonth=this.zeroize(myDate.getMonth()+1);
      let fullDay=this.zeroize(myDate.getDate()),hours=this.zeroize(myDate.getHours()),minutes=this.zeroize(myDate.getMinutes());
      this.currentTime=fullYear+"."+fullMonth+"."+fullDay+" "+hours+":"+minutes;
      let params = {
        deadline:this.currentTime
      };
      getAuthenticationSum(params).then(res => {
        if(res.code===ERR_OK){
          this.applyNum=res.data.data.number;
        }else{
          this.$alert(res.msg, '提示', {
            confirmButtonText: '确定',
          })
        }
      }).catch(()=>{

      })
    },
    //获取最新退款列表
/*    getNewRefuseListFn(){
      let params = {
        refundStatus: 0,
        currentPage: 1,
        pageSize:10
      };
      getNewestRefuseList(params).then(res => {
        if(res.code===ERR_OK){
          this.tradeOrderList=res.data.list;
        }else{
          this.$alert(res.msg, '提示', {
            confirmButtonText: '确定',
          })
        }
      }).catch(err => {
      })

      // getNewestRefuseList
      // getOrderRefuseNumber
    },*/
    //获取订单数 退款数
    getOrderRefuseNumberFn(){
      let myDate=new Date(),fullYear=this.zeroize(myDate.getFullYear()),fullMonth=this.zeroize(myDate.getMonth()+1);
      let fullDay=this.zeroize(myDate.getDate()),hours=this.zeroize(myDate.getHours()),minutes=this.zeroize(myDate.getMinutes());
      this.currentTime=fullYear+"."+fullMonth+"."+fullDay+" "+hours+":"+minutes;
      let params = {
        deadline:this.currentTime
      };
      getIndexTradeData(params).then(res => {
        if(res.code===ERR_OK){
          this.allOrderCount=res.data.countOrderNumWithNoRefund;
          this.refundOrderCount=res.data.countRefundNum;
          this.tradeOrderList=res.data.orderRefundList
        }else{
          this.$alert(res.msg, '提示', {
            confirmButtonText: '确定',
          })
        }
      }).catch(()=>{

      })
    }
  },
  activated(){
    this.getNoticeContent();
    this.getNewApplyListFn();
    this.getAuthenticationSumFn();
    this.getOrderRefuseNumberFn()
  }
}
</script>
<style lang="less" scoped>
  .box-card{margin-bottom: 15px}
  .blue-text{color:#409EFF}
  .main-color{color:#303133;font-size: 14px;padding-left: 20px;}
  .secondary-color{color:#606266;font-size: 14px;}
  .marquee-box{padding:0 50px 0 100px}
  .marquee-box marquee{height: 21px;padding: 0;display: block;margin: 0}
</style>
