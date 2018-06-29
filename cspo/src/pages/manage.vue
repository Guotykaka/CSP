<template>
  <div class="manage_page fillcontain">
    <el-row style="height: 100%;">
      <el-col :span="4"  style="min-height: 100%; background-color: #324057;">
        <el-menu :default-active="defaultActive" style="min-height: 100%;" theme="dark" router>
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-document"></i>系统管理</template>
            <el-menu-item index="notice">公告管理</el-menu-item>
            <el-menu-item index="msg_queue">消息队列</el-menu-item>
            <el-menu-item index="dept">部门管理</el-menu-item>
            <el-menu-item index="user">用户管理</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-plus"></i>机构业务</template>
            <el-menu-item index="institution">机构列表</el-menu-item>
            <el-menu-item index="medicine_group">医学分组</el-menu-item>
            <el-menu-item index="report_label">报告标签</el-menu-item>
            <el-menu-item index="medical_quota">医学指标</el-menu-item>
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


  .full-page{
    height: 100%;
  }
  .el-header{
    background-color: #B3C0D1;
    color: #333;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
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

  .el-menu--dark {
    background-color: #324157
}
</style>
