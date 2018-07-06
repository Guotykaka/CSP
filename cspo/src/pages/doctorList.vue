<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">

      <!--医生列表块-->
      <div v-show="showStatus===1">
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
            <el-select v-model="searchParams.institutionId" clearable placeholder="请选择所属机构">
              <el-option v-for="item in getInstitutionArr" :key="item.institutionId" :label="item.institutionName" :value="item.institutionId"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="_doSearch">查询</el-button>
          </el-form-item>
        </el-form>

        <!--新增-->
        <el-row class="m_b_15">
          <el-button type="primary" @click="_addItem">新增</el-button>
        </el-row>

        <!--table 表单开始-->
        <el-table
          :data="doctorList"
          border
          style="width: 100%">
          <el-table-column prop="name" label="用户名"  width="100"></el-table-column>
          <el-table-column prop="mobile" label="手机号"></el-table-column>
          <el-table-column prop="username" label="用户账号" width="100"></el-table-column>
          <el-table-column prop="roleName" label="角色" width="100"></el-table-column>
          <el-table-column prop="creatTime" label="创建日期"></el-table-column>
          <el-table-column prop="instituionName" label="所属机构" width="100"></el-table-column>
          <el-table-column prop="doctorServiceSettingString" label="开通服务" width="100"></el-table-column>
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
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchParams.page" :page-sizes="[10,20]" :page-size="searchParams.limit" layout="total, sizes, prev, pager, next, jumper" :total="doctorList.length">
          </el-pagination>
        </div>
      </div>

      <!--分成比例块-->
      <div v-show="showStatus===2">
        <el-card class="box-card">
          <div slot="header" class="clear">
            <span>分成比例</span>
            <el-button type="primary" size="small" class="right" @click="showDialogBenefit">新增</el-button>
          </div>
          <div class="">

            <!--table 表单开始-->
            <el-table
              :data="benefitData.list"
              border
              :row-class-name="tableRowClassName"
              style="width: 100%">
              <el-table-column type="index" label="序号"  width="80"></el-table-column>
              <el-table-column prop="proportions" label="分成比例"></el-table-column>
              <el-table-column prop="takeEffectTime" label="生效时间"></el-table-column>
              <el-table-column prop="createTime" label="设置时间"></el-table-column>

              <el-table-column label="操作" width="100">
                <template slot-scope="scope">

                  <el-button v-if="scope.row.takeEffectStatus==1" size="mini" type="danger" @click="_deleteBenefit(scope.row,scope.$index)">删除</el-button>

                </template>
              </el-table-column>
            </el-table>
            <!--table 表单结束-->
          </div>
        </el-card>


        <div class="btn-row">
          <el-button size="small" type="primary" @click="backFn">返回</el-button>
        </div>
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
            <span v-else  class="title-note">暂未设置</span>
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
              <el-option
                v-for="item in getDoctorRolesList"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId">
              </el-option>
            </el-select>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="m_b_15">
          <el-col :span="6" style="text-align: right">
            <strong class="title-note">所属机构：</strong>
          </el-col>
          <el-col :span="8">
            <el-select v-model="addINfo.institutionId" clearable placeholder="请选择机构">
              <el-option
                v-for="item in getInstitutionArr"
                :key="item.institutionId"
                :label="item.institutionName"
                :value="item.institutionId">
              </el-option>
            </el-select>
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
            <el-select v-model="editorINfo.roleId" clearable placeholder="请选择角色">
              <el-option
                v-for="item in getDoctorRolesList"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId">
              </el-option>
            </el-select>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="m_b_15">
          <el-col :span="6" style="text-align: right">
            <strong class="title-note">所属机构：</strong>
          </el-col>
          <el-col :span="8">
            <el-select v-model="editorINfo.institutionId" clearable placeholder="请选择机构">
              <el-option
                v-for="item in getInstitutionArr"
                :key="item.institutionId"
                :label="item.institutionName"
                :value="item.institutionId">
              </el-option>
            </el-select>
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
          <el-button size="small" type="primary" @click="_upDataEditorDoctor">确定</el-button>
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
              <label v-for="(item,index) in detailINfo.doctorServices" :key="index" class="service-label">
                <input type="checkbox" checked disabled>{{item.serviceName}}
              </label>
            </div>
          </el-col>
        </el-row>

        <div class="btn-row">
          <el-button size="small" type="primary" @click="_upDataEditorDoctor">确定</el-button>
          <el-button size="small" type="primary" @click="closeDialog('limitedSetting')">取消</el-button>
        </div>
      </el-dialog>

      <!--新增分成比例dialog-->
      <el-dialog title="新增分成比例" :visible.sync="benefitData.isShowDialog">
        <el-row :gutter="20" class="m_b_15">
          <el-col :span="6" style="text-align: right">
            <strong class="title-note">财务分成比例：</strong>
          </el-col>
          <el-col :span="18">
            平台：&nbsp;机构：&nbsp;医生&nbsp;&nbsp;=&nbsp;&nbsp;
            <input type="number" class="input-benefit el-input__inner" v-model="benefitRate.platformRate"/>：&nbsp;
            <input type="number" class="input-benefit el-input__inner" v-model="benefitRate.institutionRate"/>：&nbsp;
            <input type="number" class="input-benefit el-input__inner" v-model="benefitRate.doctorRate"/>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="m_b_15">
          <el-col :span="6" style="text-align: right">
            <strong class="title-note">生效时间：</strong>
          </el-col>
          <el-col :span="18">
            <el-date-picker
              v-model="addBenefitParam.takeEffectTime"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-col>
        </el-row>

        <div class="btn-row">
          <el-button size="small" type="primary" @click="_addBenefiItem">确定</el-button>
          <el-button size="small" type="primary" @click="closeDialog('benefitData')">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>

</template>


<script>

import headerTop from '@/components/headTop.vue';
import { mapGetters } from "vuex";
//引入getDoctorList的方法
import { getDoctorList } from "@/api/api.js";


export default {
  data(){
    return{

      // 1为显示医生  2 分成比例
      showStatus:1,

      //医生列表数据
      doctorList:[
        {institutionId:"2c9081626469807001646982779c0001",doctorServiceSettingString:"电话报告解读、图文咨询",instituionName:"上海公立医院",roleId:4,mobile:"15026502683",sort:1,insDoctorId:"2c908162646a1efd01646a2f72da0004",userId:315,creatTime:"2018-07-05 19:24:12",name:"夏医生",roleName:"医生角色",
          doctorServices:[
            {insServiceSettingId:"2c908162646a1efd01646a32c9760006",insDoctorId:"2c908162646a1efd01646a2f72da0004",serviceId:"8ab2b2f56381c35a016381c35a400000",serviceName:"电话报告解读",serviceStatus:1,serviceRealStatus:1},
            {insServiceSettingId:"2c908162646a1efd01646a32c97a0007",insDoctorId:"2c908162646a1efd01646a2f72da0004",serviceId:"8ab2b2f563822d260163822d26fd0000",serviceName:"图文咨询",serviceStatus:1,"serviceRealStatus":1}
            ],
          username:"xiahuihui"},

        {institutionId:"2c8080aa63de6dd90163de96b72c0006",doctorServiceSettingString:null,instituionName:"1",roleId:29,mobile:"13567678988",sort:4564564,insDoctorId:"2c8080aa645912ad0164591596b20004",userId:313,creatTime:"2018-07-02 11:42:24",name:"newjian",roleName:"健管师",doctorServices:[],username:"newjian"},
        {institutionId:"2c8080aa63de6dd90163de96b72c0007",doctorServiceSettingString:null,instituionName:"2",roleId:30,mobile:"15927326110",sort:1,insDoctorId:"2c8080aa645912ad0164591596b20005",userId:333,creatTime:"2018-07-02 11:42:24",name:"newjian",roleName:"健管师",doctorServices:[],username:"newjian"},
        {institutionId:"2c8080aa63de6dd90163de96b72c0007",doctorServiceSettingString:null,instituionName:"3",roleId:31,mobile:"15927326333",sort:2,insDoctorId:"2c8080aa645912ad0164591596b20006",userId:121,creatTime:"2018-07-02 11:42:24",name:"newjian",roleName:"健管师",doctorServices:[],username:"newjian"},
        {institutionId:"2c8080aa63de6dd90163de96b72c0007",doctorServiceSettingString:null,instituionName:"3",roleId:31,mobile:"15927326333",sort:2,insDoctorId:"2c8080aa645912ad0164591596b20006",userId:121,creatTime:"2018-07-02 11:42:24",name:"newjian",roleName:"健管师",doctorServices:[
            {insDoctorId:"2c8080aa641bf4cd01641c05b0c90005",
              insServiceSettingId: "0000000064201ee901642050171f000d",
              serviceId:"8ab2b2f56381c35a016381c35a400000",
              serviceName:"电话报告解读",
              serviceRealStatus:1,
              serviceStatus:1
            },
            {
              insDoctorId: "2c8080aa641bf4cd01641c05b0c90005",
              insServiceSettingId: "0000000064201ee9016420501720000e",
              serviceId: "8ab2b2f563822d260163822d26fd0000",
              serviceName: "图文咨询",
              serviceRealStatus: 1,
              serviceStatus: 1
            },
          ],username:"newjian"},
      ],

      //搜索参数
      searchParams:{
        page:1,//页码
        limit: 10,//
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
        email: "",
        insDoctorId: "",
        insServiceSettingIds: [],
        insServiceSettingNames: [],
        institutionId: "",
        mobile: "",
        name: "",//用户姓名
        password: "",
        roleId: "",
        status: 0,
        userId: 0,
        username: "",//用户账号
        sort: 1
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

      //分成数据
      benefitData:{
        isShowDialog:false,
        list:[
          {insProportionsId:"2c8080aa64688e87016469232461000d",providerServiceUserId:"2c8080aa638abfff01638ac1cc8b0002",providerServiceUserType:1,proportions:"44,20,36",takeEffectTime:"2018-07-13",createTime:"2018-07-05",takeEffectStatus:"1"},
          {insProportionsId:"00000000638b8b5101638c349d580038",providerServiceUserId:"2c8080aa638abfff01638ac1cc8b0002",providerServiceUserType:1,proportions:"0,10,0",takeEffectTime:"2018-05-30",createTime:"2018-05-23",takeEffectStatus:"2"},
          {insProportionsId:"00000000638b8b5101638c331d070036",providerServiceUserId:"2c8080aa638abfff01638ac1cc8b0002",providerServiceUserType:1,proportions:"0,0,10",takeEffectTime:"2018-05-23",createTime:"2018-05-23",takeEffectStatus:"3"},
          {insProportionsId:"00000000638b8b5101638b92a5100016",providerServiceUserId:"2c8080aa638abfff01638ac1cc8b0002",providerServiceUserType:1,proportions:"3,4,3",takeEffectTime:"2018-05-22",createTime:"2018-05-23",takeEffectStatus:"3"},
          {insProportionsId:"00000000638b8b5101638b91c1f80015",providerServiceUserId:"2c8080aa638abfff01638ac1cc8b0002",providerServiceUserType:1,proportions:"1,2,7",takeEffectTime:"2018-05-16",createTime:"2018-05-23",takeEffectStatus:"3"}
        ],
        searchParam:{
          limit:10,
          page:1,
          providerServiceUserId:"",
          providerServiceUserType:1
        }
      },

      //分成比例，平台 机构 医生
      benefitRate:{
        platformRate:"",
        institutionRate:"",
        doctorRate:""
      },

      //新增分成
      addBenefitParam:{
        providerServiceUserId:"",
        takeEffectTime:"",//生效时间
        proportions:"",//分成比例拼接字符串逗号分隔
        providerServiceUserType:1 //1是医生  2 是主任 写死1
      }
    }
  },

  methods:{
    //分成比例返回
    backFn(){
      this.showStatus=1
    },

    //分页处理每页显示条数方法
    handleSizeChange(){
      console.log(444)
    },


    //当前页码变化方法
    handleCurrentChange(){
      console.log(888)
    },



    tableRowClassName({row, rowIndex}) {
      if(row.takeEffectStatus === '2'){
        return 'active'
      }else {
        return ''
      }
    },

    //公用关闭dialog
    closeDialog(argString){
      this[argString].isShowDialog=false;
    },

    //点击搜索
    _doSearch:function(){
      console.log(this.searchParams)
    },

    //点击新增显示Dialog
    _addItem:function(){
      this.addINfo.isShowDialog=true;
    },

    //点击确定增加医生
    _upDataAddDoctor:function(){
      console.log(this.addINfo)
    },

    //点击查看
    _checkDetail:function (item) {
      this.detailINfo.isShowDialog=true;//显示dialog
      console.log(item)
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
      this.editorINfo.roleId=item.roleId;//角色id
      this.editorINfo.name=item.name;//医生姓名
      this.editorINfo.mobile=item.mobile;//手机号
      this.editorINfo.username=item.username;//用户账号
      this.editorINfo.sort=item.sort;//排序
      this.editorINfo.doctorServices=item.doctorServices;//医生的服务
    },


    //保存编辑
    _upDataEditorDoctor:function(){
      console.log(this.editorINfo);
      this.editorINfo.isShowDialog=false;
    },


    //点击服务权限
    _serviceLimited:function (index,item) {
      this.limitedSetting.isShowDialog=true;

      /*
      this.limitedSetting.insDoctorId = item.insDoctorId;
      this.limitedSetting.institutionId=item.institutionId;
      var params={
        insDoctorId:item.insDoctorId
      };

      $.ajax({
        type: "POST",
        //请求所有的服务  包括状态
        url: baseURL + "sys/doctor/servicedict",
        contentType: "application/x-www-form-urlencoded",
        data: params,
        success: function(res){
          if(res.code === 1){
            console.log("服务服务");
            console.log(res)
            if(vm.isArray(res.data.data)){
              vm.limitedSetting.serviceSetStateAndStatusDTOS.length=0;
              var itemObj={};
              res.data.data.forEach(function (item) {
                itemObj={
                  serviceId:item.serviceId,
                  serviceName:item.serviceName,
                  serviceStatus:item.serviceStatus ? true : false,
                };
                vm.limitedSetting.serviceSetStateAndStatusDTOS.push(itemObj);
              })
            }else {
              alert("数据类型不对")
            }
          }else{
            alert(res.msg);
          }
        }
      });
      */

    },

    //点击分成比例
    _benefit_setting:function (index,item) {

      this.showStatus=2;

    },


    //点击重置密码
    _resetPassword:function (index,item) {

        this.$confirm('确定要重置密码吗？')
          .then(_ => {

          })
          .catch(_ => {

          });
    },

    //显示分成比例dialog
    showDialogBenefit(){
      this.benefitData.isShowDialog=true;
    },


    //增加分成比例
    _addBenefiItem(){


      console.log(this.benefitRate)


    },

    //删除分成
    _deleteBenefit(item){
      this.$confirm('确定要删除吗？')
        .then(_ => {

        })
        .catch(_ => {

        });
      console.log(item)
    }

  },


  created(){

    this.$nextTick(function () {

      getDoctorList()

    })

  },



  components:{
    headerTop
  },

  computed:{
    ...mapGetters(['getDoctorRolesList','getInstitutionArr'])
  }


}
</script>

<style lang="less" scoped>
  .el-select{display: block}
  .el-input{margin-bottom: 15px;}
  .el-button--mini{padding: 7px 10px}

  .title-note{line-height: 40px;}
  .btn-row{text-align:center;padding-top: 20px;}
  .service-label-box{padding-top: 12px;line-height: 18px;}
  .service-label{padding: 0 5px 0 3px}
  .service-label input[type='checkbox']{margin:3px 3px 0 0;display:inline-block;vertical-align: top;}
  .input-benefit{display: inline-block;width: 100px}
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button{-webkit-appearance: none;}
  input[type="number"]{-moz-appearance: textfield;}
</style>
