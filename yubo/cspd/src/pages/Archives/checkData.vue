<template>
  <div id="check-data">
    <div class="data-body" v-if="showDetail">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="体检报告" name="first">
          <div class="search-body">
            <el-form :inline="true" :model="searchParams" class="demo-form-inline">
              <el-form-item label="姓名">
                <el-input v-model="searchParams.customerName" placeholder="请输入姓名"></el-input>
              </el-form-item>
              <el-form-item label="体检编号">
                <el-input v-model="searchParams.workNo" placeholder="请输入体检编号"></el-input>
              </el-form-item>
              <el-form-item label="体检时间">
                <el-date-picker
                  v-model="searchParams.checkDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择体检时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="getList">查 询</el-button>
                <el-button type="primary" @click="clearParams">清 空</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="table-body">
            <el-table
              :data="tableData"
              border
              stripe
              style="width: 100%">
              <el-table-column
                type="index"
                width="50">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="customerName"
                label="客户名">
              </el-table-column>
              <el-table-column
                prop="workNo"
                show-overflow-tooltip
                label="体检编号">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="mobilphone"
                label="手机号">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="orderName"
                label="单位">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="birthday"
                label="生日">
              </el-table-column>
              <el-table-column
                label="性别">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.sex===1">男</el-tag>
                  <el-tag v-if="scope.row.sex===2">女</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="checkDate"
                label="体检时间">
              </el-table-column>
              <el-table-column
                align="center"
                label="体检类型">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.type===1">个检</el-tag>
                  <el-tag type="success" v-if="scope.row.type===2">团检</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="checkDetail(scope.row)">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="page-body" v-if="tableData.length>0">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="searchParams.currentPage"
              :page-sizes="[10, 20, 50, 80]"
              :page-size="searchParams.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              background
              :total="totalCount">
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="检查数据" name="second">敬请期待...</el-tab-pane>
      </el-tabs>
    </div>
    <div class="report-body" v-else>
      <report-page
        :checkUnitCode ='searchParams.checkUnitCode'
        :workNo ='workNo'
        @returnPage="returnPage"
      ></report-page>
    </div>
  </div>
</template>

<script>
  import {
    ERR_OK,
    getHealthRecordCheckDataList
  } from '@/api/api'
  import {getStore, EncodeDoctorId} from "@/config/mUtils.js"
  import ReportPage from "./components/reportPage"

  export default {
    name: "checkData",
    components: {
      ReportPage
    },
    data() {
      return {
        showDetail: true,
        activeName: 'first',
        userInfo: {},
        searchParams: {
          checkDate: "",
          checkUnitCode: "",
          currentPage: 1,
          customerName: "",
          pageSize: 10,
          workNo: ""
        },
        workNo:'',
        totalCount: 1,
        tableData: []
      }
    },
    activated() {
      this.userInfo = JSON.parse(getStore('userMesage'));
      this.searchParams.checkUnitCode = this.userInfo.institutionCode;
      // this.searchParams.checkUnitCode = 'bjbr046';
      this.getList()
    },
    methods: {
      handleClick(tab) {
        console.log(tab.name)
      },
      /*获取体检报告列表*/
      getList() {
        let params = {
          checkDate: this.searchParams.checkDate,
          checkUnitCode: this.searchParams.checkUnitCode,
          currentPage: this.searchParams.currentPage,
          customerName: this.searchParams.customerName,
          pageSize: this.searchParams.pageSize,
          workNo: this.searchParams.workNo
        };
        getHealthRecordCheckDataList(params)
          .then((res) => {
            if (res.code === ERR_OK) {
              this.tableData = res.data.list;
              this.totalCount = res.data.totalCount
            } else {
              this.$message({
                type: 'warning',
                message: '获取失败!',
                customClass:'err-tips'
              });
            }
          })
          .catch(() => {
            this.$message({
              type: 'danger',
              message: '网络错误!获取体检报告数据失败,请稍后重试'
            });
          })
      },
      /*根据每页条数查询*/
      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this.getList()
      },
      /*根据当前页查询*/
      handleCurrentChange(val) {
        this.searchParams.currentPage = val;
        this.getList()
      },
      /*清除参数*/
      clearParams() {
        this.searchParams.checkDate = "";
        this.searchParams.currentPage = 1;
        this.searchParams.customerName = "";
        this.searchParams.pageSize = 10;
        this.searchParams.workNo = "";
      },
      /*查看体检报告详情*/
      checkDetail(val) {
        this.workNo = val.workNo;
        this.showDetail = false;
      },
      /*关闭体检报告详情*/
      returnPage(val) {
        this.showDetail = val;
      }
    }
  }
</script>

<style scoped lang="less">
  .page-body {
    text-align: center;
    margin-top: 20px;
  }
</style>
