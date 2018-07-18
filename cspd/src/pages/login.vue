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
  import {login,isAuthentication,ERR_OK} from "@/api/api.js";
  import {setStore} from "@/config/mUtils.js";
  import {baseUrl} from "@/config/env";

  export default {
      data:function () {
        return{

          //登录参数
          loginParams:{
            username:"",
            password:"",
            captcha:""//验证码
          },
          imgUrl:''
        }
      },
      created(){
        this.refreshImg();
      },
      methods:{
        //登录  先判断是否认证  医生 医生主任  健管师 已认证跳到首页
        doLogin:function () {
          let params=this.loginParams;
          login(params).then(res => {
            if(res.code===ERR_OK){
              setStore('userMesage',res.data);
              //this.$router.push("doctor_index")
              this.isAuthenticationFn(res.data.insDoctorId)
            }else{
              this.$alert(res.msg, '提示', {
                confirmButtonText: '确定',
              })
            }
          }).catch(err => {
            this.$alert(err.msg, '提示', {
              confirmButtonText: '确定',
            })
          });
        },

        //刷新验证码
        refreshImg:function () {
          var params = new Date();
          // this.loginParams.codeKey = params.getTime().toString();
          this.loginParams.timespan = params.getTime().toString();
          this.imgUrl = baseUrl+"doctor/captcha.jpg/?"+this.loginParams.timespan

        },

        //判断是否已认证
        isAuthenticationFn(insDoctorId){
          let params={
            insDoctorId:insDoctorId
          };
          isAuthentication(params).then(res => {
            if(res.code===ERR_OK){
              //authenticationStatus  2已认证  其他值未认证
              if(res.data.authenticationStatus===2){
                //已认证 首页
                this.$router.push("doctor_index");
              }else {
                //未认证 认证页
                this.$router.push("indetification");
              }
            }
          });
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
