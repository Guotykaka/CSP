import {get,post,getOne} from "./http.js";

import {baseUrl,baseImgPath} from "../config/env";
import * as urls from '@/config/env.js'

export const ERR_OK = 1;

let timeString=function(){
  var getDate = new Date();
  return getDate.getTime().toString()
}

//登录
export function login(params){
  return post(urls.API_LOGIN,params)
}
//系统管理
//用户列表API_POST_LIST_USER
export function getUserList(params){//获取列表
  return post(urls.API_POST_LIST_USER,params)
}
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

//获取所有机构列表
export function getListAllInstitution(params){
  return post(urls.API_GET_LIST_ALL_INSTITUTION,params)
}
//退款列表
export function getListOrderRefund(params){
  return post(urls.API_GET_LIST_ORDER_REFUND,params)
}

//订单列表词典
export function listServiceDict(params){
  return post(urls.API_LIST_SERVICE_dict,params)
}
//主订单列表
export function tradeList(params) {
  params.timespan = timeString();
  return post(urls.API_TRADE_LIST, params)
}

//主订单详情
export function tradeInfo(params) {
  params.timespan = timeString();
  return post(urls.API_TRADE_INFO, params)
}

//子订单列表
export function cspOrderList(params) {
  params.timespan = timeString();
  return post(urls.API_CSP_ORDER_LIST, params)
}

//子订单详情
export function cspOrderInfo(params) {
  params.timespan = timeString();
  return post(urls.API_CSP_ORDER_INFO, params)
}

export const api ={
  /*个人中心*/
  queryInsLeaveWordList(data){
    return post(urls.API_QUERY_INSLEAVE_WORDLIST,data);//获取聊天数据
  },
  queryInsLeaveWordAnswerList(data){
    return post(urls.API_QUERY_INSLEAVE_WORD_ANSWER_LIST,data);//查看回复数据
  },
}












































