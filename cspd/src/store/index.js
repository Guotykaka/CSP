import Vue from 'vue'
import Vuex from 'vuex'
import {
  ERR_OK,
  countUserNewsList,
  getApplyInfo
} from '@/api/api.js';

Vue.use(Vuex)

//引入axios

const state = {
  isLoading:false,//缓冲
  detailShow:null,//系统公告详情
  msgList:[],//消息列表数据,
  areaImg:''//用户头像
};


const getters={
  isLoading:state => state.isLoading,//缓冲
  detailShow:state=> state.detailShow,//系统公告详情
  msgList:state=> state.msgList,//系统公告详情
  areaImg:state=> state.areaImg,//系统公告详情
};
const mutations = {
  /*缓冲*/
  updateLoadingState(state,flag){
    state.isLoading=flag
  },
//  系统公告详情
  getDetail(state,value){
    state.detailShow = value;
  },
//  消息列表数据
  getcountUserNewsList(state,params){
    countUserNewsList(params).then((res)=>{
      if(res.code===ERR_OK){
        state.msgList = res.data;
      }
    })
  },
//  用户头像
  getApplyInfoImg(state,params){
    getApplyInfo(params).then((res)=>{
      if(res.code===ERR_OK&&res.data){
        state.areaImg = res.data.logoUrl;
      }
    })
  }

};

const actions={
  /*缓冲*/
  onLoading(context,flag){
    context.commit("updateLoadingState",flag);
  },
/*  系统公告详情*/
  detailShow(context,flag){
    context.commit('getDetail',flag);
  },
  /*消息列表数据*/
  msgList(context,params){
    context.commit('getcountUserNewsList',params )
  },
  /*消息列表数据*/
  getAreaImg(context,params){
    context.commit('getApplyInfoImg',params )
  }
}


export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})
