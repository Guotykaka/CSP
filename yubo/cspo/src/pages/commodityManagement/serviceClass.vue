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
              <el-form-item label="商品模板：">
                <el-input v-model="searchParams.name" placeholder="商品模板名称" @keyup.enter.native="doSearch()"
                          clearable></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="doSearch()">搜索</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleAdd()">新增</el-button>
              </el-form-item>
            </el-form>
          </el-row>
          <!-- <el-row>
           <el-button type="primary" @click="handleAdd()">新增</el-button>
         </el-row> -->
        </el-header>

        <el-main>
          <!--tab nav-->
          <el-tabs v-model="tabIndex" @tab-click="handleClick">
            <el-tab-pane label="图文咨询" name="10"></el-tab-pane>
            <el-tab-pane label="电话咨询" name="20"></el-tab-pane>
          </el-tabs>
          <!-- 列表 -->
          <template>
            <el-table :data="tableData" border style="width: 100%" id="app">
              <el-table-column show-overflow-tooltip align="center" type="index" width="80"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="modelId" label="商品模板编号"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="modelName" label="商品模板名称"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" label="模板类别" min-width="100%">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium" type="success" v-if="scope.row.modelCategory === 1">平台</el-tag>
                    <el-tag size="medium" type="danger" v-if="scope.row.modelCategory === 3">个人</el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center" label="商品模板状态" min-width="100%">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium" type="success" v-if="scope.row.modelStatus === 1">上架</el-tag>
                    <el-tag size="medium" type="danger" v-if="scope.row.modelStatus === 2">下架</el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center" label="价格范围">
                <template slot-scope="scope">
                  <p>￥{{ scope.row.modelMinPrice }}-￥{{ scope.row.modelMaxPrice }}</p>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="updateTime" label="创建时间"></el-table-column>
              <el-table-column align="center" label="操作" width="320" fixed="right">
                <template slot-scope="scope">
                  <el-button size="mini" type="danger" v-if="scope.row.modelStatus === 1"
                             @click="FalseStatus(scope.$index, scope.row)">下架
                  </el-button>
                  <el-button size="mini" type="success" v-if="scope.row.modelStatus === 2"
                             @click="TrueStatus(scope.$index, scope.row)">上架
                  </el-button>
                  <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                  <el-button size="mini" type="warning" v-if="true" @click="GoodsMan(scope.row)">商品管理</el-button>
                  <el-button size="mini" type="danger" @click="deleteMessage(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-main>
      </div>
      <!-- 修改弹窗 -->
      <div v-if="dialogEditVisible">
        <el-dialog title="修改" :visible.sync="dialogEditVisible" width=900px :before-close="handleCloseEdit">

          <el-form :model="editTable">
            <el-form-item class="is-required2" label="商品模板名称:" :label-width="formLabelWidth">
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-input v-model="editTable.modelName" prop auto-complete="off" el maxlength="10"></el-input>
                </el-col>
                <el-col :span="4">
                  <span>10字内</span>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item class="is-required2" label="列表小图:" :label-width="formLabelWidth">
              <uploadimg @emitSuccess="handImgSuccessEditElse" @emitError="handImgErrorAdd"
                         :imageSrc="editTable.modelIcon"></uploadimg>
            </el-form-item>
            <el-form-item class="is-required2" label="详情大图:" :label-width="formLabelWidth">
              <uploadimg @emitSuccess="handImgSuccessEditPic" @emitError="handImgErrorAdd"
                         :imageSrc="editTable.productMainPicture"></uploadimg>
            </el-form-item>
            <el-form-item label="商品描述" :label-width="formLabelWidth">
              <el-col :span="20">
                <tinymce v-model="editTable.modelDesc" :url="Url" :with-credentials='false'
                         :editorHeight='200'></tinymce>
              </el-col>
              <template>
              </template>
            </el-form-item>
            <el-form-item class="is-required2" label="价格范围:" :label-width="formLabelWidth">
              <el-col :span="6">
                <el-input v-model="editTable.modelMinPrice" auto-complete="off" el
                          onkeyup="value=value.replace(/[^\d]/g,'')"></el-input>
              </el-col>
              <el-col :span="1">
                <div style="text-align:center">--</div>
              </el-col>
              <el-col :span="6">
                <el-input v-model="editTable.modelMaxPrice" auto-complete="off" el
                          onkeyup="value=value.replace(/[^\d]/g,'')"></el-input>
              </el-col>
              <el-col :span="1">
                <div style="text-align:center">元</div>
              </el-col>
              <el-col :span="6">
                <el-select v-model="editTable.modelUnix" clearable placeholder="请选择单位">
                  <el-option label="次" value="次"></el-option>
                  <el-option label="个" value="个"></el-option>
                  <el-option label="小时" value="小时"></el-option>
                  <el-option label="分钟" value="分钟"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item class="is-required2" label="原始价格:" :label-width="formLabelWidth">
              <el-col :span="6">
                <el-input-number v-model="editTable.originPrice" :min="0" :precision="0"></el-input-number>
              </el-col>
              <el-col :span="1">
                <div style="text-align:center">元</div>
              </el-col>
            </el-form-item>
            <el-form-item class="is-required2" label="模板类别:" :label-width="formLabelWidth">
              <template slot-scope="scope">
                <el-radio v-model="editTable.modelCategory" label="1" onclick="return false">平台</el-radio>
                <el-radio v-model="editTable.modelCategory" label="3" onclick="return false">个人</el-radio>
              </template>
            </el-form-item>
            <el-form-item v-if="editTable.modelCategory ==='3'" class="is-required2" label="分成比例:"
                          :label-width="formLabelWidth">
              <template slot-scope="scope">
                <el-col :span="3">
                  <el-input v-model="insval_ed1" onkeyup="value=value.replace(/[^\d]/g,'')" auto-complete="off"
                            el></el-input>
                </el-col>
                <el-col :span="1">
                  <div style="text-align:center">：</div>
                </el-col>
                <el-col :span="3">
                  <el-input v-model="insval_ed2" onkeyup="value=value.replace(/[^\d]/g,'')" auto-complete="off"
                            el></el-input>
                </el-col>
                <el-col :span="1">
                  <div style="text-align:center">：</div>
                </el-col>
                <el-col :span="3">
                  <el-input v-model="insval_ed3" onkeyup="value=value.replace(/[^\d]/g,'')" auto-complete="off"
                            el></el-input>
                </el-col>
              </template>
            </el-form-item>
          </el-form>
          <div class="btn-row">
            <el-button size="small" type="primary" @click="_doHandleEdit()">保存</el-button>
            <el-button size="small" type="primary" @click="_doCancel()">取消</el-button>
          </div>
        </el-dialog>
      </div>
      <!-- 新增弹窗 -->
      <div v-if="dialogAddVisible">
        <el-dialog title="新增" :visible.sync="dialogAddVisible" width=900px :before-close="handleCloseAdd">
          <el-form :model="addTable">
            <el-form-item class="is-required2" label="商品模板名称:" :label-width="formLabelWidth">
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-input v-model="addTable.modelName" prop auto-complete="off" el maxlength="10"></el-input>
                </el-col>
                <el-col :span="4">
                  <span>10字内</span>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item class="is-required2" label="列表小图:" :label-width="formLabelWidth">
              <uploadimg @emitSuccess="handImgSuccessAdd" @emitError="handImgErrorAdd"
                         :imageSrc="addTable.modelIcon"></uploadimg>
            </el-form-item>
            <el-form-item class="is-required2" label="详情大图:" :label-width="formLabelWidth">
              <uploadimg @emitSuccess="handImgSuccessAddPic" @emitError="handImgErrorAdd"
                         :imageSrc="addTable.productMainPicture"></uploadimg>
            </el-form-item>
            <el-form-item label="商品描述" :label-width="formLabelWidth">
              <el-col :span="20">
                <tinymce v-model="addTable.modelDesc" :url="Url" :with-credentials='false'
                         :editorHeight='200'></tinymce>
              </el-col>
              <template>
              </template>
            </el-form-item>
            <el-form-item class="is-required2" label="价格范围:" :label-width="formLabelWidth">
              <el-col :span="4">
                <el-input v-model="addTable.modelMinPrice" auto-complete="off" el
                          onkeyup="value=value.replace(/[^\d]/g,'')"></el-input>
              </el-col>
              <el-col :span="1">
                <div style="text-align:center">--</div>
              </el-col>
              <el-col :span="4">
                <el-input v-model="addTable.modelMaxPrice" auto-complete="off" el
                          onkeyup="value=value.replace(/[^\d]/g,'')"></el-input>
              </el-col>
              <el-col :span="1">
                <div style="text-align:center">元</div>
              </el-col>
              <el-col :span="4">
                <el-select v-model="addTable.modelUnix" clearable placeholder="请选择单位">
                  <el-option label="次" value="次"></el-option>
                  <el-option label="个" value="个"></el-option>
                  <el-option label="小时" value="小时"></el-option>
                  <el-option label="分钟" value="分钟"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item class="is-required2" label="原始价格:" :label-width="formLabelWidth">
              <el-col :span="6">
                <el-input-number v-model="addTable.originPrice" :min="0" :precision="0"></el-input-number>
              </el-col>
              <el-col :span="1">
                <div style="text-align:center">元</div>
              </el-col>
            </el-form-item>
            <el-form-item class="is-required2" label="模板类别:" :label-width="formLabelWidth">
              <template slot-scope="scope">
                <el-radio v-model="addTable.modelCategory" label="1">平台</el-radio>
                <el-radio v-model="addTable.modelCategory" label="3">个人</el-radio>
              </template>
            </el-form-item>
            <el-form-item v-if="addTable.modelCategory ==='3'" class="is-required2" label="分成比例:"
                          :label-width="formLabelWidth">
              <template slot-scope="scope">
                <el-col :span="3">
                  <el-input v-model="insval1" onkeyup="value=value.replace(/[^\d]/g,'')" auto-complete="off"
                            el></el-input>
                </el-col>
                <el-col :span="1">
                  <div style="text-align:center">：</div>
                </el-col>
                <el-col :span="3">
                  <el-input v-model="insval2" onkeyup="value=value.replace(/[^\d]/g,'')" auto-complete="off"
                            el></el-input>
                </el-col>
                <el-col :span="1">
                  <div style="text-align:center">：</div>
                </el-col>
                <el-col :span="3">
                  <el-input v-model="insval3" onkeyup="value=value.replace(/[^\d]/g,'')" auto-complete="off"
                            el></el-input>
                </el-col>
              </template>
            </el-form-item>
          </el-form>
          <div class="btn-row">
            <el-button size="small" type="primary" @click="_doAdd()">保存</el-button>
            <el-button size="small" type="primary" @click="_doAddCancel()">取消</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>

</template>


<script>
  import {b64hamcsha1, HexMD5, MD5} from '@/api/hash'
  import {
    ERR_OK, getClassList, PostModelStatus, GetModelInfo, UpdateProductModel, ProductDoctorList,
    GetModelInfo_phone, GetModelInfo_yyt, UpdateProductModel_phone, UpdateProductModel_yyt, GetProductCategerySelect
  } from '@/api/api.js'
  import uploadimg from '@/components/uploadImg/uploadImgAdd.vue'
  import tinymce from '@/components/tinymce.vue'
  import {getStore, EncodeUserId, IsAlert} from '@/config/mUtils.js'
  import headerTop from '@/components/headTop.vue'

  export default {
    components: {
      headerTop,
      uploadimg,
      tinymce
    },
    data() {
      return {
        insval1: '',
        insval2: '',
        insval3: '',
        insval_ed1: '',
        insval_ed2: '',
        insval_ed3: '',
        flag_Upload: true,//编辑时重新上传文件的判断
        tabIndex: '10',//当前状态index
        Url: 'http://v0.api.upyun.com/zhangshangtijian',//富文本上传地址
        AdminUserId: '',//userId
        searchParams: {
          name: '',
          type: '10'
        },
        tableData: [], //列表数据
        editTable: {}, //修改单个数据
        addTable: {
          insProportions: '',
          originPrice: null,
          modelDesc: "",//模板描述 ,
          modelIcon: "",//模板icon ,
          productMainPicture: "",//详情大图 ,
          modelMaxPrice: null,//最高价格 ,
          modelMinPrice: null,//最低价格 ,
          modelName: "",//模板名称 ,
          modelStatus: 2,//模板状态（1上架 2下架） ,
          modelType: "",//模板分类 ,
          modelUnix: "",//模板单位 ,
          modelCategory: '1'//模板类别（1平台 2机构 3个人） ,
        }, //新增单个数据
        dialogEditVisible: false, //修改
        dialogAddVisible: false, //新增
        formLabelWidth: '120px',
        rulesNew: {}
      }
    },
    methods: {
      //点击tab切换事件
      handleClick() {
        this.searchParams.type = this.tabIndex;
        this.getList();
      },
      //图片上传成功回调函数
      handImgSuccessAdd(res) {
        if (res.status === 200) {
          this.addTable.modelIcon =
            'http://zhangshangtijian.b0.upaiyun.com' + res.data.url
        } else {
          IsAlert(res.msg, '错误', 'error');
        }
      },
      handImgSuccessAddPic(res) {
        if (res.status === 200) {
          this.addTable.productMainPicture =
            'http://zhangshangtijian.b0.upaiyun.com' + res.data.url
        } else {
          IsAlert(res.msg, '错误', 'error');
        }
      },
      handImgSuccessEditElse(res) {
        if (res.status === 200) {
          this.editTable.modelIcon =
            'http://zhangshangtijian.b0.upaiyun.com' + res.data.url
        } else {
          IsAlert(res.msg, '错误', 'error');
        }
      },
      handImgSuccessEditPic(res) {
        if (res.status === 200) {
          this.editTable.productMainPicture =
            'http://zhangshangtijian.b0.upaiyun.com' + res.data.url
        } else {
          IsAlert(res.msg, '错误', 'error');
        }
      },
      //图片上传失败回调函数
      handImgErrorAdd() {
        IsAlert('上传失败！', '错误', 'error');
      },
      doSearch() {
        this.getList()
      },
      // 新增
      handleAdd() {
        this.dialogAddVisible = true
      },
      // 确定新增
      _doAdd() {
        if (this.addTable.modelCategory === '3') {
          this.addTable.insProportions = this.insval1 + ',' + this.insval2 + ',' + this.insval3;
          let [a, b, c] = [
            parseInt(this.insval1),
            parseInt(this.insval2),
            parseInt(this.insval3)
          ];
          let num = a + b + c;
          if (num !== 100) {
            IsAlert('分成比例总和需为100', '提示', 'warning');
            return
          }
        }
        ;
        let params = {
          insProportions: this.addTable.insProportions,
          modelDesc: this.addTable.modelDesc,//模板描述 ,
          modelIcon: this.addTable.modelIcon,//模板icon ,
          productMainPicture: this.addTable.productMainPicture,//模板icon ,
          modelMaxPrice: this.addTable.modelMaxPrice,//最高价格 ,
          modelMinPrice: this.addTable.modelMinPrice,//最低价格 ,
          originPrice: this.addTable.originPrice,//原始价格 ,
          modelName: this.addTable.modelName,//模板名称 ,
          modelStatus: 2,//模板状态（1上架 2下架） ,
          modelUnix: this.addTable.modelUnix,//模板单位 ,
          modelCategory: parseInt(this.addTable.modelCategory)//模板类别（1平台 2机构 3个人） ,
        }
        if (this.searchParams.type === '10') {
          if (this.addTable.modelMinPrice >= this.addTable.modelMaxPrice) {
            IsAlert('价格范围错误！', '提示', 'warning');
          } else {
            UpdateProductModel(params).then(response => {
              if (response.code === ERR_OK) {
                IsAlert(response.msg, '成功', 'success');
                this.handleCloseAdd()
              } else {
                IsAlert(response.msg, '错误', 'error');
              }
            }).catch(() => {
              this.$message.error('网络错误!请稍后重试')
            })
          }
        } else {
          if (this.addTable.modelMinPrice >= this.addTable.modelMaxPrice) {
            IsAlert('价格范围错误！', '提示', 'warning');
          } else {
            UpdateProductModel_phone(params).then(response => {
              if (response.code === ERR_OK) {
                IsAlert(response.msg, '成功', 'success');
                this.handleCloseAdd()
              } else {
                IsAlert(response.msg, '错误', 'error');
              }
            }).catch(() => {
              this.$message.error('网络错误!请稍后重试')
            })
          }
        }

      },
      //取消新增
      _doAddCancel() {
        this.handleCloseAdd()
        this.$message({
          type: 'warning',
          message: '取消新增'
        })
      },
      submitForm(formName) {
        //表单验证
        this.$refs[formName].validate(valid => {
          if (valid) {

          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      handleCloseAdd() {
        //新增弹窗重置数据 beforeclose
        this.addTable = {
          //重置新增数据为空
          insProportions: '',
          insProportions1: "",//分成比例(平台，机构，医生) ,
          insProportions2: "",
          insProportions3: "",
          modelDesc: "",//模板描述 ,
          modelIcon: "",//模板icon ,
          modeproductMainPicture: "",//详情大图 ,
          modelMaxPrice: null,//最高价格 ,
          originPrice: null,//原始价格 ,
          modelMinPrice: null,//最低价格 ,
          modelName: "",//模板名称 ,
          modelStatus: 2,//模板状态（1上架 2下架） ,
          modelType: "",//模板分类 ,
          modelUnix: "",//模板单位 ,
          modelCategory: '1'//模板类别（1平台 2机构 3个人） ,
        };
        this.getList();
        this.dialogAddVisible = false
      },
      GoodsMan(row) {//商品管理路由跳转
        let modelId = row.modelId;
        let modelType = row.modelType;
        this.$router.push({path: `/productTextphone/${modelId}/${modelType}`});
      },
      // 修改
      handleEdit(index, row) {
        if (this.searchParams.type === '10') {
          let params = {
            modelId: row.modelId,
          };
          GetModelInfo(params).then(response => {
            if (response.code === ERR_OK) {
              response.data.modelCategory = response.data.modelCategory.toString();
              this.editTable = response.data;
              if (this.editTable.insProportions !== null) {
                [this.insval_ed1, this.insval_ed2, this.insval_ed3] = this.editTable.insProportions.split(',');
              }
            } else {
              IsAlert(response.msg, '错误', 'error');
            }
          }).catch(() => {
            this.$message.error('网络错误!请稍后重试');
          })
          this.dialogEditVisible = true;
        } else if (this.searchParams.type === '20') {
          let params = {
            modelId: row.modelId,
          };
          GetModelInfo_phone(params).then(response => {
            if (response.code === ERR_OK) {
              response.data.modelCategory = response.data.modelCategory.toString();
              this.editTable = response.data;
              if (this.editTable.insProportions !== null) {
                [this.insval_ed1, this.insval_ed2, this.insval_ed3] = this.editTable.insProportions.split(',');
              }
            } else {
              IsAlert(response.msg, '错误', 'error');
            }
          }).catch(() => {
            this.$message.error('网络错误!请稍后重试');
          })
          this.dialogEditVisible = true;
        }

      },
      //图文确定修改
      _doHandleEdit() {
        if (this.editTable.modelCategory === '3') {
          this.editTable.insProportions = this.insval_ed1 + ',' + this.insval_ed2 + ',' + this.insval_ed3;
          let [a, b, c] = [
            parseInt(this.insval_ed1),
            parseInt(this.insval_ed2),
            parseInt(this.insval_ed3)
          ];
          let num = a + b + c;
          if (num !== 100) {
            IsAlert('分成比例总和需为100', '提示', 'warning');
            return
          }
        }
        ;
        let params = {
          insProportions: this.editTable.insProportions,
          modelDesc: this.editTable.modelDesc,
          modelIcon: this.editTable.modelIcon,
          productMainPicture: this.editTable.productMainPicture,
          modelId: this.editTable.modelId,
          modelMaxPrice: this.editTable.modelMaxPrice,
          modelMinPrice: this.editTable.modelMinPrice,
          originPrice: this.editTable.originPrice,
          modelName: this.editTable.modelName,
          modelPrice: '',
          modelUnix: this.editTable.modelUnix,
          modelCategory: parseInt(this.editTable.modelCategory)//模板类别（1平台 2机构 3个人） ,
        }
        if (this.searchParams.type === '10') {
          if (this.editTable.modelMinPrice >= this.editTable.modelMaxPrice) {
            IsAlert('价格范围错误！', '提示', 'warning');
          } else {
            UpdateProductModel(params).then(response => {
              if (response.code === ERR_OK) {
                IsAlert(response.msg, '成功', 'success');
                this.handleCloseEdit();
              } else {
                IsAlert(response.msg, '错误', 'error');
              }
            }).catch(() => {
              this.$message.error('网络错误!请稍后重试5');
            })
          }
        } else {
          if (this.editTable.modelMinPrice >= this.editTable.modelMaxPrice) {
            IsAlert('价格范围错误！', '提示', 'warning');
          } else {
            UpdateProductModel_phone(params).then(response => {
              if (response.code === ERR_OK) {
                IsAlert(response.msg, '成功', 'success');
                this.handleCloseEdit();
              } else {
                IsAlert(response.msg, '错误', 'error');
              }
            }).catch(() => {
              this.$message.error('网络错误!请稍后重试6');
            })
          }
        }

      },
      //图文取消修改
      _doCancel() {
        this.handleCloseEdit();
        this.$message({
          type: 'warning',
          message: '取消修改'
        })
      },

      handleCloseEdit() {
        this.dialogEditVisible = false;
        this.getList();
      },
      // 删除提示
      deleteMessage(index, row) {
        if (row.modelStatus === 1) {
          IsAlert('请先将模板下架！', '提示', 'warning');
        } else {
          this.$confirm('此操作将删除该模板, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          })
            .then(() => {
              let params = {
                modelId: row.modelId,
                modelStatus: 3,
                userId: this.AdminUserId
              }
              PostModelStatus(params).then(response => {
                if (response.code === ERR_OK) {
                  this.$notify({
                    title: '成功',
                    message: `删除成功!`,
                    type: 'success'
                  });
                  this.getList();
                } else {
                  IsAlert(response.msg, '错误', 'error');
                }
              }).catch(() => {
                this.$message.error('网络错误!请稍后重试');
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
      // 上架
      TrueStatus(index, row) {
        this.$confirm('此操作将上架模板, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
          .then(() => {
            let params = {
              modelId: row.modelId,
              modelStatus: 1,
              userId: this.AdminUserId
            }
            PostModelStatus(params).then(response => {
              if (response.code === ERR_OK) {
                this.$notify({
                  title: '成功',
                  message: `已上架！`,
                  type: 'success'
                });
                this.getList();
              } else {
                IsAlert(response.msg, '错误', 'error');
              }
            }).catch(() => {
              this.$message.error('网络错误!请稍后重试');
            })
          })
          .catch(() => {
            this.$message({
              type: 'warning ',
              message: '已取消更改服务状态'
            })
          })
      },
      // 下架
      FalseStatus(index, row) {
        this.$confirm('此操作将下架模板, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
          .then(() => {
            let params = {
              modelId: row.modelId,
              modelStatus: 2,
              userId: this.AdminUserId
            }
            PostModelStatus(params).then(response => {
              if (response.code === ERR_OK) {
                this.$notify({
                  title: '成功',
                  message: `已下架！`,
                  type: 'success'
                });
                this.getList();
              } else {
                IsAlert(response.msg, '错误', 'error');
              }
            }).catch(() => {
              this.$message.error('网络错误!请稍后重试');
            })
          })
          .catch(() => {
            this.$message({
              type: 'warning ',
              message: '已取消更改服务状态'
            })
          })
      },
      //获取列表
      getList() {
        let params = {
          "modelName": this.searchParams.name,
          "modelType": this.searchParams.type,
        }
        getClassList(params).then(response => {
          if ((response.code === ERR_OK)) {
            this.tableData = [];
            this.tableData = response.data;
          } else {
            IsAlert('获取商品模板列表失败', '错误', 'error');
          }
        }).catch(() => {
          ;
          this.$message.error('网络错误!请稍后重试')
        })
        let partthis = getStore('userMesage');
        this.AdminUserId = EncodeUserId(JSON.parse(partthis).userId);
      },
      //获取绑定医生列表
      getDocList() {
        let params = {};
        ProductDoctorList(params).then(response => {
          this.Doclist = [];
          this.Doclist = response.data;
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试');
        })
      },
    },
    activated: function () {
      this.tabIndex = '10';
      this.searchParams.type = '10';
      this.getList();
      this.getDocList();
    },
  }
</script>

<style lang="less" scoped>

  .el-checkbox {
    margin-left: 10px;
  }

  .el-select {
    display: block;
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
</style>

