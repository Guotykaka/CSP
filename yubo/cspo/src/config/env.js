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
let save_img_key = "";
let save_video_key = "";
let preview_path = "";
let institutionUrl = "";//机构信息管理列表地址
let inslongLink = '';
let extensImgKey = '';
let ZSTJAppSecret = '1!2@3#4$5%6^';
let envInsLogoUrl = '';
let envInsImageUrl = '';
let previwUrl = '';

if (process.env.NODE_ENV === 'development') {
  // baseUrl = 'http://10.50.50.116:8117/cspo/';//taotao
  // baseUrl = 'http://hz2wzsg82:8117/cspo/';//tang
  // baseUrl = 'http://10.50.50.126:8117/cspo/';
  // baseUrl = 'http://10.50.50.134:8117/cspo/';//tang
  baseUrl = 'http://172.0.0.151:8117/cspo/';

  payUrl = 'http://172.0.0.151:8115/pay/';
  save_img_key = "/test/img/{year}{mon}{day}/";
  save_video_key = "/video/{year}{mon}{day}/";
  preview_path ='http://172.0.0.151:805/';
  institutionUrl='http://172.0.0.42:1008/TitleNew.html#/title/';//旧机构接口
  inslongLink = 'http://172.0.0.42:1008/SpacePush.html#/promotion/';//旧机构接口
  extensImgKey = '/test/default/DepartHtml5Pic/';
  envInsLogoUrl = 'http://zhangshangtijian.b0.upaiyun.com/test/default/DepartHtml5Pic/logo_';
  envInsImageUrl = 'http://zhangshangtijian.b0.upaiyun.com/test/default/DepartHtml5Pic/bg_';
  previwUrl = 'http://h5.yubo.com/TitleNew.html#/myInstitution/'//预览地址
} else if (process.env.NODE_ENV === 'testing') {
  /*测试环境*/
  /*测试环境*/
  baseUrl = 'http://172.0.0.151:8117/cspo/';
  payUrl = 'http://172.0.0.151:8115/pay/';
  save_img_key = "/test/img/{year}{mon}{day}/";
  save_video_key = "/video/{year}{mon}{day}/";
  preview_path = 'http://172.0.0.151:805/';
  institutionUrl='http://172.0.0.151:805/TitleNew.html#/title/';//旧机构接口
  inslongLink = 'http://172.0.0.151:805/SpacePush.html#/promotion/';
  extensImgKey = '/test/default/DepartHtml5Pic/';
  envInsLogoUrl = 'http://zhangshangtijian.b0.upaiyun.com/test/default/DepartHtml5Pic/logo_';
  envInsImageUrl = 'http://zhangshangtijian.b0.upaiyun.com/test/default/DepartHtml5Pic/bg_';
  previwUrl = 'http://172.0.0.151:805/TitleNew.html#/myInstitution/'//预览地址



 /* baseUrl = 'http://10.50.50.159:8117/cspo/';
  payUrl = 'http://10.50.50.159:8115/pay/';
  save_img_key = "/test/img/{year}{mon}{day}/";
  save_video_key = "/video/{year}{mon}{day}/";
  preview_path = 'http://10.50.50.159:1008/';
  institutionUrl='http://10.50.50.159:1008/TitleNew.html#/title/';
  inslongLink = 'http://10.50.50.159:1008/SpacePush.html#/promotion/';
  extensImgKey = '/test/default/DepartHtml5Pic/';
  envInsLogoUrl = 'http://zhangshangtijian.b0.upaiyun.com/test/default/DepartHtml5Pic/logo_';
  envInsImageUrl = 'http://zhangshangtijian.b0.upaiyun.com/test/default/DepartHtml5Pic/bg_';
  previwUrl = 'http://10.50.50.159:1009/TitleNew.html#/myInstitution/'//预览地址*/
} else if (process.env.NODE_ENV === 'production') {
  /*生产环境*/
  baseUrl = 'http://webapi.ybzstj.com/cspo/';
  payUrl = 'http://payapi.ybzstj.com/pay/';
  save_img_key = "/WebCspo/img/{year}{mon}{day}/";
  save_video_key = "/video/{year}{mon}{day}/";
  preview_path = 'http://h5.ybzstj.com/';
  institutionUrl='http://webapp.ybzstj.com/TitleNew.html#/title/';
  inslongLink = 'http://webapp.ybzstj.com/SpacePush.html#/promotion/';//地推短连接
  extensImgKey = '/default/DepartHtml5Pic/';
  envInsLogoUrl = 'http://zhangshangtijian.b0.upaiyun.com/default/DepartHtml5Pic/logo_';
  envInsImageUrl = 'http://zhangshangtijian.b0.upaiyun.com/default/DepartHtml5Pic/bg_';
  previwUrl = 'http://h5.ybzstj.com/TitleNew.html#/myInstitution/'//预览地址
}

export {
  baseUrl,
  save_img_key,
  save_video_key,
  institutionUrl,
  routerMode,
  preview_path,
  inslongLink,
  ZSTJAppSecret,
  extensImgKey,
  envInsLogoUrl,
  envInsImageUrl,
  previwUrl
}

/*测试*/
export const AAAA_API = baseUrl + 'csp/utils/utilTestTwo';//分页查询所有留言
/*个人中心*/
export const API_QUERY_INS_LEAVE_WORDLIST = baseUrl + 'ins/insleavewordanswer/queryInsLeaveWordList';//分页查询所有留言
export const API_SAVE_INS_LEAVE_WORDANSWER = baseUrl + 'ins/insleavewordanswer/saveInsLeaveWordAnswer';//回复所有留言
export const API_QUERY_INS_LEAVE_WORDANSWERLIST = baseUrl + 'ins/insleavewordanswer/queryInsLeaveWordAnswerList';//展开查看当前留言回复记录
export const API_CLOSE_INS_LEAVE_WORDANSWER = baseUrl + 'ins/insleavewordanswer/closeInsLeaveWordAnswer';//关闭当前留言
export const API_POST_CSP_USER_PASSWORD = baseUrl + 'system/user/updatePassword';//修改登录用户密码

/*系统管理*/
export const API_POST_LIST_NOTICE = baseUrl + 'sys/notice/list';//公告列表
export const API_POST_INFO_NOTICE = baseUrl + 'sys/notice/info';//公告详情
export const API_POST_STATUS_NOTICE = baseUrl + 'sys/notice/updateStatus';//公告状态
export const API_POST_DELETE_NOTICE = baseUrl + 'sys/notice/delete';//删除公告
export const API_POST_UPDATE_NOTICE = baseUrl + 'sys/notice/update';//修改公告
export const API_POST_SAVE_NOTICE = baseUrl + 'sys/notice/save';//新增公告
//export const API_POST_LIST_USER = baseUrl + 'sys/user/list';//用户列表
export const API_LIST_USER = baseUrl + 'system/user/listMrUser';//获取用户列表
export const API_POST_INFO_USER = baseUrl + 'system/user/getMrUser';//查看用户详情

/*用户管理*/

export const API_POST_UPDATE_USER = baseUrl + 'sys/user/update';//保存用户
export const API_POST_SAVE_USER = baseUrl + 'system/user/saveOrUpdateUser';//新增用户
export const API_POST_DELETE_USER = baseUrl + 'system/user/updateUserStatus';//禁用用户
export const API_POST_PASSWORD_USER = baseUrl + 'system/user/resetPassword';//修改用户密码

export const API_POST_LIST_WITH_NOPARAM = baseUrl + 'system/role/listMrRole';//角色列表
export const API_POST_LIST_ROLE = baseUrl + 'system/role/pageListRoles';//获取列表
export const API_GET_INFO_ROLE = baseUrl + 'system/role/getRole';//角色详情信息
export const API_POST_SAVE_ROLE = baseUrl + 'system/role/saveOrUpdateRole';//新增角色
export const API_POST_UPDATE_ROLE = baseUrl + 'system/role/saveOrUpdateRole';//修改角色
export const API_POST_DELETE_ROLE = baseUrl + 'system/role/updateUserStatus';//删除角色
export const API_POST_SUPPERLIER_LIST = baseUrl + '/supplier/listAllSupplierInfo';//获取供应商列表

/*日志管理*/
export const API_POST_LIST_TEMPLATE = baseUrl + 'bd/template/list';//消息模板列表
export const API_POST_UPDATE_TEMPLATE = baseUrl + 'bd/template/update';//修改
export const API_POST_SAVE_TEMPLATE = baseUrl + 'bd/template/save';//新增
export const API_POST_DELETE_TEMPLATE = baseUrl + 'bd/template/delete';//删除
export const API_POST_LIST_CSP_MESSAGE = baseUrl + 'csp/exception/listCspMessage';//异常日志管理
export const API_POST_LIST_PAY_MESSAGE = baseUrl + 'csp/exception/listCspPayMessage';//支付日志列表

/*菜单管理*/
export const API_POST_MENU_DELETE = baseUrl + 'system/menu/deleteMenu';//删除菜单=
export const API_POST_MENU_GETLEFTNAV = baseUrl + 'system/menu/getUserLeftNav';//获取左侧导航菜单
export const API_POST_MENU_GETMENULIST = baseUrl + 'system/menu/listAllMenu';//查询所有菜单列表
export const API_POST_MENU_BYCATEGORY = baseUrl + 'system/menu/listMrMenuByCategory';//获取所有菜单列表(医生或运营)=
export const API_POST_MENU_MENUBYCATEGORY = baseUrl + 'sys/menu/getSysMenuByCategory';//选择菜单(添加、修改菜单)
export const API_POST_MENU_GETSYSMENUBYID = baseUrl + 'system/menu/getSysMenu';//获取菜单信息=获取菜单信息详情
export const API_POST_MENU_LISTBYCATEGORY = baseUrl + 'sys/menu/listByCategory';//根据角色类别加载菜单信息
export const API_POST_MENU_SAVE = baseUrl + 'system/menu/saveOrUpdateMenu';//保存菜单信息=保存或修改菜单信息
export const API_POST_MENU_UPDATE = baseUrl + 'sys/menu/update';//修改菜单

/*数据字典*/
export const API_GET_DICTLISTBY_TYPE = baseUrl + 'sys/dict/getDictListByType';//根据type获取字典列表

/*系统常量*/
export const API_POST_DELETE_DICTIONARY = baseUrl + 'sys/dictionary/deleteDictionary';//删除字典列表数据
export const API_POST_GETDICTIONARY_BY_KEY = baseUrl + 'sys/dictionary/getDictionaryByKey';//根据key获取字典列表数据详情
export const API_POST_GETDICTIONARY_INFO = baseUrl + 'sys/dictionary/getDictionaryInfo';//获取字典列表数据详情
export const API_GET_LIST_DICTIONARY = baseUrl + 'sys/dictionary/listDictionary';//获取字典列表数据(GET请求)
export const API_POST_SAVE_OR_UPDATAE_DICTIONARY = baseUrl + 'sys/dictionary/saveOrUpdateDictionary';//获取字典列表数据
export const API_GET_LISTOROVINCE = baseUrl + 'sys/region/listProvinceRegion';//获取省级区域列表信息
export const API_GET_LISTOROVINCE_CHILD = baseUrl + 'sys/region/listChildrenRegion';//获取下级区域列表信息（地级市、县级市）

/*机构业务*/
export const API_POST_LIST_INSTITUTION = baseUrl + 'ins/institution/list';//机构分页查询
export const API_GET_SHORT_LINK = baseUrl + 'ins/institution/getShortLink';//根据长连接地址转换成短连接地址
export const API_POST_UPDATE_INSTITUTION = baseUrl + 'ins/institution/update';//修改保存机构信息
export const API_POST_SAVE_INSTITUTION = baseUrl + 'ins/institution/save';//新增保存机构信息
export const API_INS_DELETE = baseUrl + 'ins/institution/delete';//删除机构信息
export const API_INS_INFO = baseUrl + 'ins/institution/info';//获取机构信息详情
export const API_INS_LIST_ALL_INSTITUTION = baseUrl + 'ins/institution/listAllInstitution';//获取所有的机构信息
export const LIST_USER_INSTITUTION_ID = baseUrl + 'ins/institution/listAllUserInfoByInstitutionId';//获取当前机构下所有用户列表


/*机构文本管理*/
export const API_INS_DELETEINFO = baseUrl + 'ins/simplecontent/deleteInfo';//删除机构文本
export const API_INS_INFODETAIL = baseUrl + 'ins/simplecontent/infoDetail';//根据编号获取该机构文本管理详情
export const API_INS_LISTINFO = baseUrl + 'ins/simplecontent/listInfo';//机构文本管理分页查询
export const API_INS_SAVEINFO = baseUrl + 'ins/simplecontent/saveInfo';//保存机构文本管理详情
export const API_INS_UPDATEINFO = baseUrl + 'ins/simplecontent/updateInfo';//修改机构文本

/*商品管理——————————————————————————————*/
export const API_GET_LIST_CLASS = baseUrl + 'productModel/listProductModel';//根据商品大类获取商品模板
export const API_SAVE_PRODUCTMODEL = baseUrl + 'productModel/saveProductModel';//添加商品模板
export const API_GET_CATEGORYTYPE = baseUrl + 'productModel/getCategoryType';//商品前端分类枚举
export const API_GET_CLASS_TEBLIST = baseUrl + 'productModel/getGoodsModelType';//商品模板大类(顶部的商品大类tab)
export const API_POT_MODEL_STATUS = baseUrl + 'productModel/updateStatusProductModel';//商品模板Status
export const API_GET_MODEL_INFO = baseUrl + 'productModel/getImgTextConsultProductModel';//图文详情
export const API_GET_PRODUCT_INFO_PHONE = baseUrl + 'productModel/getPhoneConsultProductModel';//获取单条电话报告模板信息
export const API_GET_PRODUCT_INFO_YYT = baseUrl + 'productModel/getOneListenProductModel';//一元听详情
export const API_UPDATE_PRODUCT_MODEL = baseUrl + 'productModel/saveOrUpdateImgTextConsultProductModel';//修改、新增图文模板
export const API_UPDATE_PRODUCT_MODEL_PHONE = baseUrl + 'productModel/savePhoneConsultProductModel';//修改、添加电话模板
export const API_UPDATE_PRODUCT_MODEL_YYT = baseUrl + 'productModel/saveOrUpdateOneListenProductModel';//修改一元听模板
export const API_PRODUCT_DOCTOR_LIST = baseUrl + 'productInfo/getDoctorList';//获取所有已经认证的医生列表
export const API_GET_MODEL_LIST = baseUrl + 'productInfo/listProductInfo';//获取商品列表
export const API_GET_PRODUCT_INFO = baseUrl + 'productInfo/getProductInfo';//获取单个商品信息
export const API_UPDAT_PRO_INFO = baseUrl + 'productInfo/updateProductInfo';//编辑商品
export const API_SAVE_PRO_INFO = baseUrl + 'productInfo/saveOrUpdateOneListenProductInfo';//一元听商品编辑、添加
export const API_SAVE_PRO_INFO_TW = baseUrl + 'productInfo/saveOrUpdateImgTextConsultProductInfo';//图文商品编辑、添加
export const API_SAVE_PRO_INFO_DH = baseUrl + 'productInfo/saveOrUpdatePhoneConsultProductInfo';//电话商品编辑、添加
export const API_POST_PRO_STATUS = baseUrl + 'productInfo/upOrDownOrDelProductInfo';//修改商品状态
export const API_LISTEN_PRODUCT_MANAGEMENT = baseUrl + 'productInfo/listenProductManagement';//一元听商品匹配管理
export const ONE_YUAN_PRODUCT_INDEX_COUNT_LIST = baseUrl + 'productInfo/oneYuanProductIndexCountList';//一元听商品匹配统计（一级，指标名称统计）
export const ONE_YUAN_PRODUCT_RESULT_COUNT_LIST = baseUrl + 'productInfo/oneYuanProductResultCountList';//一元听商品匹配统计（二级，指标结果统计）
export const API_SAVE_OR_EDIT_NDFT = baseUrl + 'productInfo/saveOrUpdateNanDanFeiTeProductInfo';//新增或修改南大菲特商品
export const API_LIST_SLECTE_INTEND = baseUrl + 'productInfo/SelectedIntendedFor';//体检套餐适用人群下拉选项
export const API_GET_LIST_TAG_TAOTAO = baseUrl + 'tag/listTagSelected';//获取标签列表(20181120席涛涛更改一元听和南大菲特，关键字改为标签)
export const API_GET_LIST_PRODUCT_CATEGORY = baseUrl + 'productCategory/pageListProductCategory';//商品类目管理，获取类目列表
export const API_GET_ALL_PRODUCT_CATEGORY = baseUrl + 'productCategory/pageListProductRecommendAppCategory';//商品类目管理，获取类目列表(无分页)
export const API_GET_SELECT_PRODUCT_CATEGORY = baseUrl + 'productCategory/listProductCategory';//下拉列表类目数据
export const API_POST_ADD_OR_UPDATE_PC = baseUrl + 'productCategory/addOrUpdateProductCategory';//添加或修改商品分类
export const API_POST_DELETE_PC = baseUrl + 'productCategory/deleteProductCategory';//删除商品分类
export const API_POST_BATCH_UPDATE_PC = baseUrl + 'productCategory/batchUpdateProductCategoryByIds';//批量修改是否推荐
export const API_POST_SELECT_CONDITION = baseUrl + 'productCategory/listAppCategorySeletedCondition';//类目app筛选条件
export const API_GET_SHOP_RECOMMEND_BAN = baseUrl + 'recommend/bannerRecommendGetList';//获取banner列表
export const API_GET_SHOP_RECOMMEND_BAN_INFO = baseUrl + 'recommend/bannerRecommendGet';//获取banner详情
export const API_SAVE_SHOP_BANNNER = baseUrl + 'recommend/bannerRecommendSave';//SAVEbanner
export const API_SAVE_SHOP_LIMIT = baseUrl + 'recommend/limitTimeActivitySave';//SAVE限时活动
export const API_EDIT_SHOP_BANNNER = baseUrl + 'recommend/bannerRecommendModify';//EDITbanner
export const API_EDIT_SHOP_LIMIT = baseUrl + 'recommend/limitTimeActivityModify';//EDIT限时活动
export const API_GET_SHOP_RECOMMEND_LIM = baseUrl + 'recommend/limitTimeActivityGetList';//获取限时活动列表
export const API_GET_LIST_LIMIT_COUPON = baseUrl + 'coupon/coupontemplate/validCouponTemplateList';//可领的优惠券模板列表
export const API_GET_LIMIT_COUPON_CATEGORY = baseUrl + 'coupon/coupontemplate/productCategoryDropList';//优惠券模板类目下拉框
export const API_GET_SHOP_RECOMMEND_LIM_INFO = baseUrl + 'recommend/limitTimeActivityGet';//获取限时活动详情
export const API_SET_STATUS_RECOMMEND = baseUrl + 'recommend/bannerRecommendModifyOrDeleteOnline';//banner设置状态
export const API_DELETE_STATUS_LIMIT = baseUrl + 'recommend/limitTimeActivityDelete';//删除限时活动
/*医生管理*/
export const API_POST_LIST_DOCTOR = baseUrl + 'sys/doctor/doctorList';//医生列表
export const API_POST_DOCTOR_UPDATE = baseUrl + 'sys/doctor/doctorUpdate';//编辑医生信息
export const API_POST_SERVICE_DICT = baseUrl + 'sys/doctor/serviceDict';//所有服务
export const API_POST_SAVE_SERVICE_SET = baseUrl + 'sys/doctor/saveServiceSet';//设置服务权限
export const API_POST_REST_PASSWORD = baseUrl + 'sys/doctor/resetPassword';//重置密码
export const API_POST_DOCTOR_SAVE = baseUrl + 'sys/doctor/doctorSave';//新增医生
export const API_POST_INSPROPORTION_LIST = baseUrl + 'sys/doctor/listGetInsProportionsByPage';//分成比例列表
export const API_POST_SAVE_INSPROPORTIONS = baseUrl + 'sys/doctor/saveInsProportions';//新增分成项
export const API_POST_DELETE_INSPROPORTIONSENTITY = baseUrl + 'sys/doctor/deleteInsProportionsEntity';//删除分成比例项
export const API_POST_DOCTOR_APPLY_LIST = baseUrl + 'sys/doctorApply/doctorApplyList';//医生认证列表
export const API_POST_QUERY_DOCTOR_INFO = baseUrl + 'sys/doctorApply/queryDoctorApplyInfo';//查询医生详情
export const API_POST_CHANGE_DOCTOR_STATUS = baseUrl + 'sys/doctorApply/changeDoctorStatus';//同意或拒绝医生认证
export const API_SAVE_DOCTOR_TIME = baseUrl + 'sys/doctor/saveOrUpdateDoctorWorkTime';//设置医生服务时间

export const API_POST_LIST_HEALTH = baseUrl + 'system/healthy/pageListHealthyManagers';//健管师列表 乐
export const API_POST_SAVE_HEALTH = baseUrl + 'system/healthy/saveOrUpdateUserScheduling';//新增健管师 乐
export const API_POST_UPDATE_HEALTH = baseUrl + 'system/healthy/saveOrUpdateUserScheduling';//修改健管师 乐
export const API_BATCH_HEALTH_UPDATE = baseUrl + 'system/healthy/batchHealthUpdate';//在线 乐
export const API_LIST_ALL_MR_USER = baseUrl + 'system/user/listAllMrUser';//获取所有已启用用户




/*财务管理*/
export const API_POST_LIST_ACCOUNT_RECORD = baseUrl + 'ins/withdraw/listAccountRecord';//提现列表
export const API_POST_UPDATE_APPLY_STATUS = baseUrl + 'ins/withdraw/updateApplyStatus';//更新提现状态 同意或拒绝提现
export const API_POST_EXPORT_WITHDRAW = baseUrl + 'ins/withdraw/exportAccountRecord';//导出提现记录
export const API_POST_COUNT_USER_NEWSLIST = baseUrl + 'ins/usernewsreal/countUserNewsList';//未读消息列表
export const API_POST_UNREAD_UPDATE_BATCH = baseUrl + 'ins/usernewsreal/updateBatch';//设置未读消息为已读

/*新的订单接口*/
export const API_POST_LIST_ORDER_REFUND = payUrl + 'api/payment/orderRefund';//同意退款
export const API_GET_LIST_ALL_INSTITUTION = baseUrl + 'ins/institution/listAllInstitution';//机构列表
export const API_LOGIN = baseUrl + 'system/user/login';//登录
export const API_GET_EXPORT_ORDER_EXCEL = baseUrl + 'orderInfo/exportOrderExcel';// Get导出订单Excel
// export const API_POST_MEDICAL_REPORT_DETAIL = baseUrl + 'reportInfo/getMedicalReportDetail';//标准方式查看体检报告
export const API_POST_MEDICAL_REPORT_DETAIL = baseUrl + 'reportInfo/getBaseReportDetailInfo';//标准方式查看体检报告new
export const API_POST_ORDER_INFO_DETAIL = baseUrl + 'orderInfo/getOrderInfoDetail';//获取订单详情
export const API_POST_ORDER_LIST = baseUrl + 'orderInfo/getOrderList';//获取订单列表
export const API_POST_TAB_LIST = baseUrl + 'orderInfo/getTabList';//订单列表tab栏
export const API_GET_CATEGORY_TYPE = baseUrl + 'orderInfo/getCategoryType';//商品前端分类枚举
export const API_SYNC_ADDITION_DATA = baseUrl + 'orderInfo/syncAdditionData';//刷新体检加项订单记录
export const ORDER_APPLY_REFUND = baseUrl + 'orderRefund/applyRefund';//订单申请退款
export const UPDATE_TO_FINISH = baseUrl + 'orderInfo/updateToFinish';//直接完成订单
export const UPDATE_TO_TIMEOUT = baseUrl + 'orderInfo/updateToTimeOut';//直接过期订单
export const EXPORT_ORDER_EXCELNEW = baseUrl + 'orderInfo/exportOrderExcelNew';//导出订单Excel（新接口，前端集成CVS）


/*新退管理接口*/
export const API_APPLY_ORDER_REFUND = baseUrl + 'orderRefund/applyOrderRefund';//体检加项订单申请退款
export const API_GET_EXPORT_ORDER_REFUND = baseUrl + 'orderRefund/exportOrderRefund';//导出退款记录(get请求)
export const API_POST_GET_ORDER_REFUND_LIST = baseUrl + 'orderRefund/getOrderRefundList';//获取退款列表
export const API_POST_GET_REFUND_DETAIL = baseUrl + 'orderRefund/getRefundDetail';//获取退款详情
export const API_POST_REFUS_REFUND = baseUrl + 'orderRefund/refuseRefund';//更新退款状态（拒绝退款）

/*控制台 乐*/
export const API_POST_GETSYS_NOTICE_INFO = baseUrl + 'sys/notice/getSysNoticeInfo';//系统公告循环内容
export const API_POST_LAST_DOCTOR_APPLY_LIST = baseUrl + 'sys/workbench/doctorApplyList';//获取最新认证医生列表
export const API_POST_NUMBER_AUTHENTICATION = baseUrl + 'sys/workbench/getCountDoctorNumberAuthentication';//获取总的认证人数
export const API_POST_NEW_LISTORDER_REFUSE = baseUrl + 'sys/workbench/listOrderRefund';//获取最新退款列表
export const API_POST_CSP_ORDER_NUMBER = baseUrl + 'sys/workbench/getCountCspOrderNumber';//获取最新订单数 退款数

/*版本信息*/
export const API_POST_VERSION_LIST = baseUrl + 'sys/appversion/getVersionList';//获取版本控制列表
export const API_POST_REFRESH_VERSION = baseUrl + 'sys/appversion/refreshVersion';//刷新版本信息

/*版本信息2*/
export const API_POST_GET_VERSION = baseUrl + 'sys/appversion/getNewVersionList';//获取版本控制列表
export const API_POST_NEW_VERSION = baseUrl + 'sys/appversion/checkOnLine';//新版本上线
export const API_POST_REFRISH_VERSION_LIST = baseUrl + 'sys/appversion/getList';//新版本上线后列表
export const API_POST_DELETE_NEW_VERSION = baseUrl + 'sys/appversion/deleteNewVersion';//删除版本信息
export const API_POST_MODIFY_NEW_VERSION = baseUrl + 'sys/appversion/modifyVersionStatus';//修改版本信息
export const API_POST_ADD_NEW_VERSION = baseUrl + 'sys/appversion/addNewVersion';//新增版本信息

/*推送信息管理*/
export const API_POST_DELETE_PUSH_IFNO = baseUrl + 'news/pushinfo/deletePushinfo';//删除推送信息
export const API_POST_QUERY_PUSH_TYPE_LIST = baseUrl + 'news/pushinfo/queryPushTypeList';//查询推送类别列表
export const API_POST_QUERY_NEWS_CATEGORY = baseUrl + 'news/pushinfo/queryPushinfoList';//查询推送信息
export const API_POST_SAVE_PUSH_IFNO = baseUrl + 'news/pushinfo/savePushinfo';//添加推送信息

/*标签分类管理*/
export const API_GET_COMMTAG_CATEGORY_NAME = baseUrl + 'news/tagcategory/getCommTagCategoryName';//获取所有一级标签分类
export const API_QUERY_COMMTAG_CATEGORY_LIST = baseUrl + 'news/tagcategory/queryCommTagCategoryList';//获取标签分类列表
export const API_QUERY_COMMTAG_CATEGORYNAME_LIST = baseUrl + 'news/tagcategory/queryCommTagCategoryNameList';//获取标所有标签列表
export const API_SAVE_COMMTAG_CATEGORY = baseUrl + 'news/tagcategory/saveCommTagCategory';//添加标签分类
export const API_UPDATE_COMMTAG_CATEGORY = baseUrl + 'news/tagcategory/updateCommTagCategory';//编辑标签分类
export const API_UPDAGE_TAGCATEGORY_STATUS = baseUrl + 'news/tagcategory/updateTagCategoryStatus';//移除标签分类（修改标签状态）

/*二级标签管理*/
export const API_DELETE_COMMTAG_INFO = baseUrl + 'news/commtaginf/deleteCommTagInfo';//删除标签
export const API_GET_LIST_COMMTAGINFO = baseUrl + 'news/commtaginf/getlistCommTagInfo';//获取所有标签列表
export const API_SAVE_COMMTAG_IFNO = baseUrl + 'news/commtaginf/saveCommTagInfo';//保存标签
export const API_UPDATE_COMMTAG_INFO = baseUrl + 'news/commtaginf/updateCommTagInfo';//编辑标签

/*咨询栏目管理*/
export const API_QUERY_NEWS_CATEGORY = baseUrl + 'news/newscategory/queryNewsCategory';//获取咨询栏目列表
export const API_QUERY_NEWS_CATEGORY_LIST = baseUrl + 'news/newscategory/queryNewsCategoryList';//获取所有咨询栏目列表
export const API_QUERY_NEWS_CATEGROY_NUM = baseUrl + 'news/newscategory/queryNewsCategroyNum';//获取所有咨询栏目序号
export const API_SAVE_NEWS_CATEGORY = baseUrl + 'news/newscategory/saveNewsCategory';//保存栏目（分类）
export const API_UPDATE_NEWS_CATEGORY = baseUrl + 'news/newscategory/updateNewsCategory';//修改栏目信息
export const API_UPDATE_NEWS_CATEGORY_NUM = baseUrl + 'news/newscategory/updateNewsCategoryNum';//修改栏目顺序
export const API_UPDATE_NEWS_CATEGORY_STATUS = baseUrl + 'news/newscategory/updateNewsCategoryStatus';//修改栏目状态（上线：1；下线：2；删除：0）

export const ADD_NEWS_RECOMMEND_INFO = baseUrl + 'news/newscomm/addNewsRecommendInfo';//保存推荐信息【新版本5.1】
export const DELETE_NEWS_RECOMMEND_INFO = baseUrl + 'news/newscomm/deleteNewsRecommendInfo';//删除推荐 【新版本5.1】
export const QUERY_NEWS_RECOMMEND_INFO_LIST = baseUrl + 'news/newscomm/queryNewsRecommendInfoList';//查询推荐列表 【新版本5.1】
export const QUERY_CONTENT_INFO_LIST = baseUrl + 'news/newscomm/queryContentInfoList';//查询(话题，专题，视频对应内容的列表）
export const QUERY_TAG_LIST = baseUrl + 'news/newscomm/queryTagList';//查询全部新标签列表【新版本5.1】
export const QUERY_COLUMNOF_TAGLIST = baseUrl + 'news/newscomm/queryColumnOfTagList';//查询栏目下面图文视频的标签列表 【新版本5.1】
// 【新版本5.1】

/*图文管理 乐*/
export const API_POST_NEWS_INFO_LIST = baseUrl + 'news/newsinfo/getNewsInfoList';//图文管理
export const API_POST_COMMON_TAG_CATEGORY_LIST = baseUrl + 'news/tagcategory/queryCommTagCategoryList';//获取所有标签
export const API_POST_ALL_TOPIC_LIST = baseUrl + 'news/newsinfo/topicNameIdDropList';//获取所有话题
export const API_POST_COMMON_TAG_CATEGORY_NAME_LIST = baseUrl + 'news/tagcategory/queryCommTagCategoryNameList';//二级标签
export const API_POST_QUERY_NEWS_CATEGORY_lIST = baseUrl + 'news/newscategory/queryNewsCategoryList';//获取所有文章分类
export const API_POST_SAVE_NEWS_INFO = baseUrl + 'news/newsinfo/saveNewsInfo';//新增图文
export const API_POST_UPDATE_NEWS_STATUS = baseUrl + 'news/newsinfo/updateNewsInfoState';//修改栏目状态  上线下线  移除
export const API_POST_DOCTOR_CERTIFIED_LIST = baseUrl + 'sys/doctor/queryDoctorCertifiedList';//查询已认证医生
export const API_POST_UPDATE_NEWS_INFO = baseUrl + 'news/newsinfo/updateNewsInfo';//编辑图文

/*工作台管理*/
export const API_GET_INDEX_TRADE_DATA = baseUrl + 'sys/workbench/getIndexTradeData';//获取首页交易详情
export const API_GET_LIST_CSP_MSG = baseUrl + 'csp/message/listCspMessage';//获取消息队列
export const API_SEND_MSG_DIRECT = baseUrl + 'csp/message/sendCspMessageDirect';//重发
export const API_BATCH_DELETE_MESSAGE = baseUrl + 'csp/message/batchDeleteMessage';//批量删除消息

/*体检预约*/
export const API_EXAMAPPOINTMENT_DETAIL = baseUrl + 'examAppointment/getExamAppointmentDetail';//查看预约单下的所有购买的加项信息
export const API_EXAMAPPOINTMENT_LIST = baseUrl + 'examAppointment/getExamAppointmentList';//体检预约列表
export const API_EXAMPERSONNAL_LIST = baseUrl + 'examReserve/getExamReserveList';//个检预约列表
export const API_UPDATE_EXAM_STATUS = baseUrl + 'examReserve/updateReserveStatus';//个检预约修改状态
export const API_PER_EXAM_DETAIL = baseUrl + 'examReserve/getExamReserveDetail';//个检预约查看
export const API_EXAMAPPOINTMENT_MENT = baseUrl + 'examAppointment/updateExamAppointment';//更新体检预约时间
export const API_APPLISTCAN_RESERVATION_DATE = baseUrl + 'examAppointment/appListCanReservationDate';//可预约时间列表

//短信推送CCS
export const API_PUSH_MSG_LIST = baseUrl + 'ccs/ccsplan/queryPlanList';//短信推送列表
export const API_GET_ALLINS = baseUrl + 'ins/institution/getInstitutionCodeNameList';//下拉获取所有机构
export const API_POST_FIRSTPLAN = baseUrl + 'ccs/ccsplan/addFirstPlan';//创建一次计划
export const API_POST_SECONDPLAN = baseUrl + 'ccs/ccsplan/addSecondPlan';//创建二次计划
export const API_POST_SUPPLEPLAN = baseUrl + 'ccs/ccsplan/addSupplementPlan';//创建补发计划
export const API_POST_SUPPLEPLANSEC = baseUrl + 'ccs/ccsplan/addSecondSupplementPlan';//创建补发计划
export const API_POST_DELETEPLAN = baseUrl + 'ccs/ccsplan/deletePlan';//创建补发计划
export const API_GET_MSGTEMPLATE = baseUrl + 'ccs/ccsplan/getMsgTemplate';//查询短信模板
export const API_POST_SUPPLE_NEW_PLAN = baseUrl + 'ccs/ccsplan/addSupplementNewPlan';//创建补发计划(新)
export const API_POST_ADD_OP_PLAN = baseUrl + 'ccs/ccsplan/addOperationalSMS';//创建运营计划
export const API_POST_REMOVE_SUP_NEW = baseUrl + 'ccs/ccsplan/removeSupplementNewPlan';//结束补发计划(新)
export const API_POST_CCS_DETAIL = baseUrl + 'ccs/ccsplan/getOperateCcsDetail';//运营计划详情
export const API_POST_CCS_EDIT = baseUrl + 'ccs/ccsplan/updateOperatorCCSPlan';//运营计划修改




//优惠券
export const API_GET_COUPONT_LIST = baseUrl + 'coupon/coupontemplate/coupontemplatelist';//优惠券列表
export const API_GET_COUPONT_DETAIL = baseUrl + 'coupon/coupontemplate/templateDetail';//优惠券详情
export const API_GET_COUPONT_ADD = baseUrl + 'coupon/coupontemplate/addtemplate';//新增优惠券
export const API_GET_COUPONT_UPDATE = baseUrl + 'coupon/coupontemplate/updatetemplate';//修改优惠券
export const API_GET_COUPONT_PRODUCT = baseUrl + 'coupon/coupontemplate/productIdsList';//优惠券商品下拉

/*报告管理*/
export const API_REPORT_ADD_INFO = baseUrl + 'reportInfo/reportAddInfo';//测试体检报告添加返回数据

/*健康管理start*/
//检查项目管理
export const RECHECK_ADD_CHECK_INDEX = baseUrl + 'recheck/medicalcheckindex/addCheckIndex';//新增检查项目
export const RECHECK_CHECK_INDEX_DETAIL = baseUrl + 'recheck/medicalcheckindex/getMedicalCheckIndexDetail';//查看检查项目详情
export const RECHECK_CHECK_INDEX_LIST = baseUrl + 'recheck/medicalcheckindex/getMedicalCheckIndexList';//查看检查项目列表
export const RECHECK_UPDATE_CHECK_INDEX = baseUrl + 'recheck/medicalcheckindex/updateCheckIndex';//修改检查项目

//标签管理
export const RECHECK_ADD_LABEL = baseUrl + 'recheck/medicallabel/addMedicalLabel';//新增标签
export const RECHECK_BLOCK_MEDICAL_LABEL = baseUrl + 'recheck/medicallabel/blockMedicalLabel';//停用标签
export const RECHECK_INDEX_ID_NAME_LIST = baseUrl + 'recheck/medicallabel/getMedicalCheckIndexIdNameList';//检查项id、name下拉框列表
export const RECHECK_MEDICAL_LABEL_DETAIL = baseUrl + 'recheck/medicallabel/getMedicalLabelDetail';//查看标签详情
export const RECHECK_MEDICAL_LABEL_LIST = baseUrl + 'recheck/medicallabel/getMedicalLabelList';//查看标签项目列表
export const RECHECK_MEDICAL_LABEL = baseUrl + 'recheck/medicallabel/startMedicalLabel';//启用标签
export const RECHECK_UPDATE_LABEL = baseUrl + 'recheck/medicallabel/updateMedicalLabel';//修改标签
//5.1新标签
export const API_QUERY_NEW_TAGLIST = baseUrl + 'news/newscomm/queryCommTagDetailList';//标签列表
export const API_SAVE_NEW_TAGS = baseUrl + 'news/newscomm/saveCommTagDetail';//新增标签
export const API_MODIFY_NEW_TAGS = baseUrl + 'news/newscomm/modifyCommTagDetail';//修改标签
export const API_QUERY_NEW_TAGS = baseUrl + 'news/newscomm/queryCommTagDetail';//标签详情
export const API_DELETE_NEW_TAGS = baseUrl + 'news/newscomm/deleteCommTagDetail';//删除标签
export const API_ALL_NEW_TAGS = baseUrl + 'news/newscomm/queryTagList';//查询全部新标签列表【新版本5.1】
export const API_EXCAL_IMPORT_TAG = baseUrl + 'news/tagcategory/excelImportTag';//使用excel导入分类和标签
//5.1话题专题
export const API_QUERY_NEW_TOPICLIST = baseUrl + 'news/newscomm/queryTopicInfoList';//话题列表
export const API_SAVE_TOPIC_INFO = baseUrl + 'news/newscomm/addTopicInfo';//新增话题
export const API_MODIFY_TOPIC_INFO = baseUrl + 'news/newscomm/modifyTopicInfo';//修改话题
export const API_QUERY_TOPIC_INFO = baseUrl + 'news/newscomm/queryTopicInfo';//话题详情
export const API_QUERY_TOPIC_INFO_LIST = baseUrl + 'news/newscomm/queryTopicOfNewInfoList';//话题绑定视频详情
export const API_DELETE_TOPIC_INFO = baseUrl + 'news/newscomm/deleteTopicInfo';//删除话题
export const API_MODIFY_TOPIC_ONLINE = baseUrl + 'news/newscomm/modifyTopicInfoOnLine';//话题上下线
export const API_QUERY_NEW_SUBJECTLIST = baseUrl + 'news/newscomm/queryCommSpecialSubjectList';//专题列表
export const API_SAVE_SUBJECT_INFO = baseUrl + 'news/newscomm/addSpecialSubject';//新增专题
export const API_MODIFY_SUBJECT_INFO = baseUrl + 'news/newscomm/modifySpecialSubject';//修改专题
export const API_QUERY_SUBJECT_INFO = baseUrl + 'news/newscomm/getSpecialSubject';//专题详情
export const API_QUERY_SUBJECT_ONLINE = baseUrl + 'news/newscomm/modifySpecialSubjectOnLine';//专题上下线


export const API_QUERY_NEWS_VIDEOLIST = baseUrl + 'news/newsinfo/listNewsInfoBySelected';//获取下拉框付费视频列表
export const API_SAVE_OR_CHANGE_VIDEO = baseUrl + 'productInfo/saveOrUpdateChargeGoodsProductInfo';//添加或修改收费视频商品
export const API_SAVE_OR_CHANGE_EXAM = baseUrl + 'productInfo/saveOrUpdateIndividualSpectionProductInfo';//添加或修改预约套餐商品
/*健康管理end*/

/*供应商管理 */
export const API_LIST_SUPPLIER = baseUrl + 'supplier/listSupplierInfo';//供应商列表
export const API_SELECT_SUPPLIER = baseUrl + 'supplier/listAllSupplierInfo';//供应商下拉菜单
export const API_SAVE_OR_EDIT_SUPPLIER = baseUrl + 'supplier/saveOrUpdateSupplier';//新增或修改供应商
export const API_UPDATE_SUPPLIER = baseUrl + 'supplier/updateStatus';//修改供应商状态
export const LIST_ALL_USER_INFO_BYSUPPLIER = baseUrl + 'supplier/listAllUserInfoBySupplierId';//获取当前供应商下所有用户列表
/*数据统计 */
export const API_LIST_ORDER_STATISTICS = baseUrl + 'statistics/statistics/getOrderStatisticsInfoList';//订单
export const API_LIST_REPORT_STATISTICS = baseUrl + 'statistics/statistics/getReportStatisticsList';//获取报告统计列表
export const API_LIST_SMS_STATISTICS = baseUrl + 'statistics/statistics/getSmsRegistrationList';//短信注册
export const API_LIST_CCS_STATISTICS = baseUrl + 'statistics/statistics/getCcsSMSStatisticsInfoList';//短信推送
export const API_LIST_NEWS_EXPOSURE = baseUrl + 'news/newsexposurereport/queryNewsExposureReportList';//查询曝光量统计列表
export const API_LIST_CUS_FEED_BACK = baseUrl + 'statistics/statistics/customerFeedBackList';//用户反馈统计列表
export const API_LIST_PUSH_RECORD_LIST = baseUrl + 'statistics/statistics/getPushRecordList';//push统计列表
export const API_LIST_PUSH_RECORD_INFO_VIP = baseUrl + 'statistics/statistics/getPushResultByMsgIdsVIP';//push结果VIP
export const API_LIST_PUSH_RECORD_INFO = baseUrl + 'statistics/statistics/getPushResult';//push结果普通
export const API_LIST_PUSH_DROP_LIST = baseUrl + 'statistics/statistics/pushDropList';//push统计下拉框
/*类目绑定商品 */
export const API_ALL_PRODUCT_FOR_PC = baseUrl + 'productInfo/listProductInfoSelected';//弹窗所有商品
export const API_BATCH_PRO_FOR_CATEGORY = baseUrl + 'productInfo/setCategoryIdBindProductId';//绑定商品
export const API_BATCH_PRO_FOR_MODELTYPE = baseUrl + 'productInfo/listModelTypeSelected';//商品大类下拉列表
/*tag-appendinfo-controller : 标签打严重关注管理 */
export const API_ALL_TAG_APPENDINFO = baseUrl + 'tagappendinfo/listTagAppendInfo';//获取标签列(分页)
export const API_BATCH_TAG_APPENDINFO = baseUrl + 'tagappendinfo/batchUpdateTagAppenedinfoByIds';//批量修改是否严重和关注
/*5.22 推送信息管理 */
export const API_QUERY_PUSH_LIST = baseUrl + 'news/pushinfo/queryPushPlanList';//推送信息列表(分页)
export const API_SAVE_PUSH_PLAN = baseUrl + 'news/pushinfo/savePushPlan';//新增推送信息
export const API_PUSH_PLAN_TYPE = baseUrl + 'news/pushinfo/queryPushPlanTypeList';//推送类别列表
export const API_DELETE_PUSH_PLAN = baseUrl + 'news/pushinfo/deletePushPlan';//删除推送
export const API_QUERY_LABEL_LIST = baseUrl + 'news/pushinfo/queryLabelList';//type查询标签体系
/*节假日管理 */
export const API_HOLIDAY_LIST = baseUrl + 'holiday/getHolidayList';//节假日列表
export const API_DELETE_HOLIDAY = baseUrl + 'holiday/delHoliday';//删除节假日

