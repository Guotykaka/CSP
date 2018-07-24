<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <!--操作行-->
      <el-form :inline="true" :model="searchParams" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input v-model="searchParams.name" placeholder="姓名"></el-input>
        </el-form-item>

        <el-form-item label="手机号">
          <el-input v-model="searchParams.mobile" placeholder="手机号"></el-input>
        </el-form-item>

        <el-form-item label="角色">
          <el-select v-model="searchParams.roleId" clearable placeholder="请选择角色">
            <el-option v-for="item in getDoctorRolesList" :key="item.roleId" :label="item.roleName" :value="item.roleId"></el-option>
          </el-select>
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
        <el-table-column prop="name" label="用户名"></el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>
        <el-table-column prop="username" label="用户账号"></el-table-column>
        <el-table-column prop="roleName" label="角色"></el-table-column>
        <el-table-column prop="creatTime" label="创建日期"></el-table-column>
        <el-table-column prop="instituionName" label="所属机构"></el-table-column>
        <el-table-column prop="doctorServiceSettingString" label="开通服务"></el-table-column>
        <el-table-column prop="sort" label="排序" width="100"></el-table-column>
        <el-table-column label="操作" width="380">
          <template slot-scope="scope">
            <el-button size="mini" type="info" @click="_checkDetail( scope.row,scope.$index)">查看</el-button>
            <el-button size="mini" type="primary" @click="_doEditor( scope.row,scope.$index)">编辑</el-button>
            <el-button size="mini" type="danger" @click="_serviceLimited(scope.row,scope.$index )">服务权限</el-button>
            <el-button size="mini" type="danger" @click="_benefit_setting( scope.row,scope.$index)">分成比例</el-button>
            <el-button plain size="mini" type="warning" @click="_resetPassword( scope.row,scope.$index)">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--table 表单结束-->
      <div class="self-page-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchParams.currentPage" :page-sizes="[10,20]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
      <!--医生详情弹窗-->
      <el-dialog title="详细信息" :visible.sync="detailINfo.isShowDialog">
        <el-row :gutter="20">
          <el-col :span="6" style="text-align: right">
            <strong class="title-note">角色：</strong>
          </el-col>
          <el-col :span="18">
            <span class="title-note">{{detailINfo.roleName}}</span>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6" style="text-align: right">
            <strong class="title-note">所属机构：</strong>
          </el-col>
          <el-col :span="18">
            <span class="title-note">{{detailINfo.instituionName}}</span>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6" style="text-align: right">
            <strong class="title-note">用户姓名：</strong>
          </el-col>
          <el-col :span="18">
            <span class="title-note">{{detailINfo.name}}</span>
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
            <span class="title-note">{{detailINfo.username}}</span>
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
        <el-row :gutter="20">
          <el-col :span="6" style="text-align: right">
            <strong class="title-note">授权服务项目：</strong>
          </el-col>
          <el-col :span="18">
            <div v-if="detailINfo.doctorServices.length > 0" class="service-label-box">
              <label v-for="(item,index) in detailINfo.doctorServices" :key="index" class="service-label">
                <input type="checkbox" checked disabled>{{item.serviceName}}
              </label>
            </div>
            <span v-else class="title-note">暂未设置</span>
          </el-col>
        </el-row>
        <div class="btn-row">
          <el-button size="small" type="primary" @click="closeDialog('detailINfo')">关闭</el-button>
        </div>
      </el-dialog>
      <!--增加医生弹窗-->
      <el-dialog title="增加信息" :visible.sync="addINfo.isShowDialog">
        <el-row :gutter="20" class="m_b_15">
          <el-col :span="6" style="text-align: right">
            <strong class="title-note">角色：</strong>
          </el-col>
          <el-col :span="8">
            <el-select v-model="addINfo.roleId" clearable placeholder="请选择角色">
              <el-option v-for="item in getDoctorRolesList" :key="item.roleId" :label="item.roleName" :value="item.roleId">
              </el-option>
            </el-select>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="m_b_15">
          <el-col :span="6" style="text-align: right">
            <strong class="title-note">所属机构：</strong>
          </el-col>
          <el-col :span="8">

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
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6" style="text-align: right">
            <strong class="title-note">用户姓名：</strong>
          </el-col>
          <el-col :span="8">
            <el-input v-model="addINfo.name" placeholder="姓名"></el-input>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6" style="text-align: right">
            <strong class="title-note">手机号：</strong>
          </el-col>
          <el-col :span="8">
            <el-input v-model="addINfo.mobile" placeholder="手机号"></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6" style="text-align: right">
            <strong class="title-note">用户账号：</strong>
          </el-col>
          <el-col :span="8">
            <el-input v-model="addINfo.username" placeholder="用户账号"></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6" style="text-align: right">
            <strong class="title-note">用户密码：</strong>
          </el-col>
          <el-col :span="8">
            <el-input v-model="addINfo.password" placeholder="用户密码"></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6" style="text-align: right">
            <strong class="title-note">用户排序：</strong>
          </el-col>
          <el-col :span="8">
            <el-input v-model="addINfo.sort" placeholder="用户排序"></el-input>
          </el-col>
        </el-row>
        <div class="btn-row">
          <el-button size="small" type="primary" @click="_upDataAddDoctor">确定</el-button>
          <el-button size="small" type="primary" @click="closeDialog('addINfo')">取消</el-button>
        </div>
      </el-dialog>
      <!--编辑医生弹窗-->
      <el-dialog title="编辑信息" :visible.sync="editorINfo.isShowDialog">
        <el-row :gutter="20" class="m_b_15">
          <el-col :span="6" style="text-align: right">
            <strong class="title-note">用户姓名：</strong>
          </el-col>
          <el-col :span="8">
            <span class="title-note">{{editorINfo.name}}</span>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="m_b_15">
          <el-col :span="6" style="text-align: right">
            <strong class="title-note">手机号：</strong>
          </el-col>
          <el-col :span="8">
            <el-input v-model="editorINfo.mobile" placeholder="手机号"></el-input>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="m_b_15">
          <el-col :span="6" style="text-align: right">
            <strong class="title-note">用户账号：</strong>
          </el-col>
          <el-col :span="8">
            <span class="title-note">{{editorINfo.username}}</span>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="m_b_15">
          <el-col :span="6" style="text-align: right">
            <strong class="title-note">角色：</strong>
          </el-col>
          <el-col :span="8">
            <el-select v-model="editorINfo.roleId" clearable placeholder="请选择角色" disabled >
              <el-option v-for="item in getDoctorRolesList" :key="item.roleId" :label="item.roleName" :value="item.roleId">
              </el-option>
            </el-select>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="m_b_15">
          <el-col :span="6" style="text-align: right">
            <strong class="title-note">所属机构：</strong>
          </el-col>
          <el-col :span="8">
            <el-autocomplete class="auto-select"
                             popper-class="my-autocomplete"
                             v-model="editorINfo.institutionName"
                             :fetch-suggestions="querySearch"
                             placeholder="请输入内容"
                             @select="handleSelectEditor">
              <template slot-scope="{ item }">
                <div class="name">{{ item.institutionName }}</div>
              </template>
            </el-autocomplete>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6" style="text-align: right">
            <strong class="title-note">用户排序：</strong>
          </el-col>
          <el-col :span="8">
            <el-input v-model="editorINfo.sort" placeholder="用户排序"></el-input>
          </el-col>
        </el-row>
        <div class="btn-row">
          <el-button size="small" type="primary" @click="updataEditor()">保存</el-button>
          <el-button size="small" type="primary" @click="closeDialog('editorINfo')">取消</el-button>
        </div>
      </el-dialog>
      <!--服务权限弹窗-->
      <el-dialog title="服务权限--医生" :visible.sync="limitedSetting.isShowDialog">
        <el-row :gutter="20" class="m_b_15">
          <el-col :span="6" style="text-align: right">
            <strong class="title-note">开通服务：</strong>
          </el-col>
          <el-col :span="18">
            <div v-if="limitedSetting.serviceSetStateAndStatusDTOS.length > 0" class="service-label-box">
              <label v-for="(item,index) in limitedSetting.serviceSetStateAndStatusDTOS" :key="index" class="service-label">
                <input type="checkbox" v-model="item.serviceStatus">{{item.serviceName}}
              </label>
            </div>
          </el-col>
        </el-row>

        <div class="btn-row">
          <el-button size="small" type="primary" @click="saveServiceFn">确定</el-button>
          <el-button size="small" type="primary" @click="closeDialog('limitedSetting')">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import headerTop from '@/components/headTop.vue';
import { mapGetters } from "vuex";
import { getDoctorList,updataDoctorEditor,getAllService,setService,restPassword,addDoctor,ERR_OK} from "@/api/api.js";
var mbTest = /^(13|14|15|18|17)[0-9]{9}$/;
export default {
  data(){
    return{
      //数据总条数
      totalCount:0,

      //医生列表数据
      doctorList:[],

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

      //编辑数据
      editorINfo:{
        isShowDialog:false,//是否显示dialog
        email: "",
        insDoctorId: "",
        insServiceSettingIds: [],
        insServiceSettingNames: [],
        institutionId: "",
        institutionName: "",
        mobile: "",
        name:"",
        password: "",
        roleId:"",
        status: 0,
        userId: 0,
        username: "",
        sort: 1
      },

      //新增的参数
      addINfo:{
        isShowDialog:false,//是否显示dialog
        institutionId: "",
        institutionName: "",
        mobile: "",
        name: "",//用户姓名
        password: "",
        roleId: "",
        sort: "1",
        username: ""//用户账号
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

      //服务权限
      limitedSetting:{
        isShowDialog:false,//是否显示dialog
        // sort:'',
        institutionId:'',
        insDoctorId:'',
        serviceSetStateAndStatusDTOS:[]
      },
    }
  },

  methods:{
    //自带搜索组件选中
    handleSelect(item) {
      this.searchParams.institutionName=item.institutionName;
      this.searchParams.institutionId=item.institutionId
    },

    handleSelectAdd(item) {
      this.addINfo.institutionName=item.institutionName;
      this.addINfo.institutionId=item.institutionId
    },
    handleSelectEditor(item) {
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

    //点击搜索
    doSearch(){
      this.searchParams.currentPage=1;
      this.getDoctorListsFn();
    },

    //获取医生列表
    getDoctorListsFn(){
      var params={
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

    handleSizeChange(val){
      this.searchParams.pageSize=val;
      this.getDoctorListsFn()
    },

    handleCurrentChange(val){
      this.searchParams.currentPage=val;
      this.getDoctorListsFn()
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
        institutionId:this.addINfo.institutionId,
        mobile:this.addINfo.mobile,
        name: this.addINfo.name,
        password:this.addINfo.password,
        roleId:this.addINfo.roleId,
        sort:this.addINfo.sort,
        username: this.addINfo.username//用户账号
      };
      if(!params.roleId){
        this.$alert("请选择角色", '提示', {
          confirmButtonText: '确定',
        });
        return;
      }
      if(!params.institutionId){
        this.$alert("请选择机构", '提示', {
          confirmButtonText: '确定',
        });
        return;
      }
      if(!params.name){
        this.$alert("请输入用户姓名", '提示', {
          confirmButtonText: '确定',
        });
        return;
      }
      if(!params.mobile){
        this.$alert("请输入手机号", '提示', {
          confirmButtonText: '确定',
        });
        return;
      }
      if(!mbTest.test(params.mobile)){
        this.$alert("手机号格式不正确", '提示', {
          confirmButtonText: '确定',
        });
        return;
      }
      if(!params.username){
        this.$alert("请输入用户账号", '提示', {
          confirmButtonText: '确定',
        });
        return;
      }
      if(!params.password){
        this.$alert("请输入用户密码", '提示', {
          confirmButtonText: '确定',
        });
        return;
      }
      if(!params.sort){
        this.$alert("请输入排序", '提示', {
          confirmButtonText: '确定',
        });
        return;
      }
      addDoctor(params).then(res => {
        if(res.code===ERR_OK){
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.addINfo.isShowDialog=false;
          this.getDoctorListsFn();
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

    //点击查看
    _checkDetail:function (item) {
      this.detailINfo.isShowDialog=true;//显示dialog
      this.detailINfo.instituionName=item.instituionName;
      this.detailINfo.roleName=item.roleName;
      this.detailINfo.name=item.name;
      this.detailINfo.mobile=item.mobile;
      this.detailINfo.username=item.username;
      this.detailINfo.sort=item.sort;
      this.detailINfo.doctorServices=item.doctorServices;
    },

    //点击编辑
    _doEditor:function (item) {


      this.editorINfo.isShowDialog=true;
      this.editorINfo.institutionId=item.institutionId;//所属机构id
      this.editorINfo.institutionName=item.instituionName;//所属机构name
      this.editorINfo.roleId=item.roleId;//角色id
      this.editorINfo.name=item.name;//医生姓名
      this.editorINfo.mobile=item.mobile;//手机号
      this.editorINfo.username=item.username;//用户账号
      this.editorINfo.sort=item.sort;//排序
      this.editorINfo.userId=item.userId;//排序
      this.editorINfo.doctorServices=item.doctorServices;//医生的服务
      this.editorINfo.insDoctorId=item.insDoctorId;//医生的id

      console.log(this.editorINfo.institutionName)
    },

    //保存编辑
    updataEditor:function(){
      var params={
        email:this.editorINfo.email,
        insDoctorId:this.editorINfo.insDoctorId,
        insServiceSettingIds:this.editorINfo.insServiceSettingIds,
        insServiceSettingNames:this.editorINfo.insServiceSettingNames,
        institutionId:this.editorINfo.institutionId,
        mobile:this.editorINfo.mobile,
        name:this.editorINfo.name,
        password:this.editorINfo.password,
        roleId:this.editorINfo.roleId,
        status:this.editorINfo.status,
        userId:this.editorINfo.userId,
        username:this.editorINfo.username,
        sort:this.editorINfo.sort,
      };

      updataDoctorEditor(params).then(res => {
        if(res.code===ERR_OK){
          this.editorINfo.isShowDialog=false;
          this.$alert('保存成功', '提示', {
            confirmButtonText: '确定',
              callback: action => {
                this.getDoctorListsFn();
              }
          },)

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


    //点击服务权限
    _serviceLimited:function (item) {
      this.limitedSetting.institutionId=item.institutionId;
      this.limitedSetting.insDoctorId=item.insDoctorId;
      var params={
        id:item.insDoctorId
      };
      getAllService(params).then(res => {
        if(res.code===ERR_OK){
          this.limitedSetting.isShowDialog=true;
          if(res.data){
            this.limitedSetting.serviceSetStateAndStatusDTOS.length=0;
            res.data.data.forEach(item =>{
              var obj={
                serviceId:item.serviceId,
                serviceName:item.serviceName,
                serviceStatus:item.serviceStatus===1 ? true : false,
              };
              this.limitedSetting.serviceSetStateAndStatusDTOS.push(obj);
            })
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

    //保存服务权限设置
    saveServiceFn(){
      var arr=[];
      this.limitedSetting.serviceSetStateAndStatusDTOS.forEach(item =>{
        var obj={};
        if(item.serviceStatus){
          obj={
            serviceId:item.serviceId,
            serviceName:item.serviceName,
            serviceStatus:1,
          };
        }else{
          obj={
            serviceId:item.serviceId,
            serviceName:item.serviceName,
            serviceStatus:0,
          };
        }
        arr.push(obj);
      });
      var params={
        insDoctorId:this.limitedSetting.insDoctorId,
        institutionId:this.limitedSetting.institutionId,
        serviceSetStateAndStatusDTOS:arr
      };
      setService(params).then(res => {
        if(res.code===ERR_OK){
          this.limitedSetting.isShowDialog=false;
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.getDoctorListsFn();
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

    //点击分成比例跳转
    _benefit_setting:function (item) {
      var id=item.insDoctorId,userId=item.userId;
      this.$router.push({ path: `/benefitList/${id}/${userId}`})
    },

    //点击重置密码
    _resetPassword:function (item) {
        this.$confirm('确定要重置密码吗？')
          .then(_ => {
            var params={
              id: item.userId
            };
            restPassword(params).then(res => {
              if(res.code===ERR_OK){
                this.$message({
                  message: '操作成功',
                  type: 'success'
                });
              }else{
                this.$message.error('操作失败');
              }
            }).catch(err => {
              this.$alert(err.msg, '提示', {
                confirmButtonText: '确定',
              })
            })
          })

    },
  },


  activated: function(){
    this.getDoctorListsFn()
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
</style>
