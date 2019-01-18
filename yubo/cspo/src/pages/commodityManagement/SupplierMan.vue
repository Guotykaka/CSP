<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">

      <!-- 服务页面 -->
      <div>
        <el-header height="30">
          <!-- 操作行-->
          <el-row>
            <el-form id="SearchBar" :model="searchParams" :inline="true" class="demo-form-inline">
              <el-form-item label="供应商名称：">
                <el-input v-model="searchParams.supplierName" placeholder="请输入供应商名称" @keyup.enter.native="doSearch()"
                          clearable></el-input>
              </el-form-item>
              <el-form-item label="供应商类型：">
                <el-select v-model="searchParams.supplierType" placeholder="请选择供应商类型">
                  <el-option
                    v-for="item in typeOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="doSearch()">搜索</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleAdd()">新增</el-button>
              </el-form-item>

            </el-form>
          </el-row>
        </el-header>

        <el-main>
          <!-- 列表 -->
          <template>
            <el-table :data="tableData" border style="width: 100%" id="app">
              <el-table-column show-overflow-tooltip align="center" type="index" label=""></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="supplierName" label="供应商名称"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="supplierType" label="供应商类别">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">
                      <el-tag size="medium" type="success" v-if="scope.row.supplierType === 1">医院</el-tag>
                      <el-tag size="medium" v-if="scope.row.supplierType === 2">供应商</el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="synopsis" label="店铺简介"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="customerServiceUserName" label="绑定客服"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="productNumTotal"
                               label="商品总数"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="productOnShelfNum"
                               label="上架商品"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="updateTimeStr" label="创建时间"></el-table-column>
              <el-table-column align="center" label="操作" width="150">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                  <el-button size="mini" type="danger" @click="deleteMessage(scope.$index, scope.row)"
                             :disabled="scope.row.productNumTotal!==0">删除
                  </el-button>
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
      <!-- 供应商编辑弹窗 -->
      <el-dialog title="编辑供应商" :visible.sync="dialogEditVisible" width=700px :before-close="handleCloseEidt">
        <el-form :model="editTable" :rules="rulesNew" ref="formEdit">
          <el-form-item label="供应商名称：" :label-width="formLabelWidth2" prop="supplierName">
            <el-col :span="18">
              <el-input v-model="editTable.supplierName" prop auto-complete="off" el clearable></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="供应商编号：" :label-width="formLabelWidth2" prop="supplierCode">
            <el-col :span="18">
              <!-- <el-input v-model="editTable.supplierCode" prop auto-complete="off" el clearable></el-input> -->
              <el-select v-model="editTable.supplierCode" multiple allow-create :multiple-limit='1' disabled placeholder="请选择机构或者填写新编号并选择" filterable style="width:100%">
                <el-option v-for="(item,index) in this.getInstitutionArr" :key="index" :label="item.institutionName" :value="item.institutionCode">
                  <span style="float: left">{{ item.institutionName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.institutionCode }}</span>
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="供应商logo：" :label-width="formLabelWidth2" prop="supplierLogo">
            <uploadimg @emitSuccess="handImgSuccessEdit" @emitError="handImgErrorAdd"
                       :imageSrc="editTable.supplierLogo"></uploadimg>
          </el-form-item>
          <el-form-item label="供应商主图：" :label-width="formLabelWidth2" prop="mainPicture">
            <uploadimg @emitSuccess="handImgSuccessEditMain" @emitError="handImgErrorAdd"
                       :imageSrc="editTable.mainPicture"></uploadimg>
          </el-form-item>
          <el-form-item  label="店铺描述：" :label-width="formLabelWidth2" class="is-required"></el-form-item>
          <el-form-item prop="supplierDesc">
            <el-col :span="24">
              <msg-tinymce v-model="editTable.supplierDesc" :url="Url" :with-credentials='false'
                                 :editorHeight='200'></msg-tinymce>
            </el-col>
          </el-form-item>
          <el-form-item label="店铺简介：" :label-width="formLabelWidth2" prop="synopsis">
            <el-col :span="18">
              <el-input type="textarea" id="ResetInnerHeight" resize="none" v-model="editTable.synopsis"
                        :autosize='{minRows:1}'></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="客服账号：" :label-width="formLabelWidth2">
            <el-col :span="18">
              <el-select clearable v-model="editTable.customerServiceUserId" placeholder="请选择">
                <el-option
                  v-for="item in customerList"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
        </el-form>
        <div class="btn-row">
          <el-button type="primary" @click="_doCancel()" plain>取消</el-button>
          <el-button type="primary" @click="_doHandleEdit()">保存</el-button>
        </div>
      </el-dialog>
      <!-- 供应商创建弹窗 -->
      <div v-if="dialogAddVisible">
      <el-dialog title="创建供应商" :visible.sync="dialogAddVisible" width=700px :before-close="handleCloseAdd">
        <el-form :model="addTable" :rules="rulesNew" ref="formNew">
          <el-form-item label="机构类型：" :label-width="formLabelWidth2">
            <el-col :span="18">
              <el-radio-group v-model="addTable.supplierType" @change="supplierChange">
                <el-radio :label="2">供应商</el-radio>
                <el-radio :label="1">医 院</el-radio>
              </el-radio-group>
            </el-col>
          </el-form-item>
          <div v-if="addTable.supplierType===2">
          <el-form-item label="供应商名称：" :label-width="formLabelWidth2" prop="supplierName">
            <el-col :span="18">
              <el-input v-model="addTable.supplierName" prop auto-complete="off" el clearable></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="供应商编号：" :label-width="formLabelWidth2" prop="supplierCode">
            <el-col :span="18">
              <!-- <el-input-number v-model="addTable.supplierCode" :min="1" :precision="0" :max="100" :controls='false' style="width:100%"></el-input-number> -->
              <!-- <el-input v-model="addTable.supplierCode" prop auto-complete="off" el clearable></el-input> -->
              <el-input v-model="addTable.supplierCode" prop auto-complete="off" el clearable></el-input>
            </el-col>
          </el-form-item>
          </div>
          <el-form-item v-if="addTable.supplierType===1" label="供应商名称：" :label-width="formLabelWidth2" prop="institutionObject">
            <el-col :span="18">
              <el-select v-model="addTable.institutionObject" @change="supplierCodeChange" filterable value-key="institutionCode" placeholder="请选择机构或者填写新编号并选择" style="width:100%">
                <el-option v-for="(item,index) in this.getInstitutionArr" :key="index" :label="item.institutionName" :value="item">
                  <span style="float: left">{{ item.institutionName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.institutionCode }}</span>
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="供应商logo：" :label-width="formLabelWidth2" prop="supplierLogo">
            <uploadimg @emitSuccess="handImgSuccessAdd" @emitError="handImgErrorAdd"
                       :imageSrc="addTable.supplierLogo"></uploadimg>
          </el-form-item>
          <el-form-item label="供应商主图：" :label-width="formLabelWidth2" prop="mainPicture">
            <uploadimg @emitSuccess="handImgSuccessAddMain" @emitError="handImgErrorAdd"
                       :imageSrc="addTable.mainPicture"></uploadimg>
          </el-form-item>
          <el-form-item  label="店铺描述：" :label-width="formLabelWidth2" class="is-required"></el-form-item>
          <el-form-item prop="supplierDesc">
            <el-col :span="24">
              <!-- <el-input type="textarea" id="ResetInnerHeightS" resize="none" v-model="addTable.supplierDesc"
                        :autosize='{minRows:1}'></el-input> -->
              <msg-tinymce v-model="addTable.supplierDesc" :url="Url" :with-credentials='false'
                                 :editorHeight='200'></msg-tinymce>
            </el-col>
          </el-form-item>
          <el-form-item label="店铺简介：" :label-width="formLabelWidth2" prop="synopsis">
            <el-col :span="18">
              <el-input type="textarea" id="ResetInnerHeightS" resize="none" v-model="addTable.synopsis"
                        :autosize='{minRows:1}'></el-input>
            </el-col>
          </el-form-item>
        </el-form>
        <div class="btn-row">
          <el-button type="primary" @click="_doAddCancel()" plain>取消</el-button>
          <el-button type="primary" @click="submitForm('formNew')">创建</el-button>
        </div>
      </el-dialog>
      </div>
    </div>
  </div>

</template>


<script>
  import {
    ERR_OK,
    GetSupplierList,
    GetConpontDetail,
    SaveOREditSupplier,//新增或者编辑供应商信息
    postUpdateConpont,
    GetSupplierSelect,
    UpdateSupplier,
    listAllUserInfoBySupplier,//获取当前供应商下所有用户列表
  } from '@/api/api.js'
  import MsgTinymce from '@/components/tinymce'
  import {getStore,EncodeUserId,IsAlert} from '@/config/mUtils.js'
  import uploadimg from '@/components/uploadImg/uploadImgAdd.vue'
  import headerTop from '@/components/headTop.vue'
  import { mapGetters } from "vuex";

  export default {
    components: {
      headerTop,
      uploadimg,
      MsgTinymce
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
        Url: 'http://v0.api.upyun.com/zhangshangtijian',//富文本上传地址
        editTable: {
          customerServiceUserId: "",
          mainPicture: "",
          supplierCode: '',
          supplierDesc: "",
          supplierId: "",
          supplierLogo: "",
          supplierName: "",
          synopsis: "",
          supplierType:null
        }, //编辑单个数据
        docList: [], //认证医生数据
        ViewTable: {},//查看
        title: "提示",//this.$alert的标题
        totalCount: 0,
        searchParams: {
          currentPage: 1,
          pageSize: 10,
          supplierName: '',
          supplierType:null
        },
        typeOption:[
          {
            label: '医院',
            value: 1
          },
          {
            label: '供应商',
            value: 2
          }
        ],
        currentPage: 1, //分页初始页码
        pagesize: 30, //分页初始显示条数
        tableData: [], //列表数据
        addTable: {
          customerServiceUserId: "",
          mainPicture: "",
          supplierCode: "",
          supplierDesc: "",
          supplierId: "",
          supplierLogo: "",
          supplierName: "",
          synopsis: "",
          supplierType:2,//机构类型
          institutionObject:{},//选择机构的对象

        },
        //优惠券新增单个数据
        dialogEditVisible: false, //优惠券修改
        dialogAddVisible: false, //优惠券新增
        dialogViewVisible: false, //优惠券查看
        formLabelWidth: '100px',
        formLabelWidth2: '120px',
        rulesNew: {
          supplierName: [
            {required: true, message: '请填写供应商名称', trigger: 'blur'}
          ],
          institutionObject: [
            {type:'object',required: true,fields: {institutionName: { type: 'string', message: '请填写供应商名称',required: true },institutionCode: { type: 'string', message: '请填写供应商名称',required: true }}, message: '请填写供应商名称', trigger: 'change'}
          ],
          supplierCode: [
            {required: true, message: '请填写供应商编号', trigger: 'blur'}
          ],
          supplierDesc: [
            {required: true, message: '请填写店铺描述', trigger: 'blur'}
          ],
          synopsis: [
            {required: true, message: '请填写店铺简介', trigger: 'blur'}
          ],
          supplierLogo: [
            {required: true, message: '请上传供应商LOGO', trigger: 'change'}
          ],
          mainPicture: [
            {required: true, message: '请上传供应商主图', trigger: 'change'}
          ],
        },
        customerList: []
      }
    },
    methods: {
      handImgSuccessAdd(res) {
        if (res.status === 200) {
          this.addTable.supplierLogo =
            'http://zhangshangtijian.b0.upaiyun.com' + res.data.url
        } else {
          IsAlert(res.msg,'错误','error');
        }
      },
      handImgSuccessAddMain(res) {
        if (res.status === 200) {
          this.addTable.mainPicture =
            'http://zhangshangtijian.b0.upaiyun.com' + res.data.url
        } else {
          IsAlert(res.msg,'错误','error');
        }
      },
      handImgErrorAdd() {
      },
      handImgSuccessEdit(res) {
        if (res.status === 200) {
          this.editTable.supplierLogo =
            'http://zhangshangtijian.b0.upaiyun.com' + res.data.url
        } else {
          IsAlert(res.msg,'错误','error');
        }
      },
      handImgSuccessEditMain(res) {
        if (res.status === 200) {
          this.editTable.mainPicture =
            'http://zhangshangtijian.b0.upaiyun.com' + res.data.url
        } else {
          IsAlert(res.msg,'错误','error');
        }
      },
      handImgErrorEdit() {
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
      // 供应商确定新增
      _doAdd() {
        let params = {
          supplierDesc: this.addTable.supplierDesc,
          supplierId: this.addTable.supplierId,
          supplierLogo: this.addTable.supplierLogo,
          customerServiceUserId: this.addTable.customerServiceUserId,
          mainPicture: this.addTable.mainPicture,
          supplierCode: this.addTable.supplierCode,
          synopsis: this.addTable.synopsis,
          supplierName: this.addTable.supplierName,
          supplierType: this.addTable.supplierType
        };
        SaveOREditSupplier(params).then(response => {
          if (response.code === ERR_OK) {
            IsAlert(response.msg,'成功','success');
            this.handleCloseAdd();
            this.getList();
          } else {
            IsAlert(response.msg,'错误','error');
          }
          ;
        }).catch(() => {
          this.$message.error('网络错误，请稍后重试')
        });
      },
      // 供应商取消新增
      _doAddCancel() {
        this.handleCloseAdd();
        this.getList();
        this.$message({
          type: 'warning',
          message: '取消新增'
        });
      },
      submitForm(formName) {
        //新增模块表单验证
        this.$refs[formName].validate(valid => {
          if (valid) {
            this._doAdd();
          } else {
            return false;
          }
          ;
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
        this.addTable.supplierDesc = "",
        this.addTable.supplierId = "",
        this.addTable.supplierLogo = "",
        this.addTable.customerServiceUserId = "",
        this.addTable.mainPicture = "",
        this.addTable.supplierCode = [],
        this.addTable.synopsis = "",
        this.addTable.supplierName = "",
        this.addTable.institutionObject = {},//选择机构的对象,
        this.dialogAddVisible = false;
      },
      /*供应商类型选择*/
      supplierChange(){
        // this.resetForm('formNew')
        // this.addTable.supplierName = null;
      },
      /*供应商编号*/
      supplierCodeChange(item){
        this.addTable.supplierName =item.institutionName;
        this.addTable.supplierCode =item.institutionCode
      },
      // 供应商修改
      handleEdit(index, row) {
        this.editTable = JSON.parse(JSON.stringify(row));
        // this.editTable.supplierCode=this.editTable.supplierCode.split(",");
        this.editTable.supplierCode=new Array(this.editTable.supplierCode)
        this.dialogEditVisible = true;
        this.getCustomerList(row)
      },
      /*获取供应商下的用户列表*/
      getCustomerList(val) {
        let params = {
          id: val.supplierId
        };
        listAllUserInfoBySupplier(params)
          .then((res) => {
            if (res.code === ERR_OK) {
              this.customerList = res.data
            } else {
              this.$alert(res.msg, '提示')
            }
          })
          .catch(() => {
            this.$message.error('网络错误!获取供应商用户列表数据失败,请稍后重试!')
          })

      },
      //供应商确定修改
      _doHandleEdit() {
        this.$refs['formEdit'].validate(valid => {
          if (valid) {
            let params = {
              supplierDesc: this.editTable.supplierDesc,
              supplierId: this.editTable.supplierId,
              supplierLogo: this.editTable.supplierLogo,
              customerServiceUserId: this.editTable.customerServiceUserId,
              mainPicture: this.editTable.mainPicture,
              supplierCode: this.editTable.supplierCode+'',
              synopsis: this.editTable.synopsis,
              supplierName: this.editTable.supplierName,
              supplierType: this.editTable.supplierType
            }
            SaveOREditSupplier(params).then(response => {
              if (response.code === ERR_OK) {
                IsAlert(response.msg,'成功','success');
                this.handleCloseEidt();
                this.getList();
              } else {
                IsAlert(response.msg,'错误','error');
              }
            }).catch(() => {
              this.$message.error('网络错误，请重试')
            });
          } else {
            return false;
          }
        });

      },
      // 供应商取消编辑
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
        this.editTable = {
          customerServiceUserId: "",
          mainPicture: "",
          supplierCode: [],
          supplierDesc: "",
          supplierId: "",
          supplierLogo: "",
          supplierName: "",
          synopsis: "",
        }
        this.dialogEditVisible = false;
      },
      // 删除提示
      deleteMessage(index, row) {
        this.$confirm('此操作将删除该供应商, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
          .then(() => {
            let params = {
              status: 2,
              supplierId: row.supplierId,
            }
            UpdateSupplier(params).then(response => {
              if (response.code === ERR_OK) {
                this.$notify({
                  title: '成功',
                  message: `删除成功！`,
                  type: 'success'
                });
                this.getList();
              } else {
                IsAlert(response.msg,'错误','error');
              }
            }).catch(() => {
              this.$message.error('网络错误!请稍后重试')
            })
          })
          .catch(() => {
            this.$message({
              type: 'warning ',
              message: '已取消删除'
            })
          })
      },
      //获取供应商下拉菜单
      getSupSelect() {
        let params = {};
        GetSupplierSelect(params).then(response => {
          if (response.code === ERR_OK) {
            this.docList = [];
            this.docList = response.data;
          } else {
            IsAlert('获取认证医生列表失败！','提示','warning');
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        });
      },

      //获取供应商列表
      getList() {
        let params = {
          currentPage: this.searchParams.currentPage,
          pageSize: this.searchParams.pageSize,
          supplierName: this.searchParams.supplierName,
          supplierType: this.searchParams.supplierType,
        }
        GetSupplierList(params).then(response => {
          if ((response.code === ERR_OK)) {
            this.tableData = [];
            this.tableData = response.data.list;
            this.totalCount = response.data.totalCount;
          } else {
            IsAlert('获取供应商列表失败！','提示','warning');
          }
        }).catch(() => {
          this.$message.error('网络错误，请重试');
        });
        let partthis = getStore('userMesage')
        this.AdminUserId = EncodeUserId(JSON.parse(partthis).userId)
      },
    },
      computed:{
      ...mapGetters(['getInstitutionArr'])
    },
    activated: function () {
      this.searchParams.currentPage = 1;
      this.getList();
      this.getSupSelect();
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

  .el-date-editor {
    width: 100%;
  }

  .el-input {
    margin-bottom: 15px;
  }

  .link-line {
    position: absolute;
    top: 0;
    right: 70%;
    line-height: 34px;
    width: 25px;
    text-align: center;
  }

  .wordsnum {
    height: 117px;
    /* vertical-align: middle; */
    text-align: center;
    line-height: 117px;

  }

  .m_l_15 {
    margin-left: 15px;
  }

  .btn-row {
    text-align: center;
    padding-top: 20px;
  }

  .el-header, .el-main, .el-footer {
    padding: 0;
  }
</style>
<style lang="less">
  #ResetInnerHeight,
  #ResetInnerHeightS {
    min-height: 40px !important;
    line-height: 2 !important;
  }

  .el-form-item {
    &.is-required2 {
      .el-form-item__label {
        &:after {
          content: "*";
          color: #f56c6c;
          margin-left: 4px;
        }
      }
    }
  }

  .selector img {
    width: 150%;
  }

  .selpage {
    text-align: center;
    margin-top: 20px;
  }
</style>

