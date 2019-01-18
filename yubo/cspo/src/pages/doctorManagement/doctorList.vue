<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <!--操作行-->
      <el-form id="SearchBar" :inline="true" :model="searchParams" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input v-model="searchParams.name" placeholder="姓名"></el-input>
        </el-form-item>

        <el-form-item label="手机号">
          <el-input v-model="searchParams.mobile" placeholder="手机号"></el-input>
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

        <el-form-item>
          <el-button type="primary" @click="doSearch">查询</el-button>
        </el-form-item>
      </el-form>
      <!--新增-->
      <el-row class="m_b_15">
        <el-button type="primary" @click="_addItem">新增</el-button>
      </el-row>
      <!--table 表单开始-->
      <el-table :data="doctorList" border style="width: 100%">
        <el-table-column show-overflow-tooltip align="center" prop="userName" label="用户名"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="mobile" label="手机号"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="loginName" label="用户账号"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="creatTime" label="创建日期"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="institutionName" label="所属机构"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="sort" label="排序" width="100"></el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="scope">
            <el-button size="mini" type="info" @click="_checkDetail( scope.row,scope.$index)">查看</el-button>
            <el-button size="mini" type="danger" @click="showTimeDialogFn(scope.row)">服务时间</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--table 表单结束-->
      <div class="self-page-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchParams.currentPage" :page-sizes="[10,20]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
      <!--医生详情弹窗-->
      <el-dialog title="详细信息" :visible.sync="detailINfo.isShowDialog" width='650px'>

        <el-row :gutter="20">
          <el-col :span="6" style="text-align: right">
            <strong class="title-note">所属机构：</strong>
          </el-col>
          <el-col :span="18">
            <span class="title-note">{{detailINfo.institutionName}}</span>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6" style="text-align: right">
            <strong class="title-note">用户姓名：</strong>
          </el-col>
          <el-col :span="18">
            <span class="title-note">{{detailINfo.userName}}</span>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6" style="text-align: right">
            <strong class="title-note">手机号：</strong>
          </el-col>
          <el-col :span="18">
            <span class="title-note">{{detailINfo.mobile}}</span>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6" style="text-align: right">
            <strong class="title-note">用户账号：</strong>
          </el-col>
          <el-col :span="18">
            <span class="title-note">{{detailINfo.loginName}}</span>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6" style="text-align: right">
            <strong class="title-note">用户排序：</strong>
          </el-col>
          <el-col :span="18">
            <span class="title-note">{{detailINfo.sort}}</span>
          </el-col>
        </el-row>
        <div class="btn-row">
          <el-button size="small" type="primary" @click="closeDialog('detailINfo')">关闭</el-button>
        </div>
      </el-dialog>
      <!--增加医生弹窗-->
      <el-dialog title="增加信息" :visible.sync="addINfo.isShowDialog"  :before-close="closeADDdialog" width='650px'>
        <el-row :gutter="20" class="m_b_15">
        <el-col :span="8" style="text-align: right">
          <strong class="title-note">选择用户：</strong>
        </el-col>
        <el-col :span="10">
          <el-select v-model="addINfo.userId" placeholder="请选择用户"
                       class="selectnerMsg" filterable>
              <el-option v-for="item in MRuserList" :key="item.userId" :label="item.userName"
                         :value="item.userId">
              </el-option>
          </el-select>
        </el-col>
      </el-row>
        <!-- <el-row :gutter="20" class="m_b_15">
          <el-col :span="8" style="text-align: right">
            <strong class="title-note">所属机构：</strong>
          </el-col>
          <el-col :span="10">

            <el-autocomplete class="auto-select"
              popper-class="my-autocomplete"
              v-model="addINfo.institutionName"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
              @select="handleSelectAdd">
              <template slot-scope="{ item }">
                <div class="name">{{ item.institutionName }}</div>
              </template>
            </el-autocomplete>
          </el-col>
        </el-row> -->
        <el-row :gutter="20">
          <el-col :span="8" style="text-align: right">
            <strong class="title-note">用户排序：</strong>
          </el-col>
          <el-col :span="10">
            <el-input v-model="addINfo.sort" placeholder="用户排序"></el-input>
          </el-col>
        </el-row>
        <div class="btn-row">
          <el-button size="small" type="primary" @click="_upDataAddDoctor">确定</el-button>
          <el-button size="small" type="primary" @click="closeADDdialog">取消</el-button>
        </div>
      </el-dialog>
      <!--服务时间-->
      <el-dialog title="服务时间" :visible.sync="serviceTime.isShowDialog" width="640px" class="time-dialog">
        <p class="name-bar">
          <em class="name-note">账户名:</em>
          <em class="name-text">{{serviceTime.doctorName}}</em>
        </p>

        <ul class="time-content">
          <li class="time-list">
            <strong class="list-note">工作日上午</strong>
            <div class="time-select-box">
              <el-time-select :editable="false" placeholder="开始时间" v-model="serviceTime.workdayAmFromTime" :picker-options="{start: '06:00',step: '00:60',end: '12:00'}"></el-time-select>
            </div>
            <strong class="list-to-text">至</strong>
            <div class="time-select-box">
              <el-time-select :editable="false" placeholder="结束时间" v-model="serviceTime.workdayAmToTime" :picker-options="{start: '06:00',step: '00:60',end: '12:00'}"></el-time-select>
            </div>
          </li>
          <li class="time-list">
            <strong class="list-note">工作日下午</strong>
            <div class="time-select-box">
              <el-time-select :editable="false" placeholder="开始时间" v-model="serviceTime.workdayPmFromTime" :picker-options="{start: '12:00',step: '00:60',end: '23:00'}"></el-time-select>
            </div>
            <strong class="list-to-text">至</strong>
            <div class="time-select-box">
              <el-time-select :editable="false" placeholder="结束时间" v-model="serviceTime.workdayPmToTime" :picker-options="{start: '12:00',step: '00:60',end: '23:00'}"></el-time-select>
            </div>
          </li>
          <li class="time-list">
            <strong class="list-note">非工作日上午</strong>
            <div class="time-select-box">
              <el-time-select :editable="false" placeholder="开始时间" v-model="serviceTime.offdayAmFromTime" :picker-options="{start: '06:00',step: '00:60',end: '12:00'}"></el-time-select>
            </div>
            <strong class="list-to-text">至</strong>
            <div class="time-select-box">
              <el-time-select :editable="false" placeholder="结束时间" v-model="serviceTime.offdayAmToTime" :picker-options="{start: '06:00',step: '00:60',end: '12:00'}"></el-time-select>
            </div>
          </li>
          <li class="time-list">
            <strong class="list-note">非工作日下午</strong>
            <div class="time-select-box">
              <el-time-select :editable="false" placeholder="开始时间" v-model="serviceTime.offdayPmFromTime" :picker-options="{start: '12:00',step: '00:60',end: '23:00'}"></el-time-select>
            </div>
            <strong class="list-to-text">至</strong>
            <div class="time-select-box">
              <el-time-select :editable="false" placeholder="结束时间" v-model="serviceTime.offdayPmToTime" :picker-options="{start: '12:00',step: '00:60',end: '23:00'}"></el-time-select>
            </div>
          </li>
        </ul>
        <p class="notice-text">建议：工作日10：00 -18:00，非工作日10:00-24:00.必须完成所有设置项目才能在app使用</p>
        <div class="content-foot">
          <el-button type="primary" @click="saveTimeFn" size="small">确定</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>
<script>
import headerTop from '@/components/headTop.vue';
import { mapGetters } from "vuex";
import { getDoctorList,updataDoctorEditor,getAllService,restPassword,addDoctor,saveDoctorTime,ERR_OK,ListMRUSer} from "@/api/api.js";
import {IsAlert} from '@/config/mUtils.js';
var mbTest = /^(11|12|13|14|15|16|17|18|19)[0-9]{9}$/;
export default {
  data(){
    return{
      //数据总条数
      totalCount:0,

      //医生列表数据
      doctorList:[],
      MRuserList:[],

      //搜索参数
      searchParams:{
        currentPage:1,//页码
        pageSize: 10,//
        institutionName:"",//机构id
        institutionId:"",//机构id
        mobile:"",//手机号
        roleId:"",//角色id
        name:""//姓名
      },
      //新增的参数
      addINfo:{
        isShowDialog:false,//是否显示dialog
        institutionId: "",
        roleId: "",
        sort: "1",
      },

      //详情
      detailINfo:{
        isShowDialog:false,//是否显示dialog
        instituionName:"",
        roleName:"",
        name:"",//用户名
        mobile:"",
        usename:"",//账户名
        // password:'',
        sort: 1,
        doctorServices:[]
      },
      //服务时间
      serviceTime:{
        isShowDialog:false,
        workdayAmFromTime:"",
        workdayAmToTime:"",
        workdayPmFromTime:"",
        workdayPmToTime:"",
        offdayAmFromTime:"",
        offdayAmToTime:"",
        offdayPmFromTime:"",
        offdayPmToTime:"",
        userId:"",
        doctorName:"",
        id:""//主键id
      }
    }
  },

  methods:{
    //自带搜索组件选中
    handleSelect(item) {
      this.searchParams.institutionName=item.institutionName;
      this.searchParams.institutionId=item.institutionId
    },

    handleSelectAdd(item){
      this.addINfo.institutionName=item.institutionName;
      this.addINfo.institutionId=item.institutionId
    },
    //自带搜索组件搜索
    querySearch(queryString, cb) {
      let institutions = this.getInstitutionArr;
      let results = queryString ? institutions.filter(this.createFilter(queryString)) : institutions;
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.institutionName.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
      };
    },

    //点击搜索
    doSearch(){
      this.searchParams.currentPage=1;
      this.getDoctorListsFn();
    },

    //获取医生列表
    getDoctorListsFn(){
      let params={
        name:this.searchParams.name,//用户名
        mobile:this.searchParams.mobile,//手机号
        roleId:this.searchParams.roleId,//角色id
        institutionId:this.searchParams.institutionId,//机构id
        pageSize:this.searchParams.pageSize,//限制
        currentPage:this.searchParams.currentPage,//页码
      };

      getDoctorList(params).then(res => {
        if(res.code===ERR_OK){
          this.doctorList=res.data.list;
          this.totalCount=res.data.totalCount;
        }else{
          IsAlert(res.msg,'错误','error');
        }
      }).catch(()=>{
        this.$message.error('网络错误!请稍后重试')
      })
    },
    //获取所有已启用用户
        geListMRUSerFn(){
          ListMRUSer({}).then(res => {
            if(res.code===ERR_OK){
              this.MRuserList=res.data;
            }else{
              IsAlert(res.msg,'错误','error');
            }
          }).catch(err => {
            this.$message.error('网络错误，请稍后重试')
          })
        },

    handleSizeChange(val){
      this.searchParams.pageSize=val;
      this.getDoctorListsFn()
    },

    handleCurrentChange(val){
      this.searchParams.currentPage=val;
      this.getDoctorListsFn()
    },
    closeADDdialog(){//弹窗点击X号关闭或点击空白处关闭的回调参数
      this.addINfo = {
        isShowDialog:false,//是否显示dialog
        institutionId: "",
        roleId: "",
        sort: "1",
      }
    },
    //公用关闭dialog
    closeDialog(argString){
      this[argString].isShowDialog=false;
    },

    //点击新增显示Dialog
    _addItem:function(){
      this.addINfo.isShowDialog=true;
    },

    //点击确定增加医生
    _upDataAddDoctor:function(){
      var params={
        // institutionId:this.addINfo.institutionId,
        sort:this.addINfo.sort,
        userId: this.addINfo.userId
      };
      // if(!params.institutionId){
      //   this.$alert("请选择机构", '提示', {
      //     confirmButtonText: '确定',
      //   });
      //   return;
      // }
      if(!params.userId){
        IsAlert('请选择用户','提示','warning');
        return;
      }
      if(!params.sort){
        IsAlert('请输入排序','提示','warning');
        return;
      }
      addDoctor(params).then(res => {
        if(res.code===ERR_OK){
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.addINfo.isShowDialog=false;
          this.closeADDdialog();
          this.getDoctorListsFn();
        }else{
          IsAlert(res.msg,'错误','error');
        }
      }).catch(()=>{
        this.$message.error('网络错误!请稍后重试')
      })
    },

    //点击查看
    _checkDetail:function (item) {
      this.detailINfo.isShowDialog=true;//显示dialog
      this.detailINfo.institutionName=item.institutionName;
      this.detailINfo.userName=item.userName;
      this.detailINfo.mobile=item.mobile;
      this.detailINfo.loginName=item.loginName;
      this.detailINfo.sort=item.sort;
    },

    //服务时间
    showTimeDialogFn(item){
      this.serviceTime.workdayAmFromTime=item.workdayAmFromTime || "";
      this.serviceTime.workdayAmToTime=item.workdayAmToTime || "";
      this.serviceTime.workdayPmFromTime=item.workdayPmFromTime || "";
      this.serviceTime.workdayPmToTime=item.workdayPmToTime || "";
      this.serviceTime.offdayAmFromTime=item.offdayAmFromTime || "";
      this.serviceTime.offdayAmToTime=item.offdayAmToTime || "";
      this.serviceTime.offdayPmFromTime=item.offdayPmFromTime || "";
      this.serviceTime.offdayPmToTime=item.offdayPmToTime || "";
      this.serviceTime.userId=item.userId;
      this.serviceTime.insDoctorId=item.insDoctorId;
      this.serviceTime.id=item.id || "";
      this.serviceTime.doctorName=item.username;
      this.serviceTime.isShowDialog=true;
    },

    //保存服务时间设置
    saveTimeFn(){
      let params={
        doctorId:this.serviceTime.insDoctorId,
        id:this.serviceTime.id,//修改的时候传空 新增的时候传空
        userType:1,
        workdayAmFromTime:this.serviceTime.workdayAmFromTime,
        workdayAmToTime:this.serviceTime.workdayAmToTime,
        workdayPmFromTime:this.serviceTime.workdayPmFromTime,
        workdayPmToTime:this.serviceTime.workdayPmToTime,
        offdayAmFromTime:this.serviceTime.offdayAmFromTime,
        offdayAmToTime:this.serviceTime.offdayAmToTime,
        offdayPmFromTime:this.serviceTime.offdayPmFromTime,
        offdayPmToTime:this.serviceTime.offdayPmToTime,
      };

      //工作日上午
      if(params.workdayAmFromTime && params.workdayAmToTime){
        if(parseInt(params.workdayAmFromTime.slice(0,2)) >= parseInt(params.workdayAmToTime.slice(0,2))){
          IsAlert('工作日上午开始时间必须小于结束时间','提示','warning');
          return;
        }
      }
      //工作日下午
      if(params.workdayPmFromTime && params.workdayPmToTime){
        if(parseInt(params.workdayPmFromTime.slice(0,2)) >= parseInt(params.workdayPmToTime.slice(0,2))){
          IsAlert('工作日下午开始时间必须小于结束时间','提示','warning');
          return;
        }
      }
      //非工作日上午
      if(params.offdayAmFromTime && params.offdayAmToTime){
        if(parseInt(params.offdayAmFromTime.slice(0,2)) >= parseInt(params.offdayAmToTime.slice(0,2))){
          IsAlert('非工作日上午开始时间必须小于结束时间','提示','warning');
          return;
        }
      }
      //非工作日下午
      if(params.offdayPmFromTime && params.offdayPmToTime){
        if(parseInt(params.offdayPmFromTime.slice(0,2)) >= parseInt(params.offdayPmToTime.slice(0,2))){
          IsAlert('非工作日下午开始时间必须小于结束时间','提示','warning');
          return;
        }
      }

      saveDoctorTime(params).then(res => {
        if(res.code===ERR_OK){
          this.serviceTime.isShowDialog=false;
          this.$alert(res.msg, '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.getDoctorListsFn();
            }
          },)
        }else{
          IsAlert(res.msg,'错误','error');
        }
      }).catch(()=>{
        this.$message.error('网络错误!请稍后重试')
      })
    }
  },
  activated: function(){
    this.getDoctorListsFn();
    this.geListMRUSerFn();
  },
  components:{
    headerTop
  },
  computed:{
    ...mapGetters(['getDoctorRolesList','getInstitutionArr'])
  },

  watch:{
    'searchParams.institutionName'(newVal){
      if(!newVal){
        this.searchParams.institutionId="";
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .el-select {display: block;}
  .el-input {margin-bottom: 15px;}
  .el-button--mini {padding: 7px 10px;}
  .title-note {line-height: 40px;}
  .btn-row {text-align: center;padding-top: 20px;}
  .service-label-box {padding-top: 12px;line-height: 18px;}
  .service-label {padding: 0 5px 0 3px;}
  .service-label input[type='checkbox'] {margin: 3px 3px 0 0;display: inline-block;vertical-align: top;}
  .input-benefit {display: inline-block;width: 100px;}
  input::-webkit-outer-spin-button,input::-webkit-inner-spin-button {-webkit-appearance: none;}
  input[type='number'] {-moz-appearance: textfield;}
  .auto-select{width: 100%}



.time-dialog{
  .time-content{
    .time-list{
      height: 40px;margin-bottom: 15px;
      .list-note{
        float: left;
        width:100px;
        line-height: 40px;
        color:#666;
        font-size: 14px;
      }
      .time-select-box{
        float: left;
        width: 200px;
        .el-date-editor{
          width: 100%;
        }
      }
      .list-to-text{
        float: left;
        width: 60px;
        line-height: 40px;
        text-align: center;
        color:#666;
        font-size: 14px;
      }
    }
  }
  .content-foot{
    text-align: center
  }
  .notice-text {
    font-size: 12px;
    line-height: 24px;
    color: #999;
    text-align: center;
    border-bottom: 1px solid #e8e8e8;
    padding-bottom: 15px;
    margin-bottom: 20px;
  }

}

.name-bar{
  height: 22px;
  margin-bottom: 20px;
  .name-note{
    float: left;
    width: 100px;
    line-height: 22px;
    color: #666;
    font-size: 16px;
  }
  .name-text{
    float: left;
    line-height: 22px;
    font-size: 16px;
    color:#444;
  }
}

</style>
