<template>
  <div class="identification">

    <!--未认证-->
    <div class="no-apply-wrapper">
      <el-tabs v-model="tabIndex">
        <el-tab-pane label="基本信息" name="first"></el-tab-pane>
      </el-tabs>
      <p class="basicInfoBar">
        <strong class="note">姓名：</strong>
        <span class="text">yuexin</span>
        <strong class="note">平台角色：</strong>
        <span class="text">医生</span>
      </p>


      <!--待认证-->
      <el-card shadow="never" class="m_b_15 warning-panel">
        <el-row :gutter="20">
          <el-col :span="4" style="text-align: right">
            <strong class="title-note">
              <span class="el-icon-warning note-icon warning-icon"></span>
            </strong>
          </el-col>
          <el-col :span="20">
            <h3 class="status-panel-text">认证申请中！</h3>
            <p class="status-panel-text">身份信息已提交，待审核</p>
            <el-button size="small" type="primary">去认证</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <!--已认证-->
    <div class="has-apply-wrapper"></div>
  </div>
</template>

<script>

  export default {
    components: {

    },
    data(){
      return{
        tabIndex:'first'
      }
    },
    created(){

    },
    methods:{

    },
    computed:{

    }
  }
</script>

<style scoped lang="less">
  .basicInfoBar{margin-bottom: 20px;line-height: 28px;}

  .basicInfoBar .note{font-size: 16px;}
  .basicInfoBar .text{font-size: 16px;padding-right: 30px}

  .success-panel{background-color: #d8e8d8;border: 1px solid #44ae44}
  .warning-panel{background-color: #f9ebd8;border: 1px solid #f0ad4e}
  .fail-panel{background-color: #f6cbca;border: 1px solid #d9534f}
  .note-icon{font-size: 20px}
  .success-icon{color:#44ae44;}
  .warning-icon{color:#f0ad4e}
  .error-icon{color:#d9534f;}
  .status-panel-text{line-height: 22px;color:#444;font-size: 14px;}
</style>
