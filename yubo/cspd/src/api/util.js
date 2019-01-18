//管理localStorage
//系统环境配置
var environment = "DEV";

//又拍云上传根目录地址
var yunEnvPath = "/CSPO/" + environment;

export const storeManager = {
  //insDoctorId
  getInsDoctorId: function () {
    return localStorage.getItem('insDoctorId');
  },
  setInsDoctorId: function (insDoctorId) {
    localStorage.setItem('insDoctorId', insDoctorId);
  },
  //DoctorName
  getDoctorName: function () {
    return localStorage.getItem('doctorName');
  },
  setDoctorName: function (doctorName) {
    localStorage.setItem('doctorName', doctorName);
  },

  //serviceProviderType  1是医生  2是健管师
  setServiceProviderType: function (typeNum) {
    localStorage.setItem('serviceProviderType', typeNum);
  },

  getServiceProvidertype: function () {
    return localStorage.getItem('serviceProviderType');
  },

  //authenticationStatus认证状态
  setAuthenticationStatus: function (authenticationStatus) {
    //认证状态 默认0未认证，1认证中 2已认证，3已取消，4已拒绝
    localStorage.setItem('authenticationStatus', authenticationStatus);
  },
  getAuthenticationStatus: function () {
    return localStorage.getItem('authenticationStatus');
  },

  //存角色 1是医生 2是主任
  setRoleType: function (typeNum) {
    localStorage.setItem('roleType', typeNum);
  },

  //存角色 1是医生 2是主任
  getRoleType: function () {
    return localStorage.getItem('roleType');
  },

  //存userId
  setUserId: function (uid) {
    localStorage.setItem('userId', uid);
  },

  //存获取userId
  getUserId: function () {
    return localStorage.getItem('userId');
  },

  //存头像
  setAvatar: function (url) {
    localStorage.setItem('avatar', url);
  },

  //获取头像
  getAvatar: function () {
    return localStorage.getItem('avatar') || '/cspd/statics/img/logo.jpg';
  },
  removeStorage: function () {
    localStorage.clear();
  },
  //字符串解密
  uncompile: function (code) {
    if (!code) {
      return;
    }
    return unescape(code.replace(/\\u/gi, '%u'));
  },
  /**
   * 又拍云文件上传配置
   * @type {{ComboBaseUrl: string, bucket: string, form_api_secret: string, DoctorHeader: string}}
   */
  ComboConfig: {
    ComboBaseUrl: 'http://zhangshangtijian.b0.upaiyun.com',
    bucket: 'zhangshangtijian',
    form_api_secret: 'P7m/d7lpB92oXcyRsZqXz/XEig4=',
    DoctorHeader: yunEnvPath + '/default/DoctorHeader',                   // 问答圈健管师头像
  },
  //随机数
  randomString:function(len) {
  len = len || 32;
  var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = $chars.length;
  var pwd = '';
  for ( var i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
},
  mbTest(){
    var test = /^(13|14|15|18|17)[0-9]{9}$/;
    return test
  }
}
/*base64解密*/
export const Base64 = require('js-base64').Base64;




