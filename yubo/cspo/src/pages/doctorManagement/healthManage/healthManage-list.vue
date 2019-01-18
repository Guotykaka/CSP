<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <!--操作行-->
      <el-form :inline="true" :model="searchParams" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input v-model="searchParams.name" placeholder="姓名" clearable></el-input>
        </el-form-item>

        <el-form-item label="手机号">
          <el-input v-model="searchParams.mobile" placeholder="手机号" clearable></el-input>
        </el-form-item>
        <el-form-item label="机构">
          <el-autocomplete
            popper-class="my-autocomplete"
            v-model="searchParams.institutionName"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            @select="handleSelect"
            @blur='handleSelect'
            clearable>
            <template slot-scope="{item}">
              <div class="name">{{ item.institutionName }}</div>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="健管师等级">
          <el-select v-model="searchParams.leaveType" placeholder="请输入健管师等级" clearable>
            <el-option label="普通健管师" :value="1"></el-option>
            <el-option label="金牌健管师" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doSearch">查询</el-button>
        </el-form-item>
      </el-form>
      <!--新增-->
      <el-row class="m_b_15">
        <el-button type="primary" @click="_addItem">新增</el-button>
        <el-button type="primary" @click="saveCheckFn">保存在线人员</el-button>
      </el-row>
      <!--table 表单开始-->
      <el-table :data="doctorList" border style="width: 100%">
        <el-table-column width="60">
          <template slot-scope="scope">
            <span class="self-checkBox" :class="scope.row.schedulingStatus===1 ? '' : 'active'" @click="toggle(scope.row,scope.$index)"></span>
          </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip align="center" prop="userName" label="用户名"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="institutionName" label="机构名称"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="mobile" label="手机号"></el-table-column>
        <!-- <el-table-column show-overflow-tooltip align="center" prop="email" label="邮箱"></el-table-column> -->
        <el-table-column show-overflow-tooltip align="center" prop="loginName" label="用户账号"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="type" label="健管师等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type===1">普通健管师</el-tag>
            <el-tag type="warning" v-if="scope.row.type===2">金牌健管师</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="_doEditor(scope.row,scope.$index)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--table 表单结束-->
      <div class="self-page-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchParams.currentPage" :page-sizes="[10,20]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
    </div>
    <!--增加健管师弹窗-->
    <el-dialog title="增加信息" :visible.sync="addINfo.isShowDialog" :before-close="closeAddDialog">
      <el-row :gutter="20" class="m_b_15">
        <el-col :span="8" style="text-align: right">
          <strong class="title-note">健管师等级：</strong>
        </el-col>
        <el-col :span="10">
          <el-select v-model="addINfo.type" placeholder="请选择健管师等级">
            <el-option label="普通健管师" :value="1"></el-option>
            <el-option label="金牌健管师" :value="2"></el-option>
          </el-select>
            
        </el-col>
      </el-row>
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
      <div class="btn-row">
        <el-button size="small" type="primary" @click="saveHealthFn">确定</el-button>
        <el-button size="small" type="primary" @click="closeAddDialog">取消</el-button>
      </div>
    </el-dialog>

    <!--编辑健管师弹窗-->
    <el-dialog title="编辑信息" :visible.sync="editorINfo.isShowDialog">
      <el-row :gutter="20" class="m_b_15">
        <el-col :span="8" style="text-align: right">
          <strong class="title-note">健管师等级：</strong>
        </el-col>
        <el-col :span="10">
          <el-select v-model="editorINfo.type" placeholder="请选择健管师等级">
            <el-option label="普通健管师" :value="1"></el-option>
            <el-option label="金牌健管师" :value="2"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <div class="btn-row">
        <el-button size="small" type="primary" @click="updataEditor()">保存</el-button>
        <el-button size="small" type="primary" @click="closeEditorDialog">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  let mbTest = /^(12|13|14|15|16|17|18|19)[0-9]{9}$/;
  import headerTop from '@/components/headTop.vue';
  import {getHealthList,saveHealth,updateHealth,saveCheck,ERR_OK,ListMRUSer} from "@/api/api.js";
  import {IsAlert} from "@/config/mUtils.js";
  import { mapGetters } from "vuex";
  export default {
      name: "hearthManage-list",
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
            leaveType:null,//健管师等级
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
            institutionName: "",
            loginName: "",
            mobile: "",
            mrUserSchedulingId: "",
            schedulingStatus: "",
            type: null,
            userId: "",
            userName: "",
          },

          //编辑数据
          editorINfo:{
            isShowDialog:false,//是否显示dialog
            institutionId: "",
            institutionName: "",
            loginName: "",
            mobile: "",
            mrUserSchedulingId: "",
            schedulingStatus: "",
            type: "",
            userId: "",
            userName: "",
          },
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
        handleSelectEditor(item){
          this.editorINfo.institutionName=item.institutionName;
          this.editorINfo.institutionId=item.institutionId
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

        handleSizeChange(val){
          this.searchParams.pageSize=val;
          this.getHealthListsFn()
        },

        handleCurrentChange(val){
          this.searchParams.currentPage=val;
          this.getHealthListsFn()
        },
        //点击搜索
        doSearch(){
          this.searchParams.currentPage=1;
          this.getHealthListsFn();
        },

        //获取医生列表
        getHealthListsFn(){
          let params={
            currentPage: this.searchParams.currentPage,
            institutionId: this.searchParams.institutionId,
            mobile: this.searchParams.mobile,
            userName: this.searchParams.name,
            pageSize: this.searchParams.pageSize,
            // roleId: this.searchParams.roleId,
            type:this.searchParams.leaveType
          };

          getHealthList(params).then(res => {
            if(res.code===ERR_OK){
              this.doctorList=res.data.list;
              this.totalCount=res.data.totalCount;
            }else{
              IsAlert(res.msg, '错误', 'error');
            }
          }).catch(err => {
            this.$message.error('网络错误，请稍后重试')
          })
        },
        //获取所有已启用用户
        geListMRUSerFn(){
          ListMRUSer({}).then(res => {
            if(res.code===ERR_OK){
              this.MRuserList=res.data;
            }else{
              IsAlert(res.msg, '错误', 'error');
            }
          }).catch(err => {
            this.$message.error('网络错误，请稍后重试')
          })
        },

        //点击新增显示Dialog
        _addItem:function(){
          this.addINfo.isShowDialog=true;
        },

        //点击确定增加医生
        saveHealthFn:function(){
          let params={
            mrUserSchedulingEntities: [
                {
                  id: this.addINfo.institutionId,
                  schedulingStatus: this.addINfo.schedulingStatus,
                  type: this.addINfo.type,
                  userId: this.addINfo.userId
                }
              ],
          };
          if(!params.mrUserSchedulingEntities[0].type){
            IsAlert('请选择健管师等级', '提示', 'warning');
            return;
          }
          if(!params.mrUserSchedulingEntities[0].userId){
            IsAlert('请选择用户', '提示', 'warning');
            return;
          }
          saveHealth(params).then(res => {
            if(res.code===ERR_OK){
              this.$message({
                message: '操作成功',
                type: 'success'
              });
              this.addINfo.isShowDialog=false;
              this.getHealthListsFn();
            }else{
              IsAlert(res.msg, '错误', 'error');
            }
          }).catch(err => {
            this.$message.error('网络错误，请稍后重试')
          })
            this.closeAddDialog();
        },

        //点击编辑
        _doEditor:function (item) {
          this.editorINfo.isShowDialog=true;
          this.editorINfo.schedulingStatus= item.schedulingStatus;
          this.editorINfo.type= item.type;//健管师等级
          this.editorINfo.userId=item.userId;
        },

        //保存编辑
        updataEditor:function(){
          let params={
            mrUserSchedulingEntities: [
                {
                  id: this.editorINfo.institutionId,
                  schedulingStatus: this.editorINfo.schedulingStatus,
                  type: this.editorINfo.type,
                  userId: this.editorINfo.userId
                }
              ],
          };

          updateHealth(params).then(res => {
            if(res.code===ERR_OK){
              this.editorINfo.isShowDialog=false;
              this.$alert('保存成功', '提示', {
                confirmButtonText: '确定',
                center: true,
                callback: action => {
                  this.getHealthListsFn();
                }
              },)

            }else{
              IsAlert(res.msg, '错误', 'error');
            }
          }).catch(err => {
            this.$message.error('网络错误，请稍后重试')
          })
        },

        //关闭新增
        closeAddDialog(){
          this.addINfo.userId='';
          this.addINfo.type=null;
          this.addINfo.isShowDialog=false;
        },
        //关闭编辑
        closeEditorDialog(){
          this.editorINfo.isShowDialog=false;
        },

        //check
        toggle(item,index){
          if(item.schedulingStatus===1){
            this.doctorList[index].schedulingStatus=2;
          }else {
            this.doctorList[index].schedulingStatus=1;
          }
        },

        //保存
        saveCheckFn(){
         let obj= this.repeatArr(this.doctorList);
         if(!obj.flag){
            IsAlert('至少选中一条', '提示', 'warning');
           return
         }
          let params={
            dto:obj.Arr,
          };
          saveCheck(params).then(res => {
            if(res.code===ERR_OK){
              this.$alert(res.msg, '提示', {
                center: true,
                confirmButtonText: '确定',
                callback: action => {
                  this.getHealthListsFn()
                }
              })
            }else{
              IsAlert(res.msg, '错误', 'error');
            }
          }).catch(err => {
            this.$message.error('网络错误，请稍后重试')
          })
        },
        repeatArr(arrTarget){
          let Obj={
            Arr:[],
            flag:false
          };
          let itemObj={};
          arrTarget.forEach(function (item) {
            if(item.schedulingStatus===2){
              Obj.flag=true;
            }
            itemObj={
              userId:item.userId,
              schedulingStatus:item.schedulingStatus
            };
            Obj.Arr.push(itemObj);
          });
          return Obj;
        },
        //点击新增显示Dialog
        _addItem:function(){
          this.addINfo.isShowDialog=true;
        },

      },

    activated: function(){
      this.getHealthListsFn();
      this.geListMRUSerFn();
    },

    computed:{
      ...mapGetters(['getDoctorRolesList','getInstitutionArr'])
    },

      components:{
        headerTop
      },
    }
</script>

<style scoped lang="less">
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

  .self-checkBox{
    display: inline-block;
    width: 11px;
    height: 11px;
    cursor: pointer;
    background: url("./check_bg.png") no-repeat left top;
    overflow: hidden;
  }
  .self-checkBox.active{
    background: url("./check_bg.png") no-repeat right top;

  }

</style>
