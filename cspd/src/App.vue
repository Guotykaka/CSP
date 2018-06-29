<template>
  <div id="app" class="enter-dom">

    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
  @import './style/common';
  .enter-dom{
    height: 100%;
  }

</style>
