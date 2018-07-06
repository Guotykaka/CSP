import Vue from 'vue'
import Vuex from 'vuex'
import {api} from '@/api/api';
//import {getAdminInfo} from '@/api/getData'

Vue.use(Vuex)

//引入axios

const state = {
  isLoading:false,//缓冲
  navTitle:'首页',//导航栏文字
  detailShow:null,//系统公告详情
  msgList:{data:null},//消息列表数据
};


const getters={
  isLoading:state => state.isLoading,//缓冲
  navTitle:state=> state.navTitle,
  detailShow:state=> state.detailShow,//系统公告详情
  msgList:state=> state.msgList,//系统公告详情
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
  getMsgList(state,url,params){
    api.countUserNewsList(url,params).then((res)=>{
      let data = res.data;
      state.msgList = data;
    }).catch((res)=>{
      alert(res.data)
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
  msgList(context,url,params){
    context.commit('getMsgList',url,params )
  }
}


export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})
