<template>
  <div class="page-wrapper">
    <header-top></header-top>

    <div class="page-container">
      <el-form :inline="true" :model="searchParams" class="demo-form-inline">
        <el-form-item label="文章标题/文章id">
          <el-input placeholder="请输入文章标题/文章id" v-model="searchParams.title" clearable></el-input>
        </el-form-item>
        <el-form-item label="上线时间：">
              <el-date-picker
                  v-model="searchParams.time"
                  @change="getselTime"
                  type="datetimerange"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  range-separator="至"
                  start-placeholder="上线时间起"
                  end-placeholder="上线时间止">
              </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doSearch">查询</el-button>
        </el-form-item>
        <el-form-item v-show="tabIndex==='1'">
          <el-button type="primary" @click="showAddDialog">新增</el-button>
        </el-form-item>
      </el-form>
      <!--tab-->
      <el-tabs v-model="tabIndex">
        <el-tab-pane label="爬虫文章" name="2"></el-tab-pane>
        <el-tab-pane label="运营文章" name="1"></el-tab-pane>
      </el-tabs>
      <el-table :data="dataList" border style="width: 100%">
        <el-table-column show-overflow-tooltip align="center" prop="" label="序号" width="60" type="index"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="contentId" label="文章id"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="title" label="文章标题"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="summary" label="摘要"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="columnName" label="分类"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="source" label="内容来源"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="createTime" label="创建时间"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="lastUpdateTime" label="更新时间"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="onlineTime" label="上线时间"></el-table-column>
        <el-table-column label="操作" width="300" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" v-if="scope.row.contentState===2" @click="upLineFn(scope.row)">上线
            </el-button>
            <el-button size="mini" type="success" v-if="scope.row.contentState===1" @click="downLineFn(scope.row)">下线
            </el-button>
            <el-button size="mini" type="primary" v-if="scope.row.contentState!==0"
                       @click="showEditorDialog(scope.row)">编辑
            </el-button>
            <el-button size="mini" type="danger" v-if="scope.row.contentState!==0" @click="deleteFn(scope.row)">移除
            </el-button>
            <el-button size="mini" type="success" @click="previewWindow(scope.row)">预览</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="self-page-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="searchParams.currentPage" :page-sizes="[10,20]" :page-size="searchParams.pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
    </div>

    <!--新增图文的dialog-->
    <div v-if="addArticle.isShowDialog">
      <el-dialog title="新增图文" :visible.sync="addArticle.isShowDialog" width="80%" :before-close="handleCloseAdd">
        <!--正文-->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <strong>正文</strong>
          </div>
          <el-form ref="form" label-width="80px">
            <el-form-item label="标题">
              <el-input placeholder="请输入标题" maxlength="30" v-model="addArticle.title"></el-input>
            </el-form-item>
            <el-form-item label="内容">
              <!-- <tinymce v-model="Value" :url="Url" :with-credentials='false' :editorHeight='200' @upload="onUpload" @on-ready="onEditorReady" @on-destroy="onEditorDestroy" @on-upload-complete="onEditorUploadComplete" @on-upload-fail="onEditorUploadFail"></tinymce> -->
              <tinymce v-model="Value" :url="Url" :with-credentials='false' :editorHeight='200'></tinymce>
            </el-form-item>
          </el-form>
        </el-card>

        <!--发布编辑-->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <strong>发布编辑</strong>
          </div>
          <el-form ref="form" label-width="80px">
            <el-form-item label="封面">
              <uploadimg @emitSuccess="handImgSuccess" @emitError="handImgError"
                         :imageSrc="addArticle.coverPhoto"></uploadimg>
            </el-form-item>
            <el-form-item label="摘要">
              <el-input placeholder="请输入摘要" maxlength="50" v-model="addArticle.summary"></el-input>
            </el-form-item>
            <el-form-item label="来源">
              <el-input placeholder="请输入来源" v-model="addArticle.source"></el-input>
            </el-form-item>
            <el-form-item label="推荐医生">
              <el-select v-model="addArticle.selectDoctor" multiple filterable placeholder="请选择" class="lg-select"
                         :multiple-limit="5">
                <el-option v-for="item in allDoctorList" :key="item.insDoctorId" :label="item.name"
                           :value="item.insDoctorId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="文章分类">
              <el-select v-model="addArticle.columnId" placeholder="请选择">
                <el-option v-for="item in articleTypes" :key="item.columnId" :label="item.columnName"
                           :value="item.columnId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="标签">
              <el-select filterable v-model="addArticle.selectTags" :multiple-limit="5" value-key="tagName" multiple
                :remote-method="remoteMethod" remote :loading="loading" placeholder="请输入标签名搜索并进行选择" style="width:100%">
                  <el-option :label="item.tagName" :value="item.tagId" v-for="(item,index) in RemoteOptions" :key="item.tagName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="收藏数">
              <el-input placeholder="请输入收藏数" v-model="addArticle.initialCollectionNumber" type="number"></el-input>
            </el-form-item>
            <el-form-item label="阅读数">
              <el-input placeholder="请输入阅读数" v-model="addArticle.initialReadingNumber" type="number"></el-input>
            </el-form-item>
          </el-form>
        </el-card>

        <!--分享信息-->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <strong>分享信息</strong>
          </div>
          <el-form ref="form" label-width="80px">
            <el-form-item label="分享图片">
              <uploadimg @emitSuccess="handShareSuccess" @emitError="handImgError"
                         :imageSrc="addArticle.sharePicture"></uploadimg>
            </el-form-item>
          </el-form>
        </el-card>
        <div class="btn-row" style="text-align:center">
          <el-button type="default" @click="addCancel">取消</el-button>
          <el-button type="primary" @click="saveNewsFn">确定</el-button>
        </div>
      </el-dialog>

    </div>
    <!--编辑图文的dialog-->
    <div v-if="editorArticle.isShowDialog">
      <el-dialog title="编辑图文" :visible.sync="editorArticle.isShowDialog" width="80%">
        <!--正文-->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <strong>正文</strong>
          </div>
          <el-form ref="form" label-width="80px">
            <el-form-item label="标题">
              <el-input placeholder="请输入标题" maxlength="30" v-model="editorArticle.title"></el-input>
            </el-form-item>
            <el-form-item label="内容">
              <tinymce v-model="Value2" :url="Url" :with-credentials=false :editorHeight=200></tinymce>
               <!-- <tinymce v-model="Value2" :url="Url" :with-credentials=false :editorHeight=200 @upload="onUpload2" @on-ready="onEditorReady2" @on-destroy="onEditorDestroy2" @on-upload-complete="onEditorUploadComplete2" @on-upload-fail="onEditorUploadFail2"></tinymce> -->
            </el-form-item>
          </el-form>
        </el-card>

        <!--发布编辑-->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <strong>发布编辑</strong>
          </div>
          <el-form :model="editorArticle" ref="form" label-width="80px">
            <el-form-item label="封面">
              <uploadimg @emitSuccess="handEditorImgSuccess" @emitError="handImgError"
                         :imageSrc="editorArticle.coverPhoto"></uploadimg>
            </el-form-item>
            <el-form-item label="摘要">
              <el-input placeholder="请输入摘要" maxlength="50" v-model="editorArticle.summary"></el-input>
            </el-form-item>
            <el-form-item label="来源">
              <el-input placeholder="请输入来源" v-model="editorArticle.source"></el-input>
            </el-form-item>
            <el-form-item label="推荐医生">
              <el-select v-model="editorArticle.selectDoctor" filterable multiple placeholder="请选择" class="lg-select"
                         :multiple-limit="5">
                <el-option v-for="item in allDoctorList" :key="item.insDoctorId" :label="item.name"
                           :value="item.insDoctorId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="文章分类">
              <el-select v-model="editorArticle.columnId" placeholder="请选择">
                <el-option v-for="item in articleTypes" :key="item.columnId" :label="item.columnName"
                           :value="item.columnId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="标签">
              <el-select filterable v-model="editorArticle.selectTags" :multiple-limit="5" value-key="tagName" multiple
                :remote-method="remoteMethod" remote :loading="loading" placeholder="请输入标签名搜索并进行选择" style="width:100%">
                  <el-option :label="item.tagName" :value="item.tagId" v-for="(item,index) in RemoteOptions" :key="item.tagName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="收藏数">
              <el-input v-show="initialCollectionNumber!==0" placeholder="请输入收藏数"
                        v-model="editorArticle.initialCollectionNumber" readOnly></el-input>
              <el-input v-show="initialCollectionNumber===0" placeholder="请输入收藏数"
                        v-model="editorArticle.initialCollectionNumber"></el-input>
            </el-form-item>
            <el-form-item label="阅读数">
              <el-input v-show="initialReadingNumber!==1" placeholder="请输入阅读数"
                        v-model="editorArticle.initialReadingNumber" readOnly></el-input>
              <el-input v-show="initialReadingNumber===1" placeholder="请输入阅读数"
                        v-model="editorArticle.initialReadingNumber"></el-input>
            </el-form-item>
          </el-form>
        </el-card>

        <!--分享信息-->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <strong>分享信息</strong>
          </div>
          <el-form ref="form" label-width="80px">
            <el-form-item label="分享图片">
              <uploadimg @emitSuccess="handEditorShareSuccess" @emitError="handImgError"
                         :imageSrc="editorArticle.sharePicture"></uploadimg>
            </el-form-item>
          </el-form>
        </el-card>
        <div class="btn-row" style="text-align:center">
          <el-button type="default" @click="addCancel2">取消</el-button>
          <el-button type="primary" @click="saveNewsFn2">确定</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>
<script>
  import headerTop from '@/components/headTop.vue'
  import tinymce from '@/components/tinymce.vue'
  import uploadimg from '@/components/uploadImg/uploadImgAdd.vue'
  import {preview_path} from "@/config/env.js";
  import {IsAlert} from '@/config/mUtils.js';
  import {
    getNewsArticleList,
    getIdentDoctors,
    saveNewsInfo,
    updateNewsStatus,
    getAllArticleTypes,
    getSubTagCategory,
    updataNewsInfo,
    ERR_OK,
    postAllNewTags//获取所有标签
  } from '@/api/api.js'

  export default {
    data() {
      return {
        RemoteOptions: [],//搜索后下拉框选项
        loading: false,
        Remotelist: [],//远程数据
        Url: 'http://v0.api.upyun.com/zhangshangtijian',
        Value: '',
        Value2: '',
        tabIndex: '2',
        totalCount: 0,
        articleTypes: [], //文章分类
        mainTags: [], //所有标签
        subTags: [], //二级标签
        allDoctorList: [], //所有医生

        //预览
        previewInfo: {
          isShowModel: false,
          content: ''
        },

        addArticle: {
          isShowDialog: false,
          columnId: '', //文章分类
          coverPhoto: '', //(string, optional): 封面图片 ,
          initialCollectionNumber: 0, // (integer, optional): 初始收藏数 ,
          initialReadingNumber: 1, // (integer, optional): 初始阅读数 ,
          lastUpdateTime: '', // (string, optional): 最后修改时间 ,
          recommendDoctor: '', // (string, optional): 推荐医生 ,
          sharePicture: '', // (string, optional): 分享图片:""
          source: '', // (string, optional): 来源 ,
          summary: '', // (string, optional): 概述（摘要）
          tagList: '', //(Array[AddNewsTagDTO], optional): 绑定标签 ,
          title: '', // (string, optional): 标题 ,
          videoAddress: '', //视频地址
          selectDoctor: [], //选中的doctor
          selectTags: [] //选中的标签
        },
        editorArticle: {
          isShowDialog: false,
          columnId: '', //文章分类
          contentId: '', //文章的id
          contentState: '', //状态（上线：1；下线：2；删除：0） ,
          contentType: '', //（1:图文；2：视频）
          coverPhoto: '', //(string, optional): 封面图片 ,
          initialCollectionNumber: '', // (integer, optional): 初始收藏数 ,
          initialReadingNumber: '', // (integer, optional): 初始阅读数 ,
          lastUpdateTime: '', // (string, optional): 最后修改时间 ,
          sharePicture: '', // (string, optional): 分享图片:""
          source: '', // (string, optional): 来源 ,
          summary: '', // (string, optional): 概述（摘要）
          tagList: '', //(Array[AddNewsTagDTO], optional): 绑定标签 ,
          title: '', // (string, optional): 标题 ,
          selectDoctor: [], //选中的doctor
          selectTags: [] //选中的标签
        },

        dataList: [],
        searchParams: {
          time: [],
          startTime: '',
          endTime: '',
          currentPage: 1,
          pageSize: 10,
          title: ''
        },
        initialCollectionNumber: null,
        initialReadingNumber: null
      }
    },

    components: {
      headerTop,
      tinymce,
      uploadimg
    },

    methods: {
      getselTime() {
          this.searchParams.startTime = (this.searchParams.time) ? this.searchParams.time[0] : '';
          this.searchParams.endTime =  (this.searchParams.time) ? this.searchParams.time[1] : '';
      },
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
      //预览
      previewWindow(item) {
        let id = item.contentId;
        window.open(preview_path + 'AppAVShare.html#/article/' + id)
      },

      //上线confirm
      upLineFn(item) {
        this.editorArticle.title = item.title;
        this.Value2 = item.content;
        this.editorArticle.coverPhoto = item.coverPhoto;
        this.editorArticle.initialReadingNumber = item.initialReadingNumber;
        this.editorArticle.source = item.source;
        this.editorArticle.selectDoctor = item.recommendDoctor
          ? item.recommendDoctor.split(',')
          : '';
        this.editorArticle.sharePicture = item.sharePicture;
        this.editorArticle.columnId = item.columnId ? item.columnId : '';
        this.editorArticle.contentId = item.contentId;
        this.editorArticle.selectTags = item.tagList ? item.tagList : [];

        if (
          !this.editorArticle.title ||
          !this.Value2 ||
          !this.editorArticle.coverPhoto ||
          !this.editorArticle.source ||
          !this.editorArticle.sharePicture ||
          !this.editorArticle.columnId ||
          this.editorArticle.selectTags.length === 0 ||
          !this.editorArticle.selectTags ||
          !this.editorArticle.initialReadingNumber
        ) {
          IsAlert('请编辑完成后再上线！','提示','warning');
          return
        }
        this.$confirm('确定上线吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
          .then(_ => {
            let params = {
              contentId: item.contentId,
              source: item.source,
              title: item.title,
              contentState: 1
            };
            updateNewsStatus(params).then(res => {
              if (res.code === ERR_OK) {
                this.getListData()
              } else {
                IsAlert(res.msg,'错误','error');
              }
            }).catch(() => {
              this.$message.error('网络错误!请稍后重试')
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          })
      },

      //下线的confirm
      downLineFn(row) {
        this.$confirm('确定下线吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
          .then(_ => {
            let params = {
              contentId: row.contentId,
              source: row.source,
              title: row.title,
              contentState: 2
            };
            updateNewsStatus(params)
              .then(res => {
                if (res.code === ERR_OK) {
                  this.getListData()
                } else {
                  IsAlert(res.msg,'错误','error');
                }
              }).catch(() => {
              this.$message.error('网络错误!请稍后重试')
            })
          }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        })
      },

      //delete confirm
      deleteFn(row) {
        if (row.contentState == 1) {
          IsAlert('文章还在线，请下线该文章！','提示','warning');
        } else {
          this.$confirm('确定要删除吗？',{center: true})
            .then(_ => {
              let params = {
                contentId: row.contentId,
                contentState: 0
              }
              updateNewsStatus(params)
                .then(res => {
                  if (res.code === ERR_OK) {
                    this.getListData()
                  } else {
                    IsAlert(res.msg,'错误','error');
                  }
                })
                .catch(() => {
                  this.$message.error('网络错误!请稍后重试')
                })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
            })
        }
      },

      //新增封面
      handImgSuccess(res) {
        if (res.status === 200) {
          this.addArticle.coverPhoto =
            'http://zhangshangtijian.b0.upaiyun.com' + res.data.url
        } else {
          IsAlert(res.msg,'错误','error');
        }
      },

      //编辑封面
      handEditorImgSuccess(res) {
        if (res.status === 200) {
          this.editorArticle.coverPhoto =
            'http://zhangshangtijian.b0.upaiyun.com' + res.data.url
        } else {
          IsAlert(res.msg,'错误','error');
        }
      },

      //新增分享
      handShareSuccess(res) {
        if (res.status === 200) {
          this.addArticle.sharePicture =
            'http://zhangshangtijian.b0.upaiyun.com' + res.data.url
        } else {
          IsAlert(res.msg,'错误','error');
        }
      },
      handEditorShareSuccess(res) {
        if (res.status === 200) {
          this.editorArticle.sharePicture =
            'http://zhangshangtijian.b0.upaiyun.com' + res.data.url
        } else {
          IsAlert(res.msg,'错误','error');
        }
      },

      //获取列表数据
      getListData: function () {
        let params = {
          contentType: 1, //1是图文  2是视频
          currentPage: this.searchParams.currentPage,
          onLineStartDate: this.searchParams.startTime,
          onLineEndDate: this.searchParams.endTime,
          newsType: parseInt(this.tabIndex),
          pageSize: this.searchParams.pageSize,
          idTitle: this.searchParams.title
        };
        getNewsArticleList(params)
          .then(res => {
            if (res.code === ERR_OK) {
              this.dataList = res.data.list;
              this.totalCount = res.data.totalCount;
            } else {
              IsAlert(res.msg,'错误','error');
            }
          })
          .catch(() => {
            this.$message.error('网络错误!请稍后重试')
          })
      },
      //获取所有标签
      getSubTags() {
        let params = {};
        postAllNewTags(params)
          .then(res => {
            if (res.code === ERR_OK) {
              this.subTags = res.data;
              this.Remotelist = this.subTags.map(item => {
              return { tagId: item.tagId, tagName: item.tagName };
              });
            } else {
              IsAlert(res.msg,'错误','error');
            }
          }).catch(() => {
          this.$message.error('网络错误!请稍后重试');
        })
      },

      //获取所有文章分类
      getAllArticleTypesFn() {
        let params = {};
        getAllArticleTypes(params)
          .then(res => {
            if (res.code === ERR_OK) {
              this.articleTypes = res.data;
            } else {
              IsAlert(res.msg,'错误','error');
            }
          }).catch(() => {
          this.$message.error('网络错误!请稍后重试');
        })
      },

      //获取医生列表
      getAllDoctors: function () {
        let params = {};
        getIdentDoctors(params).then(res => {
          if (res.code === ERR_OK) {
            this.allDoctorList = res.data;
          } else {
            IsAlert(res.msg,'错误','error');
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试');
        })
      },

      //新增图文
      saveNewsFn() {
        let params = {
          columnId: this.addArticle.columnId, //文章分类
          content: this.Value,
          contentState: 2, // 内容状态（上线：1；下线：2；删除：0） ,
          contentType: 1, //1是图文
          coverPhoto: this.addArticle.coverPhoto,
          initialCollectionNumber: this.addArticle.initialCollectionNumber,
          initialReadingNumber: this.addArticle.initialReadingNumber,
          newsType: 1, //（1：运营生成；2:抓取 ） ,
          recommendDoctor: this.addArticle.selectDoctor.join(','), //推荐医生id拼接
          sharePicture: this.addArticle.sharePicture,
          source: this.addArticle.source,
          summary: this.addArticle.summary,
          tagList: this.addArticle.selectTags,
          title: this.addArticle.title,
          videoAddress: ''
        };

        saveNewsInfo(params).then(res => {
          if (res.code === ERR_OK) {
            this.handleCloseAdd()
            IsAlert(res.msg,'成功','success');
            this.getListData();
          } else {
            IsAlert(res.msg,'错误','error');
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        })
      },
        
      handleCloseAdd() {//新增弹窗重置数据
        this.RemoteOptions = [];
        this.Value = '';
        this.addArticle = {
          isShowDialog: false,
          columnId: '', //文章分类
          coverPhoto: '', //(string, optional): 封面图片 ,
          initialCollectionNumber: 0, // (integer, optional): 初始收藏数 ,
          initialReadingNumber: 1, // (integer, optional): 初始阅读数 ,
          lastUpdateTime: '', // (string, optional): 最后修改时间 ,
          recommendDoctor: '', // (string, optional): 推荐医生 ,
          sharePicture: '', // (string, optional): 分享图片:""
          source: '', // (string, optional): 来源 ,
          summary: '', // (string, optional): 概述（摘要）
          tagList: '', //(Array[AddNewsTagDTO], optional): 绑定标签 ,
          title: '', // (string, optional): 标题 ,
          videoAddress: '', //视频地址
          selectDoctor: [], //选中的doctor
          selectTags: [] //选中的标签
        }

      },
      //编辑保存图文咨询
      saveNewsFn2() {
        let params = {
          columnId: this.editorArticle.columnId, //文章分类
          contentId: this.editorArticle.contentId, //
          content: this.Value2,
          contentState: this.editorArticle.contentState, //内容状态（上线：1；下线：2；删除：0） ,
          contentType: 1, //1是图文
          coverPhoto: this.editorArticle.coverPhoto,
          initialCollectionNumber: this.editorArticle.initialCollectionNumber,
          initialReadingNumber: this.editorArticle.initialReadingNumber,
          recommendDoctor: this.editorArticle.selectDoctor.join(','), //推荐医生id拼接
          sharePicture: this.editorArticle.sharePicture,
          source: this.editorArticle.source,
          summary: this.editorArticle.summary,
          tagList: this.editorArticle.selectTags,
          title: this.editorArticle.title,
          videoAddress: ''
        }

        updataNewsInfo(params).then(res => {
          if (res.code === ERR_OK) {
            this.editorArticle.isShowDialog = false;
            IsAlert(res.msg,'成功','success');
            this.getListData();
          } else {
            IsAlert(res.msg,'错误','error');
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        })
      },

      doSearch() {
        this.searchParams.currentPage = 1;
        this.getListData();
      },
      addCancel() {
        this.handleCloseAdd()
      },
      addCancel2() {
        this.editorArticle.isShowDialog = false
      },

      showAddDialog() {
        this.addArticle.isShowDialog = true
      },

      //显示编辑Dialog
      showEditorDialog(item) {
        //this.task();
        this.initialCollectionNumber = item.initialCollectionNumber ? item.initialCollectionNumber : 0;
        this.initialReadingNumber = item.initialReadingNumber ? item.initialReadingNumber : 1;
        this.editorArticle.isShowDialog = true;
        this.editorArticle.title = item.title;
        this.editorArticle.contentState = item.contentState;
        this.Value2 = item.content;
        this.editorArticle.coverPhoto = item.coverPhoto;
        this.editorArticle.summary = item.summary;
        this.editorArticle.source = item.source;
        this.editorArticle.selectDoctor = item.recommendDoctor
          ? item.recommendDoctor.split(',')
          : '';
        this.editorArticle.sharePicture = item.sharePicture;
        this.editorArticle.columnId = item.columnId ? item.columnId : '';
        this.editorArticle.contentId = item.contentId;
        this.editorArticle.selectTags = item.tagList ? item.tagList : [];
        this.RemoteOptions = [];//v-for中options的数据，保证编辑弹窗出现后能看到已绑定的标签
        for (let index = 0; index < this.editorArticle.selectTags.length; index++) {
              let obj = {};
              obj = this.subTags.find((item)=>{
                return item.tagId === this.editorArticle.selectTags[index];
              });
              this.RemoteOptions.push(obj);
          }
        this.editorArticle.initialCollectionNumber = item.initialCollectionNumber ? item.initialCollectionNumber : 0;
        this.editorArticle.initialReadingNumber = item.initialReadingNumber ? item.initialReadingNumber : 1;
      },

      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this.getListData()
      },
      handleCurrentChange(val) {
        this.searchParams.currentPage = val;
        this.getListData()
      },

      //处理图片错误
      handImgError() {
      },
    },
    activated() {
      this.getListData();
      this.getSubTags();
      this.getAllArticleTypesFn();
      this.getAllDoctors();
    },
    watch: {
      tabIndex(val) {
        this.searchParams.currentPage = 1;
        this.getListData();
      }
    }
  }
</script>

<style lang="less" scoped>
  .box-card {
    margin-bottom: 20px;
  }

  .lg-select {
    width: 500px;
  }
</style>
