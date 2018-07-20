<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <!--操作行开始-->
      <el-form :inline="true" :model="searchParams" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input v-model="searchParams.name" placeholder="姓名"></el-input>
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
          <el-button type="primary" @click="_doSearch">查询</el-button>
        </el-form-item>
      </el-form>
      <!--操作行结束-->

      <!--tab nav-->
      <el-tabs v-model="tabIndex">
        <el-tab-pane label="全部" name="null"></el-tab-pane>
        <el-tab-pane label="待认证" name="1"></el-tab-pane>
        <el-tab-pane label="已认证" name="2"></el-tab-pane>
        <el-tab-pane label="取消认证" name="3"></el-tab-pane>
        <el-tab-pane label="拒绝认证" name="4"></el-tab-pane>
      </el-tabs>
      <!--table 表单开始-->
      <el-table
        :data="doctorIdenList"
        border
        style="width: 100%">
        <el-table-column prop="name" label="医生姓名"  width="100"></el-table-column>
        <el-table-column prop="roleName" label="角色"></el-table-column>
        <el-table-column prop="instituionName" label="机构"></el-table-column>
        <el-table-column prop="creatTime" label="申请时间"></el-table-column>
        <el-table-column prop="updateTime" label="操作时间"></el-table-column>
        <el-table-column prop="authenticationStatus" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.authenticationStatus===1">待认证</el-tag>
            <el-tag type="success" v-if="scope.row.authenticationStatus===2">已认证</el-tag>
            <el-tag type="warning" v-if="scope.row.authenticationStatus===3">已取消</el-tag>
            <el-tag type="danger" v-if="scope.row.authenticationStatus===4">已拒绝</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190">
          <template slot-scope="scope">
            <el-button v-if="scope.row.authenticationStatus===1" size="mini" type="primary" @click="agreeApply(scope.row.insDoctorId)">同意</el-button>
            <el-button v-if="scope.row.authenticationStatus===1" size="mini" type="danger" @click="refuseApply(scope.row.insDoctorId)">拒绝</el-button>
            <el-button size="mini" type="info" @click="queryDoctorInfoFn(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--table 表单结束-->
      <div class="self-page-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchParams.currentPage" :page-sizes="[10,20]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>

      <!--详情的dialog-->
      <el-dialog title="认证详情" :visible.sync="isShowDialog" width="70%">
        <!--待认证-->
        <el-card shadow="never" class="m_b_15 warning-panel" v-if="doctorInfo.authenticationStatus === 1">
          <el-row :gutter="20">
            <el-col :span="4" style="text-align: right">
              <strong class="title-note">
                <span class="el-icon-warning note-icon warning-icon"></span>
              </strong>
            </el-col>
            <el-col :span="20">
              <h3 class="status-panel-text">认证申请中！</h3>
              <p class="status-panel-text">身份信息已提交，待审核</p>
            </el-col>
          </el-row>
        </el-card>
        <!--成功状态-->
        <el-card shadow="never" class="m_b_15 success-panel" v-if="doctorInfo.authenticationStatus === 2">
          <el-row :gutter="20">
            <el-col :span="4" style="text-align: right">
              <strong class="title-note">
                <span class="el-icon-success note-icon success-icon"></span>
              </strong>
            </el-col>
            <el-col :span="20">
              <h3 class="status-panel-text">认证已成功！</h3>
              <p class="status-panel-text">身份信息已审核通过</p>
            </el-col>
          </el-row>
        </el-card>
        <!--认证失败-->
        <el-card shadow="never" class="m_b_15 fail-panel" v-if="doctorInfo.authenticationStatus === 3">
          <el-row :gutter="20">
            <el-col :span="4" style="text-align: right">
              <strong class="title-note">
                <span class="el-icon-error note-icon error-icon"></span>
              </strong>
            </el-col>
            <el-col :span="20">
              <h3 class="status-panel-text">认证取消</h3>
            </el-col>
          </el-row>
        </el-card>
        <!--认证失败-->
        <el-card shadow="never" class="m_b_15 fail-panel" v-if="doctorInfo.authenticationStatus === 4">
          <el-row :gutter="20">
            <el-col :span="4" style="text-align: right">
              <strong class="title-note">
                <span class="el-icon-error note-icon error-icon"></span>
              </strong>
            </el-col>
            <el-col :span="20">
              <h3 class="status-panel-text">认证失败！</h3>
              <p class="status-panel-text">失败原因：拒绝</p>
            </el-col>
          </el-row>
        </el-card>
        <el-row :gutter="20" class="m_b_15">
          <el-col :span="5" style="text-align: right">
            <strong class="logo-note">LOGO：</strong>
          </el-col>
          <el-col :span="7">
            <img class="logoImg" :src="doctorInfo.logoUrl"/>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="m_b_15">
          <el-col :span="5" style="text-align: right">
            <strong class="title-note">姓名：</strong>
          </el-col>
          <el-col :span="7">
            <span>{{doctorInfo.name}}</span>
          </el-col>
          <el-col :span="5" style="text-align: right">
            <strong class="title-note">职称：</strong>
          </el-col>
          <el-col :span="7">
            <span>{{doctorInfo.positionalTitles || ''}}</span>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="m_b_15">
          <el-col :span="5" style="text-align: right">
            <strong class="title-note">职业证号：</strong>
          </el-col>
          <el-col :span="7">
            <span>{{doctorInfo.professionalCertificateCode || ''}}</span>
          </el-col>
          <el-col :span="5" style="text-align: right">
            <strong class="title-note">科室：</strong>
          </el-col>
          <el-col :span="7">
            <span>{{doctorInfo.department || ''}}</span>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="m_b_15">
          <el-col :span="5" style="text-align: right">
            <strong class="title-note">擅长：</strong>
          </el-col>
          <el-col :span="7">
            <span>{{doctorInfo.department || ''}}</span>
          </el-col>
          <el-col :span="5" style="text-align: right">
            <strong class="title-note">执业医院：</strong>
          </el-col>
          <el-col :span="7">
            <span>{{doctorInfo.hospital || ''}}</span>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="m_b_15">
          <el-col :span="5" style="text-align: right">
            <strong class="title-note">学习研究成果获奖：</strong>
          </el-col>
          <el-col :span="7">
            <span>{{doctorInfo.winningDesc || ''}}</span>
          </el-col>
           <el-col :span="5" style="text-align: right">
            <strong class="title-note">简介：</strong>
          </el-col>
          <el-col :span="7">
            <span>{{doctorInfo.remarks || ''}}</span>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="m_b_15">
          <el-col :span="5" style="text-align: right">
            <strong class="title-note">医生从业资格证：</strong>
          </el-col>
          <el-col :span="7">
            <img class="zhengshuImg" :src="doctorInfo.doctorJobCertificateUrl"/>
          </el-col>
          <el-col :span="5" style="text-align: right">
            <strong class="title-note">职称证书：</strong>
          </el-col>
          <el-col :span="7">
            <img class="zhengshuImg" :src="doctorInfo.titleCertificateUrl"/>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="m_b_15">
          <el-col :span="5" style="text-align: right">
            <strong class="title-note">推荐理由：</strong>
          </el-col>
          <el-col :span="18">
            <span>{{doctorInfo.recommendReason || ''}}</span>
          </el-col>
        </el-row>
        <div class="btn-row" style="text-align: center">
          <el-button size="small" type="warning" @click="closeDialog">关闭</el-button>
        </div>
      </el-dialog>
      <!--refuse reason dialog-->
      <el-dialog title="拒绝理由" :visible.sync="refuse.isShowDialog" width="400px">
        <el-input type="textarea" v-model="refuse.refuseReason"></el-input>
        <div class="btn-row" style="text-align: right">
          <el-button size="small" type="default" @click="">取消</el-button>
          <el-button size="small" type="primary" @click="doRefuseFn">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>

</template>

<script>
  import headerTop from "@/components/headTop.vue";
  import { mapGetters } from "vuex";
  import {getDoctorApplyList,queryDoctorInfo,changeDoctorStatus,ERR_OK} from "@/api/api.js";
  export default {
    data(){
      return {
        totalCount:0,
        authenticationStatus:"",//状态值
        isShowDialog:false,//是否显示dialog
        tabIndex: 'null',//当前状态index
        insDoctorId:"",

        //拒绝信息
        refuse:{
          isShowDialog:false,
          refuseReason:''
        },

        //医生认证列表数据
        doctorIdenList: [],

        //医生审核详情
        doctorInfo: {},
        searchParams: {
          currentPage: 1,//页码
          pageSize: 10,//
          startTime:"",
          endTime: "",
          institutionId: "",//机构id
          institutionName:"",//机构名称
          name: ""
        },
        rangeTime:"",//开始时间和结束时间
        nowDate: '',
      }
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
          return (restaurant.institutionName.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },

      //分页 每页数量变化
      handleSizeChange(val){
        this.searchParams.pageSize=val;
        this.getApplyList()
      },

      //分页
      handleCurrentChange(val){
        this.searchParams.currentPage=val;
        this.getApplyList()
      },

      //搜素
      _doSearch(){
        this.searchParams.currentPage=1;
        this.getApplyList();
      },

      //获取医生认证列表
      getApplyList(){
        if(this.rangeTime){
          this.searchParams.startTime=this.rangeTime[0];
          this.searchParams.endTime=this.rangeTime[1];
        }else {
          this.searchParams.startTime="";
          this.searchParams.endTime="";
        }
        if(!this.searchParams.institutionName){
          this.searchParams.institutionId='';
        }
        var params={
          authenticationStatus: this.authenticationStatus,
          currentPage:this.searchParams.currentPage,
          institutionId: this.searchParams.institutionId,
          name:this.searchParams.name,
          pageSize:this.searchParams.pageSize,
          startTime:this.searchParams.startTime,
          endTime:this.searchParams.endTime,
        };

        getDoctorApplyList(params).then(res => {
          if(res.code===ERR_OK){
            if(res.data.list){
              this.doctorIdenList=res.data.list || [];
              this.totalCount=res.data.totalCount;
            }
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

      //查询医生详情
      queryDoctorInfoFn(item){
        var params={
          insDoctorId:item.insDoctorId
        };
        queryDoctorInfo(params).then(res => {
          if(res.code===ERR_OK){
            this.doctorInfo=res.data;
            this.isShowDialog=true;
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

      //关闭dialog
      closeDialog(){
        this.isShowDialog=false;
      },

      //同意申请
      agreeApply: function (uid) {
        this.insDoctorId=uid;
        this.$confirm('确定同意申请吗？')
          .then(_ => {
            let params={
              insDoctorId:uid,
              status:2
            };
            changeDoctorStatus(params).then(res => {
              if(res.code===ERR_OK){
                this.getApplyList();
                this.isShowDialog=false;
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
          });
      },

      //显示拒绝申请dialog
      refuseApply: function (uid) {
        this.insDoctorId=uid;
        this.refuse.isShowDialog=true;
      },

      //操作拒绝申请
      doRefuseFn(){
        let params={
          insDoctorId:this.insDoctorId,
          status: 4,
          refuseReason:this.refuse.refuseReason
        };
        changeDoctorStatus(params).then(res => {
          if(res.code===ERR_OK){
            this.refuse.isShowDialog=false;


            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.getApplyList();
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
    },

    activated(){
      this.getApplyList();
    },
    components: {
      headerTop,
    },
    computed:{
      ...mapGetters(['getInstitutionArr'])
    },

    watch:{
      tabIndex(newVal){
        if(newVal==='null'){
          this.authenticationStatus='';
        }else{
          this.authenticationStatus=newVal;
        }
        this.searchParams.currentPage=1;
        this.getApplyList();
      }
    }
  }
</script>
<style lang="less" scoped>
  .el-select{display: block}
  .el-button--mini{padding: 7px 10px}
  .logoImg{width: 60px;height: 60px;border-radius: 50%}
  .logo-note{line-height: 60px;}
  .title-note{line-height: 22px;}
  .zhengshuImg{width: 50px;height: 50px;}
  .success-panel{background-color: #d8e8d8;border: 1px solid #44ae44}
  .warning-panel{background-color: #f9ebd8;border: 1px solid #f0ad4e}
  .fail-panel{background-color: #f6cbca;border: 1px solid #d9534f}
  .note-icon{font-size: 20px}
  .success-icon{color:#44ae44;}
  .warning-icon{color:#f0ad4e}
  .error-icon{color:#d9534f;}
  .status-panel-text{line-height: 22px;color:#444;font-size: 14px;}
  .el-textarea{margin-bottom: 25px}
</style>
