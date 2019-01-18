<template>
  <div class="page-wrapper">
    <header-top></header-top>

    <div class="page-container">
      <el-form :inline="true" :model="searchParams" class="demo-form-inline">
        <el-form-item label="名称：">
          <el-input placeholder="请输入专题/话题名称" v-model="searchParams.title" clearable></el-input>
        </el-form-item>
        <el-form-item label="简介：" v-if="tabIndex==='2'">
          <el-input placeholder="请输入话题简介" v-model="searchParams.intro" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态：" v-if="tabIndex==='1'">
          <el-select v-model="searchParams.contentState" clearable placeholder="选择状态">
            <el-option label="上线" :value="1"></el-option>
            <el-option label="下线" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doSearch">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="showAddDialog">新增</el-button>
        </el-form-item>
      </el-form>
      <!--tab-->
      <el-tabs v-model="tabIndex">
        <el-tab-pane label="话题管理" name="2">
          <el-table :data="dataList" border style="width: 100%" class="ZTMargin">
            <el-table-column align="center" show-overflow-tooltip prop="" label="序号" width="60" type="index"></el-table-column>
            <el-table-column align="center" show-overflow-tooltip prop="id" label="话题id"></el-table-column>
            <el-table-column align="center" show-overflow-tooltip prop="labels" label="标签名称"></el-table-column>
            <el-table-column align="center" show-overflow-tooltip prop="name" label="话题名称"></el-table-column>
            <el-table-column align="center" show-overflow-tooltip prop="intro" label="话题简介"></el-table-column>
            <el-table-column align="center" prop="coverUrl" label="封面" min-width="150px">
              <template slot-scope="scope">
                    <img :src="scope.row.coverUrl" alt="无图像" height="100" width="100">
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip prop="subscribeNum" label="订阅数"></el-table-column>
            <el-table-column align="center" show-overflow-tooltip prop="videoNum" label="绑定视频数"></el-table-column>
            <el-table-column align="center" show-overflow-tooltip prop="lastUpdateTime" label="更新时间"></el-table-column>
            <el-table-column align="center" show-overflow-tooltip prop="createTime" label="创建时间"></el-table-column>
            <el-table-column align="center" label="操作" width="280" fixed='right'>
              <template slot-scope="scope">
                <el-button size="mini" type="danger" v-if="scope.row.onLineStatus===0" @click="upLineFn(scope.row)">上线
                </el-button>
                <el-button size="mini" type="success" v-if="scope.row.onLineStatus===1" @click="downLineFn(scope.row)">下线
                </el-button>
                <el-button size="mini" type="primary"
                          @click="showEditorDialog(scope.row)">编辑
                </el-button>
                <el-button size="mini" type="danger" @click="deleteFn(scope.row)">移除
                </el-button>
                <el-button size="mini" type="success"
                          @click="showVideoListDialog(scope.row)">查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="专题管理" name="1">
          <el-table :data="dataList" border style="width: 100%" class="ZTMargin">
            <el-table-column align="center" show-overflow-tooltip prop="" label="序号" width="60" type="index"></el-table-column>
            <el-table-column align="center" show-overflow-tooltip prop="contentId" label="专题id"></el-table-column>
            <el-table-column align="center" show-overflow-tooltip prop="title" label="名称"></el-table-column>
            <el-table-column align="center" prop="coverPhoto" label="封面" min-width="150px">
              <template slot-scope="scope">
                    <img :src="scope.row.coverPhoto" alt="无图像" height="100" width="100">
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip prop="lastUpdateTime" label="更新时间"></el-table-column>
            <el-table-column align="center" show-overflow-tooltip prop="createTime" label="创建时间"></el-table-column>
            <el-table-column align="center" label="操作" width="200px">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" v-if="scope.row.contentState===2" @click="upLineFnZT(scope.row)">上线
                </el-button>
                <el-button size="mini" type="success" v-if="scope.row.contentState===1" @click="downLineFnZT(scope.row)">下线
                </el-button>
                <el-button size="mini" type="primary"
                          @click="showEditorDialogZT(scope.row)">编辑
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div class="self-page-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="searchParams.currentPage" :page-sizes="[10,20]" :page-size="searchParams.pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
    </div>

    <!--新增话题的dialog-->
    <div v-if="addTable.isShowDialog">
      <el-dialog title="新增话题：" :visible.sync="addTable.isShowDialog" width=800px :before-close="handleCloseAdd">
        <el-form :model="addTable" :rules="rulesNew" ref="formNew">
          <el-form-item label="标签名称：" :label-width="formLabelWidth" prop="labels">
            <el-col :span="16">
              <!-- <el-select v-model="addTable.labels" placeholder="请选择" filterable style="width:100%">
                    <el-option v-for="(item,index) in subTags" :key="index" :label="item.tagName" :value="item.tagName">
                    </el-option>
              </el-select> -->
            <el-select filterable v-model="addTable.labels" value-key="tagName"
                :remote-method="remoteMethod" remote :loading="loading" placeholder="请输入标签名搜索并进行选择" style="width:100%">
                  <el-option :label="item.tagName" :value="item.tagName" v-for="(item,index) in RemoteOptions" :key="item.tagName"></el-option>
            </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="话题名称：" :label-width="formLabelWidth" prop="name">
            <el-col :span="16">
              <el-input type="textarea" id="TopicDesHeight"  resize="none" v-model="addTable.name" :autosize='{minRows:1}'></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="话题简介：" :label-width="formLabelWidth" prop="intro">
            <el-col :span="16">
              <el-input type="textarea" id="TopicDesHeight2"  resize="none" v-model="addTable.intro" :autosize='{minRows:1}'></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="话题ID：" :label-width="formLabelWidth">
            <el-col :span="16">
              {{addTable.id}}
            </el-col>
          </el-form-item>
          <el-form-item label="详情大图：" :label-width="formLabelWidth" prop="coverUrl">
            <uploadimg @emitSuccess="handImgSuccess" @emitError="handImgError" :imageSrc="addTable.coverUrl"></uploadimg>
          </el-form-item>
          <el-form-item label="列表小图：" :label-width="formLabelWidth" prop="sharePicUrl">
            <uploadimg @emitSuccess="handShareSuccess" @emitError="handImgError" :imageSrc="addTable.sharePicUrl"></uploadimg>
          </el-form-item>
          <el-form-item class="is-required" label="" :label-width="formLabelWidth">
            <template slot-scope="scope">
                <el-radio v-model="addTable.isPay" :label='1'>付费</el-radio>
                <el-radio v-model="addTable.isPay" :label='0'>免费</el-radio>
                <el-radio v-model="addTable.isPay" :label='2'>不限</el-radio>
            </template>
          </el-form-item>
          <el-form-item label="推荐医生：" :label-width="formLabelWidth" prop="recommendDoctor">
            <el-col :span="16">
              <el-select v-model="addTable.recommendDoctor" filterable multiple collapse-tags  placeholder="请选择" style="width:100%">
                    <el-option v-for="item in allDoctorList" :key="item.insDoctorId" :label="item.name" :value="item.insDoctorId">
                    </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="订阅数：" :label-width="formLabelWidth" prop="subscribeNum">
            <el-col :span="16" class="m_b_15">
             <el-input-number v-model="addTable.subscribeNum" :precision="0"></el-input-number>
            </el-col>
         </el-form-item>
          <el-form-item label="正文：" :label-width="formLabelWidth" prop="content">
            <el-col :span="23">
              <tinymce v-model="addTable.content" :url="Url" :with-credentials='false' :editorHeight='200'></tinymce>
            </el-col>
          </el-form-item>
        
        </el-form>
        <div class="btn-row">
          <el-button size="small" type="default" @click="addCancel">取消</el-button>
          <el-button size="small" type="primary" @click="saveNewsFn">确定</el-button>
        </div>
      </el-dialog>

    </div>
    <!--编辑话题的dialog-->
    <div v-if="editShowDialog">
      <el-dialog title="编辑话题" :visible.sync="editShowDialog" width="800px">
        <el-form :model="editTable" :rules="rulesNew" ref="formNew">
          <el-form-item label="标签名称：" :label-width="formLabelWidth" prop="labels">
            <el-col :span="16">
              <!-- <el-select v-model="editTable.labels" placeholder="请选择" filterable style="width:100%" disabled>
                    <el-option v-for="(item,index) in subTags" :key="index" :label="item.tagName" :value="item.tagName">
                    </el-option>
              </el-select> -->
            <el-select filterable v-model="editTable.labels" value-key="tagName" disabled
                :remote-method="remoteMethod" remote :loading="loading" style="width:100%">
                  <el-option :label="item.tagName" :value="item.tagName" v-for="(item,index) in RemoteOptions" :key="item.tagName"></el-option>
            </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="话题名称：" :label-width="formLabelWidth" prop="name">
            <el-col :span="16">
              <el-input type="textarea" id="TopicDesHeight3"  resize="none" v-model="editTable.name" :autosize='{minRows:1}'></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="话题简介：" :label-width="formLabelWidth" prop="intro">
            <el-col :span="16">
              <el-input type="textarea" id="TopicDesHeight4"  resize="none" v-model="editTable.intro" :autosize='{minRows:1}'></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="话题ID：" :label-width="formLabelWidth">
            <el-col :span="16">
              {{editTable.id}}
            </el-col>
          </el-form-item>
          <el-form-item label="详情大图：" :label-width="formLabelWidth" prop="coverUrl">
            <uploadimg @emitSuccess="handEditorImgSuccess" @emitError="handImgError" :imageSrc="editTable.coverUrl"></uploadimg>
          </el-form-item>
          <el-form-item label="列表小图：" :label-width="formLabelWidth" prop="sharePicUrl">
            <uploadimg @emitSuccess="handEditorShareSuccess" @emitError="handImgError" :imageSrc="editTable.sharePicUrl"></uploadimg>
          </el-form-item>
          <el-form-item class="is-required" label="" :label-width="formLabelWidth">
            <template slot-scope="scope">
                <el-radio v-model="editTable.isPay" :label='1'>付费</el-radio>
                <el-radio v-model="editTable.isPay" :label='0'>免费</el-radio>
                <el-radio v-model="editTable.isPay" :label='2'>不限</el-radio>
            </template>
          </el-form-item><el-form-item label="推荐医生：" :label-width="formLabelWidth" prop="recommendDoctor">
            <el-col :span="16">
              <el-select v-model="editTable.recommendDoctor" filterable multiple collapse-tags  placeholder="请选择" style="width:100%">
                    <el-option v-for="item in allDoctorList" :key="item.insDoctorId" :label="item.name" :value="item.insDoctorId">
                    </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="订阅数：" :label-width="formLabelWidth" prop="subscribeNum">
            <el-col :span="16" class="m_b_15">
             <el-input-number v-model="editTable.subscribeNum" :precision="0" disabled></el-input-number>
            </el-col>
         </el-form-item>
          <el-form-item label="正文：" :label-width="formLabelWidth" prop="content">
            <el-col :span="23">
              <tinymce v-model="editTable.content" :url="Url" :with-credentials='false' :editorHeight='200'></tinymce>
            </el-col>
          </el-form-item>
        
        </el-form>
        <div class="btn-row">
          <el-button size="small" type="default" @click="addCancel2">取消</el-button>
          <el-button size="small" type="primary" @click="saveNewsFn2">确定</el-button>
        </div>
      </el-dialog>
    </div>
    <!--查看话题绑定视频列表-->
    <div v-if="editShowVideoDialog">
      <el-dialog title="查看话题绑定视频" :visible.sync="editShowVideoDialog" width="600px">
        <template>
            <el-card  class="box-card-down" v-for="(item, index) in editVideoTable" :key="index">
                <el-tag> {{item.title }}</el-tag>
                <!-- <span>标题: </span>
                {{item.title }}
                <br> -->
                <!-- <span>版本名称: </span>
                {{item.versionName }}
                <br>
                <span>OSType: </span>
                {{item.osType }}
                <br>
                <span>Status: </span>
                {{item.status }}
                <br>
                <span>下载地址: </span>
                {{item.downLink }}
                <br>
                <span>apk下载地址: </span>
                {{item.apkDownLink }}
                <br> -->
            </el-card>
            <el-card v-if="editVideoTable.length===0" class="box-card-down">
              <el-tag>该话题无绑定视频！</el-tag>
            </el-card>
          </template>
      </el-dialog>
    </div>
    <!--新增专题-->
    <div v-if="addTable_ZT.isShowDialog">
      <el-dialog title="新增专题：" :visible.sync="addTable_ZT.isShowDialog" width=800px :before-close="handleCloseAddZT">
        <el-form :model="addTable_ZT" ref="formNewZT">
          <el-form-item label="名称：" :label-width="formLabelWidth" prop="title">
            <el-col :span="16">
              <el-input v-model="addTable_ZT.title" placeholder="请输入专题名称" maxlength="30" clearable></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="封面：" :label-width="formLabelWidth" prop="coverPhoto">
            <uploadimg @emitSuccess="handImgSuccessZT" @emitError="handImgError" :imageSrc="addTable_ZT.coverPhoto"></uploadimg>
          </el-form-item>
          <!-- <el-form-item label="分享图片：" :label-width="formLabelWidth" prop="sharePicture">
            <uploadimg @emitSuccess="handImgSuccessShareZT" @emitError="handImgError" :imageSrc="addTable_ZT.sharePicture"></uploadimg>
          </el-form-item> -->
          <el-form-item label="阅读数：" :label-width="formLabelWidth" prop="initialReadingNumber">
            <el-col :span="16" class="m_b_15">
             <el-input-number v-model="addTable_ZT.initialReadingNumber" :precision="0"></el-input-number>
            </el-col>
         </el-form-item>
         <el-form-item label="正文：" :label-width="formLabelWidth" prop="content">
            <el-col :span="23">
              <tinymce v-model="addTable_ZT.content" :url="Url" :with-credentials='false' :editorHeight='200'></tinymce>
            </el-col>
          </el-form-item>
          </el-form-item>
          <el-form-item label="标签：" :label-width="formLabelWidth">
            <el-col :span="16">
            <!-- <el-select filterable v-model="addTable_ZT.tagList" multiple :multiple-limit="5" placeholder="请选择标签" style="width:100%">
              <el-option :label="item.tagName" :value="item.tagId" v-for="(item,index) in subTags" :key="index"></el-option>
            </el-select> -->
            <el-select filterable v-model="addTable_ZT.tagList" :multiple-limit="5" value-key="tagName" multiple
                :remote-method="remoteMethod" remote :loading="loading" placeholder="请输入标签名搜索并进行选择" style="width:100%">
                  <el-option :label="item.tagName" :value="item.tagId" v-for="(item,index) in RemoteOptions" :key="item.tagName"></el-option>
            </el-select>
            </el-col>
          </el-form-item>
        </el-form>
        <div class="btn-row">
          <el-button size="small" type="default" @click="handleCloseAddZT">取消</el-button>
          <el-button size="small" type="primary" @click="saveNewsFn_ZT">保存</el-button>
        </div>
      </el-dialog>

    </div>
    
    <!--编辑专题-->
    <div v-if="editShowDialogZT">
      <el-dialog title="编辑专题" :visible.sync="editShowDialogZT" width="80%">
        <el-form :model="editTableZT" ref="formNewZT">
          <el-form-item label="名称：" :label-width="formLabelWidth" prop="title">
            <el-col :span="16">
              <el-input v-model="editTableZT.title" placeholder="请输入专题名称" maxlength="100" clearable></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="封面：" :label-width="formLabelWidth" prop="coverPhoto">
            <uploadimg @emitSuccess="EdithandImgSuccessZT" @emitError="handImgError" :imageSrc="editTableZT.coverPhoto"></uploadimg>
          </el-form-item>
          <!-- <el-form-item label="分享图片：" :label-width="formLabelWidth" prop="sharePicture">
            <uploadimg @emitSuccess="EditImgSuccessShareZT" @emitError="handImgError" :imageSrc="editTableZT.sharePicture"></uploadimg>
          </el-form-item> -->
          <el-form-item label="阅读数：" :label-width="formLabelWidth" prop="initialReadingNumber">
            <el-col :span="16" class="m_b_15">
             <el-input-number v-model="editTableZT.initialReadingNumber" :precision="0" disabled></el-input-number>
            </el-col>
         </el-form-item>
         <el-form-item label="正文：" :label-width="formLabelWidth" prop="content">
            <el-col :span="23">
              <tinymce v-model="editTableZT.content" :url="Url" :with-credentials='false' :editorHeight='200'></tinymce>
            </el-col>
          </el-form-item>
          </el-form-item>
          <el-form-item label="标签：" :label-width="formLabelWidth">
            <el-col :span="16">
            <!-- <el-select filterable v-model="editTableZT.tagList" multiple :multiple-limit="5" placeholder="请选择标签" style="width:100%">
              <el-option :label="item.tagName" :value="item.tagId" v-for="(item,index) in subTags" :key="index"></el-option>
            </el-select> -->
            <el-select filterable v-model="editTableZT.tagList" :multiple-limit="5" value-key="tagName" multiple
                :remote-method="remoteMethod" remote :loading="loading" placeholder="请输入标签名搜索并进行选择" style="width:100%">
                  <el-option :label="item.tagName" :value="item.tagId" v-for="(item,index) in RemoteOptions" :key="item.tagName"></el-option>
            </el-select>
            </el-col>
          </el-form-item>
        </el-form>
        <div class="btn-row">
          <el-button size="small" type="default" @click="editShowDialogZT = false">取消</el-button>
          <el-button size="small" type="primary" @click="saveNewsFn2ZT">保存</el-button>
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
    getNewTopicList,
    getIdentDoctors,
    postSaveTopic,
    postDeleteTopic,
    getAllArticleTypes,
    getSubTagCategory,
    postModifyTopic,
    GetSupplierSelect,
    postQueryTopic,
    postTopicOnLine,
    getNewSubjectList,
    postSaveSubject,
    postModifySubject,
    postQuerySubject,
    postSubjectOnLine,
    queryCommTagNameCategoryList,
    queryCommTagCategoryList,
    getNewTagsList,
    postAllNewTags,
    postQueryTopicVideo,
    ERR_OK
  } from '@/api/api.js'

  export default {
    data() {
      return {
        RemoteOptions: [],//搜索后下拉框选项
        loading: false,
        Remotelist: [],//远程数据
        SupplierList: [], //所有标签数据
        formLabelWidth: '140px',
        Url: 'http://v0.api.upyun.com/zhangshangtijian',
        tabIndex: '2',
        totalCount: 0,
        subTags: [], //所有标签
        allDoctorList: [], //所有医生
        editVideoTable:[],
        editShowDialog:false,
        editShowDialogZT:false,
        editShowVideoDialog:false,//查看话题绑定视频列表
        addTable: {//话题
          isShowDialog: false,
          id:'',
          content: "",//正文
          coverUrl: "",//封面地址
          isPay: 0,//是否付费：0=否；1=是；2=不限 ,
          labels: "",//标签名称 
          name: "",//话题名称 ,
          recommendDoctor: [],// 推荐医生
          sharePicUrl: "",//分享图片地址 ,
          subscribeNum: 0,//订阅数
        },
        addTable_ZT: {//专题
          isShowDialog: false,
          content: "",//正文 ,
          coverPhoto: "",//封面图片 ,
          initialReadingNumber: 0,// 初始阅读数 ,
          sharePicture: "",//分享图片 ,
          tagList: [],// 绑定标签 ,
          title: ""//名称
        },
        editTable: {
          id:'',
          onLineStatus:0,
          content: "",//正文
          coverUrl: "",//封面地址
          isPay: 0,//是否付费：0=否；1=是；2=不限 ,
          labels: "",//标签名称 
          name: "",//话题名称 ,
          recommendDoctor: '',// 推荐医生
          sharePicUrl: "",//分享图片地址 ,
          subscribeNum: 0,//订阅数
        },
        editTableZT:{
            content: "",
            contentId: "",
            coverPhoto: "",
            initialReadingNumber: 0,
            sharePicture: "",
            tagList: [],
            title: ""
        },
        dataList: [],
        searchParams: {
          currentPage: 1,
          pageSize: 10,
          title: '',
          intro: '',
          contentState:null//内容状态（上线：1；下线：2；删除：0） ,
        },
        rulesNew: {
          productName: [
            {required: true, message: '请填写商品名称', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '请填写正文', trigger: 'change'}
          ],
          sharePicUrl: [
            {required: true, message: '请上传分享图片', trigger: 'blur'}
          ],
          coverUrl: [
            {required: true, message: '请上传封面', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请填写名称', trigger: 'blur'}
          ],
          intro: [
            {required: true, message: '请填写简介', trigger: 'blur'}
          ],
          recommendDoctor: [
            {required: true, message: '请选择推荐医生', trigger: 'change'}
          ],
          labels: [
            {required: true, message: '请选择标签', trigger: 'blur'}
          ],
          subscribeNum: [
            {required: true, message: '请填写初始订阅数', trigger: 'blur'}
          ],
        },
      }
    },

    components: {
      headerTop,
      tinymce,
      uploadimg
    },

    methods: {
      /* 标签远程搜索———————————————————————————————————— */
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
      /* 话题———————————————————————————————————— */
      saveNewsFn() {//新增话题
        this.RemoteOptions = ''
        let params = {
          id:'',
          content: this.addTable.content,//正文
          coverUrl: this.addTable.coverUrl,//封面地址
          isPay: this.addTable.isPay,//是否付费：0=否；1=是；2=不限 ,
          labels: this.addTable.labels,//标签名称 
          name: this.addTable.name,//话题名称 ,
          intro: this.addTable.intro,//话题简介 ,
          recommendDoctor: this.addTable.recommendDoctor+'',// 推荐医生
          sharePicUrl: this.addTable.sharePicUrl,//分享图片地址 ,
          subscribeNum: this.addTable.subscribeNum,//订阅数
        };

        postSaveTopic(params).then(res => {
          if (res.code === ERR_OK) {
            this.handleCloseAdd();
            IsAlert(res.msg,'成功','success');
            this.getListData();
          } else {
            IsAlert(res.msg,'错误','error');
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        })
      },
      showVideoListDialog(item) {//显示话题查看视频绑定列表Dialog
        let params = {
          currentPage: 1,
          pageSize: 10000,
          topicId: item.id
        }
        postQueryTopicVideo(params).then(res => {
          if (res.code === ERR_OK) {
            this.editShowVideoDialog = true;
            this.editVideoTable = res.data.list;
          } else {
            IsAlert(res.msg,'错误','error');
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        })
      },
      showEditorDialog(item) {//显示话题编辑Dialog
        let params = {
          id:item.id
        }
        postQueryTopic(params).then(res => {
          if (res.code === ERR_OK) {
            this.editShowDialog = true;
            this.editTable = res.data;
            this.editTable.recommendDoctor = res.data.recommendDoctor!==''?res.data.recommendDoctor.split(','):[];
            this.RemoteOptions = [];//v-for中options的数据，保证编辑弹窗出现后能看到已绑定的标签
            let obj = {};
            obj = this.subTags.find((item)=>{
              return item.tagName === this.editTable.labels;
            });
            this.RemoteOptions.push(obj);
          } else {
            IsAlert(res.msg,'错误','error');
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        })
      },
      saveNewsFn2() {//编辑话题
        let params = {
          onLineStatus:this.editTable.onLineStatus,// 是否上架状态：0=否；1=是 ,
          id:this.editTable.id,
          content: this.editTable.content,//正文
          coverUrl: this.editTable.coverUrl,//封面地址
          isPay: this.editTable.isPay,//是否付费：0=否；1=是；2=不限 ,
          labels: this.editTable.labels,//标签名称 
          name: this.editTable.name,//话题名称 ,
          intro: this.editTable.intro,//话题简介 ,
          recommendDoctor: this.editTable.recommendDoctor+'',// 推荐医生
          sharePicUrl: this.editTable.sharePicUrl,//分享图片地址 ,
          subscribeNum: this.editTable.subscribeNum,//订阅数
        }

        postModifyTopic(params).then(res => {
          if (res.code === ERR_OK) {
            this.editShowDialog = false;
            IsAlert(res.msg,'成功','success');
            this.getListData();
          } else {
            IsAlert(res.msg,'错误','error');
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        })
      },
      handleCloseAdd() {//话题新增弹窗重置数据
        this.addTable = {
          isShowDialog: false,
          id:'',
          content: "",//正文
          coverUrl: "",//封面地址
          isPay: 0,//是否付费：0=否；1=是；2=不限 ,
          labels: "",//标签名称 
          name: "",//话题名称 ,
          recommendDoctor: [],// 推荐医生
          sharePicUrl: "",//分享图片地址 ,
          subscribeNum: 0,//订阅数
        }

      },
      upLineFn(item) { //上线话题
        let params = {
          id:item.id
        }
        postQueryTopic(params).then(res => {
          if (res.code === ERR_OK) {
            this.editTable = res.data;
            if (
              !this.editTable.content ||
              !this.editTable.coverUrl ||
              !this.editTable.labels ||
              !this.editTable.name
              // !this.editTable.sharePicUrl
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
                  id: item.id,
                  onLineStatus: 1
                };
                postTopicOnLine(params).then(res => {
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
                  message: '已取消上线'
                });
              })
          } else {
            IsAlert(res.msg,'错误','error');
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        })
        
      },
      downLineFn(row) {//下线话题
        this.$confirm('确定下线吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
          .then(_ => {
            let params = {
              id: row.id,
              onLineStatus: 0
            };
            postTopicOnLine(params)
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
      deleteFn(row) {//删除话题
        if (row.onLineStatus == 1) {
          IsAlert('请先下线！','提示','warning');
        } else {
          this.$confirm('确定要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error',
          center: true
        }).then(_ => {
              let params = {
                id: row.id,
              }
              postDeleteTopic(params)
                .then(res => {
                  if (res.code === ERR_OK) {
                    this.$notify({
                      title: '成功',
                      message: `删除成功！`,
                      type: 'success'
                    });
                    this.getListData();
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
      //话题图像处理
      //新增封面
      handImgSuccess(res) {
        if (res.status === 200) {
          this.addTable.coverUrl =
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
      //编辑封面
      handEditorImgSuccess(res) {
        if (res.status === 200) {
          this.editTable.coverUrl =
            'http://zhangshangtijian.b0.upaiyun.com' + res.data.url
        } else {
          IsAlert(res.msg,'错误','error');
        }
      },
      //新增分享
      handShareSuccess(res) {
        if (res.status === 200) {
          this.addTable.sharePicUrl =
            'http://zhangshangtijian.b0.upaiyun.com' + res.data.url
        } else {
          IsAlert(res.msg,'错误','error');
        }
      },
      handEditorShareSuccess(res) {
        if (res.status === 200) {
          this.editTable.sharePicUrl =
            'http://zhangshangtijian.b0.upaiyun.com' + res.data.url
        } else {
          IsAlert(res.msg,'错误','error');
        }
      },


      /* 专题—————————————————————————————————————— */
      saveNewsFn_ZT() {//新增专题
        let params = {
          content: this.addTable_ZT.content,//正文 ,
          coverPhoto: this.addTable_ZT.coverPhoto,//封面图片 ,
          initialReadingNumber: this.addTable_ZT.initialReadingNumber,// 初始阅读数 ,
          sharePicture: this.addTable_ZT.sharePicture,//分享图片 ,
          tagList: this.addTable_ZT.tagList,// 绑定标签 ,
          title:this.addTable_ZT.title//名称
        };

        postSaveSubject(params).then(res => {
          if (res.code === ERR_OK) {
            this.handleCloseAddZT();
            IsAlert(res.msg,'成功','success');
            this.getListData();
          } else {
            IsAlert(res.msg,'错误','error');
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        })
      },
      handleCloseAddZT() {//专题新增弹窗重置数据
        this.RemoteOptions = [];
        this.addTable_ZT = {//专题
          isShowDialog: false,
          content: "",//正文 ,
          coverPhoto: "",//封面图片 ,
          initialReadingNumber: 0,// 初始阅读数 ,
          sharePicture: "",//分享图片 ,
          tagList: [],// 绑定标签 ,
          title: ""//名称
        }
      },
      showEditorDialogZT(item) {//显示专题编辑
        let params = {
          id:item.contentId
        }
        postQuerySubject(params).then(res => {
          if (res.code === ERR_OK) {
            let arr = res.data.tagList;
            this.editTableZT = res.data;
            this.editTableZT.tagList = [];
            for (let index = 0; index < arr.length; index++) {
              this.editTableZT.tagList.push(arr[index].tagId)
            }
            this.RemoteOptions = [];//v-for中options的数据，保证编辑弹窗出现后能看到已绑定的标签
            for (let index = 0; index < this.editTableZT.tagList.length; index++) {
                  let obj = {};
                  obj = this.subTags.find((item)=>{
                    return item.tagId === this.editTableZT.tagList[index];
                  });
                  this.RemoteOptions.push(obj);
              }
          } else {
            IsAlert(res.msg,'错误','error');
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        })
        this.editShowDialogZT = true;
      },
      saveNewsFn2ZT() {//编辑专题
        let params = {
          content: this.editTableZT.content,
          contentId: this.editTableZT.contentId,
          coverPhoto: this.editTableZT.coverPhoto,
          initialReadingNumber: this.editTableZT.initialReadingNumber,
          sharePicture: this.editTableZT.sharePicture,
          tagList: this.editTableZT.tagList,
          title: this.editTableZT.title
        }

        postModifySubject(params).then(res => {
          if (res.code === ERR_OK) {
            this.editShowDialogZT = false;
            IsAlert(res.msg,'成功','success');
            this.getListData();
          } else {
            IsAlert(res.msg,'错误','error');
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        })
      },
      upLineFnZT(item) {//上线专题
        let params = {
          id:item.contentId,
        }
        postQuerySubject(params).then(res => {
          if (res.code === ERR_OK) {
            this.editTableZT = res.data;
            if (
              !this.editTableZT.content ||
              !this.editTableZT.coverPhoto ||
              // !this.editTableZT.sharePicture ||
              !this.editTableZT.tagList ||
              !this.editTableZT.title
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
                  id: item.contentId,
                  onLineStatus:1
                };
                postSubjectOnLine(params).then(res => {
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
                  message: '已取消上线'
                });
              })
          } else {
            IsAlert(res.msg,'错误','error');
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        })
        
      },
      downLineFnZT(row) {//下线专题
        this.$confirm('确定下线吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
          .then(_ => {
            let params = {
              id: row.contentId,
              onLineStatus: 2
            };
            postSubjectOnLine(params)
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
      //专题图像处理
      handImgSuccessZT(res) {//新增封面
        if (res.status === 200) {
          this.addTable_ZT.coverPhoto =
            'http://zhangshangtijian.b0.upaiyun.com' + res.data.url
        } else {
          IsAlert(res.msg,'错误','error');
        }
      },
      handImgSuccessShareZT(res) {//新增分享图片
        if (res.status === 200) {
          this.addTable_ZT.sharePicture =
            'http://zhangshangtijian.b0.upaiyun.com' + res.data.url
        } else {
          IsAlert(res.msg,'错误','error');
        }
      },
      EdithandImgSuccessZT(res) {//编辑封面
        if (res.status === 200) {
          this.editTableZT.coverPhoto =
            'http://zhangshangtijian.b0.upaiyun.com' + res.data.url
        } else {
          IsAlert(res.msg,'错误','error');
        }
      },
      EditImgSuccessShareZT(res) {//编辑分享图片
        if (res.status === 200) {
          this.editTableZT.sharePicture =
            'http://zhangshangtijian.b0.upaiyun.com' + res.data.url
        } else {
          IsAlert(res.msg,'错误','error');
        }
      },

      /* 基础方法—————————————————————————————————————— */

      submitForm(formName) {//新增模块表单验证
          this.$refs[formName].validate(valid => {
          if (valid) {
              this.saveNewsFn();
              this.getListData();
          } else {
              return false;
          }
          ;
          });
      },
      getSupSelect() {//获取供应商下拉菜单
        let params = {"institutionCategory": "2",};
        GetSupplierSelect(params).then(response => {
          if (response.code === ERR_OK) {
            this.SupplierList = [];
            this.SupplierList = response.data;
          } else {
            IsAlert('获取供应商列表失败！','提示','warning');
          }
        }).catch(() => {
          this.$message.error('网络错误，请稍后重试')
        });
      },
      previewWindow(item) {//预览
        let id = item.contentId;
        window.open(preview_path + 'AppAVShare.html#/article/' + id)
        //window.open('http://10.50.50.120:8000/AppAVShare.html#/article/' + id)
      },
      //获取列表数据
      getListData: function () {
          if (this.tabIndex==='2') {//话题
            let params = {
                currentPage: this.searchParams.currentPage,
                pageSize: this.searchParams.pageSize,
                intro: this.searchParams.intro,
                title: this.searchParams.title
            };
            getNewTopicList(params)
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
          } else {//专题
              let params = {
                contentState:this.searchParams.contentState,
                currentPage: this.searchParams.currentPage,
                pageSize: this.searchParams.pageSize,
                title: this.searchParams.title
              };
              getNewSubjectList(params)
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
          }
        
      },
      //获取所有标签列表
      getAllTags: function () {
        let params = {
        };
        postAllNewTags(params).then(res => {
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
      //获取所有医生列表
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
      doSearch() {
        this.searchParams.currentPage = 1;
        this.getListData();
      },
      addCancel() {
        this.handleCloseAdd()
      },
      addCancel2() {
        this.editShowDialog = false
      },

      showAddDialog() {
        if (this.tabIndex==='2') {
        this.addTable.isShowDialog = true
        } else {
        this.addTable_ZT.isShowDialog = true
        }
      },
      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this.getListData()
      },
      handleCurrentChange(val) {
        this.searchParams.currentPage = val;
        this.getListData()
      },
    },
    activated() {
      this.getListData();
      // this.getSubTags();
      this.getAllDoctors();
      this.getAllTags();
      this.getSupSelect();
    },
    watch: {
      tabIndex(val) {
        this.searchParams = {
          currentPage: 1,
          pageSize: 10,
          title: '',
          contentState:null//内容状态（上线：1；下线：2；删除：0） ,
        };
        this.getListData();
      }
    }
  }
</script>

<style lang="less" scoped>
  .btn-row {
    text-align: center;
    padding-top: 20px;
  }

  .box-card {
    margin-bottom: 20px;
  }

  .lg-select {
    width: 500px;
  }
</style>
<style lang="less">
.ZTMargin {
  .el-table__row {
    td{
       margin: 0;padding-top: 6px;padding-bottom: 0;
      .cell{
        padding: 0;
      }
    }
   
  }
}
#TopicDesHeight {
    min-height: 40px !important;
    line-height: 2 !important;
  }
#TopicDesHeight2 {
    min-height: 40px !important;
    line-height: 2 !important;
  }
#TopicDesHeight3 {
    min-height: 40px !important;
    line-height: 2 !important;
  }
#TopicDesHeight4 {
    min-height: 40px !important;
    line-height: 2 !important;
  }
.box-card-down {
    margin: 15px auto;
    min-width: 400px;
    max-width: 600px;
    .el-tag {
      display: block;
      text-align: center;
      font-size: 18px;
    }
  }
</style>
