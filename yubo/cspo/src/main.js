// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.pages.conf with an alias.
import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store/index.js'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import './asset/iconfont/iconfont.css'
import '../static/tinymce/tinymce.min.js'
Vue.prototype.$http = axios

Vue.config.productionTip = false;
Vue.use(ElementUI);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
