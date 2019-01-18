<template>
  <div>
    <el-card class="box-card">
      <!--tab-->
      <el-tabs>
        <el-tab-pane label="基础信息" name="0"></el-tab-pane>
      </el-tabs>

      <p class="info-bar">
        <strong class="base-title">姓名：</strong>
        <span class="base-text">{{userName}}</span>
      </p>

      <!--认证状态authenticationStatus  0未认证  1认证中  2已认证   3已取消  4已拒绝-->
      <!--未认证-->
      <div class="apply-panel warning-panel" v-if="authenticationStatus===0">
        <p class="apply-status-bar">
          <i class="status-icon el-icon-warning"></i>请完善个人信息，并认证您的身份！
        </p>
        <p class="notice-text">如有问题，请咨询400-820-2830</p>
        <el-button type="warning" size="small" @click="toApplyPage">去认证</el-button>
      </div>

      <!--认证中-->
      <div class="apply-panel warning-panel"  v-if="authenticationStatus===1">
        <p class="apply-status-bar">
          <i class="status-icon el-icon-warning"></i>认证中！
        </p>
        <p class="notice-text">如有问题，请咨询400-820-2830</p>
        <el-button type="warning" size="small" @click="toApplyPage">查看</el-button>
      </div>

      <!--认证中-->
      <div class="apply-panel success-panel"  v-if="authenticationStatus===2">
        <p class="apply-status-bar">
          <i class="status-icon el-icon-success"></i>认证成功！
        </p>
        <p class="notice-text">如有问题，请咨询400-820-2830</p>
        <el-button type="success" size="small" @click="toApplyPage">查看</el-button>
      </div>

      <!--已取消-->
      <div class="apply-panel fail-panel"  v-if="authenticationStatus===3">
        <p class="apply-status-bar">
          <i class="status-icon el-icon-error error-icon"></i>已取消！
        </p>
        <p class="notice-text">如有问题，请咨询400-820-2830</p>
        <el-button type="warning" size="small" @click="toApplyPage">重新认证</el-button>
      </div>

      <!--已拒绝-->
      <div class="apply-panel fail-panel"  v-if="authenticationStatus===4">
        <p class="apply-status-bar">
          <i class="status-icon el-icon-error error-icon"></i>认证失败！
        </p>
        <p class="notice-text">如有问题，请咨询400-820-2830</p>
        <el-button type="warning" size="small" @click="toApplyPage">重新认证</el-button>
      </div>
    </el-card>
  </div>

</template>
<script>
  import {getStore,setStore,EncodeDoctorId,setDecodeStore} from "@/config/mUtils.js";
  import {getInsdoctorInfo,ERR_OK} from "@/api/api.js";

  export default {
    data() {
      return {
        userName:JSON.parse(getStore("userMesage")).userName,
        authenticationStatus:"",
      }
    },
    methods:{
      //判断是否已认证
      isAuthenticationFn(){
        //这个要解密啊
        let insDoctorId =EncodeDoctorId(JSON.parse(getStore("userMesage")).insDoctorId);
        let params={
          insDoctorId:insDoctorId
        };
        getInsdoctorInfo(params).then(res => {
          if(res.code===ERR_OK){
            this.authenticationStatus=res.data.authenticationStatus;
            setDecodeStore("authenticationStatus",res.data.authenticationStatus);

          }
        });
      },

      //去认证
      toApplyPage(){
        this.$router.push("/doApply");
      },
    },
    activated(){
      this.isAuthenticationFn();
    }
  }
</script>
<style lang="less" scoped>
  .base-title{line-height: 30px;color:#303133;font-size: 15px;}
  .base-text{line-height: 30px;color:#606266;font-size: 15px;padding-right:60px;}
  .info-bar{margin-bottom: 15px;}
  .apply-panel{padding:18px 100px;border-radius: 10px;}
  .warning-panel{border:1px solid #e6a23c;background-color:rgba(230,162,60,0.1)}
  .apply-status-bar{line-height: 28px;font-size: 18px;color:#303133;margin-bottom: 15px;position: relative}
  .status-icon{position: absolute;font-size: 24px;left: -35px;top:2px}
  .status-icon.el-icon-warning{color:#e6a23c}
  .notice-text{line-height: 28px;font-size: 16px;color:#303133;margin-bottom: 10px;}
  .success-panel{background-color: #d8e8d8;border: 1px solid #44ae44;}
  .status-icon.el-icon-success{color:#44ae44}
  .fail-panel{background-color: #f6cbca;border: 1px solid #d9534f;}
  .error-icon{color: #d9534f;}
</style>
