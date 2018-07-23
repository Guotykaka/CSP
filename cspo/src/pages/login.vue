<template>

  <div class="login-container">
    <div class="login-box">
      <p class="login-title">运营端登录</p>
      <ul>
        <li class="m_b_20">
          <el-input type="text" v-model="loginParams.username" placeholder="请输入账号"></el-input>
        </li>
        <li class="m_b_20">
          <el-input type="password" v-model="loginParams.password" placeholder="请输入密码"></el-input>
        </li>
        <li class="m_b_20">
          <el-input type="text" v-model="loginParams.captcha" placeholder="请输入验证码" style="width: 190px"   @keyup.enter.native="doLogin()"></el-input>
          <img :src="imgUrl" class="captcha-img" @click="refreshImg"/>
        </li>
        <button class="full-btn" @click="doLogin">登录</button>
      </ul>
    </div>
  </div>
</template>

<script>
  //引入login的方法
  import {login,ERR_OK} from "@/api/api.js";
  import {baseUrl} from "@/config/env";
  import {setStore} from "@/config/mUtils.js";
  export default {
      data:function () {
        return{
          //登录参数
          loginParams:{
            captcha: "",
            codeKey: "",
            password: "",
            username: ""
          },
          timeString:'',
          imgUrl:''
        }
      },
    created(){
        this.refreshImg();
      localStorage.clear();
    },
      methods:{
        doLogin:function () {
          var params=this.loginParams;
          login(params).then(res => {
            if(res.code===ERR_OK){
                setStore('userMesage',res.data);
              this.$router.push("main")
            }else{
              this.refreshImg();
              this.$alert(res.msg)
            }
          }).catch(err => {

          })
        },

        //刷新验证码
        refreshImg:function () {
          var params = new Date();
          this.loginParams.codeKey = params.getTime().toString();
          this.loginParams.timespan = params.getTime().toString();
          this.imgUrl = baseUrl+"sys/user/captcha.jpg/"+this.loginParams.codeKey
        }
      }
    }
</script>

<style lang="less" scoped>
  @import "../asset/style/common";

  .login-title{
    line-height: 40px;
    text-align: center;
    font-weight: normal;
    font-size: 20px;
    color:#444;
    margin-bottom: 15px;
  }

  .login-container{
    width: 100%;
    height: 100%;
    position: relative;
    background:url("../asset/img/server-login-bg.jpg") no-repeat;
    background-size: cover;
    box-sizing:content-box;
  }

  .login-box{
    width: 340px;
    height: 280px;
    position: absolute;
    left: 50%;
    top:50%;
    padding:40px 25px;
    background-color:#fff;
    transform: translate3d(-50%,-50%,0);
    box-shadow: 0 5px 15px #999;
  }
  .t_c{
    text-align: center
  }
  .captcha-img{
    float:right;
    height: 40px;
    width: 130px;
    cursor: pointer;
  }

</style>
