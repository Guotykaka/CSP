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
              <el-form-item label="商品名称：">
                <el-input v-model="searchParams.productName" size="small" placeholder="请输入商品名称"
                          @keyup.enter.native="doSearch()"
                          clearable></el-input>
              </el-form-item>
              <el-form-item label="供应商名称：">
                <el-input v-model="searchParams.supplierName" size="small" placeholder="请输入供应商名称"
                          @keyup.enter.native="doSearch()"
                          clearable></el-input>
              </el-form-item>
              <el-form-item label="商品状态：">
                <el-select v-model="searchParams.productStatus" size="small" clearable placeholder="请选择商品类型">
                  <el-option label="上架" :value="1"></el-option>
                  <el-option label="下架" :value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" @click="doSearch()">搜 索</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" @click="handleAdd()">新 增</el-button>
              </el-form-item>
            </el-form>
          </el-row>
        </el-header>
        <el-main>
          <!-- 列表 -->
          <template>
            <el-table :data="tableData" border style="width: 100%">
              <el-table-column show-overflow-tooltip align="center" type="index" width="80"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="productId" label="商品ID"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="productName" label="商品名称"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="supplierName" label="供应商"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="productParentCategoryName" label="一级类目"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="productCategoryName" label="二级类目"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" label="商品状态">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium" type="success" v-if="scope.row.productStatus === 1">上架</el-tag>
                    <el-tag size="medium" type="danger" v-if="scope.row.productStatus === 2">下架</el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center" label="价格">
                <template slot-scope="scope">
                  <p>￥{{ scope.row.productPrice }}</p>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="updateTime" label="创建时间"></el-table-column>
              <el-table-column align="center" label="操作" width="300">
                <template slot-scope="scope">
                  <el-button size="mini" type="success" v-if="scope.row.productStatus === 2"
                             @click="TrueStatus(scope.$index, scope.row)">上架
                  </el-button>
                  <el-button size="mini" type="warning" v-if="scope.row.productStatus === 1"
                             @click="FalseStatus(scope.$index, scope.row)">下架
                  </el-button>
                  <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                  <el-button size="mini" type="danger" @click="deleteMessage(scope.$index, scope.row)">删除</el-button>
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
      <!-- 商品编辑弹窗 -->
      <div class="shop-edit" v-if="dialogEditVisible">
        <el-dialog title="编辑商品" :visible.sync="dialogEditVisible" width=800px :before-close="handleCloseEidt">
          <el-form :model="editTable" :rules="rulesNew" ref="formEdit" :label-width="formLabelWidth">
            <el-form-item label="商品名称："prop="productName">
              <el-col :span="16">
                <el-input v-model="editTable.productName" prop auto-complete="off" el clearable></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="供应商：" prop="supplierId">
              <el-col :span="16">
                <el-select v-model="editTable.supplierId" placeholder="请选择" disabled>
                  <el-option v-for="item in SupplierList" :key="item.supplierId" :label="item.supplierName"
                             :value="item.supplierId">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="详情大图：" prop="productMainPicture">
              <uploadimg @emitSuccess="handImgSuccessEdit" @emitError="handImgError"
                         :imageSrc="editTable.productMainPicture"></uploadimg>
            </el-form-item>
            <el-form-item label="列表小图：" prop="productIcon">
              <uploadimg @emitSuccess="handImgSuccessEditNext" @emitError="handImgError"
                         :imageSrc="editTable.productIcon"></uploadimg>
            </el-form-item>
            <el-form-item label="商品描述：" prop="productDesc">
              <el-col :span="23">
                <tinymce v-model="editTable.productDesc" :url="Url" :with-credentials='false'
                         :editorHeight='200'></tinymce>
              </el-col>
            </el-form-item>
            <el-form-item label="原价：" prop="originPrice" class="is-required">
              <el-col :span="7" class="m_b_15">
                <el-input-number v-model="editTable.originPrice" :min="0" :precision="2"></el-input-number>
              </el-col>
              <el-col :span="2" class="m_b_15">
                &nbsp;元/个
              </el-col>
            </el-form-item>
            <el-form-item label="现价：" prop="productPrice" class="is-required">
              <el-col :span="7" class="m_b_15">
                <el-input-number v-model="editTable.productPrice" :min="0" :precision="2"></el-input-number>
              </el-col>
              <el-col :span="2" class="m_b_15">
                &nbsp;元/个
              </el-col>
            </el-form-item>
            <el-form-item label="售卖数：" prop="initialQuantity">
              <el-col :span="16" class="m_b_15">
                <el-input-number v-model="editTable.initialQuantity" :precision="0" disabled></el-input-number>
              </el-col>
            </el-form-item>
            <el-form-item label="绑定标签" prop="commTagDetailEntities">
              <el-col :span="16">
                <!-- <el-select filterable v-model="editTable.commTagDetailEntities" :multiple-limit="5" value-key="tagName" multiple
                           placeholder="请输入标签名搜索并进行选择">
                  <el-option :label="item.tagName" :value="item" v-for="(item,index) in alltagstaotao"
                             :key="index"></el-option>
                </el-select> -->
                <el-select filterable v-model="editTable.commTagDetailEntities" :multiple-limit="5" value-key="tagName" multiple
                :remote-method="remoteMethod" remote :loading="loading"
                           placeholder="请输入标签名搜索并进行选择">
                  <el-option :label="item.tagName" :value="item" v-for="(item,index) in RemoteOptions"
                             :key="item.tagName"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-form>
          <div class="btn-row">
            <el-button size="small" type="primary" @click="_doHandleEdit()">保存</el-button>
            <el-button size="small" type="primary" @click="_doCancel()">取消</el-button>
          </div>
        </el-dialog>
      </div>
      <!-- 商品新增弹窗 -->
      <div class="shop-add" v-show="dialogAddVisible">
        <el-dialog title="新增商品" :visible.sync="dialogAddVisible" width=800px :before-close="handleCloseAdd">
          <el-form :model="addTable" :rules="rulesNew" ref="formNew" :label-width="formLabelWidth">
            <el-form-item label="商品名称：" prop="productName" class="shop-margin-b">
              <el-col :span="16">
                <el-input v-model="addTable.productName" prop auto-complete="off" el clearable></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="供应商：" prop="supplierId">
              <el-col :span="16">
                <el-select v-model="addTable.supplierId" placeholder="请选择" class="selectner">
                  <el-option v-for="item in SupplierList" :key="item.supplierId" :label="item.supplierName"
                             :value="item.supplierId">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="详情大图：" prop="productMainPicture">
              <uploadimg @emitSuccess="handImgSuccessAdd" @emitError="handImgError"
                         :imageSrc="addTable.productMainPicture"></uploadimg>
            </el-form-item>
            <el-form-item label="列表小图：" prop="productIcon">
              <uploadimg @emitSuccess="handImgSuccessAddNext" @emitError="handImgError"
                         :imageSrc="addTable.productIcon"></uploadimg>
            </el-form-item>
            <el-form-item label="商品描述：" prop="productDesc">
              <el-col :span="23">
                <tinymce v-model="addTable.productDesc" :url="Url" :with-credentials='false'
                         :editorHeight='200'></tinymce>
              </el-col>
            </el-form-item>
            <el-form-item label="原价：" prop="originPrice"
                          class="is-required shop-margin-b">
              <el-col :span="7" class="m_b_15">
                <el-input-number v-model="addTable.originPrice" :min="0" :precision="2"></el-input-number>
              </el-col>
              <el-col :span="2" class="m_b_15">
                &nbsp;元/个
              </el-col>
            </el-form-item>
            <el-form-item label="现价：" prop="productPrice"
                          class="is-required shop-margin-b">
              <el-col :span="7" class="m_b_15">
                <el-input-number v-model="addTable.productPrice" :min="0" :precision="2"></el-input-number>
              </el-col>
              <el-col :span="2" class="m_b_15">
                &nbsp;元/个
              </el-col>
            </el-form-item>
            <el-form-item label="售卖数：" prop="initialQuantity" class="shop-margin-b">
              <el-col :span="16" class="m_b_15">
                <el-input-number v-model="addTable.initialQuantity" :precision="0"></el-input-number>
              </el-col>
            </el-form-item>
            <el-form-item label="商品标签" prop="commTagDetailEntities">
              <el-col :span="16">
                <el-select filterable v-model="addTable.commTagDetailEntities" :multiple-limit="5" value-key="tagName" multiple
                :remote-method="remoteMethod" remote :loading="loading"
                           placeholder="请输入标签名搜索并进行选择">
                  <el-option :label="item.tagName" :value="item" v-for="(item,index) in RemoteOptions"
                             :key="item.tagName"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-form>
          <div class="btn-row">
            <el-button size="small" type="primary" @click="submitForm('formNew')">保存</el-button>
            <el-button size="small" type="primary" @click="_doAddCancel()">取消</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>

</template>


<script>
  import {
    ERR_OK,
    GetModelList,
    GetProductInfo,
    SaveOrEditNDFT,
    postUpdateConpont,
    GetSupplierSelect,
    PostProductStatus,
    GetAllTagsTao,
    GetProductCategerySelect,//根据类目级别获取下拉数据
  } from '@/api/api.js'
  import {getStore, EncodeUserId, IsAlert} from '@/config/mUtils.js'
  import uploadimg from '@/components/uploadImg/uploadImgAdd.vue'
  import tinymce from '@/components/tinymce.vue'
  import headerTop from '@/components/headTop.vue'

  export default {
    components: {
      headerTop,
      tinymce,
      uploadimg
    },
    data() {
      return {
        RemoteOptions: [],//搜索后下拉框选项
        loading: false,
        alltagstaotao: [],
        Remotelist: [],//远程数据
        Url: 'http://v0.api.upyun.com/zhangshangtijian',//富文本上传地址
        AdminUserId: '',//userId
        editTable: {

        }, //供应链商品单个数据
        SupplierList: [], //供应链商品数据
        ViewTable: {},//查看
        totalCount: 0,
        searchParams: {
          currentPage: 1,
          pageSize: 10,
          productName: '',
          productStatus: '',
          supplierName:''
        },
        currentPage: 1, //分页初始页码
        pagesize: 30, //分页初始显示条数
        tableData: [], //列表数据
        addTable: {
          initialQuantity: 0,
          keyWord: "",
          commTagDetailEntities: [],
          modelType: "40",
          productDesc: "",
          productIcon: "",
          productId: "",
          productMainPicture: "",
          productName: "",
          originPrice: 0,
          productPrice: 0,
          productUnix: "元",
          roleId: "",
          supplierId: "",
          useOs: 1,
          userId: ""
        }, //供应链商品新增单个数据
        dialogEditVisible: false, //供应链商品修改
        dialogAddVisible: false, //供应链商品新增
        formLabelWidth: '140px',
        rulesNew: {
          productName: [
            {required: true, message: '请填写商品名称', trigger: 'blur'}
          ],
          productDesc: [
            {required: true, message: '请填写商品描述', trigger: 'change'}
          ],
          productIcon: [
            {required: true, message: '请上传商品头图', trigger: 'blur'}
          ],
          productMainPicture: [
            {required: true, message: '请上传商品主图', trigger: 'blur'}
          ],
          originPrice: [
            {required: true, message: '请填写商品原价', trigger: 'blur'}
          ],
          productPrice: [
            {required: true, message: '请填写商品现价', trigger: 'blur'}
          ],
          supplierId: [
            {required: true, message: '请选择供应商', trigger: 'change'}
          ],
          commTagDetailEntities: [
            {required: true, message: '请选择绑定标签', trigger: 'blur'}
          ],
          initialQuantity: [
            {required: true, message: '请填写初始售卖数', trigger: 'blur'}
          ],
        },
      }
    },
    methods: {
       remoteMethod(query) {//下拉框输入后远程搜索
         if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.RemoteOptions = this.Remotelist.filter(item => {
              return item.tagName.toLowerCase().indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.RemoteOptions = [];
        }
      },
      /*新增图片上传*/
      handImgSuccessAdd(res) {
        if (res.status === 200) {
          this.addTable.productMainPicture =
            'http://zhangshangtijian.b0.upaiyun.com' + res.data.url
        } else {
          IsAlert(res.msg, '错误', 'error');
        }
      },
      handImgSuccessAddNext(res) {
        if (res.status === 200) {
          this.addTable.productIcon =
            'http://zhangshangtijian.b0.upaiyun.com' + res.data.url
        } else {
          IsAlert(res.msg, '错误', 'error');
        }
      },
      handImgSuccessEdit(res) {
        if (res.status === 200) {
          this.editTable.productMainPicture =
            'http://zhangshangtijian.b0.upaiyun.com' + res.data.url
        } else {
          IsAlert(res.msg, '错误', 'error');
        }
      },
      handImgSuccessEditNext(res) {
        if (res.status === 200) {
          this.editTable.productIcon =
            'http://zhangshangtijian.b0.upaiyun.com' + res.data.url
        } else {
          IsAlert(res.msg, '错误', 'error');
        }
      },
      /*图片上传失败*/
      handImgError() {
        IsAlert('上传图片失败', '提示', 'warning')
      },
      /*change_deadtimeType_add() {
        this.addTable.deadDay = null;
        this.addTable.time = [];
      },
      change_deadtimeType_edit() {
        this.editTable.deadDay = null;
        this.editTable.time = [];
      },*/
      /*供应商商品查询*/
      doSearch() {
        this.searchParams.currentPage = 1;
        this.getList();
      },
      /*根据每页条数进行查询*/
      handleSizeChange(size) {
        this.searchParams.pageSize = size;
        this.getList();
      },
      /*根据当前页数查询*/
      handleCurrentChange(currentPage) {
        this.searchParams.currentPage = currentPage;
        this.getList();
      },
      /*新增*/
      handleAdd() {
        this.time = [];
        this.dialogAddVisible = true;
      },
      /*商品确定新增*/
      _doAdd() {
        let params = {
          originPrice: this.addTable.originPrice,
          initialQuantity: this.addTable.initialQuantity,
          keyWord: '666',
          selectedTagInfoVOS: this.addTable.commTagDetailEntities,
          modelType: this.addTable.modelType,
          productDesc: this.addTable.productDesc,
          productIcon: this.addTable.productIcon,
          productId: this.addTable.productId,
          productMainPicture: this.addTable.productMainPicture,
          productName: this.addTable.productName,
          productPrice: this.addTable.productPrice,
          productUnix: this.addTable.productUnix,
          roleId: this.addTable.roleId,
          supplierId: this.addTable.supplierId,
          useOs: this.addTable.useOs,
          userId: this.AdminUserId
        };
        SaveOrEditNDFT(params).then(response => {
          if (response.code === ERR_OK) {
            IsAlert(response.msg, '成功', 'success');
            this.getList();
            this.handleCloseAdd();
          } else {
            IsAlert(response.msg, '错误', 'error');
          }
        }).catch(() => {
          this.$message.error('网络错误，请稍后重试')
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
        this.addTable = {
          initialQuantity: 0,
          keyWord: "",
          commTagDetailEntities: [],
          modelType: "40",
          productDesc: "",
          productIcon: "",
          productId: "",
          productMainPicture: "",
          productName: "",
          originPrice: 0,
          productPrice: 0,
          productUnix: "元",
          roleId: "",
          supplierId: "",
          useOs: 1,
          userId: ""
        };
        this.dialogAddVisible = false;
      },
      // 修改
      handleEdit(index, row) {
        let params = {
          productId: row.productId,
        };
        GetProductInfo(params).then((res) => {
          if (res.code === ERR_OK) {
            this.editTable = res.data;
            let arr = [];
            for (let index = 0; index < res.data.commTagDetailEntities.length; index++) {
              let obj = {
                tagId: res.data.commTagDetailEntities[index].tagId,
                tagName: res.data.commTagDetailEntities[index].tagName,
              };
              arr.push(obj);
            }
            this.editTable.commTagDetailEntities = arr;//已绑定的标签
            this.RemoteOptions = arr;//v-for中options的数据，保证编辑弹窗出现后能看到已绑定的标签
            console.log(this.RemoteOptions)
            this.dialogEditVisible = true;
          } else {
            IsAlert(res.msg, '错误', 'error');
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        });
      },
      //确定修改
      _doHandleEdit() {

        this.$refs['formEdit'].validate(valid => {
          if (valid) {
            let params = {
              originPrice: this.editTable.originPrice,
              initialQuantity: this.editTable.initialQuantity,
              keyWord: '666',
              selectedTagInfoVOS: this.editTable.commTagDetailEntities,
              modelType: this.editTable.modelType,
              productDesc: this.editTable.productDesc,
              productIcon: this.editTable.productIcon,
              productId: this.editTable.productId,
              productMainPicture: this.editTable.productMainPicture,
              productName: this.editTable.productName,
              productPrice: this.editTable.productPrice,
              productUnix: this.editTable.productUnix,
              roleId: this.editTable.roleId,
              supplierId: this.editTable.supplierId,
              useOs: 1,
              userId: this.AdminUserId
            };
            SaveOrEditNDFT(params).then(response => {
              if (response.code === ERR_OK) {
                IsAlert(response.msg, '成功', 'success');
                this.handleCloseEidt();
                this.getList();
              } else {
                IsAlert(response.msg, '错误', 'error');
              }
            }).catch(() => {
              this.$message.error('网络错误，请重试')
            });
          } else {
            return false;
          }
        });
      },
      // 取消修改
      _doCancel() {
        this.$message({
          type: 'warning',
          message: '取消编辑'
        });
        this.handleCloseEidt();
      },
      handleCloseEidt() {
        //编辑弹窗重置数据
        this.resetForm('formEdit');
        this.dialogEditVisible = false;
      },
      // 删除提示
      deleteMessage(index, row) {
        if (row.productStatus === 1) {
          IsAlert('请先将商品下架！', '提示', 'warning');
        } else {
          this.$confirm('此操作将删除该商品, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          })
            .then(() => {
              let params = {
                "productId": row.productId,
                "productStatus": 3,
                "userId": this.AdminUserId
              };
              PostProductStatus(params).then(response => {
                if (response.code === ERR_OK) {
                  this.$notify({
                    title: '成功',
                    message: `删除成功！`,
                    type: 'success'
                  });
                  this.getList()
                } else {
                  IsAlert(response.msg, '错误', 'error');
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
        }
      },
      // 下架
      FalseStatus(index, row) {
        this.$confirm('确定下架?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
          .then(() => {
            let params = {
              productId: row.productId,
              productStatus: 2,
              userId: this.AdminUserId
            };
            PostProductStatus(params).then(response => {
              if (response.code === ERR_OK) {
                this.$notify({
                  title: '成功',
                  message: `下架成功！`,
                  type: 'success'
                });
                this.getList();
              } else {
                IsAlert(response.msg, '错误', 'error');
                this.getList();
              }
            }).catch(() => {
              this.$message.error('网络错误!请稍后重试')
            })
          })
          .catch(() => {
            this.$message({
              type: 'warning ',
              message: '已取消更改'
            });
          });
      },
      // 上架
      TrueStatus(index, row) {
        if (!row.productCategoryName) {
          IsAlert('商品绑定类目后才能上线！', '错误', 'error');
          return;
        };
        this.$confirm('确定上架?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
          .then(() => {
            let params = {
              productId: row.productId,
              productStatus: 1,
              userId: this.AdminUserId
            };
            PostProductStatus(params).then(response => {
              if (response.code === ERR_OK) {
                this.$notify({
                  title: '成功',
                  message: `上架成功！`,
                  type: 'success'
                });
                this.getList();
              } else {
                IsAlert(response.msg, '错误', 'error');
                this.getList();
              }
            }).catch(() => {
              this.$message.error('网络错误!请稍后重试')
            });
          })
          .catch(() => {
            this.$message({
              type: 'warning ',
              message: '已取消更改'
            });
          });
      },
      //获取席涛涛标签列表
      getAlltagList() {
        let params = {};
        GetAllTagsTao(params).then(response => {
          if ((response.code === ERR_OK)) {
            this.alltagstaotao = [];
            this.alltagstaotao = response.data;
            this.Remotelist = this.alltagstaotao.map(item => {
              return { tagId: item.tagId, tagName: item.tagName };
            });
          } else {
            IsAlert('获取标签列表失败！', '错误', 'error');
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        });
      },
      //获取供应商下拉菜单
      getSupSelect() {
        let params = {};
        GetSupplierSelect(params).then(response => {
          if (response.code === ERR_OK) {
            this.SupplierList = [];
            this.SupplierList = response.data;
          } else {
            IsAlert('获取供应商列表失败！', '错误', 'error');
          }
        }).catch(() => {
          this.$message.error('网络错误，请稍后重试')
        });
      },

      //获取列表
      getList() {
        let params = {
          currentPage: this.searchParams.currentPage,
          pageSize: this.searchParams.pageSize,
          productStatus: this.searchParams.productStatus,
          productName: this.searchParams.productName,
          supplierName: this.searchParams.supplierName,
          modelType: '40'//实物
        };
        GetModelList(params).then(response => {
          if ((response.code === ERR_OK)) {
            this.tableData = [];
            this.tableData = response.data.list;
            this.totalCount = response.data.totalCount;
          } else {
            IsAlert('获取供应链商品列表失败！', '错误', 'error');
          }
        }).catch(() => {
          this.$message.error('网络错误，请稍后重试')
        });
        let partthis = getStore('userMesage');
        this.AdminUserId = EncodeUserId(JSON.parse(partthis).userId)
      },
    },
    activated: function () {
      this.searchParams.currentPage = 1;
      this.getList();
      this.getSupSelect();
      this.getAlltagList();
    },
  }
</script>

<style lang="less" scoped>

  .el-table {
    &__header-wrapper {
      .has-gutter {
        tr > th.gutter {
          display: table !important;
        }
      }
    }
  }
  div /deep/ .el-table th{
    display: table-cell!important;
  }
  /*弹窗样式*/
  .shop-edit /deep/ .el-dialog__body {
    padding-top: 0;
  }

  .shop-add /deep/ .el-dialog__body {
    padding-top: 0;
  }

  .shop-add /deep/ .shop-margin-b,
  .shop-edit /deep/ .shop-margin-b {
    margin-bottom: 0;
  }

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

  // .el-form-item {margin-bottom: 0}
  // .el-checkbox+.el-checkbox{margin: 0}
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
  el-table {

      tr > th.gutter {
        display: table !important;

  }
}
</style>
<style lang="less">
  #ResetNDFTHeight {
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

