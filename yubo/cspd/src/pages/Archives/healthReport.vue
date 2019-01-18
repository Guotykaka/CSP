<template>
  <div id="health-report">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="健康报告" name="first">敬请期待...</el-tab-pane>
      <el-tab-pane label="问卷评估报告" name="second">敬请期待...</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    name: "healthReport",
    data() {
      return {
        activeName: 'first'
      }
    },
    methods:{
      handleClick(tab){
          console.log(tab.name)
      }
    }
  }
</script>

<style scoped>

</style>
