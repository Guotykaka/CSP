<template>
  <div>
    <el-form :inline="true" :model="searchParams" class="demo-form-inline">
      <el-form-item label="名称">
        <el-input placeholder="客户名称" v-model="searchParams.realName"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input placeholder="手机号" v-model="searchParams.mobile"></el-input>
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
      </el-form-item>
    </el-form>
    <!--tab-->
    <el-tabs v-model="tabIndex">
      <el-tab-pane label="待服务" name="0"></el-tab-pane>
      <el-tab-pane label="客户忙待联系" name="1"></el-tab-pane>
      <el-tab-pane label="已完成" name="3"></el-tab-pane>
      <el-tab-pane label="已失效(退款)" name="4"></el-tab-pane>
    </el-tabs>

    <!--table 表单开始-->
    <el-table
      :data="orderLists"
      border
      style="width: 100%">
      <el-table-column prop="" label="序号"  width="50" type="index"></el-table-column>
      <el-table-column prop="mobile" label="手机号"></el-table-column>
      <el-table-column prop="orderCode" label="订单号"></el-table-column>
      <el-table-column prop="itemName" label="服务名称"></el-table-column>
      <el-table-column prop="orderTime" label="订单日期"></el-table-column>
      <el-table-column prop="totalPrice" label="支付价格" width="100"></el-table-column>

      <el-table-column label="短信通知" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" v-show="scope.row.orderServiceStatus === 0 || scope.row.orderServiceStatus === 1" @click="showMegDialog(scope.row)">发送短信</el-button>
          <el-tag type="info" v-if="scope.row.smsCount" style="margin-top: 5px;">已发送{{scope.row.smsNumTimes}}次</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="serviceEndTime" label="服务时间"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column label="操作" width="260">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" v-if="scope.row.orderServiceStatus!==4" @click="showReportFn(scope.row)">体检报告</el-button>
          <el-button size="mini" type="warning" v-if="scope.row.orderServiceStatus===0 || scope.row.orderServiceStatus===1" @click="callFn(scope.row.cspOrderId)">打电话</el-button>
          <el-button size="mini" v-if="scope.row.orderServiceStatus!==4" @click="_showSaveRemark(scope.row)">备注</el-button>
          <el-button size="mini" type="primary" v-if="scope.row.orderServiceStatus===1 || scope.row.orderServiceStatus===3" @click="getAudioFn(scope.row.cspOrderId)">听录音</el-button>
          <el-button size="mini" type="danger" v-if="scope.row.orderServiceStatus===4" @click="showRefuseModel(scope.row)">退款原因</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--table 表单结束-->
    <div class="self-page-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchParams.currentPage" :page-sizes="[10,20]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </div>

    <!--体检报告详情 dialog-->
    <el-dialog title="体检报告" :visible.sync="isShowReport" width="90%" custom-class="self-dialog">
      <report :reportData="reportData"></report>
    </el-dialog>

    <!--备注的dialog-->
    <el-dialog title="保存备注" :visible.sync="saveRemark.isShowDialog">
      <el-tabs v-model="saveRemark.remarkTabIndex">

        <el-tab-pane label="客户忙待联系" name="1">
          <el-input type="textarea" :rows="5" v-model="saveRemark.remarkValue" placeholder="请填写备注" v-if="saveRemark.orderServiceStatus == 0 || saveRemark.orderServiceStatus == 1"></el-input>
          <el-input type="textarea" :rows="5" v-model="saveRemark.remarkValue" placeholder="请填写备注失效" readonly v-if="saveRemark.orderServiceStatus == 3"></el-input>
          <div class="dialog-btn-row" v-if="saveRemark.orderServiceStatus == 0 || saveRemark.orderServiceStatus == 1">
            <el-button type="primary" size="mini" @click="submitRemark">保存</el-button>
          </div>
        </el-tab-pane>

        <el-tab-pane label="完成通话" name="2">
          <el-input type="textarea" :rows="5" v-model="saveRemark.briefSummary" placeholder="请填写服务小结" v-if="saveRemark.orderServiceStatus == 0 || saveRemark.orderServiceStatus == 1"></el-input>
          <el-input type="textarea" :rows="5" v-model="saveRemark.briefSummary" placeholder="请填写服务小结" readonly v-if="saveRemark.orderServiceStatus == 3"></el-input>
          <div class="dialog-btn-row" v-if="saveRemark.orderServiceStatus == 0 || saveRemark.orderServiceStatus == 1">
            <el-button type="primary" size="mini" @click="submitBriefSummary">提交</el-button>
          </div>
        </el-tab-pane>

      </el-tabs>
    </el-dialog>

    <!--拒绝原因 dialog-->
    <el-dialog title="拒绝原因" :visible.sync="refuseData.isShowDialog">
      <p>{{refuseData.refuseText}}</p>
      <div class="dialog-btn-row">
        <el-button size="mini" type="primary" @click="closeRefuseDialog">关闭</el-button>
      </div>
    </el-dialog>

    <!--发送短信 dialog-->
    <el-dialog title="发送短信" :visible.sync="msgData.isShowDialog">
      <p>{{msgData.msgText}}</p>
      <div class="dialog-btn-row">
        <el-button size="mini" type="primary" @click="cancelMsgFn">取消</el-button>
        <el-button size="mini" type="primary" @click="sendMsgFn">发送</el-button>
      </div>
    </el-dialog>

    <!--录音 dialog-->
    <el-dialog title="语音" :visible.sync="voiceData.isShowDialog" width="650px">
      <div>
        <ul class="voice-content">
          <li class="voice-list" v-for="(item,index) in voiceData.list" :key="index">
            <p class='createdTime'>{{item.callTime}}</p>
            <p class='voice-bar' @click="togglePlay(item)">
              <i class='voice-icon icon-yy iconfont'></i>
              <span class='during'>{{item.billsec}}"</span>
            </p>
          </li>
        </ul>
        <audio refs="audio" :src="audioObj.path" controls></audio>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import report from '@/components/report.vue';
  import {getStore} from "@/config/mUtils.js";
  import {ERR_OK, getTelService,callCustomer,getReportData,saveRemark,saveTelReport,getAudioList,getSMSTemplate,sendMsg} from '@/api/api';
  export default {
    data(){
      return{
        reportData:{},
        isShowReport:false,//是否显示体检报告
        tabIndex:0,
        rangeTime:"",
        totalCount:0,
        searchParams:{
          startTime:"",
          endTime:"",
          realName:"",
          mobile:"",
          orderCode:"",
          currentPage:1,
          providerServiceUserId:JSON.parse(getStore("userMesage")).insDoctorId,
          userId:JSON.parse(getStore("userMesage")).userId,
          itemId:"",
          providerServiceUserType:1,
          pageSize:10
        },

        //保存备注的信息
        saveRemark:{
          remarkTabIndex:'1',
          orderServiceStatus:"",//订单的状态 0待服务 1客户忙待联系  3 已完成  4 已失效
          isShowDialog:false,
          tabArr:[{name:"客户忙待联系",status:0},{name:"已完成通话",status:1}],
          remarkValue:"",
          briefSummary:"",
          tradeDetailId:"",
          cspOrderId:"",
          cspCustomId:""//增加的客户Id
        },
        //短信的内容
        msgData:{
          isShowDialog:false,
          msgText:"【掌上体检】您好！电话服务医生稍后将通过021-***5630联系您，\n" +
          "请保持电话通畅，因涉及隐私，建议您在私人空间接听电话。",
          providerServiceUserId:JSON.parse(getStore("userMesage")).insDoctorId,//服务提供者ID
          userId:"",//会员ID，
          userName:"",//会员名称，
          sendType:2,//1:发送给医生;2:发送给下单用户;3:发送给注册用户
          sendPhone:"",//发送手机号
          tradeDetailId:""
        },

        refuseData:{
          isShowDialog:false,
          refuseText:""
        },
        //列表数据
        orderLists:[],
        //录音记录
        voiceData:{
          isShowDialog:false,
          list:[]
        },
        audioObj:{
          path:"",
          isPlay:false,
          currentIndex:-1
        },
      }
    },

    components:{
      report
    },

    methods:{
      closeRefuseDialog(){
        this.refuseData.isShowDialog=false;
      },

      //请求列表数据
      getDataList:function () {
        if(this.rangeTime){
          this.searchParams.startTime=this.rangeTime[0];
          this.searchParams.endTime=this.rangeTime[1];
        }else{
          this.searchParams.startTime="";
          this.searchParams.endTime="";
        }

        let params={
          currentPage:this.searchParams.currentPage,
          endTime: this.searchParams.endTime,
          itemId: this.searchParams.itemId,
          mobile:this.searchParams.mobile,
          orderCode:this.searchParams.orderCode,
          orderServiceStatus:this.tabIndex,
          pageSize: this.searchParams.pageSize,
          providerServiceUserId: this.searchParams.providerServiceUserId,
          userId: this.searchParams.userId,
          providerServiceUserType: this.searchParams.providerServiceUserType,
          realName: this.searchParams.realName,
          startTime: this.searchParams.startTime,
        };
        getTelService(params).then(res => {
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

      //打电话
      callFn:function (orderId) {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        let params={
          userId:this.searchParams.userId,
          cspOrderId:orderId,
        };
        callCustomer(params).then(res => {
          loading.close();
          if(res.code===ERR_OK){
            this.$message({
              message: '电话已拨通',
              type: 'success'
            });
          }else{
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        }).catch(err => {
          loading.close();
          this.$alert(err.msg, '提示', {
            confirmButtonText: '确定',
          })
        });
      },

      //提交备注
      submitRemark:function () {
        let params={
          tradeDetailId:this.saveRemark.tradeDetailId,
          remark:this.saveRemark.remarkValue,
        };

        if(!params.remark){
          this.$alert("请填写备注", '提示', {
            confirmButtonText: '确定',
          });
          return;
        }
        saveRemark(params).then(res => {
          if(res.code===ERR_OK){
            this.saveRemark.isShowDialog=false;
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.getDataList();
              }
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

      //提交服务小结
      submitBriefSummary:function () {
        let params={
          cspOrderId:this.saveRemark.cspOrderId,
          tradeDetailId:this.saveRemark.tradeDetailId,
          cspCustomId:this.saveRemark.cspCustomId,
          instruction:this.saveRemark.briefSummary
        };
        if(!params.instruction){
          this.$alert("请填写服务小结", '提示', {
            confirmButtonText: '确定',
          });
          return;
        }
        saveTelReport(params).then(res => {
          if(res.code===ERR_OK){
            this.saveRemark.isShowDialog=false;
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.getDataList();
              }
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

      //点击显示体检报告详情
      showReportFn(item){
        let params={
          workNo: item.workNo,
          checkUnitCode:item.checkUnitCode
        };
        getReportData(params).then(res => {
          if(res.code===ERR_OK){
            if(res.data){
              this.reportData=res.data;
              this.isShowReport=true;
            }else {
              this.$alert("暂无数据", '提示', {
                confirmButtonText: '确定',
              })
            }
          }else{
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        }).catch(err => {

          console.log(err)
          this.$alert(err.msg, '提示', {
            confirmButtonText: '确定',
          })
        });
      },

      //获取录音
      getAudioFn(OrderId){
        let params={
          cspOrderId:OrderId,
          currentPage:1,
          pageSize: 10,
          userId:this.searchParams.userId
        };
        getAudioList(params).then(res => {
          if(res.code===ERR_OK){
            this.voiceData.list=res.data.list;
            this.voiceData.isShowDialog=true;
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

      //点击播放语音
      togglePlay:function (item) {
        this.audioObj.path=item.filePath;
      },

      //显示短信弹窗
      showMegDialog:function (item) {
        getSMSTemplate({}).then(res => {
          if(res.code===ERR_OK){
            this.msgData.msgText=res.data.messageTemplateContent;
            this.msgData.isShowDialog=true;
            this.msgData.userId=item.cspCustomId;
            this.msgData.userName=item.realName;
            this.msgData.sendPhone=item.mobile;
            this.msgData.tradeDetailId=item.tradeDetailId;
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


      //关闭短信dialog

      cancelMsgFn(){

        this.msgData.isShowDialog=false;

      },

      //发送短信
      sendMsgFn(){
        let params={
          providerServiceUserId:this.msgData.providerServiceUserId,
          sendPhone:this.msgData.sendPhone,
          sendType: this.msgData.sendType,
          tradeDetailId: this.msgData.tradeDetailId,
          userId:this.msgData.userId,
          userName:this.msgData.userName
        };
        sendMsg(params).then(res => {
          if(res.code===ERR_OK){
            this.msgData.isShowDialog=false;
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.getDataList();
              }
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
      doSearch(){
        this.searchParams.currentPage = 1;
        this.getDataList();
      },
      resetParams(){
        this.searchParams.startTime="";
        this.searchParams.endTime="";
        this.searchParams.realName="";
        this.searchParams.mobile="";
        this.searchParams.orderCode="";
        this.rangeTime="";
      },
      handleSizeChange(val){
        this.searchParams.pageSize=val;
        this.getDataList();
      },
      handleCurrentChange(val){
        this.searchParams.currentPage=val;
        this.getDataList();
      },

      //显示备注dialog
      _showSaveRemark(item){
        this.saveRemark.remarkTabIndex="1";
        this.saveRemark.tradeDetailId=item.tradeDetailId;
        this.saveRemark.orderServiceStatus=item.orderServiceStatus;
        this.saveRemark.remarkValue=item.remark;
        this.saveRemark.cspOrderId=item.cspOrderId;
        this.saveRemark.cspCustomId = item.cspCustomId;
        this.saveRemark.isShowDialog=true;
      },

      //显示退款原因dialog
      showRefuseModel(item){
        this.refuseData.refuseText=item.refundReason || "暂无退款原因";
        this.refuseData.isShowDialog=true;
      },
    },

    activated(){
      this.getDataList()
    },

    watch:{
      tabIndex(val){
        this.searchParams.currentPage=1;
        this.getDataList()
      }
    }
  }

</script>
<style scoped lang="less">
  .el-button--mini{padding: 7px 7px;}
  .el-button+.el-button{margin-left:5px;}
  .dialog-btn-row{text-align: right;padding: 15px 0 0 0}
  .remark-short-cut{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;max-width: 130px;}
  .voice-list{height:32px;padding: 15px;border-bottom: 1px solid #e9e9e9;}
  .voice-content{padding:0 15px;max-height: 320px;overflow-y: auto;min-height: 150px;}
  .createdTime{float: left;width: 210px;line-height: 34px;text-align: center;margin-right: 100px;height: 34px;}
  .voice-bar{float: left;width: 240px;line-height: 34px;height: 34px;border-radius: 6px;position: relative;background-color: #4fb136;cursor: pointer}
  .voice-icon{color:#fff;font-size: 22px;float: left;margin-left: 10px;}
  .during{float: right;color:#fff;font-size: 14px;margin-right: 10px;}
</style>
