import Vue from 'vue'
import Router from 'vue-router'
import "@/asset/style/common.less"
import "@/asset/style/mixin.less"






const login = () => import('@/pages/login.vue')//登录
const manage = () => import('@/pages/manage.vue')//管理页面
const notice = () => import('@/pages/notice.vue')//公告管理
const role = () => import('@/pages/role.vue')//角色管理
// const dept = () => import('@/pages/dept.vue')//部门管理
const user = () => import('@/pages/user.vue')//用户管理
const institution = () => import('@/pages/institution.vue')//机构列表
const medicine_group = () => import('@/pages/medicine_group.vue')//医学分组
const report_label = () => import('@/pages/report_label.vue')//报告标签
const medical_quota = () => import('@/pages/medical_quota.vue')//医学指标

//医生管理
const doctorList = () => import('@/pages/doctorList.vue')//医生列表
const indentList = () => import('@/pages/identificationList.vue')//认证列表


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
          path: '/notice',
          component: notice,
          meta: ["系统管理","公告管理"],//公告管理
        },{
          path: '/role',
          component: role,
          meta: ["系统管理","角色管理"],//角色管理
        },
        // {
        //   path: '/dept',
        //   component: dept,
        //   meta: ["系统管理","部门管理"],//部门管理
        // },
        {
          path: '/user',
          component: user,
          meta: ["系统管理","用户管理"],//用户管理
        },{
          path: '/institution',
          component: institution,
          meta: ["机构业务","机构列表"],//机构列表
        },{
          path: '/medicine_group',
          component: medicine_group,
          meta: ["机构业务","医学分组"],//医学分组
        },{
          path: '/report_label',
          component: report_label,//报告标签
          meta: ["机构业务","报告标签"],
        },{
          path: '/medical_quota',
          component: medical_quota,//医学指标
          meta: ["机构业务","医学指标"],
        },{
          path: '/medical_quota',
          component: medical_quota,//医学指标
          meta: ["机构业务","医学指标"],
        },{
          path: '/doctorList',
          component: doctorList,//医生管理 医生列表
          meta: ["医生管理","医生列表"],
        },
      ]
    },
  ]
})
