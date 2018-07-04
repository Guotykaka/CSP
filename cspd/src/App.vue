<template>
  <div id="app" class="enter-dom">

    <router-view/>
  </div>
</template>

<script>
  import {api} from '@/api/api';
export default {
  name: 'App',
  created(){
    let url = "http://localhost:8080/api/seller";
    let params= {
      name:'hkk'
    }
    api.server(url,params).then((res)=>{
      console.log(res)
    })
  }
}
</script>

<style lang="less">
  @import './style/common';
  .enter-dom{
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
  input{
    -moz-appearance:textfield;
  }
</style>
