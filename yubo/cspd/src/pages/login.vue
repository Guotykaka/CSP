<template>
  <div class="scroll-body" id="scroll-body">
    <div class="login-container" id="login-container">
      <!--登录panel-->
      <transition name="fade">
        <div class="login-dialog" v-if="isShowDialog">
          <div class="login-box">
            <a class="el-icon-circle-close close-btn" @click="closeFn"></a>
            <p class="login-title">医生端登录</p>
            <ul>
              <li class="m_b_20">
                <el-input type="text" v-model="loginParams.longName" placeholder="请输入账号"></el-input>
              </li>
              <li class="m_b_20">
                <el-input type="password" v-model="loginParams.password" placeholder="请输入密码"></el-input>
              </li>
              <li class="m_b_20">
                <el-input type="text" v-model="loginParams.captcha" placeholder="请输入验证码" style="width: 190px" @keyup.enter.native="doLogin"></el-input>
                <img :src="imgUrl" class="captcha-img" @click="refreshImg"/>
              </li>
              <button class="full-btn" @click="doLogin">登录</button>
            </ul>
          </div>
        </div>
      </transition>

      <!--image dialog-->
      <transition name="fade">
      <div class="login-dialog" v-show="isShowIMg">
        <a class="closeImgDialog el-icon-close" @click="closeImgDialog"></a>
        <img :src="lgIMg" class="lg-img"/>
      </div>
      </transition>

      <!--头部-->
      <div class="header-wrapper">
        <div class="margin_auto">
          <h1 class="logo">
            <img src="static/images/logo.jpg" class="logo-img">
            <p class="logo-text">
              <span class="blue-text">掌上</span>
              <span class="pink-text">体检</span>健康服务平台
            </p>
          </h1>
          <a class="login-btn" @click="showDialogFn">登录</a>
          <div class="header-nav">
            <a class="nav-item" v-for="(item,index) in headerNav" :key="index" :class="index===headIndex ? 'active' :''" @click="navClick(index)">{{item}}</a>
          </div>
        </div>
      </div>

      <!--banner-->
      <div class="banner-wrapper">
        <div class="block">
          <el-carousel height="700px">
            <el-carousel-item v-for="item in bannerImages" :key="item">
              <div class="banner-item" v-bind:style="{backgroundImage:'url(' + item + ')'}"></div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>

      <!--产品服务-->
      <div class="width_min_1200 part01" id="part1">
        <div class="margin_auto center01">
          <div class="title-container">

            <transition name="movedown">
              <div class="title-move" v-show="isMove1">
                <h3 class="main-title">产品与服务</h3>
                <p class="sub-title">product and service</p>
              </div>
            </transition>


          </div>
          <div class="items-container">
            <transition name="moveup">
              <ul class="items-box" v-show="isMove1">
                <!--单个-->
                <li class="serviceItem transition-5s" v-for="(item,index) in serviceArr" :key="index">
                  <div class="item-title">
                    <span class="icon transition-5s" :class="item.iconName"></span>
                    <p class="item-title-text transition-5s">{{item.title}}</p>
                  </div>
                  <div class="img-part">
                    <a class="item-img" @click="showImg(item.image1)">
                      <img :src="item.image1">
                    </a>
                    <a class="item-img" @click="showImg(item.image2)">
                      <img :src="item.image2">
                    </a>
                  </div>
                </li>
              </ul>
            </transition>
          </div>
        </div>
      </div>

      <!--关于我们-->
      <div class="width_min_1200 part02" id="part2">
        <div class="margin_auto center02">
          <div class="title-container">
            <transition name="movedown">
              <div class="title-move" v-show="isMove2">
                <h3 class="main-title">关于我们</h3>
                <p class="sub-title">about us</p>
              </div>
            </transition>
          </div>
          <div class="content-wrapper">
            <transition name="moveup">
              <div class="move-content" v-show="isMove2">
                <a class="about-us-link">
                  <img src="../../static/images/aboutUsImg.jpg">
                </a>
                <div class="info-text-box">
                  <p>掌上体检健康云平台隶属上海羽博医学科技有限公司（上海天亿投资集团有限公司旗下控股公司）公司定位于专业健康管理服务云平台运营商和健康城市服务商，致力于打造中国最大、最专业的健康管理服务云平台。
                    公司拥有检前预约、检中管理、检后健康医疗服务一系列完整的产品解决方案，以及健康管理云平台运营体系，并向健康城市服务商积极拓展。&nbsp;
                  </p>
                  <p>集团公司积极把握市场机遇，不断推陈出新，通过自主研发、不断创新，推出面向健康城市、企业单位和团体、家庭的健康管理服务解决方案，实现“院内诊疗，
                    院外康复”一体化纵深医疗服务。未来公司还将基于健康管理服务领域，依托健康大数据研发更多的新产品，为广大医疗服务机构提供更智能、更精准、更全面的健康管理服务平台，实现健康管理惠及人人的愿景。</p>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <!--关注与下载-->
      <div class="width_min_1200 part03" id="part3">
        <div class="margin_auto center03">
          <div class="hand-phone">
            <transition name="moveright">
              <img src="../../static/images/phone-hand.png" class="hand-phone-img" v-show="isMove3">
            </transition>
          </div>
          <div class="load-container">
            <transition name="moveleft">
              <div class="move-content" v-show="isMove3">
                <h3 class="main-title">关注与下载</h3>
                <p class="sub-title">app download</p>
                <p class="introduce-title">掌上体检健康管理服务平台</p>
                <ul class="code-img-content">
                  <li class="code-img-item">
                    <img src="../../static/images/wechatCodeImg.jpg">
                    <p>掌上体检公众号</p>
                  </li>
                  <li class="code-img-item">
                    <img src="../../static/images/appCodeIMg.jpg">
                    <p>掌上体检APP</p>
                  </li>
                </ul>
                <p class="notice-text">扫描二维码，开启您的健康之旅</p>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <!--底部-->
      <div class="footWrapper width_min_1200 part04">
        <div class="foot-center margin_auto center04">
          <div class="about-company">
            <img src="../../static/images/foot-logo.jpg" class="foot-logo">
            <p class="company-name">上海羽博医学科技有限公司</p>
            <p class="company-name">公司总部（上海）</p>
            <ul class="company-lists">
              <li class="list-info">
                <span class="icon iconfont icon-dh1"></span>021-54670679
              </li>
              <li class="list-info">
                <span class="icon iconfont icon-dz"></span>上海市灵石路697号健康智谷7号楼301室
              </li>
              <li class="list-info">
                <span class="icon iconfont icon-dx"></span>200072
              </li>
            </ul>
          </div>
          <div class="cooperation">
            <p class="cooperation-title">市场合作</p>
            <div class="coop-service-content">
              <dl class="department-item">
                <dt>市场部</dt>
                <dd><span class="icon iconfont icon-dx"></span>maoxiongguang@ybyxkj.com</dd>
                <dd><span class="icon iconfont icon-dh1"></span>15601799029</dd>
              </dl>
              <dl class="department-item">
                <dt>客服部</dt>
                <dd><span class="icon iconfont icon-dx"></span>liyang@ybyxkj.com</dd>
                <dd><span class="icon iconfont  icon-dh1"></span>400-820-2830</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!--工商注册-->
      <p class="width_min_1200 footer-indentify">Copyright©️2016上海羽博医学科技有限公司 版权所有  粤ICP备15049813号-1</p>
    </div>
  </div>
</template>

<script>
  import {login,getInsdoctorInfo,ERR_OK} from "@/api/api.js";
  import {setStore,EncodeDoctorId,setDecodeStore} from "@/config/mUtils.js";
  import {baseUrlY} from "@/config/env";

  export default {
    data:function () {
      return{
        lgIMg:"",
        isShowIMg:false,
        isShowDialog:false,
        isMove1:false,
        isMove2:false,
        isMove3:false,
        isMove4:false,
        headerNav:["首页","产品与服务","关于我们","关注与下载"],
        headIndex:0,
        bannerImages:['static/images/banner1.jpg','static/images/banner2.jpg'],
        serviceArr:[
          {
            title:"个人及家庭健康管理",
            iconName:"icon1",
            image1:"static/images/1.jpg",
            image2:"static/images/2.jpg",
          },{
            title:"企业/团体健康管理",
            iconName:"icon2",
            image1:"static/images/3.jpg",
            image2:"static/images/4.jpg",
          },{
            title:"医生服务与管理",
            iconName:"icon3",
            image1:"static/images/5.jpg",
            image2:"static/images/6.jpg",
          },{
            title:"健管中心管理与服务",
            iconName:"icon4",
            image1:"static/images/7.jpg",
            image2:"static/images/8.jpg",
          },
        ],

        //登录参数
        loginParams:{
          longName:"",//用户名
          password:"",//密码
          codeKey: "",//校验码
          category:0,//菜单类别 0医生端  1运营端
          captcha:""//验证码
        },
        imgUrl:''
      }
    },

    methods:{
      //点击图片
      showImg(url){
        this.isShowIMg=true;
        this.lgIMg=url
      },
      closeImgDialog(){
        this.isShowIMg=false;
      },

      //登录 分为用户和医生  insDoctorId存在的话为医生 不存在为用户
      doLogin:function () {
        let params=this.loginParams;
        login(params).then(res => {
          this.refreshImg();
          if(res.code===ERR_OK){
            let timeSpan=Math.round(new Date().getTime()/1000);
            setStore('timeSpan',timeSpan);
            setStore('userMesage',res.data);


            //insDoctorId存在的话为医生 需要判断是否认证  不存在为用户
            if(res.data.insDoctorId){
              //判断是否认证

              //设置默认可跳转路由
              let defaultNav=["/login","/doctor_index","/indenBaseInfo","/doApply","/memberControl/","/annoDetail"];
              let menuData =JSON.stringify(defaultNav);
              setStore('navMenu', menuData);

              let EncodeId=EncodeDoctorId(res.data.insDoctorId);
              this.isAuthenticationFn(EncodeId);
            }else{
              //普通用户

              //设置默认可跳转路由
              let defaultNav=["/login","/user_index","/memberControl/","/annoDetail"];
              let menuData =JSON.stringify(defaultNav);
              setStore('navMenu', menuData);

              this.$router.push("user_index");
            }
          }else{
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        }).catch(err => {
          this.refreshImg();
          this.$message.error('网络错误请稍后');
        });
      },

      //刷新验证码
      refreshImg:function () {
        let params = new Date();
        this.loginParams.codeKey = params.getTime().toString();
        this.loginParams.timespan = params.getTime().toString();
        // this.imgUrl = baseUrl+"doctor/captcha.jpg/?"+this.loginParams.timespan
        this.imgUrl = baseUrlY+"system/user/captcha.jpg/"+this.loginParams.timespan
      },

      //判断是否已认证
      isAuthenticationFn(insDoctorId){
        let params={
          insDoctorId:insDoctorId
        };
        getInsdoctorInfo(params).then(res => {
          if(res.code===ERR_OK){
            setDecodeStore("authenticationStatus",res.data.authenticationStatus);

            //authenticationStatus  2已认证  其他值未认证
            if(res.data.authenticationStatus === 2){
              //已认证 首页
              this.$router.push("doctor_index");
            }else {
              //未认证 认证页
              this.$router.push("indenBaseInfo");
            }
          }else{
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            });
          }
        }).catch(err => {
          this.refreshImg();
          this.$message.error('网络错误请稍后,认证接口');
        });
      },

      listenScroll(){
        let scrollBody= document.getElementById("scroll-body");
        let selfThis=this;
        scrollBody.addEventListener("scroll", function(){
          if(selfThis.isMove1 && selfThis.isMove2 &&  selfThis.isMove3){
            return;
          }
          //变量t是滚动条滚动时，距离顶部的距离
          let t = scrollBody.scrollTop;
          if(t>=250 && t<710){
            if(!selfThis.isMove1){
              selfThis.isMove1=true;
            }
          }else if(t>=710 && t<1330){
            if(!selfThis.isMove2){
              selfThis.isMove2=true;
            }
          }else if(t>=1330 && t<2060){
            if(!selfThis.isMove3){
              selfThis.isMove3=true;
            }
          }
        });
      },

      showDialogFn(){
        this.isShowDialog=true;
      },
      closeFn(){
        this.isShowDialog=false;
      },

      navClick(tabIndex){
        this.headIndex=tabIndex;
        if(tabIndex===0){
          document.getElementById("scroll-body").scrollTop=0;
        }else if(tabIndex===1){
          document.getElementById("scroll-body").scrollTop=700;
        }else if(tabIndex===2){
          document.getElementById("scroll-body").scrollTop= 1325;
        }else if(tabIndex===3){
          document.getElementById("scroll-body").scrollTop= 2050;
        }
      }
    },
    created(){
      this.refreshImg();
      localStorage.clear();
    },
    mounted(){
      this.listenScroll()
    }
  }
</script>

<style lang="less" scoped>
  .movedown-enter-active, .movedown-leave-active {transition: all .5s;}
  .movedown-enter, .movedown-leave-to{transform: translate3d(0 ,-100%,0);}
  .moveup-enter-active, .moveup-leave-active {transition: all .5s;}
  .moveup-enter, .moveup-leave-to{transform: translate3d(0 ,100%,0);}
  .moveright-enter-active, .moveright-leave-active {transition: all .5s;}
  .moveright-enter, .moveright-leave-to {transform: translate3d(-100% ,0,0);}
  .moveleft-enter-active, .moveleft-leave-active {transition: all .5s;}
  .moveleft-enter, .moveleft-leave-to {transform: translate3d(100%,0,0);}
  .fade-enter-active, .fade-leave-active {transition: all .3s;}
  .fade-enter, .fade-leave-to {opacity: 0}

  .scroll-body{height: 100%;overflow-y: auto}
  a{cursor: pointer}
  .login-title{line-height: 40px;text-align: center;font-weight: normal;font-size: 20px;color:#444;margin-bottom: 15px;}
  .login-box{width: 340px;height: 280px;position: absolute;left: 50%;top:50%;padding:40px 25px;background-color:#fff;transform: translate3d(-50%,-50%,0);}
  .t_c{text-align: center}
  .captcha-img{float:right;height: 40px;width: 130px;cursor: pointer;}
  .m_b_20{margin-bottom: 20px;}
  .full-btn{display: block;width: 100%;height: 40px;background-color: #4fb136;line-height: 40px;
    border-radius:4px;text-align: center;color: #fff;cursor: pointer;font-size: 16px;}
  .full-btn:hover{background-color: #4fb166;}
  .close-btn{position: absolute;top:18px;right: 18px;font-size: 30px;color:#4fb136}

  .width_min_1200 {min-width: 1200px;}
  .margin_auto {width: 1200px;margin: 0 auto;}
  .header-wrapper{min-width: 1200px;box-shadow: 0 3px 5px #ccc;height: 100px;background-color: #fff;position: fixed;z-index: 10;left: 0;top: 0;width: 100%;}
  .logo {float: left;height: 70px;padding-top: 15px;}
  .logo .logo-img {width: 70px;float: left;}
  .logo-text {float: left;line-height: 36px;font-size: 20px;color: #999;font-weight: normal;padding-top: 17px;}
  .blue-text {color: #64adf9;}
  .pink-text {color: #fd6e70;}
  .login-btn {float: right;width: 90px;height: 36px;border-radius: 4px;background-color: #4fb136;line-height: 36px;
    text-align: center;color: #fff;margin-right: 30px;margin-top: 32px;}
  .header-nav {float: right;padding-top: 32px;}
  .header-nav .nav-item {display: inline-block;margin: 0 25px;padding: 0 10px;box-sizing: border-box;line-height: 36px;height: 36px;font-size: 18px;color: #999;}
  .header-nav .nav-item.active {border-bottom: 2px solid #4fb136;color: #4fb136;}

  .banner-wrapper{margin-top: 100px;}
  .banner-item{height:100%;background-repeat: no-repeat;background-position: center top;}

  .part01{height:545px;padding-top: 80px;background: url("../../static/images/product-service.jpg") no-repeat center top;overflow: hidden}
  .center01 .title-container{overflow: hidden;height: 110px;margin-bottom: 70px;}
  .center01 .title-move {text-align: center;}
  .center01 .title-move.move-5s{margin-top: -100%}
  .center01 .main-title {line-height: 66px;font-size: 44px;color: #333;font-weight: normal;}
  .center01 .sub-title {line-height: 44px;font-size: 24px;color: #999;}
  .center01 .items-container{height: 270px;overflow: hidden;padding-top: 20px;}
  .center01 .items-box {width: 1240px;height: 270px;}
  .center01 .serviceItem{float: left;width: 270px;height: 240px;box-sizing: border-box;border: 1px solid #e8e8e8;
    background-color: #fff;padding: 25px 20px 15px;margin:  0 30px 0 0;transition: all 0.5s}
  .center01 .serviceItem:hover{transform: translateY(-10px);border: 1px solid #4fb136;box-shadow: 0 5px 20px #ccc}
  .center01 .serviceItem .item-title {font-size: 0;padding-bottom: 25px;border-bottom: 1px solid #e8e8e8;margin-bottom: 18px;}
  .center01 .icon {display: inline-block;width: 48px;height: 48px;vertical-align: top;}
  .center01 .icon1{background: url("../../static/images/icons.png") no-repeat left top;}
  .center01 .icon2 {background: url("../../static/images/icons.png") no-repeat -48px top;}
  .center01 .icon3{background: url("../../static/images/icons.png") no-repeat -96px top;}
  .center01 .icon4{background: url("../../static/images/icons.png") no-repeat -144px top;}
  .center01 .img-part{text-align: center;font-size: 0;}
  .center01 .item-img{display: inline-block;margin: 0 10px;border: 1px solid #e8e8e8;box-shadow: 0 0 5px #999;width: 75px;height: 99px;}
  .center01 .item-img img {display: block;width: 100%;height: 100%;}
  .center01 .item-title-text{display: inline-block;line-height: 48px;font-size: 18px;color: #999;padding-left: 10px}

  .part02{background: url("../../static/images/about-us.jpg") no-repeat center top;height: 670px;padding-top: 50px;}
  .center02{height: 670px;}
  .center02 .title-container{height: 110px;overflow: hidden;margin-bottom: 40px;}
  .center02 .title-move {text-align: center;}
  .center02 .main-title{line-height: 66px;font-size: 44px;color: #fff;font-weight: normal}
  .center02 .sub-title {line-height: 44px;font-size: 24px;color: #fff;}
  .center02 .content-wrapper {height: 476px;overflow: hidden;}
  .center02 .move-content {height: 476px;background-color: #fff;width: 1200px;box-sizing: border-box;padding: 40px;}
  .center02 .about-us-link{float: left;width: 462px;height: 398px;box-sizing: border-box;padding: 8px;
    -webkit-box-shadow: 0 0 10px #ccc;-moz-box-shadow: 0 0 10px #ccc;box-shadow: 0 0 10px #ccc;}
  .center02 .info-text-box{width: 620px;float: right;}
  .center02 .info-text-box p{line-height: 32px;font-size: 16px;color: #666;text-indent: 2em;}

  .part03{height: 730px;background: url("../../static/images/attention-bg.jpg") no-repeat center top;overflow: hidden;}
  .center03{height: 730px;overflow: hidden;position: relative;}
  .center03 .hand-phone{width: 474px;height: 619px;position: absolute;left: 60px;bottom: 0;overflow: hidden;}
  .center03 .load-container {width: 490px;position: absolute;right: 40px;top: 100px;overflow: hidden;}
  .center03 .main-title {height: 90px;line-height: 90px;position: relative;font-size: 46px;font-weight: normal}
  .center03 .sub-title{line-height: 38px;padding: 10px 0;color:#999;font-size: 24px;margin-bottom: 22px;}
  .center03 .introduce-title{line-height: 46px;font-size: 30px;color:#333;margin-bottom: 56px;}
  .center03 .code-img-content{overflow: hidden;margin-bottom: 20px;}
  .center03 .code-img-item{width: 130px;float: left;margin: 0 35px 0 0;}
  .center03 .code-img-item p{line-height: 34px;font-size: 18px;color:#666;}
  .center03 .notice-text{line-height: 24px;font-size:16px;color:#999;text-align:left;}

  .part04{background-color: #1e2124;height: 374px;}
  .center04{padding-top: 50px;}
  .center04 .about-company{float: left;width: 50%;}
  .center04 .company-name{line-height: 36px;font-size: 24px;color: #fff;margin-bottom: 22px;}
  .center04 .list-info{line-height: 24px;font-size: 14px;color:#999;margin-bottom: 10px;}
  .center04 .list-info .icon{margin-right: 10px;vertical-align: top;font-size: 18px;display: inline-block;}
  .center04 .cooperation{float: left;width: 50%;}
  .center04 .cooperation-title{text-align: center;line-height: 36px;font-size: 30px;color: #ccc;margin-bottom: 98px;padding-right: 160px;}
  .center04 .coop-service-content{overflow: hidden;}
  .center04 .department-item{width: 50%;float: left}
  .center04 .department-item dt{line-height: 36px;font-size: 24px;color: #fff;margin-bottom: 22px}
  .center04 .department-item dd{line-height: 24px;font-size: 14px;color: #999;margin-bottom: 10px;}
  .center04 .department-item dd .icon{margin-right: 10px;vertical-align: top;font-size: 18px;display: inline-block;}

  .center04 .foot-logo{margin:0 0 10px 100px}
  .footer-indentify{font-size: 14px;text-align: center;color:#999;line-height: 24px;background-color: #0b0b0b;padding: 16px 0}
  .login-dialog{position: fixed;width: 100%;height: 100%;background: rgba(0,0,0,0.5);z-index: 1000;left: 0;top:0}
  .lg-img{width:35%;position: absolute;left: 50%;top:50%;transform: translate(-50%,-50%)}
  .closeImgDialog{position: absolute;top:30px;right: 30px;font-size: 30px;color: #fff;}
</style>
