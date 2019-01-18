<template>
  <div class="check-control page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <div class="check-search">
        <el-form :inline="true" :model="searchParams" class="demo-form-inline">
          <el-form-item label="检查项目">
            <el-input size="medium" v-model="searchParams.name" placeholder="请输入检查项目"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="medium" type="primary" @click="onSumbit">查 询</el-button>
            <el-button size="medium" type="primary" @click="clearParams">清 除</el-button>
            <el-button size="medium" type="primary" @click="addCheck">新 增</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="check-table">
        <el-table
          :data="tableData"
          border
          :highlight-current-row="true"
          show-overflow-tooltip
          style="width: 100%">
          <el-table-column align="center" type="index" width="50"></el-table-column>
          <el-table-column align="center" prop="name" label="检查项目名"></el-table-column>
          <el-table-column align="center" prop="bindLabelAmount" label="绑定标签数"></el-table-column>
          <el-table-column align="center" prop="updateTime" label="更新时间"></el-table-column>
          <el-table-column fixed="right" width="100" align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" @click="editionBtn(scope.row)" size="mini">编 辑</el-button>
              <!--<el-button type="warning" @click="blockUp(scope.row)" size="mini">移 出</el-button>-->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchParams.currentPage"
          background
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
    </div>

    <!--创建检查项目||保存检查项目-->
    <el-dialog :title="dialogTitle" :visible.sync="checkStatus">
      <el-form :model="dataParams" class="add-tag">
        <el-form-item class="is-required" label="检查项目名称" :label-width="formLabelWidth">
          <el-input v-model="dataParams.name"></el-input>
        </el-form-item>
        <el-form-item class="is-required" label="检查项目描述" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 7}"
            resize="none"
            v-model="dataParams.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="cancleBtn">取 消</el-button>
        <el-button size="medium" type="primary" @click="sureBtn">{{btnText}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import headerTop from '@/components/headTop.vue';
  import {getStore,EncodeUserId} from '@/config/mUtils'
  import {
    ERR_OK,
    addCheckIndex,//新增检查项目
    getMedicalCheckIndexDetail,//查看检查项目详情
    getMedicalCheckIndexList,//查看检查项目列表
    updateCheckIndex//修改检查项目
  } from '@/api/api.js';

  export default {
    name: "checkControl",
    components: {
      headerTop
    },
    data() {
      return {
        searchParams: {
          name: '',
          currentPage: 1,
          pageSize: 10
        },
        userId: '',
        totalCount: 0,
        activeName: 'first',
        tableData: [],
        formLabelWidth: '120px',
        checkStatus: false,
        dialogTitle: '',
        btnText: '',
        dataParams: {
          name: '',
          description: '',
          id:''
        },
      }
    },
    activated() {
      this.userId = EncodeUserId(JSON.parse(getStore('userMesage')).userId);
      this.getDataList();
    },
    methods: {
      /*获取检查项目的列表*/
      getDataList() {
        let params = {
          currentPage: this.searchParams.currentPage,
          name: this.searchParams.name,
          pageSize: this.searchParams.pageSize
        };
        getMedicalCheckIndexList(params).then((res) => {
          if (res.code === ERR_OK) {
            this.tableData = res.data.list;
            this.totalCount = res.data.totalCount
          } else {
            this.$alert(res.msg,'提示')
          }
        }).catch(()=>{
          this.$message.error('网络错误!,请重试')
        })
      },
      /*列表显示多少条*/
      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this.getDataList();
      },
      /*列表显示第几页数据*/
      handleCurrentChange(val) {
        this.searchParams.currentPage = val;
        this.getDataList();
      },
      /*查询*/
      onSumbit() {
        this.searchParams.currentPage = 1;
        this.searchParams.pageSize = 10;
        this.getDataList();
      },
      /*清除参数*/
      clearParams() {
        if (this.checkStatus) {
          this.dataParams.description = '';
          this.dataParams.name = '';
          this.dataParams.id = ''
        }
        this.searchParams.pageSize = 10;
        this.searchParams.currentPage = 1;
        this.searchParams.name = '';
      },
      /*新增检查项目*/
      addCheck() {
        this.dialogTitle = '创建检查项目';
        this.btnText = '创 建';
        this.checkStatus = true;
        this.dataParams.id = ''
      },
      /*编辑检查项目*/
      editionBtn(val) {
        this.dialogTitle = '编辑检查项目';
        this.btnText = '保 存';
        let params = {
          id:val.id
        };
        getMedicalCheckIndexDetail(params).then((res)=>{
          if(res.code===ERR_OK){
            this.dataParams.id=res.data.id;
            this.dataParams.description=res.data.description;
            this.dataParams.name=res.data.name;
            this.checkStatus = true;
          }else{
            this.$alert(res.msg,'提示')
          }
        }).catch(()=>{
          this.$message.error('网络错误，请重试!')
        })
      },
      /*移出检查项目*/
      blockUp() {

      },
      /*取消创建&保存*/
      cancleBtn() {
        this.clearParams();
        this.checkStatus = false;
      },
      /*确定创建&保存*/
      sureBtn() {
        if (this.dataParams.checkDesc === '' || this.dataParams.checkName === '') {
          this.$alert( '请完善信息','提示');
          return
        }
        let params = {
          accountId: this.userId,
          description: this.dataParams.description,
          id: this.dataParams.id,
          name: this.dataParams.name
        };
        if(this.dialogTitle==='创建检查项目'){
          addCheckIndex(params).then((res) => {
            if (res.code === ERR_OK) {
              this.getDataList();
              this.clearParams();
              this.checkStatus = false;
            }
            this.$alert(res.msg,'提示');
          }).catch(()=>{
            this.$message.error('网络错误，请重试!')
          })
        }else if(this.dialogTitle==='编辑检查项目'){
          updateCheckIndex(params).then((res) => {
            if (res.code === ERR_OK) {
              this.getDataList();
              this.clearParams();
              this.checkStatus = false;
            }
            this.$alert(res.msg,'提示');
          }).catch(()=>{
            this.$message.error('网络错误，请重试!')
          })
        }
      }
    },
  }
</script>

<style scoped lang="less">
  /*tabs样式start*/
  .tag-tabs /deep/ .el-tabs__header {
    margin-bottom: 0;
  }

  .block {
    text-align: center;
    margin-top: 20px;
  }

  /*tabs样式end*/
  /*新增弹窗样式start*/
  .dialog-footer {
    text-align: center;
  }

  .add-tag {
    width: 460px;
  }

  /*新增弹窗样式end*/
</style>
