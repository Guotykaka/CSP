import Vue from 'vue'
import Router from 'vue-router'

const login = () => import('@/pages/login.vue')//登录
const doctor_index = () => import('@/pages/doctor_index.vue')//首页
const manage = () => import('@/pages/manage.vue')//管理页面
const personal = () => import('@/pages/personal.vue')//医生的个人中心
const msg = () => import('@/pages/msg.vue')//消息列表
const announcement = () => import('@/pages/announcement.vue')//系统公告
const annoDetail = () => import('@/pages/announcement/annoDetail')//系统公告详情
const tel_consult = () => import('@/pages/tel_consult.vue')//电话咨询
const imgText_consult = () => import('@/pages/imgText_consult.vue')//图为咨询
const server_setting = () => import('@/pages/server_setting.vue')//服务设置
const call_doctor = () => import('@/pages/callDoctor.vue')//服务设置
const baseInfo = () => import('@/pages/baseInfo.vue')//医生基本信息  未认证就进这个页面
const doApply = () => import('@/pages/do_apply.vue')//医生去认证

Vue.use(Router)


const router =new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login,
    },
    {
      path: '/manage',
      name: '',
      component: manage,
      children:[
        {
          path: '/doctor_index',
          name: '',
          component: doctor_index,//首页
          meta: ["首页"],
        },
        {
          path: '/announcement',
          name: '',
          component: announcement,//系统公告
          meta: ["首页","系统公告"]
        },
        {
          path: '/annoDetail',
          name:'',
          component: annoDetail,
          meta:['首页',"系统公告","详情"]
        },
        {
          path: '/personal',
          component: personal,
          meta: ["个人中心","个人账户"],//个人账户
        },{
          path: '/msg',
          component: msg,
          meta: ["个人中心","消息列表"],//消息列表
        },{
          path: '/tel_consult',
          component: tel_consult,
          meta: ["服务管理","电话咨询"],//电话咨询
        },{
          path: '/imgText_consult',
          component: imgText_consult,
          meta: ["服务管理","图文咨询"],//图文咨询
        },{
          path: '/indetification',
          component: baseInfo,//认证详情
          meta: ["服务管理","认证详情"],
        },{
          path: '/server_setting',
          component: server_setting,//服务设置
          meta: ["服务管理","服务设置"],
        },
        {
          path: '/call_doctor',
          component: call_doctor,//服务设置
          meta: ["服务管理","联系医助"],
        },
        {
          path: '/doApply',
          component: doApply,//医生操作认证
          meta: ["医生认证"],
        },
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  let authenticationStatus=localStorage.getItem("authenticationStatus");
  if(authenticationStatus !== '2'){
    if(to.fullPath==='/' || to.fullPath==='/doApply' || to.fullPath==='/indetification'){
      next()
    }else {
      alert("请先认证");
      next(false)
    }
  }else{
    next()
  }

});
export default router

