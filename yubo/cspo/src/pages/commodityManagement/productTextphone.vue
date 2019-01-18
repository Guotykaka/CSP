<template>
    <div class="page-wrapper">
        <header-top></header-top>
        <div class="page-container">
            <!-- 商品管理页面 -->
            <el-header height="30">
                <!-- 操作行-->
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-input v-model="searchParams.productName" placeholder="商品名称" clearable></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-button type="primary" @click="doSearch()">搜索</el-button>
                    </el-col>
                </el-row>
                <!--一元听新增按钮-->
                <el-row class="m_b_15" v-if="this.addTable.modelCategory === 1">
                    <el-button type="primary" @click="handleAdd()">新增</el-button>
                </el-row>
            </el-header>

            <el-main>
                <el-table :data="tableData" border style="width: 100%" id="app">
                    <el-table-column show-overflow-tooltip align="center" type="index"></el-table-column>
                    <el-table-column show-overflow-tooltip align="center" prop="productId" label="商品ID"></el-table-column>
                    <el-table-column show-overflow-tooltip align="center" prop="productName" label="商品名称"></el-table-column>
                    <el-table-column show-overflow-tooltip align="center" prop="productParentCategoryName" label="一级类目"></el-table-column>
                    <el-table-column show-overflow-tooltip align="center" prop="productCategoryName" label="二级类目"></el-table-column>
                    <el-table-column show-overflow-tooltip align="center" prop="doctorName" label="绑定医生"></el-table-column>
                    <el-table-column align="center" label="商品状态" width="100">
                        <template slot-scope="scope">
                            <div slot="reference" class="name-wrapper">
                                <el-tag size="medium" type="danger" v-if="scope.row.productStatus === 2">下架</el-tag>
                                <el-tag size="medium" type="success" v-if="scope.row.productStatus === 1">上架</el-tag>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip align="center" label="价格">
                        <template slot-scope="scope">
                            <p>￥{{ scope.row.productPrice }}</p>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip align="center" prop="updateTime" label="创建时间"></el-table-column>
                    <el-table-column align="center" label="操作" width="220">
                        <template slot-scope="scope">
                            <el-button size="mini" type="success" v-if="scope.row.productStatus === 2" @click="FalseStatus_YYT(scope.$index, scope.row)">上架</el-button>
                            <el-button size="mini" type="warning" v-if="scope.row.productStatus === 1" @click="TrueStatus_YYT(scope.$index, scope.row)">下架</el-button>
                            <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button size="mini" type="danger" @click="deleteMessage(scope.$index, scope.row)">删除</el-button>

                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
                  <div class="self-page-container">
                            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchParams.currentPage" :page-sizes="[10,20]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
                            </el-pagination>
                  </div>

            <!-- 新增弹窗 -->
            <div v-if="dialogAddVisible">
                <el-dialog title="新增" :visible.sync="dialogAddVisible" width=800px :before-close="handleCloseAdd">
                    <el-tabs v-model="tabAdd">
                      <el-tab-pane label="商品信息" name="first">
                          <el-form :model="editTable_YYT">
                            <el-form-item label="商品名称" :label-width="formLabelWidth">
                                <el-col :span="18">
                                    <el-input v-model="addTable.productName" prop auto-complete="off" el maxlength="10"></el-input>
                                </el-col>
                            </el-form-item>
                            <el-form-item label="列表小图:" :label-width="formLabelWidth">
                                <uploadimg @emitSuccess="handImgSuccessAdd" @emitError="handImgErrorAdd" :imageSrc="addTable.productIcon"></uploadimg>
                            </el-form-item>
                            <el-form-item label="详情大图:" :label-width="formLabelWidth">
                                <uploadimg @emitSuccess="handImgSuccessAddPic" @emitError="handImgErrorAdd" :imageSrc="addTable.productMainPicture"></uploadimg>
                            </el-form-item>
                            <el-form-item label="商品描述" :label-width="formLabelWidth">
                                <el-col :span="23">
                                    <tinymce v-model="addTable.productDesc" :url="Url" :with-credentials='false' :editorHeight='200'></tinymce>
                                </el-col>
                                <template>
                                </template>
                            </el-form-item>
                            <el-form-item label="价格:" :label-width="formLabelWidth">
                                <el-col :span="6">
                                    <!-- <el-input v-model="addTable.productPrice" clearable ref="obj" onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')"></el-input> -->
                                    <el-input-number v-model="addTable.productPrice" ref="obj" :min="0" :precision="2" :controls='false' style="width:100%"></el-input-number>
                                </el-col>
                                <el-col :span="3">
                                    <div style="margin-left:20px" v-model="addTable.productUnix">元/{{addTable.productUnix}}</div>
                                </el-col>
                                <el-col :span="8">
                                    <div>建议价格￥{{ addTable.productMinPrice }}-￥{{ addTable.productMaxPrice }}</div>
                                </el-col>
                            </el-form-item>
                          <el-form-item label="原始价格:" :label-width="formLabelWidth">
                            <el-col :span="6">
                              <el-input-number v-model="addTable.originPrice" :min="0" :precision="0" :controls='false' style="width:100%"></el-input-number>
                            </el-col>
                            <el-col :span="3">
                              <div style="margin-left:20px">元</div>
                            </el-col>
                          </el-form-item>
                          </el-form>
                          <div class="btn-row">
                              <el-button size="small" type="primary" @click="tabAdd='second'">下一步</el-button>
                              <el-button size="small" type="primary" @click="_doAddCancel()">取消</el-button>
                          </div>
                      </el-tab-pane>
                      <el-tab-pane label="绑定医生" name="second">
                          <el-form :model="editTable_YYT">
                            <el-form-item label="绑定医生" v-for="(item,index) in searchParams.list" :key="index" :label-width="formLabelWidth2">
                                <el-col :span="7">
                                    <el-select v-model="searchParams.list[index].name" value-key="insDoctorId" clearable filterable placeholder="请选择绑定医生">
                                        <el-option v-for="item in Doclist" :key="item.insDoctorId" :label="item.name" :value="item">
                                        </el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="5">
                                    <span>平台：机构：医生</span>
                                </el-col>
                                <el-col :span="3">
                                    <el-input v-model="searchParams.list[index].val1" onkeyup="value=value.replace(/[^\d]/g,'')" auto-complete="off" el></el-input>
                                </el-col>
                                <el-col :span="1">
                                    <div style="text-align:center">：</div>
                                </el-col>
                                <el-col :span="3">
                                    <el-input v-model="searchParams.list[index].val2" onkeyup="value=value.replace(/[^\d]/g,'')" auto-complete="off" el></el-input>
                                </el-col>
                                <el-col :span="1">
                                    <div style="text-align:center">：</div>
                                </el-col>
                                <el-col :span="3">
                                    <el-input v-model="searchParams.list[index].val3" onkeyup="value=value.replace(/[^\d]/g,'')" auto-complete="off" el></el-input>
                                </el-col>
                            </el-form-item>
                            <el-form-item v-if="this.addTable.modelCategory===1" label=" " :label-width="formLabelWidth">
                                <el-button type="primary" @click="doAddDoc()" class="m_l_15">添加</el-button>
                            </el-form-item>
                          </el-form>
                          <div class="btn-row">
                              <el-button size="small" type="primary" @click="_doHandleAdd()">保存</el-button>
                              <el-button size="small" type="primary" @click="_doAddCancel()">取消</el-button>
                          </div>
                      </el-tab-pane>
                    </el-tabs>


                </el-dialog>
            </div>
            <!-- 编辑弹窗 -->
            <div v-if="dialogEditVisible">
                <el-dialog title="编辑" :visible.sync="dialogEditVisible" width=800px :before-close="handleCloseEidt">
                    <el-tabs v-model="tabEdit">
                      <el-tab-pane label="商品信息" name="first">
                        <el-form :model="editTable">
                            <el-form-item label="商品名称" :label-width="formLabelWidth">
                                <el-col :span="18">
                                    <el-input v-model="editTable.productName" prop auto-complete="off" el readonly></el-input>
                                </el-col>
                            </el-form-item>
                            <el-form-item label="列表小图:" :label-width="formLabelWidth">
                                <uploadimg @emitSuccess="handImgSuccessEdit_DHBG" @emitError="handImgErrorAdd" :imageSrc="editTable.productIcon"></uploadimg>
                            </el-form-item>
                            <el-form-item label="详情大图:" :label-width="formLabelWidth">
                                <uploadimg @emitSuccess="handImgSuccessEdit_DHBGPic" @emitError="handImgErrorAdd" :imageSrc="editTable.productMainPicture"></uploadimg>
                            </el-form-item>
                            <el-form-item label="商品描述" :label-width="formLabelWidth">
                                <el-col :span="23">
                                    <tinymce v-model="editTable.productDesc" :url="Url" :with-credentials='false' :editorHeight='200'></tinymce>
                                </el-col>
                                <template>
                                </template>
                            </el-form-item>
                            <el-form-item label="价格:" :label-width="formLabelWidth">
                                <el-col :span="6">
                                    <el-input-number v-model="editTable.productPrice" ref="obj2" :min="0" :precision="2" :controls='false' style="width:100%"></el-input-number>
                                    <!-- <el-input v-model="editTable.productPrice"  ref="obj2" auto-complete="off" el onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')"></el-input> -->
                                </el-col>
                                <el-col :span="3">
                                    <div style="margin-left:20px" v-model="editTable.productUnix">元/{{addTable.productUnix}}</div>
                                </el-col>
                                <el-col :span="8">
                                    <div>建议价格￥{{ addTable.productMinPrice }}-￥{{ addTable.productMaxPrice }}</div>
                                </el-col>
                            </el-form-item>
                            <el-form-item label="原始价格:" :label-width="formLabelWidth">
                              <el-col :span="6">
                                <el-input-number v-model="editTable.originPrice" :min="0" :precision="0" :controls='false' style="width:100%"></el-input-number>
                              </el-col>
                              <el-col :span="3">
                                <div style="margin-left:20px">元</div>
                              </el-col>
                            </el-form-item>
                        </el-form>
                        <div class="btn-row">
                            <el-button size="small" type="primary" @click="tabEdit='second'">下一步</el-button>
                            <el-button size="small" type="primary" @click="_doEditCancel()">取消</el-button>
                        </div>
                      </el-tab-pane>
                      <el-tab-pane label="绑定医生" name="second">
                        <el-form :model="editTable">
                            <el-form-item label="绑定医生" v-for="(item,index) in searchParams.list" :key="index" :label-width="formLabelWidth2">
                                <el-col :span="7">
                                    <el-select v-model="searchParams.list[index].name" value-key="insDoctorId" clearable filterable placeholder="请选择绑定医生">
                                        <el-option v-for="item in Doclist" :key="item.insDoctorId" :label="item.name" :value="item">
                                        </el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="5">
                                    <span>平台 ：机构 ：医生</span>
                                </el-col>
                                <el-col :span="3">
                                    <el-input v-model="searchParams.list[index].val1" onkeyup="value=value.replace(/[^\d]/g,'')" auto-complete="off" el></el-input>
                                </el-col>
                                <el-col :span="1">
                                    <div style="text-align:center">：</div>
                                </el-col>
                                <el-col :span="3">
                                    <el-input v-model="searchParams.list[index].val2" onkeyup="value=value.replace(/[^\d]/g,'')" auto-complete="off" el></el-input>
                                </el-col>
                                <el-col :span="1">
                                    <div style="text-align:center">：</div>
                                </el-col>
                                <el-col :span="3">
                                    <el-input v-model="searchParams.list[index].val3" onkeyup="value=value.replace(/[^\d]/g,'')" auto-complete="off" el></el-input>
                                </el-col>
                            </el-form-item>
                            <el-form-item v-if="this.addTable.modelCategory===1" label=" " :label-width="formLabelWidth">
                                <el-button type="primary" @click="doAddDoc()" class="m_l_15">添加</el-button>
                            </el-form-item>
                        </el-form>
                        <div class="btn-row">
                            <el-button size="small" type="primary" @click="_doHandleEdit()">保存</el-button>
                            <el-button size="small" type="primary" @click="_doEditCancel()">取消</el-button>
                        </div>
                      </el-tab-pane>
                    </el-tabs>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
import {
  ERR_OK,
  ProductDoctorList,
  GetModelList,
  GetProductInfo,
  UpdateProductInfo,
  SaveProductInfo_yyt,
  PostProductStatus,
  SaveProductInfo_tw,
  SaveProductInfo_dh,
  GetModelInfo,
  GetModelInfo_phone,
  GetProductCategerySelect
} from '@/api/api.js'
import headerTop from '@/components/headTop.vue'
import uploadimg from '@/components/uploadImg/uploadImgAdd.vue'
import tinymce from '@/components/tinymce.vue'
import { getStore,EncodeUserId,IsAlert } from '@/config/mUtils.js'
export default {
  components: {
    headerTop,
    tinymce,
    uploadimg
  },
  data() {
    return {
      tabAdd:'first',
      tabEdit:'first',
      productId:'',//编辑时的商品id
      flag_Upload: true, //编辑时重新上传文件的判断
      Url: 'http://v0.api.upyun.com/zhangshangtijian',//富文本上传地址
      AdminUserId: '', //userId
      AudioDuration: null, //音频时长
      totalCount: 0,
      searchParams: {
        currentPage: 1,
        pageSize: 10,
        providerId: '',
        productName: '',
        list: [
          {
            name: { insDoctorId: '', name: '' ,val:''},
            val1: '',
            val2: '',
            val3: ''
          }
        ]
      },
      addTable: {
        // insProportions: "",
        // modelCategory: 0,
        // modelDesc: "",
        // modelIcon: "",
        // productMainPicture: "",
        // modelId: "",
        // modelMaxPrice: 0,
        // modelMinPrice: 0,
        // modelName: "",
        // modelPrice: 0,
        // modelUnix: "",
        // originPrice: 0,
        // roleId: "",
        // useOs: 0
        modelId: this.$route.params.id,
        modelType: this.$route.params.modelType,
        productDesc: '',
        productIcon: '',
        productMainPicture: '',
        productId: '',
        originPrice:0,
        modelCategory:0,
        productMaxPrice: 0,
        productMinPrice: 0,
        productName: '',
        productPrice: 0,
        productUnix: '',
        roleId: '',
        userCategory:'',
        userId: this.AdminUserId
      },
      ImgTextConsultProductInfos: [], //大字段参数
      Doclist: [],
      currentPage: 1, //分页初始页码
      pagesize: 10, //分页初始显示条数
      tableData: [], //列表数据
      editTable_YYT: {}, //新增单个数据
      editTable: { appendInfo: {} }, //编辑单个数据
      dialogEditVisible: false,
      dialogAddVisible: false, //新增
      formLabelWidth: '100px',
      formLabelWidth2: '70px',
      rulesNew: {
        productName: [
          { required: true, message: '请填写商品名称', trigger: 'blur' }
        ],
        productIcon: [
          { required: true, message: '请选择商品图片', trigger: 'blur' }
        ],
        abnormalKeyWord: [
          { required: true, message: '请填写异常指标关键词', trigger: 'blur' }
        ],
        paperWork: [
          { required: true, message: '请输入商品文案', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    
    doAddDoc() {
      if (this.searchParams.list.length !== this.Doclist.length &&
        this.searchParams.list[this.searchParams.list.length - 1].name.name !=='' &&
        this.searchParams.list[this.searchParams.list.length - 1].val1 !== '' &&
        this.searchParams.list[this.searchParams.list.length - 1].val2 !== '' &&
        this.searchParams.list[this.searchParams.list.length - 1].val3 !== '') {
        this.searchParams.list.push({
          name: { insDoctorId: '', name: '' ,val:''},
          val1: '',
          val2: '',
          val3: ''
        })
      } else {
        this.$message.error('请填写医生或分成比例');
      }
    },
    handImgSuccessEdit_DHBG(res) {
      if (res.status === 200) {
        this.editTable.productIcon =
          'http://zhangshangtijian.b0.upaiyun.com' + res.data.url
      } else {
        IsAlert(res.msg,'错误','error');
      }
    },
    handImgSuccessEdit_DHBGPic(res) {
      if (res.status === 200) {
        this.editTable.productMainPicture =
          'http://zhangshangtijian.b0.upaiyun.com' + res.data.url
      } else {
        IsAlert(res.msg,'错误','error');
      }
    },
    handImgSuccessAdd(res) {
      if (res.status === 200) {
        this.addTable.productIcon =
          'http://zhangshangtijian.b0.upaiyun.com' + res.data.url
      } else {
        IsAlert(res.msg,'错误','error');
      }
    },
    handImgSuccessAddPic(res) {
      if (res.status === 200) {
        this.addTable.productMainPicture =
          'http://zhangshangtijian.b0.upaiyun.com' + res.data.url
      } else {
        IsAlert(res.msg,'错误','error');
      }
    },
    handImgErrorAdd() {
      IsAlert('上传图片失败！','错误','error');
    },
    //搜索方法
    doSearch() {
      this.searchParams.currentPage = 1;
      this.getList();
    },
    handleSizeChange: function(size) {
      this.searchParams.pageSize = size;
      this.getList();
    },
    handleCurrentChange: function(currentPage) {
      this.searchParams.currentPage = currentPage;
      this.getList();
    },

   
    // 编辑
    handleEdit(index, row) {
        this.addTable.productDesc = '';
        this.addTable.productIcon = '';
        this.addTable.productMainPicture = '';
        this.addTable.productName = '';
        this.addTable.productPrice = '';
        let params = {
          productId: row.productId
        }
        GetProductInfo(params).then(response => {
          if (response.code === ERR_OK) {
            this.searchParams.list = [];
            this.editTable = response.data;
            this.productId = response.data.productId;
            if (this.$route.params.modelType === '10') {
              for (let item of response.data.appendInfoModel.imgTextConsultProductInfos) {
                let Arr = [];
                item.insProportions = item.insProportions.split(',');
                for (var i = 0; i < item.insProportions.length; i++) {
                  Arr.push(Number.parseInt(item.insProportions[i]));
                };
                this.searchParams.list.push({
                    name: { insDoctorId: item.providerId, name: item.providerName ,val:''},
                    val1: Arr[0],
                    val2: Arr[1],
                    val3: Arr[2]
                    })
              };
            } else {
              for (let item of response.data.appendInfoModel.productConsultProductInfos) {
                let Arr = [];
                item.insProportions = item.insProportions.split(',');
                for (var i = 0; i < item.insProportions.length; i++) {
                  Arr.push(Number.parseInt(item.insProportions[i]));
                };
                this.searchParams.list.push({
                    name: { insDoctorId: item.providerId, name: item.providerName ,val:''},
                    val1: Arr[0],
                    val2: Arr[1],
                    val3: Arr[2]
                    })
              };
            }
                // response.data.appendInfoModel.imgTextConsultProductInfos.forEach((item, curIdx) => {
                // });
          } else {
            IsAlert(response.msg,'错误','error');
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试')
        });
        this.dialogEditVisible = true ;
    },
     // 取消编辑
    _doEditCancel() {
      this.handleCloseEidt();
      this.getList();
      this.$message({
        type: 'warning',
        message: '取消编辑'
      });
    },
    handleCloseEidt() {
      //编辑弹窗重置数据
      this.editTable = {};
      this.productId = '';
      this.tabEdit = 'first';
      this.dialogEditVisible = false;
    },
    // 显示新增弹窗
    handleAdd() {
      this.searchParams.list =[{
            name: { insDoctorId: '', name: '' ,val:''},
            val1: '',
            val2: '',
            val3: ''
          }];
      this.productId = '';
      this.getModelInfo();
      this.dialogAddVisible = true;
    },
    submitForm(formName) {
      //新增模块表单验证
      this.$refs[formName].validate(valid => {
        if (valid) {

        } else {
          console.log('error submit!!');
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //新增
    _doHandleAdd() {
          let obj = this.$refs.obj;
          var value = parseInt(obj.value);
          if(this.addTable.productMinPrice!==null){
          var minPrice = parseInt(this.addTable.productMinPrice);
          var maxPrice = parseInt(this.addTable.productMaxPrice);
          if(value<minPrice||value>maxPrice){
            IsAlert('超出建议价格范围！','提示','warning');
          }else{
           if (this.$route.params.modelType === '10') {
              this._doHandleAdd_tw();
            } else {
              this._doHandleAdd_dh();
            }
          }
      }
    },
    //编辑
    _doHandleEdit() {
          let obj = this.$refs.obj2;
          var value = parseInt(obj.value);
          if(this.addTable.productMinPrice!==null){
          var minPrice = parseInt(this.addTable.productMinPrice);
          var maxPrice = parseInt(this.addTable.productMaxPrice);
          if(value<minPrice||value>maxPrice){
            IsAlert('超出建议价格范围！','提示','warning');
          }else{
           if (this.$route.params.modelType === '10') {
              this._doHandleAdd_tw();
            } else {
              this._doHandleAdd_dh();
            }
          }

      }
    },
    //确定新增/编辑图文商品
    _doHandleAdd_tw() {
      this.ImgTextConsultProductInfos = [];
      for (let item of this.searchParams.list) {
        if (item.name.name !==''&&item.name.name !==undefined) {
          item.name.val = item.val1 + ',' + item.val2 + ',' + item.val3;
          this.ImgTextConsultProductInfos.push({
          insProportions: item.name.val,
          providerId: item.name.insDoctorId,
          providerName: item.name.name,
          providerType: 1
            });
            let [a, b, c] = [
            parseInt(item.val1),
            parseInt(item.val2),
            parseInt(item.val3)
            ];
            let num = a + b + c;
            if(num !== 100){
            IsAlert('分成比例总和需为100','提示','warning');
            return
            }
        };
      };
      let params = {
        imgTextConsultProductInfoEntity: {
          ImgTextConsultProductInfos: this.ImgTextConsultProductInfos
        },
        modelId: this.$route.params.id,
        modelType: this.$route.params.modelType,
        productDesc: this.addTable.productDesc ? this.addTable.productDesc : this.editTable.productDesc,
        productIcon: this.addTable.productIcon ? this.addTable.productIcon : this.editTable.productIcon,
        productMainPicture: this.addTable.productMainPicture ? this.addTable.productMainPicture : this.editTable.productMainPicture,
        productMaxPrice: this.addTable.productMaxPrice,
        productMinPrice: this.addTable.productMinPrice,
        productName: this.addTable.productName ? this.addTable.productName : this.editTable.productName,
        productPrice: this.addTable.productPrice!=='' ? this.addTable.productPrice : this.editTable.productPrice,
        productUnix: this.addTable.productUnix,
        originPrice: this.addTable.originPrice ? this.addTable.originPrice : this.editTable.originPrice,
        roleId: this.addTable.roleId,
        userId: this.AdminUserId,
        productId: this.productId,
        modelCategory:this.addTable.modelCategory,
        userCategory:this.addTable.modelCategory,
      };
        SaveProductInfo_tw(params).then(response => {
          if (response.code === ERR_OK) {
            IsAlert(response.msg,'成功','success');
            this.getList();
            this.handleCloseAdd();
            this.handleCloseEidt();
          } else {
            IsAlert(response.msg,'错误','error')
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试')
        })
    },
     //确定新增/编辑电话商品
    _doHandleAdd_dh() {
      this.ImgTextConsultProductInfos = [];
      for (let item of this.searchParams.list) {
        if (item.name.name !==''&&item.name.name !==undefined) {
          item.name.val = item.val1 + ',' + item.val2 + ',' + item.val3
            this.ImgTextConsultProductInfos.push({
            insProportions: item.name.val,
            providerId: item.name.insDoctorId,
            providerName: item.name.name,
            providerType: 1
            });
        };
            let [a, b, c] = [
            parseInt(item.val1),
            parseInt(item.val2),
            parseInt(item.val3)
            ];
            let num = a + b + c;
            if (num !== 100) {
              IsAlert('分成比例总和需为100','提示','warning');
            return
            }
      };
      let params = {
        modelId: this.$route.params.id,
        modelType: this.$route.params.modelType,
        productConsultProductInfoEntity: {
          productConsultProductInfos: this.ImgTextConsultProductInfos
        },
        productDesc: this.addTable.productDesc ? this.addTable.productDesc : this.editTable.productDesc,
        productIcon: this.addTable.productIcon ? this.addTable.productIcon : this.editTable.productIcon,
        productMainPicture: this.addTable.productMainPicture ? this.addTable.productMainPicture : this.editTable.productMainPicture,
        productMaxPrice: this.addTable.productMaxPrice ? this.addTable.productMaxPrice : this.editTable.productMaxPrice,
        productMinPrice: this.addTable.productMinPrice ? this.addTable.productMinPrice : this.editTable.productMinPrice,
        productName: this.addTable.productName ? this.addTable.productName : this.editTable.productName,
        productPrice: this.addTable.productPrice!=='' ? this.addTable.productPrice : this.editTable.productPrice,
        productUnix: this.addTable.productUnix ? this.addTable.productUnix : this.editTable.productUnix,
        originPrice: this.addTable.originPrice ? this.addTable.originPrice : this.editTable.originPrice,
        roleId: this.addTable.roleId,
        userId: this.AdminUserId,
        productId: this.productId,
        modelCategory:this.addTable.modelCategory,
        userCategory:this.addTable.modelCategory,
      };

        SaveProductInfo_dh(params).then(response => {
          if (response.code === ERR_OK) {
            IsAlert(response.msg,'成功','success');
            this.getList();
            this.handleCloseAdd();
            this.handleCloseEidt();
          } else {
            IsAlert(response.msg,'错误','error');
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试')
        })
    },
    // 取消新增
    _doAddCancel() {
      this.handleCloseAdd();
      this.getList();
      this.$message({
        type: 'warning',
        message: '取消新增'
      });
    },
     // 删除提示
    deleteMessage(index, row) {
      if (row.productStatus === 1) {
        IsAlert('请先将商品下架！','提示','warning');
      } else {
        this.$confirm('此操作将删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
          .then(() => {
            let params = {
              productId: row.productId,
              productStatus: 3,
              userId: this.AdminUserId
            };
            PostProductStatus(params).then(response => {
              if (response.code === ERR_OK) {
                this.$message({
                  type: 'warning',
                  message: '删除成功!'
                });
                this.getList();
              } else {
                IsAlert(response.msg,'错误','error');
                this.getList();
              }
            }).catch(()=>{
              this.$message.error('网络错误!请稍后重试')
            })
          })
          .catch(() => {
            this.$message({
              type: 'warning',
              message: '已取消删除'
            });
          })
      }
    },

    // 下架
    TrueStatus_YYT(index, row) {
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
          }
          PostProductStatus(params).then(response => {
            if (response.code === ERR_OK) {
              this.$message({
                type: 'success',
                message: '下架成功!'
              });
              this.getList();
            } else {
              IsAlert(response.msg,'错误','error');
              this.getList();
            }
          }).catch(()=>{
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
    FalseStatus_YYT(index, row) {
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
          }
          PostProductStatus(params).then(response => {
            if (response.code === ERR_OK) {
              this.$message({
                type: 'success',
                message: '上架成功!'
              });
              this.getList();
            } else {
              IsAlert(response.msg,'错误','error');
              this.getList();
            }
          }).catch(()=>{
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
    handleCloseAdd() {
      this.searchParams.list = [
        {
          name: { insDoctorId: '', name: '' ,val:''},
          val1: '',
          val2: '',
          val3: ''
        }
      ];
      this.addTable.productDesc = "";
      this.addTable.productIcon = "";
      this.addTable.productMainPicture = '';
      this.addTable.productId = "";
      this.addTable.productName = "";
      this.addTable.productPrice = 0;
      this.addTable.originPrice = 0;
      this.tabAdd = 'first';
      this.dialogAddVisible = false;
    },
    //获取医生列表
    getDocList() {
      let params = {};
      ProductDoctorList(params).then(response => {
        this.Doclist = [];
        this.Doclist = response.data;
      }).catch(()=>{
        this.$message.error('网络错误!请稍后重试')
      })
    },
    //获取商品列表
    getList() {
      let params = {
        currentPage: this.searchParams.currentPage,
        pageSize: this.searchParams.pageSize,
        modelId: this.$route.params.id,
        productName: this.searchParams.productName,
        modelType: this.$route.params.modelType
      };
      GetModelList(params).then(response => {
        this.tableData = [];
        this.tableData = response.data.list;
        this.totalCount = response.data.totalCount;
      }).catch(()=>{
        this.$message.error('网络错误!请稍后重试')
      })
      let partthis = getStore('userMesage');
      this.AdminUserId = EncodeUserId(JSON.parse(partthis).userId);
    },
    //获取模板信息
    getModelInfo(){
      let params ={modelId: this.$route.params.id,};
      if (this.$route.params.modelType === '10') {
        GetModelInfo(params).then(response => {
            if (response.code === ERR_OK) {
                this.addTable= {
                    modelId: this.$route.params.id,
                    modelType: this.$route.params.modelType,
                    productDesc: response.data.modelDesc,
                    productIcon: response.data.modelIcon,
                    productMainPicture: response.data.productMainPicture,
                    productId: '',
                    productInfoBindUserEntitys: [
                      {
                        insProportions: '',
                        providerId: '',
                        providerName: '',
                        providerType: 0
                      }
                    ],
                    originPrice:response.data.originPrice,
                    modelCategory:response.data.modelCategory,
                    productMaxPrice: response.data.modelMaxPrice,
                    productMinPrice: response.data.modelMinPrice,
                    productName: response.data.modelName,
                    productPrice: 0,
                    productUnix: response.data.modelUnix,
                    roleId: response.data.roleId,
                    // useOs: this.$route.params.useOs,
                    userCategory:response.data.modelCategory,
                    userId: this.AdminUserId
                  };
            } else {
              IsAlert(response.msg,'错误','error');
            }
          }).catch(()=>{
          this.$message.error('网络错误!请稍后重试')
        })
      } else {
        GetModelInfo_phone(params).then(response => {
            if (response.code === ERR_OK) {
                this.addTable= {
                    modelId: this.$route.params.id,
                    modelType: this.$route.params.modelType,
                    productDesc: response.data.modelDesc,
                    productIcon: response.data.modelIcon,
                    productMainPicture: response.data.productMainPicture,
                    productId: '',
                    productInfoBindUserEntitys: [
                      {
                        insProportions: '',
                        providerId: '',
                        providerName: '',
                        providerType: 0
                      }
                    ],
                    originPrice:response.data.originPrice,
                    modelCategory:response.data.modelCategory,
                    productMaxPrice: response.data.modelMaxPrice,
                    productMinPrice: response.data.modelMinPrice,
                    productName: response.data.modelName,
                    productPrice: 0,
                    productUnix: response.data.modelUnix,
                    roleId: response.data.roleId,
                    userCategory:response.data.modelCategory,
                    userId: this.AdminUserId
                  };
            } else {
              IsAlert(response.msg,'错误','error');
            }
          }).catch(()=>{
          this.$message.error('网络错误!请稍后重试')
        })
      };

    }
  },
  //  watch:{
  //       editTable:{
  //           handler(val, oldVal){
  //               console.log("editTable: "+val.productPrice, oldVal.productPrice);
  //           },
  //           deep:true
  //       }
  //       },
  activated: function() {
    this.searchParams.currentPage = 1;
    this.getList();
    this.getDocList();
    this.getModelInfo();
  },

}
</script>

<style lang="less" scoped>
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
.m_l_0 {
  margin-left: 0;
}
.btn-row {
  text-align: center;
  padding-top: 20px;
}
.el-header,
.el-main,
.el-footer {
  padding: 0;
}
</style>
