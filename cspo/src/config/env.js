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
/*export const API_LIST_SERVICE_dict = localUrl+'listServiceDict';//订单列表词典
export const API_TRADE_LIST = localUrl+'tradeList';//主订单列表*/
// export const API_CSP_ORDER_LIST = localUrl+'cspOrderList';//子订单列表
// export const API_trade_INFO = localUrl+'tradeInfo';//主订单详情
// export const API_CSP_ORDER_INFO = localUrl+'cspOrderInfo';//子订单详情
// export const API_CSP_ORDER_INFO1 = localUrl+'cspOrderInfo1';//子订单详情
export const API_GET_REFUND_DETAIL = localUrl+'getRefundDetail';//退款详情


//系统管理
export const API_POST_LIST_NOTICE = baseUrl+'sys/notice/list';//公告列表
export const API_POST_LIST_USER = baseUrl+'sys/user/list';//用户列表
export const API_POST_UPDATE_USER = baseUrl+'sys/user/update';//保存用户
export const API_POST_SAVE_USER = baseUrl+'sys/user/save';//新增用户
export const API_POST_DELETE_USER = baseUrl+'sys/user/delete';//删除用户
export const API_POST_PASSWORD_USER = baseUrl+'sys/doctor/resetPassword';//修改用户密码

export const API_POST_LIST_WITH_NOPARAM = baseUrl+'sys/role/listWithNoParam';//角色列表
export const API_POST_LIST_ROLE = baseUrl+'sys/role/list';//角色列表
export const API_POST_SAVE_ROLE = baseUrl+'sys/role/save';//新增角色
export const API_POST_UPDATE_ROLE = baseUrl+'sys/role/update';//修改角色
export const API_POST_DELETE_ROLE = baseUrl+'sys/role/delete';//删除角色

export const API_POST_LIST_TEMPLATE = baseUrl+'bd/template/list';//消息模板列表
export const API_POST_UPDATE_TEMPLATE = baseUrl+'bd/template/update';//修改
export const API_POST_SAVE_TEMPLATE = baseUrl+'bd/template/save';//新增
//机构业务
//商品管理
//医生管理
export const API_POST_LIST_DOCTOR = baseUrl+'sys/doctor/doctorList';//医生列表
export const API_POST_SAVE_DOCTOR = baseUrl+'sys/doctor/doctorSave';//修改医生信息
//订单管理
export const API_GET_LIST_ORDER_REFUND = baseUrl+'ins/orderRefund/listOrderRefund';//退款列表

export const API_GET_LIST_ALL_INSTITUTION = baseUrl+'ins/institution/listAllInstitution';//机构列表


export const API_LIST_SERVICE_dict = baseUrl+'ins/orderRefund/listOrderRefund';//订单列表词典
export const API_TRADE_LIST = baseUrl+'csp/trade/tradeList';//主订单列表
export const API_TRADE_INFO = baseUrl+'csp/trade/tradeInfo';//主订单详情
export const API_CSP_ORDER_LIST = baseUrl+'csp/trade/cspOrderList';//子订单列表
export const API_CSP_ORDER_INFO = baseUrl+'csp/trade/cspOrderInfo';//子订单详情


export const API_LOGIN = baseUrl+'sys/user/login';//登录
