import axios from 'axios';
import md5 from 'js-md5';
axios.defaults.baseURL="/Api";

export function get(url, data) {
  var data = data;
  data.timespan= Math.round(new Date().getTime() / 1000); //增加时间戳
  var preSign = {};
  extendFn(preSign, data);
  preSign.secret = secret; //加密串
  var safeStr = unescape(encodeURIComponent(key + ':' + getZSTJsign(preSign)));
  var btoaCode = btoa(safeStr);
  btoaCode = 'BasicAuth ' + btoaCode;
  axios.defaults.headers.common['Authorization'] = btoaCode;
  axios.defaults.headers.post['Authorization'] = btoaCode;

  return new Promise((resolve, reject) => {
    axios.get(url,data).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

function extendFn (source, destination) {
  for (var property in destination) {
    source[property] = destination[property];
  }
  return source;   // 返回扩展后的对象
};

//设置sign
function getZSTJsign(preSign){
  var arrayKey =[];
  var lowCaseParams = {};
  for(var key in preSign){
    var lowCaseKey = key.toLowerCase();
    arrayKey.push(lowCaseKey);
    lowCaseParams[lowCaseKey] = preSign[key];
  }
  arrayKey.sort();  //排序
  var newPreSign = {};
  for(var i in arrayKey){
    var key = arrayKey[i];
    newPreSign[key] = lowCaseParams[key];  //赋值
  }
  newPreSign = JSON.stringify(newPreSign);//转字符串
  newPreSign = newPreSign.toLowerCase();  //转换小写

  var sign = md5(newPreSign);  //md5加密
  return sign;
};

//设置BasicAuth
function getBasicAuthHandler () {
  var httpUrl = arguments[0];
  var postData = arguments[1];
  var sign = getHttpAuthSignHandler(httpUrl, postData);
  var safeStr = unescape(encodeURIComponent(config.AppKey + ':' + sign));
  var btoaCode = btoa(safeStr);
  btoaCode = 'Basic ' + btoaCode;
  return btoaCode;
};

function getHttpAuthSignHandler (httpUrl, postData) {
  var preSign = httpUrl;
  if (postData) {
    postData = JSON.stringify(postData);
    preSign += '|' + postData;
  }
  preSign += '|' + config.AppSecret;
  var sign = md5(preSign);
  return sign;
};

var secret="1!2@3#4$5%6^",key="YB_WEB_API_V1";

export function post(url, data,) {
  var data = data;
  data.timespan= Math.round(new Date().getTime() / 1000); //增加时间戳
  var preSign = {};
  extendFn(preSign, data);
  preSign.secret = secret; //加密串
  var safeStr = unescape(encodeURIComponent(key + ':' + getZSTJsign(preSign)));
  var btoaCode = btoa(safeStr);
  btoaCode = 'BasicAuth ' + btoaCode;
  axios.defaults.headers.common['Authorization'] = btoaCode;
  axios.defaults.headers.post['Authorization'] = btoaCode;
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(res => {
      resolve(res.data)
    }).catch(err => {
       reject(err)
    })
  })
}

