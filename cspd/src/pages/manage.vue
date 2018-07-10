<template>
  <div class="manage_page">
    <el-container style="height:100%;">
      <el-aside style="background-color:#324057;" width="250px">
        <el-row class="tac">
          <el-col :span="4" style="min-height: 100%; width:251px;">
            <el-menu
              :default-active="defaultActive"
              class="el-menu-vertical-demo"
              background-color="#324057"
              text-color="#bfbfac"
              active-text-color="#3c8dbc"
              router>
              <el-menu-item index="doctor_index" class="homeTitle"><i class="el-icon-menu"></i>云服务平台医生端</el-menu-item>
              <el-submenu :index="item.name" v-for="(item,index) in navMenu" :key="index">
                <template slot="title"><i :class="item.icon"></i>{{item.name}}</template>
                <el-menu-item :index="itemChild.url" v-for="(itemChild,indexChild) in item.list" :key="indexChild"><i
                  :class="itemChild.icon"></i>{{itemChild.name}}
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <el-container>
        <el-header class="nav-title">
          <!--<el-breadcrumb-item v-for="(item, index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>-->
          <el-breadcrumb separator-class="el-icon-arrow-right" style="float:left;height:100%;line-height:60px;color:#fff;">
            <el-breadcrumb-item class="breadcrumbStyle" v-for="(item, index) in $route.meta" :key="index" style="color: #ffffff;">{{item}}</el-breadcrumb-item>
          </el-breadcrumb>
          <el-menu
            :default-active="defaultActive"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            background-color="#3c8dbc"
            text-color="#fff"
            style="float:right"
            active-text-color="#ffd04b"
            router>
            <el-menu-item index="announcement">系统公告</el-menu-item>
            <el-menu-item index="call_doctor">联系医助</el-menu-item>
            <el-menu-item index="msg">
                  消息
                <el-badge class="mark iconStyle" :value="allcount" />
            </el-menu-item>
            <el-submenu index="2" class="nav-child-title">
              <template slot="title"><img
                src="http://zhangshangtijian.b0.upaiyun.com/http:/zhangshangtijian.b0.upaiyun.com/XblEMw5Z9eTUlRykheECyQfsJkXviObW.png"
                style="padding-right:10px;width:20px;height:20px;-webkit-border-radius: 50%;-moz-border-radius: 50%;border-radius: 50%;"
                alt="">huihui
              </template>
              <el-menu-item index="indetification">基础信息</el-menu-item>
              <el-menu-item index="2-2">修改密码</el-menu-item>
              <el-menu-item index="2-3">退出系统</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-header>
        <el-main>
          <keep-alive>
            <router-view>
              <loading v-if="loading"></loading>
            </router-view>
          </keep-alive>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import {localUrl} from "@/config/env.js"
  import {storeManager} from '@/api/util.js';
  import {mapState} from 'vuex';
  import {api} from '@/api/api';
  import loading from '@/components/loading/loading'

  export default {
    data() {
      return {
        navMenu: [],
        activeIndex2: '1'
      }
    },
    components: {
      loading
    },
    created() {
      let url = localUrl + 'nav',
        params = '';
      api.nav(url, params).then((res) => {
        let data = res.data;
        if (data.code === 0) {
          this.navMenu = data.menuList;
        }
      });
      this.getMsgList();
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      getMsgList() {
        let url = localUrl + 'countUserNewsList',
          uid = storeManager.getUserId(),
          params = uid;
        this.$store.dispatch('msgList', url, params)
      }
    },
    computed: {
      defaultActive: function () {
        return this.$route.path.replace('/', '');
      },
      allcount() {
        let count = 0;
        if (this.msgList && this.msgList.data) {
          this.msgList.data.forEach((item) => {
            count += parseInt(item.unReadCount)
          });
        }
        return count;
      },
      ...mapState({
        loading: state => state.isLoading,
        msgList: state => state.msgList
      }),
    },
  }

</script>
<style lang="less">
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
    /*text-align: center;*/
    line-height: 160px;
    height: 100%;
    /*padding-top: 0;*/
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
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
  .breadcrumbStyle>span{
    color:#fff!important;
  }
  .manage_page{
    .el-submenu__title {
      border-bottom: none !important;
    }
  }
  /*面包屑end*/
</style>
<style scoped lang="less">
  /*我的样式*/
  .manage_page {
    height: 100%;
    .homeTitle{
      background-color:#2D93CA!important;
      color:#fff!important;
      height:59px;
      font-size:18px;
    }
    .nav-title li {
      border-bottom: none !important;
    }

    .iconfont {
      font-size: 18px;
      margin-right: 5px;
    }
    /*小圆标*/
    .iconStyle {
      position: absolute;
      top: -13px;
      right: -8px;
      z-index: 100;
    }

  }
</style>
