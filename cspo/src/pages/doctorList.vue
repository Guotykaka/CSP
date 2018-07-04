<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">


      <!--操作行-->
      <el-row :gutter="20">
        <el-col :span="5">
          <el-input v-model="searchParams.name" placeholder="姓名"></el-input>
        </el-col>
        <el-col :span="5">
          <el-input v-model="searchParams.mobile" placeholder="手机号"></el-input>
        </el-col>
        <el-col :span="5">
          <el-select v-model="searchParams.roleId" placeholder="请选择角色">
            <el-option
              v-for="item in doctorRolesList"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="5">
          <el-select v-model="searchParams.institutionId" placeholder="请选择所属机构">
            <el-option
              v-for="item in institutionArr"
              :key="item.institutionId"
              :label="item.institutionName"
              :value="item.institutionId">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="4">
          <el-button type="primary">搜索</el-button>
        </el-col>
      </el-row>

      <!--新增-->
      <el-row class="m_b_15">
        <el-button type="primary">新增</el-button>
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
            <el-button size="mini" type="info" @click="_checkDetail(scope.$index, scope.row)">查看</el-button>
            <el-button size="mini" type="primary" @click="_doEditor(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="_serviceLimited(scope.$index, scope.row)">服务权限</el-button>
            <el-button size="mini" type="danger" @click="_benefit_setting(scope.$index, scope.row)">分成比例</el-button>
            <el-button plain size="mini" type="warning" @click="_resetPassword(scope.$index, scope.row)">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--table 表单结束-->



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
          <el-button size="small" type="primary" @click="_closeCheckDialog">关闭</el-button>
        </div>

      </el-dialog>



    </div>
  </div>

</template>


<script>

import headerTop from '@/components/headTop.vue'
export default {




  data(){
    return{
      //医生列表数据
      doctorList:[
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







    //显示不同的操作状态  1 列表  2新增  3编辑 4查看医生 5分成比例
      showStatus:1,

      //医生角色列表
      doctorRolesList:[
        {roleId:4,roleCode:"123",roleName:"医生角色",remark:"医生角色账号设置",deptId:11,deptName:null,menuIdList:null,deptIdList:null,createTime:"2018-06-22 11:41:55",roleType:"0"},
        {roleId:29,roleCode:"003",roleName:"健管师",remark:"健管部门",deptId:11,deptName:null,menuIdList:null,deptIdList:null,createTime:"2018-06-22 16:00:33",roleType:"1,0"},
        {roleId:30,roleCode:"004",roleName:"医生主任",remark:"医生主任",deptId:null,deptName:null,menuIdList:null,deptIdList:null,createTime:"2018-06-20 17:01:31",roleType:"0"},
        {roleId:32,roleCode:"sy-js",roleName:"邵勇-角色",remark:"邵勇-角色",deptId:null,deptName:null,menuIdList:null,deptIdList:null,createTime:"2018-07-02 16:58:57",roleType:"0"},
        {roleId:37,roleCode:564,roleName:567,remark:"风帆股份给黑",deptId:null,deptName:null,menuIdList:null,deptIdList:null,createTime:"2018-06-29 09:31:33",roleType:"1,0"}
      ],

      //机构列表信息
      institutionArr:[
        {institutionId:"2c8080aa63de10dc0163de10dc250000",institutionCode:"55555",institutionName:"上海宝杉科技",institutionAddr:"上海",institutionGradeId:"1",institutionLavelId:"2",institutionExtensionUrl:null,qrCodeUrl:null,extensionLogoUrl:null,extensionImageUrl:null,whetherAppShow:0,whetherOpenMsm:0,whetherHasPdfReport:0,medicalExamReportLogo:null,bannerLogo:null,bannerExtensionUrl:null,institutionDesc:null,whetherDelete:0,createTime:"2018-06-08 14:23:56",lastUpdateTime:null,createUser:"1",updateUser:null,registeredReservationAddr:null,gradeName:null,lavelName:null},
        {institutionId:"2c8080aa63de6dd90163de6dd92b0000",institutionCode:"hzsj002",institutionName:"上海天意达公司",institutionAddr:"上海",institutionGradeId:"1",institutionLavelId:"4",institutionExtensionUrl:null,qrCodeUrl:null,extensionLogoUrl:null,extensionImageUrl:null,whetherAppShow:1,whetherOpenMsm:0,whetherHasPdfReport:0,medicalExamReportLogo:null,bannerLogo:null,bannerExtensionUrl:null,institutionDesc:null,whetherDelete:0,createTime:"2018-06-08 16:05:31",lastUpdateTime:"2018-06-08 17:32:22",createUser:"1",updateUser:"1",registeredReservationAddr:null,gradeName:null,lavelName:null},
        {institutionId:"2c8080aa63de6dd90163de9081540002",institutionCode:"666",institutionName:"666",institutionAddr:"666",institutionGradeId:"1",institutionLavelId:"2",institutionExtensionUrl:null,qrCodeUrl:null,extensionLogoUrl:null,extensionImageUrl:null,whetherAppShow:0,whetherOpenMsm:0,whetherHasPdfReport:0,medicalExamReportLogo:null,bannerLogo:null,bannerExtensionUrl:null,institutionDesc:null,whetherDelete:0,createTime:"2018-06-08 16:43:22",lastUpdateTime:null,createUser:"1",updateUser:null,registeredReservationAddr:null,gradeName:null,lavelName:null},
      ],

      //搜索参数
      searchParams:{
        page:1,//页码
        limit: 10,//
        institutionId:"",
        mobile: null,
        roleId:"",
        name:null
      },

      editorINfo:{
        email: "",
        insDoctorId: "",
        insServiceSettingIds: [],
        insServiceSettingNames: [],
        institutionId: "",
        mobile: "",
        name:"",
        password: "",
        roleId: 0,
        status: 0,
        userId: 0,
        username: "",
        sort: 1
      },

      //新增的参数
      addINfo:{
        email: "",
        insDoctorId: "",
        insServiceSettingIds: [],
        insServiceSettingNames: [],
        institutionId: "-1",
        mobile: "",
        name: "",
        password: "",
        roleId: "-1",
        status: 0,
        userId: 0,
        username: "",
        sort: 1
      },
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

      limitedSetting:{
        // sort:'',
        institutionId:'',
        insDoctorId:'',
        serviceSetStateAndStatusDTOS:[]
      },

      //分成数据
      benefitData:{
        showModel:false,
        list:[],
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
        takeEffectTime:"",
        proportions:"",
        providerServiceUserType:1
      }
    }
  },

  methods:{



    //点击查看
    _checkDetail:function (index,item) {
      this.detailINfo.isShowDialog=true;
      this.detailINfo.instituionName=item.instituionName;
      this.detailINfo.roleName=item.roleName;
      this.detailINfo.name=item.name;
      this.detailINfo.mobile=item.mobile;
      this.detailINfo.username=item.username;
      // this.detailINfo.password=item.password;
      this.detailINfo.sort=item.sort;
      this.detailINfo.doctorServices=item.doctorServices;
    },

    //点击关闭查看的dialog
    _closeCheckDialog:function(){

      this.detailINfo.isShowDialog=false;
    },






    //点击编辑
    _doEditor:function (index,item) {

    },

    //点击服务权限
    _serviceLimited:function (index,item) {

    },


    //点击分成比例
    _benefit_setting:function (index,item) {

    },


    //点击重置密码

    _resetPassword:function (index,item) {

    }
  },

  components:{
    headerTop
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
</style>
