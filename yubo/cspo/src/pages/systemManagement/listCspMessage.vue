<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <el-tabs v-model="activeName" @tab-click="handleClickTab">
        <el-tab-pane label="异常日志" name="first">
          <el-form :inline="true" ref="form" :model="searchParams" label-width="80px">
            <el-form-item label="异常类型">
              <el-input v-model.trim="searchParams.exceptionType" placeholder="请输入异常类型"></el-input>
            </el-form-item>
            <el-form-item label="异常信息">
              <el-input v-model.trim="searchParams.message" placeholder="请输入异常信息"></el-input>
            </el-form-item>
            <el-form-item label="异常地址">
              <el-input v-model.trim="searchParams.url" placeholder="请输入异常地址"></el-input>
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="searchParams.type" placeholder="请输入类型">
                <el-option label="WebSiteException" :value="1"></el-option>
                <el-option label="AppException" :value="2"></el-option>
                <el-option label="PayException" :value="3"></el-option>
                <el-option label="JobException" :value="4"></el-option>
                <el-option label="BasicException" :value="5"></el-option>
                <el-option label="CustomerException" :value="6"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="请求时间">
              <el-date-picker
                v-model="requestTime"
                type="daterange"
                @change="getselTime"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button @click="clearParams">清空</el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
              show-overflow-tooltip
              type="index">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="exceptionType"
              label="异常类型">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="url"
              label="异常地址">
            </el-table-column>
            <el-table-column
              prop="requestTime"
              width="180"
              align="center"
              label="请求时间">
            </el-table-column>
            <el-table-column
              name="type"
              width="200"
              align="center"
              label="类型">
              <template slot-scope="scope">
                <el-tag v-show="scope.row.type===1" name="WebSiteException">WebSiteException</el-tag>
                <el-tag v-show="scope.row.type===2" name="AppException" type="success">AppException
                </el-tag>
                <el-tag v-show="scope.row.type===3" name="PayException" type="warning">PayException</el-tag>
                <el-tag v-show="scope.row.type===4" name="PayException" type="warning">JobException</el-tag>
                <el-tag v-show="scope.row.type===5" name="PayException" type="warning">BasicException</el-tag>
                <el-tag v-show="scope.row.type===6" name="PayException" type="warning">CustomerException</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              width="100"
              align="center"
              label="异常信息">
              <template slot-scope="scopeO">
                <el-button @click="seeMessage(scopeO.row.message)" type="warning" size="mini">查看详情</el-button>
              </template>
            </el-table-column>
            <el-table-column
              width="100"
              align="center"
              label="附加信息">
              <template slot-scope="scopeT">
                <el-button @click="seeAddMessage(scopeT.row.appendInfo)" type="primary" size="mini">查看详情</el-button>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              align="center"
              width="100">
              <template slot-scope="scopeH" name="cspDetailExceptionLogList">
                <el-button @click="handleClick(scopeH.row)" type="primary" size="mini">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="请求日志" name="second">
          <el-form :inline="true" ref="form" :model="payParams" label-width="80px">
            <el-form-item label="请求类型">
              <el-input v-model.trim="payParams.type" placeholder="请输入请求类型"></el-input>
            </el-form-item>
            <el-form-item label="请求信息">
              <el-input v-model.trim="payParams.info" placeholder="请输入请求信息"></el-input>
            </el-form-item>
            <el-form-item label="请求时间">
              <el-date-picker
                v-model="requestPayTime"
                type="daterange"
                @change="getselPayTime"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button @click="clearParams">清空</el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="tablePayData"
            border
            style="width: 100%">
            <el-table-column
              type="index"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="type"
              align="left"
              show-overflow-tooltip
              label="类型">
            </el-table-column>

            <el-table-column
              prop="createTime"
              align="center"
              width="200"
              label="创建时间">
            </el-table-column>

            <el-table-column
              align="center"
              label="请求信息"
              width="150"
            >
              <template slot-scope="scopeO">
                <el-button @click="seeMessage(scopeO.row.info)" type="primary" size="mini">查看详情</el-button>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              fixed="right"
              width="150"
              label="附加信息">
              <template slot-scope="scopeT">
                <el-button @click="seeAddMessage(scopeT.row.appendInfo)" type="primary" size="mini">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div class="selpage" v-if="showPage">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchParams.currentPage"
          :page-sizes="[50,100, 200, 300, 500, 800]"
          :page-size="searchParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
      <div class="selpage" v-else>
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="payParams.currentPage"
          :page-sizes="[50,100, 200, 300, 500, 800]"
          :page-size="payParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="异常详情" :visible.sync="dialogTableVisible" width="60%">
      <el-table :data="listData">
        <el-table-column show-overflow-tooltip property="className" label="具体类名"></el-table-column>
        <el-table-column show-overflow-tooltip property="methodName" label="报错方法"></el-table-column>
        <el-table-column show-overflow-tooltip property="lineNumber" label="报错行数" width="100"></el-table-column>
        <el-table-column
          property="nativeMethod"
          fixed="right"
          width="150"
          align="center"
          label="是否本地方法">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.nativeMethod">true</el-tag>
            <el-tag v-else type="danger">false</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="请求详情" :visible.sync="msgStatus" width="60%">
      <div v-if="msgDetail">
        <span class="textStyle" v-if="showStatus">{{msgDetail}}</span>
        <div v-else class="textStyle">{{msgDetail}}</div>
      </div>
      <span v-else>暂无异常信息</span>
    </el-dialog>
    <el-dialog title="附加信息详情" :visible.sync="appendInfo" width="60%">
      <el-card class="box-card" v-if="appendInfoDetail">
        <div v-if="showStatus">
          <!--<div v-for="(item,key) in appendInfoDetail" :key="key" class="text item">
            <span>"{{key}}"</span>&nbsp;:&nbsp;<span style="word-break: break-all;">"{{item}}"</span>,
          </div>-->
          <div class="textStyle">{{appendInfoDetail}}</div>
        </div>
          <div class="textStyle" v-else>{{appendInfoDetail}}</div>
      </el-card>
      <span v-else>暂无附加信息</span>
    </el-dialog>
  </div>

</template>


<script>
  import {
    ERR_OK,
    listCspMessage,
    listCspPayMessage
  } from '@/api/api.js'
  import headerTop from '@/components/headTop.vue'

  export default {
    components: {
      headerTop
    },
    data() {
      return {
        tableData: [],
        tablePayData: [],
        activeName: 'first',
        searchParams: {
          currentPage: 1,
          exceptionType: "",//异常类型
          message: "",//异常信息
          pageSize: 50,
          type: "",// 报错类型(1、CSPException，2、DuplicateKeyException，3、Exc
          url: "",
          endTime: "",
          startTime: "",
        },
        payParams: {
          currentPage: 1,
          endTime: "",
          info: "",
          pageSize: 50,
          startTime: "",
          type: ""
        },
        requestTime: "",//请求时间
        requestPayTime: "",//支付时间
        totalCount: null,
        dialogTableVisible: false,//查看详情
        listData: [],//详情信息
        msgStatus: false,//查看异常信息
        msgDetail: '',//异常信息
        appendInfo: false,//附加信息
        appendInfoDetail: {},//附加信息
      }
    },
    activated: function () {
      this.getDataList();
    },
    methods: {
      /*请求参数init*/
      searchInit() {
        this.searchParams = {
          currentPage: 1,
          exceptionType: "",//异常类型
          message: "",//异常信息
          pageSize: 50,
          type: "",// 报错类型(1、CSPException，2、DuplicateKeyException，3、Exc
          url: "",
          endTime: "",
          startTime: "",
        };
        this.requestTime = '';
        this.payParams = {
          currentPage: 1,
          endTime: "",
          info: "",
          pageSize: 50,
          startTime: "",
          type: ""
        };
        this.requestPayTime = '';
      },
      /*tab切换*/
      handleClickTab() {
        if (this.activeName === 'first') {
          this.searchParams.currentPage = 1;
          this.searchParams.pageSize = 50;
          this.getDataList();
        } else if (this.activeName === 'second') {
          this.payParams.currentPage = 1;
          this.payParams.pageSize = 50;
          this.getPayDetail();
        }
      },
      /*获取时间*/
      getselTime() {
        if (this.requestTime) {
          this.searchParams.startTime = this.requestTime[0];
          this.searchParams.endTime = this.requestTime[1];
        }
      },
      /*获取支付时间*/
      getselPayTime() {
        if (this.requestPayTime) {
          this.payParams.startTime = this.requestPayTime[0];
          this.payParams.endTime = this.requestPayTime[1];
        }
      },
      /*清空*/
      clearParams() {
        this.searchInit()
      },
      /*查询*/
      onSubmit() {
        if (this.activeName === 'first') {
          this.searchParams.currentPage=1;
          this.searchParams.pageSize=50;
          this.getDataList()
        } else if (this.activeName === 'second') {
          this.payParams.currentPage=1;
          this.payParams.pageSize=50;
          this.getPayDetail()
        }
      },
      /*系统异常日志*/
      getDataList() {
        let params = {
          currentPage: this.searchParams.currentPage,
          exceptionType: this.searchParams.exceptionType,
          message: this.searchParams.message,
          pageSize: this.searchParams.pageSize,
          startTime: this.searchParams.startTime,
          endTime: this.searchParams.endTime,
          type: this.searchParams.type,
          url: this.searchParams.url
        };
        if (params.message.length > 20) {
          params.message = params.message.substring(0, 20)
        }
        listCspMessage(params).then((res) => {
          if (res.code === ERR_OK) {
            this.tableData = res.data.list;
            this.totalCount = res.data.totalCount;
          } else {
            this.$alert(res.msg, '提示')
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试');
        })
      },
      /*支付日志*/
      getPayDetail() {
        let params = this.payParams;
        if (params.info.length > 20) {
          params.info = params.info.substring(0, 20)
        }
        listCspPayMessage(params).then((res) => {
          if (res.code === ERR_OK) {
            this.tablePayData = res.data.list;
            this.totalCount = res.data.totalCount;
          } else {
            this.$alert(res.msg, '提示')
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试');
        })
      },
      handleSizeChange(val) {
        if (this.activeName === 'first') {
          this.searchParams.pageSize = val;
          this.getDataList();
        } else if (this.activeName === 'second') {
          this.payParams.pageSize = val;
          this.getPayDetail();
        }
      },
      handleCurrentChange(val) {
        if (this.activeName === 'first') {
          this.searchParams.currentPage = val;
          this.getDataList();
        } else if (this.activeName === 'second') {
          this.payParams.currentPage = val;
          this.getPayDetail();
        }
      },
      handleClick(item) {
        this.dialogTableVisible = true;
        this.listData = item.cspDetailExceptionLogList
      },
      seeMessage(item) {
        this.msgStatus = true;
        this.msgDetail = item;
      },
      seeAddMessage(item) {
        this.appendInfo = true;
        if (this.activeName === 'first') {
          this.appendInfoDetail = item;
        } else if (this.activeName === 'second') {
          this.appendInfoDetail = item;
        }
      }
    },
    computed: {
      showStatus() {
        return this.activeName === 'first'
      },
      showPage() {
        return this.activeName === 'first'
      }
    }

  }
</script>
<style lang="less" scoped>
  .selpage {
    text-align: center;
    margin-top: 20px;
  }
  .textStyle {
    word-break: break-all;
  }
</style>
