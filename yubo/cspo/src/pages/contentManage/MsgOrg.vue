<template>
  <div class="MsgOrg">
    <header-top></header-top>
    <div class="page-container">
      <div class="msg-form">
        <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
          <el-form-item label="标题名">
            <el-input v-model="formInline.title" placeholder="请输入标题名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查 询</el-button>
            <el-button type="info" @click="clearSub">清 除</el-button>
            <el-button type="primary" @click="addMsg">创建消息</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="msg-table">
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column show-overflow-tooltip fixed type="index" label="序号" width="80"
                           align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="title" label="标题"></el-table-column>
          <el-table-column show-overflow-tooltip prop="description" label="详情"></el-table-column>
          <el-table-column show-overflow-tooltip prop="pushContent" label="推送内容"></el-table-column>
          <el-table-column show-overflow-tooltip prop="createTime" label="创建时间"></el-table-column>
          <el-table-column show-overflow-tooltip prop="pushTime" label="发送时间"></el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
            width="200">
            <template slot-scope="scope">
              <el-button @click="delTag(scope.row)" v-if="compareDate(scope.row.pushTime)" type="danger" size="small">
                移除
              </el-button>
              <el-button @click="delTag(scope.row)" v-else type="danger" size="small" disabled>移除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="table-page" v-if="pageShow">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="formInline.currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="formInline.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageTotal">
          </el-pagination>
        </div>
      </div>
      <el-dialog title="创建消息" :visible.sync="MsgStatus" width="600px">
        <el-form ref="form" :model="form" label-width="90px" size="small">
          <el-form-item label="标题：">
            <el-input v-model="form.title" class="item-wdith"></el-input>
          </el-form-item>
          <el-form-item label="描述：">
            <el-input v-model="form.desc" class="item-wdith"></el-input>
          </el-form-item>
          <el-form-item label="选择时间：">
            <el-col :span="5">
              <el-date-picker type="date" placeholder="发送日期" v-model="form.date1" style="width: 100%;"
                              value-format="yyyy-MM-dd"></el-date-picker>
            </el-col>
            <el-col class="line" :span="2" style="text-align: center">-</el-col>
            <el-col :span="5">
              <el-time-select
                placeholder="发送时间"
                value-format="HH-mm-ss"
                :picker-options="{
                  start: '00:00',
                  step: '01:00',
                  end: '23:00'
                }"
                v-model="form.date2" style="width: 100%;"></el-time-select>
            </el-col>
          </el-form-item>
          <el-form-item label="跳转类型：">
            <el-select v-model="form.type" placeholder="请选择跳转类型" class="item-wdith" @change="selPushMsg">
              <el-option :label="item.pushTypeName" :value="item.pushType" v-for="item in typeList"
                         :key="item.pushType"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="推送参数：">
            <el-input v-model="form.pushContent" class="item-wdith" :placeholder="showPushMsg"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancleAdd">取 消</el-button>
          <el-button type="primary" @click="sureAdd">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import headerTop from '@/components/headTop.vue';
  import {ERR_OK, deletePushinfo, queryNewsCategory, savePushinfo, queryPushTypeList} from "@/api/api";
  import {IsAlert} from '@/config/mUtils.js';

  export default {
    name: "MsgOrg",
    components: {
      headerTop
    },
    data() {
      return {
        formInline: {
          title: '',
          pageSize: 10,
          currentPage: 1
        },
        pageTotal: null,
        tableData: [],
        MsgStatus: false,
        form: {
          title: '',
          desc: '',
          date1: '',
          date2: '',
          type: '',
          pushContent: ''
        },
        typeList: [],
        showPushMsg:'',
        formLabelWidth: '120px'
      }
    },
    methods: {
      handleSizeChange(val) {
        this.formInline.pageSize = val;
        this.getMsgInfo();
      },
      handleCurrentChange(val) {
        this.formInline.currentPage = val;
        this.getMsgInfo();
      },
      getMsgInfo() {
        let params = this.formInline;
        queryNewsCategory(params).then((res) => {
          if (res.code === ERR_OK) {
            this.tableData = res.data.list;
            this.pageTotal = res.data.totalCount;
          } else {
            IsAlert(res.msg,'错误','error');
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        })
      },
      //图文类别
      getqueryPushTypeList() {
        let params = {}
        queryPushTypeList(params).then((res) => {
          if (res.code === ERR_OK) {
            this.typeList = res.data;
          } else {
            IsAlert(res.msg,'错误','error');
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        })
      },
      selPushMsg(v) {
        this.showPushMsg = v.pushTypeTip;
      },
      onSubmit() {
        this.formInline.pageSize = 10;
        this.formInline.currentPage = 1;
        this.getMsgInfo();
      },
      addMsg() {
        this.MsgStatus = true;
        this.clearSub();
        this.getqueryPushTypeList();
      },
      //清空请求参数
      clearSub() {
        this.formInline = {
          title: '',
          pageSize: 10,
          currentPage: 1
        };
        if (this.MsgStatus) {
          this.form = {
            title: '',
            desc: '',
            date1: '',
            date2: '',
            type: '',
            pushContent: ''
          };
          this.showPushMsg='';
        }
      },
      //移除
      delTag(row) {
        let params = {
          pushId: row.pushId
        };
        this.$confirm('确定要删除吗？')
          .then(_ => {
            deletePushinfo(params).then((res) => {
              if (res.code === ERR_OK) {
                IsAlert(res.msg,'成功','success');
                this.getMsgInfo();
              } else {
                IsAlert(res.msg,'错误','error');
              }
            }).catch(() => {
              this.$message.error('网络错误!请稍后重试')
            })
          })
          .catch(() => {})
      },
      /*创建消息*/
      //确定新增
      sureAdd() {
        let params =
          {
            description: this.form.desc,
            pushContent: this.form.pushContent,
            pushTime: this.form.date1 + ' ' + this.form.date2+':00',
            pushType: this.form.type,
            title: this.form.title
          };
        if (params.title === '') {
          IsAlert('请输入推送标题','提示','warning');
        } else if (params.description === '') {
          IsAlert('请输入描述','提示','warning');
        } else if (params.pushType === '') {
          IsAlert('请选择推送类型','提示','warning');
        } else if (params.pushTime === '') {
          IsAlert('请选择推送时间','提示','warning');
        } else if (params.pushContent === '') {
          IsAlert('请输入推送参数','提示','warning');
        } else {
          savePushinfo(params).then((res) => {
            if (res.code === ERR_OK) {
              this.MsgStatus = false;
              this.getMsgInfo();
            } else {
              IsAlert(res.msg,'错误','error');
            }
          }).catch(()=>{
            this.$message.error('网络错误!请稍后重试')
          })
        }
      },
      cancleAdd() {
        this.MsgStatus = false;
      },
      compareDate(time) {
        let showStatus = true;
        let date = new Date(time);
        let currentTime = new Date();
        let time1 = date.getTime();
        let time2 = currentTime.getTime();
        if (time2 > time1) {
          showStatus = false;
        }
        return showStatus;
      }
    },
    activated() {
      this.getMsgInfo();
    },
    computed: {
      pageShow() {
        return this.tableData.length > 0
      }
    }
  }
</script>

<style scoped lang="less">
  .MsgOrg{
    height:100%;
    width:100%;
  }
  .page-container {
    .item-wdith {
      width: 300px;
    }
    .dialog-footer {
      text-align: center;
    }
    .table-page {
      margin-top: 20px;
      text-align: center;
    }
  }
</style>
