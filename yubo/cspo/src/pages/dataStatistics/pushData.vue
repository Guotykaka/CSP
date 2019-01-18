<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">

      <!-- 服务页面 -->
      <div>
        <el-header height="30">
          <!-- 操作行-->
          <el-row>
            <el-form id="SearchBar" :model="searchParams" :inline="true" class="demo-form-inline">
              <el-form-item label="类型：">
                <el-select v-model="searchParams.type" clearable placeholder="请选择推送类型">
                  <el-option :label="item.description" :value="item.type" v-for="(item,index) in SelectList" :key="index"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="doSearch()">搜索</el-button>
              </el-form-item>
            </el-form>
          </el-row>
        </el-header>

        <el-main id="scroller" v-loading.fullscreen.lock="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)">
          <!-- 列表 -->
          <template>
            <el-table :data="tableData" border style="width: 100%" id="app">
              <el-table-column show-overflow-tooltip align="center" type="index" label="" fixed></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="category" label="种类" min-width="110">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium" type="success" v-if="scope.row.category === 1">单条</el-tag>
                    <el-tag size="medium" type="danger" v-if="scope.row.category === 2">批量</el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="content" label="内容" min-width="110"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="msgIds" label="成功返回的msgId" min-width="110"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="sendTime" label="发送时间" min-width="110"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="type" label="类型" min-width="110">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium" type="success" v-if="scope.row.type === 1">图文</el-tag>
                    <el-tag size="medium" type="danger" v-if="scope.row.type === 0">其他</el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="250" fixed="right">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" @click="doShowView(scope.$index, scope.row)">普通结果</el-button>
                  <el-button size="mini" type="primary" @click="doShowViewVIP(scope.$index, scope.row)">VIP结果</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-main>
        <div class="self-page-container">
              <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchParams.currentPage" :page-sizes="[10,20]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
              </el-pagination>
        </div>
      </div>
      <!-- push查看结果弹窗 -->
      <el-dialog title="查看PUSH结果（普通）" :visible.sync="dialogViewVisible" width=900px class="my-table">
        <template>
            <el-table :data="ViewTable" border style="width: 100%" class="m_b_30">
              <el-table-column show-overflow-tooltip align="center" prop="androidReceived" label="Android送达" min-width="110" fixed></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="iosApnsReceived" label="iOS通知送达到设备" min-width="110"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="iosApnsSent" label="iOS通知推送到APNs成功" min-width="110"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="iosMsgReceived" label="iOS自定义消息送达数" min-width="110"></el-table-column>
            </el-table>
        </template>
      </el-dialog>
      <!-- push查看结果VIP弹窗 -->
      <el-dialog title="查看PUSH结果（VIP）" :visible.sync="dialogVIPVisible" width=900px class="my-table">
        <template>
            <el-table :data="android" border style="width: 100%" id="android" class="m_b_30">
              <el-table-column label="android" align="center" class-name='thColor'>

              <el-table-column show-overflow-tooltip align="center" prop="totalClick" label="总点击数" min-width="110" fixed></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="totalReceived" label="总到达数" min-width="110"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="totalTarget" label="总推送数" min-width="110"></el-table-column>
              
              </el-table-column>
            </el-table>
            <el-table :data="ios" border style="width: 100%" id="ios" class="m_b_30">
              <el-table-column label="ios" align="center" class-name='thColor'>

              <el-table-column show-overflow-tooltip align="center" prop="totalApnsReceived" label="总APNS通知送达数" min-width="110" fixed></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="totalApnsSent" label="总APNS通知推送成功数" min-width="110"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="totalApnsTarget" label="总APNs通知推送目标数" min-width="110"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="totalClick" label="总点击数" min-width="110"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="totalReceived" label="总自定义消息送达数" min-width="110"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="totalTarget" label="总自定义消息目标数" min-width="110"></el-table-column>
              
              </el-table-column>
            </el-table>
        </template>
      </el-dialog>
    </div>
  </div>

</template>


<script>
import { ERR_OK,GetPushRecordList,GetPushRecordInfo,GetPushRecordInfoVIP,GetPushDropList } from '@/api/api.js'
import { selectAllPackage,timestampToTime } from '@/config/mUtils.js'
import headerTop from '@/components/headTop.vue'
export default {
  components: {
    headerTop,
  },
  data() {
    return {
      totalCount:0,
      loading:false,
      ViewTable:[
      ],//push结果
      SelectList:[],
      android: [{
        totalClick: 0,
        totalReceived: 0,
        totalTarget: 0
      }],
      ios: [{
        totalApnsReceived: 0,
        totalApnsSent: 0,
        totalApnsTarget: 0,
        totalClick: 0,
        totalReceived: 0,
        totalTarget: 0
      }],
      oldOptions:[], // 用来储存上一次的数据
      selectAll_character:'quanxuan',
      title:"提示",//this.$alert的标题
      searchParams: {
        currentPage: 1,
        pageSize: 10,
        type: 1
        },
      tableData: [], //列表数据
      dialogViewVisible: false, //push结果
      dialogVIPVisible: false, //push结果VIP
      formLabelWidth: '100px',
      formLabelWidth2: '120px',
    }
  },
  methods: {
    handleSizeChange: function(size) {
      this.searchParams.pageSize = size;
      this.getList();
    },
    handleCurrentChange: function(currentPage) {
      this.searchParams.currentPage = currentPage;
      this.getList();
    },
    doSearch() {
      this.searchParams.currentPage = 1;
      this.getList();
    },

    //用户反馈统计数据
    getList() {
        this.loading = true;
        let params = {
            currentPage:this.searchParams.currentPage,
            pageSize: this.searchParams.pageSize,
            type: this.searchParams.type,
      };
      GetPushRecordList(params).then(res => {
         if ((res.code === ERR_OK)) {
          this.tableData = [];
          this.tableData = res.data.list;
          this.totalCount = res.data.totalCount;
          this.loading = false;
        } else {
          this.$alert('获取用户反馈统计数据失败', this.title,{center:true});
          this.loading = false;
        }
      }).catch(() => {
          this.$message.error('网络错误，请重试');
          this.loading = false;
        });
    },
    getSelectData(){
      let params = {};
      GetPushDropList(params).then(res => {
          if (res.code === ERR_OK) {
            this.SelectList = res.data;
          } else {
            IsAlert(res.msg,'错误','error');
          }
          ;
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
          this.loading = false;
        });
    },
    // 查看结果
      doShowView(index, row) {
        this.loading = true;
        let params = {
          id: row.msgIds,
        };
        GetPushRecordInfo(params).then(res => {
          if (res.code === ERR_OK) {
            this.ViewTable = [];
            this.ViewTable.push(res.data);
            this.loading = false;
            this.dialogViewVisible = true;
          } else {
            IsAlert(res.msg,'错误','error');
            this.loading = false;
          }
          ;
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
          this.loading = false;
        });
      },
    // 查看结果VIP
      doShowViewVIP(index, row) {
        this.loading = true;
        let params = {
          id: row.msgIds,
        };
        GetPushRecordInfoVIP(params).then(res => {
          if (res.code === ERR_OK) {
            this.android = [];
            this.android.push(res.data.android);
            this.ios = [];
            this.ios.push(res.data.ios);
            this.loading = false;
            this.dialogVIPVisible = true;
          } else {
            IsAlert(res.msg,'错误','error');
            this.loading = false;
          }
          ;
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
          this.loading = false;
        });
      },
  },
  activated: function() {
    this.getList();
    this.getSelectData();
  },
}
</script>

<style lang="less" scoped>
  html {
    /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
    -ms-overflow-style: none !important;
    /*火狐下隐藏滚动条*/
    overflow: -moz-scrollbars-none !important;
    ::-webkit-scrollbar {
    width: 0px !important;
  }
  }

  /*Chrome下隐藏滚动条，溢出可以透明滚动*/
  html ::-webkit-scrollbar {
    width: 0px !important;
  }
#scroller{
    /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  ::-webkit-scrollbar {
    width: 10px !important;
    height: 10px !important;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    // background: #f6f6f6 !important;
    // border-radius: 2px !important;
    box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    border-radius: 10px;
    background-color: #F5F5F5;
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    background: #aaa !important;
    border-radius: 2px !important;
  }

}
.el-checkbox {
  margin-left: 10px;
}
.el-select {
  display: block;
}
.el-date-editor {
  width: 100%;
}
.el-input {
  margin-bottom: 15px;
}
.m_l_15{
  margin-left: 15px;
}
.el-header,.el-main,.el-footer{
  padding:0;
}

</style>
<style lang="less">
.el-table {
  .table-head-SMS {
    color: #273746;
  }
}
.my-table{
  #android{
    th.thColor{
      background:#D6EAF8 !important;
    }
    th.thColor div{
      background:#D6EAF8 !important;
    }
  }
  #ios{
    th.thColor{
      background-color:#D6EAF8 !important;
    }
    th.thColor div{
      background:#D6EAF8 !important;
    }
  }
}
</style>

