<template>
  <div class="server-setting">
    <el-row :gutter="20">
      <el-col :xs="12" :sm="10" :md="9" :lg="7"  v-for="(item,index) in serviceLists" :key="index">
        <div class="service-item">
          <div class="service-head">
            <span class="name">{{item.serviceName}}</span>
            <span class="price">￥{{item.servicePrice}}</span>
          </div>
          <el-row :gutter="20" class="time-row">
            <el-col :span="12">
              <p class="time-text">工作时间</p>
              <p class="time-text">AM {{item.workdayAmFromTime | sliceStr}}-{{item.workdayAmToTime | sliceStr}}</p>
              <p class="time-text">PM {{item.workdayPmFromTime | sliceStr}}-{{item.workdayPmToTime | sliceStr}}</p>
            </el-col>

            <el-col :span="12">
              <p class="time-text">非工作时间</p>
              <p class="time-text">AM {{item.workdayAmFromTime | sliceStr}}-{{item.workdayAmToTime | sliceStr}}</p>
              <p class="time-text">PM {{item.offdayPmFromTime | sliceStr}}-{{item.offdayPmToTime | sliceStr}}</p>
            </el-col>
          </el-row>
          <div class="btn-bar">
            <input class="do-detail-btn "type="button" value="查看" @click="showCheckFn(item)" v-if="!item.fill">
            <input class="do-detail-btn "type="button" value="完善信息" @click="showEditorFn(item)" v-else>
          </div>
        </div>
      </el-col>
    </el-row>


    <p v-if="serviceLists.length <=0">暂未开通服务，请联系管理员开通服务</p>

    <!--查看dialog-->
    <el-dialog title="查看" :visible.sync="isShowCheckDialog" width="640px">
      <div class="model-content">
        <ul class="input-content">
          <li class="input-list clear_fix m_b_10">
            <span class="note">服务价格：</span>
            <div class="note-left single-row">
              <input type="number" class="input-time" v-model="checkInfoData.servicePrice" disabled>
              <span style="vertical-align: top;line-height: 34px;padding-right: 10px;">元</span>
              <div class="query-part">
                <span class="query-icon icon-wenhao iconfont"></span>
                <div class="query-panel">
                  <ul class="service-del-content">
                    <li class="del-list clear_fix">
                      <span class="list-note">服务名称&nbsp;:</span>
                      <div class="list-content">
                        <p class="list-text">{{queryInfo.serviceName}}</p>
                      </div>
                    </li>
                    <li class="del-list clear_fix">
                      <span class="list-note">建议价格&nbsp;:</span>
                      <div class="list-content">
                        <p class="list-text">{{queryInfo.servicePrice}}{{queryInfo.serviceUnitName}}</p>
                      </div>
                    </li>
                    <li class="del-list clear_fix">
                      <span class="list-note">服务角色&nbsp;:</span>
                      <div class="list-content">
                        <p class="list-text">{{queryInfo.userRoleName}}</p>
                      </div>
                    </li>
                    <li class="del-list clear_fix">
                      <span class="list-note">服务ICON&nbsp;:</span>
                      <div class="list-content">
                        <p class="list-text">&nbsp;
                          <img v-if="queryInfo.serviceIconUrl" :src="queryInfo.serviceIconUrl" width="29" height="24">
                          <img v-if="!queryInfo.serviceIconUrl" src="${request.contextPath}/statics/img/service-icon.png" width="29" height="24">
                        </p>
                      </div>
                    </li>
                    <li class="del-list clear_fix">
                      <span class="list-note">服务介绍&nbsp;:</span>
                      <div class="list-content">
                        <div class="service-info" v-html="queryInfo.serviceIntroduce"></div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </li>
          <li class="input-list clear_fix">
            <span class="note">服务时间：</span>
            <div class="note-left">
              <div class="list m_b_10">
                <span class="text-span">工作日上午</span>
                <input class="input-time" disabled type="text" v-model="checkInfoData.workdayAmFromTime">
                <span class="text-span">-</span>
                <input class="input-time" type="text" v-model="checkInfoData.workdayAmToTime" disabled>
                <span class="text-span">工作日下午</span>
                <input class="input-time" type="text" v-model="checkInfoData.workdayPmFromTime" disabled>
                <span class="text-span">-</span>
                <input class="input-time" type="text" v-model="checkInfoData.workdayPmToTime" disabled>
              </div>
              <div class="list m_b_10">
                <span class="text-span">非工作日上午</span>
                <input class="input-time" type="text" v-model="checkInfoData.offdayAmFromTime" disabled>
                <span class="text-span">-</span>
                <input class="input-time" type="text" v-model="checkInfoData.offdayAmToTime" disabled>
                <span class="text-span">非工作日下午</span>
                <input class="input-time" type="text" v-model="checkInfoData.offdayPmFromTime" disabled>
                <span class="text-span">-</span>
                <input class="input-time" type="text" v-model="checkInfoData.offdayPmToTime" disabled>
              </div>
            </div>
          </li>
        </ul>
        <p class="notice-text">建议：工作日10：00 -18:00，非工作日10:00-24:00.必须完成所有设置项目才能在app使用</p>
        <div class="content-foot">
          <el-button type="primary" @click="closeCheckDialog" size="small">关闭</el-button>
        </div>
      </div>
    </el-dialog>

    <!--编辑的dialog-->
    <el-dialog title="完善信息" :visible.sync="isShowEditorDialog" width="640px">
      <div class="model-content">
        <ul class="input-content">
          <li class="input-list clear_fix">
            <strong class="note">服务价格：</strong>
            <div class="note-left">
              <div class="el-input-box">
                <el-input v-model="infoParams.itemPrice" placeholder="请输入内容"></el-input>
              </div>
              <span class="money-unit">元</span>
              <div class="query-part">
                <span class="query-icon icon-wenhao iconfont"></span>
                <div class="query-panel">
                  <ul class="service-del-content">
                    <li class="del-list clear_fix">
                      <span class="list-note">服务名称&nbsp;:</span>
                      <div class="list-content">
                        <p class="list-text">{{queryInfo.serviceName}}</p>
                      </div>
                    </li>
                    <li class="del-list clear_fix">
                      <span class="list-note">建议价格&nbsp;:</span>
                      <div class="list-content">
                        <p class="list-text">{{queryInfo.servicePrice}}{{queryInfo.serviceUnitName}}</p>
                      </div>
                    </li>
                    <li class="del-list clear_fix">
                      <span class="list-note">服务角色&nbsp;:</span>
                      <div class="list-content">
                        <p class="list-text">{{queryInfo.userRoleName}}</p>
                      </div>
                    </li>
                    <li class="del-list clear_fix">
                      <span class="list-note">服务ICON&nbsp;:</span>
                      <div class="list-content">
                        <p class="list-text">&nbsp;
                          <img v-if="queryInfo.serviceIconUrl" :src="queryInfo.serviceIconUrl" width="29" height="24">
                          <img v-if="!queryInfo.serviceIconUrl" src="${request.contextPath}/statics/img/service-icon.png" width="29" height="24">
                        </p>
                      </div>
                    </li>
                    <li class="del-list clear_fix">
                      <span class="list-note">服务介绍&nbsp;:</span>
                      <div class="list-content">
                        <div class="service-info" v-html="queryInfo.serviceIntroduce"></div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </li>
          <li class="input-list clear_fix">
            <strong class="note">服务时间：</strong>
            <div class="note-left">

              <!--时间-->
              <div class="time-list clear_fix">
                <span class="time-title-note">工作日上午</span>
                <div class="time-select-box">
                  <el-time-select placeholder="开始时间" v-model="infoParams.workdayAmFromTime" :picker-options="{start: '06:00',step: '00:15',end: '12:00'}"></el-time-select>
                </div>
                <span class="to-text">至</span>
                <div class="time-select-box">
                  <el-time-select placeholder="结束时间" v-model="infoParams.workdayAmToTime" :picker-options="{start: '06:00',step: '00:15',end: '12:00'}"></el-time-select>
                </div>
              </div>

              <!--时间-->
              <div class="time-list clear_fix">
                <span class="time-title-note">工作日下午</span>
                <div class="time-select-box">
                  <el-time-select placeholder="开始时间" v-model="infoParams.workdayPmFromTime" :picker-options="{start: '12:00',step: '00:15',end: '24:00'}"></el-time-select>
                </div>
                <span class="to-text">至</span>
                <div class="time-select-box">
                  <el-time-select placeholder="结束时间" v-model="infoParams.workdayPmToTime" :picker-options="{start: '12:00',step: '00:15',end: '24:00'}"></el-time-select>
                </div>
              </div>

              <!--时间-->
              <div class="time-list clear_fix">
                <span class="time-title-note">非工作日上午</span>
                <div class="time-select-box">
                  <el-time-select placeholder="开始时间" v-model="infoParams.offdayAmFromTime" :picker-options="{start: '06:00',step: '00:15',end: '12:00'}"></el-time-select>
                </div>
                <span class="to-text">至</span>
                <div class="time-select-box">
                  <el-time-select placeholder="结束时间" v-model="infoParams.offdayAmToTime" :picker-options="{start: '06:00',step: '00:15',end: '12:00'}"></el-time-select>
                </div>
              </div>

              <!--时间-->
              <div class="time-list clear_fix">
                <span class="time-title-note">非工作日下午</span>
                <div class="time-select-box">
                  <el-time-select placeholder="开始时间" v-model="infoParams.offdayPmFromTime" :picker-options="{start: '12:00',step: '00:15',end: '24:00'}"></el-time-select>
                </div>
                <span class="to-text">至</span>
                <div class="time-select-box">
                  <el-time-select placeholder="结束时间" v-model="infoParams.offdayPmToTime" :picker-options="{start: '12:00',step: '00:15',end: '24:00'}"></el-time-select>
                </div>
              </div>


            </div>
          </li>
        </ul>
        <p class="notice-text">建议：工作日10：00 -18:00，非工作日10:00-24:00.必须完成所有设置项目才能在app使用</p>
        <div class="content-foot">
          <el-button type="primary" @click="editorOkFn" size="small">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {ERR_OK,getDoctorServices,doctorEditorService} from '@/api/api';
  import {getStore} from "@/config/mUtils.js";
  export default {
    data() {
      return {
        queryInfo:{},//
        isShowCheckDialog:false,
        isShowEditorDialog:false,
        //服务列表数据
        serviceLists:[],
        //完善信息的数据
        infoParams:{
          serviceDoctorSettingId:"",
          insServiceSettingId:"",
          itemPrice:"",
          workdayAmFromTime:"09:00",
          workdayAmToTime:"12:00",
          workdayPmFromTime:"14:00",
          workdayPmToTime:"20:00",
          offdayAmFromTime:"09:00",
          offdayAmToTime:"12:00",
          offdayPmFromTime:"14:00",
          offdayPmToTime:"20:00",
          userId:JSON.parse(getStore("userMesage")).userId
        },

        //查看信息的数据
        checkInfoData:{
          itemPrice:"",
          workdayAmFromTime:"",
          workdayAmToTime:"",
          workdayPmFromTime:"",
          workdayPmToTime:"",
          offdayAmFromTime:"",
          offdayAmToTime:"",
          offdayPmFromTime:"",
          offdayPmToTime:""
        }
      }
    },

    methods: {
      getServiceFn(){
        var params={
          userId:JSON.parse(getStore("userMesage")).userId
        };
        getDoctorServices(params).then(res => {
          if(res.code===ERR_OK){
            this.serviceLists=res.data || [];
          }else{
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        }).catch(err => {
          this.$alert(err.msg, '提示', {
            confirmButtonText: '确定',
          })
        });
      },

      showCheckFn(item){
        this.isShowCheckDialog=true;
        this.queryInfo=item;
        this.queryInfo.serviceIntroduce=decodeURIComponent(this.queryInfo.serviceIntroduce);
        this.checkInfoData.servicePrice=item.servicePrice;
        this.checkInfoData.workdayAmFromTime=item.workdayAmFromTime.slice(0,5);
        this.checkInfoData.workdayAmToTime=item.workdayAmToTime.slice(0,5);
        this.checkInfoData.workdayPmFromTime=item.workdayPmFromTime.slice(0,5);
        this.checkInfoData.workdayPmToTime=item.workdayPmToTime.slice(0,5);
        this.checkInfoData.offdayAmFromTime=item.offdayAmFromTime.slice(0,5);
        this.checkInfoData.offdayAmToTime=item.offdayAmToTime.slice(0,5);
        this.checkInfoData.offdayPmFromTime=item.offdayPmFromTime.slice(0,5);
        this.checkInfoData.offdayPmToTime=item.offdayPmToTime.slice(0,5);
      },

      showEditorFn(item){
        this.isShowEditorDialog=true;
        this.queryInfo=item;
        this.queryInfo.serviceIntroduce=decodeURIComponent(this.queryInfo.serviceIntroduce);
        this.infoParams.insServiceSettingId=item.insServiceSettingId;
      },

      //关闭dialog
      closeCheckDialog(){
        this.isShowCheckDialog=false;
      },

      //点击editorDialog 确定
      editorOkFn(){
        let params=this.infoParams;
        if(this.infoParams.itemPrice ===''){
          this.$message.error('服务价格不能为空');
          return;
        }
        if(this.infoParams.workdayAmFromTime ===null || this.infoParams.workdayAmToTime === null || this.infoParams.workdayPmFromTime === null || this.infoParams.workdayPmToTime === null){
          this.$message.error('工作时间不能为空');
          return;
        }
        if(this.infoParams.offdayAmFromTime ===null || this.infoParams.offdayAmToTime === null || this.infoParams.offdayPmFromTime === null || this.infoParams.offdayPmToTime === null){
          this.$message.error('非工作时间不能为空');
          return;
        }
        doctorEditorService(params).then(res => {
          if(res.code===ERR_OK){
            this.isShowEditorDialog=false;
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.getServiceFn();
              }
            })
          }else{
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        }).catch(err => {
          this.$alert(err.msg, '提示', {
            confirmButtonText: '确定',
          })
        });
      }
    },

    activated(){
      this.getServiceFn()
    },

    filters: {
      sliceStr: function (value) {
        if (!value) return '';
        value = value.toString();
        return value.slice(0,5)
      }
    }

  }
</script>
<style lang="less">
  .service-info img{width: 100px;height: 100px;}
</style>

<style scoped lang="less">
  .clear_fix:after{content:'';display: block;clear: both}
  .service-item{border-radius: 6px;background: linear-gradient(to right, #4fb136,#9ce788);padding: 15px;}
  .service-head{height: 30px;font-size: 16px;padding: 10px 0;}
  .name{font-size: 18px;color:#fff;line-height: 30px;float: left}
  .price{float: right;line-height: 30px;font-size: 16px;color:#444}
  .time-text{line-height: 22px;font-size: 14px;color: #fff;}
  .btn-bar{text-align: center;padding: 10px 0}
  .do-detail-btn{display: inline-block;background-color: #287517;color: #fff;line-height: 28px;
    border-radius: 14px;padding: 0 15px;border: none;cursor: pointer}
  .time-row{margin-bottom: 15px;}
  .model-content{padding: 0 10px;}
  .input-list{margin-bottom: 15px;}
  .input-list .note {float: left;line-height: 40px;font-size: 15px;width: 85px;}
  .input-list .note-left {float: left;width: 490px;vertical-align: top;}
  .input-time {width: 60px;height: 34px;padding: 5px;border: 1px solid #ccc;
    border-radius: 2px;margin-right: 10px;box-sizing: border-box;vertical-align: top;}
  .query-part {display: inline-block;width: 40px;height: 40px;position: relative;}
  .query-panel {position: absolute;left: -60px;top: 40px;width: 440px;z-index: 101;visibility:hidden;
    opacity:0;transition: all 0.3s;background-color: #fff;border: 1px solid #ccc;padding: 25px 15px;border-radius: 10px;
    -webkit-box-shadow: 0 0 15px #999;-moz-box-shadow: 0 0 15px #999;box-shadow: 0 0 15px #999;}
  .text-span {vertical-align: top;line-height: 34px;padding-right: 5px;font-size: 12px;}
  .notice-text {font-size: 12px;line-height: 24px;color: #999;text-align: center;
    border-bottom: 1px solid #e8e8e8;padding-bottom: 15px;margin-bottom: 20px;}
  .query-icon {font-size: 24px;color: #eba706;padding: 7px 0 0 3px;display: inline-block;vertical-align: top;}
  .query-part:hover .query-panel{opacity: 1;visibility: visible}
  .del-list {margin-bottom: 20px;}
  .del-list .list-note {float: left;width: 105px;line-height: 24px;font-size: 16px;color: #999;padding-right: 15px;text-align: right;}
  .del-list .list-text {line-height: 24px;font-size: 16px;}
  .service-info {word-break: break-all;background: #e8e8e8;padding: 10px;-webkit-border-radius: 6px;
    -moz-border-radius: 6px;border-radius: 6px;font-size: 14px;line-height: 24px;}
  .del-list .list-content {float: left;width: 300px;}
  .content-foot{text-align: center}
  .time-select-box{float: left;width:140px;margin-right: 20px;}
  .time-select-box .el-date-editor.el-input{width: 100%}
  .money-unit{display: inline-block;vertical-align: top;line-height: 40px;}
  .to-text{float: left;vertical-align: top;line-height: 40px;margin-right: 20px;}
  .time-title-note{float: left;vertical-align: top;line-height: 40px;margin-right: 20px;width: 90px;text-align: right}
  .el-input-box{float: left;width: 200px;margin-right: 20px;}
  .time-list{margin-bottom: 15px;}
</style>

