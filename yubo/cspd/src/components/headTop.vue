<template>
  <div class="header_container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!--<el-breadcrumb-item :to="{ path: '/manage' }">{{navTitle}}</el-breadcrumb-item>-->
      <el-breadcrumb-item v-for="(item, index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
    </el-breadcrumb>
<!--    <el-dropdown menu-align='start'>
      <img class="avator"/>
      <span class="el-dropdown-link">
        huihui<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>基础信息</el-dropdown-item>
        <el-dropdown-item>修改密码</el-dropdown-item>
        <el-dropdown-item>退出系统</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>-->
  </div>
</template>

<script>
/*
  import {signout} from '@/api/getData'
  import {baseImgPath} from '@/config/env'
  import {mapActions, mapState} from 'vuex'
*/

  export default {
    data(){
      return {
        navTitle:''
      }
    },
    created(){
        this.navTitle = this.$store.state.navTitle
    },
    watch: {
      navTitle () {
        return this.$store.state.navTitle
      }
    },
    methods: {
    }
  }
</script>

<style lang="less">
  @import '../asset/style/mixin';
  .header_container{
    background-color: #EFF2F7;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding:0 20px;
  }
  .avator{
    .wh(36px, 36px);
    border-radius: 50%;
    margin-right: 37px;
  }
  .el-dropdown-menu__item{
    text-align: center;
  }
</style>

