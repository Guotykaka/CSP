<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="exceptionType"
          label="异常类型">
        </el-table-column>
        <el-table-column
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
          width="120"
          align="center"
          label="类型">
          <template slot-scope="scope">
            <el-tag v-show="scope.row.type===1" name="CSPException">CSPException</el-tag>
            <el-tag v-show="scope.row.type===2" name="DuplicateKeyException" type="success">DuplicateKeyException
            </el-tag>
            <el-tag v-show="scope.row.type===3" name="Exception" type="warning">Exception</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          align="center"
          label="异常信息">
          <template slot-scope="scopeO" name="message">
            <el-button @click="seeMessage(scopeO.row.message)" type="warning" size="mini">查看详情</el-button>
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          align="center"
          label="附加信息">
          <template slot-scope="scopeT" name="message">
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
      <div class="selpage">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchParams.currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
    </div>

    <el-dialog title="异常详情" :visible.sync="dialogTableVisible" width="80%">
      <el-table :data="listData">
        <el-table-column property="className" label="具体类名"></el-table-column>
        <el-table-column property="methodName" label="报错方法"></el-table-column>
        <el-table-column property="lineNumber" label="报错行数" width="100"></el-table-column>
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
    <el-dialog title="异常信息详情" :visible.sync="msgStatus" width="80%">
      <span v-if="msgDetail">{{msgDetail}}</span>
      <span v-else>暂无异常信息</span>

    </el-dialog>
    <el-dialog title="附加信息详情" :visible.sync="appendInfo" width="80%">
      <el-card class="box-card" v-if="appendInfoDetail">
        {
        <div v-for="(item,key) in appendInfoDetail" :key="item.codeKey" class="text item">
          <span>{{key}}</span>&nbsp;:&nbsp;<span style="word-break: break-all;">{{item}}</span>
        </div>
        }
      </el-card>
      <span v-else>暂无异常信息</span>
    </el-dialog>
  </div>

</template>


<script>
  import {
    ERR_OK,
    listCspMessage
  } from '@/api/api.js'
  import headerTop from '@/components/headTop.vue'

  export default {
    components: {
      headerTop
    },
    data() {
      return {
        tableData: [],
        searchParams: {
          currentPage: 1,
          exceptionType: "",
          message: "",
          pageSize: 10,
          requestTime: "",
          type: "",
          url: ""
        },
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
      getDataList() {
        let params = {
          currentPage: this.searchParams.currentPage,
          exceptionType: this.searchParams.exceptionType,
          message: this.searchParams.message,
          pageSize: this.searchParams.pageSize,
          requestTime: this.searchParams.requestTime,
          type: this.searchParams.type,
          url: this.searchParams.url
        };
        listCspMessage(params).then((res) => {
          if (res.code === ERR_OK) {
            this.tableData = res.data.list;
            this.totalCount = res.data.totalCount;
          }
        })
      },
      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this.getDataList();
      },
      handleCurrentChange(val) {
        this.searchParams.currentPage = val;
        this.getDataList();
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
        this.appendInfoDetail = JSON.parse(item);
      }
    }

  }
</script>
<style lang="less" scoped>
  .selpage {
    text-align: center;
    margin-top: 20px;
  }
</style>
