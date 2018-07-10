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
          <el-button type="primary" @click="_exportAccountRecord">导出Excel</el-button>
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
            <el-button v-if="scope.row.status===0" size="mini" type="primary" @click="doStatus(scope.row)">同意</el-button>
            <el-button v-if="scope.row.status===0" size="mini" type="danger" @click="doStatus(scope.row)">拒绝</el-button>

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


      <el-button size="mini" type="primary" @click="page">页码</el-button>


    </div>
  </div>

</template>


<script>

import headerTop from '@/components/headTop.vue';
import { mapGetters } from "vuex";



export default {
  data() {
    return {



      totalListCount:100,


      tabIndex:0,

      rangeTime:"",//时间区间

      searchParams:{
        page:1,//页码
        limit: 10,//
        username: "",
        institutionId:"",//机构id
        startTime: "",
        endTime: "",
        status: 0//状态 0 1 2
      },












      //获取的列表数据
      dataList:[
        {insAccountRecordId:"2c8080aa64688e870164691a605b000b",username:"saitest2",createTime:"2018-07-05 14:21:33",institutionName:"包头中心医院",disburse:666.0,insDoctorAccountId:"2c8080aa641bf4cd01641bf4cd7e0000",type:2,status:0,refuseReason:null,insDoctorId:"2c8080aa641bf4cd01641bf4cd7e0000"},
        {insAccountRecordId:"2c8080aa64688e870164690cdd540009",username:"左丽红-河南省直三院",createTime:"2018-07-05 14:06:48",institutionName:"河南省直三院",disburse:500.0,insDoctorAccountId:"2c8080aa641bf4cd01641c05b0c90005",type:2,status:0,refuseReason:null,insDoctorId:"2c8080aa641bf4cd01641c05b0c90005"},
        {insAccountRecordId:"2c8080aa644ac03301644ac0eff70003",username:"saitest2",createTime:"2018-06-29 16:55:15",institutionName:"包头中心医院",disburse:666.0,insDoctorAccountId:"2c8080aa641bf4cd01641bf4cd7e0000",type:2,status:1,refuseReason:"这是拒绝理由",insDoctorId:"2c8080aa641bf4cd01641bf4cd7e0000"},
        {insAccountRecordId:"2c8080aa644ac03301644ac0eff70003",username:"saitest2",createTime:"2018-06-29 16:55:15",institutionName:"包头中心医院",disburse:666.0,insDoctorAccountId:"2c8080aa641bf4cd01641bf4cd7e0000",type:2,status:2,refuseReason:"这是拒绝理由",insDoctorId:"2c8080aa641bf4cd01641bf4cd7e0000"},

      ],


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
      this.searchParams={
        page:1,//页码
        limit:10,//
        username: "",
        institutionId:"",//机构id
        startTime: "",
        endTime: "",
        status: 0//状态 0 1 2
      };
      this._getData();
    },



    //获取列表数据
    _getData:function () {
     /* $.ajax({
        type: "POST",
        url: baseURL + "ins/withdraw/listAccountRecord",
        contentType: "application/json",
        data: JSON.stringify(this.searchParams),
        success: function(res){
          if(res.code === 1){
            vm.dataList=res.data.list;
            vm._initPage(res.data.page.totalCount);
          }else{
            alert(res.msg);
          }
        }
      });*/
    },


    //导出提现记录
    _exportAccountRecord:function () {
      var params={
        username:this.searchParams.username,
        institutionId:this.searchParams.institutionId,
        startTime:this.searchParams.startTime,
        endTime:this.searchParams.endTime,
        status: this.searchParams.status
      };
      var paramString =
        'username='+params.username+
        '&institutionId='+params.institutionId+
        '&startTime='+params.startTime+
        '&endTime='+params.endTime+
        '&status='+params.status;
      var url = baseURL + "ins/withdraw/exportAccountRecord?" + paramString;
      window.open(url);
      /*            $.ajax({
                      type: "POST",
                      url: baseURL + "ins/withdraw/exportAccountRecord",
                      contentType: "application/json",
                      data: JSON.stringify(params),
                      success: function(res){
                          if(res.code === 1){
                              alert('成功导出到桌面了');
                          }else{
                              alert(res.msg);
                          }
                      }
                  });*/
    },



    //点击同意或者拒绝执行的方法
    doStatus:function (item,state) {
      /*if(state ===1){
        layer.prompt({
          formType: 2,
          value: '请填写拒绝理由',
          title: '请填写拒绝理由',
          area: ['400px', '200px'] //自定义文本域宽高
        }, function(value, index, elem){

          var parms={
            insAccountRecordId:item.insAccountRecordId,
            insDoctorId:item.insDoctorId,
            status:state,
            reason:value
          };
          $.ajax({
            type: "POST",
            url: baseURL+"ins/withdraw/updateApplyStatus",
            contentType: "application/json",
            data: JSON.stringify(parms),
            success: function(res){
              if(res.code === 1){
                alert("操作成功",function () {
                  vm._getData();
                })
              }else{
                alert(res.msg);
              }
            }
          });
          layer.close(index);
        });
      }else {
        confirm("确定通过吗",function () {
          var parms={
            insAccountRecordId:item.insAccountRecordId,
            insDoctorId:item.insDoctorId,
            status:state,
            reason:""
          };
          $.ajax({
            type: "POST",
            url: baseURL+"ins/withdraw/updateApplyStatus",
            contentType: "application/json",
            data: JSON.stringify(parms),
            success: function(res){
              if(res.code === 1){
                alert("操作成功",function () {
                  vm._getData();
                })
              }else{
                alert(res.msg);
              }
            }
          });
        })
      }*/
    },



    //处理size
    handleSizeChange(){
      console.log("size变了")
    },


    //处理当前页变化
    handleCurrentChange(){
      console.log(this.searchParams.page)
    },



    page(){

      this.searchParams.page=1

      console.log(this.searchParams.page)

    }





  },


  created(){



  }





}
</script>

<style lang="less" scoped>

</style>
