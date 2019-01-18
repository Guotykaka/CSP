<template>
  <div id="individual">

    <el-tabs v-model="activeName" @tab-click="tabClick">
      <el-tab-pane label="个检管理" name="first">
        <div class="search-body">
          <el-form :inline="true" :model="searchParams" class="demo-form-inline">
            <el-form-item label="套餐名称">
              <el-input v-model="searchParams.productName" clearable placeholder="请输入套餐名称"></el-input>
            </el-form-item>
            <!--<el-form-item label="供应商名称">-->
              <!--<el-input v-model="searchParams.supplierName" clearable placeholder="请输入供应商名称"></el-input>-->
            <!--</el-form-item>-->
            <el-form-item label="商品状态">
              <el-select v-model="searchParams.productStatus" clearable>
                <el-option label="全部" value=""></el-option>
                <el-option label="上架" :value="1"></el-option>
                <el-option label="下架" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getShopList">查 询</el-button>
              <el-button type="primary" @click="clearParams">清 空</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="table-body">
          <el-table
            :data="tableData"
            stripe
            border
            style="width: 100%">
            <el-table-column
              type="index"
              align="center"
              width="60">
            </el-table-column>
            <el-table-column
              prop="productCode"
              label="商品编号">
            </el-table-column>
            <el-table-column
              prop="supplierName"
              label="供应商名称">
            </el-table-column>
            <el-table-column
              prop="productName"
              label="套餐名称">
            </el-table-column>
            <el-table-column
              label="商品状态"
              align="center"
              width="100">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.productStatus===1">上架</el-tag>
                <el-tag v-else type="warning">下架</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              width="120"
              label="价格">
              <template slot-scope="scope">
                <span>{{scope.row.productPrice+scope.row.productUnix}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="updateTime"
              label="创建时间">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              align="center"
              width="240">
              <template slot-scope="scope">
                <el-button v-if="scope.row.productStatus===2" @click="handleClick(scope.row)" size="small"
                           type="primary">上架
                </el-button>
                <el-button v-else size="small" @click="handleClick(scope.row)" type="warning">下架</el-button>
                <el-button size="small" @click="editClick(scope.row)" type="success">查看</el-button>
                <el-button size="small" @click="delClick(scope.row)" type="danger">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="table-page" v-if="tableData.length>0">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            background
            :current-page="searchParams.currentPage"
            :page-sizes="[10, 40, 80, 100]"
            :page-size="searchParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="加项管理" name="second">
        敬请期待...
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="查看体检套餐商品" :visible.sync="dialogEditVisible" width=800px>
      <el-form :model="editTable" :label-width="formLabelWidth">
        <el-form-item label="商品名称：">
          <el-col :span="16">
            <span>{{editTable.productName}}</span>
          </el-col>
        </el-form-item>
        <el-form-item label="供应商：">
          <el-col :span="16">
            <el-select v-model="editTable.supplierId" placeholder="请选择" disabled>
              <el-option v-for="item in SupplierList" :key="item.supplierId" :label="item.supplierName"
                         :value="item.supplierId">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="适用人群：">
          <el-col :span="16">
            <span v-if="editTable.forPeopleType===1">男</span>
            <span v-if="editTable.forPeopleType===2">女(未婚)</span>
            <span v-if="editTable.forPeopleType===3">女(已婚)</span>
            <span v-if="editTable.forPeopleType===4">男女通用</span>
          </el-col>
        </el-form-item>
         <el-form-item label="详情大图：">
           <img :src="editTable.productMainPicture" alt="" style="width:100px;height:100px;">
        </el-form-item>
        <el-form-item label="列表小图：">
          <img :src="editTable.productIcon" alt="" style="width:100px;height:100px;">
        </el-form-item>
        <el-form-item label="商品描述：">
          <el-col :span="23">
            <div class="desc-style" v-html="editTable.productDesc"></div>
          </el-col>
        </el-form-item>
        <el-form-item label="原价：">
          <el-col :span="7" class="m_b_15">
            {{editTable.originPrice}}元/个
          </el-col>
        </el-form-item>
        <el-form-item label="现价：">
          <el-col :span="7" class="m_b_15">
            <span>{{editTable.productPrice}}元/个</span>
          </el-col>
        </el-form-item>
        <el-form-item label="售卖数：">
          <el-col :span="16" class="m_b_15">
            {{editTable.initialQuantity}}
          </el-col>
        </el-form-item>
        <el-form-item label="绑定标签：">
          <el-col :span="16">
            <el-select filterable v-model="editTable.commTagDetailEntities" value-key="tagName" multiple
                       :remote-method="remoteMethod" remote :loading="loading"
                       placeholder="请输入标签名搜索并进行选择">
              <el-option :label="item.tagName" :value="item" v-for="(item,index) in RemoteOptions"
                         :key="item.tagName"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
      </el-form>
      <div class="btn-row">
        <el-button size="small" type="primary" @click="_doCancel()">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {updateProductStatus,GetSupplierSelect, listProductInfo, GetProductInfo, ERR_OK} from '@/api/api'
  import {getStore, EncodeDoctorId} from "@/config/mUtils.js"

  export default {
    name: "individual",
    data() {
      return {
        activeName: 'first',
        userInfo: {},
        userId: '',
        searchParams: {
          productName: '',//商品名称
          productStatus: '',//商品状态1:上架;2:下架 ;3:删除,
          pageSize: 10,
          currentPage: 1,
          modelId: '',// 模板id
          modelType: '60',// 模板分类
          supplierCode: ''//供应商Id
        },
        totalCount: 1,
        tableData: [],
        dialogEditVisible: false,
        editTable: {
          forPeopleType: 1,
          initialQuantity: 0,
          keyWord: "",
          commTagDetailEntities: [],
          modelType: "60",
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
        },
        SupplierList: [], //供应链商品数据
        formLabelWidth: '120px',
        loading: false,
        RemoteOptions: [],//搜索后下拉框选项
      }
    },
    activated() {
      this.userInfo = JSON.parse(getStore('userMesage'));
      this.userId = EncodeDoctorId(this.userInfo.userId);
      this.searchParams.supplierCode = this.userInfo.supplierCode;
      this.getShopList();
      this.getSupSelect();
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
      /*根据每页条数进行查询*/
      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this.getShopList()
      },
      /*根据当前页查询*/
      handleCurrentChange(val) {
        this.searchParams.currentPage = val;
        this.getShopList()
      },
      /*清除参数*/
      clearParams() {
        this.searchParams.productName = ''; // 商品名称
        this.searchParams.productStatus = ''; // 商品状态1:上架;2:下架 ,
        this.searchParams.pageSize = 10;
        this.searchParams.currentPage = 1;
        this.searchParams.modelId = ''; // 模板id
        this.searchParams.modelType = '60';// 模板分类
      },
      /*获取商品列表*/
      getShopList() {
        let params = {
          productName: this.searchParams.productName,//商品名称
          productStatus: this.searchParams.productStatus,//商品状态1:上架;2:下架 ,
          pageSize: this.searchParams.pageSize,
          currentPage: this.searchParams.currentPage,
          modelId: this.searchParams.modelId,// 模板id
          modelType: this.searchParams.modelType,// 模板分类
          supplierCode: this.searchParams.supplierCode//供应商名称
        };
        listProductInfo(params)
          .then((res) => {
            if (res.code === ERR_OK) {
              this.tableData = res.data.list;
              this.totalCount = res.data.totalCount
            }
          })
          .catch((err) => {
            this.$message({
              type: 'danger',
              message: '网络错误!商品列表获取失败,请稍后再试'
            });
          })
      },
      /*商品上下架处理*/
      handleClick(val) {
        console.log(val)
        let status, tipText, cancleText;
        if (val.productStatus === 1) {
          status = 2;
          tipText = '下架商品,是否继续';
          cancleText = '取消下架'
        } else if (val.productStatus === 2) {
          status = 1;
          tipText = '上架商品,是否继续';
          cancleText = '取消上架'
        }
        if(val.productStatus === 2&&val.productCategoryName===''){
          this.$message({
            type: 'warning',
            message: '请先到运营端绑定二级类目,再进行上架操作'
          });
          return;
        }
        let params = {
          productId: val.productId,
          productStatus: status,
          userId: this.userId
        }
        this.$confirm(tipText, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            updateProductStatus(params)
              .then((res) => {
                if (res.code === ERR_OK) {
                  this.getShopList();
                  this.$message({
                    type: 'success',
                    message: '操场成功!'
                  });
                } else {
                  this.$message({
                    type: 'danger',
                    message: '操作失败!'
                  });
                }
              })
              .catch(() => {
                this.$message({
                  type: 'danger',
                  message: '网络错误!商品状态更改失败,请稍后再试'
                });
              })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: cancleText
            });
          });
      },
      /*查看*/
      editClick(val) {
        let params = {
          productId: val.productId,
        };
        GetProductInfo(params).then((res) => {
          if (res.code === ERR_OK) {
            this.editTable.forPeopleType= res.data.appendInfoModel.forPeopleType;
            this.editTable.initialQuantity= res.data.initialQuantity;
            this.editTable.keyWord= res.data.keyWord;
            this.editTable.commTagDetailEntities= res.data.commTagDetailEntities ? res.data.commTagDetailEntities : [];//防止席涛涛个SB返给我null
            this.editTable.modelType= res.data.modelType;
            this.editTable.productDesc= res.data.productDesc;
            this.editTable.productIcon= res.data.productIcon;
            this.editTable.productId= res.data.productId;
            this.editTable.productMainPicture= res.data.productMainPicture;
            this.editTable.productName= res.data.productName;
            this.editTable.originPrice= res.data.originPrice;
            this.editTable.productPrice= res.data.productPrice;
            this.editTable.productUnix= res.data.productUnix;
            this.editTable.roleId= res.data.roleId;
            this.editTable.supplierId= res.data.supplierId;
            if (this.editTable.commTagDetailEntities.length) {//防止席涛涛个SB返给我null
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
            };
            this.dialogEditVisible = true;
          } else {
            IsAlert(res.msg, '错误', 'error');
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        });
      },
      _doCancel(){
        this.dialogEditVisible = false
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
      /*删除*/
      delClick(val) {
        let params = {
          productId: val.productId,
          productStatus: 3,
          userId: this.userId
        };
        if(val.productStatus===1){
          this.$message({
            type: 'warning',
            message: '该商品已上架,请下架商品再操作!'
          });
          return
        }
        this.$confirm('此操作将会删除商品,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {

            updateProductStatus(params)
              .then((res) => {
                if (res.code === ERR_OK) {
                  this.getShopList();
                  this.$message({
                    type: 'success',
                    message: '操作成功!'
                  });
                } else {
                  this.$message({
                    type: 'danger',
                    message: '操作失败!'
                  });
                }
              })
              .catch(() => {
                this.$message({
                  type: 'danger',
                  message: '网络错误!商品状态更改失败,请稍后再试'
                });
              })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '取消删除'
            });
          });
      },
      /*tab切换操作*/
      tabClick(tab) {
        if (tab.name === 'first') {
          console.log('first')
        } else if ('second') {
          console.log('second')
        }
      }
    },
  }
</script>

<style scoped lang="less">
  #individual {

    .table-page {
      text-align: center;
      margin-top: 20px;
    }
    .btn-row{
      text-align:center;
    }
  }
</style>
