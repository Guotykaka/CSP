import Vue from 'vue'
import Router from 'vue-router'
import "@/asset/style/common.less"
import "@/asset/style/mixin.less"
import {getStore,Base64} from '@/config/mUtils.js'

//用户设置
const goMyself = () => import('@/pages/userSettings/goMyself.vue');//个人中心
const login = () => import('@/pages/userSettings/login.vue');//登录
const manage = () => import('@/pages/userSettings/manage.vue');//管理页面
const main = () => import('@/pages/userSettings/main.vue');//控制台
const announcement = () => import('@/pages/userSettings/announcement.vue');//系统公告
const msgList = () => import('@/pages/userSettings/msgList.vue');//消息列表
//系统管理
const notice = () => import('@/pages/systemManagement/notice.vue');//公告管理
const edition = () => import('@/pages/systemManagement/edition.vue');//版本配置
const edition2 = () => import('@/pages/systemManagement/edition2.vue');//版本配置2
const role = () => import('@/pages/systemManagement/role.vue');//角色管理
const msg_queue = () => import('@/pages/systemManagement/msg_queue.vue');//消息队列
const user = () => import('@/pages/systemManagement/user/user.vue');//用户管理
const message_template = () => import('@/pages/systemManagement/message_template.vue');//消息模板
const menuList = () => import('@/pages/systemManagement/menuList.vue');//菜单管理
const dictionary = () => import('@/pages/systemManagement/dictionary.vue');//系统常量
const listCspMessage = () => import('@/pages/systemManagement/listCspMessage.vue');//系统异常日志管理
const InquireReport = () => import('@/pages/systemManagement/inquireReport.vue');//报告查询
const AppendTag = () => import('@/pages/systemManagement/AppendTag.vue');//标签严重密切关注
const BatchRecommend = () => import('@/pages/systemManagement/BatchRecommend.vue');//批量推荐
//机构业务
const institution = () => import('@/pages/institutionBusiness/institution.vue');//机构列表
const msgMangeList = () => import('@/pages/institutionBusiness/msgMangeList.vue');//信息管理列表
const css_manage = () => import('@/pages/institutionBusiness/CcsManage.vue');//ccs新增页面一元听
const ccsNewManage = () => import('@/pages/institutionBusiness/ccsNewManage.vue');//ccs新增页面一元听
const ccsNewManageDetail = () => import('@/pages/institutionBusiness/ccsNewManageDetail.vue');//ccs新增页面一元听详情
const MsgPush = () => import('@/pages/institutionBusiness/MsgPush.vue');//短信推送
const PhoneMsg = () => import('@/pages/institutionBusiness/PhoneMsg.vue');//手机短信推送（新）
//商品管理
const productTextphone = () => import('@/pages/commodityManagement/productTextphone.vue');//服务管理
const serviceClass = () => import('@/pages/commodityManagement/serviceClass.vue');//服务商品
const productContent = () => import('@/pages/commodityManagement/productContent.vue');//内容商品
const CouponList = () => import('@/pages/commodityManagement/CouponList.vue');//优惠券
const SupplyChain = () => import('@/pages/commodityManagement/SupplyChain.vue');//供应链实物商品
const ExaminationPackage = () => import('@/pages/commodityManagement/ExaminationPackage.vue');//体检套餐商品
const serverShop = () => import('@/pages/commodityManagement/serverShop.vue');//供应链服务商品
const SupplierMan = () => import('@/pages/commodityManagement/SupplierMan.vue');//供应商管理
const ProductCategory = () => import('@/pages/commodityManagement/ProductCategory.vue');//类目管理
const ShopRecommend = () => import('@/pages/commodityManagement/ShopRecommend.vue');//商城推荐管理


//医生管理
const doctorList = () => import('@/pages/doctorManagement/doctorList.vue');//医生列表
const health_manage_list = () => import('@/pages/doctorManagement/healthManage/healthManage-list.vue');//健管师列表
const benefitList = () => import('@/pages/doctorManagement/benefitList.vue');//分成比例
const indentList = () => import('@/pages/doctorManagement/identificationList.vue');//认证列表

//订单管理
const refundsList = () => import('@/pages/orderManagement/refundsList.vue');//退款列表
const refundsInfo = () => import('@/pages/orderManagement/refundsInfo.vue');//退款详情
const orderList = () => import('@/pages/orderManagement/orderList.vue');//订单列表
const orderDetail = () => import('@/pages/orderManagement/orderDetail.vue');//主订单详情

//数据统计
const reportStatistics = () => import('@/pages/dataStatistics/reportStatistics.vue');//报告数据统计
const orderStatistics = () => import('@/pages/dataStatistics/orderStatistics.vue');//订单数据统计
const SMSstatistics = () => import('@/pages/dataStatistics/SMSstatistics.vue');//短信注册数据统计
const CCSstatistics = () => import('@/pages/dataStatistics/CCSstatistics.vue');//CCS数据统计
const NewsExposure = () => import('@/pages/dataStatistics/NewsExposure.vue');//查询曝光量统计列表
const userFeedback = () => import('@/pages/dataStatistics/userFeedback.vue');//用户反馈统计列表
const pushData = () => import('@/pages/dataStatistics/pushData.vue');//push统计列表

//财务管理
const withdrawList = () => import('@/pages/financialManagement/withdrawList.vue');//提现列表
//体检服务管理
const appointmentDoc = () => import('@/pages/appointmentDoc/appointmentDoc.vue');//体检预约
const personalExa = () => import('@/pages/appointmentDoc/personalExa.vue');//个检预约
const holidayMan = () => import('@/pages/appointmentDoc/holidayMan.vue');//节假日管理
/*内容管理*/
const imgText = () => import('@/pages/contentManage/imgText.vue');//图文管理
const MsgOrg = () => import('@/pages/contentManage/MsgOrg.vue');//消息管理
const recommend = () => import('@/pages/contentManage/recommend.vue');//推荐管理
const TagOrg = () => import('@/pages/contentManage/TagOrg.vue');//标签管理
const TagMan = () => import('@/pages/contentManage/TagMan.vue');//视频标签管理
const videoOrg = () => import('@/pages/contentManage/videoOrg.vue');//视频管理
const TopicMan = () => import('@/pages/contentManage/TopicMan.vue');//专题话题

/*健康管理*/
const tagControl = () => import('@/pages/healthControl/tagControl.vue');//标签管理
const checkControl = () => import('@/pages/healthControl/checkControl.vue');//检查项目管理


Vue.use(Router);

let router = new Router({
  routes: [
    {
      path:"/",
      redirect:"/login"
    },
    {
      path: '/login',
      name: 'login',
      component: login,
    },
    {
      path: '/manage',
      name: 'manage',
      component: manage,
      children: [
        {
          path: '/main',
          name: 'main',
          component: main,
          meta: ["控制台"]
        },
        {
          path: '/announcement',
          name: "announcement",
          component: announcement,
          meta: ["系统公告"]
        },
        {
          path: '/msgList',
          name: "msgList",
          component: msgList,
          meta: ["消息列表"]
        },
        {
          path: '/notice',
          name: "notice",
          component: notice,
          meta: ["系统管理", "公告管理"]
        },
        {
          path: '/edition',
          name: "edition",
          component: edition,
          meta: ["系统管理", "版本配置"]
        },
        {
          path: '/edition2',
          name: "edition2",
          component: edition2,
          meta: ["系统管理", "版本配置"],
        },
        {
          path: '/role',
          name: "role",
          component: role,
          meta: ["系统管理", "角色管理"],
        },
        {
          path: '/reportStatistics',
          component: reportStatistics,
          meta: ["运营数据","报告数据统计"]
        },
        {
          path: '/orderStatistics',
          component: orderStatistics,
          meta: ["运营数据","订单数据统计"]
        },
        {
          path: '/SMSstatistics',
          component: SMSstatistics,
          meta: ["运营数据","短信注册数据统计"]
        },
        {
          path: '/CCSstatistics',
          component: CCSstatistics,
          meta: ["运营数据","短信推送数据统计"]
        },
        {
          path: '/userFeedback',
          component: userFeedback,
          meta: ["运营数据","用户反馈数据统计"]
        },
        {
          path: '/NewsExposure',
          component: NewsExposure,
          meta: ["运营数据","查询曝光量统计数据"]
        },
        {
          path: '/pushData',
          component: pushData,
          meta: ["运营数据","推送统计数据"]
        },
        {
          path: '/user',
          name: "user",
          component: user,
          meta: ["系统管理", "用户管理"]
        },
        {
          path: '/msg_queue',
          name: "msg_queue",
          component: msg_queue,
          meta: ["系统管理", "消息队列"]
        },
        {
          path: '/message_template',
          name: "message_template",
          component: message_template,
          meta: ["系统管理", "消息模板"]
        },
        {
          path: '/menuList',
          name: "menuList",
          component: menuList,
          meta: ["系统管理", "菜单管理"]
        },
        {
          path: '/dictionary',
          name: "dictionary",
          component: dictionary,
          meta: ["系统管理", "系统常量"]
        },
        {
          path: '/listCspMessage',
          name: "listCspMessage",
          component: listCspMessage,
          meta: ["系统管理", "日志管理"]
        },
        {
          path: '/InquireReport',
          name: "InquireReport",
          component: InquireReport,
          meta: ["系统管理", "报告查询"]
        },
        {
          path: '/AppendTag',
          component: AppendTag,
          meta: ["系统管理", "标签严重密切关注"]
        },
        {
          path: '/institution',
          name: "institution",
          component: institution,
          meta: ["机构业务", "机构列表"]
        },
        {
          path: '/msgMangeList',
          name: "msgMangeList",
          component: msgMangeList,
          meta: ["机构业务", "信息管理列表"]
        },
        {
          path: '/css_manage',
          name: "CcsManage",
          component: css_manage,
          meta: ["机构业务", "新增一元听"]
        },
        {
          path: '/ccsNewManage',
          name: "ccsNewManage",
          component: ccsNewManage,
          meta: ["机构业务", "新增一元听"]
        },
        {
          path:'/ccsNewManageDetail',
          name:"ccsNewManageDetail",
          component: ccsNewManageDetail,
          meta: ["机构业务", "新增一元听","详情"]
        },
        {
          path: '/MsgPush',
          name: "MsgPush",
          component: MsgPush,
          meta: ["机构业务", "短信推送"]
        },
        {
          path: '/PhoneMsg',
          name: "PhoneMsg",
          component: PhoneMsg,
          meta: ["机构业务", "消息管理"]
        },
        {
          path: '/productTextphone/:id/:modelType',
          name: "productTextphone",
          component: productTextphone,
          meta: ["商品管理", "服务商品", "商品列表"]
        },
        {
          path: '/serviceClass',
          name: "serviceClass",
          component: serviceClass,
          meta: ["商品管理", "服务商品"]
        },
        {
          path: '/productContent',
          name: "productContent",
          component: productContent,
          meta: ["商品管理", "内容商品"]
        },
        {
          path: '/CouponList',
          name: "CouponList",
          component: CouponList,
          meta: ["商品管理", "优惠券"]
        },
        {
          path: '/SupplyChain',
          name: "SupplyChain",
          component: SupplyChain,
          meta: ["商品管理", "供应链实物商品"],
        },
        {
          path: '/ExaminationPackage',
          name: "ExaminationPackage",
          component: ExaminationPackage,
          meta: ["商品管理", "体检套餐商品"],
        },
        {
          path: '/serverShop',
          name: "serverShop",
          component: serverShop,
          meta: ["商品管理", "供应链服务商品"],
        },
        {
          path: '/SupplierMan',
          name: "SupplierMan",
          component: SupplierMan,
          meta: ["商品管理", "供应商管理"]
        },
        {
          path: '/ProductCategory',
          name: "ProductCategory",
          component: ProductCategory,
          meta: ["商品管理", "类目管理"]
        },
        {
          path: '/BatchRecommend',
          name: "BatchRecommend",
          component: BatchRecommend,
          meta: ["商品管理", "批量推荐商品类目"]
        },
        {
          path: '/ShopRecommend',
          name: "ShopRecommend",
          component: ShopRecommend,
          meta: ["商品管理", "商城推荐管理"]
        },
        {
          path: '/doctorList',
          name: "doctorList",
          component: doctorList,
          meta: ["医生管理", "医生列表"]
        },
        {
          path: '/health_manage_list',
          name: "health_manage_list",
          component: health_manage_list,
          meta: ["医生管理", "健管师列表"]
        },
        {
          path: '/benefitList/:id/:userId',
          name: "benefitList",
          component: benefitList,
          meta: ["医生管理", "医生列表", "分成比例"]
        },
        {
          path: '/indentList',
          name: "indentList",
          component: indentList,
          meta: ["医生管理", "认证列表"]
        },
        {
          path: '/refundsList',
          name: "refundsList",
          component: refundsList,
          meta: ["订单管理", "退款列表"]
        },
        {
          path: '/refundsInfo/:id',
          name: 'refundsInfo',
          component: refundsInfo,
          meta: ["订单管理", "退款详情"]
        },
        {
          path: '/orderList',
          name: 'orderList',
          component: orderList,
          meta: ["订单管理", "订单列表"]
        },
        {
          path: '/orderDetail/:orderId',
          name: 'orderDetail',
          component: orderDetail,
          meta: ["订单管理", "订单列表", "订单详情"]
        },
        {
          path: '/withdrawList',
          component: withdrawList,
          meta: ["财务管理", "提现列表"]
        },
        {
          path: '/appointmentDoc',
          component: appointmentDoc,
          meta: ["体检服务管理", "体检加项预约"]
        },
        {
          path: '/personalExa',
          component: personalExa,
          meta: ["体检服务管理", "体检套餐预约"]
        },
        {
          path: '/holidayMan',
          component: holidayMan,
          meta: ["体检服务管理", "节假日管理"]
        },
        {
          path: '/goMyself',
          component: goMyself,
          name:'goMyself',
          meta: ["个人中心"]
        },
        {
          path: '/imgText',
          component: imgText,
          meta: ["内容管理", "图文管理"]
        },
        {
          path: '/MsgOrg',
          component: MsgOrg,
          meta: ["内容管理", "消息管理"]
        },
        {
          path: '/recommend',
          component: recommend,
          meta: ["内容管理", "分类管理"]
        },
        {
          path: '/TagOrg',
          component: TagOrg,
          meta: ["内容管理", "标签管理"]
        },
        {
          path: '/TagMan',
          component: TagMan,
          meta: ["内容管理", "视频标签管理"]
        },
        {
          path: '/videoOrg',
          component: videoOrg,
          meta: ["内容管理", "视频管理"]
        },
        {
          path: '/TopicMan',
          component: TopicMan,
          meta: ["内容管理", "专题话题"]
        },
        {
          path: '/tagControl',
          component: tagControl,
          name:'tagControl',
          meta: ["健康管理", "标签管理"]
        },
        {
          path: '/checkControl',
          component: checkControl,
          name:'checkControl',
          meta: ["健康管理", "检查项目管理"]
        },
      ]
    },
  ]
});

router.beforeEach((to, from, next) => {
  let navMenu=[],arr;
  let userMesage = getStore("userMesage");
  let navListData = getStore("navMenu");
  if (!userMesage) {
    if (to.fullPath === '/' || to.fullPath === '/login') {
      next();
    } else {
      next("/login");
    }
  } else {
    if(navListData){
      arr = Base64.decode(navListData);
      navMenu = JSON.parse(arr);
      let pagePath = to.fullPath, nextStatus=false;
      for(let i=0;i<navMenu.length;i++){
        if(pagePath === navMenu[i]){
          nextStatus = true;
          break;
        }
      }
      if(nextStatus || to.fullPath==='/main' || to.fullPath==='/login' || to.name==='notice' || to.fullPath==='/announcement' || to.fullPath==='/msgList' || to.fullPath==='/goMyself' || to.name==='orderDetail' || to.name==='productTextphone' || to.name==='benefitList' || to.name==='refundsInfo'||to.name==='ccsNewManageDetail'){
        next();
      }else{
        next("/login");
      }
    }else{
      if(to.fullPath==='/main'){
        next()
      }else{
        next('/main')
      }
    }
  }
});
export default router;
