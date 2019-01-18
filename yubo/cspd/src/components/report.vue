<template>
  <div class="report-container">
    <div class="report-nav">
      <div class="nav-box">
        <a class="nav-item" :class="currentHash === 'baseInfo' ? 'active' : ''" @click="_navClick('baseInfo')">基本信息</a>
        <a class="nav-item" :class="currentHash === 'summary' ? 'active' : ''" @click="_navClick('summary')">一般建议</a>
        <a class="nav-item" :class="currentHash === 'suggest' ? 'active' : ''" @click="_navClick('suggest')">报告总结</a>
        <a class="nav-item" :class="currentHash === index ? 'active' : ''" v-for="(item,index) in reportData.CheckItems" :key="index" @click="_navClick(index)">{{item.CheckItemName}}</a>
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
            <p class="baseInfoText">姓名：{{reportData.CustomerName}}</p>
          </el-col>
          <el-col :span="8">
            <p class="baseInfoText">性别：
              <span v-if="reportData.Sex == 0">女</span>
              <span v-else>男</span>
            </p>
          </el-col>
          <el-col :span="8">
            <p class="baseInfoText">年龄：{{reportData.Age}}</p>
          </el-col>
          <el-col :span="8">
            <p class="baseInfoText">体检机构：{{reportData.CheckUnitName}}</p>
          </el-col>
          <el-col :span="8">
            <p class="baseInfoText">体检编号：{{reportData.WorkNo}}</p>
          </el-col>
          <el-col :span="8">
            <p class="baseInfoText">到检日期：{{reportData.RegDate}}</p>
          </el-col>
          <el-col :span="8">
            <p class="baseInfoText">过检日期：{{reportData.ReportDate}}</p>
          </el-col>
        </el-row>
      </el-card>

      <!--报告小结-->
      <el-card class="box-card" id="summary">
        <div slot="header" class="clearfix">
          <strong>一般建议</strong>
          <strong style="float:right;padding-right:30px;" v-if="reportData.GeneralAdvices">{{reportData.GeneralAdvices.length}}项</strong>
        </div>
        <ul class="brief-summary">
          <li class="summary-list" v-for="(list,index) in reportData.GeneralAdvices">
            <p class="summary-text">{{index+1}}.&nbsp;体检结果：<strong>{{list.AdviceName}}</strong></p>
            <p class="summary-text"><strong>建议内容：</strong>{{list.AdviceDescription}}</p>
          </li>
        </ul>
      </el-card>

      <!--总检建议-->
      <el-card class="box-card" id="suggest">
        <div slot="header" class="clearfix">
          <strong>报告总结</strong>
          <strong style="float:right;padding-right:30px;" v-if="reportData.GeneralSummarys">{{reportData.GeneralSummarys.length}}项</strong>
        </div>
        <ul class="brief-summary">
          <li class="summary-list" v-for="(list,index) in reportData.GeneralSummarys||[]" :key="index">
            <p class="summary-text">{{index+1}}.&nbsp;体检项目：<strong>{{list.SummaryName}}</strong></p>
            <p class="summary-text"><strong>描述：</strong>{{list.SummaryDescription}}</p>
          </li>
        </ul>
      </el-card>

      <el-card class="box-card" v-if="reportData.CheckItems" v-for="(item,index) in reportData.CheckItems" :key="index" :id="index">
        <div slot="header" class="clearfix">
          <strong>{{item.CheckItemName}}</strong>
          <strong style="float:right;padding-right:30px;" v-if="item.CheckItemName">{{item.CheckItemName.length}}项</strong>
        </div>
        <el-table
          :data="item.CheckResults"
          border
          style="width: 100%">
          <el-table-column prop="CheckIndexName" label="检查项"  width="200"></el-table-column>
          <el-table-column prop="ResultValue" label="检查结果"></el-table-column>
          <el-table-column prop="ValueRef" label="参考值"></el-table-column>
          <el-table-column prop="Unit" label="单位"></el-table-column>
          <el-table-column label="提示"></el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>
<script>

  export default {
    props:{
      reportData:{
        type:Object,
        default:{}
      }
    },

    data(){
      return{
        currentHash:'baseInfo',
      }
    },

    methods:{
      //点击nav
      _navClick: function (index) {
        var scrollTopVal=document.getElementById(index).offsetTop-84;//需要滚动到的位置
        document.getElementById("report-content").scrollTop=scrollTopVal;
        this.currentHash=index;
      }
    },
  }
</script>

<style lang="less">
  .box-card{margin-bottom: 15px;}
  .report-container{display: flex;height: 500px}
  .report-nav{width: 160px;height:100%;overflow: auto}
  .report-content{flex: 1;height: 100%;overflow: auto;transition: all 0.5s}
  .report-nav .nav-item{display: block;line-height: 22px;padding: 5px 0;color:#333;font-weight: bold;text-align: center;cursor: pointer}
  .report-nav .nav-item.active{color:#409EFF;}
  .baseInfoText {font-size: 14px;line-height: 21px;padding: 10px 0;color: #666;}
  .summary-text{font-size: 14px;line-height: 21px;margin-bottom: 5px;color: #666;}
</style>

