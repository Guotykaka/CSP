import Vue from 'vue'
import Vuex from 'vuex'
//import {getAdminInfo} from '@/api/getData'

Vue.use(Vuex)

//引入axios

const state = {
  count:0,
  navTitle:'首页',//导航栏文字
  detailShow:{},//系统公告详情
};


const getters={
  getcount:function (state) {
    return state.count
  },
  navTitle:state=> state.navTitle,
  detailShow:state=> state.detailShow,//系统公告详情
};
const mutations = {
  add(state){
    state.count++;
  },

  minus:function (state) {

    state.count--;

  }
};

const actions={
 /* increment:function (context) {
    context.commit('add')
  }*/
    actionA({ dispatch, commit }) {
      return commit('add');
    },



}


export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})
