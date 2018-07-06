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
  }),
  app.get('/api/list', (req, res) => {
    res.json({
      errno: 0,
      data: page.list
    })
  }),
  app.get('/api/ratings', (req, res) => {
    res.json({
      errno: 0,
      data: ratings
    })
  }),
  app.post('/api/noticeList', function (req, res) { // 注意这里改为post就可以了
    res.json({
      errno: 0,
      data: notice
    });
  }),
  app.post('/api/userList', function (req, res) { // 注意这里改为post就可以了
    res.json({
      errno: 0,
      data: user
    });
  }),
  app.post('/api/roleList', function (req, res) { // 注意这里改为post就可以了
    res.json({
      errno: 0,
      data: role
    });
  }),
  app.post('/api/medicineGroupList', function (req, res) { // 注意这里改为post就可以了
    res.json({
      errno: 0,
      data: medicineGroup
    });
  }),
  app.post('/api/report_label', function (req, res) { // 注意这里改为post就可以了
    res.json({
      errno: 0,
      data: report_label
    });
  }),
  app.post('/api/institution', function (req, res) { // 机构列表
    res.json({
      errno: 0,
      data: institution
    });
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
