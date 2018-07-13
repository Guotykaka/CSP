import {get,post} from "./http.js";

import {baseUrl,baseImgPath} from "../config/env";
import * as urls from '@/config/env.js'


//登录
export function login(data) {
  return post(baseUrl+'/sys/login',data);
}
//系统管理
//角色列表
export function getListWithNoParam(params){//获取列表
  return post(urls.API_POST_LIST_WITH_NOPARAM,params)
}
export function PostSaveRole(params){//新增角色
  return post(urls.API_POST_SAVE_ROLE,params)
}
export function PostUpdateRole(params){//修改角色
  return post(urls.API_POST_UPDATE_ROLE,params)
}
export function PostDeleteRole(params){//删除角色
  return post(urls.API_POST_DELETE_ROLE,params)
}
//医生管理
//获取医生列表
export function getDoctorList(params) {
  return post(urls.API_POST_LIST_DOCTOR,params);
}
//修改医生信息
export function postDoctorSave(params) {
  return post(urls.API_POST_SAVE_DOCTOR,params);
}



//退款列表
export function getListOrderRefund(params){
  return post(urls.API_GET_LIST_ORDER_REFUND,params)
}



export const api ={
  /*个人中心*/
  queryInsLeaveWordList(data){
    return post(urls.API_QUERY_INSLEAVE_WORDLIST,data);//获取聊天数据
  },
  queryInsLeaveWordAnswerList(data){
    return post(urls.API_QUERY_INSLEAVE_WORD_ANSWER_LIST,data);//查看回复数据
  },
  /*订单列表*/
  listServiceDict(data){
    return get(urls.API_LIST_SERVICE_dict,data);//获取聊天数据
  },
  tradeList(data){
    return post(urls.API_TRADE_LIST,data);//查看回复数据
  },
  cspOrderList(data){
    return post(urls.API_CSP_ORDER_LIST,data);//获取聊天数据
  },
  tradeInfo(data){
    return post(urls.API_trade_INFO,data);//查看回复数据
  },
  getRefundDetail(data){
    return post(urls.API_GET_REFUND_DETAIL,data);//查看回复数据
  },
  cspOrderInfo(data){
    return post(urls.API_CSP_ORDER_INFO,data);//查看回复数据
  },
  cspOrderInfo1(data){
    return post(urls.API_CSP_ORDER_INFO1,data);//查看回复数据
  }
}





