<template>
  <div id="prompt">
    <div class="recheck-search">
      <el-form :inline="true" :model="searchParams" class="demo-form-inline">
        <el-form-item label="计划名称">
          <el-input size="medium" v-model.trim="searchParams.planName" placeholder="请输入计划名称"></el-input>
        </el-form-item>
        <el-form-item label="分组名称">
          <el-input size="medium" v-model.trim="searchParams.groupName" placeholder="请输入分组名称"></el-input>
        </el-form-item>
        <el-form-item label="执行状态">
          <el-select size="medium" v-model="searchParams.status" placeholder="请选择">
            <el-option label="执行中" :value="1"></el-option>
            <el-option label="停用" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" type="primary" @click="onSearch">查 询</el-button>
          <el-button size="medium" type="primary" @click="clearParams">清 除</el-button>
          <el-button size="medium" type="primary" @click="addGroup">新 增</el-button>
          <el-button v-if="!messageBalance.haveAmount" size="medium" type="primary" @click="telPhone">联系客服</el-button>
        </el-form-item>
      </el-form>
      <el-row>
        <el-col class="have-amount" :span="24">
          <div class="amount-text">
            设置总额：<span>{{messageBalance.settingAmount}}&nbsp;</span>条
          </div>
          <div class="amount-text">
            已使用数量：<span :class="{redStyle:messageBalance.settingAmount-messageBalance.usedAmount<100}">{{messageBalance.usedAmount}}&nbsp;</span>条
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="recheck-table">
      <el-table
        :data="tableData"
        border
        :highlight-current-row="true"
        style="width: 100%">
        <el-table-column type="index" width="50" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="name" label="计划名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="description" label="计划描述"></el-table-column>
        <el-table-column show-overflow-tooltip prop="targetGroup" label="目标分组"></el-table-column>
        <el-table-column show-overflow-tooltip prop="targetPeopleAmount" label="目标人数"></el-table-column>
        <el-table-column show-overflow-tooltip prop="startTime" label="开始日期"></el-table-column>
        <el-table-column show-overflow-tooltip prop="executeTime" label="执行时间"></el-table-column>
        <el-table-column show-overflow-tooltip label="执行状态" align="center">
          <template slot-scope="scope">
            <div v-if="messageBalance.haveAmount">
              <el-tag v-if="scope.row.status===1">执行中</el-tag>
              <el-tag v-if="scope.row.status===2" type="info">结束</el-tag>
            </div>
            <div v-else>
              <el-tag type="danger">暂停待续费</el-tag>
            </div>
          </template>
        </el-table-column>
        <!--<el-table-column show-overflow-tooltip prop="updateTime" label="更新时间" width="180"></el-table-column>-->
        <el-table-column show-overflow-tooltip prop="checkDay" align="center" label="过总检时间(天)"
                         width="180"></el-table-column>
        <el-table-column fixed="right" width="280" align="center" label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status===1&&messageBalance.haveAmount" type="warning" @click="delBtn(scope.row)"
                       size="mini">结束计划
            </el-button>
            <el-button v-else type="warning" disabled size="mini">结束计划</el-button>
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
    <!--创建复检建议计划-->
    <el-dialog title="创建复检建议计划" :visible.sync="recheckStatus">
      <el-form :model="recheckParams" class="group-dialog">
        <el-form-item label="计划名称" :label-width="formLabelWidth">
          <el-input v-model="recheckParams.name"></el-input>
        </el-form-item>

        <el-form-item label="计划描述" :label-width="formLabelWidth">
          <el-input
            v-model="recheckParams.description"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5}"
            resize="none"
          ></el-input>
        </el-form-item>

        <el-form-item label="报告过总检后x天" :label-width="formLabelWidth">
          <el-input v-model="recheckParams.checkDay" type="number"></el-input>
        </el-form-item>

        <el-form-item label="执行日期" :label-width="formLabelWidth">
          <!--<el-date-picker-->
          <!--v-model="dateSelection"-->
          <!--@change="getselTime"-->
          <!--value-format="yyyy-MM-dd"-->
          <!--type="date"-->
          <!--placeholder="选择日期">-->
          <!--</el-date-picker>-->
          <el-date-picker
            @change="getselTime"
            v-model="dateSelection"
            type="date"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="执行时间" :label-width="formLabelWidth">
          <el-time-picker
            v-model="recheckParams.executeTime"
            value-format="HH:mm"
            format="HH:mm"
            placeholder="任意时间点">
          </el-time-picker>
        </el-form-item>

        <el-form-item label="使用分组" class="group-select" :label-width="formLabelWidth">
          <el-select
            class="input-new-tag"
            @change="handleGroup"
            v-model="inputValue1" clearable placeholder="请选择分组">
            <el-option
              v-for="item in groupList"
              :key="item.groupId"
              :label="item.groupName"
              :value="item.groupId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="" :label-width="formLabelWidth">
          <el-tag
            :key="tag"
            v-for="tag in groupSelect"
            closable
            :disable-transitions="false"
            @close="groupClose(tag)">
            {{showTest(tag)}}
          </el-tag>
        </el-form-item>

        <el-form-item label="干预内容" :label-width="formLabelWidth">
          <el-col :span="24">
            <el-input
              type="textarea"
              :rows="6"
              resize="none"
              :autosize="{ minRows: 3, maxRows: 5}"
              placeholder="请输入干预内容"
              v-model="recheckParams.content" maxlength='200' @input="conputed_once()">
            </el-input>
            <span>{{conputed_onceNum}}/50</span>
          </el-col>
        </el-form-item>
        <el-form-item label=" " :label-width="formLabelWidth">
          <el-col :span="24">
            <el-button size="small" type="primary" @click="MsgModel = true">选择模板</el-button>
          </el-col>
        </el-form-item>
      </el-form>
      <!-- 短信模板 -->
      <el-dialog
        width="500px"
        title="短信模板"
        :visible.sync="MsgModel"
        append-to-body>
        <el-form :model="recheckParams" :before-close="conputed_once">
          <el-form-item class="msgFlax" label="1." :label-width="formLabelWidth3">
            <el-radio v-for="(item,index) in msgList" :key="index" class="message" v-model="recheckParams.content"
                      :label="item">{{item}}
            </el-radio>
          </el-form-item>
        </el-form>
        <div>
          <ul>
            <li>注：</li>
            <li class="m_l_30">${checkDate}为到检时间；</li>
            <li class="m_l_30">${count}为多少项。</li>
          </ul>
        </div>
        <div class="btn-row">
          <el-button size="small" type="primary" @click="conputed_once()">确定</el-button>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleBtn">取 消</el-button>
        <el-button type="primary" @click="sureBtn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
  ERR_OK,
  addPlan,//新增复检建议计划
  endPlan,//终止复检建议计划
  getMedicalGroupIdNameList,//用户医学分组id、name下拉框列表
  haveEnoughSmsAmount,//查看机构是否还有短信额度
  getPlanList,//查看计划列表
  getSmsTemplates//查看消息模板
} from '@/api/api'
import {getStore,EncodeDoctorId} from '@/config/mUtils'
  export default {
    name: "prompt",
    data() {
      return {
        conputed_onceNum: 0,//干预内容短信字数提示
        MsgModel: false, //短信模板弹窗
        formLabelWidth3: '20px',
        institutionCode: '',
        userId: '',
        searchParams: {
          pageSize: 10,
          currentPage: 1,
          groupName: '',
          planName: '',
          status: null
        },
        tableData: [],
        totalCount: 0,
        recheckParams: {
          checkDay: null,
          content: '',
          description: '',
          endTime: '',
          executeTime: '',
          name: '',
          startTime: ''
        },
        recheckStatus: false,
        formLabelWidth: "200px",
        dateSelection: '',
        timeSelection: '',
        inputVisible: false,
        inputValue1: '',
        inputValue2: '',
        groupList: [],
        groupSelect: [],
        messageBalance: {
          haveAmount: false,
          settingAmount: 0,
          usedAmount: 0
        },
        msgList: ''
      }
    },
    activated() {
      this.institutionCode = JSON.parse(getStore('userMesage')).institutionCode;
      this.userId = EncodeDoctorId(JSON.parse(getStore('userMesage')).userId);
      this.chatBalance();
      this.getTableList();
    },
    methods: {
      /*字数提示*/
      conputed_once() {
        this.conputed_onceNum = this.recheckParams.content.length;
        this.MsgModel = false;
      },
      /*获取时间*/
      getselTime() {
        if (this.dateSelection) {
          // this.recheckParams.startTime = this.dateSelection[0];
          // this.recheckParams.endTime = this.dateSelection[1];
        }
      },
      /*查看机构是否短信额度*/
      chatBalance() {
        let params = {
          institutionCode: this.institutionCode
        };
        haveEnoughSmsAmount(params).then((res) => {
          if (res.code === ERR_OK) {
            this.messageBalance = res.data;
          } else {
            this.$alert(res.msg, '提示')
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        })
      },
      /*联系客服*/
      telPhone() {
        this.$alert('请和客服联系,进行续费处理', {
          confirmButtonText: '知道了',
          center: true,
          showClose: false
        });
      },
      /*获取列表数据*/
      getTableList() {
        let params = {
          currentPage: this.searchParams.currentPage,
          groupName: this.searchParams.groupName,
          pageSize: this.searchParams.pageSize,
          planName: this.searchParams.planName,
          institutionCode: this.institutionCode,
          status: this.searchParams.status
        };
        getPlanList(params).then((res) => {
          if (res.code === ERR_OK) {
            this.tableData = res.data.list;
            this.totalCount = res.data.totalCount
          } else {
            this.$alert(res.msg, '提示')
          }
        }).catch(() => {
          this.$message.error('网络错误,请稍后重试!')
        })
      },
      /*查询列表*/
      onSearch() {
        this.searchParams.currentPage = 1;
        this.searchParams.pageSize = 10;
        this.getTableList()
      },
      /*清除查询参数*/
      clearParams() {
        this.searchParams.currentPage = 1;
        this.searchParams.groupName = '';
        this.searchParams.pageSize = 10;
        this.searchParams.planName = '';
        this.searchParams.status = null;
      },
      /*选择每页条数*/
      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this.getTableList()
      },
      /*选择当前页*/
      handleCurrentChange(val) {
        this.searchParams.currentPage = val;
        this.getTableList()
      },
      /*新增复检*/
      addGroup() {
        this.getDownList();
        this.getMsgContent();
        this.recheckStatus = true;
      },
      /*结束计划*/
      delBtn(value) {
        this.$confirm('确定要结束任务?', '复检计划', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const loading = this.$loading({
            lock: true,
            text: '正在结束任务...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });

          let params = {
            accountId: this.userId,
            id: value.id
          };
          endPlan(params).then(res => {
            loading.close();
            if (res.code === ERR_OK) {
              this.$message({
                message: '复检计划已结束',
                type: 'success'
              });
              this.getTableList()
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
      /*获取分组下拉数据*/
      getDownList() {
        let params = {
          institutionCode: this.institutionCode
        };
        getMedicalGroupIdNameList(params).then((res) => {
          if (res.code === ERR_OK) {
            this.groupList = res.data;
          } else {
            this.$alert(res.msg, '提示')
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        })
      },
      /*分组选择start*/
      groupClose(tag) {
        this.groupSelect.splice(this.groupSelect.indexOf(tag), 1);
      },
      handleGroup() {
        let inputValue = this.inputValue1;
        let dataStatus = true;
        if (inputValue) {
          this.groupSelect.forEach((v) => {
            if (v === inputValue) {
              dataStatus = false;
            }
          });
          if (dataStatus && this.groupSelect.length < 5) {
            this.groupSelect.push(inputValue);
          } else if (!dataStatus) {
            this.$message.error('该分组已选,请重新选择')
          } else if (this.groupSelect.length >= 5) {
            this.$message.error('该分组已达到最大值')
          }
        }
        this.inputValue1 = '';
      },
      /*根据分组id展示分组名称*/
      showTest(val) {
        let testDate;
        this.groupList.forEach((v) => {
          if (val === v.groupId) {
            testDate = v.groupName
          }
        });
        return testDate;
      },
      /*分组选择end*/
      /*干预内容选择*/
      getMsgContent() {
        getSmsTemplates({}).then((res) => {
          if (res.code === ERR_OK) {
            this.msgList = res.data;
          }
        })
      },
      /*取消创建*/
      cancleBtn() {
        this.recheckStatus = false;
        this.recheckParams.checkDay = null;
        this.recheckParams.content = '';
        this.recheckParams.description = '';
        this.recheckParams.endTime = '';
        this.recheckParams.executeTime = '';
        this.recheckParams.name = '';
        this.recheckParams.startTime = '';
        this.dateSelection = '';
        this.groupSelect = []
        this.conputed_onceNum = 0;
      },
      /*确定创建*/
      sureBtn() {
        let params = {
          accountId: this.userId,
          checkDay: this.recheckParams.checkDay,
          content: this.recheckParams.content,//干预内容
          description: this.recheckParams.description,//计划描述
          executeTime: this.recheckParams.executeTime,//计划每日执行时间点
          institutionCode: this.institutionCode,//机构编号
          name: this.recheckParams.name,//计划名称
          startTime: this.dateSelection,//计划开始时间
          targetGroupIds: this.groupSelect//目标分组
        };
        if (params.targetGroupIds.length === 0) {
          this.$alert('请选择分组');
          return;
        }
        addPlan(params).then((res) => {
          if (res.code === ERR_OK) {
            this.recheckStatus = false;
            this.cancleBtn();
            this.getTableList()
          } else {
            this.$alert(res.msg, '提示')
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        })
      }
    }
  }
</script>
<style>
  .el-tag {
    margin-right: 10px;
  }
</style>
<style scoped lang="less">
  .have-amount{
    text-align:right;
    margin-bottom:10px;
    color:#666;

    .amount-text{
      display:inline-block;
      margin-right:20px;
      .redStyle{
        color:#F56C6C;
      }
      span{
        color:#409EFF;
      }
    }
  }
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
    .el-form-item {
      margin-bottom: 15px;
    }
    .group-select {
      margin-bottom: 5px;
    }
  }

  .group-dialog /deep/ .el-input__inner {
    width: 260px;
  }
  /*短信模板*/

  .message /deep/ .el-radio__label {
    display: block;
    line-height:24px;
    word-break: normal;
    width: 400px;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow: hidden;
  }
  .message {
    display: flex !important;
    align-items: center;
    .el-radio__input {
      display: block;
      line-height: 210%;
    }
  }
  .m_l_30{
    margin-left:30px;
  }
  .btn-row {
    text-align: center;
    padding-top: 20px;
  }
  .msgFlax {
    display: flex !important;
    align-items: center;
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }


  /*新增弹窗样式end*/
</style>
