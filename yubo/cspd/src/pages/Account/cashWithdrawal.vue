<template>
  <div id="cash-withdrawal">
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

    <el-tabs v-model="tabIndex">
      <el-tab-pane label="我要提现" name="1">

        <el-row :gutter="20" class="tabs-style">
          <el-col :span="6" class="title-note">
            <strong class="note-t">账户金额：</strong>
          </el-col>
          <el-col :span="18">
            <p class="col-text">
              <span class="blue-text">￥{{accountINfo.balance}}</span>未满500元不支持提现
            </p>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 10px">
          <el-col :span="6" class="title-note">
            <strong class="note-t">提现金额：</strong>
          </el-col>
          <el-col :span="8">
            <el-input v-model="disburse" placeholder="请输入金额"></el-input>
            <p class="addtion-text">单日提款范围500~10000;T+3到账</p>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 10px">
          <el-col :span="6" class="title-note">&nbsp;</el-col>
          <el-col :span="8">
            <el-button type="primary" @click="depositFn">我要提现</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="提现记录" name="2">
        <!--table 表单开始-->
        <el-table
          :data="withdrawList"
          border
          style="width: 100%">
          <el-table-column show-overflow-tooltip prop="createTime" label="时间"></el-table-column>
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
          <el-pagination @size-change="withdrawHandSize" @current-change="withdrawHandleCurrent" :current-page="withdrawPage.currentPage" :page-sizes="[10,20]" :page-size="withdrawPage.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="withdrawPage.totalCount">
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
  import {ERR_OK, reg_number, getAccountInfo,getWithdrawList,getDoctorOrderList,doDeposit} from '@/api/api';
  import {getStore,EncodeDoctorId} from "@/config/mUtils.js";
  export default {
    name: "cashWithdrawal",
    data() {
      return {
        refuse:{
          isShowDialog:false,
          reason:""
        },
        tabIndex: '1',
        //账户
        accountINfo: {
          balance: '',//余额
          sumEarnings: '',//总收益
          withdrawDeposit: ''//提现
        },
        disburse:"",//提现金额
        //提现分页参数
        withdrawPage:{
          currentPage:1,
          pageSize:10,
          totalCount:0
        },
        //提现记录数据
        withdrawList:[],
      }
    },
    methods: {
      //医生个人信息
      getPersonAccountInfo(){
        var params={
          userId:EncodeDoctorId(JSON.parse(getStore("userMesage")).userId)
        };
        getAccountInfo(params).then(res => {
          if(res.code===ERR_OK){
            this.accountINfo.balance=res.data ? res.data.balance : "";//余额
            this.accountINfo.sumEarnings=res.data ? res.data.incomeTotal : "";//总收益
            this.accountINfo.withdrawDeposit=res.data ? res.data.disburseTotal : "";//提现
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

      //获取提现记录
      getWithdrawListFn(){
        let params={
          userId:EncodeDoctorId(JSON.parse(getStore("userMesage")).userId),
          currentPage:this.withdrawPage.currentPage,
          pageSize:this.withdrawPage.pageSize,
        };
        getWithdrawList(params).then(res => {
          if(res.code===ERR_OK){
            this.withdrawList=res.data.list;
            this.withdrawPage.totalCount=res.data.totalCount;
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
      //获取订单记录
      getDoctorOrderListFn(){
        var params={
          doctorId:EncodeDoctorId(JSON.parse(getStore("userMesage")).insDoctorId),
          currentPage:this.orderPage.currentPage,
          pageSize:this.orderPage.pageSize,
        };
        getDoctorOrderList(params).then(res => {
          if(res.code===ERR_OK){
            this.orderList=res.data.list;

            this.orderPage.totalCount=res.data.totalCount;
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

      //医生提现
      depositFn(){
        var params={
          userId:EncodeDoctorId(JSON.parse(getStore("userMesage")).userId),
          disburse:this.disburse,
        };

        if(!this.disburse){
          this.$alert("请输入提现金额", '提示', {
            confirmButtonText: '确定',
          });
          return;
        }

        if(!reg_number.test(this.disburse)){
          this.$alert("金额须为整数", '提示', {
            confirmButtonText: '确定',
          });
          return;
        }

        if(parseFloat(this.disburse) < 500){
          this.$alert("提现金额不能小于500", '提示', {
            confirmButtonText: '确定',
          });
          return;
        }
        if(parseFloat(this.disburse) > parseFloat(this.accountINfo.balance)){
          this.$alert("提现金额不能大于账户余额", '提示', {
            confirmButtonText: '确定',
          });
          return;
        }
        doDeposit(params).then(res => {
          if(res.code===ERR_OK){
            this.getPersonAccountInfo();//刷新账户数据
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
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

      withdrawHandSize(val){
        this.withdrawPage.pageSize=val;
        this.getWithdrawListFn();
      },

      withdrawHandleCurrent(val){
        this.withdrawPage.currentPage=val;
        this.getWithdrawListFn();
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
    activated(){
      this.getPersonAccountInfo()
    },
    watch:{
      tabIndex(val){
        if(val==="2"){
          this.getWithdrawListFn()
        }else if(val==="3"){
          this.getDoctorOrderListFn()
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .box-card{margin-bottom: 20px;}
  .title-note{text-align: right}
  .blue-text{color:#409EFF;padding-right: 10px}
  .note-t{line-height: 40px;color:#606266;font-size: 15px;}
  .col-text{line-height: 40px;color:#606266;font-size: 14px;}
  .addtion-text{line-height: 22px;font-size: 13px;color:#909399;padding: 8px 0}
  .refuse-tag{margin-right: 10px;}
  .info-content{color: #606266;font-size: 14px;line-height: 22px;margin-bottom: 20px;}
  .self-page-container {
    text-align: center;
    padding: 15px;
  }
  .tabs-style{
    margin-top:150px;
    margin-bottom: 10px
  }
</style>
