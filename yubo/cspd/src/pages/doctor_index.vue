<template>
  <div class="doctor-index">
    <div id="withdraw" v-cloak class="sel-content">
      <div class="scroll-head">
        <a class="announcementTip">
          <i class="iconfont icon-gonggaodefuben announceIcon"></i>系统公告
        </a>
        <a class="more" @click="doMore">更多&gt;</a>
        <div class="marquee-box">
          <marquee direction="left" behavior="scroll" scrollamount="3" scrolldelay="0" loop="-1" width="100%"
                   height="44" hspace="10" vspace="0">
            {{announceText}}
          </marquee>
        </div>
      </div>
      <div class="transfer-order-bar" v-if="isShowTransferBtn">
        <!--<el-button type="primary" size="small" @click="toTransfer">去转单</el-button>-->
        <el-button type="primary" size="small" @click="toExport">导出订单</el-button>
      </div>
      <h3 class="welcome-text">欢迎您使用《掌上体检服务管理平台》</h3>
      <div class="links-box" v-if="msgLists && userInfo.insDoctorId">
        <a class="link-item" v-for="(item,index) in msgLists" :key="index" @click="_checkDetail(item)">
          <span class="text">{{item.newsTitle}}</span>
          <span class="dot">{{item.unReadCount}}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from "vuex"
  import {getStore,EncodeDoctorId} from "@/config/mUtils";
  import {ERR_OK, updateBatch} from '@/api/api';


  export default {
    name: 'doctor_index',
    data() {
      return {
        isShowTransferBtn: false,
        sumCount: 0,
        announceText: "掌上体检平台公告",
        params: {
          newsTypes: "",
          userId: ""
        },
        userInfo: {},
        dialogFormVisible:false,
        rangeTime:''
      }
    },
    created: function () {
      this.$store.state.navTitle = '首页';
      this.userInfo = JSON.parse(getStore('userMesage'));
      this.userInfo.userId = EncodeDoctorId(this.userInfo.userId);

      this.params.userId = this.userInfo.userId;
      this.isShowTransferBtn = this.userInfo.whetherAllocationPermissions;

    },

    methods: {
      //点击查看把未读变已读
      _checkDetail: function (item) {
        if (item.newsType === '5') {
          //电话报告解读
          this.params.newsTypes = item.newsType;
          this.updateStatus();
        } else if (item.newsType === '6') {
          //图文咨询
          this.params.newsTypes = item.newsType;
          this.updateStatus();
        } else if (item.newsType === '7') {
          //账单消息
          this.params.newsTypes = item.newsType;
          this.updateStatus();
        }
      },
      //更新消息状态
      updateStatus() {
        let parNes = {
          userId: this.userInfo.userId
        };
        updateBatch(this.params).then((res) => {
          if (res.code === ERR_OK) {
            this.routerTo();
            this.$store.dispatch('msgList', parNes)
          } else {
            this.$alert('更新失败', '提示')
          }
        })
      },
      //路由跳转
      routerTo() {
        if (this.params.newsTypes === '5') {
          //电话报告解读
          this.$router.push("/tel_consult")
        } else if (this.params.newsTypes === '6') {
          //图文咨询
          this.$router.push("/imgText_consult")
        } else if (this.params.newsTypes === '7') {
          //账单消息
          this.$router.push("/personal")
        }
      },
      //点击更多
      doMore: function () {
        this.$router.push('/announcement')
      },
      //转单
      toTransfer() {
        this.$router.push('/transfer_order')
      },
      //导出订单
      toExport() {
        this.$router.push('/export_order')
      }
    },
    computed: {
      ...mapState({
        msgLists: state => state.msgList
      })
    },
  }
</script>

<style scoped lang="less">
  .doctor-index {
    line-height: 32px;
    position: absolute;
    /*width:100%;*/
    left:15px;
    right:15px;
    bottom:15px;
    top:15px;
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
    line-height: 44px;
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
    line-height: 44px;
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
      line-height: 44px;
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

  .transfer-order-bar {
    text-align: right;
    padding-top: 20px;
  }
</style>
