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
  baseUrl = 'http://172.0.0.42:8115/cspd';
  baseImgPath = '/img/';
}else{
  baseUrl = '//elm.cangdu.org';
  baseImgPath = '//elm.cangdu.org/img/';
}

export {
  baseUrl,
  routerMode,
  baseImgPath,
  localUrl
}
export const API_NAV = localUrl+'nav';

export const API_COUNT_USER_NEWS_LIST = localUrl+'countUserNewsList';
/*个人账户*/
export const API_GET_DOCTOR_ACCOUNT_INFO = localUrl+'getDoctorAccountInfo';//提现
export const API_LIST_ACCOUNT_RECORD = localUrl+'listAccountRecord';//提现记录
export const API_GET_ORDER_INFO = localUrl+'getOrderInfo';//订单记录
/*电话咨询*/
export const API_QUERY_PHONE_CONSULTATION = localUrl+'queryPhoneConsultationOrder';//电话咨询列表数据
export const API_GET_SMSTEMPLATE = localUrl+'getSMSTemplate';//
export const API_SEND_SMS = localUrl+'sendSMS';//发送短信
/*联系医助*/
export const API_QUERY_INS_LEAVE_WORDLIST = localUrl+'queryInsLeaveWordList';//发送短信
export const API_QUERY_INS_LEAVE_ANSWER_LIST = localUrl+'queryInsLeaveWordAnswerList';//发送短信




