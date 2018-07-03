<template>
  <div class="manage_page">
    <el-row class="tac">
      <el-col :span="4">
        <el-menu
          :default-active="defaultActive"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-menu-item index="manage"><i class="el-icon-menu"></i>首页</el-menu-item>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-document"></i>数据管理</template>
            <el-menu-item index="manage">个人账户</el-menu-item>
            <el-menu-item index="msg">消息列表</el-menu-item>
          </el-submenu>
          <el-menu-item index="3">
            <template slot="title"><i class="el-icon-plus"></i>服务管理</template>
            <el-menu-item index="tel_consult">电话咨询</el-menu-item>
            <el-menu-item index="imgText_consult">图文咨询</el-menu-item>
            <el-menu-item index="indetification">认证详情</el-menu-item>
            <el-menu-item index="server_setting">服务设置</el-menu-item>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>


    <el-row style="height: 100%;">
      <el-col :span="4" style="min-height: 100%; background-color: #324057;">
        <el-menu
          :default-active="defaultActive"
          style="min-height: 100%;"
          theme="dark"
          background-color="#324057"
          text-color="#bfbfac"
          router>
          <el-menu-item index="doctor_index"><i class="el-icon-menu">

          </i>云服务平台医生端
          </el-menu-item>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-document"></i>个人中心</template>
            <el-menu-item index="manage">个人账户</el-menu-item>
            <el-menu-item index="msg">消息列表</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title"><i class="el-icon-plus"></i>服务管理</template>
            <el-menu-item index="tel_consult">电话咨询</el-menu-item>
            <el-menu-item index="imgText_consult">图文咨询</el-menu-item>
            <el-menu-item index="indetification">认证详情</el-menu-item>
            <el-menu-item index="server_setting">服务设置</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
      <el-col :span="20" style="height: 100%;overflow: auto;">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data: function () {
      return {}
    },
    computed: {
      defaultActive: function () {
        return this.$route.path.replace('/', '');
      }
    },

    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }

</script>

<style scoped lang="less">

</style>
