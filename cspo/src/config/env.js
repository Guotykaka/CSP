// import {localUrl} from "../../../cspd/src/config/env";

/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * baseImgPath: 图片存放地址
 *
 */
let baseUrl = '';
let routerMode = 'hash';
let baseImgPath;
let localUrl = "http://localhost:8080/api/";

if (process.env.NODE_ENV == 'development') {
  baseUrl = 'http://172.0.0.42:8116/cspo';
  baseImgPath = '/img/';
}else{
  baseUrl = '//elm.cangdu.org';
  baseImgPath = '//elm.cangdu.org/img/';
}

export {
  baseUrl,
  routerMode,
  baseImgPath
}

/*个人中心*/
export const API_QUERY_INSLEAVE_WORDLIST = localUrl+'queryInsLeaveWordList';//获取聊天数据
export const API_QUERY_INSLEAVE_WORD_ANSWER_LIST = localUrl+'queryInsLeaveWordAnswerList';//查看回复数据
