<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <div class="search_params">
        <el-form :inline="true" size="small" class="demo-form-inline">
          <el-form-item :label="titleMsg">
            <el-input v-model="inputName" :placeholder="placeholderText" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="doSearch">搜索</el-button>
            <el-button type="primary" @click="addClass">{{addTip}}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="content_main">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="一级类目" name="first">
            <el-table
              :data="tableData1"
              border
              style="width: 100%"
             >
              <el-table-column show-overflow-tooltip align="center" prop="id" label="ID"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="categoryName" label="一级类目"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="sort" label="序号"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="bindProductCategoryNum" label="绑定二级类目数"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="bindNum" label="绑定商品数"></el-table-column>
              <el-table-column show-overflow-tooltip align="center"prop="updateTime" label="更新时间"></el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                align="center"
                width="200">
                <template slot-scope="scope">
                  <el-button @click="getEditTag(scope.row)" type="primary" size="small" :disabled="addStatus">编辑</el-button>
                  <el-button @click="delTag(scope.row)" type="danger" size="small">移除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="二级类目" name="second">
            <el-table
              :data="tableData2"
              border
              style="width: 100%">
              <!-- <el-table-column show-overflow-tooltip fixed type="index" width="80px" align="center"
                               label="序号"></el-table-column> -->
              <el-table-column show-overflow-tooltip align="center" prop="id" label="ID"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="categoryName" label="二级类目"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="sort" label="序号"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="parentCategoryName" label="所属一级类目"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="bindNum" label="二级类目绑定商品数"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="updateTime" label="更新时间"></el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                align="center"
                width="250">
                <template slot-scope="scope">
                  <el-button @click="getEditTag(scope.row)" type="primary" size="small" :disabled="addStatus">编辑</el-button>
                  <el-button @click="BindProduct(scope.row)" type="warning" size="small">绑定商品</el-button>
                  <el-button @click="delTag(scope.row)" type="danger" size="small">移除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
        <!--分页-->
        <el-pagination
          v-if="showPage"
          class="page_sel"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="1"
          :page-sizes="[10, 15]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tagTotal">
        </el-pagination>
      </div>
    </div>
    <!--一级分类-->
    <el-dialog :title="tagTitle" :visible.sync="once_dialog_type" width="500px" :before-close="cancleAdd">
      <el-form :model="once_params" :rules="rulesONCE" ref="formONCE">
        <el-form-item label="分类名" :label-width="formLabelWidth2" prop="categoryName">
          <el-col :span="19">
          <el-input v-model="once_params.categoryName" auto-complete="off" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth2" auto-complete="off" prop="categoryDesc">
          <el-col :span="19">
              <el-input type="textarea" id="PCkeywordHeight"  resize="none" v-model="once_params.categoryDesc" :autosize='{minRows:1}' clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="序号" :label-width="formLabelWidth2" auto-complete="off" class='is-required'>
          <el-col :span="19">
              <el-input-number v-model="once_params.sort" :min="1" :precision="0" :max="100" :controls='false' style="width:100%"></el-input-number>
          </el-col>
        </el-form-item>
      </el-form>
      <div class="btn-row">
          <el-button size="small" type="default" @click="cancleAdd">取消</el-button>
          <el-button size="small" type="primary" @click="submitForm('formONCE')" :disabled="addStatus">确定</el-button>
      </div>
    </el-dialog>
    <!--二级分类-->
    <el-dialog :title="alltagTitle" :visible.sync="second_dialog_type" width="500px" :before-close="cancleAdd">
      <el-form :model="second_params" :rules="rulesSEC" ref="formSEC">
        <el-form-item label="一级分类" :label-width="formLabelWidth2" prop="parentId">
          <el-col :span="19">
          <el-select filterable v-model="second_params.parentId" placeholder="请绑定一级类目" style="width:100%" clearable>
            <el-option :label="item.categoryName" :value="item.id" v-for="(item,index) in firstClass" :key="index"></el-option>
          </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="二级分类" :label-width="formLabelWidth2" prop="categoryName">
          <el-col :span="19">
          <el-input v-model="second_params.categoryName" auto-complete="off" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth2" prop="categoryDesc">
          <el-col :span="19">
          <el-input type="textarea" id="PCkeywordHeight2"  resize="none" v-model="second_params.categoryDesc" :autosize='{minRows:1}'></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="序号" :label-width="formLabelWidth2" auto-complete="off" class='is-required'>
          <el-col :span="19">
              <el-input-number v-model="second_params.sort" :min="1" :precision="0" :max="100" :controls='false' style="width:100%"></el-input-number>
          </el-col>
        </el-form-item>
        <el-form-item label="筛选条件" :label-width="formLabelWidth2" prop="categoryCondition">
          <el-col :span="19">
          <el-select filterable v-model="second_params.categoryCondition" filterable multiple placeholder="请绑定筛选条件" style="width:100%" clearable>
            <el-option v-for="(item,index) in select_condition" :label="item.description" :value="item.code" :key="index"></el-option>
          </el-select>
          </el-col>
        </el-form-item>
      </el-form>
      <div class="btn-row">
          <el-button size="small" type="default" @click="cancleAdd">取消</el-button>
          <el-button size="small" type="primary" @click="submitForm('formSEC')" :disabled="addStatus">确定</el-button>
      </div>
    </el-dialog>
    <!--绑定商品-->
    <el-dialog title="绑定商品" :visible.sync="batch_dialog_type" :before-close="closeBatch" :fullscreen="true">
      <div class="search_params">
        <el-form :inline="true" size="small" class="demo-form-inline">
          <el-form-item label="商品名称：">
            <el-input v-model="dialogParams.productName" placeholder="商品名称" @keyup.enter.native="doSearch_()" clearable></el-input>
          </el-form-item>
          <el-form-item label="商品大类：">
            <el-select v-model="dialogParams.modelType" clearable placeholder="请选择商品大类">
                <el-option :label="item.modetTypeName" :value="item.modetTypeId" v-for="(item,index) in ModelType" :key="index">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="doSearch_()">搜索</el-button>
            <el-button type="warning" @click="checkALL()">全选</el-button>
          </el-form-item>
          <el-form-item style="float:right;margin-right:50px">
            <el-button type="success" @click="BatchUpdate">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="content_main">
        <!-- <el-table :data="dialogData" border ref="tablePro" style="width: 100%" @row-click='clickRow' @select='selectCheckbox' @select-all='selectAll' @selection-change="SelectionChange"> -->
        <el-table :data="dialogData" border ref="tablePro" style="width: 100%" @row-click='clickRow'>
          <!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
          <el-table-column show-overflow-tooltip fixed type="index" width="80px" align="center" label="序号"></el-table-column>
          <el-table-column show-overflow-tooltip align="center" prop="whetherSelected" label="勾选" width="55">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.whetherSelected"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" prop="productName" label="商品名称"></el-table-column>
          <el-table-column show-overflow-tooltip align="center" prop="productId" label="id"></el-table-column>
        </el-table>
      </div>
      <div class="self-page-container">
          <el-pagination v-if="dialogShowPage" background @size-change="dialogSizeChange" @current-change="dialogCurrentChange"
                         :current-page="dialogParams.currentPage" :page-sizes="[10, 20]"
                         :page-size="dialogParams.pageSize" layout="total, sizes, prev, pager, next, jumper"
                         :total="dialogTotal">
          </el-pagination>
      </div>
      <!-- <div class="btn-row-dialog">
          <el-button size="small" type="default" @click="closeBatch">取消</el-button>
          <el-button size="small" type="primary" @click="closeBatch">确定</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
  import headerTop from '@/components/headTop.vue';
  import {IsAlert} from "@/config/mUtils.js";
  import {
    ERR_OK,
    GetProductCategeryList,
    GetProductCategerySelect,
    PostDeletePC,
    PostAddOrUpdatePC,
    PostBatchUpdatePC,
    GetProductList,
    PostBatchBindProduct,
    PostSelectCondition,
    PostListModelType
  } from '@/api/api.js';

  export default {
    name: "ProductCategory",
    components: {
      headerTop
    },
    data() {
      return {
        checked:false,//全选状态
        inputName: '',
        multipleSelection: [],//勾选列表
        select_condition: [],//类目app筛选条件
        ModelType: [],//商品大类下拉列表
        categoryID: '',//类目id，绑定商品时传参
        batch_dialog_type:false,
        dialogTotal: 0,
        dialogParams: {
          currentPage: 1,
          pageSize: 10,
          productName: '',
          modelType: '',
        },
        firstParams: {//一级类目参数
          categoryName: "",
          currentPage: 1,
          pageSize: 10,
          categoryLevel: 1,
        },
        secondParams: {//2级类目参数
          currentPage: 1,
          pageSize: 10,
          categoryName: "",
          categoryLevel: 2,
        },
        placeholderText:'请输入分类名',
        titleMsg:'分类名',
        tagTotal: null,
        addTip: '新建一级类目',
        tagTitle: '新建标签分类',
        alltagTitle: '新建二级标签',
        activeName: 'first',
        tableData1: [],
        tableData2: [],
        dialogData: [],
        once_dialog_type: false,
        second_dialog_type: false,
        addStatus: false,//防止双击
        formLabelWidth: '80px',
        formLabelWidth2: '110px',
        second_params: {
          sort: 1,
          categoryDesc: "",
          categoryLevel: 2,
          categoryName: "",
          id: "",
          parentId: "",
          categoryCondition: [],
        },
        once_params: {
          categoryDesc: "",
          sort: 1,
          categoryLevel: 1,
          categoryName: "",
          id: "",
          parentId: "0",
        },
        firstClass:[],
        rulesONCE: {
          categoryName: [
            {required: true, message: '请填写一级类目名称', trigger: 'blur'}
          ],
          categoryDesc: [
            {required: true, message: '请填写类目描述', trigger: 'blur'}
          ],
        },
        rulesSEC: {
          categoryName: [
            {required: true, message: '请填写二级类目名称', trigger: 'blur'}
          ],
          categoryDesc: [
            {required: true, message: '请填写类目描述', trigger: 'blur'}
          ],
          parentId: [
            {required: true, message: '请绑定一级分类', trigger: 'blur'}
          ],
          categoryCondition: [
            {required: true, message: '请绑定筛选条件', trigger: 'blur'}
          ],
        },
      }
    },
    methods: {
      submitForm(formName) { //新增模块表单验证
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.sureAdd();
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {//重置表单验证
        this.$refs[formName].resetFields();
      },
      
      getList() {/*获取类目列表*/
        let params = {};
        if (this.activeName === 'first') {
           params = this.firstParams;
        } else {
           params = this.secondParams;
        }
        GetProductCategeryList(params).then((res) => {
            if (res.code === ERR_OK) {
              this.tableData1 = res.data.list;
              this.tableData2 = res.data.list;
              this.tagTotal = res.data.totalCount;
            }else{
              IsAlert(`接口错误，code:${res.code}，msg:${res.msg}`,'错误','error');
            }
          }).catch(()=>{
            this.$message.error('网络错误!请稍后重试')
          })
      },
      doSearch() {//搜索
        if (this.activeName === 'first') {
          this.firstParams.currentPage = 1;
          this.firstParams.categoryName = this.inputName;
          this.getList();
        } else if (this.activeName === 'second') {
          this.secondParams.currentPage = 1;
          this.secondParams.categoryName = this.inputName;
          this.getList();
        }
      },
      getFirstClass(){//获取一级类目select
        let params = {
          categoryLevel: 1,
        };
        GetProductCategerySelect(params).then((res)=>{
          if(res.code===ERR_OK){
            this.firstClass = res.data;
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试')
        })
      },
      
      addClass() {/*新建分类*/
        
        if (this.activeName === 'first') {
          /*1级分类*/
          this.once_dialog_type = true;
          this.tagTitle = '新建一级分类'
          this.once_params = {
            sort: 1,
            categoryDesc: "",
            categoryLevel: 1,
            categoryName: "",
            id: "",
            parentId: "0",
          }
        } else if (this.activeName === 'second') {
          /*2级分类*/
          this.alltagTitle = '新建二级分类'
          this.second_dialog_type = true;
          this.second_params = {
            sort: 1,
            categoryDesc: "",
            categoryLevel: 2,
            categoryCondition: [],
            categoryName: "",
            id: "",
            parentId: "",
          }
        }
      },
      
      handleClick() {/*tab标签切换*/
        if (this.activeName === 'first') {
          this.addTip = '新建一级类目';
          this.inputName = '';
          this.placeholderText='请输入一级类目名称'
          this.titleMsg='一级类目';
          this.getList();
        } else if (this.activeName === 'second') {
          this.addTip = '新建二级类目';
          this.placeholderText='请输入二级类目名称'
          this.titleMsg='二级类目';
          this.inputName = '';
          this.getList();
        }
      },
      
      getEditTag(row) {/*编辑标签*/
        if (this.activeName === 'first') {
          /*标签分类*/
          this.once_dialog_type = true;
          this.tagTitle = '编辑一级分类';
          this.once_params.categoryName = row.categoryName;
          this.once_params.categoryDesc = row.categoryDesc;
          this.once_params.parentId = row.parentId;
          this.once_params.categoryLevel = 1;
          this.once_params.id = row.id
         
        } else if (this.activeName === 'second') {
          this.alltagTitle = '编辑二级分类';
          this.second_params.categoryLevel = 2;
          this.second_params.categoryName = row.categoryName;
          this.second_params.categoryDesc = row.categoryDesc;
          // this.second_params.categoryCondition = ['1','2'];
          if (row.categoryConditions) {
            this.second_params.categoryCondition = []
            row.categoryConditions.forEach(row => {
            this.second_params.categoryCondition.push(String(row));
          });
          } else {
            this.second_params.categoryCondition = []
          }
          this.second_params.id = row.id;
          this.second_params.parentId = row.parentId;
          this.second_dialog_type = true;
          // this.getFirstClass();
        }
      },
      
      delTag(row) {/*移除*/
        let params = {
            id: '',
            categoryLevel: null,
          };
        if (this.activeName === 'first') {
          params = {
            id: row.id,
            categoryLevel: 1,
          };
        } else {
          params = {
            id: row.id,
            categoryLevel: 2,
          };
        };
            this.$confirm('此操作将删除该分类, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            })
              .then(_ => {
                PostDeletePC(params).then((res) => {
                  if (res.code === ERR_OK) {
                    this.$notify({
                      type:'success',
                      title: '删除成功！',
                      duration:3000,
                    });
                    this.getList();
                  } else {
                    IsAlert(res.msg,'错误','error');
                  }
                }).catch(()=>{
                  this.$message.error('网络错误!请稍后重试');
                })
              })
              .catch(() => {})
      },
      
      sureAdd() {/*确定新增/编辑*/
        this.addStatus = true;
        let params = {};
        if (this.activeName === 'first') {
           params = {
            id: this.once_params.id,
            categoryName: this.once_params.categoryName,
            categoryDesc: this.once_params.categoryDesc,
            sort: this.once_params.sort,
            categoryLevel: 1,
            parentId: this.once_params.parentId,
          };
        } else if (this.activeName === 'second') {
           params = {
            id: this.second_params.id,
            sort: this.second_params.sort,
            categoryDesc: this.second_params.categoryDesc,
            tagId: this.second_params.tagId,
            parentId: this.second_params.parentId,
            categoryName: this.second_params.categoryName,
            categoryCondition: this.second_params.categoryCondition+'',
            categoryLevel: 2,
          };
        }
          PostAddOrUpdatePC(params).then((res) => {
                if (res.code === ERR_OK) {
                  this.$notify({
                    type:'success',
                    title: '操作成功！',
                    duration:3000,
                  });
                  this.getList();
                  this.cancleAdd();
                  this.addStatus = false;
                } else {
                  IsAlert(res.msg,'错误','error');
                  this.addStatus = false;
                }
              }).catch(()=>{
                this.$message.error('网络错误!请稍后重试');
                this.addStatus = false;
              })
      },
      
      cancleAdd() {/*新增取消*/
        if (this.activeName === 'first') {
          this.once_params= {
            sort: 1,
            categoryDesc: "",
            categoryLevel: 1,
            categoryName: "",
            id: "",
            parentId: "",
            parentId: "0",
          };
        this.once_dialog_type = false;
        this.resetForm('formONCE');
        } else {
          this.second_params= {
            sort: 1,
            categoryDesc: "",
            categoryLevel: 2,
            categoryName: "",
            categoryCondition: [],
            id: "",
          };
          this.second_dialog_type = false;
          this.resetForm('formSEC');
        }
      },
      handleSizeChange(val) {
        if (this.activeName === 'first') {
          this.firstParams.pageSize = val;
          this.getList();
        } else if (this.activeName === 'second') {
          this.secondParams.pageSize = val;
          this.getList();
        }
      },
      handleCurrentChange(val) {
        if (this.activeName === 'first') {
          this.firstParams.currentPage = val;
          this.getList();
        } else if (this.activeName === 'second') {
          this.secondParams.currentPage = val;
          this.getList();
        }
      },
      /*绑定商品————————————————————————————————————————————————————————————————————————————*/
      doSearch_() {
        this.dialogParams.currentPage = 1;
        this.getProductList();
      },
      BindProduct(row){//绑定商品按钮
        let params = {
          categoryId:row.id,
          currentPage: this.dialogParams.currentPage,
          pageSize: this.dialogParams.pageSize,
        };
        GetProductList(params).then((res) => {
            if (res.code === ERR_OK) {
              this.dialogData = [];
              this.dialogData = res.data.list;
              this.dialogTotal = res.data.totalCount;
              this.batch_dialog_type = true;
              this.categoryID = row.id;
              // this.$nextTick(function(){//每次更新了数据，触发这个函数，即可渲染默认选中。
              //   this.checked();
              // });
            }else{
              IsAlert(`接口错误，code:${res.code}，msg:${res.msg}`,'错误','error');
            }
          }).catch(()=>{
            this.$message.error('网络错误!请稍后重试')
          })
      },
      getProductList() {/*分页获取商品列表*/
        let params = {
          categoryId:this.categoryID,
          currentPage: this.dialogParams.currentPage,
          pageSize: this.dialogParams.pageSize,
          productName: this.dialogParams.productName,
          modelType: this.dialogParams.modelType,
        };
        GetProductList(params).then((res) => {
            if (res.code === ERR_OK) {
              this.dialogData = [];
              this.dialogData = res.data.list;
              this.dialogTotal = res.data.totalCount;
              // this.$nextTick(function(){//每次更新了数据，触发这个函数，即可渲染默认选中。
              //   this.checked();
              // });
            }else{
              IsAlert(`接口错误，code:${res.code}，msg:${res.msg}`,'错误','error');
            }
          }).catch(()=>{
            this.$message.error('网络错误!请稍后重试')
          })
      },
      closeBatch(){
        this.dialogParams.currentPage = 1;
        this.batch_dialog_type = false;
        this.categoryID = '';
      },
      
      BatchUpdate(){//批量推荐
        let params = {
            categoryId: this.categoryID,
            productInfoSelectedDTOS: this.dialogData,
        };
        PostBatchBindProduct(params).then((res) => {
          if (res.code === ERR_OK) {
            this.$notify({
              type:'success',
              title: '绑定商品成功！',
              duration:3000,
            });
            this.getProductList();
          } else {
            IsAlert(res.msg,'错误','error');
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试');
        })
      },
      clickRow(row){//单击行
        row.whetherSelected = !row.whetherSelected;
      },
      checkALL(){//全选按钮
        if (this.checked) {//如果已全选
          this.dialogData.forEach(row => {
            row.whetherSelected = false;
          });
        } else {
          this.dialogData.forEach(row => {
            row.whetherSelected = true;
          });
        }
      },
      getModelType(){//商品大类下拉列表
        let params = {
        };
        PostListModelType(params).then((res)=>{
          if(res.code===ERR_OK){
            this.ModelType = res.data;
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试')
        })
      },
      getSelectConditin(){//类目app筛选条件
        let params = {
        };
        PostSelectCondition(params).then((res)=>{
          if(res.code===ERR_OK){
            res.data.forEach(row => {
            row.code = String(row.code);
          });
            this.select_condition = res.data;
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试')
        })
      },
      // selectCheckbox(val){//勾选单个
      //   this.dialogData.forEach(row => {
      //       row.whetherSelected = false;
      //     });
      //   if (val.length===0) {
      //     return
      //   } else {
      //     val.forEach(row => {
      //     row.whetherSelected = true;
      //   });
      //   }
      // },
      // selectAll(val){//勾选全部
      //   this.dialogData.forEach(row => {
      //       row.whetherSelected = false;
      //     });
      //   if (val.length===0) {
      //     return
      //   } else {
      //     val.forEach(row => {
      //     row.whetherSelected = true;
      //   });
      //   }
      // },
      // SelectionChange(val) {//勾选事件,此事件会在dom加载时进行，不适用更改whetherSelected参数状态的方法，
      //   console.log('')
      // },
      // checked(){//渲染默认选中
      //   this.dialogData.forEach(row => {
      //     if (row.whetherSelected === true) {
      //       this.$refs.tablePro.toggleRowSelection(row,true);
      //     }
      //   });
      // },
      dialogSizeChange(val) {
          this.dialogParams.pageSize = val;
          this.getProductList();
      },
      dialogCurrentChange(val) {
          this.dialogParams.currentPage = val;
          this.getProductList();
      },
    },
    activated() {
      this.batch_dialog_type = false;
      this.getList();
      this.getFirstClass();
      this.getModelType();
      this.getSelectConditin();
    },
    computed: {
      showPage() {
        if (this.activeName === 'first') {
          return this.tableData1.length > 0
        } else if (this.activeName === 'second') {
          return this.tableData2.length > 0
        }
      },
      dialogShowPage() {
          return this.dialogData.length > 0
        }
    },
    watch: {//深度 watcher
      'dialogData': {
        handler: function (val, oldVal) { 
          val.forEach(row => {
            if(row.whetherSelected === false){
              this.checked = false;
              return
            }else{
              this.checked = true;
            }
          });
        },
        deep: true
      }
    },
  }
</script>

<style lang="less">
#PCkeywordHeight {
    min-height: 40px !important;
    line-height: 2 !important;
  }
#PCkeywordHeight2 {
    min-height: 40px !important;
    line-height: 2 !important;
  }
</style>
<style scoped lang="less">
.btn-row {
    text-align: center;
    padding-top: 20px;
  }
.btn-row-dialog {
    text-align: center;
    padding-top: 20px;
    position:absolute;bottom:40px;left: 50%; margin-left:-60px;
  }

  .TagOrg{
    width:100%;
    height:100%;
  }
  .content_main {
    .page_sel {
      margin-top: 20px;
      text-align: center;
    }
  }
</style>
