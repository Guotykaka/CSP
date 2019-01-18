<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div
      class="page-container"
      v-loading="loading2"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <el-tabs v-model="activeName" @click="handleClick">
        <el-tab-pane label="报告查询" name="first">
          <!-- 报告查询页面 -->
          <el-header height="30">
            <!-- 操作行-->
            <el-row>
              <el-form :model="searchParams" :inline="true" class="demo-form-inline">
                <el-form-item label="体检机构编码：">
                  <el-input v-model.trim="searchParams.checkUnitCode" placeholder="请填写机构编码"
                            @keyup.enter.native="doSearch()"
                            clearable></el-input>
                </el-form-item>
                <el-form-item label="体检报告编号：">
                  <el-input v-model.trim="searchParams.workNo" placeholder="请填写报告编号" @keyup.enter.native="doSearch()"
                            clearable></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="doSearch()" class="m_l_15">查询</el-button>
                </el-form-item>
              </el-form>
            </el-row>
          </el-header>
          <el-main>
            <!--{{reportData}}-->
            <div class="report-container" v-if="reportData">
              <div class="report-nav">
                <div class="nav-box">
                  <a class="nav-item" :class="currentHash === 'baseInfo' ? 'active' : ''"
                     @click="_navClick('baseInfo')">基本信息</a>
                  <a class="nav-item" :class="currentHash === 'summary' ? 'active' : ''" @click="_navClick('summary')">一般建议</a>
                  <a class="nav-item" :class="currentHash === 'suggest' ? 'active' : ''" @click="_navClick('suggest')">报告总结</a>
                  <a class="nav-item" :class="currentHash === index ? 'active' : ''"
                     v-for="(item,index) in reportData.checkItems" :key="index" @click="_navClick(index)">{{item.checkItemName}}</a>
                </div>
              </div>
              <div class="report-content" id="report-content">
                <!--基本信息-->
                <el-card class="box-card" id="baseInfo">
                  <div slot="header" class="clearfix">
                    <strong>基本信息</strong>
                  </div>
                  <el-row :gutter="20">
                    <el-col :span="8">customerName
                      <p class="baseInfoText">姓名：{{reportData.customerName}}</p>
                    </el-col>
                    <el-col :span="8">
                      <p class="baseInfoText">性别：
                        <span v-if="reportData.sex == 0">女</span>
                        <span v-else>男</span>
                      </p>
                    </el-col>
                    <el-col :span="8">
                      <p class="baseInfoText">年龄：{{reportData.age}}</p>
                    </el-col>
                    <el-col :span="8">
                      <p class="baseInfoText">体检机构：{{reportData.checkUnitName}}</p>
                    </el-col>
                    <el-col :span="8">
                      <p class="baseInfoText">体检编号：{{reportData.workNo}}</p>
                    </el-col>
                    <el-col :span="8">
                      <p class="baseInfoText">到检日期：{{reportData.regDate}}</p>
                    </el-col>
                    <el-col :span="8">
                      <p class="baseInfoText">过检日期：{{reportData.reportDate}}</p>
                    </el-col>
                  </el-row>
                </el-card>

                <!--报告小结-->
                <el-card class="box-card" id="summary">
                  <div slot="header" class="clearfix">
                    <strong>一般建议</strong>
                  </div>
                  <ul class="brief-summary">
                    <li class="summary-list" v-for="(list,index) in reportData.generalAdvices">
                      <p class="summary-text">{{index+1}}.&nbsp;体检结果：<strong>{{list.adviceName}}</strong></p>
                      <p class="summary-text"><strong>建议内容</strong>{{list.adviceDescription}}</p>
                    </li>
                  </ul>
                </el-card>

                <!--总检建议-->
                <el-card class="box-card" id="suggest">
                  <div slot="header" class="clearfix">
                    <strong>报告总结</strong>
                  </div>
                  <ul class="brief-summary">
                    <li class="summary-list" v-for="(list,index) in reportData.generalSummarys" :key="index">
                      <p class="summary-text">体检项目：<strong>{{list.summaryName}}</strong></p>
                      <p class="summary-text"><strong>描述:</strong>{{list.summaryDescription}}</p>
                    </li>
                  </ul>
                </el-card>

                <el-card class="box-card" v-for="(item,index) in reportData.checkItems" :key="index" :id="index">
                  <div slot="header" class="clearfix">
                    <strong>{{item.checkItemName}}</strong>
                  </div>
                  <el-table
                    :data="item.checkResults"
                    border
                    style="width: 100%">
                    <el-table-column show-overflow-tooltip prop="checkIndexName" label="检查项"
                                     width="200"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="resultValue" label="检查结果"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="valueRef" label="参考值"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="unit" label="单位"></el-table-column>
                    <el-table-column show-overflow-tooltip label="提示"></el-table-column>
                  </el-table>
                </el-card>
              </div>
            </div>
            <p class="reportError" v-else>暂无数据</p>

          </el-main>
        </el-tab-pane>
        <!-- <el-tab-pane label="测试体检报告添加返回数据" name="second">
          <el-form :inline="true" :model="chatParams" class="demo-form-inline">
            <el-form-item label="姓名：">
              <el-input v-model="chatParams.realName" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机号码：">
              <el-input v-model="chatParams.mobile" placeholder="请输入手机号码"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="getreportAddInfo">查询</el-button>
            </el-form-item>
          </el-form>
          <div v-if="tableData.length>0" class="data-table">
            <el-table
              :data="tableData"
              style="width: 100%"
              border>
              <el-table-column prop="Birthday" label="Birthday"></el-table-column>
              <el-table-column prop="CheckDate" label="CheckDate"></el-table-column>
              <el-table-column prop="CheckUnitCode" label="CheckUnitCode"></el-table-column>
              <el-table-column prop="CheckUnitName" label="CheckUnitName"></el-table-column>
              <el-table-column prop="CreateTime" label="CreateTime"></el-table-column>
              <el-table-column prop="CustomerName" label="CustomerName"></el-table-column>
              <el-table-column prop="IDCardNo" label="IDCardNo"></el-table-column>
              <el-table-column prop="Mobilphone" label="Mobilphone"></el-table-column>
              <el-table-column prop="OrderCode" label="OrderCode"></el-table-column>
              <el-table-column prop="OrderName" label="OrderName"></el-table-column>
              <el-table-column prop="UpdateTime" label="UpdateTime"></el-table-column>
              <el-table-column prop="WorkNo" label="WorkNo"></el-table-column>
            </el-table>
          </div>
          <div v-else class="data-clear">
            <span>{{infoData}}</span>
          </div>
        </el-tab-pane> -->
      </el-tabs>


    </div>
  </div>
</template>
<script>
  import {
    ERR_OK,
    getMedicalReportDetail,
    DSFDSDS,
    reportAddInfo
  } from '@/api/api.js'
  import headerTop from '@/components/headTop.vue'
  import {getStore} from '@/config/mUtils.js'

  export default {
    name: 'InquireReport',
    components: {
      headerTop
    },
    data() {
      return {
        loading2: false,
        reportData: null,
        currentHash: 'baseInfo',
        searchParams: {
          checkUnitCode: 'bjbr052',
          workNo: '8000035550'
        },
        chatParams: {
          mobile: "",
          realName: ""
        },
        activeName:'first',
        tableData: [],
        infoData: '',
        tableStatus: false
      }
    },
    methods: {
      //搜索方法
      doSearch() {
        this.getList()
      },
      //获取体检报告
      getList() {
        this.loading2 = true;
        let params = {
          checkUnitCode: this.searchParams.checkUnitCode,
          workNo: this.searchParams.workNo
        };

        getMedicalReportDetail(params).then(res => {
          if (res.code === ERR_OK) {
            this.loading2 = false;
            this.reportData = res.data;
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定'
            });
            this.loading2 = false;
            this.reportData = null
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试');
          this.loading2 = false;
        })
      },
      //点击nav
      _navClick: function (index) {
        var scrollTopVal = document.getElementById(index).offsetTop - 84;//需要滚动到的位置
        document.getElementById("report-content").scrollTop = scrollTopVal;
        this.currentHash = index;
      },
      /*点击tab栏*/
      handleClick(){

      },
      /*获取测试返回数据*/
      getreportAddInfo() {
        this.loading2 = true;
        let params = {
          mobile: this.chatParams.mobile,
          realName: this.chatParams.realName,
        };

        reportAddInfo(params).then((res) => {
          if (res.code === ERR_OK) {
            this.infoData = res.data;
            this.dataHandle();
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定'
            });
          }
          this.loading2 = false;
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试');
          this.loading2 = false;
        })
      },
      /*数据处理*/
      dataHandle() {
        let dataString,
          that = this;
        if (this.infoData) {
          dataString = JSON.parse(this.infoData);
          if (dataString.state === '200') {
            that.tableStatus = true;
            that.tableData = dataString.result;
          } else {
            that.tableData = []
          }
        } else {
          that.tableData = []
        }
      }
    },
    activated() {
      // this.getList()
    }
  }
</script>

<style lang="less" scoped>
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

  .box-card {
    margin-bottom: 15px;
  }

  .report-container {
    display: flex;
    height: 600px
  }

  .report-nav {
    width: 160px;
    height: 100%;
    overflow: auto
  }

  .report-content {
    flex: 1;
    height: 100%;
    overflow: auto;
    transition: all 0.5s
  }

  .report-nav .nav-item {
    display: block;
    line-height: 22px;
    padding: 5px 0;
    color: #333;
    font-weight: bold;
    text-align: center;
    cursor: pointer
  }

  .report-nav .nav-item.active {
    color: #409EFF;
  }

  .baseInfoText {
    font-size: 14px;
    line-height: 21px;
    padding: 10px 0;
    color: #666;
  }

  .summary-text {
    font-size: 14px;
    line-height: 21px;
    margin-bottom: 5px;
    color: #666;
  }

  .reportError {
    text-align: center;
  }

  .data-clear {
    margin-top: 20px;
    text-align: center;
  }
</style>

