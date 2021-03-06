
/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * baseImgPath: 图片存放地址
 *
 */
let baseUrl = '';
let payUrl = '';
let routerMode = 'hash';

if (process.env.NODE_ENV == 'development') {

<<<<<<< HEAD
  // baseUrl = 'http://172.0.0.41:8117/cspo/';
  baseUrl = 'http://10.50.50.117:8117/cspo/';
=======
  baseUrl = 'http://HZ2WZSG82:8117/cspo/';
  // baseUrl = 'http://172.0.0.41:8117/cspo/';
  //payUrl = 'http://HZ2WZSG82:8115/pay/';
>>>>>>> 3c255fa504274fb8f0a1d36d299f337c8580cf49
  payUrl = 'http://172.0.0.41:8115/pay/';
}else{
  /*测试环境*/
  // baseUrl = 'http://172.0.0.41:8117/cspo/';
  // payUrl = 'http://172.0.0.41:8115/pay/';
  /*生产环境*/
  baseUrl = 'http://webapi.ybzstj.com/cspo/';
  payUrl = 'http://payapi.ybzstj.com/';

}

export {
  baseUrl,
  routerMode,
}


/*个人中心*/
export const API_QUERY_INS_LEAVE_WORDLIST = baseUrl+'ins/insleavewordanswer/queryInsLeaveWordList';//分页查询所有留言
export const API_SAVE_INS_LEAVE_WORDANSWER = baseUrl+'ins/insleavewordanswer/saveInsLeaveWordAnswer';//回复所有留言
export const API_QUERY_INS_LEAVE_WORDANSWERLIST = baseUrl+'ins/insleavewordanswer/queryInsLeaveWordAnswerList';//展开查看当前留言回复记录
export const API_CLOSE_INS_LEAVE_WORDANSWER = baseUrl+'ins/insleavewordanswer/closeInsLeaveWordAnswer';//关闭当前留言


//系统管理
export const API_POST_LIST_NOTICE = baseUrl+'sys/notice/list';//公告列表
export const API_POST_INFO_NOTICE = baseUrl+'sys/notice/info';//公告详情
export const API_POST_STATUS_NOTICE = baseUrl+'sys/notice/updateStatus';//公告状态
export const API_POST_LIST_USER = baseUrl+'sys/user/list';//用户列表
export const API_POST_INFO_USER = baseUrl+'sys/user/info';//查看用户

export const API_POST_UPDATE_USER = baseUrl+'sys/user/update';//保存用户
export const API_POST_SAVE_USER = baseUrl+'sys/user/save';//新增用户
export const API_POST_DELETE_USER = baseUrl+'sys/user/delete';//删除用户
export const API_POST_PASSWORD_USER = baseUrl+'sys/doctor/resetPassword';//修改用户密码
export const API_POST_LIST_WITH_NOPARAM = baseUrl+'sys/role/listWithNoParam';//角色列表
export const API_POST_LIST_ROLE = baseUrl+'sys/role/list';//角色列表
export const API_POST_SAVE_ROLE = baseUrl+'sys/role/save';//新增角色
export const API_GET_INFO_ROLE = baseUrl+'sys/role/info';//角色详情
export const API_POST_UPDATE_ROLE = baseUrl+'sys/role/update';//修改角色
export const API_POST_DELETE_ROLE = baseUrl+'sys/role/delete';//删除角色

export const API_POST_LIST_TEMPLATE = baseUrl+'bd/template/list';//消息模板列表
export const API_POST_UPDATE_TEMPLATE = baseUrl+'bd/template/update';//修改
export const API_POST_SAVE_TEMPLATE = baseUrl+'bd/template/save';//新增
export const API_POST_DELETE_TEMPLATE = baseUrl+'bd/template/delete';//删除
export const API_POST_LIST_CSP_MESSAGE = baseUrl+'csp/exception/listCspMessage';//异常日志管理




//菜单管理

export const API_POST_MENU_DELETE = baseUrl+'sys/menu/delete';//删除菜单
export const API_POST_MENU_GETLEFTNAV = baseUrl+'sys/menu/getLeftNav';//删除菜单
export const API_POST_MENU_GETMENULIST = baseUrl+'sys/menu/getMenuList';//获取所有菜单列表
export const API_POST_MENU_BYCATEGORY = baseUrl+'sys/menu/getMenuListByCategory';//获取所有菜单列表
export const API_POST_MENU_MENUBYCATEGORY = baseUrl+'sys/menu/getSysMenuByCategory';//选择菜单(添加、修改菜单)
export const API_POST_MENU_GETSYSMENUBYID = baseUrl+'sys/menu/getSysMenuById';//获取菜单信息
export const API_POST_MENU_LISTBYCATEGORY = baseUrl+'sys/menu/listByCategory';//根据角色类别加载菜单信息
export const API_POST_MENU_SAVE = baseUrl+'sys/menu/save';//保存菜单信息
export const API_POST_MENU_UPDATE = baseUrl+'sys/menu/update';//修改菜单

//数据字典

export const API_GET_DICTLISTBY_TYPE = baseUrl+'sys/dict/getDictListByType';//根据type获取字典列表
/*系统常量*/
export const API_POST_DELETE_DICTIONARY = baseUrl+'sys/dictionary/deleteDictionary';//删除字典列表数据
export const API_POST_GETDICTIONARY_BY_KEY = baseUrl+'sys/dictionary/getDictionaryByKey';//根据key获取字典列表数据详情
//export const API_POST_GETDICTIONARY_BY_KEY = baseUrl+'sys/dictionary/getDictionaryByKey';//根据key获取字典列表数据详情


export const API_POST_GETDICTIONARY_INFO = baseUrl+'sys/dictionary/getDictionaryInfo';//获取字典列表数据详情
/*GET请求*/
export const API_GET_LIST_DICTIONARY = baseUrl+'sys/dictionary/listDictionary';//获取字典列表数据
export const API_POST_SAVE_OR_UPDATAE_DICTIONARY = baseUrl+'sys/dictionary/saveOrUpdateDictionary';//获取字典列表数据



//机构业务
export const API_POST_LIST_INSTITUTION = baseUrl+'ins/institution/list';//机构业务列表
export const API_POST_UPDATE_INSTITUTION = baseUrl+'ins/institution/update';//修改机构业务
export const API_POST_SAVE_INSTITUTION = baseUrl+'ins/institution/save';//新增机构业务
//服务管理
export const API_GET_LIST_SERVICE = baseUrl+'csp/serviceInfo/list';//服务列表
export const API_POST_STATUS_SERVICE = baseUrl+'csp/serviceInfo/updateStatus';//修改服务状态
export const API_POST_UPDATE_SERVICE = baseUrl+'csp/serviceInfo/updateCspServiceInfo';//修改服务
export const API_POST_SAVE_SERVICE = baseUrl+'csp/serviceInfo/saveCspServiceInfo';//新增服务
export const API_UPDATE_IMG = baseUrl+'csp/serviceInfo/upload';//上传ICON
//商品管理
export const API_GET_LIST_LISTEN = baseUrl+'CspVoiceProduct/CspVoiceProductget';//一元听列表
export const API_GET_UPDATE_LISTEN = baseUrl+'CspVoiceProduct/CspVoiceProductupdate';//一元听编辑
export const API_GET_STATUS_LISTEN = baseUrl+'CspVoiceProduct/Statusupdate';//一元听修改状态
export const API_GET_SAVE_LISTEN = baseUrl+'CspVoiceProduct/saveCspVoiceProduct';//一元听新增
export const API_GET_DOCLIST_LISTEN = baseUrl+'CspVoiceProduct/CspQueryDoctorOne';//一元听绑定医生列表

//医生管理
export const API_POST_LIST_DOCTOR = baseUrl+'sys/doctor/doctorList';//医生列表
export const API_POST_DOCTOR_UPDATE = baseUrl+'sys/doctor/doctorUpdate';//编辑医生信息
export const API_POST_SERVICE_DICT = baseUrl+'sys/doctor/serviceDict';//所有服务
export const API_POST_SAVE_SERVICE_SET = baseUrl+'sys/doctor/saveServiceSet';//设置服务权限
export const API_POST_REST_PASSWORD = baseUrl+'sys/doctor/resetPassword';//重置密码
export const API_POST_DOCTOR_SAVE = baseUrl+'sys/doctor/doctorSave';//新增医生
export const API_POST_INSPROPORTION_LIST = baseUrl+'sys/doctor/listGetInsProportionsByPage';//分成比例列表
export const API_POST_SAVE_INSPROPORTIONS = baseUrl+'sys/doctor/saveInsProportions';//新增分成项
export const API_POST_DELETE_INSPROPORTIONSENTITY = baseUrl+'sys/doctor/deleteInsProportionsEntity';//删除分成比例项

export const API_POST_DOCTOR_APPLY_LIST = baseUrl+'sys/doctorApply/doctorApplyList';//医生认证列表
export const API_POST_QUERY_DOCTOR_INFO = baseUrl+'sys/doctorApply/queryDoctorApplyInfo';//查询医生详情
export const API_POST_CHANGE_DOCTOR_STATUS = baseUrl+'sys/doctorApply/changeDoctorStatus';//同意或拒绝医生认证


//财务管理
export const API_POST_LIST_ACCOUNT_RECORD = baseUrl+'ins/withdraw/listAccountRecord';//提现列表
export const API_POST_UPDATE_APPLY_STATUS= baseUrl+'ins/withdraw/updateApplyStatus';//更新提现状态 同意或拒绝提现
export const API_POST_EXPORT_WITHDRAW= baseUrl+'ins/withdraw/exportAccountRecord';//导出提现记录





export const API_POST_COUNT_USER_NEWSLIST= baseUrl+'ins/usernewsreal/countUserNewsList';//未读消息列表
export const API_POST_UNREAD_UPDATE_BATCH= baseUrl+'ins/usernewsreal/updateBatch';//设置未读消息为已读




//订单管理
export const API_GET_LIST_ORDER_REFUND = baseUrl+'ins/orderRefund/listOrderRefund';//退款列表
export const API_GET_LIST_ORDER_CHANGE_R = baseUrl+'ins/orderRefund/listOrderChangeRecord';//退款订单变更
export const API_POST_LIST_ORDER_REFUND = payUrl+'pay/api/trade/orderRefund';//同意退款
export const API_POST_LIST_ORDER_CHANGE_RECORD = baseUrl+'ins/orderRefund/updateOrderRefundStatus';//拒绝退款

export const API_GET_LIST_ALL_INSTITUTION = baseUrl+'ins/institution/listAllInstitution';//机构列表
export const API_GET_ALL_SERVICE_INFO = baseUrl+'csp/serviceInfo/getAllServiceInfo';//服务名称


export const API_LIST_SERVICE_dict = baseUrl+'ins/institution/listAllInstitution';//订单列表词典
export const API_TRADE_LIST = baseUrl+'csp/trade/tradeList';//主订单列表
export const API_TRADE_INFO = baseUrl+'csp/trade/tradeInfo';//主订单详情
export const API_CSP_ORDER_LIST = baseUrl+'csp/trade/cspOrderList';//子订单列表
export const API_CSP_ORDER_INFO = baseUrl+'csp/trade/cspOrderInfo';//子订单详情
export const API_INS_GET_REFUNDDETAIL = baseUrl+'ins/orderRefund/getRefundDetail';//退款详情

export const API_CSP_REPORT_DETAIL = baseUrl+'csp/trade/getMedicalReportDetail';//体检报告详情


export const API_LOGIN = baseUrl+'sys/user/login';//登录


//控制台 乐
export const API_POST_GETSYS_NOTICE_INFO = baseUrl+'sys/notice/getSysNoticeInfo';//系统公告循环内容
export const API_POST_LAST_DOCTOR_APPLY_LIST = baseUrl+'sys/workbench/doctorApplyList';//获取最新认证医生列表
export const API_POST_NUMBER_AUTHENTICATION = baseUrl+'sys/workbench/getCountDoctorNumberAuthentication';//获取总的认证人数
export const API_POST_NEW_LISTORDER_REFUSE = baseUrl+'sys/workbench/listOrderRefund';//获取最新退款列表
export const API_POST_CSP_ORDER_NUMBER = baseUrl+'sys/workbench/getCountCspOrderNumber';//获取最新订单数 退款数

