
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
export function getUserInfo(params){//查看
  return post(urls.API_POST_INFO_USER,params)
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
export function getRoleInfo(params){//角色详情信息
  return post(urls.API_GET_INFO_ROLE,params)
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
export function PostTemplateDelete(params){//删除
  return post(urls.API_POST_DELETE_TEMPLATE,params)
}
//机构管理
export function PostInstitutionList(params){//列表
  return post(urls.API_POST_LIST_INSTITUTION,params)
}
export function PostInstitutionUpdate(params){//修改
  return post(urls.API_POST_UPDATE_INSTITUTION,params)
}
export function PostInstitutionSave(params){//新增
  return post(urls.API_POST_SAVE_INSTITUTION,params)
}
//服务管理
export function GetServiceList(params){//服务列表
  return post(urls.API_GET_LIST_SERVICE,params)
}
export function PostServiceStatus(params){//修改服务状态
  return post(urls.API_POST_STATUS_SERVICE,params)
}
export function PostServiceUpdate(params){//修改服务
  return post(urls.API_POST_UPDATE_SERVICE,params)
}
export function PostServiceSave(params){//修改服务
  return post(urls.API_POST_SAVE_SERVICE,params)
}
export function GetListenList(params){//一元听列表
  return post(urls.API_GET_LIST_LISTEN,params)
}
export function PostListenUpdate(params){//一元听编辑
  return post(urls.API_GET_UPDATE_LISTEN,params)
}
export function PostListenStatus(params){//一元听修改状态
  return post(urls.API_GET_STATUS_LISTEN,params)
}
export function PostListenSave(params){//一元听新增
  return post(urls.API_GET_SAVE_LISTEN,params)
}
export function PostListenDoc(params){//一元听绑定医生列表
  return post(urls.API_GET_DOCLIST_LISTEN,params)
}
//菜单管理
export function Menudelete(params){//删除菜单
  return post(urls.API_POST_MENU_DELETE,params)
}
export function getLeftNav(params){//获取左侧导航菜单
  return post(urls.API_POST_MENU_GETLEFTNAV,params)
}
export function getMenuList(params){//获取所有菜单列表
  return post(urls.API_POST_MENU_GETMENULIST,params)
}
export function getMenuListByCategory(params){//获取所有菜单列表
  return post(urls.API_POST_MENU_BYCATEGORY,params)
}
export function getSysMenuByCategory(params){//选择菜单(添加、修改菜单)
  return post(urls.API_POST_MENU_MENUBYCATEGORY,params)
}
export function getSysMenuById(params){//获取菜单信息
  return post(urls.API_POST_MENU_GETSYSMENUBYID,params)
}
  export function listByCategory(params){//根据角色类别加载菜单信息
  return post(urls.API_POST_MENU_LISTBYCATEGORY,params)
}
export function Menusave(params){//保存菜单信息
  return post(urls.API_POST_MENU_SAVE,params)
}
export function MenuUpdate(params){//修改菜单
  return post(urls.API_POST_MENU_UPDATE,params)
}
/*数据字典*/
export function getDictListByType(params){//修改菜单
  return post(urls.API_GET_DICTLISTBY_TYPE,params)
}
/*系统常量*/
//
export function deleteDictionary(params){//删除字典列表数据
  return post(urls.API_POST_DELETE_DICTIONARY,params)
}
//
export function getDictionaryByKey(params){//根据key获取字典列表数据详情
  return post(urls.API_POST_GETDICTIONARY_BY_KEY,params)
}
//
export function getDictionaryInfo(params){//获取字典列表数据详情
  return post(urls.API_POST_GETDICTIONARY_INFO,params)
}
//
export function listDictionary(params){//获取字典列表数据
  return get(urls.API_GET_LIST_DICTIONARY,params)
}
//
export function saveOrUpdateDictionary(params){//获取字典列表数据
  return post(urls.API_POST_SAVE_OR_UPDATAE_DICTIONARY,params)
}





//医生管理
//获取医生列表
export function getDoctorList(params) {
  return post(urls.API_POST_LIST_DOCTOR,params);
}
//编辑医生信息
export function updataDoctorEditor(params) {
  return post(urls.API_POST_DOCTOR_UPDATE,params);
}
//获取所有服务包含状态
export function getAllService(params) {
  return post(urls.API_POST_SERVICE_DICT,params);
}

//设置服务权限
export function setService(params) {
  return post(urls.API_POST_SAVE_SERVICE_SET,params);
}

//设置服务权限
export function restPassword(params) {
  return post(urls.API_POST_REST_PASSWORD,params);
}

//新增医生
export function addDoctor(params) {
  return post(urls.API_POST_DOCTOR_SAVE,params);
}
//获取分成列表
export function getInsProportionsList(params) {
  return post(urls.API_POST_INSPROPORTION_LIST,params);
}
//新增分成项
export function addProportionItem(params) {
  return post(urls.API_POST_SAVE_INSPROPORTIONS,params);
}
//删除分成项
export function deleteProportionItem(params) {
  return post(urls.API_POST_DELETE_INSPROPORTIONSENTITY,params);
}


//获取认证医生列表
export function getDoctorApplyList(params) {
  return post(urls.API_POST_DOCTOR_APPLY_LIST,params);
}

//查询医生详情
export function queryDoctorInfo(params) {
  return post(urls.API_POST_QUERY_DOCTOR_INFO,params);
}

//改变医生认证状态  同意或拒绝
export function changeDoctorStatus(params) {
  return post(urls.API_POST_CHANGE_DOCTOR_STATUS,params);
}


//财务管理
export function getAccountRecord(params) {
  return post(urls.API_POST_LIST_ACCOUNT_RECORD,params);
}

//同意或拒绝提现
export function updataWithdrawStatus(params) {
  return post(urls.API_POST_UPDATE_APPLY_STATUS,params);
}


//获取未读列表
export function getNewsList(params) {
  return post(urls.API_POST_COUNT_USER_NEWSLIST,params);
}

//设置未读为已读  乐
export function clearUnReadMes(params) {
  return post(urls.API_POST_UNREAD_UPDATE_BATCH,params);
}











//获取所有机构列表
export function getListAllInstitution(params){
  return post(urls.API_GET_LIST_ALL_INSTITUTION,params)
}
//退款列表
export function getListOrderRefund(params){
  return post(urls.API_GET_LIST_ORDER_REFUND,params)
}

export function getOrderChangeRecord(params){
  return post(urls.API_GET_LIST_ORDER_CHANGE_R,params)
}

//订单列表词典
export function listServiceDict(params){
  return post(urls.API_LIST_SERVICE_dict,params)
}
//主订单列表
export function tradeList(params) {
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

//同意退款
export function agreeRefuse(params) {
  return post(urls.API_POST_LIST_ORDER_REFUND, params)
}

//拒绝
export function refuseList(params) {
  return post(urls.API_POST_LIST_ORDER_CHANGE_RECORD, params)
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













































