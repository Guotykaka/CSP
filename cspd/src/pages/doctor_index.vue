<template>
  <div class="doctor_index">
    <header-top></header-top>
    <div class="page-container">
      <h3>医生首页</h3>
    </div>
  </div>
</template>

<script>
  import headerTop from "@/components/headTop.vue"
  export default {
    name:'doctor_index',

  created(){
    this.$store.state.navTitle ='首页'
  },
    components: {
      headerTop,
    },
  }
</script>

<style scoped>

</style>
