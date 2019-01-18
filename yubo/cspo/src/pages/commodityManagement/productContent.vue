<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">

      <!-- 服务页面 -->
      <div>
        <el-header height="30">
          <!-- 操作行-->
          <el-row>
            <el-form id="SearchBar" :model="searchParams" :inline="true" class="demo-form-inline">
              <el-form-item label="商品名称：">
                <el-input v-model="searchParams.name" placeholder="商品名称" @keyup.enter.native="doSearch()"
                          clearable></el-input>
              </el-form-item>
              <el-form-item label="商品状态：">
                <el-select v-model="searchParams.productStatus" clearable placeholder="商品状态">
                  <el-option label="上架" value="1"></el-option>
                  <el-option label="下架" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="doSearch()">搜索</el-button>
              </el-form-item>
            </el-form>
          </el-row>
          <el-row>
            <el-button type="primary" @click="handleAdd()">新增</el-button>
          </el-row>
        </el-header>

        <el-main>
          <!--tab nav-->
          <el-tabs v-model="tabIndex" @tab-click="handleClick">
            <el-tab-pane label="一元听" name="10000">
              <template>
              <el-table :data="tableData" border style="width: 100%">
                <el-table-column show-overflow-tooltip align="center" type="index" width="80"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="productId" label="商品编号"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="productName" label="商品名称"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="productDesc" label="商品文案"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="productParentCategoryName" label="一级类目"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="productCategoryName" label="二级类目"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" label="商品状态" min-width="100%">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">
                      <el-tag size="medium" type="success" v-if="scope.row.productStatus === 1">上架</el-tag>
                      <el-tag size="medium" type="danger" v-if="scope.row.productStatus === 2">下架</el-tag>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip align="center" label="价格">
                  <template slot-scope="scope">
                    <p>￥{{ scope.row.productPrice }}</p>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip align="center" label="音频" min-width="100%">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">
                      <el-tag size="medium" type="success" v-if="scope.row.appendInfoModel.voiceProductUrl">已添加</el-tag>
                      <el-tag size="medium" type="danger" v-if="!scope.row.appendInfoModel.voiceProductUrl">未添加</el-tag>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="updateTime" label="创建时间"></el-table-column>
                <el-table-column align="center" label="操作" width="230" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="danger" v-if="scope.row.productStatus === 1"
                              @click="FalseStatus(scope.$index, scope.row)">下架
                    </el-button>
                    <el-button size="mini" type="success" v-if="scope.row.productStatus === 2"
                              @click="TrueStatus(scope.$index, scope.row)">上架
                    </el-button>
                    <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="deleteMessage(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              </template>
          </el-tab-pane>
          <el-tab-pane label="视频商品" name="20000">
              <template>
              <el-table :data="tableData" border style="width: 100%" id="app" class="VideoMargin">
                <el-table-column show-overflow-tooltip align="center" type="index" label=""></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="productId" label="商品编号"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="productName" label="商品名称"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" label="视频名称">
                  <template slot-scope="scope">
                    <p>{{ scope.row.appendInfoModel.title }}</p>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="productDesc" label="商品价格">
                  <template slot-scope="scope">
                    <p>￥{{ scope.row.productPrice }}</p>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="productIcon" label="封面" min-width="100">
                  <template slot-scope="scope">
                    <img :src="scope.row.productIcon" alt="无图像" height="100" width="100">
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="productParentCategoryName" label="一级类目"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="productCategoryName" label="二级类目"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="updateTime" label="更新时间"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="createTime" label="创建时间"></el-table-column>
                <!-- <el-table-column show-overflow-tooltip align="center" label="商品状态" min-width="100%">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">
                      <el-tag size="medium" type="success" v-if="scope.row.productStatus === 1">上架</el-tag>
                      <el-tag size="medium" type="danger" v-if="scope.row.productStatus === 2">下架</el-tag>
                    </div>
                  </template>
                </el-table-column> -->
                <el-table-column align="center" label="操作" width="230" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="danger" v-if="scope.row.productStatus === 1"
                              @click="FalseStatus(scope.$index, scope.row)">下架
                    </el-button>
                    <el-button size="mini" type="success" v-if="scope.row.productStatus === 2"
                              @click="TrueStatus(scope.$index, scope.row)">上架
                    </el-button>
                    <el-button size="mini" type="primary" @click="showEditDialog(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="deleteMessage(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              </template>
          </el-tab-pane>
          </el-tabs>
          <!-- 列表 -->


        </el-main>

        <div class="self-page-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="searchParams.currentPage" :page-sizes="[10, 20]"
                         :page-size="searchParams.pagesize" layout="total, sizes, prev, pager, next, jumper"
                         :total="totalCount">
          </el-pagination>
        </div>
      </div>
      <!-- 一元听编辑弹窗 -->
      <div v-if="dialogEditVisible_YYT">
        <el-dialog title="编辑" :visible.sync="dialogEditVisible_YYT" width=900px :before-close="handleCloseEidt_YYT">

          <el-form :model="editTable_YYT" :rules="rulesNew" ref="formNew" v-if="editTable_YYT.appendInfoModel">
            <el-form-item label="商品名称" :label-width="formLabelWidth2">
              <el-col :span="18">
                <el-input v-model="editTable_YYT.productName" prop auto-complete="off" el maxlength="10"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="商品主图片:" :label-width="formLabelWidth2">
              <uploadimg @emitSuccess="handImgSuccessEdit" @emitError="handImgErrorEdit"
                         :imageSrc="editTable_YYT.productIcon"></uploadimg>
            </el-form-item>
            <el-form-item label="商品文件" class="is-required" :label-width="formLabelWidth2">
              <el-col :span="7">
                <el-form-item v-show="false" v-model="upyunUrl">
                  <input name="fileSelect" @change="update()" ref="inputer" type="file"/>
                  <audio v-bind:src="upyunUrl" controls="controls" ref="audior">{{upyunUrl}}</audio>
                </el-form-item>
                <el-form-item>
                  <el-button size="small" type="success" @click="OpenfileSelect()">选择文件</el-button>
                  <el-button size="small" type="primary" @click="fileupdate()" class="m_l_0">确定上传</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="17" class="OverF">
                <span v-show="upyunUrl==''" class="el-icon-warning" style="color:#F56C6C">未上传</span>
                <span v-show="upyunUrl!=''" class="el-icon-success" style="color:#67C23A">已上传</span>
                {{fileName}}
              </el-col>
            </el-form-item>

            <el-form-item label="绑定标签" :label-width="formLabelWidth2">
              <el-col :span="18">
                <!-- <el-select filterable v-model="editTable_YYT.commTagDetailEntities" value-key="tagName" multiple placeholder="请选择绑定标签" style="width:100%">
                  <el-option :label="item.tagName" :value="item" v-for="(item,index) in alltagstaotao" :key="index"></el-option>
                </el-select> -->
                <el-select filterable v-model="editTable_YYT.commTagDetailEntities" :multiple-limit="5" value-key="tagName" multiple
                :remote-method="remoteMethod" remote :loading="loading"
                           placeholder="请输入标签名搜索并进行选择">
                  <el-option :label="item.tagName" :value="item" v-for="(item,index) in RemoteOptions"
                             :key="item.tagName"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="相关指标" :label-width="formLabelWidth2">
              <el-col :span="18">
                <el-input v-model="editTable_YYT.appendInfoModel.relevantContent"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="商品文案" :label-width="formLabelWidth2">
              <el-col :span="18">
                <!-- <tinymce v-model="editTable_YYT.productDesc" :url="Url" :with-credentials='false' :editorHeight='200'></tinymce> -->
                <el-input type="textarea" resize="none" :rows="5" v-model="editTable_YYT.productDesc"></el-input>
              </el-col>
              <template>
              </template>
            </el-form-item>
            <el-form-item label="原价:" :label-width="formLabelWidth2">
              <el-col :span="4">
                <el-input-number v-model="editTable_YYT.originPrice" :min="0" :precision="0" :controls='false' style="width:100%"></el-input-number>
              </el-col>
              <el-col :span="2">
                <div style="text-align:center">元1个</div>
              </el-col>
              <el-col :span="2">
              <div style="text-align:center">现价:</div>
              </el-col>
              <el-col :span="4">
                  <el-input-number v-model="editTable_YYT.productPrice" :min="0" :precision="2" :controls='false' style="width:100%"></el-input-number>
              </el-col>
              <el-col :span="2">
                <div style="text-align:center">元1个</div>
              </el-col>
              <el-col :span="4">
                <span>建议价格1元</span>
              </el-col>
            </el-form-item>
          </el-form>
          <div class="btn-row">
            <el-button size="small" type="primary" @click="_doHandleEdit_YYT()">保存</el-button>
            <el-button size="small" type="primary" @click="_doCancel_YYT()">取消</el-button>
          </div>
        </el-dialog>
      </div>
      <!-- 一元听新增弹窗 -->
      <div v-if="dialogAddVisible_YYT">
        <el-dialog title="新增" :visible.sync="dialogAddVisible_YYT" width=900px :before-close="handleCloseAdd_YYT">
          <el-form :model="addTable_YYT" :rules="rulesNew" ref="formNew">
            <el-form-item label="商品名称" :label-width="formLabelWidth2" prop="productName">
              <el-col :span="18">
                <el-input v-model="addTable_YYT.productName" prop auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="商品主图片:" :label-width="formLabelWidth2" prop="productIcon">
              <uploadimg @emitSuccess="handImgSuccessAdd_yyt" @emitError="handImgErrorAdd_yyt"
                         :imageSrc="addTable_YYT.productIcon"></uploadimg>
            </el-form-item>
            <el-form-item label="商品文件" :label-width="formLabelWidth2">
              <el-col :span="7">
                <el-form-item v-show="false" v-model="upyunUrl">
                  <input name="fileSelect" @change="update()" ref="inputer" type="file"/>
                  <audio v-bind:src="upyunUrl" controls="controls" ref="audior">{{upyunUrl}}</audio>
                </el-form-item>
                <el-form-item>
                  <el-button size="small" type="success" @click="OpenfileSelect()">选择文件</el-button>
                  <el-button size="small" type="primary" @click="fileupdate()" class="m_l_0">确定上传</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="17" class="OverF">
                <span v-show="upyunUrl==''" class="el-icon-warning" style="color:#F56C6C">未上传</span>
                <span v-show="upyunUrl!=''" class="el-icon-success" style="color:#67C23A">已上传</span>
                {{fileName}}
              </el-col>
            </el-form-item>
            <el-form-item label="绑定标签" :label-width="formLabelWidth2" prop="commTagDetailEntities">
              <el-col :span="18">
                <!-- <el-select filterable v-model="addTable_YYT.commTagDetailEntities" value-key="tagName" multiple placeholder="请选择绑定标签" style="width:100%">
                  <el-option :label="item.tagName" :value="item" v-for="(item,index) in alltagstaotao" :key="index"></el-option>
                </el-select> -->
                <el-select filterable v-model="addTable_YYT.commTagDetailEntities" :multiple-limit="5" value-key="tagName" multiple
                :remote-method="remoteMethod" remote :loading="loading"
                           placeholder="请输入标签名搜索并进行选择">
                  <el-option :label="item.tagName" :value="item" v-for="(item,index) in RemoteOptions"
                             :key="item.tagName"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="相关指标" :label-width="formLabelWidth2">
              <el-col :span="18">
                <el-input v-model="addTable_YYT.oneListenAppendDTO.relevantContent"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="商品文案" :label-width="formLabelWidth2">
              <el-col :span="18">
                <!-- <tinymce v-model="addTable_YYT.productDesc" :url="Url" :with-credentials='false' :editorHeight='200'></tinymce> -->
                <el-input type="textarea" resize="none" :rows="5" v-model="addTable_YYT.productDesc"></el-input>
              </el-col>
              <template>
              </template>
            </el-form-item>
            <el-form-item label="原价:" :label-width="formLabelWidth2">
              <el-col :span="4">
                <el-input-number v-model="addTable_YYT.originPrice" :min="0" :precision="0" :controls='false' style="width:100%"></el-input-number>
              </el-col>
              <el-col :span="2">
                <div style="text-align:center">元1个</div>
              </el-col>
              <el-col :span="2">
              <div style="text-align:center">现价:</div>
              </el-col>
              <el-col :span="4">
                  <el-input-number v-model="addTable_YYT.productPrice" :min="0" :precision="2" :controls='false' style="width:100%"></el-input-number>
              </el-col>
              <el-col :span="2">
                <div style="text-align:center">元1个</div>
              </el-col>
              <el-col :span="4">
                <span>建议价格1元</span>
              </el-col>
            </el-form-item>
          </el-form>
          <div class="btn-row">
            <el-button size="small" type="primary" @click="submitForm('formNew')">保存</el-button>
            <el-button size="small" type="primary" @click="_doAddCancel_YYT()">取消</el-button>
          </div>
        </el-dialog>
      </div>
      <!-- 付费视频新增弹窗 -->
      <div v-if="dialogAddVisible_VIDEO">
        <el-dialog title="新增商品" :visible.sync="dialogAddVisible_VIDEO" width=900px :before-close="handleCloseAdd_VIDEO">
          <el-form :model="addTable_VIDEO" :rules="rulesNewVideo" ref="formNewVideo">
          <el-form-item label="商品名称" :label-width="formLabelWidth2" prop="productName">
            <el-col :span="18">
              <el-input v-model="addTable_VIDEO.productName" placeholder="请输入商品名称" maxlength="130" clearable></el-input>
            </el-col>
          </el-form-item>
            <el-form-item label="绑定视频" :label-width="formLabelWidth2" prop="chargeGoodsAppendDTO">
              <el-col :span="18">
                <el-select v-model="addTable_VIDEO.chargeGoodsAppendDTO" placeholder="请选择" value-key="contentId" class="selectner">
                    <el-option v-for="(item,index) in subTags" :key="index" :label="item.title" :value="item">
                    </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="商品图片:" :label-width="formLabelWidth2" prop="productIcon">
              <uploadimg @emitSuccess="handImgSuccessAdd_VEDIO" @emitError="handImgErrorAdd_yyt"
                         :imageSrc="addTable_VIDEO.productIcon"></uploadimg>
            </el-form-item>
            <el-form-item label="原价" :label-width="formLabelWidth2" class="is-required">
              <el-col :span="5">
                <el-input-number v-model="addTable_VIDEO.originPrice" :min="0" :precision="0" :controls='false' style="width:100%"></el-input-number>
              </el-col>
              <el-col :span="3" class="is-requiredB">
              <div style="margin-right:12px;float:right">现价</div>
              </el-col>
              <el-col :span="5">
                  <el-input-number v-model="addTable_VIDEO.productPrice" :min="0" :precision="2" :controls='false' style="width:100%"></el-input-number>
              </el-col>
            </el-form-item>
          </el-form>
          <div class="btn-row">
            <el-button size="small" type="primary" @click="submitForm('formNewVideo')">保存</el-button>
            <el-button size="small" type="primary" @click="handleCloseAdd_VIDEO()">取消</el-button>
          </div>
        </el-dialog>
      </div>
      <!-- 付费视频编辑弹窗 -->
      <div v-if="dialogEditVisible_VIDEO">
        <el-dialog title="新增商品" :visible.sync="dialogEditVisible_VIDEO" width=900px :before-close="handleCloseEdit_VIDEO">
          <el-form :model="editTable_VIDEO" :rules="rulesNewVideo" ref="formEditVideo">
          <el-form-item label="商品名称" :label-width="formLabelWidth2" prop="productName">
            <el-col :span="18">
              <el-input v-model="editTable_VIDEO.productName" placeholder="请输入商品名称" maxlength="130" clearable></el-input>
            </el-col>
          </el-form-item>
            <el-form-item label="绑定视频" :label-width="formLabelWidth2" prop="chargeGoodsAppendDTO">
              <el-col :span="18">
                <el-select v-model="editTable_VIDEO.chargeGoodsAppendDTO" value-key="contentId" placeholder="请选择" class="selectner">
                    <el-option v-for="(item,index) in subTags" :key="index" :label="item.title" :value="item">
                    </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="商品图片:" :label-width="formLabelWidth2" prop="productIcon">
              <uploadimg @emitSuccess="handImgSuccessEidt_VEDIO" @emitError="handImgErrorAdd_yyt"
                         :imageSrc="editTable_VIDEO.productIcon"></uploadimg>
            </el-form-item>
            <el-form-item label="原价" :label-width="formLabelWidth2" class="is-required">
              <el-col :span="5">
                <el-input-number v-model="editTable_VIDEO.originPrice" :min="0" :precision="0" :controls='false' style="width:100%"></el-input-number>
              </el-col>
              <el-col :span="3" class="is-requiredB">
              <div style="margin-right:12px;float:right">现价</div>
              </el-col>
              <el-col :span="5">
                  <el-input-number v-model="editTable_VIDEO.productPrice" :min="0" :precision="2" :controls='false' style="width:100%"></el-input-number>
              </el-col>
            </el-form-item>
          </el-form>
          <div class="btn-row">
            <el-button size="small" type="primary" @click="do_editVideo('formEditVideo')">保存</el-button>
            <el-button size="small" type="primary" @click="handleCloseEdit_VIDEO()">取消</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
  import {b64hamcsha1, HexMD5, MD5} from '@/api/hash'
  import {IsAlert} from '@/config/mUtils.js';
  import {
    ERR_OK,
    GetProductInfo,
    PostProductStatus,
    GetModelList,
    SaveProductInfo_yyt,
    GetModelInfo,
    getListWithNoParam,
    ProductDoctorList,
    postNewCoinVideo,
    postSaveOrChangeVideo,
    GetAllTagsTao
  } from '@/api/api.js'
  import uploadimg from '@/components/uploadImg/uploadImgAdd.vue'
  import tinymce from '@/components/tinymce.vue'
  import {getStore,EncodeUserId} from '@/config/mUtils.js'
  import headerTop from '@/components/headTop.vue'

  export default {
    components: {
      headerTop,
      uploadimg,
      tinymce
    },
    data() {
      return {
        RemoteOptions: [],//搜索后下拉框选项
        loading: false,
        alltagstaotao: [],
        Remotelist: [],//远程数据
        subTags:[],//付费视频
        flag_Upload: true,//编辑时重新上传文件的判断
        editTable_YYT: {
          oneListenAppendDTO: {
            voiceProductUrl: "",
            voiceTime: null,
            abnormalKeyWord: "",
            relevantContent: ""
          }
        }, //编辑一元厅单个数据
        tabIndex: '10000',//当前状态index
        Url: 'http://v0.api.upyun.com/zhangshangtijian',
        totalCount: 0,
        AdminUserId: '',//userId
        searchParams: {
          currentPage: 1,
          pageSize: 10,
          name: '',
          productStatus: '',
          type: '10000'
        },
        currentPage: 1, //分页初始页码
        pagesize: 30, //分页初始显示条数
        tableData: [], //列表数据
        // editTable_YYT: {}, //修改一元厅单个数据
        addTable_YYT: {
          userId: '',
          modelType: '',
          productDesc: '',
          productIcon: '',
          productName: '',
          productPrice: 0,
          originPrice: 0,
          productUnix: '个',
          productId: "",
          useOs: 1,
          abnormalKeyWord: "",
          commTagDetailEntities:[],
          oneListenAppendDTO: {
            relevantContent: "",
            voiceProductUrl: "",
            voiceTime: 0
          },
        }, //一元厅新增单个数据
        addTable_VIDEO : {//付费视频新增
          vedioID:'',
          userId: '',
          modelType: '',
          chargeGoodsAppendDTO: {
          },
          productId: '',
          productIcon:'',
          productName: '',
          productPrice: 0,
          originPrice: 0,
          productUnix: '个',
          useOs: 1,
        },
        editTable_VIDEO : {//付费视频编辑
          vedioID:'',
          userId: '',
          modelType: '',
          chargeGoodsAppendDTO: {
          },
          productId: '',
          productIcon:'',
          productName: '',
          productPrice: 0,
          originPrice: 0,
          productUnix: '个',
          useOs: 1,
        },
        dialogEditVisible_YYT: false, //一元厅修改
        dialogAddVisible_YYT: false, //一元厅新增
        dialogAddVisible_VIDEO: false, //付费视频新增
        dialogEditVisible_VIDEO: false, //付费视频修改
        formLabelWidth: '120px',
        formLabelWidth2: '170px',
        fileName: '',
        upyunUrl: '', //又拍云url
        rulesNew: {
          productName: [
            {required: true, 删除message: '请填写商品名称', trigger: 'blur'}
          ],
          productIcon: [
            {required: true, message: '请选择商品图片', trigger: 'blur'}
          ],
          upyunUrl: [{required: true, message: '请选择文件', trigger: 'blur'}],
          commTagDetailEntities: [{required: true, message: '请选择绑定标签', trigger: 'blur'}],
          paperWork: [
            {required: true, message: '请输入商品文案', trigger: 'blur'}
          ]
        },
        rulesNewVideo: {
          chargeGoodsAppendDTO: [
            {required: true, message: '请选择绑定视频', trigger: 'blur'}
          ],
          productName: [
            {required: true, message: '请填写商品名称', trigger: 'blur'}
          ],
          productIcon: [
            {required: true, message: '请选择商品图片', trigger: 'blur'}
          ],
        },
      }
    },
    methods: {
      /*付费视频———————————————————————————————————————————————— */
      handleClick(){//点击tab事件
        this.searchParams = {
          currentPage: 1,
          pageSize: 10,
          name: '',
          productStatus: '',
          type: ''
        },
        this.getList();
      },
      handImgSuccessAdd_VEDIO(res) {
        if (res.status === 200) {
          this.addTable_VIDEO.productIcon =
            'http://zhangshangtijian.b0.upaiyun.com' + res.data.url
        } else {
          IsAlert(res.msg,'错误','error');
        }
      },
      handImgSuccessEidt_VEDIO(res) {
        if (res.status === 200) {
          this.editTable_VIDEO.productIcon =
            'http://zhangshangtijian.b0.upaiyun.com' + res.data.url
        } else {
          IsAlert(res.msg,'错误','error');
        }
      },
      handleCloseEdit_VIDEO() {//编辑弹窗重置数据 付费视频
        this.resetForm('formEditVideo');
        this.editTable_VIDEO = {
          vedioID:'',
          userId: '',
          modelType: '',
          chargeGoodsAppendDTO: {
          },
          productId: '',
          productIcon: '',
          productName: '',
          productPrice: 0,
          originPrice: 0,
          productUnix: '个',
          useOs: 1,
        };
        this.dialogEditVisible_VIDEO = false;
      },
      handleCloseAdd_VIDEO() {//新增弹窗重置数据 付费视频
        this.resetForm('formNewVideo');
        this.addTable_VIDEO = {
          vedioID:'',
          userId: '',
          modelType: '',
          chargeGoodsAppendDTO: {
            contentId: ""
          },
          productId: '',
          productIcon: '',
          productName: '',
          productPrice: 0,
          originPrice: 0,
          productUnix: '个',
          useOs: 1,
        };
        this.dialogAddVisible_VIDEO = false
      },
      //获取所有付费视频列表
      getAllVideo: function () {
        let params = {
          contentType: 2,
          newsType: 1,
          whetherFree: 1
        };
        postNewCoinVideo(params).then(res => {
          if (res.code === ERR_OK) {
            this.subTags = res.data;
          } else {
            IsAlert(res.msg,'错误','error');
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试');
        })
      },
      _doAdd_VIDEO() {//新增付费视频
        let params = {
          productDesc: '666',
          userId: this.AdminUserId,
          modelType: '20000',
          chargeGoodsAppendDTO: this.addTable_VIDEO.chargeGoodsAppendDTO,
          productId: this.addTable_VIDEO.productId,
          productIcon:this.addTable_VIDEO.productIcon,
          productName: this.addTable_VIDEO.productName,
          productPrice: this.addTable_VIDEO.productPrice,
          originPrice: this.addTable_VIDEO.originPrice,
          productUnix: '个',
          useOs: 1,
        }

        postSaveOrChangeVideo(params).then(res => {
          if (res.code === ERR_OK) {
            this.dialogAddVisible_VIDEO = false;
            this.handleCloseAdd_VIDEO();
            IsAlert(res.msg,'成功','success');
            this.getList();
          } else {
            IsAlert(res.msg,'错误','error');
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        })
      },
      showEditDialog(index,row){//显示修改视频弹窗
        if (row.productStatus===1) {
          this.$notify.error({
              title: '请先下线！',
              duration:1000,
            });
        } else {
          this.editTable_VIDEO.chargeGoodsAppendDTO = row.appendInfoModel;
          this.editTable_VIDEO.productId = row.productId;
          this.editTable_VIDEO.productIcon=row.productIcon;
          this.editTable_VIDEO.productName=row.productName;
          this.editTable_VIDEO.productPrice=row.productPrice;
          this.editTable_VIDEO.originPrice=row.originPrice;
          this.dialogEditVisible_VIDEO = true;
        }
      },
      do_editVideo(formName){//编辑视频弹窗表单验证
        this.$refs[formName].validate(valid => {
            if (valid) {
                this.handleEditVideo();
                this.getList();
            } else {
              console.log('error submit!!')
              return false
            }
          })
      },
      handleEditVideo() {//修改付费视频
        let params = {
          productDesc: '666',
          userId: this.AdminUserId,
          modelType: '20000',
          chargeGoodsAppendDTO: this.editTable_VIDEO.chargeGoodsAppendDTO,
          productId: this.editTable_VIDEO.productId,
          productIcon:this.editTable_VIDEO.productIcon,
          productName: this.editTable_VIDEO.productName,
          productPrice: this.editTable_VIDEO.productPrice,
          originPrice: this.editTable_VIDEO.originPrice,
          productUnix: '个',
          useOs: 1,
        }

        postSaveOrChangeVideo(params).then(res => {
          if (res.code === ERR_OK) {
            this.dialogEditVisible_VIDEO = false;
            this.handleCloseEdit_VIDEO();
            IsAlert(res.msg,'成功','success');
            this.getList();
          } else {
            IsAlert(res.msg,'错误','error');
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        })
      },
      /*YYT———————————————————————————————————————————————— */
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
      handImgSuccessEdit(res) {
        if (res.status === 200) {
          this.editTable_YYT.productIcon =
            'http://zhangshangtijian.b0.upaiyun.com' + res.data.url
        } else {
          IsAlert(res.msg,'错误','error');
        }
      },
      handImgErrorEdit() {
      },
      handImgSuccessAdd_yyt(res) {
        if (res.status === 200) {
          this.addTable_YYT.productIcon =
            'http://zhangshangtijian.b0.upaiyun.com' + res.data.url
        } else {
          IsAlert(res.msg,'错误','error');
        }
      },
      handImgErrorAdd_yyt() {
      },
      doSearch() {
        this.searchParams.currentPage = 1;
        this.getList()
      },
      handleSizeChange: function (size) {
        this.searchParams.pageSize = size;
        this.getList()
      },
      handleCurrentChange: function (currentPage) {
        this.searchParams.currentPage = currentPage;
        this.getList()
      },
      // 新增
      handleAdd() {
        if (this.tabIndex=== '10000') {
          this.dialogAddVisible_YYT = true;
        } else if(this.tabIndex=== '20000'){
          this.dialogAddVisible_VIDEO = true;
        }

      },
      // 一元厅确定新增
      _doAdd_YYT() {
        let params = {
          oneListenAppendDTO: {
            voiceProductUrl: this.upyunUrl,
            abnormalKeyWord: this.addTable_YYT.abnormalKeyWord,
            relevantContent: this.addTable_YYT.oneListenAppendDTO.relevantContent,
            voiceTime: this.AudioDuration
          },
          productDesc: this.addTable_YYT.productDesc,
          selectedTagInfoVOS: this.addTable_YYT.commTagDetailEntities,
          productIcon: this.addTable_YYT.productIcon,
          productName: this.addTable_YYT.productName,
          productPrice: this.addTable_YYT.productPrice,
          originPrice: this.addTable_YYT.originPrice,
          productUnix: '个',
          useOs: 1,
          userId: this.AdminUserId,
          modelType: '10000',
        };
        if (!this.flag_Upload) {
          IsAlert('请等待文件上传完成','提示','warning');
        } else {
          SaveProductInfo_yyt(params).then(response => {
            if (response.code === ERR_OK) {
              IsAlert(response.msg,'成功','success');
              this.handleCloseAdd_YYT();
              this.getList();
            } else {
              IsAlert(response.msg,'错误','error');
            }
          }).catch(() => {
            this.$message.error('网络错误!请稍后重试');
          })
        }
      },
      // 一元厅取消新增
      _doAddCancel_YYT() {
        this.handleCloseAdd_YYT();
        this.getList();
        this.$message({
          type: 'warning',
          message: '取消新增'
        })
      },
      submitForm(formName) {
        if (this.tabIndex === '10000') {
          //新增模块表单验证
          this.$refs[formName].validate(valid => {
            if (valid) {
              if (this.upyunUrl) {
                this._doAdd_YYT();
                this.getList();
              } else {
                IsAlert('请上传商品文件','提示','warning');
              }
            } else {
              console.log('error submit!!')
              return false
            }
          })
        } else {
          this.$refs[formName].validate(valid => {
            if (valid) {
                this._doAdd_VIDEO();
                this.getList();
            } else {
              console.log('error submit!!')
              return false
            }
          })
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      handleCloseAdd_YYT() {
        //新增弹窗重置数据 beforeclose
        this.resetForm('formNew');
        this.addTable_YYT = {
          userId: '',
          modelType: '',
          productDesc: '',
          productIcon: '',
          productName: '',
          productPrice: 0,
          originPrice: 0,
          productUnix: '个',
          productId: "",
          commTagDetailEntities: [],
          useOs: 1,
          abnormalKeyWord: "",
          oneListenAppendDTO: {
            relevantContent: "",
            voiceProductUrl: "",
            voiceTime: 0
          },
        };
        this.upyunUrl = '';
        this.fileName = '';
        this.AudioDuration = null;
        let inputDOM = this.$refs.inputer;
        inputDOM.value = '';//重置文件为空，防止重复选择同一个文件导致无法触发chenge事件从而无法显示文件名
        this.dialogAddVisible_YYT = false
      },
      // 一元听修改
      handleEdit(index, row) {
        let params = {
          productId: row.productId
        };
        GetProductInfo(params).then(response => {
          if (response.code === ERR_OK) {
            this.editTable_YYT = response.data;
            let arr = [];
            for (let index = 0; index < response.data.commTagDetailEntities.length; index++) {
                let obj = {
                  tagId:response.data.commTagDetailEntities[index].tagId,
                  tagName:response.data.commTagDetailEntities[index].tagName,
                };
                arr.push(obj);
            }
            this.editTable_YYT.commTagDetailEntities = arr;//已绑定的标签
            this.RemoteOptions = arr;//v-for中options的数据，保证编辑弹窗出现后能看到已绑定的标签
            this.AudioDuration = this.editTable_YYT.appendInfoModel.voiceTime;
            this.upyunUrl = this.editTable_YYT.appendInfoModel.voiceProductUrl;
            this.dialogEditVisible_YYT = true;
          } else {
            IsAlert(response.msg,'错误','error');
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        });
      },
      //一元听确定修改
      _doHandleEdit_YYT() {
        let params = {
          oneListenAppendDTO: {
            voiceProductUrl: this.upyunUrl,
            abnormalKeyWord: this.editTable_YYT.appendInfoModel.abnormalKeyWord,
            relevantContent: this.editTable_YYT.appendInfoModel.relevantContent,
            voiceTime: this.AudioDuration
          },
          productDesc: this.editTable_YYT.productDesc,
          productIcon: this.editTable_YYT.productIcon,
          productName: this.editTable_YYT.productName,
          productPrice: this.editTable_YYT.productPrice,
          originPrice: this.editTable_YYT.originPrice,
          selectedTagInfoVOS: this.editTable_YYT.commTagDetailEntities,
          productUnix: '个',
          useOs: 1,
          userId: this.AdminUserId,
          modelType: '10000',
          productId: this.editTable_YYT.productId,

        };
        if (!this.flag_Upload) {
          IsAlert('请等待文件上传完成','提示','warning');
        } else {
          SaveProductInfo_yyt(params).then(response => {
            if (response.code === ERR_OK) {
              IsAlert(response.msg,'成功','success');
              this.handleCloseEidt_YYT();
            } else {
              IsAlert(response.msg,'错误','error');
            }
          }).catch(() => {
            this.$message.error('网络错误!请稍后重试')
          })
        }
      },
      // 一元厅取消编辑
      _doCancel_YYT() {
        this.handleCloseEidt_YYT();
        this.getList();
        this.$message({
          type: 'warning',
          message: '取消编辑'
        })
      },
      handleCloseEidt_YYT() {
        //编辑弹窗重置数据
        this.getList();
        this.upyunUrl = '';
        this.fileName = '';
        this.AudioDuration = null;
        let inputDOM = this.$refs.inputer;
        inputDOM.value = '';//重置文件为空，防止重复选择同一个文件导致无法触发chenge事件从而无法显示文件名
        this.dialogEditVisible_YYT = false;
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
                "productId": row.productId,
                "productStatus": 3,
                "userId": this.AdminUserId
              };
              PostProductStatus(params).then(response => {
                if (response.code === ERR_OK) {
                  this.$notify({
                      title: '成功',
                      message: `删除成功！`,
                      type: 'success'
                    });
                  this.getList()
                } else {
                  IsAlert(response.msg,'错误','error');
                }
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
      // 上架
      TrueStatus(index, row) {
        this.$confirm('此操作将上架商品, 是否继续?', '提示', {
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
            };
            PostProductStatus(params).then(response => {
              if (response.code === ERR_OK) {
                this.$notify({
                      title: '成功',
                      message: `已上架！`,
                      type: 'success'
                    });
                this.getList()
              } else {
                IsAlert(response.msg,'错误','error');
              }
            }).catch(()=>{
              this.$message.error('网络错误!请稍后重试')
            })
          })
          .catch(() => {
            this.$message({
              type: 'warning ',
              message: '已取消更改服务状态'
            })
          })
      },
      // 下架
      FalseStatus(index, row) {
        this.$confirm('此操作将下架商品, 是否继续?', '提示', {
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
            };
            PostProductStatus(params).then(response => {
              if (response.code === ERR_OK) {
                this.$notify({
                      title: '成功',
                      message: `已下架！`,
                      type: 'success'
                    });
                this.getList();
              } else {
                IsAlert(response.msg,'错误','error');
              }
            }).catch(()=>{
              this.$message.error('网络错误!请稍后重试')
            })
          })
          .catch(() => {
            this.$message({
              type: 'warning ',
              message: '已取消更改服务状态'
            })
          })
      },
      //获取列表
      getList() {
        let params = {
          currentPage: this.searchParams.currentPage,
          pageSize: this.searchParams.pageSize,
          productStatus: this.searchParams.productStatus,
          productName: this.searchParams.name,
          modelType: this.tabIndex,
        };
        GetModelList(params).then(response => {
          if ((response.code === ERR_OK)) {
            this.tableData = [];
            this.tableData = response.data.list;
            this.totalCount = response.data.totalCount;
          } else {
            IsAlert('获取商品列表失败','错误','error');
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试')
        });
        let partthis = getStore('userMesage');
        this.AdminUserId = EncodeUserId(JSON.parse(partthis).userId)
      },
      //获取席涛涛标签列表
      getAlltagList() {
        let params = {
        };
        GetAllTagsTao(params).then(response => {
          if ((response.code === ERR_OK)) {
            this.alltagstaotao = [];
            this.alltagstaotao = response.data;
            this.Remotelist = this.alltagstaotao.map(item => {
              return { tagId: item.tagId, tagName: item.tagName };
            });
          } else {
            IsAlert('获取标签列表失败','错误','error');
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试')
        });
      },
      update() {
        //上传音频
        let inputDOM = this.$refs.inputer;
        // 通过DOM取文件数据
        this.file = inputDOM.files[0];
        if (inputDOM.files[0] === undefined) {
          this.fileName = '';
          this.fileSize = '';
          this.fileType = ''
        } else {
          this.fileName = this.file.name;
          //kb
          if (this.file.size / 1024 < 1000) {
            this.fileSize = (this.file.size / 1024).toFixed(2) + 'kb'
          } else if (this.file.size / 1024 > 1000) {
            this.fileSize = (this.file.size / 1024 / 1024).toFixed(2) + 'MB'
          }
          this.fileType = this.file.type
        }
        inputDOM.files[0].value = ''
      },
      //上传按钮的事件axios
      fileupdate() {
        this.flag_Upload = false;
        let inputDOM = this.$refs.inputer;
        let date = Date.parse(new Date());
        // 通过DOM取文件数据
        var bucketname = 'zhangshangtijian';//服务名
        var username = 'hztest';//操作员账号
        var password = 'a1234567'; //操作员密码
        var save_key = '/csp/audio/{year}{mon}{day}/' + date + '{.suffix}';
        var policy = btoa(
          JSON.stringify({
            bucket: bucketname,
            'save-key': save_key,
            expiration: parseInt(Date.parse(new Date()) + 3600)
          })
        )
        var signature =
          'UPYUN ' +
          username +
          ':' +
          b64hamcsha1(
            HexMD5.MD5(password).toString(HexMD5.enc.Hex),
            'POST&/' + bucketname + '&' + policy
          )
        var url = 'http://v0.api.upyun.com/' + bucketname;
        var file = inputDOM.files[0];
        var formData = new FormData();
        formData.append('file', file);
        formData.append('policy', policy);
        formData.append('authorization', signature);

        this.$http.post(url, formData).then(response => {
          if ((response.code = 200)) {
            this.upyunUrl =
              'http://zhangshangtijian.b0.upaiyun.com' + response.data.url;//返回地址
            this.$message({
              type: 'success',
              message: '上传成功!'
            });
            this.flag_Upload = true;
          } else {
            IsAlert(response.msg,'错误','error');
          }
        });
        //获取语音时长
        let myVid = this.$refs.audior;
        let this_ = this;
        if (myVid != null) {
          var duration;
          myVid.load();
          myVid.oncanplay = function () {
            this_.AudioDuration = myVid.duration
          }
        }
      },
      OpenfileSelect() {
        //隐藏input框 点击按钮触发input的点击事件
        let myfile = this.$refs.inputer;
        myfile.click()
      },
    },
    activated: function () {
      this.tabIndex = '10000';
      this.getAllVideo();
      this.getAlltagList();
      this.getList();
    },
  }
</script>

<style lang="less" scoped>
// #SearchBar{
// .el-form-item{
//   margin-bottom: 0;
// }
// }

  .el-checkbox {
    margin-left: 10px;
  }

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

  // .el-form-item {margin-bottom: 0}
  // .el-checkbox+.el-checkbox{margin: 0}
  .wordsnum {
    height: 117px;
    /* vertical-align: middle; */
    text-align: center;
    line-height: 117px;

  }

  .m_l_15 {
    margin-left: 15px;
  }

  .btn-row {
    text-align: center;
    padding-top: 20px;
  }

  .el-header, .el-main, .el-footer {
    padding:0;
  }
</style>
<style lang="less">
  .is-requiredB {
      div {
        &:before {
          content: '*';
          color: #f56c6c;
          margin-right: 4px;
        }
      }
    }
  .el-form-item {
    &.is-required2 {
      .el-form-item__label {
        &:after {
          content: "*";
          color: #f56c6c;
          margin-left: 4px;
        }
      }
    }
  }

  .selector img {
    width: 150%;
  }

  .selpage {
    text-align: center;
    margin-top: 20px;
  }
  .VideoMargin {
  .el-table__row {
    td{
       margin: 0;padding-top: 6px;padding-bottom: 0;
      .cell{
        padding: 0;
      }
    }

  }
}
</style>

