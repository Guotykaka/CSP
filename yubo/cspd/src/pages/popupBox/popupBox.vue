<template>
  <div class="popup-box">
    <!--预约-->
    <slot name="appointment">
      <el-dialog title="预约时间" :visible.sync="appointmentBox.isShowDialog" width="640px">
        <ul class="appointment-content">
          <li class="appointment-bar">
            <strong class="appointment-note">日期：</strong>
            <div class="appointment-left">
              <el-date-picker
                v-model="appointmentBox.date_time"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :editable=false
              >
              </el-date-picker>
            </div>
          </li>
          <li class="appointment-bar">
            <strong class="appointment-note">时间：</strong>
            <div class="appointment-left">
              <div class="self-select-time">
                <el-time-select
                  v-model="appointmentBox.startTime"
                  :picker-options="{start: '07:00',step: '00:60',end: '23:00'}"
                  placeholder="开始时间">
                </el-time-select>
              </div>
              <div class="self-select-time">
                <el-time-select
                  v-model="appointmentBox.endTime"
                  :picker-options="{start: '07:00',step: '00:60',end: '23:00'}"
                  placeholder="结束时间">
                </el-time-select>
              </div>
            </div>
          </li>
        </ul>
        <div class="content-foot">
          <el-button type="primary" @click="saveAppointment" size="small">确定</el-button>
          <el-button type="warning" @click="cancelAppointment" size="small">取消</el-button>
        </div>
      </el-dialog>
    </slot>
    <!--分配医生-->
    <slot name="dispatch">
      <el-dialog title="分配医生" :visible.sync="dispatchBox.isShowDialog" width="280px">
        <div class="dispatch-content">
          <el-select v-model="dispatchBox.doctorItem" value-key="providerId" placeholder="请选择">
            <el-option v-for="item in dispatchBox.doctorList" :key="item.providerId" :label="item.providerName"
                       :value="item"></el-option>
          </el-select>

        </div>
        <div class="content-foot">
          <el-button type="primary" @click="saveDispatch" size="small">确定</el-button>
          <el-button type="warning" @click="cancelDispatchDialog" size="small">取消</el-button>
        </div>
      </el-dialog>
    </slot>
    <!--体检报告弹窗-->
    <slot name="reportDateBox">
      <transition name="movedown">
        <div class="report-model" v-show="isShowReport" id="report-model">
          <i class="close-model-btn el-icon-close" @click="closeReport"></i>
          <h3 class="model-title" id="report-t" v-dragReport>体检报告</h3>
          <div class="report-content-box">
            <report v-if="isShowReport" :reportData="reportData"></report>
          </div>
        </div>
      </transition>
    </slot>
    <!--备注-->
    <slot name="remark">
      <transition name="movedown">
        <div class="remark-model" v-show="saveRemark.isShowDialog" id="remark-model">
          <i class="close-model-btn el-icon-close" @click="closeRemark"></i>
          <h3 class="model-title" id="remark-t" v-dragRemark>备注</h3>
          <div class="remark-content-box">
            <el-tabs v-model="saveRemark.remarkTabIndex">
              <el-tab-pane label="客户忙待联系" name="1">
                <el-input type="textarea" :rows="5" v-model="saveRemark.remarkValue" placeholder="请填写备注"></el-input>
                <div class="dialog-btn-row">
                  <el-button type="primary" size="mini" @click="submitRemark">保存</el-button>
                </div>
              </el-tab-pane>
              <el-tab-pane label="完成通话" name="2">
                <el-input type="textarea" :rows="5" v-model="saveRemark.briefSummary" placeholder="请填写服务小结" v-if="saveRemark.orderServiceStatus == 0 || saveRemark.orderServiceStatus == 1"></el-input>
                <div class="dialog-btn-row">
                  <el-button type="primary" size="mini" @click="submitBriefSummary">提交</el-button>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </transition>
    </slot>
    <!--评价详情 dialog-->
    <slot name="commentBox">
      <el-dialog title="评价详情" :visible.sync="commentBox.isShowDialog" width="650px">
        <ul>
          <li class="star-bar">
            <strong class="comment-note">评价星级</strong>
            <star :star="commentBox.score"></star>
          </li>
          <li class="star-bar">
            <strong class="comment-note">评价内容</strong>
            <p class="comment-text">{{commentBox.text}}</p>
          </li>
        </ul>
        <div class="star-btn-bar">
          <el-button type="primary" size="small" @click="closeComment">关闭</el-button>
        </div>
      </el-dialog>
    </slot>
  </div>
</template>

<script>
  // import report from '@/components/report.vue';
  import report from '@/components/reportNew.vue';
  import {
    ERR_OK,
    getSingerDoctor,
    dispatchDoctor,
    getReportData,
    timeOrderCall
  } from '@/api/api';
  export default {
    name: "popupBox",
    props:{
      appointmentBox:{
        type:Object,
        default:{}
      },
      dispatchBox:{
        type:Object,
        default:{}
      },
      reportParams:{
        type:Object,
        default:{}
      },
      saveRemark:{
        type:Object,
        default:{}
      },
      commentBox:{
        type:Object,
        default:{}
      }
    },
    components: {
      report
    },
    data() {
      return {
        isShowReport: false,
        reportData:{}
      }
    },
    methods:{
      /*点击显示体检报告详情*/
      showReport(val) {
        let params = {
          workNo: val.appendInfoModel.workNo,
          checkUnitCode: val.appendInfoModel.checkUnitCode
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
      /*显示预约dialog*/
      showAppointmentDialog(item) {
        let timeSpan = new Date();
        let year = timeSpan.getFullYear().toString();
        let month = (timeSpan.getMonth() + 1).toString().padStart(2, "0");
        let day = timeSpan.getDate().toString().padStart(2, "0");
        let startHourTime = (timeSpan.getHours() + 1).toString().padStart(2, "0") + ":00";
        let endHourTime = (timeSpan.getHours() + 2).toString().padStart(2, "0") + ":00";
        this.appointment.date_time = year + "-" + month + "-" + day;
        this.appointment.startTime = startHourTime;
        this.appointment.endTime = endHourTime;
        this.appointment.id = item.id;
        this.appointment.tradeDetailId = item.tradeDetailId;
        this.appointment.doctorId = item.doctorId;
        this.appointment.isShowDialog = true;
      },
      /*保存 预约时间*/
      saveAppointment() {
        let params = {
          appointmentEndTime: this.appointment.date_time + " " + this.appointment.endTime,
          appointmentStartTime: this.appointment.date_time + " " + this.appointment.startTime,
          doctorId: this.appointment.doctorId,
          id: this.appointment.id,
          insProportions: "",
          tradeDetailId: this.appointment.tradeDetailId
        };

        //开始结束比较
        if (parseInt(this.appointment.startTime.slice(0, 2)) >= parseInt(this.appointment.endTime.slice(0, 2))) {
          this.$alert("开始时间不能大于结束时间", '提示', {
            confirmButtonText: '确定',
          });
          return;
        }

        let current_time_arr = [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate(), new Date().getHours()];
        let start_time_arr = (this.appointment.date_time.split("-"));
        start_time_arr.push(this.appointment.startTime.slice(0, 2));


        let isLarge = false;

        //开始 当前比较
        for (let i = 0; i < current_time_arr.length; i++) {
          if (current_time_arr[i] > parseInt(start_time_arr[i])) {
            this.$alert("预约时间不能小于当前时间", '提示', {
              confirmButtonText: '确定',
            });
            isLarge = true;
            break;
          } else if (current_time_arr[i] < parseInt(start_time_arr[i])) {
            isLarge = false;
            break;
          }
        }
        if (isLarge) {
          return
        }
        updateAppointmentTime(params).then(res => {
          if (res.code === ERR_OK) {
            this.appointment.isShowDialog = false;
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.getOrderListFn()
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
      },
      /*取消分配*/
      cancelAppointment() {
        this.appointment.isShowDialog = false;
      },
      /*取消医生*/
      cancelDispatchDialog() {
        this.dispatch.isShowDialog = false;
      },
      /*显示分配医生dialog*/
      showDispatchDialog(item) {
        this.dispatch.doctorId = item.doctorId;
        this.dispatch.productId = item.productId;
        this.dispatch.id = item.id;
        this.dispatch.tradeDetailId = item.tradeDetailId;
        this.getMultpleDoctorFn();
        this.dispatch.isShowDialog = true;
      },
      /*保存分配医生*/
      saveDispatch() {
        let params = {
          doctorId: this.dispatch.doctorItem.providerId,
          id: this.dispatch.id,
          insProportions: this.dispatch.doctorItem.insProportions,
          tradeDetailId: this.dispatch.tradeDetailId
        };
        dispatchDoctor(params).then(res => {
          if (res.code === ERR_OK) {
            this.dispatch.isShowDialog = false;
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.getOrderListFn()
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
      },
      /*获取多个医生*/
      getMultpleDoctorFn() {
        let params = {
          doctorId: this.dispatch.doctorId,
          productId: this.dispatch.productId,
        };
        getMultpleDoctor(params).then(res => {
          if (res.code === ERR_OK) {
            this.dispatch.doctorList = res.data;
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
      /*点击显示体检报告详情*/
      showReportFn(item) {
        this.reportParams = item;
        // this.$refs.popupChild.showReport();
        let params = {
          workNo: item.appendInfoModel.workNo,
          checkUnitCode: item.appendInfoModel.checkUnitCode
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
      /*关闭体检报告*/
      closeReport() {
        this.isShowReport = false;
      },
      /*显示备注dialog*/
      _showSaveRemark(item) {
        // this.saveRemark.isWrite=(item.phoneConsultOrderDetailDTO.remark ? false : true);
        this.saveRemark.remarkTabIndex = "1";
        this.saveRemark.tradeDetailId = item.tradeDetailId;
        this.saveRemark.serviceStatus = item.appendInfoModel.serviceStatus;
        this.saveRemark.remarkValue = item.appendInfoModel.remark;
        this.saveRemark.briefSummary = item.instruction;
        this.saveRemark.cspOrderId = item.orderId;
        this.saveRemark.cspCustomId = item.cspCustomId;
        this.saveRemark.doctorId = item.doctorId;
        this.saveRemark.isShowDialog = true;
      },
      /*关闭备注*/
      closeRemark() {
        this.saveRemark.isShowDialog = false;
      },
      /*提交备注*/
      submitRemark() {
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
      /*提交服务小结*/
      submitBriefSummary(val) {
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
      /*显示评价详情*/
      showComment(item) {
        if (!item.insOrderCommentId) {
          this.$alert("暂无评论", '提示', {
            confirmButtonText: '确定',
          });
          return;
        }

        this.comment.score = item.commentGrade;
        this.comment.text = item.commentContent;
        this.comment.isShowDialog = true;
      },
      /*关闭评价dialog*/
      closeComment() {
        this.comment.isShowDialog = false;
      },
      /*加入预约池*/
      addPool(val) {
        let params = {
          id: val.tradeDetailId
        };
        this.$confirm('此操作将订单加入预约池, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          JoinAppointmentPool(params).then((res) => {
            if (res.code === ERR_OK) {
              this.$message({
                type: 'success',
                message: '添加成功!'
              });
              this.getOrderListFn();
            } else {
              this.$message({
                type: 'info',
                message: '添加失败'
              });
              this.getOrderListFn();
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消添加'
          });
        });

      }
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
    }
  }
</script>

<style scoped>
  .remark-model{position: fixed;width: 400px;left:e("calc(50% - 200px)");;top:100px;background-color: #f3f3f3;
    z-index: 100;border: 1px solid #e6e6e6;border-radius: 4px;box-shadow: 0 1px 3px rgba(0,0,0,.3);}
  .report-model{position: fixed;width:64%;left:18%;top:100px;background-color: #f3f3f3;
    z-index: 100;border: 1px solid #e6e6e6;border-radius: 4px;box-shadow: 0 1px 3px rgba(0,0,0,.3);}
  .model-title{line-height: 32px;font-size: 20px;color: #333;font-weight: normal;padding: 10px 20px;cursor: move}
  .close-model-btn{position: absolute;top:16px;right: 20px;font-size: 20px;cursor: pointer}
  .remark-content-box{padding: 0 20px 10px;}
  .movedown-enter-active, .movedown-leave-active{transition: all 0.5s linear;}
  .movedown-enter,.movedown-leave-active{transform: translateY(-400px);}
</style>
