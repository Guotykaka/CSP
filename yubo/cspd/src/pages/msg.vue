<template>
  <div class="msg">
    <el-card class="box-card">
      <!--tab-->
      <el-tabs>
        <el-tab-pane label="我的消息列表" name="0"></el-tab-pane>
      </el-tabs>

      <!--table 表单开始-->
      <el-table
        :data="msgListCount"
        border
        style="width: 100%">
        <el-table-column show-overflow-tooltip prop="" label="序号"  width="60" type="index"></el-table-column>
        <el-table-column show-overflow-tooltip prop="newsTitle" label="标题"></el-table-column>
        <el-table-column show-overflow-tooltip prop="unReadCount" label="未读消息"></el-table-column>
        <el-table-column show-overflow-tooltip prop="typeName" label="类型"></el-table-column>

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
  import { mapGetters, mapState} from "vuex";
  import {updateBatch, ERR_OK } from '@/api/api'
  import {getStore,EncodeDoctorId} from "@/config/mUtils";

  export default {
    data() {
      return {
        params:{
          newsTypes: "",
          userId: ""
        },
        userInfo:{

        }
      }
    },
    created(){
      this.userInfo = JSON.parse(getStore('userMesage'));
      this.userInfo.userId = EncodeDoctorId(this.userInfo.userId);
      this.params.userId = this.userInfo.userId;
    },
    activated(){
      this.getMsgList();
    },
    computed:{
      ...mapGetters(['getInstitutionArr']),
      ...mapState({
        msgListCount:state =>state.msgList
      })
    },

    methods:{
      //查看详情
      _checkDetail(item){
        if(item.newsType ==='5'){
          //电话报告解读
          this.params.newsTypes=item.newsType;
          this.updateStatus();
        }else if(item.newsType === '6'){
          //图文咨询
          this.params.newsTypes=item.newsType;
          this.updateStatus();
        }else if(item.newsType === '7'){
          //账单消息
          this.params.newsTypes=item.newsType;
          this.updateStatus();
        }
      },
      //路由跳转
      routerTo(){
        if(this.params.newsTypes ==='5'){
          //电话报告解读
          this.$router.push("/tel_consult")
        }else if(this.params.newsTypes === '6'){
          //图文咨询
          this.$router.push("/imgText_consult")
        }else if(this.params.newsTypes === '7'){
          //账单消息
          this.$router.push("/personal")
        }
      },
      /*获取消息列表*/
      getMsgList(){
        let parNes={
          userId: this.userInfo.userId
        };
        this.$store.dispatch('msgList',parNes)
      },
      //更新消息状态
      updateStatus(){
        updateBatch(this.params).then((res)=>{
          if(res.code===ERR_OK){
            this.routerTo();
          }else{
            this.$alert('更新失败','提示')
          }
        })
      }
    },
  }
</script>
<style lang="less" scoped>
  .info-title{text-align: center;line-height: 24px;font-size: 18px;color:#303133;font-weight:normal;margin-bottom: 15px}
  .info-content{color:#606266;font-size: 14px;line-height: 22px;margin-bottom: 20px}
</style>
