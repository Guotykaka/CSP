<template>
  <div class="TagOrg">
    <header-top></header-top>
    <div class="page-container">
      <div class="search_params"  v-loading.fullscreen.lock="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-form :inline="true" size="small" class="demo-form-inline">
          <el-form-item :label="titleMsg">
            <el-input v-model="inputName" :placeholder="placeholderText" clearable></el-input>
          </el-form-item>
          <el-form-item label="名称" v-if="activeName==='second'">
            <el-input v-model="commTagParams.tag" placeholder="请输入名称" clearable></el-input>
          </el-form-item>
          <el-form-item  v-show="false">
            <input name="fileSelect" @change="update()" ref="inputer" type="file"/>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button type="primary" @click="addClass">{{addTip}}</el-button>
          </el-form-item>
          <el-form-item v-if="activeName==='second'" label="Excel导入标签：">
          <el-upload
              class="upload-demo"
              ref="upload"
              multiple="false"
              :action="API_EXCAL_IMPORT_TAG"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-change="handleChange"
              :before-upload="beforeAvatarUpload"
              :file-list="fileList"
              :auto-upload="false"
              :multiple="false"
              :onError="uploadError"
              :onSuccess="uploadSuccess">
              <el-button slot="trigger" size="small" type="warning">选取文件</el-button>
              <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">导入</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <div class="content_main">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="标签分类" name="first">
            <el-table
              :data="tableData1"
              border
              style="width: 100%">
              <el-table-column show-overflow-tooltip fixed type="index" align="center" width="80px"
                               label="序号"></el-table-column>
              <el-table-column align="center" show-overflow-tooltip prop="categoryName" label="分类名"></el-table-column>
              <el-table-column align="center" show-overflow-tooltip prop="tagcount" label="绑定标签数"></el-table-column>
              <el-table-column align="center" show-overflow-tooltip prop="articleCount" label="绑定文章数"></el-table-column>
              <el-table-column align="center" show-overflow-tooltip prop="videoCount" label="绑定视频数"></el-table-column>
              <el-table-column align="center" show-overflow-tooltip prop="lastUpdateTime" label="更新时间"></el-table-column>
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
          <el-tab-pane label="所有标签" name="second">
            <el-table
              :data="tableData2"
              border
              style="width: 100%">
              <el-table-column show-overflow-tooltip fixed type="index" width="80px" align="center"
                               label="序号"></el-table-column>
              <el-table-column align="center" show-overflow-tooltip prop="categoryList" label="一级标签">
                <template slot-scope="scope">
                  {{scope.row.categoryList+''}}
                </template>
              </el-table-column>
              <el-table-column align="center" show-overflow-tooltip prop="tagName" label="名称"></el-table-column>
              <el-table-column align="center" show-overflow-tooltip prop="articleNum" label="绑定文章数">
                <template slot-scope="scope">
                      {{scope.row.articleNum||0}}
                </template>
              </el-table-column>
              <el-table-column align="center" show-overflow-tooltip prop="videoNum" label="绑定视频数">
                <template slot-scope="scope">
                      {{scope.row.videoNum||0}}
                </template>
              </el-table-column>
              <el-table-column align="center" show-overflow-tooltip prop="keyword" label="关键字"></el-table-column>
              <el-table-column align="center" show-overflow-tooltip prop="lastUpdateTime" label="更新时间"></el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                align="center"
                width="200">
                <template slot-scope="scope">
                  <el-button @click="getEditTag(scope.row)" type="primary" size="small">编辑</el-button>
                  <!-- <el-button @click="delTag(scope.row)" type="danger" size="small">移除</el-button> -->
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
    <!--标签分类-->
    <el-dialog :title="tagTitle" :visible.sync="tag_type" width="400px">
      <el-form :model="tag_params">
        <el-form-item label="分类名" :label-width="formLabelWidth">
          <el-input v-model="tag_params.categoryName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input v-model="tag_params.description" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div class="btn-row">
          <el-button size="small" type="default" @click="cancleAdd">取消</el-button>
          <el-button size="small" type="primary" @click="sureAdd" :disabled="is_disabled">确定</el-button>
      </div>
    </el-dialog>
    <!--所有分类-->
    <el-dialog :title="alltagTitle" :visible.sync="all_tag_type" width="500px">
      <el-form :model="allTag_params">
        <el-form-item label="一级标签" :label-width="formLabelWidth2">
          <el-col :span="19">
          <el-select filterable v-model="allTag_params.categoryId" multiple placeholder="请选择一级分类" style="width:100%" @change="changeValue">
            <el-option :label="item.categoryName" :value="item.categoryId" v-for="(item,index) in firstClass" :key="index"></el-option>
          </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="标签名称" :label-width="formLabelWidth2">
          <el-col :span="19">
          <el-input v-model="allTag_params.tagName" auto-complete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth2">
          <el-col :span="19">
          <el-input type="textarea" id="TAGkeywordHeight"  resize="none" v-model="allTag_params.description" :autosize='{minRows:1}'></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="绑定关键字" :label-width="formLabelWidth2" auto-complete="off">
          <el-col :span="19">
              <el-input type="textarea" id="TAGkeywordHeight"  resize="none" v-model="allTag_params.keyword" :autosize='{minRows:1}'></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div class="btn-row">
          <el-button size="small" type="default" @click="cancleAdd">取消</el-button>
          <el-button size="small" type="primary" @click="sureAdd">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import headerTop from '@/components/headTop.vue';
  import {API_EXCAL_IMPORT_TAG} from '@/config/env.js';
  import {IsAlert} from '@/config/mUtils.js';
  import {
    ERR_OK,
    getCommTagCategoryName,
    queryCommTagCategoryList,
    saveCommTagCategory,
    updateCommTagCategory,
    updateTagCategoryStatus,
    postDeleteNewTags,
    getNewTagsList,
    postSaveNewTags,
    postModifyNewTags,
    postQueryNewTags,
    postImportTagByExcal
  } from '@/api/api.js';

  export default {
    name: "TagOrg",
    components: {
      headerTop
    },
    data() {
      return {
        is_disabled : false,//一次点击
        loading:false,
        API_EXCAL_IMPORT_TAG:API_EXCAL_IMPORT_TAG,
        fileList:[],
        inputName: '',
        tagParams: {
          categoryName: "",
          currentPage: 1,
          pageSize: 10
        },
        commTagParams: {
          tag:'',
          currentPage: 1,
          pageSize: 10,
          name: ""
        },
        placeholderText:'请输入分类名',
        titleMsg:'分类名',
        tagTotal: null,
        addTip: '新建分类',
        tagTitle: '新建标签分类',
        alltagTitle: '新建二级标签',
        activeName: 'first',
        tableData1: [],
        tableData2: [],
        tag_type: false,
        all_tag_type: false,
        all_tag_type2: false,
        addStatus: false,
        formLabelWidth: '80px',
        formLabelWidth2: '110px',
        allTag_params: {
          tagName: '',
          categoryId: [],
          categoryName:[],
          tagId: "",
          description: '',
          keyword:''
        },
        tag_params: {
          categoryName: '',
          categoryId: '',
          description: ''
        },
        firstClass:[]
      }
    },
    methods: {
      /* excal导入标签——————————————————————————————————————————————————————————————————————————————————————*/
      uploadSuccess (response, file, fileList) {
        this.loading = false;
        if (response.code===ERR_OK) {
            this.$notify({
            title: '成功',
            message: `导入成功！`,
            type: 'success'
          });
        } else {
          this.$notify.error({
            title: '导入失败！',
            message: `导入失败！状态码：${response.code}`,
            duration:5000,
          });
        }
      },
      uploadError (response, file, fileList) {
        this.$notify.error({
            title: '上传失败！',
            message: `上传失败！状态码：${response.code}`,
            duration:5000,
          });
      },
      submitUpload() {//导入excel
        this.$refs.upload.submit();
      },
      handleRemove(file, fileList) {
        // console.log(file, fileList);
      },
      handlePreview(file) {
        // console.log(file);
      },
      handleChange(file, fileList){
        // console.log(file);
        // console.log(fileList);
      },
      beforeAvatarUpload (file) {//拦截elementUpload默认上传事件，改为formdata上传
        const extension = file.name.split('.')[1] === 'xls'
        const extension2 = file.name.split('.')[1] === 'xlsx'
        const isLt2M = file.size / 1024 / 1024 < 10
        if (!extension && !extension2) {
          IsAlert(`上传文件只能是 xls、xlsx 格式!且文件名请不要包含‘.’!`,'错误','error');
          return false;
        }
        // else if (!isLt2M) {
        //   this.$alert('上传模板大小不能超过 10MB!')
        // }
        else{
          this.loading = true;//显示‘加载中’loading页面
          //将文件转化为formdata数据上传
          let fd = new FormData();
          fd.append('file', file);
          this.$http.post(this.API_EXCAL_IMPORT_TAG, fd).then((res) => {
            console.log(res)
            if(res.status=== 200){
              this.loading = false;
              this.$notify({
                title: '成功',
                message: `导入成功！`,
                type: 'success'
              });
            }else{
              this.$notify.error({
                title: '导入失败！',
                message: `导入失败！
                状态码：${res.data.code},
                报错信息：${res.data.msg}`,
                duration:5000,
              });
            }
          }).catch(()=>{
          this.$message.error('导入标签失败!请稍后重试');
        });
          return false;
        }
      },
      /**————————————————————————————————————————————————————————————————————————————————————————————————————*/
      changeValue(value) {//下拉框选择id，匹配出对应的name
          this.allTag_params.categoryName=[];
          for (let index = 0; index < value.length; index++) {
              let obj = {};
              obj = this.firstClass.find((item)=>{
                return item.categoryId === value[index];
              });
              this.allTag_params.categoryName.push(obj.categoryName);
          }
      },

      getTagListInfo() {/*获取标签分类列表*/
        let params = this.tagParams;
        queryCommTagCategoryList(params).then((res) => {
          if (res.code === ERR_OK) {
            this.tableData1 = res.data.list;
            this.tagTotal = res.data.totalCount;
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试')
        })
      },

      getCommTagInfo() {/*获取所有标签列表*/
        let params = this.commTagParams;
        getNewTagsList(params).then((res) => {
          if (res.code === ERR_OK) {
            this.tableData2 = res.data.list;
            this.tagTotal = res.data.totalCount;
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试')
        })
      },
      onSubmit() {//搜索
        if (this.activeName === 'first') {
          this.tagParams.currentPage = 1;
          this.tagParams.categoryName = this.inputName;
          this.getTagListInfo();
        } else if (this.activeName === 'second') {
          this.commTagParams.currentPage = 1;
          this.commTagParams.name = this.inputName;
          this.getCommTagInfo();
        }
      },
      getFirstClass(){//获取一级标签
        let params = {};
        getCommTagCategoryName(params).then((res)=>{
          if(res.code===ERR_OK){
            this.firstClass = res.data;
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试')
        })
      },
      addClass() {/*新建*/
        this.is_disabled = false;
        this.addStatus = true;
        if (this.activeName === 'first') {
          /*标签分类*/
          this.tag_type = true;
          this.tagTitle = '新建标签分类'
          this.tag_params = {
            categoryName: '',
            categoryId: '',
            description: ''
          }
        } else if (this.activeName === 'second') {
          /*所有标签*/

          this.alltagTitle = '新建二级标签'
          this.all_tag_type = true;
          this.allTag_params = {
            tagName: '',
            categoryId: [],
            categoryName:[],
            tagId: "",
            description: '',
            keyword:''
          }
        }
      },

      handleClick() {/*tab标签切换*/
        this.tagParams= {
          categoryName: "",
          currentPage: 1,
          pageSize: 10
        },
        this.commTagParams= {
          tag:'',
          currentPage: 1,
          pageSize: 10,
          name: ""
        };
        if (this.activeName === 'first') {
          this.addTip = '新建分类';
          this.inputName = '';
          this.placeholderText='请输入分类名'
          this.titleMsg='分类名';
          this.getTagListInfo();
        } else if (this.activeName === 'second') {
          this.addTip = '新建标签';
          this.placeholderText='请输入一级标签'
          this.titleMsg='一级标签';
          this.inputName = '';
          this.getCommTagInfo();
        }
      },

      getEditTag(row) {/*编辑*/
        if (this.activeName === 'first') {
          /*标签分类*/
          this.tag_type = true;
          this.tagTitle = '编辑标签分类';
          this.tag_params.categoryName = row.categoryName;
          this.tag_params.description = row.description;
          this.tag_params.categoryId = row.categoryId
        } else if (this.activeName === 'second') {
          let params = {
            tagId:row.tagId
          };
          postQueryNewTags(params).then((res) => {

                  if (res.code === ERR_OK) {
                    this.allTag_params.tagName = res.data.tagName;
                    this.allTag_params.keyword = res.data.keyword;
                    this.allTag_params.description = res.data.description;
                    this.allTag_params.tagId = res.data.tagId;
                    this.allTag_params.categoryId = [];
                    this.allTag_params.categoryName = [];
                     for (let index = 0; index < res.data.list.length; index++) {
                       this.allTag_params.categoryId.push(res.data.list[index].categoryId);
                       this.allTag_params.categoryName.push(res.data.list[index].categoryName);
                     }
                  } else {
                    IsAlert(res.msg,'错误','error');
                  }
                }).catch(()=>{
                  this.$message.error('网络错误!请稍后重试')
                })
          this.all_tag_type = true;
          this.alltagTitle = '编辑二级标签';
        }
      },

      delTag(row) {/*移除*/
        if (this.activeName === 'first') {
          /*标签分类*/
          let params = {
            categoryId: row.categoryId,
            categoryName: row.categoryName,
            categoryStatus: "1",
            description: row.description,
          };
            this.$confirm('确定要删除吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            })
              .then(_ => {
                updateTagCategoryStatus(params).then((res) => {
                  if (res.code === ERR_OK) {
                    this.getTagListInfo();
                    this.$notify({
                      title: '成功',
                      message: `删除成功！`,
                      type: 'success'
                    });
                  } else {
                    IsAlert(res.msg,'错误','error');
                  }
                }).catch(()=>{
                  this.$message.error('网络错误!请稍后重试')
                })
              })
              .catch(() => {})
        } else if (this.activeName === 'second') {
          let params = {
            id: row.tagId
          };
          this.$confirm('确定要删除吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            })
            .then(_ => {
              postDeleteNewTags(params).then((res) => {
                if (res.code === ERR_OK) {
                  this.getCommTagInfo();
                  this.$notify({
                      title: '成功',
                      message: `删除成功！`,
                      type: 'success'
                  });
                } else {
                  IsAlert(res.msg,'错误','error');
                }
              }).catch(()=>{
                this.$message.error('网络错误!请稍后重试')
              })
            })
            .catch(() => {})
        }
      },

      sureAdd() {/*确定新增/编辑*/
        if (this.activeName === 'first') {
          let params = {
            categoryId: this.tag_params.categoryId,
            categoryName: this.tag_params.categoryName,
            description: this.tag_params.description
          };
          let paramsSave = {
            categoryName: this.tag_params.categoryName,
            description: this.tag_params.description
          };
          if (this.addStatus) {
            if (paramsSave.categoryName === '') {
              IsAlert('请输入标题名','提示','warning');
            } else {
              this.is_disabled = true;
              saveCommTagCategory(paramsSave).then((res) => {
                if (res.code === ERR_OK) {
                  IsAlert(res.msg,'成功','success');
                  this.getTagListInfo();
                  this.tag_type = false;
                } else {
                  IsAlert(res.msg,'错误','error');
                }
              }).catch(()=>{
                this.$message.error('网络错误!请稍后重试')
              })
            }
          } else {
            if (paramsSave.categoryName === '') {
              IsAlert('请输入标题名','提示','warning');
            }else{
              updateCommTagCategory(params).then((res) => {
                if (res.code === ERR_OK) {
                  IsAlert(res.msg,'成功','success');
                  this.getTagListInfo();
                  this.tag_type = false;
                } else {
                  IsAlert(res.msg,'错误','error');
                }
              }).catch(()=>{
                this.$message.error('网络错误!请稍后重试')
              })
            }
          }
        } else if (this.activeName === 'second') {
          let params = {
            categoryId: this.allTag_params.categoryId+'',
            categoryName: this.allTag_params.categoryName+'',
            description: this.allTag_params.description,
            tagId: this.allTag_params.tagId,
            tagName: this.allTag_params.tagName,
            keyword:this.allTag_params.keyword,
          };
          let paramsSave = {
            categoryId: this.allTag_params.categoryId+'',
            categoryName: this.allTag_params.categoryName+'',
            description: this.allTag_params.description,
            tagName: this.allTag_params.tagName,
            keyword:this.allTag_params.keyword,
          };
          if (this.addStatus) {
            if(+params.categoryId===0){
              IsAlert('请选择一级标签','提示','warning');
            }else if (paramsSave.tagName === '') {
              IsAlert('请输入标题名','提示','warning');
            }else{
              postSaveNewTags(paramsSave).then((res) => {
                if (res.code === ERR_OK) {
                  this.getCommTagInfo();
                  IsAlert(res.msg,'成功','success');
                  this.all_tag_type = false;
                  this.addStatus = false;
                } else {
                  IsAlert(res.msg,'错误','error');
                }
              }).catch(()=>{
                this.$message.error('网络错误!请稍后重试')
              })
            }
          } else {
            if(+params.categoryId===0){
              IsAlert('请选择一级标签','提示','warning');
            }else if (paramsSave.tagName === '') {
              IsAlert('请输入标题名','提示','warning');
            }else{
              postModifyNewTags(params).then((res) => {
                if (res.code === ERR_OK) {
                  this.getCommTagInfo();
                  this.all_tag_type = false;
                  IsAlert(res.msg,'成功','success');
                } else {
                  IsAlert(res.msg,'错误','error');
                }
              }).catch(()=>{
                this.$message.error('网络错误!请稍后重试')
              })
            }
          }
        }
      },

      cancleAdd() {/*新增取消*/
        this.all_tag_type = false;
        this.tag_type = false;
      },
      handleSizeChange(val) {
        if (this.activeName === 'first') {
          this.tagParams.pageSize = val;
          this.getTagListInfo();
        } else if (this.activeName === 'second') {
          this.commTagParams.pageSize = val;
          this.getCommTagInfo();
        }
      },
      handleCurrentChange(val) {
        if (this.activeName === 'first') {
          this.tagParams.currentPage = val;
          this.getTagListInfo();
        } else if (this.activeName === 'second') {
          this.commTagParams.currentPage = val;
          this.getCommTagInfo();
        }
      }
    },
    activated() {
      this.activeName = 'first';
      this.handleClick();
      this.getTagListInfo();
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

<style scoped lang="less">
.btn-row {
    text-align: center;
    padding-top: 20px;
  }
  #TAGkeywordHeight {
    min-height: 40px !important;
    line-height: 2 !important;
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
<style lang="less">
  #TAGkeywordHeight {
    min-height: 40px !important;
    line-height: 2 !important;
  }
</style>
