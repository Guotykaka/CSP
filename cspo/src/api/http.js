import axios from 'axios';
axios.defaults.baseURL="/Api";

export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url,params).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}
//get请求传一个参数
export function getOne(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url+"/"+params).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}
export function post(url, data,) {
  return new Promise((resolve, reject) => {
    axios.post(url, data
    ).then(res => {
      resolve(res.data)
    }).catch(err => {
      // reject(err)
      alert(1)
    })
  })
}
