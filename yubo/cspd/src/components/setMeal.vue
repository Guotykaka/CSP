<template>
  <div class="set-meal">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="体检套餐" name="first">
        <div class="report-content">
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              prop="examFeeItemName"
              label="收费项目名称">
            </el-table-column>
            <el-table-column
              prop="examPackageID"
              label="套餐ID">
            </el-table-column>
            <el-table-column
              prop="idExamFeeItem"
              label="收费项目ID">
            </el-table-column>
            <el-table-column
              prop="note"
              label="说明">
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="体检加项" name="second">
        <div class="report-content">
          <el-card class="box-card" v-for="item in addList" :key="item.productId" v-if="addList.length>0">
            <el-row :gutter="20">
              <el-col :span="18"><div class="grid-content bg-purple">{{item.productName}}</div></el-col>
              <el-col :span="6"><div class="grid-content bg-purple">{{item.productPrice}}元/{{item.productUnix}}</div></el-col>
            </el-row>
          </el-card>
        </div>

      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import {
    ERR_OK,
  } from '@/api/api';
  export default {
    name: "setMeal",
    props: {
      tableData: {
        type: Array,
        default: []
      },
      addList:{
        type:Array,
        default:[]
      },
      refreshNum:{
        type:Number,
        default:null
      }
    },
    data(){
      return{
        currentHash:'baseInfo',
        activeName:'first'
      }
    },
    activated(){
      this.handleClick()
    },
    methods:{
      //点击nav
      _navClick(index) {
        var scrollTopVal=document.getElementById(index).offsetTop-84;//需要滚动到的位置
        document.getElementById("report-content").scrollTop=scrollTopVal;
        this.currentHash=index;
      },
      handleClick(){

      },

    },
    watch:{
      refreshNum(){
        this.activeName='first';
      }
    }
  }
</script>

<style scoped lang="less">
  .box-card{margin-bottom: 15px;}
  .report-container{display: flex;height: 500px}
  .report-nav{width: 160px;height:100%;overflow: auto}
  .report-content{flex: 1;height: 500px;overflow: auto;transition: all 0.5s}
  .report-nav .nav-item{display: block;line-height: 22px;padding: 5px 0;color:#333;font-weight: bold;text-align: center;cursor: pointer}
  .report-nav .nav-item.active{color:#409EFF;}
  .baseInfoText {font-size: 14px;line-height: 21px;padding: 10px 0;color: #666;}
  .summary-text{font-size: 14px;line-height: 21px;margin-bottom: 5px;color: #666;}
</style>
