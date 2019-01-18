<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <el-form :inline="true" :model="searchParams" class="demo-form-inline">
        <el-form-item label="描述：">
          <el-input size="small" v-model="searchParams.description" placeholder="请输入描述性文案"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="onSearch">查 询</el-button>
          <el-button type="primary" size="small" @click="onClear">清 空</el-button>
          <el-button type="primary" size="small" @click="onAddMsg">新 增</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          fixed
          type="index"
          label="序号"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          prop="description"
          align="center"
          label="描述">
        </el-table-column>
        <el-table-column
          align="center"
          label="URL">
          <template slot-scope="scope">{{insUrl+scope.row.id}}</template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="300">
          <template slot-scope="scope">
            <el-button @click="edictMsg(scope.row)" type="primary" size="small">编 辑</el-button>
            <!--<el-button @click="delMsg(scope.row)" type="danger" size="small">删 除</el-button>-->
            <el-button @click="showMsg(scope.row)" type="success" size="small">预 览</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pageStyle" v-if="tableData.length>0">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchParams.currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          background
          :total="totalCount">
        </el-pagination>
      </div>
    </div>
    <div v-if="showMsgStatus">
      <el-dialog :title="dialogTitle" :visible.sync="showMsgStatus" width="800px">
        <el-form :model="addParams" class="dialog-msg">
          <el-form-item label="描述：" :label-width="formLabelWidth">
            <el-input size="small" v-model="addParams.descTitle" placeholder="请输入描述性文案"></el-input>
          </el-form-item>
        </el-form>
        <msg-tinymce v-model="addParams.Value" :url="Url" :with-credentials='false' :editorHeight='200'></msg-tinymce>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="saveMsgBtn">保 存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import headerTop from '@/components/headTop'
  import MsgTinymce from '@/components/tinymce'
  import {IsAlert} from '@/config/mUtils.js'
  import {institutionUrl, preview_path} from '@/config/env'
  import {
    ERR_OK,
    InsdeleteInfo,
    InsinfoDetail,
    InslistInfo,
    InssaveInfo,
    InsupdateInfo
  } from '@/api/api'

  export default {
    name: "msgMangeList",
    components: {
      headerTop,
      MsgTinymce
    },
    data() {
      return {
        /*搜索参数*/
        searchParams: {
          description: '',
          currentPage: 1,
          pageSize: 10,
        },
        totalCount: null,
        /*添加信息参数*/
        addParams: {
          descTitle: '',
          Value: '',
          id: ''
        },
        insUrl: institutionUrl,
        tableData: [],
        showMsgStatus: false,
        addStatus: true,
        dialogTitle: '',
        formLabelWidth: '60px',
        Url: 'http://v0.api.upyun.com/zhangshangtijian',
      }
    },
    activated() {
      this.getDataList()
    },
    methods: {
      /*获取列表数据*/
      getDataList() {
        let params = this.searchParams;
        InslistInfo(params).then((res) => {
          if (res.code === ERR_OK) {
            this.tableData = res.data.list;
            this.totalCount = res.data.totalCount
          } else {
            IsAlert(res.msg, '错误', 'error');
          }
        })
      },
      /*查询*/
      onSearch() {
        this.getDataList();
      },
      /*清除搜索信息*/
      onClear() {
        this.searchParams.description = '';
        this.searchParams.currentPage = 1;
        this.searchParams.pageSize = 10;
      },
      /*添加信息*/
      onAddMsg() {
        this.dialogTitle = '添加图文内容';
        this.showMsgStatus = true;
        if (this.addStatus) {
          this.addParams.descTitle = '';
          this.addParams.Value = '';
          this.addParams.id = '';
        } else {
          this.addStatus = false;
        }

      },
      /*编辑信息按钮*/
      edictMsg(row) {
        this.addStatus = true;
        let params = {
          id: row.id
        };
        InsinfoDetail(params).then((res) => {
          if (res.code === ERR_OK) {
            this.dialogTitle = '编辑图文内容';
            this.addParams.descTitle = res.data.description;
            this.addParams.Value = res.data.content;
            this.addParams.id = res.data.id;
            this.showMsgStatus = true;
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试')
        })
      },
      /*删除信息*/
      delMsg(row) {
        let params = {
          id: row.id
        };
        this.$confirm('确定删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(_ => {
          InsdeleteInfo(params).then((res) => {
            if (res.code === ERR_OK) {
              this.getDataList();
              IsAlert(res.msg, '成功', 'success');
            } else {
              IsAlert(res.msg, '错误', 'error');
            }
          }).catch(()=>{
            this.$message.error('网络错误!请稍后重试')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        })
      },
      /*预览信息*/
      showMsg(row) {
        let id = row.id;
        window.open(preview_path + 'TitleNew.html#/title/' + id);
      },
      saveMsgBtn() {
        if (this.dialogTitle === '添加图文内容') {
          this.saveMsg()
        } else if (this.dialogTitle === '编辑图文内容') {
          this.editMsgSave();
        }
      },
      /*保存机构*/
      saveMsg() {
        let params = {
          content: this.addParams.Value,
          description: this.addParams.descTitle
        };
        InssaveInfo(params).then((res) => {
          if (res.code === ERR_OK) {
            this.addParams.Value = '';
            this.addParams.descTitle = '';
            this.searchParams.currentPage = 1;
            this.searchParams.pageSize = 10;
            this.showMsgStatus = false;
            this.getDataList();
            IsAlert(res.msg, '成功', 'success');
          } else {
              IsAlert(res.msg, '错误', 'error');
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试')
        })
      },
      /*编辑机构信息*/
      editMsgSave() {
        let params = {
          content: this.addParams.Value,
          description: this.addParams.descTitle,
          id: this.addParams.id
        };
        InsupdateInfo(params).then((res) => {
          if (res.code === ERR_OK) {
            this.addParams.Value = '';
            this.addParams.descTitle = '';
            this.addParams.id = '';
            this.showMsgStatus = false;
            this.getDataList();
            IsAlert(res.msg, '成功', 'success');
          } else {
              IsAlert(res.msg, '错误', 'error');
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试')
        })
      },
      /*每页多少条*/
      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this.getDataList();
      },
      /*当前页*/
      handleCurrentChange(val) {
        this.searchParams.currentPage = val;
        this.getDataList();
      }
    }
  }
</script>

<style scoped lang="less">
  .dialog-msg /deep/ .el-input {
    width: 200px;
  }

  .pageStyle {
    text-align: center;
    margin-top: 20px;
  }
</style>
