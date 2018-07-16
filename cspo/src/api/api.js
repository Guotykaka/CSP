
import {get,post} from "./http.js";
import * as urls from '@/config/env.js'
import {baseUrl,baseImgPath} from "../config/env";


export const ERR_OK = 1;

//登录
export function login(params){
  return post(urls.API_LOGIN,params)
}
//系统管理
//公告列表
export function getNoticeList(params){//获取公告列表
  return post(urls.API_POST_LIST_NOTICE,params)
}
//用户列表API_POST_LIST_USER
export function getUserList(params){//获取列表
  return post(urls.API_POST_LIST_USER,params)
}
export function postUserUpdate(params){//保存用户
  return post(urls.API_POST_UPDATE_USER,params)
}
export function postUserSave(params){//新增用户
  return post(urls.API_POST_SAVE_USER,params)
}
export function postUserDelete(params){//删除用户
  return post(urls.API_POST_DELETE_USER,params)
}
export function postDoctorResetPassword(params){//重置密码
  return post(urls.API_POST_PASSWORD_USER,params)
}
//角色列表
export function getListWithNoParam(params){//获取列表
  return post(urls.API_POST_LIST_WITH_NOPARAM,params)
}
export function getListRole(params){//获取列表
  return post(urls.API_POST_LIST_ROLE,params)
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
//消息模板
export function PostTemplateList(params){//获取列表
  return post(urls.API_POST_LIST_TEMPLATE,params)
}
export function PostTemplateUpdate(params){//修改
  return post(urls.API_POST_UPDATE_TEMPLATE,params)
}
export function PostTemplateSave(params){//新增
  return post(urls.API_POST_SAVE_TEMPLATE,params)
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
  return post(urls.API_TRADE_INFO, params)
}

//子订单列表
export function cspOrderList(params) {
  return post(urls.API_CSP_ORDER_LIST, params)
}

//子订单详情
export function cspOrderInfo(params) {
  return post(urls.API_CSP_ORDER_INFO, params)
}

//退款详情
export function getRefundDetail(params) {
  return post(urls.API_INS_GET_REFUNDDETAIL, params)
}

//体检报告详情
export function reportDetail(params) {
  return post(urls.API_CSP_REPORT_DETAIL, params)
}

/*个人中心*/
//分页查询所有留言
export function queryInsLeaveWordList(params) {
  return post(urls.API_QUERY_INS_LEAVE_WORDLIST, params)
}

//回复所有留言
export function saveInsLeaveWordAnswer(params) {
  return post(urls.API_SAVE_INS_LEAVE_WORDANSWER, params)
}

//展开查看当前留言回复记录
export function queryInsLeaveWordAnswerList(params) {
  return post(urls.API_QUERY_INS_LEAVE_WORDANSWERLIST, params)
}
//关闭当前留言
export function closeInsLeaveWordAnswer(params) {
  return post(urls.API_CLOSE_INS_LEAVE_WORDANSWER, params)
}













































