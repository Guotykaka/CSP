<template>
  <div class="call_doctor">
    <!--<header-top></header-top>-->
      <div class="main-message">
        <div class="main-header">
          <span class="msg-title">我的留言板</span>
        </div>
        <div class="addMsg">
          <input type="text" class="addInput form-control" placeholder="请描述你的问题" v-model="leaveWordTitle">
          <textarea class="addTextarea form-control" placeholder="请详细描述你的问题" name="" id=""
                    v-model="leaveWordContent"></textarea>
          <el-button class="btnAdd" type="primary" @click="getSaveInsLeaveWord">提交</el-button>
        </div>
        <div class="message-deatil">
          <ul>
            <li style="overflow: hidden;border:1px solid #e5e5e5;border-radius:5px;"
                v-for="(item,index) in insLeaveDetail" :key="index">
              <div class="detail-title">
                <ul>
                  <li v-if="item.leaveWordStatus==1">状态:<span class="text-red">待回复</span></li>
                  <li v-if="item.leaveWordStatus==2">状态:<span class="text-red">已回复</span></li>
                  <li v-if="item.leaveWordStatus==3">状态:<span class="text-red">已关闭</span></li>
                  <li>留言人:<span class="text-black">{{item.createUserName}}</span></li>
                  <li>联系方式:<span class="text-black">{{item.mobile}}</span></li>
                  <li>留言时间:<span class="text-black">{{item.createTime}}</span></li>
                </ul>
              </div>
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
        </div>
        <!--分页-->
        <div id="selPage"
             style="font-size: 6px; position: absolute; bottom: 0px;width:100%;background-color:#fff;margin:0 auto;text-align:right;"></div>
      </div>
  </div>
</template>

<script>
  import headerTop from "@/components/headTop.vue"

  export default {
    name: 'call_doctor',
    components: {
      headerTop,
    },
    data() {
      return {
        showList: false,
        replayMain: false,
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
      this.$store.state.navTitle = ''
    },
    methods: {
      //关闭
      closeList: function (val) {
        var _this = this;
        $.ajax({
          type: "POST",
          url: baseURL + "ins/insleaveword/closeInsLeaveWordAnswer",
          data: val,
          contentType: "application/json",
          dataType: "json",
          success: function (res) {
            if (res.code === 1) {
              vm._getQueryInsLeaveWordList();
              vm.checkId = null;
            } else {
              alert(res.msg);
            }
          }
        });
      },
      //回复
      replyList: function (val) {
        // this.refuseBox=true;
        layer.prompt({
          formType: 2,
          value: '',
          title: '请填写回复内容',
          area: ['400px', '200px'] //自定义文本域宽高
        }, function (value, index, elem) {
          if (value == '') {
            alert("回复内容不能为空");
            return
          }
          var parernId = null;
          if (vm.insLeaveAnswerlist.length > 0) {
            var count = vm.insLeaveAnswerlist.length - 1;
            parernId = vm.insLeaveAnswerlist[count].insLeaveWordAnswerId;
          } else {
            parernId = val;
          }
          var parms = {
            "answerContent": value,
            "answerUserId": vm.createUserId,
            "insLeaveWordId": val,
            "parentId": parernId
          };
          $.ajax({
            type: "POST",
            url: baseURL + "ins/insleaveword/saveInsLeaveWordAnswer",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(parms),
            success: function (res) {
              if (res.code === 1) {
                alert(res.msg, function () {

                });
                vm._getQueryInsLeaveWordList();
                vm.checkId = null;
              } else {
                alert(res.msg);
              }
            }
          });
          layer.close(index);
        });
      },
      //展开
      evnetShowList: function (val, index) {
        this.replayMain = true;
        var params = val.insLeaveWordId;
        this.checkId = index;
        vm.showList = true;
        var _this = this;
        //请求留言板列表
        $.ajax({
          type: "POST",
          url: baseURL + "ins/insleaveword/queryInsLeaveWordAnswerList",
          data: val.insLeaveWordId,
          contentType: "application/json",
          dataType: "json",
          success: function (res) {
            if (res.code === 1) {
              _this.insLeaveAnswerlist = res.data;
              if (_this.insLeaveAnswerlist.length > 0) {
                var count = _this.insLeaveAnswerlist.length - 1;
                _this.checkCreatId = _this.insLeaveAnswerlist[count].answerUserId;
              } else {
                _this.checkCreatId = val.createUserId;
              }
            } else {
              alert(res.msg);
            }
          }
        });

        this.resList = this.insLeaveAnswerlist;
        vm.showList = true;
      },
      //收起
      eventHiddenList: function () {
        this.replayMain = false;
        this.showList = false;
        this.checkId = null
      },
      //分页
      _initPage: function (val) {
        layui.use('laypage', function () {
          var laypage = layui.laypage;
          //完整功能
          laypage.render({
            elem: 'selPage'
            , limit: vm.searchParams.pageSize
            , count: val//总页数 //数据总数，从服务端得到
            , groups: 1
            , layout: ['count', 'prev', 'page', 'next', 'limit', 'skip']
            , limits: [10, 20, 30, 40, 50]
            , curr: vm.searchParams.currentPage
            , jump: function (obj, first) {
              vm.searchParams.currentPage = obj.curr;
              vm.searchParams.pageSize = obj.limit;
              //首次不执行
              if (!first) {
                vm._getQueryInsLeaveWordList();
              }
            }
          });
        });
      },
      //填写留言信息
      getSaveInsLeaveWord: function () {
        this.eventHiddenList();
        if (this.leaveWordTitle == '') {
          alert('请填写留言标题');
          return;
        } else if (this.leaveWordContent == '') {
          alert('请填写留言内容');
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
          $.ajax({
            type: "POST",
            url: baseURL + "ins/insleaveword/saveInsLeaveWord",
            data: JSON.stringify(params),
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
              if (res.code === 1) {
                console.log(res.data);
                vm.leaveWordContent = '';
                vm.leaveWordTitle = '';
                vm.clickAgain = true;
                vm._getQueryInsLeaveWordList();
              } else {
                alert(res.msg)
              }
            }
          });
        } else {
          return;
        }
      },
      //请求所有留言
      _getQueryInsLeaveWordList: function () {
        var params = {
          "createUserId": this.createUserId,
          // "leaveWordStatus": 1,//信息状态待回复1 ,2已回复,3已关闭
          "leaveWordTitle": '',
          "limit": this.searchParams.pageSize,
          "page": this.searchParams.currentPage
        };
        $.ajax({
          type: "POST",
          url: baseURL + "ins/insleaveword/queryInsLeaveWordList",
          data: JSON.stringify(params),
          contentType: "application/json",
          dataType: "json",
          success: function (res) {
            if (res.code === 1) {
              vm.insLeaveDetail = res.data.list;
              vm.insLeavePage = res.data.page;
              vm._initPage(res.data.page.totalCount)
            } else {
              alert(res.msg)
            }
          }
        });
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
  .header-message {
    background-color: #00a7d0;
    border-radius: 5px 5px 0 0;
    padding: 0 20px 20px;
  }

  .login-header {
    text-align: left;
    color: #333;
    height: 40px;
    line-height: 40px;
  }

  .login-message {
    ul {
      overflow: hidden;
    }
    li {
      float: left;
      text-align: center;
      margin-right: 30px;
    }
    img {
      width: 96px;
      height: 96px;
      box-sizing: border-box;
      border-radius: 50%;
      vertical-align: center;
    }
  }

  .list-message {
    display: flex;
    li {
      flex: 1;
      span {
        display: block;
        height: 32px;
        line-height: 32px;
      }
    }
    li:nth-of-type(1) span {
      text-align: right;
    }
    li:nth-of-type(2) span {
      text-align: left;
    }
  }

  .main-message {
    overflow: hidden;
    position: relative;
    padding-bottom: 60px;
    font-size:14px;
  }

  .main-header {
    margin-top: 20px;
    padding: 0 20px;
    line-height: 32px;
    height: 34px;
    overflow: hidden;
    span {
      float: left;
      padding: 0 10px;
      border-bottom: 2px solid #009688;
    }
    span:nth-of-type(1) {
      font-size: 20px;
      color: #666;
      font-weight: 700;
    }
  }

  .search-message {
    margin-top: 20px;
    padding: 0 20px;
    overflow: hidden;
    .add-style {
      list-style-type: none;
    }
  }

  .add-style li {
    float: left;
    margin-right: 20px;
    height: 30px;
    line-height: 30px;
  }

  .add-style li:nth-of-type(2n) input,
  .add-style li:nth-of-type(2n) select {
    width: 150px;
    height: 30px;
    line-height: 30px;
  }

  .btn-search {
    width: 80px;
    height: 30px;
    background-color: #e5e5e5;
    border-radius: 5px;
    border: none;
  }

  .text-red {
    color: #f2a498;
    font-weight: 700;
  }

  .text-black {
    color: #333;
    font-weight: 700;
  }

  .text-sblack {
    color: #999;
  }

  .message-deatil {
    margin-top: 20px;
    overflow: hidden;
  }

  .detail-title {
    border-bottom: 1px solid #e5e5e5;
    ul {
      background-color: #e8e8e8;
      border-radius: 5px 5px 0 0;
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
    }
    li {
      height: 30px;
      line-height: 30px;
    }
  }

  .detail-main {
    padding: 10px;
    overflow: hidden;
    float: left;
    width: 100%;
    .text-detail {
      float: left;
      display: block;
      width: 100%;
      margin-bottom: 20px;
      li {
        width: 80%;
      }
    }
  }

  .detail-main .event-btn {
    float: right;
    display: block;
    overflow: hidden;
    font-size: 14px;
  }

  .event-btn li {
    float: left;
    margin-right: 10px;
    color: #44a8f8;
  }

  .re-circle {
    position: relative;
    overflow: hidden;
    float: left;
    width: 100%;
    padding: 10px;
  }

  .resCircle {
    border: 1px solid #e5e5e5;
    border-radius: 5px;
    line-height: 30px;
    width: 80%;
    padding: 10px;
    overflow: hidden;
  }

  .res-title {
    background-color: #fff;
    padding: 0 5px;
    height: 30px;
    position: absolute;
    top: 0;
    left: 25px;
  }

  .res-main {
    height: 30px;
    padding: 10px;
    overflow: hidden;
  }

  .res-sign {
    float: right;
    li {
      float: left;
      margin-right: 10px;
    }
  }

  /*添加留言*/
  .addMsg {
    border-top: 1px solid #e5e5e5;
    padding: 0 20px 56px;
    overflow: hidden;
    position: relative;
    font-size:14px;
    .addInput {
      width: 50%;
      height: 40px;
      line-height: 40px;
      display: block;
      font-size:14px;
      margin-bottom: 30px;
      margin-top: 30px;
      padding: 10px 20px 10px;
      border: 1px solid #e5e5e5;
    }
    .addTextarea {
      width: 50%;
      height: 260px;
      font-size:14px;
      display: block;
      padding: 10px 20px 10px;
      resize: none;
      border: 1px solid #e5e5e5;
    }
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
</style>
