<template>
  <div class="header_container">
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/manage' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
    </el-breadcrumb>
    <!--下拉-->
    <el-dropdown>
      <span class="el-dropdown-link">
        {{getUseName}}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>基础信息</el-dropdown-item>
        <el-dropdown-item>修改密码</el-dropdown-item>
        <el-dropdown-item>退出系统</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  export default {
    computed:{
      ...mapGetters([
        'getUseName',
        'getUseAvatar'
      ])
    }

  }
</script>

<style lang="less">
  @import '../asset/style/mixin';
  .header_container{background-color: #3c8dbc;height: 60px;display: flex;justify-content: space-between;align-items: center;padding:0 20px;}
  .el-breadcrumb__inner.is-link,.el-breadcrumb__inner{color: #b8c7ce!important;}
  .el-breadcrumb__separator{color:#b8c7ce}
  .el-dropdown{color:#b8c7ce;cursor: pointer}
  .el-dropdown-menu__item{text-align: center;}
</style>

