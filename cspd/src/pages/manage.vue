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
              <el-menu-item index="doctor_index"><i class="el-icon-menu"></i>云服务平台医生端</el-menu-item>
              <el-submenu index="22">
                <template slot="title"><i class="el-icon-document"></i>个人中心</template>
                <el-menu-item index="manage">个人账户</el-menu-item>
                <el-menu-item index="msg">消息列表</el-menu-item>
              </el-submenu>
              <el-submenu index="32">
                <template slot="title"><i class="el-icon-plus"></i>服务管理</template>
                <el-menu-item index="tel_consult">电话咨询</el-menu-item>
                <el-menu-item index="imgText_consult">图文咨询</el-menu-item>
                <el-menu-item index="indetification">认证详情</el-menu-item>
                <el-menu-item index="server_setting">服务设置</el-menu-item>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <el-container>
        <el-header class="nav-title">
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
            <el-menu-item index="manage">系统公告</el-menu-item>
            <el-menu-item index="call_doctor">联系医助</el-menu-item>
            <el-menu-item index="msg">消息</el-menu-item>
            <el-submenu index="2">
              <template slot="title"><img src="http://zhangshangtijian.b0.upaiyun.com/http:/zhangshangtijian.b0.upaiyun.com/XblEMw5Z9eTUlRykheECyQfsJkXviObW.png" style="padding-right:10px;width:20px;height:20px;-webkit-border-radius: 50%;-moz-border-radius: 50%;border-radius: 50%;" alt="">huihui</template>
              <el-menu-item index="2-1">基础信息</el-menu-item>
              <el-menu-item index="2-2">修改密码</el-menu-item>
              <el-menu-item index="2-3">退出系统</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-header>
        <div class="header_container">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-for="(item, index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <el-main>

          <keep-alive>

            <router-view></router-view>
          </keep-alive>
        </el-main>
      </el-container>
    </el-container>


  </div>
</template>

<script>
  export default {
    data() {
      return {

        activeIndex2: '1'
      }
    },
    computed: {
      defaultActive: function () {
        return this.$route.path.replace('/', '');
      }
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }

</script>

<style scoped lang="less">
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
    height:100%;
    padding-top:0;
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
  .header_container{
    background-color: #EFF2F7;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding:0 20px;
  }
  /*面包屑end*/

  /*我的样式*/
  .manage_page {
    height: 100%;
  }
  .nav-title li{
    border-bottom:none!important;
  }
</style>
