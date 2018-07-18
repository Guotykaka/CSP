<template>
  <div class="call_doctor">
    <!--<header-top></header-top>-->
    <div class="main-message">
      <div class="main-header">
        <span class="msg-title">我的留言板</span>
      </div>
      <div class="addMsg">
        <el-input v-model="leaveWordTitle" size="large" clearable class="addInput" maxlength="30"
                  placeholder="请描述你的问题"></el-input>
        <el-input
          type="textarea"
          v-model="leaveWordContent"
          rows=10
          maxlength="500"
          class="addTextarea"
          resize="none"
          placeholder="请详细描述你的问题"></el-input>
        <el-button class="btnAdd" type="primary" @click="getSaveInsLeaveWord">提交</el-button>
      </div>
      <div class="message-deatil">
        <ul>
          <li class="detail-li" v-for="(item,index) in insLeaveDetail" :key="item.insLeaveWordId">
            <ul class="detail-title">
              <li v-if="item.leaveWordStatus==1">状态:<span class="text-red">待回复</span></li>
              <li v-if="item.leaveWordStatus==2">状态:<span class="text-green">已回复</span></li>
              <li v-if="item.leaveWordStatus==3">状态:<span class="text-hui">已关闭</span></li>
              <li>留言人:<span class="text-black">{{item.createUserName}}</span></li>
              <li>联系方式:<span class="text-black">{{item.mobile}}</span></li>
              <li>留言时间:<span class="text-black">{{item.createTime}}</span></li>
            </ul>
            <div class="detail-main">
              <ul class="text-detail">
                <li>
                  <span class="text-sblack">标题:</span>
                  <span>{{item.leaveWordTitle}}</span>
                </li>
                <li>
                  <span class="text-sblack">内容:</span>
                  <span>{{item.leaveWordContent}}</span>
                </li>
              </ul>

              <!--回复内容-->
              <transition-group name="fade" tag="div">
                <div class="re-circle" v-if="checkId==index" v-for="(item1,index1) in insLeaveAnswerlist" :key="index1">
                  <span class="res-title">回复</span>
                  <div class="resCircle">
                    <span class="res-main">{{item1.answerContent}}</span>
                    <ul class="res-sign">
                      <li>
                        <span class="text-sblack">回复人:</span>
                        <span>{{item1.answerUserName}}</span>
                      </li>
                      <li>
                        <span class="text-sblack">回复时间:</span>
                        <span>{{item1.createTime}}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </transition-group>
              <ul class="event-btn" v-if="checkId!==index">
                <li @click="evnetShowList(item,index)">展开<b class="iconfont icon-xiangs-copy"></b></li>
              </ul>
              <ul class="event-btn" v-if="checkId==index">
                <li @click="closeList(item.insLeaveWordId)" v-if="item.leaveWordStatus!=3" class="text-red">关闭</li>
                <li @click="replyList(item.insLeaveWordId)"
                    v-if="(item.leaveWordStatus!=3)&&(createUserId!=checkCreatId)">回复
                </li>
                <li @click="eventHiddenList">收起<b class="iconfont icon-xiala-copy"></b></li>
              </ul>
            </div>
          </li>
        </ul>
        <div class="pageS">
          <el-pagination
            v-if="insLeaveDetail.length>0"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="searchParams.currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="searchParams.pageSize"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
          <span v-else class="text-hui">暂无数据</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import headerTop from "@/components/headTop.vue"
  import {localUrl} from "@/config/env.js"
  import {getStore} from "@/config/mUtils.js"
  import {
    ERR_OK,
    api,
    closeInsLeaveWordAnswer,
    queryInsLeaveWordAnswerList,
    queryInsLeaveWordList,
    saveInsLeaveWord,
    saveInsLeaveWordAnswer,
  } from '@/api/api';

  export default {
    name: 'call_doctor',
    components: {
      headerTop,
    },
    data() {
      return {
        showList: false,
        replayMain: false,
        userInfo:{},//用户信息
        searchParams: {
          currentPage: 1,//页码
          pageSize: 10,//
          providerServiceUserType: 1,
          orderServiceStatus: 0,
          providerServiceUserId: null
        },
        leaveWordContent: '',//描述内容
        leaveWordTitle: '',//描述标题
        createUserId: null,//用户ID
        insLeaveDetail: [],//留言信息列表
        insLeaveAnswerlist: [],//留言回复列表
        insLeavePage: {
          currentPage: 1,
          pageCount: 1,
          pageSize: 10,
          totalCount: null, //了留言回复列表
        },//留言信息列表页数
        resList: {},
        checkT: null,
        list: [],
        checkId: null,
        insDoctorId: null,
        checkCreatId: null,//验证createuserId
        clickAgain: true//限制多次点击
      }
    },
    created() {
      this.userInfo = JSON.parse(getStore('userMesage'));
      this.createUserId = this.userInfo.userId;
      this.insDoctorId = this.userInfo.insDoctorId;
      this._getQueryInsLeaveWordList();
    },
    methods: {
      //关闭
      closeList: function (val) {
        let _this = this,
         params = {
          insLeaveWordId:val
        }
        closeInsLeaveWordAnswer(params).then((res)=>{
          if (res.code === ERR_OK) {
            this._getQueryInsLeaveWordList();
            this.checkId = null;
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        })
      },
      //回复
      replyList: function (val) {
        // this.refuseBox=true;
        let that = this;
        this.$prompt('请填写回复内容', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputType: 'textarea',
          customClass: 're-msg'
        }).then(({value}) => {
          var parernId = null;
          if (that.insLeaveAnswerlist.length > 0) {
            var count = that.insLeaveAnswerlist.length - 1;
            parernId = that.insLeaveAnswerlist[count].insLeaveWordAnswerId;
          } else {
            parernId = val;
          }
          let parms = {
            "answerContent": value,
            "answerUserId": that.createUserId,
            "insLeaveWordId": val,
            "parentId": parernId
          };

          saveInsLeaveWordAnswer(parms).then((res) => {
            if (res.code === ERR_OK) {
              this.$alert(res.msg, '提示', {
                confirmButtonText: '确定',
              })
              that._getQueryInsLeaveWordList()
              that.checkId = null;
            } else {
              this.$alert(res.msg, '提示', {
                confirmButtonText: '确定',
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      //展开
      evnetShowList: function (val, index) {
        this.replayMain = true;
        this.checkId = index;
        this.showList = true;
        let _this = this,
          params = {
            insLeaveWordId:val.insLeaveWordId
          };

        queryInsLeaveWordAnswerList(params).then((res) => {
          if (res.code === ERR_OK) {
            _this.insLeaveAnswerlist = res.data;
            if (_this.insLeaveAnswerlist.length > 0) {
              var count = _this.insLeaveAnswerlist.length - 1;
              _this.checkCreatId = _this.insLeaveAnswerlist[count].answerUserId;
            } else {
              _this.checkCreatId = val.createUserId;
            }
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        });
        this.resList = this.insLeaveAnswerlist;
        // this.showList = true;
      },
      //收起
      eventHiddenList: function () {
        this.replayMain = false;
        this.showList = false;
        this.checkId = null
      },
      //填写留言信息
      getSaveInsLeaveWord: function () {
        this.eventHiddenList();
        if (this.leaveWordTitle == '') {
          this.$alert('请填写留言标题', '提示', {
            confirmButtonText: '确定',
          })
          return;
        } else if (this.leaveWordContent == '') {
          this.$alert('请填写留言内容', '提示', {
            confirmButtonText: '确定',
          })
          return;
        }
        if (this.clickAgain) {
          var params = {
            "leaveWordContent": this.leaveWordContent,
            "leaveWordTitle": this.leaveWordTitle,
            "createUserId": this.createUserId,
            "toRoleId": 12,
            "leaveWordStatus": 1
          };
          this.clickAgain = false;
          saveInsLeaveWord(params).then((res)=>{
            if (res.code === ERR_OK) {
              this.leaveWordContent = '';
              this.leaveWordTitle = '';
              this.clickAgain = true;
              this._getQueryInsLeaveWordList();
            } else {
              this.$alert(res.msg, '提示', {
                confirmButtonText: '确定',
              })
            }
          })
        } else {
          return
        }
      },
      //请求所有留言
      _getQueryInsLeaveWordList: function () {
        let params = {
          "createUserId": this.createUserId,
          // "leaveWordStatus": 1,//信息状态待回复1 ,2已回复,3已关闭
          "leaveWordTitle": '',
          "pageSize": this.searchParams.pageSize,
          "currentPage": this.searchParams.currentPage
        };
        queryInsLeaveWordList(params).then((res) => {
          if (res.code === ERR_OK) {
            this.insLeaveDetail = res.data.list;
            this.total = res.data.totalCount;
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        });
      },
      /*分页*/
      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this._getQueryInsLeaveWordList()
      },
      handleCurrentChange(val) {
        this.searchParams.currentPage = val;
        this._getQueryInsLeaveWordList();
      }
    },
    watch: {
      resList: {//深度监听，可监听到对象、数组的变化
        handler: function (val, oldVal) {
          return val;
        },
        deep: true
      }
    }
  }
</script>

<style scoped lang="less">
  .call_doctor {
    line-height: 32px;
    .main-message {
      overflow: hidden;
      position: relative;
      padding-bottom: 60px;
      font-size: 14px;
      .main-header {
        margin-top: 20px;
        padding: 0 20px;
        height: 34px;
        overflow: hidden;
        .msg-title {
          font-size: 16px;
          font-weight: 700;
          color: #333;
          float: left;
          padding: 0 10px;
          border-bottom: 2px solid #2186f6;

        }
      }
    }
    /*添加留言*/
    .addMsg {
      border-top: 1px solid #e5e5e5;
      padding: 0 20px 56px;
      overflow: hidden;
      position: relative;
      font-size: 14px;
      .addInput {
        width: 50%;
        line-height: 40px;
        display: block;
        margin-bottom: 30px;
        margin-top: 30px;
      }
      .addTextarea {
        width: 50%;
        display: block;
      }

      .btnAdd {
        width: 120px;
        height: 40px;
        padding: 0 10px;
        line-height: 40px;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        float: right;
        margin-top: 20px;
        color: #fff;
        position: absolute;
        bottom: 0;
        right: 50%;
      }
    }
    .message-deatil {
      margin-top: 20px;
      overflow: hidden;
      .detail-li {
        overflow: hidden;
        border: 1px solid #e5e5e5;
        border-radius: 5px;
        .detail-title {
          color: #999;
          border-bottom: 1px solid #e5e5e5;
          background-color: #e8e8e8;
          border-radius: 5px 5px 0 0;
          display: flex;
          justify-content: space-between;
          padding: 0 20px;
          li {
            height: 40px;
            line-height: 40px;
          }
          span {
            margin-left: 10px;
          }
        }
      }
    }
    .text-red {
      color: #F56C6C;
    }

    .text-green {
      color: #67C23A;
    }

    .text-hui {
      color: #909399;
    }

    .text-blue {
      color: #409EFF;
    }

    .text-black {
      color: #333;
      margin-left: 10px;
    }

    .text-sblack {
      color: #999;
      margin-right: 5px;
    }

    .detail-main {
      padding: 10px;
      overflow: hidden;
      float: left;
      width: calc(100% - 20px);
      .text-detail {
        float: left;
        display: block;
        width: 100%;
        margin-bottom: 20px;
        li {
          width: 80%;
        }
      }

      .re-circle {
        position: relative;
        overflow: hidden;
        float: left;
        width: 100%;
        padding: 10px;
        .res-title {
          background-color: #fff;
          padding: 0 5px;
          height: 30px;
          position: absolute;
          top: -4px;
          left: 25px;
          color: #999;
        }
        .resCircle {
          border: 1px dashed #999;
          border-radius: 5px;
          line-height: 30px;
          width: 80%;
          padding: 10px;
          overflow: hidden;
          .res-main {
            color: #333;
            height: 30px;
            padding: 10px;
            overflow: hidden;
          }
          .res-sign {
            float: right;
            li {
              float: left;
              margin-right: 20px;
            }
          }
        }
      }
      .event-btn {
        float: right;
        display: block;
        overflow: hidden;
        font-size: 14px;
        li {
          float: left;
          margin-right: 10px;
          color: #409EFF;
        }
      }
      .fade-move {
        transition: all 2s;
      }

    }
    .pageS {
      text-align: center;
      margin: 20px auto;
    }
  }
</style>
