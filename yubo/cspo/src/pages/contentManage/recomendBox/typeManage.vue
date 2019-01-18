<template>
  <div class="type-manage">
    <div class="search_params">
      <el-form :inline="true" :model="tableParams" size="small" class="demo-form-inline">
        <el-form-item label="分类名称">
          <el-input v-model="tableParams.columnName" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button type="primary" @click="addClass">新建分类</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="tableData"
      :default-sort="{prop: 'orderNum'}"
      border
      style="width: 100%">
      <el-table-column show-overflow-tooltip fixed type="index" width="50" align="center"></el-table-column>
      <el-table-column show-overflow-tooltip prop="columnName" label="名称"></el-table-column>
      <el-table-column show-overflow-tooltip sortable prop="orderNum" label="推荐顺序" width="120"
                       align="center"></el-table-column>
      <el-table-column label="封面图片" width="120">
        <template slot-scope="scope">
          <img class="img-style" :src="scope.row.coverUrl" alt="">
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip sortable prop="tag" label="绑定标签"></el-table-column>
      <el-table-column show-overflow-tooltip prop="articleCount" label="绑定文章数" width="100"
                       align="center"></el-table-column>
      <el-table-column show-overflow-tooltip prop="videoCount" label="绑定视频数" width="100"
                       align="center"></el-table-column>
      <el-table-column show-overflow-tooltip prop="lastUpdateTime" label="更新时间"></el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        width="250">
        <template slot-scope="scope">
          <el-button v-if="scope.row.columnStatus!==1" @click="upline(scope.row)" type="success" size="small">上线
          </el-button>
          <el-button v-else @click="downline(scope.row)" type="warning" size="small">下线</el-button>
          <el-button @click="editTag(scope.row)" type="primary" size="small">编辑</el-button>
          <el-button @click="delTag(scope.row)" type="danger" size="small">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
      class="page_sel"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="tableParams.currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="tableParams.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableTotal">
    </el-pagination>
    <!--新增标签分类-->
    <el-dialog title="新建分类" :visible.sync="tag_type" width="400px">
      <el-tabs v-model="activeNameOne">
        <el-tab-pane label="设置分类" name="first">
          <el-form :model="tag_params">
            <el-form-item label="分类名" :label-width="formLabelWidth">
              <el-input v-model="tag_params.columnName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="描述" :label-width="formLabelWidth">
              <el-input v-model="tag_params.description" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="推荐顺序" :label-width="formLabelWidth">
              <el-input v-model="tag_params.orderNum" auto-complete="off" type="number"></el-input>
            </el-form-item>
            <el-form-item label="封面" :label-width="formLabelWidth">
              <up-img
                :imageSrc="tag_params.coverUrl"
                @emitSuccess="handleImgAdd"
                @emitError="errorImg"
              ></up-img>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!--<el-tab-pane label="选择标签" name="second">
          <el-form :model="tag_params">
            <el-form-item label="标签名" :label-width="formLabelWidth">
              <el-select v-model="slectedListAdd" :multiple-limit="12" filterable multiple collapse-tags
                         placeholder="请选择"
                         @change='selectAllAdd'>
                <el-option v-for="item in tagSelectList" :key="item.tagId" :label="item.tagName"
                           :value="item.tagName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>

        </el-tab-pane>-->
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleAdd">取 消</el-button>
        <el-button type="primary" @click="sureAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑标签分类-->
    <el-dialog title="编辑分类" :visible.sync="editTagShow" width="400px">
      <el-tabs v-model="activeNameTwo">
        <el-tab-pane label="设置分类" name="first">
          <el-form :model="editParams">
            <el-form-item label="分类名" :label-width="formLabelWidth">
              <el-input v-model="editParams.columnName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="描述" :label-width="formLabelWidth">
              <el-input v-model="editParams.description" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="推荐顺序" :label-width="formLabelWidth">
              <el-input v-model="editParams.orderNum" auto-complete="off" type="number"></el-input>
            </el-form-item>
            <el-form-item label="封面" :label-width="formLabelWidth">
              <up-img
                :imageSrc="editParams.coverUrl"
                @emitSuccess="handleImgEdit"
                @emitError="errorImg"
              ></up-img>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="选择标签" name="second">
          <el-form :model="editParams">
            <el-form-item label="标签名" :label-width="formLabelWidth">
              <el-select class="orSec" v-model="slectedListEdit" :multiple-limit="12" filterable multiple collapse-tags
                         placeholder="请选择"
                         @change='selectAllEdit'>
                <el-option v-for="(item,index) in tagSelectList" :key="index" :label="item"
                           :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="activeNameTwo==='first'" @click="nextTabs">下一步</el-button>
        <el-button v-if="activeNameTwo==='second'" @click="cancleAdd">取 消</el-button>
        <el-button v-if="activeNameTwo==='second'" type="primary" @click="sureEdit">确 定</el-button>
      </div>
    </el-dialog>
    <!---->
  </div>
</template>

<script>
  import UpImg from '@/components/uploadImg/uploadImgAdd.vue'
  import {selectAllPackage, timestampToTime} from '@/config/mUtils.js'
  import {
    ERR_OK,
    newsQueryNewsCategory,
    queryNewsCategoryList,
    saveNewsCategory,
    updateNewsCategory,
    updateNewsCategoryNum,
    updateNewsCategoryStatus,
    queryNewsCategroyNum,
    queryTagList,//查询全部新标签列表【新版本5.1】
    queryColumnOfTagList
  } from '@/api/api.js';

  export default {
    name: "typeManage",
    components: {
      UpImg
    },
    data() {
      return {
        tag_params: {
          columnName: '',
          description: '',
          columnId: '',
          coverUrl: '',
          tag: '',
          orderNum: ''
        },
        editParams: {
          columnName: '',
          description: '',
          columnId: '',
          coverUrl: '',
          tag: '',
          orderNum: ''
        },
        tag_type: false,
        formLabelWidth: '80px',
        tableData: [],
        tableParams: {
          columnName: "",
          currentPage: 1,
          pageSize: 10
        },
        tableTotal: null,
        tipTitle: '',
        activeNameOne: 'first',
        activeNameTwo: 'first',
        editTagShow: false,
        tagSelectList: [],//标签分栏总列表
        oldTagSelectListAdd: [],//新增旧标签分栏总列表
        slectedListAdd: [],//新增标签分栏总列表
        oldTagSelectListEdit: [],//编辑旧标签分栏总列表
        slectedListEdit: [],//编辑标签分栏总列表
      }
    },
    activated() {
    },
    methods: {
      /*获取新增&编辑标签的下拉列表*/
      getqueryTagList() {
        let params = {
          columnId: this.editParams.columnId
        }
        queryColumnOfTagList(params)
          .then((res) => {
            if (res.code === ERR_OK) {
              this.tagSelectList = res.data;
            } else {
              this.$alert(res.msg, '提示')
            }
          })
          .catch(() => {
            this.$message.error('网络错误!获取推荐分类管理数据失败')
          })
      },
      /*获取标签分类列表数据*/
      getTableData() {
        let params = this.tableParams;
        newsQueryNewsCategory(params).then((res) => {
          if (res.code === ERR_OK) {
            this.tableData = res.data.list;
            this.tableTotal = res.data.totalCount;
          }
        }).catch(() => {
          this.$message.error('获取推荐分类网络错误!请稍后重试')
        })
      },
      /*分类管理*/
      /*根据每页条数选择*/
      handleSizeChange(val) {
        this.tableParams.pageSize = val;
        this.getTableData();
      },
      /*根据当前页选择*/
      handleCurrentChange(val) {
        this.tableParams.currentPage = val;
        this.getTableData();
      },
      /*查询*/
      onSubmit() {
        this.getTableData();
      },
      /*新建分类*/
      addClass() {
        this.tag_type = true;
        this.activeNameOne = 'first';
        this.tipTitle = '新建分类';
        this.tag_params.columnName = '';
        this.tag_params.description = '';
        this.tag_params.coverUrl = '';
        this.tag_params.tag = '';
        this.tag_params.orderNum = ''
        this.slectedListAdd = []
      },
      /*新增标签多个*/
      /*selectAllAdd() {
        if (this.slectedListAdd.length === 12) {
          this.$message.error('标签选择已达到上限12个')
        }
        this.tag_params.tag = this.slectedListAdd.join(',');
      },*/
      /*确定新增*/
      sureAdd() {
        let params = this.tag_params;
        let paramsAdd = {
          columnStatus: 2,
          columnName: params.columnName,
          description: params.description,
          coverUrl: params.coverUrl,
          orderNum: params.orderNum,
          tag: params.tag,
        };
        if (this.tag_params.columnName === '') {
          this.$alert('请输入分类名', '提示');
          return
        } else if (this.tag_params.coverUrl === '') {
          this.$alert('请选择封面图片', '提示');
          return
        } else if (this.tag_params.orderNum === '') {
          this.$alert('请输入推荐顺序', '提示');
          return
        }
        saveNewsCategory(paramsAdd)
          .then((res) => {
            if (res.code === ERR_OK) {
              this.getTableData();
              this.tag_type = false;
            } else {
              this.$alert(res.msg, '提示');
            }
          })
          .catch(() => {
            this.$message.error('网络错误!请稍后重试')
          })

      },
      /*新增取消*/
      cancleAdd() {
        this.tag_type = false;
        this.editTagShow = false;
      },
      /*上线*/
      upline(row) {
        let params = {
          columnId: row.columnId,
          columnStatus: 1
        };
        this.$confirm('确定要上线吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(_ => {
            updateNewsCategoryStatus(params).then((res) => {
              if (res.code === ERR_OK) {
                this.getTableData();
              } else {
                this.$alert(res.msg, '提示');
              }
            }).catch(() => {
              this.$message.error('获取推荐分类网络错误!请稍后重试')
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消上线'
            });
          })
      },
      /*下线*/
      downline(row) {
        let params = {
          columnId: row.columnId,
          columnStatus: 2
        };

       /* if (row.orderNum < 7 && row.orderNum) {
          this.$alert('该分类已推荐,不能下线,请在首页分类管理中重新选择', '提示')
          return;
        }*/
        this.$confirm('确定要下线吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(_ => {
            updateNewsCategoryStatus(params).then((res) => {
              if (res.code === ERR_OK) {
                this.getTableData();
              } else {
                this.$alert(res.msg, '提示');
              }
            }).catch(() => {
              this.$message.error('获取推荐分类网络错误!请稍后重试')
            })

          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消下线'
            });
          })
      },
      /*编辑标签*/
      editTag(row) {
        this.editTagShow = true;
        this.activeNameTwo = 'first';
        this.editParams.columnName = row.columnName;
        this.editParams.description = row.description;
        this.editParams.columnId = row.columnId;
        this.editParams.coverUrl = row.coverUrl;
        this.editParams.orderNum = row.orderNum;
        this.editParams.tag = row.tag;
        this.getqueryTagList();
        this.slectedListEdit = row.tag?row.tag.split(','):[]
      },
      /*编辑标签多个*/
      selectAllEdit() {
        if (this.slectedListEdit.length === 12) {
          this.$message.error('标签选择已达到上限12个')
        }
        this.editParams.tag = this.slectedListEdit.join(',')
      },
      /*上传封面图片*/
      handleImgAdd(res) {
        if (res.status === 200) {
          this.tag_params.coverUrl = 'http://zhangshangtijian.b0.upaiyun.com' + res.data.url;
        } else {
          this.$alert(res.msg, '提示', {
            confirmButtonText: '确定'
          })
        }
      },
      handleImgEdit(res) {
        if (res.status === 200) {
          this.editParams.coverUrl = 'http://zhangshangtijian.b0.upaiyun.com' + res.data.url;
        } else {
          this.$alert(res.msg, '提示', {
            confirmButtonText: '确定'
          })
        }
      },
      /*确定编辑*/
      sureEdit() {
        let params = this.editParams;
        let paramsEdit = {
          columnId: params.columnId,
          columnName: params.columnName,
          description: params.description,
          coverUrl: params.coverUrl,
          orderNum: params.orderNum,
          tag: params.tag,
          lastUpdateTime: ''
        };
        if (this.editParams.columnName === '') {
          this.$alert('请输入分类名', '提示');
          return
        } else if (this.editParams.coverUrl === '') {
          this.$alert('请选择封面图片', '提示');
          return
        } else if (this.editParams.orderNum === '') {
          this.$alert('请输入推荐顺序', '提示');
          return
        }
        updateNewsCategory(paramsEdit)
          .then((res) => {
            if (res.code === ERR_OK) {
              this.getTableData();
              this.editTagShow = false;
            } else {
              this.$alert(res.msg, '提示');
            }
          })
          .catch(() => {
            this.$message.error('获取推荐分类网络错误!请稍后重试')
          })

      },
      /*图片上传失败*/
      errorImg(res) {
        this.$message.error(res.msg)
      },
      /*下一步*/
      nextTabs() {
        this.activeNameTwo = 'second'
      },
      /*移除标签*/
      delTag(row) {
        if (row.columnStatus === 1) {
          this.$alert('该分类已上线,不能删除');
        } else {
          this.$confirm('确定要删除吗？')
            .then(_ => {
              let params = {
                columnId: row.columnId,
                columnStatus: 0
              };
              updateNewsCategoryStatus(params).then((res) => {
                if (res.code === ERR_OK) {
                  this.getTableData();
                } else {
                  this.$alert(res.msg, '提示');
                }
              }).catch(() => {
                this.$message.error('获取推荐分类网络错误!请稍后重试')
              })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消下线'
              });
            })
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .page_sel {
    margin-top: 20px;
    text-align: center;
  }
  .img-style{
    width:90px;
    height:50px;
  }
</style>
