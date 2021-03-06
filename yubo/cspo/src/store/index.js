import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const state = {
  use_name:"huihui",
  use_avatar:"",

  unReadNewsList:[],//未读消息列表
  //医生角色列表
  doctorRolesList:[],
  institutionArr:[],  //机构列表信息(订单列表作废)
/*  refundDetail:{},//退款列表订单信息(订单列表作废)
  customerDetail:{},//订单列表信息(订单列表作废)
  refuseOrderInfo:{},//退款订单详情*/
};
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
  //获取未读消息列表
  getUnReadList:function(state){
    return state.unReadNewsList
  },
  getUnReadSum:function(state){
    let count=0;
    state.unReadNewsList.forEach(item =>{
      count+=parseInt(item.unReadCount)
    });
    return count;
  },
/*  refundDetail:state=>state.refundDetail,//退款详情---订单信息
  customerDetail:state=>state.customerDetail,//订单列表信息
  //获取退款订单详情
  getRefuseInfo(state){
    return state.refuseOrderInfo;
  }*/
};


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

    state.doctorRolesList=lists;
  },
  //设置机构列表
  setInstitutionArr:function (state,lists) {
    state.institutionArr=lists
  },
  //设置未读消息列表
  setUnReadNewsList(state,arr){
    state.unReadNewsList=arr;
  },
  //设置未读消息为0
  setUnReadListZero(state,index){
    state.unReadNewsList[index].unReadCount=0
  },
  //设置退款详情
/*  setRefuseInfo(state,info){
    state.refuseOrderInfo=info;
  },*/
/*  //退款详情--订单信息
  refundDetail(state,val){
    state.refundDetail = val;
  },
  //订单列表信息
  customerDetail(state,val){
    state.customerDetail = val;
  }*/
};

const actions = {
/*  getRefundDetail({commit},val){
    commit('refundDetail',val)
  },
  getCustomerDetail({commit},val){
    commit('customerDetail',val)
  }*/
};

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions

})
