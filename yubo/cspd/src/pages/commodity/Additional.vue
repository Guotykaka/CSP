<template>
  <div class="consultation" v-cloak>
    <!--信息头部-->
    <div class="msg_main">
      <div class="msgLeft">
        <el-tabs v-model="activeName" @tab-click="handleClick" stretch class="msgleft-head">
          <el-tab-pane name="first">
            <span slot="label" v-if="totalcountStart>0">
              <el-badge :value="totalcountStart" class="item">待处理</el-badge>
            </span>
            <span slot="label" v-else>待处理</span>
          </el-tab-pane>
          <el-tab-pane name="second">
            <span slot="label">已处理</span>
          </el-tab-pane>
        </el-tabs>
        <div class="free-table-style">
          <free-table
            @getChatDetail="_getChatDetail"
            :orderList="orderList"
            :customId="customId"
            v-if="orderList&&orderList.list">
          </free-table>
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
      <div class="msgRight"
           v-loading="addLoading"
           element-loading-text="拼命加载中"
           element-loading-spinner="el-icon-loading"
           element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <div class="chat-box" v-cloak v-show="chatCircleMsgShow">
          <div class="chat-main" ref="chatingTo">
            <div class="chating-list">
              <div style="height:80px;margin-bottom:20px;"
                   v-if="pullLoading"
                   v-loading="pullLoading"
                   element-loading-text="拼命加载中"
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="#e5e5e5"
              ></div>
              <ul class="chatlist-box">
                <li v-for="(item,index) in chatList" :key="index">
                  <div class="fr chat-list-box" v-if="item.flag===2&&messageShowRight(item)">
                    <div class="userPhotofr fr">
                      <img :src="areaImg||avatar" alt="" class="userPhotoImg">
                    </div>
                    <div class="fr user-circle">
                      <div class="user-main">
                        <span class="parting-line" style="text-align:right;">{{item.createTime}}</span>
                        <span v-if="item.type!=='2'&&item.type!=='3'">{{item.content}}</span>
                        <ul v-if="item.type==='2'" @click="showImgs(index)" :id="'img'+index">
                          <li>
                            <img :src="item.appendInfo||item.content" alt="" class="img-msg">
                          </li>
                        </ul>
                      </div>
                      <!--<span class="minCirclefr"></span>-->
                    </div>
                  </div>
                  <div class="fl" v-if="item.flag===1&&messageShowLeft(item)" style="display: block;width: 100%;margin-bottom: 20px;">
                    <div class="userPhotofl fl">
                      <img
                        v-if="chatCircleMsg"
                        :src="chatCircleMsg.customLogo||user_b" alt=""
                        style="width:100%;height:100%;border-radius:50%;">
                    </div>
                    <div class="fl store-circle">
                      <div class="store-main">
                        <span class="parting-line" style="text-align:left;">{{item.createTime}}</span>
                        <span v-if="item.type==='1'">{{item.content}}</span>
                        <ul v-if="item.type==='2'" @click="showImgs(index)" :id="'img'+index">
                          <li>
                            <img :src="ite" v-for="(ite,i) in compileCode(item.appendInfo)" :key="i" alt="" class="img-msg">
                          </li>
                        </ul>
                        <div class="report-style" v-if="item.type==='3'">
                          <span v-html="item.content"></span><br>
                          <!--<span>{{item.CheckUnitName}}</span>
                            <span>{{item.ConsultContent}}</span>-->
                          <span class="report-show" @click="showReport(item)">查看完整体检报告</span>
                        </div>
                        <div class="report-style" v-if="item.type==='4'">
                          <span v-html="item.content"></span><br>
                          <p class="thirdTip">
                            <el-button type="primary" size="mini" @click="checkSetMeal(item)">查看体检套餐</el-button>
                          </p>
                        </div>
                        <div class="report-style" v-if="item.type==='6'">
                          <span v-html="item.content"></span><br>
                          <p class="thirdTip" v-if="item.appendInfo">
                            <el-button v-if="reportStatus(item)" type="primary" size="mini" @click="showReport(item)">查看完整体检报告</el-button>
                            <el-button type="primary" size="mini" @click="getShopDetail(item)">查看商品详情</el-button>
                          </p>
                        </div>
                      </div>
                      <span class="minCirclefl"></span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="chat-input" v-show="customId">
          <div class="input-header">
            <label for="upImgBtn" class="upImgBtn-style">添加图片</label>
            <input id="upImgBtn" name="upImgBtn" type="file" @change="upImg" ref="ss">
            <!--<span class="text-right fr" v-if="searchParams.orderServiceStatus===2||searchParams.orderServiceStatus===3"-->
            <!--@click="getcomment" :class="{reStyle:msgTypeCount>=3}">服务结束，邀请客户确认</span>-->
          </div>
          <div class="text-image">
            <div class="addImgBox" v-if="showLogo">
              <div class="addImg">
                <img :src="chatImg" class="img-logo-cicle">
                <!--删除按钮-->
                <span class="delIcon" id="deleteLogo" v-if="showLogo" @click="delLogo">-</span>
              </div>
            </div>
            <textarea ref="textOn" v-show="!showLogo" @keyup.ctrl.enter="_upTextSend" placeholder="请输入内容"
                      v-model="showMsg"
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
    <transition name="movedown">
      <div class="report-model" v-if="isShowReport" id="report-model">
        <i class="close-model-btn el-icon-close" @click="closeReport"></i>
        <h3 class="model-title" id="report-t" v-dragReport>体检报告</h3>
        <div class="report-content-box">
          <report :reportData="reportData"></report>
        </div>
      </div>
    </transition>
    <!--商品详情-->
    <el-dialog title="商品详情" :visible.sync="shopShow" center :show-close="false" :close-on-click-modal="false" custom-class="shop-box" width="600px">
      <el-col :span="24">
        <el-card class="shop-detail">
          <div class="bottom clearfix">
            <el-row :gutter="20" class="card-text">
              <el-col :span="6"><span>商品编号：</span></el-col>
              <el-col :span="14"><span>{{shopDetail.productCode}}</span></el-col>
            </el-row>
            <el-row :gutter="20" class="card-text">
              <el-col :span="6"><span>商品名称：</span></el-col>
              <el-col :span="14"><span>{{shopDetail.productName}}</span></el-col>
            </el-row>
            <el-row :gutter="20" class="card-text">
              <el-col :span="6" align="center"><span>价格：</span></el-col>
              <el-col :span="14"><span>{{shopDetail.productPrice}}&nbsp;元</span></el-col>
            </el-row>
            <el-row :gutter="20" class="card-text">
              <el-col :span="6"><span>商品已售数：</span></el-col>
              <el-col :span="14"><span>{{shopDetail.trueQuantity}}</span></el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="closeBox">关 闭</el-button>
      </div>
    </el-dialog>
    <!--体检套餐查看-->
    <transition name="movedown">
      <div class="report-model" v-show="setMealShow" id="meal-model">
        <i class="close-model-btn el-icon-close" @click="closeMeal"></i>
        <h3 class="model-title" id="meal-t" v-dragMeal>体检套餐</h3>
        <div class="remark-content-box" v-if="chatCircleMsg">
          <p>
            姓名：<span style="margin-right:20px">{{chatCircleMsg.customName}}</span>&nbsp;
            性别：<span v-if="showSex===1">男</span>
            <span v-if="showSex===2">女</span>
          </p>
          <set-meal :refreshNum="refreshNum" :tableData="tableData" :addList="addList"></set-meal>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  // import report from '@/components/report.vue';
  import report from '@/components/reportNew.vue';
  import SetMeal from '@/components/setMeal.vue';
  import FreeTable from "@/pages/imgText_consult/FreeTable.vue"
  import {getStore,EncodeDoctorId,setDecodeStore} from "@/config/mUtils.js"
  import {mapState} from "vuex"
  import {
    ERR_OK,
    youPaiYunUpload,
    YOUPAIYUN_URL,
    getReportData,
    appListAppExamSuiteDetail,
    appListAppExamAddition,
    UsergetConsultList,//获取当前用户咨询记录
    UsergetProcessedList,//获取当前健管师已处理列表
    UsergetToBeTreatedList,//获取当前健管师待处理列表
    userSendToCustomer,//健管师回复客户信息
    getProductInfo//获取单个商品信息
  } from '@/api/api';
  import {storeManager,Base64} from '@/api/util.js';

  export default {
    name: 'Additional',
    components: {
      FreeTable,
      report,
      SetMeal
    },
    data() {
      return {
        reportData: {},
        isShowReport: false,//是否显示体检报告
        reportSetMeal: {},//体检套餐参数
        tableData:[],//体检套餐数据
        addList:[],//加项数据
        setMealShow: false,//是否显示体检套餐
        addLoading: false,//显示体检套餐loading
        activeName: 'first',
        totalcount: null,
        totalcountStart: null,
        totalcountEnd: null,
        userInfo: {},//用户信息
        showMsg: '',
        orderList: {},//用户列表
        chatImg: null,//聊天图片
        showLogo: false,//
        searchParams: {
          currentPage: 1,
          userId: "",
          pageSize: 10
        },
        chatcurrentPage: 1,//聊天记录当前页
        chatPage: 1,//聊天记录总页数
        scrollStatus: true,
        chatCircleMsgShow: false,
        chatCircleMsg: null,//聊天框信息
        chatCircle: false,//是否显示聊天信息
        customId: '',//订单id
        msgType: 2,//传送信息类型
        chatList: [],
        chatlistHeight: null,//列表高度
        avatar: require('../../asset/img/logo.jpg'),//用户图片
        user_b: require('../../asset/img/user_b.png'),//用户图片
        docubleClik: true,//双击
        pullLoading: false,
        showSex: 1, //性别
        shopDetail: {},
        shopShow: false,
        refreshNum:null
      }
    },
    activated() {
      this.userInfo = JSON.parse(getStore('userMesage'));
      this.searchParams.userId = EncodeDoctorId(this.userInfo.userId);
      this.getImgListStart();
      this.getImgListEnd();
      this.$refs.textOn.focus();
    },
    methods: {
      /*上传到又拍云*/
      upImg() {
        let params = this.$refs.ss;
        let par = params.files[0];
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
      //列表每页显示多少条
      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        if (this.activeName === 'first') {
          this.getImgListStart();//未处理列表
        } else if (this.activeName === 'second') {
          this.getImgListEnd();//已处理列表
        }
      },
      //列表跳转第几页
      handleCurrentChange(val) {
        this.searchParams.currentPage = val;
        if (this.activeName === 'first') {
          this.getImgListStart();
        } else if (this.activeName === 'second') {
          this.getImgListEnd();
        }
      },
      /*初始参数*/
      paramsInit() {
        this.searchParams.currentPage = 1;
        this.searchParams.pageSize = 10;
      },
      //tab栏切换
      handleClick() {
        this.chatCircleMsgShow = false;//聊天内容显示状态
        this.chatCircleMsg = null;
        this.customId = '';
        this.orderList = {}
        /*初始化参数*/
        this.paramsInit();
        /*获取未处理数据列表*/
        this.getImgListStart();
        /*获取已处理列表*/
        this.getImgListEnd();
        /*未发送的聊天框信息清空,并获取焦点*/
        this.delLogo();
        /*变成文本传输*/
        this.selmsgType();
      },
      //选择文本传输
      selmsgType() {
        this.msgType = 1;
      },
      //医生回复客户信息
      _upTextSend() {
        let params = {
          appendInfo: "",
          content: '',
          customId: this.customId,
          userId: EncodeDoctorId(this.userInfo.userId),
          type: this.msgType,
          category: '3'
        };
        if (this.msgType === 1) {
          params.content = this.showMsg;
          if (params.content == null || params.content === '') {
            this.$alert('不能发送空白消息', '提示', {
              confirmButtonText: '确定',
            });
            return
          }
        } else if (this.msgType === 2) {
          params.appendInfo = this.chatImg;
          if (params.appendInfo == null || params.appendInfo === '') {
            this.$alert('不能发送空白消息', '提示', {
              confirmButtonText: '确定',
            });
            return
          }
        }
        if (this.docubleClik) {
          this.docubleClik = false;
          userSendToCustomer(params).then((res) => {
            if (res.code === ERR_OK) {
              this.showMsg = '';
              this.chatImg = null;
              this.showLogo = false;
              this.docubleClik = true;
              this.handleClick();
            } else {
              this.docubleClik = true;
              this.$alert(res.msg, '提示', {
                confirmButtonText: '确定',
              })
            }
          }).catch((err) => {
            this.$alert(err.msg, '提示', {
              confirmButtonText: '确定',
            })
          })
        }
      },
      //获取相应订单的聊天详情
      _getChatDetail(item) {
        this.chatCircle = true;
        this.chatCircleMsg = item;
        this.chatCircleMsgShow = true;
        this.customId = item.customId;
        this.chatcurrentPage = 1;
        this.chatlistHeight = null;
        this.chatList = [];
        this.queryInsConsultChatList();
      },
      //聊天记录分页查询
      queryInsConsultChatList() {
        let params = {
          currentPage: this.chatcurrentPage,
          customId: this.customId,
          userId: EncodeDoctorId(this.userInfo.userId),
          pageSize: 20
        };
        UsergetConsultList(params).then((res) => {
          if (res.code === ERR_OK) {
            this.getLoading();
            this.scrollStatus = true;
            this.chatPage = res.data.totalPage;
            let list = res.data.list.reverse();
            this.chatList = list.concat(this.chatList)
          } else {
            this.getLoading();
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        }).catch((err) => {
          this.$alert(err.msg, '提示', {
            confirmButtonText: '确定',
          })
        });
      },
      /*使loading效果更明显*/
      getLoading() {
        let that = this;
        setTimeout(function () {
          that.pullLoading = false;
        }, 300)
      },
      /*体检报告展示*/
      showReport(val) {
        let value,params;
        value =JSON.parse(Base64.decode(val.appendInfo));
        params = {
          workNo: value.workNo,
          checkUnitCode: value.checkUnitCode
        };
        getReportData(params).then((res) => {
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
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        });
      },
      //关闭报告
      closeReport() {
        this.isShowReport = false;
      },
      /*查看体检套餐*/
      checkSetMeal(val) {
        this.addLoading = true;
        this.reportSetMeal = JSON.parse(Base64.decode(val.appendInfo));
        this.refreshNum = Date.parse(new Date());
        this.showSex = +this.reportSetMeal.sexCode;
        this.getExamSuitDetail();
      },
      //关闭体检套餐
      closeMeal() {
        this.setMealShow = false;
      },
      /*获取预约套餐详情*/
      getExamSuitDetail(){
        let params= {
          accessToken: "string",
          examPackageID: this.reportSetMeal.examPackageID,//套餐id
          institutionID: this.reportSetMeal.institutionID//机构id
        };
        appListAppExamSuiteDetail(params).then((res)=>{
          if(res.code===ERR_OK){
            this.setMealShow = true;
            this.addLoading = false;
            this.tableData = res.data;
            this.getExamAddition()
          }else{
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            });
            this.addLoading = false;
          }
        }).catch((err)=>{
          this.addLoading = false;
          this.$alert(err.msg, '提示', {
            confirmButtonText: '确定',
          })
        })
      },
      /*获取可购买加项列表*/
      getExamAddition(){
        let params= {
          accessToken: "string",
          examPackageID: this.reportSetMeal.examPackageID,//套餐id
          accountId:this.reportSetMeal.accountId,//新增字段
          guidGroupReservation:this.reportSetMeal.guidGroupReservation,//新增字段
          idOrgPatient: this.reportSetMeal.idorgpatient,//团检id
          institutionID: this.reportSetMeal.institutionID,//机构id
          sex: +this.reportSetMeal.sexCode//性别
        };

        appListAppExamAddition(params).then((res)=>{
          if(res.code===ERR_OK){
            this.addList = res.data;
          }else{
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            });
          }
        }).catch((err)=>{
          this.$alert(err.msg, '提示', {
            confirmButtonText: '确定',
          })
        })
      },
      /*获取当前用户已处理列表*/
      getImgListEnd() {
        if (this.activeName === 'first') {
          return
        }
        UsergetProcessedList(this.searchParams).then((res) => {
          if (res.code === ERR_OK) {
            this.orderList = res.data;
            this.totalcount = res.data.totalCount;
            if (res.data.list.length > 0) {
              this.customId = res.data.list[0].customId;
              this.chatCircleMsg = res.data.list[0];
              this.chatCircleMsgShow = true;
              this.chatcurrentPage = 1;
              this.chatlistHeight = null;
              this.chatList = [];
              this.queryInsConsultChatList();
            }
            this.totalcountEnd = res.data.totalCount;
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        }).catch((err) => {
          this.$alert(err.msg, '提示', {
            confirmButtonText: '确定',
          })
        });
      },
      /*获取当前用户待处理列表*/
      getImgListStart() {
        UsergetToBeTreatedList(this.searchParams).then((res) => {
          if (res.code === ERR_OK) {
            if (this.activeName === 'first' && res.data.list) {
              this.orderList = res.data;
              this.totalcount = res.data.totalCount;
              if (res.data.list.length > 0) {
                this.customId = res.data.list[0].customId;
                this.chatCircleMsg = res.data.list[0];
                this.chatCircleMsgShow = true;
                this.chatcurrentPage = 1;
                this.chatlistHeight = null;
                this.chatList = [];
                this.queryInsConsultChatList();
              }
            }
            this.totalcountStart = res.data.totalCount;
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        }).catch((err) => {
          this.$alert(err.msg, '提示', {
            confirmButtonText: '确定',
          })
        });
      },
      delLogo() {
        this.chatImg = null;
        this.showMsg = '';
        this.showLogo = false;
      },
      /*图片字符串处理*/
      compileCode(val) {
        let imgSrc = val;
        if (val) {
          imgSrc = val.split(',');
          imgSrc.forEach(function (v, i) {
            imgSrc[i] = storeManager.uncompile(v)
          });
        }
        return imgSrc;
      },
      //图片预览
      showImgs(index) {
        let idName = 'img' + index;
        let viewer = new Viewer(document.getElementById(idName), {
          navbar: false,
          scalable: false,
          minZoomRatio: 0.1,
          maxZoomRatio: 10,
          movable: false,
          fullscreen: false,
        });
      },
      /*鼠标滚动*/
      chatlistScroll() {
        let that = this;
        this.box = this.$refs.chatingTo;
        this.box.addEventListener('scroll', () => {
          if (this.scrollStatus && this.$refs.chatingTo.scrollTop < 10 && this.$refs.chatingTo.scrollTop > 0 && this.chatcurrentPage < this.chatPage) {
            that.pullLoading = true;
            that.scrollStatus = false;
            that.chatcurrentPage++;
            that.queryInsConsultChatList();
          }
        }, false)
      },
      /*判断是否显示体检报告详情(type=6)*/
      reportStatus(item){
        let showStatus =false;
        if(item.appendInfo.split(';').length>1||item.appendInfo.length===32){
          return;
        }
        if(Base64.decode(item.appendInfo).indexOf('{')===-1){
          return;
        }
        let value =JSON.parse(Base64.decode(item.appendInfo));
        if(value){
          if(value.workNo&&value.checkUnitCode){
            showStatus = true;
          }else{
            showStatus = false;
          }
        }else{
          showStatus = false
        }
        return showStatus
      },
      /*获取单个商品信息*/
      getShopDetail(val) {
        if(val.appendInfo.split(';').length>1){
          this.$message.error('老数据');
          return;
        }else if(Base64.decode(val.appendInfo).indexOf('{')===-1){
          this.$message.error('老数据');
          return;
        }
        let value,params;
        value =JSON.parse(Base64.decode(val.appendInfo));
        params = {
          productId: value.productId
        };
        getProductInfo(params).then((res) => {
          if (res.code === ERR_OK) {
            this.shopDetail = res.data;
            this.shopShow = true;
          } else {
            this.$alert(res.msg, '提示')
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        })
      },
      /*关闭商品详情弹窗*/
      closeBox(){
        this.shopDetail = {};
        this.shopShow = false
      },
      /*判断是否显示信息*/
      messageShowRight(val){
        if(val.type==='1'||val.type==='2'||val.type==='3'||val.type==='8'){
          return true;
        }else{
          return false;
        }
      },
      messageShowLeft(val){
        if(val.type==='1'||val.type==='2'||val.type==='3'||val.type==='4'||val.type==='6'){
          return true;
        }else{
          return false;
        }
      }
    },
    directives: {
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
      dragMeal: {
        // 指令的定义
        inserted: function (el) {
          let oDiv = document.getElementById("meal-model");
          let oDivt = document.getElementById("meal-t");
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
    watch: {
      chatList: function () {
        this.$nextTick(function () {
          if (!this.chatlistHeight) {
            this.$refs.chatingTo.scrollTop = this.$refs.chatingTo.scrollHeight;
          } else {
            this.chatlistHeight = this.$refs.chatingTo.scrollHeight - this.chatlistHeight;
            this.$refs.chatingTo.scrollTop = this.chatlistHeight;
          }
          this.chatlistHeight = this.$refs.chatingTo.scrollHeight;

          this.chatlistScroll()
        });
      },
      /*获取输入框焦点*/
      showLogo() {
        if (!this.showLogo) {
          let that = this;
          setTimeout(() => {
            that.$refs.textOn.focus();
          }, 10)
        }
      }
    },
    computed: {
      msgTypeCount: function () {
        let list = [];
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
      })
    }
  }
</script>

<style scoped lang="less">
  [v-cloak]{
    display:none;
  }
  .item /deep/ .el-badge__content {
    top: 6px;
    right: 0;
  }

  /*商品详情start*/
  .consultation /deep/ .shop-box {
    overflow: hidden !important;
    .el-dialog__body {
      overflow: hidden;
      padding-bottom:0;
    }
  }

  .shop-box {
    overflow: hidden !important;

  }

  .shop-detail {
    .card-text {
      font-size: 16px;
      line-height:36px;
      color: #666;
      padding: 5px;
      .image{
        width:100px;
        height:100px;
        display:block;
      }
    }
    .bottom {
      margin-top: 13px;
      line-height: 12px;
    }
    .clearfix:before,
    .clearfix:after {
      display: table;
      content: "";
    }
    .clearfix:after {
      clear: both
    }
    image {
      width: 100%;
      display: block;
    }
  }

  /*商品详情end*/

  .upImgBtn-style {
    background: #409EFF;
    font-size: 14px;
    padding: 5px;
    color: #fff;
    border-radius: 5px;
  }

  #upImgBtn {
    display: none;
  }

  .consultation /deep/ .el-tabs__header {
    margin-bottom: 0;
  }

  .consultation {
    border-radius: 5px;
    border: 1px solid #e5e5e5;
    position: absolute;
    left: 15px;
    right: 15px;
    top: 15px;
    bottom: 0px;
    /*height: calc(100% - 2px);*/
    overflow: hidden;
    .msg_main {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 17px;
      display: flex;
      /*height: calc(100% - 37px);*/
      /*height: 100%;*/
    }
    .msgLeft {
      background-color: #eee;
      border-right: 1px solid #e5e5e5;
      height: calc(100% - 50px);
      line-height: 32px;
      min-width: 390px;
      padding-bottom: 50px;
      position: relative;
      .free-table-style {
        position: relative;
        height: 100%;
      }
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
    /*padding-top: 110px;*/
    position: relative;
    overflow: hidden;
    .tipTitle {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      padding: 10px;
      line-height: 30px;
      .thirdTip {
        text-align: right;
      }
    }
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
        overflow: hidden;
        .chat-list-box {
          display: block;
          width: 100%;
          margin-bottom: 20px;
        }
        .chatlist-box {
          padding-bottom: 240px;
        }
        ul {
          overflow: hidden;
        }
        li {
          display: block;
          width: 100%;
          /*margin-bottom: 20px;*/
          overflow: hidden;
        }
      }
    }
  }

  .chat-box {
    /*height: calc(100% - 20px);*/
    overflow: hidden;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 180px;
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

  .report-style {
    .report-show {
      color: #36c2aa;
      cursor: pointer;
    }
    .thirdTip {
      margin-top:10px;
      text-align: right;
    }
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
    cursor: move;
    text-align: center;
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
