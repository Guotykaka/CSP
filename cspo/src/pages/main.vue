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
            <span class="secondary-color">截止2018.07.10 14:52</span>
            <strong class="main-color"> 38 人</strong>
            <el-button style="float: right; padding: 3px 0" type="text" @click="toIdentification">更多</el-button>
          </p>
        </div>
        <!--table 表单开始-->
        <el-table
          :data="doctorList"
          border
          style="width: 100%">
          <el-table-column prop="name" label="医生姓名"></el-table-column>
          <el-table-column prop="instituionName" label="机构名称"></el-table-column>
          <el-table-column prop="authenticationTime" label="申请时间"></el-table-column>
          <el-table-column label="状态" width="100">
            <template slot-scope="scope">
              <el-tag type="success">认证中</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <!--table 表单结束-->
      </el-card>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <strong class="blue-text" style="display: block;margin-bottom: 10px">交易</strong>
          <p class="card-addtion">
            <span class="secondary-color">截止2018.07.10 14:52</span>
            <strong class="main-color">当月订单总数：133单 </strong>
            <strong class="main-color">退款单总数：11单 </strong>
            <el-button style="float: right; padding: 3px 0" type="text" @click="toRefuseList">更多</el-button>
          </p>
        </div>
        <!--table 表单开始-->
        <el-table
          :data="tradeOrderList"
          border
          style="width: 100%">
          <el-table-column prop="orderCode" label="退款订单编号"></el-table-column>
          <el-table-column prop="doctorName" label="服务医生"></el-table-column>
          <el-table-column prop="institutionName" label="医疗机构"></el-table-column>
          <el-table-column prop="goodsName" label="服务项目"></el-table-column>
          <el-table-column prop="createTime" label="退款时间"></el-table-column>
          <el-table-column label="状态" width="100">
            <template slot-scope="scope">
              <el-tag type="success">待审核</el-tag>
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



export default {
  data() {
    return {
      announceText:"公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容",
      doctorList:[
        {authenticationRefuseReason:null,creatTime:"2018-06-20 09:41:06",institutionId:"2c8080aa642067460164206746b20000",instituionName:"包头中心医院",name:"sai test",roleName:"医生角色",updateTime:null,sort:1,insDoctorId:"2c8080aa64161c93016416d218ad0023",authenticationTime:"2018-06-20 09:41:06",userId:284,authenticationStatus:1},
        {authenticationRefuseReason:null,creatTime:"2018-06-19 17:28:16",institutionId:"2c8080aa64010b680164010b68a20000",instituionName:"株洲市中心医院",name:"袁医生",roleName:"医生角色",updateTime:null,"sort":1,insDoctorId:"2c8080aa64161c93016416ba0ab40021",authenticationTime:"2018-06-19 17:28:16",userId:283,authenticationStatus:1},
        {authenticationRefuseReason:null,creatTime:"2018-05-25 11:55:12",institutionId:null,instituionName:null,name:"1",roleName:"医生角色",updateTime:"2018-05-23 14:24:29",sort:3,insDoctorId:"00000000638b8b5101638c68cb60003b",authenticationTime:"2018-05-25 11:55:12",userId:209,authenticationStatus:1},
        {authenticationRefuseReason:null,creatTime:"2018-05-24 14:50:09",institutionId:null,instituionName:null,name:"王小二",roleName:"医生角色",updateTime:"2018-05-23 14:24:29",sort:2,insDoctorId:"8ab2b2fb6387582b01638799f1c10002",authenticationTime:"2018-05-24 14:50:09",userId:198,authenticationStatus:1}
      ],
      tradeOrderList:[
        {"tradeCode":"20180705151459062379","insOrderRefundId":"2c8080aa6468a07e0164694c9b490037","orderCode":"20180705151459062379_01","refundCode":"20180705151625717886","cspOrderId":"2c8080aa6468a07e0164694b4d050034","userName":"左丽红","userPhone":"17740877130","institutionName":"河南省直三院","goodsName":"图文咨询","goodsAmount":0.01,"refundAmount":0.01,"createTime":"2018-07-05 15:16:25","refundStatus":0,"refuseReason":null,"approvalTime":null,"refundReason":"哈哈哈呵呵叫姐姐","refundRemark":"线上退款","doctorName":"左丽红-河南省直三院","healthDoctorName":null,"checkUnitCode":null,"workNo":null,"thirdTradeNo":"2018070521001004540554552268","totalPrice":0.01,"discountAmount":0.0,"allDiscountAmount":0.0,"payChannel":1},
        {"tradeCode":"20180705150844938906","insOrderRefundId":"2c8080aa6468a07e0164694693fb002e","orderCode":"20180705150844938906_01","refundCode":"20180705150950901288","cspOrderId":"2c8080aa6468a07e0164694590ff002b","userName":"zuolih","userPhone":"17740877123","institutionName":"河南省直三院","goodsName":"图文咨询","goodsAmount":0.01,"refundAmount":0.01,"createTime":"2018-07-05 15:09:50","refundStatus":0,"refuseReason":null,"approvalTime":null,"refundReason":"刚刚刚刚刚刚把哈哈","refundRemark":"线上退款","doctorName":"左丽红-河南省直三院","healthDoctorName":null,"checkUnitCode":null,"workNo":null,"thirdTradeNo":"2018070521001004540554328442","totalPrice":0.01,"discountAmount":0.0,"allDiscountAmount":0.0,"payChannel":1},
        {"tradeCode":"20180705105152249689","insOrderRefundId":"2c8080aa64683a7b0164685ac0160032","orderCode":"20180705105152249689_01","refundCode":"20180705105215461736","cspOrderId":"2c8080aa64683a7b0164685a676b002f","userName":"6132","userPhone":"17680326132","institutionName":"上海天意达公司","goodsName":"图文咨询","goodsAmount":0.01,"refundAmount":0.01,"createTime":"2018-07-05 10:52:15","refundStatus":0,"refuseReason":null,"approvalTime":null,"refundReason":"不甩你","refundRemark":"线上退款","doctorName":"huihui","healthDoctorName":null,"checkUnitCode":null,"workNo":null,"thirdTradeNo":"4200000120201807055095954148","totalPrice":0.01,"discountAmount":0.0,"allDiscountAmount":0.0,"payChannel":2},
        {"tradeCode":"20180704184102373478","insOrderRefundId":"2c8080aa64636397016464e2752900ac","orderCode":"20180704184102373478_01","refundCode":"20180704184200285005","cspOrderId":"2c8080aa64636397016464e195f900a9","userName":"TTTzzz","userPhone":"13916513877","institutionName":"包头中心医院","goodsName":"电话报告解读","goodsAmount":0.01,"refundAmount":0.01,"createTime":"2018-07-04 18:42:00","refundStatus":0,"refuseReason":null,"approvalTime":null,"refundReason":"逗你的呢；","refundRemark":"线上退款","doctorName":"saitest2","healthDoctorName":null,"checkUnitCode":"sta2015","workNo":"00291210","thirdTradeNo":"2018070421001004030512094116","totalPrice":0.01,"discountAmount":0.0,"allDiscountAmount":0.0,"payChannel":1},
        {"tradeCode":"20180702135905533125","insOrderRefundId":"2c8080aa64591d2101645a5113940189","orderCode":"20180702135905533125_01","refundCode":"20180702172700193040","cspOrderId":"2c8080aa64591d2101645992bb45005c","userName":"6041","userPhone":"13761516041","institutionName":"上海天意达公司","goodsName":"电话报告解读","goodsAmount":0.01,"refundAmount":0.01,"createTime":"2018-07-02 17:27:00","refundStatus":0,"refuseReason":null,"approvalTime":null,"refundReason":"哈哈哈哈哈哈哈哈哈","refundRemark":"线上退款","doctorName":"testdoctor","healthDoctorName":null,"checkUnitCode":"mid001","workNo":"1704120001","thirdTradeNo":"2018070221001004280541759379","totalPrice":0.01,"discountAmount":0.0,"allDiscountAmount":0.0,"payChannel":1}
      ]

  }
  },

  components:{
    headerTop,
  },

  computed:{
    ...mapGetters(['getInstitutionArr'])
  },

  methods:{


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
    }









  },







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
