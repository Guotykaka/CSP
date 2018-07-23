<template>
    <div class="annoDetail">
      <el-card class="box-card" v-if="detailShow">
        <div slot="header" class="clearfix">
          <span>{{detailShow.noticeTitle}}</span>
        </div>
        <div class="text item creatBody">
          <span class="creatMain">{{detailShow.noticeContent}}</span>

          <div class="creatTime">
            <p>{{detailShow.dictName}}</p>
            <p>{{detailShow.createTime}}</p>
          </div>
        </div>
        <el-button style=" padding: 5px" type="primary" @click="back">返回</el-button>

      </el-card>
    </div>
</template>

<script>
  import {mapState} from 'vuex';
    export default {
        name: "annoDetail",
      data() {
        return {
          // detailInfo: {}
        }
      },
      activated(){
          if(!this.detailShow){
            this.$router.push('/announcement');
          }
      },
      methods: {
        back() {
          this.$router.go(-1);
        }
      },
      computed:{
        ...mapState({
          detailShow: state => state.detailShow
        }),
      }
    }
</script>

<style scoped lang="less">
  /*卡片样式*/
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 100%;
    text-align:center;
  }
.annoDetail{
  line-height: 32px;
  .creatBody{
    overflow:hidden;
  }
  .creatMain{
    display:block;
    float:left;
    text-align:left;
    text-indent: 2em;
    width:100%;
  }
  .creatTime{
    float:right;
  }
}
</style>
