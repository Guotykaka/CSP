<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">



      <!--退款状态  0待处理   1退款中  2退款成功  3退款拒绝-->
      <!--待处理0-->
      <el-card class="box-card" v-if="orderInfo.refundStatus === 0">
        <p class="m_b_10">
          <strong class="card-title">当前退款状态：APP申请退款，等待处理</strong>
        </p>
        <p class="status-text">请您在进行同意或者拒绝操作前，尽量充分于买家沟通达成一致，避免误解</p>
        <div class="btn-row" style="text-align: right">
          <el-button size="small" type="primary" @click="agreeApply">同意</el-button>
          <el-button size="small" type="danger" @click="refuseApply">拒绝</el-button>
        </div>
      </el-card>

      <!--退款中1-->
      <el-card class="box-card" v-if="orderInfo.refundStatus === 1">
        <p class="m_b_10">
          <strong class="card-title">当前退款状态：APP申请退款，等待处理</strong>
        </p>
        <p class="status-text">运营已同意退款，款还未打到客户账上</p>
        <div class="btn-row" style="text-align: right">
          <el-button size="small" type="primary">退款</el-button>
        </div>
      </el-card>

      <!--退款成功2-->
      <el-card class="box-card" v-if="orderInfo.refundStatus === 2">
        <strong class="card-title">当前退款状态：退款成功</strong>
      </el-card>

      <!--退款失败3-->
      <el-card class="box-card" v-if="orderInfo.refundStatus === 3">
        <strong class="card-title">当前退款状态：</strong>
        <strong class="text-danger">退款拒绝</strong>
      </el-card>


      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <strong class="card-title">退款信息</strong>
        </div>
        <ul>
          <li class="text item">
            <strong>退款编号：</strong>{{orderInfo.refundCode}}
          </li>
          <li class="text item">
            <strong>退款发起：</strong>APP申请退款
          </li>
          <li class="text item">
            <strong>申请退款时间：</strong>{{orderInfo.createTime}}
          </li>
          <li class="text item">
            <strong>退款状态：</strong>
            <span v-if="orderInfo.refundStatus===0">待处理</span>
            <span v-if="orderInfo.refundStatus===1">退款中</span>
            <span v-if="orderInfo.refundStatus===2">退款成功</span>
            <span v-if="orderInfo.refundStatus===3">退款拒绝</span>
          </li>
          <li class="text item" v-if="orderInfo.refundStatus===3">
            <strong>拒绝原因：</strong>{{orderInfo.refuseReason}}
          </li>
          <li class="text item">
            <strong>退款金额：</strong>{{orderInfo.refundAmount}}元（退还至买家支付账户）
          </li>
          <li class="text item">
            <strong>退款原因：</strong>{{orderInfo.refundReason}}
          </li>
          <li class="text item">
            <strong>退款说明：</strong>{{orderInfo.refundRemark}}
          </li>
        </ul>
      </el-card>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <strong class="card-title">订单信息</strong>
        </div>
        <ul>
          <li class="text item">
            <strong>{{orderInfo.goodsName}}（总计1件）：</strong>{{orderInfo.goodsAmount}}
          </li>
          <li class="text item">
            <strong>客户信息：</strong>
            <i class="panel-i">{{orderInfo.userName}}&nbsp;</i>
            <i class="panel-i">{{orderInfo.userPhone}}</i>

          </li>
          <li class="text item">
            <strong>体检报告：</strong>
            <i class="panel-i">{{orderInfo.userName}}&nbsp</i>
            <i class="panel-i">{{orderInfo.createTime}}</i>

            <a class="showReportBtn" @click="showReportFn">
              查看详情
            </a>
          </li>
          <li class="text item">
            <strong>服务医生：</strong>{{orderInfo.doctorName}}
          </li>
          <li class="text item">
            <strong>医生机构：</strong>{{orderInfo.institutionName}}
          </li>
        </ul>
      </el-card>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <strong class="card-title">支付记录</strong>
        </div>
        <el-table
          :data="payList"
          border
          style="width: 100%">
          <el-table-column prop="thirdTradeNo" label="支付流水号"></el-table-column>
          <el-table-column prop="refundAmount" label="付款价格"></el-table-column>
          <el-table-column prop="allDiscountAmount" label="优惠金额"></el-table-column>
          <el-table-column prop="totalPrice" label="订单总价"></el-table-column>
        </el-table>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <strong class="card-title">订单变更记录</strong>
        </div>
        <el-table
          :data="orderChangeList"
          border
          style="width: 100%">
          <el-table-column prop="ORDER_CODE" label="订单号"></el-table-column>
          <el-table-column prop="CREATE_TIME" label="变更时间"></el-table-column>
          <el-table-column prop="TRADE_STATUS" label="变更状态" width="100">
            <template slot-scope="scope">
              <el-tag type="warning" v-if="scope.row.TRADE_STATUS===0">待付款</el-tag>
              <el-tag type="danger" v-if="scope.row.TRADE_STATUS===1">已取消</el-tag>
              <el-tag type="success" v-if="scope.row.TRADE_STATUS===2">已付款</el-tag>
              <el-tag type="success" v-if="scope.row.TRADE_STATUS===3">已完成</el-tag>
              <el-tag type="warning" v-if="scope.row.TRADE_STATUS===4">退款待处理</el-tag>
              <el-tag type="warning" v-if="scope.row.TRADE_STATUS===5">退款中</el-tag>
              <el-tag type="success" v-if="scope.row.TRADE_STATUS===6">退款成功</el-tag>
              <el-tag type="danger" v-if="scope.row.TRADE_STATUS===7">退款关闭</el-tag>
              <el-tag type="danger" v-if="scope.row.TRADE_STATUS===8">退款拒绝</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <div class="btn-row" style="text-align: center">
        <el-button size="small" type="primary" @click="backFn">返回</el-button>
      </div>
      <!--体检报告详情 dialog-->
      <el-dialog title="体检报告" :visible.sync="isShowReport" width="90%" custom-class="self-dialog">
        <report :reportData="reportData"></report>
      </el-dialog>


    </div>
  </div>

</template>
<script>
import headerTop from '@/components/headTop.vue';
import report from '@/components/report.vue';
import { mapGetters } from "vuex";
import { getOrderChangeRecord,ERR_OK } from "@/api/api.js";
export default {
  data() {
    return {
      orderCode:"",
      //报告详情数据
      reportData:{},
      isShowReport:false,//是否显示体检报告

      //订单变更记录
      orderChangeList: [],
      //支付记录
      payList:[]
    }
  },

  components:{
    headerTop,
    report
  },

  computed:{
    ...mapGetters({orderInfo: 'getRefuseInfo'}),
  },

  methods:{
    setPayList(){
      let obj={
        thirdTradeNo:this.orderInfo.thirdTradeNo,
        refundAmount:this.orderInfo.refundAmount,
        allDiscountAmount: this.orderInfo.allDiscountAmount,
        totalPrice:this.orderInfo.totalPrice
      };
      this.payList[0]=obj;
    },

    //点击显示体检报告详情
    showReportFn(){
      this.isShowReport=true;
      console.log(this.isShowReport)
    },


    //同意申请
    agreeApply: function (item) {
      confirm("确定同意退款？", function () {
        var parms = {
          payType: item.payChannel,//支付方式
          refundCode: item.refundCode,
          refundType: 2,
          tradeCode: item.tradeCode
        };
        $.ajax({
          type: "post",
          url: basePayUrl + "api/trade/orderRefund",
          contentType: "application/json",
          data: JSON.stringify(parms),
          success: function (res) {
            if (res.code === 1) {
              alert(res.msg,function () {
                vm.showStatus = 1;
                vm.searchParams.refundStatus="";
                vm._getDatalist();
              });
            } else {
              alert(res.msg,function () {
                vm._doBack();
              });
            }
          }
        })
      })
    },

    //拒绝申请
    refuseApply: function (item) {
      layer.prompt({
        formType: 2,
        value: '',
        title: '请填写拒绝理由',
        area: ['400px', '200px'] //自定义文本域宽高
      }, function (value, index, elem) {
        if (!value) {
          alert("拒绝理由不能为空");
          return
        }
        var ids = [];
        ids.push(item.insOrderRefundId);
        var parms = {
          insOrderRefundIds: ids,
          refundStatus: 3,
          refuseReason: value
        };
        $.ajax({
          type: "POST",
          url: baseURL + "ins/orderRefund/updateOrderRefundStatus",
          contentType: "application/json",
          data: JSON.stringify(parms),
          success: function (res) {
            if (res.code === 1) {
              alert(res.msg, function () {
                vm.showStatus = 1;
                vm._getDatalist();
              });
            } else {
              alert(res.msg);
            }
          }
        });
        layer.close(index);
      });
    },
    //获取订单变更列表
    getOrderChanges: function () {
      var params = {
        orderCode:this.$route.params.id
      };
      getOrderChangeRecord(params).then(res => {
        if(res.code===ERR_OK){
          this.orderChangeList=res.data;
        }else{
          this.$alert(res.msg, '提示', {
            confirmButtonText: '确定',
          })
        }
      }).catch(err => {

      })
    },

    backFn(){
      window.history.go(-1);
    }
  },
  activated(){
    this.setPayList();
    this.getOrderChanges();
  },
}
</script>
<style lang="less" scoped>
  .box-card{margin-bottom: 15px}
  .card-title{color:#409EFF}
  .text-danger{color:#F56C6C}
  .text.item{line-height: 24px;font-size: 14px;color:#666;margin-bottom: 10px}
  .status-text{line-height: 24px;font-size: 14px;color: #555;margin-bottom: 10px}
  .showReportBtn{color:#409EFF;cursor: pointer;font-weight: bold;font-size: 14px;}
</style>
