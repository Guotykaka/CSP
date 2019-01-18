<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <el-header height="30">
        <el-form :model="searchParams" :inline="true" class="demo-form-inline">
          <el-form-item label="文章标题/文章id">
              <el-input v-model="searchParams.title" placeholder="输入文章标题/文章id" @keyup.enter.native="doSearch()" clearable></el-input>
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
          <el-form-item label="">
              <el-button type="primary" @click="doSearch()" class="m_l_15">查询</el-button>
              <el-button type="primary" @click="handleAdd()">新增</el-button>
          </el-form-item>
        </el-form>

      </el-header>
      <el-main>
        <!-- 编辑 -->
        <div v-if="dialogEditVisible">
        <el-dialog title="编辑视频" :visible.sync="dialogEditVisible" width=800px :before-close="handleCloseEdit">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <strong>正文信息</strong>
            </div>
          <el-form :model="editTable">
            <el-form-item label="上传视频:" :label-width="formLabelWidth">
              <el-col :span="4">
                <!-- <el-input v-model="editTable.contentState" auto-complete="off" el clearable></el-input> -->
                <uploadvideo @emitSuccess="handVideoSuccess" @emitError="handVideoError"></uploadvideo>
              </el-col>
              <el-col :span="8">
              <div>
              <span v-show="!editTable.videoAddress" class="el-icon-warning" style="color:#F56C6C">未上传</span>
              <span v-show="editTable.videoAddress" class="el-icon-success" style="color:#67C23A">已上传</span>
              </div>
              </el-col>
            </el-form-item>
            <el-form-item label="状态:" :label-width="formLabelWidth">
                <template slot-scope="scope">
                  <el-radio v-model="editTable.whetherFree" :label='0'>免费</el-radio>
                  <el-radio v-model="editTable.whetherFree" :label='1'>收费</el-radio>
                </template>
            </el-form-item>
            <el-form-item label="封面:" :label-width="formLabelWidth">
              <el-col :span="16">
                <uploadimg @emitSuccess="handImgSuccess" @emitError="handImgError" :imageSrc="editTable.coverPhoto"></uploadimg>
              </el-col>
            </el-form-item>
            <el-form-item label="视频ID:" :label-width="formLabelWidth">
              <el-col :span="16">
                <!-- <el-input v-model="editTable.contentId" auto-complete="off" el clearable></el-input> -->
                {{editTable.contentId}}
              </el-col>
            </el-form-item>
            <el-form-item label="绑定话题:" :label-width="formLabelWidth">
                <el-col :span="16">
                  <el-select v-model="editTable.topicId" placeholder="请选择" filterable clearable style="width:100%">
                    <el-option v-for="(item,index) in topicList" :key="index" :label="item.topicName" :value="item.topicId">
                    </el-option>
                  </el-select>
                </el-col>
              </el-form-item>
            <el-form-item label="简介:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="editTable.title" placeholder="输入标题" maxlength="30" auto-complete="off" el clearable></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="" label-width="0px">
              <el-col :span="24">
                <tinymce v-model="editTable.summary" :url="Url" :with-credentials='false' :editorHeight='200'></tinymce>
                <!-- <el-input type="textarea" placeholder="输入正文" resize="none" :rows="5" v-model="editTable.summary" auto-complete="off" el clearable></el-input> -->
              </el-col>
            </el-form-item>
            <el-form-item label="来源:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-show="flag_source" v-model="editTable.source" placeholder="输入来源" auto-complete="off" el readonly></el-input>
                <el-input v-show="!flag_source" v-model="editTable.source" placeholder="输入来源" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="推荐医生:" :label-width="formLabelWidth">
              <el-col :span="16">
                <template>
                  <el-select v-model="editTable.recommendDoctor" :multiple-limit="5" filterable multiple placeholder="请选择" class="selectner">
                    <el-option v-for="item in docList" :key="item.insDoctorId" :label="item.name" :value="item.insDoctorId">
                    </el-option>
                  </el-select>
                </template>
              </el-col>
            </el-form-item>
            <el-form-item label="文章分类:" :label-width="formLabelWidth">
              <el-col :span="16">
                <template>
                  <el-select v-model="editTable.columnId" placeholder="请选择">
                    <el-option v-for="item in leiList" :key="item.columnId" :label="item.columnName" :value="item.columnId">
                    </el-option>
                  </el-select>
                </template>
              </el-col>
            </el-form-item>
            <el-form-item label="标签:" :label-width="formLabelWidth" class="selectner">
              <el-col :span="16">
                <template>
                  <!-- <el-select v-model="editTable.tagList" :multiple-limit="5" multiple placeholder="请选择" filterable>
                    <el-option v-for="(item,index) in value5" :key="index" :label="item.tagName" :value="item.tagId">
                    </el-option>
                  </el-select> -->
                  <el-select filterable v-model="editTable.tagList" :multiple-limit="5" value-key="tagName" multiple
                    :remote-method="remoteMethod" remote :loading="loading"
                              placeholder="请输入标签名搜索并进行选择">
                      <el-option :label="item.tagName" :value="item.tagId" v-for="(item,index) in RemoteOptions"
                                :key="item.tagName"></el-option>
                  </el-select>
                </template>
              </el-col>
            </el-form-item>
            <el-form :inline="true" class="inner" :model="addTable">
              <el-form-item label="收藏数" class="m_l_30">
                <el-input v-show="flag_Cnumber!==0" v-model="editTable.initialCollectionNumber" auto-complete="off" readonly></el-input>
                <el-input v-show="flag_Cnumber===0" v-model="editTable.initialCollectionNumber" auto-complete="off" clearable></el-input>
              </el-form-item>
              <el-form-item label="阅读数">
                <el-input v-show="flag_Rnumber!==1" v-model="editTable.initialReadingNumber" auto-complete="off" readonly></el-input>
                <el-input v-show="flag_Rnumber===1" v-model="editTable.initialReadingNumber" auto-complete="off" clearable></el-input>
              </el-form-item>
            </el-form>
          </el-form>
          </el-card>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <strong>分享信息</strong>
            </div>
          <el-form :model="editTable">
            <el-form-item label="分享图片:" :label-width="formLabelWidth">
              <el-col :span="16">
                <uploadimg @emitSuccess="handShareSuccess" @emitError="handShareError" :imageSrc="editTable.sharePicture"></uploadimg>
              </el-col>
            </el-form-item>
          </el-form>
          </el-card>
          <div class="btn-row">
            <el-button size="small" type="primary" @click="_doHandleEdit()">确定</el-button>
            <el-button size="small" type="primary" @click="_doCancel()">取消</el-button>
          </div>
        </el-dialog>
        </div>
        <!-- 新增 -->
        <div v-if="dialogAddVisible">
        <el-dialog title="新增视频" :visible.sync="dialogAddVisible" width=800px :before-close="handleCloseAdd">
          <!-- <hr style=" height:1px;border:none;border-top:1px solid  #303133;" />
          <h4>正文信息</h4> -->
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <strong>正文</strong>
            </div>
            <!-- <el-form :model="addTable" :rules="rulesNew" ref="formNew"> -->
            <el-form :model="addTable" ref="formNew">
              <el-form-item label="上传视频:" :label-width="formLabelWidth" prop="videoAddress">
                <el-col :span="4">
                  <uploadvideo @emitSuccess="handVideoSuccessAdd" @emitError="handVideoErrorAdd"></uploadvideo>
                  <!-- <el-input v-model="addTable.videoAddress" auto-complete="off" el v-show="false"></el-input> -->
                </el-col>
                <el-col :span="8">
                <div>
                <span v-show="!addTable.videoAddress" class="el-icon-warning" style="color:#F56C6C">未上传</span>
                <span v-show="addTable.videoAddress" class="el-icon-success" style="color:#67C23A">已上传</span>
                </div>
                </el-col>
              </el-form-item>
              <!-- <el-form-item class="is-required" label="状态:" :label-width="formLabelWidth"> -->
              <el-form-item label="状态:" :label-width="formLabelWidth">
                <template slot-scope="scope">
                  <el-radio v-model="addTable.whetherFree" :label='0'>免费</el-radio>
                  <el-radio v-model="addTable.whetherFree" :label='1'>收费</el-radio>
                </template>
              </el-form-item>
              <el-form-item label="封面:" :label-width="formLabelWidth" prop="coverPhoto">
                <el-col :span="16">
                  <uploadimg @emitSuccess="handImgSuccessAdd" @emitError="handImgErrorAdd" :imageSrc="addTable.coverPhoto"></uploadimg>
                </el-col>
              </el-form-item>
              <el-form-item label="视频ID:" :label-width="formLabelWidth">
                <el-col :span="16">
                  <!-- <el-input v-model="editTable.contentId" auto-complete="off" el clearable></el-input> -->
                  {{addTable.contentId}}
                </el-col>
              </el-form-item>
              <el-form-item label="绑定话题:" :label-width="formLabelWidth">
                <el-col :span="16">
                  <el-select v-model="addTable.topicId" placeholder="请选择" filterable clearable style="width:100%">
                    <el-option v-for="(item,index) in topicList" :key="index" :label="item.topicName" :value="item.topicId">
                    </el-option>
                  </el-select>
                </el-col>
              </el-form-item>
              <el-form-item label="简介:" :label-width="formLabelWidth" prop="title">
                <el-col :span="16">
                  <el-input v-model="addTable.title" placeholder="输入标题" auto-complete="off" el clearable></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="" label-width="0px" prop="summary">
                <el-col :span="24">
                  <tinymce v-model="addTable.summary" :url="Url" :with-credentials='false' :editorHeight='200'></tinymce>
                  <!-- <el-input type="textarea" placeholder="输入正文" resize="none" :rows="5" v-model="addTable.summary" auto-complete="off" el clearable></el-input> -->
                </el-col>
              </el-form-item>
              <el-form-item label="来源:" :label-width="formLabelWidth" prop="source">
                <el-col :span="16">
                  <el-input v-model="addTable.source" placeholder="输入来源" auto-complete="off" el clearable></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="推荐医生:" :label-width="formLabelWidth" prop="recommendDoctor">
                <el-col :span="16">
                  <template>
                    <el-select v-model="addTable.recommendDoctor" :multiple-limit="5" filterable multiple placeholder="请选择" class="selectner">
                      <el-option v-for="item in docList" :key="item.insDoctorId" :label="item.name" :value="item.insDoctorId">
                      </el-option>
                    </el-select>
                  </template>
                </el-col>
              </el-form-item>
              <el-form-item label="文章分类:" :label-width="formLabelWidth" prop="columnId">
                <el-col :span="16">
                  <template>
                    <el-select v-model="addTable.columnId" placeholder="请选择">
                      <el-option v-for="item in leiList" :key="item.columnId" :label="item.columnName" :value="item.columnId">
                      </el-option>
                    </el-select>
                  </template>
                </el-col>
              </el-form-item>
              <el-form-item label="标签:" :label-width="formLabelWidth" class="selectner" prop="tagList">
                <el-col :span="16">
                  <template>
                    <!-- <el-select v-model="addTable.tagList" :multiple-limit="5" multiple placeholder="请选择" filterable>
                      <el-option v-for="(item,index) in value5" :key="index" :label="item.tagName" :value="item.tagId">
                      </el-option>
                    </el-select> -->
                    <el-select filterable v-model="addTable.tagList" :multiple-limit="5" value-key="tagName" multiple
                      :remote-method="remoteMethod" remote :loading="loading"
                                placeholder="请输入标签名搜索并进行选择">
                        <el-option :label="item.tagName" :value="item.tagId" v-for="(item,index) in RemoteOptions"
                                  :key="item.tagName"></el-option>
                    </el-select>
                  </template>
                </el-col>
              </el-form-item>
              <el-form :inline="true" class="inner" :model="addTable">
                <el-form-item label="收藏数" class="m_l_30">
                  <el-input v-model="addTable.initialCollectionNumber" onkeyup="value=value.replace(/[^\d]/g,'')" auto-complete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="阅读数">
                  <el-input v-model="addTable.initialReadingNumber" onkeyup="value=value.replace(/[^\d]/g,'')" auto-complete="off" clearable></el-input>
                </el-form-item>
              </el-form>
            </el-form>
          </el-card>
          <!-- <hr style=" height:1px;border:none;border-top:1px solid  #303133;" />
          <h4>分享信息</h4> -->
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <strong>分享信息</strong>
            </div>
            <!-- <el-form :model="addTable" :rules="rulesNewSec" ref="formNewSec"> -->
            <el-form :model="addTable" ref="formNewSec">
              <el-form-item label="分享图片:" :label-width="formLabelWidth" prop="sharePicture">
                <el-col :span="16">
                  <uploadimg @emitSuccess="handShareSuccessAdd" @emitError="handShareErrorAdd" :imageSrc="addTable.sharePicture"></uploadimg>
                </el-col>
              </el-form-item>
            </el-form>
          </el-card>
          <div class="btn-row">
            <!-- <el-button size="small" type="primary" @click="submitForm('formNew')">确定</el-button> -->
            <el-button size="small" type="primary" @click="_doAdd()">确定</el-button>
            <el-button size="small" type="primary" @click="_doAddCancel()">取消</el-button>
          </div>
        </el-dialog>
        </div>
        <!-- 列表 -->
        <template>
          <el-table :data="tableData" border style="width: 100%" id="app">
            <el-table-column show-overflow-tooltip align="center" prop="columnId" type="index" label="序号" width="50"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="contentId" label="文章id" min-width="50%"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="title" label="名称" min-width="50%"></el-table-column>

            <el-table-column align="center" label="封面" class="TdMargin" min-width="140">
              <template slot-scope="scope">
                <img :src="scope.row.coverPhoto" alt="无图像" height="100" width="100">
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="whetherFree" label="是否付费" min-width="50%">
              <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                      <el-tag size="medium" type="success" v-if="scope.row.whetherFree === 0">否</el-tag>
                      <el-tag size="medium" v-if="scope.row.whetherFree === 1">是</el-tag>
              </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="分类">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium" v-if="scope.row.columnName">{{scope.row.columnName}}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="createTime" label="创建时间"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="lastUpdateTime" label="更新时间"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="onlineTime" label="上线时间"></el-table-column>
            <el-table-column align="center" label="操作" width="312" fixed="right">
              <template slot-scope="scope">
                <el-button v-if="scope.row.contentState  === 2" size="mini" type="success" @click="upLine(scope.$index, scope.row)">上线</el-button>
                <el-button v-if="scope.row.contentState  === 1" size="mini" type="warning" @click="downLine(scope.$index, scope.row)">下线</el-button>
                <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                <el-button size="mini" type="danger" @click="deleteMessage(scope.$index, scope.row)">删除</el-button>
                <el-button size="mini" type="success" @click="previewWindow(scope.$index, scope.row)">预览</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-main>
      <div class="self-page-container">
              <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchParams.currentPage" :page-sizes="[10,20]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
              </el-pagination>
      </div>
    </div>
  </div>

</template>


<script>
import {
  ERR_OK,
  getNewsArticleList, //列表
  saveNewsInfo, //新增
  updateNewsStatus, //状态修改
  getAllArticleTypes, //分类列表
  getIdentDoctors, //认证医生列表
  queryCommTagNameCategoryList, //标签列表
  updataNewsInfo, //编辑视频
  postAllNewTags,//所有标签
  postAlltopics,//所有话题
} from '@/api/api.js'
import headerTop from '@/components/headTop.vue'
import tinymce from '@/components/tinymce.vue'
import uploadimg from '@/components/uploadImg/uploadImgAdd.vue'
import uploadvideo from '@/components/uploadVideo/uploadVideo.vue'
import {preview_path} from "@/config/env.js";
import {IsAlert} from '@/config/mUtils.js';
export default {
  components: {
    headerTop,
    uploadimg,
    uploadvideo,
    tinymce
  },
  data() {
    return {
      RemoteOptions: [],//搜索后下拉框选项
      loading: false,//远程搜索
      Remotelist: [],//远程数据
      topicList: [],//话题数据
      Url: 'http://v0.api.upyun.com/zhangshangtijian',
      value5: [],
      searchParams: {
        time: [],
        startTime: '',
        endTime: '',
        currentPage: 1,
        pageSize: 10,
        title: ''
      },
      //编辑时只许编辑一次的flag
      flag_source:"",
      flag_Cnumber:null,
      flag_Rnumber:null,
      totalCount: 0,
      currentPage: 1, //分页初始页码
      pagesize: 10, //分页初始显示条数
      tableData: [], //列表数据
      leiList: [], //文章分类数据
      docList: [], //认证医生数据
      editTable: {}, //修改单个数据
      addTable: {
        //新增单个数据
        topicId:'',
        whetherFree:0,
        columnId: '',
        content: '',
        contentState: 2,
        contentType: 2,
        coverPhoto: '',
        initialCollectionNumber: 0,
        initialReadingNumber: 1,
        newsType: 1,
        recommendDoctor: [],
        sharePicture: '',
        source: '',
        summary: '',
        tagList: [],
        title: '',
        videoAddress: ''
      }, //新增单个数据
      rulesNew: {
        videoAddress: [
          { required: true, message: '请上传视频', trigger: 'blur' }
        ],
        summary: [{ required: true, message: '请输入正文', trigger: 'blur' }],
        source: [{ required: true, message: '请输入来源', trigger: 'blur' }],
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { max: 30, message: '30字内' }
        ],
        coverPhoto: [
          { required: true, message: '请上传封面', trigger: 'change' }
        ],
        recommendDoctor: [
          { required: true, message: '请选择推荐医生', trigger: 'change' }
        ],
        insDoctorId: [
          { required: true, message: '请选择绑定医生', trigger: 'change' }
        ],
        columnId: [
          { required: true, message: '请选择文章分类', trigger: 'change' }
        ],
        tagList: [
          { required: true, message: '请至少选择一个标签', trigger: 'change' }
        ]
      },
      rulesNewSec: {
        sharePicture: [
          { required: true, message: '请上传分享图片', trigger: 'change' }
        ]
      },
      dialogEditVisible: false, //修改
      dialogAddVisible: false, //新增
      formLabelWidth: '120px'
    }
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
    previewWindow(index, row) {
      let id = row.contentId;
      //window.open('http://10.50.50.14:100/AppAVShare.html#/video/' + id)
      window.open(preview_path+'AppAVShare.html#/video/' + id)
    },
    //编辑模块上传参数设置
    handImgSuccess(res) {
      if (res.status === 200) {
        this.editTable.coverPhoto =
          'http://zhangshangtijian.b0.upaiyun.com' + res.data.url;
      } else {
        IsAlert(res.msg,'错误','error');
      }
    },
    handShareSuccess(res) {
      if (res.status === 200) {
        this.editTable.sharePicture =
          'http://zhangshangtijian.b0.upaiyun.com' + res.data.url;
      } else {
        IsAlert(res.msg,'错误','error');
      }
    },
    handVideoSuccess(res) {
      if (res.status === 200) {
        this.$notify({
            title: '上传成功！',
            duration:1000,
            type: 'success'
          });
        this.editTable.videoAddress = res.data.url;
      } else {
        IsAlert(res.msg,'错误','error');
      }
    },
    handImgError() {},
    handShareError() {},
    handVideoError() {},
    //新增模块上传参数设置
    handImgSuccessAdd(res) {
      if (res.status === 200) {
        this.addTable.coverPhoto =
          'http://zhangshangtijian.b0.upaiyun.com' + res.data.url;
      } else {
        IsAlert(res.msg,'错误','error');
      }
    },
    handShareSuccessAdd(res) {
      if (res.status === 200) {
        this.addTable.sharePicture =
          'http://zhangshangtijian.b0.upaiyun.com' + res.data.url;
      } else {
        IsAlert(res.msg,'错误','error');
      }
    },
    handVideoSuccessAdd(res) {
      if (res.status === 200) {
        this.$notify({
            title: '上传成功！',
            duration:1000,
            type: 'success'
          });
        this.addTable.videoAddress = res.data.url;
      } else {
        IsAlert(res.msg,'错误','error');
      }
    },
    handImgErrorAdd() {},
    handShareErrorAdd() {},
    handVideoErrorAdd() {},
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
    submitForm(formName) {
      // 新增模块表单验证
      let flag1 = false;
      let flag2 = false;
      this.$refs['formNew'].validate(valid => {
        if (valid) {
          flag1 = true;
        } else {
          return false;
        }
      })
      this.$refs['formNewSec'].validate(valid => {
        if (valid) {
          flag2 = true;
        } else {
          return false;
        }
        if (flag1 && flag2) {
          this._doAdd();
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 新增
    handleAdd() {
      this.RemoteOptions = [];
      this.dialogAddVisible = true;
    },
    // 确定新增
    _doAdd() {
      let str = this.addTable.recommendDoctor.join(',');
      this.addTable.recommendDoctor = '';
      this.addTable.recommendDoctor = str;

      let params = {
        whetherFree:this.addTable.whetherFree,
        columnId: this.addTable.columnId,
        content: this.addTable.content,
        topicId: this.addTable.topicId,
        contentState: 2,
        contentType: 2,
        coverPhoto: this.addTable.coverPhoto,
        initialCollectionNumber: this.addTable.initialCollectionNumber,
        initialReadingNumber: this.addTable.initialReadingNumber,
        newsType: 1,
        recommendDoctor: this.addTable.recommendDoctor,
        sharePicture: this.addTable.sharePicture,
        source: this.addTable.source,
        summary: this.addTable.summary,
        tagList: this.addTable.tagList,
        title: this.addTable.title,
        videoAddress: this.addTable.videoAddress
      }
      saveNewsInfo(params).then(response => {
        if (response.code === ERR_OK) {
          this.$message({
              type: 'warning',
              message: '新增成功!'
          });
          this.getList();
          this.handleCloseAdd();
        } else {
          IsAlert(response.msg,'错误','error');
          this.handleCloseAdd();
        }
      }).catch(()=>{
        this.$message.error('网络错误!请稍后重试')
      })

      // this.handleCloseAdd();
    },
    //取消新增
    _doAddCancel() {
      this.$message({
        type: 'warning',
        message: '取消新增'
      })
      this.handleCloseAdd();
    },
    handleCloseAdd() {
      //新增弹窗重置数据
      this.addTable = {
        //重置新增数据为空
        whetherFree:0,
        columnId: '',
        topicId: '',
        content: '',
        contentState: 2,
        contentType: 2,
        coverPhoto: '',
        initialCollectionNumber: 0,
        initialReadingNumber: 1,
        newsType: 1,
        recommendDoctor: [],
        sharePicture: '',
        source: '',
        summary: '',
        tagList: [],
        title: '',
        videoAddress: ''
      }
      this.resetForm('formNew');
      this.resetForm('formNewSec');
      this.getList();
      this.dialogAddVisible = false;
    },

    // 修改
    handleEdit(index, row) {
      this.flag_source=row.source;
      this.flag_Cnumber=row.initialCollectionNumber;
      this.flag_Rnumber=row.initialReadingNumber;

      this.editTable = row;
      this.editTable.tagList = row.tagList ? row.tagList : [];
      this.RemoteOptions = [];//v-for中options的数据，保证编辑弹窗出现后能看到已绑定的标签
      for (let index = 0; index < this.editTable.tagList.length; index++) {
            let obj = {};
            obj = this.value5.find((item)=>{
              return item.tagId === this.editTable.tagList[index];
            });
            this.RemoteOptions.push(obj);
        }
        if (row.recommendDoctor==='') {
          this.editTable.recommendDoctor = [];
        } else {
          let arr = this.editTable.recommendDoctor.split(',');
          this.editTable.recommendDoctor = [];
          this.editTable.recommendDoctor = arr;
        }
      setTimeout(() => {
        this.dialogEditVisible = true;
      }, 100)
    },
    //确定修改
    _doHandleEdit() {
      let str = this.editTable.recommendDoctor.join(',');
      this.editTable.recommendDoctor = '';
      this.editTable.recommendDoctor = str;

      let params = {
        whetherFree:this.editTable.whetherFree,
        author: this.editTable.author,
        columnId: this.editTable.columnId,
        topicId: this.editTable.topicId,
        contentType: 2,
        content: this.editTable.content,
        contentId: this.editTable.contentId,
        coverPhoto: this.editTable.coverPhoto,
        initialCollectionNumber: this.editTable.initialCollectionNumber,
        initialReadingNumber: this.editTable.initialReadingNumber,
        recommendDoctor: this.editTable.recommendDoctor,
        sharePicture: this.editTable.sharePicture,
        source: this.editTable.source,
        summary: this.editTable.summary,
        tagList: this.editTable.tagList,
        title: this.editTable.title,
        videoAddress: this.editTable.videoAddress
      };
      updataNewsInfo(params).then(response => {
        if (response.code === ERR_OK) {
          this.$message({
              type: 'success',
              message: '修改成功!'
          });
          this.getList();
        } else {
          IsAlert(response.msg,'错误','error');
        }
      }).catch(()=>{
        this.$message.error('网络错误!请稍后重试')
      });
      this.handleCloseEdit();
    },
    //取消修改
    _doCancel() {
      this.$message({
        type: 'warning',
        message: '取消修改'
      });
      this.handleCloseEdit();
    },
    handleCloseEdit() {
      //编辑弹窗重置数据
      this.editTable = {
        author: '',
        columnId: '',
        topicId: '',
        content: '',
        contentId: '',
        coverPhoto: '',
        recommendDoctor: '',
        sharePicture: '',
        source: '',
        summary: '',
        tagList: [],
        title: '',
        videoAddress: ''
      };
      this.getList();
      this.dialogEditVisible = false;
    },
    // 删除提示
    deleteMessage(index, row) {
      if (row.contentState == 1) {
        IsAlert('视频还在线，请下线视频！','提示','warning');
      } else {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
          .then(() => {
            let params = {
              contentId: row.contentId,
              contentState: 0
            };
            updateNewsStatus(params).then(response => {
              if (response.code === ERR_OK) {
                this.$notify({
                    title: '成功',
                    message: `删除成功！`,
                    type: 'success'
                });
              } else {
                IsAlert(response.msg,'错误','error');
              }
              this.getList();
            }).catch(()=>{
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
    // 上线提示
    upLine(index, row) {

      if (
        !row.title ||
        !row.videoAddress ||
        !row.coverPhoto ||
        !row.source ||
        !row.sharePicture ||
        // row.tagList.length === 0 ||
        !row.tagList ||
        !row.initialReadingNumber ||
        !row.columnName
      ) {
        IsAlert('请编辑完成后再上线','提示','warning');
        return;
      }

      this.$confirm('此操作将上线视频, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          let params = {
            contentId: row.contentId,
            source:row.source,
            title:row.title,
            contentState: 1
          };
          updateNewsStatus(params).then(response => {
            if (response.code === ERR_OK) {
              this.$notify({
                  title: '成功',
                  message: `已上线视频！`,
                  type: 'success'
              });
            } else {
              IsAlert(response.msg,'错误','error');
            }
            this.getList();
          }).catch(()=>{
            this.$message.error('网络错误!请稍后重试')
          })
        })
        .catch(() => {
          this.$message({
            type: 'warning ',
            message: '已取消上线视频'
          })
        })
    },
    // 下线提示
    downLine(index, row) {
      this.$confirm('此操作将下线视频, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          let params = {
            contentId: row.contentId,
            source:row.source,
            title:row.title,
            contentState: 2
          };
          updateNewsStatus(params).then(response => {
            if (response.code === ERR_OK) {
              this.$notify({
                  title: '成功',
                  message: `已下线视频！`,
                  type: 'success'
              });
            } else {
              IsAlert(response.msg,'错误','error');
            }
            this.getList();
          }).catch(()=>{
            this.$message.error('网络错误!请稍后重试')
          });
        })
        .catch(() => {
          this.$message({
            type: 'warning ',
            message: '已取消下线视频'
          });
        })
    },
    //获取分类列表
    getLeiList() {
      let params = {};
      getAllArticleTypes(params).then(response => {
        if (response.code === ERR_OK) {
          this.leiList = [];
          this.leiList = response.data;
        } else {
          IsAlert('获取分类列表失败！','错误','error');
        }
      }).catch(()=>{
        this.$message.error('网络错误!请稍后重试')
      });
    },
    //获取认证医生列表
    getDocList() {
      let params = {};
      getIdentDoctors(params).then(response => {
        if (response.code === ERR_OK) {
          this.docList = [];
          this.docList = response.data;
        } else {
          IsAlert('获取认证医生列表失败！','错误','error');
        }
      }).catch(()=>{
        this.$message.error('网络错误!请稍后重试')
      });
    },
    //获取视频列表
    getList() {
      let params = {
        contentType: 2,
        onLineStartDate: this.searchParams.startTime,
        onLineEndDate: this.searchParams.endTime,
        currentPage: this.searchParams.currentPage,
        pageSize: this.searchParams.pageSize,
        newsType: 1,
        idTitle: this.searchParams.title
      };
      getNewsArticleList(params).then(response => {
        if (response.code === ERR_OK) {
          this.tableData = response.data.list;
          this.totalCount = response.data.totalCount;
        } else {
          IsAlert(response.msg,'错误','error');
        }
      }).catch(()=>{
        this.$message.error('网络错误!请稍后重试')
      });
      
    },
    getAllTagsList(){
      let paramsNone = {};
      postAllNewTags(paramsNone).then(response => {//获取所有标签
        if (response.code === ERR_OK) {
          this.value5 = response.data;
          this.Remotelist = this.value5.map(item => {
            return { tagId: item.tagId, tagName: item.tagName };
          });
        } else {
          IsAlert('获取标签列表失败！','错误','error');
        }
      }).catch(()=>{
        this.$message.error('网络错误!请稍后重试')
      })
    },
    //获取所有话题列表
      getAllTopics: function () {
        let params = {
        };
        postAlltopics(params).then(res => {
          if (res.code === ERR_OK) {
            this.topicList = res.data;
          } else {
            IsAlert(res.msg,'错误','error');
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试');
        })
      },
  },
  activated: function() {
    this.getList();
    this.getLeiList();
    this.getDocList();
    this.getAllTopics();
    this.getAllTagsList();
  }
}
</script>

<style lang="less" scoped>
.minwidth {
  min-width: 200px;
}
.el-checkbox {
  margin-left: 20px;
}
.m_l_15 {
  margin-left: 15px;
}
.btn-row {
  text-align: center;
  padding-top: 20px;
}
.el-header,
.el-main {
  padding: 0;
}
.m_l_30 {
  margin-left: 65px;
}
</style>
<style  lang="less">
.inner {
  .el-input__inner {
    width: 100px;
  }
}
.selectner {
  .el-input__inner {
    width: 500px;
    border: 0;
  }
  .el-input__suffix {
    display: none;
  }
}
.TdMargin {
  .el-table_1_column_3 {
    margin: 0;
  }
}
.box-card {
  margin-bottom: 20px;
}
</style>

