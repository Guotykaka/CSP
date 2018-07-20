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

        <el-form-item label="商品名称">
          <el-select filterable  v-model="searchParams.itemType" placeholder="请选择商品名称">
            <el-option
              v-for="(item,index) in listServiceDictList"
              :key="index"
              :label="item.serviceName"
              :value="item.serviceType"
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
                <el-tag size="medium" type="warning" v-show="scope.row.orderStatus===0">待付款</el-tag>
                <el-tag size="medium" type="info" v-show="scope.row.orderStatus===1">已取消</el-tag>
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
  import {baseUrl} from '@/config/env.js'
  import { tradeList,ERR_OK,cspOrderList, getAllServiceInfo} from "@/api/api"
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
          itemType: null,//string	服务id
          institutionName: '',//string 机构名称
          startTime: '',
          endTime: ''
        },
        listServiceDictList: [],//服务名称
        rangeTime: null,
        activeName: "first",//主次订单切换
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
      this._listServiceDict();
    },
    activated(){
      this._getDatalist();
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
        let data = {},
        that = this;
        getAllServiceInfo(data).then((res) => {
          console.log(res)
          if (res.code === ERR_OK) {
            console.log(res.data)
            that.listServiceDictList = res.data;
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        })
      },
      //订单搜索
      _searchDatalist: function () {
        this.searchParams.currentPage = 1;
        if (this.activeName==='first') {
          this._getDatalist();
        } else if(this.activeName==='second') {
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
          itemType: this.searchParams.itemType || '',//string	服务id
          institutionName: this.searchParams.institutionName,//string 机构名称
          type: null,//判断是不是为主订单
          startTime: this.searchParams.startTime,
          endTime: this.searchParams.endTime
        };
        if (this.activeName==='first') {
          params.type = 1;
        } else if(this.activeName==='second'){
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
          '&itemType=' + params.itemType +
          '&institutionName=' + params.institutionName +
          '&startTime=' + params.startTime +
          '&endTime=' + params.endTime;
        var url = baseUrl + "csp/trade/exportTradeList?" + paramString;
        window.open(url);
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
          itemType: '',//string	服务id
          institutionName: ''//string 机构名称
        };
        this.startTime = null;
        this.endTime = null;
        this.rangeTime = null;
      },
      //列表切换
      handleClick(tab) {
        if (tab.name === 'first') {
          this.searchParams = {
            currentPage: 1,//当前页是第几页
            pageSize: 10,//当前页面展示多少条记录
            tradeStatus: '',//string 订单状态 0待付款 1已取消 2已付款 3已完成
            realName: '',//string	用户真实姓名
            mobile: '',//string 用户注册手机号
            tradeCode: '',//string 交易号
            orderServiceStatus: '',//int 订单服务状态（0待服务 1客户忙待联系 2服务中 3已完成 4已失效）
            name: '',//string	医生姓名
            itemType: '',//string	服务id
            institutionName: ''//string 机构名称
          };
          this._getDatalist();
          this.listShowTab = true;
        } else if (tab.name === 'second') {
          this.searchParams = {
            currentPage: 1,//当前页是第几页
            pageSize: 10,//当前页面展示多少条记录
            tradeStatus: '',//string 订单状态 0待付款 1已取消 2已付款 3已完成
            realName: '',//string	用户真实姓名
            mobile: '',//string 用户注册手机号
            tradeCode: '',//string 交易号
            orderServiceStatus: '',//int 订单服务状态（0待服务 1客户忙待联系 2服务中 3已完成 4已失效）
            name: '',//string	医生姓名
            itemType: '',//string	服务id
            institutionName: ''//string 机构名称
          };
          this._getDataSonlist();
          this.listShowTab = false;
        }
      },
      //获取主订单列表
      _getDatalist: function () {
        let data = this.searchParams;
        tradeList(data).then((res) => {
          if (res.code === ERR_OK) {
            this.tradeList = res.data.list;
            this.pages1.totalCount = res.data.totalCount;
            this.pages1.currentpage = res.data.currPage;
            this.pages1.pageSize = res.data.pageSize
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        })
      },
      //获取子订单列表
      _getDataSonlist: function () {
        let data = this.searchParams;
        cspOrderList(data).then((res) => {
          if (res.code === ERR_OK) {
            this.cspOrderList = res.data.list;
            this.pages2.totalCount = res.data.totalCount;
            this.pages2.currentpage = res.data.currPage;
            this.pages2.pageSize = res.data.pageSize
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        })
      },
      handleSizeChange1(val) {
        this.searchParams.pageSize = val;
        this._getDatalist();
      },
      handleCurrentChange1(val) {
        this.searchParams.currentPage=val;
        this._getDatalist();
      },
      handleSizeChange2(val) {
        this.searchParams.pageSize = val;
        this._getDataSonlist();
      },
      handleCurrentChange2(val) {
        this.searchParams.currentPage=val;
        this._getDataSonlist();
      },
      //主订单详情
      _showStatusBox: function (val) {
        this.$router.push({name: 'orderDetail', params: {val: val}})
      },
      //子订单详情
      _showStatusSonBox: function (val) {
        this.$router.push({name: 'orderSonDetail', params: {val: val}})
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
