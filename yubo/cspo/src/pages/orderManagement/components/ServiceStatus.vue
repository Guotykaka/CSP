<template>
  <div>
    <div class="serverCss" v-if="orderDetailMsg">订单服务状态：
      <el-tag v-if="orderDetailMsg.serviceStatus===0">待服务</el-tag>
      <el-tag type="warning" v-if="orderDetailMsg.serviceStatus===1">客户忙待联系</el-tag>
      <el-tag v-if="orderDetailMsg.serviceStatus===2">服务中</el-tag>
      <el-tag type="success" v-if="orderDetailMsg.serviceStatus===3">已完成</el-tag>
      <el-tag type="info" v-if="orderDetailMsg.serviceStatus===4">已失效</el-tag>
      <el-tag type="danger" v-if="orderDetailMsg.serviceStatus===5">待支付</el-tag>
      <el-tag type="success" v-if="orderDetailMsg.serviceStatus===6">已发送短信</el-tag>
      <el-tag type="success" v-if="orderDetailMsg.serviceStatus===7">已拨打电话</el-tag>
      <el-tag v-if="orderDetailMsg.serviceStatus===8">医院确认信息中</el-tag>
      <el-tag type="info" v-if="orderDetailMsg.serviceStatus===9">未到检</el-tag>
      <el-tag type="success" v-if="orderDetailMsg.serviceStatus===10">已到检</el-tag>
      <el-tag type="warning" v-if="orderDetailMsg.serviceStatus===11">待到检</el-tag>
      <el-tag type="warning" v-if="orderDetailMsg.serviceStatus===12">再次预约</el-tag>
      <el-tag type="success" v-if="orderDetailMsg.serviceStatus===13">待发货</el-tag>
      <el-tag type="success" v-if="orderDetailMsg.serviceStatus===14">已发货</el-tag>
      <el-tag type="success" v-if="orderDetailMsg.serviceStatus===15">待预约</el-tag>
      <el-tag type="success" v-if="orderDetailMsg.serviceStatus===16">预约待审核</el-tag>
      <el-tag type="success" v-if="orderDetailMsg.serviceStatus===17">预约审核通过</el-tag>
      <el-tag type="success" v-if="orderDetailMsg.serviceStatus===18">预约审核未通过</el-tag>
      <el-tag type="success" v-if="orderDetailMsg.serviceStatus===20">已过期</el-tag>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ServiceStatus",
    props:{
      orderDetailMsg:{
        type:Object,
        default:null
      }
    }
  }
</script>
