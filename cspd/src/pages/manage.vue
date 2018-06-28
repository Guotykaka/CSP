<template>
  <div class="manage_page fillcontain">
    <el-row style="height: 100%;">
      <el-col :span="4"  style="min-height: 100%; background-color: #324057;">
        <el-menu :default-active="defaultActive" style="min-height: 100%;" theme="dark" router>
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-document"></i>个人中心</template>
            <el-menu-item index="manage">个人账户</el-menu-item>
            <el-menu-item index="msg">消息列表</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
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
      data:function () {
        return{
          nav:[
            {
              itemText:"个人中心",
              childLists:[
                {
                  text:"个人账户",
                  url:"/manage",
                  icon:''
                },{
                  text:"消息列表",
                  url:"/manage/msg",
                  icon:''
                },
              ]
            },{
              itemText:"服务管理",
              childLists:[
                {
                  text:"电话咨询",
                  url:"/manage/tel_consult",
                  icon:''
                },{
                  text:"图文咨询",
                  url:"/manage/imgText_consult",
                  icon:''
                },{
                  text:"认证详情",
                  url:"/manage/indetification",
                  icon:''
                },{
                  text:"服务设置",
                  url:"/manage/server_setting",
                  icon:''
                },
              ]
            },


          ]
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
</style>
