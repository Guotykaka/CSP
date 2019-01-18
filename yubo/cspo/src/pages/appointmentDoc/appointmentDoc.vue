<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div
      class="page-container"
      v-loading="loading2"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <!-- 体检预约管理页面 -->
      <el-header height="30">
        <!-- 操作行-->
        <el-row>
          <el-form id="SearchBar" :model="searchParams" :inline="true" class="demo-form-inline">
            <el-form-item label="套餐名称：">
              <el-input v-model="searchParams.examPackageName" placeholder="请填写套餐名称" @keyup.enter.native="doSearch()"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="用户名：">
              <el-input v-model="searchParams.name" placeholder="请填写用户名" @keyup.enter.native="doSearch()"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="手机号：">
              <el-input v-model="searchParams.mobile" placeholder="请填写手机号" @keyup.enter.native="doSearch()"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="预约时间：">
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
            <el-form-item label="机构名称：">
              <el-input v-model="searchParams.institutionName" placeholder="请填写机构名称" @keyup.enter.native="doSearch()"
                        clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="doSearch()" class="m_l_15">搜 索</el-button>
              <el-button type="primary" @click="clearParams()" class="m_l_15">清 空</el-button>
            </el-form-item>
          </el-form>
        </el-row>
      </el-header>

      <el-main>
        <el-table :data="tableData" border style="width: 100%" id="app">
          <el-table-column show-overflow-tooltip align="center" type="index" label="序号" width="80"></el-table-column>
          <el-table-column show-overflow-tooltip align="center" prop="name" label="用户名"></el-table-column>
          <el-table-column show-overflow-tooltip align="center" prop="mobile" label="手机号"></el-table-column>
          <el-table-column show-overflow-tooltip align="center" label="预约类型">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.appointmentType===1">团 检</el-tag>
              <el-tag type="success" v-if="scope.row.appointmentType===2">个 检</el-tag>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" prop="institutionName" label="体检机构"></el-table-column>
          <el-table-column show-overflow-tooltip align="center" prop="examPackageName" label="体检套餐"></el-table-column>
          <el-table-column show-overflow-tooltip align="center" label="是否加项">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.whetherAddition===1">是</el-tag>
              <el-tag type="danger" v-if="scope.row.whetherAddition===0">否</el-tag>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" label="检查日期">
            <template slot-scope="scope">
              <span>{{scope.row.checkDate | getSlice}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" prop="whetherExamed" label="到检状态">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.whetherExamed===1">已到检</el-tag>
              <el-tag type="danger" v-if="scope.row.whetherExamed===0">未到检</el-tag>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" label="修改时间">
            <template slot-scope="scope">
              <span>{{scope.row.updateTime | getSlice}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="220">
            <template slot-scope="scope">
              <el-button size="mini" v-if="scope.row.whetherAddition===1" type="primary"
                         @click="handleView(scope.$index, scope.row)">查 看
              </el-button>
              <el-button size="mini" type="info" disabled v-else>查 看</el-button>
              <el-button size="mini" v-if="scope.row.whetherExamed===0" type="danger"
                         @click="handleEdit(scope.$index, scope.row)">修改时间
              </el-button>
              <el-button size="mini" type="info" v-else disabled v-else>修改时间</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>

      <div class="self-page-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="searchParams.currentPage" :page-sizes="[10,20]" :page-size="searchParams.pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>

      <!-- 体检预约编辑弹窗 -->
      <el-dialog title="修改时间" :visible.sync="dialogEditVisible" width=800px :before-close="handleCloseEidt"
                 custom-class="changeDateBox">

        <el-form :model="changDate">
          <!--<el-form-item class="is-required2" label="预约时间" :label-width="formLabelWidth2">
            <el-col :span="24" class="timer">
              <el-date-picker
                v-model="changDate.reserDate"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-col>
          </el-form-item>-->
          <el-form-item class="is-required2" label="预约时间" :label-width="formLabelWidth2">
            <!--<el-col :span="24" class="timer">
              <el-select v-model="changDate.reserDate" placeholder="请选择">
                <el-option
                  v-if="item.dateType===0"
                  v-for="(item,index) in options"
                  :key="index"
                  :label="item.dateRestDay"
                  :value="item.dateRestDay">
                </el-option>
              </el-select>
            </el-col>-->
            <el-row class="week-border-box">
              <el-col class="timer">
                <el-input v-model="changDate.reserDate" readonly @focus="clickHandle"
                          @change="clickHandleEnd"></el-input>
              </el-col>
              <!--              <el-col justify="space-around" v-for="(item,index) in daynamearr" :key="index"><div class="grid-week">{{item}}</div></el-col>-->
              <el-col class="week-border" v-if="showWeekList">
                <div class="weekBox">
                  <span class="grid-week" v-for="(item,index) in daynamearr" :key="index">{{item}}</span>
                </div>
                <!--v-bind:class="{ active: isActive, 'text-danger': hasError }"-->
                <div class="dateBox" v-for="(value,dateIndex) in dateSelect" :key="dateIndex"
                     v-if="mounthNum===dateIndex">
                  <p class="date-box-title"><b class="arrow-left el-icon-arrow-left" @click="clickLeft"></b>{{value.createTime}}月份<b
                    class="arrow-right el-icon-arrow-right" @click="clickRight"></b></p>
                  <span class="grid-week" v-for="spaceNum in weekDele(value)"></span>
                  <p class="grid-week week-hover" :class="{'week-click':changDate.reserDate===dateNum.dateRestDay}"
                     v-for="(dateNum,dateNumIndex) in value.data" :key="dateNumIndex" @click="sureDate(dateNum)">
                    <b class="resetIcon" v-if="dateNum.dateType===1">休</b>
                    {{dateNum.dateRestDay | getSliceDate}}</p>
                </div>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>

        <div class="btn-row">
          <el-button size="small" type="primary" @click="_doHandleEdit_YYT()">保存</el-button>
          <el-button size="small" type="primary" @click="_doCancel_YYT()">取消</el-button>
        </div>
      </el-dialog>

      <!-- 体检预约查看加项弹窗 -->
      <el-dialog title="体检加项" :visible.sync="dialogViewVisible" width=800px :before-close="handleCloseView"
                 :center="true" custom-class="elHeight">
        <div class="card-body" v-if="ViewItem.length>0">
          <el-card class="m_b_10" v-for="o in ViewItem" :key="o.productName" shadow="hover">
            <el-row :gutter="20">
              <el-col :span="18">{{o.productName}}</el-col>
              <el-col :span="6">{{o.productPrice}}元</el-col>
            </el-row>
          </el-card>
        </div>
        <p v-else style="text-align:center;">暂无数据</p>
      </el-dialog>
    </div>
  </div>

</template>

<script>
  import {
    ERR_OK,
    getExamDetail,
    getExamList,
    getExamMent,
    appListCanReservationDate
  } from '@/api/api.js'
  import headerTop from '@/components/headTop.vue'
  import {getStore,IsAlert} from '@/config/mUtils.js'

  export default {
    components: {
      headerTop
    },
    data() {
      return {
        loading2: false,
        changDate: {
          examAppointmentId: null,
          reserDate: '',
          customId: ''
        },
        rangeTime: null,
        totalCount: 0,
        ViewItem: [],
        options: [],//可修改时间列表
        searchParams: {
          currentPage: 1,
          pageSize: 10,
          endTime: "",
          startTime: "",
          examPackageName: "",//套餐名称
          institutionName: "",//机构名称
          mobile: "",
          name: "",
        },
        tableData: [], //体检预约列表数据
        dialogEditVisible: false, //体检预约编辑
        dialogViewVisible: false, //体检预约查看
        formLabelWidth2: '170px',
        daynamearr: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        dateSelect: [],
        showWeekList: false,
        mounthNum: 0,//默认显示第一项
        doublick:true//双击
      }
    },
    methods: {
      /*获取时间*/
      getselTime() {
        if (this.rangeTime) {
          this.searchParams.startTime = this.rangeTime[0];
          this.searchParams.endTime = this.rangeTime[1];
        }
      },
      /*搜索方法*/
      doSearch() {
        this.searchParams.currentPage = 1;
        this.getList()
      },
      /*清空搜索参数*/
      clearParams() {
        this.searchParams = {
          currentPage: 1,
          pageSize: 10,
          endTime: "",
          startTime: "",
          examPackageName: "",//套餐名称
          institutionName: "",//机构名称
          mobile: "",
          name: "",
        }
      },
      /*页面条数选择*/
      handleSizeChange(size) {
        this.searchParams.pageSize = size;
        this.getList()
      },
      /*当前页选择*/
      handleCurrentChange(currentPage) {
        this.searchParams.currentPage = currentPage;
        this.getList()
      },
      /*获取体检预约列表*/
      getList() {
        let params = {
          currentPage: this.searchParams.currentPage,
          pageSize: this.searchParams.pageSize,
          endTime: this.searchParams.endTime,
          startTime: this.searchParams.startTime,
          examPackageName: this.searchParams.examPackageName,//套餐名称
          institutionName: this.searchParams.institutionName,//机构名称
          mobile: this.searchParams.mobile,
          name: this.searchParams.name,
        };
        getExamList(params).then(response => {
          if (response.code === ERR_OK) {
            this.tableData = [];
            this.tableData = response.data.list;
            this.totalCount = response.data.totalCount
          } else {
            IsAlert(res.msg,'错误','error');
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试')
        })
      },
      /*查看*/
      handleView(index, row) {
        this.dialogViewVisible = true;
        this.changDate.customId = row.customId;
        let params = {
          id: row.examAppointmentId
        };
        getExamDetail(params).then((res) => {
          if (res.code === ERR_OK) {
            this.ViewItem = [];
            this.ViewItem = res.data;
          } else {
            IsAlert(res.msg,'错误','error');
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试')
        })
      },
      /*关闭查看弹窗*/
      handleCloseView() {
        this.dialogViewVisible = false;
      },
      /*修改时间*/
      handleEdit(index, row) {
        this.loading2 = true;
        this.showWeekList = false;
        this.mounthNum = 0;
        this.changDate.examAppointmentId = row.examAppointmentId;
        this.changDate.customId = row.customId;
        this.changDate.reserDate = row.checkDate.slice(0, 10);
        let params = {
          accessToken: "string",
          institutionID: row.institutionId
        };
        appListCanReservationDate(params).then((res) => {
          if (res.code === ERR_OK) {
            this.loading2 = false;
            this.dialogEditVisible = true;
            this.options = [];
            this.options = res.data;
          } else {
            this.loading2 = false;
            IsAlert(res.msg,'错误','error');
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试');
          this.loading2 = false;
        })
      },
      /*取消修改时间*/
      _doCancel_YYT() {
        this.handleCloseEidt();
        this.$message({
          type: 'warning',
          message: '取消编辑'
        })
      },
      /*确定修改时间*/
      _doHandleEdit_YYT() {
        let params = {
          examAppointmentId: this.changDate.examAppointmentId,
          reserDate: this.changDate.reserDate+ ' 00:00:00',
          customId: this.changDate.customId
        };
        if(this.doublick){
          this.doublick = false;
          getExamMent(params).then((res) => {
            if (res.code === ERR_OK) {
              this.getList();
              this.handleCloseEidt();
            }
            this.doublick = true;
            IsAlert(res.msg,'成功','success');
          }).catch(()=>{
            this.$message.error('网络错误!请稍后重试');
            this.doublick = true;
          });
        }

      },
      /*关闭编辑弹窗*/
      handleCloseEidt() {
        this.dialogEditVisible = false;
      },
      /*星期处理*/
      weekDele(val) {
        let value;
        let arr = val.data;
        if (val) {
          var myDate = new Date(arr[0].dateRestDay);
          let weekDate = myDate.getDay();
          if (weekDate === 0) {
            value = []
          }
          if (weekDate === 1) {
            value = [0]
          }
          if (weekDate === 2) {
            value = [0, 1]
          }
          if (weekDate === 3) {
            value = [0, 1, 2]
          }
          if (weekDate === 4) {
            value = [0, 1, 2, 3]
          }
          if (weekDate === 5) {
            value = [0, 1, 2, 3, 4]
          }
          if (weekDate === 6) {
            value = [0, 1, 2, 3, 4, 5]
          }
        }
        return value || val
      },
      clickLeft() {
        if (this.mounthNum > 0) {
          this.mounthNum--;
        } else {
          this.mounthNum = 0;
        }
      },
      clickRight() {
        if (this.mounthNum < 2) {
          this.mounthNum++;
        } else {
          this.mounthNum = 2;
        }
      },
      sureDate(val) {
        if(val.dateType===1){
          return
        }
        this.changDate.reserDate = val.dateRestDay;
        this.showWeekList = false;
      },
      /*选择日期*/
      clickHandle() {
        this.showWeekList = true;
      },
      clickHandleEnd() {
        this.showWeekList = false;
      }
    },
    filters: {
      /*日期截取函数*/
      getSlice(val) {
        if (val) {
          val = val.slice(0, 10);
        }
        return val;
      },
      getSliceDate(val) {
        if (val) {
          val = val.slice(8, 10);
        }
        return val;
      },
    },
    watch: {
      options(value) {
        let arr = [], arrKey = [], dateValue;
        var aaa = value;
        if (aaa) {
          aaa.forEach((v) => {
            dateValue = v.dateRestDay.slice(5, 7);
            if (arrKey.indexOf(dateValue) === -1) {
              arrKey.push(dateValue);
              arr.push({
                createTime: dateValue,
                data: []
              })
            }
            for (var i = 0; i < arr.length; i++) {
              if (arr[i].createTime === dateValue) {
                arr[i].data.push(v);
              }
            }
          })
        }
        this.dateSelect = arr;
      }
    },
    activated() {
      this.getList()
    }
  }
</script>

<style lang="less" scoped>
  .el-input {
    margin-bottom: 15px;
  }

  .link-line {
    position: absolute;
    top: 0;
    right: 70%;
    line-height: 34px;
    width: 25px;
    text-align: center;
  }

  .m_l_0 {
    margin-left: 0;
  }

  .btn-row {
    text-align: center;
    padding-top: 340px;
  }

  .el-header,
  .el-main,
  .el-footer {
    padding: 0;
  }

  /*日期列表*/
  .week-border-box {
    position: relative;
  }

  .week-border {
    width: 350px;
    min-height: 350px;
    background: #fff;
    position: absolute;
    top: 55px;
    left: 20px;
    z-index: 100;
  }

  .weekBox {
    width: 350px;
    background: #409EFF;
    color: #fff;
    text-align: center;
    overflow: hidden;
    .grid-week {
      width: 40px;
      flex: 1;
      padding: 5px 5px;
      line-height: 36px;
      float: left;
      display: inline-block;
    }
  }

  .dateBox {
    width: 350px;
    text-align: center;
    overflow: hidden;
    .date-box-title {
      display: block;
      font-size: 16px;
      line-height: 36px;
      .arrow-left {
        font-size: 28px;
        padding-top: 4px;
        padding-left: 10px;
        float: left;
        cursor: pointer;
      }
      .arrow-right {
        font-size: 28px;
        padding-top: 4px;
        float: right;
        padding-right: 10px;
        cursor: pointer;
      }
    }
    .grid-week {
      width: 40px;
      flex: 1;
      padding: 5px 5px;
      line-height: 36px;
      float: left;
      display: inline-block;
      position: relative;
      .resetIcon {
        width: 18px;
        height: 18px;
        display: block;
        font-size: 9px;
        line-height: 18px;
        border-radius: 50%;
        position: absolute;
        color: #fff;
        top: 0;
        right: 5px;
        background: #FF3862;
      }
    }
    .week-hover:hover {
      background: #409EFF;
      cursor: pointer;
      color: #fff;
      border-radius: 5px;
    }
    .week-click {
      background: #E6A23C;
      color: #fff;
      border-radius: 5px;
    }
  }

</style>
<style lang="less">
  .elHeight .el-dialog__body {
    min-height: 20vh;
  }

  .changeDateBox {
    height: 600px !important;
    .el-dialog__body {
      height: 500px;
    }
  }

  .timer .el-input__inner {
    width: 400px;
  }

  .el-form-item {
    &.is-required2 {
      .el-form-item__label {
        &:after {
          content: '*';
          color: #f56c6c;
          margin-left: 4px;
        }
      }
    }
  }
</style>

