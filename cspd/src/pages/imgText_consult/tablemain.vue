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
    activated() {
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
      height: 700px;
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

  .selTrueStyle {
    background-color: #c9c9c9;
  }
</style>
