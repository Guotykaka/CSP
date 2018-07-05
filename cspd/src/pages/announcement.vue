<template>
  <div class="announcement">
    <div class="gray-bg">
      <div class="bgColor">
        <el-form :inline="true" size="medium" :model="searchParams" class="demo-form-inline">
          <el-form-item label="公告标题">
            <el-input v-model="searchParams.noticeTitleQuery" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item label="公告类型">
            <el-select v-model="searchParams.selectedNoticeTypeQuery" placeholder="请选择">
              <el-option v-for="(item,index) in noticeLists" :key="index" :label="item.dictName" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="doSearch" icon="el-icon-search">搜索</el-button>
          </el-form-item>
        </el-form>
        <div class="title-msg">系统公告</div>
        <div class="main-msg"></div>

        <div class="announ-table">
          <el-table
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
                  @detailShow="detailShow"
                  type="text"
                  size="small">
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pageinit">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="searchParams.page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="searchParams.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalcount">
          </el-pagination>
        </div>
        <!--     <div class="layui-card" v-show="!detailInfo.isShowDetail">
               <div class="layui-card-body">
                 <div class="layui-row">
                   <div class="layui-col-lg3 layui-col-md4 layui-col-sm4 form-group">
                     <div class="group-content">
                       <span class="group-note">公告标题</span>
                       <input type="text" placeholder="标题" class="form-control" v-model="searchParams.noticeTitleQuery">
                     </div>
                   </div>
                   <div class="layui-col-lg3 layui-col-md4 layui-col-sm4 form-group">
                     <div class="group-content">
                       <span class="group-note">公告类型</span>
                       <select class="form-control" v-model="searchParams.selectedNoticeTypeQuery">
                         <option value="-1">请选择</option>
                         <option v-for="item in noticeLists" :value="item.code">{{item.dictName}}</option>
                       </select>
                     </div>
                   </div>
                   <div class="layui-col-lg3 layui-col-md4 layui-col-sm4 form-group">
                     <a class="btn btn-success" @click="doSearch">搜索</a>
                   </div>
                 </div>
                 <div class="layui-tab layui-tab-brief">
                   <ul class="layui-tab-title">
                     <li class="layui-this">系统公告</li>
                   </ul>
                   <div class="table-wrapper">
                     <table class="layui-table">
                       <thead>
                       <tr>
                         <td>序号</td>
                         <td>标题</td>
                         <td>类型</td>
                         <td>发布时间</td>
                         <td>操作</td>
                       </tr>
                       </thead>
                       <tbody v-show="msgLists.length > 0">
                       <tr v-for="(item,index) in msgLists">
                         <td>{{index+1}}</td>
                         <td>{{item.noticeTitle}}</td>
                         <td>{{item.dictName}}</td>
                         <td>{{item.lastUpdateTime}}</td>
                         <td><a class="blue-text" @click="_checkDetail(item)">查看详情</a></td>
                       </tr>
                       </tbody>
                     </table>
                     <div id="selPage" class="text-center" style="text-align: right;"></div>
                     <p v-show="msgLists.length <= 0" class="text-center" style="color: red;padding: 20px 10px;">暂无数据</p>
                   </div>
                 </div>
               </div>
             </div>-->
      </div>
    </div>
  </div>
</template>

<script>
  import {localUrl} from "@/config/env.js"
  import {api} from '@/api/api';
  import {storeManager} from '@/api/util.js';

  export default {
    name: "announcement",
    data() {
      return {
        searchParams: {
          page: 1,
          limit: 10,
          selectedNoticeTypeQuery: '',
          noticeTitleQuery: "",
          noticeStatus: 2,
          noticeOs: "ROLE_TYPE_DOCTOR"
        },
        tableData: [],
        currentPage4: 4,
        totalcount:null,
        detailShow:null,



        msgLists: [],
        noticeLists: [],
        detailInfo: {
          isShowDetail: false,
          info: {
            noticeTitle: "",
            noticeContent: ""
          }
        }
      }
    },
    created() {
      this._getList();
      this.getNoticeTypes();
    },
    methods: {
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.searchParams.limit=val;
        this._getList()
      },
      handleCurrentChange(val) {
        this.searchParams.page=val;
        this._getList()
      },
      getNoticeTypes: function () {
        //加载系统公告类型字典表
        let url = localUrl + "getDictionaryByKey",
          that = this,
          params = {
            dictType: "",
            code: "",
            parentId: "8ab2b2f562dc97230162dc9723560000"
          };
        api.getDictionaryByKey(url, params).then((res) => {
          let data = res.data;
          if (data.code === 1) {
            that.noticeLists = data.data;
          } else {
            alert(data.msg);
          }
        })
      },

      //搜索
      doSearch: function () {
        this.searchParams.page = 1;
        vm._getList();
      },

      //请求公告列表
      _getList: function () {
        let uid = storeManager.getUserId(),
          url = localUrl + 'noticeTitleQuery',
          that = this,
          params = this.searchParams;
        api.noticeTitleQuery(url, params).then((res) => {
          let data = res.data;
          if (data.code === 1) {
            if (data.data.list) {
              that.msgLists = data.data.list;
              that.totalcount = data.data.totalCount;
            } else {
              that.msgLists = [];
              that.totalcount = 0;
            }
          } else {
            alert(data.msg)
          }
        }).catch((res) => {
          alert(res.msg)
        })

      },
      //点击查看详情
      _checkDetail: function (index, rows) {
        let item = rows[index];
        this.$store.getters.detailShow= item;
        this.detailShow=item;
        console.log(item)
        this.detailInfo.isShowDetail = true;
        this.detailInfo.info.noticeTitle = item.noticeTitle;
        this.detailInfo.info.noticeContent = item.noticeContent;
        this.$router.push('annoDetail');
      },

      //返回
      back: function () {
        this.detailInfo.isShowDetail = false;
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
      border-bottom: 1px solid #9F9F9F;
      padding-bottom: 0px;
      margin-left: 20px;
    }
    .main-msg {
      width: 100px;
      height: 3px;
      background-color: #4CAF50;
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
