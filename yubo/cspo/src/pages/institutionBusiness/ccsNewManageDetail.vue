<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <div class="ccs-search">
        <el-form :inline="true" :model="searchParams" class="demo-form-inline">
          <el-form-item label="时间">
            <el-date-picker
              v-model="rangeTime"
              @change="getselTime"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchBtn">查 询</el-button>
            <el-button type="primary" @click="clearResult">清 空</el-button>
            <el-button type="primary" @click="returnBack">返 回</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="ccs-table" id="scroller">
        <el-table
          :data="tableData"
          max-height="650"
          border
          style="width: 100%">
          <el-table-column
            type="index"
            width="80">
          </el-table-column>
          <el-table-column
            prop="checkIndexName"
            label="指标名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="resultValue"
            label="指标结果">
          </el-table-column>
          <el-table-column
            prop="productName"
            label="商品名称">
          </el-table-column>
          <el-table-column
            prop="matchCount"
            label="指标明和结果出现次数">
          </el-table-column>
          <el-table-column
            prop="productCount"
            label="绑定一元听数">
          </el-table-column>
        </el-table>
      </div>
       <div class="selPage">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchParams.currentPage"
          :page-sizes="[50, 100, 300, 500]"
          :page-size="searchParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import headerTop from '@/components/headTop.vue'
  import {getStore} from "@/config/mUtils.js";
  import {
    ERR_OK,
    oneYuanProductResultCountList//一元听商品匹配统计（二级，指标结果统计）
  } from '@/api/api.js'

  export default {
    name: "ccsNewManageDetail",
    components:{
      headerTop
    },
    data() {
      return {
        rangeTime:[],
        searchParams: {
          currentPage:1,
          pageSize:50,
          startTime:'',
          endTime:''
        },
        totalCount:0,
        tableData: [],
        doubleClick:true,
        transferData:{},
        timeData:{}
      }
    },
    activated(){
      this.transferData = this.$route.query;
      this.timeData = JSON.parse(getStore('timeData'));
      console.log(this.timeData);
      this.searchParams.endTime = this.timeData.endTime;
      this.rangeTime[1] = this.timeData.endTime;
      this.searchParams.startTime = this.timeData.startTime;
      this.rangeTime[0] = this.timeData.startTime;
      this.rangeTime = [this.rangeTime[0], this.rangeTime[1]];
      this.searchResult();
    },
    methods: {
      //时间格式转换
      timestampToTime(timestamp) {
        var date = new Date(timestamp);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = (date.getDate()<10? '0' + date.getDate():date.getDate())+ ' ';
        var h = (date.getHours()<10? '0' + date.getHours():date.getHours())+ ':';
        var m = (date.getMinutes()<10? '0' + date.getMinutes():date.getMinutes())+ ':';
        var s = date.getSeconds()<10? '0' + date.getSeconds():date.getSeconds();
        return Y+M+D+h+m+s;
      },
      /*获取时间*/
      getselTime() {
        if (this.rangeTime) {
          this.searchParams.startTime = this.rangeTime[0];
          this.searchParams.endTime = this.rangeTime[1];
        }
      },
      /*表格每页条数*/
      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this.searchResult()
      },
      /*表格当前页*/
      handleCurrentChange(val) {
        this.searchParams.currentPage = val;
        this.searchResult()
      },
      /*表格请求参数初始化*/
      paramsInit(){
        this.searchParams.currentPage=1;
        this.searchParams.pageSize=50;
        this.searchParams.startTime='';
        this.searchParams.endTime='';
        this.rangeTime = null
      },
      /*清除请求参数*/
      clearResult(){
        this.paramsInit();
      },
      /*查询*/
      searchBtn(){
        this.searchParams.currentPage=1;
        this.searchParams.pageSize=50;
        this.searchResult();
      },
      /*请求数据*/
      searchResult() {
        let params = {
          checkIndexName: this.transferData.checkIndexName,
          whetherMatch: this.transferData.whetherMatch,
          currentPage: this.searchParams.currentPage,
          pageSize: this.searchParams.pageSize,
          endTime: this.searchParams.endTime,
          startTime: this.searchParams.startTime
        };
        if(this.doubleClick){
          this.doubleClick = false;
          oneYuanProductResultCountList(params).then((res)=>{
            if(res.code===ERR_OK){
              this.tableData = res.data.list;
              this.totalCount = res.data.totalCount;
            }
            this.doubleClick = true
          }).catch(()=>{
            this.$message.error('网络错误,请稍后重试!');
            this.doubleClick = true
          })
        }
      },
      returnBack(){
        this.$router.go(-1);
      }
    }
  }
</script>

<style scoped lang="less">
  html {
    /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
    -ms-overflow-style: none !important;
    /*火狐下隐藏滚动条*/
    overflow: -moz-scrollbars-none !important;
  }

  /*Chrome下隐藏滚动条，溢出可以透明滚动*/
  html::-webkit-scrollbar {
    width: 0px !important;
  }

  #scroller{
    /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
    ::-webkit-scrollbar {
      width: 12px !important;
      height: 16px !important;
    }

    /*定义滚动条轨道 内阴影+圆角*/
    ::-webkit-scrollbar-track {
      background: #f6f6f6 !important;
      border-radius: 2px !important;
    }

    /*定义滑块 内阴影+圆角*/
    ::-webkit-scrollbar-thumb {
      background: #aaa !important;
      border-radius: 2px !important;
    }
  }
  .ccs-table /deep/ .el-table__expanded-cell[class*=cell]{
    padding:0 50px;
  }
  .selPage{
    margin-top:20px;
    text-align:center;
  }

</style>
