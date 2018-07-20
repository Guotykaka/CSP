<template>
  <div class="orderDetail">
    <header-top></header-top>
    <div class="page-container">
      <!--订单排头-->
      <el-card :body-style="cardStyle">
        <div>订单编号：<span class="color3">{{cspTradeInfoEntity.tradeCode}}</span></div>
        <div>客户名称：<span class="color3">{{customerDetail.customerName}}</span></div>
        <div>注册手机号：<span class="color3">{{customerDetail.mobile}}</span></div>
        <div>下单时间：<span class="color3">{{cspTradeInfoEntity.orderTime}}</span></div>
        <div>订单金额：<span class="color3">￥{{cspTradeInfoEntity.totalPrice | fixedTwo}}</span></div>
      </el-card>
      <!--订单状态-->
      <div class="stautsStyle">
        <el-card :body-style="cardStyle">
          <div v-show="cspTradeInfoEntity.tradeStatus==0" class="colorStatus">订单状态：
            <span class="WarningStyle">待付款</span>
          </div>
          <div v-show="cspTradeInfoEntity.tradeStatus==1" class="colorStatus">订单状态：
            <span class="InfoStyle">已取消</span>
          </div>
          <div v-show="cspTradeInfoEntity.tradeStatus==2" class="colorStatus">订单状态：
            <span class="SuccessStyle">已付款</span>
          </div>
          <div v-show="cspTradeInfoEntity.tradeStatus==3" class="colorStatus">订单状态：
            <span class="blueStyle">已完成</span>
          </div>
        </el-card>
      </div>
      <!--支付记录-->
      <div class="stautsStyle">
        <el-card :body-style="payStyle">
          <div slot="header">
            <span class="colorStatus">支付记录</span>
          </div>
          <div>支付方式：
            <span class="color3" v-if="cspTradeInfoEntity.payChannel==1">支付宝</span>
            <span class="color3" v-if="cspTradeInfoEntity.payChannel==2">微信</span>
            <span class="color3" v-if="cspTradeInfoEntity.payChannel==3">银行卡</span>
          </div>
          <div>支付时间：<span class="color3">{{cspTradeInfoEntity.paymentTime}}</span></div>
          <div>支付流水号：<span class="color3">{{cspTradeInfoEntity.thirdTradeNo}}</span></div>
          <div>订单金额：<span class="color3">￥{{cspTradeInfoEntity.totalPrice}}</span></div>
          <div>优惠金额：<span class="color3">￥{{cspTradeInfoEntity.discountAmount | fixedTwo}}</span></div>
          <div>支付金额：<span class="color3">￥{{cspTradeInfoEntity.totalPrice | fixedTwo}}</span></div>
        </el-card>
      </div>
      <!--订单信息-->
      <div class="stautsStyle" v-for="(item,index) in cspOrderInfoList" :key="index">
        <!--电话报告解读-->
        <el-card class="box-card" :body-style="payStyle" v-if="item.serviceType==='20'" :key="item.serviceType">
          <div slot="header" class="header-style">
            <span class="colorStatus">订单信息</span>
            <div v-if="item.orderStatus==0">订单状态：
              <el-tag type="warning">待付款</el-tag>
            </div>
            <div v-if="item.orderStatus==1">订单状态：
              <el-tag type="info">已取消</el-tag>
            </div>
            <div v-if="item.orderStatus==2">订单状态：
              <el-tag type="success">已付款</el-tag>
              <div v-if="customerDetail" class="serverCss">订单服务状态：
                <el-tag>{{customerDetail.orderServiceStatusString}}</el-tag>
              </div>
            </div>
            <div v-if="item.orderStatus==3">订单状态：
              <el-tag type="success">已完成</el-tag>
              <div v-if="customerDetail" class="serverCss">订单服务状态：
                <el-tag>{{customerDetail.orderServiceStatusString}}</el-tag>
              </div>
            </div>
          </div>
          <div>订单编号：<span @click="showReportFn(item)" class="color3">{{item.tradeCode}}</span></div>
          <div>服务名称：<span class="color3">{{item.itemName}}</span></div>
          <div>服务机构：<span class="color3">{{item.institutionName}}</span></div>
          <div>服务医生：<span class="color3">{{item.name}}</span></div>
          <div>接听电话：<span class="color3">{{item.mobile}}</span></div>
          <div class="header-style serverCss">体检报告：<span class="color3">{{customerDetail.customerName}}</span><span
            class="color3">{{customerDetail.orderTime}}</span>
            <span class="targetChange" @click="showReportFn(item)">查看详情</span>
          </div>
          <div>订单金额：<span class="color3">￥{{item.totalPrice | fixedTwo}}</span></div>
          <div>结算信息：<span class="color3">商品售价：￥{{item.totalPrice | fixedTwo}}</span></div>
        </el-card>
        <!--一元听-->
        <el-card class="box-card" :body-style="payStyle" v-if="item.serviceType==='10000'" :key="item.serviceType">
          <div slot="header" class="header-style">
            <span class="colorStatus">订单信息</span>
            <div v-if="item.orderStatus==0">订单状态：
              <el-tag type="warning">待付款</el-tag>
            </div>
            <div v-if="item.orderStatus==1">订单状态：
              <el-tag type="info">已取消</el-tag>
            </div>
            <div v-if="item.orderStatus==2">订单状态：
              <el-tag type="success">已付款</el-tag>
              <div v-if="customerDetail" class="serverCss">订单服务状态：
                <el-tag>{{customerDetail.orderServiceStatusString}}</el-tag>
              </div>
            </div>
            <div v-if="item.orderStatus==3">订单状态：
              <el-tag type="success">已完成</el-tag>
              <div v-if="customerDetail" class="serverCss">订单服务状态：
                <el-tag>{{customerDetail.orderServiceStatusString}}</el-tag>
              </div>
            </div>
          </div>
          <div>订单编号：<span @click="showReportFn(item)" class="color3">{{item.tradeCode}}</span></div>
          <div>服务名称：<span class="color3">{{item.itemName}}</span></div>
          <div>服务机构：<span class="color3">{{item.institutionName}}</span></div>
          <div>服务医生：<span class="color3">{{item.name}}</span></div>
          <div>订单金额：<span class="color3">￥{{item.totalPrice | fixedTwo}}</span></div>
          <div>结算信息：<span class="color3">商品售价：￥{{item.totalPrice | fixedTwo}}</span></div>
        </el-card>
        <!--图文咨询-->
        <el-card class="box-card" :body-style="payStyle"  v-if="item.serviceType==='10'" :key="item.serviceType">
          <div slot="header" class="header-style">
            <span class="colorStatus">订单信息</span>
            <div v-if="item.orderStatus==0">订单状态：
              <el-tag type="warning">待付款</el-tag>
            </div>
            <div v-if="item.orderStatus==1">订单状态：
              <el-tag type="info">已取消</el-tag>
            </div>
            <div v-if="item.orderStatus==2">订单状态：
              <el-tag type="success">已付款</el-tag>
              <div v-if="customerDetail" class="serverCss">订单服务状态：
                <el-tag>{{customerDetail.orderServiceStatusString}}</el-tag>
              </div>
            </div>
            <div v-if="item.orderStatus==3">订单状态：
              <el-tag type="success">已完成</el-tag>
              <div v-if="customerDetail" class="serverCss">订单服务状态：
                <el-tag type="success">{{customerDetail.orderServiceStatusString}}</el-tag>
              </div>
            </div>
          </div>
          <div>订单编号：<span class="color3">{{item.tradeCode}}</span></div>
          <div>服务名称：<span class="color3">{{item.itemName}}</span></div>
          <div>服务机构：<span class="color3">{{item.institutionName}}</span></div>
          <div>服务医生：<span class="color3">{{item.name}}</span></div>
          <div>咨询人：<span class="color3">{{item.customerName}}</span></div>
          <div>性别：
            <span class="color3" v-if="item.customerSex===2">女</span>
            <span class="color3" v-else>男</span></div>
          <div>年龄：<span class="color3">{{item.customerAge}}</span></div>
          <div>描述：<span class="color3">{{item.customerDesc}}</span></div>
          <div class="imgStyle">图片：
            <ul :id="'img'+item.customerImgs" @click="photoShow(item.customerImgs)">
              <li v-for="value in capitalize(item.customerImgs)" style="float:left">
                <img style="width:20px;height:20px;margin-right:5px;" :src="value" alt="">
              </li>
            </ul>
          </div>
          <div>订单金额：<span class="color3" v-if="item.totalPrice">￥{{item.totalPrice | fixedTwo}}</span></div>
          <div>结算信息：<span class="color3" v-if="item.totalPrice">商品售价：￥{{item.totalPrice | fixedTwo}}</span></div>
        </el-card>
        <!--退款信息-->
        <el-card class="box-card" :body-style="payStyle" v-if="item.refundCode">
          <div slot="header"><span class="colorStatus">退款信息</span></div>
          <div>退款编号：
            <div class="color3 serverCss">{{item.refundCode}}
              <span class="targetChange" @click="_goDetail(item)">查看详情</span>
            </div>
          </div>
        </el-card>
        <!--订单变更记录-->
        <el-card class="box-card" :body-style="payStyle">
          <div slot="header"><span class="colorStatus">订单变更记录</span></div>
          <div v-for="(itemChange,index2) in item.orderChangeList" :key="index2">
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
  import {tradeInfo,ERR_OK, reportDetail} from "@/api/api"
  import report from '@/components/report.vue';
  // import refundDetail from '@/components/refundDetail.vue';

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
        customerDetail: {},//主订单带过来的信息
        refundDetail:{},
        checkId: null,//子订单ID
        checkedId: null,//主订单ID
        isShowReport:false,//是否显示体检报告
        isRefundDetail:false,//退款详情是否显示
      }
    },
    created() {


    },
    activated(){
      if(!this.$route.params.val){
        this.$router.push('/orderList')
        return;
      }
      this.customerDetail = this.$route.params.val;
      this.checkedId = this.$route.params.val.tradeCode;
      this.getDetail();
    },
    methods: {
      getDetail() {
        let data = {
          tradeCode:this.checkedId
        };
        tradeInfo(data).then((res) => {
          if (res.code === ERR_OK) {
            this.cspTradeInfoEntity = res.data.cspTradeInfoEntity;
            this.cspOrderInfoList = res.data.cspOrderInfoList;
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
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
        this.$router.push('/orderList')
      },
      //点击显示体检报告详情
      showReportFn(val){
        let data = {
          "checkUnitCode": val.checkUnitCode,
          "workNo": val.workNo
        }
        reportDetail(data).then((res)=>{
          if(res.code===ERR_OK){
            this.reportData=res.data;
            if(res.data){
              this.isShowReport=true;
            }else{
              this.$alert('暂无数据','提示')
            }
          }
        })
      },
      //点击显示退款详情
      _goDetail(val){
        this.$store.dispatch('getRefundDetail',val);
        this.$store.dispatch('getCustomerDetail',this.customerDetail);
        this.$router.push({name: 'refundDetail'})
      },
      //图片展示
      photoShow: function (index) {
        var idName = 'img' + index;
        var viewer = new Viewer(document.getElementById(idName), {
          navbar: false,
          scalable: false,
          minZoomRatio: 0.1,
          maxZoomRatio: 10,
          movable: false,
          fullscreen: false
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
    }
  }
</script>
<style scoped lang="less">
  .orderDetail {
    color: #999;
    font-size: 14px;
    height: 100%;
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
