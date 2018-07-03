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


//获取用户管理数据
export function getUserlistData(data) {
  var data = data || {};
  var response;
  // const url =baseUrl + '/sys/user/list';
  // const url =baseUrl + '/sys/workbench/listOrderRefund';
  const url ='http://localhost:8080/api/listData';
  return axios.post(url,
    JSON.stringify(data))
    .then((response) => {
      return response.data.data;
    }),
  console.log(response.data.data)
}

