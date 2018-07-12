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
  baseUrl = 'http://172.0.0.41:8117/cspo/';
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
/*订单列表*/
export const API_LIST_SERVICE_dict = localUrl+'listServiceDict';//订单列表词典
export const API_TRADE_LIST = localUrl+'tradeList';//主订单列表
export const API_CSP_ORDER_LIST = localUrl+'cspOrderList';//子订单列表
export const API_trade_INFO = localUrl+'tradeInfo';//主订单详情
export const API_GET_REFUND_DETAIL = localUrl+'getRefundDetail';//退款详情


export const API_GET_LIST_ORDER_REFUND = baseUrl+'ins/orderRefund/listOrderRefund';//退款列表

