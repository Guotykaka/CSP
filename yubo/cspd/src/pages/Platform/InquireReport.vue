<template>
  <div class="inquire-report">
    <div
      class="page-container"
      v-loading="loading2"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <!-- 报告查询页面 -->
        <!-- 操作行-->
        <el-row>
          <el-form :model="searchParams" :inline="true" class="demo-form-inline">
            <el-form-item label="体检机构编码：">
              <el-input v-model="searchParams.checkUnitCode" placeholder="请填写机构编码" @keyup.enter.native="doSearch()"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="体检报告编号：">
              <el-input v-model="searchParams.workNo" placeholder="请填写报告编号" @keyup.enter.native="doSearch()"
                        clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="doSearch()" class="m_l_15">查询</el-button>
            </el-form-item>
          </el-form>
        </el-row>

      <el-main>
        <!--{{reportData}}-->
        <div class="report-container" v-if="reportData">
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
                <strong>一般总结</strong>
              </div>
              <ul class="brief-summary">
                <li class="summary-list" v-for="(list,index) in reportData.GeneralSummarys" :key="index">
                  <p class="summary-text">{{index+1}}.&nbsp;体检项目：<strong>{{list.SummaryName}}</strong></p>
                  <p class="summary-text"><strong>描述：</strong>{{list.SummaryDescription}}</p>
                </li>
              </ul>
            </el-card>

            <el-card class="box-card" v-for="(item,index) in reportData.CheckItems" :key="index" :id="index">
              <div slot="header" class="clearfix">
                <strong>{{item.CheckItemName}}</strong>
              </div>
              <el-table
                :data="item.CheckResults"
                border
                style="width: 100%">
                <el-table-column show-overflow-tooltip prop="CheckIndexName" label="检查项"  width="200"></el-table-column>
                <el-table-column show-overflow-tooltip prop="ResultValue" label="检查结果"></el-table-column>
                <el-table-column show-overflow-tooltip prop="ValueRef" label="参考值"></el-table-column>
                <el-table-column show-overflow-tooltip prop="Unit" label="单位"></el-table-column>
                <el-table-column show-overflow-tooltip label="提示"></el-table-column>
              </el-table>
            </el-card>
          </div>
        </div>
        <p class="reportError" v-else>暂无数据</p>

      </el-main>
    </div>
  </div>

</template>
<script>
  import {
    ERR_OK,
    getReportData
  } from '@/api/api.js'
  import headerTop from '@/components/headTop.vue'
  import {getStore,EncodeDoctorId} from '@/config/mUtils.js'

  export default {
    name:'InquireReport',
    components: {
      headerTop
    },
    data() {
      return {
        loading2:false,
        reportData: null,
        currentHash:'baseInfo',
        searchParams: {
          checkUnitCode: 'bjbr052',
          workNo: '8000035550'
        }
      }
    },
    methods: {
      //搜索方法
      doSearch() {
        // var arr = 30
        // for(var i=0;i<arr;i++){
          this.getList()
        // }

      },
      //获取体检报告
      getList() {
        this.loading2 = true;
        let params = {
          checkUnitCode: this.searchParams.checkUnitCode,
          workNo: this.searchParams.workNo
        };

        getReportData(params).then(res => {
          if(res.code===ERR_OK){
            this.loading2 = false;
            this.reportData = res.data;
          }else{
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定'
            });
            this.loading2 = false;
            this.reportData = null
          }
        }).catch((err)=>{
          this.$alert(err.msg, '提示', {
            confirmButtonText: '确定'
          });
        })
      },
      //点击nav
      _navClick: function (index) {
        var scrollTopVal=document.getElementById(index).offsetTop-84;//需要滚动到的位置
        document.getElementById("report-content").scrollTop=scrollTopVal;
        this.currentHash=index;
      }
    },
    activated() {
      // this.getList()
    }
  }
</script>

<style lang="less" scoped>
  .inquire-report{
    width:100%;
    height:100%;
    .page-container{
      width:100%;
      height:100%;
    }
  }
  .m_l_0 {
    margin-left: 0;
  }

  .btn-row {
    text-align: center;
    padding-top: 20px;
  }

  .el-header,
  .el-main,
  .el-footer {
    padding: 0;
  }
  .box-card{margin-bottom: 15px;}
  .report-container{display: flex;height: 600px}
  .report-nav{width: 160px;height:100%;overflow: auto}
  .report-content{flex: 1;height: 100%;overflow: auto;transition: all 0.5s}
  .report-nav .nav-item{display: block;line-height: 22px;padding: 5px 0;color:#333;font-weight: bold;text-align: center;cursor: pointer}
  .report-nav .nav-item.active{color:#409EFF;}
  .baseInfoText {font-size: 14px;line-height: 21px;padding: 10px 0;color: #666;}
  .summary-text{font-size: 14px;line-height: 21px;margin-bottom: 5px;color: #666;}
  .reportError{
    text-align: center;
  }
</style>

