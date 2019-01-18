<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container go-myself" v-cloak>
      <ul class="header-message">
        <li>
          <img src="../../asset/img/logo.jpg" alt="">
        </li>
        <li>
          <div class="list-message">
            <p>姓名：<span class="te-huihui">{{userMessage.username}}</span></p>
            <p>角色：<span class="te-huihui">运营人员</span></p>
          </div>
        </li>
        <li>
          <div class="list-message">
            <p>邮箱账号：<span class="te-huihui">{{userMessage.email}}</span></p>
            <p>联系方式(手机)：<span class="te-huihui">{{userMessage.mobile}}</span></p>
          </div>
        </li>
      </ul>

      <div class="main-message">
        <el-tabs v-model="activeName" class="msg-title">
          <el-tab-pane label="我的留言板" name="first"></el-tab-pane>
        </el-tabs>
        <ul class="search-message">
          <li>
            <span>状态：</span>
            <el-select size="medium" v-model="selStatus" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </li>
          <li>
            <span>留言标题:</span>
            <el-input style="width:200px;" v-model="creatName" size="medium" placeholder="请输入内容"></el-input>
          </li>
          <li>
            <el-button size="small" type="primary" icon="el-icon-search" @click="_getQueryInsLeaveWordList">搜索
            </el-button>
          </li>
        </ul>
        <div class="message-deatil">
          <ul>
            <li class="message-body" style="overflow: hidden" v-for="(item,index) in insLeaveDetail" :key="index">
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
                  <div class="re-circle" v-if="checkId==index" v-for="(item1,index1) in insLeaveAnswerlist"
                       :key="index1">
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
  </div>
</template>
<script>
  import headerTop from '@/components/headTop.vue';
  import {
    ERR_OK,
    queryInsLeaveWordList,
    saveInsLeaveWordAnswer,
    queryInsLeaveWordAnswerList,
    closeInsLeaveWordAnswer
  } from '@/api/api';
  import {localUrl} from "@/config/env.js"
  import {getStore,EncodeUserId} from "@/config/mUtils.js"

  export default {
    name: 'goMyself',
    components: {
      headerTop
    },
    data() {
      return {
        userMessage: {},//用户信息
        options: [
          {
            value: '1',
            label: '待回复'
          },
          {
            value: '2',
            label: '已回复'
          },
          {
            value: '3',
            label: '已关闭'
          }],
        value: '',
        activeName: 'first',
        showList: true,
        replayMain: false,
        searchParams: {
          currentPage: 1,//页码
          pageSize: 10,//
          providerServiceUserType: 1,
          orderServiceStatus: 0,
          providerServiceUserId: null
        },
        total: null,
        createUserId: null,//用户id
        insLeaveDetail: [],//留言信息列表
        insLeaveAnswerlist: [],//留言回复列表
        checkId: null,
        creatName: null,//留言人
        checkCreatId: null,//验证createuserId
        selStatus: '',//留言状态
      }
    },
    activated() {
      this.userMessage = JSON.parse(getStore('userMesage'));
      this.createUserId = EncodeUserId(this.userMessage.userId);
      this._getQueryInsLeaveWordList();
    },
    methods: {
      //关闭
      closeList: function (val) {
        let data = {
          id: val
        }
        closeInsLeaveWordAnswer(data).then((res) => {
          if (res.code === ERR_OK) {
            this._getQueryInsLeaveWordList();
            this.checkId = null;
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试');
        })
      },
      //回复
      replyList: function (val) {
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
            answerContent: value,
            answerUserId: +that.createUserId,
            insLeaveWordId: val,
            parentId: parernId
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
          }).catch(() => {
            this.$message.error('网络错误!请稍后重试');
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
        var params = {
          "id": val.insLeaveWordId
        }
        this.checkId = index;
        this.showList = true;
        var _this = this;
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
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试');
        })
      },
      //收起
      eventHiddenList: function () {
        this.replayMain = false;
        this.showList = false;
        this.checkId = null
      },
      //数据请求
      _getQueryInsLeaveWordList: function () {
        var parms = {
          "leaveWordStatus": this.selStatus,
          "toRoleId": 12,
          "leaveWordTitle": this.creatName,
          "pageSize": this.searchParams.pageSize,
          "currentPage": this.searchParams.currentPage
        };
        queryInsLeaveWordList(parms).then((res) => {
          if (res.code === ERR_OK) {
            this.insLeaveDetail = res.data.list;
            this.total = res.data.totalCount;
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试');
        })
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
    }
  }
</script>
<style lang="less" scoped>
  .go-myself {
    font-size: 14px;
    color: #333;
    .header-message {
      background-color: #e5e5e5;
      border-radius: 10px 10px 5px 5px;
      padding: 20px 20px 20px;
      overflow: hidden;
      img {
        width: 96px;
        height: 96px;
        box-sizing: border-box;
        border-radius: 50%;
        vertical-align: middle;
      }
      li {
        float: left;
        text-align: left;
        margin-right: 150px;
      }
      li:nth-of-type(2) {
        margin-right: 200px;
      }
      .list-message {
        color: #999;
        margin-top: 20px;
        line-height: 32px;
        .te-huihui {
          color: #333;
        }
      }

    }

    .main-message {
      overflow: hidden;
      position: relative;
      padding-bottom: 50px;
      .msg-title {
        margin-top: 10px;
      }
      .search-message {
        height: 40px;
        line-height: 40px;
        margin-top: 20px;
        padding: 0 20px;
        list-style: none;
        li {
          float: left;
          margin-right: 20px;
        }
      }
      .message-deatil {
        margin-top: 30px;
        overflow: hidden;
        .text-black {
          color: #333;
          margin-left: 10px;
        }
        .message-body {
          margin-bottom: 10px;
        }
        .detail-title {
          background-color: #e8e8e8;
          border-radius: 5px 5px 0 0;
          display: flex;
          justify-content: space-between;
          padding: 0 20px;
          span {
            margin-left: 10px;
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
          li {
            color: #909399;
            height: 40px;
            line-height: 40px;
          }
        }

      }
      .detail-main {
        padding: 10px;
        overflow: hidden;
        float: left;
        width: calc(100% - 20px);
        .text-sblack {
          color: #999;
          margin-right: 5px;
        }
        .text-detail {
          float: left;
          display: block;
          width: 100%;
          margin-bottom: 20px;

          li {
            color: #333;
            width: 80%;
            margin-bottom: 5px;
          }
        }
        .event-btn {
          float: right;
          display: block;
          overflow: hidden;
          li {
            float: left;
            margin-right: 10px;
            color: #44a8f8;
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
            top: 0;
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
      }
    }
    .pageS {
      text-align: center;
      margin-top: 20px;
    }
    .fadeBox {
      display: block;
    }
    .fade-move {
      transition: all 3s;
    }
  }
</style>
