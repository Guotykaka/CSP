<template>
  <div class="star-wrapper">
    <p class="star-container">
      <span class="star-active" v-bind:style="{ width: (star/0.05)+'%'}"></span>
    </p>
    <strong class="star-count">{{star}}星</strong>
  </div>
</template>

<script>
    export default {
      name: "star",
      props:{
        star: {
          type: Number,
          default: 3
        },
      }
    }
</script>

<style scoped lang="less">


  .star-wrapper{
    font-size: 0;
    .star-container{
      width: 120px;
      height: 24px;
      background: url("./star.png") no-repeat left top;
      overflow: hidden;
      display: inline-block;

      .star-active{
        display:block;
        height: 24px;
        background: url("./star.png") no-repeat left bottom;
      }
    }

    .star-count{
      line-height: 24px;
      font-size: 14px;
      color:#409EFF;
      display: inline-block;
      padding-left: 20px;
      vertical-align: top;
    }


  }
</style>
