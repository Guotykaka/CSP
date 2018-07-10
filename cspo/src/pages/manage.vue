<template>
  <div class="manage_page fillcontain">
    <div style="height: 100%;display: flex">
      <!--左nav-->
      <div style="min-height: 100%; background-color:#222d32;width: 250px">
        <h2 class="logo-t-text">掌上体检云服务平台</h2>

        <!--医生管理-->
        <el-menu background-color="#324157" text-color="#b8c7ce" router>

          <el-menu-item index="main"><i class="el-icon-menu"></i>控制台</el-menu-item>
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-document nav-t-icon"></i>系统管理</template>
            <el-menu-item index="notice">公告管理</el-menu-item>
            <el-menu-item index="role">角色管理</el-menu-item>
            <!-- <el-menu-item index="dept">部门管理</el-menu-item> -->
            <el-menu-item index="user">用户管理</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-plus nav-t-icon"></i>机构业务</template>
            <el-menu-item index="institution">机构列表</el-menu-item>
            <el-menu-item index="medicine_group">医学分组</el-menu-item>
            <el-menu-item index="report_label">报告标签</el-menu-item>
            <el-menu-item index="medical_quota">医学指标</el-menu-item>
          </el-submenu>

          <el-submenu index="3">
            <template slot="title"><i class="el-icon-plus nav-t-icon"></i>医生管理</template>
            <el-menu-item index="doctorList">医生列表</el-menu-item>
            <el-menu-item index="indentList">认证列表</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title"><i class="el-icon-plus nav-t-icon"></i>订单管理</template>
            <el-menu-item index="orderList">订单列表</el-menu-item>
            <el-menu-item index="refundsList">退款列表</el-menu-item>
          </el-submenu>

          <el-submenu index="5">
            <template slot="title"><i class="el-icon-plus nav-t-icon"></i>财务管理</template>
            <el-menu-item index="withdrawList">提现列表</el-menu-item>
          </el-submenu>

        </el-menu>
      </div>

      <!--右container-->
      <div style="height: 100%;flex: 1">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </div>

    </div>
    <el-row>

    </el-row>
  </div>
</template>

<script>

    export default {
      data:function () {
        return{

        }
      },
      computed: {
        defaultActive: function(){
          return this.$route.path.replace('/', '');
        }
      },

      methods:{
        //点击nav执行方法
        jumpLink:function (item) {
          this.$router.push(item)
        }
      }
    }

</script>

<style scoped>

  .logo-t-text{line-height: 60px;text-align: center;color: #fff;font-size: 20px;font-weight: bold;background-color:#367fa9}
  .nav-t-icon{color: #b8c7ce;}
  .el-menu-item{background-color: #1f2d3d!important;}
  .el-menu-item:hover{background-color:rgb(50,65,87)!important;}
  .el-menu{border-right:none}

</style>
