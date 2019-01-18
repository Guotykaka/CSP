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
          <el-form-item label="时间：">
              <el-date-picker
                v-model="rangeTime"
                @change="getselTime"
                type="daterange"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :clearable='false'>
              </el-date-picker>
         </el-form-item>
         <el-form-item label="标题：">
          <el-input placeholder="请输入标题" v-model="searchParams.title" clearable></el-input>
         </el-form-item>
         <el-form-item label="是否付费：">
          <el-select v-model="searchParams.isPay" clearable placeholder="选择是否付费">
            <el-option label="否" :value="0"></el-option>
            <el-option label="是" :value="1"></el-option>
            <el-option label="不限" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型：">
          <el-select v-model="searchParams.itemType" clearable placeholder="选择类型">
            <el-option label="图文" :value="1"></el-option>
            <el-option label="视频" :value="2"></el-option>
            <el-option label="专题" :value="3"></el-option>
            <el-option label="话题" :value="4"></el-option>
          </el-select>
        </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="doSearch()">搜索</el-button>
            <!-- <el-button type="primary" @click="clean()" plain>清空</el-button> -->
            <el-button type="primary" @click="_doHandleExcle()" plain>导出EXCEL</el-button>
          </el-form-item>
          </el-form>
          </el-row>
        </el-header>

        <el-main class="my-table" id="scroller" v-loading.fullscreen.lock="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)">
          <!-- 列表 -->
          <template>
            <el-table :data="tableData" border style="width: 100%" id="app" :header-cell-class-name="tableheaderClassName">
              <el-table-column show-overflow-tooltip align="center" type="index" label="" fixed></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="title" label="标题" min-width="110" fixed></el-table-column>
              <el-table-column show-overflow-tooltip align="center" class-name='date' prop="itemType" label="类型" min-width="110">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">
                      <el-tag size="medium" type="success" v-if="scope.row.itemType === '1'">图文</el-tag>
                      <el-tag size="medium" v-if="scope.row.itemType === '2'">视频</el-tag>
                      <el-tag size="medium" type="danger" v-if="scope.row.itemType === '3'">专题</el-tag>
                      <el-tag size="medium" type="info" v-if="scope.row.itemType === '4'">话题</el-tag>
                    </div>
                  </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="isPay" label="是否付费" min-width="110">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">
                      <el-tag size="medium" type="danger" v-if="scope.row.isPay === '0'">否</el-tag>
                      <el-tag size="medium" type="success" v-if="scope.row.isPay === '1'">是</el-tag>
                      <el-tag size="medium" v-if="scope.row.isPay === '2'">不限</el-tag>
                    </div>
                  </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="subscribeCustomNum" label="订阅总人数" min-width="110"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="onlineTime" label="上架时间" min-width="110"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="exposureNum" label="曝光总次数" min-width="110"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="exposureCustomNum" label="曝光总人数" min-width="110"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="collectionNum" label="收藏总数" min-width="110"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="clickNum" label="点击总次数" min-width="110"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="clickCustomNum" label="点击总人数" min-width="110"></el-table-column>
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
import { ERR_OK,GetNewsExposureList,getAllins} from '@/api/api.js'
import { selectAllPackage,timestampToTime } from '@/config/mUtils.js'
import {baseUrl} from '@/config/env.js'
import headerTop from '@/components/headTop.vue'
export default {
  components: {
    headerTop,
  },
  data() {
    return {
      totalCount: 0,
      loading:false,
      rangeTime: [],
      institutionList: [], //机构数据
      ViewTable:{},//查看
      oldOptions:[], // 用来储存上一次的数据
      selectAll_character:'quanxuan',
      title:"提示",//this.$alert的标题
      searchParams: {
        currentPage: 1,
        fromDate: "",//开始时间
        isPay: 2,//是否付费（0=否；1=是；2=不限） ,
        itemType: null,//类型(1:图文 2：视频 3：专题 4：话题) ,
        pageSize: 10,
        timespan: "",
        title: "",
        toDate: ""//结束时间
    },
      tableData: [], //列表数据
      dialogViewVisible: false, //优惠券查看
      formLabelWidth: '100px',
      formLabelWidth2: '120px',
      fullHeight: document.documentElement.clientHeight - 170,
      exportList:[]//导出列表数据
    }
  },
  methods: {
      //导出Excle
      _doHandleExcle() {
        this.loading = true;
        let params = {
          currentPage: 1,
          fromDate: this.searchParams.fromDate,//开始时间
          isPay: this.searchParams.isPay,//是否付费（0=否；1=是；2=不限） ,
          itemType: this.searchParams.itemType,//类型(1:图文 2：视频 3：专题 4：话题) ,
          pageSize: 1000,
          title: this.searchParams.title,
          toDate: this.searchParams.toDate//结束时间
        };
        GetNewsExposureList(params).then(response => {
          if ((response.code === ERR_OK)) {
            this.exportList = [];
            this.exportList = response.data.list;
            this.loading = false;
            this.getExportFunction();
          } else {
            this.$alert('获取曝光量统计数据失败', this.title);
            this.loading = false;
          }
        }).catch(() => {
          this.$message.error('网络错误，请重试');
          this.loading = false;
        });
      },
    /*导出订单列表*/
    getExportFunction(){
      import('@/vendor/Export2Excel').then(excel => {
        let filterName,filterHeader;
        filterName =['title',
          'itemType',
          'isPay',
          'onlineTime',
          'subscribeCustomNum',
          'exposureNum',
          'exposureCustomNum',
          'collectionNum',
          'clickNum',
          'clickCustomNum'];
        filterHeader = [
          '标题',
          '类型',
          '是否付费',
          '上架时间',
          '订阅总人数',
          '曝光总次数',
          '曝光总人数',
          '收藏总数',
          '点击总次数',
          '点击总人数'
        ];
        const tHeader = filterHeader;
        const filterVal = filterName;
        const list = this.exportList;
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '查询曝光量数据',
          autoWidth: this.autoWidth
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    tableheaderClassName({ row, rowIndex }) {
          return "table-head-SMS";
        },
      clean(){
        this.rangeTime=[];
        this.searchParams= {
            currentPage: 1,
            fromDate: "",//开始时间
            isPay: 2,//是否付费（0=否；1=是；2=不限） ,
            itemType: null,//类型(1:图文 2：视频 3：专题 4：话题) ,
            pageSize: 10,
            timespan: "",
            title: "",
            toDate: ""//结束时间
        };
        this.getList();
      },
      /*获取时间*/

      getselTime() {
        if (this.rangeTime) {
          this.searchParams.fromDate = this.rangeTime[0];
          this.searchParams.toDate = this.rangeTime[1];
        }else{
          this.searchParams.fromDate = '';
          this.searchParams.toDate = '';
        }
      },
    doSearch() {
      this.getList();
    },

    handleSizeChange: function(size) {
      this.searchParams.pageSize = size;
      this.getList();
    },
    handleCurrentChange: function(currentPage) {
      this.searchParams.currentPage = currentPage;
      this.getList();
    },
    handleCloseView(){
        this.dialogViewVisible = false;
    },
    //查询曝光量统计列表
    getList() {
      this.loading = true;
        let params = {
            currentPage: this.searchParams.currentPage,
            fromDate: this.searchParams.fromDate,//开始时间
            isPay: this.searchParams.isPay,//是否付费（0=否；1=是；2=不限） ,
            itemType: this.searchParams.itemType,//类型(1:图文 2：视频 3：专题 4：话题) ,
            pageSize: this.searchParams.pageSize,
            title: this.searchParams.title,
            toDate: this.searchParams.toDate//结束时间
      };
      GetNewsExposureList(params).then(response => {
         if ((response.code === ERR_OK)) {
          this.tableData = [];
          this.tableData = response.data.list;
          this.totalCount = response.data.totalCount;
          this.loading = false;
        } else {
          this.$alert('获取曝光量统计数据失败', this.title,{center:true});
          this.loading = false;
        }
      }).catch(() => {
          this.$message.error('网络错误，请重试');
          this.loading = false;
        });
    },
  },
  activated: function() {
    let timestamp =new Date().getTime();
    let timestamp2 =new Date().getTime()- 86400000 *6;
    this.searchParams.toDate = timestampToTime(timestamp);
    this.rangeTime[1] = timestampToTime(timestamp);
    this.searchParams.fromDate = timestampToTime(timestamp2);
    this.rangeTime[0] = timestampToTime(timestamp2);
    this.rangeTime = [this.rangeTime[0],this.rangeTime[1]];
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

