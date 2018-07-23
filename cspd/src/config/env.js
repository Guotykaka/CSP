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

if (process.env.NODE_ENV == 'development') {
  baseUrl = 'http://172.0.0.41:8117/cspd/';
  // baseUrl = 'http://10.50.50.128:8117/cspd/';
  // baseUrl = 'http://HZ2WZSG82:8117/cspd/';
  baseImgPath = '/img/';
}else{
  baseUrl = 'http://172.0.0.41:8117/cspd/';
  baseImgPath = '/img/';
}

export {
  baseUrl,
  routerMode,
  baseImgPath
}

/*登录*/
export const API_LOGIN = baseUrl+'doctor/sys/login';
/*个人中心*/
/*免费图文咨询服务管理*/
export const API_FREE_LIST = baseUrl+'doctor/ins/freeimgtextconsultion/list';//免费图文咨询待处理和已处理列表分页查询
export const API_QUERY_INS_FREE_CONSULT_CHATLIST = baseUrl+'doctor/ins/freeimgtextconsultion/queryInsFreeConsultChatList';//图文咨询聊天记录分页查询
export const API_SEND_TO_CUSTOMER = baseUrl+'doctor/ins/freeimgtextconsultion/sendToCustomer';//健管师回复客户信息
export const API_UPLOAD = baseUrl+'doctor/ins/freeimgtextconsultion/upload';//上传图片

/*医生实体管理控制层*/
export const API_CHANGE_DOCTOR_STATUS = baseUrl+'doctor/changeDoctorStatus';//医生提交取消提交
export const API_GET_CSP_SERVICE_ROLEINFO = baseUrl+'doctor/getCspServiceRoleInfo';//获取角色服务信息
export const API_GET_SERVICE_DOCTOR_SETTING = baseUrl+'doctor/getServiceDoctorSetting';//获取医生服务信息
export const API_GET_DOCTOR_ACCOUNT_INFO = baseUrl+'doctor/ins/doctorAccount/getDoctorAccountInfo';//获取医生账户金额信息
export const API_GET_ORDER_INFO = baseUrl+'doctor/ins/doctorAccount/getOrderInfo';//获取当前登录医生的订单列表
export const API_LIST_ACCOUNT_RECORD = baseUrl+'doctor/ins/doctorAccount/listAccountRecord';//获取提现记录列表
export const API_SAVE_ACCOUNT_RECORD = baseUrl+'doctor/ins/doctorAccount/saveAccountRecord';//添加一条提现记录
export const API_IS_AUTHENTICATION = baseUrl+'doctor/isAuthentication';//查询医生认证状态
export const API_QUERY_DOCTOR_APPLY_INFO = baseUrl+'doctor/queryDoctorApplyInfo';//查看医生审核资料详情
export const API_QUERY_INS_SERVICE_DOCTOR_BY_USERID = baseUrl+'doctor/queryInsServiceDoctorByUserId';//医生设置服务初始化
export const API_SAVE_OR_UPDATE_SERVICE_DOCTOR_SETTING = baseUrl+'doctor/saveOrUpdateServiceDoctorSetting';//保存或者更新医生服务信息
export const API_SUBMIT_DOCTOR_INFO = baseUrl+'doctor/submitDoctorInfo';//医生提交审核资料

/*医生订单*/
export const API_COUNT_UN_READ_MSG = baseUrl+'doctororder/ins/imgtextconsultion/countUnReadMsg';//获取图文咨询当前订单未读消息数量
export const API_COUNT_UN_READ_MSG_BY_ORDER_STATUS = baseUrl+'doctororder/ins/imgtextconsultion/countUnReadMsgByOrderStatus';//获取图文咨询当前用户当前状态所有未读消息数量
export const API_GET_ORDER_NUMBER = baseUrl+'doctororder/ins/imgtextconsultion/getOrderNumber';//获取顶部的统计数量
export const API_IMGTEXT_LIST = baseUrl+'doctororder/ins/imgtextconsultion/list';//图文咨询订单分页查询
export const API_QUERY_TRADE_DETAIL = baseUrl+'doctororder/ins/imgtextconsultion/queryTradeDetail';//查看图文咨询订单详细信息
export const API_UPDATE_TO_INREAD = baseUrl+'doctororder/ins/imgtextconsultion/updateToInRead';//将该客户发给当前医生的未读消息全部更新为已读
export const API_UPDATE_TRADE_DETAIL = baseUrl+'doctororder/ins/imgtextconsultion/updateTradeDetail';//添加图文咨询订单信息备注
export const API_GET_INS_CONSULT_CHAT_BYID = baseUrl+'doctororder/ins/insConsultChat/getInsConsultChatById';//根据编号获取单条聊天详情
export const API_QUERY_INS_CONSULT_CHATLIST = baseUrl+'doctororder/ins/insConsultChat/queryInsConsultChatList';//图文咨询聊天记录分页查询
export const API_QUERY_ORDER_COMMENT = baseUrl+'doctororder/ins/insConsultChat/queryOrderComment';//查看客户评价当前服务信息
export const API_INS_SEND_TO_CUSTOMER = baseUrl+'doctororder/ins/insConsultChat/sendToCustomer';//医生回复客户信息
export const API_INS_UPDATE_CONSULT_CHAT = baseUrl+'doctororder/ins/insConsultChat/updateInsConsultChat';//更新信息
export const API_INS_UPLOAD = baseUrl+'doctororder/ins/insConsultChat/upload';//上传图片

export const API_INS_ORDER_CALL_RECORD_BY_PAGE = baseUrl+'doctororder/ins/phoneconsultation/getInsOrderCallRecordByPage';//电话报告解读 ->分页获取语音列表
export const API_INS_REPORT_DETAIL = baseUrl+'doctororder/ins/phoneconsultation/getMedicalReportDetail';//电话报告解读 ->标准方式查看体检报告
export const API_INS_GET_SMS_TEMPLATE = baseUrl+'doctororder/ins/phoneconsultation/getSMSTemplate';//电话报告解读 -> 获取短信模板
export const API_INS_GET_SERVICE_INFO = baseUrl+'doctororder/ins/phoneconsultation/getServiceInfo';//电话报告解读 ->获取所有服务项
export const API_INS_PHOTO_LIST = baseUrl+'doctororder/ins/phoneconsultation/list';//电话报告解读 ->打电话给用户
export const API_INS_PHOTO_CONSULTATION_ORDER = baseUrl+'doctororder/ins/phoneconsultation/queryPhoneConsultationOrder';//电话报告解读 ->订单分页查询
export const API_INS_SAVE_ORDER_CALL_REPORT = baseUrl+'doctororder/ins/phoneconsultation/saveOrderCallReport';//电话报告解读 ->更新电话报告解读-服务小结
export const API_INS_SEND_SMS = baseUrl+'doctororder/ins/phoneconsultation/sendSMS';//电话报告解读 -> 发送短信消息
export const API_INS_UPDATE_REMARK = baseUrl+'doctororder/ins/phoneconsultation/updateTradeDetailRemark';//电话报告解读 ->更新电话报告解读备注

/*留言板管理*/
export const API_INS_CLOSE_LEAVE_WORD_ANSWER = baseUrl+'doctor/ins/insleaveword/closeInsLeaveWordAnswer';//关闭留言
export const API_INS_QUERY_LEAVE_WORD_ANSWER_LIST = baseUrl+'doctor/ins/insleaveword/queryInsLeaveWordAnswerList';//展开查看当前留言所有回复记录
export const API_INS_QUERY_LEAVE_WORD_LIST = baseUrl+'doctor/ins/insleaveword/queryInsLeaveWordList';//分页查询所有留言
export const API_INS_SAVE_LEAVE_WORD = baseUrl+'doctor/ins/insleaveword/saveInsLeaveWord';//添加留言
export const API_INS_SAVE_LEAVE_WORD_ANSWER = baseUrl+'doctor/ins/insleaveword/saveInsLeaveWordAnswer';//回复留言


/*用户消息管理*/
export const API_COUNT_INS_USER_NEWS_REAL = baseUrl+'doctor/ins/usernewsreal/countInsUserNewsReal';//按条件查询用户各消息状态的总数量
/*此项GET请求*/
export const API_COUNT_USER_NEWS_LIST = baseUrl+'doctor/ins/usernewsreal/countUserNewsList/{userId}';//查询统计各类型消息未读总数记录
export const API_INS_USER_NEWS_REAL_LIST = baseUrl+'doctor/ins/usernewsreal/list';//消息分页查询
export const API_INS_USER_QURY = baseUrl+'doctor/ins/usernewsreal/query';//查看消息详情
export const API_INS_USER_SAVE = baseUrl+'doctor/ins/usernewsreal/save';//新增保存用户消息
export const API_INS_USER_UPDATE = baseUrl+'doctor/ins/usernewsreal/update';//更新保存用户消息
export const API_INS_UPDATE_BATCH = baseUrl+'doctor/ins/usernewsreal/updateBatch';//按类型更新用户消息为已读状态

/*补充菜单*/

export const API_DOCTOR_NAV = baseUrl+'doctor/nav';//获取左侧导航菜单
export const API_SYS_DICTIONARY_BYKEY = baseUrl+'doctor/sys/getDictionaryByKey';//根据key获取字典列表数据详情
export const API_SYS_NOTICE_IFNO = baseUrl+'doctor/sysnotice/getSysNoticeInfo';//getSysNoticeInfo
export const API_SYS_SYSNOTICE_LIST = baseUrl+'doctor/sysnotice/list';//医生端系统公告表列表



