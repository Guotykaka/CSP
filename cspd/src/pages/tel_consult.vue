<template>
  <div class="tel-consult">
    <!--<header-top></header-top>-->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="客户名称">
        <el-input v-model="formInline.username" placeholder="请输入客户名称"></el-input>
      </el-form-item>
      <el-form-item label="客户手机号">
        <el-input type="number" v-model="formInline.usermobile" placeholder="请输入客户手机号"></el-input>
      </el-form-item>
      <el-form-item label="订单号">
        <el-input type="number" v-model="formInline.userfile" placeholder="请输入订单号"></el-input>
      </el-form-item>
      <div class="block" style="display:inline-block;margin-right:20px;">
        <span class="demonstration">选择时间</span>
        <el-date-picker
          v-model="formInline.selDate"
          type="datetimerange"
          :picker-options="pickerOptions2"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right">
        </el-date-picker>
      </div>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" icon="el-icon-search">查询</el-button>
        <el-button type="primary" @click="onSubmit" icon="el-icon-refresh">重置</el-button>
      </el-form-item>
    </el-form>
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#fff"
      text-color="#333"
      active-text-color="#409eff">
      <el-menu-item index="1">处理中心</el-menu-item>
      <el-menu-item index="2">客户忙待联系</el-menu-item>
      <el-menu-item index="3">已完成</el-menu-item>
      <el-menu-item index="4">已失效（退款）</el-menu-item>
    </el-menu>
    <div class="tableDetail">
      <el-table
        :data="data"
        border
        empty-text="暂无数据"
        :row-style="rowStyle"
        style="width: 100%;">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>
        <el-table-column prop="orderCode" label="订单号"></el-table-column>
        <el-table-column prop="itemName" label="服务名称"></el-table-column>
        <el-table-column prop="orderTime" label="订单日期"></el-table-column>
        <el-table-column prop="totalPrice" label="支付价格"></el-table-column>
        <el-table-column label="短信通知">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteRow(scope.$index, tableData)"
              type="text"
              size="medium" style="color:red;">
              发送短信
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="serviceEndTime" label="服务时间"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteRow(scope.$index, tableData)"
              type="text"
              style="font-size:16px;">
              <i class="el-icon-tickets"></i>
            </el-button>
            <el-button
              @click.native.prevent="deleteRow(scope.$index, tableData)"
              type="text"
              style="font-size:16px;">
              <i class="el-icon-phone-outline"></i>
            </el-button>
            <el-button
              @click.native.prevent="deleteRow(scope.$index, tableData)"
              type="text"
              style="font-size:16px;">
              <i class="el-icon-document"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div class="pageDetail">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="40">
      </el-pagination>
    </div>

  </div>
</template>


<script>
  import headerTop from "@/components/headTop.vue"

  export default {
    components: {
      headerTop,
    },
    data() {
      return {
        formInline: {
          username: '',
          usermobile: '',
          userfile: '',
          selDate: ''
        },
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        data: [{
          checkUnitCode: "bjbr002",
          cspCustomId: "12ade660-1c73-4efb-898d-a06b11e189f1",
          cspOrderId: "2c8080aa64591d2101645a69d16001ad",
          customerAge: null,
          customerDesc: null,
          customerImgs: null,
          customerMobile: "17740877123",
          customerName: null,
          customerSex: null,
          imageSrc: "http://zhangshangtijian.b0.upaiyun.com/default/DefaultUserHeader/6.jpg",
          instruction: null,
          itemId: "8ab2b2f56381c35a016381c35a400000",
          itemName: "电话报告解读",
          mobile: "17740877123",
          orderCode: "20180702175401616782_01",
          orderServiceStatus: 0,
          orderTime: "2018-07-02 17:54:01",
          realName: "zuolih",
          refundReason: null,
          remark: null,
          replyStatus: 1,
          serviceBeginTime: null,
          serviceEndTime: null,
          smsCount: null,
          smsNumTimes: 0,
          totalPrice: "0.10",
          tradeDetailId: "2c8080aa64591d2101645a69d15f01ab",
          workNo: "143608900486239"
        }],
        activeIndex2: '1',
        currentPage4: 1
      }
    },
    created() {

    },
    methods: {
      onSubmit() {
        console.log('submit!');
      },
      /*选择状态*/
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      /*设置单元格样式*/
      rowStyle({row, column, rowIndex}) {
        console.log(row)
        console.log(column)
        if (column === 0) {
          return 'color:green'
        } else {
          return ''
        }
      }
    },
  }

</script>

<style scoped lang="less">
  .tel-consult {
    line-height: 32px;
    .tableDetail {
      margin-top: 20px;
      color: #000;
    }
    .pageDetail {
      text-align: center;
      margin-top: 20px;
    }
  }
</style>
