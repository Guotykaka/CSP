import {get,post} from "./http.js";

import {baseUrl,baseImgPath} from "../config/env";
import * as urls from '@/config/env.js'

export const ERR_OK = 1;



//登录
export function login(data) {
  return post(baseUrl+'/sys/login',data);
}

//获取医生列表
export function getDoctorList(data) {
  return post(baseUrl+'/sys/doctor/doctorList',data);
}

//获取所有机构列表
export function getListAllInstitution(params){
  return post(urls.API_GET_LIST_ALL_INSTITUTION,params)
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





