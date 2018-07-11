<template>
  <div class="orderDetail">
    <header-top></header-top>
    <div class="page-container">
      <el-card class="box-card" :body-style="cardStyle">
        <span>订单编号：</span>
        <span>客户名称：</span>
        <span>注册手机号：</span>
        <span>下单时间：</span>
        <span>订单金额：</span>
      </el-card>
      <div class="stautsStyle">
        <el-card class="box-card" :body-style="cardStyle">
          <span>订单状态：</span>
        </el-card>
      </div>
    </div>



<!--    &lt;!&ndash;主订单详情区域&ndash;&gt;
    <div class="orderDetail" v-if="!showStatusBox">
      &lt;!&ndash;订单排头&ndash;&gt;
      <div class="orderTitle">
        <ul>
          <li><span>订单编号:{{cspTradeInfoEntity.tradeCode}}</span></li>
          <li><span>客户名称:{{customerDetail.customerName}}</span></li>
          <li><span>注册手机号:{{customerDetail.mobile}}</span></li>
          <li><span>下单时间:{{cspTradeInfoEntity.orderTime}}</span></li>
          <li style="padding-right:0;"><span>订单金额:￥{{cspTradeInfoEntity.totalPrice | fixedTwo}}</span></li>
        </ul>
      </div>
      &lt;!&ndash;订单状态&ndash;&gt;
      <div class="orderStatus">
        <span v-if="cspTradeInfoEntity.tradeStatus==0">订单状态:待付款</span>
        <span v-if="cspTradeInfoEntity.tradeStatus==1">订单状态:已取消</span>
        <span v-if="cspTradeInfoEntity.tradeStatus==2">订单状态:已付款</span>
        <span v-if="cspTradeInfoEntity.tradeStatus==3">订单状态:已完成</span>
      </div>
      &lt;!&ndash;支付记录&ndash;&gt;
      <div class="payNote" v-if="cspTradeInfoEntity">
        <table class="layui-table bgStyle table-style" style="margin:0;">
          <thead>
          <tr>
            <th>支付记录</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>支付时间</td>
            <td>{{cspTradeInfoEntity.paymentTime}}</td>
          </tr>
          <tr>
            <td>支付方式</td>
            <td v-if="cspTradeInfoEntity.payChannel==1">支付宝</td>
            <td v-if="cspTradeInfoEntity.payChannel==2">微信</td>
            <td v-if="cspTradeInfoEntity.payChannel==3">银行卡</td>
          </tr>
          <tr>
            <td>支付流水号</td>
            <td>{{cspTradeInfoEntity.thirdTradeNo}}</td>
          </tr>
          <tr>
            <td>订单金额</td>
            <td>￥{{cspTradeInfoEntity.totalPrice}}</td>
          </tr>
          <tr>
            <td>优惠金额</td>
            &lt;!&ndash;<td>￥{{cspTradeInfoEntity.discountAmount}}(优惠详情: <span class="targetChange">点击查看</span>)</td>&ndash;&gt;
            <td>￥{{cspTradeInfoEntity.discountAmount | fixedTwo}}</td>
          </tr>
          <tr>
            <td>支付金额</td>
            <td>￥{{cspTradeInfoEntity.totalPrice | fixedTwo}}</td>
          </tr>
          </tbody>
        </table>
      </div>
      &lt;!&ndash;订单信息&ndash;&gt;
      <div class="orderMsg" v-if="cspOrderInfoList.length>0">
        <ul>
          <li v-for="(item,index) in cspOrderInfoList" :key="index">
            <div class="orderMsgBox">
              <div class="orderMsgTitle">
                &lt;!&ndash;电话电话报告解读订单信息&ndash;&gt;
                <table class="layui-table bgStyle table-style" style="margin-top:0;" v-if="item.serviceType==2">
                  <thead>
                  <tr>
                    <th>订单信息</th>
                    <th v-if="item.orderStatus==0">订单状态:待付款</th>
                    <th v-if="item.orderStatus==1">订单状态:已取消</th>
                    <th v-if="item.orderStatus==2">订单状态:已付款<b v-if="customerDetail" class="serverCss">订单服务状态:{{customerDetail.orderServiceStatusString}}</b>
                    </th>
                    <th v-if="item.orderStatus==3">订单状态:已完成<b v-if="customerDetail" class="serverCss">订单服务状态:{{customerDetail.orderServiceStatusString}}</b>
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>订单编号</td>
                    <td>{{item.tradeCode}}</td>
                  </tr>
                  <tr>
                    <td>服务名称</td>
                    <td>{{item.itemName}}</td>
                  </tr>
                  <tr>
                    <td>服务机构</td>
                    <td>{{item.institutionName}}</td>
                  </tr>
                  <tr>
                    <td>服务医生</td>
                    <td>{{item.name}}</td>
                  </tr>
                  <tr>
                    <td>接听电话</td>
                    <td>{{item.mobile}}</td>
                  </tr>
                  <tr>
                    <td>体检报告</td>
                    <td>
                      <i class="panel-i">{{customerDetail.customerName}}&nbsp</i>
                      <i class="panel-i">{{customerDetail.orderTime}}</i>
                      <a class="check-report-info" @click="showReport(item)">
                        <i class="iconfont icon-baogao"></i>查看详情
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>订单金额</td>
                    <td>￥{{item.totalPrice | fixedTwo}}</td>
                  </tr>
                  <tr>
                    <td>结算信息</td>
                    <td>商品售价：￥{{item.totalPrice | fixedTwo}}</td>
                  </tr>
                  </tbody>
                </table>
                &lt;!&ndash;图文咨询订单信息&ndash;&gt;
                <table class="layui-table bgStyle table-style" v-else>
                  <thead>
                  <tr>
                    <th class="bgStyle">订单信息</th>
                    <th v-if="item.orderStatus==0">订单状态:待付款</th>
                    <th v-if="item.orderStatus==1">订单状态:已取消</th>
                    <th v-if="item.orderStatus==2">订单状态:已付款<b v-if="customerDetail" class="serverCss">订单服务状态:{{customerDetail.orderServiceStatusString}}</b></th>
                    <th v-if="item.orderStatus==3">订单状态:已完成<b v-if="customerDetail" class="serverCss">订单服务状态:{{customerDetail.orderServiceStatusString}}</b></th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>订单编号</td>
                    <td>{{item.tradeCode}}</td>
                  </tr>
                  <tr>
                    <td>服务名称</td>
                    <td>{{item.itemName}}</td>
                  </tr>
                  <tr>
                    <td>服务机构</td>
                    <td>{{item.institutionName}}</td>
                  </tr>
                  <tr>
                    <td>服务医生</td>
                    <td>{{item.name}}</td>
                  </tr>
                  <tr>
                    <td>咨询人</td>
                    <td>{{item.customerName}}</td>
                  </tr>
                  <tr>
                    <td>性别</td>
                    <td v-if="item.customerSex===2">女</td>
                    <td v-else>男</td>
                  </tr>
                  <tr>
                    <td>年龄</td>
                    <td>{{item.customerAge}}</td>
                  </tr>
                  <tr>
                    <td>描述</td>
                    <td>{{item.customerDesc}}</td>
                  </tr>
                  <tr>
                    <td>图片</td>
                    <td>
                      <ul id="layer-photos-demo" @click="photoShow(item.customerImgs)">
                        <li v-for="(value,ind) in capitalize(item.customerImgs)" style="float:left">
                          <img style="width:20px;height:20px;margin-right:5px;background-color:#ee55ee;" layer-pid="ind"
                               layer-src="value" :src="value" alt="">
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td>订单金额</td>
                    <td v-if="item.totalPrice">￥{{item.totalPrice | fixedTwo}}</td>
                  </tr>
                  <tr>
                    <td>结算信息</td>
                    <td v-if="item.totalPrice">商品售价：￥{{item.totalPrice | fixedTwo}}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
              &lt;!&ndash;退款信息&ndash;&gt;
              <div class="refundMsg" v-if="item.refundCode">
                <table class="layui-table bgStyle table-style">
                  <thead>
                  <tr>
                    <th>退款信息</th>
                    <th></th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>退款编号</td>
                    <td>{{item.refundCode}}&nbsp;<a class="targetChange" @click="_goDetail(item)"
                                                    href="javascript:;">查看详情</a></td>
                  </tr>
                  </tbody>
                </table>
              </div>
              &lt;!&ndash;订单变更记录&ndash;&gt;
              <div class="orderChange">
                <table class="layui-table bgStyle table-style">
                  <thead>
                  <tr>
                    <th>订单变更记录</th>
                    <th></th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(itemChange,index2) in item.orderChangeList" :key="index2">
                    <td>{{itemChange.CREATE_TIME}}</td>
                    <td v-if="itemChange.TRADE_STATUS===0">待付款</td>
                    <td v-if="itemChange.TRADE_STATUS===1">已取消</td>
                    <td v-if="itemChange.TRADE_STATUS===2">已付款</td>
                    <td v-if="itemChange.TRADE_STATUS===3">已完成</td>
                    <td v-if="itemChange.TRADE_STATUS===4">退款待处理</td>
                    <td v-if="itemChange.TRADE_STATUS===5">退款中</td>
                    <td v-if="itemChange.TRADE_STATUS===6">退款成功</td>
                    <td v-if="itemChange.TRADE_STATUS===7">退款关闭</td>
                    <td v-if="itemChange.TRADE_STATUS===8">退款拒绝</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <button class="returnBtn btn btn-primary" @click="returnBtn">返回</button>
    </div>
    &lt;!&ndash;子订单详情区域&ndash;&gt;
    <div class="orderDetail" v-if="showStatusSon">
      &lt;!&ndash;订单排头&ndash;&gt;
      <div class="orderTitle" v-if="deatilSon">
        <ul>
          <li><span>订单编号:{{deatilSon.tradeCode}}</span></li>
          <li><span>客户名称:{{deatilSon.customerName}}</span></li>
          <li><span>注册手机号:{{deatilSon.mobile}}</span></li>
          <li><span>下单时间:{{deatilSon.createTime}}</span></li>
          <li style="padding-right:0;"><span>订单金额:￥{{deatilSon.totalPrice | fixedTwo}}</span></li>
        </ul>
      </div>
      &lt;!&ndash;订单状态&ndash;&gt;
      <div class="orderStatus">
        <span v-if="deatilSon.tradeStatus==0">订单状态:待付款</span>
        <span v-if="deatilSon.tradeStatus==1">订单状态:已取消</span>
        <span v-if="deatilSon.tradeStatus==2">订单状态:已付款</span>
        <span v-if="deatilSon.tradeStatus==3">订单状态:已完成</span>
      </div>
      &lt;!&ndash;支付记录&ndash;&gt;
      <div class="payNote">
        <table class="layui-table bgStyle table-style" style="margin:0;">
          <thead>
          <tr>
            <th>支付记录</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>支付时间</td>
            <td>{{deatilSon.paymentTime}}</td>
          </tr>
          <tr>
            <td>支付方式</td>
            <td v-if="deatilSon.payChannel==1">支付宝</td>
            <td v-if="deatilSon.payChannel==2">微信</td>
            <td v-if="deatilSon.payChannel==3">银行卡</td>
          </tr>
          <tr>
            <td>支付流水号</td>
            <td>{{deatilSon.thirdTradeNo}}</td>
          </tr>
          <tr>
            <td>订单金额</td>
            <td>￥{{deatilSon.totalPrice | fixedTwo}}</td>
          </tr>
          <tr>
            <td>优惠金额</td>
            &lt;!&ndash;<td>￥{{deatilSon.discountAmount}}(优惠详情: <span class="targetChange">点击查看</span>)</td>&ndash;&gt;
            <td>￥{{deatilSon.discountAmount | fixedTwo}}</td>
          </tr>
          <tr>
            <td>支付金额</td>
            <td>￥{{deatilSon.totalPrice | fixedTwo}}</td>
          </tr>
          </tbody>
        </table>
      </div>
      &lt;!&ndash;订单信息&ndash;&gt;
      <div class="orderMsg">
        <div class="orderMsgBox">
          <div class="orderMsgTitle">
            &lt;!&ndash;电话电话报告解读订单信息&ndash;&gt;
            <table class="layui-table bgStyle table-style" style="margin-top:0;" v-if="deatilSon.serviceType===2">
              <thead>
              <tr>
                <th>订单信息</th>
                <th v-if="deatilSon.orderStatus==0">订单状态:待付款</th>
                <th v-if="deatilSon.orderStatus==1">订单状态:已取消</th>
                <th v-if="deatilSon.orderStatus==2">订单状态:已付款
                  <b class="serverCss" v-if="customerSonDetail.orderServiceStatus==0">订单服务状态:待服务</b>
                  <b class="serverCss" v-if="customerSonDetail.orderServiceStatus==1">订单服务状态:客户忙待联系</b>
                  <b class="serverCss" v-if="customerSonDetail.orderServiceStatus==2">订单服务状态:服务中</b>
                  <b class="serverCss" v-if="customerSonDetail.orderServiceStatus==3">订单服务状态:已完成</b>
                  <b class="serverCss" v-if="customerSonDetail.orderServiceStatus==4">订单服务状态:已失效</b>
                <th v-if="deatilSon.orderStatus==3">订单状态:已完成
                  <b class="serverCss" v-if="customerSonDetail.orderServiceStatus==0">订单服务状态:待服务</b>
                  <b class="serverCss" v-if="customerSonDetail.orderServiceStatus==1">订单服务状态:客户忙待联系</b>
                  <b class="serverCss" v-if="customerSonDetail.orderServiceStatus==2">订单服务状态:服务中</b>
                  <b class="serverCss" v-if="customerSonDetail.orderServiceStatus==3">订单服务状态:已完成</b>
                  <b class="serverCss" v-if="customerSonDetail.orderServiceStatus==4">订单服务状态:已失效</b>
                </th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>订单编号</td>
                <td>{{deatilSon.tradeCode}}</td>
              </tr>
              <tr>
                <td>服务名称</td>
                <td>{{deatilSon.itemName}}</td>
              </tr>
              <tr>
                <td>服务机构</td>
                <td>{{deatilSon.institutionName}}</td>
              </tr>
              <tr>
                <td>服务医生</td>
                <td>{{deatilSon.name}}</td>
              </tr>
              <tr>
                <td>接听电话</td>
                <td>{{deatilSon.mobile}}</td>
              </tr>
              <tr>
                <td>体检报告</td>
                <td>{{deatilSon.checkUnitCode}}</td>
              </tr>
              <tr>
                <td>订单金额</td>
                <td>￥{{deatilSon.totalPrice | fixedTwo}}</td>
              </tr>
              <tr>
                <td>结算信息</td>
                <td>商品售价：￥{{deatilSon.totalPrice | fixedTwo}}</td>
              </tr>
              </tbody>
            </table>
            &lt;!&ndash;图文咨询订单信息&ndash;&gt;
            <table class="layui-table bgStyle table-style" v-else>
              <thead>
              <tr>
                <th>订单信息</th>
                <th v-if="deatilSon.orderStatus==0">订单状态:待付款</th>
                <th v-if="deatilSon.orderStatus==1">订单状态:已取消</th>
                <th v-if="deatilSon.orderStatus==2">订单状态:已付款
                  <b class="serverCss" v-if="customerSonDetail.orderServiceStatus==0">订单服务状态:待服务</b>
                  <b class="serverCss" v-if="customerSonDetail.orderServiceStatus==1">订单服务状态:客户忙待联系</b>
                  <b class="serverCss" v-if="customerSonDetail.orderServiceStatus==2">订单服务状态:服务中</b>
                  <b class="serverCss" v-if="customerSonDetail.orderServiceStatus==3">订单服务状态:已完成</b>
                  <b class="serverCss" v-if="customerSonDetail.orderServiceStatus==4">订单服务状态:已失效</b>
                </th>
                <th v-if="deatilSon.orderStatus==3">订单状态:已完成
                  <b class="serverCss" v-if="customerSonDetail.orderServiceStatus==0">订单服务状态:待服务</b>
                  <b class="serverCss" v-if="customerSonDetail.orderServiceStatus==1">订单服务状态:客户忙待联系</b>
                  <b class="serverCss" v-if="customerSonDetail.orderServiceStatus==2">订单服务状态:服务中</b>
                  <b class="serverCss" v-if="customerSonDetail.orderServiceStatus==3">订单服务状态:已完成</b>
                  <b class="serverCss" v-if="customerSonDetail.orderServiceStatus==4">订单服务状态:已失效</b>
                </th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>订单编号</td>
                <td>{{deatilSon.tradeCode}}</td>
              </tr>
              <tr>
                <td>服务名称</td>
                <td>{{deatilSon.itemName}}</td>
              </tr>
              <tr>
                <td>服务机构</td>
                <td>{{deatilSon.institutionName}}</td>
              </tr>
              <tr>
                <td>服务医生</td>
                <td>{{deatilSon.name}}</td>
              </tr>
              <tr>
                <td>咨询人</td>
                <td>{{deatilSon.customerName}}</td>
              </tr>
              <tr>
                <td>性别</td>
                <td v-if="deatilSon.customerSex===2">女</td>
                <td v-else>男</td>
              </tr>
              <tr>
                <td>年龄</td>
                <td>{{deatilSon.customerAge}}</td>
              </tr>
              <tr>
                <td>描述</td>
                <td>{{deatilSon.customerDesc}}</td>
              </tr>
              <tr>
                <td>图片</td>
                <td>
                  <ul @click="photoShow(deatilSon.customerImgs)">
                    <li v-for="(value,ind) in capitalize(deatilSon.customerImgs)" style="float:left">
                      <img style="width:20px;height:20px;margin-right:5px;background-color:#ee55ee;" layer-pid="ind"
                           layer-src="value" :src="value" alt="">
                    </li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td>订单金额</td>
                <td>￥{{deatilSon.totalPrice | fixedTwo}}</td>
              </tr>
              <tr>
                <td>结算信息</td>
                <td>商品售价：￥{{deatilSon.totalPrice | fixedTwo}}</td>
              </tr>
              </tbody>
            </table>
          </div>
          &lt;!&ndash;退款信息&ndash;&gt;
          <div class="refundMsg" v-if="deatilSon.insOrderRefundEntity">
            <table class="layui-table bgStyle table-style">
              <thead>
              <tr>
                <th>退款信息</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>退款编号</td>
                <td>{{deatilSon.insOrderRefundEntity.refundCode}}&nbsp;<a class="targetChange"
                                                                          @click="_goDetail(deatilSon)">查看详情</a>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          &lt;!&ndash;订单变更记录&ndash;&gt;
          <div class="orderChange">
            <table class="layui-table bgStyle table-style">
              <thead>
              <tr>
                <th>订单变更记录</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(itemChange,index2) in deatilSon.orderChangeList" :key="index2">
                <td>{{itemChange.CREATE_TIME}}</td>
                <td v-if="itemChange.TRADE_STATUS===0">待付款</td>
                <td v-if="itemChange.TRADE_STATUS===1">已取消</td>
                <td v-if="itemChange.TRADE_STATUS===2">已付款</td>
                <td v-if="itemChange.TRADE_STATUS===3">已完成</td>
                <td v-if="itemChange.TRADE_STATUS===4">退款待处理</td>
                <td v-if="itemChange.TRADE_STATUS===5">退款中</td>
                <td v-if="itemChange.TRADE_STATUS===6">退款成功</td>
                <td v-if="itemChange.TRADE_STATUS===7">退款关闭</td>
                <td v-if="itemChange.TRADE_STATUS===8">退款拒绝</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <button class="returnBtn btn btn-warning" @click="returnBtn">返回</button>
    </div>
    &lt;!&ndash;退款详情&ndash;&gt;
    <div class="refundMoney" v-if="refundShow">
      <div class="refundTitle">
        <div class="leftMain">
          <ul v-if="refundDetail.insOrderRefundEntity.refundStatus===0">
            <li>退款状态:待处理</li>
            <li><span>APP申请退款，等待处理</span></li>
            <li><span>请您在进行同意或拒绝操作前，尽量充分于买家沟通达成一致，避免误解。</span></li>
          </ul>
          <ul v-if="refundDetail.insOrderRefundEntity.refundStatus===1">
            <li>退款状态:退款中</li>
            <li><span>运营已同意退款，款还未打到客户账上。</span></li>
          </ul>
          <ul v-if="refundDetail.insOrderRefundEntity.refundStatus===2">
            <li>退款状态:退款成功</li>
            <li><span>退款成功</span></li>
          </ul>
          <ul v-if="refundDetail.insOrderRefundEntity.refundStatus===3">
            <li>退款状态:退款关闭</li>
            <li><span>退款申请已被拒绝，退款关闭</span></li>
          </ul>
        </div>
        &lt;!&ndash;     <div class="rightBtn" v-if="refundDetail.insOrderRefundEntity.refundStatus===0">
               <button class="agreeBtn btn btn-primary" @click="_agreenBtn(refundDetail)">同意</button>
               <button class="refuseBtn btn btn-warning" @click="_refuseBtn">拒绝</button>
             </div>&ndash;&gt;
      </div>
      &lt;!&ndash;退款详情&ndash;&gt;
      <div class="payNote">
        <table class="layui-table bgStyle table-style" style="margin:0;">
          <thead>
          <tr>
            <th>退款信息</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>退款编号</td>
            <td>{{getRefundDetail.refundCode}}</td>
          </tr>
          <tr>
            <td>申请退款时间</td>
            <td>{{getRefundDetail.createTime}}</td>
          </tr>
          <tr>
            <td>退款状态</td>
            <td v-show="getRefundDetail.refundStatus===0">待处理</td>
            <td v-show="getRefundDetail.refundStatus===1">退款中</td>
            <td v-show="getRefundDetail.refundStatus===2">退款成功</td>
            <td v-show="getRefundDetail.refundStatus===3">退款关闭</td>
          </tr>
          <tr>
            <td>退款金额</td>
            <td>￥{{getRefundDetail.refundAmount | fixedTwo}}</td>
          </tr>
          <tr>
            <td>退还方式</td>
            <td v-show="refundDetail.payChannel==1">支付宝</td>
            <td v-show="refundDetail.payChannel==2">微信</td>
            <td v-show="refundDetail.payChannel==3">银行卡</td>
          </tr>
          <tr>
            <td>退款原因</td>
            <td>{{getRefundDetail.refundReason}}</td>
          </tr>
          <tr>
            <td>退款说明</td>
            <td>{{getRefundDetail.refundSource}}</td>
          </tr>
          </tbody>
        </table>
      </div>
      &lt;!&ndash;退款订单信息&ndash;&gt;
      <div class="orderMsg">
        <div class="orderMsgBox">
          <div class="orderMsgTitle">
            &lt;!&ndash;电话电话报告解读订单信息&ndash;&gt;
            <table class="layui-table bgStyle table-style" style="margin-top:0;" v-if="refundDetail.serviceType==2">
              <thead>
              <tr>
                <th>订单信息</th>
                <th v-if="refundDetail.orderStatus==0">订单状态:待付款</th>
                <th v-if="refundDetail.orderStatus==1">订单状态:已取消</th>
                <th v-if="refundDetail.orderStatus==2">订单状态:已付款</th>
                <th v-if="refundDetail.orderStatus==3">订单状态:已完成</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>订单编号</td>
                <td>{{refundDetail.tradeCode}}</td>
              </tr>
              <tr>
                <td>服务名称</td>
                <td>{{refundDetail.itemName}}</td>
              </tr>
              <tr>
                <td>服务机构</td>
                <td>{{refundDetail.institutionName}}</td>
              </tr>
              <tr>
                <td>服务医生</td>
                <td>{{refundDetail.name}}</td>
              </tr>
              <tr>
                <td>接听电话</td>
                <td>{{refundDetail.mobile}}</td>
              </tr>
              <tr>
                <td>体检报告</td>
                <td>{{refundDetail.checkUnitCode}}</td>
              </tr>
              <tr>
                <td>订单金额</td>
                <td>￥{{refundDetail.totalPrice | fixedTwo}}</td>
              </tr>
              <tr>
                <td>结算信息</td>
                <td>商品售价：￥{{refundDetail.totalPrice | fixedTwo}}</td>
              </tr>
              </tbody>
            </table>
            &lt;!&ndash;图文咨询订单信息&ndash;&gt;
            <table class="layui-table bgStyle table-style" v-else>
              <thead>
              <tr>
                <th>订单信息</th>
                <th v-if="refundDetail.orderStatus==0">订单状态:待付款</th>
                <th v-if="refundDetail.orderStatus==1">订单状态:已取消</th>
                <th v-if="refundDetail.orderStatus==2">订单状态:已付款</th>
                <th v-if="refundDetail.orderStatus==3">订单状态:已完成</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>订单编号</td>
                <td>{{refundDetail.tradeCode}}</td>
              </tr>
              <tr>
                <td>服务名称</td>
                <td>{{refundDetail.itemName}}</td>
              </tr>
              <tr>
                <td>服务机构</td>
                <td>{{refundDetail.institutionName}}</td>
              </tr>
              <tr>
                <td>服务医生</td>
                <td>{{refundDetail.name}}</td>
              </tr>
              <tr>
                <td>咨询人</td>
                <td>{{refundDetail.customerName}}</td>
              </tr>
              <tr>
                <td>性别</td>
                <td v-if="refundDetail.customerSex===2">女</td>
                <td v-else>男</td>
              </tr>
              <tr>
                <td>年龄</td>
                <td>{{refundDetail.customerAge}}</td>
              </tr>
              <tr>
                <td>描述</td>
                <td>{{refundDetail.customerDesc}}</td>
              </tr>
              <tr>
                <td>图片</td>
                <td>
                  <ul @click="photoShow(refundDetail.customerImgs)">
                    <li v-for="(value,ind) in capitalize(refundDetail.customerImgs)" style="float:left">
                      <img style="width:20px;height:20px;margin-right:5px;background-color:#ee55ee;" layer-pid="ind"
                           layer-src="value" :src="value" alt="">
                    </li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td>订单金额</td>
                <td>￥{{refundDetail.totalPrice | fixedTwo}}</td>
              </tr>
              <tr>
                <td>结算信息</td>
                <td>商品售价：￥{{refundDetail.totalPrice | fixedTwo}}</td>
              </tr>
              </tbody>
            </table>
          </div>
          &lt;!&ndash;退款信息&ndash;&gt;
          &lt;!&ndash;        <div class="refundMsg" v-if="deatilSon.refundCode">
                    <table class="layui-table bgStyle table-style">
                      <thead>
                      <tr>
                        <th>退款信息</th>
                        <th></th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td>退款编号</td>
                        <td>{{deatilSon.refundCode}}<span class="targetChange">查看详情</span></td>
                      </tr>
                      </tbody>
                    </table>
                  </div>&ndash;&gt;
          &lt;!&ndash;订单变更记录&ndash;&gt;
          <div class="orderChange">
            <table class="layui-table bgStyle table-style">
              <thead>
              <tr>
                <th>订单变更记录</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(itemChange,index2) in refundDetail.orderChangeList" :key="index2">
                <td>{{itemChange.CREATE_TIME}}</td>
                <td v-if="itemChange.TRADE_STATUS===0">待付款</td>
                <td v-if="itemChange.TRADE_STATUS===1">已取消</td>
                <td v-if="itemChange.TRADE_STATUS===2">已付款</td>
                <td v-if="itemChange.TRADE_STATUS===3">已完成</td>
                <td v-if="itemChange.TRADE_STATUS===4">退款待处理</td>
                <td v-if="itemChange.TRADE_STATUS===5">退款中</td>
                <td v-if="itemChange.TRADE_STATUS===6">退款成功</td>
                <td v-if="itemChange.TRADE_STATUS===7">退款关闭</td>
                <td v-if="itemChange.TRADE_STATUS===8">退款拒绝</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <button class="returnBtn btn btn-warning" @click="returnBtnRe">返回</button>
    </div>-->
  </div>
</template>

<script>
  import headerTop from '@/components/headTop.vue'
  export default {
    name: "orderDetail",
    components: {
      headerTop
    },
    data() {
      return {
        cardStyle:{
          padding:'10px 20px',
          display:'flex',
          justifyContent:'space-between'
        },
        statusStyle:{
          width:'80%',
          background:'red'
        }
      }
    },
    created(){
      console.log(this.$route.params.id)
    }
  }
</script>

<style scoped lang="less">
.orderDetail{
  .stautsStyle{


  }
}
</style>
