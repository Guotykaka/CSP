<template>
  <div id="app" class="enter-dom">
      <router-view/>
  </div>
</template>

<script>
  import {api} from '@/api/api';

  export default {
    name: 'App',
    created() {

    }
  }
</script>

<style lang="less">
  @import './style/common';

  .enter-dom {
    height: 100%;
  }

  /* 谷歌 */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
  }

  /* 火狐 */
  input {
    -moz-appearance: textfield;
  }
</style>
