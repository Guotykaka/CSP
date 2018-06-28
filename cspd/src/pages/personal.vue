<template>
  <div>
    <head-top></head-top>
    <section class="page-wrapper">
      <el-card class="box-card">
        <el-row :gutter="24">
          <el-col :span="8">
            <strong class="note-title">账户余额：</strong>
            <span>100.00</span>
          </el-col>
          <el-col :span="8">
            <strong class="note-title">总收益：</strong>
            <span>100.00</span>
          </el-col>
          <el-col :span="8">
            <strong class="note-title">已提现：</strong>
            <span>100.00</span>
          </el-col>
        </el-row>
      </el-card>
    </section>
  </div>
</template>

<script>
  import headTop from '../components/headTop.vue'
  import {getDoctorAccountInfo} from "@/api/getData.js";
  export default {
    data(){
      return {

      }
    },
    components: {
      headTop
    },


    created:function () {
      //getDoctorAccountInfo()
    }






  }
</script>

<style lang="less" scoped>
  @import '../asset/style/mixin';
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
/*  .bg-purple-dark {
    background: #99a9bf;
  }*/
  /*.bg-purple {
    background: #d3dce6;
  }*/
  /*.bg-purple-light {
    background: #e5e9f2;
  }*/
/*  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }*/
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
