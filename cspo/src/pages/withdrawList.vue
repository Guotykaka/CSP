<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <el-form :inline="true" :model="searchParams" class="demo-form-inline">
        <el-form-item label="申请人">
          <el-input placeholder="申请人" v-model="searchParams.username"></el-input>
        </el-form-item>
        <el-form-item label="机构">
          <el-autocomplete
            popper-class="my-autocomplete"
            v-model="searchParams.institutionName"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            @select="handleSelect">
            <template slot-scope="{ item }">
              <div class="name">{{ item.institutionName }}</div>
            </template>
          </el-autocomplete>
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
          <el-button type="primary" @click="exportExcelFn">导出Excel</el-button>
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
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchParams.currentPage" :page-sizes="[10,20]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
      <!--refuse reason dialog-->
      <el-dialog title="拒绝原因" :visible.sync="refuse.isShowDialog" width="400px">
        <el-input type="textarea" placeholder="请填写原因" v-model="refuse.refuseReason"></el-input>
        <div class="btn-row" style="text-align: right">
          <el-button size="small" type="default" @click="doCancel">取消</el-button>
          <el-button size="small" type="primary" @click="doRefuse">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import headerTop from '@/components/headTop.vue';
import { mapGetters } from "vuex";
import {getAccountRecord ,updataWithdrawStatus,exportWithdrawExcel,ERR_OK} from "@/api/api.js";
import {baseUrl} from '@/config/env.js'
export default {
  data() {
    return {
      refuse:{
        isShowDialog:false,
        refuseReason:""
      },
      isShowRefuseDialog:false,//是否显示拒绝理由弹窗
      totalCount:0,
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
      doInsAccountRecordId:"",
      doInsDoctorId:"",
  }
  },
  components:{
    headerTop,
  },

  computed:{
    ...mapGetters(['getInstitutionArr'])
  },

  methods:{
    //自带搜索组件选中
    handleSelect(item) {
      this.searchParams.institutionName=item.institutionName;
      this.searchParams.institutionId=item.institutionId;
    },

    //自带搜索组件搜索
    querySearch(queryString, cb) {
      var institutions = this.getInstitutionArr;
      var results = queryString ? institutions.filter(this.createFilter(queryString)) : institutions;
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.institutionName.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
      };
    },

    //搜索
    doSearch: function () {
      this.searchParams.page = 1;
      this.getListData();
    },

    //重置搜索条件
    _resetParams:function () {
      this.rangeTime="";
      this.searchParams.institutionId="";
      this.searchParams.institutionName="";
      this.searchParams.username="";
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
      let params={
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
      this.doInsAccountRecordId=item.insAccountRecordId;
      this.doInsDoctorId=item.insDoctorId;
      if(state===1){
        this.refuse.isShowDialog=true;
      }else {
        this.$confirm('确定同意申请吗？')
          .then(_ => {
            this.isShowDialog=false;
            let params={
              insAccountRecordId: this.doInsAccountRecordId,
              insDoctorId: this.doInsDoctorId,
              reason: "",
              status: 2//同意
            };
            updataWithdrawStatus(params).then(res => {
              if(res.code===ERR_OK){
                this.$alert(res.msg, '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.getListData();//刷新列表
                  }
                })
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
          })
          ;
      }
    },

    //拒绝
    doRefuse(){
      var params={
        insAccountRecordId: this.doInsAccountRecordId,
        insDoctorId: this.doInsDoctorId,
        reason: this.refuse.refuseReason,
        status: 1//1是拒绝
      };

      if(!params.reason){
        this.$alert("请填写拒绝原因", '提示', {
          confirmButtonText: '确定',
        });
        return;
      }

      updataWithdrawStatus(params).then(res => {
        if(res.code===ERR_OK){
          this.refuse.isShowDialog=false;
          this.$alert(res.msg, '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.getListData();//刷新列表
            }
          })
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

    //取消
    doCancel(){
      this.refuse.isShowDialog=false;
    },

    //处理size
    handleSizeChange(val){
      this.searchParams.currentPage=1;
      this.searchParams.pageSize=val;
      this.getListData()
    },

    //处理当前页变化
    handleCurrentChange(val){
      this.searchParams.currentPage=val;
      this.getListData()
    },

    //导出excel
    exportExcelFn(){
      this.searchParams.startTime=this.rangeTime ? this.rangeTime[0] :"";
      this.searchParams.endTime=this.rangeTime ? this.rangeTime[1] :"";
      let paramString =
        'username=' + this.searchParams.username +
        '&institutionId=' + this.searchParams.institutionId +
        '&startTime=' + this.searchParams.startTime +
        '&endTime=' + this.searchParams.endTime +
        '&status=' + this.searchParams.status ;
      let url = baseUrl + "ins/withdraw/exportAccountRecord?" + paramString.toString();
      window.open(url);
    }

  },
  created(){
    this.getListData()
  },
  watch:{
    tabIndex(val){
      this.searchParams.status=val;
      this.searchParams.currentPage=1;
      this.getListData();
    }
  }
}
</script>

<style lang="less" scoped>
  .el-textarea{margin-bottom: 25px}
</style>
