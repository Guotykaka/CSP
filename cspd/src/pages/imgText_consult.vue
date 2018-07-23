<template>
  <div class="imgText_consult imgtext-main" v-cloak>
    <div class="detail-mask" @click.stop="detailClose" v-if="maskShow">
      <div class="mask-circle" @click.stop>
        <div class="mask-header">
          <span class="fl">详细</span>
          <span class="fr closeIcon" @click.stop="detailClose">X</span>
        </div>
        <ul class="mask-main">
          <li><span class="fle1">客户手机号</span><span class="fle2">{{detailText.mobile||"暂无数据"}}</span></li>
          <li><span class="fle1">订单号</span><span class="fle2">{{detailText.orderCode||"暂无数据"}}</span></li>
          <li><span class="fle1">服务名称</span><span class="fle2">{{detailText.itemName||"暂无数据"}}</span></li>
          <li><span class="fle1">订单日期</span><span class="fle2">{{detailText.orderTime||"暂无数据"}}</span></li>
          <li><span class="fle1">订单金额</span><span class="fle2">￥{{detailText.totalPrice||"暂无数据"}}</span></li>
          <!--<li><span class="fle1">首次咨询时间</span><span class="fle2">{{detailText.serviceBeginTime||"暂无数据"}}</span></li>-->
          <li style="height:120px;"><span class="fle1">备注</span>
            <div class="fle2">
            <textarea class="flinput" type="text" v-model="updataeTradeDetail"
                      placeholder="输入备注信息，可以帮助您快速回顾历史服务内容"></textarea>
            </div>
          </li>
          <li><span class="fle1"></span>
            <div class="fle2">
              <button class="flbtn" @click.stop="detailSave">保存</button>
              <button class="flbtn" @click.stop="detailClose" style="background-color:#c7254e">取消</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
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
        <div class="msgLeftBox">
          <el-tabs v-model="activeName" @tab-click="handleClick" stretch class="msgleft-head">
            <el-tab-pane label="待服务" name="first">
              <tableMain @detailShow="detailShow" @getChatDetail="_getChatDetail" :orderList="orderList"
                         :Current="selCurrent"></tableMain>
            </el-tab-pane>
            <el-tab-pane label="服务中" name="second">
              <tableMain @detailShow="detailShow" @getChatDetail="_getChatDetail" :orderList="orderList"></tableMain>
            </el-tab-pane>
            <el-tab-pane label="已完成" name="third">
              <tableMain @detailShow="detailShow" @getChatDetail="_getChatDetail" :orderList="orderList"></tableMain>
            </el-tab-pane>
            <el-tab-pane label="已失效" name="fourth">
              <tableMain @detailShow="detailShow" @getChatDetail="_getChatDetail" :orderList="orderList"></tableMain>
            </el-tab-pane>
          </el-tabs>
          <div class="pageDetail">
            <el-pagination
              v-show="orderList&&orderList.list"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage4"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="10"
              :pager-count="5"
              :small="true"
              layout="total, prev, pager, next"
              :total="totalcount">
            </el-pagination>
            <div v-if="!orderList||orderList.list<=0"
                 class="tipMsg">
              暂无数据
            </div>
          </div>
        </div>
      </div>
      <div class="msgRight" style="flex:1;padding-bottom: 180px;position: relative;overflow: hidden;">
        <dis class="msgRight-header" v-if="chatCircleMsgShow">
          <span class="fl">{{chatCircleMsg.customerName}}</span>
          <span class="fr">{{chatCircleMsg.orderTime}}</span>
        </dis>
        <div class="chat-box" v-if="chatCircleMsgShow">
          <div class="chat-main" ref="chatingTo">
            <div class="user-detail">
              <div class="detail-header">
                <div class="fl">
                  <span class="fl">{{chatCircleMsg.customerName}}</span>
                  <span class="fl" v-if="chatCircleMsg.customerSex==2">女</span>
                  <span class="fl" v-else>男</span>
                  <span class="fl">{{chatCircleMsg.customerAge}}岁</span>
                </div>
                <span class="fr">{{chatCircleMsg.orderTime}}</span>
              </div>
              <div class="user-detail-main">
                <span>{{chatCircleMsg.customerDesc}}</span>
                <div style="display: block;">
                  <ul @click="showTitleImgs(chatCircleMsg.tradeDetailId)" :id="'img'+chatCircleMsg.tradeDetailId">
                    <li>
                      <img :src="value" v-for="(value,ind) in compileCode(chatCircleMsg.customerImgs)" :key="ind"
                           alt="" class="img-msg" style="margin-top:10px;">
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="chating-list">
              <ul>
                <li v-for="(item,index) in chatList" :key="index" v-show="item.msgType!=10&&item.msgType!=11">
                  <div class="fr" v-if="item.sendFlag==1" style="display: block;width: 100%;margin-bottom: 20px;">
                    <div class="userPhotofr fr">
                      <img :src="avatar" alt="" style="width:100%;height:100%;border-radius:50%;">
                    </div>
                    <div class="fr user-circle">
                      <div class="user-main">
                        <span class="parting-line" style="text-align:right;">{{item.sendTime}}</span>
                        <span v-if="item.msgType===4">服务结束，邀请客户确认</span>
                        <span v-if="item.msgType===1||item.msgType===3">{{item.sendMsg}}</span>
                        <ul v-if="item.msgType===2" @click="showImgs(index)" :id="'img'+index">
                          <li>
                            <img :src="item.sendMsg" alt="" class="img-msg" style="margin-top:10px;">
                          </li>
                        </ul>
                      </div>
                      <span class="minCirclefr"></span>
                    </div>
                  </div>
                  <div class="fl" v-else style="display: block;width: 100%;margin-bottom: 20px;">
                    <div class="userPhotofl fl">
                      <img v-if="chatCircleMsg" :src="chatCircleMsg.imageSrc" alt=""
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
                                 class="img-msg" style="margin-top:10px;">
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
            <!--<span class="text-left fl" @click="_showText">常用语</span>-->
            <el-upload
              class="upload-demo"
              :action="upImgurl"
              :on-remove="handleRemove"
              ref="clearfile"
              :show-file-list="false"
              :on-success="handleSuccess"
              :limit="1">
              <el-button size="mini" type="primary">添加图片</el-button>
            </el-upload>
            <span class="text-right fr" v-if="searchParams.orderServiceStatus==2||searchParams.orderServiceStatus==3"
                  @click="getcomment" :class="{reStyle:msgTypeCount>=3}">服务结束，邀请客户确认</span>
          </div>
          <div class="long-text" v-show="showText">
            <ul v-for="(item,index) in uptext" :key="index">
              <li @click="_upText(item.msg)">{{item.msg}}</li>
            </ul>
          </div>
          <div class="text-image">
            <div class="addImgBox" v-if="showLogo" style="padding:10px;">
              <div class="addImg">
                <div>
                  <img :src="chatImg" class="img-logo-cicle" style="width: 80px;height:80px;box-sizing: border-box;">
                </div>
                <!--删除按钮-->
                <span class="delIcon" id="deleteLogo" v-if="showLogo" @click="delLogo">-</span>
              </div>
              <!--<div v-else id="uploadLogo" class="img-logo-cicle"></div>-->
            </div>
            <textarea v-show="!showLogo" @keyup.ctrl.enter="_upTextSend" placeholder="请输入内容" v-model="showMsg"
                      class="text-area" @click="selmsgType"></textarea>
          </div>
          <div class="btn-main">
            <div class="btn-text">ctrl+Enter&nbsp;可直接提交发送</div>
            <el-button type="success" size="mini" @keyup.ctrl.enter="_upTextSend" @click="_upTextSend">发送</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import headerTop from "@/components/headTop.vue"
  import {API_UPLOAD} from '@/config/env.js'
  import tableMain from "@/pages/imgText_consult/tablemain.vue"
  import {getStore} from "@/config/mUtils.js"
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
    updateTradeDetail
  } from '@/api/api';
  import {storeManager} from '@/api/util.js';

  export default {
    name:'imgText_consult',
    components: {
      headerTop,
      tableMain
    },
    data() {
      return {
        upImgurl:'',
        activeName: 'first',
        currentPage4: 1,
        totalcount: null,
        showText: false,
        dialogImageUrl: '',
        dialogVisible: false,
        userInfo: {},//用户信息
        uptext: [
          {msg: '你好'},
          {msg: '我现在忙,等下和你联系'},
          {msg: '现在忙吗?能聊会吗?'}
        ],
        showMsg: '',
        orderNumber: {},//统计数量
        orderList: {},//用户列表
        updataeTradeDetail: "",//订单详情备注
        detailText: {},//用户订单详情展示
        maskShow: false,
        tradeDetailId: "",//
        imglist: [],//添加图片按钮
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
        selCurrent: null,
        chatList: null,
        avatar: '',//用户图片
        docubleClik: true,//双击
        commonStatus: {}//评价服务状态

      }
    },
    created() {
      this.upImgurl = API_UPLOAD
      this.userInfo = JSON.parse(getStore('userMesage'));
      this.receiverId = this.userInfo.userId;
      this.searchParams.providerServiceUserId = this.userInfo.insDoctorId;
      this.avatar = localStorage.getItem("avatar");
      this._getOrderNumber();
      this._getOrderList();
    },
    methods: {
      //上传图片
      handleRemove() {
        this.$refs.clearfile.clearFiles();
        this.chatImg=null;
      },
      handleSuccess(file) {
        this.msgType = 2;
        this.$refs.clearfile.clearFiles();
        this.showLogo=true;
        this.chatImg=file.data.src;
      },
      //列表每页显示多少条
      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this._getOrderList();
      },
      //列表跳转第几页
      handleCurrentChange(val) {
        this.searchParams.currentPage = val;
        this._getOrderList();
      },
      //tab栏切换
      handleClick(tab) {
        this.selCurrent = null;
        if (tab.index == 0) {
          this.searchParams.orderServiceStatus = +tab.index
        } else {
          this.searchParams.orderServiceStatus = +tab.index + 1;
        }
        this._getOrderList();
      },
      //常用语显示列表
      _showText: function () {
        this.showText = !this.showText
      },
      //常用语选择
      _upText: function (val) {
        this.showMsg = val;
        this.showText = !this.showText
        this.msgType = 1;
      },
      //選擇文本傳輸
      selmsgType: function () {
        this.msgType = 1;
      },
      //医生回复客户信息
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
              "senderId": this.receiverId,//发送用户ID
              "userId": this.receiverId,//发送用户ID
            };
          } else {
            params = {
              "cspOrderId": this.cspOrderId,//: 订单id
              "msgType": this.msgType,// 1文本，2图片
              "receiverId": this.cspCustomId, //接收用户ID ,
              "sendMsg": this.chatImg,// 发送内容 ,
              "senderId": this.receiverId,//发送用户ID
              "userId": this.receiverId,//发送用户ID
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
        }
      },
      //获取相应订单的聊天详情
      _getChatDetail: function (item) {
        this.chatCircle = true;
        this.chatCircleMsg = item;
        this.chatCircleMsgShow = true;
        this.cspOrderId = item.cspOrderId;
        this.cspCustomId = item.cspCustomId;
        var params = {
          "receiverId": this.receiverId,
          "senderId": item.cspCustomId
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
          })
        }
        //查看客户评价服务状态cspOrderId
        var par = {
          "cspOrderId": item.cspOrderId
        }
        queryOrderComment(par).then((res) => {
          if (res.code === ERR_OK) {
            this.commonStatus = res.data;
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        })
      },
      //聊天记录分页查询
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
        });
      },
      //获取顶部统计数量
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
        });
        this._getMsgCount();
      },
      //获取顶部状态未读信息的条数
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
        });
        countUnReadMsgByOrderStatus(paramsT).then((res) => {
          if (res.code === ERR_OK) {
            that.orderServiceStatusT = res.data;
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        });
      },
      //图文咨询订单分页查询
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
        imgTextList(params).then((res) => {
          if (res.code === ERR_OK) {
            that.orderList = res.data;
            if (res.data && res.data.totalCount) {
              that.totalcount = res.data.totalCount;
            } else {
              that.totalcount = 1;
            }
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        })
      },
      //详细信息展示
      detailShow: function (val) {
        this.maskShow = !this.maskShow;
        this.tradeDetailId = val.tradeDetailId;
        if (this.maskShow) {
          let params = {"tradeDetailId": val.tradeDetailId};
          queryTradeDetail(params).then((res) => {
            if (res.code === ERR_OK) {
              this.detailText = res.data;
              this.updataeTradeDetail = res.data.remark;
            } else {
              this.$alert(res.msg, '提示', {
                confirmButtonText: '确定',
              })
            }
          })
        }
      },
      //关闭详情弹框
      detailClose: function () {
        this.maskShow = !this.maskShow;
        this.updataeTradeDetail = ''
      },
      //保存数据
      detailSave: function () {
        this.maskShow = !this.maskShow;
        var params = {
          "tradeDetailId": this.tradeDetailId,
          "remark": this.updataeTradeDetail
        };
        updateTradeDetail(params).then((res) => {
          if (res.code === ERR_OK) {
            vm.detailText = res.data;
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        })
      },
      delLogo: function () {
        this.chatLogo = null;
        this.showLogo = false;
        this.handleRemove();
      },
      //求评价
      getcomment: function () {
        if (this.chatCircle) {
          var params = {
            "cspOrderId": this.cspOrderId,//: 订单id
            "msgType": 3,// 1文本，2图片3评价
            "receiverId": this.cspCustomId, //接收用户ID ,
            "sendMsg": '服务结束，邀请客户确认',// 发送内容 ,
            "senderId": this.receiverId,//发送用户ID
            "userId": this.receiverId,//发送用户ID
          };
          if (this.commonStatus.insOrderCommentId) {
            this.$alert('订单已经完成', '提示', {
              confirmButtonText: '确定',
            })
          } else if (this.msgTypeCount >= 3) {
            return;
          } else {
            sendToCustomer(params).then((res) => {
              if (res.code === ERR_OK) {
                this.queryInsConsultChatList();
              } else {
                this.$alert(res.msg, '提示', {
                  confirmButtonText: '确定',
                })
              }
            })
          }
        } else {
          this.$alert('请选择聊天对象', '提示', {
            confirmButtonText: '确定',
          })
          return;
        }
      },
      compileCode: function (val) {
        var imgSrc = val;
        if (val) {
          imgSrc = val.split(',');
          imgSrc.forEach(function (v, i) {
            imgSrc[i] = storeManager.uncompile(v)
          });
        }
        return imgSrc;
      },
      //图片预览
      showImgs: function (index) {
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
      showTitleImgs: function (index) {
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
      }
    }
  }
</script>

<style scoped lang="less">
  .upload-demo{
    display:inline-block;
  }
  .imgtext-main {
    border-radius: 5px;
    border: 1px solid #e5e5e5;
    position: relative;
    height: calc(100% - 2px);
    overflow: hidden;
    .msg_main {
      display: flex;
      height: calc(100% - 37px);
    }
    .msgLeft {
      background-color: #eee;
      border-right: 1px solid #e5e5e5;
      height: 100%;
      line-height: 32px;
      .msgLeftBox {
        min-width: 390px;
        padding-bottom: 50px;
        position: relative;
      }
      .pageDetail {
        text-align: center;
        position: absolute;
        bottom: 5px;
        left: 0;
        right: 0;
        .tipMsg {
          font-size: 6px;
          position: absolute;
          bottom: 0px;
          width: 100%;
          background-color: #fff;
          margin: 0 auto;
          text-align: center;
        }
      }
      .table-content {
        height: calc(100% - 42px);
        overflow: hidden;
        padding-bottom: 50px;
        padding-left: 0;
        position: relative;
      }
      .tcontent-ul {
        overflow: auto;
        height: 700px;
        padding: 0 10px;
        margin-right: -30px;
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

  .msgleft-head .layui-tab-title ul {
    display: flex;
  }

  .layui-tab-title li {
    flex: 1;
  }

  .red-circle {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: red;
    position: absolute;
    top: 0;
    right: -7px;
  }

  .label-main {
    padding: 10px 0 10px 10px;
    overflow: hidden;
    border-bottom: 1px solid #e5e5e5;
  }

  .label-main:hover {
    background-color: #e5e5e5;
  }

  .label-main .servicing {
    display: block;
    /*width:40px;*/
    /*height:20px;*/
    padding: 0 10px;
    line-height: 14px;
    color: #fff !important;
    background-color: #00e765;
    border-radius: 5px;
  }

  .fl {
    float: left;
  }

  .fr {
    float: right;
  }

  .main-right {
    margin-right: 20px;
  }

  .main-right a,
  .main-right .servicing {
    float: left;
    color: #f86b4f;
    margin-right: 10px;
    line-height: 25px;
    text-decoration: none;
  }

  .nav-main-top {
    overflow: hidden;
  }

  .nav-main-bottom {
    margin-top: 10px;
  }

  .msgRight {
    line-height: 32px;
    .msgRight-header {
      padding: 0 20px;
      line-height: 40px;
      border-bottom: 1px solid #fff;
      display: block;
      overflow: hidden;
      background-color: #e5e5e5;
    }
    .chat-main {
      /*height: 586px;*/
      height: 100%;
      padding: 10px;
      overflow: auto;
      background-color: #e5e5e5;
      .chating-list {
        margin-top: 20px;
        overflow: hidden;
      }
      .chating-list ul {
        overflow: hidden;
      }
    }
  }

  .chat-box {
    /*height: 576px;*/
    height: calc(100% - 20px);
    overflow: hidden;
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
      span {
        margin-right: 10px;
      }
    }
  }

  .img-msg {
    width: 78px;
    height: 78px;
    margin-right: 10px;
  }

  .chating-list li {
    display: block;
    width: 100%;
    margin-bottom: 20px;
    overflow: hidden;
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
  }

  .ml10 {
    margin-left: 10px;
  }

  .mr10 {
    margin-right: 10px;
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
    height: 28px;
    background-color: #ccc;
    padding: 0 20px;
    line-height: 28px;
    display: block;
    overflow: hidden;
  }

  .input-header {
    .text-left {
      margin-right: 20px;
    }
    .text-right {
      background-color: #fff;
      font-size: 12px;
      color: #4fb136;
      padding: 0 10px;
      height: 20px;
      line-height: 20px;
      border-radius: 5px;
      margin-top: 4px;
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

  .long-text {
    position: absolute;
    top: 30px;
    left: 0;
    background-color: #eee;
    z-index: 99;
    li {
      line-height: 30px;
      border-bottom: 1px solid #999;
      padding: 0 10px;
    }
    li:hover {
      background-color: #00acd6;
    }
  }

  .text-area {
    width: 100%;
    height: 90px;
    border: none;
    padding: 10px 20px 10px;
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

  .com_fi {
    width: 50px;
    height: 50px;
    box-sizing: border-box;
    float: left;
    margin: 5px;
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

  .addImgBox {
    width: 100%;
    height: 80px;
    box-sizing: border-box;
  }

  .addImgBox .addImg {
    width: 80px;
    height: 100%;
    background-color: #e5e5e5;
    color: #666;
    vertical-align: middle;
    padding: 2px;
    position: relative;
    text-align: center;
    display: inline-block;
  }

  .addImg .addIcon {
    font-size: 60px;
    line-height: 100px;
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

  .selTrueStyle {
    background-color: #c9c9c9;
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

  .layui-this {
    color: #3c8dbc !important;
  }

  .layui-this:after {
    border-bottom: 2px solid #3c8dbc !important;
  }

  .reStyle {
    background-color: #999 !important;
    color: #fff !important;
  }
</style>
