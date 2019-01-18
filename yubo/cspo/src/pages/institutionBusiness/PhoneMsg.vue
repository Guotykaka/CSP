<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">

      <!-- 短信推送 -->
      <div>
        <el-header height="30">
          <!-- 操作行-->
          <el-row class="m_b_15">
            <el-form id="SearchBar" :model="searchParams" :inline="true" class="demo-form-inline">
              <el-form-item label="计划名称：">
                <el-input v-model="searchParams.title" placeholder="请输入计划名称" @keyup.enter.native="doSearch()"  class="m_b_15"
                          clearable></el-input>
              </el-form-item>
              <el-form-item label="发送时间：">
                <el-date-picker v-model="searchParams.time" @change="getselTime" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="doSearch()">查询</el-button>
                <el-button type="primary" @click="handleAdd()">创建计划</el-button>
              </el-form-item>
            </el-form>
          </el-row>
        </el-header>

        <el-main>
          <!--tab nav-->
              <template>
                <el-table :data="tableData" border style="width: 100%" id="app">
                  <el-table-column show-overflow-tooltip align="center" type="index" label="" width="50"></el-table-column>
                  
                  <el-table-column show-overflow-tooltip align="center" prop="planName" label="计划名称"></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="appendInfo" label="发送人群"></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="jumpType" label="发送类型">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper">
                        <el-tag size="medium" type="danger" v-for="(item,index) in pushTypeData"
                         :key="item.index" v-if="scope.row.jumpType === item.pushType">{{item.pushTypeName}}</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="content" label="推送内容"></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="createDate" label="创建时间"></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="sentDate" label="发送时间"></el-table-column>
                  <el-table-column align="center" label="操作" width="180" fixed="right">
                    <template slot-scope="scope">
                      <el-button size="mini" type="danger" v-if="scope.row.pushStatus === 1"
                                 @click="deleteMessage(scope.$index, scope.row)">移除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
          <!-- 列表 -->


        </el-main>
        <div class="self-page-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="searchParams.currentPage" :page-sizes="[10,20]"
                         :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper"
                         :total="totalCount">
          </el-pagination>
        </div>
      </div>
      <!-- 创建消息 -->
      <el-dialog title="创建消息" :visible.sync="dialogAddVisible" width=660px :before-close="handleCloseAdd" class="disableClick">
          <el-tabs v-model="tabAdd" :before-leave="beforeLeave">
            <el-tab-pane label="基础信息" name="first">
              <el-form :model="addTable" :rules="rulesAddOnce" ref="AddOnce">
                <el-form-item label="计划名称:" :label-width="formLabelWidth" prop="planName">
                    <el-col :span="20">
                        <el-input v-model="addTable.planName" placeholder="请输入计划名称"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="人群类型:" :label-width="formLabelWidth" class="is-required">
                    <el-radio v-model="addTable.customType" label="1">指定接收人</el-radio>
                    <el-radio v-model="addTable.customType" label="2">圈定人群</el-radio>
                </el-form-item>
                <el-form-item label="手机号:" :label-width="formLabelWidth" prop="tels" v-if="addTable.customType==='1'">
                    <el-col :span="20">
                        <el-input type="textarea" id="PhoneMSGarea2"  resize="none" v-model="addTable.tels" :autosize='{minRows:1}'></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label=" " label-width="435px" v-if="addTable.customType==='1'">
                    <el-col :span="20">
                        <el-upload
                            ref="upload"
                            action="/"
                            :show-file-list="false"
                            :on-change="importExcel"
                            :auto-upload="false">
                            <el-button
                              slot="trigger"
                              icon="el-icon-upload"
                              size="small"
                              type="primary">
                              上传文件
                            </el-button>
                        </el-upload>
                    </el-col>
                </el-form-item>
                <div v-if="addTable.customType==='2'">
                  <el-form-item label="地理位置:" :label-width="formLabelWidth" prop="cityCode">
                    <el-col :span="20">
                      <el-select v-model="addTable.cityCode" value-key="id" clearable multiple filterable placeholder="请选择地理位置" style="width:100%">
                            <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item"></el-option>
                      </el-select>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="身体标签:" :label-width="formLabelWidth" prop="bodyTag">
                      <el-col :span="20">
                        <el-select v-model="addTable.bodyTag" value-key="id" clearable multiple filterable placeholder="请选择身体标签" style="width:100%">
                              <el-option v-for="item in bodyTagList" :key="item.id" :label="item.name" :value="item"></el-option>
                        </el-select>
                      </el-col>
                  </el-form-item>
                  <el-form-item label="活跃天数:" :label-width="formLabelWidth" prop="activeDays">
                      <el-col :span="20">
                        <el-select v-model="addTable.activeDays" value-key="id" clearable multiple filterable placeholder="请选择活跃天数" style="width:100%">
                              <el-option v-for="item in ActivieList" :key="item.id" :label="item.name" :value="item"></el-option>
                        </el-select>
                      </el-col>
                  </el-form-item>
                  <el-form-item label="体检类型:" :label-width="formLabelWidth" prop="checkType">
                      <el-col :span="20">
                        <el-select v-model="addTable.checkType" value-key="id" clearable multiple filterable placeholder="请选择体检类型" style="width:100%">
                              <el-option v-for="item in checkTypeList" :key="item.id" :label="item.name" :value="item"></el-option>
                        </el-select>
                      </el-col>
                  </el-form-item>
                  <el-form-item label="发送机构:" :label-width="formLabelWidth" prop="sentUnitCode">
                      <el-col :span="20">
                          <el-select v-model="addTable.sentUnitCode" value-key="id" clearable multiple collapse-tags filterable placeholder="请选择发送机构" style="width:100%"  @change='selectAll'>
                              <el-option v-for="item in InsList" :key="item.id" :label="item.name" :value="item"></el-option>
                          </el-select>
                      </el-col>
                  </el-form-item>
                </div>
                
              </el-form>
              <div class="btn-row">
                <el-button size="small" type="primary" @click="beforeLeave()">下一步</el-button>
                <el-button size="small" type="primary" @click="_doAddCancel()">取消</el-button>
              </div>
            </el-tab-pane>
            <el-tab-pane label="发送内容设置" name="second" disabled>
              <el-form :model="addTable" :rules="rulesAddSec" ref="AddSecond">
                <el-form-item label="标题:" :label-width="formLabelWidth" prop="title">
                  <el-col :span="20">
                      <el-input v-model="addTable.title" placeholder="请输入内容标题"></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="发送内容:" :label-width="formLabelWidth" prop="content">
                  <el-col :span="20">
                      <el-input type="textarea" id="PhoneMSGarea"  resize="none" v-model="addTable.content" :autosize='{minRows:1}' placeholder="请输入发送内容"></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="跳转类型:" :label-width="formLabelWidth" prop="jumpType">
                  <el-col :span="20">
                      <el-select v-model="addTable.jumpType" value-key="pushType" clearable filterable placeholder="请选择跳转类型" style="width:100%">
                          <el-option v-for="item in pushTypeData" :key="item.pushType" :label="item.pushTypeName" :value="item.pushType"></el-option>
                      </el-select>
                  </el-col>
                </el-form-item>
                <el-form-item label="跳转ID:" :label-width="formLabelWidth" prop="jumpText">
                  <el-col :span="20">
                      <el-input v-model="addTable.jumpText" placeholder="请输入跳转ID"></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="选择日期:" :label-width="formLabelWidth" prop="sentDate">
                  <el-col :span="20">
                    <el-date-picker
                      style="width:100%"
                      v-model="addTable.sentDate"
                      type="date"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期"
                      :picker-options="pickerOptions0">
                    </el-date-picker>
                  </el-col>
                </el-form-item>
                <el-form-item label="选择时间:" :label-width="formLabelWidth" prop="sentTime">
                  <el-col :span="20">
                    <el-time-picker
                      style="width:100%"
                      v-model="addTable.sentTime"
                      value-format="HH:mm:ss"
                      format="HH:mm:ss"
                      placeholder="选择执行时间">
                    </el-time-picker>
                  </el-col>
                </el-form-item>
                <el-form-item label="发送方式:" :label-width="formLabelWidth" class="is-required">
                  <el-radio v-model="addTable.sentType" label="1">PUSH</el-radio>
                  <el-radio v-model="addTable.sentType" label="2">短信</el-radio>
                  <el-radio v-model="addTable.sentType" label="3">PUSH短信</el-radio>
                </el-form-item>
              </el-form>
              <div class="btn-row">
                <el-button size="small" type="primary" @click="submitForm('AddSecond')">保存</el-button>
                <el-button size="small" type="primary" @click="_doAddCancel()">取消</el-button>
              </div>
                </el-form>
                </el-tab-pane>
                </el-tabs>

      </el-dialog>
    </div>
  </div>

</template>


<script>
  import {
    ERR_OK,
    QueryPushList,
    PostDeletePushPlan,
    PostSavePushPlan,
    PostSupplePlan,
    getAllins,
    PostSecondPlan,
    PostSuppleSecPlan,
    getMSGTemplate,
    postBUFANewTemplate,//新补发计划
    postAddOperaTemplate,//运营计划
    postRemoveSupNewPlan,//结束补发计划(新)
    PostPushPlanType,//推送类别列表
    PostQueryLabelList,//type查询标签体系type(1=身体标签;2=活跃度;3=出生年;4=购买行为;5=购买分类类型;6=设备;7=机构;8=付款订单;9=省份;10=城市;11=报告;12=性别;13=查阅新闻;14=查阅视频;15=查阅专题;16=查阅订单;17=团检还是个检)
  } from '@/api/api.js'
  import {getStore,EncodeUserId,selectAllPackage,IsAlert} from '@/config/mUtils.js'
  import headerTop from '@/components/headTop.vue'
  import {baseUrl} from '@/config/env.js'
  import XLSX from 'xlsx'

  export default {
    components: {
      headerTop,
    },
    data() {
      return {
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },  
        oldOptions:[], // 用来储存上一次的数据
        selectAll_character:{id: "quanxuan",name: "全部选择"},
        tabAdd:'first',
        pushTypeData:[], // 推送类别
        cityList:[], // 城市列表
        bodyTagList:[], // 身体标签列表
        ActivieList:[], // 活跃度列表
        checkTypeList:[], //体检类型列表
        tabIndex: "1",//当前状态index
        // AdminUserId: '',//userId
        InsList: [],//机构列表数据
        totalCount: 0,
        searchParams: {
          time: [],
          startTime: '',
          endTime: '',
          currentPage: 1,
          title: "",
          pageSize: 10,
        },
        tableData: [], //列表数据
        addTable: { //新增消息推送数据
          //commPushPlanInfoExtend: {//人群类型=2,必填 ,
                activeDays: [],
                bodyTag: [],
                checkType: [],
                city: "",
                cityCode: [],
                sentUnitCode: [],
                sentUnitName: [],


            content: "",//发送内容
            customType: "1",//人群类型(1:单独手机列表;2:人群标签范围) 
            jumpText: "",//跳转内容 ,
            jumpType: "",//跳转类型(1:H5;2:商品;3:专题;4:图文;5:视频;6:话题;) ,
            planName: "",//计划名称 ,
            sentDate: "",// 发送日期 格式：（2018-12-202） ,
            sentTime: "",// 发送时间 格式：（ 13:00:00） ,
            sentType: "1",//发送方式(1:PUSH;2:短信;3:push和短信) ,
            tels: "",//人群类型=1,必填 ,
            title: ""//发送标题
        },
        dialogAddVisible: false, //消息推送
        formLabelWidth: '120px',
        rulesAddOnce: {//第一个tab的验证规则
          planName: [
            {required: true, message: '请输入计划名称', trigger: 'blur'}
          ],
          tels: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            { 
                pattern:/^(1\d{10}\s*,)*(1\d{10})$/, 
                message: '手机号格式错误：11位数字英文逗号隔开，末尾不需要逗号', trigger: 'blur'
            }
          ],
          cityCode: [
            {required: true, message: '请选择地理位置', trigger: 'blur'},
          ],
          bodyTag: [
            {required: true, message: '请选择身体标签', trigger: 'blur'}
          ],
          activeDays: [
            {required: true, message: '请选择活跃类型', trigger: 'blur'}
          ],
          checkType: [
            {required: true, message: '请选择体检类型', trigger: 'blur'}
          ],
          sentUnitCode: [
            {required: true, message: '请选择发送机构', trigger: 'blur'}
          ],
        },
        rulesAddSec: {//第二个tab的验证规则
          title: [
            {required: true, message: '请输入内容标题', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '请输入发送内容', trigger: 'blur'}
          ],
          jumpType: [
            {required: true, message: '请选择跳转类型', trigger: 'blur'},
          ],
          jumpText: [
            {required: true, message: '请输入跳转ID', trigger: 'blur'}
          ],
          sentDate: [
            {required: true, message: '请选择发送日期', trigger: 'blur'}
          ],
          sentTime: [
            {required: true, message: '请选择发送时刻', trigger: 'blur'}
          ],
        },
      }
    },
    methods: {
      
      selectAllPackage(val,allOptions,oldOptions,newOptions,selectAll_character) {//下拉框全选逻辑处理
        //参数说明：val:传入的已选择值;allOptions:全部选项列表;oldOptions:旧的已选择值;newOptions:新的已选择值;selectAll_character:全选选项的id值.
        var result_val = val.some(item=>{
          if(item.id==='quanxuan'){
              return true 
          } 
        });
        console.log(result_val)
        const allValues = []
        // 保留所有值
        for (const item of allOptions) {
        allValues.push(item)
        }
        // 用来储存上一次的值，可以进行对比
        const oldVal = oldOptions.length === 1 ? oldOptions[0] : []
        var result_oldVal = oldVal.some(item=>{
          if(item.id=='quanxuan'){
              return true 
          } 
        });
        // 若是全部选择
        if (result_val) newOptions = allValues;
        // 取消全部选中 上次有 当前没有 表示取消全选
        if (result_oldVal && !result_val) newOptions = []
        // 点击非全部选中 需要排除全部选中 以及 当前点击的选项
        // 新老数据都有全部选中
        if (result_oldVal && result_val) {
          val = val.filter(item=>{
              return item.id !== 'quanxuan' 
            });
          newOptions = val
        }
        // 全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
        if (!result_oldVal && !result_val) {
        if (val.length === allValues.length - 1) newOptions = [selectAll_character].concat(val)
        }
        // 储存当前最后的结果 作为下次的老数据
        oldOptions[0] = newOptions;
        return [oldOptions,newOptions];
      },
      selectAll(val) {//补发计划全选机构
          let selectall = this.selectAllPackage(val,this.InsList,this.oldOptions,this.addTable.sentUnitCode,this.selectAll_character);
          this.oldOptions = selectall[0];
          this.addTable.sentUnitCode = selectall[1];
      },
      // changeValue(value) {//全选机构下拉框选择code，匹配出对应的对象
      //     this.addTable.sentUnitCode=[];
      //       for (let index = 0; index < value.length; index++) {
      //         let obj = {};
      //         obj = this.InsList.find((item)=>{
      //           return item.id === value[index];
      //         });
      //         this.addTable.sentUnitCode.push(obj);
      //     }
      // },
      importExcel(file) {//上传Excel
        const types = file.name.split('.')[1]
        const fileType = ['xlsx', 'xlc', 'xlm', 'xls', 'xlt', 'xlw', 'csv'].some(item => item === types)
        if (!fileType) {
          IsAlert('格式错误！请重新选择','错误！','error');
          return;
        }
        this.file2Xce(file).then(tabJson => {
          if (tabJson && tabJson.length > 0) {
            let arrayA = [];
            let arrayB = [];
            arrayA =tabJson[0].sheet;
            arrayA.forEach((res) => {
            if(res.手机号.length == 11 && /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|)+\d{8})$/.test(res.手机号) ) 
            { 
              arrayB.push(res.手机号);
            }else{ 
              IsAlert('手机号格式错误','错误','error'); 
              return;
            } 
            });
            this.addTable.tels = (!this.addTable.tels)?this.addTable.tels.concat(arrayB)+'':this.addTable.tels+','+arrayB+'';
            // tabJson就是解析出来的json数据,数据格式如下
            // [
            //   {
            //     sheetName: sheet1
            //     sheet: sheetData
            //   }
            // ]
          }
        })
      },
      file2Xce(file) {//XLSX插件把Excel数据处理为JSON
        return new Promise(function(resolve, reject) {
          const reader = new FileReader()
          reader.onload = function(e) {
            const data = e.target.result
            this.wb = XLSX.read(data, {
              type: 'binary'
            })
            const result = []
            this.wb.SheetNames.forEach((sheetName) => {
              result.push({
                sheetName: sheetName,
                sheet: XLSX.utils.sheet_to_json(this.wb.Sheets[sheetName])
              })
            })
            resolve(result)
          }
          reader.readAsBinaryString(file.raw)
        })
      },
        //搜索时间控件change事件
      getselTime() {
          this.searchParams.startTime = (this.searchParams.time) ? this.searchParams.time[0] : '';
          this.searchParams.endTime =  (this.searchParams.time) ? this.searchParams.time[1] : '';
      },
      //时间格式转换
      timestampToTime(timestamp) {
        var date = new Date(timestamp);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() + ' ';
        return Y + M + D;
      },
      handleSizeChange: function (size) {
        this.searchParams.pageSize = size;
        this.getList();
      },
      handleCurrentChange: function (currentPage) {
        this.searchParams.currentPage = currentPage;
        this.getList();
      },
      doSearch() {
        this.searchParams.currentPage = 1;
        this.searchParams.pageSize = 10;
        this.getList();
      },
      
      submitForm(formName) {//消息推送，（点击新增按钮后通过表单验证才能触发新增事件）
        this.$refs[formName].validate(valid => {
          if (valid) {
              this._doAddPush();
          } else {
            return false;
          }
        })
      },
      beforeLeave(){//tabs第一个tab离开时进行第一个表单验证
      console.log(this.tabAdd)
        if (this.tabAdd==='first') {
          this.$refs['AddOnce'].validate(valid => {
            if (valid) {
              this.$refs['AddOnce'].clearValidate();
              this.tabAdd='second';
            } else if(this.addTable.planName&&this.addTable.customType==='2'&&(this.addTable.cityCode.length||this.addTable.bodyTag.length||this.addTable.activeDays.length||this.addTable.checkType.length||this.addTable.sentUnitCode.length)){
              this.$refs['AddOnce'].clearValidate();//清除校验error
              this.tabAdd='second';
            } else{
              return false;
            }
          });
        } ;
      },
      //取消表单验证
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      // 创建消息推送
      handleAdd() {
        this._doAddPushClear();
        this.dialogAddVisible = true;
      },
      _doAddPush() {//确定新增按钮
        // this.changeValue(this.addTable.sentUnitCode);
        let activeDays= [],activeDaysId= [],bodyTag= [],bodyTagId= [],checkTypeName= [],checkTypeId= [],cityName= [],cityCode= [],sentUnitCode= [],
        sentUnitName = [];
        let getP = function GetParames(val,idlist,namelist) {
          if(Boolean(val.length !== 0)){
              val.forEach(row => {
              idlist.push(row.id);
              namelist.push(row.name);
            });
          }
        };
        // let getIns = function GetParames(val,idlist,namelist) {
        //   if(Boolean(val.length !== 0)){
        //       val.forEach(row => {
        //       idlist.push(row.institutionCode);
        //       namelist.push(row.institutionName);
        //     });
        //   }
        // };
        getP(this.addTable.cityCode,cityCode,cityName);
        getP(this.addTable.activeDays,activeDaysId,activeDays);
        getP(this.addTable.bodyTag,bodyTagId,bodyTag);
        getP(this.addTable.checkType,checkTypeId,checkTypeName);
        getP(this.addTable.sentUnitCode,sentUnitCode,sentUnitName);
        // getIns(this.addTable.sentUnitCode,sentUnitCode,sentUnitName);
        let params = {
          commPushPlanInfoExtend: {
            activeDays: activeDays,
            activeDaysId: activeDaysId,
            bodyTag: bodyTag,
            bodyTagId: bodyTagId,
            checkTypeName: checkTypeName,
            checkTypeId: checkTypeId,
            cityName: cityName,
            cityCode: cityCode,
            sentUnitCode: sentUnitCode,
            sentUnitName: sentUnitName
          },
            content: this.addTable.content,
            customType: this.addTable.customType,
            jumpText: this.addTable.jumpText,
            jumpType: this.addTable.jumpType,
            planName: this.addTable.planName,
            sentDate: this.addTable.sentDate+' '+this.addTable.sentTime,
            sentType: this.addTable.sentType,
            tels: this.addTable.tels,
            title: this.addTable.title
        };
        if (this.addTable.customType === '1') {
         params.commPushPlanInfoExtend = {
              activeDays: [],
              activeDaysId: [],
              bodyTag: [],
              bodyTagId: [],
              checkTypeName: [],
              checkTypeId: [],
              cityName: [],
              cityCode: [],
              sentUnitCode: [],
              sentUnitName: [],
            };
        } else {
          params.tels='';
        }
        PostSavePushPlan(params).then(res => {
          if (res.code === ERR_OK) {
            this.$notify({
              type: 'success',
              title: '新增成功！',
              duration: 3000,
            });
            this.handleCloseAdd();
            this.getList();
          } else {
            this.handleCloseAdd();
            IsAlert(res.msg,'错误','error');
          }
        }).catch(()=>{
          this.handleCloseAdd();
          this.$message.error('网络错误!请稍后重试');
        })
      },
      //消息推送取消按钮
      _doAddCancel() {
        this.handleCloseAdd();
        this.$message({
          type: 'warning',
          message: '取消新增'
        })
      },
      //消息推送取消
      handleCloseAdd() {
        if (this.tabAdd ==='first') {
          this.resetForm('AddOnce');
        } else {
          this.resetForm('AddSecond');
          this.tabAdd ='first';
        }
        this.dialogAddVisible = false;
      },
      //消息推送清空按钮
      _doAddPushClear() {
        this.addTable = {
                activeDays: [],
                bodyTag: [],
                checkType: [],
                city: "",
                cityCode: [],
                sentUnitCode: [],
                sentUnitName: [],
            content: "",//发送内容
            customType: "1",//人群类型(1:单独手机列表;2:人群标签范围) 
            jumpText: "",//跳转内容 ,
            jumpType: "",//跳转类型(1:H5;2:商品;3:专题;4:图文;5:视频;6:话题;) ,
            planName: "",//计划名称 ,
            sentDate: "",// 发送日期 格式：（2018-12-20） ,
            sentTime: "",// 发送时间 格式：（2018-12-20） ,
            sentType: "1",//发送方式(1:PUSH;2:短信;3:push和短信) ,
            tels: "",//电话 ,
            title: ""//发送标题
        };
      },
       // 删除提示
      deleteMessage(index, row) {
        this.$confirm('此操作将结束该计划, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
          .then(() => {
            let params = {
              pushId: row.id,
            }
            PostDeletePushPlan(params).then(res => {
              if (res.code === ERR_OK) {
                this.$notify({
                  type: 'success',
                  title: '计划结束！',
                  duration: 3000,
                });
                this.getList();
              } else {
                IsAlert(res.msg,'错误','error');
              }
            }).catch(()=>{
              this.$message.error('网络错误!请稍后重试');
            })
          })
          .catch(() => {
            this.$message({
              type: 'warning ',
              message: '已取消结束计划'
            })
          })
      },
      //获取列表
      getList() {
        let params = {
          currentPage: this.searchParams.currentPage,
          title: this.searchParams.title,
          pageSize: this.searchParams.pageSize,
          sentStartDate: (this.searchParams.startTime)?this.searchParams.startTime + ' 00:00:00':this.searchParams.startTime,
          sentEndDate: (this.searchParams.endTime)?this.searchParams.endTime + ' 23:59:59':this.searchParams.endTime,
        }
        QueryPushList(params).then(res => {
          if ((res.code === ERR_OK)) {
            this.tableData = [];
            this.tableData = res.data.list;
            this.totalCount = res.data.totalCount;
          } else {
            IsAlert('获取短信推送列表失败','提示','error');
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试');
        })
        // let partthis = getStore('userMesage');
        // this.AdminUserId = EncodeUserId(JSON.parse(partthis).userId);
      },
      //获取机构列表
      // getInsList() {
      //   let params = {}
      //   getAllins(params).then(res => {
      //     this.InsList = [];
      //     this.InsList = res.data;
      //     this.InsList.unshift({institutionCode: "quanxuan",institutionName: "全部选择"});
      //   }).catch(()=>{
      //     this.$message.error('网络错误!请稍后重试');
      //   })
      // },
      //获取推送类别列表
      getPushTypeList() {
        let params = {}
        PostPushPlanType(params).then(res => {
          this.pushTypeData = [];
          this.pushTypeData = res.data;
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试');
        })
      },
      //获取身体标签列表 type(1=身体标签;2=活跃度;3=出生年;4=购买行为;5=购买分类类型;6=设备;7=机构;8=付款订单;9=省份;10=城市;11=报告;12=性别;13=查阅新闻;14=查阅视频;15=查阅专题;16=查阅订单;17=团检还是个检)
      getLabelList(type) {
        let params = {
          type:type
        }
        PostQueryLabelList(params).then(res => {
          this.bodyTagList = (type===1)?res.data:this.bodyTagList;
          this.cityList = (type===10)?res.data:this.cityList;
          this.ActivieList = (type===2)?res.data:this.ActivieList;
          this.checkTypeList = (type===17)?res.data:this.checkTypeList;
          this.InsList = (type===7)?res.data:this.InsList;
          if (type===7&&res.data.length) {
            this.InsList.unshift({id: "quanxuan",name: "全部选择"})
          };
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试');
        })
      },
    },
    activated: function () {
      this.tabIndex = '1';
      this.searchParams.type = '1';
      this.getList();
      // this.getInsList();
      this.getPushTypeList();
      this.getLabelList(1);//身体标签
      this.getLabelList(2);//活跃度
      this.getLabelList(7);//机构
      this.getLabelList(10);//城市
      this.getLabelList(17);//团检个检
    },
  }
</script>

<style lang="less" scoped>

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
<style lang="less">
.disableClick{//控制tabs设置disabled时不为灰色
  .el-tabs__item.is-disabled {
    color: #303133; 
    cursor:default
  }
  .el-tabs__item.is-active {
    color: #409EFF;
  }
}
#PhoneMSGarea {//控制文本域控件row=1时高度和其他item统一
    min-height: 40px !important;
    line-height: 2 !important;
  }
#PhoneMSGarea2 {
    min-height: 40px !important;
    line-height: 2 !important;
  }
  .elnum {
    padding-bottom: 15px;
    width: 220px;

  }

</style>

