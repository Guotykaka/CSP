<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <!--退款列表-->
      <el-form :inline="true" :model="searchParams" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input v-model="searchParams.customerName" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchParams.customerMobile" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="searchParams.orderCode" placeholder="订单号"></el-input>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="searchParams.itemName" placeholder="商品名称"></el-input>
        </el-form-item>
        <!--        <el-form-item label="机构">
                  <el-autocomplete
                    popper-class="my-autocomplete"
                    v-model="searchParams.institutionName"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入内容"
                    @select="handleSelect">
                    <template slot-scope="{ item }">
                      <div class="name">{{ item.institutionName }}</div>
                    </template>
                  </el-autocomplete>
                </el-form-item>
                <el-form-item label="服务名称">
                  <el-select v-model="searchParams.serviceId" clearable placeholder="请选择服务">
                    <el-option v-for="item in serviceList" :key="item.dictId" :label="item.dictName" :value="item.dictCode"></el-option>
                  </el-select>
                </el-form-item>-->
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
          <el-button type="primary" @click="reset">清空</el-button>
          <el-button type="primary" @click="exportExcel">导出Excel</el-button>
        </el-form-item>
      </el-form>
      <!--tab nav-->
      <el-tabs v-model="tabIndex">
        <el-tab-pane label="全部" name="null"></el-tab-pane>
        <el-tab-pane label="待处理" name="0"></el-tab-pane>
        <el-tab-pane label="退款中" name="1"></el-tab-pane>
        <el-tab-pane label="退款成功" name="2"></el-tab-pane>
        <el-tab-pane label="退款失败" name="3"></el-tab-pane>
      </el-tabs>
      <!--table 表单开始-->
      <el-table
        :data="refuseList"
        border
        style="width: 100%">
        <el-table-column show-overflow-tooltip align="center" prop="" label="序号" width="60" type="index"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="orderCode" label="订单号" width="250"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="refundCode" label="退款编号" width="250"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="realName" label="客户姓名"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="mobile" label="注册手机号"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="itemName" label="商品名称"></el-table-column>
        <!--<el-table-column show-overflow-tooltip prop="institutionName" label="服务机构"></el-table-column>-->
        <el-table-column show-overflow-tooltip prop="originPrice" label="商品金额" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="preferentialPrice" label="优惠金额" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="orderPrice" label="订单金额"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="refundAmount" label="退款金额"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="createTime" label="申请时间"></el-table-column>
        <el-table-column align="center" prop="authenticationStatus" label="退款状态" width="100">
          <template slot-scope="scope">
            <el-tag type="warning" v-if="scope.row.refundStatus===0">待处理</el-tag>
            <el-tag type="success" v-if="scope.row.refundStatus===1">退款中</el-tag>
            <el-tag type="success" v-if="scope.row.refundStatus===2">退款成功</el-tag>
            <el-tag type="danger" v-if="scope.row.refundStatus===3">退款失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="scope.row.refundStatus==0" size="mini" type="primary" @click="checkDetail(scope.row)">审核
            </el-button>
            <el-button v-if="scope.row.refundStatus==1 || scope.row.refundStatus==2 || scope.row.refundStatus==3"
                       size="mini" type="primary" @click="checkDetail(scope.row)">查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--table 表单结束-->
      <div class="self-page-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="searchParams.page" :page-sizes="[10,20]" :page-size="searchParams.limit"
                       layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import headerTop from '@/components/headTop.vue';
  import {baseUrl} from '@/config/env.js'
  import {mapGetters,mapMutations} from "vuex";
  import {ERR_OK, getOrderRefundList} from "@/api/api.js";

  export default {
    data() {
      return {
        //报告详情数据
        totalCount: 0,
        tabIndex: 'null',//状态index
        rangeTime: "",//时间range
        searchParams: {
          startTime: "",
          endTime: "",
          customerMobile: "",//手机号
          customerName: "",//姓名
          itemName: "",//商品名称
          pageSize: 10,
          page: 1,
          orderCode: "",//订单号
          refundStatus: null
        },
        //退款列表
        refuseList: [],
        //服务名称列表
        // serviceList: [
        //   {"dictId": 10, "dictCode": "8ab2b2f563822d260163822d26fd0000", "dictName": "图文咨询"},
        //   {"dictId": 20, "dictCode": "8ab2b2f56381c35a016381c35a400000", "dictName": "电话报告解读"}
        // ]
      }
    },
    components: {
      headerTop
    },
    computed: {
      ...mapGetters(['getInstitutionArr'])
    },
    methods: {
      /*...mapMutations([
        'setRefuseInfo',
      ]),*/
      //自带搜索组件选中//自带搜索组件搜索
/*      handleSelect(item) {
        this.searchParams.institutionName = item.institutionName
      },*/
/*      querySearch(queryString, cb) {
        var institutions = this.getInstitutionArr;
        var results = queryString ? institutions.filter(this.createFilter(queryString)) : institutions;
        cb(results);
      },*/
/*      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.institutionName.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
        };
      },*/
      //搜索
      doSearch() {
        this.searchParams.page = 1;
        this.getRefuseList();
      },
      //重置
      reset() {
        this.searchParams.startTime = "";
        this.searchParams.endTime = "";
        this.searchParams.customerMobile = "";//手机号
        this.searchParams.customerName = "";//姓名
        this.searchParams.itemName = "" ;//商品名称
        this.searchParams.pageSize = 10;
        this.searchParams.page = 1;
        this.searchParams.orderCode = "";//订单号
        this.rangeTime = "";
      },
      //导出表格
      exportExcel: function () {
        this.searchParams.startTime = this.rangeTime ? this.rangeTime[0]+' 00:00:00' : "";
        this.searchParams.endTime = this.rangeTime ? this.rangeTime[1] +' 23:59:59': "";
        let refundStatus = this.searchParams.refundStatus ? this.searchParams.refundStatus : '';
        var paramString =
          'customerMobile=' + this.searchParams.customerMobile +
          '&customerName=' + this.searchParams.customerName +
          '&itemName=' + this.searchParams.itemName +
          '&startTime=' + this.searchParams.startTime +
          '&endTime=' + this.searchParams.endTime +
          '&refundStatus=' + refundStatus +
          '&orderCode=' + this.searchParams.orderCode;
        var url = baseUrl + "orderRefund/exportOrderRefund?" + paramString.toString();
        window.open(url);
      },
      //点击查看
      checkDetail: function (item) {
        //this.setRefuseInfo(item);
        let reportId = item.orderRefundId;
        this.$router.push({path: `/refundsInfo/${reportId}`})
      },
      //获取列表数据
      getRefuseList() {
        this.searchParams.startTime = this.rangeTime ? this.rangeTime[0]+' 00:00:00' : "";
        this.searchParams.endTime = this.rangeTime ? this.rangeTime[1]+' 23:59:59' : "";
        let params = {
          currentPage: this.searchParams.page,
          customerMobile: this.searchParams.customerMobile,
          customerName: this.searchParams.customerName,
          itemName: this.searchParams.itemName,
          pageSize: this.searchParams.pageSize,
          startTime: this.searchParams.startTime,
          endTime: this.searchParams.endTime,
          orderCode: this.searchParams.orderCode,
          refundStatus: this.searchParams.refundStatus
        };
        getOrderRefundList(params).then(res => {
          if (res.code === ERR_OK) {
            this.refuseList = res.data.list;
            this.totalCount = res.data.totalCount;
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试');
        })
      },
      /*改变页面条数*/
      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this.getRefuseList()
      },
      /*改变当前页*/
      handleCurrentChange(val) {
        this.searchParams.page = val;
        this.getRefuseList()
      }
    },
    activated() {
      this.getRefuseList();
    },
    watch: {
      tabIndex(newVal) {
        this.searchParams.refundStatus = newVal;
        this.searchParams.page = 1;
        this.searchParams.pageSize = 10;
        this.getRefuseList();
      }
    }
  }
</script>

<style lang="less" scoped>
  .box-card {
    margin-bottom: 15px
  }

  .card-title {
    color: #409EFF
  }

  .text-danger {
    color: #F56C6C
  }

  .text.item {
    line-height: 24px;
    font-size: 14px;
    color: #666;
    margin-bottom: 10px
  }

  .status-text {
    line-height: 24px;
    font-size: 14px;
    color: #555;
    margin-bottom: 10px
  }

  .showReportBtn {
    color: #409EFF;
    cursor: pointer;
    font-weight: bold;
    font-size: 14px;
  }
</style>
