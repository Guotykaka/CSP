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
          label="异常类型" >
        </el-table-column>
        <el-table-column
          prop="message"
          label="异常信息" >
        </el-table-column>
        <el-table-column
          prop="requestTime"
          label="请求时间" >
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型" >
          <tempalte slot-scope="scope">
            <el-tag v-if="scope.row.type===1">CSPException</el-tag>
            <el-tag v-if="scope.row.type===2" type="success">DuplicateKeyException</el-tag>
            <el-tag v-if="scope.row.type===3" type="warning">Exception</el-tag>
          </tempalte>
        </el-table-column>
        <el-table-column
          prop="url"
          label="异常地址" >
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="primary" size="small">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="异常详情" :visible.sync="dialogTableVisible" width="80%">
      <el-table :data="listData">
        <el-table-column property="className" label="具体类名" width="150"></el-table-column>
        <el-table-column property="lineNumber" label="报错行数"></el-table-column>
        <el-table-column property="methodName" label="报错方法"></el-table-column>
        <el-table-column property="nativeMethod" label="是否本地方法">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.nativeMethod">true</el-tag>
            <el-tag v-else type="danger">false</el-tag>
          </template>
        </el-table-column>
      </el-table>
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
        tableData:[],
        searchParams:{
          currentPage: 1,
          exceptionType: "",
          message: "",
          pageSize: 10,
          requestTime: "",
          type: "",
          url: ""
        },
        dialogTableVisible:false
      }
    },
    activated: function() {
      this.getDataList();
    },
    methods: {
      getDataList(){
        let params ={
          currentPage: this.searchParams.currentPage,
          exceptionType:  this.searchParams.exceptionType,
          message:  this.searchParams.message,
          pageSize:  this.searchParams.pageSize,
          requestTime:  this.searchParams.requestTime,
          type:  this.searchParams.type,
          url:  this.searchParams.url
        };
        listCspMessage(params).then((res)=>{
          if(res.code===ERR_OK){
            this.tableData = res.data.list;
          }
        })
      },
      handleClick(item){
        this.dialogTableVisible = true;
        this.listData = item.cspDetailExceptionLogList
      }
    }

  }
</script>
<style lang="less" scoped>

</style>
