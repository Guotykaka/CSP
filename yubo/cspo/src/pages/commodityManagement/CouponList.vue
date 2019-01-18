<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <!-- 服务页面 -->
      <div>
        <el-header height="30">
          <!-- 操作行-->
          <el-row class="m_b_15">
            <el-form id="SearchBar" :model="searchParams" :inline="true" class="demo-form-inline">
              <el-form-item label="名称：">
                <el-input v-model="searchParams.name" placeholder="请输入优惠券名称" @keyup.enter.native="doSearch()" clearable
                          maxlength="15"></el-input>
              </el-form-item>
              <el-form-item label="类型：">
                <el-select v-model="searchParams.type" clearable placeholder="请选择优惠券类型">
                  <el-option label="分类券" :value="1"></el-option>
                  <el-option label="商品券" :value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="日期：">
                <el-date-picker
                  v-model="searchParams.sendTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy.MM.dd"
                  value-format="yyyy.MM.dd"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="doSearch()">搜索</el-button>
              </el-form-item>

            </el-form>
          </el-row>
          <el-row class="m_b_15">
            <el-button type="primary" @click="handleAdd()">新增</el-button>
          </el-row>
        </el-header>

        <el-main>
          <!-- 列表 -->
          <template>
            <el-table :data="tableData" border style="width: 100%">
              <el-table-column show-overflow-tooltip align="center" type="index" width="80"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="name" label="名称"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="description" label="描述"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" label="类型" min-width="100%">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium" type="success" v-if="scope.row.type === 1">分类券</el-tag>
                    <el-tag size="medium" type="danger" v-if="scope.row.type === 2">商品券</el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center" label="满足金额">
                <template slot-scope="scope">
                  <p>￥{{ scope.row.fullMoney }}</p>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="money" label="优惠面额/元"
                               width="110"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="sendStartTime" label="开始时间"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="sendEndTime" label="结束时间"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="deadDay" label="有效期"
                               width="70"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" label="使用时间段" width="110">
                <template slot-scope="scope">
                  <p v-if="scope.row.startTime">{{scope.row.startTime}}~{{scope.row.endTime}}</p>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="useProductCategoryString" label="使用范围">
                <template slot-scope="scope">
                  <p v-if="scope.row.type === 1">{{scope.row.useProductCategoryString}}</p>
                  <p v-else>{{scope.row.useProductIdsString}}</p>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="150" fixed="right">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" @click="doShowView(scope.$index, scope.row)">查看</el-button>
                  <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>

        </el-main>

        <div class="self-page-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="searchParams.currentPage" :page-sizes="[10, 20]"
                         :page-size="searchParams.pagesize" layout="total, sizes, prev, pager, next, jumper"
                         :total="totalCount">
          </el-pagination>
        </div>
      </div>
      <!-- 优惠券编辑弹窗 -->
      <el-dialog title="编辑优惠券" :visible.sync="dialogEditVisible" width=600px :before-close="handleCloseEidt">
        <el-form :model="editTable" :rules="rulesNew" ref="formEdit">
          <el-form-item label="名称：" :label-width="formLabelWidth" prop="name">
            <el-col :span="20">
              <el-input v-model="editTable.name" prop auto-complete="off" el maxlength="10"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="描述：" :label-width="formLabelWidth" prop="description">
            <el-col :span="20">
              <el-input v-model="editTable.description" prop auto-complete="off" el maxlength="20"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="券类型：" :label-width="formLabelWidth" class="is-required">
            <el-col :span="20">
              <el-radio-group size="medium" v-model="editTable.type">
                <el-radio-button :label="1">分类</el-radio-button>
                <el-radio-button :label="2">商品</el-radio-button>
              </el-radio-group>
            </el-col>
          </el-form-item>
          <el-form-item label="使用范围：" :label-width="formLabelWidth" prop="useProductCategory" v-if="editTable.type===1">
            <el-col :span="20">
              <el-select v-model="editTable.useProductCategory" multiple placeholder="请选择优惠券使用范围" filterable :filter-method="test" style="width:100%">
                <el-option v-for="(item,index) in firstClass" :key="index" :label="item.categoryName" :value="item.categoryId">
                  <span style="float: left">{{ item.categoryName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.parentCategoryName }}</span>
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="使用商品：" :label-width="formLabelWidth" prop="useProductIds" v-else>
            <el-col :span="20">
              <el-select v-model="editTable.useProductIds" multiple allow-create placeholder="请选择商品或者填写商品ID并选择" style="width:100%" filterable>
                <el-option v-for="(item,index) in ProductData" :key="index" :label="item.productName" :value="item.productId"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="开始时间：" :label-width="formLabelWidth" prop="sendStartTime">
            <el-col :span="20">
              <el-date-picker
               style="width:100%"
                v-model="editTable.sendStartTime"
                type="date"
                placeholder="选择日期"
                format="yyyy.MM.dd"
                value-format="yyyy.MM.dd"
              >
              </el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="结束时间：" :label-width="formLabelWidth" prop="sendEndTime">
            <el-col :span="20">
              <el-date-picker
               style="width:100%"
                v-model="editTable.sendEndTime"
                type="date"
                placeholder="选择日期"
                format="yyyy.MM.dd"
                value-format="yyyy.MM.dd"
              >
              </el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="有效类型：" :label-width="formLabelWidth" prop="deadtimeType" class="is-required">
            <el-col :span="20">
              <el-radio-group v-model="editTable.deadtimeType" size="medium" @change="change_deadtimeType_edit">
                <el-radio-button :label="1">有效期</el-radio-button>
                <el-radio-button :label="2">时间段</el-radio-button>
              </el-radio-group>
            </el-col>
          </el-form-item>
          <el-form-item label="有效期：" :label-width="formLabelWidth" v-if="editTable.deadtimeType=== 1" prop="deadDay"
                        class="is-required">
            <el-col :span="20">
              <el-input-number v-model="editTable.deadDay" :min="0" :precision="0" style="width:100%"></el-input-number>
            </el-col>
          </el-form-item>
          <el-form-item label="时间段：" :label-width="formLabelWidth" v-if="editTable.deadtimeType=== 2" prop="time"
                        class="is-required">
            <el-col :span="20">
              <el-date-picker
               style="width:100%"
                v-model="editTable.time"
                type="daterange"
                format="yyyy.MM.dd"
                value-format="yyyy.MM.dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="面额：" :label-width="formLabelWidth" prop="money">
            <el-col :span="20">
              <el-input-number v-model="editTable.money" :min="0" :precision="0" style="width:100%"></el-input-number>
            </el-col>
          </el-form-item>
          <el-form-item label="满足金额：" :label-width="formLabelWidth" prop="fullMoney">
            <el-col :span="20">
              <el-input-number v-model="editTable.fullMoney" :precision="0" style="width:100%"></el-input-number>
            </el-col>
          </el-form-item>
          <el-form-item label="可领取数量：" :label-width="formLabelWidth" prop="canReceiveNum">
            <el-col :span="20">
              <el-input-number v-model="editTable.canReceiveNum" :min="0" :precision="0" style="width:100%"></el-input-number>
            </el-col>
          </el-form-item>
          <el-form-item label="使用须知：" :label-width="formLabelWidth" prop="remarks">
            <el-col :span="20">
              <!-- <tinymce v-model="editTable.productDesc" :url="Url" :with-credentials='false' :editorHeight='200'></tinymce> -->
              <el-input type="textarea" resize="none" v-model="editTable.remarks" :autosize='{minRows:3}'></el-input>
            </el-col>
            <template>
            </template>
          </el-form-item>
        </el-form>
        <div class="btn-row">
          <el-button size="small" type="primary" @click="submitForm('formEdit',_doHandleEdit)">保存</el-button>
          <el-button size="small" type="primary" @click="_doCancel()">取消</el-button>
        </div>
      </el-dialog>
      <!-- 优惠券新增弹窗 -->
      <el-dialog title="新增优惠券" :visible.sync="dialogAddVisible" width=600px :before-close="handleCloseAdd">
        <el-form :model="addTable" :rules="rulesNew" ref="formNew">
          <el-form-item label="名称：" :label-width="formLabelWidth" prop="name">
            <el-col :span="20">
              <el-input v-model="addTable.name" prop auto-complete="off" el clearable maxlength="10"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="描述：" :label-width="formLabelWidth" prop="description">
            <el-col :span="20">
              <el-input v-model="addTable.description" prop auto-complete="off" el clearable maxlength="20"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="券类型：" :label-width="formLabelWidth" class="is-required">
            <el-col :span="20">
              <el-radio-group size="medium" v-model="addTable.type">
                <el-radio-button :label="1">分类</el-radio-button>
                <el-radio-button :label="2">商品</el-radio-button>
              </el-radio-group>
            </el-col>
          </el-form-item>
          <el-form-item label="使用范围：" :label-width="formLabelWidth" prop="useProductCategory" v-if="addTable.type===1">
            <el-col :span="20">
              <el-select v-model="addTable.useProductCategory" multiple placeholder="请选择优惠券使用范围" filterable :filter-method="test" style="width:100%">
                <el-option v-for="(item,index) in firstClass" :key="index" :label="item.categoryName" :value="item.categoryId">
                  <span style="float: left">{{ item.categoryName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.parentCategoryName }}</span>
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="使用商品：" :label-width="formLabelWidth" prop="useProductIds" v-else>
            <el-col :span="20">
              <el-select v-model="addTable.useProductIds" multiple allow-create placeholder="请选择商品或者填写商品ID并选择" style="width:100%" filterable>
                <el-option v-for="(item,index) in ProductData" :key="index" :label="item.productName" :value="item.productId">
                  <!-- <span style="float: left">{{ item.institutionName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.institutionCode }}</span> -->
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="开始时间：" :label-width="formLabelWidth" prop="sendStartTime">
            <el-col :span="20">
              <el-date-picker
               style="width:100%"
                v-model="addTable.sendStartTime"
                type="date"
                placeholder="选择日期"
                format="yyyy.MM.dd"
                value-format="yyyy.MM.dd"
              >
              </el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="结束时间：" :label-width="formLabelWidth" prop="sendEndTime">
            <el-col :span="20">
              <el-date-picker
               style="width:100%"
                v-model="addTable.sendEndTime"
                type="date"
                placeholder="选择日期"
                format="yyyy.MM.dd"
                value-format="yyyy.MM.dd"
              >
              </el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="有效类型：" :label-width="formLabelWidth" prop="deadtimeType">
            <el-col :span="20">
              <el-radio-group v-model="addTable.deadtimeType" size="medium" @change="change_deadtimeType_add">
                <el-radio-button :label="1">有效期</el-radio-button>
                <el-radio-button :label="2">时间段</el-radio-button>
              </el-radio-group>
            </el-col>
          </el-form-item>
          <el-form-item label="有效期：" v-if="addTable.deadtimeType=== 1" :label-width="formLabelWidth" prop="deadDay"
                        class="is-required">
            <el-col :span="20">
              <el-input-number v-model="addTable.deadDay" :min="0" :precision="0" style="width:100%"></el-input-number>
            </el-col>
          </el-form-item>
          <el-form-item label="时间段：" v-if="addTable.deadtimeType=== 2" :label-width="formLabelWidth" prop="time"
                        class="is-required">
            <el-col :span="20">
              <el-date-picker
               style="width:100%"
                v-model="addTable.time"
                type="daterange"
                format="yyyy.MM.dd"
                value-format="yyyy.MM.dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="面额：" :label-width="formLabelWidth" prop="money">
            <el-col :span="20">
              <el-input-number v-model="addTable.money" :min="0" :precision="0" style="width:100%"></el-input-number>
            </el-col>
          </el-form-item>
          <el-form-item label="满足金额：" :label-width="formLabelWidth" prop="fullMoney">
            <el-col :span="20">
              <el-input-number v-model="addTable.fullMoney" :min="0" :precision="0" style="width:100%"></el-input-number>
            </el-col>
          </el-form-item>
          <el-form-item label="可领取数量：" :label-width="formLabelWidth" prop="canReceiveNum">
            <el-col :span="20">
              <el-input-number v-model="addTable.canReceiveNum" :min="0" :precision="0" style="width:100%"></el-input-number>
            </el-col>
          </el-form-item>
          <el-form-item label="使用须知：" :label-width="formLabelWidth" prop="remarks">
            <el-col :span="20">
              <el-input type="textarea" resize="none" v-model="addTable.remarks" :autosize='{minRows:3}'></el-input>
            </el-col>
            <template>
            </template>
          </el-form-item>
        </el-form>
        <div class="btn-row">
          <el-button size="small" type="primary" @click="submitForm('formNew',_doAdd)">保存</el-button>
          <el-button size="small" type="primary" @click="_doAddCancel()">取消</el-button>
        </div>
      </el-dialog>
      <!-- 优惠券查看弹窗 -->
      <el-dialog title="优惠券详情" :visible.sync="dialogViewVisible" width=600px :before-close="_doHideView">
        <el-form :model="ViewTable" label-position="left">
          <el-form-item label="名称：" :label-width="formLabelWidth2">
            <el-col :span="20">
              {{ViewTable.name}}
            </el-col>
          </el-form-item>
          <el-form-item label="描述：" :label-width="formLabelWidth2">
            <el-col :span="20">
              {{ViewTable.description}}
            </el-col>
          </el-form-item>
          <!-- <el-form-item label="折扣类型：" :label-width="formLabelWidth2">
            <el-col :span="20">
              <el-tag size="medium" type="success" v-if="ViewTable.type === 1">满减</el-tag>
              <el-tag size="medium" v-if="ViewTable.type === 2">直减</el-tag>
              <el-tag size="medium" type="warning" v-if="ViewTable.type === 3">折扣</el-tag>
            </el-col>
          </el-form-item> -->
          <el-form-item label="券类型：" :label-width="formLabelWidth2">
              <el-tag size="medium" type="success" v-if="ViewTable.type === 1">分类</el-tag>
              <el-tag size="medium" v-if="ViewTable.type === 2">商品</el-tag>
            </el-col>
          </el-form-item>
          <el-form-item label="使用范围：" :label-width="formLabelWidth2" v-if="ViewTable.type===1">
            <el-col :span="18">
              <el-select v-model="ViewTable.useProductCategory" disabled multiple>
                <el-option :label="item.categoryName" :value="item.categoryId" v-for="(item,index) in firstClass" :key="index"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="使用商品：" :label-width="formLabelWidth2" prop="useProductIds" v-else>
            <el-col :span="20">
              <el-select v-model="ViewTable.useProductIds" multiple disabled style="width:100%" filterable>
                <el-option v-for="(item,index) in ProductData" :key="index" :label="item.productName" :value="item.productId">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="日期范围：" :label-width="formLabelWidth2">
            <el-col :span="20">
              {{ViewTable.sendStartTime}}~{{ViewTable.sendEndTime}}
            </el-col>
          </el-form-item>
          <el-form-item label="有效类型：" :label-width="formLabelWidth2">
            <el-col :span="20">
              <el-tag size="medium" type="success" v-if="ViewTable.deadtimeType === 1">有效期</el-tag>
              <el-tag size="medium" v-if="ViewTable.deadtimeType === 2">时间段</el-tag>
            </el-col>
          </el-form-item>
          <el-form-item label="有效期：" :label-width="formLabelWidth2">
            <el-col :span="20" v-if="ViewTable.startTime">
              {{ViewTable.startTime}}~{{ViewTable.endTime}}
            </el-col>
            <el-col :span="20" v-if="ViewTable.deadDay">
              {{ViewTable.deadDay}}
            </el-col>
          </el-form-item>
          <el-form-item label="面额：" :label-width="formLabelWidth2">
            <el-col :span="20">
              {{ViewTable.money}}
            </el-col>
          </el-form-item>
          <el-form-item label="满足金额：" :label-width="formLabelWidth2">
            <el-col :span="20">
              {{ViewTable.fullMoney}}
            </el-col>
          </el-form-item>
          <!-- <el-form-item label="跳转链接：" :label-width="formLabelWidth2">
              <el-col :span="20">
                {{ViewTable.toUrl}}
              </el-col>
            </el-form-item> -->
          <el-form-item label="可领取数量：" :label-width="formLabelWidth2">
            <el-col :span="20">
              {{ViewTable.canReceiveNum}}
            </el-col>
          </el-form-item>
          <el-form-item label="使用须知：" :label-width="formLabelWidth2">
            <el-col :span="18">
              <el-input type="textarea" resize="none" v-model="ViewTable.remarks" readonly autosize></el-input>
            </el-col>
            <template>
            </template>
          </el-form-item>
        </el-form>
        <div class="btn-row">
          <el-button size="small" type="primary" @click="_doHideView()">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>

</template>


<script>
  import {ERR_OK, GetConpontList, GetConpontDetail, postAddConpont, postUpdateConpont,GetLimitCouponCategory,getConpontProduct} from '@/api/api.js'
  import {getStore,EncodeUserId,IsAlert} from '@/config/mUtils.js'
  import headerTop from '@/components/headTop.vue'

  export default {
    components: {
      headerTop,
    },
    data() {
      var validateDeadtimeType = (rule, value, callback) => {//自定义表单验证规则
        if (value === null || value.length === 0) {
          callback(new Error('请输入有效期或时间段'));
        } else {
          callback();
        }
      };
      return {
        backUpArr:[],
        firstClass:[],//商品类别
        ProductData:[],//商品下拉列表
        AdminUserId:'',
        editTable: {
          useProductIds: [],
          id: '',
          time: [],
          canReceiveNum: 0,
          deadDay: 0,
          deadtimeType: 1,
          description: "",
          endTime: "",
          fullMoney: 0,
          money: 0,
          name: "",
          remarks: "",
          sendEndTime: "",
          sendStartTime: "",
          startTime: "",
          toUrl: "",
          type: 1,
          useProductCategory: [],
          userId: ""
        }, //编辑优惠券单个数据
        ViewTable: {},//查看
        totalCount: 0,
        searchParams: {
          currentPage: 1,
          pageSize: 10,
          name: '',
          sendTime: '',
          type: ''
        },
        currentPage: 1, //分页初始页码
        pagesize: 30, //分页初始显示条数
        tableData: [], //列表数据
        addTable: {
          useProductIds: [],
          time: [],
          canReceiveNum: 0,
          deadDay: 0,
          deadtimeType: 1,
          description: "",
          endTime: "",
          fullMoney: 0,
          money: 0,
          name: "",
          remarks: "",
          sendEndTime: "",
          sendStartTime: "",
          startTime: "",
          toUrl: "",
          type: 1,
          useProductCategory: [],
          userId: ""
        }, //优惠券新增单个数据
        dialogEditVisible: false, //优惠券修改
        dialogAddVisible: false, //优惠券新增
        dialogViewVisible: false, //优惠券查看
        formLabelWidth: '120px',
        formLabelWidth2: '140px',
        rulesNew: {
          name: [
            {required: true, message: '请填写优惠券名称', trigger: 'blur'}
          ],
          description: [
            {required: true, message: '请填写优惠券描述', trigger: 'blur'}
          ],
          sendStartTime: [
            {required: true, message: '请选择优惠券发券开始时间', trigger: 'change'}
          ],
          sendEndTime: [
            {required: true, message: '请选择优惠券发券结束时间', trigger: 'change'}
          ],
          deadtimeType: [
            {required: true, message: '请填写优惠券有效期类型', trigger: 'blur'}
          ],
          money: [
            {required: true, message: '请填写优惠券面额', trigger: 'blur'}
          ],
          fullMoney: [
            {required: true, message: '请填写优惠券满减金额', trigger: 'blur'}
          ],
          // toUrl: [{ required: true, message: '请填写跳转链接 ' , trigger: 'change'}],
          canReceiveNum: [{required: true, message: '请填写最多可领取数量', trigger: 'blur'}],
          useProductCategory: [
            {required: true, message: '请选择优惠券可使用商品类型', trigger: 'blur'}
          ],
          useProductIds: [
            {required: true, message: '请选择可使用优惠券商品', trigger: 'blur'}
          ],
          remarks: [
            {required: true, message: '请填写优惠券使用须知', trigger: 'blur'}
          ],
          deadDay: [
            {validator: validateDeadtimeType, trigger: 'blur'}
          ],
          time: [
            {validator: validateDeadtimeType, trigger: 'change'}
          ],
        },
      }
    },
    methods: {
       test(val){//select下拉框匹配双重搜索的方法
        if (val) { //val存在
            this.firstClass = this.backUpArr.filter((item) => {
                if (!!~item.categoryName.indexOf(val) || !!~item.parentCategoryName.indexOf(val)) {
                    return true
                }
            })
        } else { //val为空时，还原数组
            this.firstClass = this.backUpArr
        }
      },
      getFirstClass(){//获取商品类别列表
        let params = {
        };
        GetLimitCouponCategory(params).then((res)=>{
          if(res.code===ERR_OK){
            this.firstClass = res.data;
            this.backUpArr = JSON.parse(JSON.stringify(res.data));//深拷贝出‘下拉框’所用的还原数组
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试')
        })
      },
      change_deadtimeType_add() {
        this.addTable.deadDay = null;
        this.addTable.time = [];
      },
      change_deadtimeType_edit() {
        this.editTable.deadDay = null;
        this.editTable.time = [];
      },
      doSearch() {
        this.searchParams.currentPage = 1;
        this.getList();
      },
      handleSizeChange: function (size) {
        this.searchParams.pageSize = size;
        this.getList();
      },
      handleCurrentChange: function (currentPage) {
        this.searchParams.currentPage = currentPage;
        this.getList();
      },
      // 新增
      handleAdd() {
        this.time = [];
        this.dialogAddVisible = true;
      },
      // 查看弹窗
      doShowView(index, row) {
        let params = {
          id: row.id,
        };
        GetConpontDetail(params).then(response => {
          if (response.code === ERR_OK) {
            this.ViewTable = [];
            this.ViewTable = response.data;
            this.dialogViewVisible = true;
          } else {
            IsAlert(response.msg,'错误','error');
          }
          ;
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        });
      },
      //隐藏查看弹窗
      _doHideView() {
        this.dialogViewVisible = false;
      },
      // 优惠券确定新增
      _doAdd() {
        let params = {
          canReceiveNum: this.addTable.canReceiveNum,
          deadDay: this.addTable.deadDay,
          deadtimeType: this.addTable.deadtimeType,
          description: this.addTable.description,
          endTime: this.addTable.time[1],
          fullMoney: this.addTable.fullMoney,
          money: this.addTable.money,
          name: this.addTable.name,
          remarks: this.addTable.remarks,
          sendEndTime: this.addTable.sendEndTime,
          sendStartTime: this.addTable.sendStartTime,
          startTime: this.addTable.time[0],
          toUrl: this.addTable.toUrl,
          type: this.addTable.type,
          useProductCategory: (this.addTable.type===1)?this.addTable.useProductCategory + '':'',
          useProductIds: (this.addTable.type===2)?this.addTable.useProductIds + '':'',
          userId: this.AdminUserId
        };
        postAddConpont(params).then(response => {
          if (response.code === ERR_OK) {
            IsAlert(response.msg,'成功','success');
            this.handleCloseAdd();
            this.getList();
          } else {
            IsAlert(response.msg,'错误','error');
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        });
      },
      // 优惠券取消新增
      _doAddCancel() {
        this.handleCloseAdd();
        this.getList();
        this.$message({
          type: 'warning',
          message: '取消新增'
        });
      },
      submitForm(formName,Func) {
        //新增模块表单验证
        this.$refs[formName].validate(valid => {
          if (valid) {
            Func();
            this.getList();
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      handleCloseView() {
        this.dialogViewVisible = false;
      },
      handleCloseAdd() {
        //新增弹窗重置数据 beforeclose
        this.resetForm('formNew');
        this.addTable = {
          useProductIds: [],
          time: [],
          canReceiveNum: 0,
          deadDay: 0,
          deadtimeType: 1,
          description: "",
          endTime: "",
          fullMoney: 0,
          money: 0,
          name: "",
          remarks: "",
          sendEndTime: "",
          sendStartTime: "",
          startTime: "",
          toUrl: "",
          type: 1,
          useProductCategory: [],
          userId: ""
        };
        this.dialogAddVisible = false;
      },
      // 优惠券修改
      handleEdit(index, row) {
        let params = {
          id: row.id,
        };
        GetConpontDetail(params).then(response => {
          if (response.code === ERR_OK) {
            this.editTable = {
              id: response.data.id,
              time: response.data.deadtimeType !== 1 ? [response.data.startTime, response.data.endTime] : [],
              canReceiveNum: response.data.canReceiveNum,
              deadDay: response.data.deadDay,
              deadtimeType: response.data.deadtimeType,
              description: response.data.description,
              endTime: response.data.endTime,
              fullMoney: response.data.fullMoney,
              money: response.data.money,
              name: response.data.name,
              remarks: response.data.remarks,
              sendEndTime: response.data.sendEndTime,
              sendStartTime: response.data.sendStartTime,
              startTime: response.data.startTime,
              toUrl: response.data.toUrl,
              type: response.data.type,
              useProductCategory: response.data.useProductCategory,
              useProductIds: (response.data.useProductIds)?response.data.useProductIds:[]
            };
            this.dialogEditVisible = true;
          } else {
            IsAlert(response.msg,'错误','error');
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试')
        });
      },
      //优惠券确定修改
      _doHandleEdit() {
        let params = {
          id: this.editTable.id,
          canReceiveNum: this.editTable.canReceiveNum,
          deadDay: this.editTable.deadDay,
          deadtimeType: this.editTable.deadtimeType,
          description: this.editTable.description,
          endTime: this.editTable.time[1],
          fullMoney: this.editTable.fullMoney,
          money: this.editTable.money,
          name: this.editTable.name,
          remarks: this.editTable.remarks,
          sendEndTime: this.editTable.sendEndTime,
          sendStartTime: this.editTable.sendStartTime,
          startTime: this.editTable.time[0],
          toUrl: this.editTable.toUrl,
          type: this.editTable.type,
          useProductCategory: (this.editTable.type===1)?this.editTable.useProductCategory.toString():'',
          useProductIds: (this.editTable.type===2)?this.editTable.useProductIds.toString():'',
          userId: this.AdminUserId
        };
        postUpdateConpont(params).then(response => {
          if (response.code === ERR_OK) {
            IsAlert(response.msg,'成功','success');
            this.handleCloseEidt();
            this.getList();
          } else {
            IsAlert(response.msg,'错误','error');
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试')
        });
      },
      // 优惠券取消编辑
      _doCancel() {
        this.handleCloseEidt();
        this.getList();
        this.$message({
          type: 'warning',
          message: '取消编辑'
        });
      },
      handleCloseEidt() {
        //编辑弹窗重置数据
        this.resetForm('formEdit');
        this.dialogEditVisible = false;
      },
      getProductList() {/*分页获取商品列表*/
        let params = {};
        getConpontProduct(params).then((res) => {
            if (res.code === ERR_OK) {
              this.ProductData = [];
              this.ProductData = res.data;
            }else{
              IsAlert(`接口错误，code:${res.code}，msg:${res.msg}`,'错误','error');
            }
          }).catch(()=>{
            this.$message.error('网络错误!请稍后重试')
          })
      },
      //获取列表
      getList() {
        let params = {
          currentPage: this.searchParams.currentPage,
          pageSize: this.searchParams.pageSize,
          name: this.searchParams.name,
          sendTime: this.searchParams.sendTime,
          type: this.searchParams.type
        };
        GetConpontList(params).then(response => {
          if ((response.code === ERR_OK)) {
            this.tableData = [];
            this.tableData = response.data.list;
            this.totalCount = response.data.totalCount;
          } else {
            IsAlert('获取优惠券列表失败','错误','error');
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试')
        });
        let partthis = getStore('userMesage');
        this.AdminUserId = EncodeUserId(JSON.parse(partthis).userId)
      },
    },
    activated: function () {
      this.searchParams.currentPage = 1;
      this.getList();
      this.getFirstClass();
      this.getProductList();
    },
  }
</script>

<style lang="less" scoped>

  .el-checkbox {
    margin-left: 10px;
  }

  .dot {
    width: 100%;
  }

  .el-select {
    display: block;
  }

  // .el-input {
  //   margin-bottom: 15px;
  // }

  .link-line {
    position: absolute;
    top: 0;
    right: 70%;
    line-height: 34px;
    width: 25px;
    text-align: center;
  }
  .m_l_15 {
    margin-left: 15px;
  }

  .btn-row {
    text-align: center;
    padding-top: 20px;
  }

  .el-header, .el-main, .el-footer {
    padding:0;
  }
</style>

