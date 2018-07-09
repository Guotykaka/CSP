<template>
  <div class="personal">
    <!--<head-top></head-top>-->
    <div class="msgTitle">
      <section class="page-wrapper">
        <el-card class="box-card">
          <el-row :gutter="24">
            <el-col :span="8">
              <strong class="note-title">账户余额：</strong>
              <span>{{accountINfo.balance}}</span>
            </el-col>
            <el-col :span="8">
              <strong class="note-title">总收益：</strong>
              <span>{{accountINfo.sumEarnings}}</span>
            </el-col>
            <el-col :span="8">
              <strong class="note-title">已提现：</strong>
              <span>{{accountINfo.withdrawDeposit}}</span>
            </el-col>
          </el-row>
        </el-card>
      </section>
    </div>
    <div class="msgTabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="我要提现" name="first">
          <div class="first-body">
            <ul class="tab-one">
              <li class="box-hidden p_b_30">
                <span class="sel-note">账户金额：</span>
                <div class="sel-body">
                  <strong class="red-text" style="padding-right: 20px;">￥{{accountINfo.balance}}</strong>余额未满500不支持提现
                </div>
              </li>
              <li class="box-hidden p_b_30">
                <span class="sel-note">提现金额：</span>
                <div class="sel-body">
                  <el-input size="medium" v-model="doDepositParms.disburse" placeholder="请输入内容"></el-input>
                  <p class="selPs">单日提款范围500~10000;T+3到账</p>
                </div>
              </li>
              <li class="box-hidden p_b_30">
                <span class="sel-note"></span>
                <div class="sel-body">
                  <el-button type="primary" disabled value="我要提现" v-show="isDisable">我要提现</el-button>
                  <el-button type="primary" @click="withdrawDepositFN" value="我要提现"
                             v-show="!isDisable">我要提现
                  </el-button>
                </div>
              </li>
            </ul>
          </div>
        </el-tab-pane>
        <el-tab-pane label="提现记录" name="second">
          <el-table
            :data="withdrawList"
            :header-row-class-name="headerStyle"
            style="width: 100%">
            <el-table-column
              prop="createTime"
              label="时间">
            </el-table-column>
            <el-table-column
              prop="disburse"
              label="金额">
            </el-table-column>
            <el-table-column
              prop="address"
              label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.status === 0" class="color_green">申请中</span>
                <div v-if="scope.row.status === 1">
                  <span class="color_red">已拒绝</span>
                  <a @click="_showRefuseReason(scope.row.refuseReason)" class="color_blue">理由</a>
                </div>
                <span v-if="scope.row.status === 2">已完成</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="block" v-if="withdrawList.length>0">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="withdrawPage.currentPage"
              :page-sizes="[10, 20, 30, 50]"
              :page-size="withdrawPage.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="withdrawPage.totalCount">
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="订单记录" name="third">
          <el-table
            :data="orderList"
            :header-row-class-name="headerStyle"
            style="width: 100%">
            <el-table-column
              prop="orderCode"
              label="订单号">
            </el-table-column>
            <el-table-column
              prop="serviceName"
              label="服务名称">
            </el-table-column>
            <el-table-column
              prop="orderTime"
              label="订单时间">
            </el-table-column>
            <el-table-column
              prop="serviceFinishTime"
              label="服务完成时间">
            </el-table-column>
            <el-table-column
              prop="totalAmount"
              label="订单金额">
            </el-table-column>
          </el-table>
          <div class="block" v-if="orderList.length>0">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              background
              :current-page="orderPage.currentPage"
              :page-sizes="[10, 20, 30, 50]"
              :page-size="orderPage.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="orderPage.totalCount">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import {localUrl} from "@/config/env.js"
  import {api} from '@/api/api';

  export default {
    name:'personal',
    data() {
      return {
        activeName: 'first',
        //提现列表数据
        withdrawList: [],
        withdrawPage:{},
        withdrawParms: {
          limit: 10,
          page: 1
        },
        doDepositParms: {
          disburse: ""
        },
        //订单列表数据
        orderList: [],
        orderPage:{},
        orderParams: {
          limit: 10,
          page: 1
        },
        //账户
        accountINfo: {
          balance: '',//余额
          sumEarnings: '',//总收益
          withdrawDeposit: ''//提现
        }
      }
    },
    created() {
      this._getDoctorInfo();
    },
    methods: {
      headerStyle(row, rowIndex) {
        return 'tablStyle';
      },
      handleClick(tab, event) {
        if (tab.index == 1) {
          this._getWithdrawData()
        } else if (tab.index == 2) {
          this._getOrderList()
        } else if (tab.index == 0) {
          this._getDoctorInfo()
        }
      },
      handleSizeChange(val) {
        if(this.activeName==='second'){
          this.withdrawParms.limit=val;
          this._getWithdrawData();
        }else if(this.activeName==='third'){
          this.orderParams.limit=val;
          this._getOrderList();
        }
      },
      handleCurrentChange(val) {
        if(this.activeName==='second'){
          this.withdrawParms.page=val;
          this._getWithdrawData();
        }else if(this.activeName==='third'){
          this.orderParams.page=val;
          this._getOrderList();
        }
      },
      //获取医生个人信息
      _getDoctorInfo: function () {
        let params = null,
          that = this;
        api.getDoctorAccountInfo(params).then((res) => {
          let data = res.data;
          if (data.code === 1) {
            that.accountINfo = {
              balance: data.data.balance,
              sumEarnings: data.data.incomeTotal,
              withdrawDeposit: data.data.disburseTotal
            };
          } else {
            alert(data.msg);
          }
        })
      },

      //获取提现列表数据
      _getWithdrawData: function () {
        let params = this.withdrawParms;
        api.listAccountRecord(params).then((res) => {
          let data = res.data;
          if (data.code === 1) {
            this.withdrawList = data.data.list;
            this.withdrawPage = data.data.page;
          } else {
            alert(data.msg);
          }
        })
      },

      //操作提现
      withdrawDepositFN: function () {
        if (!this.doDepositParms.disburse) {
          alert("提现金额不能为空");
          return;
        }
        if (parseInt(this.doDepositParms.disburse) < 500) {
          alert("提现金额不能小于500");
          return;
        }

        if (parseInt(this.doDepositParms.disburse) > parseInt(this.accountINfo.balance)) {
          alert("提现金额不能大于账户余额");
          return;
        }
        layui.use('layer', function () {
          var loading = layer.load(1, {
            shade: [0.3, '#000'] //0.1透明度的白色背景
          });
          /*          $.ajax({
                      type: "POST",
                      url: baseURL + "ins/doctorAccount/saveAccountRecord",
                      contentType: "application/json",
                      data: JSON.stringify(vm.doDepositParms),
                      success: function(res){
                        layer.close(loading);
                        alert(res.msg,function () {
                          vm._getDoctorInfo();
                          vm.doDepositParms.disburse="";
                        });
                      },
                      error:function () {
                        layer.close(index);
                      }
                    });*/
        });
      },

      //提现列表分页
      _initWithdrawPage: function (totalCount) {
        layui.use('laypage', function () {
          var laypage = layui.laypage;
          //完整功能
          laypage.render({
            elem: 'withdrawPage'
            , limit: vm.withdrawParms.limit
            , count: totalCount//总页数 //数据总数，从服务端得到
            , layout: ['count', 'prev', 'page', 'next', 'limit', 'skip']
            , limits: [10, 20, 30, 40, 50]
            , curr: vm.withdrawParms.page
            , jump: function (obj, first) {
              vm.withdrawParms.page = obj.curr;
              vm.withdrawParms.limit = obj.limit;
              //首次不执行
              if (!first) {
                vm._getWithdrawData();
              }
            }
          });
        });
      },

      //拒绝理由
      _showRefuseReason: function (reason) {
        var reason = reason || "暂无拒绝理由";
        alert(reason)
      },

      //点击同意或者拒绝执行的方法
      doStatus: function (listId, state) {
        var msg = "";
        state == 1 ? msg = "确定要拒绝吗" : msg = "确定通过吗";
        confirm(msg, function () {
          var parms = {
            insAccountRecordId: listId,
            status: state
          };
          /*          $.ajax({
                      type: "POST",
                      url: baseURL+"ins/withdraw/updateApplyStatus",
                      contentType: "application/json",
                      data: JSON.stringify(parms),
                      success: function(r){
                        if(r.code === 1){

                        }else{
                          alert(r.msg);
                        }
                        vm._getData();
                      }
                    });*/
        })
      },

      //导出提现记录
      _exportAccountRecord: function () {
        var params = {
          username: this.searchParams.username,
          institutionId: this.searchParams.institutionId,
          startTime: this.searchParams.startTime,
          endTime: this.searchParams.endTime,
          status: this.searchParams.status
        };
        /*        $.ajax({
                  type: "POST",
                  url: baseURL + "ins/withdraw/exportAccountRecord",
                  contentType: "application/json",
                  data: JSON.stringify(params),
                  success: function(r){
                    if(r.code == 1){
                      alert('成功导出到桌面了');
                    }else{
                      alert(r.msg);
                    }
                  }
                });*/
      },

      //订单记录列表的分页
      _initOrderPage: function (totalCount) {
        layui.use('laypage', function () {
          var laypage = layui.laypage;
          //完整功能
          laypage.render({
            elem: 'orderPage'
            , limit: vm.orderParams.limit
            , count: totalCount//总页数 //数据总数，从服务端得到
            , layout: ['count', 'prev', 'page', 'next', 'limit', 'skip']
            , limits: [10, 20, 30, 40, 50]
            , curr: vm.orderParams.page
            , jump: function (obj, first) {
              vm.orderParams.page = obj.curr;
              vm.orderParams.limit = obj.limit;
              //首次不执行
              if (!first) {
                vm._getOrderList();
              }
            }
          });
        });
      },

      //获取订单记录
      _getOrderList: function () {
        let params = this.orderParams;
        api.getOrderInfo(params).then((res)=>{
          let data =res.data;
          if(data.code === 1){
            this.orderList=data.data.list;
            this.orderPage=data.data.page;
          }else{
            alert(data.msg);
          }
        })
      }
    },
    computed: {
      isDisable: function () {
        if (this.accountINfo.balance < 500 || this.doDepositParms.disburse < 500 || this.doDepositParms.disburse > this.accountINfo.balance) {
          return true;
        } else {
          return false;
        }
      }
    },

  }
</script>
<style lang="less">
  .el-table {
    .tablStyle {
      background-color:#e5e5e5!important;
      color:#333;
    }
  }
</style>
<style lang="less" scoped>
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  .el-col {
    border-radius: 4px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  /*我的样式*/
  .personal {
    line-height: 32px;
    .sel-note {
      display: inline-block;
      flex: 1;
      line-height: 34px;
      font-size: 14px;
      text-align: right;
      margin-right: 10px;
    }
    .sel-body {
      flex: 2;
      text-align: left;
      .selPs {
        margin-top: 10px;
      }
    }
    /*tab切换提现记录*/
    .block{
      text-align:center;
      margin-top:20px;
    }
    .box-hidden {
      overflow: hidden;
      display: flex;
    }

    .p_b_30 {
      padding-bottom: 30px;
    }
    .p_t_30 {
      padding-top: 30px;
    }
    .red-text {
      color: #f86b4f;
      font-size: 18px;
    }
    .color_red {
      color: red
    }
    .color_green {
      color: green
    }
    .color_blue {
      color: blue
    }
    .color_blue:hover {
      color: darkblue;
      cursor: pointer
    }
    .disableBtn {
      background-color: #999;
    }

    .sel-panel {
      padding: 25px;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
    input[type="number"] {
      -moz-appearance: textfield;
    }
  }

  .msgTabs {

    .tab-one {
      padding-top: 20px;
      margin: 0 auto;
    }
    .price-box {
      overflow: hidden;
    }

  }
</style>
