import Vue from 'vue'
import Router from 'vue-router'
import {setStore, getStore} from "@/config/mUtils.js";
import {type} from 'os';


// const personal = () => import('@/pages/personal.vue');//医生的个人中心
// const msg = () => import('@/pages/msg.vue');//消息列表
// const server_setting = () => import('@/pages/server_setting.vue');//服务设置
// const indenBaseInfo = () => import('@/pages/indentification_baseInfo.vue');//医生基本信息
// const tel_consult = () => import('@/pages/tel_consult.vue');//电话咨询
// const imgText_consult = () => import('@/pages/imgText_consult.vue');//图为咨询
// const GroupControl = () => import('@/pages/healthControl/GroupControl.vue');//分组管理
// const reinspection = () => import('@/pages/healthControl/Reinspection.vue');//复检建议
// const dataBoard = () => import('@/pages/healthControl/dataBoard.vue');//复检建议
// const Setting_up_service = () => import('@/pages/healthControl/Setting_up_service.vue');//服务设置

/*医生端配置页面*/
const login = () => import('@/pages/login.vue');//登录
const doctor_index = () => import('@/pages/doctor_index.vue');//医生首页
const user_index = () => import('@/pages/user_index.vue');//用户首页
const manage = () => import('@/pages/manage.vue');//管理页面
const announcement = () => import('@/pages/announcement.vue');//系统公告
const annoDetail = () => import('@/pages/announcement/annoDetail');//系统公告详情
const call_doctor = () => import('@/pages/callDoctor.vue');//服务设置未认证就进这个页面
const doApply = () => import('@/pages/do_apply.vue');//医生去认证
const export_order = () => import('@/pages/export-order.vue');//导出订单
/*健康管理*/
const reportPage = () => import('@/pages/healthControl/components/reportPage.vue');//成员管理=>体检报告
const reinsAdvice = () => import('@/pages/healthControl/reinsAdvice.vue');//健康管理=>咨询页面

/*new菜单导航设置*/
//账户管理
const cashWithdrawal = () => import('@/pages/Account/cashWithdrawal.vue');//提现
const indentBaseInfo = () => import('@/pages/Account/indentification_baseInfo.vue');//认证详情
const serverSetting = () => import('@/pages/Account/server_setting.vue');//医生服务设置
const healthSetting = () => import('@/pages/Account/healthSetting.vue');//健康服务设置
//消息管理
const bill = () => import('@/pages/News/newsList.vue');//消息列表
//数据统计
const reportData = () => import('@/pages/Statistics/reportData.vue');//报告数据
const msgPlan = () => import('@/pages/Statistics/msgPlan.vue');//消息计划
const abnormal = () => import('@/pages/Statistics/abnormal.vue');//异常项数据
const followData = () => import('@/pages/Statistics/followData.vue');//异常项数据
//体检管理
const individual = () => import('@/pages/Examination/individual.vue');//体检套餐
const reservationTask = () => import('@/pages/Examination/reservationTask.vue');//预约管理
//客户管理
const customerMsg = () => import('@/pages/Customer/customerMsg.vue');//客户消息管理
const evaluation = () => import('@/pages/Customer/evaluation.vue');//客户评价管理
const groupControl = () => import('@/pages/Customer/groupControl.vue');//分组管理
const memberControl = () => import('@/pages/Customer/memberControl.vue');//成员管理
//健康档案
const healthReport = () => import('@/pages/Archives/healthReport.vue');//健康问卷
const checkData = () => import('@/pages/Archives/checkData.vue');//体检数据
const testData = () => import('@/pages/Archives/testData.vue');//检测数据
//随访管理
const prompt = () => import('@/pages/Follow/prompt.vue');//复检提示
const followPlan = () => import('@/pages/Follow/followPlan.vue');//随访计划
const followTips = () => import('@/pages/Follow/followTips.vue');//随访提示
const SatisfactionPlan = () => import('@/pages/Follow/SatisfactionPlan.vue');//客户满意计划
const consultations = () => import('@/pages/Follow/consultation.vue');//复检咨询
const recheckAdvice = () => import('@/pages/Follow/recheckAdvice.vue');//复检建议
//健康管理
const diet = () => import('@/pages/Health/diet.vue');//膳食管理
const medication = () => import('@/pages/Health/medication.vue');//用药管理
const motion = () => import('@/pages/Health/motion.vue');//运动管理
const psychology = () => import('@/pages/Health/psychology.vue');//心理管理
const sleep = () => import('@/pages/Health/sleep.vue');//睡眠管理

//健康咨询
const imageText = () => import('@/pages/Consultation/imageText.vue');//图文咨询
const phoneType = () => import('@/pages/Consultation/phoneType.vue');//电话咨询

//平台服务
const free_img = () => import('@/pages/Platform/FreeImg.vue');//免费图文咨询
const free_img_watch = () => import('@/pages/Platform/freeImgWatch.vue');//免费图文咨询监督
const transfer_order = () => import('@/pages/Platform/transfer-order.vue');//电话报告解读监督页面
const InquireReport = () => import('@/pages/Platform/InquireReport.vue');//查询体检报告

//商品管理
const consultation = () => import('@/pages/commodity/Consultation.vue');//商品咨询
const Additional = () => import('@/pages/commodity/Additional.vue');//加项咨询

Vue.use(Router);
const router = new Router({
  routes: [
    {
      path: '/',
      redirect:'/login'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/manage',
      name: '',
      component: manage,
      children: [
        {
          path: '/doctor_index',
          name: 'doctor_index',
          component: doctor_index,
          meta: ["首页"]
        },
        {
          path: '/user_index',
          name: 'user_index',
          component: user_index,
          meta: ["用户首页"]
        },
        {
          path: '/announcement',
          name: 'announcement',
          component: announcement,
          meta: ["首页", "系统公告"]
        },
        {
          path: '/annoDetail',
          name: 'annoDetail',
          component: annoDetail,
          meta: ['首页', "系统公告", "详情"]
        },
        {
          path: '/call_doctor',
          name: "call_doctor",
          component: call_doctor,
          meta: ["服务管理", "联系医助"]
        },
        {
          path: '/doApply',
          name: "doApply",
          component: doApply,
          meta: ["医生认证"]
        },
        {
          path: '/export_order',
          name: "export_order",
          component: export_order,
          meta: ["导出订单"]
        },
        {
          path: '/reportPage/:mobile/:customerName',
          name: "reportPage",
          component: reportPage,
          meta: ["健康管理", "分组管理", "成员管理","体检报告"],
        },
        {
          path: '/reinsAdvice',
          name: "reinsAdvice",
          component: reinsAdvice,
          meta: ["健康管理", "咨询页面"]
        }
      ]
    },
    {
      path:'/account',
      name:'',
      component:manage,
      children:[
        {
          path: 'cashWithdrawal',
          name: "cashWithdrawal",
          component: cashWithdrawal,
          meta: ["账户管理", "提现"]
        },
        {
          path: 'indentBaseInfo',
          name: "indentBaseInfo",
          component: indentBaseInfo,
          meta: ["账户管理", "认证详情"]
        },
        {
          path: 'serverSetting',
          name: "serverSetting",
          component: serverSetting,
          meta: ["账户管理", "医生服务设置"]
        },
        {
          path: 'healthSetting',
          name: "healthSetting",
          component: healthSetting,
          meta: ["账户管理", "健康服务设置"]
        },
      ]
    },
    {
      path:'/news',
      name:'',
      component:manage,
      children:[
        {
          path: 'bill',
          name: "bill",
          component: bill,
          meta: ["消息管理", "消息列表"]
        }
      ]
    },
    {
      path:'/statistics',
      component:manage,
      children:[
        {
          path: 'reportData',
          name: "reportData",
          component: reportData,
          meta: ["数据统计", "报告数据"]
        },
        {
          path: 'msgPlan',
          name: "msgPlan",
          component: msgPlan,
          meta: ["数据统计", "消息计划数据"]
        },
        {
          path: 'abnormal',
          name: "abnormal",
          component: abnormal,
          meta: ["数据统计", "异常项数据"]
        },
        {
          path: 'followData',
          name: "followData",
          component: followData,
          meta: ["数据统计", "随访统计"]
        }
      ]
    },
    {
      path:'/examination',
      component:manage,
      children:[
        {
          path: 'individual',
          name: "individual",
          component: individual,
          meta: ["体检管理", "体检套餐管理"]
        },
        {
          path: 'reservationTask',
          name: "reservationTask",
          component: reservationTask,
          meta: ["体检管理", "预约管理"]
        }
      ]
    },
    {
      path:'/customer',
      component:manage,
      children:[
        {
          path: 'customerMsg',
          name: "customerMsg",
          component: customerMsg,
          meta: ["客户管理", "客户信息管理"]
        },
        {
          path: 'evaluation',
          name: "evaluation",
          component: evaluation,
          meta: ["客户管理", "客户评价管理"]
        },
        {
          path: 'groupControl',
          name: "groupControl",
          component: groupControl,
          meta: ["客户管理", "分组管理"]
        },
        {
          path: 'memberControl/:groupId',
          name: "memberControl",
          component: memberControl,
          meta: ["客户管理", "分组管理", "成员管理"],
        },
      ]
    },
    {
      path:'/archives',
      component:manage,
      children:[
        {
          path: 'checkData',
          name: "checkData",
          component: checkData,
          meta: ["健康档案", "体检数据"]
        },
        {
          path: 'healthReport',
          name: "healthReport",
          component: healthReport,
          meta: ["健康档案", "健康问卷"]
        },
        {
          path: 'testData',
          name: "testData",
          component: testData,
          meta: ["健康档案", "检测数据"]
        }
      ]
    },
    {
      path:'/follow',
      component:manage,
      children:[
        {
          path: 'prompt',
          name: "prompt",
          component: prompt,
          meta: ["随访管理", "复检建议", "复检提示"]
        },
        {
          path: 'followPlan',
          name: "followPlan",
          component: followPlan,
          meta: ["随访管理", "随访计划管理"]
        },
        {
          path: 'followTips',
          name: "followTips",
          component: followTips,
          meta: ["随访管理", "随访提示"]
        },
        {
          path: 'SatisfactionPlan',
          name: "SatisfactionPlan",
          component: SatisfactionPlan,
          meta: ["随访管理", "客户满意度计划"]
        },
        {
          path: 'consultations',
          name: "consultations",
          component: consultations,
          meta: ["随访管理", "复检建议", "复检咨询"]
        },
        {
          path: 'recheckAdvice',
          name: "recheckAdvice",
          component: recheckAdvice,
          meta: ["随访管理", "复检建议"]
        }
      ]
    },
    {
      path:'/health',
      component:manage,
      children:[
        {
          path: 'diet',
          name: "diet",
          component: diet,
          meta: ["健康管理", "膳食管理"]
        },
        {
          path: 'medication',
          name: "medication",
          component: medication,
          meta: ["健康管理", "用药管理"]
        },
        {
          path: 'motion',
          name: "motion",
          component: motion,
          meta: ["健康管理", "运动管理"]
        },
        {
          path: 'psychology',
          name: "psychology",
          component: psychology,
          meta: ["健康管理", "心理管理"]
        },
        {
          path: 'sleep',
          name: "sleep",
          component: sleep,
          meta: ["健康管理", "睡眠管理"]
        }
      ]
    },
    {
      path:'/consultation',
      component:manage,
      children:[
        {
          path: 'imageText',
          name: "imageText",
          component: imageText,
          meta: ["健康咨询", "图文咨询"]
        },
        {
          path: 'phoneType',
          name: "phoneType",
          component: phoneType,
          meta: ["健康咨询", "电话咨询"]
        }
      ]
    },
    {
      path:'/platform',
      component:manage,
      children:[
        {
          path: 'FreeImg',
          name: "FreeImg",
          component: free_img,
          meta: ["平台服务", "免费图文咨询"]
        },
        {
          path: 'freeImgWatch',
          name: "freeImgWatch",
          component: free_img_watch,
          meta: ["平台服务", "免费图文监督"]
        },
        {
          path: 'InquireReport',
          name: "InquireReport",
          component: InquireReport,
          meta: ["平台服务", "体检报告查询"]
        },
        {
          path: 'transfer_order',
          name: "transfer_order",
          component: transfer_order,
          meta: ["平台服务","电话报告监督"]
        },
      ]
    },
    {
      path:'/commodity',
      component:manage,
      children:[
        {
          path: 'consultation',
          name: "consultation",
          component: consultation,
          meta: ["商品管理", "商品咨询"]
        },
        {
          path: 'additional',
          name: "Additional",
          component: Additional,
          meta: ["商品管理", "加项咨询"]
        },
      ]
    }
  ]
});

setStore('timeSpan', Math.round(new Date().getTime() / 1000));

router.beforeEach((to, from, next) => {

  if(to.fullPath === '/' || to.fullPath === '/login'){
    next();
    return;
  }

  const FIXTIME = 5400;
  let timeSpan = parseInt(getStore("timeSpan")) || 0;
  let currentSpan = Math.round(new Date().getTime() / 1000);
  if ((currentSpan - timeSpan) > FIXTIME) {
    next('/login');
    return;
  }

  setStore('timeSpan',currentSpan);
  let isHasMenu=checkMenu(to.fullPath);

  if(isHasMenu){
    next();
  }else {
    next(false);
  }
});

function checkMenu(toPath) {
  let flag=false;
  let navMenu=JSON.parse(getStore("navMenu")) || [];
  for (let i=0;i < navMenu.length;i++){
    if(toPath.indexOf(navMenu[i]) >= 0){
      flag =true;
      break;
    }
  }
  return flag
}

export default router

