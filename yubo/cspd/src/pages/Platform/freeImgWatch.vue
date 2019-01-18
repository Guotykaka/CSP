<template>
  <div class="free_img_watch" v-cloak>
    <!--信息头部-->
    <div class="watch-search">
      <el-form :inline="true" :model="searchParams" class="demo-form-inline">
        <el-form-item label="服务医生：">
          <el-select clearable filterable v-model="searchParams.userId" placeholder="请选择服务医生">
            <el-option v-for="(item,index) in healthListData" :key="index" :label="item.userName" :value="item.userId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="消息状态：">
          <el-select v-model="searchParams.status" placeholder="请选择消息状态">
            <el-option label="待处理" value="1"></el-option>
            <el-option label="已处理" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务时间">
          <el-date-picker
            v-model="rangeTime"
            @change="getselTime"
            clearable
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchHandle">搜 索</el-button>
          <el-button type="primary" @click="clearParams">清 除</el-button>
          <el-button type="primary" @click="toStatistics">数据统计</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="imgtext-main">
      <div class="msg_main">
        <div class="msgLeft">
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
          <div class="chat-box" v-if="chatCircleMsgShow">
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
                        <p style="text-align:right;">{{item.healthName}}</p>
                        <div class="user-main">
                          <span class="parting-line" style="text-align:right;">{{item.createTime}}</span>
                          <span v-if="item.type!=='2'&&item.type!=='3'">{{item.content}}</span>
                          <ul v-if="item.type==='2'" @click="showImgs(index)" :id="'img'+index">
                            <li>
                              <img :src="item.appendInfo||item.content" alt="" class="img-msg">
                            </li>
                          </ul>
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
                        <span class="minCirclefr"></span>
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
                              <img :src="ite" v-for="(ite,i) in compileCode(item.appendInfo)" :key="i" alt=""
                                   class="img-msg">
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
              <el-button type="primary" size="mini" disabled>添加图片</el-button>
            </div>
            <div class="text-image">
              <div class="addImgBox" v-if="showLogo">
                <div class="addImg">
                  <img :src="chatImg" class="img-logo-cicle">
                  <!--删除按钮-->
                  <span class="delIcon" id="deleteLogo" v-if="showLogo">-</span>
                </div>
              </div>
              <textarea ref="textOn" v-show="!showLogo" disabled placeholder="请输入内容"
                        v-model="showMsg"
                        class="text-area"></textarea>
            </div>
            <div class="btn-main">
              <div class="btn-text" v-if="!showLogo">ctrl+Enter&nbsp;可直接提交发送文字</div>
              <el-button type="primary" size="mini" disabled>发送</el-button>
            </div>
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
    <!--导出统计数据-->
    <el-dialog title="数据统计" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="服务时间">
          <el-date-picker
            v-model="rangeTime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleBtn">取 消</el-button>
        <el-button type="primary" @click="exportExcel">导出表格</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  // import report from '@/components/report.vue';
  import report from '@/components/reportNew.vue';
  import SetMeal from '@/components/setMeal.vue';
  import FreeTable from "@/pages/imgText_consult/FreeTable.vue"
  import {getStore,EncodeDoctorId} from "@/config/mUtils.js"
  import {API_REPORT_EXCEL} from '@/config/env';
  import {mapState} from "vuex"
  import {
    ERR_OK,
    getConsultList,//获取当前用户咨询记录
    getProcessedList,//获取当前健管师已处理列表
    getToBeTreatedList,//获取当前健管师待处理列表
    freeSendToCustomer,//健管师回复客户信息
    youPaiYunUpload,
    YOUPAIYUN_URL,
    getReportData,
    appListAppExamAddition,
    appListAppExamSuiteDetail,
    healthList,
    searchConsultList
  } from '@/api/api';
  import {storeManager} from '@/api/util.js';

  export default {
    name: 'freeImgWatch',
    components: {
      FreeTable,
      report,
      SetMeal
    },
    data() {
      return {
        rangeTime:'',
        searchParams:{
          currentPage: 1,
          endTime: "",
          userId: "",
          pageSize: 10,
          startTime: "",
          status: "1"
        },
        healthListData:[],/*健管师列表*/
        reportData: {},
        isShowReport: false,//是否显示体检报告
        reportSetMeal: {},//体检套餐参数
        tableData:[],//体检套餐数据
        addList:[],//加项数据
        setMealShow: false,//是否显示体检套餐
        addLoading:false,//显示体检套餐loading
        refreshNum:null,
        activeName: 'first',
        totalcount: null,
        totalcountStart: null,
        totalcountEnd: null,
        userInfo: {},//用户信息
        showMsg: '',
        orderList: {},//用户列表
        chatImg: null,//聊天图片
        showLogo: false,//
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
        pullLoading:false,
        showSex:1,//性别
        dialogFormVisible:false
      }
    },
    activated() {
      this.getHealthList();
      this.searchHandle();
      this.$refs.textOn.focus();
    },
    methods: {
      //获取时间
      getselTime() {
        if (this.rangeTime) {
          this.searchParams.startTime = this.rangeTime[0];
          this.searchParams.endTime = this.rangeTime[1];
        }
      },
      /*获取健管师列表*/
      getHealthList(){
        let params = {
          currentPage: 1,//页码
          pageSize: 1000//每页大小
        };
        healthList(params).then((res)=>{
          if(res.code===ERR_OK){
            this.healthListData = res.data.list;
          }else{
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
      /*点击搜索*/
      searchHandle(){
        this.searchParams.currentPage=1;
        this.searchParams.pageSize = 10;
        this.searchClick()
      },
      /*搜索*/
      searchClick(){
        let params={
          currentPage: this.searchParams.currentPage,//页码
          endTime: this.searchParams.endTime,//结束时间
          userId: this.searchParams.userId,//健管师id
          pageSize: this.searchParams.pageSize,//每页大小
          startTime: this.searchParams.startTime,//开始时间
          status: this.searchParams.status//处理状态
        };
        this.orderList = []
        searchConsultList(params).then((res)=>{
          if(res.code===ERR_OK){
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
            }else{
              this.chatList = []
            }
          }else{
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
      /*清除搜索参数*/
      clearParams(){
        this.searchParams={
          currentPage: 1,
            endTime: "",
            userId: "",
            pageSize: 10,
            startTime: "",
            status: "1"
        };
        this.rangeTime = null
      },
      //列表每页显示多少条
      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this.searchClick();
      },
      //列表跳转第几页
      handleCurrentChange(val) {
        this.searchParams.currentPage = val;
        this.searchClick();
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
          userId: this.userInfo.userId,
          pageSize: 20
        };
        getConsultList(params).then((res) => {
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
        }).catch((err)=>{
          this.$alert(err.msg, '提示', {
            confirmButtonText: '确定',
          })
        });
      },
      /*使loading效果更明显*/
      getLoading(){
        let that = this;
        setTimeout(function(){
          that.pullLoading = false;
        },300)
      },
      /*体检报告展示*/
      showReport(val) {
        let value = val || this.chatCircleMsg;
        let params = {
          workNo: value.appendInfo.split(';')[0],
          checkUnitCode: value.appendInfo.split(';')[1]
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
        }).catch(err => {
          this.$alert(err.msg, '提示', {
            confirmButtonText: '确定',
          })
        });
      },
      //关闭报告
      closeReport() {
        this.isShowReport = false;
      },
      /*查看体检套餐*/
      checkSetMeal(val) {
        this.addLoading = true;
        this.reportSetMeal = val.appendInfo;
        this.refreshNum = Date.parse(new Date());
        this.showSex = +val.appendInfo.split(';')[3];
        this.getExamSuitDetail();
      },
      //关闭体检套餐
      closeMeal() {
        this.setMealShow = false;
      },
      /*获取预约套餐详情*/
      getExamSuitDetail(){
        /*{\"examPackageID\":\"11656\",\"idOrgPatient\":\"58\",\"institutionID\":\"449\",\"sex\":\"1\"}";*/
        let params= {
          accessToken: "string",
          examPackageID: this.reportSetMeal.split(';')[0],//套餐id
          institutionID: this.reportSetMeal.split(';')[2]//机构id
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
          this.$alert(err.msg, '提示', {
            confirmButtonText: '确定',
          })
        })
      },
      /*获取可购买加项列表*/
      getExamAddition(){
        let params= {
          accessToken: "string",
          examPackageID: this.reportSetMeal.split(';')[0],//套餐id
          accountId:this.reportSetMeal.split(';')[4],//新增字段
          guidGroupReservation:this.reportSetMeal.split(';')[5],//新增字段
          idOrgPatient: this.reportSetMeal.split(';')[1],//团检id
          institutionID: this.reportSetMeal.split(';')[2],//机构id
          sex: +this.reportSetMeal.split(';')[3]//性别
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
          if (this.scrollStatus && this.$refs.chatingTo.scrollTop < 10 && this.$refs.chatingTo.scrollTop >0 && this.chatcurrentPage < this.chatPage) {
            that.scrollStatus = false;
            that.chatcurrentPage++;
            this.pullLoading = true;
            that.queryInsConsultChatList();
          }
        }, false)
      },
      /*数据统计*/
      toStatistics() {
        this.dialogFormVisible = true
        // this.$router.push('/statisticsPage')
      },
      /*导出数据统计表格*/
      exportExcel(){
        let params = {
          day: this.rangeTime,
        };
        if(!params.day){
          this.$alert('请选择时间', '提示');
          return;
        }
        let paramString =
          'day=' + params.day;
        var url = API_REPORT_EXCEL +'?'+ paramString.toString();

        this.dialogFormVisible = false;
        this.rangeTime = '';
        window.open(url)

      },
      /*取消导出表格*/
      cancleBtn(){
        this.dialogFormVisible = false;
        this.rangeTime = '';
      },
      /*商品数据转换*/
      changeShopData(value,key){
        if(value){
          let shopData = JSON.parse(value);
          return shopData[key]
        }else{
          return ''
        }
      },
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
  .item /deep/ .el-badge__content {
    top: 6px;
    right: 0;
  }

  #upImgBtn {
    display: none;
  }
  .free_img_watch{
    display:flex;
    flex-direction:column;
    position: absolute;
    left:15px;
    right:15px;
    top:15px;
    bottom:0px;
    .watch-search{
      /*height:70px;*/
    }
    .imgtext-main {
      border-radius: 5px;
      border: 1px solid #e5e5e5;
      position: relative;
      overflow: hidden;
      flex: 1;
      .msg_main {
        position: absolute;
        left:0;
        right:0;
        top:0;
        bottom:17px;
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
      .firstTip {

      }
      .secondTip {

      }
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
    /*height: 100%;*/
    position: absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
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
    background:#fff;
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
    top: 35px;
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
    .shop-box {
      height: 320px;
      overflow-y: scroll;
      border-bottom: 1px solid #e5e5e5;
      border-top: 1px solid #e5e5e5;
    }
    ::-webkit-scrollbar {
      width: 3px;
    }
    .shop-box-card {
      box-sizing:border-box;
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
