'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
//首先

var appData = require('../db.json')//加载本地数据文件
var role = appData.role//获取角色的本地数据
var page = appData.page//获取对应的本地数据
var notice = appData.notice//获取公告的本地数据
var user = appData.user//获取用户的本地数据
var medicineGroup = appData.medicineGroup//获取医学分组的本地数据
var report_label = appData.report_label//获取报告标签的本地数据
var institution = appData.institution//获取机构列表本地数据
var service_info = appData.service_info//获取服务管理本地数据
var yiyuanting = appData.yiyuanting//获取一元厅本地数据
var message_template1 = appData.message_template1//短信模板
var message_template2 = appData.message_template2//手机推送模板
var queryInsLeaveWordList = appData.queryInsLeaveWordList//获取个人中心聊天数据
var queryInsLeaveWordAnswerList = appData.queryInsLeaveWordAnswerList//查看个人中心聊天数据

var listServiceDict = appData.listServiceDict//订单列表词典
var tradeList = appData.tradeList//主订单列表
var cspOrderList = appData.cspOrderList//子订单列表
var tradeInfo = appData.tradeInfo//主订单详情
var getRefundDetail = appData.getRefundDetail//退款详情
var cspOrderInfo = appData.cspOrderInfo//子订单详情图文咨询
var cspOrderInfo1 = appData.cspOrderInfo1//子订单详情电话报告解读


const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    //然后找到devServer,在里面添加
before(app) {
  app.get('/api/page', (req, res) => {
    res.json({
      errno: 0,
      // data: seller
      data: page
    })//接口返回json数据，上面配置的数据seller就赋值给data请求后调用
  });
  app.get('/api/list', (req, res) => {
    res.json({
      errno: 0,
      data: page.list
    })
  });
  app.get('/api/ratings', (req, res) => {
    res.json({
      errno: 0,
      data: ratings
    })
  });
  app.post('/api/noticeList', function (req, res) { // 注意这里改为post就可以了
    res.json({
      errno: 0,
      data: notice
    });
  });
  app.post('/api/userList', function (req, res) { // 注意这里改为post就可以了
    res.json({
      errno: 0,
      data: user
    });
  });
  app.post('/api/roleList', function (req, res) { // 注意这里改为post就可以了
    res.json({
      errno: 0,
      data: role
    });
  });
  app.post('/api/medicineGroupList', function (req, res) { // 注意这里改为post就可以了
    res.json({
      errno: 0,
      data: medicineGroup
    });
  });
  app.post('/api/report_label', function (req, res) { // 注意这里改为post就可以了
    res.json({
      errno: 0,
      data: report_label
    });
  });
  app.post('/api/institution', function (req, res) { // 机构列表
    res.json({
      errno: 0,
      data: institution
    });
  });
  app.post('/api/service_info', function (req, res) { // 机构列表
    res.json({
      errno: 0,
      data: service_info
    });
  });
  app.post('/api/yiyuanting', function (req, res) { // 一元听
    res.json({
      errno: 0,
      data: yiyuanting
    });
  });
  app.post('/api/message_template1', function (req, res) { // 短信模板
    res.json({
      errno: 0,
      data: message_template1
    });
  });
  app.post('/api/message_template2', function (req, res) { // 手机推送模板
    res.json({
      errno: 0,
      data: message_template2
    });
  });
  app.post('/api/queryInsLeaveWordList', function (req, res) { //
    res.json(queryInsLeaveWordList);
  });
  app.post('/api/queryInsLeaveWordAnswerList', function (req, res) { // 机构列表
    res.json(queryInsLeaveWordAnswerList);
  });
  app.get('/api/listServiceDict', function (req, res) { // 机构列表
    res.json(listServiceDict);
  });
  app.post('/api/tradeList', function (req, res) { // 机构列表
    res.json(tradeList);
  });
  app.post('/api/cspOrderList', function (req, res) { // 机构列表
    res.json(cspOrderList);
  });
  app.post('/api/tradeInfo', function (req, res) { // 机构列表
    res.json(tradeInfo);
  });
  app.post('/api/getRefundDetail', function (req, res) { // 机构列表
    res.json(getRefundDetail);
  });
  app.post('/api/cspOrderInfo', function (req, res) { // 机构列表
    res.json(cspOrderInfo);
  });
  app.post('/api/cspOrderInfo1', function (req, res) { // 机构列表
    res.json(cspOrderInfo1);
  });
},

    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
