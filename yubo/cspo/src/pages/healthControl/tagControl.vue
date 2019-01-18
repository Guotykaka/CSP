<template>
  <div class="tag-control page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <div class="tag-search">
        <el-form :inline="true" :model="searchParams" class="demo-form-inline">
          <el-form-item label="标签名称">
            <el-input size="medium" v-model="searchParams.labelName" placeholder="请输入标签名称"></el-input>
          </el-form-item>
          <el-form-item label="检查项目名称">
            <el-input size="medium" v-model="searchParams.checkIndexName" placeholder="请输入检查项目名称"></el-input>
          </el-form-item>
          <el-form-item label="使用状态">
            <el-select size="medium" v-model="searchParams.status" placeholder="活动区域">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="启用" :value="1"></el-option>
              <el-option label="停用" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="medium" type="primary" @click="getDataList">查 询</el-button>
            <el-button size="medium" type="primary" @click="clearParams">清 除</el-button>
            <el-button size="medium" type="primary" @click="addTag">新 增</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="tag-main">
        <!--<div class="tag-tabs">
          <template>
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="异常项标签" name="first"></el-tab-pane>
              <el-tab-pane label="结论词标签" name="second"></el-tab-pane>
            </el-tabs>
          </template>
        </div>-->
        <div class="tag-table">
          <el-table
            :data="tableData"
            border
            :highlight-current-row="true"
            show-overflow-tooltip
            style="width: 100%">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="name" label="标签名称" width="120"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="checkIndexName" label="检查项目" width="100"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="keyWords" label="关键词"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="relatePeopleAmount" label="标签人数" width="100"></el-table-column>
            <el-table-column align="center" label="使用状态" width="100">
              <template slot-scope="scope">
                <el-tag type="warning" size="medium" v-if="scope.row.status===2">停 用</el-tag>
                <el-tag type="primary" size="medium" v-if="scope.row.status===1">使用中</el-tag>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="updateTime" label="更新时间" width="150"></el-table-column>
            <el-table-column fixed="right" width="160" align="center" label="操作">
              <template slot-scope="scope">
                <el-button v-if="scope.row.status===1" type="warning" @click="blockUp(scope.row)" size="mini">停 用</el-button>
                <el-button v-if="scope.row.status===2" type="success" @click="blockStart(scope.row)" size="mini">启 用</el-button>
                <el-button type="primary" @click="editionBtn(scope.row)" size="mini">编 辑</el-button>
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
    </div>
    <!--创建标签-->
    <el-dialog title="创建标签" :visible.sync="addTagStatus">
      <el-form :model="addParams" class="add-tag">
        <el-form-item class="is-required" label="标签名" :label-width="formLabelWidth">
          <el-input v-model.trim="addParams.name"></el-input>
        </el-form-item>
        <el-form-item class="is-required" label="对应检查项目" :label-width="formLabelWidth">
          <el-select v-model="addParams.checkIndexId" clearable filterable placeholder="请选择对应检查项目">
            <el-option v-for="item in checkIndexList" :key="item.checkIndexId" :label="item.checkIndexName"
                       :value="item.checkIndexId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="is-required" label="指标关键词" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5}"
            resize="none"
            v-model.trim="textKey"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="cancleBtn">取 消</el-button>
        <el-button size="medium" type="primary" @click="sureAdd">创 建</el-button>
      </div>
    </el-dialog>
    <!--编辑标签-->
    <el-dialog title="编辑标签" :visible.sync="editionTagStatus">
      <el-form :model="addParams" class="add-tag">
        <el-form-item class="is-required" label="标签名" :label-width="formLabelWidth">
          <el-input v-model.trim="editionParams.name"></el-input>
        </el-form-item>
        <el-form-item class="is-required" label="对应检查项目" :label-width="formLabelWidth">
          <el-select v-model="editionParams.checkIndexId" clearable filterable placeholder="请选择对应检查项目">
            <el-option v-for="item in checkIndexList" :key="item.checkIndexId" :label="item.checkIndexName"
                       :value="item.checkIndexId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="is-required" label="指标关键词" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5}"
            resize="none"
            v-model.trim="eiditionKey"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="cancleBtn">取 消</el-button>
        <el-button size="medium" type="primary" @click="sureEdition">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import headerTop from '@/components/headTop.vue';
  import {getStore,EncodeUserId} from '@/config/mUtils'
  import {
    ERR_OK,
    addMedicalLabel,//新增标签
    blockMedicalLabel,//停用标签
    getMedicalCheckIndexIdNameList,//检查项id、name下拉框列表
    getMedicalLabelDetail,//查看标签详情
    getMedicalLabelList,//查看标签项目列表
    startMedicalLabel,//启用标签
    updateMedicalLabel//修改标签
  } from '@/api/api.js';

  export default {
    name: "tagControl",
    components: {
      headerTop
    },
    data() {
      return {
        searchParams: {
          checkIndexName: '',
          currentPage: 1,
          labelName: '',
          pageSize: 10,
          status: null
        },
        userId: '',
        activeName: 'first',
        tableData: [],
        totalCount: 0,
        addTagStatus: false,//创建标签弹窗
        formLabelWidth: '200px',
        checkIndexList: [],
        addParams: {
          name: '',
          checkIndexId: '',
          keyWords: [],
          id: ''
        },
        textKey: '',
        editionTagStatus: false,//编辑标签弹窗
        editionParams: {
          name: '',
          checkIndexId: '',
          keyWords: [],
          id: ''
        },
        eiditionKey: ''
      }
    },
    activated() {
      this.userId = EncodeUserId(JSON.parse(getStore('userMesage')).userId);
      this.getDataList();
    },
    methods: {
      /*查询*/
      getDataList() {
        this.searchParams.currentPage = 1;
        this.searchParams.pageSize = 10;
        this.ajaxDataList();
      },
      /*查询数据接口*/
      ajaxDataList(){
        let params = {
          checkIndexName: this.searchParams.checkIndexName,
          currentPage: this.searchParams.currentPage,
          labelName: this.searchParams.labelName,
          pageSize: this.searchParams.pageSize,
          status: this.searchParams.status
        };
        getMedicalLabelList(params).then((res) => {
          if (res.code === ERR_OK) {
            this.tableData = res.data.list;
            this.totalCount = res.data.totalCount;
          }
        }).catch(() => {
          this.$message.error('网络错误，请重试!')
        })
      },
      /*清除搜索参数*/
      clearParams() {
        this.searchParams.checkIndexName = '';
        this.searchParams.currentPage = 1;
        this.searchParams.labelName = '';
        this.searchParams.pageSize = 10;
        this.searchParams.status = null
        if (this.addTagStatus) {
          this.addParams.checkIndexId = '';
          this.addParams.id = '';
          this.addParams.keyWords = [];
          this.addParams.name = '';
          this.textKey = ''
        }
        if (this.editionTagStatus) {
          this.editionParams.checkIndexId = '';
          this.editionParams.id = '';
          this.editionParams.keyWords = [];
          this.editionParams.name = '';
          this.eiditionKey = ''
        }
      },
      /*列表显示多少条*/
      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this.ajaxDataList();
      },
      /*列表显示第几页数据*/
      handleCurrentChange(val) {
        this.searchParams.currentPage = val;
        this.ajaxDataList();
      },
      /*获取新增标签&修改标签下拉列表*/
      getupList() {
        let params = {};
        getMedicalCheckIndexIdNameList(params).then((res) => {
          if (res.code === ERR_OK) {
            this.checkIndexList = res.data;
          } else {
            this.$alert(res.msg, '提示')
          }
        }).catch(() => {
          this.$message.error('网络错误，请重试!')
        })
      },
      /*新增标签*/
      addTag() {
        this.addTagStatus = true;
        this.getupList();
      },
      /*tabs标签类型切换*/
      handleClick() {

      },
      /*停用*/
      blockUp(value) {
        this.$confirm('确定停用该标签吗?', '标签', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const loading = this.$loading({
            lock: true,
            text: '正在停用...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          let params ={
            accountId: this.userId,
            id: value.id
          };
          blockMedicalLabel(params).then((res)=>{
            loading.close();
            if(res.code===ERR_OK){
              this.ajaxDataList();
              this.$message({
                message: '标签已停用',
                type: 'success'
              });
            } else {
              this.$alert(res.msg, '提示', {
                confirmButtonText: '确定',
              })
            }
          }).catch(()=>{
            loading.close();
            this.$message.error('网络错误，请重试!')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      /*启用*/
      blockStart(value) {
        this.$confirm('确定使用该标签吗?', '标签', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const loading = this.$loading({
            lock: true,
            text: '正在启用...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          let params ={
            accountId: this.userId,
            id: value.id
          };
          startMedicalLabel(params).then((res)=>{
            loading.close();
            if(res.code===ERR_OK){
              this.ajaxDataList();
              this.$message({
                message: '标签已停用',
                type: 'success'
              });
            } else {
              this.$alert(res.msg, '提示', {
                confirmButtonText: '确定',
              })
            }
          }).catch(()=>{
            loading.close();
            this.$message.error('网络错误，请重试!')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      /*编辑*/
      editionBtn(item) {
        this.getupList();
        this.editionTagStatus = true;
        let params = {
          accountId: this.userId,
          id: item.id
        };
        getMedicalLabelDetail(params).then((res) => {
          if (res.code === ERR_OK) {
            this.eiditionKey = res.data.keyWords.join();
            this.editionParams.name=res.data.name;
            this.editionParams.checkIndexId=res.data.checkIndexId;
            this.editionParams.id=res.data.id
          } else {
            this.$alert(res.msg, '提示')
          }
        }).catch(() => {
          this.$message.error('网络错误，请重试!')
        })
      },
      /*取消新增*/
      cancleBtn() {
        if (this.addTagStatus) {
          this.addTagStatus = false;
          this.addParams.name = '';
          this.addParams.keyWords = [];
          this.addParams.checkIndexId = ''
        } else if (this.editionTagStatus) {
          this.editionTagStatus = false;
          this.editionParams.name = '';
          this.editionParams.keyWords = [];
          this.editionParams.checkIndexId = ''
        }
      },
      /*确定新增*/
      sureAdd() {
        if (this.addParams.name.length === 0 || this.addParams.checkIndexId === '' || this.textKey === ''||this.textKey.length===0) {
          this.$alert('请完善信息', '提示');
          return
        }
          let reg = new RegExp("，", "g");
          let newstr = this.textKey.replace(reg, ",");
          let params = {
            accountId: this.userId,
            checkIndexId: this.addParams.checkIndexId,
            id: this.addParams.id,
            keyWords: [],
            name: this.addParams.name
          };
          newstr = newstr.split(',');
          newstr.forEach((v) => {
            if (v !== '') {
              params.keyWords.push(v);
            }
          });
          addMedicalLabel(params).then((res) => {
            if (res.code === ERR_OK) {
              this.clearParams();
              this.addTagStatus = false;
              this.ajaxDataList();
            }
            this.$alert(res.msg, '提示')
          }).catch(() => {
            this.$message.error('网络错误，请重试!')
          })
      },
      /*修改保存*/
      sureEdition() {
        console.log(this.editionParams.eiditionKey);
        if (this.editionParams.name === '' || this.editionParams.checkIndexId === '' || this.eiditionKey === ''||this.eiditionKey.length ===0) {
          this.$alert( '请完善信息','提示');
          return
        }
        let reg = new RegExp("，", "g");
        let newstr = this.eiditionKey.replace(reg, ",");
        let params = {
          accountId: this.userId,
          checkIndexId: this.editionParams.checkIndexId,
          id: this.editionParams.id,
          keyWords: [],
          name: this.editionParams.name
        };
        newstr = newstr.split(',');
        newstr.forEach((v) => {
          if (v !== '') {
            params.keyWords.push(v);
          }
        });
        updateMedicalLabel(params).then((res) => {
          if (res.code === ERR_OK) {
            this.clearParams();
            this.editionTagStatus = false;
            this.ajaxDataList();
          }
          this.$alert(res.msg, '提示')
        }).catch(() => {
          this.$message.error('网络错误，请重试!')
        })
      }
    }
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
