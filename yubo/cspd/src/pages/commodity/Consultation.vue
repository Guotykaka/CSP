<template>
  <div class="consultation" v-cloak>
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
                  <div class="fr chat-list-box" v-if="item.flag===2">
                    <div class="userPhotofr fr">
                      <img :src="areaImg||avatar" alt="" class="userPhotoImg">
                    </div>
                    <div class="fr user-circle">
                      <div class="user-main">
                        <span class="parting-line" style="text-align:right;">{{item.createTime}}</span>
                        <span v-if="item.type!=='2'&&item.type!=='8'">{{item.content}}</span>
                        <ul v-if="item.type==='2'" @click="showImgs(index)" :id="'img'+index">
                          <li>
                            <img :src="item.appendInfo||item.content" alt="" class="img-msg">
                          </li>
                        </ul>
                        <div class="report-style" v-if="item.type==='8'">
                          <span>点击按钮查看复检建议</span><br>
                          <!--<span>{{item.CheckUnitName}}</span>
                            <span>{{item.ConsultContent}}</span>-->
                          <el-button
                            type="success"
                            size="mini"
                            class="report-show"
                            v-if="advcieStatus"
                            @click="seeAdvice(item)"
                            style="color:#fff;margin-top:10px;">查看复检建议
                          </el-button>
                        </div>
                        <!--商品推送type==='9'-->
                        <div class="shop-box" v-if="item.type==='9'">
                          <div class="shop-box-card">
                            <div class="shop-img">
                              <img :src="changeShopData(item.appendInfo,'productIcon')" alt="图片加载失败">
                            </div>
                            <div class="shop-text">
                              <p class="shop-t-top">
                                <span class="text-top-left">{{changeShopData(item.appendInfo,'productName')}}</span>
                                <span class="text-top-right">已售{{changeShopData(item.appendInfo,'saleQuantity')||0}}件</span>
                              </p>
                              <p class="shop-t-bottom">
                                <span class="text-price">￥{{changeShopData(item.appendInfo,'originPrice')}}</span>
                                <el-tag class="chat-discount" size="mini">{{changeShopData(item.appendInfo,'couponText')||'暂无优惠'}}</el-tag>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="fl" v-else style="display: block;width: 100%;margin-bottom: 20px;">
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
                          <span>报告已接收,请查看</span><br>
                          <span class="report-show" @click="showReport(item)">查看完整体检报告</span>
                        </div>
                        <div class="report-style" v-if="item.type==='6'">
                          <span v-html="item.content"></span><br>
                          <p class="thirdTip" v-if="item.appendInfo">
                            <el-button v-if="reportStatus(item)" type="primary" size="mini" @click="showReport(item)">查看完整体检报告</el-button>
                            <el-button type="primary" size="mini" @click="getShopDetail(item)">查看商品详情</el-button>
                          </p>
                        </div>
                        <div class="report-style" v-if="item.type==='7'">
                          <span v-html="item.content"></span><br>
                          <p class="thirdTip" v-if="item.appendInfo">
                            <el-button v-if="reportStatus(item)" type="primary" size="mini" @click="showReport(item)">
                              查看完整体检报告
                            </el-button>
                            <el-button type="primary" size="mini"
                                       v-if="!chatReport(item)" @click="sendSuggestion(item)">发送复检建议
                            </el-button>
                            <el-button type="success" size="mini" v-else @click="seeAdvice(item)">查看复检建议</el-button>
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
            <!--<span class="text-right fr" @click="pushShop">推送商品</span>-->
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
    <!--提交复检建议-->
    <el-dialog :title="titleText" :visible.sync="adviceStatus" width="800px">
      <!--显示已选复检建议-->
      <el-form :inline="true" v-for="(item,index) in adviceList" :key="index" class="advice-style">
        <el-form-item style="width:30px;margin-right:0;" label-width="20px">{{index+1}}</el-form-item>
        <el-form-item label="检查名称" :label-width="formLabelWidth">
          <el-input readonly v-model="item.checkItemName"></el-input>
        </el-form-item>
        <el-form-item label="严重度" label-width="60px">
          <el-select disabled readonly v-model="item.seriousCase">
            <el-option label="严重" :value="1"></el-option>
            <el-option label="中等" :value="2"></el-option>
            <el-option label="轻微" :value="3"></el-option>
            <el-option label="正常" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="体检时间" label-width="70px">
          <el-input readonly v-model="item.suggestDay"></el-input>
        </el-form-item>
        <el-form-item label="" label-width="70px" v-if="adviceChatStatus">
          <i @click="delAdvice(index)" class="el-icon-circle-close-outline delclick-icon"></i>
        </el-form-item>
      </el-form>
      <div v-if="adviceChatStatus">
        <!--显示复检建议按钮-->
        <el-form v-if="addAdviceBtn" :inline="true" class="advice-style">
          <el-form-item label="添加检查项" style="margin-right:0;display:inline-block" label-width="120px">
            <i @click="addAdvice" class="el-icon-circle-plus-outline delclick-icon"></i>
          </el-form-item>
        </el-form>
        <!--选择复检建议-->
        <el-form v-else :inline="true" :model="adviceParams" class="advice-style">
          <el-form-item label="" style="width:30px;margin-right:0;" label-width="20px"></el-form-item>
          <el-form-item label="检查名称" :label-width="formLabelWidth">
            <el-input v-model="adviceParams.checkItemName"></el-input>
          </el-form-item>
          <el-form-item label="严重度" label-width="60px">
            <el-select v-model="adviceParams.seriousCase">
              <el-option label="严重" :value="1"></el-option>
              <el-option label="中等" :value="2"></el-option>
              <el-option label="轻微" :value="3"></el-option>
              <el-option label="正常" :value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="体检时间" label-width="70px">
            <el-input v-model="adviceParams.suggestDay" type="number"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="sureHandle">添加</el-button>
          </el-form-item>
        </el-form>
      </div>


      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="cancleAdvice">取 消</el-button>
        <el-button size="medium" type="primary" @click="sureAdvice">确 定</el-button>
      </div>
    </el-dialog>
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
              <el-col :span="14"><span>{{shopDetail.trueQuantity||'暂无数据'}}</span></el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="closeBox">关 闭</el-button>
      </div>
    </el-dialog>
    <!--商品详情弹窗-->
    <div id="shopBox" v-if="shopShowPush">
      <p class="shop-title" id="shopTitle" v-moveShop>商品列表</p>
      <el-input v-model="shopName" v-debounce="shopSearch" class="shop-input" placeholder="请输入商品名称"></el-input>
      <div class="shop-box-new">
        <div @click="pushShopMsg(item)" class="shop-box-card" v-for="item in shopList" :key="item.productId">
          <div class="shop-img">
            <img :src="item.productIcon" alt="图片加载失败">
          </div>
          <div class="shop-text">
            <p class="shop-t-top">
              <span class="text-top-left">{{item.productName}}</span>
              <span class="text-top-right">已售{{item.saleQuantity ||0}}件</span>
            </p>
            <p class="shop-t-bottom">
              <span class="text-price">￥{{item.originPrice}}</span>
              <el-tag class="text-discount" type="success" size="mini">{{item.couponText||'暂无优惠'}}</el-tag>
            </p>
          </div>
        </div>
      </div>
      <el-button class="shop-close-btn" @click="closeShop" size="mini">关 闭</el-button>
    </div>
  </div>
</template>

<script>
  // import report from '@/components/report.vue';
  import report from '@/components/reportNew.vue';
  import SetMeal from '@/components/setMeal.vue';
  import FreeTable from "@/pages/imgText_consult/FreeTable.vue"
  import {getStore,EncodeDoctorId} from "@/config/mUtils.js"
  import {mapState} from "vuex"
  import {
    ERR_OK,
    youPaiYunUpload,
    YOUPAIYUN_URL,
    getReportData,
    getRecheckSuggestionByWorkNo,//查看复检建议
    haveRecheckSuggestion,//查看体检报告是否有复检建议
    UsergetConsultList,//获取当前用户咨询记录
    UsergetProcessedList,//获取当前健管师已处理列表
    UsergetToBeTreatedList,//获取当前健管师待处理列表
    userSendToCustomer,//健管师回复客户信息
    getProductInfo,//获取单个商品信息
    sendRecheckSuggestion,//填写并发送复检建议
    addCustomerRemark,//添加备注
    getCustomerRemark,//获取备注信息
    getAppShopProductList,//查看所有配置的可推荐的供应链商品列表
    medicalSearchedCustomerList//搜索
  } from '@/api/api';
  import {storeManager,Base64} from '@/api/util.js';

  export default {
    name: 'consultation',
    components: {
      FreeTable,
      report,
      SetMeal
    },
    data() {
      return {
        reportData: {},
        isShowReport: false,//是否显示体检报告
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
        shopDetail: {},
        shopShow: false,
        adviceStatus: false,
        formLabelWidth: '80px',
        adviceParams: {
          checkItemName: '',
          seriousCase: '',
          suggestDay: null
        },
        adviceList: [],
        addAdviceBtn: true,
        reportWorkNo: '',
        advcieStatus: false,//是否发送过复检建议
        titleText: '提交复检建议',
        adviceChatStatus: true,
        doubleClick: true,//双击
        shopName:'',
        shopShowPush:false,
        shopList:[]
      }
    },
    activated() {
      this.userInfo = JSON.parse(getStore('userMesage'));
      this.searchParams.userId = EncodeDoctorId(this.userInfo.userId);
      this.getImgListStart();
      this.getImgListEnd();
      // this.getShopList();
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
          category: '1'
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
      /*判断是否有复检*/
      chatReport(val) {
        if (val.appendInfo.split(';').length > 1) {
          this.$message.error('老数据');
          return;
        } else if (Base64.decode(val.appendInfo).indexOf('{') === -1) {
          this.$message.error('老数据');
          return;
        }
        let value;
        value = JSON.parse(Base64.decode(val.appendInfo));
        this.advcieStatus = value.haveSuggest
        return this.advcieStatus
      },
      /*查看复检建议*/
      seeAdvice(val) {
        let value,params;
        this.titleText = '查看复检建议'
        this.adviceChatStatus = false
        if(val.flag===1){
          value = JSON.parse(Base64.decode(val.appendInfo));
          params = {
            workNo: value.workNo
          };
        }else if(val.flag===2){
          value = JSON.parse(val.content)
          params = {
            workNo: value.reportWorkNo
          };
        };
        getRecheckSuggestionByWorkNo(params).then((res) => {
          if (res.code === ERR_OK) {
            this.adviceList = res.data;
            this.adviceStatus = true;
          } else {
            this.$alert(res.msg, '提示')
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        });
        return this.advcieStatus
      },
      /*点击发送复检建议按钮*/
      sendSuggestion(val) {
        this.titleText = '创建复检建议'
        this.adviceChatStatus = true
        if (val.appendInfo.split(';').length > 1) {
          this.$message.error('老数据');
          return;
        } else if (Base64.decode(val.appendInfo).indexOf('{') === -1) {
          this.$message.error('老数据');
          return;
        }
        let value;
        value = JSON.parse(Base64.decode(val.appendInfo));
        this.reportWorkNo = value.workNo;
        this.adviceStatus = true;

      },
      /*删除复检建议*/
      delAdvice(index) {
        this.adviceList.splice(index, 1);
      },
      /*新增复检建议*/
      addAdvice() {
        this.adviceParams.checkItemName = '';
        this.adviceParams.seriousCase = '';
        this.adviceParams.suggestDay = null;
        this.addAdviceBtn = false;
      },
      /*确定新增*/
      sureHandle() {
        if (this.adviceParams.checkItemName === '') {
          this.$alert('请输入检查名称');
          return
        } else if (this.adviceParams.seriousCase === '') {
          this.$alert('请选择严重度');
          return
        } else if (this.adviceParams.suggestDay == null) {
          this.$alert('请输入体检时间');
          return
        }
        let value = JSON.parse(JSON.stringify(this.adviceParams));
        this.adviceList.push(value);
        this.addAdviceBtn = true;
      },
      /*取消提交复检建议*/
      cancleAdvice() {
        this.adviceStatus = false;
      },
      /*确定提交复检建议*/
      sureAdvice() {
        if (this.adviceChatStatus) {
          if (this.adviceList.length < 1) {
            this.$alert('请填写复检建议')
            return;
          }
          let params = {
            customerId: this.customId,
            docId: EncodeDoctorId(this.userInfo.userId),
            institutionCode: EncodeDoctorId(this.userInfo.institutionCode),
            reportWorkNo: this.reportWorkNo,
            suggestionContent: this.adviceList
          };
          if (this.doubleClick) {
            this.doubleClick = false;
            sendRecheckSuggestion(params)
              .then((res) => {
                if (res.code === ERR_OK) {
                  this.handleClick();
                  this.adviceList = [];
                  this.adviceStatus = false;
                } else {
                  this.$alert(res.msg, '提示')
                }
                this.doubleClick = true;
              })
              .catch(() => {

                this.doubleClick = true;
                this.$message.error('网络错误!请稍后重试')
              })
          }

        } else {
          this.adviceStatus = false;
        }
      },
      /*打开推送商品弹窗*/
      pushShop() {
        this.shopName = '';
        this.shopShowPush = true;
      },
      /*供应链商品列表*/
      getShopList() {
        let params = {};
        getAppShopProductList(params)
          .then((res) => {
            if (res.code === ERR_OK) {
              this.shopAllList = res.data;
              this.shopList = res.data;
            } else {
              this.$alert(res.msg, '提示')
            }
          })
          .catch((res) => {
            this.$message.error('网络错误!获取商品列表失败,请稍后重试!')
          })
      },
      /*搜索商品*/
      shopSearch() {
        let arr = [];
        arr = this.shopAllList.filter((val) => {
          return val.productName.indexOf(this.shopName) > -1;
        });
        this.shopList = arr;
      },
      /*发送商品信息*/
      pushShopMsg(value) {
        let params = {
          appendInfo: JSON.stringify(value),
          content: "",
          customId: this.customId,
          userId: EncodeDoctorId(this.userInfo.userId),
          type: '9',
          category: '1'
        };
        if(this.customId===''){
          this.$message.error('请选择用户');
          return;
        }
        if (this.docubleClik) {
          this.docubleClik = false;
          userSendToCustomer(params).then((res) => {
            if (res.code === ERR_OK) {
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
      /*关闭商品弹窗*/
      closeShop() {
        this.shopShowPush = false;
      },
      /*商品数据转换*/
      changeShopData(value,key){
        if(value){
          let shopData = JSON.parse(value);
          return shopData[key]
        }else{
          return ''
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
      moveShop: {
        inserted() {
          let box = document.getElementById("shopBox");
          let boxClick = document.getElementById("shopTitle");
          boxClick.onmousedown = function (ev) {
            let disX = ev.clientX - box.offsetLeft;
            let disY = ev.clientY - box.offsetTop;
            document.onmousemove = function (ev) {
              let l = ev.clientX - disX;
              let t = ev.clientY - disY;
              box.style.left = l + 'px';
              box.style.top = t + 'px';
            };
            document.onmouseup = function () {
              document.onmousemove = null;
              document.onmouseup = null;
            };
          };
        }
      },
      /*函数节流*/
      debounce: {
        inserted: function (el, binding) {
          let timer;
          el.addEventListener('keyup', () => {
            if (timer) {
              clearTimeout(timer)
            }
            timer = setTimeout(() => {
              binding.value()
            }, 300)
          })
        }
      }
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
    },
    filters:{
      sexSelect(val){
        if(val==='0'){
          return '女'
        }else if(val==='1'){
          return '男'
        }else{
          return ''
        }
      },
      birthdaySlice(val){
        if(val){
          val = val.slice(0,10)
        }
        return val
      }
    }
  }
</script>

<style scoped lang="less">
  [v-cloak]{
    display:none;
  }
  html, body {
    height: 100%;
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
    overflow: hidden;
    .msg_main {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 17px;
      display: flex;
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
          overflow: hidden;
        }
      }
    }
  }

  .chat-box {
    overflow: hidden;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 180px;
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
    resize: none;
    font-size:14px;
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
  .movedown-enter-active, .movedown-leave-active {
    transition: all 0.5s linear;
  }

  .movedown-enter, .movedown-leave-active {
    transform: translateY(-400px);
  }
  /*复检建议start*/
  .advice-style /deep/ .el-form-item__content {
    width: 100px;
  }

  .advice-style /deep/ .el-form-item {
    height: 40px;
    margin-bottom: 5px;
  }

  .advice-style {
    .delclick-icon {
      font-size: 40px;
      line-height: 40px;
      color: rgba(64, 158, 255, .7);
      cursor: pointer;
    }
  }

  .dialog-footer {
    text-align: center;
  }

  /*复检建议end*/
  /*商品详情弹窗start*/
  #shopBox {
    position: fixed;
    width: 280px;
    height: 398px;
    padding-bottom: 40px;
    right: 15px;
    top: 100px;
    background-color: #f3f3f3;
    z-index: 100;
    border: 1px solid #e6e6e6;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
    .shop-title {
      line-height: 40px;
      font-size: 16px;
      vertical-align: middle;
      padding-left: 10px;
      cursor: move;
    }
    .shop-input {
      height: 40px;
    }
    .shop-box-new {
      height: 320px;
      overflow-y: scroll;
      border-bottom: 1px solid #e5e5e5;
      border-top: 1px solid #e5e5e5;
    }
    .shop-box-card {
      width:260px;
      display: flex;
      padding: 10px;
      cursor: pointer;
      border-bottom: 1px solid #e5e5e5;
      &:last-of-type {
        border: none;
      }
      &:hover {
        background: #999;
      }
      .shop-img {
        width: 60px;
        height: 60px;
        margin-right: 10px;
        box-sizing: border-box;
        img {
          width: 60px;
          height: 60px;
        }
      }
      .shop-text {
        float: left;
        flex: 1;
        position: relative;
        .shop-t-top {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          overflow: hidden;
          .text-top-left {
            float: left;
          }
          .text-top-right {
            float: right;
          }
        }
        .shop-t-bottom {
          position: absolute;
          bottom: 0;
          .text-price {
            margin-right: 10px;
          }
        }
      }

    }
    ::-webkit-scrollbar {
      width: 3px;
    }
    .shop-close-btn {
      position: absolute;
      bottom: 6px;
      left: 50%;
      margin-left: -30px;
    }
  }
  .shop-box-card {
    width:280px;
    display: flex;
    padding: 10px;
    cursor: pointer;
    .shop-img {
      width: 60px;
      height: 60px;
      margin-right: 10px;
      box-sizing: border-box;
      img {
        width: 60px;
        height: 60px;
      }
    }
    .shop-text {
      float: left;
      flex: 1;
      position: relative;
      .shop-t-top {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        overflow: hidden;
        .text-top-left {
          float: left;
        }
        .text-top-right {
          float: right;
        }
      }
      .chat-discount{
        color:#fff;
        background:#999;
      }
      .shop-t-bottom {
        position: absolute;
        bottom: 0;
        .text-price {
          margin-right: 10px;
        }
      }
    }

  }
  /*商品详情弹窗end*/
</style>
