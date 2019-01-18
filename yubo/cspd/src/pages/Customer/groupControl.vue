<template>
  <div class="group-control">
    <div class="group-search">
      <el-form :inline="true" :model="searchParams" class="demo-form-inline">
        <el-form-item label="分组名称">
          <el-input size="medium" v-model.trim="searchParams.groupName" placeholder="请输入分组名称"></el-input>
        </el-form-item>
        <el-form-item label="标签">
          <el-input size="medium" v-model.trim="searchParams.labelName" placeholder="请输入标签名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" type="primary" @click="onSearch">查 询</el-button>
          <el-button size="medium" type="primary" @click="clearParams">清 除</el-button>
          <el-button size="medium" type="primary" @click="addGroup">新 增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="group-table">
      <el-table
        :data="tableData"
        border
        :highlight-current-row="true"
        style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column show-overflow-tooltip prop="groupName" label="分组名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="groupDesc" label="分组描述"></el-table-column>
        <el-table-column show-overflow-tooltip prop="labelName" label="绑定标签"></el-table-column>
        <el-table-column show-overflow-tooltip prop="groupNumber" label="分组人数"></el-table-column>
        <el-table-column show-overflow-tooltip prop="updateTime" label="更新时间"></el-table-column>
        <el-table-column fixed="right" width="280" align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="editionBtn(scope.row)" size="mini">编 辑</el-button>
            <el-button type="success" @click="controlMember(scope.row)" size="mini">管理成员</el-button>
            <el-button type="warning" @click="delBtn(scope.row)" size="mini">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block" v-if="tableData.length>0">
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
    <!--创建分组&编辑分组-->
    <el-dialog :close-on-click-modal="false" :show-close="false" :title="groupTitle" :visible.sync="groupStatus">
      <el-form :model="groupParams" class="group-dialog">
        <el-form-item class="is-required" label="分组名称" :label-width="formLabelWidth">
          <el-input v-if="nameStatus"  v-model="groupParams.groupName"></el-input>
          <el-input v-else disabled v-model="groupParams.groupName"></el-input>
        </el-form-item>
        <el-form-item class="is-required" label="分组描述" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5}"
            resize="none"
            v-model="groupParams.groupDesc"></el-input>
        </el-form-item>
        <el-form-item class="is-required" label="绑定标签" :label-width="formLabelWidth">
          <el-tag
            :key="tag"
            v-for="tag in groupParams.labelIds"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)">
            {{changeText(tag)}}
          </el-tag>
          <el-select
            size="small"
            class="input-new-tag"
            v-if="inputVisible"
            ref="saveTagInput"
            @keyup.enter.native="handleInputConfirm"
            @change="handleInputConfirm"
            v-model="inputValue" filterable clearable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.labelId"
              :label="item.labelName"
              :value="item.labelId">
            </el-option>
          </el-select>
          <el-button size="small" v-else class="button-new-tag" type="primary" icon="el-icon-plus" circle
                     @click="showInput"></el-button>
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
  import {getStore,EncodeDoctorId} from '@/config/mUtils'

  export default {
    name: "GroupControl",
    data() {
      return {
        searchParams: {
          currentPage: 1,
          groupName: "",
          labelName: "",
          pageSize: 10
        },
        institutionCode:'',
        userId: '',
        totalCount: 0,
        tableData: [],
        formLabelWidth: "120px",
        groupTitle: '',
        groupStatus: false,//弹窗显示状态
        groupParams: {
          groupDesc: "",
          groupName: "",
          groupId: "",
          labelIds: []
        },
        options: [],
        btnText: '',
        nameStatus:true,//分组名称是否编辑
        inputVisible: false,
        inputValue: ''
      }
    },
    activated() {
      this.userId = EncodeDoctorId(JSON.parse(getStore('userMesage')).userId);
      this.institutionCode = JSON.parse(getStore('userMesage')).institutionCode||'';
      this.getDataList();
    },
    methods: {
      /*查询*/
      onSearch() {
        this.searchParams.currentPage = 1;
        this.searchParams.pageSize = 10;
        this.getDataList();
      },
      /*清除查询参数*/
      clearParams() {
        this.searchParams.currentPage = 1;
        this.searchParams.groupName = '';
        this.searchParams.labelName = '';
        this.searchParams.pageSiz = 10;
        if (this.groupStatus) {
          this.groupParams.groupDesc = "";
          this.groupParams.groupName = "";
          this.groupParams.groupId = "";
          this.groupParams.labelIds = [];
          this.groupStatus=false;
        }
      },
      /*获取分组列表*/
      getDataList() {
        let params = {
          currentPage: this.searchParams.currentPage,
          groupName: this.searchParams.groupName,
          labelName: this.searchParams.labelName,
          institutionCode: this.institutionCode,
          pageSize: this.searchParams.pageSize
        };
        getMedicalGroupList(params).then((res) => {
          if (res.code === ERR_OK) {
            this.tableData = res.data.list;
            this.totalCount = res.data.totalCount;
          } else {
            this.$message({
              type:'warning',
              message: res.msg,
              duration:3000,
              customClass:'err-tips',
            });
          }
        }).catch(() => {
          this.$message.error('网络错误!,请稍后重试')
        })
      },
      /*设置表格每页条数*/
      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this.getDataList();
      },
      /*设置表格当前页*/
      handleCurrentChange(val) {
        this.searchParams.currentPage = val;
        this.getDataList();
      },
      /*新增分组*/
      addGroup() {
        this.nameStatus = true;
        this.btnText = '创建';
        this.getDownList();
        this.groupStatus = true;
      },
      /*编辑按钮*/
      editionBtn(val) {
        this.btnText = '保存';
        this.nameStatus = false
        //获取分组信息详情
        let params ={
          id: val.groupId
        };
        getMedicalGroupDetail(params).then((res)=>{
          if(res.code===ERR_OK){
            this.groupParams.labelIds = res.data.labelIds;
            this.groupParams.groupName = res.data.groupName;
            this.groupParams.groupDesc = res.data.groupDesc
          }else{
            this.$message({
              type:'warning',
              message: res.msg,
              duration:3000,
              customClass:'err-tips',
            });
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试')
        });

        this.getDownList();
        this.groupParams.groupId = val.groupId;
        this.groupStatus = true;
      },
      /*管理成员按钮*/
      controlMember(val) {
        let groupId = val.groupId;
        this.$router.push({path: `/customer/memberControl/${groupId}`})
      },
      /*删除按钮*/
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
      /*获取创建分组弹窗下拉列表*/
      getDownList(){
        let params = {};
        getMedicalLabelIdNameList(params).then((res)=>{
          if(res.code===ERR_OK){
            this.options = res.data;
          }else{
            this.$message({
              type:'warning',
              message: res.msg,
              duration:3000,
              customClass:'err-tips',
            });
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试')
        })
      },
      /*标签选择start*/
      handleClose(tag) {
        this.groupParams.labelIds.splice(this.groupParams.labelIds.indexOf(tag), 1);
      },
      showInput() {
        this.inputVisible = true;
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        let dataStatus = true;
        if (inputValue) {
          this.groupParams.labelIds.forEach((v) => {
            if (v === inputValue) {
              dataStatus = false;
            }
          });
          if (dataStatus && this.groupParams.labelIds.length < 5) {
            this.groupParams.labelIds.push(inputValue);
          } else if (!dataStatus) {
            this.$message.error('该分组已选,请重新选择')
          } else if (this.groupParams.labelIds.length >= 5) {
            this.$message.error('该分组已达到最大值')
          }
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      /*标签选择end*/
      /*取消创建&保存*/
      cancleBtn() {
        this.clearParams();
      },
      /*确定保存&创建*/
      sureBtn() {
        if (this.btnText === '创建') {
          let params = {
            creatorId: this.userId,
            groupDesc: this.groupParams.groupDesc,
            groupName: this.groupParams.groupName,
            institutionCode: this.institutionCode,
            labelIds: this.groupParams.labelIds
          };
          saveMedicalGroup(params).then((res) => {
            if (res.code === ERR_OK) {
              this.clearParams();
              this.groupStatus = false;
              this.getDataList();
            } else {
              this.$alert(res.msg, '提示')
            }
          }).catch(() => {
            this.$message.error('网络错误!,请稍后重试.')
          })
        } else if (this.btnText === '保存') {
          let params = {
            groupDesc: this.groupParams.groupDesc,
            groupId: this.groupParams.groupId,
            groupName: this.groupParams.groupName,
            labelIds: this.groupParams.labelIds,
            modifierId: this.userId
          };
          updateMedicalGroup(params).then((res) => {
            if (res.code === ERR_OK) {
              this.clearParams();
              this.groupStatus = false;
              this.getDataList();
            } else {
              this.$alert(res.msg, '提示')
            }
          }).catch(() => {
            this.$message.error('网络错误!,请稍后重试.')
          })
        }
      },
      /*标签名称显示*/
      changeText(val) {
        let value;
        if (val) {
          this.options.forEach((v) => {
            if (v.labelId === val) {
              value = v.labelName;
            }
          })
        }
        return value;
      }
    }
  }
</script>
<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>

<style scoped lang="less">
  /*表格分页样式start*/
  .block {
    text-align: center;
    margin-top: 20px;
  }

  /*表格分页样式end*/

  /*新增弹窗样式start*/
  .dialog-footer {
    text-align: center;
  }

  .group-dialog {
    width: 460px;
  }

  /*新增弹窗样式end*/
</style>
