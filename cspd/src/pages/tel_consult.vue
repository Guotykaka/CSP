<template>
  <div>
    <el-form :inline="true" :model="searchParams" class="demo-form-inline">
      <el-form-item label="名称">
        <el-input placeholder="客户名称" v-model="searchParams.realName"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input placeholder="手机号" v-model="searchParams.mobile"></el-input>
      </el-form-item>
      <el-form-item label="订单号">
        <el-input placeholder="订单号" v-model="searchParams.orderCode"></el-input>
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker
          v-model="rangeTime"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="doSearch">查询</el-button>
        <el-button type="primary" @click="_resetParams">清空</el-button>
      </el-form-item>
    </el-form>

    <!--tab-->
    <el-tabs v-model="tabIndex">
      <el-tab-pane label="客户忙" name="0"></el-tab-pane>
      <el-tab-pane label="待联系" name="1"></el-tab-pane>
      <el-tab-pane label="已完成" name="3"></el-tab-pane>
      <el-tab-pane label="已失效(退款)" name="4"></el-tab-pane>
    </el-tabs>


    <!--table 表单开始-->
    <el-table
      :data="orderLists"
      border
      style="width: 100%">
      <el-table-column prop="" label="序号"  width="50" type="index"></el-table-column>
      <el-table-column prop="mobile" label="手机号"></el-table-column>
      <el-table-column prop="orderCode" label="订单号"></el-table-column>
      <el-table-column prop="itemName" label="服务名称"></el-table-column>
      <el-table-column prop="orderTime" label="订单日期"></el-table-column>
      <el-table-column prop="totalPrice" label="支付价格" width="100"></el-table-column>


      <el-table-column label="短信通知" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" v-show="scope.row.orderServiceStatus === 0 || scope.row.orderServiceStatus === 1">发送短信</el-button>
          <el-tag type="info" v-if="scope.row.smsCount" style="margin-top: 5px;">已发送{{scope.row.smsNumTimes}}次</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="serviceEndTime" label="服务时间"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column label="操作" width="260">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" v-if="scope.row.orderServiceStatus!==4">体检报告</el-button>
          <el-button size="mini" type="success" v-if="scope.row.orderServiceStatus===0 || scope.row.orderServiceStatus===1">打电话</el-button>
          <el-button size="mini" v-if="scope.row.orderServiceStatus!==4">备注</el-button>
          <el-button size="mini" type="primary" v-if="scope.row.orderServiceStatus===1 || scope.row.orderServiceStatus===3">听录音</el-button>
          <el-button size="mini" type="warning" v-if="scope.row.orderServiceStatus===4">退款原因</el-button>
        </template>
      </el-table-column>


    </el-table>
    <!--table 表单结束-->

    <div class="self-page-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchParams.page" :page-sizes="[10,20]" :page-size="searchParams.limit" layout="total, sizes, prev, pager, next, jumper" :total="totalListCount">
      </el-pagination>
    </div>


  </div>


</template>


<script>


  export default {


    data(){
      return{
        tabIndex:0,


        rangeTime:"",

        totalListCount:100,
        searchParams:{
          realName:"",
          mobile:"",
          orderCode:"",
          page:1,
          limit:10
        },





        //列表数据
        orderLists:[
          {"cspOrderId":"2c8080aa646f3ff20164874081770046","totalPrice":"0.01","customerSex":null,"remark":null,"imageSrc":"http://zhangshangtijian.b0.upaiyun.com/default/DefaultUserHeader/2.jpg","checkUnitCode":"sta2015","workNo":"00291190","itemName":"电话报告解读","orderTime":"2018-07-11 10:51:48","cspCustomId":"c7657be8-2eda-4fc5-84dc-7473cc0977d2","serviceEndTime":null,"customerAge":null,"tradeDetailId":"2c8080aa646f3ff20164874081750044","smsCount":null,"serviceBeginTime":null,"refundReason":"过敏人转切转切转切转","mobile":"13916513888","customerImgs":null,"customerDesc":null,"customerName":null,"itemId":"8ab2b2f56381c35a016381c35a400000","realName":"3888","instruction":null,"replyStatus":1,"orderCode":"20180711105148690062_01","smsNumTimes":0,"customerMobile":"13916513888","orderServiceStatus":0},
          {"cspOrderId":"2c8080aa646f3ff201648396b313002b","totalPrice":"0.01","customerSex":null,"remark":null,"imageSrc":"http://zhangshangtijian.b0.upaiyun.com/default/DefaultUserHeader/2.jpg","checkUnitCode":"sta2015","workNo":"00291153","itemName":"电话报告解读","orderTime":"2018-07-10 17:47:28","cspCustomId":"c7657be8-2eda-4fc5-84dc-7473cc0977d2","serviceEndTime":null,"customerAge":null,"tradeDetailId":"2c8080aa646f3ff201648396b3120029","smsCount":null,"serviceBeginTime":null,"refundReason":"俺家住咯做最空","mobile":"13916513888","customerImgs":null,"customerDesc":null,"customerName":null,"itemId":"8ab2b2f56381c35a016381c35a400000","realName":"3888","instruction":null,"replyStatus":1,"orderCode":"20180710174728231273_01","smsNumTimes":0,"customerMobile":"13916513888","orderServiceStatus":0},
          {"cspOrderId":"2c8080aa646f3ff201647e4745a30012","totalPrice":"0.01","customerSex":null,"remark":null,"imageSrc":"http://thirdqq.qlogo.cn/qqapp/1105804636/A18863B96E67BE918021B7455DC3A5A0/100","checkUnitCode":"mid001","workNo":"1704120001","itemName":"电话报告解读","orderTime":"2018-07-09 17:02:37","cspCustomId":"0be8710d-c129-41de-ad05-32f358790c13","serviceEndTime":null,"customerAge":null,"tradeDetailId":"2c8080aa646f3ff201647e4745a00010","smsCount":null,"serviceBeginTime":null,"refundReason":null,"mobile":"13761516041","customerImgs":null,"customerDesc":null,"customerName":null,"itemId":"8ab2b2f56381c35a016381c35a400000","realName":"6041","instruction":null,"replyStatus":1,"orderCode":"20180709170237617309_01","smsNumTimes":0,"customerMobile":"13761516041","orderServiceStatus":0},
          {"cspOrderId":"2c8080aa6468a07e01646d98f5c90061","totalPrice":"0.01","customerSex":null,"remark":null,"imageSrc":"http://thirdqq.qlogo.cn/qqapp/1105804636/A18863B96E67BE918021B7455DC3A5A0/100","checkUnitCode":"mid001","workNo":"1704120001","itemName":"电话报告解读","orderTime":"2018-07-06 11:18:18","cspCustomId":"0be8710d-c129-41de-ad05-32f358790c13","serviceEndTime":null,"customerAge":null,"tradeDetailId":"2c8080aa6468a07e01646d98f5c7005f","smsCount":2,"serviceBeginTime":null,"refundReason":null,"mobile":"13761516041","customerImgs":null,"customerDesc":null,"customerName":null,"itemId":"8ab2b2f56381c35a016381c35a400000","realName":"6041","instruction":null,"replyStatus":1,"orderCode":"20180706111818819385_01","smsNumTimes":2,"customerMobile":"13761516041","orderServiceStatus":0},
          {"cspOrderId":"2c8080aa646f3ff20164870a95580040","totalPrice":"0.01","customerSex":null,"remark":"dfddfg","imageSrc":"http://zhangshangtijian.b0.upaiyun.com/default/DefaultUserHeader/2.jpg","checkUnitCode":"sta2015","workNo":"00291190","itemName":"电话报告解读","orderTime":"2018-07-11 09:52:55","cspCustomId":"c7657be8-2eda-4fc5-84dc-7473cc0977d2","serviceEndTime":null,"customerAge":null,"tradeDetailId":"2c8080aa646f3ff20164870a9557003e","smsCount":null,"serviceBeginTime":"2018-07-11 10:17:15","refundReason":null,"mobile":"13916513888","customerImgs":null,"customerDesc":null,"customerName":null,"itemId":"8ab2b2f56381c35a016381c35a400000","realName":"3888","instruction":null,"replyStatus":1,"orderCode":"20180711095255186040_01","smsNumTimes":0,"customerMobile":"13916513888","orderServiceStatus":1},
          {"cspOrderId":"2c8080aa64591d2101645a69d16001ad","totalPrice":"0.10","customerSex":null,"remark":"客户忙。。。。。。。。。。。。。","imageSrc":"http://zhangshangtijian.b0.upaiyun.com/default/DefaultUserHeader/6.jpg","checkUnitCode":"bjbr002","workNo":"143608900486239","itemName":"电话报告解读","orderTime":"2018-07-02 17:54:01","cspCustomId":"12ade660-1c73-4efb-898d-a06b11e189f1","serviceEndTime":null,"customerAge":null,"tradeDetailId":"2c8080aa64591d2101645a69d15f01ab","smsCount":null,"serviceBeginTime":"2018-07-04 15:32:20","refundReason":null,"mobile":"17740877123","customerImgs":null,"customerDesc":null,"customerName":null,"itemId":"8ab2b2f56381c35a016381c35a400000","realName":"zuolih","instruction":null,"replyStatus":1,"orderCode":"20180702175401616782_01","smsNumTimes":0,"customerMobile":"17740877123","orderServiceStatus":1},
          {"cspOrderId":"2c8080aa6463639701646440a82e005e","totalPrice":"0.10","customerSex":null,"remark":null,"imageSrc":"http://zhangshangtijian.b0.upaiyun.com/test/uploads/20180302/twe6hl6pe88qyn7mt64et9aotbqlymm2.jpg!imgUrl200","checkUnitCode":"mid001","workNo":"1704210003","itemName":"电话报告解读","orderTime":"2018-07-04 15:45:16","cspCustomId":"a8ef93e1-be25-4457-819c-ad1fb50f0398","serviceEndTime":"2018-07-04 17:24:31","customerAge":null,"tradeDetailId":"2c8080aa6463639701646440a82d005c","smsCount":null,"serviceBeginTime":null,"refundReason":null,"mobile":"18616579021","customerImgs":null,"customerDesc":null,"customerName":null,"itemId":"8ab2b2f56381c35a016381c35a400000","realName":"9021","instruction":"41454","replyStatus":1,"orderCode":"20180704154516970363_01","smsNumTimes":0,"customerMobile":"18616579021","orderServiceStatus":3},
          {"cspOrderId":"2c8080aa64636397016464266b4f0046","totalPrice":"0.10","customerSex":null,"remark":null,"imageSrc":"http://zhangshangtijian.b0.upaiyun.com/default/DefaultUserHeader/6.jpg","checkUnitCode":"bjbr001","workNo":"00291218","itemName":"电话报告解读","orderTime":"2018-07-04 15:16:36","cspCustomId":"80db7ae7-34cb-44fa-ab64-4c9cb0063f63","serviceEndTime":"2018-07-04 15:25:32","customerAge":null,"tradeDetailId":"2c8080aa64636397016464266b480044","smsCount":null,"serviceBeginTime":null,"refundReason":null,"mobile":"15026502685","customerImgs":null,"customerDesc":null,"customerName":null,"itemId":"8ab2b2f56381c35a016381c35a400000","realName":"2685","instruction":"嘎嘎嘎","replyStatus":1,"orderCode":"20180704151636883302_01","smsNumTimes":0,"customerMobile":"15026502685","orderServiceStatus":3},
          {"cspOrderId":"2c8080aa64591d2101645a5c4412019a","totalPrice":"0.10","customerSex":null,"remark":null,"imageSrc":"http://zhangshangtijian.b0.upaiyun.com/default/DefaultUserHeader/1.jpg","checkUnitCode":"mid001","workNo":"1704120001","itemName":"电话报告解读","orderTime":"2018-07-02 17:39:13","cspCustomId":"8cf1bec4-14f4-4e7d-a48b-61470b6a6aa4","serviceEndTime":"2018-07-04 17:29:10","customerAge":null,"tradeDetailId":"2c8080aa64591d2101645a5c44100198","smsCount":null,"serviceBeginTime":null,"refundReason":null,"mobile":"13888888888","customerImgs":null,"customerDesc":null,"customerName":null,"itemId":"8ab2b2f56381c35a016381c35a400000","realName":"8888","instruction":"41454","replyStatus":1,"orderCode":"20180702173913676446_01","smsNumTimes":0,"customerMobile":"13888888888","orderServiceStatus":3}
        ]


      }
    },

    methods:{

      doSearch(){


      },

      _resetParams(){


      },


      handleSizeChange(){


      },

      handleCurrentChange(){


      },
    }
  }

</script>
<style scoped lang="less">

  .el-button--mini{padding: 7px 7px;}

  .el-button+.el-button {
    margin-left:5px;
  }

</style>
