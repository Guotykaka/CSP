<template>
  <div class="manage_page fillcontain" style="display: flex">
    <!--左nav-->
    <div class="main-nav">
      <h2 class="logo-t-text">掌上体检云服务平台</h2>
      <!--医生管理-->
      <el-menu background-color="#324157" text-color="#b8c7ce" :default-active="defaultActive" unique-opened router>

        <el-menu-item index="/main"><i class="el-icon-menu nav-t-icon"></i>控制台</el-menu-item>
 <!--       <el-submenu index="1">
          <template slot="title"><i class="el-icon-document nav-t-icon"></i>系统管理</template>
          <el-menu-item index="/notice"><i class="el-icon-view nav-t-icon"></i>公告管理</el-menu-item>
          <el-menu-item index="/role"><i class="el-icon-refresh nav-t-icon"></i>角色管理</el-menu-item>
          &lt;!&ndash;<el-menu-item index="dept">部门管理</el-menu-item>&ndash;&gt;
          <el-menu-item index="/user"><i class="el-icon-bell nav-t-icon"></i>用户管理</el-menu-item>
          <el-menu-item index="/message_template"><i class="el-icon-message nav-t-icon"></i>消息模板</el-menu-item>
          <el-menu-item index="/menuList"><i class="el-icon-menu nav-t-icon"></i>菜单管理</el-menu-item>
          <el-menu-item index="/dictionary"><i class="el-icon-menu nav-t-icon"></i>系统常量</el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title"><i class="el-icon-setting nav-t-icon"></i>机构业务</template>
          <el-menu-item index="/institution"><i class="el-icon-news nav-t-icon"></i>机构列表</el-menu-item>
          <el-menu-item index="/medicine_group"><i class="el-icon-menu nav-t-icon"></i>医学分组</el-menu-item>
          <el-menu-item index="/report_label"><i class="el-icon-document nav-t-icon"></i>报告标签</el-menu-item>
          <el-menu-item index="/medical_quota"><i class="el-icon-edit-outline nav-t-icon"></i>医学指标</el-menu-item>
        </el-submenu>

        <el-submenu index="3">
          <template slot="title"><i class="el-icon-goods nav-t-icon"></i>商品管理</template>
          <el-menu-item index="/service_info"><i class="el-icon-service nav-t-icon"></i>服务管理</el-menu-item>
        </el-submenu>

        <el-submenu index="4">
          <template slot="title"><i class="el-icon-service nav-t-icon"></i>医生管理</template>
          <el-menu-item index="/doctorList">医生列表</el-menu-item>
          <el-menu-item index="/indentList">认证列表</el-menu-item>
        </el-submenu>
        <el-submenu index="5">
          <template slot="title"><i class="el-icon-tickets nav-t-icon"></i>订单管理</template>
          <el-menu-item index="/orderList">订单列表</el-menu-item>
          <el-menu-item index="/refundsList">退款列表</el-menu-item>
        </el-submenu>

        <el-submenu index="6">
          <template slot="title"><i class="el-icon-plus nav-t-icon"></i>财务管理</template>
          <el-menu-item index="/withdrawList">提现列表</el-menu-item>
        </el-submenu>-->

        <el-submenu :index="item.name" v-for="(item,index) in navMenu" :key="index">
          <template slot="title"><i :class="item.icon"></i>{{item.name}}</template>
          <el-menu-item :index="itemChild.url" v-for="(itemChild,indexChild) in item.list" :key="indexChild">{{itemChild.name}}
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>

    <!--右container-->
    <div class="main-container">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>

  </div>
</template>

<script>

  import {getStore} from "@/config/mUtils";
  import {mapMutations} from 'vuex'
  import {
    ERR_OK,
    getListAllInstitution,
    getLeftNav,
    getListWithNoParam
  } from "@/api/api.js";
  export default {
    data: function () {
      return {
        userInfo: {},//用户信息
        navMenu:[],//左侧导航栏
      }
    },
    computed: {
      defaultActive: function () {
        return this.$route.path.replace('/', '/');
      }
    },
    created() {
      this.userInfo = JSON.parse(getStore('userMesage'));
      this.getInstitution();
      this.getNavLeft();
      this.getRoleLsit()
    },
    methods: {
      ...mapMutations([
        'setInstitutionArr','setDoctorRolesList'
      ]),
      getNavLeft(){
        let params ={
          "userId":this.userInfo.userId,
          "userType": this.userInfo.userType
        }
        getLeftNav(params).then((res)=>{
          if(res.code===ERR_OK){
            this.navMenu = res.data;
          }else{
            this.$alert(res.msg,'提示')
          }
        })
      },

      //获取机构列表
      getInstitution() {
        getListAllInstitution({}).then(res => {
          this.setInstitutionArr(res.data);
        })
      },

      //获取角色列表
      getRoleLsit(){
        getListWithNoParam({}).then(res => {
          this.setDoctorRolesList(res.data);
        })
      }
    }
  }

</script>

<style scoped lang="less">
  .logo-t-text {
    line-height: 60px;
    text-align: center;
    color: #fff;
    font-size: 20px;
    font-weight: bold;
    background-color: #367fa9
  }

  .nav-t-icon {
    color: #b8c7ce;
  }

  .el-menu-item {
    background-color: #1f2d3d !important;
  }

  .el-menu-item:hover {
    background-color: rgb(50, 65, 87) !important;
  }

  .el-menu {
    border-right: none
  }

  .main-nav {
    flex: 0 0 250px;
    height: 100%;
    background-color: #222d32;
    overflow: auto
  }

  .main-container {
    flex: 1;
    height: 100%;
    min-width: 0;
    overflow-y: hidden;
  }
</style>
