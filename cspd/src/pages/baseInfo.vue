<template>


  <div>
    <el-card class="box-card">
      <!--tab-->
      <el-tabs>
        <el-tab-pane label="基础信息" name="0"></el-tab-pane>
      </el-tabs>

      <p class="info-bar">
        <strong class="base-title">姓名：</strong>
        <span class="base-text">慧慧</span>
        <strong class="base-title">平台角色：</strong>
        <span class="base-text">医生</span>
      </p>

      <!--未认证-->
      <div class="apply-panel warning-panel">
        <p class="apply-status-bar">
          <i class="status-icon el-icon-warning"></i>请完善个人信息，并认证您的身份！
        </p>
        <p class="notice-text">如有问题，请咨询400-820-2830</p>
        <el-button type="warning" size="small" @click="toApplyPage">去认证</el-button>
      </div>
    </el-card>
  </div>

</template>
<script>
  import { mapGetters } from "vuex";
  export default {
    data() {
      return {

      }
    },


    methods:{

      //去认证
      toApplyPage(){
        this.$router.push("doApply");
      }






    },
  }
</script>
<style lang="less" scoped>
  .base-title{line-height: 30px;color:#303133;font-size: 15px;}
  .base-text{line-height: 30px;color:#606266;font-size: 15px;padding-right:60px;}
  .info-bar{margin-bottom: 15px;}
  .apply-panel{padding:30px 100px;border-radius: 10px;}
  .warning-panel{border:1px solid #e6a23c;background-color:rgba(230,162,60,0.1)}
  .apply-status-bar{line-height: 28px;font-size: 18px;color:#303133;margin-bottom: 15px;position: relative}
  .status-icon{position: absolute;font-size: 30px;left: -40px;top:0}
  .status-icon.el-icon-warning{color:#e6a23c}
  .notice-text{line-height: 28px;font-size: 16px;color:#303133;margin-bottom: 10px;}
</style>
