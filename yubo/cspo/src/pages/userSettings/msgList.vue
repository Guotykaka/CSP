<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <el-card class="box-card">
        <!--tab-->
        <el-tabs>
          <el-tab-pane label="我的消息列表" name="0"></el-tab-pane>
        </el-tabs>

        <!--table 表单开始-->
        <el-table
          :data="getUnReadList"
          border
          style="width: 100%">
          <el-table-column show-overflow-tooltip prop="" label="序号"  width="60" type="index"></el-table-column>
          <el-table-column show-overflow-tooltip prop="newsTitle" label="标题"></el-table-column>
          <el-table-column show-overflow-tooltip prop="unReadCount" label="未读消息"></el-table-column>
          <el-table-column show-overflow-tooltip prop="typeName" label="类型"></el-table-column>

          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="setUnreadMsgFn( scope.row,scope.$index)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--table 表单结束-->
      </el-card>
    </div>
  </div>
</template>
<script>
import headerTop from '@/components/headTop.vue';
import { mapGetters,mapMutations } from "vuex";
import {ERR_OK,clearUnReadMes} from '@/api/api';
import {getStore,EncodeUserId} from "@/config/mUtils.js";

export default {
  data() {
    return {}
  },
  components:{
    headerTop,
  },
  computed:{
    ...mapGetters(['getInstitutionArr','getUnReadList'])
  },

  methods:{
    ...mapMutations(['setUnReadListZero']),

    //数据清零方法
    setUnreadMsgFn(item,index){
      let params={
        userId:EncodeUserId(JSON.parse(getStore("userMesage")).userId),
        newsTypes:item.newsType
      };

      clearUnReadMes(params).then(res => {
        if(res.code===ERR_OK){
          this.setUnReadListZero(index);//清零

          if(item.newsType ==='1'){
            //订单
            this.$router.push("orderList")
          }else if(item.newsType === '2'){
            //退款
            this.$router.push("refundsList")
          }else if(item.newsType === '3'){
            //医生认证
            this.$router.push("indentList")
          }else if(item.newsType === '4'){
            //提现
            this.$router.push("withdrawList")
          }
        }else {
          this.$alert(err.msg, '提示', {
            confirmButtonText: '确定',
          })
        }
      }).catch(()=>{
        this.$message.error('网络错误!请稍后重试');
      });
    },
  },
}
</script>
<style lang="less" scoped>
  .info-title{text-align: center;line-height: 24px;font-size: 18px;color:#303133;font-weight:normal;margin-bottom: 15px}
  .info-content{color:#606266;font-size: 14px;line-height: 22px;margin-bottom: 20px}
</style>
