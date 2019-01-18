<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">

      <!-- 服务页面 -->
      <div>
        <el-header height="30">
          <!-- 操作行-->
        </el-header>

        <el-main class="my-table" id="scroller" v-loading.fullscreen.lock="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)">
          <!-- 列表 -->
          <template>
            <el-table :data="tableData" border style="width: 100%" id="app">
              <el-table-column show-overflow-tooltip align="center" type="index" label="" fixed></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="departName" label="机构名称" min-width="110"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="realName" label="真实姓名" min-width="110" fixed></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="rebackMethod" label="处理方式" min-width="110"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="mobile" label="手机号" min-width="110"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="feedbackContent" label="反馈内容" min-width="110"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="createDate" label="创建时间" min-width="110"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="id" label="id" min-width="110"></el-table-column>
            </el-table>
          </template>
        </el-main>
        <div class="self-page-container">
              <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchParams.currentPage" :page-sizes="[10,20]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
              </el-pagination>
        </div>
      </div>
    </div>
  </div>

</template>


<script>
import { ERR_OK,GetCusFeedBackList} from '@/api/api.js'
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
      ViewTable:{},//查看
      oldOptions:[], // 用来储存上一次的数据
      selectAll_character:'quanxuan',
      title:"提示",//this.$alert的标题
      searchParams: {
        currentPage: 1,
        pageSize: 10,
        },
      tableData: [], //列表数据
      dialogViewVisible: false, //优惠券查看
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
      this.getList();
    },

    //用户反馈统计数据
    getList() {
      this.loading = true;
        let params = {
            currentPage:this.searchParams.currentPage,
            pageSize: this.searchParams.pageSize,
      };
      GetCusFeedBackList(params).then(response => {
         if ((response.code === ERR_OK)) {
          this.tableData = [];
          this.tableData = response.data.list;
          this.totalCount = response.data.totalCount;
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
  },
  activated: function() {
    this.getList();
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
  #app{
    th.SMSall{
      background:#D6EAF8 !important;
    }
    th.SMSall div{
      background:#D6EAF8 !important;
    }
  }
}
</style>

