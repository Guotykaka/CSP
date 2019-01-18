<template>
  <div class="memberControl">
    <div class="group-box">
      <div class="group-search">
        <el-form :inline="true" :model="searchParams" class="demo-form-inline">
          <el-form-item label="客户名">
            <el-input size="medium" v-model.trim="searchParams.customerName" placeholder="请输入客户名"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input size="medium" v-model.trim="searchParams.mobile" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="客户标签">
            <el-select size="medium" v-model="searchParams.labelId" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.labelId"
                :label="item.labelName"
                :value="item.labelId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间">
            <el-date-picker
              v-model="rangeTime"
              :unlink-panels="true"
              @change="getselTime"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00','23:59:59']"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button size="medium" type="primary" @click="onSearch">查 询</el-button>
            <el-button size="medium" type="primary" @click="clearParams">清 除</el-button>
            <el-button size="medium" type="primary" @click="returnPage">返 回</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="group-table">
        <el-table
          v-loading="tableLoading"
          :data="tableData"
          border
          :highlight-current-row="true"
          style="width: 100%">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column show-overflow-tooltip prop="customerName" label="客户名" width="80"></el-table-column>
          <el-table-column show-overflow-tooltip prop="mobile" label="手机号" width="120"></el-table-column>
          <el-table-column show-overflow-tooltip prop="" label="单位">
            <template slot-scope="scope">
              <span>{{scope.row.orderName||'个检'}}</span>
            </template>
          </el-table-column>
          <!--<el-table-column show-overflow-tooltip prop="age" label="年龄"></el-table-column>-->
          <el-table-column show-overflow-tooltip prop="birthday" label="生日" width="140">
            <template slot-scope="scope">
              <span>{{scope.row.birthday | birthdaySel}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="labelName" label="标签"></el-table-column>
          <!--<el-table-column show-overflow-tooltip prop="address" label="体检报告"></el-table-column>-->
          <el-table-column show-overflow-tooltip prop="groupName" label="所属分组"></el-table-column>
          <el-table-column fixed="right" width="150" align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" @click="reportClick(scope.row)" size="mini">查看报告</el-button>
              <!--<el-button type="warning" @click="delBtn(scope.row)" size="mini">删 除</el-button>-->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchParams.currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    ERR_OK,
    delMedicalGroup,//删除分组
    getMedicalGroupDetail,//分组信息详情
    getMedicalGroupList,//获取分组列表
    saveMedicalGroup,//新增分组
    updateMedicalGroup,//更新分组
    getAbnormalItem,//异常项看板
    getGroupUserList,//获取分组下的用户信息
    getMedicalLabelIdNameList,//标签id、name下拉框列表
    getUserReport,//获取用户的体检报告
  } from '@/api/api'
  // import report from '@/components/report.vue';
  import report from '@/components/reportNew.vue';
  import ReportPage from './components/reportPage'

  export default {
    name: "memberControl",
    components: {
      report,
      ReportPage
    },
    data() {
      return {
        rangeTime: ["2018-09-30", "2018-12-29"],
        reportData: {},
        userGroupId: '',
        options: [],
        searchParams: {
          currentPage: 1,
          customerName: "",
          groupId: "",
          labelId: "",
          mobile: "",
          pageSize: 10,
          endTime:'',
          startTime:''
        },
        tableLoading:true,
        tableData: [],
        totalCount: null,
        isShowReport: false,
        /*组件信息start*/
        customerNameReport: '',
        mobileReport: '',//
        /**/
      }
    },
    activated() {
      this.userGroupId = this.$route.params.groupId;
      let end = new Date();
      let start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      this.rangeTime = [start,end];
      end = this.timestampToTime(end);
      start = this.timestampToTime(start);
      this.searchParams.startTime = start+' 00:00:00';
      this.searchParams.endTime = end+' 23:59:59';
      this.getDownList();
      this.getUserList();
    },
    methods: {
      //时间格式转换
      timestampToTime(timestamp) {
        var date = new Date(timestamp);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = date.getDate()<10?'0'+date.getDate():date.getDate();
        return Y+M+D;
      },
      //获取时间
      getselTime() {
        if (this.rangeTime) {
          this.searchParams.startTime = this.rangeTime[0];
          this.searchParams.endTime = this.rangeTime[1];
        }else{
          this.searchParams.startTime ='';
          this.searchParams.endTime = '';
        }
      },
      /*查询数据*/
      onSearch() {
        this.searchParams.currentPage = 1;
        this.searchParams.pageSize = 10;
        this.getUserList();
      },
      /*获取用户信息列表*/
      getUserList() {
        let params = {
          currentPage: this.searchParams.currentPage,
          customerName: this.searchParams.customerName,
          groupId: this.userGroupId,
          labelId: this.searchParams.labelId,
          mobile: this.searchParams.mobile,
          pageSize: this.searchParams.pageSize,
          endTime: this.searchParams.endTime,
          startTime: this.searchParams.startTime
        };
        getGroupUserList(params).then((res) => {
          if (res.code === ERR_OK) {
            this.tableData = res.data.list;
            this.totalCount = res.data.totalCount;
          } else {
            this.$alert(res.msg, '提示')
          }
          this.tableLoading = false;
        }).catch(() => {
          this.tableLoading = false;
          this.$message.error('网络错误!请稍后重试')
        })
      },
      /*设置表格每页条数*/
      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this.getUserList();
      },
      /*设置表格当前页*/
      handleCurrentChange(val) {
        this.searchParams.currentPage = val;
        this.getUserList();
      },
      /*清除参数*/
      clearParams() {
        this.searchParams.currentPage = 1;
        this.searchParams.customerName = '';
        this.searchParams.labelId = '';
        this.searchParams.mobile = '';
        this.searchParams.pageSize = 10;
        this.rangeTime = [];
        this.searchParams.endTime = '';
        this.searchParams.startTime = ''
      },
      /*返回*/
      returnPage(){
        this.$router.go(-1)
      },
      /*获取创建分组弹窗下拉列表*/
      getDownList() {
        let params = {};
        getMedicalLabelIdNameList(params).then((res) => {
          if (res.code === ERR_OK) {
            this.options = res.data;
          } else {
            this.$alert(res.msg, '提示')
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        })
      },
      /*查看体检报告*/
      reportClick(val) {
        let customerName = val.customerName;
        let mobile = val.mobile;

        this.$router.push({path: `/reportPage/${mobile}/${customerName}`})
      },
      /*删除成员*/
      delBtn(item) {
        this.$confirm('确定要删除该分组?', '分组', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const loading = this.$loading({
            lock: true,
            text: '正在删除...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });

          let params = {
            groupId: item.groupId,
            modifierId: this.userId
          };
          delMedicalGroup(params).then(res => {
            loading.close();
            if (res.code === ERR_OK) {
              this.$message({
                message: '分组已删除',
                type: 'success'
              });
              this.getDataList()
            } else {
              this.$alert(res.msg, '提示', {
                confirmButtonText: '确定',
              })
            }
          }).catch(() => {
            loading.close();
            this.$message.error('网络错误!请稍后重试')
          });

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
    },
    directives: {
      dragReport: {
        // 指令的定义
        inserted: function (el) {
          let oDiv = document.getElementById("report-model");
          let oDivt = document.getElementById("report-t");
          oDivt.onmousedown = function (ev) {
            let disX = ev.clientX - oDiv.offsetLeft;
            let disY = ev.clientY - oDiv.offsetTop;
            document.onmousemove = function (ev) {
              let l = ev.clientX - disX;
              let t = ev.clientY - disY;
              oDiv.style.left = l + 'px';
              oDiv.style.top = t + 'px';
            };
            document.onmouseup = function () {
              document.onmousemove = null;
              document.onmouseup = null;
            };
          };
        }
      }
    },
    filters:{
      birthdaySel(value){
        var y,m,d;
        if(value){
          y = value.slice(0,4)+'年';
          m = value.slice(4,6)+'月';
          d = value.slice(6,8)+'日'
        };
        return y+m+d
      }
    }
  }
</script>

<style scoped lang="less">
  /*表格分页样式start*/
  .block {
    text-align: center;
    margin-top: 20px;
  }

  /*表格分页样式end*/

</style>
