<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <el-header height="30">
        <el-form :inline="true" :model="searchParams" class="demo-form-inline">
          <el-form-item label="机构编号">
            <el-input v-model="searchParams.selectInstitutionCode" placeholder="机构编号" clearable></el-input>
          </el-form-item>

          <el-form-item label="机构名称">
            <el-input v-model="searchParams.selectInstitutionName" placeholder="机构名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="APP是否显示">
            <el-select v-model="searchParams.selectIsAppShow" clearable placeholder="APP是否显示" clearable>
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="短信服务是否开通">
            <el-select v-model="searchParams.selectIsOpenMsm" clearable placeholder="短信服务是否开通" clearable>
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleReset()">清空</el-button>
            <el-button type="primary" @click="doSearche()">搜索</el-button>
            <el-button type="primary" @click="handleAdd()">新增</el-button>
          </el-form-item>
        </el-form>

      </el-header>
      <el-main>
        <!-- 修改 -->
        <el-dialog title="修改" :visible.sync="dialogEditVisible" width=40% v-bind:show-close = "false">
          <template :model="editTable">
            <el-tabs @tab-click="handleClick">
              <!-- 修改==基本信息 -->
              <el-tab-pane label="基本信息">
                <el-form :model="editTable" label-width="80">
                  <el-form-item label="机构编号:" :label-width="formLabelWidth">
                    <el-col :span="16">
                      <el-input v-model="editTable.institutionCode " auto-complete="off" placeholder="请输入机构编号" el></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="机构名称:" :label-width="formLabelWidth">
                    <el-col :span="16">
                      <el-input v-model="editTable.institutionName" auto-complete="off" placeholder="请输入机构名称" el></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="机构地址:" :label-width="formLabelWidth">
                    <el-col :span="16">
                      <el-input v-model="editTable.institutionAddr" auto-complete="off" placeholder="请输入机构地址" el></el-input>
                    </el-col>
                  </el-form-item>
                </el-form>
                <el-form :inline="true" :model="editTable">
                  <el-form-item label="机构类型:" label-width="120px">
                    <el-select v-model="editTable.institutionGradeId" placeholder="">
                      <el-option label="公立" value="1"></el-option>
                      <el-option label="民营" value="2"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-select v-model="editTable.institutionLavelId" placeholder="">
                      <el-option label="三甲医院" value="3"></el-option>
                      <el-option label="二甲医院" value="4"></el-option>
                      <el-option label="三级医院" value="5"></el-option>
                      <el-option label="二级医院" value="6"></el-option>
                      <el-option label="一级医院" value="7"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>

              </el-tab-pane>
              <!-- 修改==配置管理 -->
              <el-tab-pane label="配置管理">
                <el-form :model="editTable" label-width="300px">
                  <el-form-item label="地推链接:" :label-width="formLabelWidth150">
                    <el-col :span="16">
                      <el-input v-model="editTable.institutionExtensionUrl " auto-complete="off" placeholder="请输入地推链接" el></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="微信机构二维码链接:" :label-width="formLabelWidth150">
                    <el-col :span="10">
                      <el-button type="primary" size="medium" @click="">生成二维码链接</el-button>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="医院地推LOGO:" :label-width="formLabelWidth150">
                    <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                      <img v-if="editTable.extensionLogoUrl" :src="editTable.extensionLogoUrl" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      <div slot="tip" class="el-upload__tip">(上传图片的最佳尺寸：570*150px,PNG格式的图片大小不超过1M.)</div>
                    </el-upload>
                  </el-form-item>
                  <el-form-item label="医院地推宣传图:" :label-width="formLabelWidth150">
                    <el-upload class="avatar-uploader clear:after" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                      <img v-if="editTable.extensionImageUrl " :src="editTable.extensionImageUrl " class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      <div slot="tip" class="el-upload__tip">(上传图片的最佳尺寸：570*150px,PNG格式的图片大小不超过1M.)</div>
                    </el-upload>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <!-- 修改==角色管理 -->
              <el-tab-pane label="角色管理">
                <el-form :model="editTable" label-width="300px">
                  <el-form-item label="APP是否展示:" :label-width="formLabelWidth150">
                    <template slot-scope="scope">
                      <el-radio v-model="editTable.whetherAppShow " :label=1>是</el-radio>
                      <el-radio v-model="editTable.whetherAppShow " :label=0>否</el-radio>
                    </template>
                  </el-form-item>
                  <el-form-item label="是否开通短信服务:" :label-width="formLabelWidth150">
                    <template slot-scope="scope">
                      <el-radio v-model="editTable.whetherOpenMsm " :label=1>是</el-radio>
                      <el-radio v-model="editTable.whetherOpenMsm " :label=0>否</el-radio>
                    </template>
                  </el-form-item>
                  <el-form-item label="是否有PDF报告:" :label-width="formLabelWidth150">
                    <template slot-scope="scope">
                      <el-radio v-model="editTable.whetherHasPdfReport " :label=1>是</el-radio>
                      <el-radio v-model="editTable.whetherHasPdfReport " :label=0>否</el-radio>
                    </template>
                  </el-form-item>
                  <el-form-item label="体检报告LOGO:" :label-width="formLabelWidth150">
                    <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                      <img v-if="editTable.medicalExamReportLogo " :src="editTable.medicalExamReportLogo " class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      <div slot="tip" class="el-upload__tip">(上传图片的最佳尺寸：570*150px,PNG格式的图片大小不超过1M.)</div>
                    </el-upload>
                  </el-form-item>
                  <el-form-item label="医院Banner:" :label-width="formLabelWidth150">
                    <el-upload class="avatar-uploader clear:after" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                      <img v-if="editTable.bannerExtensionUrl " :src="editTable.bannerExtensionUrl " class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      <div slot="tip" class="el-upload__tip">(上传图片的最佳尺寸：570*150px,PNG格式的图片大小不超过1M.)</div>
                    </el-upload>
                  </el-form-item>
                  <el-form-item label="医院Banner推广链接:" :label-width="formLabelWidth150">
                    <el-col :span="16">
                      <el-input v-model="editTable.bannerExtensionUrl" auto-complete="off" placeholder="医院Banner推广链接" el></el-input>
                    </el-col>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </template>
          <div slot="footer" class="dialog-footer">
            <el-button @click="_doCancel()">取 消</el-button>
            <el-button type="primary" @click="_doHandleEdit()">确 定</el-button>
          </div>
        </el-dialog>

        <!-- 查看 -->
        <el-dialog title="查看" :visible.sync="dialogCheckVisible" width=40% v-bind:show-close = "false">
          <ul :model="selectTable">
            <li>
              <div class="messageTitle">
                <p>基本信息</p>
              </div>
              <div class="messageMain">
                <ul class="messageBody">
                  <li style="overflow: hidden;">
                    <div class="messageli">
                      <div class="fl msgfl">
                        <span>机构编号：</span>
                        <span class="ml20">{{selectTable.institutionCode}}</span>
                      </div>
                      <div class="fr msgfr">
                        <span>机构名称：</span>
                        <span class="ml20">{{selectTable.institutionName}}</span>
                      </div>
                    </div>
                  </li>
                  <li style="overflow: hidden;">
                    <div class="messageli">
                      <div class="fl msgfl">
                        <span>机构地址：</span>
                        <span class="ml20">{{selectTable.institutionAddr}}</span>
                      </div>
                      <div class="fr msgfr">
                        <span>机构等级：</span>
                        <span>
                          <b class="ml20 cir-style">{{selectTable.gradeName}}</b>
                          <b class="ml20 cir-bstyle">{{selectTable.lavelName}}</b>
                        </span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <div class="messageTitle">
                <p>推广信息</p>
              </div>
              <div class="messageMain">
                <ul class="messageBody">
                  <li style="overflow: hidden;">
                    <div class="messageli">
                      <div class="fl msgfl">
                        <span>地推链接：</span>
                        <span class="ml20">暂无数据</span>
                      </div>
                    </div>
                  </li>
                  <li style="overflow: hidden;">
                    <div class="messageli">
                      <div class="fl msgfl">
                        <span>机构地推LOGO：</span>
                        <span src="" alt="">暂无图片</span>
                      </div>
                      <div class="fr msgfr">
                        <span>机构地推宣传图：</span>
                        <span>暂无图片</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <div class="messageTitle">
                <p>运营设置</p>
              </div>
              <div class="messageMain">
                <ul class="messageBody">
                  <li style="overflow: hidden;">
                    <div class="messageli">
                      <div class="fl msgfl">
                        <span>机构Banner推广链接：</span>
                        <span>暂无数据</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogCheckVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogCheckVisible = false">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 新增 -->
        <el-dialog title="新增" :visible.sync="dialogAddVisible" width=40% v-bind:show-close = "false">
          <template :model="addTable">
            <el-tabs @tab-click="handleClick">
              <!-- 新增==基本信息 -->
              <el-tab-pane label="基本信息">
                <el-form :model="addTable" label-width="80">
                  <el-form-item label="机构编号:" :label-width="formLabelWidth">
                    <el-col :span="16">
                      <el-input v-model="addTable.institutionCode " auto-complete="off" placeholder="请输入机构编号" el></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="机构名称:" :label-width="formLabelWidth">
                    <el-col :span="16">
                      <el-input v-model="addTable.institutionName" auto-complete="off" placeholder="请输入机构名称" el></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="机构地址:" :label-width="formLabelWidth">
                    <el-col :span="16">
                      <el-input v-model="addTable.institutionAddr" auto-complete="off" placeholder="请输入机构地址" el></el-input>
                    </el-col>
                  </el-form-item>
                </el-form>
                <el-form :inline="true" :model="editTable">
                  <el-form-item label="机构类型:" label-width="120px">
                    <el-select v-model="addTable.institutionGradeId" placeholder="">
                      <el-option label="公立" value="1"></el-option>
                      <el-option label="民营" value="2"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-select v-model="addTable.institutionLavelId" placeholder="">
                      <el-option label="三甲医院" value="3"></el-option>
                      <el-option label="二甲医院" value="4"></el-option>
                      <el-option label="三级医院" value="5"></el-option>
                      <el-option label="二级医院" value="6"></el-option>
                      <el-option label="一级医院" value="7"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>

              </el-tab-pane>
              <!-- 新增==配置管理 -->
              <el-tab-pane label="配置管理">
                <el-form :model="addTable" label-width="300px">
                  <el-form-item label="地推链接:" :label-width="formLabelWidth150">
                    <el-col :span="16">
                      <el-input v-model="addTable.institutionExtensionUrl " auto-complete="off" placeholder="请输入地推链接" el></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="微信机构二维码链接:" :label-width="formLabelWidth150">
                    <el-col :span="10">
                      <el-button type="primary" size="medium" @click="">生成二维码链接</el-button>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="医院地推LOGO:" :label-width="formLabelWidth150">
                    <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                      <img v-if="addTable.extensionLogoUrl" :src="addTable.extensionLogoUrl" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      <div slot="tip" class="el-upload__tip">(上传图片的最佳尺寸：570*150px,PNG格式的图片大小不超过1M.)</div>
                    </el-upload>
                  </el-form-item>
                  <el-form-item label="医院地推宣传图:" :label-width="formLabelWidth150">
                    <el-upload class="avatar-uploader clear:after" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                      <img v-if="addTable.extensionImageUrl " :src="addTable.extensionImageUrl " class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      <div slot="tip" class="el-upload__tip">(上传图片的最佳尺寸：570*150px,PNG格式的图片大小不超过1M.)</div>
                    </el-upload>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <!-- 新增==角色管理 -->
              <el-tab-pane label="角色管理">
                <el-form :model="addTable" label-width="300px">
                  <el-form-item label="APP是否展示:" :label-width="formLabelWidth150">
                    <template slot-scope="scope">
                      <el-radio v-model="addTable.whetherAppShow " :label=1>是</el-radio>
                      <el-radio v-model="addTable.whetherAppShow " :label=0>否</el-radio>
                    </template>
                  </el-form-item>
                  <el-form-item label="是否开通短信服务:" :label-width="formLabelWidth150">
                    <template slot-scope="scope">
                      <el-radio v-model="addTable.whetherOpenMsm " :label=1>是</el-radio>
                      <el-radio v-model="addTable.whetherOpenMsm " :label=0>否</el-radio>
                    </template>
                  </el-form-item>
                  <el-form-item label="是否有PDF报告:" :label-width="formLabelWidth150">
                    <template slot-scope="scope">
                      <el-radio v-model="addTable.whetherHasPdfReport " :label=1>是</el-radio>
                      <el-radio v-model="addTable.whetherHasPdfReport " :label=0>否</el-radio>
                    </template>
                  </el-form-item>
                  <el-form-item label="体检报告LOGO:" :label-width="formLabelWidth150">
                    <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                      <img v-if="addTable.medicalExamReportLogo " :src="addTable.medicalExamReportLogo " class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      <div slot="tip" class="el-upload__tip">(上传图片的最佳尺寸：570*150px,PNG格式的图片大小不超过1M.)</div>
                    </el-upload>
                  </el-form-item>
                  <el-form-item label="医院Banner:" :label-width="formLabelWidth150">
                    <el-upload class="avatar-uploader clear:after" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                      <img v-if="addTable.bannerExtensionUrl " :src="addTable.bannerExtensionUrl " class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      <div slot="tip" class="el-upload__tip">(上传图片的最佳尺寸：570*150px,PNG格式的图片大小不超过1M.)</div>
                    </el-upload>
                  </el-form-item>
                  <el-form-item label="医院Banner推广链接:" :label-width="formLabelWidth150">
                    <el-col :span="16">
                      <el-input v-model="addTable.bannerExtensionUrl" auto-complete="off" placeholder="医院Banner推广链接" el></el-input>
                    </el-col>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </template>

          <div slot="footer" class="dialog-footer">
            <el-button @click="_doAddCancel()">取 消</el-button>
            <el-button type="primary" @click="_doAdd()">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 列表 -->
        <template>
          <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" border style="width: 100%" id="app">
            <el-table-column show-overflow-tooltip align="center" prop="institutionCode" label="机构编号"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="institutionName" label="机构名称"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="institutionAddr" label="机构地址"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="gradeName" label="机构类型"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="APP是否展示">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium" type="success" v-if="scope.row.whetherAppShow === 1">是</el-tag>
                  <el-tag size="medium" type="danger" v-if="scope.row.whetherAppShow === 0">否</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="是否开通短信服务">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium" type="success" v-if="scope.row.whetherOpenMsm ===1">是</el-tag>
                  <el-tag size="medium" type="danger" v-if="scope.row.whetherOpenMsm === 0">否</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="操作" width="220">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="handleCheck(scope.$index, scope.row)">查看</el-button>
                <el-button size="mini" type="success" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-main>
      <el-footer height="30px">
        <el-row style="margin-top: 2%;">
          <el-col :span="24" :offset="8">
            <template>
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 30]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
              </el-pagination>
            </template>
          </el-col>
        </el-row>
      </el-footer>
    </div>
  </div>

</template>


<script>
import {
  PostInstitutionList,
  PostInstitutionSave,
  PostInstitutionUpdate
} from '@/api/api.js'
import headerTop from '@/components/headTop.vue'
export default {
  components: {
    headerTop
  },
  data() {
    return {
      imageUrl: '',
      searchParams: {
        selectInstitutionName: '',
        selectInstitutionCode: '',
        selectIsAppShow: '',
        selectIsOpenMsm: ''
      }, //搜索时的数据
      currentPage: 1, //分页初始页码
      pagesize: 30, //分页初始显示条数
      tableData: [], //列表数据
      selectTable: {}, //查看单个数据
      editTable: {}, //修改单个数据
      editTableRoot: {},
      addTable: {
        //新增单个数据
        bannerExtensionUrl: '',
        bannerLogo: '1',
        createUser: '1',
        extensionImageUrl: '1',
        extensionLogoUrl: '1',
        institutionAddr: '1',
        institutionCode: 'gty',
        institutionDesc: '1',
        institutionExtensionUrl: '1',
        institutionGradeId: '1',
        institutionId: '1',
        institutionLavelId: '3',
        institutionName: '1',
        medicalExamReportLogo: '1',
        qrCodeUrl: '1',
        registeredReservationAddr: '1',
        status: 0,
        updateUser: '1',
        whetherAppShow: 1,
        whetherDelete: 1,
        whetherHasPdfReport: 1,
        whetherOpenMsm: 1
      }, //新增单个数据
      dialogCheckVisible: false, //查看
      dialogEditVisible: false, //修改
      dialogAddVisible: false, //新增
      inde: null, //index flag
      formLabelWidth: '120px',
      formLabelWidth150: '150px'
    }
  },
  // watch:{
  //     searchParams: {
  //       deep: true,
  //       handler () {
  //       let params = {
  //       selectInstitutionName: this.searchParams.selectInstitutionName,
  //       selectInstitutionCode: this.searchParams.selectInstitutionCode,
  //       selectIsAppShow: this.searchParams.selectIsAppShow,
  //       selectIsOpenMsm: this.searchParams.selectIsOpenMsm,
  //       institutionGradeId: '',
  //       institutionLavelId: '',
  //       parentId: '',
  //       currentPage: 1,
  //       pageSize: 1000
  //     }
  //     PostInstitutionList(params).then(response => {
  //       this.tableData = []
  //       this.tableData = response.data.list
  //       this.totalCount = response.data.totalCount
  //     })
  //       }
  //     }
  // },
  methods: {
    doSearche() {
      let params = {
        selectInstitutionName: this.searchParams.selectInstitutionName,
        selectInstitutionCode: this.searchParams.selectInstitutionCode,
        selectIsAppShow: this.searchParams.selectIsAppShow,
        selectIsOpenMsm: this.searchParams.selectIsOpenMsm,
        institutionGradeId: '',
        institutionLavelId: '',
        parentId: '',
        currentPage: 1,
        pageSize: 1000
      }
      PostInstitutionList(params).then(response => {
        this.tableData = []
        this.tableData = response.data.list
        this.totalCount = response.data.totalCount
      })
    },
    handleReset() {
      //清空按钮
      this.searchParams.selectInstitutionName = ''
      this.searchParams.selectInstitutionCode = ''
      this.searchParams.selectIsAppShow = ''
      this.searchParams.selectIsOpenMsm = ''
      this.getList()
      return false
    },
    //上传
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },

    // tab点击事件
    handleClick(tab, event) {
      console.log(tab, event)
      console.log(this.addTable)
    },
    handleSizeChange: function(size) {
      this.pagesize = size
      console.log(`每页 ${size} 条`)
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage
      console.log(`当前页: ${currentPage}`)
    },

    // 新增
    handleAdd() {
      this.dialogAddVisible = true
    },
    // 确定新增
    _doAdd() {
      let params = {
        institutionId: '5555',
        bannerExtensionUrl: this.addTable.bannerExtensionUrl,
        bannerLogo: this.addTable.bannerLogo,
        createUser: this.addTable.createUser,
        extensionImageUrl: this.addTable.extensionImageUrl,
        extensionLogoUrl: this.addTable.extensionLogoUrl,
        institutionAddr: this.addTable.institutionAddr,
        institutionCode: this.addTable.institutionCode,
        institutionDesc: this.addTable.institutionDesc,
        institutionExtensionUrl: this.addTable.institutionExtensionUrl,
        institutionGradeId: this.addTable.institutionGradeId,
        institutionLavelId: this.addTable.institutionLavelId,
        institutionName: this.addTable.institutionName,
        medicalExamReportLogo: this.addTable.medicalExamReportLogo,
        qrCodeUrl: this.addTable.qrCodeUrl,
        registeredReservationAddr: this.addTable.registeredReservationAddr,
        status: this.addTable.status,
        timespan: this.addTable.timespan,
        updateUser: this.addTable.updateUser,
        whetherAppShow: this.addTable.whetherAppShow,
        whetherDelete: this.addTable.whetherDelete,
        whetherHasPdfReport: this.addTable.whetherHasPdfReport,
        whetherOpenMsm: this.addTable.whetherOpenMsm
        // "bannerExtensionUrl": "",
        // "bannerLogo": "1",
        // "createUser": "1",
        // "extensionImageUrl": "1",
        // "extensionLogoUrl": "1",
        // "institutionAddr": "1",
        // "institutionCode": "1111111",
        // "institutionDesc": "1",
        // "institutionExtensionUrl": "1",
        // "institutionGradeId": "1",
        // "institutionId": "1",
        // "institutionLavelId": "1",
        // "institutionName": "1",
        // "medicalExamReportLogo": "1",
        // "qrCodeUrl": "1",
        // "registeredReservationAddr": "1",
        // "status": 0,
        // "timespan": "1",
        // "updateUser": "1",
        // "whetherAppShow": 1,
        // "whetherDelete": 1,
        // "whetherHasPdfReport": 1,
        // "whetherOpenMsm": 1
      }
      console.log(params)
      PostInstitutionSave(params).then(response => {
        if (response.code == 1) {
          this.$alert('新增成功!')
          this.getList()
        } else {
          this.$alert(response.msg)
        }
      })
      this.addTable = {
        bannerExtensionUrl: '',
        bannerLogo: '1',
        createUser: '1',
        extensionImageUrl: '1',
        extensionLogoUrl: '1',
        institutionAddr: '1',
        institutionCode: '1111111',
        institutionDesc: '1',
        institutionExtensionUrl: '1',
        institutionGradeId: '1',
        institutionId: '1',
        institutionLavelId: '1',
        institutionName: '1',
        medicalExamReportLogo: '1',
        qrCodeUrl: '1',
        registeredReservationAddr: '1',
        status: 0,
        updateUser: '1',
        whetherAppShow: 1,
        whetherDelete: 1,
        whetherHasPdfReport: 1,
        whetherOpenMsm: 1
      }
      this.dialogAddVisible = false
    },
    //取消新增
    _doAddCancel() {
      this.addTable = {
        //重置新增数据为空
        institutionId: '2c8080aa6464825a016464825a000000',
        institutionCode: '',
        institutionName: '',
        institutionAddr: '',
        institutionGradeId: '1',
        institutionLavelId: '3',
        institutionExtensionUrl: null,
        qrCodeUrl: null,
        extensionLogoUrl: null,
        extensionImageUrl: null,
        whetherAppShow: 1,
        whetherOpenMsm: 0,
        whetherHasPdfReport: 0,
        medicalExamReportLogo: null,
        bannerLogo: null,
        bannerExtensionUrl: null,
        institutionDesc: null,
        whetherDelete: 0,
        createTime: '2018-07-04 16:57:01',
        lastUpdateTime: null,
        createUser: '1',
        updateUser: null,
        registeredReservationAddr: null,
        gradeName: '公立',
        lavelName: '三级医院'
      }
      this.dialogAddVisible = false
      this.$message({
        type: 'warning',
        message: '取消新增'
      })
    },
    // 查看
    handleCheck(index, row) {
      this.selectTable = row
      this.dialogCheckVisible = true
    },
    // 修改
    handleEdit(index, row) {
      this.inde = index + (this.currentPage - 1) * this.pagesize //计算分页后列表下标
      this.editTableRoot = JSON.parse(JSON.stringify(row)) //深拷贝出原始数据
      this.editTable = row //复制单列数据
      this.dialogEditVisible = true
    },
    //确定修改
    _doHandleEdit() {
      console.log(this.editTable)
      let params = {
        bannerExtensionUrl: this.editTable.bannerExtensionUrl,
        bannerLogo: this.editTable.bannerLogo,
        createUser: this.editTable.createUser,
        extensionImageUrl: this.editTable.extensionImageUrl,
        extensionLogoUrl: this.editTable.extensionLogoUrl,
        institutionAddr: this.editTable.institutionAddr,
        institutionCode: this.editTable.institutionCode,
        institutionDesc: this.editTable.institutionDesc,
        institutionExtensionUrl: this.editTable.institutionExtensionUrl,
        institutionGradeId: this.editTable.institutionGradeId,
        institutionId: this.editTable.institutionId,
        institutionLavelId: this.editTable.institutionLavelId,
        institutionName: this.editTable.institutionName,
        medicalExamReportLogo: this.editTable.medicalExamReportLogo,
        qrCodeUrl: this.editTable.qrCodeUrl,
        registeredReservationAddr: this.editTable.registeredReservationAddr,
        status: this.editTable.status,
        timespan: this.editTable.timespan,
        updateUser: this.editTable.updateUser,
        whetherAppShow: this.editTable.whetherAppShow,
        whetherDelete: this.editTable.whetherDelete,
        whetherHasPdfReport: this.editTable.whetherHasPdfReport,
        whetherOpenMsm: this.editTable.whetherOpenMsm
      }
      PostInstitutionUpdate(params).then(response => {
        if (response.code == 1) {
          this.$alert('修改成功!')
          this.getList()
        } else {
          this.$alert(response.msg)
        }
      })
      this.dialogEditVisible = false
      this.$message({
        type: 'success',
        message: '修改成功!'
      })
    },
    //取消修改
    _doCancel() {
      this.tableData.splice(this.inde, 1, this.editTableRoot) //删除修改的数据并替换为原始数据
      this.dialogEditVisible = false
      this.$message({
        type: 'warning',
        message: '取消修改'
      })
    },
    //获取用户列表
    getList() {
      let params = {
        selectInstitutionName: '',
        selectInstitutionCode: '',
        selectIsAppShow: '',
        selectIsOpenMsm: '',
        institutionGradeId: '',
        institutionLavelId: '',
        parentId: '',
        currentPage: 1,
        pageSize: 1000
      }
      PostInstitutionList(params).then(response => {
        this.tableData = []
        this.tableData = response.data.list
        this.totalCount = response.data.totalCount
      })
    }
  },
  created: function() {
    this.getList()
  }
}
</script>

<style  lang="less">
// 上传样式
.avatar-uploader {
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &:hover {
      border-color: #409eff;
    }
  }
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 130px;
  height: 130px;
  line-height: 130px;
  text-align: center;
}
.avatar {
  width: 130px;
  height: 130px;
  display: block;
}
</style>

<style lang="less" scoped>
.minwidth {
  min-width: 150px;
}
.minwidthB {
  min-width: 250px;
}
.el-select {
  display: block;
}
.el-input {
  margin-bottom: 15px;
}
.el-form {
  margin-top: 15px;
}

/*查看选中项*/
.messageTitle {
  padding: 5px 5px;
  border-bottom: 1px solid #c9c9c9;
  font-size: 17px;
  font-weight: 600;
}
.messageTitle p {
  margin-left: 20px;
  display: flex;
}
.messageMain {
  padding: 5px;
}
.messageBody {
  margin-top: 20px;
}
.messageBody li {
  margin-bottom: 5px;
}
.messageBody .messageli {
  display: flex;
  padding: 0 40px 0 80px;
  overflow: hidden;
}
.messageBody span {
  font-size: 14px;
  height: 32px;
  line-height: 32px;
}
.fl {
  float: left;
}
.fr {
  float: right;
  text-align: left;
}
.msgfr {
  flex: 1;
}
.msgfl {
  flex: 1;
}
.ml20 {
  margin-left: 10px;
}
.cir-style {
  background: #f60;
  /*width: 30px;*/
  height: 20px;
  line-height: 20px;
  padding: 5px 20px;
  border-radius: 15px;
  font-weight: 400;
  color: #fff;
}
.cir-bstyle {
  background: #3c8dbc;
  /*width: 30px;*/
  height: 20px;
  line-height: 20px;
  padding: 5px 20px;
  border-radius: 15px;
  font-weight: 400;
  color: #fff;
}
.reStyle {
  text-align: center;
  margin: 30px;
}
.img-style {
  width: 200px;
  height: 200px;
  box-sizing: content-box;
  vertical-align: top;
}
.el-upload__tip {
  width: calc(100% - 150px);
  float: right;
  font-size: 12px;
  line-height: 20px;
  display: inline-block;
  margin-top: 20px;
  margin-right: 10px;
}
</style>
