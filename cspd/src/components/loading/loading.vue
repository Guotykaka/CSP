<template>
  <div class="loading">
    <img src="./loading.gif" class="loading-show" alt="">
  </div>
</template>

<script>
import {mapState} from "vuex";
export default {
  data () {
    return {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
	.loading{
  position: fixed;
  top:0;
  bottom:0;
  left: 0;
  right: 0;
  display: flex;
  justify-content:center;
  align-items: center;
  background-color:#fff;
  z-index: 1000;
    .loading-show{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  width: 2rem;
  height:1.5rem;
    }
	}
</style>
