<template>
  <div class="personal">

    <!--账户card-->
    <el-card class="box-card">
      <el-row :gutter="24">
        <el-col :span="8">
          <strong>账户余额：</strong>
          <span>{{accountINfo.balance}}</span>
        </el-col>
        <el-col :span="8">
          <strong>总收益：</strong>
          <span>{{accountINfo.sumEarnings}}</span>
        </el-col>
        <el-col :span="8">
          <strong>已提现：</strong>
          <span>{{accountINfo.withdrawDeposit}}</span>
        </el-col>
      </el-row>
    </el-card>


    <el-tabs v-model="activeName">
      <el-tab-pane label="我要提现" name="first">

        <el-row :gutter="20" style="margin-bottom: 10px">
          <el-col :span="6" class="title-note">
            <strong class="note-t">账户金额：</strong>
          </el-col>
          <el-col :span="18">
            <p class="col-text">
              <span class="blue-text">￥0.04</span>未满500元不支持提现
            </p>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 10px">
          <el-col :span="6" class="title-note">
            <strong class="note-t">提现金额：</strong>
          </el-col>
          <el-col :span="8">
            <el-input v-model="disburse" placeholder="请输入内容"></el-input>
            <p class="addtion-text">单日提款范围500~10000;T+3到账</p>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 10px">
          <el-col :span="6" class="title-note">&nbsp;</el-col>
          <el-col :span="8">
            <el-button type="primary">我要提现</el-button>
          </el-col>
        </el-row>



      </el-tab-pane>
      <el-tab-pane label="提现记录" name="second">
        <!--table 表单开始-->
        <el-table
          :data="withdrawList"
          border
          style="width: 100%">
          <el-table-column prop="createTime" label="时间"></el-table-column>
          <el-table-column prop="disburse" label="金额"></el-table-column>

          <el-table-column label="状态" width="300">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 0">申请中</el-tag>
              <el-tag v-if="scope.row.status === 1" type="danger" class="refuse-tag">已拒绝</el-tag>
              <el-button v-if="scope.row.status === 1" size="mini" type="primary" @click="checkReason(scope.row)">查看原因</el-button>
              <el-tag v-if="scope.row.status === 2" type="success">已完成</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <!--table 表单结束-->

        <!--分页-->
        <div class="self-page-container">
          <el-pagination @size-change="withdrawHandSize" @current-change="withdrawHandleCurrent" :current-page="withdrawPage.currentPage" :page-sizes="[10,20]" :page-size="withdrawPage.limit" layout="total, sizes, prev, pager, next, jumper" :total="withdrawPage.totalListCount">
          </el-pagination>
        </div>

      </el-tab-pane>

      <el-tab-pane label="订单记录" name="third">
        <el-table
          :data="orderList"
          border
          style="width: 100%">
          <el-table-column prop="orderCode" label="订单号"></el-table-column>
          <el-table-column prop="serviceName" label="服务名称"></el-table-column>
          <el-table-column prop="orderTime" label="订单时间"></el-table-column>
          <el-table-column prop="serviceFinishTime" label="服务完成时间"></el-table-column>
          <el-table-column prop="totalAmount" label="订单金额"></el-table-column>
        </el-table>

        <!--分页-->
        <div class="self-page-container">
          <el-pagination @size-change="orderHandSize" @current-change="orderHandleCurrent" :current-page="orderPage.currentPage" :page-sizes="[10,20]" :page-size="orderPage.limit" layout="total, sizes, prev, pager, next, jumper" :total="orderPage.totalListCount">
          </el-pagination>
        </div>

      </el-tab-pane>
    </el-tabs>


    <!--拒绝原因的dialog-->
    <el-dialog title="拒绝原因" :visible.sync="refuse.isShowDialog">

      <p class="info-content">{{refuse.reason}}</p>
      <div class="btn-row" style="text-align:center">
        <el-button size="small" type="danger" @click="closeDialog">关闭</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>

  export default {
    name:'personal',
    data() {
      return {


        refuse:{

          isShowDialog:false,
          reason:""

        },



        activeName: 'first',
        //账户
        accountINfo: {
          balance: '100',//余额
          sumEarnings: '120',//总收益
          withdrawDeposit: '200'//提现
        },


        disburse:"",//提现金额


        //提现分页参数
        withdrawPage:{
          currentPage:1,
          limit:10,
          totalListCount:100
        },
        //提现记录数据
        withdrawList:[
          {"insAccountRecordId":"2c8080aa64688e870164688fa4c00002","username":"huihui","createTime":"2018-07-05 11:50:01","institutionName":"上海天意达公司","disburse":10001.0,"insDoctorAccountId":"2c8080aa63de70c60163de70c6450000","type":2,"status":2,"refuseReason":null,"insDoctorId":"2c8080aa63de70c60163de70c6450000"},
          {"insAccountRecordId":"2c8080aa64688e870164688e87490000","username":"huihui","createTime":"2018-07-05 11:48:48","institutionName":"上海天意达公司","disburse":500.0,"insDoctorAccountId":"2c8080aa63de70c60163de70c6450000","type":2,"status":2,"refuseReason":null,"insDoctorId":"2c8080aa63de70c60163de70c6450000"},
          {"insAccountRecordId":"2c8080aa6439afef016439c9cc470005","username":"huihui","createTime":"2018-06-26 09:51:23","institutionName":"上海天意达公司","disburse":500.17,"insDoctorAccountId":"2c8080aa63de70c60163de70c6450000","type":2,"status":2,"refuseReason":null,"insDoctorId":"2c8080aa63de70c60163de70c6450000"},
          {"insAccountRecordId":"2c8080aa6439afef016439c8dd5b0002","username":"huihui","createTime":"2018-06-26 09:50:22","institutionName":"上海天意达公司","disburse":500.0,"insDoctorAccountId":"2c8080aa63de70c60163de70c6450000","type":2,"status":1,"refuseReason":"不同意请填写拒绝理由","insDoctorId":"2c8080aa63de70c60163de70c6450000"},
          {"insAccountRecordId":"2c8080aa6420cfae01642106e616000a","username":"huihui","createTime":"2018-06-21 14:27:37","institutionName":"上海天意达公司","disburse":500.0,"insDoctorAccountId":"2c8080aa63de70c60163de70c6450000","type":2,"status":1,"refuseReason":"请填写拒绝理由","insDoctorId":"2c8080aa63de70c60163de70c6450000"}
        ],


        //订单分页参数
        orderPage:{
          currentPage:1,
          limit:10,
          totalListCount:100
        },

        //订单记录
        orderList:[
          {"orderCode":"20180711115019393989_01","serviceName":"图文咨询","orderTime":"2018-07-11 11:50:19.0","serviceFinishTime":"2018-07-11 12:50:42.0","totalAmount":0.01},
          {"orderCode":"20180711114515281599_01","serviceName":"图文咨询","orderTime":"2018-07-11 11:45:15.0","serviceFinishTime":"2018-07-11 11:49:52.0","totalAmount":0.01},
          {"orderCode":"20180711105148690062_01","serviceName":"电话报告解读","orderTime":"2018-07-11 10:51:48.0","serviceFinishTime":null,"totalAmount":0.01},
          {"orderCode":"20180711095255186040_01","serviceName":"电话报告解读","orderTime":"2018-07-11 09:52:55.0","serviceFinishTime":null,"totalAmount":0.01},
          {"orderCode":"20180711092120785166_01","serviceName":"图文咨询","orderTime":"2018-07-11 09:21:20.0","serviceFinishTime":null,"totalAmount":0.01},
          {"orderCode":"20180710174728231273_01","serviceName":"电话报告解读","orderTime":"2018-07-10 17:47:28.0","serviceFinishTime":null,"totalAmount":0.01},
          {"orderCode":"20180710173015030428_01","serviceName":"电话报告解读","orderTime":"2018-07-10 17:30:15.0","serviceFinishTime":null,"totalAmount":0.01},
          {"orderCode":"20180710170723681671_01","serviceName":"图文咨询","orderTime":"2018-07-10 17:07:23.0","serviceFinishTime":"2018-07-11 09:20:48.0","totalAmount":0.01},
          {"orderCode":"20180709170237617309_01","serviceName":"电话报告解读","orderTime":"2018-07-09 17:02:37.0","serviceFinishTime":null,"totalAmount":0.01},
          {"orderCode":"20180706190803111292_01","serviceName":"图文咨询","orderTime":"2018-07-06 19:08:03.0","serviceFinishTime":"2018-07-06 19:09:23.0","totalAmount":0.01}
        ]
      }
    },

    methods: {


      withdrawHandSize(){

      },

      withdrawHandleCurrent(){


      },

      orderHandSize(){

      },

      orderHandleCurrent(){


      },


      //查看拒绝原因
      checkReason(item){
        this.refuse.reason=item.refuseReason;
        this.refuse.isShowDialog=true;
      },


      closeDialog(){
        this.refuse.isShowDialog=false;
      }

    },
    computed: {

    },

  }
</script>

<style lang="less" scoped>
  .box-card{margin-bottom: 20px;}
  .title-note{text-align: right}
  .blue-text{color:#409EFF;padding-right: 10px}
  .note-t{line-height: 40px;color:#606266;font-size: 15px;}
  .col-text{line-height: 40px;color:#606266;font-size: 14px;}
  .addtion-text{line-height: 22px;font-size: 13px;color:#909399;padding: 8px 0}
  .refuse-tag{margin-right: 10px;}
  .info-content{color: #606266;font-size: 14px;line-height: 22px;margin-bottom: 20px;}
</style>
