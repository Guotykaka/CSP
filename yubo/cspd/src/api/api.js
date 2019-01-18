import * as urls from '@/config/env';
import {get, post, yunPost} from "./http.js";
import {b64hamcsha1, HexMD5, MD5} from '@/api/hash'

export const ERR_OK = 1;
export let reg_number = /^[1-9]\d*$/;
export const YOUPAIYUN_URL = 'http://zhangshangtijian.b0.upaiyun.com';

/*上传又拍云*/
export function youPaiYunUpload(updemo) {
  //时间戳
  let userInfo = urls.YOUPAIYUNINFO;
  let date = Date.parse(new Date());
  let url = 'http://v0.api.upyun.com/' + userInfo.bucketname;
  let save_key = urls.save_key_img + date + '{.suffix}';
  let policy = btoa(
    JSON.stringify({
      bucket: userInfo.bucketname,
      'save-key': save_key,
      expiration: parseInt(Date.parse(new Date()) + 3600)
    })
  );
  let signature =
    'UPYUN ' +
    userInfo.username +
    ':' +
    b64hamcsha1(
      HexMD5.MD5(userInfo.password).toString(HexMD5.enc.Hex),
      'POST&/' + userInfo.bucketname + '&' + policy
    );
  let formData = new FormData();
  formData.append('file', updemo);
  formData.append('policy', policy);
  formData.append('authorization', signature);
  return yunPost(url, formData);
}

/*登录*/
export function login(params) {
  return post(urls.API_LOGIN, params)
}

/*修改密码*/
export function resetPassword(params) {
  return post(urls.API_RESET_PASSWORD, params)
}

//获取左侧导航菜单
export function GetNav(params) {
  return post(urls.API_DOCTOR_NAV, params)
}

//根据key获取字典列表数据详情
export function getDictionaryByKey(params) {
  return post(urls.API_SYS_DICTIONARY_BYKEY, params)
}

//getSysNoticeInfo
export function getSysNoticeInfo(params) {
  return post(urls.API_SYS_NOTICE_IFNO, params)
}

//医生端系统公告表列表
export function noticelist(params) {
  return post(urls.API_SYS_SYSNOTICE_LIST, params)
}

/*
//判断是否认证 乐
export function isAuthentication(params) {
  return post(urls.API_IS_AUTHENTICATION, params)
}*/
//获取医生详情 乐
export function getInsdoctorInfo(params) {
  return post(urls.API_GET_INSDOCTOR_INFO, params)
}

//获取认证详情 乐
export function getApplyInfo(params) {
  return post(urls.API_QUERY_DOCTOR_APPLY_INFO, params)
}

/*图文咨询*/

//医生回复
export function sendToCustomer(params) {
  return post(urls.API_INS_SEND_TO_CUSTOMER, params)
}

//将该客户发给当前医生的未读消息全部更新为已读
export function updateToInRead(params) {
  return post(urls.API_UPDATE_TO_INREAD, params)
}

//查看客户评价服务状态cspOrderId
export function queryOrderComment(params) {
  return post(urls.API_QUERY_ORDER_COMMENT, params)
}

//聊天记录分页查询
export function queryInsConsultChatList(params) {
  return post(urls.API_QUERY_INS_CONSULT_CHATLIST, params)
}

//获取顶部的统计数量
export function getOrderNumber(params) {
  return post(urls.API_GET_ORDER_NUMBER, params)
}

//获取图文咨询当前用户当前状态所有未读消息数量
export function countUnReadMsgByOrderStatus(params) {
  return post(urls.API_COUNT_UN_READ_MSG_BY_ORDER_STATUS, params)
}

//图文咨询订单分页查询
export function imgTextList(params) {
  return post(urls.API_IMGTEXT_LIST, params)
}

//查看图文咨询订单详细信息
export function queryTradeDetail(params) {
  return post(urls.API_QUERY_TRADE_DETAIL, params)
}

//添加图文咨询订单信息备注
export function updateTradeDetail(params) {
  return post(urls.API_UPDATE_TRADE_DETAIL, params)
}

/*免费图文咨询*/
export function getAppShopProductListFree(params) {//查看所有配置的可推荐的供应链商品列表
  return post(urls.GET_APP_SHOP_PRODUCTLIST_FREE, params)
}
export function appListAppExamAddition(params) {//获取可购买加项列表
  return post(urls.API_APPLIST_EXAMADDITION, params)
}
export function appListAppExamSuiteDetail(params) {//获取预约套餐详情（免费检查项目）
  return post(urls.API_APPLIST_EXAMSUIT_DETAIL, params)
}
export function getConsultList(params) {//获取当前用户咨询记录
  return post(urls.API_GET_CONSULT_LIST, params)
}
export function getDUnReplayCount(params) {//获取当前用户未回复消息数量
  return post(urls.API_GET_DUNREPLAY_COUNT, params)
}
export function getProcessedList(params) {//获取当前健管师已处理列表
  return post(urls.API_GET_PROCESSED_LIST, params)
}
export function getToBeTreatedList(params) {//获取当前健管师待处理列表
  return post(urls.API_GET_TOBE_TREATED_LIST, params)
}
export function freeSendToCustomer(params) {//健管师回复客户信息
  return post(urls.API_SEND_TO_CUSTOMER, params)
}
export function healthList(params) {//健管师回复客户信息
  return post(urls.API_HEALTH_LIST, params)
}
export function searchConsultList(params) {//健管师回复客户信息
  return post(urls.API_SEARCH_CONSULT_LIST, params)
}
export function getAppShopProductList(params) {//查看所有配置的可推荐的供应链商品列表
  return post(urls.GET_APP_SHOP_PRODUCTLIST, params)
}
/*联系医助/留言板*/

//关闭留言
export function closeInsLeaveWordAnswer(params) {
  return post(urls.API_INS_CLOSE_LEAVE_WORD_ANSWER, params)
}

//展开查看当前留言所有回复记录
export function queryInsLeaveWordAnswerList(params) {
  return post(urls.API_INS_QUERY_LEAVE_WORD_ANSWER_LIST, params)
}

//分页查询所有留言
export function queryInsLeaveWordList(params) {
  return post(urls.API_INS_QUERY_LEAVE_WORD_LIST, params)
}

//添加留言
export function saveInsLeaveWord(params) {
  return post(urls.API_INS_SAVE_LEAVE_WORD, params)
}

//回复留言
export function saveInsLeaveWordAnswer(params) {
  return post(urls.API_INS_SAVE_LEAVE_WORD_ANSWER, params)
}

//个人账户金额 乐
export function getAccountInfo(params) {
  return post(urls.API_GET_DOCTOR_ACCOUNT_INFO, params)
}

//获取提现记录 乐
export function getWithdrawList(params) {
  return post(urls.API_LIST_ACCOUNT_RECORD, params)
}

//获取医生的订单记录 乐
export function getDoctorOrderList(params) {
  return post(urls.API_GET_ORDER_INFO, params)
}

//医生提现 乐
export function doDeposit(params) {
  return post(urls.API_SAVE_ACCOUNT_RECORD, params)
}


//服务设置 乐  获取医生服务
export function getDoctorServices(params) {
  return post(urls.API_QUERY_INS_SERVICE_DOCTOR_BY_USERID, params)
}

//服务设置 乐  医生设置服务
export function doctorEditorService(params) {
  return post(urls.API_SAVE_OR_UPDATE_SERVICE_DOCTOR_SETTING, params)
}

//获取模板及服务商品 乐
export function getTemplateService(params) {
  return post(urls.API_LIST_PRODUCT_MODEL_INFO, params)
}

//更新商品状态
export function updateProductStatus(params) {
  return post(urls.API_UPDATE_PRODUCTION_STATUS, params)
}

//开通服务
export function saveService(params) {
  return post(urls.API_SAVE_UPDATE_INFO, params)
}
//获取商品列表
export function listProductInfo(params) {
  return post(urls.API_LIST_PRODUCT_INFO, params)
}




//电话咨询 乐
export function getTelService(params) {
  return post(urls.API_INS_PHOTO_CONSULTATION_ORDER, params)
}

//打电话 乐
export function callCustomer(params) {
  return post(urls.API_INS_PHOTO_LIST, params)
}

//打电话 乐
export function getReportData(params) {
  return post(urls.API_INS_REPORT_DETAIL, params)
}

//保存备注 乐
export function saveRemark(params) {
  return post(urls.API_INS_UPDATE_REMARK, params)
}

//保存服务小结 乐
export function saveTelReport(params) {
  return post(urls.API_INS_SAVE_ORDER_CALL_REPORT, params)
}

//获取录音列表 乐
export function getAudioList(params) {
  return post(urls.API_INS_ORDER_CALL_RECORD_BY_PAGE, params)
}


//发送短信 乐
export function sendMsg(params) {
  return post(urls.API_INS_SEND_SMS, params)
}

//转单页面 过期列表 乐
export function getSlipOrder(params) {
  return post(urls.API_SLIP_ORDER_LIST, params)
}
//转单页面 分配列表 乐
export function getDistributionOrder(params) {
  return post(urls.API_DISTRIBUTION_ORDER_LIST, params)
}

//转单页面 改预约时间 乐
export function updateAppointmentTime(params) {
  return post(urls.API_UPDATE_APPOINTMENT_TIME, params)
}

//转单页面 多个医生 乐
export function getMultpleDoctor(params) {
  return post(urls.API_MULTIPLE_DOCTOR, params)
}
//获取所有已经认证的医生列表
export function getDoctorList(params) {
  return post(urls.API_GET_DOCOTOR_LIST, params)
}


//转单页面 分配医生 乐
export function dispatchDoctor(params) {
  return post(urls.API_DISTRIBUTION_DOCTOR, params)
}

//转单页面 打电话 乐
export function timeOrderCall(params) {
  return post(urls.API_TIME_ORDER_CALL, params)
}

//转单页面 打电话 乐
export function getSpeOrder(params) {
  return post(urls.API_GET_ORDER_LIST, params)
}
//订单监控 ->加入预约池
export function JoinAppointmentPool(params) {
  return post(urls.API_JOIN_APPOINTMENT_POOL, params)
}
//预约订单打电话给用户 ->客户人员带电话给用户
export function customerPersonnelToAccountCall(params) {
  return post(urls.CUSTOMER_PERSON_NELTO_ACCOUNT_CALL, params)
}

//提交认证   乐
export function submitDoctorInfo(params) {
  return post(urls.API_SUBMIT_DOCTOR_INFO, params)
}

//取消认证   乐
export function cancelApply(params) {
  return post(urls.API_CHANGE_DOCTOR_STATUS, params)
}

//获取各类型未读消息总数
export function countUserNewsList(params) {
  return post(urls.API_COUNT_USER_NEWS_LIST, params)
}

//';//按类型更新用户消息为已读状态
export function updateBatch(params) {
  return post(urls.API_INS_UPDATE_BATCH, params)
}
/*健康管理start*/
//分组管理
export function delMedicalGroup(params) {//删除分组
  return post(urls.MEDICAL_GROUP, params)
}
export function getMedicalGroupDetail(params) {//分组信息详情
  return post(urls.MEDICAL_GROUP_DETAIL, params)
}
export function getMedicalGroupList(params) {//获取分组列表
  return post(urls.MEDICAL_GROUP_LIST, params)
}
export function saveMedicalGroup(params) {//新增分组
  return post(urls.MEDICAL_SAVE_GROUP, params)
}
export function updateMedicalGroup(params) {//更新分组
  return post(urls.MEDICAL_UPDATE_GROUP, params)
}
export function getAbnormalItem(params) {//异常项看板
  return post(urls.MEDICAL_GET_ABNORMAL_ITEM, params)
}
export function getGroupUserList(params) {//获取分组下的用户信息
  return post(urls.MEDICAL_GET_GROUP_USER_LIST, params)
}
export function getMedicalLabelIdNameList(params) {//标签id、name下拉框列表
  return post(urls.MEDICAL_LABEL_NAME_LIST, params)
}
export function getUserReport(params) {//获取用户的体检报告
  return post(urls.MEDICAL_GET_USER_REPORT, params)
}
//复检建议计划管理
export function addPlan(params) {//新增复检建议计划
  return post(urls.RECHECK_ADD_PLAN, params)
}
export function endPlan(params) {//终止复检建议计划
  return post(urls.RECHECK_END_PLAN, params)
}
export function getMedicalGroupIdNameList(params) {//用户医学分组id、name下拉框列表
  return post(urls.RECHECK_GROUP_NAME_LIST, params)
}
export function getPlanList(params) {//查看计划列表
  return post(urls.RECHECK_GET_PLAN_LIST, params)
}
export function haveEnoughSmsAmount(params) {//查看计划列表
  return post(urls.HAVE_ENOUGH_SMSAMOUNT, params)
}
export function getSmsTemplates(params) {//查看短信模板
  return post(urls.GET_SMS_TEMPLATES, params)
}
/*健康管理end*/

/*用户免费咨询管理start*/
//获取当前用户咨询记录
export function UsergetConsultList(params) {
  return post(urls.USER_GET_CONSULT_LIST, params)
}
//获取当前健管师已处理列表
export function UsergetProcessedList(params) {
  return post(urls.USER_GET_PROCESSED_LIST, params)
}
//获取当前健管师待处理列表
export function UsergetToBeTreatedList(params) {
  return post(urls.USER_GET_TO_BE_TREATED_LIST, params)
}
//回复客户信息
export function userSendToCustomer(params) {
  return post(urls.USER_SEND_TO_CUSTOMER, params)
}
//填写并发送复检建议
export function sendRecheckSuggestion(params) {
  return post(urls.SEND_RECHECK_SUGGESTTION, params)
}
//获取单个商品信息
export function getProductInfo(params) {
  return post(urls.USER_GET_PRODUCT_INFO, params)
}
//查看体检报告是否有复检建议
export function haveRecheckSuggestion(params) {
  return post(urls.HAVE_RECHECK_SUGGESTION, params)
}
//查看复检建议
export function getRecheckSuggestionByWorkNo(params) {
  return post(urls.SEE_RECHECK_SUGGESTION, params)
}
//添加用户备注
export function addCustomerRemark(params) {
  return post(urls.ADD_CUSTOMER_REMARK, params)
}
//查看用户备注
export function getCustomerRemark(params) {
  return post(urls.GET_CUSTOMER_REMARK, params)
}
//复检建议按条件搜索聊天过的用户
export function medicalSearchedCustomerList(params) {
  return post(urls.SEARCHED_CUSTOMER_LIST, params)
}
/*用户免费咨询管理end*/

//报告数据看板
export function getShowReportData(params) {
  return post(urls.USER_GET_SHOW_REPOTDATA, params)
}
//异常项看板
export function getShowAbnormal(params) {
  return post(urls.USER_GET_SHOW_ABNORMAL, params)
}
//计划看板
export function getShowPlanBoard(params) {
  return post(urls.USER_GET_SHOW_PLANBOARD, params)
}
//计划明细
export function getShowPlanDetail(params) {
  return post(urls.USER_GET_SHOW_PLANDETAIL, params)
}

//服务医生下拉
export function getDoctorOPList(params) {
  return post(urls.USER_GET_DOCTOR_OP_LIST, params)
}
//查看服务医生
export function getServiceDoctor(params) {
  return post(urls.USER_GET_SERVICE_DOCTOR, params)
}
//设置、修改服务医生
export function setServiceDoctor(params) {
  return post(urls.USER_SET_SERVICE_DOCTOR, params)
}
/*个检预约管理*/
//查看体检预约套餐详情
export function getExamReserveDetail(params) {
  return post(urls.GET_EXAM_RESERVE_DETAIL, params)
}
// 个检预约列表
export function getExamReserveList(params) {
  return post(urls.GET_EXAM_RESERVE_LIST, params)
}
// 更新个检预约状态
export function updateReserveStatus(params) {
  return post(urls.UPDATE_RESERVE_STATUS, params)
}
// 查看个检详情
export function GetProductInfo(params) {
  return post(urls.API_GET_PRODUCT_INFO, params)
}
export function GetSupplierSelect(params) {//供应商下拉菜单
  return post(urls.API_SELECT_SUPPLIER, params)
}
/*健康档案*/
export function getHealthRecordCheckDataList(params) {
  return post(urls.HEALTH_RECORD_CHECK_DATA_LIST, params)
}
