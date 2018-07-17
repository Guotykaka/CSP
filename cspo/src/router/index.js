import Vue from 'vue'
import Router from 'vue-router'
import "@/asset/style/common.less"
import "@/asset/style/mixin.less"
import {getStore} from '@/config/mUtils.js'


const login = () => import('@/pages/login.vue')//登录
const manage = () => import('@/pages/manage.vue')//管理页面
const main = () => import('@/pages/main.vue')//控制台
const announcement = () => import('@/pages/announcement.vue')//系统公告
const msgList = () => import('@/pages/msgList.vue')//消息列表
//系统管理
const notice = () => import('@/pages/notice.vue')//公告管理
const role = () => import('@/pages/role.vue')//角色管理
// const dept = () => import('@/pages/dept.vue')//部门管理
const user = () => import('@/pages/user.vue')//用户管理
const message_template = () => import('@/pages/message_template.vue')//消息模板
//机构业务
const institution = () => import('@/pages/institution.vue')//机构列表
const medicine_group = () => import('@/pages/medicine_group.vue')//医学分组
const report_label = () => import('@/pages/report_label.vue')//报告标签
const medical_quota = () => import('@/pages/medical_quota.vue')//医学指标
//商品管理
const service_info = () => import('@/pages/service_info.vue')//服务管理
const listenList = () => import('@/pages/listenList.vue')//服务管理


//医生管理
const doctorList = () => import('@/pages/doctorList.vue')//医生列表
const benefitList = () => import('@/pages/benefitList.vue')//分成比例
const indentList = () => import('@/pages/identificationList.vue')//认证列表

//订单管理
const refundsList = () => import('@/pages/refundsList.vue')//退款列表
const refundsInfo = () => import('@/pages/refundsInfo.vue')//退款详情


const orderList = () => import('@/pages/orderList.vue')//订单列表
const orderDetail = () => import('@/pages/orderDetail.vue')//主订单详情
const orderSonDetail = () => import('@/pages/orderSonDetail.vue')//子订单详情
const refundDetail = () => import('@/components/refundDetail.vue')//订单详情---退款详情

//财务管理
const withdrawList = () => import('@/pages/withdrawList.vue')//提现列表

//用户设置
const goMyself = () => import('@/pages/goMyself.vue')//个人中心

Vue.use(Router)

let router =  new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      alias: '/',
      component: login,
    },
    {
      path: '/manage',
      name: '',
      component: manage,
      children: [
        {
          path: '/main',
          component: main,
          meta: ["控制台"],//控制台
        },{
          path: '/announcement',
          component: announcement,
          meta: ["系统公告"],//announcement
        },{
          path: '/msgList',
          component: msgList,
          meta: ["消息列表"],//消息列表
        },{
          path: '/notice',
          component: notice,
          meta: ["系统管理", "公告管理"],//公告管理
        },
        {
          path: '/role',
          component: role,
          meta: ["系统管理", "角色管理"],//角色管理
        },
        // {
        //   path: '/dept',
        //   component: dept,
        //   meta: ["系统管理","部门管理"],//部门管理
        // },
        {
          path: '/user',
          component: user,
          meta: ["系统管理", "用户管理"],//用户管理
        },
        {
          path: '/message_template',
          component: message_template,
          meta: ["系统管理", "消息模板"],//消息模板
        },
        {
          path: '/institution',
          component: institution,
          meta: ["机构业务", "机构列表"],//机构列表
        },
        {
          path: '/medicine_group',
          component: medicine_group,
          meta: ["机构业务", "医学分组"],//医学分组
        },
        {
          path: '/report_label',
          component: report_label,//报告标签
          meta: ["机构业务", "报告标签"],
        },
        {
          path: '/medical_quota',
          component: medical_quota,//医学指标
          meta: ["机构业务", "医学指标"],
        },
        {
          path: '/medical_quota',
          component: medical_quota,//医学指标
          meta: ["机构业务", "医学指标"],
        },
        {
          path: '/service_info',
          component: service_info,//商品管理 服务管理
          meta: ["商品管理","服务管理"],
        },
        {
          path: '/listenList',
          component: listenList,//商品管理 一元听
          meta: ["商品管理","一元听"],
        },
        {
          path: '/doctorList',
          component: doctorList,//医生管理 医生列表
          meta: ["医生管理", "医生列表"],
        },
        {
          path: '/benefitList/:id/:userId',
          component: benefitList,//分成比例
          meta: ["医生管理", "医生列表","分成比例"],
        },
        {
          path: '/indentList',
          component: indentList,//医生管理 认证列表
          meta: ["医生管理", "认证列表"],
        },
        {
          path: '/refundsList',
          component: refundsList,//订单管理 退款列表
          meta: ["订单管理", "退款列表"],
        },
        {
          path: '/refundsInfo/:id',
          name:'refundsInfo',
          component: refundsInfo,//订单管理 退款详情
          meta: ["订单管理", "退款详情"],
        },
        {
          path: '/orderList',
          component: orderList,//订单管理 订单列表
          meta: ["订单管理", "订单列表"],
        },
        {
          path: '/orderList/orderDetail',
          name:'orderDetail',
          component: orderDetail,//订单管理 订单列表
          meta: ["订单管理", "主订单列表","订单详情"],
        },
        {
          path: '/orderList/orderSonDetail',
          name:'orderSonDetail',
          component: orderSonDetail,//子订单管理 订单列表
          meta: ["订单管理", "子订单列表","订单详情"],
        },
        {
          path: '/orderList/refundDetail',
          name:'refundDetail',
          component: refundDetail,//订单管理 订单列表
          meta: ["订单管理", "订单列表","退款详情"],
        },
        {
          path: '/withdrawList',
          component: withdrawList,//财务管理 提现列表
          meta: ["财务管理", "提现列表"],
        },
        {
          path: '/goMyself',
          component: goMyself,//财务管理 提现列表
          meta: ["个人中心"],
        },
      ]
    },
  ]
});

export default router;
