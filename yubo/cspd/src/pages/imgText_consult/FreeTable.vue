<template>
  <div class="tableMain" ref="ulList">
    <ul>
      <li class="label-main" v-for="(item,index) in orderList.list" :key="index" @click="_getChatDetail(item)"
          :class="{selTrueStyle:customId===item.customId}">
        <div class="nav-main-top">
          <div class="main-left fl">
            <span slot="label" v-if="item.countMsg>0">
              <el-badge :value="item.countMsg" class="itemBadge">{{item.customName}}</el-badge>
            </span>
            <span slot="label" v-else>{{item.customName}}</span>
          </div>
          <div class="main-right fr">
            <div v-if="tableStatus" style="cursor: pointer" @click.stop="detailShow(item)">详情</div>
          </div>
        </div>
        <div class="nav-main-bottom">
          <span class="fl">{{item.createTime}}</span>
        </div>
      </li>
    </ul>

  </div>
</template>

<script>
  export default {
    name: "FreeTable",
    props: {
      orderList: {
        type:Object,
        default:{list:[1]}
      },
      customId:{
        type:String,
        default:''
      },
      tableStatus:{
        type:Boolean,
        default:false
      }
    },
    data() {
      return {
        updataeTradeDetail: "",//订单详情备注
        detailText: {},//用户订单详情展示
      }
    },
    activated() {

    },
    methods: {
      _getChatDetail(item) {
        this.$emit('getChatDetail', item)
      },
      //信息展示
      detailShow: function (val) {
        this.$emit('detailShow', val);
      }
    },
    watch: {
      orderList() {
        this.$refs.ulList.scrollTop=0;
      }
    }
  }
</script>

<style scoped lang="less">
  .itemBadge /deep/ .el-badge__content{
    top: 6px;
    right: 0px;
  }
  .tableMain {
    position: absolute;
    top:0px;
    left:0;
    right:0;
    bottom:40px;
    /*height: calc(100% - 0px);*/
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
  .itemBadge {
    height: 26px;
    line-height: 26px;
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
