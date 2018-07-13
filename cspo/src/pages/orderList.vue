<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <el-form :inline="true" ref="form" :model="searchParams">
        <el-form-item label="客户名称">
          <el-input v-model="searchParams.realName" placeholder="请输入客户名称"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchParams.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="searchParams.tradeCode" placeholder="请输入订单号"></el-input>
        </el-form-item>

        <el-form-item label="订单状态">
          <el-select v-model="searchParams.tradeStatus" placeholder="请选择订单状态">
            <el-option label="待付款" value="0"></el-option>
            <el-option label="已取消" value="1"></el-option>
            <el-option label="已付款" value="2"></el-option>
            <el-option label="已完成" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务状态">
          <el-select v-model="searchParams.orderServiceStatus" placeholder="请选择服务状态">
            <el-option label="待服务" value="0"></el-option>
            <el-option label="客户忙待联系" value="1"></el-option>
            <el-option label="服务中" value="2"></el-option>
            <el-option label="已完成" value="3"></el-option>
            <el-option label="已失效" value="4"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="服务医生">
          <el-input v-model="searchParams.name" placeholder="请输入服务医生"></el-input>
        </el-form-item>

        <el-form-item label="服务名称">
          <el-select filterable  v-model="searchParams.itemId" placeholder="请选择服务名称">
            <el-option
              v-for="(item,index) in listServiceDictList"
              :key="index"
              :label="item.institutionName"
              :value="item.dictCode"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="服务机构">
          <el-select filterable  v-model="searchParams.institutionName" placeholder="请输入服务机构">
            <el-option
              v-for="(item,index) in institutionArr"
              :key="index"
              :label="item.institutionName"
              :value="item.dictCode"
            ></el-option>
          </el-select>
        </el-form-item>

<!--        <el-form-item filterable label="服务机构">
          <el-input v-model="searchParams.institutionName" placeholder="请输入服务机构"></el-input>
        </el-form-item>-->

        <el-form-item label="时间">
          <el-date-picker
            v-model="rangeTime"
            @change="getselTime"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="_searchDatalist">查询</el-button>
          <el-button type="primary" @click="_clearParams">清空</el-button>
          <el-button type="primary" @click="_exportTradeList">导出Excel</el-button>
        </el-form-item>
      </el-form>

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="主订单" name="first">
          <el-table
            :data="tradeList"
            :highlight-current-row="true"
            border
            style="width: 100%">
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="tradeCode" label="订单编号"></el-table-column>
            <el-table-column prop="orderTime" label="下单时间" width="180"></el-table-column>
            <el-table-column prop="realName" label="客户名称"></el-table-column>
            <el-table-column prop="mobile" label="注册手机号"></el-table-column>
            <el-table-column prop="itemNameString" label="服务名称"></el-table-column>
            <el-table-column prop="institutionNameString" label="服务机构"></el-table-column>
            <el-table-column prop="doctorNameString" label="服务医生"></el-table-column>
            <el-table-column label="订单状态">
              <template slot-scope="scope">
                <el-tag type="warning" size="medium" v-show="scope.row.tradeStatus===0">待付款</el-tag>
                <el-tag type="info" size="medium" v-show="scope.row.tradeStatus===1">已取消</el-tag>
                <el-tag type="success" size="medium" v-show="scope.row.tradeStatus===2">已付款</el-tag>
                <el-tag size="medium" v-show="scope.row.tradeStatus===3">已完成</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="orderServiceStatusString" label="服务状态"></el-table-column>
            <el-table-column prop="totalPrice" label="订单金额"></el-table-column>
            <el-table-column label="支付方式">
              <template slot-scope="scope">
                <el-tag size="medium" v-show="scope.row.payChannel===1">支付宝</el-tag>
                <el-tag type="success" size="medium" v-show="scope.row.payChannel===2">微信</el-tag>
                <el-tag type="warning" size="medium" v-show="scope.row.payChannel===3">银行卡</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100">
              <template slot-scope="scope">
                <el-button type="primary" @click="_showStatusBox(scope.row)" size="mini">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="firstTable">
            <el-pagination
              background
              @size-change="handleSizeChange1"
              @current-change="handleCurrentChange1"
              :current-page="pages1.currentpage"
              :page-sizes="[10, 20, 30, 50]"
              :page-size="pages1.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pages1.totalCount">
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="子订单" name="second">
          <el-table
            :data="cspOrderList"
            stripe
            border
            style="width: 100%">
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="orderCode" label="订单编号" width="180"></el-table-column>
            <el-table-column prop="createTime" label="下单时间" width="180"></el-table-column>
            <el-table-column prop="realName" label="客户名称"></el-table-column>
            <el-table-column prop="mobile" label="注册手机号"></el-table-column>
            <el-table-column prop="itemName" label="服务名称"></el-table-column>
            <el-table-column prop="institutionName" label="服务机构"></el-table-column>
            <el-table-column prop="name" label="服务医生"></el-table-column>
            <el-table-column prop="orderStatus" label="订单状态">
              <template slot-scope="scope">
                <el-tag size="medium" type="info" v-show="scope.row.orderStatus===0">待付款</el-tag>
                <el-tag size="medium" type="warning" v-show="scope.row.orderStatus===1">已取消</el-tag>
                <el-tag size="medium" type="success" v-show="scope.row.orderStatus===2">已付款</el-tag>
                <el-tag size="medium" v-show="scope.row.orderStatus===3">已完成</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="orderServiceStatus" label="服务状态">
              <template slot-scope="scope">
                <el-tag type="warning" size="medium" v-show="scope.row.orderServiceStatus===0">待服务</el-tag>
                <el-tag type="warning" size="medium" v-show="scope.row.orderServiceStatus===1">客户忙待联系</el-tag>
                <el-tag type="danger" size="medium" v-show="scope.row.orderServiceStatus===2">服务中</el-tag>
                <el-tag type="success" size="medium" v-show="scope.row.orderServiceStatus===3">已完成</el-tag>
                <el-tag type="info" size="medium" v-show="scope.row.orderServiceStatus===4">已失效</el-tag>
                <el-tag size="medium" v-show="scope.row.orderServiceStatus===5">待支付</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="totalPrice" label="订单金额"></el-table-column>
            <el-table-column prop="payChannel" label="支付方式">
              <template slot-scope="scope">
                <el-tag size="medium" v-show="scope.row.payChannel===1">支付宝</el-tag>
                <el-tag size="medium" type="success" v-show="scope.row.payChannel===2">微信</el-tag>
                <el-tag size="medium" type="warning" v-show="scope.row.payChannel===3">银行卡</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100">
              <template slot-scope="scope">
                <el-button type="primary" @click="_showStatusSonBox(scope.row)" size="mini">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="firstTable">
            <el-pagination
              background
              @size-change="handleSizeChange2"
              @current-change="handleCurrentChange2"
              :current-page="pages2.currentpage"
              :page-sizes="[10, 20, 30, 50]"
              :page-size="pages2.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pages2.totalCount">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>

</template>


<script>

  import headerTop from '@/components/headTop.vue';
  import {listServiceDict,tradeList,api,ERR_OK} from "@/api/api"
  import {mapState} from 'vuex'

  export default {
    data() {
      return {
        searchParams: {
          currentPage: 1,//当前页是第几页
          pageSize: 10,//当前页面展示多少条记录
          tradeStatus: null,//string 订单状态 0待付款 1已取消 2已付款 3已完成
          realName: '',//string	用户真实姓名
          mobile: '',//string 用户注册手机号
          tradeCode: '',//string 交易号
          orderServiceStatus: null,//int 订单服务状态（0待服务 1客户忙待联系 2服务中 3已完成 4已失效）
          name: '',//string	医生姓名
          itemId: null,//string	服务id
          institutionName: '',//string 机构名称
          startTime: '',
          endTime: ''
        },
        listServiceDictList: [],//服务名称
        rangeTime: null,
        activeName: "first",
        tradeList: [],
        cspOrderList: [],
        pages1: {
          currentpage: null,
          totalCount: null,
          pageSize: null
        },
        pages2: {
          currentpage: null,
          totalCount: null,
          pageSize: null
        }
      }
    },
    created() {
      this._getDatalist();
    },
    mounted(){

      this._listServiceDict();
    },
    methods: {
      //获取时间
      getselTime() {
        if (this.formInline.selDate) {
          this.searchParams.startTime = this.formInline.selDate[0];
          this.searchParams.endTime = this.formInline.selDate[1];
        }
      },
      //服务名称选择
      _listServiceDict: function () {
        let data = '',
        that = this;
        listServiceDict(data).then((res) => {
          console.log(res)
          if (res.code === ERR_OK) {
            that.listServiceDictList = res.data;
          } else {
            alert(res.msg);
          }
        })
      },
      //订单搜索
      _searchDatalist: function () {
        this.searchParams.currentPage = 1;
        if (this.listShowTab) {
          this._getDatalist();
        } else {
          this._getDataSonlist();
        }
      },
      //导出列表
      _exportTradeList: function () {
        var params = {
          tradeStatus: this.searchParams.tradeStatus || '',//string 订单状态 0待付款 1已取消 2已付款 3已完成
          realName: this.searchParams.realName,//string	用户真实姓名
          mobile: this.searchParams.mobile,//string 用户注册手机号
          tradeCode: this.searchParams.tradeCode,//string 交易号
          orderServiceStatus: this.searchParams.orderServiceStatus || '',//int 订单服务状态（0待服务 1客户忙待联系 2服务中 3已完成 4已失效）
          name: this.searchParams.name,//string	医生姓名
          itemId: this.searchParams.itemId || '',//string	服务id
          institutionName: this.searchParams.institutionName,//string 机构名称
          type: null,//判断是不是为主订单
          startTime: this.searchParams.startTime,
          endTime: this.searchParams.endTime
        };
        if (this.listShowTab) {
          params.type = 1;
        } else {
          params.type = 2;
        }
        var paramString =
          'type=' + params.type +
          '&tradeStatus=' + params.tradeStatus +
          '&realName=' + params.realName +
          '&mobile=' + params.mobile +
          '&tradeCode=' + params.tradeCode +
          '&orderServiceStatus=' + params.orderServiceStatus +
          '&name=' + params.name +
          '&itemId=' + params.itemId +
          '&institutionName=' + params.institutionName +
          '&startTime=' + params.startTime +
          '&endTime=' + params.endTime;
        var url = baseURL + "csp/trade/exportTradeList?" + paramString;
        // if (params.tradeStatus) {
        // url = url + "&tradeStatus=" + params.tradeStatus;
        // }
        window.open(url);
        // $.ajax({
        //   type: "POST",
        //   url: baseURL + "csp/trade/exportTradeList",
        //   contentType: "application/json",
        //   data: JSON.stringify(params),
        //   success: function (res) {
        //     if (res.code == 1) {
        //       alert('导出列表成功,请在桌面查看')
        //     } else {
        //       alert(res.msg);
        //     }
        //   }
        // });
      },
      //清除搜索参数
      _clearParams: function () {
        this.searchParams = {
          currentPage: 1,//当前页是第几页
          pageSize: 10,//当前页面展示多少条记录
          tradeStatus: '',//string 订单状态 0待付款 1已取消 2已付款 3已完成
          realName: '',//string	用户真实姓名
          mobile: '',//string 用户注册手机号
          tradeCode: '',//string 交易号
          orderServiceStatus: '',//int 订单服务状态（0待服务 1客户忙待联系 2服务中 3已完成 4已失效）
          name: '',//string	医生姓名
          itemId: '',//string	服务id
          institutionName: ''//string 机构名称
        };
        this.startTime = null;
        this.endTime = null;
        this.rangeTime = null;
      },
      //列表切换
      handleClick(tab, event) {
        if (tab.name === 'first') {
          this._getDatalist();
          this.listShowTab = true;
        } else if (tab.name === 'second') {
          this._getDataSonlist();
          this.listShowTab = false;
        }
      },
      //获取主订单列表
      _getDatalist: function () {
        let getDate = new Date();
        // this.searchParams.timespan = getDate.getTime().toString();
        let data = this.searchParams;
        tradeList(data).then((res) => {
          if (res.code === ERR_OK) {
            this.tradeList = res.data.list;
            this.pages1.totalCount = res.data.totalCount;
            this.pages1.currentpage = res.data.currPage;
            this.pages1.pageSize = res.data.pageSize
          } else {
            this.$alert(res.msg)
          }
        })
      },
      //获取子订单列表
      _getDataSonlist: function () {
        let data = this.searchParams;
        api.cspOrderList(data).then((res) => {
          if (res.code === 1) {
            this.cspOrderList = res.data.list;
          } else {

          }
        })
      },
      handleSizeChange1(val) {
        this.searchParams.pageSize = val;
        this._getDatalist();
      },
      handleCurrentChange1(val) {
        this.searchParams.currentpage=val;
        this._getDatalist();
      },
      handleSizeChange2(val) {
        this.searchParams.pageSize = val;
        this._getDataSonlist();
      },
      handleCurrentChange2(val) {
        this.searchParams.currentpage=val;
        this._getDataSonlist();
      },
      //主订单详情
      _showStatusBox: function (val) {
        // this.showStatus = false;
        // this.showStatusBox = false;
        // this.customerDetail = val;

        // window.scrollTo(0, 0);

        this.$router.push({name: 'orderDetail', params: {val: val}})
        /*        $.ajax({
                  type: "POST",
                  url: baseURL + "csp/trade/tradeInfo",
                  contentType: "application/json",
                  data: val.tradeCode,
                  success: function (res) {
                    if (res.code == 1) {
                      vm.cspTradeInfoEntity = res.data.cspTradeInfoEntity;
                      vm.cspOrderInfoList = res.data.cspOrderInfoList;
                      var changList = res.data.cspOrderInfoList;
                    } else {
                      alert(res.msg);
                    }
                  }
                });*/
      },


      //子订单详情
      _showStatusSonBox: function (val) {
        this.$router.push({name: 'orderSonDetail', params: {val: val}})
/*        this.showStatusSon = true;
        this.showStatus = false;
        this.customerSonDetail = val;
        window.scrollTo(0, 0);*/
/*        $.ajax({
          type: "POST",
          url: baseURL + "csp/trade/cspOrderInfo",
          contentType: "application/json",
          data: val.orderCode,
          success: function (res) {
            if (res.code == 1) {
              vm.deatilSon = res.data;

            } else {
              alert(res.msg);
            }
          }
        });*/
      },
      checkedTrue: function (val) {
        vm.checkedId = val

      },
      //点击返回
      returnBtn: function () {
        this.showStatusSon = false;
        this.showStatus = true;
        this.showStatusBox = true;
      },
      //从退款返回
      returnBtnRe: function () {
        if (this.listShowTab) {
          this.showStatusBox = false;
        } else {
          this.showStatusSon = true;
        }
        this.refundShow = false;
        window.scrollTo(0, 0);

      },
      //去退款详情||主子订单
      _goDetail: function (val) {
        if (this.listShowTab) {
          val.payChannel = this.cspTradeInfoEntity.payChannel;
        }
        this.refundDetail = val;
        this.refundShow = true;
        this.showStatus = false;
        this.showStatusSon = false;
        this.showStatusBox = true;
        this._getRefundDetail(val.insOrderRefundEntity.insOrderRefundId);
        window.scrollTo(0, 0);
      },
      //获取退款详情
      _getRefundDetail: function (val) {
        var that = this;
        var params = {
          "insOrderRefundId": val
        }
        $.ajax({
          type: "POST",
          url: baseURL + "ins/orderRefund/getRefundDetail",
          contentType: "application/json",
          // dataType: "json",
          data: JSON.stringify(params),
          success: function (res) {
            if (res.code == 1) {
              that.getRefundDetail = res.data;
            } else {
              alert(res.msg);
            }
          }
        });
      },
      //体检报告详情
      showReport: function (val) {
        var params = {
          workNo: val.workNo,
          checkUnitCode: val.checkUnitCode
        };
        $.ajax({
          type: "POST",
          url: baseURL + "csp/trade/getMedicalReportDetail",
          contentType: "application/x-www-form-urlencoded",
          data: params,
          success: function (res) {
            if (res.code === 1) {
              if (res.data) {
                vm.reportData = res.data;
                vm.isShowReport = true;
              } else {
                alert("暂无数据")
              }
            } else {
              alert(res.msg);
            }
          }
        });
      },
      //关闭体检报告
      closeReport: function () {
        this.isShowReport = false;
      },
      //点击nav
      _navClick: function (index) {
        this.currentHash = index;
        location.hash = index;
      },


      //同意申请
      _agreenBtn: function (item) {
        var tradeCodeS = null;
        if (this.listShowTab) {
          tradeCodeS = this.cspTradeInfoEntity.tradeCode;
        } else {
          tradeCodeS = item.tradeCode;
        }
        confirm("确定同意退款？", function () {
          var parms = {
            payType: item.payChannel,
            refundCode: item.insOrderRefundEntity.refundCode,
            refundType: 2,
            tradeCode: tradeCodeS
          };
          $.ajax({
            type: "post",
            url: basePayUrl + "api/trade/orderRefund",
            contentType: "application/json",
            data: JSON.stringify(parms),
            success: function (res) {
              if (res.code === 1) {
                alert(res.msg);
                vm._getRefundDetail(vm.refundDetail.insOrderRefundEntity.insOrderRefundId)
              } else {
                alert(res.msg);
              }
            }
          })
        })
      },


      //关闭按钮
      _closeBox: function () {
        this.agreenBox = false;
        this.refuseBox = false;
      },
      //确认同意
      _agreeTrue: function () {
        // alert('请调用同意接口')
        layer.confirm('纳尼？', {
          btn: ['确定', '取消'] //可以无限个按钮
        }, function (index, layero) {
          //按钮【按钮一】的回调
        }, function (index) {
          //按钮【按钮二】的回调
        });
      },
      //拒绝按钮
      _refuseBtn: function () {
        // this.refuseBox=true;
        layer.prompt({
          formType: 2,
          value: '',
          title: '请填写拒绝理由',
          area: ['400px', '200px'] //自定义文本域宽高
        }, function (value, index, elem) {
          if (value == '') {
            alert("拒绝理由不能为空");
            return
          }
          var ids = [];
          ids.push(vm.refundDetail.refundCode);
          var parms = {
            insOrderRefundIds: ids,
            refundStatus: 3,
            refuseReason: value
          };
          $.ajax({
            type: "POST",
            url: baseURL + "ins/orderRefund/updateOrderRefundStatus",
            contentType: "application/json",
            data: JSON.stringify(parms),
            success: function (res) {
              if (res.code === 1) {
                alert(res.msg, function () {
                  /* vm.showStatus = 1;
                   vm.searchParams.authenticationStatus = null;
                   vm._getDatalist();*/
                  vm._getRefundDetail(vm.refundDetail.insOrderRefundEntity.insOrderRefundId)
                });
              } else {
                alert(res.msg);
              }
            }
          });
          layer.close(index);
        });
      },
      //拒绝确认同意
      _refuseTrue: function () {
        alert('请调用拒绝接口')
      },
      capitalize: function (value) {
        if (value) {
          var arrValue = value.split(',');
        }
        return arrValue
      },
      photoShow: function (val) {
        var arrValue = val.split(',');
        var arr = [];
        arrValue.forEach(function (v, i) {
          arr.push({
            "alt": "图文咨询图片",
            "pid": i, //图片id
            "src": v, //原图地址
            "thumb": v //缩略图地址
          })
        })
        var objectData = {
          "title": "", //相册标题
          "id": 123, //相册id
          "start": 0, //初始显示的图片序号，默认0
          "data": arr
        };
        layui.use('layer', function () {
          var layer = layui.layer;
          layer.photos({
            photos: objectData,
            anim: 5
          });
        });
      }
    },

    components: {
      headerTop
    },
    computed: {
      ...mapState({
        institutionArr: state => state.institutionArr
      })
    },
  }
</script>

<style lang="less" scoped>
  .firstTable {
    margin-top: 10px;
    text-align: center;
  }
</style>
