<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <!--操作行-->
      <el-form :inline="true" :model="searchParams" class="demo-form-inline">
        <el-form-item label="是否死亡">
          <el-select v-model="searchParams.whetherDead" clearable placeholder="请选择">
            <el-option v-for="item in isDeath" :key="item.name" :label="item.name" :value="item.val"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="searchParams.messageStatus" clearable placeholder="选择状态">
            <el-option v-for="item in selectStu" :key="item.name" :label="item.name" :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="消息体">
          <el-input v-model="searchParams.messageBody" placeholder="消息体"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="doSearch">查 询</el-button>
          <el-button type="primary" @click="sendAllFn">重 发</el-button>
          <el-button type="primary" @click="clearParams">清 除</el-button>
          <el-button type="primary" @click="clearDate">删 除</el-button>
        </el-form-item>
      </el-form>


      <el-table :data="msgLists" border style="width: 100%" @selection-change="handleSelectionChange"
                ref="multipleTable">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="consumeQueue" label="队列名称"></el-table-column>
        <el-table-column prop="messageSendTimes" label="发送次数" width="100"></el-table-column>
        <el-table-column show-overflow-tooltip prop="messageBody" label="消息体"></el-table-column>
        <el-table-column show-overflow-tooltip prop="createTime" width="180" label="创建时间"></el-table-column>
        <!--<el-table-column show-overflow-tooltip prop="updateTime" label="更新时间"></el-table-column>-->

        <el-table-column label="是否死亡" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.whetherDead === 0">未死亡</el-tag>
            <el-tag type="danger" v-else="scope.whetherDead === 1">死亡</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.messageStatus===0">待确认</el-tag>
            <el-tag v-else type="success">发送中</el-tag>
          </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip prop="remark" label="备注" width="240"></el-table-column>
      </el-table>
      <!--table 表单结束-->
      <div class="self-page-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="searchParams.currentPage" :page-sizes="[10,20]" :page-size="searchParams.pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import headerTop from '@/components/headTop.vue';
  import {ERR_OK, getQueueMsgList, sendMsgAll,batchDeleteMessage} from "@/api/api.js";

  export default {
    data() {
      return {
        searchParams: {
          currentPage: 1,//页码
          pageSize: 10,//
          messageBody: "",
          whetherDead: "",//是否死亡
          messageStatus: ""//消息状态
        },
        //是否死亡
        isDeath: [
          {name: "未死亡", val: 0},
          {name: "死亡", val: 1}
        ],
        //状态
        selectStu: [
          {name: "待确认", val: 1},
          {name: "发送中", val: 2}
        ],
        msgLists: [],
        multipleSelection: [],
        totalCount: 0,
      }
    },
    components: {
      headerTop
    },
    methods: {
      /*获取消息列表*/
      getQueueListFn() {
        let params = {
          currentPage: this.searchParams.currentPage,
          messageBody: this.searchParams.messageBody,
          messageStatus: this.searchParams.messageStatus || null,
          pageSize: this.searchParams.pageSize,
          whetherDead: this.searchParams.whetherDead
        };
        getQueueMsgList(params).then(res => {
          if (res.code === ERR_OK) {
            this.msgLists = res.data.list;
            this.totalCount = res.data.totalCount
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        })
      },
      /*搜索*/
      doSearch() {
        this.searchParams.currentPage = 1;
        this.getQueueListFn()
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      //选择
      selectIds: function () {
        let ids = [];
        this.multipleSelection.forEach(function (item) {
          ids.push(item.messageId);
        });
        return ids;
      },
      //重发
      sendAllFn() {
        let idArr = this.selectIds();
        if (idArr.length === 0) {
          this.$alert("至少选择一条", '提示', {
            confirmButtonText: '确定',
          });
          return;
        }
        let params = {
          messageIds: idArr
        };
        sendMsgAll(params).then(res => {
          if (res.code === ERR_OK) {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.getQueueListFn()
              }
            })
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试');
        })
      },
      /*清除参数*/
      clearParams() {
        this.searchParams.currentPage = 1;//页码
        this.searchParams.pageSize = 10;
        this.searchParams.messageBody = "";
        this.searchParams.whetherDead = "";//是否死亡
        this.searchParams.messageStatus = "";//消息状态
      },
      /*批量删除数据*/
      clearDate(){
        let idArr = this.selectIds();
        if (idArr.length === 0) {
          this.$alert("至少选择一条", '提示', {
            confirmButtonText: '确定',
          });
          return;
        }
        let params = {
          messageIds: idArr
        };
        batchDeleteMessage(params).then((res)=>{
          if (res.code === ERR_OK) {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.getQueueListFn()
              }
            })
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试');
        })
      },
      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this.getQueueListFn()
      },
      handleCurrentChange(val) {
        this.searchParams.currentPage = val;
        this.getQueueListFn()
      }
    },
    activated() {
      this.getQueueListFn();
    }
  }
</script>
