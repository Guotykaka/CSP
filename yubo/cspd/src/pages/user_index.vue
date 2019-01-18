<template>
  <div class="user-wrapper">
    <p class="wel-text">欢迎您使用《掌上体检服务管理平台》</p>
  </div>
</template>

<script>
  export default {
    name: 'user_index',
    data() {
      return {
        isShowTransferBtn: false,
        sumCount: 0,
        announceText: "掌上体检平台公告",
        params: {
          newsTypes: "",
          userId: ""
        },
        userInfo: {},
        dialogFormVisible:false,
        rangeTime:''
      }
    },
    created: function () {

    },

    methods: {

    },

  }
</script>

<style scoped lang="less">

  .user-wrapper{
    display: flex;
    height: 100%;

    background: url("../asset/img/index-bg.jpg") no-repeat left top;

    justify-content: center;

    align-items: center;

    .wel-text{


      font-size: 40px;

      color: #5fb84a;

    }
  }

</style>
