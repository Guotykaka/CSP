<template>
  <div class="report-page"
    v-loading="reprotLoading">
    <div class="report-main" v-if="reprotShow">
      <div class="return-Btn">
        <el-button size="medium" type="primary" @click="returnBtn">返 回</el-button>
      </div>
      <div class="report-title">
        <el-row><span>姓名：{{reportDetail.customerName}}</span></el-row>
        <el-row><span>性别：{{reportDetail.sex | sexSel}}</span></el-row>
        <el-row><span>出生日期：{{reportDetail.birthday | birthdaySel}}</span></el-row>
      </div>
      <div class="report-box">
        <el-card class="box-card" shadow="hover" v-if="reportDetail.abandonCheckResults">
          <div slot="header" class="clearfix">
            <span>报告异常项目</span>
          </div>
          <el-tag class="tag-style" v-for="(item,index) in reportDetail.abandonCheckResults" :key="index">
            {{item.checkIndexName}}
          </el-tag>
        </el-card>
        <div class="report-container" ref="containerBox">
          <div class="report-nav-down">
            <div class="nav-box">
              <a class="nav-item" :class="currentHash === 'baseInfo' ? 'active' : ''" @click="_navClick('baseInfo')">基本信息</a>
              <a class="nav-item" :class="currentHash === 'summary' ? 'active' : ''" @click="_navClick('summary')">一般建议</a>
              <a class="nav-item" :class="currentHash === 'suggest' ? 'active' : ''" @click="_navClick('suggest')">报告总结</a>
              <a class="nav-item" :class="currentHash === index ? 'active' : ''" v-for="(item,index) in reportDetail.checkItems" :key="index" @click="_navClick(index)">{{item.checkItemName}}</a>
            </div>
          </div>
          <div class="report-content" id="report-content">
            <!--基本信息-->
            <el-card class="box-card" id="baseInfo">
              <div slot="header" class="clearfix">
                <strong>基本信息</strong>
              </div>
              <el-row :gutter="20">
                <el-col :span="8">
                  <p class="baseInfoText">姓名：{{reportDetail.customerName}}</p>
                </el-col>
                <el-col :span="8">
                  <p class="baseInfoText">性别：
                    <span v-if="reportDetail.sex === 0">女</span>
                    <span v-else>男</span>
                  </p>
                </el-col>
                <el-col :span="8">
                  <p class="baseInfoText">年龄：{{reportDetail.age}}</p>
                </el-col>
                <el-col :span="8">
                  <p class="baseInfoText">体检机构：{{reportDetail.checkUnitName}}</p>
                </el-col>
                <el-col :span="8">
                  <p class="baseInfoText">体检编号：{{reportDetail.workNo}}</p>
                </el-col>
                <el-col :span="8">
                  <p class="baseInfoText">到检日期：{{reportDetail.regDate}}</p>
                </el-col>
                <el-col :span="8">
                  <p class="baseInfoText">过检日期：{{reportDetail.reportDate}}</p>
                </el-col>
              </el-row>
            </el-card>
            <!--报告小结-->
            <el-card class="box-card" id="summary">
              <div slot="header" class="clearfix">
                <strong>一般建议</strong>
                <strong style="float:right;padding-right:30px;" v-if="reportDetail.generalAdvices">{{reportDetail.generalAdvices.length}}项</strong>
              </div>
              <ul class="brief-summary">
                <li class="summary-list" v-for="(list,index) in reportDetail.generalAdvices" :key="index">
                  <p class="summary-text">{{index+1}}.&nbsp;体检结果：<strong>{{list.adviceName}}</strong></p>
                  <p class="summary-text"><strong>建议内容：</strong>{{list.adviceDescription}}</p>
                </li>
              </ul>
            </el-card>
            <!--总检建议-->
            <el-card class="box-card" id="suggest">
              <div slot="header" class="clearfix">
                <strong>报告总结</strong>
                <strong style="float:right;padding-right:30px;" v-if="reportDetail.generalSummarys">{{reportDetail.generalSummarys.length}}项</strong>
              </div>
              <ul class="brief-summary">
                <li class="summary-list" v-for="(list,index) in reportDetail.generalSummarys||[]" :key="index">
                  <p class="summary-text">{{index+1}}.&nbsp;体检项目：<strong>{{list.summaryName}}</strong></p>
                  <p class="summary-text"><strong>描述:</strong>{{list.summaryDescription}}</p>
                </li>
              </ul>
            </el-card>
            <!--综述建议-->
            <el-card class="box-card" id="summarize">
              <div slot="header" class="clearfix">
                <strong>总检建议</strong>
                <strong style="float:right;padding-right:30px;" v-if="reportDetail.GeneralSummarys">{{reportDetail.GeneralSummarys.length}}项</strong>
              </div>
              <ul class="brief-summary">
                <li class="summary-list" v-for="(list,index) in reportDetail.generalSummarys||[]" :key="index">
                  <p class="summary-text">建议名称：<strong>{{list.summaryName}}</strong></p>
                  <p class="summary-text">建议描述：{{list.summaryDescription}}</p>
                </li>
              </ul>
            </el-card>
            <el-card class="box-card" v-if="reportDetail.checkItems" v-for="(item,index) in reportDetail.checkItems"
                     :key="index" :id="index">
              <div slot="header" class="clearfix">
                <strong>{{item.checkItemName}}</strong>
                <strong style="float:right;padding-right:30px;"
                        v-if="item.checkResults">{{item.checkResults.length}}项</strong>
              </div>
              <el-table
                :data="item.checkResults"
                border
                style="width: 100%">
                <el-table-column prop="checkIndexName" label="检查项" width="200"></el-table-column>
                <el-table-column prop="resultValue" label="检查结果"></el-table-column>
                <el-table-column prop="valueRefFormat" label="参考值"></el-table-column>
                <el-table-column prop="unit" label="单位"></el-table-column>
                <el-table-column label="提示"></el-table-column>
              </el-table>
            </el-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    ERR_OK,
    getReportData,//获取用户的体检报告
  } from '@/api/api'

  export default {
    name: "reportPage",
    data() {
      return {
        currentHash:'baseInfo',
        reportList: [],
        reportDetail: {},
        currentIndex: 0,
        selIndex:0,
        fixStatus:false,
        showStatus:true,
        statusView:true,
        customerNameReport:'',
        mobileReport:'',
        reprotLoading:false,
        reprotShow:false
      }
    },
    props:{
      checkUnitCode:{
        type:String,
        default:''
      },
      workNo:{
        type:String,
        default:''
      }
    },
    created(){
      this.getReportDetail();
    },
    methods: {
      //点击nav
      _navClick: function (index) {
        var scrollTopVal=document.getElementById(index).offsetTop-561;//需要滚动到的位置
        document.getElementById("report-content").scrollTop=scrollTopVal;
        this.currentHash=index;
      },
      getReportDetail() {
        this.reprotLoading = true;
        this.reprotShow = false;
        this.reportDetail = {};
        let params = {
          checkUnitCode: this.checkUnitCode,
          workNo: this.workNo
        };
        this.statusView = false;
        getReportData(params).then((res) => {
          if (res.code === ERR_OK) {
            this.reportDetail = res.data;
            this.statusView = true;
            this.reprotShow = true;
          } else {
            this.$alert(res.msg, '提示')
            this.$emit('returnPage',true)
          }
          this.getLoading();
        }).catch(() => {
          this.getLoading();
          this.$emit('returnPage',true)
          this.$message.error('网络错误!请稍后重试')
        })
      },
      /*loading延时*/
      getLoading(){
        let that = this;
        setTimeout(function(){
          that.reprotLoading = false;
        },500)
      },
      /*向左移动*/
      leftBtn(){
        if(this.reportList.length-this.currentIndex<5){
          return;
        }
        this.currentIndex++;
        this.$refs.itemListBox.style.marginLeft=-210*this.currentIndex+'px';
      },
      /*向右移动*/
      rightBtn(){
        if(this.currentIndex<1){
          return;
        }
        this.currentIndex--;
        this.$refs.itemListBox.style.marginLeft=-210*this.currentIndex+'px';
      },
      /*选中相应报告*/
      selReport(index){
        this.selIndex = index;
        this.reportDetail = this.reportList[this.selIndex]
      },
      returnBtn(){
        this.$emit('returnPage',true)
      }
    },
    filters: {
      dateShow(timestamp) {
        let value = timestamp / 1000
        var date = new Date(value);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        return Y + M + D;
      },
      sexSel(val){
        if(val===1){
          return '男'
        }else if(val===0){
          return '女'
        }else{
          return ''
        }
      },
      birthdaySel(value){
        var y,m,d;
        if(value){
           y = value.slice(0,4)+'年';
           m = value.slice(4,6)+'月';
           d = value.slice(6,8)+'日'
        };
        return y+m+d
      }
    },
    watch:{
      customerNameReport(){
        // this.reprotLoading=true;
        this.reprotShow = false;
      },
      reportList(){
        this.statusView = true
        let that = this;
        setTimeout(function(){
          that.$refs.itemBox.style.width = 210*that.reportList.length-10+'px';
          that.$refs.itemListBox.style.width = 210*that.reportList.length+'px'
        },500)
      },
      reportDetail(val){
        if(val.length===0){
          this.$router.go(-1);
        }
      }
    }
  }
</script>
<style scoped lang="less">
  .report-page{
    min-height:500px;
  }
  .return-Btn{
    margin-bottom:10px;
  }
  .err-text{
    font-size:36px;
    line-height:36px;
    text-align:center;
  }
  .box-card{margin-bottom: 15px;}
  .report-container{display: flex;  height: 700px}
  .report-nav-down{width: 160px;height:100%;overflow: auto}
  .report-content{flex: 1;height: 100%;overflow: auto;transition: all 0.5s}
  .report-nav-down .nav-item{display: block;line-height: 22px;padding: 5px 0;color:#333;font-weight: bold;text-align: center;cursor: pointer}
  .report-nav-down .nav-item.active{color:#409EFF;}
  .baseInfoText {font-size: 14px;line-height: 21px;padding: 10px 0;color: #666;}
  .summary-text{font-size: 14px;line-height: 21px;margin-bottom: 5px;color: #666;}

  .report-title {
    background: #3c8dbc;
    color: #fff;
    text-align: center;
    line-height: 28px;
    padding: 5px;
  }

  .report-nav {
    width:100%;
    text-align: center;
    margin: 0 auto;
    .nav-text {
      color: #3c8dbc;
      text-align: left;
      padding: 10px 0 10px 20px;
      line-height: 28px;
    }
  }

  .report-nav /deep/ .el-carousel__item--card.is-active {
    background-color: #67C23A;
    color: #fff;
  }

  .report-box {
    .tag-style {
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
  .report-box /deep/ .el-card__header{
    margin-top:10px;
  }
  .report-box /deep/ .el-card__header,
  .report-box /deep/ .el-card__body{
    padding-top:10px;
    padding-bottom:10px;
  }

  /*轮播图样式*/
  .item-list-box{
    transition: all .5s ease;
  }
  .card-box {
    min-width:840px;
    height:150px;
    overflow: auto;
    position: relative;
    text-align: center;
    margin: 0 auto;
    padding:0 50px;
    .left-btn {
      position: absolute;
      top: 50%;
      left: 0;
      bottom: 0;
    }
    .right-btn {
      position: absolute;
      top: 50%;
      right: 0;
      bottom: 0;
    }
    .left-btn,
    .right-btn {
      width: 50px;
      height: 50px;
      color:#666;
      background: rgba(64, 158, 255, .1);
      font-size: 40px;
      margin-top:-25px;
      &:hover{
        color:#fff;
        background:rgba(64, 158, 255, 1);
        cursor: pointer;
      }
    }
    .item-box{
      max-width:830px;
      height:150px;
      overflow:hidden;
      margin:0 auto;
      .item-list-box{
        overflow:hidden;
      }
    }
    .card-box-item {
      width: 198px;
      height: 150px;
      font-size: 16px;
      text-align: center;
      line-height: 32px;
      margin-right: 10px;
      float:left;
      background-color: rgba(64, 158, 255, .1);
      border: 1px solid rgba(64, 158, 255, .1);
      h3 {
        font-size: 14px;
        opacity: 0.75;
        margin: 0;
      }
      &:hover{
        color:#fff;
        background:rgba(64, 158, 255, 1);
        cursor: pointer;
      }
    }
    .selItem{
      background:#67C23A;
      color:#fff;
    }

  }
</style>
