<template>
  <div class="tableMain" ref="ulList">
    <ul>
      <li class="label-main" v-for="(item,index) in orderList.list" :key="index" @click="_getChatDetail(item,index)"
          :class="{selTrueStyle:selCurrent===index}">
        <div class="nav-main-top">
          <div class="main-left fl">
            <span style="position:relative;width: 226px;overflow: hidden;display: inline-block;text-overflow: ellipsis;white-space: nowrap;">
              {{item.consultChatDTO.customerName}}
              <b v-if="item.unReadCount&&item.unReadCount!=='0'" class="red-circle"></b>
            </span>
          </div>
          <div class="main-right fr">
            <a href="javascript:;" @click.stop="detailShow(item.doctorTradeDetailOrderInfoDTO)">详情</a>
            <span class="servicing" v-show="item.consultChatDTO.serviceStatus===0">待服务</span>
            <span class="servicing Danger-color" v-show="item.consultChatDTO.serviceStatus===2">服务中</span>
            <span class="servicing info-color" v-show="item.consultChatDTO.serviceStatus===3">已完成</span>
            <span class="servicing info-color" v-show="item.consultChatDTO.serviceStatus===4">已失效</span>
          </div>
        </div>
        <div class="nav-main-bottom">
          <span class="fl">{{item.doctorTradeDetailOrderInfoDTO.createTime}}</span>
          <p class="fr nav_fr" v-show="item.consultChatDTO.serviceStatus===2||item.consultChatDTO.serviceStatus===0">剩余
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
    props: {
      orderList: {
        type:Object,
        default:{list:[1]}
      }

    },
    data() {
      return {
        selCurrent: null,
        updataeTradeDetail: "",//订单详情备注
        detailText: {},//用户订单详情展示
      }
    },
    activated() {

    },
    methods: {
      _getChatDetail(item, index) {
        this.selCurrent = index;
        this.$emit('getChatDetail', item)
      },
      //信息展示
      detailShow: function (val) {
        this.$emit('detailShow', val);
      }
    },
    watch: {
      orderList() {
        this.selCurrent = null;
        this.$refs.ulList.scrollTop=0;
      }
    }
  }
</script>

<style scoped lang="less">
  .tableMain {
    position: relative;
    height: calc(100% - 54px);
    overflow: auto;
    .label-main {
      padding: 10px;
      overflow: hidden;
      border-bottom: 1px solid #e5e5e5;
      &:hover {
        background-color: #c9c9c9;
      }
      .servicing {
        display: block;
        padding: 0 10px;
        line-height: 25px;
        color: #fff !important;
        background-color: #67C23A;
        border-radius: 5px;
      }
      .info-color {
        background-color: #909399
      }
      .Warning-color {
        background-color: #E6A23C
      }
      .Danger-color {
        background-color: #F56C6C
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
    background-color: #e5e5e5;
  }
</style>
