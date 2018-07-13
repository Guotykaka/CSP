import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const state = {
  use_name:"huihui",
  use_avatar:"",

  unReadMsgCount:0,//未读消息数
  //医生角色列表
  doctorRolesList:[
    {roleId:4,roleCode:"123",roleName:"医生角色",remark:"医生角色账号设置",deptId:11,deptName:null,menuIdList:null,deptIdList:null,createTime:"2018-06-22 11:41:55",roleType:"0"},
    {roleId:29,roleCode:"003",roleName:"健管师",remark:"健管部门",deptId:11,deptName:null,menuIdList:null,deptIdList:null,createTime:"2018-06-22 16:00:33",roleType:"1,0"},
    {roleId:30,roleCode:"004",roleName:"医生主任",remark:"医生主任",deptId:null,deptName:null,menuIdList:null,deptIdList:null,createTime:"2018-06-20 17:01:31",roleType:"0"},
    {roleId:32,roleCode:"sy-js",roleName:"邵勇-角色",remark:"邵勇-角色",deptId:null,deptName:null,menuIdList:null,deptIdList:null,createTime:"2018-07-02 16:58:57",roleType:"0"},
    {roleId:37,roleCode:564,roleName:567,remark:"风帆股份给黑",deptId:null,deptName:null,menuIdList:null,deptIdList:null,createTime:"2018-06-29 09:31:33",roleType:"1,0"}
  ],

  //机构列表信息
  institutionArr:[],
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
  },

  //获取未读消息数
  getUnReadCount(state){
    return state.unReadMsgCount
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
    state.institutionArr=lists
  },

  //设置未读消息数
  setUnReadCount(state,countNum){
    state.unReadMsgCount=countNum;
  }
}



export default new Vuex.Store({
  state,
  mutations,
  getters

})
