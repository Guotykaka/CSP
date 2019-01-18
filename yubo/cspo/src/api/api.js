import {get, post, postPay} from "./http.js";
import * as urls from '@/config/env.js'
import {baseUrl, baseImgPath} from "../config/env";
import md5 from 'js-md5';


export const ERR_OK = 1;

/*机构短链接预处理*/
export function createRequestToken(url){
  url+="|"+urls.ZSTJAppSecret;
  if (url.indexOf("#/")>-1){
    url = (url.split("#/")[1]).toLowerCase();
  }
  return md5(url);
};

/*登录*/
export function login(params) {
  return post(urls.API_LOGIN, params)
}
export function DSFDSDS(params) {
  return post(urls.AAAA_API, params)
}



/*=======================================================系统管理======================================================*/
/*公告列表*/
export function getNoticeList(params) {//获取公告列表
  return post(urls.API_POST_LIST_NOTICE, params)
}

export function getNoticeInfo(params) {//获取公告详情
  return post(urls.API_POST_INFO_NOTICE, params)
}

export function postNoticeStatus(params) {//更改公告状态
  return post(urls.API_POST_STATUS_NOTICE, params)
}

export function postNoticeDelete(params) {//删除公告
  return post(urls.API_POST_DELETE_NOTICE, params)
}

export function postNoticeUpdate(params) {//修改公告
  return post(urls.API_POST_UPDATE_NOTICE, params)
}

export function postNoticeSave(params) {//修改公告
  return post(urls.API_POST_SAVE_NOTICE, params)
}

/*用户列表API_POST_LIST_USER*/
export function getUserList(params) {//获取列表
  return post(urls.API_LIST_USER, params)
}

export function getUserInfo(params) {//用户详情
  return post(urls.API_POST_INFO_USER, params)
}

export function postUserUpdate(params) {//保存用户
  return post(urls.API_POST_UPDATE_USER, params)
}

export function postUserSave(params) {//新增用户
  return post(urls.API_POST_SAVE_USER, params)
}

export function postUserDelete(params) {//删除用户
  return post(urls.API_POST_DELETE_USER, params)
}

export function postDoctorResetPassword(params) {//重置密码
  return post(urls.API_POST_PASSWORD_USER, params)
}

export function getListWithNoParam(params) {//获取列表
  return post(urls.API_POST_LIST_WITH_NOPARAM, params)
}

export function resetPassword(params) {//修改登录用户密码
  return post(urls.API_POST_CSP_USER_PASSWORD, params)
}

/*角色列表*/
export function getListRole(params) {//获取列表
  return post(urls.API_POST_LIST_ROLE, params)
}

export function getRoleInfo(params) {//角色详情信息
  return post(urls.API_GET_INFO_ROLE, params)
}

export function PostSaveRole(params) {//新增角色
  return post(urls.API_POST_SAVE_ROLE, params)
}

export function PostUpdateRole(params) {//修改角色
  return post(urls.API_POST_UPDATE_ROLE, params)
}

export function PostDeleteRole(params) {//删除角色
  return post(urls.API_POST_DELETE_ROLE, params)
}

export function getSupperlierList(params) {//获取供应商列表
  return post(urls.API_POST_SUPPERLIER_LIST, params)
}

/*日志管理*/
export function listCspMessage(params) {//异常日志管理
  return post(urls.API_POST_LIST_CSP_MESSAGE, params)
}

export function listCspPayMessage(params) {//支付日志管理
  return post(urls.API_POST_LIST_PAY_MESSAGE, params)
}

/*版本信息*/
export function getVersionList(params) {//订单列表tab栏
  return post(urls.API_POST_VERSION_LIST, params)
}

export function refreshVersion(params) {//订单列表tab栏
  return post(urls.API_POST_REFRESH_VERSION, params)
}
/*版本信息2*/
export function getVersionAllList(params) {//版本信息列表
  return post(urls.API_POST_GET_VERSION, params)
}
export function getVersionLaunch(params) {//新版本上线
  return post(urls.API_POST_NEW_VERSION, params)
}
export function getRefreshVersionList(params) {//新版本上线后列表
  return post(urls.API_POST_REFRISH_VERSION_LIST, params)
}

export function deleteNewVersion(params) {//删除新版本
  return post(urls.API_POST_DELETE_NEW_VERSION, params)
}
export function modifyNewVersion(params) {//修改新版本
  return post(urls.API_POST_MODIFY_NEW_VERSION, params)
}
export function AddNewVersion(params) {//新增新版本
  return post(urls.API_POST_ADD_NEW_VERSION, params)
}

/*消息队列&模板*/
export function getQueueMsgList(params) {//获取消息队列   乐
  return post(urls.API_GET_LIST_CSP_MSG, params)
}

export function sendMsgAll(params) {//批量重发   乐
  return post(urls.API_SEND_MSG_DIRECT, params)
}

export function batchDeleteMessage(params) {//批量删除消息
  return post(urls.API_BATCH_DELETE_MESSAGE, params)
}

export function PostTemplateList(params) {//获取列表
  return post(urls.API_POST_LIST_TEMPLATE, params)
}

export function PostTemplateUpdate(params) {//修改
  return post(urls.API_POST_UPDATE_TEMPLATE, params)
}

export function PostTemplateSave(params) {//新增
  return post(urls.API_POST_SAVE_TEMPLATE, params)
}

export function PostTemplateDelete(params) {//删除
  return post(urls.API_POST_DELETE_TEMPLATE, params)
}

//机构管理
export function PostInstitutionList(params) {//机构分页查询
  return post(urls.API_POST_LIST_INSTITUTION, params)
}

export function PostInstitutionUpdate(params) {//修改保存机构信息
  return post(urls.API_POST_UPDATE_INSTITUTION, params)
}

export function PostInstitutionSave(params) {//新增保存机构信息
  return post(urls.API_POST_SAVE_INSTITUTION, params)
}

export function Insdelete(params) {//删除机构信息
  return post(urls.API_INS_DELETE, params)
}

export function getShortLink(params) {//根据长连接地址转换成短连接地址
  return post(urls.API_GET_SHORT_LINK, params)
}

export function Insinfo(params) {//获取机构信息详情
  return post(urls.API_INS_INFO, params)
}

export function InslistAllInstitution(params) {//获取所有的机构信息
  return post(urls.API_INS_LIST_ALL_INSTITUTION, params)
}
export function listAllUserInfoByInstitutionId(params) {//获取当前机构下所有用户列表
  return post(urls.LIST_USER_INSTITUTION_ID, params)
}
export function listGetRrovince(params) {//获取省级区域列表信息
  return post(urls.API_GET_LISTOROVINCE, params)
}
export function listGetRrovinceChild(params) {//获取下级区域列表信息（地级市、县级市）
  return post(urls.API_GET_LISTOROVINCE_CHILD, params)
}

/*机构文本管理*/
export function InsdeleteInfo(params) {//删除机构文本
  return post(urls.API_INS_DELETEINFO, params)
}
export function InsinfoDetail(params) {//根据编号获取该机构文本管理详情
  return post(urls.API_INS_INFODETAIL, params)
}
export function InslistInfo(params) {//机构文本管理分页查询
  return post(urls.API_INS_LISTINFO, params)
}
export function InssaveInfo(params) {//保存机构文本管理详情
  return post(urls.API_INS_SAVEINFO, params)
}
export function InsupdateInfo(params) {//修改机构文本
  return post(urls.API_INS_UPDATEINFO, params)
}
/*菜单管理*/
export function Menudelete(params) {//删除菜单
  return post(urls.API_POST_MENU_DELETE, params)
}

export function getLeftNav(params) {//获取左侧导航菜单
  return post(urls.API_POST_MENU_GETLEFTNAV, params)
}

export function getMenuListAjAX(params) {//获取所有菜单列表
  return post(urls.API_POST_MENU_GETMENULIST, params)
}

export function getMenuListByCategory(params) {//获取所有菜单列表(医生或运营)
  return post(urls.API_POST_MENU_BYCATEGORY, params)
}

export function getSysMenuByCategory(params) {//选择菜单(添加、修改菜单)
  return post(urls.API_POST_MENU_MENUBYCATEGORY, params)
}

export function Menusave(params) {//保存菜单信息
  return post(urls.API_POST_MENU_SAVE, params)
}

export function MenuUpdate(params) {//修改菜单
  return post(urls.API_POST_MENU_UPDATE, params)
}
/*数据字典*/
export function getDictListByType(params) {
  return post(urls.API_GET_DICTLISTBY_TYPE, params)
}

/*系统常量*/
export function deleteDictionary(params) {//删除字典列表数据
  return post(urls.API_POST_DELETE_DICTIONARY, params)
}

export function getDictionaryByKey(params) {//根据key获取字典列表数据详情
  return post(urls.API_POST_GETDICTIONARY_BY_KEY, params)
}

export function getDictionaryInfo(params) {//获取字典列表数据详情
  return post(urls.API_POST_GETDICTIONARY_INFO, params)
}

export function listDictionary(params) {//获取字典列表数据
  return get(urls.API_GET_LIST_DICTIONARY, params)
}

export function saveOrUpdateDictionary(params) {//保存字典
  return post(urls.API_POST_SAVE_OR_UPDATAE_DICTIONARY, params)
}

//医生管理
export function getDoctorList(params) {//获取医生列表
  return post(urls.API_POST_LIST_DOCTOR, params);
}


export function updataDoctorEditor(params) {//编辑医生信息
  return post(urls.API_POST_DOCTOR_UPDATE, params);
}

export function getAllService(params) {//获取所有服务包含状态
  return post(urls.API_POST_SERVICE_DICT, params);
}

export function setService(params) {//设置服务权限
  return post(urls.API_POST_SAVE_SERVICE_SET, params);
}

export function restPassword(params) {//设置服务权限
  return post(urls.API_POST_REST_PASSWORD, params);
}

export function addDoctor(params) {//新增医生
  return post(urls.API_POST_DOCTOR_SAVE, params);
}

export function getInsProportionsList(params) {//获取分成列表
  return post(urls.API_POST_INSPROPORTION_LIST, params);
}

export function addProportionItem(params) {//新增分成项
  return post(urls.API_POST_SAVE_INSPROPORTIONS, params);
}

export function deleteProportionItem(params) {//删除分成项
  return post(urls.API_POST_DELETE_INSPROPORTIONSENTITY, params);
}

export function getDoctorApplyList(params) {//获取认证医生列表
  return post(urls.API_POST_DOCTOR_APPLY_LIST, params);
}

export function queryDoctorInfo(params) {//查询医生详情
  return post(urls.API_POST_QUERY_DOCTOR_INFO, params);
}

export function changeDoctorStatus(params) {//改变医生认证状态  同意或拒绝
  return post(urls.API_POST_CHANGE_DOCTOR_STATUS, params);
}

export function saveDoctorTime(params) {//设置医生服务时间
  return post(urls.API_SAVE_DOCTOR_TIME, params);
}

export function getAccountRecord(params) {//财务管理
  return post(urls.API_POST_LIST_ACCOUNT_RECORD, params);
}

export function updataWithdrawStatus(params) {//同意或拒绝提现
  return post(urls.API_POST_UPDATE_APPLY_STATUS, params);
}

export function exportWithdrawExcel(params) {//导出提现记录
  return post(urls.API_POST_EXPORT_WITHDRAW, params);
}

export function getNewsList(params) {//获取未读列表
  return post(urls.API_POST_COUNT_USER_NEWSLIST, params);
}

export function clearUnReadMes(params) {//设置未读为已读  乐
  return post(urls.API_POST_UNREAD_UPDATE_BATCH, params);
}

export function getListAllInstitution(params) {//获取所有机构列表
  return post(urls.API_GET_LIST_ALL_INSTITUTION, params)
}

export function agreeRefuse(params) {//同意退款
  return postPay(urls.API_POST_LIST_ORDER_REFUND, params)
}

export function getHealthList(params) {//获取健管师 乐
  return post(urls.API_POST_LIST_HEALTH, params);
}


export function saveHealth(params) {//新增健管师 乐
  return post(urls.API_POST_SAVE_HEALTH, params);
}


export function updateHealth(params) {//编辑健管师 乐
  return post(urls.API_POST_UPDATE_HEALTH, params);
}

export function saveCheck(params) {//编辑健管师 乐
  return post(urls.API_BATCH_HEALTH_UPDATE, params);
}
export function ListMRUSer(params) {//获取所有已启用用户 乐
  return post(urls.API_LIST_ALL_MR_USER, params);
}



/*个人中心*/
export function queryInsLeaveWordList(params) {//分页查询所有留言
  return post(urls.API_QUERY_INS_LEAVE_WORDLIST, params)
}

export function saveInsLeaveWordAnswer(params) {//回复所有留言
  return post(urls.API_SAVE_INS_LEAVE_WORDANSWER, params)
}

export function queryInsLeaveWordAnswerList(params) {//展开查看当前留言回复记录
  return post(urls.API_QUERY_INS_LEAVE_WORDANSWERLIST, params)
}

export function closeInsLeaveWordAnswer(params) {//关闭当前留言
  return post(urls.API_CLOSE_INS_LEAVE_WORDANSWER, params)
}

export function getIntervalNotice(params) {//控制台乐
  return post(urls.API_POST_GETSYS_NOTICE_INFO, params)
}

export function getNewApplyList(params) {//获取 最新认证列表   乐
  return post(urls.API_POST_LAST_DOCTOR_APPLY_LIST, params)
}

export function getAuthenticationSum(params) {//获取 认证总人数  乐
  return post(urls.API_POST_NUMBER_AUTHENTICATION, params)
}

export function getNewestRefuseList(params) {//获取 最新退款列表  乐
  return post(urls.API_POST_NEW_LISTORDER_REFUSE, params)
}
/**********/
export function getOrderRefuseNumber(params) {//获取 最新订单数  退款数  乐
  return post(urls.API_POST_CSP_ORDER_NUMBER, params)
}

/*新订单接口*/
export function exportOrderExcel(params) {//导出订单列表
  return post(urls.API_POST_CSP_ORDER_NUMBER, params)
}
/*888888888888*/
export function getMedicalReportDetail(params) {//标准方式查看体检报告
  return post(urls.API_POST_MEDICAL_REPORT_DETAIL, params)
}

export function getOrderInfoDetail(params) {//获取订单详情
  return post(urls.API_POST_ORDER_INFO_DETAIL, params)
}

export function getOrderList(params) {//获取订单列表
  return post(urls.API_POST_ORDER_LIST, params)
}

export function getTabList(params) {//订单列表tab栏
  return post(urls.API_POST_TAB_LIST, params)
}
export function getOrderCategoryType(params) {//商品前端分类枚举
  return post(urls.API_GET_CATEGORY_TYPE, params)
}
export function syncAdditionData(params) {//刷新体检加项订单记录
  return post(urls.API_SYNC_ADDITION_DATA, params)
}
export function applyRefund(params) {//订单申请退款
  return post(urls.ORDER_APPLY_REFUND, params)
}
export function updateToFinish(params) {//直接完成订单
  return post(urls.UPDATE_TO_FINISH, params)
}
export function updateToTimeout(params) {//直接过期订单
  return post(urls.UPDATE_TO_TIMEOUT, params)
}
export function exportOrderExcelNew(params) {//导出订单Excel（新接口，前端集成CVS）
  return post(urls.EXPORT_ORDER_EXCELNEW, params)
}

/*新退款管理*/
export function applyOrderRefund(params) {//体检加项订单申请退款
  return post(urls.API_APPLY_ORDER_REFUND, params)
}

export function exportOrderRefund(params) {//导出退款记录(get请求)
  return post(urls.API_GET_EXPORT_ORDER_REFUND, params)
}

export function getOrderRefundList(params) {//获取退款列表
  return post(urls.API_POST_GET_ORDER_REFUND_LIST, params)
}

export function getRefundDetailNews(params) {//获取退款详情
  return post(urls.API_POST_GET_REFUND_DETAIL, params)
}

export function refuseRefund(params) {//更新退款状态（拒绝退款）
  return post(urls.API_POST_REFUS_REFUND, params)
}



/*推送信息管理*/
export function deletePushinfo(params) {//删除
  return post(urls.API_POST_DELETE_PUSH_IFNO, params)
}

export function queryPushTypeList(params) {//查询推送类别列表
  return post(urls.API_POST_QUERY_PUSH_TYPE_LIST, params)
}

export function queryNewsCategory(params) {//查询
  return post(urls.API_POST_QUERY_NEWS_CATEGORY, params)
}

export function savePushinfo(params) {//保存
  return post(urls.API_POST_SAVE_PUSH_IFNO, params)
}

export function getNewsArticleList(params) {//获取图文 运营 爬虫
  return post(urls.API_POST_NEWS_INFO_LIST, params)
}

export function getCommonTagCategory(params) {//获取所有分类
  return post(urls.API_POST_COMMON_TAG_CATEGORY_LIST, params)
}
export function postAlltopics(params) {//获取所有话题
  return post(urls.API_POST_ALL_TOPIC_LIST, params)
}

export function getSubTagCategory(params) {//获取二级标签
  return post(urls.API_POST_COMMON_TAG_CATEGORY_NAME_LIST, params)
}

export function saveNewsInfo(params) {//保存文章
  return post(urls.API_POST_SAVE_NEWS_INFO, params)
}

export function updateNewsStatus(params) {//更改状态
  return post(urls.API_POST_UPDATE_NEWS_STATUS, params)
}

export function getAllArticleTypes(params) {//获取所有文章分类
  return post(urls.API_POST_QUERY_NEWS_CATEGORY_lIST, params)
}

export function getIdentDoctors(params) {//所有已认证医生
  return post(urls.API_POST_DOCTOR_CERTIFIED_LIST, params)
}

export function updataNewsInfo(params) {//编辑图文
  return post(urls.API_POST_UPDATE_NEWS_INFO, params)
}


/*标签分类管理*/
export function getCommTagCategoryName(params) {//获取所有一级标签分类
  return post(urls.API_GET_COMMTAG_CATEGORY_NAME, params)
}

export function queryCommTagCategoryList(params) {//获取标签分类列表
  return post(urls.API_QUERY_COMMTAG_CATEGORY_LIST, params)
}

export function saveCommTagCategory(params) {//添加标签分类
  return post(urls.API_SAVE_COMMTAG_CATEGORY, params)
}

export function queryCommTagNameCategoryList(params) {//获取所有标签列表
  return post(urls.API_QUERY_COMMTAG_CATEGORYNAME_LIST, params)
}

export function updateCommTagCategory(params) {//编辑标签分类
  return post(urls.API_UPDATE_COMMTAG_CATEGORY, params)
}

export function updateTagCategoryStatus(params) {//移除标签分类（修改标签状态）
  return post(urls.API_UPDAGE_TAGCATEGORY_STATUS, params)
}

/*二级标签管理*/
export function deleteCommTagInfo(params) {//删除标签
  return post(urls.API_DELETE_COMMTAG_INFO, params)
}

export function getlistCommTagInfo(params) {//获取所有标签列表
  return post(urls.API_GET_LIST_COMMTAGINFO, params)
}

export function saveCommTagInfo(params) {//保存标签
  return post(urls.API_SAVE_COMMTAG_IFNO, params)
}

export function updateCommTagInfo(params) {//编辑标签
  return post(urls.API_UPDATE_COMMTAG_INFO, params)
}
/*5.1新类型标签管理*/
export function getNewTagsList(params) {//获取标签列表
  return post(urls.API_QUERY_NEW_TAGLIST, params)
}
export function postSaveNewTags(params) {//新增标签
  return post(urls.API_SAVE_NEW_TAGS, params)
}
export function postModifyNewTags(params) {//修改标签
  return post(urls.API_MODIFY_NEW_TAGS, params)
}
export function postQueryNewTags(params) {//标签详情
  return post(urls.API_QUERY_NEW_TAGS, params)
}
export function postDeleteNewTags(params) {//删除标签
  return post(urls.API_DELETE_NEW_TAGS, params)
}
export function postAllNewTags(params) {//查询全部新标签列表【新版本5.1】
  return post(urls.API_ALL_NEW_TAGS, params)
}
export function postImportTagByExcal(params) {//使用excel导入分类和标签
  return post(urls.API_EXCAL_IMPORT_TAG, params)
}
/*5.1话题专题管理*/
export function getNewTopicList(params) {//获取话题列表
  return post(urls.API_QUERY_NEW_TOPICLIST, params)
}
export function postSaveTopic(params) {//新增话题
  return post(urls.API_SAVE_TOPIC_INFO, params)
}
export function postModifyTopic(params) {//修改话题
  return post(urls.API_MODIFY_TOPIC_INFO, params)
}
export function postQueryTopic(params) {//话题详情
  return post(urls.API_QUERY_TOPIC_INFO, params)
}
export function postQueryTopicVideo(params) {//话题绑定视频列表
  return post(urls.API_QUERY_TOPIC_INFO_LIST, params)
}
export function postDeleteTopic(params) {//删除话题
  return post(urls.API_DELETE_TOPIC_INFO, params)
}
export function postTopicOnLine(params) {//话题上下线
  return post(urls.API_MODIFY_TOPIC_ONLINE, params)
}
export function getNewSubjectList(params) {//获取专题列表
  return post(urls.API_QUERY_NEW_SUBJECTLIST, params)
}
export function postSaveSubject(params) {//新增专题
  return post(urls.API_SAVE_SUBJECT_INFO, params)
}
export function postModifySubject(params) {//修改专题
  return post(urls.API_MODIFY_SUBJECT_INFO, params)
}
export function postQuerySubject(params) {//专题详情
  return post(urls.API_QUERY_SUBJECT_INFO, params)
}
export function postSubjectOnLine(params) {//专题上下线
  return post(urls.API_QUERY_SUBJECT_ONLINE, params)
}
export function postNewCoinVideo(params) {//获取下拉框付费视频列表
  return post(urls.API_QUERY_NEWS_VIDEOLIST, params)
}
export function postSaveOrChangeVideo(params) {//添加或修改收费视频商品
  return post(urls.API_SAVE_OR_CHANGE_VIDEO, params)
}
export function SaveOrChangeExamation(params) {//添加或修改预约套餐商品
  return post(urls.API_SAVE_OR_CHANGE_EXAM, params)
}



/*首页推荐管理*/

export function newsQueryNewsCategory(params) {//分页获取咨询栏目列表
  return post(urls.API_QUERY_NEWS_CATEGORY, params)
}

export function queryNewsCategoryList(params) {//获取所有咨询栏目列表
  return post(urls.API_QUERY_NEWS_CATEGORY_LIST, params)
}

export function queryNewsCategroyNum(params) {//获取所有咨询栏目序号
  return post(urls.API_QUERY_NEWS_CATEGROY_NUM, params)
}

export function saveNewsCategory(params) {//保存栏目（分类）
  return post(urls.API_SAVE_NEWS_CATEGORY, params)
}

export function updateNewsCategory(params) {//修改栏目信息
  return post(urls.API_UPDATE_NEWS_CATEGORY, params)
}

export function updateNewsCategoryNum(params) {//修改栏目顺序
  return post(urls.API_UPDATE_NEWS_CATEGORY_NUM, params)
}

export function updateNewsCategoryStatus(params) {//修改栏目状态（上线：1；下线：2；删除：0）
  return post(urls.API_UPDATE_NEWS_CATEGORY_STATUS, params)
}
export function addNewsRecommendInfo(params) {//保存推荐信息【新版本5.1】
  return post(urls.ADD_NEWS_RECOMMEND_INFO, params)
}
export function deleteNewsRecommendInfo(params) {//删除推荐 【新版本5.1】
  return post(urls.DELETE_NEWS_RECOMMEND_INFO, params)
}
export function queryNewsRecommendInfoList(params) {//查询推荐列表 【新版本5.1】
  return post(urls.QUERY_NEWS_RECOMMEND_INFO_LIST, params)
}
export function queryContentInfoList(params) {//查询(话题，专题，视频对应内容的列表） 【新版本5.1】
  return post(urls.QUERY_CONTENT_INFO_LIST, params)
}
export function queryColumnOfTagList(params) {//查询栏目下面图文视频的标签列表 【新版本5.1】
  return post(urls.QUERY_COLUMNOF_TAGLIST, params)
}
export function queryTagList(params) {//查询全部新标签列表【新版本5.1】
  return post(urls.QUERY_TAG_LIST, params)
}

/*工作台管理*/
export function getIndexTradeData(params) {//修改栏目状态（上线：1；下线：2；删除：0）
  return post(urls.API_GET_INDEX_TRADE_DATA, params)
}
/*服务管理4.71*/
export function getClassList(params) {//根据商品大类获取商品模板
  return post(urls.API_GET_LIST_CLASS, params)
}
export function SaveProductModel(params) {//添加商品模板
  return post(urls.API_SAVE_PRODUCTMODEL, params)
}
export function getCategoryType(params) {//商品前端分类枚举
  return post(urls.API_GET_CATEGORYTYPE, params)
}
export function getClassTabList(params) {//商品模板大类(顶部的商品大类tab)
  return post(urls.API_GET_CLASS_TEBLIST, params)
}
export function PostModelStatus(params) {//商品模板status
  return post(urls.API_POT_MODEL_STATUS, params)
}
export function GetModelInfo(params) {//获取单条图文咨询模板信息
  return post(urls.API_GET_MODEL_INFO, params)
}
export function UpdateProductModel(params) {//修改、新增图文模板
  return post(urls.API_UPDATE_PRODUCT_MODEL, params)
}
export function UpdateProductModel_phone(params) {//修改、新增电话模板
  return post(urls.API_UPDATE_PRODUCT_MODEL_PHONE, params)
}
export function UpdateProductModel_yyt(params) {//修改、新增一元听模板
  return post(urls.API_UPDATE_PRODUCT_MODEL_YYT, params)
}
export function ProductDoctorList(params) {//获取所有已经认证的医生列表
  return post(urls.API_PRODUCT_DOCTOR_LIST, params)
}
export function GetModelList(params) {//获取商品列表
  return post(urls.API_GET_MODEL_LIST, params)
}
export function GetProductInfo(params) {//获取图文单个商品信息
  return post(urls.API_GET_PRODUCT_INFO, params)
}
export function GetModelInfo_phone(params) {//获取单条电话报告模板信息
  return post(urls.API_GET_PRODUCT_INFO_PHONE, params)
}
export function GetModelInfo_yyt(params) {//获取一元听单个商品信息
  return post(urls.API_GET_PRODUCT_INFO_YYT, params)
}
export function UpdateProductInfo(params) {//编辑商品
  return post(urls.API_UPDAT_PRO_INFO, params)
}
export function SaveProductInfo_yyt(params) {//一元听商品编辑、添加
  return post(urls.API_SAVE_PRO_INFO, params)
}
export function SaveProductInfo_tw(params) {//图文商品编辑、添加
  return post(urls.API_SAVE_PRO_INFO_TW, params)
}
export function SaveProductInfo_dh(params) {//电话商品编辑、添加
  return post(urls.API_SAVE_PRO_INFO_DH, params)
}
export function PostProductStatus(params) {//修改商品状态
  return post(urls.API_POST_PRO_STATUS, params)
}
export function listenProductManagement(params) {//一元听商品匹配管理
  return post(urls.API_LISTEN_PRODUCT_MANAGEMENT, params)
}
export function oneYuanProductIndexCountList(params) {//一元听商品匹配统计（一级，指标名称统计）
  return post(urls.ONE_YUAN_PRODUCT_INDEX_COUNT_LIST, params)
}
export function oneYuanProductResultCountList(params) {//一元听商品匹配统计（二级，指标结果统计）
  return post(urls.ONE_YUAN_PRODUCT_RESULT_COUNT_LIST, params)
}
export function SaveOrEditNDFT(params) {//新增或修改南大菲特商品
  return post(urls.API_SAVE_OR_EDIT_NDFT, params)
}
export function SelectIntendList(params) {//体检套餐适用人群下拉选项
  return post(urls.API_LIST_SLECTE_INTEND, params)
}
export function GetAllTagsTao(params) {//获取标签列表(20181120席涛涛更改一元听和南大菲特，关键字改为标签)
  return post(urls.API_GET_LIST_TAG_TAOTAO, params)
}
export function GetProductCategeryList(params) {//商品类目管理，获取类目列表
  return post(urls.API_GET_LIST_PRODUCT_CATEGORY, params)
}
export function GetAllProductCategeryList(params) {//商品类目管理，获取类目列表(无分页)
  return post(urls.API_GET_ALL_PRODUCT_CATEGORY, params)
}
export function GetProductCategerySelect(params) {//下拉列表类目数据
  return post(urls.API_GET_SELECT_PRODUCT_CATEGORY, params)
}
export function PostAddOrUpdatePC(params) {//添加或修改商品分类
  return post(urls.API_POST_ADD_OR_UPDATE_PC, params)
}
export function PostDeletePC(params) {//删除商品分类
  return post(urls.API_POST_DELETE_PC, params)
}
export function PostBatchUpdatePC(params) {//批量修改是否推荐
  return post(urls.API_POST_BATCH_UPDATE_PC, params)
}
export function PostSelectCondition(params) {//类目app筛选条件
  return post(urls.API_POST_SELECT_CONDITION, params)
}
export function GetShopRecommendBan(params) {//获取banner列表
  return post(urls.API_GET_SHOP_RECOMMEND_BAN, params)
}
export function GetShopRecommendBanInfo(params) {//获取banner详情
  return post(urls.API_GET_SHOP_RECOMMEND_BAN_INFO, params)
}
export function GetShopRecommendLim(params) {//获取限时活动列表
  return post(urls.API_GET_SHOP_RECOMMEND_LIM, params)
}
export function GetShopRecommendLimInfo(params) {//获取限时活动详情
  return post(urls.API_GET_SHOP_RECOMMEND_LIM_INFO, params)
}
export function GetListLimitCoupon(params) {//可领的优惠券模板列表
  return post(urls.API_GET_LIST_LIMIT_COUPON, params)
}
export function GetLimitCouponCategory(params) {//优惠券模板类目下拉框
  return post(urls.API_GET_LIMIT_COUPON_CATEGORY, params)
}
export function PostSaveShopRecommendBan(params) {//SAVEbanner
  return post(urls.API_SAVE_SHOP_BANNNER, params)
}
export function PostSaveShopLimit(params) {//SAVE限时活动
  return post(urls.API_SAVE_SHOP_LIMIT, params)
}
export function PostEditShopRecommendBan(params) {//EDITbanner
  return post(urls.API_EDIT_SHOP_BANNNER, params)
}
export function PostEditShopLimit(params) {//EDIT限时活动
  return post(urls.API_EDIT_SHOP_LIMIT, params)
}
export function SetRecommendStatus(params) {//banner设置状态
  return post(urls.API_SET_STATUS_RECOMMEND, params)
}
export function DeleteRecommendLimit(params) {//删除限时活动
  return post(urls.API_DELETE_STATUS_LIMIT, params)
}

//短信推送CCS
export function getMsgPushList(params) {//短信推送列表
  return post(urls.API_PUSH_MSG_LIST, params)
}
export function getAllins(params) {//下拉获取所有机构
  return post(urls.API_GET_ALLINS, params)
}
export function PostFirstPlan(params) {//创建一次计划
  return post(urls.API_POST_FIRSTPLAN, params)
}
export function PostSecondPlan(params) {//创建2次计划
  return post(urls.API_POST_SECONDPLAN, params)
}
export function PostSupplePlan(params) {//创建补发计划
  return post(urls.API_POST_SUPPLEPLAN, params)
}
export function PostSuppleSecPlan(params) {//创建补发2次计划
  return post(urls.API_POST_SUPPLEPLANSEC, params)
}
export function PostDeletePlan(params) {//结束计划
  return post(urls.API_POST_DELETEPLAN, params)
}
export function getMSGTemplate(params) {//查询短信模板
  return post(urls.API_GET_MSGTEMPLATE, params)
}
export function postBUFANewTemplate(params) {//创建补发计划(新)
  return post(urls.API_POST_SUPPLE_NEW_PLAN, params)
}
export function postAddOperaTemplate(params) {//创建运营计划
  return post(urls.API_POST_ADD_OP_PLAN, params)
}
export function postRemoveSupNewPlan(params) {//结束补发计划(新)
  return post(urls.API_POST_REMOVE_SUP_NEW, params)
}
export function postCCSDetail(params) {//运营计划详情
  return post(urls.API_POST_CCS_DETAIL, params)
}
export function postEditCCSDetail(params) {//运营计划修改
  return post(urls.API_POST_CCS_EDIT, params)
}


/*体检预约*/
export function getExamDetail(params) {//查看预约单下的所有购买的加项信息
  return post(urls.API_EXAMAPPOINTMENT_DETAIL, params)
}
export function getExamList(params) {//体检预约列表
  return post(urls.API_EXAMAPPOINTMENT_LIST, params)
}
export function getPersonalExamList(params) {//个检预约列表
  return post(urls.API_EXAMPERSONNAL_LIST, params)
}
export function postPersonalExamStatus(params) {//个检预约修改状态
  return post(urls.API_UPDATE_EXAM_STATUS, params)
}
export function getPersonalExamDetail(params) {//个检预约查看
  return post(urls.API_PER_EXAM_DETAIL, params)
}
export function getExamMent(params) {//更新体检预约时间
  return post(urls.API_EXAMAPPOINTMENT_MENT, params)
}
export function appListCanReservationDate(params) {//可预约时间列表
  return post(urls.API_APPLISTCAN_RESERVATION_DATE, params)
}


//优惠券
export function GetConpontList(params) {//优惠券列表
  return post(urls.API_GET_COUPONT_LIST, params)
}
export function GetConpontDetail(params) {//优惠券详情
  return post(urls.API_GET_COUPONT_DETAIL, params)
}
export function postAddConpont(params) {//新增优惠券
  return post(urls.API_GET_COUPONT_ADD, params)
}
export function postUpdateConpont(params) {//修改优惠券
  return post(urls.API_GET_COUPONT_UPDATE, params)
}
export function getConpontProduct(params) {//优惠券商品下拉
  return post(urls.API_GET_COUPONT_PRODUCT, params)
}

/*报告管理*/
export function reportAddInfo(params) {//修改优惠券
  return post(urls.API_REPORT_ADD_INFO, params)
}

/*健康管理start*/
//检查项目管理
export function addCheckIndex(params) {//新增检查项目
  return post(urls.RECHECK_ADD_CHECK_INDEX, params)
}
export function getMedicalCheckIndexDetail(params) {//查看检查项目详情
  return post(urls.RECHECK_CHECK_INDEX_DETAIL, params)
}
export function getMedicalCheckIndexList(params) {//查看检查项目列表
  return post(urls.RECHECK_CHECK_INDEX_LIST, params)
}
export function updateCheckIndex(params) {//修改检查项目
  return post(urls.RECHECK_UPDATE_CHECK_INDEX, params)
}

//标签管理

export function addMedicalLabel(params) {//新增标签
  return post(urls.RECHECK_ADD_LABEL, params)
}
export function blockMedicalLabel(params) {//停用标签
  return post(urls.RECHECK_BLOCK_MEDICAL_LABEL, params)
}
export function getMedicalCheckIndexIdNameList(params) {//检查项id、name下拉框列表
  return post(urls.RECHECK_INDEX_ID_NAME_LIST, params)
}
export function getMedicalLabelDetail(params) {//查看标签详情
  return post(urls.RECHECK_MEDICAL_LABEL_DETAIL, params)
}
export function getMedicalLabelList(params) {//查看标签项目列表
  return post(urls.RECHECK_MEDICAL_LABEL_LIST, params)
}
export function startMedicalLabel(params) {//启用标签
  return post(urls.RECHECK_MEDICAL_LABEL, params)
}
export function updateMedicalLabel(params) {//修改标签
  return post(urls.RECHECK_UPDATE_LABEL, params)
}

/*健康管理end*/

/*供应商管理*/
export function GetSupplierList(params) {//供应商列表
  return post(urls.API_LIST_SUPPLIER, params)
}
export function GetSupplierSelect(params) {//供应商下拉菜单
  return post(urls.API_SELECT_SUPPLIER, params)
}
export function SaveOREditSupplier(params) {//新增或修改供应商
  return post(urls.API_SAVE_OR_EDIT_SUPPLIER, params)
}
export function UpdateSupplier(params) {//修改供应商状态
  return post(urls.API_UPDATE_SUPPLIER, params)
}
export function listAllUserInfoBySupplier(params) {//获取当前供应商下所有用户列表
  return post(urls.LIST_ALL_USER_INFO_BYSUPPLIER, params)
}
/*数据统计*/
export function GetOrderStaticsList(params) {//订单数据统计
  return post(urls.API_LIST_ORDER_STATISTICS, params)
}
export function GetReportStaticsList(params) {//报告数据统计
  return post(urls.API_LIST_REPORT_STATISTICS, params)
}
export function GetSMSStaticsList(params) {//短信注册数据统计
  return post(urls.API_LIST_SMS_STATISTICS, params)
}
export function GetCCSStaticsList(params) {//短信推送数据统计
  return post(urls.API_LIST_CCS_STATISTICS, params)
}
export function GetNewsExposureList(params) {//查询曝光量统计列表
  return post(urls.API_LIST_NEWS_EXPOSURE, params)
}
export function GetCusFeedBackList(params) {//用户反馈统计列表
  return post(urls.API_LIST_CUS_FEED_BACK, params)
}
export function GetPushRecordList(params) {//push统计列表
  return post(urls.API_LIST_PUSH_RECORD_LIST, params)
}
export function GetPushRecordInfo(params) {//push结果
  return post(urls.API_LIST_PUSH_RECORD_INFO, params)
}
export function GetPushRecordInfoVIP(params) {//push结果VIP
  return post(urls.API_LIST_PUSH_RECORD_INFO_VIP, params)
}
export function GetPushDropList(params) {//push统计下拉框
  return post(urls.API_LIST_PUSH_DROP_LIST, params)
}

/*类目绑定商品 */
export function GetProductList(params) {//弹窗所有商品
  return post(urls.API_ALL_PRODUCT_FOR_PC, params)
}
export function PostBatchBindProduct(params) {//绑定商品
  return post(urls.API_BATCH_PRO_FOR_CATEGORY, params)
}
export function PostListModelType(params) {//商品大类下拉列表
  return post(urls.API_BATCH_PRO_FOR_MODELTYPE, params)
}
/*tag-appendinfo-controller : 标签打严重关注管理  */
export function GetAllTagsList(params) {//获取标签列(分页)
  return post(urls.API_ALL_TAG_APPENDINFO, params)
}
export function PostBatchBindTags(params) {//批量修改是否严重和关注
  return post(urls.API_BATCH_TAG_APPENDINFO, params)
}
/*5.22 推送信息管理 */
export function QueryPushList(params) {//推送信息列表(分页)
  return post(urls.API_QUERY_PUSH_LIST, params)
}
export function PostSavePushPlan(params) {//新增推送信息
  return post(urls.API_SAVE_PUSH_PLAN, params)
}
export function PostPushPlanType(params) {//推送类别列表
  return post(urls.API_PUSH_PLAN_TYPE, params)
}
export function PostDeletePushPlan(params) {//删除推送
  return post(urls.API_DELETE_PUSH_PLAN, params)
}
export function PostQueryLabelList(params) {//type查询标签体系
  return post(urls.API_QUERY_LABEL_LIST, params)
}
/*节假日管理 */
export function QueryHolidayList(params) {//节假日列表
  return post(urls.API_HOLIDAY_LIST, params)
}
export function DeleteHoliday(params) {//删除节假日
  return post(urls.API_DELETE_HOLIDAY, params)
}























