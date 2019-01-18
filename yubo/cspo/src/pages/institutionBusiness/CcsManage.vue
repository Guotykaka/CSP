<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <div class="ccs-search">
        <el-form :inline="true" :model="searchParams" class="demo-form-inline">
          <el-form-item label="指标名称">
            <el-input v-model="searchParams.checkIndexName" placeholder="请输入指标名称"></el-input>
          </el-form-item>
          <el-form-item label="匹配项">
            <el-select v-model="searchParams.whetherMatch" placeholder="活动区域">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="已匹配" :value="1"></el-option>
              <el-option label="未匹配" :value="2"></el-option>
            </el-select>
          </el-form-item>
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
            <el-button type="primary" @click="searchResult">查 询</el-button>
            <el-button type="primary" @click="clearResult">清 空</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="ccs-table" id="scroller">
        <el-table
          :data="tableData"
          max-height="650"
          border
          style="width: 100%">
          <el-table-column type="expand" width="50px">
            <template slot-scope="props">
              <el-table
                :data="props.row.matchResultList"
                style="width: 70%">
                <el-table-column
                  width="80"
                  label="">
                </el-table-column>

                <el-table-column
                  prop="productName"
                  width="180"
                  label="商品名称">
                </el-table-column>

                <el-table-column
                  prop="matchNumber"
                  label="匹配数量"
                  width="180">
                </el-table-column>

                <el-table-column
                  prop="resultValue"
                  label="检查结果"
                  width="180">
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column
            prop="checkIndexName"
            label="指标名称"
            width="180">
          </el-table-column>
          <!-- <el-table-column
            prop="resultValue"
            label="检查结果">
          </el-table-column> -->
          <el-table-column
            align="center"
            label="匹配结果">

          </el-table-column>
          <el-table-column
            prop="matchNumber"
            label="匹配数量"
            width="180">
          </el-table-column>
          <el-table-column
            prop="checkIndexNumber"
            label="指标出现次数"
            width="180">
          </el-table-column>
        </el-table>
      </div>
      <!-- <div class="selPage">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchParams.currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div> -->
    </div>
  </div>
</template>

<script>
  import headerTop from '@/components/headTop.vue'
  import {
    ERR_OK,
    listenProductManagement
  } from '@/api/api.js'

  export default {
    name: "CcsManage",
    components:{
      headerTop
    },
    data() {
      return {
        rangeTime:[],
        searchParams: {
          checkIndexName:'',
          whetherMatch:null,
          currentPage:1,
          pageSize:10,
          startTime:'',
          endTime:''
        },
        totalCount:0,
        tableData: [],
        doubleClick:true
      }
    },
    activated(){
      let timestamp =new Date().getTime();
      let timestamp2 =new Date().getTime()- 86400000 *7;
      this.searchParams.endTime = this.timestampToTime(timestamp);
      this.rangeTime[1] = this.timestampToTime(timestamp);
      this.searchParams.startTime = this.timestampToTime(timestamp2);
      this.rangeTime[0] = this.timestampToTime(timestamp2);
      this.rangeTime = [this.rangeTime[0],this.rangeTime[1]];
      this.searchResult();
    },
    methods: {
       //时间格式转换
      timestampToTime(timestamp) {
          var date = new Date(timestamp);
          var Y = date.getFullYear() + '-';
          var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
          var D = date.getDate() + ' ';
          var h = date.getHours() + ':';
          var m = date.getMinutes() + ':';
          var s = date.getSeconds();
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
        this.searchParams.checkIndexName='';
        this.searchParams.whetherMatch=null;
        this.searchParams.currentPage=1;
        this.searchParams.pageSize=10;
        this.searchParams.startTime='';
        this.searchParams.endTime='';
        this.rangeTime = null
      },
      /*清除请求参数*/
      clearResult(){
        this.paramsInit();
      },
      /*查询*/
      searchResult() {
        let params = {
          checkIndexName: this.searchParams.checkIndexName,
          // currentPage: this.searchParams.currentPage,
          endTime: this.searchParams.endTime,
          // pageSize: this.searchParams.pageSize,
          startTime: this.searchParams.startTime,
          whetherMatch: this.searchParams.whetherMatch
        };
        if(this.doubleClick){
          this.doubleClick = false;
          listenProductManagement(params).then((res)=>{
            if(res.code===ERR_OK){
              this.tableData = res.data;
              // this.totalCount = res.data.totalCount;
            }
            this.doubleClick = true
          }).catch(()=>{
            this.$message.error('网络错误,请稍后重试!');
            this.doubleClick = true
          })
        }
      }
    },
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
