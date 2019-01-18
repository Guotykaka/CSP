# 掌上体检运营端（4.5/4.6版本）

> 羽博医学

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).



## 开发环境

> ###### *运行webpack.dev.conf.js*
>
>   1.引入了utile.js  对cssloader做了配置
>   2.引入config文件夹index.js  对开发环境和生产环境的服务  静态文件路径做了配置
>   3.引入 webpack.base.conf.js  webpack的基础配置 entry output
>



## 生产环境

> *运行build 文件夹 build.js*
>   1.引入check-versions.js 检查版本文件
>   2.设置  NODE_ENV = 'production'
>   3.引入webpack.prod.conf.js



## 项目目录

```
.
|-- build                            // webpack的初始化配置
|   |-- build.js                     // 
|   |-- check-versions.js            // 
|   |-- utils.js                     // 通用方法
|   |-- vue-loader.conf.js           // 
|   |-- webpack.base.conf.js         // 配置基础
|   |-- webpack.dev.conf.js          // 运行配置
|   |-- webpack.prod.conf.js         // 生产配置

|-- config                           // 项目开发环境配置
|   |-- dev.env.js                   // 
|   |-- index.js                     // 项目打包部署配置
|   |-- mUtils.js                    // localStorage方法
|   |-- prod.env.js                  // 
|   |-- test.env.js                  // 

|-- src                              // 源码目录
|   |-- api                          // 
|       |-- api.js                   // 注册接口Api
|       |-- hash.js                  // MD5加密js
|       |-- http.js                  // 封装axios
|   |-- asset                        // 
|       |-- iconfont                 // iconfont
|       |-- img                      // img
|       |-- js                       // 
|           |--zh_CN.js              // tinymce富文本编辑器中文包
|       |-- style                    // 
|           |--common.less           // 通用CSS
|           |--mixin.less            //
|   |-- components                   // 公共组件
|       |--uploadImg                 //
|          |--uploadImgAdd.vue       // 封装又拍云上传图片
|       |--uploadVideo               //
|          |--uploadVideo.vue        // 封装又拍云上传视频
|       |-- headTop.vue              // 页面头部公共组件
|       |-- refundDetail.vue         // 订单状态
|       |-- report.vue               // 总检建议
|       |-- tinymce.vue              // tinymce富文本编辑器组件
|   |-- config                       // 路由配置和程序的基本信息配置
|       |-- env.js                   // 开发·测试·生产 数据接口路径配置
|       |-- mUtils.js                // localStorage方法
|   |-- pages                        // 页面组件
|       |-- commodityManagement      // 商品管理
|           |--listenList.vue        // 一元厅
|           |--service_info.vue      // 服务管理
|       |-- contentManage            // 内容管理
|           |--evaluate.vue          //
|           |--imgText.vue           // 图文管理
|           |--MsgOrg.vue            // 消息管理
|           |--recommend.vue         // 首页推荐管理
|           |--TagOrg.vue            // 标签管理
|           |--videoOrg.vue          // 视频管理
|       |-- doctorManagement         // 医生管理
|           |--benefitList.vue       //
|           |--doctorList.vue        // 医生列表
|           |--identificationList.vue//
|       |-- financialManagement      // 财务管理
|           |--withdrawList.vue      // 提现列表
|       |-- institutionBusiness      // 机构业务
|           |--institution.vue       // 机构列表
|           |--medical_quota.vue     // 医学指标
|           |--medicine_group.vue    // 医学分组
|           |--report_label.vue      // 报告标签
|       |-- orderManagement          // 订单管理
|           |--components
|               |--ServiceStatus.vue
|           |--orderDetail.vue
|           |--orderList.vue         // 订单列表
|           |--orderSonDetail.vue
|           |--refundsInfo.vue
|           |--refundsList.vue       // 退款列表
|       |-- systemManagement         // 系统管理
|           |--dept.vue
|           |--dictionary.vue        // 字典管理
|           |--edition.vue           // 版本配置
|           |--listCspMessage.vue    // 日志管理
|           |--menuList.vue          // 菜单管理
|           |--message_template.vue  // 消息模板
|           |--notice.vue            // 公告管理
|           |--role.vue              // 角色管理
|           |--user.vue              // 用户管理
|       |-- userSettings             // 用户设置
|           |--announcement.vue      // 系统公告
|           |--goMyself.vue          // 个人中心
|           |--login.vue             // 登录
|           |--main.vue              // 控制台
|           |--manage.vue            // 菜单
|           |--msgList.vue           // 消息列表
|       |-- menuTree.vue             // 
|       |-- msg.vue                  // 
|       |-- personal.vue             // 
|       |-- server_setting.vue       // 
|       |-- tel_consult.vue          // 
|   |-- router                       // 路由管理
|       |-- index.js                 // 本地路由配置
|   |-- store                        // vuex的状态管理
|       |-- index.js                 // 加载各种store模块
|   |-- app.vue                      // 页面入口文件
|   |-- main.js                      // 程序入口文件，加载各种公共组件

|-- static
|   |--tinymce                       // tinymce编辑器插件
|   |--viewerjs                      // 医生端预览图片插件

|-- .babelrc                         // ES6语法编译配置
|-- .editorconfig                    // 
|-- db.json                          //
|-- index.html                       // 
|-- README.md                        // 项目说明
|-- package.json                     // 配置项目相关信息，通过执行 npm init 命令创建
.
```



## 技术栈

> *vue2 + vuex + vue-router + webpack + ES6/7 + less + element-ui + upyun + tinymce*



## 项目地址

- [掌上体检CSP内网GitLab地址](http://172.0.0.43/zhangzhaohuang/csp-web)
- [掌上体检运营端生产环境地址](http://operatorweb.ybzstj.com/#/)
- [掌上体检运营端测试环境地址](http://172.0.0.42:82/#/)



## 开发人员

- [乐欣](https://github.com/tujiHaha)
- [张瞾煌](https://github.com/FireBrilliant)
- [郭天佑](https://github.com/gtygty)