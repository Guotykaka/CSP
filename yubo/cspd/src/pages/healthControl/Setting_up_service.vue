<template>
  <div class="data-board">
    <el-tabs v-model="activeName" @tab-click="handleClick" :before-leave="click_false">
      <!-- <el-tab-pane label="电话咨询" name="first">
        电话咨询
      </el-tab-pane>
      <el-tab-pane  label="图文咨询" name="second">
        图文咨询
      </el-tab-pane> -->
      <el-tab-pane label="复检建议" name="third">
        <el-row type="flex" justify="center">
            <el-card id="dataDialog" :body-style="{ padding: '0px',width:'500px' }" style="margin-bottom:14px;">
              <div style="padding: 14px;">
                <el-row type="flex" justify="center">
                <h3 class="m_b_15">复检建议</h3>
                </el-row>
                <el-row type="flex" justify="center">
                <el-col class="m_b_15" :span="24">
                <span style="margin-right:15px;">服务医生</span>
                <el-select v-model="addParams.docId" placeholder="请选择">
                    <el-option v-for="item in DocList" :key="item.docId" :label="item.docName" :value="item.docId">
                    </el-option>
                </el-select>
                </el-col>
                </el-row>
                <div class="m_b_15"><el-button type="primary" @click="EditDoctor">修改</el-button></div>
              </div>
            </el-card>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {ERR_OK,getDoctorOPList,getServiceDoctor,setServiceDoctor} from '@/api/api';
import {getStore,EncodeDoctorId} from "@/config/mUtils.js";
  export default {
    name: "Setting_up_service",
    data() {
      return {
        tabIndex:'third',
        activeName: 'third',
        userInfo:{},
        addParams:{
          docId: "",
          institutionCode: ""
        },
        DocList:[],//服务医生下拉列表数据
      }
    },
    methods:{
      click_false(){//禁止tab点击切换
        return false;
      },
      getList(){
        if (this.activeName==="first") {
          return false;
        } else if (this.activeName==="second"){
          return false;
        } else if (this.activeName==="third"){
          this.getServiceDoctorFUC();
        }
      },
      getDoctorOPLISTFUC(){//服务医生下拉列表数据
        let params={
          // institutionCode: 'bjbr001',
          institutionCode: this.userInfo.institutionCode,
        };
        getDoctorOPList(params).then(res => {
          if(res.code===ERR_OK){
            this.DocList = [];
            this.DocList=res.data;
          }else{
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        }).catch(err => {
          this.$message.error('数据错误!');
        });
      },
      getServiceDoctorFUC(){//获取服务医生
        let params={
          // institutionCode: 'bjbr001',
          institutionCode: this.userInfo.institutionCode,
        };
        getServiceDoctor(params).then(res => {
          if(res.code===ERR_OK){
            this.addParams.docId=res.data;
          }else{
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        }).catch(err => {
          this.$message.error('数据错误!');
        });
      },
      EditDoctor(){//修改服务医生
        let params={
          docId:  this.addParams.docId,
          // institutionCode: 'bjbr001',
          institutionCode: this.userInfo.institutionCode,
        };
        setServiceDoctor(params).then(res => {
          if(res.code===ERR_OK){
            this.$notify({
            title: '修改成功！',
            duration:1000,
            type: 'success'
          });
          }else{
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        }).catch(err => {
          this.$message.error('数据错误!');
        });
      },
      handleClick(tab, event) {
        this.getList();
      }
    },
    activated(){
      this.userInfo = JSON.parse(getStore('userMesage'));
      this.getList();
      this.getDoctorOPLISTFUC();
    },

  }
</script>

<style scoped lang="less">

#dataDialog{
 width: 500px;
}
.m_b_15{
  margin-bottom: 35px;display: flex;    justify-content: center;    align-items: center;
}
</style>
