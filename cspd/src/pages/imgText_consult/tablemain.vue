<template>
  <div class="tableMain">
    <ul class="tcontent-ul" v-if="orderList&&orderList.list">
      <li class="label-main" v-for="(item,index) in orderList.list"
          v-if="orderList.list.length!==0" :key="index" @click="_getChatDetail(item,index)"
          :class="{selTrueStyle:selCurrent==index}">
        <div class="nav-main-top">
          <div class="main-left fl">
            <span style="position:relative;">
              {{item.customerName}}
              <b v-if="item.unReadCount&&item.unReadCount!=0" class="red-circle"></b>
            </span>
          </div>
          <div class="main-right fr">
            <a href="javascript:;" @click.stop="detailShow(item)">详情</a>
            <span class="servicing" v-show="item.orderServiceStatus==0">待服务</span>
            <span class="servicing Danger-color" v-show="item.orderServiceStatus==2">服务中</span>
            <span class="servicing info-color" v-show="item.orderServiceStatus==3">已完成</span>
            <span class="servicing info-color" v-show="item.orderServiceStatus==4">已失效</span>
          </div>
        </div>
        <div class="nav-main-bottom">
          <span class="fl">{{item.orderTime}}</span>
          <p class="fr nav_fr" v-show="item.orderServiceStatus==2||item.orderServiceStatus==0">剩余
            <span v-if="item.remainHours!=='0'">{{item.remainHours}}小时</span>
            <span v-else>{{item.remainMinuts}}分钟</span>
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import {localUrl} from "@/config/env.js"
  import {api} from '@/api/api';

  export default {
    name: "tablemain",
    props: ['orderList', 'Current'],
    data() {
      return {
        selCurrent: null,
        updataeTradeDetail: "",//订单详情备注
        detailText: {},//用户订单详情展示
      }
    },
    created() {
      this.selCurrent = this.Current;
    },
    methods: {
      _getChatDetail(item, index) {
        this.selCurrent = index;
        this.$emit('getChatDetail', item)
      },
      //信息展示
      detailShow: function (val) {
        this.$emit('detailShow', val);
      },
    },
  }
</script>

<style scoped lang="less">
  .tableMain {
    position: relative;
    height: 100%;
    overflow: hidden;
    .tcontent-ul {
      overflow: auto;
      height: 100%;
    }
    .label-main {
      padding: 10px;
      overflow: hidden;
      border-bottom: 1px solid #e5e5e5;
      &:hover {
        background-color: #e5e5e5;
      }
      .servicing {
        display: block;
        padding: 0 10px;
        line-height: 25px;
        color: #fff !important;
        background-color: #67C23A;
        border-radius: 5px;
      }
      .info-color{
        background-color:#909399
      }
      .Warning-color{
        background-color:#E6A23C
      }
      .Danger-color{
        background-color:#F56C6C
      }
    }
  }

  .msgleft-head .layui-tab-title ul {
    display: flex;
  }

  .layui-tab-title li {
    flex: 1;
  }

  .red-circle {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: red;
    position: absolute;
    top: 0;
    right: -7px;
  }

  .fl {
    float: left;
  }

  .fr {
    float: right;
  }

  .main-right a,
  .main-right .servicing {
    float: left;
    color: #f86b4f;
    margin-right: 10px;
    line-height: 25px;
    text-decoration: none;
  }

  .nav-main-top {
    overflow: hidden;
  }

  .nav-main-bottom {
    margin-top: 10px;
    .nav_fr {
      margin-right: 20px;
    }
  }

  /*详情框*/
  .detail-mask {
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 100;
    .mask-circle {
      width: 570px;
      height: 530px;
      background-color: #fff;
      border: 1px solid #e5e5e5;
      border-radius: 5px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -285px;
      margin-top: -265px;
    }
  }

  .mask-header {
    height: 40px;
    font-size: 16px;
    line-height: 40px;
    background-color: #999;
    padding: 0 20px;
  }

  .mask-main li {
    display: flex;
    height: 50px;
    line-height: 50px;
  }

  .fle1 {
    flex: 1;
    width: 100px;
    text-align: right;
    color: #666;
  }

  .fle2 {
    flex: 2.5;
    text-align: left;
    margin-left: 20px;
  }

  .flinput {
    height: 100px;
    width: 300px;
    border-radius: 5px;
    resize: none;
    padding: 5px;
    line-height: 20px;
  }

  .flbtn {
    width: 75px;
    background-color: #4fb136;
    color: #fff;
    border-radius: 5px;
    border: none;
    height: 38px;
    line-height: 38px;
  }

  .addImgBox {
    width: 100%;
    height: 80px;
    box-sizing: border-box;
  }

  .addImgBox .addImg {
    width: 80px;
    height: 100%;
    background-color: #e5e5e5;
    color: #666;
    vertical-align: middle;
    padding: 2px;
    position: relative;
    text-align: center;
    display: inline-block;
  }

  .addImg .addIcon {
    font-size: 60px;
    line-height: 100px;
  }

  .addImg .delIcon {
    display: inline-block;
    width: 30px;
    height: 30px;
    font-size: 50px;
    color: #333;
    border-radius: 50%;
    background: #e5e5e5;
    box-sizing: border-box;
    line-height: 24px;
    margin-right: -15px;
    margin-top: -15px;
    position: absolute;
    top: 0;
    right: 0;
  }

  .selTrueStyle {
    background-color: #c9c9c9;
  }

  .minCirclefl {
    border: 8px solid #e5e5e5;
    border-right-color: #fff;
    position: absolute;
    top: 12px;
    left: -3px;
  }

  .minCirclefr {
    border: 8px solid #e5e5e5;
    border-left-color: #4fb136;
    position: absolute;
    top: 12px;
    right: -3px;
  }

  .layui-this {
    color: #3c8dbc !important;
  }

  .layui-this:after {
    border-bottom: 2px solid #3c8dbc !important;
  }

  .reStyle {
    background-color: #999 !important;
    color: #fff !important;
  }
</style>
