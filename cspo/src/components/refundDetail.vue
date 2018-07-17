<template>
  <div class="refundDeatil">
    <header-top></header-top>
    <div class="page-container">
      <!--订单状态-->
      <div class="stautsStyle">
        <el-card :body-style="cardStyle">
          <div v-show="refundDetail.insOrderRefundEntity.refundStatus===0" class="colorStatus">
              <span style="float:left">退款状态：</span>
              <div class="WarningStyle" style="float:left">
                <span style="display: block;">待处理</span>
                <span style="display: block;">APP申请退款，等待处理</span>
                <span>请您在进行同意或拒绝操作前，尽量充分于买家沟通达成一致，避免误解。</span>
              </div>
          </div>
          <div v-show="refundDetail.insOrderRefundEntity.refundStatus===1" class="colorStatus">
            <span style="float:left">退款状态：</span>
            <div class="InfoStyle" style="float:left">
              <span style="display: block;">退款中</span>
              <span style="display: block;">运营已同意退款，款还未打到客户账上。</span>
            </div>
          </div>
          <div v-show="refundDetail.insOrderRefundEntity.refundStatus===2" class="colorStatus">
            <!--<div>退款状态：<span class="SuccessStyle">退款成功</span></div>-->
            <!--<div><span>退款成功</span></div>-->
            <span style="float:left">退款状态：</span>
            <div class="SuccessStyle" style="float:left">
              <span style="display: block;">退款成功</span>
              <span style="display: block;">退款成功</span>
            </div>
          </div>
          <div v-show="refundDetail.insOrderRefundEntity.refundStatus===3" class="colorStatus">
            <div>
              <span style="float:left">退款状态：</span>
              <div class="DangerStyle" style="float:left"><span style="display: block;" class="DangerStyle">退款关闭</span><span>退款申请已被拒绝，退款关闭</span></div>
            </div>
          </div>
        </el-card>
      </div>
      <!--退款详情-->
      <div class="stautsStyle">
        <el-card :body-style="payStyle">
          <div slot="header">
            <span class="colorStatus">退款信息</span>
          </div>

          <div>退款编号：<span class="color3">{{getRefundDetail.refundCode}}</span></div>
          <div>申请退款时间：<span class="color3">{{getRefundDetail.createTime}}</span></div>
          <div>退款状态：
            <span class="color3" v-if="getRefundDetail.refundStatus===0">待处理</span>
            <span class="color3" v-if="getRefundDetail.refundStatus===1">退款中</span>
            <span class="color3" v-if="getRefundDetail.refundStatus===2">退款成功</span>
            <span class="color3" v-if="getRefundDetail.refundStatus===3">退款关闭</span>
          </div>

          <div>退款金额：<span class="color3">￥{{getRefundDetail.refundAmount | fixedTwo}}</span></div>
          <div>退还方式
            <span v-show="refundDetail.payChannel==1">支付宝</span>
            <span v-show="refundDetail.payChannel==2">微信</span>
            <span v-show="refundDetail.payChannel==3">银行卡</span>
          </div>
          <div>退款原因：<span class="color3">{{getRefundDetail.refundReason}}</span></div>
          <div>退款说明：<span class="color3">{{getRefundDetail.refundSource}}</span></div>
        </el-card>
      </div>
      <!--退款订单信息-->
      <div class="stautsStyle">
        <!--电话报告解读-->
        <el-card class="box-card" :body-style="payStyle" v-if="refundDetail.serviceType==2">
          <div slot="header" class="header-style">
            <span class="colorStatus">订单信息</span>
            <div v-if="refundDetail.orderStatus==0">订单状态:<el-tag type="warning">待付款</el-tag></div>
            <div v-if="refundDetail.orderStatus==1">订单状态:<el-tag type="info">已取消</el-tag></div>
            <div v-if="refundDetail.orderStatus==2">订单状态:<el-tag type="success">已付款</el-tag></div>
            <div v-if="refundDetail.orderStatus==3">订单状态:<el-tag type="success">已完成</el-tag></div>
          </div>
          <div>订单编号：<span class="color3">{{refundDetail.tradeCode}}</span></div>
          <div>服务名称：<span class="color3">{{refundDetail.itemName}}</span></div>
          <div>服务机构：<span class="color3">{{refundDetail.institutionName}}</span></div>
          <div>服务医生：<span class="color3">{{refundDetail.name}}</span></div>
          <div>接听电话：<span class="color3">{{refundDetail.mobile}}</span></div>
          <div class="header-style serverCss">体检报告：<span class="color3">{{customerDetail.customerName}}</span><span
            class="color3">{{customerDetail.createTime}}</span>
            <span class="targetChange" @click="showReportFn(refundDetail)">查看详情</span>
          </div>
          <div>订单金额：<span class="color3">￥{{refundDetail.totalPrice | fixedTwo}}</span></div>
          <div>结算信息：<span class="color3">商品售价：￥{{refundDetail.totalPrice | fixedTwo}}</span></div>
        </el-card>
        <!--图文咨询-->
        <el-card class="box-card" :body-style="payStyle" v-else>
          <div slot="header" class="header-style">
            <span class="colorStatus">订单信息</span>
            <div v-if="refundDetail.orderStatus==0">订单状态:<el-tag type="warning">待付款</el-tag></div>
            <div v-if="refundDetail.orderStatus==1">订单状态:<el-tag type="info">已取消</el-tag></div>
            <div v-if="refundDetail.orderStatus==2">订单状态:<el-tag type="success">已付款</el-tag></div>
            <div v-if="refundDetail.orderStatus==3">订单状态:<el-tag type="success">已完成</el-tag></div>
          </div>
          <div>订单编号：<span class="color3">{{refundDetail.tradeCode}}</span></div>
          <div>服务名称：<span class="color3">{{refundDetail.itemName}}</span></div>
          <div>服务机构：<span class="color3">{{refundDetail.institutionName}}</span></div>
          <div>服务医生：<span class="color3">{{refundDetail.name}}</span></div>
          <div>咨询人：<span class="color3">{{refundDetail.customerName}}</span></div>
          <div>性别：
            <span class="color3" v-if="refundDetail.customerSex===2">女</span>
            <span class="color3" v-else>男</span></div>
          <div>年龄：<span class="color3">{{refundDetail.customerAge}}</span></div>
          <div>描述：<span class="color3">{{refundDetail.customerDesc}}</span></div>
          <div class="imgStyle">图片：
            <ul id="layer-photos-demo" @click="photoShow(refundDetail.customerImgs)">
              <li v-for="(value,ind) in capitalize(refundDetail.customerImgs)" style="float:left">
                <img style="width:20px;height:20px;margin-right:5px;background-color:#ee55ee;" layer-pid="ind"
                     layer-src="value" :src="value" alt="">
              </li>
            </ul>
          </div>
          <div>订单金额：<span class="color3" v-if="refundDetail.totalPrice">￥{{refundDetail.totalPrice | fixedTwo}}</span></div>
          <div>结算信息：<span class="color3" v-if="refundDetail.totalPrice">商品售价：￥{{refundDetail.totalPrice | fixedTwo}}</span></div>
        </el-card>
        <!--订单变更记录-->
        <el-card class="box-card" :body-style="payStyle" v-if="refundDetail.refundCode">
          <div slot="header"><span class="colorStatus">订单变更记录</span></div>
          <div v-for="(itemChange,index2) in refundDetail.orderChangeList" :key="index2">
            {{itemChange.CREATE_TIME}}
            <span class="color3 ml20" v-if="itemChange.TRADE_STATUS===0">待付款</span>
            <span class="color3 ml20" v-if="itemChange.TRADE_STATUS===1">已取消</span>
            <span class="color3 ml20" v-if="itemChange.TRADE_STATUS===2">已付款</span>
            <span class="color3 ml20" v-if="itemChange.TRADE_STATUS===3">已完成</span>
            <span class="color3 ml20" v-if="itemChange.TRADE_STATUS===4">退款待处理</span>
            <span class="color3 ml20" v-if="itemChange.TRADE_STATUS===5">退款中</span>
            <span class="color3 ml20" v-if="itemChange.TRADE_STATUS===6">退款成功</span>
            <span class="color3 ml20" v-if="itemChange.TRADE_STATUS===7">退款关闭</span>
            <span class="color3 ml20" v-if="itemChange.TRADE_STATUS===8">退款拒绝</span>
          </div>
        </el-card>
      </div>
      <div class="reBtn">
        <el-button type="primary" @click="returnBlack">返回</el-button>
      </div>
      <!--体检报告详情 dialog-->
      <el-dialog title="体检报告" :visible.sync="isShowReport" width="90%" custom-class="self-dialog">
        <report :reportData="reportData"></report>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import headerTop from '@/components/headTop.vue'
  import {ERR_OK, showReportFn, getRefundDetail} from "@/api/api"
  import report from '@/components/report.vue';
  import {mapState} from 'vuex'

  export default {
    name: "orderDetail",
    components: {
      headerTop,
      report
    },
    data() {
      return {
        //报告详情数据
        reportData: {},
        cardStyle: {
          padding: '10px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          color: '#999'
        },
        payStyle: {
          color: '#999',
          lineHeight: '32px',

        },
        statusStyle: {
          width: '80%',
          background: 'red'
        },
        cspTradeInfoEntity: {},//主订单--订单详情
        cspOrderInfoList: [],//主订单--订单信息列
        checkId: null,//子订单ID
        checkedId: null,//主订单ID
        isShowReport:false,//是否显示体检报告
        getRefundDetail:{},
      }
    },
    created() {
      // this.refundDetail = this.$route.params.val;
      this.getDetail();
    },
    methods: {
      getDetail() {
        let data ={
          "insOrderRefundId":this.refundDetail.insOrderRefundEntity.insOrderRefundId
        };
        getRefundDetail(data).then((res) => {
          if (res.code === ERR_OK) {
            this.getRefundDetail = res.data;
          } else {
            alert(res.msg);
          }
        })
      },
      capitalize: function (value) {
        if (value) {
          var arrValue = value.split(',');
        }
        return arrValue
      },
      returnBlack() {
        this.$router.go(-1)
      },
      //点击显示体检报告详情
      showReportFn(val){
        let data = {
          "checkUnitCode": val.checkUnitCode,
          "workNo": val.checkUnitCode
        }
        reportDetail(data).then((res)=>{
          if(res.code===ERR_OK){
            this.reportData=res.data;
            this.isShowReport=true;
          }
        });
      }
    },
    filters: {
      fixedTwo: function (val) {
        var value = val;
        if (val) {
          value = val.toFixed(2)
        }
        return value
      }
    },
    computed: {
      ...mapState({
        refundDetail:state=>state.refundDetail,//退款详情---订单信息
        customerDetail:state=>state.customerDetail,//订单列表信息
      })
    },
  }
</script>
<style scoped lang="less">
  .refundDeatil {
    color: #999;
    font-size: 14px;
    height:100%;
    .stautsStyle {
      .colorStatus {
        color: #409EFF;
        font-size: 16px;
        font-weight: 700;
      }
      .blueStyle {
        color: #409EFF;
      }
      .DangerStyle {
        color: #F56C6C;
      }
      .SuccessStyle {
        color: #67C23A;
      }
      .InfoStyle {
        color: #909399;
      }
      .WarningStyle {
        color: #E6A23C;
      }
      margin: 10px 10px 0;
      .box-card {
        margin-bottom: 10px;
      }
      .header-style {
        color: #999;
        span {
          margin-right: 20px;
        }
        div {
          display: inline-block;
        }
      }
      .serverCss {
        display: inline-block;
        .targetChange {
          margin-left: 20px;
          cursor:pointer;
          color:#409EFF;
        }
      }
      .imgStyle{
        line-height:40px;
        ul{
          display:inline-block;
          height:20px;
        }
      }
    }
    .color3 {
      color: #333;
    }
    .ml20 {
      margin-left: 10px;
    }
    .reBtn {
      margin: 10px auto 0;
      text-align: center;
    }
  }
</style>
