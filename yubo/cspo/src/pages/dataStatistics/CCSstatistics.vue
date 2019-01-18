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
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          <el-form-item label="机构：">
              <el-select class="orSec" v-model="searchParams.unitCodeList" filterable multiple collapse-tags placeholder="请选择" @change='selectAll'>
                    <el-option v-for="item in institutionList" :key="item.institutionCode" :label="item.institutionName" :value="item.institutionCode">
                    </el-option>
              </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="doSearch()">搜索</el-button>
            <el-button type="primary" @click="clean()" plain>清空</el-button>
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
            <el-table :data="tableData" border style="width: 100%" id="app" :height="fullHeight" :header-cell-class-name="tableheaderClassName">
              <el-table-column show-overflow-tooltip align="center" type="index" label="" fixed></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="unitName" label="机构名称" min-width="110"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" class-name='date' prop="date" label="时间" min-width="110" fixed></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="oneNum" label="一次计划数量" min-width="110"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="twoNum" label=" 二次计划数量" min-width="110"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="threeNum" label="一次计划补发数量" min-width="110"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="fourNum" label="二次计划补发数量" min-width="110"></el-table-column>
              <!-- <el-table-column show-overflow-tooltip align="center" prop="unitCode" label="机构代码" min-width="110"></el-table-column> -->
            </el-table>
          </template>

        </el-main>
      </div>
    </div>
  </div>

</template>


<script>
import { ERR_OK,GetCCSStaticsList,getAllins} from '@/api/api.js'
import { selectAllPackage,timestampToTime } from '@/config/mUtils.js'
import headerTop from '@/components/headTop.vue'
export default {
  components: {
    headerTop,
  },
  data() {
    return {
      loading:false,
      rangeTime: [],
      institutionList: [], //机构数据
      ViewTable:{},//查看
      oldOptions:[], // 用来储存上一次的数据
      selectAll_character:'quanxuan',
      title:"提示",//this.$alert的标题
      searchParams: {
        endDate: "",
        startDate: "",
        unitCode: "",
        unitCodeList: []},
      tableData: [], //列表数据
      dialogViewVisible: false, //优惠券查看
      formLabelWidth: '100px',
      formLabelWidth2: '120px',
      fullHeight: document.documentElement.clientHeight - 170
    }
  },
  methods: {
      //获取屏幕高度
 
    beforeMount(height) {
 
        var h = document.documentElement.clientHeight || document.body.clientHeight;
 
        this.curHeight =h - height; //减去页面上固定高度height
 
    },
    selectAll(val) {
          let selectall = selectAllPackage(val,this.institutionList,this.oldOptions,this.searchParams.unitCodeList,this.selectAll_character);
          this.oldOptions = selectall[0];
          this.searchParams.unitCodeList = selectall[1];
          },
      tableheaderClassName({ row, rowIndex }) {
          return "table-head-SMS";
        },
      clean(){
        this.rangeTime=[];
        this.searchParams= {
        endDate: "",
        startDate: "",
        unitCode: "",
        unitCodeList: []};
        this.getList();
      },
      /*获取时间*/
      getselTime() {
        if (this.rangeTime) {
          this.searchParams.startDate = this.rangeTime[0];
          this.searchParams.endDate = this.rangeTime[1];
        }else{
          this.searchParams.startDate = '';
          this.searchParams.endDate = '';
        }
      },
    doSearch() {
      this.getList();
    },


    handleCloseView(){
        this.dialogViewVisible = false;
    },


    //获取机构下拉菜单
    getSupSelect() {
      let params = {};
      getAllins(params).then(response => {
        if (response.code === ERR_OK) {
          this.institutionList = [];
          this.institutionList = response.data;
          this.institutionList.unshift({institutionCode: "quanxuan",institutionName: "全部选择"});
        } else {
          this.$alert('获取机构列表失败！', this.title,{center:true});
        }
      }).catch(() => {
          this.$message.error('网络错误，请稍后重试')
        })    },
    //获取短信注册统计数据
    getList() {
      this.loading = true;
        let params = {
            endDate:this.searchParams.endDate,
            startDate: this.searchParams.startDate,
            unitCode: this.searchParams.unitCode,
            unitCodeList: this.searchParams.unitCodeList
      };
      GetCCSStaticsList(params).then(response => {
         if ((response.code === ERR_OK)) {
          this.tableData = [];
          this.tableData = response.data;
          this.loading = false;
        } else {
          this.$alert('获取短信注册统计数据失败', this.title,{center:true});
          this.loading = false;
        }
      }).catch(() => {
          this.$message.error('网络错误，请重试');
          this.loading = false;
        });
    },
  },
  mounted() {
      const that = this
      window.onresize = () => {
        return (() => {
          window.fullHeight = document.documentElement.clientHeight
          that.fullHeight = window.fullHeight
        })()
      }
    },
  activated: function() {
    let timestamp =new Date().getTime();
    let timestamp2 =new Date().getTime()- 86400000 *6;
    this.searchParams.endDate = timestampToTime(timestamp);
    this.rangeTime[1] = timestampToTime(timestamp);
    this.searchParams.startDate = timestampToTime(timestamp2);
    this.rangeTime[0] = timestampToTime(timestamp2);
    this.rangeTime = [this.rangeTime[0],this.rangeTime[1]];
    this.getList();
    this.getSupSelect();
    this.beforeMount();
  },
   watch: {
      fullHeight (val) {
        if(!this.timer) {
          this.fullHeight = val
          this.timer = true
          let that = this
          setTimeout(function (){
            that.timer = false
          },400)
        }
      }
    }
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

