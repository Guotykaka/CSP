import Vue from 'vue'
import axios from 'axios' // 所有数据api的域名地址'
let qs = require('qs')
function apipost(url,params){
  return axios({
    method:"post",
    url:url,
    data:params
  })
}
function apiget(url,params){
  return axios({
    method:"get",
    url:url,
    data:params
  })
}
export const api ={
  /*菜单栏start*/
  nav(url,param){
    return axios({
      method:"Get",
      url:url,
      data:param
    })
  },
  server(url,param){
    return axios({
      method:"POST",
      url:url,
      data:param
    })
  },
  /*菜单栏end*/
  /*首页数据请求start*/
  countUserNewsList(url,param){
    return apiget(url,param)
  },
  getSysNoticeInfo(url,param){
    return apiget(url,param)
  },
  /*首页数据请求end*/
  //图文咨询相关请求start
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
  },
  //图文咨询相关请求start
  /*系统公告*/
  getDictionaryByKey(url,params){
    return apipost(url,params);
  },
  noticeTitleQuery(url,params){
    return apiget(url,params);
  }
};
