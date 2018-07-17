<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <el-form :inline="true" :model="searchParams" class="demo-form-inline">
        <el-form-item label="申请人">
          <el-input placeholder="申请人"></el-input>
        </el-form-item>
        <el-form-item label="机构">
          <el-select v-model="searchParams.institutionName" clearable placeholder="请选择所属机构">
            <el-option v-for="item in getInstitutionArr" :key="item.institutionId" :label="item.institutionName" :value="item.institutionId"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="时间">
          <el-date-picker
            v-model="rangeTime"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="doSearch">查询</el-button>
          <el-button type="primary" @click="_resetParams">清空</el-button>
          <el-button type="primary" >导出Excel</el-button>
        </el-form-item>
      </el-form>

      <!--tab-->
      <el-tabs v-model="tabIndex">
        <el-tab-pane label="申请中" name="0"></el-tab-pane>
        <el-tab-pane label="已拒绝" name="1"></el-tab-pane>
        <el-tab-pane label="已完成" name="2"></el-tab-pane>
      </el-tabs>


      <!--table 表单开始-->
      <el-table
        :data="dataList"
        border
        style="width: 100%">
        <el-table-column prop="" label="序号"  width="60" type="index"></el-table-column>
        <el-table-column prop="username" label="申请人"></el-table-column>
        <el-table-column prop="createTime" label="申请时间"></el-table-column>
        <el-table-column prop="institutionName" label="申请人所在机构"></el-table-column>
        <el-table-column prop="disburse" label="申请金额"></el-table-column>


        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status===0" size="mini" type="primary" @click="doStatus(scope.row,2)">同意</el-button>
            <el-button v-if="scope.row.status===0" size="mini" type="danger" @click="doStatus(scope.row,1)">拒绝</el-button>

            <el-tag type="danger" v-if="scope.row.status===1">已拒绝</el-tag>
            <el-tag type="success" v-if="scope.row.status===2">已完成</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <!--table 表单结束-->

      <div class="self-page-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchParams.page" :page-sizes="[10,20]" :page-size="searchParams.limit" layout="total, sizes, prev, pager, next, jumper" :total="totalListCount">
        </el-pagination>
      </div>

      <!--refuse reason dialog-->
      <el-dialog title="拒绝原因" :visible.sync="refuse.isShowDialog" width="400px">
        <el-input type="textarea" placeholder="请填写原因" v-model="refuse.refuseReason"></el-input>
        <div class="btn-row" style="text-align: right">
          <el-button size="small" type="default" @click="">取消</el-button>
          <el-button size="small" type="primary" @click="">同意</el-button>
        </div>
      </el-dialog>



    </div>
  </div>

</template>


<script>

import headerTop from '@/components/headTop.vue';
import { mapGetters } from "vuex";
import {getAccountRecord ,ERR_OK} from "@/api/api.js";

export default {
  data() {
    return {

      refuse:{
        isShowDialog:false,
        refuseReason:""
      },


      isShowRefuseDialog:false,//是否显示拒绝理由弹窗

      totalListCount:0,


      tabIndex:0,

      rangeTime:"",//时间区间

      searchParams:{
        currentPage: 1,
        endTime: "",
        institutionId: "",
        institutionName: "",
        pageSize: 10,
        startTime: "",
        status:0,
        username: ""
      },
      //获取的列表数据
      dataList:[],


  }
  },

  components:{
    headerTop,
  },

  computed:{
    ...mapGetters(['getInstitutionArr'])
  },

  methods:{
    //搜索
    doSearch: function () {
      this.searchParams.page = 1;
      this._getData();
    },


    //重置搜索条件
    _resetParams:function () {

    },



    //获取列表数据
    getListData:function () {
      if(this.rangeTime){
        this.searchParams.startTime=this.rangeTime[0];
        this.searchParams.endTime=this.rangeTime[1];
      }else{
        this.searchParams.startTime="";
        this.searchParams.endTime="";
      }

      var params={
        currentPage:this.searchParams.currentPage,
        endTime:this.searchParams.endTime,
        institutionId: this.searchParams.institutionId,
        pageSize:this.searchParams.pageSize,
        startTime:this.searchParams.startTime,
        status:this.tabIndex,
        username:this.searchParams.username
      };

      getAccountRecord(params).then(res => {
        if(res.code===ERR_OK){
          this.dataList=res.data.list;
          this.totalCount=res.data.totalCount;
        }else{
          this.$alert(res.msg, '提示', {
            confirmButtonText: '确定',
          })
        }
      }).catch(err => {
        this.$alert(err.msg, '提示', {
          confirmButtonText: '确定',
        })
      })

    },




    //点击同意或者拒绝执行的方法
    doStatus:function (item,state) {
      if(state===1){

        this.refuse.isShowDialog=true;

      }else {

        this.$confirm('确定同意申请吗？')
          .then(_ => {

            this.isShowDialog=false

          })
          .catch(_ => {

          });

      }




    },



    //处理size
    handleSizeChange(val){
      console.log("size变了")
      console.log(val)
    },


    //处理当前页变化
    handleCurrentChange(val){
      this.searchParams.page=val
    },



    page(){
      this.searchParams.page=1
    }





  },


  created(){
    this.getListData()

  },



  watch:{


    tabIndex(val){
      this.searchParams.currentPage=1;
      this.getListData();
    }

  }





}
</script>

<style lang="less" scoped>
  .el-textarea{margin-bottom: 25px}
</style>
