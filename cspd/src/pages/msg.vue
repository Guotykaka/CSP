<template>
  <div class="msg">
    <el-card class="box-card">
      <!--tab-->
      <el-tabs>
        <el-tab-pane label="我的消息列表" name="0"></el-tab-pane>
      </el-tabs>

      <!--table 表单开始-->
      <el-table
        :data="msgLists"
        border
        style="width: 100%">
        <el-table-column prop="" label="序号"  width="60" type="index"></el-table-column>
        <el-table-column prop="newsTitle" label="标题"></el-table-column>
        <el-table-column prop="unReadCount" label="未读消息"></el-table-column>
        <el-table-column prop="typeName" label="类型"></el-table-column>

        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="_checkDetail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--table 表单结束-->
    </el-card>
  </div>

</template>
<script>
  import { mapGetters } from "vuex";
  export default {
    data() {
      return {
        msgLists:[
          {"unReadCount":"0","newsTitle":"您有新订单","typeName":"新订单通知","newsType":"1"},
          {"unReadCount":"17","newsTitle":"新退款订单","typeName":"新退款通知","newsType":"2"},
          {"unReadCount":"4","newsTitle":"新待认证订单","typeName":"新认证通知","newsType":"3"},
          {"unReadCount":"5","newsTitle":"新提现订单","typeName":"提现申请通知","newsType":"4"}      ]
      }
    },
    computed:{
      ...mapGetters(['getInstitutionArr'])
    },

    methods:{
      //查看详情
      _checkDetail(item){
        if(item.newsType ==='1'){
          //订单
          this.$router.push("/orderList")
        }else if(item.newsType === '2'){
          //退款
          this.$router.push("/refundsList")
        }else if(item.newsType === '3'){
          //医生认证
          this.$router.push("/indentList")
        }else if(item.newsType === '4'){
          //提现
          this.$router.push("/withdrawList")
        }
      },
    },
  }
</script>
<style lang="less" scoped>
  .info-title{text-align: center;line-height: 24px;font-size: 18px;color:#303133;font-weight:normal;margin-bottom: 15px}
  .info-content{color:#606266;font-size: 14px;line-height: 22px;margin-bottom: 20px}
</style>
