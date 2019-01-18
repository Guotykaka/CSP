<template>
  <div class="orderDetail">
    <header-top></header-top>
    <div class="page-container" v-if="showStatus">
      <!--订单排头-->
      <el-card :body-style="cardStyle" class="card-box">
        <div>订单编号：<span class="color3">{{orderDetailInfo.orderCode}}</span></div>
        <div>客户名称：<span class="color3">{{orderDetailInfo.realName}}</span></div>
        <div>注册手机号：<span class="color3">{{orderDetailInfo.mobile}}</span></div>
        <div>下单时间：<span class="color3">{{orderDetailInfo.orderTime}}</span></div>
        <div>订单金额：<span class="color3">￥{{orderDetailInfo.totalPrice | fixedTwo}}</span></div>
      </el-card>
      <!--订单状态-->
      <div class="stautsStyle">
        <el-card :body-style="cardStyle">
          <div v-if="orderDetailInfo.orderStatus===0" class="colorStatus">订单状态：<span class="WarningStyle">待付款</span>
          </div>
          <div v-if="orderDetailInfo.orderStatus===1" class="colorStatus">订单状态：<span class="InfoStyle">已取消</span></div>
          <div v-if="orderDetailInfo.orderStatus===2" class="colorStatus">订单状态：<span class="SuccessStyle">已付款</span>
          </div>
          <div v-if="orderDetailInfo.orderStatus===3" class="colorStatus">订单状态：<span class="blueStyle">已完成</span></div>
          <div v-if="orderDetailInfo.orderStatus===4" class="colorStatus">订单状态：<span class="blueStyle">退款待处理</span>
          </div>
          <div v-if="orderDetailInfo.orderStatus===5" class="colorStatus">订单状态：<span class="blueStyle">退款中</span></div>
          <div v-if="orderDetailInfo.orderStatus===6" class="colorStatus">订单状态：<span class="blueStyle">退款成功</span></div>
          <el-button v-if="orderDetailInfo.itemType==='30'" type="primary" @click="synchronization" size="mini">刷新状态
          </el-button>
        </el-card>
      </div>
      <!--支付记录-->
      <div class="stautsStyle">
        <el-card :body-style="payStyle">
          <div slot="header">
            <span class="colorStatus">支付记录</span>
          </div>
          <div>支付方式：
            <span class="color3" v-if="orderDetailInfo.payChannel===1">支付宝</span>
            <span class="color3" v-if="orderDetailInfo.payChannel===2">微信</span>
            <span class="color3" v-if="orderDetailInfo.payChannel===3">银行卡</span>
          </div>
          <div>支付时间：<span class="color3">{{orderDetailInfo.payTime}}</span></div>
          <div>支付流水号：<span class="color3">{{orderDetailInfo.thirdTradeNo}}</span></div>
          <div>订单金额：<span class="color3">￥{{orderDetailInfo.totalPrice}} 元</span></div>
          <div>支付金额：<span class="color3">￥{{orderDetailInfo.totalPrice | fixedTwo}} 元</span></div>
        </el-card>
      </div>
      <!--订单信息-->
      <div class="stautsStyle">
        <!--图文咨询-->
        <el-card class="box-card" :body-style="payStyle" v-if="orderDetailInfo.itemType==='10'">
          <div slot="header" class="header-style">
            <span class="colorStatus">订单信息</span>
            <div v-if="orderDetailInfo.orderStatus===0">订单状态：
              <el-tag type="warning">待付款</el-tag>
            </div>
            <div v-if="orderDetailInfo.orderStatus===1">订单状态：
              <el-tag type="info">已取消</el-tag>
            </div>
            <div v-if="orderDetailInfo.orderStatus===2">订单状态：
              <el-tag type="success">已付款</el-tag>
              <service-status :orderDetailMsg="orderDetailMsg"></service-status>
            </div>
            <div v-if="orderDetailInfo.orderStatus===3">订单状态：
              <el-tag type="success">已完成</el-tag>
              <service-status :orderDetailMsg="orderDetailMsg"></service-status>
            </div>
            <div v-if="orderDetailInfo.orderStatus===4">订单状态：
              <el-tag type="success">退款待处理</el-tag>
              <service-status :orderDetailMsg="orderDetailMsg"></service-status>
            </div>
            <div v-if="orderDetailInfo.orderStatus===5">订单状态：
              <el-tag type="success">退款中</el-tag>
              <service-status :orderDetailMsg="orderDetailMsg"></service-status>
            </div>
            <div v-if="orderDetailInfo.orderStatus===6">订单状态：
              <el-tag type="success">退款成功</el-tag>
              <service-status :orderDetailMsg="orderDetailMsg"></service-status>
            </div>
          </div>
          <div>订单编号：<span class="color3">{{orderDetailInfo.tradeCode}}</span></div>
          <div>服务名称：<span class="color3">{{orderDetailInfo.itemName}}</span></div>
          <div>服务机构：<span class="color3">{{orderDetailMsg.institutionName}}</span></div>
          <div>服务医生：<span class="color3">{{orderDetailMsg.doctorName}}</span></div>
          <div>咨询人：<span class="color3">{{orderDetailMsg.customerName}}</span></div>
          <div>性别：
            <span class="color3" v-if="orderDetailInfo.orderDetail.customerSex===2">女</span>
            <span class="color3" v-else>男</span></div>
          <div>年龄：<span class="color3">{{orderDetailMsg.customerAge}}</span></div>
          <div>描述：<span class="color3">{{orderDetailMsg.customerDesc}}</span></div>
          <div class="imgStyle">图片：
            <ul :id="'img'+orderDetailMsg.customerImgs" @click="photoShow(orderDetailMsg.customerImgs)">
              <li v-for="value in capitalize(orderDetailMsg.customerImgs)" style="float:left">
                <img style="width:20px;height:20px;margin-right:5px;" :src="value" alt="">
              </li>
            </ul>
          </div>
          <div>订单金额：<span class="color3"
                          v-if="orderDetailInfo.totalPrice">￥{{+orderDetailInfo.totalPrice | fixedTwo}} 元</span></div>
          <div>优惠金额：<span class="color3">￥{{+orderDetailInfo.preferentialPrice | fixedTwo}} 元</span></div>
          <div>结算信息：<span class="color3">商品售价：￥{{+orderDetailInfo.originPrice | fixedTwo}} 元</span>
          </div>
        </el-card>
        <!--电话报告解读-->
        <el-card class="box-card" :body-style="payStyle" v-if="orderDetailInfo.itemType==='20'">
          <div slot="header" class="header-style">
            <span class="colorStatus">订单信息</span>
            <div v-if="orderDetailInfo.orderStatus===0">订单状态：
              <el-tag type="warning">待付款</el-tag>
            </div>
            <div v-if="orderDetailInfo.orderStatus===1">订单状态：
              <el-tag type="info">已取消</el-tag>
            </div>
            <div v-if="orderDetailInfo.orderStatus===2">订单状态：
              <el-tag type="success">已付款</el-tag>
              <service-status :orderDetailMsg="orderDetailMsg"></service-status>
            </div>
            <div v-if="orderDetailInfo.orderStatus===3">订单状态：
              <el-tag type="success">已完成</el-tag>
              <service-status :orderDetailMsg="orderDetailMsg"></service-status>
            </div>
            <div v-if="orderDetailInfo.orderStatus===4">订单状态：
              <el-tag type="success">退款待处理</el-tag>
              <service-status :orderDetailMsg="orderDetailMsg"></service-status>
            </div>
            <div v-if="orderDetailInfo.orderStatus===5">订单状态：
              <el-tag type="success">退款中</el-tag>
              <service-status :orderDetailMsg="orderDetailMsg"></service-status>
            </div>
            <div v-if="orderDetailInfo.orderStatus===6">订单状态：
              <el-tag type="success">退款成功</el-tag>
              <service-status :orderDetailMsg="orderDetailMsg"></service-status>
            </div>
          </div>
          <div>订单编号：<span class="color3">{{orderDetailInfo.tradeCode}}</span></div>
          <div>服务名称：<span class="color3">{{orderDetailInfo.itemName}}</span></div>
          <div>服务机构：<span class="color3">{{orderDetailMsg.institutionName}}</span></div>
          <div>服务医生：<span class="color3">{{orderDetailMsg.doctorName}}</span></div>
          <div>接听电话：<span class="color3">{{orderDetailInfo.mobile}}</span></div>
          <div class="header-style serverCss">体检报告：<span class="color3">{{orderDetailInfo.realName}}</span><span
            class="color3">{{orderDetailInfo.orderTime}}</span>
            <span class="targetChange" @click="showReportFn(orderDetailMsg)">查看详情</span>
          </div>
          <div>订单金额：<span class="color3">￥{{+orderDetailInfo.totalPrice | fixedTwo}} 元</span></div>
          <div>优惠金额：<span class="color3">￥{{+orderDetailInfo.preferentialPrice | fixedTwo}} 元</span></div>
          <div>结算信息：<span class="color3">商品售价：￥{{+orderDetailInfo.originPrice | fixedTwo}} 元</span></div>
        </el-card>
        <!--体检加项-->
        <el-card class="box-card" :body-style="payStyle" v-if="orderDetailInfo.itemType==='30'">
          <div slot="header" class="header-style">
            <span class="colorStatus">订单信息</span>
            <div v-if="orderDetailInfo.orderStatus===0">订单状态：
              <el-tag type="warning">待付款</el-tag>
            </div>
            <div v-if="orderDetailInfo.orderStatus===1">订单状态：
              <el-tag type="info">已取消</el-tag>
            </div>
            <div v-if="orderDetailInfo.orderStatus===2">订单状态：
              <el-tag type="success">已付款</el-tag>
              <service-status :orderDetailMsg="orderDetailMsg"></service-status>
            </div>
            <div v-if="orderDetailInfo.orderStatus===3">订单状态：
              <el-tag type="success">已完成</el-tag>
              <service-status :orderDetailMsg="orderDetailMsg"></service-status>
            </div>
            <div v-if="orderDetailInfo.orderStatus===4">订单状态：
              <el-tag type="success">退款待处理</el-tag>
              <service-status :orderDetailMsg="orderDetailMsg"></service-status>
            </div>
            <div v-if="orderDetailInfo.orderStatus===5">订单状态：
              <el-tag type="success">退款中</el-tag>
              <service-status :orderDetailMsg="orderDetailMsg"></service-status>
            </div>
            <div v-if="orderDetailInfo.orderStatus===6">订单状态：
              <el-tag type="success">退款成功</el-tag>
              <service-status :orderDetailMsg="orderDetailMsg"></service-status>
            </div>
          </div>
          <div>订单编号：<span class="color3">{{orderDetailInfo.tradeCode}}</span></div>
          <div>预约单号：<span class="color3" v-if="orderDetailMsg">{{orderDetailMsg.reserNo}}</span></div>
          <div>检查日期：<span class="color3" v-if="orderDetailMsg">{{orderDetailMsg.checkDate | sliceTime}}</span></div>
          <div class="serverCss">服务名称：<span class="color3">{{orderDetailInfo.itemName}}</span><span class="targetChange"
                                                                                                    v-if="orderDetailMsg"
                                                                                                    @click="testAdd">查看详情</span>
          </div>
          <!--<div>服务机构：<span class="color3" v-if="orderDetailMsg">{{orderDetailMsg.institutionName}}</span></div>-->
          <div v-if="orderDetailMsg">是否二次购买：
            <el-tag v-if="orderDetailMsg.whetherOnlyBuy===1">是</el-tag>
            <el-tag v-if="orderDetailMsg.whetherOnlyBuy===2">否</el-tag>
          </div>
          <div>订单金额：<span class="color3">￥{{+orderDetailInfo.totalPrice | fixedTwo}} 元</span></div>
          <div>优惠金额：<span class="color3">￥{{+orderDetailInfo.preferentialPrice | fixedTwo}} 元</span></div>
          <div>结算信息：<span class="color3">商品售价：￥{{+orderDetailInfo.originPrice | fixedTwo}} 元</span></div>
        </el-card>
        <!--南大菲特/供应链实物商品-->
        <el-card class="box-card" :body-style="payStyle" v-if="orderDetailInfo.itemType==='40'">
          <div slot="header" class="header-style">
            <span class="colorStatus">订单信息</span>
            <div v-if="orderDetailInfo.orderStatus===0">订单状态：
              <el-tag type="warning">待付款</el-tag>
            </div>
            <div v-if="orderDetailInfo.orderStatus===1">订单状态：
              <el-tag type="info">已取消</el-tag>
            </div>
            <div v-if="orderDetailInfo.orderStatus===2">订单状态：
              <el-tag type="success">已付款</el-tag>
              <service-status :orderDetailMsg="orderDetailMsg"></service-status>
            </div>
            <div v-if="orderDetailInfo.orderStatus===3">订单状态：
              <el-tag type="success">已完成</el-tag>
              <service-status :orderDetailMsg="orderDetailMsg"></service-status>
            </div>
            <div v-if="orderDetailInfo.orderStatus===4">订单状态：
              <el-tag type="success">退款待处理</el-tag>
              <service-status :orderDetailMsg="orderDetailMsg"></service-status>
            </div>
            <div v-if="orderDetailInfo.orderStatus===5">订单状态：
              <el-tag type="success">退款中</el-tag>
              <service-status :orderDetailMsg="orderDetailMsg"></service-status>
            </div>
            <div v-if="orderDetailInfo.orderStatus===6">订单状态：
              <el-tag type="success">退款成功</el-tag>
              <service-status :orderDetailMsg="orderDetailMsg"></service-status>
            </div>
          </div>
          <div>订单编号：<span class="color3">{{orderDetailInfo.tradeCode}}</span></div>
          <div class="serverCss">服务名称：<span class="color3">{{orderDetailInfo.itemName}}</span></div>
          <!--<div>服务机构：<span class="color3" v-if="orderDetailMsg">{{orderDetailMsg.institutionName}}</span></div>-->
          <div>订单金额：<span class="color3">￥{{+orderDetailInfo.totalPrice | fixedTwo}} 元</span></div>
          <div>优惠金额：<span class="color3">￥{{+orderDetailInfo.preferentialPrice | fixedTwo}} 元</span></div>
          <div>结算信息：<span class="color3">商品售价：￥{{+orderDetailInfo.originPrice | fixedTwo}} 元</span></div>
          <div>收货地址：<span class="color3">{{orderDetailMsg.orderAddressInfoEntity.provinceName}}&nbsp;{{orderDetailMsg.orderAddressInfoEntity.cityName}}&nbsp;{{orderDetailMsg.orderAddressInfoEntity.areaName}}&nbsp;{{orderDetailMsg.orderAddressInfoEntity.detailedAddress}}</span></div>
        </el-card>
        <!--南大菲特/供应链服务商品-->
        <el-card class="box-card" :body-style="payStyle" v-if="orderDetailInfo.itemType==='50'||orderDetailInfo.itemType==='60'">
          <div slot="header" class="header-style">
            <span class="colorStatus">订单信息</span>
            <div v-if="orderDetailInfo.orderStatus===0">订单状态：
              <el-tag type="warning">待付款</el-tag>
            </div>
            <div v-if="orderDetailInfo.orderStatus===1">订单状态：
              <el-tag type="info">已取消</el-tag>
            </div>
            <div v-if="orderDetailInfo.orderStatus===2">订单状态：
              <el-tag type="success">已付款</el-tag>
              <service-status :orderDetailMsg="orderDetailMsg"></service-status>
            </div>
            <div v-if="orderDetailInfo.orderStatus===3">订单状态：
              <el-tag type="success">已完成</el-tag>
              <service-status :orderDetailMsg="orderDetailMsg"></service-status>
            </div>
            <div v-if="orderDetailInfo.orderStatus===4">订单状态：
              <el-tag type="success">退款待处理</el-tag>
              <service-status :orderDetailMsg="orderDetailMsg"></service-status>
            </div>
            <div v-if="orderDetailInfo.orderStatus===5">订单状态：
              <el-tag type="success">退款中</el-tag>
              <service-status :orderDetailMsg="orderDetailMsg"></service-status>
            </div>
            <div v-if="orderDetailInfo.orderStatus===6">订单状态：
              <el-tag type="success">退款成功</el-tag>
              <service-status :orderDetailMsg="orderDetailMsg"></service-status>
            </div>
          </div>
          <div>订单编号：<span class="color3">{{orderDetailInfo.tradeCode}}</span></div>
          <div class="serverCss">服务名称：<span class="color3">{{orderDetailInfo.itemName}}</span></div>
          <!--<div>服务机构：<span class="color3" v-if="orderDetailMsg">{{orderDetailMsg.institutionName}}</span></div>-->
          <div>订单金额：<span class="color3">￥{{+orderDetailInfo.totalPrice | fixedTwo}} 元</span></div>
          <div>优惠金额：<span class="color3">￥{{+orderDetailInfo.preferentialPrice | fixedTwo}} 元</span></div>
          <div>结算信息：<span class="color3">商品售价：￥{{+orderDetailInfo.originPrice | fixedTwo}} 元</span></div>
        </el-card>
        <!--一元听-->
        <el-card class="box-card" :body-style="payStyle" v-if="orderDetailInfo.itemType==='10000'">
          <div slot="header" class="header-style">
            <span class="colorStatus">订单信息</span>
            <div v-if="orderDetailInfo.orderStatus===0">订单状态：
              <el-tag type="warning">待付款</el-tag>
            </div>
            <div v-if="orderDetailInfo.orderStatus===1">订单状态：
              <el-tag type="info">已取消</el-tag>
            </div>
            <div v-if="orderDetailInfo.orderStatus===2">订单状态：
              <el-tag type="success">已付款</el-tag>
            </div>
            <div v-if="orderDetailInfo.orderStatus===3">订单状态：
              <el-tag type="success">已完成</el-tag>
            </div>
          </div>
          <div>订单编号：<span class="color3">{{orderDetailInfo.tradeCode}}</span></div>
          <div>服务名称：<span class="color3">{{orderDetailInfo.itemName}}</span></div>
          <!--<div>服务机构：<span class="color3">{{orderDetailMsg.institutionName}}</span></div>-->
          <!--<div>服务医生：<span class="color3">{{orderDetailMsg.doctorName}}</span></div>-->
          <div>订单金额：<span class="color3">￥{{+orderDetailInfo.totalPrice | fixedTwo}} 元</span></div>
          <div>优惠金额：<span class="color3">￥{{+orderDetailInfo.preferentialPrice | fixedTwo}} 元</span></div>
          <div>结算信息：<span class="color3">商品售价：￥{{+orderDetailInfo.originPrice | fixedTwo}} 元</span></div>
        </el-card>
        <!--付费视频-->
        <el-card class="box-card" :body-style="payStyle" v-if="orderDetailInfo.itemType==='20000'">
          <div slot="header" class="header-style">
            <span class="colorStatus">订单信息</span>
            <div v-if="orderDetailInfo.orderStatus===0">订单状态：
              <el-tag type="warning">待付款</el-tag>
            </div>
            <div v-if="orderDetailInfo.orderStatus===1">订单状态：
              <el-tag type="info">已取消</el-tag>
            </div>
            <div v-if="orderDetailInfo.orderStatus===2">订单状态：
              <el-tag type="success">已付款</el-tag>
            </div>
            <div v-if="orderDetailInfo.orderStatus===3">订单状态：
              <el-tag type="success">已完成</el-tag>
            </div>
          </div>
          <div>订单编号：<span class="color3">{{orderDetailInfo.tradeCode}}</span></div>
          <div>服务名称：<span class="color3">{{orderDetailInfo.itemName}}</span></div>
          <!--<div>服务机构：<span class="color3">{{orderDetailMsg.institutionName}}</span></div>-->
          <!--<div>服务医生：<span class="color3">{{orderDetailMsg.doctorName}}</span></div>-->
          <div>订单金额：<span class="color3">￥{{+orderDetailInfo.totalPrice | fixedTwo}} 元</span></div>
          <div>优惠金额：<span class="color3">￥{{+orderDetailInfo.preferentialPrice | fixedTwo}} 元</span></div>
          <div>结算信息：<span class="color3">商品售价：￥{{+orderDetailInfo.originPrice | fixedTwo}} 元</span></div>
        </el-card>
        <!--退款信息-->
        <el-card class="box-card" :body-style="payStyle" v-if="orderDetailInfo.refundCode">
          <div slot="header"><span class="colorStatus">退款信息</span></div>
          <div>退款编号：
            <div class="color3 serverCss">{{orderDetailInfo.refundCode}}
              <span class="targetChange" @click="_goDetail(orderDetailInfo)">查看详情</span>
            </div>
          </div>
        </el-card>
        <!--订单变更记录-->
        <el-card class="box-card" :body-style="payStyle" v-if="changeStatus">
          <div slot="header"><span class="colorStatus">订单变更记录</span></div>
          <div>
            <el-table
              :data="orderDetailInfo.orderRecordEntityList"
              style="width: 100%">
              <el-table-column
                show-overflow-tooltip
                type="index"
                label="序号"
                width="80">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="cspOrderId"
                label="订单号">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="insOrderRecordId"
                label="订单变更号">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="createTime"
                label="订单变更时间">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="address"
                label="订单变更状态">
                <template slot-scope="scope">
                  <el-tag type="warning" v-if="scope.row.tradeStatus===0">待付款</el-tag>
                  <el-tag type="danger" v-if="scope.row.tradeStatus===1">已取消</el-tag>
                  <el-tag type="success" v-if="scope.row.tradeStatus===2">已付款</el-tag>
                  <el-tag type="success" v-if="scope.row.tradeStatus===3">已完成</el-tag>
                  <el-tag type="warning" v-if="scope.row.tradeStatus===4">退款待处理</el-tag>
                  <el-tag type="warning" v-if="scope.row.tradeStatus===5">退款中</el-tag>
                  <el-tag type="success" v-if="scope.row.tradeStatus===6">退款成功</el-tag>
                  <el-tag type="danger" v-if="scope.row.tradeStatus===7">退款关闭</el-tag>
                  <el-tag type="danger" v-if="scope.row.tradeStatus===8">退款拒绝</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </div>
      <div class="reBtn">
        <el-button type="primary" @click="returnBlack">返 回</el-button>
        <el-button type="primary" v-if="orderDetailInfo.orderStatus===2&&orderDetailInfo.itemType!=='30'&&orderDetailInfo.itemType!=='60'"
                   @click="returnMoney">退 款
        </el-button>
        <el-button type="primary" v-if="orderDetailInfo.orderStatus===2&&orderDetailInfo.itemType ==='60'&&orderDetailMsg.serviceStatus===16||
        orderDetailInfo.orderStatus===2&&orderDetailInfo.itemType ==='60'&&orderDetailMsg.serviceStatus===15"
                   @click="returnMoney">退 款
        </el-button>
      </div>
      <!--体检报告详情 dialog-->
      <el-dialog title="体检报告" :visible.sync="isShowReport" width="90%" custom-class="self-dialog">
        <report :reportData="reportData"></report>
      </el-dialog>
      <!--体检加项选择-->
      <el-dialog title="体检加项" :visible.sync="testShowmsg" width="90%" custom-class="self-dialog">
        <div v-if="ViewItem.length>0">
          <el-card class="box-card" v-for="item in ViewItem" :key="item.productName">
            <el-row :gutter="20">
              <el-col :span="18">{{item.productName}}</el-col>
              <el-col :span="6">{{item.productPrice}}元</el-col>
            </el-row>
          </el-card>
        </div>
        <div v-else style="text-align: center;">暂无数据</div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import headerTop from '@/components/headTop.vue'
  import {
    ERR_OK,
    getOrderInfoDetail,
    getMedicalReportDetail,
    getExamDetail,
    applyOrderRefund,
    agreeRefuse,
    applyRefund,
    syncAdditionData
  } from "@/api/api"
  // import report from '@/components/report.vue';
  import report from '@/components/reportNew.vue';
  import ServiceStatus from 'service/ServiceStatus'

  export default {
    name: "orderDetail",
    components: {
      headerTop,
      report,
      ServiceStatus
    },
    data() {
      return {
        reportData: {},//报告详情数据
        cardStyle: {
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          color: '#999'
        },
        payStyle: {
          color: '#999',
          lineHeight: '32px',
        },
        isShowReport: false,//是否显示体检报告
        isRefundDetail: false,//退款详情是否显示
        orderDetailInfo: null,//订单信息
        orderDetailMsg: {},//订单信息
        testShowmsg: false,//体检加项选择框
        ViewItem: [],
        doubleClick: true
      }
    },
    activated() {
      this.orderId = this.$route.params.orderId;
      this.getDetail();
    },
    methods: {
      /*订单详情*/
      getDetail() {
        this.orderDetailInfo = null;
        this.orderDetailMsg = {};
        let params = {
          orderId: this.orderId
        };
        getOrderInfoDetail(params).then((res) => {
          if (res.code === ERR_OK) {
            this.orderDetailInfo = res.data;
            this.orderDetailMsg = res.data.orderDetail;
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试');
        })
      },
      /*图文咨询图片处理成数组*/
      capitalize: function (value) {
        if (value) {
          var arrValue = value.split(',');
        }
        return arrValue
      },
      /*返回路由上一页*/
      returnBlack() {
        this.$router.go(-1)
      },
      /*同步数据*/
      synchronization() {
        let params = {
          orderId: this.orderId
        };
        if (this.doubleClick) {
          this.doubleClick = false;
          syncAdditionData(params).then((res) => {
            if (res.code === ERR_OK) {
              this.doubleClick = true;
              this.getDetail();
            } else {
              this.doubleClick = true;
              this.$alert(res.msg, '提示');
            }
          }).catch(()=>{
            this.$message.error('网络错误!请稍后重试');
          })
        }
      },
      /*进行退款*/
      returnMoney() {
        this.$prompt('', '输入退款理由', {
          confirmButtonText: '提交退款',
          cancelButtonText: '取消',
          center: true,
          showClose: false,
          inputErrorMessage: '请输入退款原因',
          inputPlaceholder: '告知用户退款原因',
          inputType: 'textarea',
          inputValidator: function (v) {
            if (v === '' || !v) {
              return false
            } else {
              return true
            }
          }
        }).then(({value}) => {
          /*申请退款*/
          let params = {
            orderId: this.orderId,
            refundReason: value
          };
          if(this.orderDetailInfo.itemType==='30'){
            this.getRefundAdd(params);
          }else if(this.orderDetailInfo.itemType!=null){
            this.getRefund(params)
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消退款'
          });
        });
      },
      /*体检加项退款*/
      getRefundAdd(params){
        applyOrderRefund(params).then((res) => {
          if (res.code === ERR_OK) {
            this.agreeApply(res.data);
          } else {
            this.$message({
              type: 'info',
              message: res.msg
            })
          }
        }).catch(()=>{
          this.$message.error('网络错误,请稍后重试!');
        })
      },
      /*体检加项之外退款*/
      getRefund(params){
        applyRefund(params).then((res) => {
          if (res.code === ERR_OK) {
            this.$message({
              type: 'success',
              message: res.msg
            });
            this.getDetail()
          } else {
            this.$message({
              type: 'info',
              message: res.msg
            })
          }
        }).catch(()=>{
          this.$message.error('网络错误,请重试!');
        })
      },
      /*同意退款*/
      agreeApply(val) {
        let params = {
          payType: this.orderDetailInfo.payChannel,//支付方式
          refundCode: val,
          refundType: 2,
          tradeCode: this.orderDetailInfo.tradeCode
        };
        // this.$confirm('确定同意退款？')
        //   .then(_ => {
        const loading = this.$loading({
          lock: true,
          text: '处理中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        agreeRefuse(params).then(res => {
          loading.close();
          if (res.code === ERR_OK) {
            this.$alert("退款成功", '提示', {
              confirmButtonText: '确定'
            })
          } else {
            this.$message.error('操作失败');
          }
        }).catch(err => {
          loading.close();
          this.$alert(err.msg, '提示', {
            confirmButtonText: '确定',
          })
        })
        // })
      },
      //点击显示体检报告详情
      showReportFn(val) {
        let data = {
          "checkUnitCode": val.checkUnitCode,
            "workNo": val.workNo
        }
        getMedicalReportDetail(data).then((res) => {
          if (res.code === ERR_OK) {
            this.reportData = res.data;
            if (res.data) {
              this.isShowReport = true;
            } else {
              this.$alert('暂无数据', '提示')
            }
          }else{
            this.$alert('请求失败', '提示')
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试');
        })
      },
      //点击显示退款详情
      _goDetail(val) {
        let reportId = val.orderRefundId;
        this.$router.push({path: `/refundsInfo/${reportId}`})
      },
      //图片预览
      photoShow: function (index) {
        let idName = 'img' + index;
        let viewer = new Viewer(document.getElementById(idName), {
          navbar: false,
          scalable: false,
          minZoomRatio: 0.1,
          maxZoomRatio: 10,
          movable: false,
          fullscreen: false
        });
      },
      /*查看体检加项*/
      testAdd() {
        let params = {
          id: this.orderDetailMsg.examAppointmentId
        };
        getExamDetail(params).then((res) => {
          if (res.code === ERR_OK) {
            this.ViewItem = [];
            this.ViewItem = res.data;
            this.testShowmsg = true;
          } else {
            this.$alert(res.msg, '提示');
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试');
        })
      }
    },
    computed: {
      /*是否显示订单变更*/
      changeStatus() {
        if (this.orderDetailInfo.orderRecordEntityList) {
          return this.orderDetailInfo.orderRecordEntityList.length > 0;
        } else {
          return false;
        }
      },
      /*判断是否有数据*/
      showStatus() {
        return this.orderDetailInfo
      }
    },
    filters: {
      /*取余*/
      fixedTwo: function (val) {
        var value = val;
        if (val) {
          value = val.toFixed(2)
        }
        return value
      },
      /*截取时分秒*/
      sliceTime(val) {
        let value;
        if (val) {
          value = val.slice(0, 10)
        } else {
          value = val
        }
        return value;
      }
    }
  }
</script>
<style scoped lang="less">

  .card-box {
    margin-bottom: 20px;
  }

  .box-card {
    margin-bottom: 10px;
  }

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
      margin-bottom: 20px;

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
          cursor: pointer;
          color: #409EFF;
        }
      }
      .imgStyle {
        line-height: 40px;
        ul {
          display: inline-block;
          height: 20px;
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
