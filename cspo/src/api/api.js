import {get,post} from "./http.js";

import {baseUrl,baseImgPath} from "../config/env";


//登录
export function login(data) {
  return post(baseUrl+'/sys/login',data);
}
