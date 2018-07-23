<template>
  <div class="announcement">
    <el-card>
      <div class="bgColor">
        <el-form :inline="true" size="medium" :model="searchParams" class="demo-form-inline">
          <el-form-item label="公告标题">
            <el-input  @keyup.enter.native="doSearch" v-model="searchParams.noticeTitleQuery" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item label="公告类型">
            <el-select @keyup.enter.native="doSearch" filterable v-model="searchParams.selectedNoticeTypeQuery" placeholder="请选择">
              <el-option v-for="item in noticeLists" :key="item.id" :label="item.dictName" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="clearParams">清空</el-button>
            <el-button type="primary" @click="doSearch">搜索</el-button>
          </el-form-item>
        </el-form>
        <div class="title-msg">系统公告</div>
        <div class="main-msg"></div>

        <div class="announ-table">
          <el-table
            :header-row-style="headStyle"
            :data="msgLists"
            empty-text
            style="width: 100%;">
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column
              prop="noticeTitle"
              label="标题"
              width="180">
            </el-table-column>
            <el-table-column
              prop="dictName"
              label="类型"
              width="180">
            </el-table-column>
            <el-table-column
              prop="lastUpdateTime"
              label="发布时间">
            </el-table-column>
            <el-table-column
              prop="address"
              label="操作">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="_checkDetail(scope.$index, msgLists)"
                  type="primary"
                  size="small">
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pageinit" v-if="msgLists.length>0">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="searchParams.currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="searchParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalcount">
          </el-pagination>
        </div>
      </div>
    </el-card >
  </div>
</template>

<script>
  import {storeManager} from '@/api/util.js';
  import {ERR_OK, noticelist, getDictionaryByKey} from '@/api/api.js';
  import {getStore} from '@/config/mUtils.js';

  export default {
    name: "announcement",
    data() {
      return {
        searchParams: {
          currentPage: 1,
          pageSize: 10,
          selectedNoticeTypeQuery: '',
          noticeTitleQuery: ""
        },
        tableData: [],
        currentPage4: 4,
        totalcount:null,
        detailShow:null,
        msgLists: [],
        noticeLists: [],
        userInfo:{}
      }
    },
    created() {
      this.userInfo = JSON.parse(getStore('userMesage'));
      this._getList();
      this.getNoticeTypes();
    },
    methods: {
      headStyle(){
        return {'background':'#e5e5e5!important','color':'#333'}
      },
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      handleSizeChange(val) {
        this.searchParams.pageSize=val;
        this._getList()
      },
      handleCurrentChange(val) {
        this.searchParams.currentPage=val;
        this._getList()
      },
      getNoticeTypes: function () {
        let params = {
          dictType: "NOTICE_TYPE"
        };
        //加载系统公告类型字典表
        getDictionaryByKey(params).then((res)=>{
          if (res.code === ERR_OK) {
            this.noticeLists = res.data;
          } else {
            alert(res.msg);
          }
        })
      },
      //清空
      clearParams(){
        this.searchParams.selectedNoticeTypeQuery = '';
        this.searchParams.noticeTitleQuery = '';
      },
      //搜索
      doSearch: function () {
        this.searchParams.currentPage = 1;
        this.searchParams.pageSize = 10;
        this._getList();
      },

      //请求公告列表
      _getList: function () {
        let params ={
          currentPage: this.searchParams.currentPage,
          noticeTitle: this.searchParams.noticeTitleQuery,
          noticeType: this.searchParams.selectedNoticeTypeQuery,
          pageSize: this.searchParams.pageSize,
          userId: this.userInfo.userId
        };
        noticelist(params).then((res)=>{
          if(res.code===ERR_OK){
            this.msgLists = res.data.list;
            this.totalcount = res.data.totalCount;
          }else{
            this.$alert(res.msg,'提示')
          }
        })
      },
      //点击查看详情
      _checkDetail: function (index, rows) {
        let item = rows[index];
        this.$store.dispatch("detailShow",item);
        this.$router.push('annoDetail');
      }
    },
  }
</script>

<style scoped lang="less">
  .announcement {
    line-height: 32px;
    .bgColor {
      padding: 10px 15px;
      background-color: #fff;
    }
    .title-msg {
      font-size: 16px;
      border-bottom: 1px solid #e5e5e5;
      padding-bottom: 0px;
      margin-left: 20px;
    }
    .main-msg {
      width: 100px;
      height: 3px;
      background-color: #2186f6;
      margin: -2px 0 10px 0;
    }
    .pageinit{
      text-align: center;
      margin-top:20px;
    }
  }

  .gray-bg {
    background-color: #e8e8e8;
    padding: 15px;
  }

  .sel-card-body {
    padding: 30px 15px;
  }

  .control-label {
    line-height: 34px;
    font-size: 14px;
  }

  .blue-text {
    color: #509cf0
  }

  .blue-text:hover {
    color: #2186f6;
    text-decoration: none;
    cursor: pointer
  }

  .info-title {
    margin-bottom: 15px;
    font-size: 24px;
    line-height: 36px;
    text-align: center;
    color: #333;
  }

  .info-content {
    padding: 10px 0;
    line-height: 24px;
    font-size: 14px;
    color: #444;
    word-break: break-all
  }

  .group-content {
    padding: 0 15px 0 80px;
    position: relative
  }

  .group-note {
    position: absolute;
    left: 0;
    top: 0;
    line-height: 34px;
    font-size: 16px
  }
</style>
