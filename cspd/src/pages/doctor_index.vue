<template>
  <div class="doctor-index">
    <!--<header-top></header-top>-->
    <!--<div class="page-container">-->
    <!--<h3>医生首页</h3>-->
    <!--</div>-->
    <div id="withdraw" v-cloak class="sel-content">
      <div class="scroll-head">
        <a class="announcementTip">
          <i class="iconfont icon-gonggaodefuben announceIcon"></i>系统公告
        </a>
        <a class="more" @click="doMore">更多&gt;</a>
        <div class="marquee-box">
          <marquee direction="left" behavior="scroll" scrollamount="3" scrolldelay="0" loop="-1" width="100%"
                   height="24" hspace="10" vspace="10">
            {{announceText}}
          </marquee>
        </div>
      </div>

      <h3 class="welcome-text">欢迎您使用《掌上体检服务管理平台》</h3>
      <div class="links-box" v-if="msgLists">
        <a class="link-item" v-for="(item,index) in msgLists" :key="index" @click="_checkDetail(item)">
          <span class="text">{{item.newsTitle}}</span>
          <span class="dot">{{item.unReadCount}}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  import headerTop from "@/components/headTop.vue"
  import {storeManager} from '@/api/util.js';
  import {localUrl} from "@/config/env.js"
  import {mapState} from "vuex"
  import {api} from '@/api/api';

  export default {
    name: 'doctor_index',
    data() {
      return {
        sumCount: 0,
        announceText: "掌上体检平台公告"
      }
    },
    created: function () {
      this.$store.state.navTitle = '首页'
      this._getList();
      this._getAnnouncement()
    },
    methods: {
      //请求未读消息列表
      _getList: function () {
        let uid = storeManager.getUserId();
        let url = localUrl + 'countUserNewsList',
          that = this,
          params = uid;
 /*       api.countUserNewsList(url, params).then((res) => {
          let data = res.data;
          if (data.code === 1) {
            data.data.forEach(function (item) {
              that.sumCount += parseInt(item.unReadCount)
            });
            that.msgLists = data.data;
          }else{
            alert(data.msg)
          }
        })*/
      },

      //请求公告列表
      _getAnnouncement: function () {
        let uid = storeManager.getUserId(),
          url = localUrl + 'getSysNoticeInfo',
          params = uid;
/*        api.getSysNoticeInfo(url, params).then((res) => {
          let data = res.data;
          if (data.code === 1) {
            this.announceText = data.data.noticeContent;
          } else {
            alert(data.msg)
          }
        }).catch((res) => {
          alert(res.msg)
        })*/
      },

      //点击查看把未读变已读
      _checkDetail: function (item) {
        var uid = storeManager.getUserId();
        var params = {
          userId: uid,
          newsTypes: item.newsType
        };
        /*        $.ajax({
                  type: "POST",
                  url:  baseURL + "ins/usernewsreal/updateBatch",
                  contentType: "application/json",
                  data: JSON.stringify(params),
                  success: function(res){
                    if(res.code === 1){
                      vm.sumCount=vm.sumCount-parseInt(item.unReadCount);
                      if(item.newsType ==='5'){
                        parent.vm.navTitle="电话咨询";
                        parent.location.hash="modules/ins/doctor_tel_service.html";
                        parent.vm.main="modules/ins/doctor_tel_service.html";
                      }else if(item.newsType === '6'){
                        parent.vm.navTitle="图文咨询";
                        parent.location.hash="modules/ins/doctor_img_consult.html";
                        parent.vm.main="modules/ins/doctor_img_consult.html";

                      }else if(item.newsType === '7'){
                        parent.vm.navTitle="个人中心";
                        parent.location.hash="modules/sys/doctor_center.html";
                        parent.vm.main="modules/sys/doctor_center.html";
                      }
                    }else{
                      alert(res.msg)
                    }
                  }
                });*/
      },

      //点击更多
      doMore: function () {
        this.$router.push('announcement')
      }
    },
    components: {
      headerTop,
    },
    computed: {
      ...mapState({
        msgLists: state => state.msgList.data
      })
    },
  }
</script>

<style scoped lang="less">
  .doctor-index {
    line-height: 32px;
    height: 100%;
    position: relative;
  }

  .sel-content {
    width: 100%;
    height: 100%;
    background: url("../asset/img/index-bg.jpg") no-repeat left top;
    overflow: hidden;
    background-size: cover;
    position: relative;
  }

  .scroll-head {
    padding: 15px;
  }

  .announcementTip {
    float: left;
    line-height: 24px;
    color: #5fb84a;
    font-size: 14px;
    vertical-align: top;
    &:hover {
      text-decoration: none;
      color: #5fb84a;
      cursor: pointer
    }
  }

  .more {
    float: right;
    line-height: 24px;
    color: #666;
    font-size: 14px;
    vertical-align: top;
    &:hover {
      text-decoration: none;
      color: #5fb84a;
      cursor: pointer
    }
  }

  .marquee-box {
    padding: 0 60px 0 100px;
    marquee {
      margin: 0;
      display: block;
      color: #666;
      font-size: 14px;
      line-height: 25px;
    }
  }

  .announceIcon {
    vertical-align: top;
    padding-right: 10px;
  }

  .welcome-text {
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    line-height: 36px;
    font-size: 30px;
    color: #5fb84a;
    text-align: center;
    margin-top: -18px;
    padding-right: 240px;
  }

  .links-box {
    position: absolute;
    right: 15px;
    top: 50%;
    width: 225px;
    margin-top: -55px;
  }

  .link-item {
    display: block;
    height: 30px;
    font-size: 0;
    margin-bottom: 10px;
    transition: all 0.5s;
    &:hover {
      cursor: pointer;
      transform: translate3d(5px, 0, 0);
    }
    .text {
      display: inline-block;
      vertical-align: top;
      width: 180px;
      height: 30px;
      border-radius: 15px;
      background-color: #484a56;
      font-size: 14px;
      text-align: center;
      color: #fff;
      line-height: 30px;
    }
    .dot {
      display: inline-block;
      width: 30px;
      height: 30px;
      border-radius: 15px;
      background-color: #f86b4f;
      line-height: 30px;
      font-size: 12px;
      color: #fff;
      text-align: center;
      float: right
    }
  }
</style>
