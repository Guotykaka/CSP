import * as urls from '@/config/env.js'
import {get, post, getOne} from "./http.js";
import {baseUrl, baseImgPath} from "../config/env";

import axios from 'axios'

export const ERR_OK = 1;


/*登录*/
export function login(params) {
  return post(urls.API_LOGIN, params)
}

//判断是否认证 乐
export function isAuthentication(params) {
  return post(urls.API_IS_AUTHENTICATION, params)
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

//获取短信模板内容 乐
export function getSMSTemplate(params) {
  return post(urls.API_INS_GET_SMS_TEMPLATE, params)
}

//发送短信 乐
export function sendMsg(params) {
  return post(urls.API_INS_SEND_SMS, params)
}


//提交认证   乐
export function submitDoctorInfo(params) {
  return post(urls.API_SUBMIT_DOCTOR_INFO, params)
}

//取消认证   乐
export function cancelApply(params) {
  return post(urls.API_CHANGE_DOCTOR_STATUS, params)
}














let qs = require('qs')

function apipost(url, params) {

  return axios({
    method: "post",
    url: url,
    data: params
  })
}

function apiget(url, params) {
  return axios({
    method: "get",
    url: url,
    data: params
  })
}

export const api = {
  /*菜单栏start*/
  nav(url, param) {
    return axios({
      method: "Get",
      url: url,
      data: param
    })
  },
  server(url, param) {
    return axios({
      method: "POST",
      url: url,
      data: param
    })
  },
  /*菜单栏end*/
  /*首页数据请求start*/
  countUserNewsList(url, param) {
    return apiget(url, param)
  },
  getSysNoticeInfo(url, param) {
    return apiget(url, param)
  },
  /*首页数据请求end*/
  //图文咨询相关请求start
  getOrderNumber(url, param) {
    return axios({
      method: "POST",
      url: url,
      data: param
    })
  },
  list(url, param) {
    return axios({
      method: "POST",
      url: url,
      data: param
    })
  },
  queryInsConsultChatList(url, param) {
    return axios({
      method: "POST",
      url: url,
      data: param
    })
  },
  countUnReadMsgByOrderStatus(url, param) {
    return axios({
      method: "POST",
      url: url,
      data: param
    })
  },
  queryTradeDetail(url, param) {
    return axios({
      method: "POST",
      url: url,
      data: param
    })
  },
  //图文咨询相关请求start
  /*系统公告*/
  getDictionaryByKey(url, params) {
    return apipost(url, params);
  },
  noticeTitleQuery(url, params) {
    return apiget(url, params);
  },
  /*个人账户*/
  getDoctorAccountInfo(params) {
    return apipost(urls.API_GET_DOCTOR_ACCOUNT_INFO, params);
  },
  listAccountRecord(params) {
    return apipost(urls.API_LIST_ACCOUNT_RECORD, params);
  },
  getOrderInfo(params) {
    return apipost(urls.API_GET_ORDER_INFO, params);
  },
  queryPhoneConsultationOrder(params) {
    return apipost(urls.API_QUERY_PHONE_CONSULTATION, params);
  },
  getSMSTemplate(params) {
    return apipost(urls.API_GET_SMSTEMPLATE, params);
  },
  sendSMS(params) {
    return apipost(urls.API_SEND_SMS, params);
  },
  queryInsLeaveWordAnswerList(params) {
    return apipost(urls.API_QUERY_INS_LEAVE_ANSWER_LIST, params);
  },
  queryInsLeaveWordList(params) {
    return apipost(urls.API_QUERY_INS_LEAVE_WORDLIST, params);
  }
};
