<template>
  <div
    class="transfer-style"
    v-loading="loading2"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <el-form :inline="true" :model="searchParams" class="demo-form-inline">
      <el-form-item label="客户名称：">
        <el-input placeholder="客户名称" v-model="searchParams.realName"></el-input>
      </el-form-item>
      <el-form-item label="注册手机号：">
        <el-input placeholder="手机号" v-model="searchParams.mobile"></el-input>
      </el-form-item>
      <el-form-item label="订单号码：">
        <el-input placeholder="订单号" v-model="searchParams.orderCode"></el-input>
      </el-form-item>

      <el-form-item label="服务医生：">
        <el-select v-model="searchParams.insDoctorId" filterable clearable placeholder="请选择服务医生">
          <el-option
            v-for="item in doctorListData"
            :key="item.insDoctorId"
            :label="item.name"
            :value="item.insDoctorId">
          </el-option>
        </el-select>


        <!--<el-input placeholder="请输入服务医生" v-model="searchParams.orderCode"></el-input>-->
      </el-form-item>

      <el-form-item label="预约时间">
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
        <el-button type="primary" @click="exportList">导出列表</el-button>
      </el-form-item>
    </el-form>
    <!--tab-->
    <el-tabs v-model="tabIndex" @tab-click="handleClick">
      <el-tab-pane label="修改预约时间" name="1">
      </el-tab-pane>
      <el-tab-pane label="待分配" name="2">
      </el-tab-pane>
      <el-tab-pane label="服务订单监督" name="3">
      </el-tab-pane>
    </el-tabs>


    <el-table
      :data="orderArr"
      border
      style="width: 100%">
      <el-table-column show-overflow-tooltip prop="" label="序号" width="50" type="index"></el-table-column>
      <el-table-column show-overflow-tooltip prop="appendInfoModel.mobile" label="客户电话"></el-table-column>
      <el-table-column show-overflow-tooltip prop="appendInfoModel.customerName"
                       label="客户姓名"></el-table-column>
      <el-table-column show-overflow-tooltip prop="orderCode" label="订单编号"></el-table-column>
      <el-table-column show-overflow-tooltip prop="itemName" label="服务名称">
        <template slot-scope="scope">
          <span style="color:#F56C6C" v-if="colorStatus(scope.row.itemName)">{{scope.row.itemName}}</span>
          <span v-else>{{scope.row.itemName}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="name" label="服务医生"></el-table-column>
      <el-table-column show-overflow-tooltip prop="createTime" label="下单时间" width="90">
        <template slot-scope="scope">
          <em class="appointment-time">{{scope.row.createTime | sliceString}}</em>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="服务状态">
        <template slot-scope="scope">
          <service-status :orderDetailMsg="scope.row.appendInfoModel"></service-status>
          <!--          <el-tag type="primary" v-if="scope.row.serviceStatusStr ==='待服务'">待服务</el-tag>
                    <el-tag type="warning" v-if="scope.row.serviceStatusStr ==='客户忙待联系'">客户忙</el-tag>
                    <el-tag type="success" v-if="scope.row.serviceStatusStr ==='已拨打电话'">已拨打</el-tag>-->
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="期待服务时间" v-if="tabIndex==='2'">
        <template slot-scope="scope">
          <em class="appointment-time">{{scope.row.expectTimeStr}}</em>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="orderCreateTime" label="预约时间">
        <template slot-scope="scope">
          <em class="appointment-time">{{scope.row.appendInfoModel.appointmentStartTime |
            sliceString}}--{{scope.row.appendInfoModel.appointmentEndTime | sliceString}}</em>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip v-if="tabIndex==='3'" label="服务时间">
        <template slot-scope="scope">
          <span>{{scope.row.lastUpdateTime | sliceDate}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="appendInfoModel.remark" label="备注"></el-table-column>
      <el-table-column label="操作" width="240" fixed="right">
        <template slot-scope="scope">
          <div v-if="tabIndex==='1'">
            <el-button size="mini" type="primary" @click="showReportFn(scope.row)">报告</el-button>
            <el-button size="mini" type="success" @click="showAppointmentDialog(scope.row)">改时间</el-button>
            <el-button size="mini" type="warning" @click="callFn(scope.row)">电话</el-button>
          </div>
          <div v-if="tabIndex==='2'">
            <el-button size="mini" type="primary" @click="showReportFn(scope.row)">报告</el-button>
            <el-button size="mini" type="success" @click="showDispatchDialog(scope.row)">配医生</el-button>
            <el-button size="mini" type="warning" @click="callFn(scope.row)">电话</el-button>
          </div>
          <div v-if="tabIndex==='3'">
            <el-button size="mini" type="primary" @click="showReportFn(scope.row)">报告</el-button>
            <el-button type="success"
                       v-if="scope.row.appendInfoModel.serviceStatus===0"
                       @click="showDispatchDialog(scope.row)" size="mini">分配医生
            </el-button>
            <el-button v-if="scope.row.appendInfoModel.serviceStatus===3" type="success"
                       @click="_showSaveRemark(scope.row)"
                       size="mini">小结
            </el-button>

            <el-button v-if="scope.row.appendInfoModel.serviceStatus===3" type="primary"
                       @click="showComment(scope.row)" size="mini">评价
            </el-button>

            <el-button v-if="(scope.row.appendInfoModel.serviceStatus===7||scope.row.appendInfoModel.serviceStatus===1)&&scope.row.instruction" type="primary"
                       @click="_showSaveRemark(scope.row)" size="mini">草稿
            </el-button>
            <el-button type="info" disabled v-if="(scope.row.appendInfoModel.serviceStatus===7||scope.row.appendInfoModel.serviceStatus===1)&&!scope.row.instruction"
                       size="mini">草稿
            </el-button>

            <el-button v-if="scope.row.whetherExpire&&scope.row.appendInfoModel.serviceStatus===7" type="success"
                       @click="addPool(scope.row)" size="mini">预约池
            </el-button>
            <el-button type="info" disabled v-if="!scope.row.whetherExpire&&scope.row.appendInfoModel.serviceStatus===7"
                       size="mini">预约池
            </el-button>

          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="self-page-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchParams.currentPage"
        :page-sizes="[10,20]"
        :page-size="searchParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </div>
    <!--预约-->
    <el-dialog title="预约时间" :visible.sync="appointment.isShowDialog" width="640px">
      <ul class="appointment-content">
        <li class="appointment-bar">
          <strong class="appointment-note">日期：</strong>
          <div class="appointment-left">
            <el-date-picker
              v-model="appointment.date_time"
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
                v-model="appointment.startTime"
                :picker-options="{start: '07:00',step: '00:60',end: '23:00'}"
                placeholder="开始时间">
              </el-time-select>
            </div>
            <div class="self-select-time">
              <el-time-select
                v-model="appointment.endTime"
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

    <!--分配医生-->
    <el-dialog title="分配医生" :visible.sync="dispatch.isShowDialog" width="280px">
      <div class="dispatch-content">
        <el-select v-model="dispatch.doctorItem" value-key="providerId" placeholder="请选择">
          <el-option v-for="item in dispatch.doctorList" :key="item.providerId" :label="item.providerName"
                     :value="item"></el-option>
        </el-select>

      </div>
      <div class="content-foot">
        <el-button type="primary" @click="saveDispatch" size="small">确定</el-button>
        <el-button type="warning" @click="cancelDispatchDialog" size="small">取消</el-button>
      </div>
    </el-dialog>

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
              <el-input type="textarea" readonly :rows="5" v-model="saveRemark.remarkValue"
                        placeholder="暂无备注"></el-input>
            </el-tab-pane>
            <el-tab-pane label="报告小结" name="2">
              <el-input type="textarea" readonly :rows="5" v-model="saveRemark.briefSummary"
                        placeholder="暂无报告小结"></el-input>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </transition>
    <!--评价详情 dialog-->
    <el-dialog title="评价详情" :visible.sync="comment.isShowDialog" width="650px">
      <ul>
        <li class="star-bar">
          <strong class="comment-note">评价星级</strong>
          <star :star="+comment.score"></star>
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
  </div>
</template>

<script>
  // import report from '@/components/report.vue';
  import report from '@/components/reportNew.vue';
  import star from '@/components/star/star.vue';
  import {
    ERR_OK,
    getSlipOrder,
    updateAppointmentTime,
    getMultpleDoctor,
    getSingerDoctor,
    dispatchDoctor,
    getReportData,
    timeOrderCall,
    JoinAppointmentPool,
    saveRemark,
    getDoctorList,
    customerPersonnelToAccountCall
  } from '@/api/api';
  import {getStore,EncodeDoctorId} from "@/config/mUtils.js";
  import {API_EXPORT_APPOINTMENT_EXCEL} from '@/config/env'
  import ServiceStatus from '@/components/ServiceStatus'

  export default {
    name: "transfer_order",
    data() {
      return {
        reportParams: {},
        reportData: {},
        isShowReport: false,//是否显示体检报告
        rangeTime: "",
        totalCount: 0,
        //搜索参数
        searchParams: {
          realName: "",
          mobile: "",
          orderCode: "",
          pageSize: 10,
          currentPage: 1,
          insDoctorId: ''
        },
        tabIndex: "1",
        //预约时间
        appointment: {
          isShowDialog: false,
          date_time: "",
          startTime: "",
          endTime: "",
          doctorId: "",
          id: "",
          tradeDetailId: ""
        },
        //过期订单
        orderArr: [],
        //分配医生
        dispatch: {
          isShowDialog: false,
          doctorItem: {
            providerId: "",
            insProportions: "",
          },
          insDoctorId: "",//绑定id
          id: "",//主键id
          tradeDetailId: "",
          doctorId: "",//
          productId: "",
          //医生列表
          doctorList: []
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
        //评价详情
        comment: {
          isShowDialog: false,
          score: "5",
          text: "评价详情评价详情评价详情评价详情评价详情评价详情评价详情评价详情评价详情评价详情评价详情"
        },
        doctorListData: [],
        loading2:false,
        doubleClick:true
      }
    },
    components: {
      report,
      ServiceStatus,
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
      /*tab栏切换*/
      handleClick() {
        this.resetParams();
        this.getOrderListFn()
      },
      /*获取所有已认证的医生列表*/
      selDoctorList() {
        let params = {};
        getDoctorList(params).then((res) => {
          if (res.code === ERR_OK) {
            this.doctorListData = res.data;
          }
        })
      },
      //搜索
      doSearch() {
        this.searchParams.currentPage = 1;
        this.searchParams.pageSize = 10;
        this.getOrderListFn();
      },
      //重置
      resetParams() {
        this.searchParams.realName = "";
        this.searchParams.mobile = "";
        this.searchParams.orderCode = "";
        this.rangeTime = "";
        this.searchParams.insDoctorId = ""
        this.searchParams.currentPage = 1;
        this.searchParams.pageSize = 10;
      },
      /*导出列表*/
      exportList() {
        let listMsg = this.orderArr;
        let params = {
          currentPage: this.searchParams.currentPage || '',
          pageSize: this.searchParams.pageSize || '',
          customerName: this.searchParams.realName || '',
          mobile: this.searchParams.mobile || '',
          orderCode: this.searchParams.orderCode || '',
          orderServiceStatus: this.tabIndex || '',
          startTime: this.searchParams.startTime || '',
          endTime: this.searchParams.endTime || '',
          doctorId: this.searchParams.insDoctorId || ''
        };
        let paramString =
          'currentPage=' + params.currentPage +
          '&pageSize=' + params.pageSize +
          '&customerName=' + params.customerName +
          '&mobile=' + params.mobile +
          '&orderCode=' + params.orderCode +
          '&orderServiceStatus=' + params.orderServiceStatus +
          '&startTime=' + params.startTime +
          '&endTime=' + params.endTime +
          '&doctorId=' + params.doctorId;
        var url = API_EXPORT_APPOINTMENT_EXCEL + '?' + paramString.toString();
        if (listMsg.length > 0) {
          window.open(url);
        } else {
          this.$alert('暂无数据导出', '提示')
        }
      },
      //获取all订单列表
      getOrderListFn() {
        this.loading2 = true;
        if (this.rangeTime) {
          this.searchParams.startTime = this.rangeTime[0];
          this.searchParams.endTime = this.rangeTime[1];
        } else {
          this.searchParams.startTime = "";
          this.searchParams.endTime = "";
        }
        let params = {
          currentPage: this.searchParams.currentPage,
          customerName: this.searchParams.realName,
          endTime: this.searchParams.endTime,
          startTime: this.searchParams.startTime,
          mobile: this.searchParams.mobile,
          orderCode: this.searchParams.orderCode,
          orderServiceStatus: this.tabIndex,
          pageSize: this.searchParams.pageSize,
          insDoctorId: this.searchParams.insDoctorId
        };
        if(this.doubleClick){
          this.doubleClick = false;
          getSlipOrder(params).then(res => {
            if (res.code === ERR_OK) {
              this.orderArr = res.data.list;
              this.totalCount = res.data.totalCount;
              this.loading2 = false;
              this.doubleClick = true;
            } else {
              this.loading2 = false;
              this.doubleClick = true;
              this.$alert(res.msg, '提示', {
                confirmButtonText: '确定',
              })
            }
          }).catch(err => {
            this.loading2 = false;
            this.doubleClick = true;
            this.$alert(err.msg, '提示', {
              confirmButtonText: '确定',
            })
          });
        }
      },
      /*选择当前页条数*/
      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this.getOrderListFn();
      },
      /*选择当前页*/
      handleCurrentChange(val) {
        this.searchParams.currentPage = val;
        this.getOrderListFn();
      },
      //打电话
      callFn(item) {
        this.$confirm('确定要拨打电话吗?', '打电话', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            userId: EncodeDoctorId(JSON.parse(getStore("userMesage")).userId),
            tradeDetailId: item.tradeDetailId
          };
          if(this.tabIndex==='1'){
            this.poolCall(params);
          }else if(this.tabIndex==='2'){
            this.callUser(params);
          }
        }).catch(() => {

        });
      },
      /*预约池打电话*/
      poolCall(params){
        const loading = this.$loading({
          lock: true,
          text: '正在拨通...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        timeOrderCall(params).then(res => {
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
      },
      /*待分配打电话*/
      callUser(params){
        const loading = this.$loading({
          lock: true,
          text: '正在拨通...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        customerPersonnelToAccountCall(params).then(res => {
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
      },
      //显示预约dialog
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
      //保存预约时间
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
        if(this.doubleClick){
          this.doubleClick = false;
          this.loading2 = true;
          updateAppointmentTime(params).then(res => {
            if (res.code === ERR_OK) {
              this.appointment.isShowDialog = false;
              this.doubleClick = true;
              this.loading2 = false;
              this.$alert(res.msg, '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.getOrderListFn()
                }
              })
            } else {
              this.doubleClick = true;
              this.loading2 = false;
              this.$alert(res.msg, '提示', {
                confirmButtonText: '确定',
              })
            }
          }).catch(err => {
            this.doubleClick = true;
            this.loading2 = false;
            this.$alert(err.msg, '提示', {
              confirmButtonText: '确定',
            })
          });
        }

      },
      //取消分配
      cancelAppointment() {
        this.appointment.isShowDialog = false;
      },
      //取消医生
      cancelDispatchDialog() {
        this.dispatch.isShowDialog = false;
      },
      //显示分配医生dialog
      showDispatchDialog(item) {
        this.dispatch.doctorId = item.doctorId;
        this.dispatch.productId = item.productId;
        this.dispatch.id = item.id;
        this.dispatch.tradeDetailId = item.tradeDetailId;
        this.getMultpleDoctorFn();
        this.dispatch.isShowDialog = true;
      },
      //保存分配医生
      saveDispatch() {
        let params = {
          doctorId: this.dispatch.doctorItem.providerId,
          id: this.dispatch.id,
          insProportions: this.dispatch.doctorItem.insProportions,
          tradeDetailId: this.dispatch.tradeDetailId
        };
        this.loading2 = true;
        if(this.doubleClick){
          this.doubleClick = false;
          dispatchDoctor(params).then(res => {
            if (res.code === ERR_OK) {
              this.doubleClick = true;
              this.loading2 = false;
              this.dispatch.isShowDialog = false;
              this.$alert(res.msg, '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.getOrderListFn()
                }
              })
            } else {
              this.doubleClick = true;
              this.loading2 = false;
              this.$alert(res.msg, '提示', {
                confirmButtonText: '确定',
              })
            }
          }).catch(err => {
            this.doubleClick = true;
            this.loading2 = false;
            this.$alert(err.msg, '提示', {
              confirmButtonText: '确定',
            })
          });
        }

      },
      //获取多个医生
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
      //点击显示体检报告详情
      showReportFn(item) {
        let params = {
          workNo: item.appendInfoModel.workNo,
          checkUnitCode: item.appendInfoModel.checkUnitCode
        };
        this.loading2 = true;
        if(this.doubleClick){
          this.doubleClick = false;
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
              this.doubleClick = true;
              this.loading2 = false;
            } else {
              this.$alert(res.msg, '提示', {
                confirmButtonText: '确定',
              })
              this.doubleClick = true;
              this.loading2 = false;
            }
          }).catch(err => {
            this.$alert(err.msg, '提示', {
              confirmButtonText: '确定',
            });
            this.doubleClick = true;
            this.loading2 = false;
          });
        }

      },
      /*关闭体检报告*/
      closeReport() {
        this.isShowReport = false;
      },
      //显示备注dialog
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
      //关闭备注
      closeRemark() {
        this.saveRemark.isShowDialog = false;
      },
      //提交备注
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
      //提交服务小结
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
      //显示评价详情
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
      //关闭评价dialog
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
          this.loading2 = true;
          if(this.doubleClick){
            this.doubleClick = false;
            JoinAppointmentPool(params).then((res) => {
              if (res.code === ERR_OK) {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                });
                this.loading2 = false;
                this.doubleClick = true;
                this.getOrderListFn();
              } else {
                this.$message({
                  type: 'info',
                  message: '添加失败'
                });
                this.loading2 = false;
                this.doubleClick = true;
                this.getOrderListFn();
              }

            }).catch((err)=>{
              this.loading2 = false;
              this.doubleClick = true;
              this.$message({
                type: 'info',
                message: err.msg
              });
            })
          }
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
    },
    activated() {
      let whetherAllocationPermissions = JSON.parse(getStore("userMesage")).whetherAllocationPermissions;
      if (!whetherAllocationPermissions) {
        this.$router.replace("doctor_index");
        return;
      }
      this.getOrderListFn();
      this.selDoctorList()
    },

    filters: {
      sliceString(val) {
        if (val) {
          return val.slice(5, 16)
        } else {
          return ""
        }
      },
      sliceDate(val) {
        if (val) {
          return val.slice(0, 19)
        } else {
          return ""
        }
      }
    }
  }
</script>
<style scoped lang="less">
  .transfer-style  /deep/ .el-tabs__header{
    margin-bottom:0;
  }
  .transfer-style{
    position: absolute;
    left:15px;
    right:15px;
    top:15px;
    bottom:17px;
  }
  .dispatch-content {
    padding: 0 20px 20px;
  }

  .self-page-container {
    text-align: center;
    padding-top: 15px;
  }

  .appointment-time {
    color: #409EFF;
    font-size: 12px;
  }

  .content-foot {
    text-align: center;
  }

  .appointment-content {
    .appointment-bar {
      height: 40px;
      margin-bottom: 15px;
      .appointment-note {
        line-height: 40px;
        float: left;
        width: 80px;
        color: #444;
      }
      .appointment-left {
        margin-left: 80px;
        .self-select-time {
          display: inline-block;
          margin-right: 20px
        }
      }
    }
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
</style>
