# vue-demo

> A Vue.js project

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



//开发环境

1.运行webpack.dev.conf.js

  1.引入了utile.js  对cssloader做了配置
  2.引入config文件夹index.js  对开发环境和生产环境的服务  静态文件路径做了配置
  3.引入 webpack.base.conf.js  webpack的基础配置 entry output

//生产环境





1.运行build 文件夹 build.js
  1.引入check-versions.js 检查版本文件
  2.设置  NODE_ENV = 'production'
  3.引入webpack.prod.conf.js





