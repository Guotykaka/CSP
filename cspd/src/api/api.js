import Vue from 'vue'
import axios from 'axios' // 所有数据api的域名地址'
let qs = require('qs')
export const api ={
  server(url,param){
    return axios({
      method:"POST",
      url:url,
      data:param
    })
  },
  //图文咨询相关请求
  getOrderNumber(url,param){
    return axios({
      method:"POST",
      url:url,
      data:param
    })
  },
  list(url,param){
    return axios({
      method:"POST",
      url:url,
      data:param
    })
  },
  queryInsConsultChatList(url,param){
    return axios({
      method:"POST",
      url:url,
      data:param
    })
  },
  countUnReadMsgByOrderStatus(url,param){
    return axios({
      method:"POST",
      url:url,
      data:param
    })
  },
  queryTradeDetail(url,param){
    return axios({
      method:"POST",
      url:url,
      data:param
    })
  }


};
