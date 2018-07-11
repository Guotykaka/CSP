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
<!--
                  <img src="${request.contextPath}/statics/img/sanjiao.png" class="sanjiaoImg"/>
-->
                  <ul class="service-del-content">
                    <li class="del-list clearfix">
                      <span class="list-note">服务名称&nbsp;:</span>
                      <div class="list-content">
                        <p class="list-text">{{queryInfo.serviceName}}</p>
                      </div>
                    </li>
                    <li class="del-list clearfix">
                      <span class="list-note">建议价格&nbsp;:</span>
                      <div class="list-content">
                        <p class="list-text">{{queryInfo.servicePrice}}{{queryInfo.serviceUnitName}}</p>
                      </div>
                    </li>
                    <li class="del-list clearfix">
                      <span class="list-note">服务角色&nbsp;:</span>
                      <div class="list-content">
                        <p class="list-text">{{queryInfo.userRoleName}}</p>
                      </div>
                    </li>
                    <li class="del-list clearfix">
                      <span class="list-note">服务ICON&nbsp;:</span>
                      <div class="list-content">
                        <p class="list-text">&nbsp;
                          <img v-if="queryInfo.serviceIconUrl" :src="queryInfo.serviceIconUrl" width="29" height="24">
                          <img v-if="!queryInfo.serviceIconUrl" src="${request.contextPath}/statics/img/service-icon.png" width="29" height="24">
                        </p>
                      </div>
                    </li>
                    <li class="del-list clearfix">
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
          <li class="input-list clearfix">
            <span class="note">服务时间：</span>
            <div class="note-left">
              <div class="list">
                <span class="text-span">工作日上午</span>
                <input class="input-time" disabled type="text" v-model="checkInfoData.workdayAmFromTime">
                <span class="text-span">-</span>
                <input class="input-time" type="text" v-model="checkInfoData.workdayAmToTime" disabled>
                <span class="text-span">工作日下午</span>
                <input class="input-time" type="text" v-model="checkInfoData.workdayPmFromTime" disabled>
                <span class="text-span">-</span>
                <input class="input-time" type="text" v-model="checkInfoData.workdayPmToTime" disabled>
              </div>
              <div class="list m-b10">
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
<!--
        <div class="content-foot">
          <input type="button" class="btn btn-success" value="关闭" @click="_closeCheckINfo">
        </div>
-->
      </div>


    </el-dialog>






  </div>
</template>

<script>
  import headerTop from "@/components/headTop.vue"

  export default {
    data() {
      return {



        queryInfo:{},


        isShowCheckDialog:false,
        isShowEditorDialog:false,





        //服务列表数据
        serviceLists:[
          {"insServiceSettingId":"2c8080aa63de70c60163de7106fb0002","serviceId":"8ab2b2f56381c35a016381c35a400000","serviceName":"电话报告解读","servicePrice":"0.01","serviceMinPrice":50.00,"serviceMaxPrice":100.00,"serviceUnit":"UNIT_SECOND","workdayAmFromTime":"09:00:00","workdayAmToTime":"12:00:00","workdayPmFromTime":"14:00:00","workdayPmToTime":"20:00:00","offdayAmFromTime":"09:00:00","offdayAmToTime":"12:00:00","offdayPmFromTime":"14:00:00","offdayPmToTime":"20:00:00","serviceDoctorSettingId":"2c8080aa63de70c60163de748d330006","createTime":"2018-06-08 16:12:50","serviceIconUrl":"http://zhangshangtijian.b0.upaiyun.com/CSPO/DEV/z5o5rqJqcKhbMXBNDTgG89AvrZG5eIK1.png","serviceIntroduce":"%E6%B5%8B%E8%AF%95%3Cimg%20src%3D%22http%3A%2F%2Fzhangshangtijian.b0.upaiyun.com%2FCSPO%2FDEV%2FLAyV5zcwMFMDwZ7Fo8KQbXDrJCe9RSps.png%22%20alt%3D%22file%22%3E%E6%B5%8B%E8%AF%95%3Cimg%20src%3D%22http%3A%2F%2Fzhangshangtijian.b0.upaiyun.com%2FCSPO%2FDEV%2FLAyV5zcwMFMDwZ7Fo8KQbXDrJCe9RSps.png%22%20alt%3D%22file%22%3E","userRoleName":"医生角色","serviceUnitName":"元/次","fill":false},
          {"insServiceSettingId":"2c8080aa63de70c60163de7107080003","serviceId":"8ab2b2f563822d260163822d26fd0000","serviceName":"图文咨询","servicePrice":"0.01","serviceMinPrice":1.00,"serviceMaxPrice":99.00,"serviceUnit":"UNIT_SECOND","workdayAmFromTime":"09:00:00","workdayAmToTime":"12:00:00","workdayPmFromTime":"14:00:00","workdayPmToTime":"20:00:00","offdayAmFromTime":"09:00:00","offdayAmToTime":"12:00:00","offdayPmFromTime":"14:00:00","offdayPmToTime":"20:00:00","serviceDoctorSettingId":"2c8080aa63de70c60163de74ae720007","createTime":"2018-06-08 16:12:58","serviceIconUrl":"http://zhangshangtijian.b0.upaiyun.com/CSPO/DEV/O8PUbufKOX6vkmKZhHhNZ3nOQ4sWGrvK.png","serviceIntroduce":"%3Cp%3E%3Cimg%20src%3D%22http%3A%2F%2Fzhangshangtijian.b0.upaiyun.com%2FCSPO%2FDEV%2FN2kgWlbMB1j1paBVu1n1DCGD6ymKc3FO.png%22%20alt%3D%22file%22%3E%3Cbr%3E%3C%2Fp%3E%3Cp%3E%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E5%A4%A7%E5%A4%A7%E5%A4%A7%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%3C%2Fp%3E","userRoleName":"医生角色","serviceUnitName":"元/次","fill":true}
        ],


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
          offdayPmToTime:"20:00"
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
    created() {
    },
    methods: {


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

      showEditorFn(){}


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

<style scoped lang="less">

  .clear_fix{content:'';display: block;clear: both}


  .service-item{border-radius: 6px;background: linear-gradient(to right, #4fb136,#9ce788);padding: 15px;}
  .service-head{height: 30px;font-size: 16px;padding: 10px 0;}
  .name{font-size: 18px;color:#fff;line-height: 30px;float: left}
  .price{float: right;line-height: 30px;font-size: 16px;color:#444}
  .time-text{line-height: 22px;font-size: 14px;color: #fff;}
  .btn-bar{text-align: center;padding: 10px 0}
  .do-detail-btn{display: inline-block;background-color: #287517;color: #fff;line-height: 28px;
    border-radius: 14px;padding: 0 15px;border: none;cursor: pointer}
  .time-row{margin-bottom: 15px;}




  .input-list{height: 34px;margin-bottom: 10px;}
  .input-list .note {float: left;line-height: 34px;font-size: 14px;width: 85px;}


  .input-list .note-left.single-row {
    /*height: 34px;*/
  }
  .input-list .note-left {
    float: left;
    width: 490px;
    vertical-align: top;
  }

  .input-time {
    width: 60px;
    height: 34px;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 2px;
    margin-right: 10px;
    box-sizing: border-box;
    vertical-align: top;
  }
  .query-part {
    display: inline-block;
    width: 34px;
    height: 34px;
    position: relative;
  }


</style>

