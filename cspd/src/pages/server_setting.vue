<template>
  <div class="server-setting">
    <!--<header-top></header-top>-->
    <div class="page-wrapper" v-cloak>
      <div class="service-setting-content" v-if="serviceLists">
        <!--单个服务-->
        <div class="service-item" v-for="(item,index) in serviceLists" :key="index">
          <div class="price-bar">
            <span class="service-name">{{item.serviceName}}</span>
            <span class="service-price">￥{{item.servicePrice}}</span>
          </div>
          <ul class="service-time">
            <li class="time-item">
              <h5 class="time-title">工作时间</h5>
              <p class="time-text">AM &nbsp;{{item.workdayAmFromTime | sliceStr}}-{{item.workdayAmToTime |
                sliceStr}}</p>
              <p class="time-text">PM &nbsp;{{item.workdayPmFromTime | sliceStr}}-{{item.workdayPmToTime |
                sliceStr}}</p>
            </li>
            <li class="time-item">
              <h5 class="time-title">非工作时间</h5>
              <p class="time-text">AM &nbsp;{{item.offdayAmFromTime | sliceStr}}-{{item.offdayAmToTime |
                sliceStr}}</p>
              <p class="time-text">PM &nbsp;{{item.offdayPmFromTime | sliceStr}}-{{item.offdayPmToTime |
                sliceStr}}</p>
            </li>
          </ul>
          <div class="btn-bar">
            <input class="do-detail-btn " type="button" value="查看" @click="_checkInfoFn(item)" v-if="!item.fill">
            <input class="do-detail-btn " type="button" value="完善信息" @click="_clickDetail(item)" v-else>
          </div>
        </div>
        <div class="service-item" v-for="(item,index) in serviceLists" :key="index">
          <div class="price-bar">
            <span class="service-name">{{item.serviceName}}</span>
            <span class="service-price">￥{{item.servicePrice}}</span>
          </div>
          <ul class="service-time">
            <li class="time-item">
              <h5 class="time-title">工作时间</h5>
              <p class="time-text">AM &nbsp;{{item.workdayAmFromTime | sliceStr}}-{{item.workdayAmToTime |
                sliceStr}}</p>
              <p class="time-text">PM &nbsp;{{item.workdayPmFromTime | sliceStr}}-{{item.workdayPmToTime |
                sliceStr}}</p>
            </li>
            <li class="time-item">
              <h5 class="time-title">非工作时间</h5>
              <p class="time-text">AM &nbsp;{{item.offdayAmFromTime | sliceStr}}-{{item.offdayAmToTime |
                sliceStr}}</p>
              <p class="time-text">PM &nbsp;{{item.offdayPmFromTime | sliceStr}}-{{item.offdayPmToTime |
                sliceStr}}</p>
            </li>
          </ul>
          <div class="btn-bar">
            <input class="do-detail-btn " type="button" value="查看" @click="_checkInfoFn(item)" v-if="!item.fill">
            <input class="do-detail-btn " type="button" value="完善信息" @click="_clickDetail(item)" v-else>
          </div>
        </div>
      </div>
      <p class="withOut-service" v-else>暂未设置服务</p>
      <!--完善信息的弹窗-->
      <!--      <transition name="fade">
              <div class="mask" v-show="detail.show">
                <div class="detailModel">
                  <div class="model-title">
                    <strong>完善信息</strong>
                    <span class="close-btn fa fa-times" @click="_closeModel"></span>
                  </div>
                  <div class="model-content">
                    <ul class="input-content">
                      <li class="input-list clearfix m-b10">
                        <span class="note">服务价格：</span>
                        <div class="note-left single-row">
                          <input type="number" class="input-time" v-model="infoParams.itemPrice">
                          <span style="vertical-align: top;line-height: 34px;padding-right: 10px;">元</span>
                          <div class="query-part">
                            <span class="query-icon icon-wenhao iconfont"></span>
                            <div class="query-panel">
                              <img src="${request.contextPath}/statics/img/sanjiao.png" class="sanjiaoImg"/>
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
                                      <img v-if="queryInfo.serviceIconUrl" :src="queryInfo.serviceIconUrl" width="29"
                                           height="24">
                                      <img v-if="!queryInfo.serviceIconUrl"
                                           src="${request.contextPath}/statics/img/service-icon.png" width="29" height="24">
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
                          <div class="list m-b10">
                            <span class="text-span">工作日上午</span>
                            <input class="input-time" type="text" id="work-am-start">
                            <span class="text-span">-</span>
                            <input class="input-time" type="text" id="work-am-end">
                            <span class="text-span">工作日下午</span>
                            <input class="input-time" type="text" id="work-pm-start">
                            <span class="text-span">-</span>
                            <input class="input-time" type="text" id="work-pm-end">
                          </div>
                          <div class="list m-b10">
                            <span class="text-span">非工作日上午</span>
                            <input class="input-time" type="text" id="rest-am-start">
                            <span class="text-span">-</span>
                            <input class="input-time" type="text" id="rest-am-end">
                            <span class="text-span">非工作日下午</span>
                            <input class="input-time" type="text" id="rest-pm-start">
                            <span class="text-span">-</span>
                            <input class="input-time" type="text" id="rest-pm-end">
                          </div>
                        </div>
                      </li>
                    </ul>
                    <p class="notice-text">建议：工作日10：00 -18:00，非工作日10:00-24:00.必须完成所有设置项目才能在app使用</p>
                    <div class="content-foot">
                      <input type="button" class="btn btn-success" value="确定" @click="_postInfo"><span
                      style="padding-left: 20px;">确认价格后30天内不可再编辑</span>
                    </div>
                  </div>
                </div>
              </div>
            </transition>-->
      <!--查看信息的弹窗的弹窗-->
      <!--      <transition name="fade">
              <div class="mask" v-show="detail.checkInfoShow">
                <div class="detailModel">
                  <div class="model-title">
                    <strong>查看信息</strong>
                    <span class="close-btn fa fa-times" @click="_closeCheckINfo"></span>
                  </div>
                  <div class="model-content">
                    <ul class="input-content">
                      <li class="input-list clearfix m-b10">
                        <span class="note">服务价格：</span>
                        <div class="note-left single-row">
                          <input type="number" class="input-time" v-model="checkInfoData.servicePrice" disabled>
                          <span style="vertical-align: top;line-height: 34px;padding-right: 10px;">元</span>
                          <div class="query-part">
                            <span class="query-icon icon-wenhao iconfont"></span>
                            <div class="query-panel">
                              <img src="${request.contextPath}/statics/img/sanjiao.png" class="sanjiaoImg"/>
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
                                      <img v-if="queryInfo.serviceIconUrl" :src="queryInfo.serviceIconUrl" width="29"
                                           height="24">
                                      <img v-if="!queryInfo.serviceIconUrl"
                                           src="${request.contextPath}/statics/img/service-icon.png" width="29" height="24">
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
                          <div class="list m-b10">
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
                    <div class="content-foot">
                      <input type="button" class="btn btn-success" value="关闭" @click="_closeCheckINfo">
                    </div>
                  </div>
                </div>
              </div>
            </transition>-->

    </div>
  </div>
</template>

<script>
  import headerTop from "@/components/headTop.vue"

  export default {
    components: {
      headerTop,
    },
    data() {
      return {
        queryInfo: {},
        detail: {
          show: false,
          checkInfoShow: false
        },
        serviceLists: [{
          createTime: "2018-06-08 16:12:50",
          fill: false,
          insServiceSettingId: "2c8080aa63de70c60163de7106fb0002",
          offdayAmFromTime: "09:00:00",
          offdayAmToTime: "12:00:00",
          offdayPmFromTime: "14:00:00",
          offdayPmToTime: "20:00:00",
          serviceDoctorSettingId: "2c8080aa63de70c60163de748d330006",
          serviceIconUrl: "http://zhangshangtijian.b0.upaiyun.com/CSPO/DEV/z5o5rqJqcKhbMXBNDTgG89AvrZG5eIK1.png",
          serviceId: "8ab2b2f56381c35a016381c35a400000",
          serviceIntroduce: "%E6%B5%8B%E8%AF%95%3Cimg%20src%3D%22http%3A%2F%2Fzhangshangtijian.b0.upaiyun.com%2FCSPO%2FDEV%2FLAyV5zcwMFMDwZ7Fo8KQbXDrJCe9RSps.png%22%20alt%3D%22file%22%3E%E6%B5%8B%E8%AF%95%3Cimg%20src%3D%22http%3A%2F%2Fzhangshangtijian.b0.upaiyun.com%2FCSPO%2FDEV%2FLAyV5zcwMFMDwZ7Fo8KQbXDrJCe9RSps.png%22%20alt%3D%22file%22%3E",
          serviceMaxPrice: 100,
          serviceMinPrice: 50,
          serviceName: "电话报告解读",
          servicePrice: "0.10",
          serviceUnit: "UNIT_SECOND",
          serviceUnitName: "元/次",
          userRoleName: "医生角色",
          workdayAmFromTime: "09:00:00",
          workdayAmToTime: "12:00:00",
          workdayPmFromTime: "14:00:00",
          workdayPmToTime: "20:00:00"
        }],
        infoParams: {
          serviceDoctorSettingId: "",
          insServiceSettingId: "",
          itemPrice: "",
          workdayAmFromTime: "09:00",
          workdayAmToTime: "12:00",
          workdayPmFromTime: "14:00",
          workdayPmToTime: "20:00",
          offdayAmFromTime: "09:00",
          offdayAmToTime: "12:00",
          offdayPmFromTime: "14:00",
          offdayPmToTime: "20:00"
        },
        //查看信息的数据
        checkInfoData: {
          itemPrice: "",
          workdayAmFromTime: "",
          workdayAmToTime: "",
          workdayPmFromTime: "",
          workdayPmToTime: "",
          offdayAmFromTime: "",
          offdayAmToTime: "",
          offdayPmFromTime: "",
          offdayPmToTime: ""
        }
      }
    },
    created() {
      /*      layui.use('laydate', function () {
              var laydate = layui.laydate;
              //工作上午开始
              laydate.render({
                elem: '#work-am-start',
                type: 'time',
                format: 'HH:mm',
                value:'09:00',
                min: '06:00:00',
                max: '12:00:00',
                isInitValue: false,
                done: function (value, date, endDate) {
                  vm.infoParams.workdayAmFromTime=value;
                }
              });
              //工作上午结束
              laydate.render({
                elem: '#work-am-end',
                type: 'time',
                format: 'HH:mm',
                value:'12:00',
                min: '06:00:00',
                max: '12:00:00',
                done: function (value, date, endDate) {
                  vm.infoParams.workdayAmToTime=value;
                }
              });

              //工作下午开始
              laydate.render({
                elem: '#work-pm-start',
                type: 'time',
                format: 'HH:mm',
                value:'14:00',
                min: '12:00:00',
                max: '24:00:00',
                done: function (value, date, endDate) {
                  vm.infoParams.workdayPmFromTime=value;
                }
              });

              //工作下午结束
              laydate.render({
                elem: '#work-pm-end',
                type: 'time',
                format: 'HH:mm',
                value:'20:00',
                min: '12:00:00',
                max: '24:00:00',
                done: function (value, date, endDate) {
                  vm.infoParams.workdayPmToTime=value;
                }
              });

              //非工作上午开始
              laydate.render({
                elem: '#rest-am-start',
                type: 'time',
                format: 'HH:mm',
                value:'09:00',
                min: '06:00:00',
                max: '12:00:00',
                isInitValue: false,
                done: function (value, date, endDate) {
                  vm.infoParams.offdayAmFromTime=value;
                }
              });

              //工作上午结束
              laydate.render({
                elem: '#rest-am-end',
                type: 'time',
                format: 'HH:mm',
                value:'12:00',
                min: '06:00:00',
                max: '12:00:00',
                done: function (value, date, endDate) {
                  vm.infoParams.offdayAmToTime=value;
                }
              });

              //工作下午开始
              laydate.render({
                elem: '#rest-pm-start',
                type: 'time',
                format: 'HH:mm',
                value:'14:00',
                min: '12:00:00',
                max: '24:00:00',
                done: function (value, date, endDate) {
                  vm.infoParams.offdayPmFromTime=value;
                }
              });

              //工作下午结束
              laydate.render({
                elem: '#rest-pm-end',
                type: 'time',
                format: 'HH:mm',
                value:'20:00',
                min: '12:00:00',
                max: '24:00:00',
                done: function (value, date, endDate) {
                  vm.infoParams.offdayPmToTime=value;
                }
              });
            });*/
      this._getServiceList();
    },
    methods: {
      //点击完善信息按钮
      _clickDetail: function (item) {
        this.queryInfo = item;
        console.log(item)
        this.queryInfo.serviceIntroduce = decodeURIComponent(this.queryInfo.serviceIntroduce);
        this.detail.show = true;
        this.infoParams.insServiceSettingId = item.insServiceSettingId;
      },
      //点击查看
      _checkInfoFn: function (item) {
        this.queryInfo = item;
        this.queryInfo.serviceIntroduce = decodeURIComponent(this.queryInfo.serviceIntroduce);
        this.detail.checkInfoShow = true;
        this.checkInfoData.servicePrice = item.servicePrice;
        this.checkInfoData.workdayAmFromTime = item.workdayAmFromTime.slice(0, 5);
        this.checkInfoData.workdayAmToTime = item.workdayAmToTime.slice(0, 5);
        this.checkInfoData.workdayPmFromTime = item.workdayPmFromTime.slice(0, 5);
        this.checkInfoData.workdayPmToTime = item.workdayPmToTime.slice(0, 5);
        this.checkInfoData.offdayAmFromTime = item.offdayAmFromTime.slice(0, 5);
        this.checkInfoData.offdayAmToTime = item.offdayAmToTime.slice(0, 5);
        this.checkInfoData.offdayPmFromTime = item.offdayPmFromTime.slice(0, 5);
        this.checkInfoData.offdayPmToTime = item.offdayPmToTime.slice(0, 5);
      },
      _closeCheckINfo: function () {
        this.detail.checkInfoShow = false;
      },
      //点击关闭弹窗
      _closeModel: function () {
        this.detail.show = false;
      },
      //获取服务设置列表
      _getServiceList: function () {
        /*        $.ajax({
                  type: "POST",
                  url:  baseURL + "queryInsServiceDoctorByUserId",
                  data: {},
                  dataType: "json",
                  success: function(res){
                    if(res.code === 1){
                      vm.serviceLists = res.data;
                      //console.log(res.data)
                    }else{
                      alert(res.msg)
                    }
                  }
                });*/
      },

      //点击确定 提交完善信息
      _postInfo: function () {
        if (this.infoParams.itemPrice === '') {
          alert("服务价格不能为空");
          return;
        }
        if (this.infoParams.workdayAmFromTime === '' || this.infoParams.workdayAmToTime === '' || this.infoParams.workdayPmFromTime === '' || this.infoParams.workdayPmToTime === '') {
          alert("工作时间不能为空");
          return;
        }
        if (this.infoParams.offdayAmFromTime === '' || this.infoParams.offdayAmToTime === '' || this.infoParams.offdayPmFromTime === '' || this.infoParams.offdayPmToTime === '') {
          alert("非工作时间不能为空");
          return;
        }

        /*        $.ajax({
                  type: "POST",
                  url:  baseURL+"saveOrUpdateServiceDoctorSetting",
                  data: vm.infoParams,
                  contentType: "application/x-www-form-urlencoded",
                  // dataType: "json",
                  success: function(res){
                    console.log(res)
                    if(res.code === 1){
                      vm.detail.show=false;
                      vm._getServiceList();
                    }else {
                      alert(res.msg)
                    }
                  },
                  error: function() {
                    alert("获取数据失败")
                  }
                });*/

      }

    },
    filters: {
      sliceStr: function (value) {
        if (!value) return '';
        value = value.toString();
        return value.slice(0, 5)
      }
    }
  }
</script>

<style scoped lang="less">
  .server-setting {
    line-height: 32px;
    .service-item {
      float: left;
      width: 270px;
      height: 180px;
      margin: 0 15px 15px 0;
      border-radius: 6px;
      background: linear-gradient(to right, #4fb136, #9ce788);
    }

    .price-bar {
      height: 36px;
      line-height: 30px;
      padding: 20px 20px 16px;
    }

    .service-name {
      float: left;
      font-size: 18px;
      color: #fff;
      width: 100px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden
    }

    .service-price {
      float: right;
      font-size: 16px;
      color: #333;
      font-weight: bold
    }

    .service-time {
      overflow: hidden;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(70, 166, 43, 0.5);
      display: flex;
    }

    .time-item {
      float: left;
      width: 50%;
      padding-left: 20px;
      line-height: 22px;
      font-size: 14px;
      color: #333;
    }

    .time-title {
      line-height: 22px;
      font-size: 14px;
      color: #fff
    }

    .time-text {
      line-height: 22px;
      font-size: 13px;
      color: #fff
    }

    .do-detail-btn {
      display: inline-block;
      background-color: #287517;
      color: #fff;
      line-height: 24px;
      border-radius: 12px;
      padding: 0 10px;
      border: none
    }

    .btn-bar {
      text-align: center;
    }

    .mask {
      position: fixed;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 99;
    }

    .detailModel {
      position: absolute;
      left: 50%;
      top: 100px;
      width: 640px;
      height: 320px;
      background-color: #fff;
      margin-left: -320px;
    }

    .model-title {
      height: 40px;
      padding: 0 15px;
      background-color: #ccc;
      line-height: 40px;
    }

    .model-content {
      padding: 30px 30px 0;
    }

    .input-list {
      .note {
        float: left;
        line-height: 34px;
        font-size: 14px;
        width: 85px;
      }
      .note-left {
        float: left;
        width: 490px;
        vertical-align: top;
      }
      .note-left.single-row {
        height: 34px;
      }
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
      position: relative
    }

    .query-panel {
      position: absolute;
      left: -60px;
      top: 40px;
      width: 440px; /*height:400px;*/
      z-index: 101;
      visibility: hidden;
      opacity: 0;
      transition: all 0.3s;
      background-color: #fff;
      border: 1px solid #ccc;
      padding: 25px 15px;
      border-radius: 10px;
      -webkit-box-shadow: 0 0 15px #999;
      -moz-box-shadow: 0 0 15px #999;
      box-shadow: 0 0 15px #999;
      .sanjiaoImg {
        position: absolute;
        top: -12px;
        left: 60px;
        width: 24px;
        height: 12px;
      }
    }


    .query-part:hover .query-panel {
      visibility: visible;
      opacity: 1;
    }

    .query-icon {
      font-size: 24px;
      color: #eba706;
      padding: 4px 0 0 0;
      display: inline-block;
      vertical-align: top;
    }

    .m-b10 {
      margin-bottom: 10px;
    }

    .text-span {
      vertical-align: top;
      line-height: 34px;
      padding-right: 5px;
      font-size: 12px
    }

    .notice-text {
      font-size: 12px;
      line-height: 24px;
      color: #999;
      text-align: center;
      border-bottom: 1px solid #e8e8e8;
      padding-bottom: 15px;
      margin-bottom: 20px;
    }

    .content-foot {
      text-align: center;
    }

    .close-btn {
      float: right;
      padding: 13px;
      margin-right: -13px;
      cursor: pointer;
      color: #999;
    }

    .fade-enter-active, .fade-leave-active {
      transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to {
      opacity: 0;
    }

    .del-list {
      margin-bottom: 20px;
    }

    .service-info {
      word-break: break-all;
      background: #e8e8e8;
      padding: 10px;
      -webkit-border-radius: 6px;
      -moz-border-radius: 6px;
      border-radius: 6px;
      font-size: 14px;
      line-height: 24px;
    }

    .del-list .list-note {
      float: left;
      width: 105px;
      line-height: 24px;
      font-size: 16px;
      color: #999;
      padding-right: 15px;
      text-align: right
    }

    .del-list .list-content {
      float: left;
      width: 300px;
    }

    .del-list .list-text {
      line-height: 24px;
      font-size: 16px;
    }

    .service-info img {
      width: 100px;
      height: 100px;
    }

    .withOut-service {
      color: red;
      padding: 20px 10px;
      text-align: center;
      font-size: 14px;
    }

    input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }

    input[type="number"] {
      -moz-appearance: textfield;
    }
  }
</style>

