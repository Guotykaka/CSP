<template>
  <div class="TagOrg">
    <header-top></header-top>
    <div class="page-container">
      <div class="search_params">
        <el-form :inline="true" size="small" class="demo-form-inline">
          <el-form-item :label="titleMsg">
            <el-input v-model="inputName" :placeholder="placeholderText"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button type="primary" @click="addClass">{{addTip}}</el-button>
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
              <el-table-column show-overflow-tooltip prop="categoryName" label="分类名"></el-table-column>
              <el-table-column show-overflow-tooltip prop="tagcount" label="绑定标签数"></el-table-column>
              <el-table-column show-overflow-tooltip prop="articleCount" label="绑定文章数"></el-table-column>
              <el-table-column show-overflow-tooltip prop="videoCount" label="绑定视频数"></el-table-column>
              <el-table-column show-overflow-tooltip prop="lastUpdateTime" label="更新时间"></el-table-column>
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
              <el-table-column show-overflow-tooltip prop="categoryName" label="一级分类"></el-table-column>
              <el-table-column show-overflow-tooltip prop="tagName" label="名称"></el-table-column>
              <el-table-column show-overflow-tooltip prop="articleCount" label="绑定文章数"></el-table-column>
              <el-table-column show-overflow-tooltip prop="videoCount" label="绑定视频数"></el-table-column>
              <el-table-column show-overflow-tooltip prop="lastUpdateTime" label="更新时间"></el-table-column>
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleAdd">取 消</el-button>
        <el-button type="primary" @click="sureAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!--所有分类-->
    <el-dialog :title="alltagTitle" :visible.sync="all_tag_type" width="400px">
      <el-form :model="allTag_params">
        <el-form-item label="一级分类" :label-width="formLabelWidth">
          <el-select filterable v-model="allTag_params.categoryId" placeholder="请选择一级分类" style="width:100%">
            <el-option :label="item.categoryName" :value="item.categoryId" v-for="item in firstClass" :key="item.categoryId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签" :label-width="formLabelWidth">
          <el-input v-model="allTag_params.tagName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input v-model="allTag_params.description" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleAdd">取 消</el-button>
        <el-button type="primary" @click="sureAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import headerTop from '@/components/headTop.vue';
  import {
    ERR_OK,
    getCommTagCategoryName,
    queryCommTagCategoryList,
    saveCommTagCategory,
    updateCommTagCategory,
    updateTagCategoryStatus,
    deleteCommTagInfo,
    getTagInfo,
    getlistCommTagInfo,
    saveCommTagInfo,
    updateCommTagInfo
  } from '@/api/api.js';

  export default {
    name: "TagOrg",
    components: {
      headerTop
    },
    data() {
      return {
        inputName: '',
        tagParams: {
          categoryName: "",
          currentPage: 1,
          pageSize: 10
        },
        commTagParams: {
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
        addStatus: false,
        formLabelWidth: '80px',
        allTag_params: {
          tagName: '',
          categoryId: '',
          tagId: "",
          description: ''
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
      /*获取标签分类列表*/
      getTagListInfo() {
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
      /*获取所有分类列表*/
      getCommTagInfo() {
        let params = this.commTagParams;
        getlistCommTagInfo(params).then((res) => {
          if (res.code === ERR_OK) {
            this.tableData2 = res.data.list;
            this.tagTotal = res.data.totalCount;
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试')
        })
      },
      onSubmit() {
        if (this.activeName === 'first') {
          this.tagParams.categoryName = this.inputName;
          this.getTagListInfo();
        } else if (this.activeName === 'second') {
          this.commTagParams.name = this.inputName;
          this.getCommTagInfo();
        }
      },
      getFirstClass(){
        let params = {};
        getCommTagCategoryName(params).then((res)=>{
          if(res.code===ERR_OK){
            this.firstClass = res.data;
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试')
        })
      },
      /*新建分类*/
      addClass() {
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
          this.getFirstClass();
          this.alltagTitle = '新建二级标签'
          this.all_tag_type = true;
          this.allTag_params = {
            tagName: '',
            categoryId: '',
            tagId: "",
            description: ''
          }
        }
      },
      /*tab标签切换*/
      handleClick() {
        if (this.activeName === 'first') {
          this.addTip = '新建分类';
          this.inputName = '';
          this.placeholderText='请输入分类名'
          this.titleMsg='分类名';
          this.getTagListInfo();
        } else if (this.activeName === 'second') {
          this.addTip = '新建标签';
          this.placeholderText='请输入一级类名或名称'
          this.titleMsg='一级类名/名称';
          this.inputName = '';
          this.getCommTagInfo();
        }
      },
      /*编辑标签*/
      getEditTag(row) {
        if (this.activeName === 'first') {
          /*标签分类*/
          this.tag_type = true;
          this.tagTitle = '编辑标签分类';
          this.tag_params.categoryName = row.categoryName;
          this.tag_params.description = row.description;
          this.tag_params.categoryId = row.categoryId
        } else if (this.activeName === 'second') {
          this.all_tag_type = true;
          this.alltagTitle = '编辑二级标签';
          this.allTag_params.tagName = row.tagName;
          this.allTag_params.description = row.description;
          this.allTag_params.categoryId = row.categoryId;
          this.allTag_params.tagId = row.tagId;
          this.getFirstClass();
        }
      },
      /*移除标签*/
      delTag(row) {
        if (this.activeName === 'first') {
          /*标签分类*/
          let params = {
            categoryId: row.categoryId,
            categoryName: row.categoryName,
            categoryStatus: "1",
            description: row.description,
          };
            this.$confirm('确定要删除吗？')
              .then(_ => {
                updateTagCategoryStatus(params).then((res) => {
                  if (res.code === ERR_OK) {
                    this.getTagListInfo();
                  } else {
                    this.$alert(res.msg, '提示')
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
          this.$confirm('确定要删除吗？')
            .then(_ => {
              deleteCommTagInfo(params).then((res) => {
                if (res.code === ERR_OK) {
                  this.getCommTagInfo();
                } else {
                  this.$alert(res.msg, '提示')
                }
              }).catch(()=>{
                this.$message.error('网络错误!请稍后重试')
              })
            })
            .catch(() => {})
        }
      },
      /*确定新增/编辑*/
      sureAdd() {
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
              this.$alert('请输入标题名', '提示')
            } else {
              saveCommTagCategory(paramsSave).then((res) => {
                if (res.code === ERR_OK) {
                  this.$alert(res.msg, '提示');
                  this.getTagListInfo();
                  this.tag_type = false;
                } else {
                  this.$alert(res.msg, '提示');
                }
              }).catch(()=>{
                this.$message.error('网络错误!请稍后重试')
              })
            }
          } else {
            if (paramsSave.categoryName === '') {
              this.$alert('请输入标题名', '提示')
            }else{
              updateCommTagCategory(params).then((res) => {
                if (res.code === ERR_OK) {
                  this.$alert(res.msg, '提示');
                  this.getTagListInfo();
                  this.tag_type = false;
                } else {
                  this.$alert(res.msg, '提示');
                }
              }).catch(()=>{
                this.$message.error('网络错误!请稍后重试')
              })
            }
          }
        } else if (this.activeName === 'second') {
          let params = {
            categoryId: this.allTag_params.categoryId,
            description: this.allTag_params.description,
            tagId: this.allTag_params.tagId,
            tagName: this.allTag_params.tagName,
          };
          let paramsSave = {
            categoryId: this.allTag_params.categoryId,
            description: this.allTag_params.description,
            tagName: this.allTag_params.tagName,
          };
          if (this.addStatus) {
            if(params.categoryId===''){
              this.$alert('请选择一级标签', '提示')
            }else if (paramsSave.tagName === '') {
              this.$alert('请输入标题名', '提示')
            }else{
              saveCommTagInfo(paramsSave).then((res) => {
                if (res.code === ERR_OK) {
                  this.getCommTagInfo();
                  this.all_tag_type = false;
                  this.addStatus = false;
                  this.$alert(res.msg, '提示');
                } else {
                  this.$alert(res.msg, '提示');
                }
              }).catch(()=>{
                this.$message.error('网络错误!请稍后重试')
              })
            }
          } else {
            if(params.categoryId===''){
              this.$alert('请选择一级标签', '提示')
            }else if (paramsSave.tagName === '') {
              this.$alert('请输入标题名', '提示')
            }else{
              updateCommTagInfo(params).then((res) => {
                if (res.code === ERR_OK) {
                  this.getCommTagInfo();
                  this.all_tag_type = false;
                  this.$alert(res.msg, '提示');
                } else {
                  this.$alert(res.msg, '提示');
                }
              }).catch(()=>{
                this.$message.error('网络错误!请稍后重试')
              })
            }
          }
        }
      },
      /*新增取消*/
      cancleAdd() {
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
      this.getTagListInfo();
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
