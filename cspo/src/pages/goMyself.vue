<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <div id="goMyself" v-cloak>
        <div class="header-message">
          <!--<p class="login-header"></p>-->
          <div class="login-message">
            <ul>
              <li>
                <img
                  src="http://a.hiphotos.baidu.com/image/h%3D300/sign=12c4d521a80f4bfb93d09854334e788f/10dfa9ec8a136327f216788d9d8fa0ec09fac791.jpg"
                  alt="">
              </li>
              <li>
                <ul class="list-message">
                  <li class="te-huihui">
                    <span>姓名:</span>
                    <span>角色:</span>
                    <!--<span>所属部门</span>-->
                  </li>
                  <li>
                    <span>{{userMessage.username}}</span>
                    <span>运营人员</span>
                    <!--<span>{{userMessage.deptName}}</span>-->
                  </li>
                </ul>
              </li>
              <li>
                <ul class="list-message">
                  <li class="te-huihui">
                    <span>邮箱账号：</span>
                    <span>联系方式(手机)：</span>
                    <!--<span>联系方式(座机)</span>-->
                  </li>
                  <li>
                    <span>{{userMessage.email}}</span>
                    <span>{{userMessage.mobile}}</span>
                    <!--<span>{{userMessage.mobile}}</span>-->
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
        <div class="main-message">
          <div class="main-header">
            <span class="msg-title">我的留言板</span>
            <!--<span class="msg-count">共<b style="color:#f86b4f">66</b>条留言</span>-->
          </div>
          <div class="search-message">
            <ul>
              <li>
                <span>状态：</span>
                <el-select v-model="selStatus" placeholder="请选择">
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
                <el-input style="width:200px;" v-model="creatName" size="medium " placeholder="请输入内容"></el-input>
              </li>
              <li>
                <el-button size="small" type="primary" icon="el-icon-search" @click="_getQueryInsLeaveWordList">搜索</el-button>
              </li>
            </ul>

          </div>
          <div class="message-deatil">
            <ul>
              <li style="overflow: hidden" v-for="(item,index) in insLeaveDetail" :key="index">
                <div class="detail-title">
                  <ul>
                    <li v-if="item.leaveWordStatus==1">状态:<span class="text-red">待回复</span></li>
                    <li v-if="item.leaveWordStatus==2">状态:<span class="text-green">已回复</span></li>
                    <li v-if="item.leaveWordStatus==3">状态:<span class="text-hui">已关闭</span></li>
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
          <div id="selPage"
               style="font-size: 6px; position: absolute; bottom: 0px;width:100%;background-color:#fff;margin:0 auto;text-align:center;"></div>
        </div>
      </div>
    </div>
  </div>

</template>


<script>
  import headerTop from '@/components/headTop.vue';
  import {mapGetters} from "vuex";
  import {api} from '@/api/api';
  import {localUrl} from "@/config/env.js"

  export default {
    name: 'goMyself',
    components: {
      headerTop
    },
    data() {
      return {
        userInfo: {
          "userId": 1,
          "username": "admin",
          "password": "969d28606deb2d5b498f19b1f142ae7534a3998d30ee4eddd2227c1970892498",
          "salt": "CbLYM3dU4zAdxBaGnWfW",
          "email": "250893328@qq.com",
          "mobile": "13764009077",
          "status": 1,
          "roleIdList": null,
          "createTime": "2016-11-11 11:11:11",
          "deptId": 1,
          "deptName": null,
          "userType": 0
        },
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
        showList: true
        , replayMain: false
        , searchParams: {
          currentPage: 1,//页码
          pageSize: 10,//
          providerServiceUserType: 1,
          orderServiceStatus: 0,
          providerServiceUserId: null
        }
        , createUserId: null//用户id
        , insLeaveDetail: []//留言信息列表
        , insLeaveAnswerlist: []//留言回复列表
        , insLeavePage: {
          currentPage: 1
          , pageCount: 1
          , pageSize: 10
          , totalCount: null
        }//留言信息列表页数
        , checkId: null,
        insDoctorId: null
        , creatName: null//留言人
        , creatTime: null//留言时间
        , checkCreatId: null//验证createuserId
        , selStatus: ''//留言状态
        , userMessage: null//用户信息
      }
    },
    created() {
      this.createUserId = localStorage.getItem('adminId');
      this.userMessage = this.userInfo;
      this._getQueryInsLeaveWordList();
    },
    methods: {
      //关闭
      closeList: function (val) {
        /*       $.ajax({
                 type: "POST",
                 url: baseURL + "ins/insleavewordanswer/closeInsLeaveWordAnswer",
                 data: val,
                 dataType: "json",
                 contentType: "application/json",
                 success: function (res) {
                   if (res.code === 1) {
                     vm._getQueryInsLeaveWordList();
                     vm.checkId = null;
                   } else {
                     alert(res.msg);
                   }
                 }
               });*/
      },
      //回复
      replyList: function (val) {
        //POST /ins/insleavewordanswer/saveInsLeaveWordAnswer
        // this.refuseBox=true;
        layer.prompt({
          formType: 2,
          value: '',
          title: '请填写回复内容',
          area: ['400px', '200px'] //自定义文本域宽高
        }, function (value, index, elem) {
          if (value == '') {
            alert("拒绝理由不能为空");
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
          //POST /ins/insleaveword/saveInsLeaveWordAnswer
          /*          $.ajax({
                      type: "POST",
                      url: baseURL + "ins/insleavewordanswer/saveInsLeaveWordAnswer",
                      contentType: "application/json",
                      dataType: "json",
                      data: JSON.stringify(parms),
                      success: function (res) {
                        if (res.code === 1) {
                          alert(res.msg, function () {
                          });
                          vm._getQueryInsLeaveWordList()
                          vm.checkId = null;
                        } else {
                          alert(res.msg);
                        }
                      }
                    });*/
          layer.close(index);
        });

      },
      //展开
      evnetShowList: function (val, index) {
        this.replayMain = true;
        var params = val.insLeaveWordId;
        this.checkId = index;
        this.showList = true;
        var _this = this;
        api.queryInsLeaveWordAnswerList(params).then((res)=>{
          console.log(res)
          if (res.code === 1) {
            _this.insLeaveAnswerlist = res.data;
            if(_this.insLeaveAnswerlist.length>0){
              var count = _this.insLeaveAnswerlist.length-1;
              _this.checkCreatId = _this.insLeaveAnswerlist[count].answerUserId;
            }else{
              _this.checkCreatId = val.createUserId;
            }
          } else {
            alert(res.msg);
          }
        })
        /*        $.ajax({
                  type: "POST",
                  url: baseURL + "/ins/insleavewordanswer/queryInsLeaveWordAnswerList",
                  data: val.insLeaveWordId,
                  contentType: "application/json",
                  dataType: "json",
                  success: function (res) {
                    if (res.code === 1) {
                      _this.insLeaveAnswerlist = res.data;
                      if(_this.insLeaveAnswerlist.length>0){
                        var count = _this.insLeaveAnswerlist.length-1;
                        _this.checkCreatId = _this.insLeaveAnswerlist[count].answerUserId;
                      }else{
                        _this.checkCreatId = val.createUserId;
                      }
                    } else {
                      alert(res.msg);
                    }
                  }
                });*/
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
      //数据请求
      _getQueryInsLeaveWordList: function () {
        var parms = {
          "leaveWordStatus": this.selStatus,
          "toRoleId": 12,
          "leaveWordTitle": this.creatName,
          "limit": this.searchParams.pageSize,
          "page": this.searchParams.currentPage
        };
        api.queryInsLeaveWordList(parms).then((res)=>{
          if (res.code === 1) {
            this.insLeaveDetail=res.data.list;
          } else {
            alert(res.msg);
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .header-message {

    background-color: #e5e5e5;
    border-radius: 10px 10px 5px 5px;
    padding: 20px 20px 20px;
  }

  .login-header {
    text-align: left;
    color: #888;
    height: 40px;
    line-height: 40px;

  }

  .login-message > ul {
    overflow: hidden;
  }

  .login-message>ul>li {
    float: left;
    text-align: center;
    margin-right: 100px;
  }
  .login-message>ul>li:nth-of-type(2) {
    margin-right: 200px;
  }

  .login-message img {
    width: 96px;
    height: 96px;
    box-sizing: border-box;
    border-radius: 50%;
    vertical-align: center;
  }

  .list-message {
    color:#333;
    display: flex;
    margin-top: 20px;
  }
  .list-message li {
    margin-right:10px;
  }

  .list-message li span {
    display: block;
    height: 32px;
    line-height: 32px;
  }

  .list-message li:nth-of-type(1) span {
    text-align: right;
  }

  .list-message li:nth-of-type(2) span {
    text-align: left;
  }
  .te-huihui{
    color:#999;
  }

  .main-message {
    overflow: hidden;
    position: relative;
    padding-bottom: 50px;
  }

  .main-header {
    margin-top: 20px;
    /*padding: 0 20px;*/
    line-height: 32px;
    height: 32px;
    border-bottom:1px solid #e3e3e3;
    /*overflow: hidden;*/
  }
  .msg-title{
    float: left;
    margin-right: 20px;
    padding:0 10px;
    font-size:16px;
    color: #666;
    border-bottom:2px solid #44a8f8;
  }

  .main-header span:nth-of-type(1) {
    font-size: 20px;
    color: #333;
    font-weight: 700;
  }

  .search-message {
    height: 40px;
    line-height: 40px;
    margin-top: 20px;
    padding: 0 20px;
    /*overflow: hidden;*/
    ul{
      list-style:none;
      li{
        float:left;
        margin-right:20px;
      }
    }
  }

  .search-message .add-style {
    list-style-type: none;
    overflow: hidden;
  }

  .add-style li {
    float: left;
    margin-right: 20px;
    height: 30px;
    line-height: 30px;
  }

  /*.add-style li input,*/
  /*.add-style li:nth-of-type(2n) select {*/
  /*width: 150px;*/
  /*height: 30px;*/
  /*line-height: 30px;*/
  /*}*/

  .text-red {
    color: #f2a498;
    margin-left:10px;
  }
  .text-green {
    margin-left:10px;
    color: #4dc44e;
  }
  .text-hui {
    margin-left:10px;
    color: #999;
  }

  .text-black {
    color: #666;
    margin-left:10px;
  }

  .text-sblack {
    color: #999;
  }

  .message-deatil {
    margin-top: 30px;
    overflow: hidden;
  }

  .detail-title ul {
    background-color: #e8e8e8;
    border-radius: 5px 5px 0 0;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
  }

  .detail-title li {
    color:#999;
    height: 30px;
    line-height: 30px;
  }

  .detail-main {
    padding: 10px;
    overflow: hidden;
    float: left;
    width: 100%;
  }

  .detail-main .text-detail {
    float: left;
    display: block;
    width: 100%;
    margin-bottom: 20px;
  }

  .text-detail li {
    color:#333;
    width: 80%;
    margin-bottom:5px;
  }

  .detail-main .event-btn {
    float: right;
    display: block;
    overflow: hidden;
  }

  .event-btn li {
    float: left;
    margin-right: 10px;
    color: #44a8f8;
  }

  .re-circle {
     color:#333;
    position: relative;
    overflow: hidden;
    float: left;
    width: 100%;
    padding: 10px;
  }

  .resCircle {
    border: 1px dashed #666666;
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
    top: 0px;
    left: 25px;
  }

  .res-main {
    height: 30px;
    padding: 10px;
    overflow: hidden;
  }

  .res-sign {
    float: right;
  }

  .res-sign li {
    float: left;
    margin-right: 10px;
  }

</style>
