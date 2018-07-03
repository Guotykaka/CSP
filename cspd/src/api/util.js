//管理localStorage
export const storeManager={
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
    setServiceProviderType:function (typeNum) {
        localStorage.setItem('serviceProviderType', typeNum);
    },

    getServiceProvidertype:function () {
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
    setRoleType:function (typeNum) {
        localStorage.setItem('roleType', typeNum);
    },

    //存角色 1是医生 2是主任
    getRoleType:function () {
        return localStorage.getItem('roleType');
    },

    //存userId
    setUserId:function (uid) {
        localStorage.setItem('userId', uid);
    },

    //存获取userId
    getUserId:function () {
       return localStorage.getItem('userId');
    },

    //存头像
    setAvatar:function (url) {
        localStorage.setItem('avatar', url);
    },

    //获取头像
    getAvatar:function () {
       return localStorage.getItem('avatar') || '/cspd/statics/img/logo.jpg';
    },
    removeStorage: function () {
        localStorage.clear();
    },
    //字符串解密
   uncompile:function(code){
      if(!code){
        return;
      }
     return unescape(code.replace(/\\u/gi, '%u'));
    }
}

