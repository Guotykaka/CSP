<template>
  <div id="reservation-task">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="预约任务管理" name="first">
        <div class="search-body">
          <el-form :inline="true" :model="searchParams" class="demo-form-inline">
            <el-form-item label="套餐名称">
              <el-input v-model="searchParams.examPackageName" placeholder="请输入套餐名称"></el-input>
            </el-form-item>
            <el-form-item label="用户名">
              <el-input v-model="searchParams.name" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="searchParams.mobile" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="预约时间">
              <el-date-picker
                v-model="timeValue"
                @change="getselTime"
                type="daterange"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getList">查询</el-button>
              <el-button type="primary" @click="clearParams">清空</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="table-body">
          <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="name"
              label="用户名">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="mobile"
              label="手机号">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="idCard"
              label="身份证号码">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="体检类型">
              <template slot-scope="scope">
                <el-tag>个 检</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="productName"
              label="体检套餐">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="appointmentTime"
              label="检查时间">
            </el-table-column>
            <el-table-column
              label="预约状态">
              <template slot-scope="scope">
                <!--<common-server :appointmentStatus = 'scope.row.appointmentStatus'></common-server>-->
                <el-tag type="warning" v-if="scope.row.appointmentStatus===15">待预约</el-tag>
                <el-tag type="info" v-if="scope.row.appointmentStatus===16">预约待审核</el-tag>
                <el-tag type="success" v-if="scope.row.appointmentStatus===17">预约成功</el-tag>
                <el-tag type="success" v-if="scope.row.appointmentStatus===10">预约成功</el-tag>
                <el-tag type="success" v-if="scope.row.appointmentStatus===20">预约成功</el-tag>
                <el-tag type="danger" v-if="scope.row.appointmentStatus===18">预约拒绝</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="到检状态">
              <template slot-scope="scope">
                <el-tag type="warning" v-if="scope.row.appointmentStatus===17">待到检</el-tag>
                <el-tag type="success" v-if="scope.row.appointmentStatus===10">已到检</el-tag>
                <el-tag type="danger" v-if="scope.row.appointmentStatus===20">已过期</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="updateTime"
              label="修改时间">
            </el-table-column>
            <el-table-column
              align="center"
              width="300"
              label="操作">
              <template slot-scope="scope">
                <el-button v-if="scope.row.appointmentStatus===16" @click="cancleClick(scope.row)" type="danger"
                           size="small">预约拒绝
                </el-button>
                <el-button v-if="scope.row.appointmentStatus===16" :disabled="!judgeDate(scope.row.appointmentTime)"
                           @click="agreenClick(scope.row)" type="success" size="small">预约通过
                </el-button>
                <el-button @click="checkBtn(scope.$index, scope.row)" type="primary" size="small">查 看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="table-page" v-if="tableData.length>0">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="searchParams.currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="searchParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="预约时间管理" name="second">敬请期待...</el-tab-pane>
    </el-tabs>
    <!-- 查看体检预约套餐详情 -->
    <el-dialog title="查看体检预约套餐详情" :visible.sync="dialogViewVisible" width=800px :before-close="handleCloseView"
               :center="true" custom-class="elHeight">
      <div class="card-body" v-model="ViewItem">
        <el-card class="m_b_10" shadow="hover">
          <el-row :gutter="20">
            <el-col :span="6">商品描述：</el-col>
            <el-col :span="18" v-html="ViewItem.productDesc"></el-col>
          </el-row>
        </el-card>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    ERR_OK,
    getExamReserveDetail,
    getExamReserveList,
    getPersonalExamDetail,
    updateReserveStatus
  } from '@/api/api'
  import {getStore, EncodeDoctorId} from "@/config/mUtils.js"
  import commonServer from './commonServer.vue'

  export default {
    name: "reservationTask",
    components: {
      commonServer
    },
    data() {
      return {
        activeName: 'first',
        userInfo: {},
        searchParams: {
          currentPage: 1,
          endTime: "",
          examPackageName: "",
          institutionCode: "",
          mobile: "",
          name: "",
          pageSize: 10,
          startTime: "",
        },
        totalCount: 1,
        timeValue: '',
        tableData: [],
        ViewItem: {},
        dialogViewVisible: false, //体检预约查看
      }
    },
    activated() {
      this.userInfo = JSON.parse(getStore('userMesage'));
      this.searchParams.institutionCode = this.userInfo.institutionCode;
      this.getList();
    },
    methods: {
      //获取时间
      getselTime() {
        if (this.timeValue) {
          this.searchParams.startTime = this.timeValue[0];
          this.searchParams.endTime = this.timeValue[1];
        } else {
          this.searchParams.startTime = '';
          this.searchParams.endTime = '';
        }
      },
      /*tab切换*/
      handleClick(tab) {
        console.log(tab.name)
      },
      /*根据每页条数进行查询*/
      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this.getList();
      },
      /*根据当前页查询*/
      handleCurrentChange(val) {
        this.searchParams.currentPage = val;
        this.getList();
      },
      /*清空参数*/
      clearParams() {
        this.searchParams.currentPage = 1;
        this.searchParams.examPackageName = "";
        this.searchParams.mobile = "";
        this.searchParams.name = "";
        this.searchParams.pageSize = 10;
        this.timeValue = '';
      },
      /*获取个检预约列表*/
      getList() {
        let params = {
          currentPage: this.searchParams.currentPage,
          endTime: this.searchParams.endTime,
          examPackageName: this.searchParams.examPackageName,
          institutionCode: this.searchParams.institutionCode,
          mobile: this.searchParams.mobile,
          name: this.searchParams.name,
          pageSize: this.searchParams.pageSize,
          startTime: this.searchParams.startTime
        };
        getExamReserveList(params)
          .then((res) => {
            if (res.code === ERR_OK) {
              this.tableData = res.data.list;
              this.totalCount = res.data.totalCount
            } else {
              this.$message({
                type: 'info',
                message: res.msg
              });
            }
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '网络错误!获取个检预约列表失败'
            });
          })
      },
      /*更新个检预约状态*/
      changeStatus(params, text) {
        this.$confirm(text, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateReserveStatus(params)
            .then((res) => {
              if (res.code === ERR_OK) {
                this.getList();
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                });
              } else {
                this.$message({
                  type: 'warning',
                  message: res.msg
                });
              }
            })
            .catch((err) => {
              this.$message({
                type: 'warning',
                message: err.msg
              });
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });

      },
      /*拒绝*/
      cancleClick(val) {
        let params = {
            appointmentStatus: 18,
            currentPage: 0,
            examReserveId: val.examReserveId,
            pageSize: 0
          },
          text = '是否拒绝此预约!';
        this.changeStatus(params, text)
      },
      /*同意预约*/
      agreenClick(val) {
        let params = {
            appointmentStatus: 17,
            currentPage: 0,
            examReserveId: val.examReserveId,
            pageSize: 0
          },
          text = '是否同意此预约!';
        this.changeStatus(params, text)
      },
      /*判断预约到检时间是否过期*/
      judgeDate(val) {
        let nowTime = new Date().getTime();
        let appointmentTime = new Date(val).getTime();
        return Boolean(appointmentTime-nowTime > 0)
      },
      /*查看预约内容*/
      checkBtn(index, row) {
        let params = {
          id: row.examReserveId
        };
        getExamReserveDetail(params).then((res) => {
          if (res.code === ERR_OK) {
            this.ViewItem = {};
            this.ViewItem = res.data;
            this.dialogViewVisible = true;
          } else {
            IsAlert(res.msg, '错误', 'error');
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        })
      },
      /*关闭查看弹窗*/
      handleCloseView() {
        this.dialogViewVisible = false;
      },
    }
  }
</script>

<style scoped lang="less">
  .table-page {
    text-align: center;
    margin-top: 20px;
  }

  .elHeight .el-dialog__body {
    min-height: 20vh;
  }
</style>
