<template>
  <div class="header_container">
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="self-nav-box">
      <a class="self-nav-item" @click="announcementFn">系统公告</a>
      <a class="self-nav-item" @click="msgListFn">消息<span class="badge-item">{{getUnReadSum}}</span></a>
    </div>

    <!--下拉-->
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        {{getUseName}}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="baseInfo">个人中心</el-dropdown-item>
        <el-dropdown-item command="changePass">修改密码</el-dropdown-item>
        <el-dropdown-item command="logout">退出系统</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!--修改密码dialog-->
    <el-dialog title="修改密码" :visible.sync="isShowDialog" width="400px">
      <el-form label-width="80px">
        <el-form-item label="原密码">
          <el-input v-model="oldPassword" placeholder="原密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="newPassword" placeholder="新密码"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="okFn">修改</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import { mapGetters,mapMutations } from 'vuex';
  import {getStore,EncodeUserId,IsAlert} from "@/config/mUtils.js";
  import {ERR_OK,getNewsList,resetPassword} from '@/api/api';


  export default {
    data(){
      return{
        isShowDialog:false,
        oldPassword:"",
        newPassword:"",
        userName:""
      }
    },
    computed:{
      ...mapGetters([
        'getUseName',
        'getUseAvatar',
        'getUnReadSum'
      ])
    },

    methods:{
      ...mapMutations(['setUseName','setUnReadNewsList']),
      //处理command
      handleCommand(command){
        if(command==='baseInfo'){
          //个人中心
          this.$router.push('/goMyself')

        }else if(command==='changePass'){
          //修改密码
          this.isShowDialog=true;
        }else if(command==='logout'){
          //退出
          this.$router.push("/login",function () {
            localStorage.clear();
          })
        }
      },

      //点击取消
      cancel(){
        this.isShowDialog=false;
      },

      //点击修改
      okFn(){
        let params = {
          newPassword: this.newPassword,
          password: this.oldPassword,
          userId: EncodeUserId(JSON.parse(getStore("userMesage")).userId)
        }
        resetPassword(params).then((res)=>{
          if(res.code === ERR_OK){
            IsAlert('修改密码成功','成功','success');
            this.$router.push('/login')
            localStorage.clear();
          }else{
            IsAlert(res.msg,'错误','error');
          }
        })
      },

      //点击系统公告
      announcementFn(){
        this.$router.push("/announcement");
      },
      msgListFn(){
        this.$router.push("/msgList");
      },

      //获取未读消息列表 加总数
      getUnreadList(){
        let params={
          id:EncodeUserId(JSON.parse(getStore("userMesage")).userId),
        };
        getNewsList(params).then(res => {
          if(res.code===ERR_OK){
            if(res.data){
              this.setUnReadNewsList(res.data)
            }
          }else {
            IsAlert(res.msg,'错误','error');
          }
        }).catch(err => {
          this.$message.error('网络错误，请稍后重试')
        });
      }
    },

    activated(){
      this.setUseName(JSON.parse(getStore("userMesage")).userName);
      this.getUnreadList()
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
  .el-dropdown-link{
    color:#fff;
  }
</style>

