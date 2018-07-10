<template>
  <div class="tel-consult">
    <!--<header-top></header-top>-->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="客户名称">
        <el-input v-model="searchParams.username" placeholder="请输入客户名称"></el-input>
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
          value-format="yyyy-MM-DD HH:mm:ss"
          @change="getselTime"
          :picker-options="pickerOptions2"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right">
        </el-date-picker>
      </div>
      <el-form-item>
        <el-button type="primary" @click="doSearch" icon="el-icon-search">查询</el-button>
        <el-button type="primary" @click="clearParams" icon="el-icon-refresh">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="tel-table">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="处理中心" name="first"></el-tab-pane>
        <el-tab-pane label="客户忙待联系" name="second"></el-tab-pane>
        <el-tab-pane label="已完成" name="third"></el-tab-pane>
        <el-tab-pane label="已失效（退款）" name="fourth"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="tableDetail">
      <el-table
        :data="orderLists"
        border
        :header-row-class-name="headerStyle"
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
          <template slot-scope="smsMsg">
            <el-button
              @click.native.prevent="showMegModel(smsMsg.$index, orderLists)"
              type="text"
              size="medium" style="color:red;">
              发送短信
            </el-button>
            <p class="blue-text" v-show="smsMsg.row.smsNumTimes>0">已发{{smsMsg.row.smsNumTimes}}次</p>
          </template>
        </el-table-column>
        <el-table-column prop="serviceEndTime" label="服务时间"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <span title="查看体检报告详情" v-show="searchParams.orderServiceStatus !=4"
                  class="iconfont icon-dingdanguanli doIcon" @click.native.prevent="showReport(scope.row)"></span>
            <span title="打电话" v-show="searchParams.orderServiceStatus ==0 || searchParams.orderServiceStatus == 1"
                  class="iconfont icon-dh2 doIcon" @click.native.prevent="callFn(scope.row.cspOrderId)"></span>
            <span title="查看备注" v-show="searchParams.orderServiceStatus !=4" class="iconfont icon-ffxj doIcon"
                  @click.native.prevent="_showSaveRemark(scope.row)"></span>
            <span title="查看录音列表" v-show="searchParams.orderServiceStatus ==1 || searchParams.orderServiceStatus ==3"
                  class="iconfont icon-ej doIcon" @click.native.prevent="getVoiveLists(scope.row.cspOrderId)"></span>
            <span v-show="searchParams.orderServiceStatus ==4" class="pink-text"
                  @click.native.prevent="showRefuseModel(scope.row)">查看退款原因</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div class="pageDetail" v-if="orderLists.length>0">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </div>

  </div>
</template>


<script>
  import headerTop from "@/components/headTop.vue"
  import {localUrl} from "@/config/env.js"
  import {api} from '@/api/api';
  import {storeManager} from '@/api/util.js';

  export default {
    components: {
      headerTop,
    },
    data() {
      return {
        activeName: 'first',
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
        activeIndex2: '1',
        currentPage4: 1,
        orderLists: [],
        currentPage: '',
        pageSize: '',
        totalCount: '',
        //保存备注的信息
        saveRemark: {
          currentStatus: 0,
          isShow: false,
          tabArr: [{name: "客户忙待联系", status: 0}, {name: "已完成通话", status: 1}],
          remarkValue: "",
          briefSummary: "",
          tradeDetailId: "",
          cspOrderId: "",
          isAbleEditor: true,
          cspCustomId: ""//增加的客户Id
        },
        //录音记录
        voiceData: {
          isShow: false,
          list: []
        },
        audioObj: {
          path: "",
          isPlay: false,
          currentIndex: -1
        },
        //短信的内容
        msgData: {
          isShow: false,
          msgText: "【掌上体检】您好！电话服务医生稍后将通过021-***5630联系您，\n" +
          "请保持电话通畅，因涉及隐私，建议您在私人空间接听电话。",
          providerServiceUserId: storeManager.getInsDoctorId(),//服务提供者ID
          userId: "",//会员ID，
          userName: "",//会员名称，
          sendType: 2,//1:发送给医生;2:发送给下单用户;3:发送给注册用户
          sendPhone: "",//发送手机号
          tradeDetailId: ""
        },
        //退款原因
        refuseData: {
          isShow: false,
          refuseText: ""
        },
        //搜索参数
        searchParams: {
          providerServiceUserId: "",
          providerServiceUserType: 1,
          itemId: "",
          orderServiceStatus: 0,
          orderCode: "",
          startTime: "",
          endTime: "",
          mobile: "",
          realName: "",
          tradeCode: "",
          currentPage: 1,
          pageSize: 10
        },
        //订单的状态
        tabsArr: [
          {status: 0, name: "待服务"},
          {status: 1, name: "客户忙待联系"},
          {status: 3, name: "已完成"},
          {status: 4, name: "已失效(退款)"}
        ],

        //体检报告数据
        isShowReport: false,
        reportData: {},
        currentHash: "baseInfo"
      }
    },
    created() {

      //获取医生id
      this.searchParams.providerServiceUserId = storeManager.getInsDoctorId();
      //获取角色 1医生 2 主任
      //this.searchParams.providerServiceUserType=storeManager.getRoleType();
      this._getList();
      this.getSMSTemplate()
    },
    methods: {
      getselTime() {
        if (this.formInline.selDate) {
          this.searchParams.startTime = this.formInline.selDate[0];
          this.searchParams.endTime = this.formInline.selDate[1];
        }
      },
      headerStyle(row, rowIndex) {
        return 'tablStyle';
      },
      handleClick(tab, event) {
        if (tab.index == 0) {
          this.searchParams.orderServiceStatus = 0;
        } else if (tab.index == 1) {
          this.searchParams.orderServiceStatus = 1;
        } else if (tab.index == 2) {
          this.searchParams.orderServiceStatus = 3;
        } else if (tab.index == 3) {
          this.searchParams.orderServiceStatus = 4;
        }
        this._getList();
      },
      /*选择状态*/
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this._getList();
      },
      handleCurrentChange(val) {
        this.searchParams.currentPage = val;
        this._getList();
      },
      /*设置单元格样式*/
      rowStyle({row, column, rowIndex}) {
        if (column === 0) {
          return 'color:green'
        } else {
          return ''
        }
      },
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      //状态切换
      selectStatus: function (status) {
        this.searchParams.orderServiceStatus = status;
        this._getList();
      },

      mobileBlur: function () {
        if (this.searchParams.mobile && !storeManager.mbTest.test(this.searchParams.mobile)) {
          alert("手机格式不正确", function () {
            this.searchParams.mobile = "";
          });
        }
      },

      //查看保存备注切换状态
      selectSaveRemarkStatus: function (status) {
        this.saveRemark.currentStatus = status;
      },

      //显示保存备注弹窗
      _showSaveRemark: function (item) {
        this.saveRemark.isShow = true;
        this.saveRemark.tradeDetailId = item.tradeDetailId;
        this.saveRemark.remarkValue = item.remark;
        this.saveRemark.cspOrderId = item.cspOrderId;
        this.saveRemark.cspCustomId = item.cspCustomId;
        if (item.instruction) {
          this.saveRemark.briefSummary = item.instruction;
          this.saveRemark.isAbleEditor = false;
        }
      },

      //关闭保存备注
      _closeSaveRemark: function () {
        this.saveRemark.isShow = false;
        this.saveRemark.remarkValue = "";
        this.saveRemark.briefSummary = "";
      },

      //提交备注
      submitRemark: function () {
        var params = {
          tradeDetailId: this.saveRemark.tradeDetailId,
          remark: this.saveRemark.remarkValue
        };
        if (!params.remark) {
          alert("备注内容不能为空");
          return;
        }
        /*        $.ajax({
                  type: "POST",
                  url:  baseURL+"ins/phoneconsultation/updateTradeDetailRemark",
                  contentType: "application/x-www-form-urlencoded",
                  data: params,
                  success: function(res){
                    if(res.code === 1){
                      alert("备注保存成功",function () {
                        vm._getList();
                        vm.saveRemark.isShow=false;
                      })
                    }else {
                      alert(res.msg)
                    }
                  }
                });*/
      },

      //提交服务小结
      submitBriefSummary: function () {
        var params = {
          cspOrderId: this.saveRemark.cspOrderId,
          tradeDetailId: this.saveRemark.tradeDetailId,
          cspCustomId: this.saveRemark.cspCustomId,
          instruction: this.saveRemark.briefSummary
        };
        if (!params.instruction) {
          alert("小结内容不能为空");
          return;
        }
        /*        $.ajax({
                  type: "POST",
                  url:  baseURL+"ins/phoneconsultation/saveOrderCallReport",
                  contentType: "application/x-www-form-urlencoded",
                  data: params,
                  success: function(res){
                    if(res.code === 1){
                      alert("备注保存成功",function () {
                        vm._getList();
                        vm.saveRemark.isShow=false;
                      })
                    }else {
                      alert(res.msg)
                    }
                  }
                });*/
      },

      //搜索列表
      doSearch: function () {
        this.searchParams.currentPage = 1;
        this.searchParams.realName = this.formInline.username;
        this.searchParams.mobile =this.formInline.usermobile;
        this.searchParams.orderCode =this.formInline.userfile;
        this._getList();
      },
      //请求列表数据
      _getList: function () {
        if (this.searchParams.mobile) {
          if (!storeManager.mbTest.test(this.searchParams.mobile)) {
            alert("手机格式不正确", function () {
              this.searchParams.mobile = "";
            });
            return;
          }
        }
        //订单时间范围
        let params = this.searchParams,
          that = this;
        api.queryPhoneConsultationOrder(params).then((res) => {
          let data = res.data;
          if (data.code === 1) {
            if (data.data) {
              that.orderLists = data.data.list;
              that.currentPage = data.data.currentPage;
              that.pageSize = data.data.pageSize;
              that.totalCount = data.data.totalCount;
            } else {
              that.orderLists = [];
            }
          } else {
            alert(data.msg)
          }
        })
      },

      //打电话
      callFn: function (orderId) {
        var params = {
          cspOrderId: orderId
        };
        /*        $.ajax({
                  type: "POST",
                  url:  baseURL+"ins/phoneconsultation/list",
                  contentType: "application/x-www-form-urlencoded",
                  data: params,
                  success: function(res){
                    if(res.code === 1){
                      alert("电话拨通成功",function () {
                        vm._getList();
                      })
                    }else {
                      alert(res.msg)
                    }
                  }
                });*/
      },

      //录音列表
      getVoiveLists: function (orderId) {
        var params = {
          cspOrderId: orderId,
          currentPage: 1,
          pageSize: 10
        };
        /*      $.ajax({
                type: "POST",
                url:  baseURL+"ins/phoneconsultation/getInsOrderCallRecordByPage",
                contentType: "application/json",
                data: JSON.stringify(params),
                success: function(res){
                  if(res.code === 1){
                    if(res.data.list){
                      vm.voiceData.list.length=0;
                      res.data.list.forEach(function (item) {
                        if(item.billsec >0){
                          vm.voiceData.list.push(Object.assign(item,{playFlag:false}));
                        }
                      })
                    }
                    vm.voiceData.isShow=true;
                  }else {
                    alert(res.msg)
                  }

                }
              });*/
      },

      //关闭录音弹层
      closeVoiceModel: function () {
        this.voiceData.isShow = false;
      },

      //获取短信模板
      getSMSTemplate: function () {
        let params = '';
        api.getSMSTemplate(params).then((res) => {
          let data = res.data;
          if (data.code === 1) {
            this.msgData.msgText = data.data.messageTemplateContent;
          } else {
            alert(data.msg);
          }
        })
      },

      //显示短信弹窗
      showMegModel: function (index, rows) {
        let item = rows[index],
          params = {
            providerServiceUserId: this.msgData.providerServiceUserId,//服务提供者ID
            userId: item.cspCustomId,//会员ID，
            tradeDetailId: item.tradeDetailId,//会员ID，
            userName: item.realName,//会员名称，
            sendType: 2,//1:发送给医生;2:发送给下单用户;3:发送给注册用户
            sendPhone: item.mobile//发送手机号
          };
        this.$confirm(this.msgData.msgText, '短信内容', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          api.sendSMS(params).then((res) => {
            let data = res.data;
            if (data.code === 1) {
              this.$message({
                type: 'success',
                message: '已发送信息!'
              });
            } else {
              this.$message({
                type: 'info',
                message: '发送信息失败!'
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消发送信息'
          });
        });
      },
      //显示退款原因的弹窗
      showRefuseModel: function (item) {
        this.refuseData.refuseText = item.refundReason || "暂无退款原因";
        this.refuseData.isShow = true;
      },

      //关闭退款原因弹窗
      closeRefuseModel: function () {
        this.refuseData.isShow = false;
      },

      //点击播放语音
      togglePlay: function (item) {
        this.audioObj.path = item.filePath;
      },

      clearParams: function () {
        this.formInline = {
          username: '',
          usermobile: '',
          userfile: '',
          selDate: ''
        }

      },

      //显示体检报告
      showReport: function (item) {
        var params = {
          workNo: item.workNo,
          checkUnitCode: item.checkUnitCode
        };
        /*        $.ajax({
                  type: "POST",
                  url: baseURL + "ins/phoneconsultation/getMedicalReportDetail",
                  contentType: "application/x-www-form-urlencoded",
                  data: params,
                  success: function (res) {
                    if (res.code === 1) {
                      if(res.data){
                        vm.isShowReport=true;
                        vm.reportData=res.data;
                      }else {
                        alert("暂无体检报告")
                      }
                    } else {
                      alert(res.msg);
                    }
                  }
                });*/
      },

      //关闭报告
      closeReport: function () {
        this.isShowReport = false;
      },

      //点击nav
      _navClick: function (index) {
        this.currentHash = index;
        location.hash = index;
      }
    },
  }

</script>
<style scoped lang="less">
  .tel-consult {
    line-height: 32px;
    .tableDetail {
      color: #000;
    }
    .pageDetail {
      text-align: center;
      margin-top: 20px;
    }
    .blue-text {
      color: #4f9bef;
    }
    .doIcon {
      font-size: 18px;
      padding: 2px;
    }
    .doIcon:hover {
      cursor: pointer;
      color: #4f9bef
    }
    .pink-text {
      color: #f96b53;
      cursor: pointer
    }
  }
</style>
<style>
  .el-table .tablStyle{
    background-color: #e5e5e5;
    color: #333
  }

</style>
