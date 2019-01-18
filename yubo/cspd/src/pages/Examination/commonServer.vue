<template>
  <div class="common-server">
    <el-tag v-if="appointmentStatus===0" type="primary">待服务</el-tag>
    <el-tag v-if="appointmentStatus===1" type="primary">客户忙待联系</el-tag>
    <el-tag v-if="appointmentStatus===2" type="primary">服务中</el-tag>
    <el-tag v-if="appointmentStatus===3" type="primary">已完成</el-tag>
    <el-tag v-if="appointmentStatus===4" type="primary">已失效</el-tag>
    <el-tag v-if="appointmentStatus===5" type="primary">待支付</el-tag>
    <el-tag v-if="appointmentStatus===6" type="primary">已发送短信</el-tag>
    <el-tag v-if="appointmentStatus===7" type="primary">已拨打电话</el-tag>
    <el-tag v-if="appointmentStatus===8" type="primary">医院确认信息中</el-tag>
    <el-tag v-if="appointmentStatus===9" type="primary">未到检</el-tag>
    <el-tag v-if="appointmentStatus===10" type="primary">已到检</el-tag>
    <el-tag v-if="appointmentStatus===11" type="primary">待到检</el-tag>
    <el-tag v-if="appointmentStatus===12" type="primary">再次预约</el-tag>
    <el-tag v-if="appointmentStatus===13" type="primary">待发货</el-tag>
    <el-tag v-if="appointmentStatus===14" type="primary">已发货</el-tag>
    <el-tag v-if="appointmentStatus===15" type="primary">待预约</el-tag>
    <el-tag v-if="appointmentStatus===16" type="primary">预约待审核</el-tag>
    <el-tag v-if="appointmentStatus===17" type="primary">预约审核通过</el-tag>
    <el-tag v-if="appointmentStatus===18" type="primary">预约审核未通过</el-tag>
    <el-tag v-if="appointmentStatus===20" type="primary">已过期</el-tag>
  </div>
</template>
<script>
  export default {
    name: "commonServer",
    props:{
      appointmentStatus:{
        type:Number,
        default:null
      }
    }
  }
</script>

<style scoped>

</style>
