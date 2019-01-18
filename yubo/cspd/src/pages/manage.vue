<template>
  <div class="manage_page">
    <el-container style="height:100%;">
      <el-aside style="background-color:#324057;" width="180px">
        <el-row class="tac">
          <el-col :span="4" style="min-height: 100%; width:182px;">
            <el-menu
              :default-active="defaultActive"
              class="el-menu-vertical-demo"
              background-color="#324057"
              text-color="#fff"
              active-text-color="#fff"
              unique-opened
              :router="true"
            >
              <el-menu-item v-if="userInfo.insDoctorId"  index="/doctor_index" class="homeTitle">
                <i class="el-icon-menu main-icon"></i>
                云服务平台医生端
              </el-menu-item>
              <el-menu-item v-else index="/user_index" class="homeTitle">
                <i class="el-icon-menu main-icon"></i>
                云服务平台医生端
              </el-menu-item>
              <div v-for="(item,index) in navMenu" :key="index" >
                <el-menu-item  :index="item.url" v-if="item.childMenus.length ===0">
                  <i class="el-icon-menu main-icon"></i>
                  {{item.menuName}}
                </el-menu-item>

                <el-submenu :index="item.menuName" v-if="item.childMenus.length >0">
                  <template slot="title"><i :class="item.icon"></i>{{item.menuName}}</template>
                  <el-menu-item class="item-left-style" v-for="(itemChild,indexChild) in item.childMenus" :key="indexChild" v-if="itemChild.childMenus.length===0" :index="itemChild.url">
                    <i :class="itemChild.icon"></i>
                    {{itemChild.menuName}}
                  </el-menu-item>
                  <el-submenu v-for="itemChild in item.childMenus" :key="itemChild.menuId" :index="itemChild.menuName" v-if="itemChild.childMenus.length>0">
                    <template slot="title">{{itemChild.menuName}}</template>
                    <el-menu-item :index="childChild.url" v-for="childChild in itemChild.childMenus" :key="childChild.menuId">
                      {{childChild.menuName}}
                    </el-menu-item>
                  </el-submenu>
                </el-submenu>
              </div>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <el-container>
        <el-header class="nav-title">
          <!--<el-breadcrumb-item v-for="(item, index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>-->
          <el-breadcrumb separator-class="el-icon-arrow-right"
                         style="float:left;height:100%;line-height:60px;color:#fff;">
            <el-breadcrumb-item class="breadcrumbStyle" v-for="(item, index) in $route.meta" :key="index"
                                style="color: #ffffff;">{{item}}
            </el-breadcrumb-item>
          </el-breadcrumb>
          <el-menu
            :default-active="defaultActive"
            class="el-menu-demo"
            mode="horizontal"
            background-color="#3c8dbc"
            text-color="#fff"
            style="float:right"
            active-text-color="#ffd04b"
            router>
            <el-menu-item v-if="userInfo.insDoctorId" index="/announcement"><i class="iconfont icon-zanwuxitonggonggao icon-style"></i>系统公告</el-menu-item>
            <el-menu-item v-if="userInfo.insDoctorId" index="/call_doctor"><i class="iconfont icon-nanxingmale100 icon-style"></i>联系医助</el-menu-item>
            <el-menu-item v-if="userInfo.insDoctorId" index="/msg"><i class="iconfont icon-lingsheng icon-style"></i>消息
              <el-badge v-if="allcount>0" class="mark iconStyle" :value="allcount"/>
            </el-menu-item>

            <el-menu-item index="">
              <template>
                <!--下拉-->
                <el-dropdown @command="handleCommand" style="color:#fff;">
                <span class="el-dropdown-link">
                   <img
                     class="user-info-img"
                     :src="areaImg||defaultImg"
                     alt="">{{userInfo.userName}}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="baseInfo">基础信息</el-dropdown-item>
                    <el-dropdown-item command="changePass">修改密码</el-dropdown-item>
                    <el-dropdown-item command="logout">退出系统</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-menu-item>
          </el-menu>
        </el-header>
        <el-main class="elMain-box">
          <keep-alive>
            <router-view>

            </router-view>
          </keep-alive>
        </el-main>
      </el-container>
    </el-container>
    <!--修改密码dialog-->
    <el-dialog title="修改密码" :visible.sync="isShowDialog" width="400px">
      <el-form label-width="80px">
        <el-form-item label="原密码">
          <el-input v-model="oldPassword" placeholder="原密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="newPassword" placeholder="新密码"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="okFn">修改</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {storeManager} from '@/api/util.js';
  import {getStore,setStore,EncodeDoctorId} from '@/config/mUtils.js';
  import {
    GetNav,
    ERR_OK,
    getApplyInfo,
    countUserNewsList,
    resetPassword
  } from '@/api/api.js';
  import {mapState} from 'vuex'

  export default {
    data() {
      return {
        navMenu: [],
        userInfo: {},//用户信息
        allCount: null,
        defaultImg: require('../asset/img/logo.jpg'),//用户默认图片
        isShowDialog: false,
        oldPassword: "",
        newPassword: "",
      }
    },
    created() {
      this.userInfo = JSON.parse(getStore('userMesage'));
      this.getNav();
      this.getUserImg();
    },
    methods: {
      //处理command
      handleCommand(command) {
        if (command === 'baseInfo') {
          //个人中心
          this.$router.push('/indenBaseInfo')
        } else if (command === 'changePass') {
          //修改密码
          this.isShowDialog = true;
        } else if (command === 'logout') {
          //退出
          this.$router.push("/", function () {
            localStorage.clear();
          })
        }
      },
      //修改密码
      delPassWorld() {
        this.isShowDialog = true;
      },
      //点击修改
      okFn() {
        let params = {
          newPassword: this.newPassword,
          password: this.oldPassword,
          userId: this.userInfo.userId
        };
        resetPassword(params).then((res) => {
          if (res.code === ERR_OK) {
            this.isShowDialog = false;
            this.$alert('密码修改成功', '提示');
            this.$router.push('/')
          } else {
            this.$alert(res.msg)
          }
        })
      },
      //点击取消
      cancel() {
        this.isShowDialog = false;
      },
      //获取左侧菜单
      getNav() {
        //未认证不请求菜单
        let authenticationStatus=getStore("authenticationStatus") || "";
        authenticationStatus=EncodeDoctorId(authenticationStatus);

        if(authenticationStatus && authenticationStatus !== "2"){
          return;
        }
        let params = {
          category:0,
          userId: EncodeDoctorId(this.userInfo.userId)
        };
        GetNav(params).then((res) => {
          if (res.code === ERR_OK) {
            this.navMenu = res.data;
            this.handleNav(res.data)
          }
        });
      },
      /*菜单路由处理*/
      handleNav(val) {
        let arrParent = [], arrChild = [];
        val.forEach((v, i) => {
          if (v.url) {
            arrParent.push(v.url)
          } else {
            if (v.childMenus) {
              v.childMenus.forEach((childUrl) => {
                if (childUrl.url) {
                  arrChild.push(childUrl.url)
                }else if(childUrl.childMenus.length>0){
                  childUrl.childMenus.forEach((childUrl2)=>{
                    if(childUrl2.url){
                      arrChild.push(childUrl2.url)
                    }
                  })
                }
              })
            }
          }
        });


        let defaultNav=[];
        if(JSON.parse(getStore("userMesage")).insDoctorId){
          //医生
          defaultNav=["/login","/doctor_index","/indenBaseInfo","/doApply"];
          let authenticationStatus=EncodeDoctorId(getStore("authenticationStatus"));
          if(authenticationStatus === '2'){
            defaultNav=["/login","/doctor_index","/indenBaseInfo","/doApply","/call_doctor","/announcement","/memberControl/","/reportPage/","/transfer_order","/export_order","/annoDetail"];
          }
        }else {
          //非医生
          defaultNav=["/login","/user_index","/memberControl/","/annoDetail"];
        }
        let menuData =JSON.stringify(arrParent.concat(arrChild,defaultNav));
        setStore('navMenu', menuData)
      },
      //获取登录图片
      getUserImg() {
        let params = {
            insDoctorId: EncodeDoctorId(this.userInfo.insDoctorId)
          };
        this.$store.dispatch('getAreaImg', params);
      }

    },
    computed: {
      defaultActive: function () {
        return this.$route.path.replace('/', '/');
      },
      allcount() {
        let count = 0;
        this.msgList.forEach((item) => {
          count += parseInt(item.unReadCount)
        });
        return count;
      },
      ...mapState({
        msgList: state => state.msgList,//消息列表数据
        areaImg: state => state.areaImg//用户头像
      })
    },
  }

</script>
<style lang="less">
.el-menu-vertical-demo{
  width:181px;
}
  /*容器样式start*/
  .el-header, .el-footer {
    background-color: #3c8dbc;
    color: #333;
    text-align: right;
    line-height: 60px;
  }

  .el-aside {
    background-color: #324057;
    color: #333;
    text-align: left;
    line-height: 200px;
  }

  .el-main {
    background-color: #FFf;
    color: #333;
    height: 100%;
    position:relative;
  }

  .user-info-img {
    margin-right: 10px;
    width: 20px;
    height: 20px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  /*容器样式end*/
  /*面包屑start*/
  .header_container {
    background-color: #EFF2F7;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
  }

  .breadcrumbStyle > span {
    color: #fff !important;
  }

  .manage_page {
    .el-submenu__title {
      border-bottom: none !important;
    }
  }
  /*面包屑end*/
</style>
<style scoped lang="less">
  .tac /deep/ .el-menu-item{
    min-width:180px!important;
    padding-right:0;
  }
  .tac /deep/ .item-left-style{
    padding-left:60px!important;
  }
  .tac /deep/ .el-menu-item.is-active{
    background-color:#2e93c8!important;
  }
  .main-icon {
    color: #fff
  }

  /*我的样式*/
  .nav-t-icon {
    color: #fff;
  }

  .manage_page {
    height: 100%;
    .homeTitle {
      background-color: #2D93CA !important;
      color: #fff !important;
      height: 59px;
      font-size: 18px;
      padding-left:0!important;
    }
    .nav-title li {
      border-bottom: none !important;
    }

    .iconfont {
      font-size: 18px;
      margin-right: 8px;
      margin-left: 3px;
    }
    /*小圆标*/
    .iconStyle {
      position: absolute;
      top: -13px;
      right: 0px;
      z-index: 100;
    }

    .icon-style{
      color:#fff;
    }
  }
  .iconStyle /deep/ .el-badge__content{
    border:none;
    background:#fa3632;
  }
</style>
