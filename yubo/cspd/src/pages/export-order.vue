<template>
  <div>
    <el-form :inline="true" :model="searchParams" class="demo-form-inline">
      <el-form-item label="名称">
        <el-input placeholder="客户名称" v-model="searchParams.realName"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input placeholder="手机号" v-model="searchParams.mobile"></el-input>
      </el-form-item>
      <el-form-item label="商品名">
        <el-input placeholder="商品名" v-model="searchParams.goodsName"></el-input>
      </el-form-item>
      <el-form-item label="医生名">
        <el-input placeholder="医生名" v-model="searchParams.doctorName"></el-input>
      </el-form-item>
      <el-form-item label="订单号">
        <el-input placeholder="订单号" v-model="searchParams.orderCode"></el-input>
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
        <el-button type="primary" @click="doSearch">查询</el-button>
        <el-button type="primary" @click="resetParams">清空</el-button>
        <el-button type="primary" @click="exportOrder">导出Excel</el-button>
      </el-form-item>
    </el-form>
    <!--tab-->

<!--

    <el-tabs v-model="searchParams.itemType" @tab-click="tabCheck" v-if="tabList">
      <el-tab-pane v-for="item of tabList" :label="item.name" :name="item.type" :key="item.type"></el-tab-pane>
    </el-tabs>
-->


    <!--table 表单开始-->
    <el-table
      :data="orderLists"
      border
      style="width: 100%">
      <el-table-column show-overflow-tooltip prop="" label="序号"  width="50" type="index"></el-table-column>
      <el-table-column show-overflow-tooltip prop="orderCode" label="订单编号"></el-table-column>
      <el-table-column show-overflow-tooltip prop="createTime" label="下单时间"></el-table-column>
      <el-table-column show-overflow-tooltip prop="realName" label="客户名称"></el-table-column>
      <el-table-column show-overflow-tooltip prop="mobile" label="手机号"></el-table-column>
      <el-table-column show-overflow-tooltip prop="itemName" label="商品名称"></el-table-column>
      <el-table-column show-overflow-tooltip prop="name" label="绑定医生"></el-table-column>
      <el-table-column show-overflow-tooltip prop="originPrice" label="商品金额" align="center"></el-table-column>
      <el-table-column show-overflow-tooltip prop="preferentialPrice" label="优惠金额" align="center"></el-table-column>
      <el-table-column show-overflow-tooltip prop="orderPrice" label="订单金额"></el-table-column>
      <el-table-column show-overflow-tooltip prop="doctorOwnMoney" label="医生所得金额"></el-table-column>

      <el-table-column label="订单状态" align="center">
        <template slot-scope="scope">
          <el-tag type="warning" size="medium" v-show="scope.row.orderStatus===0">待付款</el-tag>
          <el-tag type="info" size="medium" v-show="scope.row.orderStatus===1">已取消</el-tag>
          <el-tag type="success" size="medium" v-show="scope.row.orderStatus===2">已付款</el-tag>
          <el-tag size="success" v-show="scope.row.orderStatus===3">已完成</el-tag>
          <el-tag size="medium" v-show="scope.row.orderStatus===4">退款待处理</el-tag>
          <el-tag size="medium" v-show="scope.row.orderStatus===5">退款中</el-tag>
          <el-tag size="danger" v-show="scope.row.orderStatus===6">退款成功</el-tag>
        </template>
      </el-table-column>

    </el-table>
    <!--table 表单结束-->
    <div class="self-page-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchParams.currentPage" :page-sizes="[10,20]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </div>

  </div>
</template>
<script>
  import {getStore,EncodeDoctorId} from "@/config/mUtils.js";
  import {ERR_OK, getSpeOrder} from '@/api/api';
  import {API_EXPORT_EXCEL} from '@/config/env'

  export default {
    name:'export_order',
    data(){
      return{
        isShowReport:false,//是否显示体检报告
        rangeTime:"",//时间范围段
        totalCount:0,
        tabList:[
          {type:10000,name:"一元听"},
          {type:20,name:"电话报告解读"},
          {type:10,name:"图文咨询"}
        ],
        searchParams:{
          startTime:"",//开始时间
          endTime:"",//结束时间
          realName:"",//客户名称
          mobile:"",//手机号
          orderCode:"",//订单号
          goodsName:"",//商品名称
          doctorName:"",//医生名称
          itemType:"",//订单分类
          currentPage:1,
          pageSize:10
        },

        //列表数据
        orderLists:[],
      }
    },








    methods:{
      //请求列表数据
      getDataList:function () {
        if(this.rangeTime){
          this.searchParams.startTime=this.rangeTime[0]+ ' 00:00:00';
          this.searchParams.endTime=this.rangeTime[1]+ ' 23:59:59';
        }else{
          this.searchParams.startTime="";
          this.searchParams.endTime="";
        }

        let params={
          currentPage:this.searchParams.currentPage,
          doctorName:this.searchParams.doctorName,
          endTime:this.searchParams.endTime,
          itemName:this.searchParams.goodsName,
          itemType:this.searchParams.itemType,
          mobile:this.searchParams.mobile,
          orderCode:this.searchParams.orderCode,
          pageSize: this.searchParams.pageSize,
          realName: this.searchParams.realName,
          startTime: this.searchParams.startTime,
        };
        getSpeOrder(params).then(res => {
          if(res.code===ERR_OK){
            this.orderLists=res.data.list;
            this.totalCount=res.data.totalCount;
          }else{
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        }).catch(err => {
          this.$alert(err.msg, '提示', {
            confirmButtonText: '确定',
          })
        });
      },

      exportOrder(){
        let listMsg = this.orderLists;
        let params = {
          realName: this.searchParams.realName || '',
          mobile: this.searchParams.mobile || '',
          orderCode: this.searchParams.orderCode || '',
          itemName: this.searchParams.goodsName || '',
          itemType: this.searchParams.itemType || '',
          startTime: this.searchParams.startTime || '',
          endTime: this.searchParams.endTime || '',
          doctorName: this.searchParams.doctorName || '',
        };
        let paramString =
          'realName=' + params.realName +
          '&mobile=' + params.mobile +
          '&orderCode=' + params.orderCode +
          '&itemName=' + params.itemName +
          '&itemType=' + params.itemType +
          '&startTime=' + params.startTime+
          '&doctorName=' + params.doctorName +
          '&endTime=' + params.endTime;
        var url = API_EXPORT_EXCEL +'?'+ paramString.toString();
        if (listMsg.length > 0) {
          window.open(url);
        } else {
          this.$alert('暂无数据导出', '提示')
        }
      },


      tabCheck(){


      },


      doSearch(){
        this.searchParams.currentPage = 1;
        this.getDataList();
      },
      resetParams(){
        this.searchParams.startTime="";
        this.searchParams.endTime="";
        this.rangeTime="";
        this.searchParams.realName="";
        this.searchParams.mobile="";
        this.searchParams.orderCode="";
        this.searchParams.goodsName="";
        this.searchParams.itemType="";
        this.searchParams.doctorName="";
      },
      handleSizeChange(val){
        this.searchParams.pageSize=val;
        this.getDataList();
      },
      handleCurrentChange(val){
        this.searchParams.currentPage=val;
        this.getDataList();
      },
    },

    activated(){
      this.getDataList()
    },
    filters:{
      sliceString(val){
        if(val){
          return val.slice(5,16)
        }else{
          return ""
        }
      }
    }
  }

</script>
<style scoped lang="less">
  .self-page-container {text-align: center;padding: 15px;}
</style>
