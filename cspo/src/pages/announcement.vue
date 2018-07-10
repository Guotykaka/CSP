<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">

      <el-card class="box-card">
        <el-form :inline="true" :model="searchParams" class="demo-form-inline">
          <el-form-item label="标题">
            <el-input placeholder="公告标题"></el-input>
          </el-form-item>

          <el-form-item label="类型">
            <el-select v-model="searchParams.selectedNoticeTypeQuery" clearable placeholder="公告类型">
              <el-option v-for="item in getInstitutionArr" :key="item.institutionId" :label="item.institutionName" :value="item.institutionId"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="doSearch">搜索</el-button>
          </el-form-item>
        </el-form>

        <!--tab-->
        <el-tabs>
          <el-tab-pane label="系统公告" name="0"></el-tab-pane>
        </el-tabs>

        <!--table 表单开始-->
        <el-table
          :data="msgLists"
          border
          style="width: 100%">
          <el-table-column prop="" label="序号"  width="60" type="index"></el-table-column>
          <el-table-column prop="noticeTitle" label="标题"></el-table-column>
          <el-table-column prop="dictName" label="类型"></el-table-column>
          <el-table-column prop="lastUpdateTime" label="发布时间"></el-table-column>

          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="_checkDetail(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--table 表单结束-->

        <div class="self-page-container">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchParams.page" :page-sizes="[10,20]" :page-size="searchParams.limit" layout="total, sizes, prev, pager, next, jumper" :total="totalListCount">
          </el-pagination>
        </div>


      </el-card>

      <!--公告详情的dialog-->
      <el-dialog title="详情" :visible.sync="isShowDialog">
        <p class="info-title">{{detailInfo.noticeTitle}}</p>
        <p class="info-content">{{detailInfo.noticeContent}}</p>
        <div class="btn-row" style="text-align:center">
          <el-button size="small" type="danger" @click="closeDialog">关闭</el-button>
        </div>
      </el-dialog>
    </div>
  </div>

</template>


<script>

import headerTop from '@/components/headTop.vue';
import { mapGetters } from "vuex";



export default {
  data() {
    return {
      detailInfo:{
        noticeTitle:"",//标题
        noticeContent:""//内容
      },

      isShowDialog:false,

      totalListCount:20,

      searchParams:{
        noticeTitleQuery:"",//标题
        selectedNoticeTypeQuery:"",//类型
        page:1
      },

      msgLists:[
        {"noticeOs":"ROLE_TYPE_OPERATING,ROLE_TYPE_DOCTOR","releaseTime":null,"sysNoticeId":"2c8080aa6443eb9001644415ebee0006","noticeType":"NOTICE_TYPE_VERSION_UPGRADES","userName":"admin","noticeTitle":"医生运营端接收","noticeOsName":"运营端 医生端 ","noticeContent":"医生运营端接收医生运营端接收医生运营端接收医生运营端接收医生运营端接收医生运营端接收医生运营端接收医生运营端接收医生运营端接收医生运营端接收医生运营端接收医生运营端接收医生运营端接收医生运营端接收医生运营端接收医生运营端接收医生运营端接收医生运营端接收医生运营端接收医生运营端接收医生运营端接收医生运营端接收医生运营端接收医生运营端接收医生运营端接收医生运营端接收","createTime":"2018-06-28 09:50:44","noticeStatus":2,"createUser":"1","dictName":"版本升级","lastUpdateTime":"2018-07-03 11:33:09"},
        {"noticeOs":"ROLE_TYPE_OPERATING","releaseTime":null,"sysNoticeId":"2c8080aa6443eb900164441530da0005","noticeType":"NOTICE_TYPE_VERSION_UPGRADES","userName":"admin","noticeTitle":"运营端接收","noticeOsName":"运营端 ","noticeContent":"运营端接收","createTime":"2018-06-28 09:49:56","noticeStatus":2,"createUser":"1","dictName":"版本升级","lastUpdateTime":"2018-06-28 09:49:56"},
        {"noticeOs":"ROLE_TYPE_OPERATING","releaseTime":null,"sysNoticeId":"2c8080aa6443eb90016443eb906d0000","noticeType":"NOTICE_TYPE_VERSION_UPGRADES","userName":"admin","noticeTitle":"测试公告1","noticeOsName":"运营端 ","noticeContent":"测试公告1","createTime":"2018-06-28 09:04:28","noticeStatus":2,"createUser":"1","dictName":"版本升级","lastUpdateTime":"2018-06-28 09:04:28"}
      ]


  }
  },

  components:{
    headerTop,
  },

  computed:{
    ...mapGetters(['getInstitutionArr'])
  },

  methods:{



    doSearch(){

    },



    handleSizeChange(val){


    },

    handleCurrentChange(val){},



    //查看详情
    _checkDetail(item){
      this.detailInfo.noticeTitle=item.noticeTitle;
      this.detailInfo.noticeContent=item.noticeContent;
      this.isShowDialog=true;
    },


    //关闭dialog


    closeDialog(){
      this.isShowDialog=false;
    }






  },







}
</script>
<style lang="less" scoped>

  .info-title{text-align: center;line-height: 24px;font-size: 18px;color:#303133;font-weight:normal;margin-bottom: 15px}

  .info-content{color:#606266;font-size: 14px;line-height: 22px;margin-bottom: 20px}

</style>
