<template>
  <div class="page-wrapper" id="scroller">
    <header-top></header-top>
    <div class="page-container"
         v-loading="loading2"
         element-loading-text="拼命加载中"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(255, 255, 255, 1)"
    >
      <el-form :inline="true" ref="form" :model="orderListParams">
        <el-form-item label="客户名称">
          <el-input v-model="orderListParams.realName" placeholder="请输入客户名称"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="orderListParams.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="orderListParams.itemName" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="orderListParams.orderCode" placeholder="请输入订单号"></el-input>
        </el-form-item>

        <el-form-item label="订单状态">
          <el-select v-model="orderListParams.orderStatus" placeholder="请选择订单状态">
            <el-option label="待付款" value="0"></el-option>
            <el-option label="已取消" value="1"></el-option>
            <el-option label="已付款" value="2"></el-option>
            <el-option label="已完成" value="3"></el-option>
            <el-option label="退款待处理" value="4"></el-option>
            <el-option label="退款中" value="5"></el-option>
            <el-option label="退款成功" value="6"></el-option>
          </el-select>
        </el-form-item>
        <!--        <el-form-item label="商品分类">
                  <el-select v-model="orderListParams.categoryType" placeholder="请选择订单状态">
                    <el-option :label="item.name" :value="item.type" v-for="item in categoryTypeList"
                               :key="item.type"></el-option>
                  </el-select>
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
      <el-tabs v-model="orderListParams.itemType" @tab-click="tabCheck" v-if="tabList">
        <!--<el-tab-pane label="全部" :name="null"></el-tab-pane>-->
        <el-tab-pane v-for="item of tabList" :label="item.name" :name="item.type" :key="item.type"></el-tab-pane>
      </el-tabs>
      <div class="table_style">
        <el-table
          v-if="newOrderList"
          :data="newOrderList"
          :highlight-current-row="true"
          border
          style="width: 100%">
          <el-table-column type="index" width="60" align="center" label="序号"></el-table-column>

          <el-table-column align="center" show-overflow-tooltip prop="orderCode" label="订单编号"
                           width="250"></el-table-column>

          <el-table-column align="center" show-overflow-tooltip prop="orderTime" label="下单时间"
                           width="180"></el-table-column>

          <el-table-column align="center" show-overflow-tooltip prop="customerName" label="客户名称"
                           width="80"></el-table-column>

          <el-table-column align="center" show-overflow-tooltip prop="mobile" label="注册手机号"
                           width="120"></el-table-column>

          <el-table-column show-overflow-tooltip prop="itemName" label="商品名称" align="center"></el-table-column>

          <el-table-column show-overflow-tooltip prop="doctorName" label="绑定医生" align="center"
                           v-if="orderListParams.itemType==='10'||orderListParams.itemType==='20'"></el-table-column>
          <el-table-column show-overflow-tooltip prop="originPrice" label="商品金额" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="preferentialPrice" label="优惠金额" align="center"></el-table-column>

          <el-table-column align="center" show-overflow-tooltip prop="totalPrice" label="订单金额"
                           width="80"></el-table-column>

          <el-table-column label="订单状态" align="center" width="120">
            <template slot-scope="scope">
              <el-tag type="warning" size="medium" v-if="scope.row.orderStatus===0">待付款</el-tag>
              <el-tag type="info" size="medium" v-if="scope.row.orderStatus===1">已取消</el-tag>
              <el-tag type="success" size="medium" v-if="scope.row.orderStatus===2">已付款</el-tag>
              <el-tag size="success" v-if="scope.row.orderStatus===3">已完成</el-tag>
              <el-tag size="medium" v-if="scope.row.orderStatus===4">退款待处理</el-tag>
              <el-tag size="medium" v-if="scope.row.orderStatus===5">退款中</el-tag>
              <el-tag size="danger" v-if="scope.row.orderStatus===6">退款成功</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="支付方式" align="center" width="120">
            <template slot-scope="scope" v-if="scope.row.orderStatus!==0">
              <el-tag size="medium" v-if="scope.row.payChannel===1">支付宝</el-tag>
              <el-tag type="success" size="medium" v-if="scope.row.payChannel===2">微信</el-tag>
              <el-tag type="warning" size="medium" v-if="scope.row.payChannel===3">银行卡</el-tag>
              <el-tag type="info" size="medium" v-if="scope.row.payChannel===4">精宸支付宝</el-tag>
              <el-tag type="danger" size="medium" v-if="scope.row.payChannel===5">精宸微信</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="280" align="center">
            <template slot-scope="scope">
              <el-button type="primary" @click="_showStatusBox(scope.row)" size="mini">查看</el-button>
              <el-button v-if="(orderListParams.itemType==='40'||orderListParams.itemType==='50'||orderListParams.itemType==='60')&&scope.row.orderStatus===2" type="success"
                         @click="orderEnd(scope.row)" size="mini">完成
              </el-button>
              <el-button v-if="orderListParams.itemType==='60'&&scope.row.orderStatus===2" type="danger"
                         @click="updateToTimeout(scope.row)" size="mini">过期
              </el-button>
              <el-button v-if="orderListParams.itemType==='40'&&scope.row.orderStatus!==2" disabled type="success"
                         size="mini">完成
              </el-button>
              <!--              <el-button v-if="orderListParams.itemType==='30'" type="primary" @click="synchronization(scope.row)"
                                       size="mini">同步
                            </el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <div class="firstTable" v-if="showOrderList">
          <el-pagination
            background
            @size-change="sizeCheck"
            @current-change="pageCheck"
            :current-page="orderListParams.currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="orderListParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="newTotalCount">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import headerTop from '@/components/headTop.vue';
  import {API_GET_EXPORT_ORDER_EXCEL} from '@/config/env'
  import {
    ERR_OK,
    getTabList,
    getOrderList,
    getOrderInfoDetail,
    updateToFinish,
    updateToTimeout,
    exportOrderExcelNew,//导出订单列表
  } from "@/api/api"

  export default {
    name: 'orderList',
    data() {
      return {
        rangeTime: null,
        loading2: false,
        /*新订单接口*/
        tabList: [],//tab切换数据
        orderListParams: {
          // categoryType: "",
          currentPage: 1,
          pageSize: 10,
          itemName: "",//商品名称
          itemType: '10000',//商品名称
          mobile: "",//手机号
          orderCode: "",//订单号
          orderStatus: null,//订单状态（0待付款 1已取消 2已付款 3已完成 4退款待处理 5退款中 6退款成功）
          realName: "",//客户真实姓名
          endTime: "",
          startTime: ""
        },
        newOrderList: [],//新订单列表
        exportList: [],
        exportStatus: true,
        newTotalCount: null,
        categoryTypeList: null,
        doubleClick: true
      }
    },
    activated() {
      this.getTabListInfo();
      this.getNewOrderList();
    },
    methods: {
      //获取时间
      getselTime() {
        if (this.rangeTime) {
          this.orderListParams.startTime = this.rangeTime[0] + ' 00:00:00';
          this.orderListParams.endTime = this.rangeTime[1] + ' 23:59:59';
        }
      },
      //订单搜索
      _searchDatalist: function () {
        this.orderListParams.pageSize = 10;
        this.orderListParams.currentPage = 1;
        this.getNewOrderList();
      },
      //导出列表
      _exportTradeList() {
        const loading = this.$loading({
          lock: true,
          text: '正在导出订单...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let params = {
          endTime: this.orderListParams.endTime,
          itemName: this.orderListParams.itemName,
          itemType: this.orderListParams.itemType,
          mobile: this.orderListParams.mobile,
          orderCode: this.orderListParams.orderCode,
          orderStatus: this.orderListParams.orderStatus,
          realName: this.orderListParams.realName,
          startTime: this.orderListParams.startTime
        };
        let that = this;
        exportOrderExcelNew(params)
          .then((res) => {
            if (res.code === ERR_OK) {
              this.exportList = res.data;
              setTimeout(function(){
                loading.close();
                that.getExportFunction();
              },500)
            } else {
              setTimeout(function(){
                loading.close()
              },500)
              // this.exportStatus = false;
              this.$alert(res.msg, '提示')
            }
          })
          .catch(() => {
            setTimeout(function(){
              loading.close()
            },500)
            // this.exportStatus = false;
            this.$message.error('网络错误,导出订单列表失败')
          });

        if(!this.exportStatus){
          return;
        }
      },
      /*导出订单列表*/
      getExportFunction(){
        import('@/vendor/Export2Excel').then(excel => {
          let filterName,filterHeader;
          if(this.orderListParams.itemType==='10'||this.orderListParams.itemType==='20'){
            filterName =['orderCode',
              'orderTime',
              'customerName',
              'mobile',
              'itemName',
              'doctorName',
              'originPrice',
              'preferentialPrice',
              'totalPrice',
              'orderStatus',
              'payChannel'];
            filterHeader = [
              '订单编号',
              '下单时间',
              '客户名称',
              '注册手机号',
              '商品名称',
              '绑定医生',
              '商品金额',
              '优惠金额',
              '订单金额',
              '订单状态',
              '支付方式'
            ]
          }else{
            filterName =['orderCode',
              'orderTime',
              'customerName',
              'mobile',
              'itemName',
              'originPrice',
              'preferentialPrice',
              'totalPrice',
              'orderStatus',
              'payChannel'];
            filterHeader = [
              '订单编号',
              '下单时间',
              '客户名称',
              '注册手机号',
              '商品名称',
              '商品金额',
              '优惠金额',
              '订单金额',
              '订单状态',
              '支付方式'
            ]
          }
          const tHeader = filterHeader;
          const filterVal = filterName;
          const list = this.exportList;
          const data = this.formatJson(filterVal, list);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '掌上体检',
            autoWidth: this.autoWidth
          })
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          return v[j]
        }))
      },
      //清除搜索参数
      _clearParams: function () {
        this.orderListParams.mobile = '';
        this.orderListParams.orderCode = '';
        // this.orderListParams.categoryType = '';//前端专属分类
        this.orderListParams.itemName = '';//商品名称
        this.orderListParams.orderStatus = '';
        this.orderListParams.realName = '';
        this.orderListParams.endTime = '';
        this.orderListParams.startTime = '';
        this.rangeTime = null;
      },
      //查看订单详情
      _showStatusBox(val) {
        let orderId = val.orderId;
        this.$router.push({path: `/orderDetail/${orderId}`})
      },
      /*订单直接完成*/
      orderEnd(val) {
        this.$confirm('确定要完成订单?', '打电话', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          const loading = this.$loading({
            lock: true,
            text: '正在完成订单...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          let params = {
            orderId: val.orderId
          };
          updateToFinish(params).then((res) => {
            loading.close();
            if (res.code === ERR_OK) {
              this.getNewOrderList();
              this.$message({
                message: '订单已完成',
                type: 'success'
              });
            } else {
              this.$alert(res.msg, '提示', {
                confirmButtonText: '确定',
              })
            }
          }).catch(err => {
            loading.close();
            this.$message.error('网络错误!请稍后重试')
          });
        }).catch(() => {

        });
      },
      /*订单直接过期*/
      updateToTimeout(val) {
        this.$confirm('确定要完成订单?', '打电话', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          const loading = this.$loading({
            lock: true,
            text: '正在使订单过期...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          let params = {
            orderId: val.orderId
          };
          updateToTimeout(params).then((res) => {
            loading.close();
            if (res.code === ERR_OK) {
              this.getNewOrderList();
              this.$message({
                message: '订单已过期',
                type: 'success'
              });
            } else {
              this.$alert(res.msg, '提示', {
                confirmButtonText: '确定',
              })
            }
          }).catch(err => {
            loading.close();
            this.$message.error('网络错误!请稍后重试')
          });
        }).catch(() => {

        });
      },
      /*新订单接口*/
      tabCheck() {
        this.loading2 = true;
        this._clearParams();
        this.orderListParams.pageSize = 10;
        this.orderListParams.currentPage = 1;
        this.getNewOrderList();
      },
      /*tab栏切换数据*/
      getTabListInfo() {
        let params = {};
        getTabList(params).then((res) => {
          if (res.code === ERR_OK) {
            this.tabList = res.data;
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试');
        })
      },
      /*订单列表数据*/
      getNewOrderList() {
        let that = this;
        let params = this.orderListParams;
        if (this.doubleClick) {
          this.doubleClick = false;
          getOrderList(params).then((res) => {
            if (res.code === ERR_OK) {
              setTimeout(function () {
                that.loading2 = false;
              }, 1000);
              this.doubleClick = true;
              this.newOrderList = res.data.list;
              this.newTotalCount = res.data.totalCount;
            } else {
              this.doubleClick = true;
              this.$alert(res.msg, '提示');
              setTimeout(function () {
                that.loading2 = false;
              }, 1000);
            }
          }).catch(() => {
            this.$message.error('网络错误!请稍后重试');
          })
        }

      },
      /*列表页面数切换*/
      sizeCheck(val) {
        this.orderListParams.pageSize = val;
        this.getNewOrderList();
      },
      /*列表当前页切换*/
      pageCheck(val) {
        this.orderListParams.currentPage = val;
        this.getNewOrderList();
      }
    },
    components: {
      headerTop
    },
    computed: {
      showOrderList() {
        return this.newOrderList.length > 0
      }
    },
  }
</script>

<style lang="less" scoped>
#scroller{
    /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  ::-webkit-scrollbar {
    width: 10px !important;
    height: 10px !important;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    // background: #f6f6f6 !important;
    // border-radius: 2px !important;
    box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    border-radius: 10px;
    background-color: #F5F5F5;
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    background: #aaa !important;
    border-radius: 2px !important;
  }

}
  .firstTable {
    margin-top: 10px;
    text-align: center;
  }
</style>
