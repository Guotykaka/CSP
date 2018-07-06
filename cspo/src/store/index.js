import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const state = {
  use_name:"huihui",
  use_avatar:"",

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
    {bannerExtensionUrl: null,bannerLogo: null, createTime: "2018-07-05 16:15:15", createUser: "1", extensionImageUrl:null,extensionLogoUrl: null, gradeName: null, institutionAddr: "上海市静安区", institutionCode: "hzhz001", institutionDesc: null, institutionExtensionUrl: null, institutionGradeId: "1", institutionId: "2c9081626469807001646982779c0001", institutionLavelId: "6", institutionName: "上海公立医院", lastUpdateTime: null, lavelName: null, medicalExamReportLogo: null, qrCodeUrl: null, registeredReservationAddr: null, updateUser: null, whetherAppShow: 1, whetherDelete: 0, whetherHasPdfReport: 0, whetherOpenMsm: 0}

  ],
}


const getters={

  //获取用户名
  getUseName:function (state) {
    return state.use_name
  },
  //获取头像
  getUseAvatar:function (state) {
    return state.use_avatar
  },

  //获取医生角色列表
  getDoctorRolesList:function (state) {
    return state.doctorRolesList
  },

  //获取机构列表
  getInstitutionArr:function (state) {
    return state.institutionArr
  }

}


const mutations = {

  //设置用户名
  setUseName:function (state, newName) {
    state.use_name = newName
  },
  //设置头像
  setUseAvatar:function (state,newAvatar) {
    state.use_avatar=newAvatar
  },


  //设置医生角色列表
  setDoctorRolesList:function (state,lists) {
    state.doctorRolesList.length=0;
    state.doctorRolesList.concat(lists)
  },

  //设置机构列表
  setInstitutionArr:function (state,lists) {
    state.institutionArr.length=0;
    state.institutionArr.concat(lists)
  }
}



export default new Vuex.Store({
  state,
  mutations,
  getters

})
