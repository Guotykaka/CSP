import {get,post} from "./http.js";

import {baseUrl,baseImgPath} from "../config/env";
import * as urls from '@/config/env.js'


//登录
export function login(data) {
  return post(baseUrl+'/sys/login',data);
}

//获取医生列表
export function getDoctorList(data) {
  return post(baseUrl+'/sys/doctor/doctorList',data);
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





