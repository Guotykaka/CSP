<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <!-- 一元听商品管理页面 -->
      <el-header height="30">
        <!-- 操作行-->
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input v-model="searchParams.voiceProductName" placeholder="商品名称" clearable></el-input>
          </el-col>
          <el-col :span="6">
            <el-select v-model="searchParams.voiceProductCode" clearable placeholder="商品编号">
              <el-option v-for="item in searchParamsList" :key="item.voiceProductCode" :label="item.voiceProductCode" :value="item.voiceProductCode">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="doSearch()">搜索</el-button>
          </el-col>
        </el-row>
        <!--一元听新增按钮-->
        <el-row class="m_b_15">
          <el-button type="primary" @click="handleAdd_YYT()">新增</el-button>
        </el-row>

      </el-header>

      <el-main>
        <el-table :data="tableData_YYT.slice((currentPage-1)*pagesize,currentPage*pagesize)" border style="width: 100%" id="app">
          <el-table-column show-overflow-tooltip align="center" type="index"></el-table-column>
          <el-table-column show-overflow-tooltip align="center" prop="voiceProductCode" label="商品编号"></el-table-column>
          <!-- <el-table-column show-overflow-tooltip align="center" prop="firstType" label="商品一级分类"></el-table-column> -->
          <!-- <el-table-column show-overflow-tooltip align="center" prop="secondType" label="商品二级分类"></el-table-column> -->
          <el-table-column show-overflow-tooltip align="center" prop="voiceProductName" label="商品名称"></el-table-column>
          <el-table-column show-overflow-tooltip align="center" prop="paperWork" label="商品文案" min-width="100%"></el-table-column>
          <el-table-column align="center" label="商品状态" width="100">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium" type="success" v-if="scope.row.status === 2">下架</el-tag>
                <el-tag size="medium" type="danger" v-if="scope.row.status === 1">上架</el-tag>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column align="center" prop="YYTgoods" label="绑定商品"></el-table-column> -->
          <el-table-column align="center" label="建议价格">
            <template slot-scope="scope">
              <p>￥1</p>
              <!-- <p>￥{{ scope.row.goodsPrice}}</p> -->
            </template>
          </el-table-column>
          <!-- <el-table-column align="center" prop="createDate" label="音频" width="100">
            <template slot-scope="scope">
              <p>{{scope.row.voiceProductUrl}}</p>
              <div slot="reference" class="name-wrapper">
                  <el-tag size="medium" type="success">{{scope.row.voiceProductUrl}}</el-tag>
                  <el-tag size="medium" type="danger" v-if="scope.row.status  === 0">未添加</el-tag>
                </div>
            </template>
          </el-table-column> -->
          <el-table-column show-overflow-tooltip align="center" prop="createTime" label="创建时间"></el-table-column>
          <el-table-column align="center" label="操作" width="220">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" v-if="scope.row.status === 2" @click="FalseStatus_YYT(scope.$index, scope.row)">上架</el-button>
              <el-button size="mini" type="success" v-if="scope.row.status === 1" @click="TrueStatus_YYT(scope.$index, scope.row)">下架</el-button>
              <el-button size="mini" type="primary" @click="handleEdit_YYT(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="deleteMessage(scope.$index, scope.row)">删除</el-button>

            </template>
          </el-table-column>
        </el-table>
      </el-main>

      <el-footer height="30px">
        <el-row style="margin-top: 2%;">
          <el-col :span="24" :offset="6">
            <template>
              <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="tableData_YYT.length"> -->
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchParams.currentPage" :page-sizes="[10,20]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
              </el-pagination>
            </template>
          </el-col>
        </el-row>
      </el-footer>

      <!-- 一元听编辑弹窗 -->
      <el-dialog title="编辑" :visible.sync="dialogEditVisible_YYT" width=40% :before-close="handleCloseEidt">

        <el-form :model="editTable_YYT">
          <el-form-item class="is-required2" label="商品名称" :label-width="formLabelWidth2">
            <el-col :span="16">
              <el-input v-model="editTable_YYT.voiceProductName" prop auto-complete="off" el readonly></el-input>
            </el-col>
          </el-form-item>
          <el-form-item class="is-required2" label="绑定医生" :label-width="formLabelWidth2">
            <template slot-scope="scope">
              <el-col :span="16">
                <el-select v-model="editTable_YYT.insDoctorId" clearable placeholder="请绑定医生">
                  <el-option v-for="item in Doclist" :key="item.insDoctorId" :label="item.name" :value="item.insDoctorId">
                  </el-option>
                </el-select>
              </el-col>
            </template>
          </el-form-item>
          <el-form-item class="is-required2" label="商品文件" :label-width="formLabelWidth2">
            <el-col :span="8">
              <el-form-item v-show="false" v-model="upyunUrl">
                <input id="fileSelect" name="fileSelect" @change="update()" ref="inputer" type="file" />
                <audio v-bind:src="upyunUrl" controls="controls" id="audio_duration" ref="audior">{{upyunUrl}}</audio>
              </el-form-item>
              <el-form-item>
                <el-button size="small" type="success" @click="OpenfileSelect()">选择文件</el-button>
                <el-button size="small" type="primary" @click="fileupdate()" class="m_l_0">确定上传</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <div>
              <span v-show="upyunUrl==''" class="el-icon-warning" style="color:#E6A23C">已上传</span>
              <span v-show="upyunUrl!=''" class="el-icon-success" style="color:#67C23A">已上传</span>
                {{fileName}}
              </div>
            </el-col>
          </el-form-item>
          <el-form-item class="is-required2" label="异常指标关键词" :label-width="formLabelWidth2">
            <el-col :span="16">
              <el-input v-model="editTable_YYT.abnormalKeyWord "></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="相关指标" :label-width="formLabelWidth2">
            <el-col :span="16">
              <el-input v-model="editTable_YYT.relevantContent"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item class="is-required2" label="商品文案" :label-width="formLabelWidth2">
            <el-col :span="16">
              <el-input type="textarea" maxlength="50" resize="none" :rows="5" v-model="editTable_YYT.paperWork"></el-input>
            </el-col>
            <el-col :span="4" class="wordsnum">50字内</el-col>

          </el-form-item>
        </el-form>
        <div class="btn-row">
          <el-button size="small" type="primary" @click="_doHandleEdit_YYT()">保存</el-button>
          <el-button size="small" type="primary" @click="_doCancel_YYT()">取消</el-button>
        </div>
      </el-dialog>

      <!-- 一元听新增弹窗 -->
      <el-dialog title="新增" :visible.sync="dialogAddVisible_YYT" width=40% :before-close="handleCloseAdd">
        <el-form :model="addTable_YYT" :rules="rulesNew" ref="formNew">
          <el-form-item class="is-required2" label="商品名称" :label-width="formLabelWidth2" prop="voiceProductName">
            <el-col :span="16">
              <el-input v-model="addTable_YYT.voiceProductName" prop auto-complete="off" el></el-input>
            </el-col>
          </el-form-item>
          <el-form-item class="is-required2" label="绑定医生" :label-width="formLabelWidth2" prop="insDoctorId">
            <template slot-scope="scope">
              <el-col :span="16">
                <el-select v-model="addTable_YYT.insDoctorId" clearable placeholder="请绑定医生">
                  <el-option v-for="item in Doclist" :key="item.insDoctorId" :label="item.name" :value="item.insDoctorId">
                  </el-option>
                  <!-- <el-select v-model="editTable_YYT.insDoctorId" clearable placeholder="请绑定医生">
                  <el-option v-for="item in Doclist" :key="item.insDoctorId" :label="item.name" :value="item.insDoctorId">{{item.name}}
                  </el-option> -->
                </el-select>
              </el-col>
            </template>
          </el-form-item>
          <el-form-item class="is-required2" label="商品文件" :label-width="formLabelWidth2">
            <el-col :span="8">
              <el-form-item v-show="false" v-model="upyunUrl">
                <input id="fileSelect" name="fileSelect" @change="update()" ref="inputer" type="file" />
                <audio v-bind:src="upyunUrl" controls="controls" id="audio_duration" ref="audior">{{upyunUrl}}</audio>
              </el-form-item>
              <el-form-item>
                <el-button size="small" type="success" @click="OpenfileSelect()">选择文件</el-button>
                <el-button size="small" type="primary" @click="fileupdate()" class="m_l_0">确定上传</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <div>
              <span v-show="upyunUrl==''" class="el-icon-warning" style="color:#F56C6C">未上传</span>
              <span v-show="upyunUrl!=''" class="el-icon-success" style="color:#67C23A">已上传</span>
              {{fileName}}
              </div>
              
            </el-col>
          </el-form-item>
          <el-form-item class="is-required2" label="异常指标关键词" :label-width="formLabelWidth2" prop="abnormalKeyWord">
            <el-col :span="16">
              <el-input v-model="addTable_YYT.abnormalKeyWord "></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="相关指标" :label-width="formLabelWidth2">
            <el-col :span="16">
              <el-input v-model="addTable_YYT.relevantContent"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item class="is-required2" label="商品文案" :label-width="formLabelWidth2" prop="paperWork">
            <el-col :span="16">
              <el-input type="textarea" maxlength="50" resize="none" :rows="5" v-model="addTable_YYT.paperWork"></el-input>
            </el-col>
            <el-col :span="4" class="wordsnum">50字内</el-col>

          </el-form-item>
        </el-form>

        <!-- <div slot="footer" class="dialog-footer">
          <el-button type="warning" @click="_doAddCancel_YYT()">取消</el-button>
          <el-button type="primary" @click="submitForm('formNew')">保存</el-button>
        </div> -->
        <div class="btn-row">
          <el-button size="small" type="primary" @click="submitForm('formNew')">保存</el-button>
          <el-button size="small" type="primary" @click="_doAddCancel_YYT()">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>

</template>

<script>
import { b64hamcsha1, HexMD5, MD5 } from '@/api/hash'
import {
  GetListenList,
  PostListenUpdate,
  PostListenStatus,
  PostListenSave,
  PostListenDoc
} from '@/api/api.js'
import headerTop from '@/components/headTop.vue'
export default {
  components: {
    headerTop
  },
  data() {
    return {
      title: '提示', //this.$alert的标题
      upyunUrl1: '', //又拍云url
      upyunUrl: '', //又拍云url
      AudioDuration: null, //音频时长
      totalCount: 0,
      fileName: '',
      fileNameEdit: '',
      searchParams: {
        currentPage: 1,
        pageSize: 10,
        voiceProductCode: '',
        voiceProductName: ''
      },
      searchParamsList: [], //商品编码列表
      fileList: [],
      dialogVisible: true,
      Doclist: [],
      currentPage: 1, //分页初始页码
      pagesize: 10, //分页初始显示条数
      tableData_YYT: [], //一元厅列表数据
      editTable_YYT: {}, //编辑一元厅单个数据
      editTableRoot_YYT: {},
      addTable_YYT: {
        abnormalKeyWord: '',
        insDoctorId: '',
        paperWork: '',
        relevantContent: '',
        status: 2,
        voiceCategory: '',
        voiceLabel: '',
        voiceProductName: '',
        voiceProductUrl: '',
        voiceTime: 0
      }, //一元听新增单个数据
      dialogEditVisible_YYT: false, //一元厅编辑
      dialogAddVisible_YYT: false, //一元厅新增
      GoodsManVisible: false, //一元厅商品管理
      inde_YYT: null, //一元厅index flag
      formLabelWidth: '120px',
      formLabelWidth2: '170px',
      rulesNew: {
        voiceProductName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { max: 10, message: '10字内' }
        ],
        insDoctorId: [
          { required: true, message: '请选择绑定医生', trigger: 'change' }
        ],
        upyunUrl: [{ required: true, message: '请选择文件' }],
        abnormalKeyWord: [
          { required: true, message: '请填写异常指标关键词', trigger: 'blur' },
          { max: 50, message: '50字内' }
        ],
        paperWork: [
          { required: true, message: '请输入商品文案', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //搜索方法
    doSearch() {
      this.searchParams.currentPage = 1
      this.getList()
    },
    handleSizeChange: function(size) {
      this.searchParams.pageSize = size
      this.getList()
    },
    handleCurrentChange: function(currentPage) {
      this.searchParams.currentPage = currentPage
      this.getList()
    },

    // 删除提示
    deleteMessage(index, row) {
      if (row.status === 1) {
        this.$alert('请先将商品下架！', this.title)
      } else {
        this.$confirm('此操作将删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
          .then(() => {
            let params = {
              status: '3',
              voiceProductId: row.voiceProductId
            }
            PostListenStatus(params).then(response => {
              if (response.code == 1) {
                this.$alert('删除成功!', this.title)
                this.getList()
              } else {
                $alert(response.msg)
                this.getList()
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'warning',
              message: '已取消删除'
            })
          })
      }
    },

    // 一元厅下架
    TrueStatus_YYT(index, row) {
      this.$confirm('确定下架?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          let params = {
            status: '2',
            voiceProductId: row.voiceProductId
          }
          PostListenStatus(params).then(response => {
            if (response.code == 1) {
              this.$alert('已下架!', this.title)
              this.getList()
            } else {
              $alert(response.msg)
              this.getList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'warning ',
            message: '已取消更改'
          })
        })
    },
    // 一元厅上架
    FalseStatus_YYT(index, row) {
      this.$confirm('确定上架?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          let params = {
            status: '1',
            voiceProductId: row.voiceProductId
          }
          PostListenStatus(params).then(response => {
            if (response.code == 1) {
              this.$alert('已上架!', this.title)
              this.getList()
            } else {
              $alert(response.msg)
              this.getList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'warning ',
            message: '已取消更改'
          })
        })
    },
    // 一元厅编辑
    handleEdit_YYT(index, row) {
      this.inde_YYT = index + (this.currentPage - 1) * this.pagesize //计算分页后列表下标
      this.editTableRoot_YYT = JSON.parse(JSON.stringify(row)) //深拷贝出原始数据
      this.editTable_YYT = row //复制单列数据
      this.dialogEditVisible_YYT = true
    },
    OpenfileSelect() {
      //隐藏input框 点击按钮触发input的点击事件
      let myfile = this.$refs.inputer
      myfile.click()
    },
    // 一元厅取消编辑
    _doCancel_YYT() {
      this.handleCloseEidt()
      this.getList()
      this.$message({
        type: 'warning',
        message: '取消编辑'
      })
    },

    // 一元厅确定编辑
    _doHandleEdit_YYT() {
      let sstime = this.AudioDuration
      if (sstime == null) {
        this.AudioDuration = this.editTable_YYT.voiceTime
      } else {
        console.log(sstime, '3')
      }
      console.log(this.AudioDuration, 'last')

      let voiceProductUrl = ''
      if (this.upyunUrl == '') {
        voiceProductUrl = this.editTable_YYT.voiceProductUrl
        // console.log(this.upyunUrl)
      } else {
        voiceProductUrl = this.upyunUrl
      }
      let params = {
        abnormalKeyWord: this.editTable_YYT.abnormalKeyWord,
        insDoctorId: this.editTable_YYT.insDoctorId,
        paperWork: this.editTable_YYT.paperWork,
        relevantContent: this.editTable_YYT.relevantContent,
        voiceCategory: this.editTable_YYT.voiceCategory,
        voiceLabel: this.editTable_YYT.voiceLabel,
        voiceProductId: this.editTable_YYT.voiceProductId,
        voiceProductUrl: voiceProductUrl,
        voiceTime: this.AudioDuration
      }
      PostListenUpdate(params).then(response => {
        this.$alert(response.msg, this.title)
        this.getList()
      })

      this.handleCloseEidt()
    },
    handleCloseEidt() {
      //编辑弹窗重置数据
      console.log('beforclose')
      this.upyunUrl = ''
      this.fileName = ''
      this.AudioDuration = null
      this.dialogEditVisible_YYT = false
    },
    handleCloseAdd() {
      //新增弹窗重置数据
      console.log('beforclose')
      this.resetForm('formNew')
      this.addTable_YYT = {
        abnormalKeyWord: '',
        insDoctorId: '',
        paperWork: '',
        relevantContent: '',
        status: 2,
        voiceCategory: '',
        voiceLabel: '',
        voiceProductName: '',
        voiceProductUrl: '',
        voiceTime: 0
      }
      this.upyunUrl = ''
      this.fileName = ''
      this.AudioDuration = null
      this.dialogAddVisible_YYT = false
    },
    // 一元厅新增
    handleAdd_YYT() {
      this.dialogAddVisible_YYT = true
    },
    // 一元厅确定新增
    _doAdd_YYT() {
      let params = {
        abnormalKeyWord: this.addTable_YYT.abnormalKeyWord,
        insDoctorId: this.addTable_YYT.insDoctorId,
        paperWork: this.addTable_YYT.paperWork,
        relevantContent: this.addTable_YYT.relevantContent,
        voiceCategory: this.addTable_YYT.voiceCategory,
        voiceLabel: this.addTable_YYT.voiceLabel,
        voiceProductId: this.addTable_YYT.voiceProductId,
        voiceProductUrl: this.upyunUrl,
        voiceTime: this.AudioDuration,
        status: 2,
        voiceProductName: this.addTable_YYT.voiceProductName
      }
      PostListenSave(params).then(response => {
        if (response.code == 1) {
          console.log(this.addTable_YYT.name)
          this.$alert(response.msg, this.title)
          this.getList()
        } else {
          this.$alert(response.msg, this.title)
          this.getList()
        }
      })
      this.handleCloseAdd()
    },
    submitForm(formName) {
      //新增模块表单验证
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.upyunUrl) {
            this._doAdd_YYT()
          } else {
            this.$alert('请上传商品文件!', this.title)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 一元厅取消新增
    _doAddCancel_YYT() {
      this.handleCloseAdd()
      this.getList()
      this.$message({
        type: 'warning',
        message: '取消新增'
      })
    },
    //获取绑定医生列表
    getDocList() {
      let params = {}
      PostListenDoc(params).then(response => {
        this.Doclist = []
        this.Doclist = response.data.data
        console.log(this.Doclist, '6666666')
      })
    },
    //获取一元听列表
    getList() {
      let params = {
        currentPage: this.searchParams.currentPage,
        pageSize: this.searchParams.pageSize,
        voiceProductCode: this.searchParams.voiceProductCode,
        voiceProductName: this.searchParams.voiceProductName
      }
      GetListenList(params).then(response => {
        this.tableData_YYT = []
        this.tableData_YYT = response.data.list
        this.totalCount = response.data.totalCount
      })
      //获取商品编号列表
      let paramsList = {
        currentPage: 1,
        pageSize: 100000,
        voiceProductCode: '',
        voiceProductName: ''
      }
      GetListenList(paramsList).then(response => {
        this.searchParamsList = response.data.list
      })
    },
    update() {
      //上传音频
      let inputDOM = this.$refs.inputer
      // 通过DOM取文件数据
      this.file = inputDOM.files[0]
      if (inputDOM.files[0] === undefined) {
        this.fileName = ''
        this.fileSize = ''
        this.fileType = ''
      } else {
        this.fileName = this.file.name
        //kb
        if (this.file.size / 1024 < 1000) {
          this.fileSize = (this.file.size / 1024).toFixed(2) + 'kb'
        } else if (this.file.size / 1024 > 1000) {
          this.fileSize = (this.file.size / 1024 / 1024).toFixed(2) + 'MB'
        }
        this.fileType = this.file.type
      }
      console.log(this.fileName)
      inputDOM.files[0].value = ''
    },
    //上传按钮的事件axios
    fileupdate() {
      let inputDOM = this.$refs.inputer
      let date = Date.parse(new Date())
      // 通过DOM取文件数据
      var bucketname = 'zhangshangtijian' //服务名
      var username = 'hztest' //操作员账号
      var password = 'a1234567' //操作员密码
      var save_key = '/csp/audio/{year}{mon}{day}/' + date + '{.suffix}'
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
      var url = 'http://v0.api.upyun.com/' + bucketname
      var file = inputDOM.files[0]
      var formData = new FormData()
      formData.append('file', file)
      formData.append('policy', policy)
      formData.append('authorization', signature)

      this.$http.post(url, formData).then(response => {
        if ((response.code = 200)) {
          this.upyunUrl =
            'http://zhangshangtijian.b0.upaiyun.com' + response.data.url //返回地址
          console.log(this.upyunUrl, 'this.upyunUrl上传')
          this.$alert('上传成功', this.title)
        } else {
          this.$alert(response.msg, this.title)
        }
      })
      //获取语音时长
      let myVid = this.$refs.audior
      let this_ = this
      if (myVid != null) {
        var duration
        myVid.load()
        myVid.oncanplay = function() {
          this_.AudioDuration = myVid.duration
          console.log('this_.AudioDuration', this_.AudioDuration)
        }
      }
    }
  },
  activated: function() {
    this.getList()
    this.getDocList()
  }
}
</script>

<style lang="less" scoped>
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
.m_l_0 {
  margin-left: 0;
}
.btn-row {
  text-align: center;
  padding-top: 20px;
}
.el-header,
.el-main,
.el-footer {
  padding: 0;
}
</style>
<style lang="less">
.el-form-item {
  &.is-required2 {
    .el-form-item__label {
      &:after {
        content: '*';
        color: #f56c6c;
        margin-left: 4px;
      }
    }
  }
}
</style>

