import Vue from 'vue'
import Router from 'vue-router'
import "@/asset/style/common.less"
import "@/asset/style/mixin.less"






const login = () => import('@/pages/login.vue')//登录
const manage = () => import('@/pages/manage.vue')//管理页面
const personal = () => import('@/pages/personal.vue')//医生的个人中心
const msg = () => import('@/pages/msg.vue')//消息列表
const tel_consult = () => import('@/pages/tel_consult.vue')//电话咨询
const imgText_consult = () => import('@/pages/imgText_consult.vue')//图为咨询
const indetification = () => import('@/pages/identification.vue')//认证详情
const server_setting = () => import('@/pages/server_setting.vue')//服务设置

Vue.use(Router)

export default new Router({
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
          path: '',
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
          component: indetification,//认证详情
          meta: ["服务管理","认证详情"],
        },{
          path: '/server_setting',
          component: server_setting,//服务设置
          meta: ["服务管理","服务设置"],
        },
      ]
    },
  ]
})
