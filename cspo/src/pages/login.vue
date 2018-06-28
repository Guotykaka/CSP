<template>

  <div class="login-container">
    <div class="login-box">
      <p class="login-title">登录</p>
      <ul>
        <li class="m_b_20">
          <el-input type="text" v-model="loginParams.username" placeholder="请输入账号"></el-input>
        </li>
        <li class="m_b_20">
          <el-input type="password" v-model="loginParams.password" placeholder="请输入密码"></el-input>
        </li>
        <li class="m_b_20">
          <el-input type="text" v-model="loginParams.captcha" placeholder="请输入验证码" style="width: 190px"></el-input>
          <img :src="imgUrl" class="captcha-img" @click="refreshImg"/>
        </li>
        <button class="full-btn" @click="doLogin">登录</button>
      </ul>
    </div>
  </div>


</template>

<script>
  //引入login的方法
  import {login} from "@/api/getData.js";

  export default {
      data:function () {
        return{

          //登录参数
          loginParams:{
            username:"",
            password:"",
            captcha:""//验证码
          },
          imgUrl:"http://172.0.0.42:8115/cspd/captcha.jpg?"+Math.random()
        }
      },


      methods:{
        doLogin:function () {
          login(this.loginParams).then((res) => {
            console.log(res);
            this.$router.push("manage")


            return Promise.resolve(res.data)
          }).catch(function (error) {
            console.log(error)
          })
        },

        //刷新验证码
        refreshImg:function () {
          this.imgUrl="http://172.0.0.42:8115/cspd/captcha.jpg?"+Math.random()
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
    background-color: #E4E7ED;
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
