<template>
    <div class="annoDetail">
      <div v-show="detailInfo.isShowDetail" class="layui-card">
        <div class="layui-card-body">
          <h3 class="info-title">{{detailInfo.info.noticeTitle}}</h3>
          <p class="info-content">{{detailInfo.info.noticeContent}}</p>
          <div style="text-align: right;padding-right: 15px;">
            <a class="btn btn-primary" @click="back">返回</a>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "annoDetail",
      data() {
        return {
          detailInfo: {
            isShowDetail: false,
            info: {
              noticeTitle: "",
              noticeContent: ""
            }
          }
        }
      },
      props:['detailShow'],
      created(){
        this.detailInfo.isShowDetail = true;
        this.detailInfo.info.noticeTitle = this.detailShow.noticeTitle;
        this.detailInfo.info.noticeContent = this.detailShow.noticeContent;
      }
    }
</script>

<style scoped>

</style>
