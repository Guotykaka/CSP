<template>
  <div class="orderDetail">
    <header-top></header-top>
    <div class="page-container">
      <!--订单排头-->
      <el-card :body-style="cardStyle">
        <div>订单编号：<span class="color3">{{deatilSon.tradeCode}}</span></div>
        <div>客户名称：<span class="color3">{{deatilSon.customerName}}</span></div>
        <div>注册手机号：<span class="color3">{{deatilSon.mobile}}</span></div>
        <div>下单时间：<span class="color3">{{deatilSon.createTime}}</span></div>
        <div>订单金额：<span class="color3">￥{{deatilSon.totalPrice | fixedTwo}}</span></div>
      </el-card>
      <!--订单状态-->
      <div class="stautsStyle">
        <el-card :body-style="cardStyle">
          <div v-show="deatilSon.tradeStatus==0" class="colorStatus">订单状态：
            <span class="WarningStyle">待付款</span>
          </div>
          <div v-show="deatilSon.tradeStatus==1" class="colorStatus">订单状态：
            <span class="InfoStyle">已取消</span>
          </div>
          <div v-show="deatilSon.tradeStatus==2" class="colorStatus">订单状态：
            <span class="SuccessStyle">已付款</span>
          </div>
          <div v-show="deatilSon.tradeStatus==3" class="colorStatus">订单状态：
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
            <span class="color3" v-if="deatilSon.payChannel==1">支付宝</span>
            <span class="color3" v-if="deatilSon.payChannel==2">微信</span>
            <span class="color3" v-if="deatilSon.payChannel==3">银行卡</span>
          </div>
          <div>支付时间：<span class="color3">{{deatilSon.paymentTime}}</span></div>
          <div>支付流水号：<span class="color3">{{deatilSon.thirdTradeNo}}</span></div>
          <div>订单金额：<span class="color3">￥{{deatilSon.totalPrice | fixedTwo}}</span></div>
          <div>优惠金额：<span class="color3">￥{{deatilSon.discountAmount | fixedTwo}}</span></div>
          <div>支付金额：<span class="color3">￥{{deatilSon.totalPrice | fixedTwo}}</span></div>
        </el-card>
      </div>
      <!--订单信息-->
      <div class="stautsStyle">
        <!--电话报告解读-->
        <el-card class="box-card" :body-style="payStyle" v-if="deatilSon.serviceType===2">
          <div slot="header" class="header-style">
            <span class="colorStatus">订单信息</span>
            <div v-if="deatilSon.orderStatus==0">订单状态：
              <el-tag type="warning">待付款</el-tag>
            </div>
            <div v-if="deatilSon.orderStatus==1">订单状态：
              <el-tag type="info">已取消</el-tag>
            </div>
            <div v-if="deatilSon.orderStatus==2">订单状态：
              <el-tag type="success">已付款</el-tag>
              <div v-if="customerSonDetail" class="serverCss">订单服务状态：
                <el-tag class="DangerStyle" v-if="customerSonDetail.orderServiceStatus==0">待服务</el-tag>
                <el-tag class="WarningStyle" v-if="customerSonDetail.orderServiceStatus==1">客户忙待联系</el-tag>
                <el-tag class="blueStyle" v-if="customerSonDetail.orderServiceStatus==2">服务中</el-tag>
                <el-tag class="SuccessStyle" v-if="customerSonDetail.orderServiceStatus==3">已完成</el-tag>
                <el-tag class="InfoStyle" v-if="customerSonDetail.orderServiceStatus==4">已失效</el-tag>
              </div>
            </div>
            <div v-if="deatilSon.orderStatus==3">订单状态：
              <el-tag type="success">已完成</el-tag>
              <div v-if="customerSonDetail" class="serverCss">订单服务状态：
                <el-tag class="DangerStyle" v-if="customerSonDetail.orderServiceStatus==0">待服务</el-tag>
                <el-tag class="WarningStyle" v-if="customerSonDetail.orderServiceStatus==1">客户忙待联系</el-tag>
                <el-tag class="blueStyle" v-if="customerSonDetail.orderServiceStatus==2">服务中</el-tag>
                <el-tag class="SuccessStyle" v-if="customerSonDetail.orderServiceStatus==3">已完成</el-tag>
                <el-tag class="InfoStyle" v-if="customerSonDetail.orderServiceStatus==4">已失效</el-tag>
              </div>
            </div>
          </div>
          <div>订单编号：<span class="color3">{{deatilSon.tradeCode}}</span></div>
          <div>服务名称：<span class="color3">{{deatilSon.itemName}}</span></div>
          <div>服务机构：<span class="color3">{{deatilSon.institutionName}}</span></div>
          <div>服务医生：<span class="color3">{{deatilSon.name}}</span></div>
          <div>接听电话：<span class="color3">{{deatilSon.mobile}}</span></div>
          <div class="header-style serverCss">体检报告：<span class="color3">{{customerSonDetail.name}}</span><span
            class="color3">{{customerSonDetail.createTime}}</span>
            <span class="targetChange" @click="showReportFn(deatilSon)">查看详情</span>
          </div>
          <div>订单金额：<span class="color3">￥{{deatilSon.totalPrice | fixedTwo}}</span></div>
          <div>结算信息：<span class="color3">商品售价：￥{{deatilSon.totalPrice | fixedTwo}}</span></div>
        </el-card>
        <!--图文咨询-->
        <el-card class="box-card" :body-style="payStyle" v-else>
          <div slot="header" class="header-style">
            <span class="colorStatus">订单信息</span>
            <div v-if="deatilSon.orderStatus==0">订单状态：
              <el-tag type="warning">待付款</el-tag>
            </div>
            <div v-if="deatilSon.orderStatus==1">订单状态：
              <el-tag type="info">已取消</el-tag>
            </div>
            <div v-if="deatilSon.orderStatus==2">订单状态：
              <el-tag type="success">已付款</el-tag>
              <div v-if="customerSonDetail" class="serverCss">订单服务状态：
                <el-tag class="DangerStyle" v-if="customerSonDetail.orderServiceStatus==0">待服务</el-tag>
                <el-tag class="WarningStyle" v-if="customerSonDetail.orderServiceStatus==1">客户忙待联系</el-tag>
                <el-tag class="blueStyle" v-if="customerSonDetail.orderServiceStatus==2">服务中</el-tag>
                <el-tag class="SuccessStyle" v-if="customerSonDetail.orderServiceStatus==3">已完成</el-tag>
                <el-tag class="InfoStyle" v-if="customerSonDetail.orderServiceStatus==4">已失效</el-tag>
              </div>
            </div>
            <div v-if="deatilSon.orderStatus==3">订单状态：
              <el-tag type="success">已完成</el-tag>
              <div v-if="customerSonDetail" class="serverCss">订单服务状态：
                <el-tag class="DangerStyle" v-if="customerSonDetail.orderServiceStatus==0">待服务</el-tag>
                <el-tag class="WarningStyle" v-if="customerSonDetail.orderServiceStatus==1">客户忙待联系</el-tag>
                <el-tag class="blueStyle" v-if="customerSonDetail.orderServiceStatus==2">服务中</el-tag>
                <el-tag class="SuccessStyle" v-if="customerSonDetail.orderServiceStatus==3">已完成</el-tag>
                <el-tag class="InfoStyle" v-if="customerSonDetail.orderServiceStatus==4">已失效</el-tag>
              </div>
            </div>
          </div>
          <div>订单编号：<span class="color3">{{deatilSon.tradeCode}}</span></div>
          <div>服务名称：<span class="color3">{{deatilSon.itemName}}</span></div>
          <div>服务机构：<span class="color3">{{deatilSon.institutionName}}</span></div>
          <div>服务医生：<span class="color3">{{deatilSon.name}}</span></div>
          <div>咨询人：<span class="color3">{{deatilSon.customerName}}</span></div>
          <div>性别：
            <span class="color3" v-if="deatilSon.customerSex===2">女</span>
            <span class="color3" v-else>男</span></div>
          <div>年龄：<span class="color3">{{deatilSon.customerAge}}</span></div>
          <div>描述：<span class="color3">{{deatilSon.customerDesc}}</span></div>
          <div class="imgStyle">图片：
            <ul id="layer-photos-demo" @click="photoShow(deatilSon.customerImgs)">
              <li v-for="(value,ind) in capitalize(deatilSon.customerImgs)" style="float:left">
                <img style="width:20px;height:20px;margin-right:5px;background-color:#ee55ee;" layer-pid="ind"
                     layer-src="value" :src="value" alt="">
              </li>
            </ul>
          </div>
          <div>订单金额：<span v-if="deatilSon.totalPrice">￥{{deatilSon.totalPrice | fixedTwo}}</span></div>
          <div>结算信息：<span v-if="deatilSon.totalPrice">商品售价：￥{{deatilSon.totalPrice | fixedTwo}}</span></div>
        </el-card>
        <!--退款信息-->
        <el-card class="box-card" :body-style="payStyle" v-if="deatilSon.insOrderRefundEntity">
          <div slot="header"><span class="colorStatus">退款信息</span></div>
          <div>退款编号：
            <div class="color3 serverCss">{{deatilSon.insOrderRefundEntity.refundCode}}
              <span class="targetChange" @click="_goDetail(deatilSon)">查看详情</span>
            </div>
          </div>
        </el-card>
        <!--订单变更记录-->
        <el-card class="box-card" :body-style="payStyle">
          <div slot="header"><span class="colorStatus">订单变更记录</span></div>
          <div v-for="(itemChange,index2) in deatilSon.orderChangeList" :key="index2">
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
      <!--退款详情-->
      <el-dialog style="height:100%;" lock-scroll="true" title="退款详情" :visible.sync="isRefundDetail" width="80%" custom-class="self-dialog">
        <refundDetail :refundDetail="refundDetail" :customerDetail="customerSonDetail"></refundDetail>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import headerTop from '@/components/headTop.vue'
  import {api} from "@/api/api"
  import report from '@/components/report.vue';
  import refundDetail from '@/components/refundDetail.vue';

  export default {
    name: "orderDetail",
    components: {
      headerTop,
      report,
      refundDetail
    },
    data() {
      return {
        //报告详情数据

        reportData: {
          "CustomerName": "魏秀琴",
          "CheckUnitName": "SQLServer中间库",
          "CheckUnitCode": "sta2015",
          "OrderName": "河南省地质环境监测院",
          "OrderCode": "2341",
          "Birthday": "19600101000000",
          "RegDate": "20151127150128",
          "ReportDate": "20151127150128",
          "Age": "57",
          "Sex": 0.0,
          "CommitUserName": null,
          "WorkNo": "00291153",
          "IDCardNo": "410102195812233027",
          "GroupIds": [

          ],
          "CheckItems": [
            {
              "CheckItemName": "心电图",
              "CheckItemCode": "5",
              "DepartmentName": "心电图",
              "SalePrice": "17",
              "CheckStateID": 3.0,
              "CheckUserName": "冯燕玲",
              "CheckResults": [
                {
                  "CheckIndexName": "心电图",
                  "CheckIndexCode": "276",
                  "ResultValue": "①窦性心律\r\n②T波改变",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 3.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                }
              ]
            },
            {
              "CheckItemName": "甲状腺彩超",
              "CheckItemCode": "48",
              "DepartmentName": "彩超",
              "SalePrice": "60",
              "CheckStateID": 3.0,
              "CheckUserName": "汪慧卿",
              "CheckResults": [
                {
                  "CheckIndexName": "甲状腺彩超",
                  "CheckIndexCode": "316",
                  "ResultValue": "甲状腺多发低回声结节",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 3.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                }
              ]
            },
            {
              "CheckItemName": "妇科普检",
              "CheckItemCode": "52",
              "DepartmentName": "妇科",
              "SalePrice": "7",
              "CheckStateID": 3.0,
              "CheckUserName": "魏平",
              "CheckResults": [
                {
                  "CheckIndexName": "外阴",
                  "CheckIndexCode": "318",
                  "ResultValue": "未见异常",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "阴道",
                  "CheckIndexCode": "319",
                  "ResultValue": "潮红",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 3.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "分泌物",
                  "CheckIndexCode": "320",
                  "ResultValue": "正常",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "宫颈",
                  "CheckIndexCode": "321",
                  "ResultValue": "未见异常",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "子宫",
                  "CheckIndexCode": "322",
                  "ResultValue": "未见异常",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "附件",
                  "CheckIndexCode": "656",
                  "ResultValue": "未见明显异常",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "前后穹隆",
                  "CheckIndexCode": "895",
                  "ResultValue": "未见明显异常",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                }
              ]
            },
            {
              "CheckItemName": "肝功八项",
              "CheckItemCode": "65",
              "DepartmentName": "检验科",
              "SalePrice": "44",
              "CheckStateID": 3.0,
              "CheckUserName": "王中全",
              "CheckResults": [
                {
                  "CheckIndexName": "总蛋白",
                  "CheckIndexCode": "33",
                  "ResultValue": "79",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "g/L",
                  "TextRef": "60--85",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "60--85",
                  "HighValueRef": "60--85",
                  "ShowIndex": 0.0,
                  "ValueRef": "60--85"
                },
                {
                  "CheckIndexName": "白蛋白",
                  "CheckIndexCode": "34",
                  "ResultValue": "49.4",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "g/L",
                  "TextRef": "35--55",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "35--55",
                  "HighValueRef": "35--55",
                  "ShowIndex": 0.0,
                  "ValueRef": "35--55"
                },
                {
                  "CheckIndexName": "球蛋白",
                  "CheckIndexCode": "35",
                  "ResultValue": "29.6",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "g/L",
                  "TextRef": "20--40",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "20--40",
                  "HighValueRef": "20--40",
                  "ShowIndex": 0.0,
                  "ValueRef": "20--40"
                },
                {
                  "CheckIndexName": "白/球比例",
                  "CheckIndexCode": "36",
                  "ResultValue": "1.67",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "1.2--2.4",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "1.2--2.4",
                  "HighValueRef": "1.2--2.4",
                  "ShowIndex": 0.0,
                  "ValueRef": "1.2--2.4"
                },
                {
                  "CheckIndexName": "总胆红素",
                  "CheckIndexCode": "37",
                  "ResultValue": "15.7",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "umol/L",
                  "TextRef": "3.42--20.5",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "3.42--20.5",
                  "HighValueRef": "3.42--20.5",
                  "ShowIndex": 0.0,
                  "ValueRef": "3.42--20.5"
                },
                {
                  "CheckIndexName": "直接胆红素",
                  "CheckIndexCode": "38",
                  "ResultValue": "4.5",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "umol/L",
                  "TextRef": "0.4--6.9",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "0.4--6.9",
                  "HighValueRef": "0.4--6.9",
                  "ShowIndex": 0.0,
                  "ValueRef": "0.4--6.9"
                },
                {
                  "CheckIndexName": "间接胆红素",
                  "CheckIndexCode": "39",
                  "ResultValue": "11.2",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "umol/L",
                  "TextRef": "1.7--13.2",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "1.7--13.2",
                  "HighValueRef": "1.7--13.2",
                  "ShowIndex": 0.0,
                  "ValueRef": "1.7--13.2"
                },
                {
                  "CheckIndexName": "谷丙转氨酶",
                  "CheckIndexCode": "40",
                  "ResultValue": "28",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "U/L",
                  "TextRef": "5--40",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "5--40",
                  "HighValueRef": "5--40",
                  "ShowIndex": 0.0,
                  "ValueRef": "5--40"
                },
                {
                  "CheckIndexName": "谷草转氨酶",
                  "CheckIndexCode": "41",
                  "ResultValue": "22",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "U/L",
                  "TextRef": "5--40",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "5--40",
                  "HighValueRef": "5--40",
                  "ShowIndex": 0.0,
                  "ValueRef": "5--40"
                },
                {
                  "CheckIndexName": "碱性磷酸酶",
                  "CheckIndexCode": "44",
                  "ResultValue": "93",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "U/L",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "γ谷氨酰转肽酶",
                  "CheckIndexCode": "986",
                  "ResultValue": "50",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "IU/L",
                  "TextRef": "7--58",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "7--58",
                  "HighValueRef": "7--58",
                  "ShowIndex": 0.0,
                  "ValueRef": "7--58"
                },
                {
                  "CheckIndexName": "转氨酶比",
                  "CheckIndexCode": "1003",
                  "ResultValue": "0.79",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                }
              ]
            },
            {
              "CheckItemName": "葡萄糖",
              "CheckItemCode": "69",
              "DepartmentName": "检验科",
              "SalePrice": "7",
              "CheckStateID": 3.0,
              "CheckUserName": "王中全",
              "CheckResults": [
                {
                  "CheckIndexName": "葡萄糖",
                  "CheckIndexCode": "999",
                  "ResultValue": "6.97",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "mmol/L",
                  "TextRef": "3.8--6.1",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 3.0,
                  "LowValueRef": "3.8--6.1",
                  "HighValueRef": "3.8--6.1",
                  "ShowIndex": 0.0,
                  "ValueRef": "3.8--6.1"
                }
              ]
            },
            {
              "CheckItemName": "一般检查（身高、体重、血压）",
              "CheckItemCode": "176",
              "DepartmentName": "一般检查",
              "SalePrice": "0",
              "CheckStateID": 3.0,
              "CheckUserName": "王慧敏",
              "CheckResults": [
                {
                  "CheckIndexName": "身高",
                  "CheckIndexCode": "12",
                  "ResultValue": "",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "cm",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "体重",
                  "CheckIndexCode": "13",
                  "ResultValue": "",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "kg",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "体重指数",
                  "CheckIndexCode": "14",
                  "ResultValue": "",
                  "AppendInfo": "",
                  "IsCalc": true,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "收缩压",
                  "CheckIndexCode": "434",
                  "ResultValue": "145",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "mmHg",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "舒张压",
                  "CheckIndexCode": "435",
                  "ResultValue": "72",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "mmHg",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "血压结论",
                  "CheckIndexCode": "436",
                  "ResultValue": "40",
                  "AppendInfo": "",
                  "IsCalc": true,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 3.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                }
              ]
            },
            {
              "CheckItemName": "口腔科(自选)",
              "CheckItemCode": "189",
              "DepartmentName": "",
              "SalePrice": "0",
              "CheckStateID": 0.0,
              "CheckUserName": "",
              "CheckResults": [

              ]
            },
            {
              "CheckItemName": "胸部正位片",
              "CheckItemCode": "361",
              "DepartmentName": "放射科",
              "SalePrice": "70",
              "CheckStateID": 3.0,
              "CheckUserName": "孙耀煜",
              "CheckResults": [
                {
                  "CheckIndexName": "胸部正位片",
                  "CheckIndexCode": "722",
                  "ResultValue": "",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "检查项目所见 ",
                  "CheckIndexCode": "1278",
                  "ResultValue": "",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                }
              ]
            },
            {
              "CheckItemName": "幽门螺杆菌抗体测定",
              "CheckItemCode": "421",
              "DepartmentName": "检验科",
              "SalePrice": "56",
              "CheckStateID": 3.0,
              "CheckUserName": "王中全",
              "CheckResults": [
                {
                  "CheckIndexName": "幽门螺杆菌抗体测定",
                  "CheckIndexCode": "808",
                  "ResultValue": "阴性",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "阴性",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "阴性",
                  "HighValueRef": "阴性",
                  "ShowIndex": 0.0,
                  "ValueRef": "阴性"
                }
              ]
            },
            {
              "CheckItemName": "宫颈刮片",
              "CheckItemCode": "429",
              "DepartmentName": "检验科",
              "SalePrice": "34",
              "CheckStateID": 3.0,
              "CheckUserName": "王中全",
              "CheckResults": [
                {
                  "CheckIndexName": "宫颈刮片",
                  "CheckIndexCode": "819",
                  "ResultValue": "巴氏分级Ⅰ级",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                }
              ]
            },
            {
              "CheckItemName": "红外线乳透检查",
              "CheckItemCode": "518",
              "DepartmentName": "乳透",
              "SalePrice": "35",
              "CheckStateID": 3.0,
              "CheckUserName": "朱慧颖",
              "CheckResults": [
                {
                  "CheckIndexName": "红外线乳透检查",
                  "CheckIndexCode": "952",
                  "ResultValue": "乳腺退化不良",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 3.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                }
              ]
            },
            {
              "CheckItemName": "血脂",
              "CheckItemCode": "582",
              "DepartmentName": "检验科",
              "SalePrice": "28",
              "CheckStateID": 3.0,
              "CheckUserName": "王中全",
              "CheckResults": [
                {
                  "CheckIndexName": "甘油三酯",
                  "CheckIndexCode": "45",
                  "ResultValue": "2.83",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "mmol/L",
                  "TextRef": "0.5--1.7",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 3.0,
                  "LowValueRef": "0.5--1.7",
                  "HighValueRef": "0.5--1.7",
                  "ShowIndex": 0.0,
                  "ValueRef": "0.5--1.7"
                },
                {
                  "CheckIndexName": "总胆固醇",
                  "CheckIndexCode": "46",
                  "ResultValue": "4.57",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "mmol/L",
                  "TextRef": "3.1--6",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "3.1--6",
                  "HighValueRef": "3.1--6",
                  "ShowIndex": 0.0,
                  "ValueRef": "3.1--6"
                },
                {
                  "CheckIndexName": "高密度胆固醇",
                  "CheckIndexCode": "47",
                  "ResultValue": "1.33",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "mmol/L",
                  "TextRef": "0.8--2",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "0.8--2",
                  "HighValueRef": "0.8--2",
                  "ShowIndex": 0.0,
                  "ValueRef": "0.8--2"
                },
                {
                  "CheckIndexName": "低密度胆固醇",
                  "CheckIndexCode": "980",
                  "ResultValue": "2.21",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "mmol/L",
                  "TextRef": "0--3.1",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "0--3.1",
                  "HighValueRef": "0--3.1",
                  "ShowIndex": 0.0,
                  "ValueRef": "0--3.1"
                }
              ]
            },
            {
              "CheckItemName": "肾功二项",
              "CheckItemCode": "625",
              "DepartmentName": "检验科",
              "SalePrice": "17",
              "CheckStateID": 3.0,
              "CheckUserName": "王中全",
              "CheckResults": [
                {
                  "CheckIndexName": "肌酐",
                  "CheckIndexCode": "58",
                  "ResultValue": "54.4",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "umol/L",
                  "TextRef": "35--97",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "35--97",
                  "HighValueRef": "35--97",
                  "ShowIndex": 0.0,
                  "ValueRef": "35--97"
                },
                {
                  "CheckIndexName": "尿素",
                  "CheckIndexCode": "995",
                  "ResultValue": "3.18",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "mmol/L",
                  "TextRef": "1.7--8.2",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "1.7--8.2",
                  "HighValueRef": "1.7--8.2",
                  "ShowIndex": 0.0,
                  "ValueRef": "1.7--8.2"
                }
              ]
            },
            {
              "CheckItemName": "颈椎正侧位片",
              "CheckItemCode": "672",
              "DepartmentName": "放射科",
              "SalePrice": "140",
              "CheckStateID": 3.0,
              "CheckUserName": "孙耀煜",
              "CheckResults": [
                {
                  "CheckIndexName": "颈椎正、侧位片",
                  "CheckIndexCode": "757",
                  "ResultValue": "",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "其它",
                  "CheckIndexCode": "944",
                  "ResultValue": "两肺纹理增多。\r\r\r\r\r\r颈椎退行性改变，请结合临床。\r\r\r\r\r\r\r\r\r\r\r\r\r",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                }
              ]
            },
            {
              "CheckItemName": "血常规(五分类)",
              "CheckItemCode": "685",
              "DepartmentName": "检验科",
              "SalePrice": "20",
              "CheckStateID": 3.0,
              "CheckUserName": "王中全",
              "CheckResults": [
                {
                  "CheckIndexName": "白细胞",
                  "CheckIndexCode": "1161",
                  "ResultValue": "6.35",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "3.5--9.5",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "3.5--9.5",
                  "HighValueRef": "3.5--9.5",
                  "ShowIndex": 0.0,
                  "ValueRef": "3.5--9.5"
                },
                {
                  "CheckIndexName": "中性细胞数",
                  "CheckIndexCode": "1162",
                  "ResultValue": "3.76",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "1.8--6.3",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "1.8--6.3",
                  "HighValueRef": "1.8--6.3",
                  "ShowIndex": 0.0,
                  "ValueRef": "1.8--6.3"
                },
                {
                  "CheckIndexName": "淋巴细胞数",
                  "CheckIndexCode": "1163",
                  "ResultValue": "2.1",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "1.1--3.2",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "1.1--3.2",
                  "HighValueRef": "1.1--3.2",
                  "ShowIndex": 0.0,
                  "ValueRef": "1.1--3.2"
                },
                {
                  "CheckIndexName": "单核细胞",
                  "CheckIndexCode": "1164",
                  "ResultValue": "0.27",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "0.1--0.6",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "0.1--0.6",
                  "HighValueRef": "0.1--0.6",
                  "ShowIndex": 0.0,
                  "ValueRef": "0.1--0.6"
                },
                {
                  "CheckIndexName": "嗜酸性粒细胞",
                  "CheckIndexCode": "1165",
                  "ResultValue": "0.2",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "0.02--0.52",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "0.02--0.52",
                  "HighValueRef": "0.02--0.52",
                  "ShowIndex": 0.0,
                  "ValueRef": "0.02--0.52"
                },
                {
                  "CheckIndexName": "嗜碱性粒细胞",
                  "CheckIndexCode": "1166",
                  "ResultValue": "0.02",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "0--0.06",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "0--0.06",
                  "HighValueRef": "0--0.06",
                  "ShowIndex": 0.0,
                  "ValueRef": "0--0.06"
                },
                {
                  "CheckIndexName": "中性细胞比率",
                  "CheckIndexCode": "1167",
                  "ResultValue": "59.2",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "40--75",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "40--75",
                  "HighValueRef": "40--75",
                  "ShowIndex": 0.0,
                  "ValueRef": "40--75"
                },
                {
                  "CheckIndexName": "淋巴细胞比率",
                  "CheckIndexCode": "1168",
                  "ResultValue": "33.1",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "20--50",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "20--50",
                  "HighValueRef": "20--50",
                  "ShowIndex": 0.0,
                  "ValueRef": "20--50"
                },
                {
                  "CheckIndexName": "单核细胞比率",
                  "CheckIndexCode": "1169",
                  "ResultValue": "4.3",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "3--10",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "3--10",
                  "HighValueRef": "3--10",
                  "ShowIndex": 0.0,
                  "ValueRef": "3--10"
                },
                {
                  "CheckIndexName": "嗜酸性粒细胞比率",
                  "CheckIndexCode": "1170",
                  "ResultValue": "3.1",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "0.4--8",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "0.4--8",
                  "HighValueRef": "0.4--8",
                  "ShowIndex": 0.0,
                  "ValueRef": "0.4--8"
                },
                {
                  "CheckIndexName": "嗜碱性粒细胞比率",
                  "CheckIndexCode": "1171",
                  "ResultValue": "0.3",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "0--1",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "0--1",
                  "HighValueRef": "0--1",
                  "ShowIndex": 0.0,
                  "ValueRef": "0--1"
                },
                {
                  "CheckIndexName": "红细胞",
                  "CheckIndexCode": "1172",
                  "ResultValue": "4.7",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "3.8--5.1",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "3.8--5.1",
                  "HighValueRef": "3.8--5.1",
                  "ShowIndex": 0.0,
                  "ValueRef": "3.8--5.1"
                },
                {
                  "CheckIndexName": "血红蛋白",
                  "CheckIndexCode": "1173",
                  "ResultValue": "138",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "110--155",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "110--155",
                  "HighValueRef": "110--155",
                  "ShowIndex": 0.0,
                  "ValueRef": "110--155"
                },
                {
                  "CheckIndexName": "红细胞压积",
                  "CheckIndexCode": "1174",
                  "ResultValue": "42.5",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "35--45",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "35--45",
                  "HighValueRef": "35--45",
                  "ShowIndex": 0.0,
                  "ValueRef": "35--45"
                },
                {
                  "CheckIndexName": "红细胞平均体积",
                  "CheckIndexCode": "1175",
                  "ResultValue": "90.4",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "82--100",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "82--100",
                  "HighValueRef": "82--100",
                  "ShowIndex": 0.0,
                  "ValueRef": "82--100"
                },
                {
                  "CheckIndexName": "平均血红蛋白量",
                  "CheckIndexCode": "1176",
                  "ResultValue": "29.4",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "27--34",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "27--34",
                  "HighValueRef": "27--34",
                  "ShowIndex": 0.0,
                  "ValueRef": "27--34"
                },
                {
                  "CheckIndexName": "平均血红蛋白浓度",
                  "CheckIndexCode": "1177",
                  "ResultValue": "325",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "316--354",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "316--354",
                  "HighValueRef": "316--354",
                  "ShowIndex": 0.0,
                  "ValueRef": "316--354"
                },
                {
                  "CheckIndexName": "红细胞分布宽度标准差",
                  "CheckIndexCode": "1178",
                  "ResultValue": "37.4",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "37--50",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "37--50",
                  "HighValueRef": "37--50",
                  "ShowIndex": 0.0,
                  "ValueRef": "37--50"
                },
                {
                  "CheckIndexName": "红细胞分布宽度变异系数",
                  "CheckIndexCode": "1179",
                  "ResultValue": "11.7",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "11.6--14.8",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "11.6--14.8",
                  "HighValueRef": "11.6--14.8",
                  "ShowIndex": 0.0,
                  "ValueRef": "11.6--14.8"
                },
                {
                  "CheckIndexName": "血小板",
                  "CheckIndexCode": "1180",
                  "ResultValue": "254",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "100--350",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "100--350",
                  "HighValueRef": "100--350",
                  "ShowIndex": 0.0,
                  "ValueRef": "100--350"
                },
                {
                  "CheckIndexName": "血小板压积",
                  "CheckIndexCode": "1181",
                  "ResultValue": "0.24",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "0.11--0.35",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "0.11--0.35",
                  "HighValueRef": "0.11--0.35",
                  "ShowIndex": 0.0,
                  "ValueRef": "0.11--0.35"
                },
                {
                  "CheckIndexName": "血小板分布宽度",
                  "CheckIndexCode": "1182",
                  "ResultValue": "10.2",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "9--17",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "9--17",
                  "HighValueRef": "9--17",
                  "ShowIndex": 0.0,
                  "ValueRef": "9--17"
                },
                {
                  "CheckIndexName": "平均血小板体积",
                  "CheckIndexCode": "1183",
                  "ResultValue": "9.4",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "9--13",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "9--13",
                  "HighValueRef": "9--13",
                  "ShowIndex": 0.0,
                  "ValueRef": "9--13"
                },
                {
                  "CheckIndexName": "大型血小板比率",
                  "CheckIndexCode": "1184",
                  "ResultValue": "21",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "15--45",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "15--45",
                  "HighValueRef": "15--45",
                  "ShowIndex": 0.0,
                  "ValueRef": "15--45"
                }
              ]
            },
            {
              "CheckItemName": "体检费",
              "CheckItemCode": "694",
              "DepartmentName": "",
              "SalePrice": "10",
              "CheckStateID": 0.0,
              "CheckUserName": "",
              "CheckResults": [

              ]
            },
            {
              "CheckItemName": "尿常规+沉渣",
              "CheckItemCode": "722",
              "DepartmentName": "检验科",
              "SalePrice": "22",
              "CheckStateID": 3.0,
              "CheckUserName": "王中全",
              "CheckResults": [
                {
                  "CheckIndexName": "隐血",
                  "CheckIndexCode": "1127",
                  "ResultValue": "－",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "阴性",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "阴性",
                  "HighValueRef": "阴性",
                  "ShowIndex": 0.0,
                  "ValueRef": "阴性"
                },
                {
                  "CheckIndexName": "胆红素",
                  "CheckIndexCode": "1128",
                  "ResultValue": "－",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "阴性",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "阴性",
                  "HighValueRef": "阴性",
                  "ShowIndex": 0.0,
                  "ValueRef": "阴性"
                },
                {
                  "CheckIndexName": "管型",
                  "CheckIndexCode": "1129",
                  "ResultValue": "0",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "0--2",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "0--2",
                  "HighValueRef": "0--2",
                  "ShowIndex": 0.0,
                  "ValueRef": "0--2"
                },
                {
                  "CheckIndexName": "管型（低倍视野）",
                  "CheckIndexCode": "1130",
                  "ResultValue": "0",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "0--6",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "0--6",
                  "HighValueRef": "0--6",
                  "ShowIndex": 0.0,
                  "ValueRef": "0--6"
                },
                {
                  "CheckIndexName": "电导率",
                  "CheckIndexCode": "1131",
                  "ResultValue": "25.5",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "5--38",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "5--38",
                  "HighValueRef": "5--38",
                  "ShowIndex": 0.0,
                  "ValueRef": "5--38"
                },
                {
                  "CheckIndexName": "电导率信息",
                  "CheckIndexCode": "1132",
                  "ResultValue": "3级",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "上皮细胞",
                  "CheckIndexCode": "1133",
                  "ResultValue": "6",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "0--40",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "0--40",
                  "HighValueRef": "0--40",
                  "ShowIndex": 0.0,
                  "ValueRef": "0--40"
                },
                {
                  "CheckIndexName": "上皮细胞(高倍视野)",
                  "CheckIndexCode": "1134",
                  "ResultValue": "1",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "0--8",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "0--8",
                  "HighValueRef": "0--8",
                  "ShowIndex": 0.0,
                  "ValueRef": "0--8"
                },
                {
                  "CheckIndexName": "葡萄糖",
                  "CheckIndexCode": "1135",
                  "ResultValue": "－",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "阴性",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "阴性",
                  "HighValueRef": "阴性",
                  "ShowIndex": 0.0,
                  "ValueRef": "阴性"
                },
                {
                  "CheckIndexName": "酮体",
                  "CheckIndexCode": "1136",
                  "ResultValue": "－",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "阴性",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "阴性",
                  "HighValueRef": "阴性",
                  "ShowIndex": 0.0,
                  "ValueRef": "阴性"
                },
                {
                  "CheckIndexName": "细菌",
                  "CheckIndexCode": "1138",
                  "ResultValue": "53",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "0--400",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "0--400",
                  "HighValueRef": "0--400",
                  "ShowIndex": 0.0,
                  "ValueRef": "0--400"
                },
                {
                  "CheckIndexName": "细菌(高倍视野)",
                  "CheckIndexCode": "1139",
                  "ResultValue": "0.5",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "0--10",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "0--10",
                  "HighValueRef": "0--10",
                  "ShowIndex": 0.0,
                  "ValueRef": "0--10"
                },
                {
                  "CheckIndexName": "尿胆原",
                  "CheckIndexCode": "1140",
                  "ResultValue": "－",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "阴性/弱阳性",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "阴性/弱阳性",
                  "HighValueRef": "阴性/弱阳性",
                  "ShowIndex": 0.0,
                  "ValueRef": "阴性/弱阳性"
                },
                {
                  "CheckIndexName": "尿路感染信息",
                  "CheckIndexCode": "1141",
                  "ResultValue": "未感染?",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "VC",
                  "CheckIndexCode": "1142",
                  "ResultValue": "0",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "阴性",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "阴性",
                  "HighValueRef": "阴性",
                  "ShowIndex": 0.0,
                  "ValueRef": "阴性"
                },
                {
                  "CheckIndexName": "白细胞",
                  "CheckIndexCode": "1143",
                  "ResultValue": "－",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "阴性",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "阴性",
                  "HighValueRef": "阴性",
                  "ShowIndex": 0.0,
                  "ValueRef": "阴性"
                },
                {
                  "CheckIndexName": "白细胞",
                  "CheckIndexCode": "1144",
                  "ResultValue": "10",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "0--36",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "0--36",
                  "HighValueRef": "0--36",
                  "ShowIndex": 0.0,
                  "ValueRef": "0--36"
                },
                {
                  "CheckIndexName": "白细胞(高倍视野)",
                  "CheckIndexCode": "1145",
                  "ResultValue": "2",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "0--7",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "0--7",
                  "HighValueRef": "0--7",
                  "ShowIndex": 0.0,
                  "ValueRef": "0--7"
                },
                {
                  "CheckIndexName": "结晶检查",
                  "CheckIndexCode": "1146",
                  "ResultValue": "0",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "0--10",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "0--10",
                  "HighValueRef": "0--10",
                  "ShowIndex": 0.0,
                  "ValueRef": "0--10"
                },
                {
                  "CheckIndexName": "类酵母菌",
                  "CheckIndexCode": "1147",
                  "ResultValue": "0",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "0--0",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "0--0",
                  "HighValueRef": "0--0",
                  "ShowIndex": 0.0,
                  "ValueRef": "0--0"
                },
                {
                  "CheckIndexName": "亚硝酸盐",
                  "CheckIndexCode": "1148",
                  "ResultValue": "－",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "阴性",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "阴性",
                  "HighValueRef": "阴性",
                  "ShowIndex": 0.0,
                  "ValueRef": "阴性"
                },
                {
                  "CheckIndexName": "病理管型检查",
                  "CheckIndexCode": "1149",
                  "ResultValue": "0",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "0--1",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "0--1",
                  "HighValueRef": "0--1",
                  "ShowIndex": 0.0,
                  "ValueRef": "0--1"
                },
                {
                  "CheckIndexName": "PH",
                  "CheckIndexCode": "1150",
                  "ResultValue": "5",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "4.6--8",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "4.6--8",
                  "HighValueRef": "4.6--8",
                  "ShowIndex": 0.0,
                  "ValueRef": "4.6--8"
                },
                {
                  "CheckIndexName": "尿蛋白",
                  "CheckIndexCode": "1151",
                  "ResultValue": "－",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "阴性",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "阴性",
                  "HighValueRef": "阴性",
                  "ShowIndex": 0.0,
                  "ValueRef": "阴性"
                },
                {
                  "CheckIndexName": "红细胞",
                  "CheckIndexCode": "1152",
                  "ResultValue": "6",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "0--27",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "0--27",
                  "HighValueRef": "0--27",
                  "ShowIndex": 0.0,
                  "ValueRef": "0--27"
                },
                {
                  "CheckIndexName": "红细胞信息",
                  "CheckIndexCode": "1153",
                  "ResultValue": "未分类",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "红细胞(高倍视野)",
                  "CheckIndexCode": "1154",
                  "ResultValue": "1",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "0--5",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "0--5",
                  "HighValueRef": "0--5",
                  "ShowIndex": 0.0,
                  "ValueRef": "0--5"
                },
                {
                  "CheckIndexName": "比重",
                  "CheckIndexCode": "1155",
                  "ResultValue": "<=1.005",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "1.015--1.025",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "1.015--1.025",
                  "HighValueRef": "1.015--1.025",
                  "ShowIndex": 0.0,
                  "ValueRef": "1.015--1.025"
                },
                {
                  "CheckIndexName": "小圆上皮细胞",
                  "CheckIndexCode": "1156",
                  "ResultValue": "0",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "粘液丝",
                  "CheckIndexCode": "1157",
                  "ResultValue": "0",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                }
              ]
            },
            {
              "CheckItemName": "甲胎蛋白定量",
              "CheckItemCode": "799",
              "DepartmentName": "检验科",
              "SalePrice": "55",
              "CheckStateID": 3.0,
              "CheckUserName": "王中全",
              "CheckResults": [
                {
                  "CheckIndexName": "AFP定量",
                  "CheckIndexCode": "1196",
                  "ResultValue": "2.19",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "IU/mL",
                  "TextRef": "0--5.5",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "0--5.5",
                  "HighValueRef": "0--5.5",
                  "ShowIndex": 0.0,
                  "ValueRef": "0--5.5"
                }
              ]
            },
            {
              "CheckItemName": "癌胚抗原定量",
              "CheckItemCode": "800",
              "DepartmentName": "检验科",
              "SalePrice": "55",
              "CheckStateID": 3.0,
              "CheckUserName": "王中全",
              "CheckResults": [
                {
                  "CheckIndexName": "CEA定量",
                  "CheckIndexCode": "95",
                  "ResultValue": "2.11",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "ng/ml",
                  "TextRef": "0--4",
                  "IsAbandon": false,
                  "ResultTypeID": 1.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "0--4",
                  "HighValueRef": "0--4",
                  "ShowIndex": 0.0,
                  "ValueRef": "0--4"
                }
              ]
            },
            {
              "CheckItemName": "彩超（腹部+妇科）",
              "CheckItemCode": "827",
              "DepartmentName": "彩超",
              "SalePrice": "160",
              "CheckStateID": 3.0,
              "CheckUserName": "汪慧卿",
              "CheckResults": [
                {
                  "CheckIndexName": "双肾",
                  "CheckIndexCode": "213",
                  "ResultValue": "未见明显异常",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "胰",
                  "CheckIndexCode": "313",
                  "ResultValue": "未见明显异常",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "脾",
                  "CheckIndexCode": "314",
                  "ResultValue": "未见明显异常",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "附件检查",
                  "CheckIndexCode": "323",
                  "ResultValue": "未见异常",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "子宫检查",
                  "CheckIndexCode": "382",
                  "ResultValue": "未见明显异常",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "肝",
                  "CheckIndexCode": "402",
                  "ResultValue": "未见明显异常",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "胆",
                  "CheckIndexCode": "403",
                  "ResultValue": "未见明显异常",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                }
              ]
            },
            {
              "CheckItemName": "体格检查（女）",
              "CheckItemCode": "854",
              "DepartmentName": "体格检查",
              "SalePrice": "0",
              "CheckStateID": 3.0,
              "CheckUserName": "王鑫",
              "CheckResults": [
                {
                  "CheckIndexName": "心界",
                  "CheckIndexCode": "226",
                  "ResultValue": "正常",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "神经系统",
                  "CheckIndexCode": "228",
                  "ResultValue": "未见异常",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "胸廓",
                  "CheckIndexCode": "229",
                  "ResultValue": "无畸形",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "心律",
                  "CheckIndexCode": "231",
                  "ResultValue": "整齐",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "杂音",
                  "CheckIndexCode": "232",
                  "ResultValue": "无",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "压痛",
                  "CheckIndexCode": "233",
                  "ResultValue": "无",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "肝脏",
                  "CheckIndexCode": "234",
                  "ResultValue": "未触及",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "脾脏",
                  "CheckIndexCode": "235",
                  "ResultValue": "未触及",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "肾脏",
                  "CheckIndexCode": "236",
                  "ResultValue": "无叩痛",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "肿块",
                  "CheckIndexCode": "237",
                  "ResultValue": "无",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "肺部",
                  "CheckIndexCode": "238",
                  "ResultValue": "未见异常",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "头颅",
                  "CheckIndexCode": "239",
                  "ResultValue": "未见异常",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "淋巴结",
                  "CheckIndexCode": "240",
                  "ResultValue": "未见异常",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "甲状腺",
                  "CheckIndexCode": "241",
                  "ResultValue": "未见异常",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "脊椎",
                  "CheckIndexCode": "242",
                  "ResultValue": "颈部疼痛、腰骶部疼痛",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 3.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "四肢",
                  "CheckIndexCode": "243",
                  "ResultValue": "未见异常",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "关节",
                  "CheckIndexCode": "244",
                  "ResultValue": "未见异常",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "疝",
                  "CheckIndexCode": "248",
                  "ResultValue": "无",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "皮肤",
                  "CheckIndexCode": "249",
                  "ResultValue": "未见异常",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "外周血管",
                  "CheckIndexCode": "250",
                  "ResultValue": "未见异常",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "其它",
                  "CheckIndexCode": "251",
                  "ResultValue": "",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "既往病史",
                  "CheckIndexCode": "388",
                  "ResultValue": "高血压病、高血脂",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 3.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "现病史",
                  "CheckIndexCode": "439",
                  "ResultValue": "",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                },
                {
                  "CheckIndexName": "心音",
                  "CheckIndexCode": "942",
                  "ResultValue": "正常",
                  "AppendInfo": "",
                  "IsCalc": false,
                  "Unit": "",
                  "TextRef": "",
                  "IsAbandon": false,
                  "ResultTypeID": 4.0,
                  "ResultFlagID": 1.0,
                  "LowValueRef": "",
                  "HighValueRef": "",
                  "ShowIndex": 0.0,
                  "ValueRef": ""
                }
              ]
            }
          ],
          "GeneralSummarys": [
            {
              "SummaryName": "颈椎退行性改变",
              "SummaryCode": "937",
              "SummaryDescription": "颈椎退行性改变是颈椎病发病的主要原因，其中椎间盘的退变尤为重要，是颈椎诸结构退变的首发因素。平日应注意加强项肌锻炼，自我按摩。请到骨外科咨询。\r\n",
              "ReviewAdvice": "",
              "IsPrivacy": false,
              "SummaryMedicalExplanation": null,
              "SummaryReasonResult": null,
              "SummaryAdvice": null,
              "F_Invisible": true
            },
            {
              "SummaryName": "腰骶部疼痛",
              "SummaryCode": "2450",
              "SummaryDescription": "腰骶部疼痛多指第四、五腰椎和第一骶椎疼痛，常见于腰椎间盘突出症、腰肌劳损、腰椎管狭窄症、腰椎滑脱等疾病。此外，腰骶部疼痛男性尚可见于慢性泌尿系感染、骶椎隐性裂等；女性尚可见于生殖系统疾病等。\r\n建议结合临床及病史，进一步检查以确诊，请到相关科室咨询就诊。\r\n",
              "ReviewAdvice": "",
              "IsPrivacy": false,
              "SummaryMedicalExplanation": null,
              "SummaryReasonResult": null,
              "SummaryAdvice": null,
              "F_Invisible": true
            },
            {
              "SummaryName": "T波改变",
              "SummaryCode": "793",
              "SummaryDescription": "需与临床资料结合考虑其意义。1、无心血管疾病者，如过度疲劳，精神紧张，睡眠不好等都可引起T波异常改变；2、年轻人多考虑心肌炎症（但是也要考虑到交感神经亢进因素）；3、老年人多考虑为心肌缺血（冠心病、高血压，还有老年人心肌细胞自身老化及心肌纤维化的退行性变）。您的情况还需结合临床，到心内科进一步咨询和诊治。\r\n",
              "ReviewAdvice": "",
              "IsPrivacy": false,
              "SummaryMedicalExplanation": null,
              "SummaryReasonResult": null,
              "SummaryAdvice": null,
              "F_Invisible": true
            },
            {
              "SummaryName": "甲状腺结节",
              "SummaryCode": "1686",
              "SummaryDescription": "【医学解释】\r\n　　甲状腺结节是指位于甲状腺内的肿块，可随吞咽动作而上下移动。一般无明显自觉症状，大部分是在体检时偶然发现。\r\n【常见原因】\r\n　　甲状腺结节是临床常见的病症，由多种病因引起，可见于结节性甲状腺肿、炎性结节、甲状腺囊肿、甲状腺肿瘤（包括甲状腺良性肿瘤、甲状腺癌及转移癌）、手术后或碘131治疗后甲状腺残余组织的瘢痕和增生等。甲状腺彩超作为首选检查方法，不仅能明确甲状腺结节的位置、大小、边界、回声、有无钙化，还可了解结节的血流供应情况。\r\n【健康建议】\r\n　　对于甲状腺结节，首要问题是判断其结节的良恶性。甲状腺结节以良性居多，有些甲状腺结节需要手术治疗。因此，发现甲状腺结节后，均需要到相关专科就诊咨询，行甲状腺功能测定等进一步检查，定期复查或积极治疗。\r\n　　若超声提示以下情况时，需提高警惕并积极就诊治疗：\r\n　　实性低回声结节；\r\n　　结节内血供丰富；\r\n　　结节形态和边缘不规则；\r\n　　微小钙化，针尖样或簇状分布的钙化；\r\n　　颈部淋巴结超声影像异常。\r\n　　请到甲状腺外科进一步咨询就诊，并定期复查。\r\n",
              "ReviewAdvice": "",
              "IsPrivacy": false,
              "SummaryMedicalExplanation": null,
              "SummaryReasonResult": null,
              "SummaryAdvice": null,
              "F_Invisible": true
            },
            {
              "SummaryName": "阴道潮红",
              "SummaryCode": "2331",
              "SummaryDescription": "请到妇科咨询、随诊，结合临床，定期复查。",
              "ReviewAdvice": "",
              "IsPrivacy": false,
              "SummaryMedicalExplanation": null,
              "SummaryReasonResult": null,
              "SummaryAdvice": null,
              "F_Invisible": true
            },
            {
              "SummaryName": "血糖高",
              "SummaryCode": "821",
              "SummaryDescription": "血糖是指血液中葡萄糖的浓度，空腹血糖≥7.0mmol/L应考虑糖尿病可能。生理性增高见于饭后及情绪紧张等。病理性增高见于糖尿病、脱水、感染等。一次检查发现血糖轻度增高，不一定有临床意义，应结合糖耐量测定或糖化血红蛋白测定及临床表现进行综合判断。建议到糖尿病科咨询、就诊，结合临床，进一步检查、诊断及治疗。您若有糖尿病史，请继续糖尿病治疗；否则请复查空腹及餐后2小时血糖等，内分泌科咨询，以排除糖尿病。\r\n",
              "ReviewAdvice": "",
              "IsPrivacy": false,
              "SummaryMedicalExplanation": null,
              "SummaryReasonResult": null,
              "SummaryAdvice": null,
              "F_Invisible": true
            },
            {
              "SummaryName": "甘油三酯增高",
              "SummaryCode": "833",
              "SummaryDescription": "考虑血脂异常，建议低动物脂肪、低糖饮食，控制食量；内科咨询，应用降脂药物，加强体育锻炼并定期复查。",
              "ReviewAdvice": "",
              "IsPrivacy": false,
              "SummaryMedicalExplanation": null,
              "SummaryReasonResult": null,
              "SummaryAdvice": null,
              "F_Invisible": true
            },
            {
              "SummaryName": "高血压1级(轻度)",
              "SummaryCode": "805",
              "SummaryDescription": "【医学解释】\r\n　　高血压定义为收缩压≥140mmHg和（或）舒张压≥90mmHg,是最常见的慢性病，也是心脑血管疾病最主要的危险因素，脑卒中、心肌梗死、心力衰竭及慢性肾脏病、眼底动脉硬化是其主要并发症。\r\n【常见病因】\r\n　　①遗传因素　高血压具有明显的家族聚集性，父母均有高血压，子女的发病概率将明显增高。\r\n　　②饮食  高盐、高蛋白质饮食、酗酒均属于升压因素。\r\n　　③精神压力  从事精神紧张度高的职业者发生高血压的可能性较大。\r\n　　④体重　超重或肥胖是血压升高的重要危险因素，肥胖的类型与高血压发生关系密切，腹型肥胖者容易发生高血压\r\n　　⑤其他如睡眠呼吸暂停综合征等亦与高血压升高有关。\r\n【健康建议】\r\n　　①控制体重：平衡膳食，不偏食，适当增加运动，每天锻炼（步行、打球、气功、太极拳、游泳等）30～60分钟，使体重指数（BMI）保持在20～24。\r\n　　②限盐：每日平均食盐量＜6g。\r\n　　③减少脂肪摄入：总脂肪应小于总热量摄入的25%，动物脂肪小于10%，新鲜蔬菜每日400～500g，水果100g，肉类50～100g，鱼虾类50g，蛋类每周3～4个，奶类或豆浆每日250g，每日食用油20～25g,少吃糖类和甜食。\r\n　　④不吸烟，限制饮酒，男性每天白酒不超过50ml（约1两，酒精含量＜30g），女性＜20g。\r\n　　⑤如合并睡眠呼吸暂停综合征等，建议积极治疗原发病。\r\n　　⑥心理平衡：自我调节，自我减压，保持乐观心态，提高应激能力和防病能力。选择适合自己的文体活动，增加社交机会，提高生活质量。\r\n　　对于非药物治疗3个月效果不佳、以及症状明显、有心脏、脑、肾、眼等靶器官损害者应及时心内科就诊，应用高血压药物正规治疗，并监测血压，定期体检。\r\n",
              "ReviewAdvice": "",
              "IsPrivacy": false,
              "SummaryMedicalExplanation": null,
              "SummaryReasonResult": null,
              "SummaryAdvice": null,
              "F_Invisible": true
            },
            {
              "SummaryName": "乳腺退化不良",
              "SummaryCode": "2558",
              "SummaryDescription": "乳腺组织在闭经前数年即开始萎缩，随着年龄增长，体内激素分泌减少，乳腺组织开始退化，建议每年定期做乳腺检查，动态观察，乳腺科随诊。\r\n\r\n",
              "ReviewAdvice": "",
              "IsPrivacy": false,
              "SummaryMedicalExplanation": null,
              "SummaryReasonResult": null,
              "SummaryAdvice": null,
              "F_Invisible": true
            },
            {
              "SummaryName": "肺纹理增多",
              "SummaryCode": "395",
              "SummaryDescription": "【医学解释】\r\n　　肺纹理是指胸部影像检查时看到的从肺门向肺野外围延伸的放射条状阴影。肺纹理增多或增重时，X线表现为肺纹理密度增高，增粗，走行紊乱，形态异常等。其原因既可以是生理性的，也可以是病理性的。必须结合临床病史分析。\r\n【常见原因】\r\n　　①血管性因素：肺纹理粗大，从肺门向肺内保持血管走行的特性，常伴有心脏增大的表现，主要见于风心病、先心病等。 \r\n　　②淋巴性因素：肺纹理在两肺内呈纤细的网状，常见于尘肺、癌性淋巴管炎等。 \r\n　　③支气管性因素：常见于慢性支气管炎、支气管扩张症、哮喘、长期吸烟者等。 \r\n　　④生理性因素：主要见于老年人和肥胖者。由于老年人肺间质相对较丰富，从而在X线胸片上显示肺纹理增多；后者是由于受检者体质肥胖，皮下脂肪增多，导致X线吸收增加，从而引起胸片上肺纹理增多的假象。\r\n【健康建议】\r\n　　肺纹理增多是一种放射常用术语，肺纹理增粗、紊乱可见于多种心肺或结缔组织疾病，诊断必须结合临床病史分析。一般说来，在除外生理性肺纹理增多的情况下，多见于支气管及肺部病变、职业病等。吸烟者建议戒烟，若长期并持续吸入过多的粉尘、烟雾等也会显示肺纹理增多、增粗、紊乱。必要时，请及时到医院呼吸科咨询、诊治，必要时行肺部ＣＴ等进一步检查。\r\n",
              "ReviewAdvice": "",
              "IsPrivacy": false,
              "SummaryMedicalExplanation": null,
              "SummaryReasonResult": null,
              "SummaryAdvice": null,
              "F_Invisible": true
            }
          ],
          "GeneralAdvices": [
            {
              "AdviceCode": 937.0,
              "AdviceName": "颈椎退行性改变",
              "AdviceDescription": "颈椎退行性改变是颈椎病发病的主要原因，其中椎间盘的退变尤为重要，是颈椎诸结构退变的首发因素。平日应注意加强项肌锻炼，自我按摩。请到骨外科咨询。\r\n",
              "IsPrivacy": "False",
              "ShowIndex": 1.0,
              "GeneralSummarys": null,
              "F_Invisible": true
            },
            {
              "AdviceCode": 2450.0,
              "AdviceName": "腰骶部疼痛",
              "AdviceDescription": "腰骶部疼痛多指第四、五腰椎和第一骶椎疼痛，常见于腰椎间盘突出症、腰肌劳损、腰椎管狭窄症、腰椎滑脱等疾病。此外，腰骶部疼痛男性尚可见于慢性泌尿系感染、骶椎隐性裂等；女性尚可见于生殖系统疾病等。\r\n建议结合临床及病史，进一步检查以确诊，请到相关科室咨询就诊。\r\n",
              "IsPrivacy": "False",
              "ShowIndex": 1.0,
              "GeneralSummarys": null,
              "F_Invisible": true
            },
            {
              "AdviceCode": 793.0,
              "AdviceName": "T波改变",
              "AdviceDescription": "需与临床资料结合考虑其意义。1、无心血管疾病者，如过度疲劳，精神紧张，睡眠不好等都可引起T波异常改变；2、年轻人多考虑心肌炎症（但是也要考虑到交感神经亢进因素）；3、老年人多考虑为心肌缺血（冠心病、高血压，还有老年人心肌细胞自身老化及心肌纤维化的退行性变）。您的情况还需结合临床，到心内科进一步咨询和诊治。\r\n",
              "IsPrivacy": "False",
              "ShowIndex": 1.0,
              "GeneralSummarys": null,
              "F_Invisible": true
            },
            {
              "AdviceCode": 1686.0,
              "AdviceName": "甲状腺结节",
              "AdviceDescription": "【医学解释】\r\n　　甲状腺结节是指位于甲状腺内的肿块，可随吞咽动作而上下移动。一般无明显自觉症状，大部分是在体检时偶然发现。\r\n【常见原因】\r\n　　甲状腺结节是临床常见的病症，由多种病因引起，可见于结节性甲状腺肿、炎性结节、甲状腺囊肿、甲状腺肿瘤（包括甲状腺良性肿瘤、甲状腺癌及转移癌）、手术后或碘131治疗后甲状腺残余组织的瘢痕和增生等。甲状腺彩超作为首选检查方法，不仅能明确甲状腺结节的位置、大小、边界、回声、有无钙化，还可了解结节的血流供应情况。\r\n【健康建议】\r\n　　对于甲状腺结节，首要问题是判断其结节的良恶性。甲状腺结节以良性居多，有些甲状腺结节需要手术治疗。因此，发现甲状腺结节后，均需要到相关专科就诊咨询，行甲状腺功能测定等进一步检查，定期复查或积极治疗。\r\n　　若超声提示以下情况时，需提高警惕并积极就诊治疗：\r\n　　实性低回声结节；\r\n　　结节内血供丰富；\r\n　　结节形态和边缘不规则；\r\n　　微小钙化，针尖样或簇状分布的钙化；\r\n　　颈部淋巴结超声影像异常。\r\n　　请到甲状腺外科进一步咨询就诊，并定期复查。\r\n",
              "IsPrivacy": "False",
              "ShowIndex": 1.0,
              "GeneralSummarys": null,
              "F_Invisible": true
            },
            {
              "AdviceCode": 2331.0,
              "AdviceName": "阴道潮红",
              "AdviceDescription": "请到妇科咨询、随诊，结合临床，定期复查。",
              "IsPrivacy": "False",
              "ShowIndex": 1.0,
              "GeneralSummarys": null,
              "F_Invisible": true
            },
            {
              "AdviceCode": 821.0,
              "AdviceName": "血糖高",
              "AdviceDescription": "血糖是指血液中葡萄糖的浓度，空腹血糖≥7.0mmol/L应考虑糖尿病可能。生理性增高见于饭后及情绪紧张等。病理性增高见于糖尿病、脱水、感染等。一次检查发现血糖轻度增高，不一定有临床意义，应结合糖耐量测定或糖化血红蛋白测定及临床表现进行综合判断。建议到糖尿病科咨询、就诊，结合临床，进一步检查、诊断及治疗。您若有糖尿病史，请继续糖尿病治疗；否则请复查空腹及餐后2小时血糖等，内分泌科咨询，以排除糖尿病。\r\n",
              "IsPrivacy": "False",
              "ShowIndex": 1.0,
              "GeneralSummarys": null,
              "F_Invisible": true
            },
            {
              "AdviceCode": 833.0,
              "AdviceName": "甘油三酯增高",
              "AdviceDescription": "考虑血脂异常，建议低动物脂肪、低糖饮食，控制食量；内科咨询，应用降脂药物，加强体育锻炼并定期复查。",
              "IsPrivacy": "False",
              "ShowIndex": 1.0,
              "GeneralSummarys": null,
              "F_Invisible": true
            },
            {
              "AdviceCode": 805.0,
              "AdviceName": "高血压1级(轻度)",
              "AdviceDescription": "【医学解释】\r\n　　高血压定义为收缩压≥140mmHg和（或）舒张压≥90mmHg,是最常见的慢性病，也是心脑血管疾病最主要的危险因素，脑卒中、心肌梗死、心力衰竭及慢性肾脏病、眼底动脉硬化是其主要并发症。\r\n【常见病因】\r\n　　①遗传因素　高血压具有明显的家族聚集性，父母均有高血压，子女的发病概率将明显增高。\r\n　　②饮食  高盐、高蛋白质饮食、酗酒均属于升压因素。\r\n　　③精神压力  从事精神紧张度高的职业者发生高血压的可能性较大。\r\n　　④体重　超重或肥胖是血压升高的重要危险因素，肥胖的类型与高血压发生关系密切，腹型肥胖者容易发生高血压\r\n　　⑤其他如睡眠呼吸暂停综合征等亦与高血压升高有关。\r\n【健康建议】\r\n　　①控制体重：平衡膳食，不偏食，适当增加运动，每天锻炼（步行、打球、气功、太极拳、游泳等）30～60分钟，使体重指数（BMI）保持在20～24。\r\n　　②限盐：每日平均食盐量＜6g。\r\n　　③减少脂肪摄入：总脂肪应小于总热量摄入的25%，动物脂肪小于10%，新鲜蔬菜每日400～500g，水果100g，肉类50～100g，鱼虾类50g，蛋类每周3～4个，奶类或豆浆每日250g，每日食用油20～25g,少吃糖类和甜食。\r\n　　④不吸烟，限制饮酒，男性每天白酒不超过50ml（约1两，酒精含量＜30g），女性＜20g。\r\n　　⑤如合并睡眠呼吸暂停综合征等，建议积极治疗原发病。\r\n　　⑥心理平衡：自我调节，自我减压，保持乐观心态，提高应激能力和防病能力。选择适合自己的文体活动，增加社交机会，提高生活质量。\r\n　　对于非药物治疗3个月效果不佳、以及症状明显、有心脏、脑、肾、眼等靶器官损害者应及时心内科就诊，应用高血压药物正规治疗，并监测血压，定期体检。\r\n",
              "IsPrivacy": "False",
              "ShowIndex": 1.0,
              "GeneralSummarys": null,
              "F_Invisible": true
            },
            {
              "AdviceCode": 2558.0,
              "AdviceName": "乳腺退化不良",
              "AdviceDescription": "乳腺组织在闭经前数年即开始萎缩，随着年龄增长，体内激素分泌减少，乳腺组织开始退化，建议每年定期做乳腺检查，动态观察，乳腺科随诊。\r\n\r\n",
              "IsPrivacy": "False",
              "ShowIndex": 1.0,
              "GeneralSummarys": null,
              "F_Invisible": true
            },
            {
              "AdviceCode": 395.0,
              "AdviceName": "肺纹理增多",
              "AdviceDescription": "【医学解释】\r\n　　肺纹理是指胸部影像检查时看到的从肺门向肺野外围延伸的放射条状阴影。肺纹理增多或增重时，X线表现为肺纹理密度增高，增粗，走行紊乱，形态异常等。其原因既可以是生理性的，也可以是病理性的。必须结合临床病史分析。\r\n【常见原因】\r\n　　①血管性因素：肺纹理粗大，从肺门向肺内保持血管走行的特性，常伴有心脏增大的表现，主要见于风心病、先心病等。 \r\n　　②淋巴性因素：肺纹理在两肺内呈纤细的网状，常见于尘肺、癌性淋巴管炎等。 \r\n　　③支气管性因素：常见于慢性支气管炎、支气管扩张症、哮喘、长期吸烟者等。 \r\n　　④生理性因素：主要见于老年人和肥胖者。由于老年人肺间质相对较丰富，从而在X线胸片上显示肺纹理增多；后者是由于受检者体质肥胖，皮下脂肪增多，导致X线吸收增加，从而引起胸片上肺纹理增多的假象。\r\n【健康建议】\r\n　　肺纹理增多是一种放射常用术语，肺纹理增粗、紊乱可见于多种心肺或结缔组织疾病，诊断必须结合临床病史分析。一般说来，在除外生理性肺纹理增多的情况下，多见于支气管及肺部病变、职业病等。吸烟者建议戒烟，若长期并持续吸入过多的粉尘、烟雾等也会显示肺纹理增多、增粗、紊乱。必要时，请及时到医院呼吸科咨询、诊治，必要时行肺部ＣＴ等进一步检查。\r\n",
              "IsPrivacy": "False",
              "ShowIndex": 1.0,
              "GeneralSummarys": null,
              "F_Invisible": true
            }
          ]
        },
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
        deatilSon: {},//子订单--订单详情
        customerSonDetail: {},//子订单带过来的信息
        refundDetail:{},
        checkedId: null,//子订单ID
        isShowReport:false,//是否显示体检报告
        isRefundDetail:false,//退款详情是否显示
      }
    },
    created() {
      this.customerSonDetail = this.$route.params.val;
      this.checkedId = this.$route.params.val.orderCode;
      this.getDetail();
      console.log(this.$route.params.val)
    },
    methods: {
      getDetail() {
        let data = this.checkedId;
        console.log(data);
        api.cspOrderInfo1(data).then((res) => {
          if (res.code === 1) {
            this.deatilSon = res.data;
          } else {
            alert(res.msg);
          }
        })
/*        api.cspOrderInfo1(data).then((res) => {
          if (res.code === 1) {
            this.deatilSon = res.data;
          } else {
            alert(res.msg);
          }
        })*/
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
      showReportFn(){
        this.isShowReport=true;

        console.log(this.isShowReport)
      },
      //点击显示退款详情
      _goDetail(val){
        this.refundDetail=val;
        this.isRefundDetail=true;
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
