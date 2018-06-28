const ERR_OK = 0;

import {baseUrl,baseImgPath} from "../config/env";

"../config/env.js"
import axios from "axios"


//登录
export function login(data) {
  var data = data || {};
  const url =baseUrl + '/sys/login';
  return axios.post(url, {
    params: data
  })
}


//获取医生账户
export function getDoctorAccountInfo(data) {
  var data = data || {};
  const url =baseUrl + '/ins/doctorAccount/getDoctorAccountInfo';
  return axios.post(url, {
    params: data
  })
}


//获取服务设置
export function queryInsServiceDoctorByUserId(data) {
  var data = data || {};
  const url =baseUrl + '/queryInsServiceDoctorByUserId';
  return axios.post(url, {
    params: data
  })
}


