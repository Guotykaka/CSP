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

var appData = require('../data.json');//加载本地数据文件
var seller = appData.seller//获取对应的本地数据
var nav = appData.nav//获取导航目录
var countUserNewsList = appData.countUserNewsList; //获取对应的本地数据
var userInfo = appData.userInfo;
var getSysNoticeInfo = appData.getSysNoticeInfo;
var getDoctorAccountInfo = appData.getDoctorAccountInfo;
var listAccountRecord = appData.listAccountRecord;
var getOrderInfo = appData.getOrderInfo;
var queryPhoneConsultationOrder = appData.queryPhoneConsultationOrder;
var getSMSTemplate = appData.getSMSTemplate;
var getOrderNumber = appData.getOrderNumber;
var list = appData.list;
var queryInsConsultChatList = appData.queryInsConsultChatList;
var countUnReadMsgByOrderStatus = appData.countUnReadMsgByOrderStatus;
var queryTradeDetail = appData.queryTradeDetail;
var queryDoctorApplyInfo = appData.queryDoctorApplyInfo;
var queryInsServiceDoctorByUserId = appData.queryInsServiceDoctorByUserId;
var noticeTitleQuery = appData.noticeTitleQuery;
var getDictionaryByKey = appData.getDictionaryByKey;
var sendSMS = appData.sendSMS;
var queryInsLeaveWordList = appData.queryInsLeaveWordList;
var queryInsLeaveWordAnswerList = appData.queryInsLeaveWordAnswerList;

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
    before(app) {
      app.get('/api/nav', (req, res) => {
        res.json(nav)//接口返回json数据，上面配置的数据seller就赋值给data请求后调用
      });
      app.get('/api/countUserNewsList', (req, res) => {
        res.json(countUserNewsList)//接口返回json数据，上面配置的数据seller就赋值给data请求后调用
      });
      app.get('/api/getSysNoticeInfo', (req, res) => {
        res.json(getSysNoticeInfo)//接口返回json数据，上面配置的数据seller就赋值给data请求后调用
      });
      app.post('/api/getDictionaryByKey', (req, res) => {
        res.json(getDictionaryByKey)//接口返回json数据，上面配置的数据seller就赋值给data请求后调用
      });
      app.post('/api/seller', function(req, res){
        res.json({
          errno: 0,
          data: seller
        })//接口返回json数据，上面配置的数据seller就赋值给data请求后调用
      });
      app.post('/api/getOrderNumber', function(req, res){
        res.json(getOrderNumber)//获取图文咨询顶部数据
      });
      app.post('/api/list', function(req, res){
        res.json(list)//获取图文咨询订单列表
      });
      app.post('/api/queryInsConsultChatList', function(req, res){
        res.json(queryInsConsultChatList)//相应订单的聊天详情
      });
      app.post('/api/countUnReadMsgByOrderStatus', function(req, res){
        res.json(countUnReadMsgByOrderStatus)//检查信息阅读状态
      });
      app.post('/api/queryTradeDetail', function(req, res){
        res.json(queryTradeDetail)//相应订单详情
      });
      app.post('/api/getDoctorAccountInfo', function(req, res){
        res.json(getDoctorAccountInfo)
      });
      app.post('/api/listAccountRecord', function(req, res){
        res.json(listAccountRecord)
      });
      app.post('/api/getOrderInfo', function(req, res){
        res.json(getOrderInfo)
      });
      app.post('/api/queryPhoneConsultationOrder', function(req, res){
        res.json(queryPhoneConsultationOrder)
      });
      app.post('/api/getSMSTemplate', function(req, res){
        res.json(getSMSTemplate)
      });
      app.post('/api/sendSMS', function(req, res){
        res.json(sendSMS)
      });
      app.post('/api/queryInsLeaveWordAnswerList', function(req, res){
        res.json(queryInsLeaveWordAnswerList)
      });
      app.post('/api/queryInsLeaveWordList', function(req, res){
        res.json(queryInsLeaveWordList)
      });
      app.get('/api/noticeTitleQuery', function(req, res){
        res.json(noticeTitleQuery)//公告列表
      })

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
