<template>
  <div class="manage_page fillcontain" style="display: flex">
    <!--左nav-->
    <div class="main-nav">
      <h2 class="logo-t-text">掌上体检云服务平台</h2>
      <!--医生管理-->
      <el-menu
        background-color="#324157"
        text-color="#b8c7ce"
        :default-active="defaultActive"
        @select="reloadOrder"
        unique-opened
        router
        class="menu-lists"
      >
        <el-menu-item index="/main"><i class="el-icon-menu nav-t-icon"></i>控制台</el-menu-item>
        <el-submenu :index="item.menuName" v-for="(item,index) in navMenu" :key="index">
          <template slot="title"><i :class="item.icon"></i>{{item.menuName}}</template>
          <el-menu-item :index="itemChild.url" v-for="(itemChild,indexChild) in item.childMenus" :key="indexChild">
            {{itemChild.menuName}}
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>

    <!--右container-->
    <div class="main-container">
      <keep-alive>
        <router-view v-if="isRouterAlive"></router-view>
      </keep-alive>
    </div>

  </div>
</template>

<script>

  import {getStore, Base64,setStore,EncodeUserId} from "@/config/mUtils";
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
        navMenu: [],//左侧导航栏
        isRouterAlive: true
      }
    },
    provide() {
      return {
        reload: this.reload
      }
    },
    computed: {
      defaultActive: function () {
        return this.$route.path.replace('/', '/');
      }
    },
    created() {
      this.userInfo = JSON.parse(getStore('userMesage'));
      // this.navMenu = JSON.parse(Base64.decode(getStore('navList')));
      this.getInstitution();
      this.getNavLeft();
      this.getRoleLsit()
    },
    methods: {
      ...mapMutations([
        'setInstitutionArr', 'setDoctorRolesList'
      ]),
      /*页面重载*/
      reload() {
        this.isRouterAlive = false;
        this.$nextTick(function () {
          this.isRouterAlive = true;
        })
      },
      reloadOrder(index) {
        if (index === '/orderList') {
          this.reload()
        }
      },
      getNavLeft() {
        let params = {
          userId: EncodeUserId(this.userInfo.userId),
          category: 1
        }
        getLeftNav(params).then((res) => {
          if (res.code === ERR_OK) {
            this.navMenu = res.data;
            this.handleNav(res.data)
          } else {
            this.$alert(res.msg, '提示')
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试');
        })
      },
      /*菜单路由处理*/
      handleNav(val) {
        let arrParent = [], arrChild = [];
        val.forEach((v, i) => {
          if (v.url) {
            arrParent.push(v.url)
          } else {
            if (v.childMenus) {
              v.childMenus.forEach((childUrl) => {
                if (childUrl.url) {
                  arrChild.push(childUrl.url)
                }
              })
            }
          }
        });
        let menuData = Base64.encode(JSON.stringify(arrParent.concat(arrChild)));
        setStore('navMenu', menuData)
      },

      //获取机构列表
      getInstitution() {
        getListAllInstitution({}).then(res => {
          this.setInstitutionArr(res.data);
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试');
        })
      },

      //获取角色列表
      getRoleLsit() {
        getListWithNoParam({}).then(res => {
          this.setDoctorRolesList(res.data);
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试');
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
  .menu-lists{
    height: calc(100% - 60px);
    overflow:scroll;
  }
  .main-container {
    flex: 1;
    height: 100%;
    min-width: 0;
    overflow-y: hidden;
  }
</style>
