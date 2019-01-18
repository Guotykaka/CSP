/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * baseImgPath: 图片存放地址
 *
 */
let baseUrl = '';
let baseUrlY = '';
let routerMode = 'hash';
let youPaiYunInfo = {};
let save_img_key = "";
let save_key_img = "";
let date = Date.parse(new Date());
///cspd/doctor/getInsDoctorInfo
if (process.env.NODE_ENV === 'development') {
  // baseUrl = 'http://HZ2WZSG82:8117/cspd/';//唐生平
  // baseUrl = 'http://10.50.50.116:8117/cspd/';//席涛涛
  // baseUrl = 'http://10.50.50.118:8117/cspd/';//小丰
    baseUrl = 'http://172.0.0.151:8117/cspd/';
    baseUrlY = 'http://172.0.0.151:8117/cspo/';
  // baseUrlY = 'http://10.50.50.116:8117/cspo/';



  save_img_key = "/test/img/{year}{mon}{day}" + date + "{.suffix}";
  save_key_img = "/test/img/{year}{mon}{day}/";
  //又拍云账号
  youPaiYunInfo = {
    bucketname: 'zhangshangtijian', //服务名
    username: 'hztest', //操作员账号
    password: 'a1234567'//操作员密码
  }
}else if (process.env.NODE_ENV === 'testing') {
  /*又拍云账号*/
  youPaiYunInfo = {
    bucketname: 'zhangshangtijian', //服务名
    username: 'hztest', //操作员账号
    password: 'a1234567'//操作员密码
  };
  /*测试环境*/
  baseUrl = 'http://172.0.0.151:8117/cspd/';
  // baseUrl = 'http://10.50.50.159:8117/cspd/';
  baseUrlY = 'http://172.0.0.151:8117/cspo/';
  // baseUrlY = 'http://10.50.50.159:8117/cspo/';
  save_img_key = "/test/img/{year}{mon}{day}" + date + "{.suffix}";
  save_key_img = "/test/img/{year}{mon}{day}/";
}else if (process.env.NODE_ENV === 'production') {
  /*生产环境*/
  /*又拍云账号*/
  youPaiYunInfo = {
    bucketname: 'zhangshangtijian', //服务名
    username: 'hztest', //操作员账号
    password: 'a1234567'//操作员密码
  };
  baseUrl = 'http://webapi.ybzstj.com/cspd/';
  baseUrlY = 'http://webapi.ybzstj.com/cspo/';
  save_img_key = "/WebCspo/img/{year}{mon}{day}" + date + "{.suffix}";
  save_key_img = "/WebCspo/ChatImg/{year}{mon}{day}";

}

export {
  baseUrl,
  baseUrlY,
  save_img_key,
  routerMode,
  save_key_img
}
/*又拍云账号*/
export const YOUPAIYUNINFO = youPaiYunInfo;
/*登录*/
export const API_LOGIN = baseUrlY + 'system/user/login';
//修改密码/cspo/system/user/updatePassword
export const API_RESET_PASSWORD = baseUrlY + 'system/user/updatePassword';
/*个人中心*/
/*医生实体管理控制层*/
export const API_CHANGE_DOCTOR_STATUS = baseUrl + 'doctor/changeDoctorStatus';//医生提交取消提交
export const API_GET_CSP_SERVICE_ROLEINFO = baseUrl + 'doctor/getCspServiceRoleInfo';//获取角色服务信息
export const API_GET_SERVICE_DOCTOR_SETTING = baseUrl + 'doctor/getServiceDoctorSetting';//获取医生服务信息
export const API_GET_DOCTOR_ACCOUNT_INFO = baseUrl + 'doctor/ins/doctorAccount/getDoctorAccountInfo';//获取医生账户金额信息
export const API_GET_ORDER_INFO = baseUrl + 'doctor/ins/doctorAccount/getOrderInfo46';//获取当前登录医生的订单列表
export const API_LIST_ACCOUNT_RECORD = baseUrl + 'doctor/ins/doctorAccount/listAccountRecord';//获取提现记录列表
export const API_SAVE_ACCOUNT_RECORD = baseUrl + 'doctor/ins/doctorAccount/saveAccountRecord';//添加一条提现记录
//export const API_IS_AUTHENTICATION = baseUrl + 'doctor/isAuthentication';//查询医生认证状态
export const API_GET_INSDOCTOR_INFO = baseUrl + 'doctor/getInsDoctorInfo';//获取医生详情
export const API_QUERY_DOCTOR_APPLY_INFO = baseUrl + 'doctor/queryDoctorApplyInfo';//查看医生审核资料详情
export const API_QUERY_INS_SERVICE_DOCTOR_BY_USERID = baseUrl + 'doctor/queryInsServiceDoctorByUserId';//医生设置服务初始化
export const API_SAVE_OR_UPDATE_SERVICE_DOCTOR_SETTING = baseUrl + 'doctor/saveOrUpdateServiceDoctorSetting';//保存或者更新医生服务信息
export const API_SUBMIT_DOCTOR_INFO = baseUrl + 'doctor/submitDoctorInfo';//医生提交审核资料


export const API_LIST_PRODUCT_MODEL_INFO = baseUrl + 'productInfo/listProductModelInfo';//获取医生服务及模板 乐2108/8/16
export const API_UPDATE_PRODUCTION_STATUS = baseUrl + 'productInfo/updateProductInfoStatus';//更新医生商品状态 乐2108/8/16
export const API_SAVE_UPDATE_INFO = baseUrl + 'productInfo/SaveOrUpdateProductInfo';//开通服务 乐2108/8/16
export const API_LIST_PRODUCT_INFO = baseUrl + 'productInfo/listProductInfo';//获取商品列表

/*图文咨询*/
export const API_COUNT_UN_READ_MSG = baseUrl + 'doctororder/ins/imgtextconsultion/countUnReadMsg';//获取图文咨询当前订单未读消息数量
export const API_COUNT_UN_READ_MSG_BY_ORDER_STATUS = baseUrl + 'doctororder/ins/imgtextconsultion/countUnReadMsgByOrderStatus46';//获取图文咨询当前用户当前状态所有未读消息数量
export const API_GET_ORDER_NUMBER = baseUrl + 'doctororder/ins/imgtextconsultion/getOrderNumber46';//获取顶部的统计数量
export const API_IMGTEXT_LIST = baseUrl + 'doctororder/ins/imgtextconsultion/list46';//图文咨询订单分页查询
export const API_QUERY_TRADE_DETAIL = baseUrl + 'doctororder/ins/imgtextconsultion/queryTradeDetail46';//查看图文咨询订单详细信息
export const API_UPDATE_TO_INREAD = baseUrl + 'doctororder/ins/imgtextconsultion/updateToInRead';//将该客户发给当前医生的未读消息全部更新为已读
export const API_UPDATE_TRADE_DETAIL = baseUrl + 'doctororder/ins/imgtextconsultion/updateTradeDetail46';//添加图文咨询订单信息备注
export const API_GET_INS_CONSULT_CHAT_BYID = baseUrl + 'doctororder/ins/insConsultChat/getInsConsultChatById';//根据编号获取单条聊天详情
export const API_QUERY_INS_CONSULT_CHATLIST = baseUrl + 'doctororder/ins/insConsultChat/queryInsConsultChatList';//图文咨询聊天记录分页查询
export const API_QUERY_ORDER_COMMENT = baseUrl + 'doctororder/ins/insConsultChat/queryOrderComment46';//查看客户评价当前服务信息
export const API_INS_SEND_TO_CUSTOMER = baseUrl + 'doctororder/ins/insConsultChat/sendToCustomer46';//医生回复客户信息
export const API_INS_UPDATE_CONSULT_CHAT = baseUrl + 'doctororder/ins/insConsultChat/updateInsConsultChat';//更新信息

/*免费图文咨询服务管理*/
export const GET_APP_SHOP_PRODUCTLIST_FREE = baseUrl + 'doctor/ins/freeconsultion/getAppShopProductList';//查看所有配置的可推荐的供应链商品列表
export const API_APPLIST_EXAMADDITION = baseUrl + 'doctororder/appListAppExamAddition';//获取可购买加项列表
export const API_APPLIST_EXAMSUIT_DETAIL = baseUrl + 'doctororder/appListAppExamSuiteDetail';//获取预约套餐详情（免费检查项目）
export const API_GET_CONSULT_LIST = baseUrl + 'doctor/ins/freeconsultion/getConsultList';//获取当前用户咨询记录
export const API_GET_DUNREPLAY_COUNT = baseUrl + 'doctor/ins/freeconsultion/getDUnReplayCount';//获取当前用户未回复消息数量
export const API_GET_PROCESSED_LIST = baseUrl + 'doctor/ins/freeconsultion/getProcessedList';//获取当前健管师已处理列表
export const API_GET_TOBE_TREATED_LIST = baseUrl + 'doctor/ins/freeconsultion/getToBeTreatedList';//获取当前健管师待处理列表
export const API_SEND_TO_CUSTOMER = baseUrl + 'doctor/ins/freeconsultion/sendToCustomer';//健管师回复客户信息
export const API_HEALTH_LIST = baseUrl + 'doctor/ins/freeconsultion/healthList';//查询健管师列表
export const API_SEARCH_CONSULT_LIST = baseUrl + 'doctor/ins/freeconsultion/searchConsultList';//按查询条件获取咨询记录
export const GET_APP_SHOP_PRODUCTLIST = baseUrl + 'doctor/sys/sysUserconsult/getAppShopProductList';//查看所有配置的可推荐的供应链商品列表

/*电话报告解读*/
export const API_INS_ORDER_CALL_RECORD_BY_PAGE = baseUrl + 'doctororder/ins/phoneconsultation/getInsOrderCallRecordByPage';//电话报告解读 ->分页获取语音列表
// export const API_INS_REPORT_DETAIL = baseUrl + 'doctororder/ins/phoneconsultation/getMedicalReportDetail';//电话报告解读 ->标准方式查看体检报告
export const API_INS_REPORT_DETAIL = baseUrl + 'doctororder/ins/phoneconsultation/getBaseReportDetailInfo';//电话报告解读 ->标准方式查看体检报告New
export const API_INS_GET_SERVICE_INFO = baseUrl + 'doctororder/ins/phoneconsultation/getServiceInfo';//电话报告解读 ->获取所有服务项
export const API_INS_PHOTO_LIST = baseUrl + 'doctororder/ins/phoneconsultation/call';//电话报告解读 ->打电话给用户

export const API_INS_PHOTO_CONSULTATION_ORDER = baseUrl + 'doctororder/ins/phoneconsultation/queryPhoneConsultationOrder46';//电话报告解读 ->订单分页查询
export const API_INS_SAVE_ORDER_CALL_REPORT = baseUrl + 'doctororder/ins/phoneconsultation/saveOrderCallReport46';//电话报告解读 ->更新电话报告解读-服务小结
export const API_INS_SEND_SMS = baseUrl + 'doctororder/ins/phoneconsultation/sendSMS46';//电话报告解读 -> 发送短信消息
export const API_INS_UPDATE_REMARK = baseUrl + 'doctororder/ins/phoneconsultation/updateTradeDetailRemark46';//电话报告解读 ->更新电话报告解读备注

/*转单页面*/
export const API_GET_DOCOTOR_LIST = baseUrl + 'doctor/getDoctorList';//获取所有已经认证的医生列表
export const API_SLIP_ORDER_LIST = baseUrl + 'doctororder/phoneOrder/phoneConsultSlipOrderList';//转单页面 过期
export const API_DISTRIBUTION_ORDER_LIST = baseUrl + 'doctororder/phoneOrder/phoneConsultDistributionOrderList';//转单页面 待分配
export const API_UPDATE_APPOINTMENT_TIME = baseUrl + 'doctororder/phoneOrder/updatePhoneOrderAppointmentTime';//转单页面 更改预约时间
export const API_MULTIPLE_DOCTOR = baseUrl + 'doctororder/phoneOrder/getMultipleDoctorer';//转单页面 获取多个医生
export const API_DISTRIBUTION_DOCTOR = baseUrl + 'doctororder/phoneOrder/distributionDoctorer';//转单页面 分配医生
export const API_TIME_ORDER_CALL = baseUrl + 'doctororder/ins/phoneconsultation/appointmentTimeOrderCall';//转单页面 打电话给用户
export const API_JOIN_APPOINTMENT_POOL = baseUrl + 'doctororder/phoneOrder/JoinAppointmentPool';//订单监控 ->加入预约池
export const CUSTOMER_PERSON_NELTO_ACCOUNT_CALL = baseUrl + 'doctororder/ins/phoneconsultation/customerPersonnelToAccountCall';//预约订单打电话给用户 ->客户人员带电话给用户


export const API_GET_ORDER_LIST = baseUrl + 'doctororder/getOrderList';//导出订单 获取订单
export const API_EXPORT_EXCEL = baseUrl + 'doctororder/exportDoctorOrderExcel';//导出订单 获取订单
export const API_REPORT_EXCEL = baseUrl + 'freeConsultChatReport/exportFreeConsultChatReportExcel';//导出免费咨询统计Excel
export const API_EXPORT_APPOINTMENT_EXCEL = baseUrl + 'doctororder/exportDoctorOrderByAppointmentTimeExcel';//订单监控->导出医生端医生订单监控列表Excel

/*留言板管理*/
export const API_INS_CLOSE_LEAVE_WORD_ANSWER = baseUrl + 'doctor/ins/insleaveword/closeInsLeaveWordAnswer';//关闭留言
export const API_INS_QUERY_LEAVE_WORD_ANSWER_LIST = baseUrl + 'doctor/ins/insleaveword/queryInsLeaveWordAnswerList';//展开查看当前留言所有回复记录
export const API_INS_QUERY_LEAVE_WORD_LIST = baseUrl + 'doctor/ins/insleaveword/queryInsLeaveWordList';//分页查询所有留言
export const API_INS_SAVE_LEAVE_WORD = baseUrl + 'doctor/ins/insleaveword/saveInsLeaveWord';//添加留言
export const API_INS_SAVE_LEAVE_WORD_ANSWER = baseUrl + 'doctor/ins/insleaveword/saveInsLeaveWordAnswer';//回复留言


/*用户消息管理*/
export const API_COUNT_INS_USER_NEWS_REAL = baseUrl + 'doctor/ins/usernewsreal/countInsUserNewsReal';//按条件查询用户各消息状态的总数量
export const API_COUNT_USER_NEWS_LIST = baseUrl + 'doctor/ins/usernewsreal/countUserNewsList';//查询统计各类型消息未读总数记录
export const API_INS_USER_NEWS_REAL_LIST = baseUrl + 'doctor/ins/usernewsreal/list';//消息分页查询
export const API_INS_USER_QURY = baseUrl + 'doctor/ins/usernewsreal/query';//查看消息详情
export const API_INS_USER_SAVE = baseUrl + 'doctor/ins/usernewsreal/save';//新增保存用户消息
export const API_INS_USER_UPDATE = baseUrl + 'doctor/ins/usernewsreal/update';//更新保存用户消息
export const API_INS_UPDATE_BATCH = baseUrl + 'doctor/ins/usernewsreal/updateBatch';//按类型更新用户消息为已读状态
export const SEARCHED_CUSTOMER_LIST = baseUrl + 'doctor/sys/sysUserconsult/medicalSearchedCustomerList';//复检建议按条件搜索聊天过的用户

/*补充菜单*/
export const API_DOCTOR_NAV = baseUrlY + 'system/menu/getUserLeftNav';//获取左侧导航菜单
export const API_SYS_DICTIONARY_BYKEY = baseUrl + 'doctor/sys/getDictionaryByKey';//根据key获取字典列表数据详情
export const API_SYS_NOTICE_IFNO = baseUrl + 'doctor/sysnotice/getSysNoticeInfo';//getSysNoticeInfo
export const API_SYS_SYSNOTICE_LIST = baseUrl + 'doctor/sysnotice/list';//医生端系统公告表列表

/*健康管理start*/
//用户分组管理
export const MEDICAL_GROUP = baseUrl + 'medical/group/delMedicalGroup';//删除分组
export const MEDICAL_GROUP_DETAIL = baseUrl + 'medical/group/getMedicalGroupDetail';//分组信息详情
export const MEDICAL_GROUP_LIST = baseUrl + 'medical/group/getMedicalGroupList';//获取分组列表
export const MEDICAL_SAVE_GROUP = baseUrl + 'medical/group/saveMedicalGroup';//新增分组
export const MEDICAL_UPDATE_GROUP = baseUrl + 'medical/group/updateMedicalGroup';//更新分组
export const MEDICAL_GET_ABNORMAL_ITEM = baseUrl + 'medical/group/getAbnormalItem';//异常项看板
export const MEDICAL_GET_GROUP_USER_LIST = baseUrl + 'medical/group/getGroupUserList';//获取分组下的用户信息
export const MEDICAL_LABEL_NAME_LIST = baseUrl + 'medical/group/getMedicalLabelIdNameList';//标签id、name下拉框列表
export const MEDICAL_GET_USER_REPORT = baseUrl + 'medical/group/getUserReport';//获取用户的体检报告
//复检建议计划管理
export const RECHECK_ADD_PLAN = baseUrl + 'medical/recheckplan/addPlan';//新增复检建议计划
export const RECHECK_END_PLAN = baseUrl + 'medical/recheckplan/endPlan';//终止复检建议计划
export const RECHECK_GROUP_NAME_LIST = baseUrl + 'medical/recheckplan/getMedicalGroupIdNameList';//用户医学分组id、name下拉框列表
export const RECHECK_GET_PLAN_LIST = baseUrl + 'medical/recheckplan/getPlanList';//查看计划列表
export const HAVE_ENOUGH_SMSAMOUNT = baseUrl + 'medical/recheckplan/haveEnoughSmsAmount';//查看机构是否还有短信额度
export const GET_SMS_TEMPLATES = baseUrl + 'medical/recheckplan/getSmsTemplates';//查看短信模板

/*健康管理end*/
/*用户免费咨询管理start*/
export const USER_GET_CONSULT_LIST = baseUrl + 'doctor/sys/sysUserconsult/getConsultList';//获取当前用户咨询记录
export const USER_GET_PROCESSED_LIST = baseUrl + 'doctor/sys/sysUserconsult/getProcessedList';//获取当前健管师已处理列表
export const USER_GET_TO_BE_TREATED_LIST = baseUrl + 'doctor/sys/sysUserconsult/getToBeTreatedList';//获取当前健管师待处理列表
export const USER_SEND_TO_CUSTOMER = baseUrl + 'doctor/sys/sysUserconsult/userSendToCustomer';//回复客户信息
export const SEND_RECHECK_SUGGESTTION = baseUrl + 'doctor/sys/sysUserconsult/sendRecheckSuggestion';//填写并发送复检建议
export const USER_GET_PRODUCT_INFO = baseUrlY + 'productInfo/getProductInfo';//获取单个商品信息
export const HAVE_RECHECK_SUGGESTION = baseUrl + 'medical/recheckplan/haveRecheckSuggestion';//查看体检报告是否有复检建议
export const SEE_RECHECK_SUGGESTION = baseUrl + 'medical/recheckplan/getRecheckSuggestionByWorkNo';//查看复检建议

export const ADD_CUSTOMER_REMARK = baseUrl + 'medical/common/addCustomerRemark';//添加用户备注
export const GET_CUSTOMER_REMARK = baseUrl + 'medical/common/getCustomerRemark';//查看用户备注
/*用户免费咨询管理end*/

/*数据看板*/
export const USER_GET_SHOW_REPOTDATA = baseUrl + 'medical/directorboard/showReportDataBoard';//数据看板
export const USER_GET_SHOW_ABNORMAL = baseUrl + 'medical/directorboard/showAbnormalItemBoard';//异常项看板
export const USER_GET_SHOW_PLANBOARD = baseUrl + 'medical/directorboard/showPlanBoard';//计划看板
export const USER_GET_SHOW_PLANDETAIL = baseUrl + 'medical/directorboard/showPlanDetail';//计划明细
/*服务设置*/
export const USER_GET_DOCTOR_OP_LIST = baseUrl + 'servicesetting/doctorOptionList';//服务医生下拉
export const USER_GET_SERVICE_DOCTOR = baseUrl + 'servicesetting/getServiceDoctor';//查看服务医生
export const USER_SET_SERVICE_DOCTOR = baseUrl + 'servicesetting/setServiceDoctor';//修改服务医生

/*个检预约管理*/

export const GET_EXAM_RESERVE_DETAIL = baseUrl + 'examManage/getExamReserveDetail';//查看体检预约套餐详情
export const GET_EXAM_RESERVE_LIST = baseUrl + 'examManage/getExamReserveList';//个检预约列表
export const UPDATE_RESERVE_STATUS = baseUrl + 'examManage/updateReserveStatus';//更新个检预约状态
export const API_GET_PRODUCT_INFO = baseUrlY + 'productInfo/getProductInfo';//获取单个商品信息
export const API_SELECT_SUPPLIER = baseUrlY + 'supplier/listAllSupplierInfo';//供应商下拉菜单
/*健康档案*/
export const HEALTH_RECORD_CHECK_DATA_LIST = baseUrl + 'report/getHealthRecordCheckDataList';//健康档案查看报告列表
