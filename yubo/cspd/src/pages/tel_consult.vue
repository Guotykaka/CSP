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
      <!--
            <el-tab-pane label="已发送短信" name="6"></el-tab-pane>
      -->
      <el-tab-pane label="已拨打电话" name="7"></el-tab-pane>

      <el-tab-pane label="客户忙待联系" name="1"></el-tab-pane>
      <el-tab-pane label="已完成" name="3"></el-tab-pane>
      <el-tab-pane label="已退款" name="4"></el-tab-pane>
    </el-tabs>

    <!--table 表单开始-->
    <el-table
      :data="orderLists"
      border
      size="mini"
      style="width: 100%">
      <el-table-column show-overflow-tooltip type="index"></el-table-column>
      <el-table-column show-overflow-tooltip prop="phoneConsultOrderDetailDTO.mobile" label="手机号"></el-table-column>
      <el-table-column show-overflow-tooltip prop="phoneConsultOrderDetailDTO.customerName"
                       label="客户名称" width="90"></el-table-column>
      <el-table-column show-overflow-tooltip prop="doctorTradeDetailOrderInfoDTO.orderCode"
                       label="订单号"></el-table-column>
      <el-table-column show-overflow-tooltip prop="doctorTradeDetailOrderInfoDTO.itemName"
                       label="商品名称">
        <template slot-scope="scope">
          <span style="color:#F56C6C" v-if="colorStatus(scope.row.doctorTradeDetailOrderInfoDTO.itemName)">{{scope.row.doctorTradeDetailOrderInfoDTO.itemName}}</span>
          <span v-else>{{scope.row.doctorTradeDetailOrderInfoDTO.itemName}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="doctorTradeDetailOrderInfoDTO.createTime"
                       label="订单日期"></el-table-column>

      <el-table-column show-overflow-tooltip prop="phoneConsultOrderDetailDTO.serviceEndTime"
                       label="服务时间"></el-table-column>

      <el-table-column show-overflow-tooltip label="期待服务时间" width="180">
        <template slot-scope="scope">
          <em class="blue-text">{{scope.row.expectTimeStr}}</em>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="预约时间" width="180">
        <template slot-scope="scope">
          <em class="blue-text">{{scope.row.phoneConsultOrderDetailDTO.appointmentStartTime | sliceString}}&nbsp;--&nbsp;{{scope.row.phoneConsultOrderDetailDTO.appointmentEndTime
            | sliceString}}</em>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip prop="phoneConsultOrderDetailDTO.remark" label="备注"></el-table-column>
      <el-table-column show-overflow-tooltip label="咨询内容">
        <template slot-scope="scope">
          <strong>{{scope.row.phoneConsultOrderDetailDTO.checkIndexName}}</strong>
          <span>{{scope.row.phoneConsultOrderDetailDTO.resultValue}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="210" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" v-if="scope.row.phoneConsultOrderDetailDTO.serviceStatus!==4"
                     @click="showReportFn(scope.row.phoneConsultOrderDetailDTO)">报告
          </el-button>
          <el-button size="mini" type="warning" v-if="scope.row.allowCall"
                     @click="callFn(scope.row.doctorTradeDetailOrderInfoDTO)">电话
          </el-button>
          <el-button size="mini" type="warning" v-if="scope.row.allowSendSMS" @click="showMegDialog(scope.row)">短信
          </el-button>
          <el-button size="mini"
                     v-if="scope.row.phoneConsultOrderDetailDTO.serviceStatus===7 ||scope.row.phoneConsultOrderDetailDTO.serviceStatus===1"
                     @click="_showSaveRemark(scope.row)">
            <span v-if="scope.row.doctorTradeDetailOrderInfoDTO.instruction">提交小结</span>
            <span v-else>备注</span>
          </el-button>
          <el-button size="mini"
                     v-if="scope.row.phoneConsultOrderDetailDTO.serviceStatus===3"
                     @click="_showSaveRemark(scope.row)">
            <span>备注</span>
          </el-button>
          <el-button size="mini" type="warning" v-if="scope.row.phoneConsultOrderDetailDTO.serviceStatus===3"
                     @click="getAudioFn(scope.row.doctorTradeDetailOrderInfoDTO.orderId)">录音
          </el-button>
          <el-button size="mini" type="primary" v-if="scope.row.phoneConsultOrderDetailDTO.serviceStatus===3"
                     @click="showComment(scope.row)">评价
          </el-button>
          <el-button size="mini" type="danger" v-if="scope.row.phoneConsultOrderDetailDTO.serviceStatus===4"
                     @click="showRefuseDialog(scope.row)">退款原因
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--table 表单结束-->
    <div class="self-page-container" v-if="orderLists.length>0">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="searchParams.currentPage" :page-sizes="[10,20]" :page-size="searchParams.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </div>

    <!--体检报告详情 dialog-->
    <transition name="movedown">
      <div class="report-model" v-show="isShowReport" id="report-model">
        <i class="close-model-btn el-icon-close" @click="closeReport"></i>
        <h3 class="model-title" id="report-t" v-dragReport>体检报告</h3>
        <div class="report-content-box">
          <report :reportData="reportData"></report>
        </div>
      </div>
    </transition>

    <!--备注的dialog-->
    <transition name="movedown">
      <div class="remark-model" v-show="saveRemark.isShowDialog" id="remark-model">
        <i class="close-model-btn el-icon-close" @click="closeRemark"></i>
        <h3 class="model-title" id="remark-t" v-dragRemark>备注</h3>
        <div class="remark-content-box">
          <el-tabs v-model="saveRemark.remarkTabIndex">
            <el-tab-pane label="客户忙待联系" name="1">
              <el-input type="textarea" :rows="5" v-model="saveRemark.remarkValue" placeholder="请填写备注" v-if="saveRemark.serviceStatus!==3"></el-input>
              <el-input type="textarea" :rows="5" readonly v-model="saveRemark.remarkValue" v-else></el-input>
              <div class="dialog-btn-row" v-if="saveRemark.serviceStatus!==3">
                <el-button type="primary" size="mini" @click="submitRemark">保存</el-button>
              </div>
            </el-tab-pane>
            <el-tab-pane label="报告小结" name="2">
              <el-input type="textarea" :rows="5" v-model="saveRemark.briefSummary" placeholder="请填写服务小结"
                        v-if="saveRemark.serviceStatus!==3"></el-input>
              <el-input type="textarea" :rows="5" readonly v-model="saveRemark.briefSummary" v-else></el-input>
              <div class="dialog-btn-row" v-if="saveRemark.serviceStatus!==3">
                <el-button type="primary" size="mini" @click="submitBriefSummary(1)">保存草稿</el-button>
                <el-button type="primary" size="mini" @click="submitBriefSummary(2)">提 交</el-button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </transition>

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
        <audio ref="audio" :src="audioObj.path" controls></audio>
      </div>
    </el-dialog>

    <!--评价详情 dialog-->
    <el-dialog title="评价详情" :visible.sync="comment.isShowDialog" width="650px">
      <ul>
        <li class="star-bar">
          <strong class="comment-note">评价星级</strong>
          <star :star="comment.score"></star>
        </li>
        <li class="star-bar">
          <strong class="comment-note">评价内容</strong>
          <p class="comment-text">{{comment.text}}</p>
        </li>
      </ul>
      <div class="star-btn-bar">
        <el-button type="primary" size="small" @click="closeComment">关闭</el-button>
      </div>
    </el-dialog>

    <!--拒绝原因 dialog-->
    <el-dialog title="退款原因" :visible.sync="refuse.isShowDialog" width="650px">
      <div class="refuse-content">{{refuse.refuseText}}</div>
      <div class="star-btn-bar">
        <el-button type="primary" size="small" @click="closeRefuse">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

  // import report from '@/components/report.vue';
  import report from '@/components/reportNew.vue';
  import star from '@/components/star/star.vue';
  import {getStore,EncodeDoctorId} from "@/config/mUtils.js";
  import {
    ERR_OK,
    getTelService,
    callCustomer,
    getReportData,
    saveRemark,
    saveTelReport,
    getAudioList,
    sendMsg
  } from '@/api/api';

  export default {
    data() {
      return {
        reportData: {},
        isShowReport: false,//是否显示体检报告
        tabIndex: 0,
        rangeTime: "",
        totalCount: 0,
        searchParams: {
          startTime: "",
          endTime: "",
          realName: "",
          mobile: "",
          orderCode: "",
          currentPage: 1,
          providerServiceUserId: EncodeDoctorId(JSON.parse(getStore("userMesage")).insDoctorId),
          userId: EncodeDoctorId(JSON.parse(getStore("userMesage")).userId),
          itemId: "",
          providerServiceUserType: 1,
          pageSize: 10
        },

        //保存备注的信息
        saveRemark: {
          // isWrite:true,//是否可编辑
          remarkTabIndex: '1',
          orderServiceStatus: "",//订单的状态 0待服务 1客户忙待联系  3 已完成  4 已失效
          isShowDialog: false,
          tabArr: [{name: "客户忙待联系", status: 0}, {name: "已完成通话", status: 1}],
          remarkValue: "",
          briefSummary: "",
          tradeDetailId: "",
          cspOrderId: "",
          cspCustomId: "",//增加的客户Id
          doctorId: "",//增加的doctorId
        },
        //短信的内容
        msgData: {
          providerServiceUserId: EncodeDoctorId(JSON.parse(getStore("userMesage")).insDoctorId),//服务提供者ID
          sendType: 2,//1:发送给医生;2:发送给下单用户;3:发送给注册用户
        },

        //退款
        refuse: {
          isShowDialog: false,
          refuseText: ""
        },

        //列表数据
        orderLists: [],
        //录音记录
        voiceData: {
          isShowDialog: false,
          list: []
        },
        audioObj: {
          path: "",
          isPlay: false,
          currentIndex: -1
        },

        //评价详情
        comment: {
          isShowDialog: false,
          score: "5",
          text: "评价详情评价详情评价详情评价详情评价详情评价详情评价详情评价详情评价详情评价详情评价详情"
        }
      }
    },

    components: {
      report,
      star
    },

    methods: {
      /*判断是否及时*/
      colorStatus(value){
        if(value.indexOf('即时')>0){
          return true
        }else{
          return false
        }
      },
      //请求列表数据
      getDataList: function () {
        if (this.rangeTime) {
          this.searchParams.startTime = this.rangeTime[0];
          this.searchParams.endTime = this.rangeTime[1];
        } else {
          this.searchParams.startTime = "";
          this.searchParams.endTime = "";
        }

        let params = {
          currentPage: this.searchParams.currentPage,
          endTime: this.searchParams.endTime,
          itemId: this.searchParams.itemId,
          mobile: this.searchParams.mobile,
          orderCode: this.searchParams.orderCode,
          orderServiceStatus: this.tabIndex,
          pageSize: this.searchParams.pageSize,
          providerServiceUserId: this.searchParams.providerServiceUserId,
          userId: this.searchParams.userId,
          providerServiceUserType: this.searchParams.providerServiceUserType,
          realName: this.searchParams.realName,
          startTime: this.searchParams.startTime,
        };
        getTelService(params).then(res => {
          if (res.code === ERR_OK) {
            this.orderLists = res.data.list;
            this.totalCount = res.data.totalCount;
          } else {
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
      callFn: function (item) {
        this.$confirm('确定要拨打电话吗?', '打电话', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          const loading = this.$loading({
            lock: true,
            text: '正在拨通...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });

          let params = {
            userId: this.searchParams.userId,
            cspOrderId: item.orderId,
            tradeDetailId: item.tradeDetailId
          };
          callCustomer(params).then(res => {
            loading.close();
            if (res.code === ERR_OK) {
              this.$message({
                message: '电话已拨通',
                type: 'success'
              });
            } else {
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

        }).catch(() => {

        });
      },

      //提交备注
      submitRemark: function () {
        let params = {
          tradeDetailId: this.saveRemark.tradeDetailId,
          remark: this.saveRemark.remarkValue,
        };

        if (!params.remark) {
          this.$alert("请填写备注", '提示', {
            confirmButtonText: '确定',
          });
          return;
        }

        const loading = this.$loading({
          lock: true,
          text: '备注提交中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        saveRemark(params).then(res => {
          loading.close();
          if (res.code === ERR_OK) {
            this.saveRemark.isShowDialog = false;
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.getDataList();
              }
            })
          } else {
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

      //提交服务小结
      submitBriefSummary: function (val) {
        let params = {
          cspOrderId: this.saveRemark.cspOrderId,
          tradeDetailId: this.saveRemark.tradeDetailId,
          cspCustomId: this.saveRemark.cspCustomId,
          doctorId: this.saveRemark.doctorId,
          operationType: val,//1 保存草稿;2 保存小结
          instruction: this.saveRemark.briefSummary
        };
        if (!params.instruction) {
          this.$alert("请填写服务小结", '提示', {
            confirmButtonText: '确定',
          });
          return;
        }

        const loading = this.$loading({
          lock: true,
          text: '小结提交中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        saveTelReport(params).then(res => {
          loading.close();
          if (res.code === ERR_OK) {
            this.saveRemark.isShowDialog = false;
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.getDataList();
              }
            })
          } else {
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

      //点击显示体检报告详情
      showReportFn(item) {
        let params = {
          workNo: item.workNo,
          checkUnitCode: item.checkUnitCode
        };
        getReportData(params).then(res => {
          if (res.code === ERR_OK) {
            if (res.data) {
              this.reportData = res.data;
              this.isShowReport = true;
            } else {
              this.$alert("暂无数据", '提示', {
                confirmButtonText: '确定',
              })
            }
          } else {
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

      //获取录音
      getAudioFn(OrderId) {
        let params = {
          cspOrderId: OrderId,
          currentPage: 1,
          pageSize: 10,
          userId: this.searchParams.userId
        };
        getAudioList(params).then(res => {
          if (res.code === ERR_OK) {
            this.voiceData.list = res.data.list;
            this.voiceData.isShowDialog = true;
          } else {
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
      togglePlay: function (item) {
        this.audioObj.path = item.filePath;
      },

      //显示短信弹窗
      showMegDialog: function (item) {
        this.$confirm('确定要发送短信码?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            providerServiceUserId: this.msgData.providerServiceUserId,
            sendPhone: item.phoneConsultOrderDetailDTO.mobile,
            sendType: this.msgData.sendType,
            tradeDetailId: item.doctorTradeDetailOrderInfoDTO.tradeDetailId
          };
          sendMsg(params).then(res => {
            if (res.code === ERR_OK) {
              this.$alert(res.msg, '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.getDataList();
                }
              })
            } else {
              this.$alert(res.msg, '提示', {
                confirmButtonText: '确定',
              })
            }
          }).catch(err => {
            this.$alert(err.msg, '提示', {
              confirmButtonText: '确定',
            })
          });
        }).catch(() => {

        });
      },

      doSearch() {
        this.searchParams.currentPage = 1;
        this.getDataList();
      },
      resetParams() {
        this.searchParams.startTime = "";
        this.searchParams.endTime = "";
        this.searchParams.realName = "";
        this.searchParams.mobile = "";
        this.searchParams.orderCode = "";
        this.rangeTime = "";
      },
      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this.getDataList();
      },
      handleCurrentChange(val) {
        this.searchParams.currentPage = val;
        this.getDataList();
      },

      //显示备注dialog
      _showSaveRemark(item) {
        // this.saveRemark.isWrite=(item.phoneConsultOrderDetailDTO.remark ? false : true);
        this.saveRemark.remarkTabIndex = "1";
        this.saveRemark.tradeDetailId = item.doctorTradeDetailOrderInfoDTO.tradeDetailId;
        this.saveRemark.serviceStatus = item.phoneConsultOrderDetailDTO.serviceStatus;
        this.saveRemark.remarkValue = item.phoneConsultOrderDetailDTO.remark;
        this.saveRemark.briefSummary = item.doctorTradeDetailOrderInfoDTO.instruction;
        this.saveRemark.cspOrderId = item.doctorTradeDetailOrderInfoDTO.orderId;
        this.saveRemark.cspCustomId = item.doctorTradeDetailOrderInfoDTO.cspCustomId;
        this.saveRemark.doctorId = item.doctorTradeDetailOrderInfoDTO.doctorId;
        this.saveRemark.isShowDialog = true;
      },

      //关闭备注
      closeRemark() {
        this.saveRemark.isShowDialog = false;
      },

      //关闭报告
      closeReport() {
        this.isShowReport = false;
      },

      //显示评价详情
      showComment(item) {
        if (!item.doctorTradeDetailOrderInfoDTO.insOrderCommentId) {
          this.$alert("暂无评论", '提示', {
            confirmButtonText: '确定',
          });
          return;
        }
        this.comment.score = item.doctorTradeDetailOrderInfoDTO.commentGrade;
        this.comment.text = item.doctorTradeDetailOrderInfoDTO.commentContent;
        this.comment.isShowDialog = true;
      },
      //关闭评价dialog
      closeComment() {
        this.comment.isShowDialog = false;
      },

      //退款拒绝
      showRefuseDialog(item) {
        this.refuse.refuseText = item.doctorTradeDetailOrderInfoDTO.refundReason;
        this.refuse.isShowDialog = true;
      },
      closeRefuse() {
        this.refuse.isShowDialog = false;
      },

    },
    directives: {
      dragRemark: {
        // 指令的定义
        inserted: function (el) {
          let oDiv = document.getElementById("remark-model");
          let oDivt = document.getElementById("remark-t");
          oDivt.onmousedown = function (ev) {
            let disX = ev.clientX - oDiv.offsetLeft;
            let disY = ev.clientY - oDiv.offsetTop;
            document.onmousemove = function (ev) {
              let l = ev.clientX - disX;
              let t = ev.clientY - disY;
              oDiv.style.left = l + 'px';
              oDiv.style.top = t + 'px';
            };
            document.onmouseup = function () {
              document.onmousemove = null;
              document.onmouseup = null;
            };
          };
        }
      },
      dragReport: {
        // 指令的定义
        inserted: function (el) {
          let oDiv = document.getElementById("report-model");
          let oDivt = document.getElementById("report-t");
          oDivt.onmousedown = function (ev) {
            let disX = ev.clientX - oDiv.offsetLeft;
            let disY = ev.clientY - oDiv.offsetTop;
            document.onmousemove = function (ev) {
              let l = ev.clientX - disX;
              let t = ev.clientY - disY;
              oDiv.style.left = l + 'px';
              oDiv.style.top = t + 'px';
            };
            document.onmouseup = function () {
              document.onmousemove = null;
              document.onmouseup = null;
            };
          };
        }
      },
    },
    activated() {
      this.getDataList()
    },
    filters: {
      sliceString(val) {
        if (val) {
          return val.slice(5, 16)
        } else {
          return ""
        }
      }
    },

    watch: {
      tabIndex(val) {
        this.searchParams.currentPage = 1;
        this.getDataList()
      },

      //关闭暂停 播放
      "voiceData.isShowDialog"(val) {
        if (val === false) {
          this.$refs.audio.pause()
        }
      }
    }
  }

</script>
<style scoped lang="less">

  .star-btn-bar {
    text-align: center;
    padding: 10px 10px 0;
  }

  .blue-text {
    color: #409EFF;
    font-size: 12px;
  }

  .el-button--mini {
    padding: 7px 7px;
  }

  .el-button + .el-button {
    margin-left: 5px;
  }

  .dialog-btn-row {
    text-align: right;
    padding: 15px 0 0 0
  }

  .remark-short-cut {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 130px;
  }

  .voice-list {
    height: 32px;
    padding: 15px;
    border-bottom: 1px solid #e9e9e9;
  }

  .voice-content {
    padding: 0 15px;
    max-height: 320px;
    overflow-y: auto;
    min-height: 150px;
  }

  .createdTime {
    float: left;
    width: 210px;
    line-height: 34px;
    text-align: center;
    margin-right: 100px;
    height: 34px;
  }

  .voice-bar {
    float: left;
    width: 240px;
    line-height: 34px;
    height: 34px;
    border-radius: 6px;
    position: relative;
    background-color: #4fb136;
    cursor: pointer
  }

  .voice-icon {
    color: #fff;
    font-size: 22px;
    float: left;
    margin-left: 10px;
  }

  .during {
    float: right;
    color: #fff;
    font-size: 14px;
    margin-right: 10px;
  }

  .self-page-container {
    text-align: center;
    padding: 15px;
  }

  .remark-model {
    position: fixed;
    width: 400px;
    left: e("calc(50% - 200px)");;
    top: 100px;
    background-color: #f3f3f3;
    z-index: 100;
    border: 1px solid #e6e6e6;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
  }

  .report-model {
    position: fixed;
    width: 64%;
    left: 18%;
    top: 100px;
    background-color: #f3f3f3;
    z-index: 100;
    border: 1px solid #e6e6e6;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
  }

  .model-title {
    line-height: 32px;
    font-size: 20px;
    color: #333;
    font-weight: normal;
    padding: 10px 20px;
    cursor: move
  }

  .close-model-btn {
    position: absolute;
    top: 16px;
    right: 20px;
    font-size: 20px;
    cursor: pointer
  }

  .remark-content-box {
    padding: 0 20px 10px;
  }

  .movedown-enter-active, .movedown-leave-active {
    transition: all 0.5s linear;
  }

  .movedown-enter, .movedown-leave-active {
    transform: translateY(-400px);
  }

  .star-bar {
    padding-left: 80px;
    position: relative;
    margin-bottom: 10px;
    .comment-note {
      position: absolute;
      left: 0;
      top: 0
    }
    .comment-text {
      line-height: 24px;
      font-size: 14px;
      color: #333;
      min-height: 24px;
    }
  }
</style>
