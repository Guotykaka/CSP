import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const state = {
  use_name:"huihui",
  use_avatar:""
}


const getters={
  getUseName:function (state) {
    return state.use_name
  },
  getUseAvatar:function (state) {
    return state.use_avatar
  }
}


const mutations = {

  setUseName:function (state, newName) {
    state.use_name = newName
  },

  setUseAvatar:function (state,newAvatar) {
    state.use_avatar=newAvatar
  }


}



export default new Vuex.Store({
  state,
  mutations,
  getters

})
