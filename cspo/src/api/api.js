import {get,post} from "./http.js";

import {baseUrl,baseImgPath} from "../config/env";


//登录
export function login(data) {
  return post(baseUrl+'/sys/login',data);
}

//获取医生列表
export function getDoctorList(data) {
  return post(baseUrl+'/sys/doctor/doctorList',data);
}






