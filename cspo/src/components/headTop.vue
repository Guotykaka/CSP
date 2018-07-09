<template>
  <div class="header_container">
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/manage' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="self-nav-box">
      <a class="self-nav-item">系统公告</a>
      <a class="self-nav-item">消息<span class="badge-item">5</span></a>
    </div>





    <!--下拉-->
    <el-dropdown>
      <span class="el-dropdown-link">
        {{getUseName}}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>基础信息</el-dropdown-item>
        <el-dropdown-item>修改密码</el-dropdown-item>
        <el-dropdown-item :command="logout">退出系统</el-dropdown-item>
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
    },

    methods:{
      logout:function () {

        alert(555)


          this.$alert('这是一段内容', '标题名称', {
            confirmButtonText: '确定',
            callback: action => {
              this.$message({
                type: 'info',
                message: `action: ${ action }`
              });
            }
          });


      }
    }

  }
</script>

<style lang="less">
  @import '../asset/style/mixin';
  .header_container{background-color: #3c8dbc;height: 60px;display: flex;justify-content: space-between;align-items: center;padding:0 20px;}
  .el-breadcrumb{flex: 1}
  .el-breadcrumb__inner.is-link,.el-breadcrumb__inner{color: #b8c7ce!important;}
  .el-breadcrumb__separator{color:#b8c7ce}
  .el-dropdown{color:#b8c7ce;cursor: pointer}
  .el-dropdown-menu__item{text-align: center;}
  .self-nav-box{ display: inline-block ;height:60px;padding-right: 20px;}
  .self-nav-box .self-nav-item{padding: 15px;line-height: 30px;height: 30px;display: inline-block;color: #fff;cursor: pointer;font-size: 13px;}
  .self-nav-box .self-nav-item:hover{background-color: rgb(54,127,169)}
  .badge-item{background-color: red;padding: 0 5px;display: inline-block;margin-left: 10px;height: 16px;line-height: 16px;border-radius: 4px;}
</style>

