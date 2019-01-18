<template>
  <div class="page-wrapper" id="scroller">
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
          <!-- <el-form-item  label="开始时间：">
            <el-date-picker
            v-model="searchParams.startDate"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item  label="结束时间：">
            <el-date-picker
            v-model="searchParams.endDate"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            >
          </el-date-picker>
          </el-form-item> -->
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

        <el-main class="my-table" v-loading.fullscreen.lock="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)">
          <!-- 列表 -->
          <template>
            <el-table :data="tableData" border style="width: 100%" id="app" height="650" :header-cell-class-name="tableheaderClassName">
              <!-- <el-table-column show-overflow-tooltip align="center" type="index" label=""></el-table-column> -->
              <el-table-column show-overflow-tooltip align="center" class-name='date' prop="date" label="时间" width="120" fixed></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="unitName" label="机构" width="80"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="registerCount" label="注册人数" width="80"></el-table-column>
              <el-table-column label="电话报告解读" class-name='phone' align="center">
              <el-table-column show-overflow-tooltip align="center" prop="telOrderUserCount" label="下单人数" width="80"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="telPayUserCount" label="支付人数" width="80"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="telPayRate" label="支付转化率" width="80">
                <template slot-scope="scope">
                  <span>{{Math.floor(scope.row.telPayRate*100)}}%</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="telOrderRate" label="下单率" width="80">
                <template slot-scope="scope">
                  <span>{{Math.floor(scope.row.telOrderRate*100)}}%</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="telRefundUserCount" label="退单人数" width="80"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="telRefundRate" label="退单率" width="80">
                <template slot-scope="scope">
                  <span>{{Math.floor(scope.row.telRefundRate*100)}}%</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="telPayOldUserCount" label="支付客户属性--新用户" width="120"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="telPayNewUserCount" label="支付客户属性--老用户" width="120"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="telDayRevenue" label="当日营收" width="80"></el-table-column>
              </el-table-column>
              <el-table-column label="一元听"  align="center" class-name='YYting'>
              <el-table-column show-overflow-tooltip align="center" prop="oneOrderUserCount" label="下单人数" width="80"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="onePayUserCount" label="支付人数" width="80"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="onePayRate" label="支付转化率" width="80">
                <template slot-scope="scope">
                  <span>{{Math.floor(scope.row.onePayRate*100)}}%</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="oneOrderRate" label="下单率" width="80">
                <template slot-scope="scope">
                  <span>{{Math.floor(scope.row.oneOrderRate*100)}}%</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="onePayNewUserCount" label="支付客户属性--新用户" width="120"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="onePayOldUserCount" label="支付客户属性--老用户" width="120"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="oneDayRevenue" label="当日营收" width="80"></el-table-column>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="totalRevenue" label="总营收"></el-table-column>
            </el-table>
          </template>

        </el-main>
      </div>
    </div>
  </div>

</template>


<script>
import { ERR_OK,GetOrderStaticsList,getAllins } from '@/api/api.js'
import { selectAllPackage,timestampToTime } from '@/config/mUtils.js'
import headerTop from '@/components/headTop.vue'
export default {
  components: {
    headerTop,
  },
  data() {
    return {
      loading:false,
      oldOptions:[], // 用来储存上一次的数据
      // ListLength:null,
      selectAll_character:'quanxuan',
      rangeTime: [],
      institutionList: [], //机构数据
      ViewTable:{},//查看
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
    }
  },
  methods: {
        selectAll(val) {
          let selectall = selectAllPackage(val,this.institutionList,this.oldOptions,this.searchParams.unitCodeList,this.selectAll_character);
          this.oldOptions = selectall[0];
          this.searchParams.unitCodeList = selectall[1];
          // const allValues = []
          // // 保留所有值
          // for (const item of this.institutionList) {
          // allValues.push(item.institutionCode)
          // }
          // // 用来储存上一次的值，可以进行对比
          // const oldVal = this.oldOptions.length === 1 ? this.oldOptions[0] : []
          // // 若是全部选择
          // if (val.includes('quanxuan')) this.searchParams.unitCodeList = allValues

          // // 取消全部选中 上次有 当前没有 表示取消全选
          // if (oldVal.includes('quanxuan') && !val.includes('quanxuan')) this.searchParams.unitCodeList = []
          // // 点击非全部选中 需要排除全部选中 以及 当前点击的选项
          // // 新老数据都有全部选中
          // if (oldVal.includes('quanxuan') && val.includes('quanxuan')) {
          // const index = val.indexOf('quanxuan')
          // val.splice(index, 1) // 排除全选选项
          // this.searchParams.unitCodeList = val
          // }
          // // 全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
          // if (!oldVal.includes('quanxuan') && !val.includes('quanxuan')) {
          // if (val.length === allValues.length - 1) this.searchParams.unitCodeList = ['quanxuan'].concat(val)
          // }
          // // 储存当前最后的结果 作为下次的老数据
          // this.oldOptions[0] = this.searchParams.unitCodeList
          },
      tableheaderClassName({ row, rowIndex }) {
          return "table-head-th";
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
          // this.ListLength=this.institutionList.length;
        } else {
          this.$alert('获取机构列表失败！', this.title,{center:true});
        }
      }).catch(() => {
          this.$message.error('网络错误，请稍后重试')
        })
    },
    //获取订单统计数据
    getList() {
      this.loading = true;
        // this.searchParams.unitCodeList.length === this.ListLength ? this.searchParams.unitCodeList.shift() : this.searchParams.unitCodeList;
        let params = {
            endDate:this.searchParams.endDate,
            startDate: this.searchParams.startDate,
            unitCode: this.searchParams.unitCode,
            unitCodeList: this.searchParams.unitCodeList
      }
      GetOrderStaticsList(params).then(response => {
         if ((response.code === ERR_OK)) {
          this.tableData = [];
          this.tableData = response.data;
          this.loading = false;
        } else {
          this.$alert('获取订单统计数据失败', this.title,{center:true});
          this.loading = false;
        }
      }).catch(() => {
          this.$message.error('网络错误，请稍后重试');
          this.loading = false;
        });
    },
  },
   //  watch:{
  //       editTable:{
  //           handler(val, oldVal){
  //               console.log("editTable: "+val.productPrice, oldVal.productPrice);
  //           },
  //           deep:true
  //       }
  //       },
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
  },
}
</script>

<style lang="less" scoped>
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
  .table-head-th {
    color: #273746;
  }
}

.my-table{
  #app{
    th.phone{
      background:#D6EAF8 !important;
    }
    th.phone div{
      background:#D6EAF8 !important;
    }
    th.YYting{
      background:#FCF3CF !important;
    }
    th.YYting div{
      background:#FCF3CF !important;
    }
  }
}
  .orSec {
    .el-input__inner {
    width: 300px !important;
  }
  .el-select__tags{
    max-width: 400px !important;
  }
  }
</style>

