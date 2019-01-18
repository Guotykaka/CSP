<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <div class="search_params">
        <el-form :inline="true" size="small" class="demo-form-inline">
          <!-- <el-form-item :label="titleMsg">
            <el-input v-model="inputName" :placeholder="placeholderText" clearable></el-input>
          </el-form-item> -->
          <el-form-item>
            <!-- <el-button type="primary" @click="doSearch">搜索</el-button> -->
            <el-button type="primary" @click="addEvent">{{addTip}}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="content_main">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="推荐位管理" name="first">
            <el-table
              :data="tableData1"
              border
              style="width: 100%"
              class="SRMargin"
             >
              <el-table-column show-overflow-tooltip fixed type="index" width="60px" align="center" label="序号"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="name" label="名称"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="order" label="推荐顺序"></el-table-column>
              <el-table-column align="center" prop="url" label="封面" min-width="150px">
              <template slot-scope="scope">
                    <img :src="scope.row.url" alt="无图像" height="100" width="100">
              </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="type" label="跳转类型">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium" type="success" v-if="scope.row.type === 1">链接</el-tag>
                    <el-tag size="medium" type="info" v-if="scope.row.type === 2">供应链商品</el-tag>
                    <el-tag size="medium" type="danger" v-if="scope.row.type === 3">服务商品</el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center"prop="updateTime" label="更新时间"></el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                align="center"
                width="250">
                <template slot-scope="scope">
                  <el-button size="mini" type="success" v-if="scope.row.online === 0"
                             @click="SetStatus('确定上线?','上线成功！','1', scope.row)">上线
                  </el-button>
                  <el-button size="mini" type="warning" v-if="scope.row.online === 1"
                             @click="SetStatus('确定下线?','下线成功！','0', scope.row)">下线
                  </el-button>
                  <el-button @click="getEditTag(scope.row)" type="primary" size="small">编辑</el-button>
                  <el-button @click="SetStatus('确定删除?','删除成功！','2', scope.row)" type="danger" size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="限时活动管理" name="second">
            <el-table
              :data="tableData2"
              border
              ref="tableSEC"
              style="width: 100%">
              <el-table-column show-overflow-tooltip fixed type="index" width="50px" align="center" label="序号"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="name" label="名称"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="couponList" label="绑定优惠券">
                <template slot-scope="scope">
                    {{scope.row.couponList+""}}
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="startTime" label="开始时间"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="endTime" label="结束时间"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="updateTime" label="更新时间"></el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                align="center"
                width="200">
                <template slot-scope="scope">
                  <el-button @click="getEditTag(scope.row)" type="primary" size="small">编辑</el-button>
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
          :page-sizes="[10, 20, 30, 40]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tagTotal">
        </el-pagination>
      </div>
    </div>
    <!--推荐位管理-->
    <el-dialog :title="tagTitle" :visible.sync="banner_dialog_type" width="500px" :before-close="cancleAdd">
      <el-form :model="banner_params" :rules="rulesONCE" ref="formONCE">
        <el-form-item label="名称：" :label-width="formLabelWidth2" prop="name">
          <el-col :span="19">
            <el-input v-model="banner_params.name" auto-complete="off" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="排序：" :label-width="formLabelWidth2" class="is-required">
          <el-col :span="19">
            <el-input-number v-model="banner_params.order" :min="1" :precision="0"></el-input-number>
          </el-col>
        </el-form-item>
        <el-form-item label="封面：" :label-width="formLabelWidth2" prop="url">
            <uploadimg @emitSuccess="handImgSuccess" @emitError="handImgError" :imageSrc="banner_params.url"></uploadimg>
        </el-form-item>
        <el-form-item label="跳转类型：" :label-width="formLabelWidth2" auto-complete="off" prop="type">
          <el-col :span="19">
            <el-select v-model="banner_params.type" placeholder="请选择跳转类型" style="width:100%">
              <el-option label="链接" :value="1"></el-option>
              <el-option label="供应链商品" :value="2"></el-option>
              <el-option label="服务商品" :value="3"></el-option>
            </el-select>

          </el-col>
        </el-form-item>
        <el-form-item label="跳转内容：" :label-width="formLabelWidth2" prop="content">
          <el-col :span="19">
            <!-- <el-input v-model="banner_params.content" auto-complete="off" clearable></el-input> -->
            <el-input type="textarea" id="SRkeywordHeight"  resize="none" v-model="banner_params.content" :autosize='{minRows:1}'
            placeholder="跳转类型为链接请填写链接地址；否则请填写商品ID" clearable></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div class="btn-row">
          <el-button size="small" type="default" @click="cancleAdd">取消</el-button>
          <el-button size="small" type="primary" @click="submitForm('formONCE')">确定</el-button>
      </div>
    </el-dialog>
    <!--限时活动管理-->
    <el-dialog :title="LimitTitle" :visible.sync="limit_dialog_type" width="600px" :before-close="cancleAdd">
      <el-form :model="limit_params" :rules="rulesSEC" ref="formSEC">

        <el-form-item label="活动名称：" :label-width="formLabelWidth2" prop="name">
          <el-col :span="20">
          <el-input v-model="limit_params.name" auto-complete="off" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="优惠券：" :label-width="formLabelWidth2" prop="couponId">
          <el-col :span="20">
          <el-select filterable v-model="limit_params.couponId" placeholder="请选择优惠券" multiple style="width:100%" clearable>
            <el-option :label="item.name" :value="item.id" v-for="(item,index) in firstClass" :key="index"></el-option>
          </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="商品ID：" :label-width="formLabelWidth2" prop="products">
          <el-col :span="20">
            <el-input type="textarea" id="SRkeywordHeight2" placeholder="多个产品以，逗号分隔 " resize="none" v-model="limit_params.products" :autosize='{minRows:1}'></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="描述：" :label-width="formLabelWidth2" prop="description">
          <el-col :span="20">
            <el-input type="textarea" id="SRkeywordHeight3"  resize="none" v-model="limit_params.description" :autosize='{minRows:1}'></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="时间范围：" :label-width="formLabelWidth2" prop="limitTime">
          <el-col :span="20">
            <el-date-picker
              style="width:100%"
              v-model="limit_params.limitTime"
              @change="LimitTime_"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-col>
        </el-form-item>
      </el-form>
      <div class="btn-row">
          <el-button size="small" type="default" @click="cancleAdd">取消</el-button>
          <el-button size="small" type="primary" @click="submitForm('formSEC')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import headerTop from '@/components/headTop.vue';
  import {IsAlert} from "@/config/mUtils.js";
  import uploadimg from '@/components/uploadImg/uploadImgAdd.vue'
  import {
    ERR_OK,
    GetShopRecommendBan,
    GetShopRecommendLim,
    GetProductCategerySelect,
    PostDeletePC,
    PostSaveShopRecommendBan,
    PostBatchUpdatePC,
    SetRecommendStatus,
    GetShopRecommendBanInfo,
    GetShopRecommendLimInfo,
    PostEditShopRecommendBan,
    PostSaveShopLimit,
    PostEditShopLimit,
    GetListLimitCoupon,
    DeleteRecommendLimit
  } from '@/api/api.js';

  export default {
    name: "ShopRecommend",
    components: {
      headerTop,
      uploadimg
    },
    data() {
      return {
        inputName: '',
        firstParams: {//Banner
          currentPage: 1,
          pageSize: 10,
        },
        secondParams: {//限时活动
          currentPage: 1,
          pageSize: 10,
        },
        placeholderText:'请输入分类名',
        titleMsg:'分类名',
        tagTotal: null,
        addTip: '新增推荐位',
        tagTitle: '新建标签分类',
        LimitTitle: '新增限时活动',
        activeName: 'first',
        tableData1: [],
        tableData2: [],
        banner_dialog_type: false,
        limit_dialog_type: false,
        addStatus: false,//防止双击
        formLabelWidth: '80px',
        formLabelWidth2: '110px',
        limit_params: {
          limitTime: [],//限时活动时间范围
          couponId: [],
          description: "",
          endTime: "",
          id: "",
          name: "",
          products: "",
          startTime: "",
        },
        banner_params: {
          content: "",
          id: "",
          name: "",
          order: 1,
          type: 1,
          url: ""
        },
        firstClass:[],
        rulesONCE: {
          name: [
            {required: true, message: '请填写推荐位名称', trigger: 'blur'}
          ],
          url: [
            {required: true, message: '请上传封面图片', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '请选择跳转类型', trigger: 'change'}
          ],
          content: [
            {required: true, message: '请填写跳转内容', trigger: 'blur'}
          ],
        },
        rulesSEC: {
          name: [
            {required: true, message: '请填写活动名称', trigger: 'blur'}
          ],
          products: [
            {required: true, message: '请填写商品ID', trigger: 'blur'}
          ],
          description: [
            {required: true, message: '请填写活动描述', trigger: 'blur'}
          ],
          couponId: [
            {required: true, message: '请选择优惠券', trigger: 'blur'}
          ],
          limitTime: [
            {required: true, message: '请选择时间范围', trigger: 'change'}
          ],
        },
        multipleSelection: []
      }
    },
    methods: {
      //时间控件change事件
      LimitTime_() {
        console.log(this.limit_params.limitTime)
        if (this.limit_params.limitTime) {
          this.limit_params.startTime = this.limit_params.limitTime[0];
          this.limit_params.endTime = this.limit_params.limitTime[1];
        }
      },
      handImgSuccess(res) {////新增封面上传图片成功的回调
        if (res.status === 200) {
          this.banner_params.url =
            'http://zhangshangtijian.b0.upaiyun.com' + res.data.url
        } else {
          IsAlert(res.msg,'错误','error');
        }
      },
      handImgError(res){//上传图片失败的回调
           this.$notify.error({
            title: '上传失败！',
            duration:1000,
          });
      },

      SetStatus(titile, msg , status, row) {// 设置状态 0=下线；1=上线；2=删除 ,
        this.$confirm(titile, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
          .then(() => {
            let params = {
              id: row.id,
              online: status,
            };
            SetRecommendStatus(params).then(response => {
              if (response.code === ERR_OK) {
                this.$notify({
                    title: '成功',
                    message: msg,
                    type: 'success'
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
              type: 'warning',
              message: '已取消'
            });
          });
      },

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

      getList() {/*获取列表*/
        let params = {};
        if (this.activeName === 'first') {
           params = this.firstParams;
           GetShopRecommendBan(params).then((res) => {
            if (res.code === ERR_OK) {
              this.tableData1 = res.data.list;
              this.tagTotal = res.data.totalCount;
            }else{
              IsAlert(`接口错误，code:${res.code}，msg:${res.msg}`,'错误','error');
            }
          }).catch(()=>{
            this.$message.error('网络错误!请稍后重试')
          })
        } else {
           params = this.secondParams;
           GetShopRecommendLim(params).then((res) => {
            if (res.code === ERR_OK) {
              this.tableData2 = res.data.list;
              this.tagTotal = res.data.totalCount;
            }else{
              IsAlert(`接口错误，code:${res.code}，msg:${res.msg}`,'错误','error');
            }
          }).catch(()=>{
            this.$message.error('网络错误!请稍后重试')
          })
        }

      },
      doSearch() {//搜索
        if (this.activeName === 'first') {
          this.firstParams.currentPage = 1;
          // this.firstParams.categoryName = this.inputName;
          this.getList();
        } else if (this.activeName === 'second') {
          this.secondParams.currentPage = 1;
          // this.secondParams.categoryName = this.inputName;
          this.getList();
        }
      },
      getFirstClass(){//获取可领的优惠券模板列表
        let params = {
        };
        GetListLimitCoupon(params).then((res)=>{
          if(res.code===ERR_OK){
            this.firstClass = res.data;
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试')
        })
      },

      addEvent() {/*新增事件*/

        this.addStatus = true;
        if (this.activeName === 'first') {
          this.banner_dialog_type = true;
          this.tagTitle = '新增推荐位'
          this.banner_params = {
            content: "",
            id: "",
            name: "",
            order: 1,
            type: 1,
            url: ""
          }
        } else if (this.activeName === 'second') {
          /*2级分类*/
          this.LimitTitle = '新增限时活动'
          this.limit_dialog_type = true;
          this.limit_params = {
            limitTime: [],//限时活动时间范围
            couponId: [],
            description: "",
            endTime: "",
            id: "",
            name: "",
            products: "",
            startTime: "",
          }
        }
      },

      handleClick() {/*tab标签切换*/
        if (this.activeName === 'first') {
          this.addTip = '新增推荐位';
          this.firstParams.currentPage = 1;
          // this.inputName = '';
          // this.placeholderText='请输入一级类目名称'
          // this.titleMsg='一级类目';
          this.getList();
        } else if (this.activeName === 'second') {
          this.addTip = '新增限时活动';
          this.secondParams.currentPage = 1;
          // this.placeholderText='请输入二级类目名称'
          // this.titleMsg='二级类目';
          // this.inputName = '';
          this.getList();
        }
      },

      getEditTag(row) {/*编辑弹窗*/
        let params = {
          id : row.id
        };
        if (this.activeName === 'first') {
            GetShopRecommendBanInfo(params).then((res) => {
              if (res.code === ERR_OK) {
                this.banner_params.name = res.data.name;
                this.banner_params.content = res.data.content;
                this.banner_params.order = res.data.order;
                this.banner_params.type = res.data.type;
                this.banner_params.url = res.data.url;
                this.banner_params.id = res.data.id;
                this.tagTitle = '编辑推荐位';
                this.banner_dialog_type = true;
              } else {
                IsAlert(res.msg,'错误','error');
              }
            }).catch(()=>{
              this.$message.error('网络错误!请稍后重试');
            })
        } else if (this.activeName === 'second') {
          GetShopRecommendLimInfo(params).then((res) => {
              if (res.code === ERR_OK) {
                this.limit_params.limitTime = [res.data.startTime,res.data.endTime];
                this.limit_params.couponId = res.data.couponId.split(',');
                this.limit_params.description = res.data.description;
                this.limit_params.endTime = res.data.endTime;
                this.limit_params.name = res.data.name;
                this.limit_params.products = res.data.products;
                this.limit_params.id = res.data.id;
                this.limit_params.startTime = res.data.startTime;
                this.LimitTitle = '编辑限时活动';
                this.limit_dialog_type = true;
              } else {
                IsAlert(res.msg,'错误','error');
              }
            }).catch(()=>{
              this.$message.error('网络错误!请稍后重试');
            })
        }
      },

      delTag(row) {/*移除限时活动*/
        let params = {
            id: row.id,
          };
        this.$confirm('此操作将删除该限时活动, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            })
              .then(_ => {
                DeleteRecommendLimit(params).then((res) => {
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
        if (this.activeName === 'first') {
          let params = {
            id: this.banner_params.id,
            order: this.banner_params.order,
            name: this.banner_params.name,
            content: this.banner_params.content,
            type: this.banner_params.type,
            url: this.banner_params.url,
          };
          if (this.banner_params.id === '') {//有ID为编辑没有为新增，二者接口不同
            PostSaveShopRecommendBan(params).then((res) => {
                if (res.code === ERR_OK) {
                  this.$notify({
                    type:'success',
                    title: '新增推荐位成功！',
                    duration:3000,
                  });
                  this.getList();
                  this.cancleAdd();
                } else {
                  IsAlert(res.msg,'错误','error');
                }
              }).catch(()=>{
                this.$message.error('网络错误!请稍后重试')
              })
          } else {
            PostEditShopRecommendBan(params).then((res) => {
                if (res.code === ERR_OK) {
                  this.$notify({
                    type:'success',
                    title: '修改推荐位成功！',
                    duration:3000,
                  });
                  this.getList();
                  this.cancleAdd();
                } else {
                  IsAlert(res.msg,'错误','error');
                }
              }).catch(()=>{
                this.$message.error('网络错误!请稍后重试')
              })
          }

        } else if (this.activeName === 'second') {
          let params = {
            couponId: this.limit_params.couponId + '',
            description: this.limit_params.description,
            endTime: this.limit_params.endTime,
            name: this.limit_params.name,
            products: this.limit_params.products,
            id: this.limit_params.id,
            startTime: this.limit_params.startTime,
          };
          if (this.limit_params.id === '') {
            PostSaveShopLimit(params).then((res) => {
                if (res.code === ERR_OK) {
                  this.$notify({
                    type:'success',
                    title: '新增限时活动成功！',
                    duration:3000,
                  });
                  this.getList();
                  this.cancleAdd();
                  this.addStatus = false;
                } else {
                  IsAlert(res.msg,'错误','error');
                }
              }).catch(()=>{
                this.$message.error('网络错误!请稍后重试')
              })

          } else {
            PostEditShopLimit(params).then((res) => {
                if (res.code === ERR_OK) {
                  this.$notify({
                    type:'success',
                    title: '修改限时活动成功！',
                    duration:3000,
                  });
                  this.getList();
                  this.cancleAdd();
                  this.addStatus = false;
                } else {
                  IsAlert(res.msg,'错误','error');
                }
              }).catch(()=>{
                this.$message.error('网络错误!请稍后重试')
              })
          }

        }
      },

      cancleAdd() {/*新增取消*/
        if (this.activeName === 'first') {
          this.banner_params= {
            content: "",
            id: "",
            name: "",
            order: 1,
            type: 1,
            url: ""
            };
          this.resetForm('formONCE');
        this.banner_dialog_type = false;
        } else {
          this.limit_params= {
            limitTime: [],//限时活动时间范围
            couponId: [],
            description: "",
            endTime: "",
            id: "",
            name: "",
            products: "",
            startTime: "",
          };
          this.resetForm('formSEC');
          this.limit_dialog_type = false;
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
    },
    activated() {
      this.getList();
      this.getFirstClass();
    },
    computed: {
      showPage() {
        if (this.activeName === 'first') {
          return this.tableData1.length > 0
        } else if (this.activeName === 'second') {
          return this.tableData2.length > 0
        }
      }
    }
  }
</script>

<style lang="less">
.SRMargin {
  .el-table__row {
    td{
       margin: 0;padding-top: 6px;padding-bottom: 0;
      .cell{
        padding: 0;
      }
    }

  }
}
#SRkeywordHeight {
    min-height: 40px !important;
    line-height: 2 !important;
  }
#SRkeywordHeight2 {
    min-height: 40px !important;
    line-height: 2 !important;
  }
#SRkeywordHeight3 {
    min-height: 40px !important;
    line-height: 2 !important;
  }

</style>
<style scoped lang="less">
.btn-row {
    text-align: center;
    padding-top: 20px;
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
