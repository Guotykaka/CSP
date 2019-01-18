<template>
  <div id="image-text" class="imgText_consult imgtext-main">
    <el-dialog :show-close="false" :visible.sync="maskShow" width="60%" center class="detailRemark">
      <el-tabs v-model="detailName" @tab-click="detailClick">
        <el-tab-pane label="详细" name="first">
          <el-form v-if="detailText.imgTextConsultOrderDetailDTO" :model="detailText" :label-width="formLabelWidth"
                   style="width:80%;">
            <el-form-item label="客户手机号：">
              <span>{{detailText.imgTextConsultOrderDetailDTO.mobile||"暂无数据"}}</span>
            </el-form-item>
            <el-form-item label="订单号：">
              <span>{{detailText.imgTextConsultOrderDetailDTO.orderCode||"暂无数据"}}</span>
            </el-form-item>
            <el-form-item label="服务名称：">
              <span>{{detailText.imgTextConsultOrderDetailDTO.itemName||"暂无数据"}}</span>
            </el-form-item>
            <el-form-item label="订单日期：">
              <span>{{detailText.imgTextConsultOrderDetailDTO.createTime||"暂无数据"}}</span>
            </el-form-item>
            <el-form-item label="订单金额：">
              <span>{{detailText.imgTextConsultOrderDetailDTO.totalPrice||"暂无数据"}}</span>
            </el-form-item>
            <el-form-item label="备注：">
              <el-input type="textarea" v-model="updataeTradeDetail" :autosize="sizeText"
                        placeholder="输入备注信息，可以帮助您快速回顾历史服务内容"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click.stop="detailClose">取 消</el-button>
              <el-button type="primary" @click.stop="detailSave">保 存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="查看评价" name="second" v-if="insOrderCommentId">
          <el-card>
            <div class="comment-title">评价星级：
              <img-star class="img_star" :star="commentGrade"></img-star>
            </div>
            <div class="comment-desc">
              <span class="desc-title">评价内容：</span>
              <el-input
                type="textarea"
                :rows="5"
                placeholder="请输入内容"
                readonly
                :autosize="sizeText"
                v-model="commentContent">
              </el-input>
            </div>
            <div class="btnComment">
              <el-button type="primary" @click.stop="detailClose">关 闭</el-button>
            </div>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <div class="consult-header">
      <ul>
        <li><span>总订单:{{orderNumber.allCount||0}}单</span></li>
        <li><span>待服务:{{orderNumber.forServiceCount||0}}单</span></li>
        <li><span>服务中:{{orderNumber.inServiceCount||0}}单</span></li>
        <li><span>已完成:{{orderNumber.completedCount||0}}单</span></li>
        <li><span>已失效:{{orderNumber.cancelledCount||0}}单</span></li>
      </ul>
    </div>
    <!--主体部分-->
    <!--信息头部-->
    <div class="msg_main">
      <div class="msgLeft">
        <el-tabs v-model="activeName"
                 :before-leave="tabsLeave"
                 @tab-click="handleClick" stretch class="msgleft-head">
          <el-tab-pane name="first">
            <span slot="label" v-if="orderServiceStatusZ>0">
              <el-badge :value="orderServiceStatusZ" class="item">待服务</el-badge>
            </span>
            <span slot="label" v-else>待服务</span>
          </el-tab-pane>
          <el-tab-pane name="second">
            <span slot="label" v-if="orderServiceStatusT>0">
              <el-badge :value="orderServiceStatusT" class="item">服务中</el-badge>
            </span>
            <span slot="label" v-else>服务中</span>
          </el-tab-pane>
          <el-tab-pane label="已完成" name="third"></el-tab-pane>
          <el-tab-pane label="已失效" name="fourth"></el-tab-pane>
        </el-tabs>
        <div
          style="height:100%;"
          v-loading="orderShowStatus">
          <tableMain
            @detailShow="detailShow"
            @getChatDetail="_getChatDetail"
            :orderList="orderList"
            v-if="orderList&&orderList.list">
          </tableMain>
        </div>
        <div class="pageDetail">
          <el-pagination
            v-if="orderList&&orderList.list&&orderList.list.length>0"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="searchParams.currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="searchParams.pageSize"
            :pager-count="5"
            :small="true"
            layout="total, prev, pager, next"
            :total="totalcount">
          </el-pagination>
          <div v-else class="tipMsg">
            暂无数据
          </div>
        </div>
      </div>
      <div class="msgRight">
        <div class="msgRight-header" v-if="chatCircleMsgShow">
          <span class="fl">{{chatCircleMsg.consultChatDTO.customerName}}</span>
          <span class="fr">{{chatCircleMsg.doctorTradeDetailOrderInfoDTO.createTime}}</span>
        </div>
        <div class="chat-box" v-if="chatCircleMsgShow">
          <div class="chat-main" ref="chatingTo">
            <div class="user-detail">
              <div class="detail-header">
                <div class="fl">
                  <span class="fl">{{chatCircleMsg.consultChatDTO.customerName}}</span>
                  <span class="fl" v-if="chatCircleMsg.consultChatDTO.customerSex===2">女</span>
                  <span class="fl" v-else>男</span>
                  <span class="fl">{{chatCircleMsg.consultChatDTO.customerAge}}岁</span>
                </div>
                <span class="fr">{{chatCircleMsg.consultChatDTO.serviceBeginTime}}</span>
              </div>
              <div class="user-detail-main">
                <span>{{chatCircleMsg.consultChatDTO.customerDesc}}</span>
                <div class="chat-img">
                  <ul @click="showTitleImgs(chatCircleMsg.tradeDetailId)" :id="'img'+chatCircleMsg.tradeDetailId">
                    <li>
                      <img v-if="showDetailImg"
                           :src="value"
                           v-for="(value,ind) in compileCode(chatCircleMsg.consultChatDTO.customerImgs)"
                           :key="ind"
                           alt="" class="img-msg">
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="chating-list">
              <ul>
                <li v-for="(item,index) in chatList" :key="index" v-show="item.msgType!==10&&item.msgType!==11">
                  <div class="fr chat-list-box" v-if="item.sendFlag===1">
                    <div class="userPhotofr fr">
                      <img :src="areaImg||avatar" alt="" class="userPhotoImg">
                    </div>
                    <div class="fr user-circle">
                      <div class="user-main">
                        <span class="parting-line" style="text-align:right;">{{item.sendTime}}</span>
                        <span v-if="item.msgType===4">服务结束，邀请客户确认</span>
                        <span v-if="item.msgType===1||item.msgType===3">{{item.sendMsg}}</span>
                        <ul v-if="item.msgType===2" @click="showImgs(index)" :id="'img'+index">
                          <li>
                            <img :src="item.sendMsg" alt="" class="img-msg">
                          </li>
                        </ul>
                      </div>
                      <span class="minCirclefr"></span>
                    </div>
                  </div>
                  <div class="fl" v-else style="display: block;width: 100%;margin-bottom: 20px;">
                    <div class="userPhotofl fl">
                      <img
                        v-if="chatCircleMsg"
                        :src="chatCircleMsg.doctorTradeDetailOrderInfoDTO.imageSrc||user_b" alt=""
                        style="width:100%;height:100%;border-radius:50%;">
                    </div>
                    <div class="fl store-circle">
                      <div class="store-main">
                        <span class="parting-line" style="text-align:left;">{{item.sendTime}}</span>
                        <span v-if="item.msgType===4">服务结束，邀请客户确认</span>
                        <span v-if="item.msgType===1||item.msgType===3">{{item.sendMsg}}</span>
                        <ul v-if="item.msgType===2" @click="showImgs(index)" :id="'img'+index">
                          <li>
                            <img :src="ite" v-for="(ite,i) in compileCode(item.sendMsg)" :key="i" alt=""
                                 class="img-msg">
                          </li>
                        </ul>
                      </div>
                      <span class="minCirclefl"></span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="chat-input">
          <div class="input-header">
            <label for="upImgBtn" class="upImgBtn-style">添加图片</label>
            <input id="upImgBtn" name="upImgBtn" type="file" @change="upImg" ref="ss">
            <span class="text-right fr" v-if="searchParams.orderServiceStatus===2||searchParams.orderServiceStatus===3"
                  @click="getcomment" :class="{reStyle:msgTypeCount>=3}">服务结束，邀请客户确认</span>
          </div>
          <div class="text-image">
            <div class="addImgBox" v-if="showLogo">
              <div class="addImg">
                <img :src="chatImg" class="img-logo-cicle">
                <!--删除按钮-->
                <span class="delIcon" id="deleteLogo" v-if="showLogo" @click="delLogo">-</span>
              </div>
            </div>
            <textarea v-show="!showLogo" @keyup.ctrl.enter="_upTextSend" placeholder="请输入内容" v-model="showMsg"
                      class="text-area" @click="selmsgType"></textarea>
          </div>
          <div class="btn-main">
            <div class="btn-text" v-if="!showLogo">ctrl+Enter&nbsp;可直接提交发送文字</div>
            <el-button type="primary" size="mini" @click="_upTextSend" @keyup.ctrl.enter="_upTextSend">发送</el-button>
          </div>
        </div>
      </div>
    </div>

    <!--体检报告详情 dialog-->
    <!--    <transition name="movedown">
          <div class="report-model" v-show="isShowReport" id="report-model">
            <i class="close-model-btn el-icon-close" @click="closeReport"></i>
            <h3 class="model-title" id="report-t" v-dragReport>体检报告</h3>
            <div class="report-content-box">
              <report :reportData="reportData"></report>
            </div>
          </div>
        </transition>-->
    <!--体检套餐查看-->
    <!--    <transition name="movedown">
          <div class="report-model" v-show="setMealShow" id="meal-model">
            <i class="close-model-btn el-icon-close" @click="closeMeal"></i>
            <h3 class="model-title" id="meal-t" v-dragMeal>体检套餐</h3>
            <div class="remark-content-box">
              <set-meal :reportSetMeal="reportSetMeal"></set-meal>
            </div>
          </div>
        </transition>-->
  </div>
</template>

<script>
  import tableMain from "@/pages/imgText_consult/tablemain.vue"
  import {getStore, EncodeDoctorId} from "@/config/mUtils.js"
  import {mapState} from "vuex"
  import ImgStar from "@/components/star/star"
  import {
    ERR_OK,
    sendToCustomer,
    updateToInRead,
    queryOrderComment,
    queryInsConsultChatList,
    getOrderNumber,
    countUnReadMsgByOrderStatus,
    imgTextList,
    queryTradeDetail,
    updateTradeDetail,
    youPaiYunUpload,
    YOUPAIYUN_URL,
    getReportData
  } from '@/api/api';
  import {storeManager} from '@/api/util.js';
  export default {
    name: "imageText",
    components: {
      tableMain,
      ImgStar
    },
    data() {
      return {
        reportData:{},//体检报告
        isShowReport:false,//是否显示体检报告
        reportSetMeal:{},//体检套餐
        setMealShow:false,//是否显示体检套餐
        insOrderCommentId: null,//是否显示评价
        commentGrade: 5,
        commentContent: '',
        sizeText: {minRows: 5, maxRows: 6},
        activeName: 'first',
        detailName: 'first',
        totalcount: null,
        userInfo: {},//用户信息
        showMsg: '',
        orderNumber: {},//统计数量
        orderList: {},//用户列表
        updataeTradeDetail: "",//订单详情备注
        detailText: {},//用户订单详情展示
        maskShow: false,
        tradeDetailId: "",//
        chatImg: null,//聊天图片
        showLogo: false,//
        searchParams: {
          currentPage: 1,//页码
          pageSize: 10,//
          providerServiceUserType: 1,
          orderServiceStatus: 0,
          providerServiceUserId: null
        },
        chatCircleMsgShow: false,
        chatCircleMsg: null,//聊天框信息
        chatCircle: false,//是否显示聊天信息
        receiverId: '',//医生id
        orderServiceStatusZ: null,//待服务状态次数
        orderServiceStatusT: null,//服务中状态次数
        cspOrderId: '',//订单id
        cspCustomId: '',//发送用户id
        msgType: 2,//传送信息类型
        chatList: null,
        avatar: require('../../asset/img/logo.jpg'), //用户图片
        user_b: require('../../asset/img/user_b.png'),//用户图片
        docubleClik: true,//双击
        commonStatus: {},//评价服务状态
        commonStatusId: '',//评价服务状态id
        formLabelWidth: '230px',
        orderShowStatus:true
      }
    },
    /*自定义指令*/
    directives: {
      dragReport: {
        // 指令的定义
        inserted: function(el){
          let oDiv =document.getElementById("report-model");
          let oDivt =document.getElementById("report-t");
          oDivt.onmousedown = function(ev){
            let disX = ev.clientX -oDiv.offsetLeft;
            let disY = ev.clientY - oDiv.offsetTop;
            document.onmousemove = function(ev){
              let l = ev.clientX-disX;
              let t = ev.clientY-disY;
              oDiv.style.left = l+'px';
              oDiv.style.top = t+'px';
            };
            document.onmouseup = function(){
              document.onmousemove=null;
              document.onmouseup=null;
            };
          };
        }
      },
      dragMeal: {
        // 指令的定义
        inserted: function(el){
          let oDiv =document.getElementById("meal-model");
          let oDivt =document.getElementById("meal-t");
          oDivt.onmousedown = function(ev){
            let disX = ev.clientX -oDiv.offsetLeft;
            let disY = ev.clientY - oDiv.offsetTop;
            document.onmousemove = function(ev){
              let l = ev.clientX-disX;
              let t = ev.clientY-disY;
              oDiv.style.left = l+'px';
              oDiv.style.top = t+'px';
            };
            document.onmouseup = function(){
              document.onmousemove=null;
              document.onmouseup=null;
            };
          };
        }
      },
    },
    activated() {
      this.userInfo = JSON.parse(getStore('userMesage'));
      this.userInfo.userId = EncodeDoctorId(this.userInfo.userId);
      this.userInfo.insDoctorId = EncodeDoctorId(this.userInfo.insDoctorId);

      this.receiverId = this.userInfo.userId;
      this.searchParams.providerServiceUserId = this.userInfo.insDoctorId;
      // this.avatar = localStorage.getItem("avatar");
      this._getOrderNumber();
      this._getOrderList();
    },
    methods: {
      /*上传到又拍云*/
      upImg() {
        let params = this.$refs.ss;
        let par = params.files[0]
        const isJPG = (par.type === 'image/jpeg') || (par.type === 'image/png');
        const isLt2M = par.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$alert("图片格式只能为JPEG 或者 PNG", '提示', {
            confirmButtonText: '确定',
          });
          return;
        }
        if (!isLt2M) {
          this.$alert("图片大小不能大于2M", '提示', {
            confirmButtonText: '确定',
          });
          return;
        }
        youPaiYunUpload(par).then((res) => {
          if (res.code === 200) {
            this.msgType = 2;
            this.showLogo = true;
            this.chatImg = YOUPAIYUN_URL + res.url
          } else {
            this.$alert('上传失败,请重新上传', '提示');
          }
        })
      },
      /*列表每页显示多少条*/
      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this._getOrderList();
      },
      /*列表跳转第几页*/
      handleCurrentChange(val) {
        this.searchParams.currentPage = val;
        this._getOrderList();
      },
      /*tab栏切换*/
      handleClick(tab) {
        this.searchParams.currentPage = 1;
        this.searchParams.pageSize = 10;
        if (tab.index === '0') {
          this.searchParams.orderServiceStatus = +tab.index
        } else {
          this.searchParams.orderServiceStatus = +tab.index + 1;
        }
        if(!this.orderShowStatus){
          this._getOrderList();
          this._getMsgCount();
        }
      },
      /*详情tab栏切换*/
      detailClick() {

      },
      /*常用语显示列表*/
      _showText: function () {
        this.showText = !this.showText
      },
      /*常用语选择*/
      _upText: function (val) {
        this.showMsg = val;
        this.showText = !this.showText
        this.msgType = 1;
      },
      /*選擇文本傳輸*/
      selmsgType: function () {
        this.msgType = 1;
      },
      /*医生回复客户信息*/
      _upTextSend: function () {
        var that = this;
        if (this.chatCircle && this.searchParams.orderServiceStatus !== 3 && this.searchParams.orderServiceStatus !== 4) {
          var params = null;
          if (this.msgType === 1) {
            params = {
              "cspOrderId": this.cspOrderId,//: 订单id
              "msgType": this.msgType,// 1文本，2图片
              "receiverId": this.cspCustomId, //接收用户ID ,
              "sendMsg": this.showMsg,// 发送内容 ,
              "tradeDetailId": this.tradeDetailId,//
              "senderId": this.receiverId,//发送用户ID
              "userId": this.receiverId,//发送用户ID
              "serviceStatus": this.searchParams.orderServiceStatus
            };
          } else {
            params = {
              "cspOrderId": this.cspOrderId,//: 订单id
              "msgType": this.msgType,// 1文本，2图片
              "receiverId": this.cspCustomId, //接收用户ID ,
              "sendMsg": this.chatImg,// 发送内容 ,
              "tradeDetailId": this.tradeDetailId,//
              "senderId": this.receiverId,//发送用户ID
              "userId": this.receiverId,//发送用户ID
              "serviceStatus": this.searchParams.orderServiceStatus
            };
          }
          if (params.sendMsg === '' || !params.sendMsg) {
            this.$alert('不能发送空白消息', '提示', {
              confirmButtonText: '确定',
            })
          } else if (that.docubleClik) {
            that.docubleClik = false;
            sendToCustomer(params).then((res) => {
              if (res.code === ERR_OK) {
                that.showMsg = '';
                that.chatImg = null;
                that.showLogo = false;
                that.docubleClik = true;
                that.queryInsConsultChatList();
                that._getOrderNumber()
              } else {
                that.docubleClik = true;
                this.$alert(res.msg, '提示', {
                  confirmButtonText: '确定',
                })
              }
            }).catch((err)=>{
              this.$alert(err.msg, '提示', {
                confirmButtonText: '确定',
              })
            })
          }
        } else if (this.searchParams.orderServiceStatus !== 3 && this.searchParams.orderServiceStatus !== 4) {
          this.$alert('请选择聊天对象', '提示', {
            confirmButtonText: '确定',
          });
          return;
        } else if (this.searchParams.orderServiceStatus === 3) {
          this.$alert('咨询状态已完成,不能发送消息', '提示', {
            confirmButtonText: '确定',
          })
        } else if (this.searchParams.orderServiceStatus === 4) {
          this.$alert('咨询状态已失效,不能发送消息', '提示', {
            confirmButtonText: '确定',
          })
          that.showMsg = '';
          that.chatImg = null;
        }
      },
      /*获取相应订单的聊天详情*/
      _getChatDetail: function (item) {
        this.chatCircle = true;
        this.chatCircleMsg = item;
        this.chatCircleMsgShow = true;
        this.cspOrderId = item.doctorTradeDetailOrderInfoDTO.orderId;
        this.tradeDetailId = item.doctorTradeDetailOrderInfoDTO.tradeDetailId;
        this.cspCustomId = item.doctorTradeDetailOrderInfoDTO.cspCustomId;
        var params = {
          "receiverId": this.receiverId,
          "senderId": this.cspCustomId
        };
        this.queryInsConsultChatList();
        //将该客户发给当前医生的未读消息全部更新为已读
        if (item.unReadCount !== '0') {
          updateToInRead(params).then((res) => {
            if (res.code === ERR_OK) {
              this._getMsgCount();
            } else {
              this.$alert(res.msg, '提示', {
                confirmButtonText: '确定',
              })
            }
          }).catch((err)=>{
            this.$alert(err.msg, '提示', {
              confirmButtonText: '确定',
            })
          })
        }
        //查看客户评价服务状态cspOrderId
        this.commonStatusId = this.cspOrderId;
        this.getcommentStatus();
      },
      /*查看用户评价服务状态*/
      getcommentStatus() {
        var par = {
          "cspOrderId": this.commonStatusId,
          "tradeDetailId": this.tradeDetailId
        }
        queryOrderComment(par).then((res) => {
          if (res.code === ERR_OK) {
            this.commonStatus = res.data;
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        }).catch((err)=>{
          this.$alert(err.msg, '提示', {
            confirmButtonText: '确定',
          })
        })
      },
      /*聊天记录分页查询*/
      queryInsConsultChatList() {
        let that = this;
        let params = {
          "cspOrderId": this.cspOrderId,
          "pageSize": 1000,
          "currentPage": 1,
          "senderId": this.receiverId,
          "receiverId": this.cspCustomId
        };
        queryInsConsultChatList(params).then((res) => {
          if (res.code === ERR_OK) {
            that.chatList = res.data.list;
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        }).catch((err)=>{
          this.$alert(err.msg, '提示', {
            confirmButtonText: '确定',
          })
        });
      },
      /*获取顶部统计数量*/
      _getOrderNumber: function () {
        let params = {insDoctorId: this.searchParams.providerServiceUserId},
          that = this;
        getOrderNumber(params).then((res) => {
          if (res.code === ERR_OK) {
            that.orderNumber = res.data;
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        }).catch((err)=>{
          this.$alert(err.msg, '提示', {
            confirmButtonText: '确定',
          })
        });
        this._getMsgCount();
      },
      /*获取顶部状态未读信息的条数*/
      _getMsgCount: function () {
        var paramsZ = {
          "orderServiceStatus": 0,
          "receiverId": this.receiverId
        };
        var paramsT = {
          "orderServiceStatus": 2,
          "receiverId": this.receiverId
        };

        let that = this;
        countUnReadMsgByOrderStatus(paramsZ).then((res) => {
          if (res.code === ERR_OK) {
            that.orderServiceStatusZ = res.data;
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        }).catch((err)=>{
          this.$alert(err.msg, '提示', {
            confirmButtonText: '确定',
          })
        });
        countUnReadMsgByOrderStatus(paramsT).then((res) => {
          if (res.code === ERR_OK) {
            that.orderServiceStatusT = res.data;
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        }).catch((err)=>{
          this.$alert(err.msg, '提示', {
            confirmButtonText: '确定',
          })
        });
      },
      /*图文咨询订单分页查询*/
      _getOrderList() {
        var params = {
          "providerServiceUserId": this.searchParams.providerServiceUserId,
          "providerServiceUserType": this.searchParams.providerServiceUserType,
          "orderServiceStatus": this.searchParams.orderServiceStatus,
          "currentPage": this.searchParams.currentPage,
          "pageSize": this.searchParams.pageSize
        };
        this.chatCircleMsgShow = false;
        let that = this;
        this.orderList = {};
        this.orderShowStatus = true;
        imgTextList(params).then((res) => {
          if (res.code === ERR_OK) {
            that.orderList = res.data;
            if (res.data && res.data.totalCount) {
              that.totalcount = res.data.totalCount;
            } else {
              that.totalcount = 1;
            }
            this.orderShowStatus = false
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
            this.orderShowStatus = false
          }
        }).catch((err)=>{
          this.orderShowStatus = false
          this.$alert(err.msg, '提示', {
            confirmButtonText: '确定',
          })
        })
      },
      /*判断tabs标签能不能调转*/
      tabsLeave(){
        return !this.orderShowStatus
      },
      /*详细信息展示*/
      detailShow(val) {
        this.maskShow = true;
        this.detailName = 'first'
        this.tradeDetailId = val.tradeDetailId;
        this.insOrderCommentId = val.insOrderCommentId;
        this.commentGrade = val.commentGrade;
        this.commentContent = val.commentContent;


        if (this.maskShow) {
          let params = {"tradeDetailId": val.tradeDetailId};
          queryTradeDetail(params).then((res) => {
            if (res.code === ERR_OK) {
              this.detailText = res.data;
              this.updataeTradeDetail = res.data.consultChatDTO.remark;
              this.commentContent = res.data.imgTextConsultOrderDetailDTO.commentContent;
            } else {
              this.$alert(res.msg, '提示', {
                confirmButtonText: '确定',
              })
            }
          })
        }
      },
      /*关闭详情弹框*/
      detailClose() {
        this.maskShow = false;
        this.updataeTradeDetail = ''
      },
      /*保存数据*/
      detailSave() {
        this.maskShow = false;
        var params = {
          "tradeDetailId": this.tradeDetailId,
          "remark": this.updataeTradeDetail
        };
        updateTradeDetail(params).then((res) => {
          if (res.code === ERR_OK) {
            this.detailText = res.data;
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        }).catch((err)=>{
          this.$alert(err.msg, '提示', {
            confirmButtonText: '确定',
          })
        })
      },
      delLogo() {
        this.chatImg = null;
        this.showLogo = false;
      },
      /*求评价*/
      getcomment() {
        let that = this;
        if (this.chatCircle) {
          that.getcommentStatus();
          var params = {
            "cspOrderId": this.cspOrderId,//: 订单id
            "msgType": 3,// 1文本，2图片3评价
            "receiverId": this.cspCustomId, //接收用户ID ,
            "sendMsg": '服务结束，邀请客户确认',// 发送内容 ,
            "senderId": this.receiverId,//发送用户ID
            "tradeDetailId": this.tradeDetailId,//
            "userId": this.receiverId,//发送用户ID
            "serviceStatus": this.searchParams.orderServiceStatus
          };
          setTimeout(function () {
            if (that.commonStatus.insOrderCommentId) {
              that.$alert('订单已经完成', '提示', {
                confirmButtonText: '确定',
              })
            } else if (that.msgTypeCount >= 3) {
              return;
            } else {
              sendToCustomer(params).then((res) => {
                if (res.code === ERR_OK) {
                  that.queryInsConsultChatList();
                } else {
                  that.$alert(res.msg, '提示', {
                    confirmButtonText: '确定',
                  })
                }
              }).catch((err)=>{
                this.$alert(err.msg, '提示', {
                  confirmButtonText: '确定',
                })
              })
            }
          }, 300)
        } else {
          this.$alert('请选择聊天对象', '提示', {
            confirmButtonText: '确定',
          })
          return;
        }
      },
      /*图片字符串处理*/
      compileCode(val) {
        var imgSrc = val;
        if (val) {
          imgSrc = val.split(',');
          imgSrc.forEach(function (v, i) {
            imgSrc[i] = storeManager.uncompile(v)
          });
        }
        return imgSrc;
      },
      /*图片预览*/
      showImgs(index) {
        var idName = 'img' + index;
        var viewer = new Viewer(document.getElementById(idName), {
          navbar: false,
          scalable: false,
          minZoomRatio: 0.1,
          maxZoomRatio: 10,
          movable: false,
          fullscreen: false,
        });
      },
      showTitleImgs(index) {
        var idName = 'img' + index;
        var viewer = new Viewer(document.getElementById(idName), {
          navbar: false,
          scalable: false,
          minZoomRatio: 0.1,
          maxZoomRatio: 10,
          movable: false,
          fullscreen: false
        });
      }
    },
    watch: {
      chatList: function () {
        this.$nextTick(function () {
          this.$refs.chatingTo.scrollTop = this.$refs.chatingTo.scrollHeight;
        })
      }
    },
    computed: {
      msgTypeCount: function () {
        var list = [];
        if (this.chatList) {
          this.chatList.forEach(function (v) {
            if (v.msgType === 3 || v.msgType === 4) {
              list.push(v);
            }
          })
        }
        return list.length;
      },
      ...mapState({
        areaImg: state => state.areaImg//用户头像
      }),
      showDetailImg() {
        if (this.chatCircleMsg.consultChatDTO.customerImgs === 'null') {
          return false;
        }
        return true;
      }
    }
  }
</script>

<style scoped lang="less">
  .detailRemark /deep/ .el-dialog__header {
    padding: 0;
  }

  .detailRemark /deep/ .el-dialog__body {
    font-size: 16px;
  }

  .detailRemark /deep/ .el-textarea.is-disabled .el-textarea__inner {
    color: #333;
  }

  .detailRemark {
    .btnComment {
      text-align: center;
      margin-top: 20px;
    }
  }

  .comment-title {
    height: 28px;
    line-height: 28px;
    margin-bottom: 10px;
    .img_star {
      height: 28px;
      display: inline-block;
      vertical-align: middle;
    }
    /*    .yellow-color{
          color: red;
          font-size:18px;
        }*/
  }

  .desc-title {
    display: block;
    margin-bottom: 10px;
  }

  .upImgBtn-style {
    background: #409EFF;
    font-size: 14px;
    padding: 5px;
    color: #fff;
    border-radius: 5px;
    cursor: pointer;
  }

  #upImgBtn {
    display: none;
  }

  .imgtext-main {
    border-radius: 5px;
    border: 1px solid #e5e5e5;
    position: absolute;
    left:15px;
    right:15px;
    top:15px;
    bottom:17px;
    /*height: calc(100% - 2px);*/
    overflow: hidden;
    .msg_main {
      display: flex;
      height: calc(100% - 37px);
    }
    .msgLeft {
      background-color: #eee;
      border-right: 1px solid #e5e5e5;
      height: calc(100% - 50px);
      line-height: 32px;
      min-width: 390px;
      padding-bottom: 50px;
      position: relative;
      .pageDetail {
        text-align: center;
        position: absolute;
        bottom: 5px;
        left: 0;
        right: 0;
        .tipMsg {
          font-size: 12px;
          position: absolute;
          bottom: 0;
          width: 100%;
          background-color: #fff;
          margin: 0 auto;
          text-align: center;
        }
      }
      .item {
        height: 26px;
        line-height: 26px;
      }
    }
  }

  [v-cloak] {
    display: none
  }

  html, body {
    height: 100%;
  }

  .consult-header {
    background-color: #3c8dbc;
    color: #fff;
    height: 32px;
    padding: 0 20px;
    border-radius: 5px 5px 0 0;
    line-height: 32px;
    ul {
      display: flex;
      justify-content: space-between;
    }
  }

  .fl {
    float: left;
  }

  .fr {
    float: right;
  }

  .msgRight {
    line-height: 32px;
    flex: 1;
    padding-bottom: 180px;
    position: relative;
    overflow: hidden;
    .msgRight-header {
      padding: 0 20px;
      line-height: 40px;
      border-bottom: 1px solid #fff;
      display: block;
      overflow: hidden;
      background-color: #e5e5e5;
    }
    .chat-main {
      height: 100%;
      padding: 10px;
      overflow: auto;
      background-color: #e5e5e5;
      .chating-list {
        margin-top: 20px;
        overflow: auto;
        .chat-list-box {
          display: block;
          width: 100%;
          margin-bottom: 20px;
        }
        ul {
          overflow: hidden;
        }
        li {
          display: block;
          width: 100%;
          margin-bottom: 20px;
          overflow: hidden;
        }
      }
    }
  }

  .chat-box {
    /*height: calc(100% - 20px);*/
    overflow: hidden;
    position: absolute;
    left:0;
    top:0;
    right:0;
    bottom:180px;
  }

  .user-detail {
    margin: 0 10px 20px;
    background-color: #fff;
    border-radius: 5px;
    padding: 0 10px 20px;
    .detail-header {
      line-height: 32px;
      border-bottom: 1px dashed #999;
      display: block;
      overflow: hidden;
      .chat-img {
        display: block;
      }
      span {
        margin-right: 10px;
      }
    }
  }

  .img-msg {
    width: 78px;
    height: 78px;
    margin-right: 10px;
    margin-top: 10px;
  }

  .userPhotofr,
  .userPhotofl {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    box-sizing: border-box;
  }

  .userPhotofr {
    margin-right: 10px;
    .userPhotoImg {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .store-circle,
  .user-circle {
    position: relative;
    max-width: 80%;
  }

  .user-main,
  .store-main {
    border-radius: 5px;
    color: #fff;
    line-height: 22px;
    padding: 10px;
    word-break:break-all;
  }

  .user-main {
    background-color: #4fb136;
  }

  .store-main {
    color: #666;
    background-color: #fff;
  }

  .store-circle {
    margin-right: 30px;
    padding-left: 13px;
    overflow: hidden;
  }

  .user-circle {
    margin-left: 30px;
    padding-right: 13px;
    overflow: hidden;
  }

  .parting-line {
    display: block;
    border-bottom: 1px dashed #999;
  }

  .input-header {
    height: 40px;
    background-color: #eee;
    padding: 0 20px;
    line-height: 40px;
    display: block;
    overflow: hidden;
    .text-right {
      background-color: #fff;
      font-size: 14px;
      color: #409EFF;
      padding: 0 10px;
      height: 20px;
      line-height: 20px;
      border-radius: 5px;
      margin-top: 10px;
      cursor: pointer;
    }
  }

  .chat-input {
    position: absolute;
    height: 180px;
    overflow: hidden;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .text-area {
    width: 100%;
    height: 90px;
    border: none;
    padding: 10px 20px 10px;
    font-size:14px;
    resize: none;
  }

  .btn-main {
    position: absolute;
    bottom: 15px;
    right: 30px;
    line-height: 20px;
    overflow: hidden;
    .btn-text {
      line-height: 30px;
      color: #666;
      float: left;
      margin-right: 10px;
    }
  }

  .text-image {
    padding-bottom: 60px;
    background-color: #fff;
  }

  /*详情框*/
  .detail-mask {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 100;
    .mask-circle {
      width: 570px;
      height: 530px;
      background-color: #fff;
      border: 1px solid #e5e5e5;
      border-radius: 5px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -285px;
      margin-top: -265px;
    }
    .closeIcon {
      cursor: pointer;
    }
  }

  .mask-header {
    height: 40px;
    font-size: 16px;
    line-height: 40px;
    background-color: #999;
    padding: 0 20px;
  }

  .mask-main li {
    display: flex;
    height: 50px;
    line-height: 50px;
  }

  .fle1 {
    flex: 1;
    width: 100px;
    text-align: right;
    color: #666;
  }

  .fle2 {
    flex: 2.5;
    text-align: left;
    margin-left: 20px;
  }

  .flinput {
    height: 100px;
    width: 300px;
    border-radius: 5px;
    border: 1px solid #999;
    resize: none;
    padding: 5px;
    line-height: 20px;
  }

  .flbtn {
    width: 75px;
    background-color: #4fb136;
    color: #fff;
    border-radius: 5px;
    border: none;
    height: 38px;
    line-height: 38px;
    cursor: pointer;
  }

  .btnStyle {
    background-color: #c7254e;
  }

  .addImgBox {
    width: 100%;
    height: 80px;
    padding: 10px;
    box-sizing: border-box;
    .addImg {
      width: 80px;
      height: 100%;
      background-color: #e5e5e5;
      color: #666;
      vertical-align: middle;
      padding: 2px;
      position: relative;
      text-align: center;
      display: inline-block;
      .img-logo-cicle {
        width: 80px;
        height: 80px;
        box-sizing: border-box;
      }
    }
  }

  .addImg .delIcon {
    display: inline-block;
    width: 30px;
    height: 30px;
    font-size: 50px;
    color: #333;
    border-radius: 50%;
    background: #e5e5e5;
    box-sizing: border-box;
    line-height: 24px;
    margin-right: -15px;
    margin-top: -15px;
    position: absolute;
    top: 0;
    right: 0;
  }

  .minCirclefl {
    border: 8px solid #e5e5e5;
    border-right-color: #fff;
    position: absolute;
    top: 12px;
    left: -3px;
  }

  .minCirclefr {
    border: 8px solid #e5e5e5;
    border-left-color: #4fb136;
    position: absolute;
    top: 12px;
    right: -3px;
  }

  .reStyle {
    background-color: #999 !important;
    color: #fff !important;
  }
  .report-model{position: fixed;width:64%;left:18%;top:100px;background-color: #f3f3f3;
    z-index: 100;border: 1px solid #e6e6e6;border-radius: 4px;box-shadow: 0 1px 3px rgba(0,0,0,.3);}
  .model-title{line-height: 32px;font-size: 20px;color: #333;font-weight: normal;padding: 10px 20px;cursor: move;text-align:center;}
  .close-model-btn{position: absolute;top:16px;right: 20px;font-size: 20px;cursor: pointer}
  .remark-content-box{padding: 0 20px 10px;}
  .movedown-enter-active, .movedown-leave-active{transition: all 0.5s linear;}
  .movedown-enter,.movedown-leave-active{transform: translateY(-400px);}
</style>
