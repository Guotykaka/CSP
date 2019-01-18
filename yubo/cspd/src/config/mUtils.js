/**
 * 存储localStorage
 */

const base64Class=require('js-base64').Base64;

export const setStore = (name, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
}

/**
 * 存储加密存
 */
export const setDecodeStore = (name, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
    content += "1!2@3#4$5%6^";
    content=base64Class.encode(content);
  }
  window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
export const getStore = name => {
  if (!name) return;
  return window.localStorage.getItem(name);
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
  if (!name) return;
  window.localStorage.removeItem(name);
}
/*base64解密*/
export const Base64 = require('js-base64').Base64;


/*乐 11.12*/
export function EncodeDoctorId(id) {
  let EncodeId = '';
  if(id){
    EncodeId=base64Class.decode(id);
    EncodeId=EncodeId.replace("1!2@3#4$5%6^","");
  }
  return EncodeId;
}
