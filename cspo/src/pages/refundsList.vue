<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">

      <!--退款列表-->
      <div class="refuse-lists-container">
        <el-form :inline="true" :model="searchParams" class="demo-form-inline">
          <el-form-item label="姓名">
            <el-input v-model="searchParams.customerName" placeholder="姓名"></el-input>
          </el-form-item>

          <el-form-item label="手机号">
            <el-input v-model="searchParams.customerMobile" placeholder="手机号"></el-input>
          </el-form-item>

          <el-form-item label="订单号">
            <el-input v-model="searchParams.tradeCode" placeholder="订单号"></el-input>

          </el-form-item>
          <el-form-item label="服务医生">
            <el-input v-model="searchParams.doctorName" placeholder="服务医生"></el-input>

          </el-form-item>

          <el-form-item label="机构">
            <el-select v-model="searchParams.institutionName" clearable placeholder="请选择所属机构">
              <el-option v-for="item in getInstitutionArr" :key="item.institutionId" :label="item.institutionName" :value="item.institutionId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="服务名称">
            <el-select v-model="searchParams.institutionId" clearable placeholder="请选择所属机构">
              <el-option v-for="item in getInstitutionArr" :key="item.institutionId" :label="item.institutionName" :value="item.institutionId"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="时间">
            <el-date-picker
              v-model="rangeTime"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="_doSearch">查询</el-button>
          </el-form-item>
        </el-form>

        <!--tab nav-->
        <el-tabs v-model="tabIndex">
          <el-tab-pane label="全部" name="null"></el-tab-pane>
          <el-tab-pane label="待认证" name="1"></el-tab-pane>
          <el-tab-pane label="已认证" name="2"></el-tab-pane>
          <el-tab-pane label="取消认证" name="3"></el-tab-pane>
          <el-tab-pane label="拒绝认证" name="4"></el-tab-pane>
        </el-tabs>



        <!--table 表单开始-->
        <el-table
          :data="refuseList"
          border
          style="width: 100%">
          <el-table-column prop="" label="序号"  width="100"></el-table-column>
          <el-table-column prop="tradeCode" label="订单编号"></el-table-column>
          <el-table-column prop="refundCode" label="退款编号"></el-table-column>
          <el-table-column prop="userName" label="客户姓名"></el-table-column>
          <el-table-column prop="userPhone" label="注册手机号"></el-table-column>
          <el-table-column prop="goodsName" label="服务名称"></el-table-column>
          <el-table-column prop="institutionName" label="服务机构"></el-table-column>
          <el-table-column prop="goodsAmount" label="订单金额"></el-table-column>
          <el-table-column prop="refundAmount" label="退款金额"></el-table-column>
          <el-table-column prop="createTime" label="申请时间"></el-table-column>

          <el-table-column prop="authenticationStatus" label="退款状态" width="100">
            <template slot-scope="scope">
              <el-tag type="info" v-if="scope.row.refundStatus===1">待处理</el-tag>
              <el-tag type="success" v-if="scope.row.refundStatus===2">退款中</el-tag>
              <el-tag type="warning" v-if="scope.row.refundStatus===3">退款成功</el-tag>
              <el-tag type="danger" v-if="scope.row.refundStatus===4">退款失败</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button v-if="scope.row.refundStatus==0" size="mini" type="primary" @click="agreeApply(scope.row,scope.$index )">审核</el-button>
              <el-button v-if="scope.row.authenticationStatus==1 || scope.row.authenticationStatus==2 || scope.row.authenticationStatus==3" size="mini" type="primary" @click="agreeApply(scope.row,scope.$index )">审核</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--table 表单结束-->







      </div>

      <!--退款详请-->
      <div class="detail-container">




      </div>





    </div>
  </div>

</template>


<script>

import headerTop from '@/components/headTop.vue';
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      tabIndex:'null',//状态index

      rangeTime:"",//时间range
      searchParams: {
        customerMobile: "",//手机号
        customerName: "",//姓名
        doctorName: "",//医生姓名
        startTime: "",
        endTime: "",
        institutionName: "",//机构名称
        limit: 10,
        page: 1,
        serviceId: "",//服务名称的id
        refundStatus: "",//服务状态
        tradeCode: ""//订单号
      },

      //退款列表
      refuseList:[
        {allDiscountAmount: 0,approvalTime: null, checkUnitCode: null, createTime: "2018-07-06 17:20:17", cspOrderId: "2c8080aa6468a07e01646ee4055d00b5", discountAmount: 0, doctorName: "左丽红-河南省直三院", goodsAmount: 0.01, goodsName: "图文咨询", healthDoctorName: null, insOrderRefundId: "2c8080aa6468a07e01646ee45e9100b8", institutionName: "河南省直三院", orderCode: "20180706171954132971_01", payChannel: 1, refundAmount: 0.01, refundCode: "20180706172017134613", refundReason: "啦啦啦啦啦啦啦啦", refundRemark: "线上退款", refundStatus: 3, refuseReason: "kkkk ", thirdTradeNo: "2018070621001004540558476804", totalPrice: 0.01, tradeCode: "20180706171954132971", userName: "左丽红", userPhone: "17740877130", workNo: null},
        {allDiscountAmount: 0,approvalTime: null, checkUnitCode: null, createTime: "2018-07-06 17:20:17", cspOrderId: "2c8080aa6468a07e01646ee4055d00b5", discountAmount: 0, doctorName: "左丽红-河南省直三院", goodsAmount: 0.01, goodsName: "图文咨询", healthDoctorName: null, insOrderRefundId: "2c8080aa6468a07e01646ee45e9100b8", institutionName: "河南省直三院", orderCode: "20180706171954132971_01", payChannel: 1, refundAmount: 0.01, refundCode: "20180706172017134613", refundReason: "啦啦啦啦啦啦啦啦", refundRemark: "线上退款", refundStatus: 3, refuseReason: "kkkk ", thirdTradeNo: "2018070621001004540558476804", totalPrice: 0.01, tradeCode: "20180706171954132971", userName: "左丽红", userPhone: "17740877130", workNo: null},
      ]
    }
  },

  components:{
    headerTop
  },


  computed:{
    ...mapGetters(['getInstitutionArr'])
  },

  methods:{

    //搜索
    _doSearch(){


    }

  },


  created(){



  }





}
</script>

<style lang="less" scoped>

</style>
