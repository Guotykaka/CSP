<template>
  <div class="recommend">
    <header-top></header-top>
    <div class="page-container">
      <el-tabs v-model="activeName" @tab-click="handleClick" class="tab-main">
        <el-tab-pane label="首页推荐管理" name="first">
          <home-page
            @handleClick="handleClickBtn"
            ref="homePage"></home-page>
        </el-tab-pane>
        <el-tab-pane label="头条推荐管理" name="second">
          <head-line
            @handleClick="handleClickBtn"
            ref="headLine"></head-line>
        </el-tab-pane>
        <!--<el-tab-pane label="分类管理" name="third">
          <type-select
            ref="typeSelect"
            @handleClick="handleClickBtn"
          ></type-select>
        </el-tab-pane>-->
        <el-tab-pane label="推荐分类管理" name="four">
          <type-manage
            ref="typeManage"
            @handleClick="handleClickBtn"
          ></type-manage>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import headerTop from '@/components/headTop.vue';
  import TypeManage from './recomendBox/typeManage.vue';
  import TypeSelect from './recomendBox/typeSelect.vue';
  import HeadLine from './recomendBox/Headline.vue';
  import HomePage from './recomendBox/HomePage.vue';
  export default {
    name: "recommend",
    components: {
      headerTop,
      TypeManage,
      TypeSelect,
      HeadLine,
      HomePage
    },
    data() {
      return {
        activeName: 'first'
      }
    },
    activated(){
      /*分类管理下拉数据*/
      this.$refs.typeManage.getqueryTagList();
    },
    methods: {
      /*tab切换*/
      handleClick() {
        if (this.activeName === 'first') {
          this.$refs.homePage.getManageList();
        }else if (this.activeName === 'second') {
          // this.$refs.headLine.getThemeList();//推荐话题列表
          // this.$refs.headLine.getThemeSelect();//获取下拉数据
          // this.$refs.headLine.getSubscribeList();//订阅话题列表
          // this.$refs.headLine.getBannerList();//推荐banner列表
        }else if (this.activeName === 'third') {
          this.$refs.typeSelect.getCategoryList();
          this.$refs.typeSelect.getqueryNewsCategroyNum();
        } else if (this.activeName === 'four') {
          this.$refs.typeManage.getTableData();
        }
      },
      /*子组件调用父组件方法*/
      handleClickBtn(val){
        this.activeName= val;
        this.handleClick();
      }
    }
  }
</script>

<style scoped lang="less">
  .recommend{
    height:100%;
    .page-container {
      position:relative;
      .tab-main{
        height:100%;
      }
    }
  }
</style>
